#!/usr/bin/env node
// 動いている Worker（wrangler dev か本番）に同じページを何度も開き、応答時間を測る。
// 使い方: node scripts/bench-latency.mjs <サイトの URL> [回数（既定 30）] [記事の slug]
// 本番では cf-cache-status も記録する（1回目は MISS、2回目からは HIT になるはず）

const [base = "http://localhost:8787", times = "30", slug = "post-01500"] = process.argv.slice(2);
const n = Number(times);
const paths = {
  "記事": `/posts/${slug}/`,
  "トップ": "/",
  "年の一覧": "/archive/2024/",
  "年の一覧 5ページ目": "/archive/2024/?page=5",
  "タグの一覧": "/tags/food/",
  "検索（全期間）": "/search/?q=商店街 祭り",
  "検索（年でしぼる）": "/search/?q=商店街 祭り&year=2024",
  "記事の JSON（静的ファイル）": `/data/posts/${slug}.json`,
};

const rows = [];
for (const [label, p] of Object.entries(paths)) {
  const ms = [];
  const statuses = new Map();
  let bytes = 0;
  for (let i = 0; i < n; i++) {
    // 2回目以降はキャッシュに当たるように、同じ URL を開く
    const s = performance.now();
    const res = await fetch(base + encodeURI(p).replace(/%25/g, "%"));
    const body = await res.arrayBuffer();
    ms.push(performance.now() - s);
    bytes = body.byteLength;
    const c = res.headers.get("cf-cache-status") ?? "-";
    statuses.set(c, (statuses.get(c) ?? 0) + 1);
    if (res.status !== 200) throw new Error(`${p}: ${res.status}`);
  }
  const sorted = [...ms].sort((a, b) => a - b);
  const q = (r) => sorted[Math.min(sorted.length - 1, Math.floor(r * sorted.length))].toFixed(1);
  rows.push({ label, path: p, first: ms[0].toFixed(1), p50: q(0.5), p95: q(0.95), bytes, cache: Object.fromEntries(statuses) });
}
console.table(rows);
console.log(JSON.stringify({ base, n, rows }));
