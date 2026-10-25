#!/usr/bin/env node
// ビルドの時間と出力の大きさを測る。使い方: node scripts/bench.mjs [本数...]（既定: 300 1000 3000）
// 結果は logs/bench-<日付>.json に保存する。手元の Worker のレイテンシは scripts/bench-latency.mjs で測る
//
// 測るもの:
//   cold      .cache がない状態から全部を変換する（初回の公開、CI のキャッシュが消えたとき）
//   nochange  何も変えずにもう一度（ハッシュが同じなので変換を飛ばし、changed=false になるか）
//   edit1     既存の記事を1本だけ直す（その記事と、載っている一覧だけがパージ対象になるか）
//   add1      新しい記事を1本足す

import { execFileSync } from "node:child_process";
import { appendFile, mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sizes = process.argv.slice(2).map(Number).filter(Boolean);
const counts = sizes.length ? sizes : [300, 1000, 3000];
const results = [];

for (const n of counts) {
  const work = path.join(ROOT, "bench-work", String(n));
  const content = path.join(work, "content");
  const env = { ...process.env, CONTENT_DIR: content, OUT_DIR: path.join(work, "dist"), CACHE_DIR: path.join(work, ".cache"), BUILD_NOW: "2026-10-25T00:00:00Z" };
  await rm(work, { recursive: true, force: true });
  execFileSync("node", ["scripts/gen-dummy.mjs", String(n), content], { cwd: ROOT, stdio: "ignore" });

  const run = (label) => {
    const s = performance.now();
    const out = execFileSync("node", ["scripts/build-data.mjs"], { cwd: ROOT, env, encoding: "utf8" });
    const wall = Math.round(performance.now() - s);
    const summary = JSON.parse(out.trim().split("\n").pop());
    return { label, wallMs: wall, ...summary };
  };
  const plan = async () => JSON.parse(await readFile(path.join(work, ".cache", "purge-plan.json"), "utf8"));

  const cold = run("cold");
  const nochange = run("nochange");
  const nochangePlan = await plan();

  // 2025年の記事を1本、本文だけ直す
  const y = path.join(content, "2025");
  const target = path.join(y, (await readdir(y)).sort()[5]);
  await appendFile(target, "\n追記: 本文を1行だけ直しました。\n");
  const edit1 = run("edit1");
  const edit1Plan = await plan();

  const add = path.join(content, "2026", "post-new.md");
  await writeFile(add, "---\ntitle: 新しい記事\ndate: 2026-10-24\ntags: [news]\nsummary: 1本足したときの計測用です。\n---\n\n本文です。\n");
  const add1 = run("add1");
  const add1Plan = await plan();

  const dist = path.join(work, "dist");
  const files = await walk(dist);
  const byKind = {};
  for (const f of files) {
    const rel = path.relative(dist, f);
    const kind = rel.startsWith("data/posts/") ? "posts" : rel.startsWith("data/index/") ? "index" : rel.startsWith("data/search/") ? "search" : rel.startsWith("data/tags/") ? "tags" : "other";
    const size = (await stat(f)).size;
    byKind[kind] ??= { files: 0, bytes: 0, max: 0 };
    byKind[kind].files++;
    byKind[kind].bytes += size;
    byKind[kind].max = Math.max(byKind[kind].max, size);
  }

  results.push({
    posts: n,
    cold,
    nochange: { ...nochange, plan: nochangePlan },
    edit1: { ...edit1, plan: edit1Plan },
    add1: { ...add1, plan: add1Plan },
    files: files.length,
    byKind,
  });
  console.log(
    `${n}本: cold ${cold.wallMs}ms（変換 ${cold.rendered}）/ 変更なし ${nochange.wallMs}ms（changed=${nochange.changed}）/ 1本修正 ${edit1.wallMs}ms（変換 ${edit1.rendered}、タグ ${edit1Plan.tags.join(",")}）/ 1本追加 ${add1.wallMs}ms（タグ ${add1Plan.tags.length}）/ ファイル ${files.length}`,
  );
}

const nodeVersion = process.version;
const markedVersion = JSON.parse(await readFile(path.join(ROOT, "node_modules/marked/package.json"), "utf8")).version;
await mkdir(path.join(ROOT, "logs"), { recursive: true });
const out = path.join(ROOT, "logs", `bench-build-${new Date().toISOString().slice(0, 10)}.json`);
await writeFile(out, `${JSON.stringify({ node: nodeVersion, marked: markedVersion, cpu: cpuName(), results }, null, 1)}\n`);
console.log(`保存しました: ${path.relative(ROOT, out)}`);

async function walk(dir) {
  const out = [];
  for (const d of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

function cpuName() {
  try {
    return execFileSync("sh", ["-c", "grep -m1 'model name' /proc/cpuinfo | cut -d: -f2; nproc"], { encoding: "utf8" }).trim().replace(/\n/, " / cores ");
  } catch {
    return "unknown";
  }
}
