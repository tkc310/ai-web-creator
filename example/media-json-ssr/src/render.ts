// HTML の組み立て。ライブラリは使わず、テンプレート文字列で書く（Worker の起動と CPU 時間を小さくする）

import site from "../site.config.json";
import type { IndexShard, PostDetail, PostEntry, ShardsDoc, TagShard } from "./types";

const TAGS = site.tags as Record<string, string>;

const CSS = `
:root{--ink:#1d1b16;--sub:#5c574c;--line:#e4dfd3;--bg:#faf8f3;--card:#fff;--accent:#9a3b1d;--max:44rem}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.85 "Hiragino Sans","Noto Sans JP","Yu Gothic UI",system-ui,sans-serif;overflow-wrap:anywhere}
a{color:var(--accent)}
a:focus-visible{outline:3px solid var(--accent);outline-offset:2px}
.wrap{max-width:var(--max);margin:0 auto;padding:0 1rem}
header.site{border-bottom:1px solid var(--line);background:var(--card)}
header.site .wrap{display:flex;align-items:center;justify-content:space-between;gap:1rem;min-height:3.5rem}
.logo{font-weight:700;color:var(--ink);text-decoration:none;font-size:1.05rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
nav.top{flex-shrink:0;white-space:nowrap}
nav.top a{display:inline-block;padding:.6rem .5rem;color:var(--ink);text-decoration:none;font-size:.95rem}
main{padding:1.5rem 0 3rem}
h1{font-size:1.6rem;line-height:1.45;margin:.5rem 0 1rem}
h2{font-size:1.25rem;line-height:1.5;margin:2rem 0 .75rem}
.meta{color:var(--sub);font-size:.875rem;display:flex;flex-wrap:wrap;gap:.25rem .75rem}
.chips{display:flex;flex-wrap:wrap;gap:.4rem;padding:0;margin:.75rem 0;list-style:none}
.chips a{display:inline-block;padding:.35rem .75rem;border:1px solid var(--line);border-radius:999px;background:var(--card);color:var(--ink);text-decoration:none;font-size:.85rem;min-height:44px;line-height:1.9}
ol.list{list-style:none;padding:0;margin:0}
ol.list li{border-bottom:1px solid var(--line);padding:1rem 0}
ol.list h2,ol.list h3{font-size:1.05rem;margin:0 0 .25rem;line-height:1.5}
ol.list a.t{color:var(--ink);text-decoration:none}
ol.list a.t:hover{text-decoration:underline}
ol.list p{margin:.25rem 0 0;color:var(--sub);font-size:.9rem}
.hero{margin:0 0 1.5rem}
.hero img,.post img{width:100%;height:auto;border-radius:6px;background:#eee}
.post{font-size:1.0625rem}
.post p{margin:0 0 1.2em}
.pager{display:flex;justify-content:space-between;margin-top:1.5rem}
.pager a{display:inline-block;padding:.6rem 1rem;border:1px solid var(--line);border-radius:6px;background:var(--card);text-decoration:none}
form.search{display:flex;gap:.5rem;margin:1rem 0}
form.search input{flex:1;min-width:0;font:inherit;padding:.6rem .75rem;border:1px solid #8a8478;border-radius:6px}
form.search button{font:inherit;padding:.6rem 1rem;border:0;border-radius:6px;background:var(--accent);color:#fff}
@media (max-width:359px){.logo{font-size:.92rem}nav.top a{padding:.6rem .4rem}}
footer.site{border-top:1px solid var(--line);color:var(--sub);font-size:.85rem;padding:1.5rem 0}
.crumbs{font-size:.85rem;color:var(--sub);margin:0;padding:0;list-style:none;display:flex;flex-wrap:wrap;gap:.25rem}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
.crumbs li+li::before{content:"›";margin-right:.25rem}
`;

export function esc(s: unknown): string {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

function jsonLd(data: unknown): string {
  // </script> で閉じられないよう < をエスケープする
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;
}

interface PageOpts {
  title: string;
  description: string;
  path: string;
  body: string;
  ld?: unknown[];
  image?: string;
  type?: "website" | "article";
  noindex?: boolean;
}

function layout(o: PageOpts): string {
  const url = `${site.url}${o.path}`;
  const fullTitle = o.path === "/" ? site.name : `${o.title}｜${site.name}`;
  return `<!doctype html>
<html lang="${site.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(o.description)}">
<link rel="canonical" href="${esc(url)}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
${o.noindex ? '<meta name="robots" content="noindex">' : ""}
<meta property="og:type" content="${o.type ?? "website"}">
<meta property="og:title" content="${esc(o.title)}">
<meta property="og:description" content="${esc(o.description)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:site_name" content="${esc(site.name)}">
${o.image ? `<meta property="og:image" content="${esc(site.url + o.image)}">` : ""}
<meta name="twitter:card" content="${o.image ? "summary_large_image" : "summary"}">
<style>${CSS}</style>
${(o.ld ?? []).map(jsonLd).join("\n")}
</head>
<body>
<header class="site"><div class="wrap">
<a class="logo" href="/">${esc(site.name)}</a>
<nav class="top" aria-label="メニュー"><a href="/">新着</a><a href="/search/">検索</a></nav>
</div></header>
<main class="wrap">
${o.body}
</main>
<footer class="site"><div class="wrap">© ${esc(site.name)}</div></footer>
</body>
</html>`;
}

function fmtDate(d: string): string {
  const [y, m, day] = d.split("-");
  return `${y}年${Number(m)}月${Number(day)}日`;
}

function list(posts: PostEntry[], heading: "h2" | "h3" = "h2"): string {
  if (!posts.length) return "<p>記事はまだありません。</p>";
  return `<ol class="list">${posts
    .map(
      (p) => `<li><${heading}><a class="t" href="/posts/${p.slug}/">${esc(p.title)}</a></${heading}>
<div class="meta"><time datetime="${p.date}">${fmtDate(p.date)}</time>${p.tags.map((t) => `<span>${esc(TAGS[t] ?? t)}</span>`).join("")}</div>
<p>${esc(p.summary)}</p></li>`,
    )
    .join("")}</ol>`;
}

function pager(base: string, page: number, total: number): string {
  const pages = Math.max(1, Math.ceil(total / site.pageSize));
  if (pages === 1) return "";
  const prev = page > 1 ? `<a href="${base}${page - 1 > 1 ? `?page=${page - 1}` : ""}" rel="prev">← 新しい記事</a>` : "<span></span>";
  const next = page < pages ? `<a href="${base}?page=${page + 1}" rel="next">古い記事 →</a>` : "<span></span>";
  return `<nav class="pager" aria-label="ページ送り">${prev}${next}</nav>`;
}

function crumbs(items: { name: string; path: string }[]) {
  const html = `<ol class="crumbs">${items.map((i, n) => (n === items.length - 1 ? `<li>${esc(i.name)}</li>` : `<li><a href="${i.path}">${esc(i.name)}</a></li>`)).join("")}</ol>`;
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((i, n) => ({ "@type": "ListItem", position: n + 1, name: i.name, item: `${site.url}${i.path}` })),
  };
  return { html, ld };
}

export function renderHome(latest: IndexShard, shards: ShardsDoc): string {
  const years = [...new Set(shards.shards.map((s) => s.year))];
  const body = `<h1>新着記事</h1>
${list(latest.posts)}
<h2>年ごとの記事</h2>
<ul class="chips">${years.map((y) => `<li><a href="/archive/${y}/">${y}年</a></li>`).join("")}</ul>
<h2>タグ</h2>
<ul class="chips">${shards.tags.map((t) => `<li><a href="/tags/${t.slug}/">${esc(t.name)}（${t.count}）</a></li>`).join("")}</ul>`;
  return layout({
    title: site.name,
    description: site.description,
    path: "/",
    body,
    ld: [
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: site.name,
        url: `${site.url}/`,
        potentialAction: { "@type": "SearchAction", target: `${site.url}/search/?q={search_term_string}`, "query-input": "required name=search_term_string" },
      },
    ],
  });
}

export function renderPost(p: PostDetail): string {
  const c = crumbs([
    { name: "ホーム", path: "/" },
    { name: `${p.date.slice(0, 4)}年`, path: `/archive/${p.date.slice(0, 4)}/` },
    { name: p.title, path: `/posts/${p.slug}/` },
  ]);
  const hero = p.image
    ? `<figure class="hero"><img src="${esc(p.image.src)}" alt="${esc(p.image.alt)}" width="${p.image.width}" height="${p.image.height}" fetchpriority="high" decoding="async"></figure>`
    : "";
  const body = `${c.html}
<article>
<h1>${esc(p.title)}</h1>
<div class="meta"><time datetime="${p.date}">${fmtDate(p.date)}</time>${p.updated ? `<span>更新 <time datetime="${p.updated}">${fmtDate(p.updated)}</time></span>` : ""}<span>${esc(p.authorName)}</span></div>
<ul class="chips">${p.tags.map((t) => `<li><a href="/tags/${t.slug}/">${esc(t.name)}</a></li>`).join("")}</ul>
${hero}
<div class="post">${p.html}</div>
</article>`;
  // 構造化データには、ページに表示している内容だけを書く
  const article = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: p.title,
    description: p.summary,
    datePublished: p.date,
    ...(p.updated ? { dateModified: p.updated } : {}),
    author: { "@type": "Organization", name: p.authorName },
    publisher: { "@type": "Organization", name: site.name },
    mainEntityOfPage: `${site.url}/posts/${p.slug}/`,
    ...(p.image ? { image: `${site.url}${p.image.src}` } : {}),
  };
  return layout({ title: p.title, description: p.summary, path: `/posts/${p.slug}/`, body, ld: [article, c.ld], image: p.image?.src, type: "article" });
}

export function renderArchive(year: string, shard: IndexShard, page: number): string {
  const start = (page - 1) * site.pageSize;
  const c = crumbs([
    { name: "ホーム", path: "/" },
    { name: `${year}年`, path: `/archive/${year}/` },
  ]);
  const body = `${c.html}<h1>${year}年の記事（${shard.count}本）</h1>${list(shard.posts.slice(start, start + site.pageSize))}${pager(`/archive/${year}/`, page, shard.count)}`;
  const path = `/archive/${year}/${page > 1 ? `?page=${page}` : ""}`;
  return layout({ title: `${year}年の記事${page > 1 ? `（${page}ページ目）` : ""}`, description: `${site.name}の${year}年の記事の一覧です。`, path, body, ld: [c.ld] });
}

export function renderTag(tag: TagShard, page: number): string {
  const start = (page - 1) * site.pageSize;
  const base = tag.year ? `/tags/${tag.slug}/${tag.year}/` : `/tags/${tag.slug}/`;
  const name = tag.year ? `${tag.name}（${tag.year}年）` : tag.name;
  const c = crumbs([
    { name: "ホーム", path: "/" },
    { name: tag.name, path: `/tags/${tag.slug}/` },
    ...(tag.year ? [{ name: `${tag.year}年`, path: base }] : []),
  ]);
  // 本体に入っていない古い記事は、年ごとの一覧から見る
  const listed = tag.posts.length;
  const years = tag.years?.length
    ? `<h2>年ごとの一覧</h2><ul class="chips">${tag.years.map((y) => `<li><a href="/tags/${tag.slug}/${y.year}/">${y.year}年（${y.count}）</a></li>`).join("")}</ul>`
    : "";
  const body = `${c.html}<h1>${esc(name)}の記事（${tag.count}本）</h1>${list(tag.posts.slice(start, start + site.pageSize))}${pager(base, page, listed)}${years}`;
  const path = `${base}${page > 1 ? `?page=${page}` : ""}`;
  return layout({ title: `${name}の記事${page > 1 ? `（${page}ページ目）` : ""}`, description: `${site.name}の「${name}」の記事の一覧です。`, path, body, ld: [c.ld] });
}

export function renderSearch(q: string, results: { s: string; t: string; d: string; g: string[]; x: string }[], shards: ShardsDoc): string {
  const years = [...new Set(shards.shards.map((s) => s.year))];
  const body = `<h1>記事を探す</h1>
<form class="search" action="/search/" method="get" role="search">
<label for="q" class="sr">キーワード</label>
<input id="q" name="q" type="search" value="${esc(q)}" placeholder="例: 商店街 イベント" maxlength="50">
<button type="submit">探す</button>
</form>
${q ? `<p>「${esc(q)}」の記事: ${results.length >= 50 ? "50本以上（新しい順に50本）" : `${results.length}本`}</p>${list(results.map((r) => ({ slug: r.s, title: r.t, date: r.d, tags: r.g, summary: r.x, image: null })))}` : `<p>${shards.total}本の記事から探せます。年でしぼる場合: ${years.map((y) => `<a href="/search/?year=${y}">${y}</a>`).join(" ")}</p>`}`;
  return layout({ title: q ? `「${q}」の検索結果` : "記事を探す", description: `${site.name}の記事を探せます。`, path: "/search/", body, noindex: !!q });
}

export function renderNotFound(): string {
  return layout({ title: "ページが見つかりません", description: "お探しのページは見つかりませんでした。", path: "/404", body: '<h1>ページが見つかりません</h1><p><a href="/">トップページへ</a></p>', noindex: true });
}
