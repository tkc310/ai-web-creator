#!/usr/bin/env node
// 記事の Markdown から、Worker が SSR に使う JSON を作る。HTML のページは作らない。
//
// 出力（dist/ は Workers Static Assets としてそのまま公開する）:
//   dist/data/posts/<slug>.json   記事1本の詳細（本文の HTML を含む）
//   dist/data/index/<key>.json    一覧の分割（既定は年ごと。1つが maxPerShard を超えたら月ごと）
//   dist/data/search/<key>.json   検索用の小さな索引（一覧と同じ分け方）
//   dist/data/tags/<tag>.json     タグごとの一覧
//   dist/data/latest.json         トップページ用の新着
//   dist/data/shards.json         分割の目録（Worker はまずこれを読む）
//   dist/manifest.json            ハッシュの一覧。前回と比べて、変わった所だけをパージする
//   dist/sitemap.xml, robots.txt, llms.txt
//   static/ の中身（favicon.svg など。文字のファイルだけ）
//
// 速くするための仕組み:
//   - 記事ごとに「原稿＋変換処理」のハッシュを取り、.cache/posts/ に変換結果を残す。
//     ハッシュが同じ記事は Markdown の変換を飛ばす
//   - 出力ファイルは中身が変わったときだけ書き換える
//   - 前回の manifest と比べて、何も変わっていなければ changed=false を出し、CI は公開を飛ばす
//
// 環境変数:
//   CONTENT_DIR       記事のフォルダ（既定: content/posts）
//   OUT_DIR           出力先（既定: dist）
//   CACHE_DIR         変換結果の保存先（既定: .cache）
//   BUILD_NOW         「今」とみなす時刻（ISO 8601）。予約投稿の確認に使う
//   PREV_MANIFEST_URL .cache に前回の manifest がないときに読む、公開中の manifest.json の URL
//   GITHUB_OUTPUT     GitHub Actions の出力ファイル（changed、purge_everything を書く）

import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Marked } from "marked";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT_DIR = path.resolve(ROOT, process.env.CONTENT_DIR ?? "content/posts");
const OUT_DIR = path.resolve(ROOT, process.env.OUT_DIR ?? "dist");
const CACHE_DIR = path.resolve(ROOT, process.env.CACHE_DIR ?? ".cache");
const NOW = process.env.BUILD_NOW ? new Date(process.env.BUILD_NOW) : new Date();

const started = performance.now();
const config = JSON.parse(await readFile(path.join(ROOT, "site.config.json"), "utf8"));

// 変換処理のハッシュ。このファイルか marked の版が変わったら、全記事を変換し直す
const markedPkg = JSON.parse(await readFile(path.join(ROOT, "node_modules/marked/package.json"), "utf8"));
const RENDERER_HASH = sha(await readFile(fileURLToPath(import.meta.url), "utf8"), markedPkg.version).slice(0, 16);

// 見た目のハッシュ。Worker のコードか設定が変わったら、SSR のキャッシュを全部パージする
const TEMPLATE_HASH = sha(
  ...(await readTree(path.join(ROOT, "src"))),
  await readFile(path.join(ROOT, "site.config.json"), "utf8"),
  await readFile(path.join(ROOT, "wrangler.jsonc"), "utf8"),
).slice(0, 16);

// 原稿の HTML は通さない（書き手の権限で script を入れられないようにする）
const marked = new Marked({ gfm: true });
marked.use({
  renderer: {
    html: () => "",
    image({ href, title, text }) {
      // R2 の画像は /img/ で配る。外部の画像は使わない
      if (!href.startsWith("/img/")) throw new Error(`画像は /img/ から始まるパスにしてください: ${href}`);
      const t = title ? ` title="${esc(title)}"` : "";
      return `<img src="${esc(href)}" alt="${esc(text)}"${t} loading="lazy" decoding="async">`;
    },
  },
});

// ---------------------------------------------------------------- 記事を読む

const files = (await listFiles(CONTENT_DIR)).filter((f) => f.endsWith(".md")).sort();
await mkdir(path.join(CACHE_DIR, "posts"), { recursive: true });

const stats = { files: files.length, rendered: 0, reused: 0, written: 0, unchanged: 0, removed: 0 };
const errors = [];
const all = [];

await Promise.all(
  files.map(async (file) => {
    const rel = path.relative(CONTENT_DIR, file);
    const raw = await readFile(file, "utf8");
    const hash = sha(RENDERER_HASH, raw).slice(0, 16);
    const cacheFile = path.join(CACHE_DIR, "posts", `${hash}.json`);
    if (existsSync(cacheFile)) {
      all.push(JSON.parse(await readFile(cacheFile, "utf8")));
      stats.reused++;
      return;
    }
    try {
      const post = parsePost(rel, raw, hash);
      await writeFile(cacheFile, JSON.stringify(post));
      all.push(post);
      stats.rendered++;
    } catch (e) {
      errors.push(`${rel}: ${e.message}`);
    }
  }),
);

const seen = new Map();
for (const p of all) {
  if (seen.has(p.slug)) errors.push(`${p.file}: slug「${p.slug}」が ${seen.get(p.slug)} と重複しています`);
  seen.set(p.slug, p.file);
}
if (errors.length) {
  console.error("記事にエラーがあります。直してから、もう一度ビルドしてください。");
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

const isPublished = (p) => !p.draft && new Date(p.publishAt ?? p.date) <= NOW;
const published = all.filter(isPublished).sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.slug < b.slug ? -1 : 1));
const scheduled = all.filter((p) => !p.draft && !isPublished(p)).sort((a, b) => (a.publishAt < b.publishAt ? -1 : 1));

// ---------------------------------------------------------------- 出力を組み立てる

const outputs = new Map(); // 出力パス → 文字列
const manifest = {
  schema: 1,
  templateHash: TEMPLATE_HASH,
  rendererHash: RENDERER_HASH,
  nextPublishAt: scheduled[0]?.publishAt ?? null,
  posts: {},
  shards: {},
};

for (const p of published) {
  const detail = {
    slug: p.slug,
    title: p.title,
    date: p.date,
    updated: p.updated,
    author: p.author,
    authorName: config.authors[p.author] ?? p.author,
    tags: p.tags.map((t) => ({ slug: t, name: config.tags[t] })),
    summary: p.summary,
    image: p.image,
    html: p.html,
  };
  outputs.set(`data/posts/${p.slug}.json`, JSON.stringify(detail));
  manifest.posts[p.slug] = p.hash;
}

const entry = (p) => ({
  slug: p.slug,
  title: p.title,
  date: p.date,
  tags: p.tags,
  summary: p.summary,
  image: p.image ? { src: p.image.src, alt: p.image.alt, width: p.image.width, height: p.image.height } : null,
});

// 一覧の分割。年ごとに分け、多すぎる年だけ月ごとに分ける
const byYear = groupBy(published, (p) => p.date.slice(0, 4));
const shardList = [];
for (const [year, posts] of byYear) {
  const groups = posts.length > config.shard.maxPerShard ? groupBy(posts, (p) => p.date.slice(0, 7)) : new Map([[year, posts]]);
  for (const [key, ps] of groups) {
    const index = JSON.stringify({ key, count: ps.length, posts: ps.map(entry) });
    const search = JSON.stringify(
      ps.map((p) => ({ s: p.slug, t: p.title, d: p.date, g: p.tags, x: p.text.slice(0, config.searchExcerptLength) })),
    );
    outputs.set(`data/index/${key}.json`, index);
    outputs.set(`data/search/${key}.json`, search);
    shardList.push({ key, year, count: ps.length, hash: sha(index).slice(0, 12), searchHash: sha(search).slice(0, 12) });
    manifest.shards[`index:${key}`] = sha(index).slice(0, 12);
    manifest.shards[`search:${key}`] = sha(search).slice(0, 12);
  }
}
shardList.sort((a, b) => (a.key < b.key ? 1 : -1));

const tagList = [];
for (const [tag, ps] of groupBy(published.flatMap((p) => p.tags.map((t) => [t, p])), ([t]) => t)) {
  const posts = ps.map(([, p]) => p);
  const base = { slug: tag, name: config.tags[tag], count: posts.length };
  // 記事が多いタグは、新しい maxPerShard 本だけを本体に入れ、残りは年ごとのファイルに分ける
  const split = posts.length > config.shard.maxPerShard;
  const years = split ? [...groupBy(posts, (p) => p.date.slice(0, 4))] : [];
  const json = JSON.stringify({
    ...base,
    posts: posts.slice(0, config.shard.maxPerShard).map(entry),
    ...(split ? { years: years.map(([year, yp]) => ({ year, count: yp.length })) } : {}),
  });
  outputs.set(`data/tags/${tag}.json`, json);
  manifest.shards[`tag:${tag}`] = sha(json).slice(0, 12);
  for (const [year, yp] of years) {
    const yjson = JSON.stringify({ ...base, year, count: yp.length, posts: yp.map(entry) });
    outputs.set(`data/tags/${tag}/${year}.json`, yjson);
    manifest.shards[`tag:${tag}:${year}`] = sha(yjson).slice(0, 12);
  }
  tagList.push({ slug: tag, name: config.tags[tag], count: posts.length });
}
tagList.sort((a, b) => b.count - a.count);

const latest = JSON.stringify({ count: Math.min(published.length, config.latestCount), posts: published.slice(0, config.latestCount).map(entry) });
outputs.set("data/latest.json", latest);
manifest.shards.latest = sha(latest).slice(0, 12);

// 目録にはハッシュを入れない（記事の追加で目録が変わる回数を減らし、パージを小さくする）
const shards = JSON.stringify({ total: published.length, shards: shardList.map(({ key, year, count }) => ({ key, year, count })), tags: tagList });
outputs.set("data/shards.json", shards);
manifest.shards.shards = sha(shards).slice(0, 12);

outputs.set("sitemap.xml", sitemap());
outputs.set("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${config.url}/sitemap.xml\n`);
outputs.set("llms.txt", llms());
// static/ のファイル（favicon など）はそのまま置く
for (const f of await listFiles(path.join(ROOT, "static"))) outputs.set(path.relative(path.join(ROOT, "static"), f), await readFile(f, "utf8"));
outputs.set("manifest.json", JSON.stringify(manifest, null, 1));

// ---------------------------------------------------------------- 書き出す（変わったものだけ）

await mkdir(OUT_DIR, { recursive: true });
const existing = new Set((await listFiles(OUT_DIR)).map((f) => path.relative(OUT_DIR, f)));
for (const [rel, body] of outputs) {
  const dest = path.join(OUT_DIR, rel);
  existing.delete(rel);
  if (existsSync(dest) && (await readFile(dest, "utf8")) === body) {
    stats.unchanged++;
    continue;
  }
  await mkdir(path.dirname(dest), { recursive: true });
  await writeFile(dest, body);
  stats.written++;
}
// 非公開に戻した記事や消した記事の JSON を消す（static/ からコピーしたものは残す）
for (const rel of existing) {
  if (rel.startsWith("data/")) {
    await rm(path.join(OUT_DIR, rel));
    stats.removed++;
  }
}

// ---------------------------------------------------------------- 前回との差分からパージの計画を作る

const prev = await loadPreviousManifest();
const plan = purgePlan(prev, manifest);
await writeFile(path.join(CACHE_DIR, "purge-plan.json"), JSON.stringify(plan, null, 1));
await writeFile(path.join(CACHE_DIR, "manifest.json"), JSON.stringify(manifest));
await writeFile(path.join(CACHE_DIR, "scheduled.json"), JSON.stringify(scheduled.map((p) => ({ slug: p.slug, publishAt: p.publishAt, file: p.file })), null, 1));

if (process.env.GITHUB_OUTPUT) {
  await writeFile(process.env.GITHUB_OUTPUT, `changed=${plan.changed}\npurge_everything=${plan.purgeEverything}\n`, { flag: "a" });
}

const summary = {
  ms: Math.round(performance.now() - started),
  ...stats,
  published: published.length,
  scheduled: scheduled.length,
  outputs: outputs.size,
  shards: shardList.length,
  changed: plan.changed,
  purgeEverything: plan.purgeEverything,
  purgeTags: plan.tags.length,
  warmPaths: plan.warm.length,
};
console.log(JSON.stringify(summary));

// ================================================================ ここから下は部品

function parsePost(rel, raw, hash) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) throw new Error("先頭に --- で囲んだ frontmatter がありません");
  const fm = parseFrontmatter(m[1]);
  const body = m[2];
  const need = ["title", "date"];
  for (const k of need) if (!fm[k]) throw new Error(`frontmatter に ${k} がありません`);
  const slug = fm.slug ?? path.basename(rel, ".md");
  if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) throw new Error(`slug は半角の英小文字・数字・ハイフンにしてください: ${slug}`);
  if (Number.isNaN(Date.parse(fm.date))) throw new Error(`date が日付になっていません: ${fm.date}`);
  if (fm.publishAt && Number.isNaN(Date.parse(fm.publishAt))) throw new Error(`publishAt が日時になっていません: ${fm.publishAt}`);
  const tags = fm.tags ?? [];
  for (const t of tags) if (!config.tags[t]) throw new Error(`タグ「${t}」は site.config.json の tags にありません`);
  const author = fm.author ?? "editor";
  let image = null;
  if (fm.image) {
    if (!fm.image.startsWith("/img/")) throw new Error(`image は /img/ から始まるパスにしてください: ${fm.image}`);
    const width = Number(fm.imageWidth);
    const height = Number(fm.imageHeight);
    if (!width || !height) throw new Error("image を使うときは imageWidth と imageHeight も書いてください（表示のずれを防ぐため）");
    image = { src: fm.image, alt: fm.imageAlt ?? "", width, height };
  }
  const html = marked.parse(body);
  const text = html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  return {
    file: rel,
    hash,
    slug,
    title: String(fm.title),
    date: new Date(fm.date).toISOString().slice(0, 10),
    updated: fm.updated ? new Date(fm.updated).toISOString().slice(0, 10) : null,
    publishAt: fm.publishAt ? new Date(fm.publishAt).toISOString() : null,
    draft: fm.draft === true,
    author,
    tags,
    summary: fm.summary ? String(fm.summary) : text.slice(0, 100),
    image,
    html,
    text,
  };
}

// 記事の frontmatter に必要な分だけを読む（key: value、key: [a, b]、true/false、数値、引用符）
function parseFrontmatter(src) {
  const out = {};
  for (const line of src.split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const m = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (!m) throw new Error(`frontmatter の行を読めません: ${line}`);
    out[m[1]] = parseValue(m[2].trim());
  }
  return out;
}

function parseValue(v) {
  if (v.startsWith("[") && v.endsWith("]")) {
    return v.slice(1, -1).split(",").map((s) => parseValue(s.trim())).filter((s) => s !== "");
  }
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) return v.slice(1, -1);
  if (v === "true") return true;
  if (v === "false") return false;
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
  return v;
}

function purgePlan(prev, next) {
  if (!prev) {
    const warm = warmPaths(next, published.slice(0, config.latestCount).map((p) => p.slug), Object.keys(next.shards));
    return { changed: true, purgeEverything: true, reason: "前回の manifest がない", tags: [], warm };
  }
  if (prev.templateHash !== next.templateHash) {
    // 全部パージしたあとは、よく見られるページ（トップ、新着、一覧）だけを先に温める
    const warm = warmPaths(next, published.slice(0, config.latestCount).map((p) => p.slug), Object.keys(next.shards));
    return { changed: true, purgeEverything: true, reason: "Worker のコードか設定が変わった", tags: [], warm };
  }
  const tags = new Set();
  const changedPosts = [];
  for (const slug of new Set([...Object.keys(prev.posts), ...Object.keys(next.posts)])) {
    if (prev.posts[slug] !== next.posts[slug]) {
      tags.add(`post:${slug}`);
      if (next.posts[slug]) changedPosts.push(slug);
    }
  }
  const changedShards = [];
  for (const name of new Set([...Object.keys(prev.shards), ...Object.keys(next.shards)])) {
    if (prev.shards[name] !== next.shards[name]) {
      changedShards.push(name);
      // 検索の結果ページは全部の検索用の索引から作るので、1つでも変われば search をまとめてパージする
      tags.add(name.startsWith("search:") ? "search" : name);
    }
  }
  const changed = tags.size > 0 || prev.rendererHash !== next.rendererHash;
  return { changed, purgeEverything: false, reason: changed ? "記事か一覧が変わった" : "変更なし", tags: [...tags], warm: warmPaths(next, changedPosts, changedShards) };
}

function warmPaths(next, changedPosts, changedShards) {
  const paths = new Set(["/"]);
  for (const slug of changedPosts) paths.add(`/posts/${slug}/`);
  for (const s of changedShards) {
    if (s.startsWith("index:")) paths.add(`/archive/${s.slice(6, 10)}/`);
    if (s.startsWith("tag:")) paths.add(`/tags/${s.slice(4).replace(":", "/")}/`);
  }
  return [...paths];
}

async function loadPreviousManifest() {
  const local = path.join(CACHE_DIR, "manifest.json");
  if (existsSync(local)) return JSON.parse(await readFile(local, "utf8"));
  if (process.env.PREV_MANIFEST_URL) {
    try {
      const res = await fetch(process.env.PREV_MANIFEST_URL, { headers: { "cache-control": "no-cache" } });
      if (res.ok) return await res.json();
    } catch {
      // 読めなければ、全部パージする（安全側）
    }
  }
  return null;
}

function sitemap() {
  const urls = [
    { loc: "/", lastmod: published[0]?.date },
    ...shardList.filter((s, i, a) => a.findIndex((x) => x.year === s.year) === i).map((s) => ({ loc: `/archive/${s.year}/` })),
    ...tagList.map((t) => ({ loc: `/tags/${t.slug}/` })),
    ...published.map((p) => ({ loc: `/posts/${p.slug}/`, lastmod: p.updated ?? p.date })),
  ];
  const body = urls.map((u) => `<url><loc>${config.url}${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}</url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

function llms() {
  const lines = [`# ${config.name}`, "", `> ${config.description}`, "", "## 年ごとの記事一覧", ""];
  for (const s of shardList.filter((s, i, a) => a.findIndex((x) => x.year === s.year) === i)) {
    const count = shardList.filter((x) => x.year === s.year).reduce((n, x) => n + x.count, 0);
    lines.push(`- [${s.year}年の記事（${count}本）](${config.url}/archive/${s.year}/)`);
  }
  lines.push("", "## タグ", "");
  for (const t of tagList) lines.push(`- [${t.name}（${t.count}本）](${config.url}/tags/${t.slug}/)`);
  lines.push("", "## 新着記事", "");
  for (const p of published.slice(0, 30)) lines.push(`- [${p.title}](${config.url}/posts/${p.slug}/): ${p.summary}`);
  lines.push("", "## 機械で読む場合", "", `- 記事の目録: ${config.url}/data/shards.json`, `- 記事1本の JSON: ${config.url}/data/posts/<slug>.json`, `- サイトマップ: ${config.url}/sitemap.xml`, "");
  return lines.join("\n");
}

function groupBy(items, key) {
  const m = new Map();
  for (const it of items) {
    const k = key(it);
    if (!m.has(k)) m.set(k, []);
    m.get(k).push(it);
  }
  return m;
}

function sha(...parts) {
  const h = createHash("sha256");
  for (const p of parts) h.update(String(p)).update("\0");
  return h.digest("hex");
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

async function listFiles(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const d of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) out.push(...(await listFiles(p)));
    else out.push(p);
  }
  return out;
}

async function readTree(dir) {
  const files = (await listFiles(dir)).sort();
  return Promise.all(files.map(async (f) => `${path.relative(dir, f)}\n${await readFile(f, "utf8")}`));
}
