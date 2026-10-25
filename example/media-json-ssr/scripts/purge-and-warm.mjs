#!/usr/bin/env node
// 公開のあとに、変わったページのキャッシュをパージし、主なページを開いてキャッシュを温める。
// パージの計画（.cache/purge-plan.json）は scripts/build-data.mjs が前回の manifest との差分から作る。
//
// 使い方:
//   SITE_URL=https://... PURGE_TOKEN=... node scripts/purge-and-warm.mjs
//   node scripts/purge-and-warm.mjs --dry-run    パージと温めの対象を表示するだけ
//   node scripts/purge-and-warm.mjs --verify     温めたあと、もう一度開いて HIT になったかを確かめる
//
// 温めたページのどれかが 200 にならなければ、終了コード 1 で終わる（CI を失敗にして自動修正に回す）

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const plan = JSON.parse(await readFile(path.join(ROOT, process.env.CACHE_DIR ?? ".cache", "purge-plan.json"), "utf8"));
const dry = process.argv.includes("--dry-run");
const verify = process.argv.includes("--verify");
const site = (process.env.SITE_URL ?? "").replace(/\/$/, "");

console.log(`理由: ${plan.reason}`);
console.log(plan.purgeEverything ? "パージ: すべて" : `パージするタグ（${plan.tags.length}）: ${plan.tags.join(", ") || "なし"}`);
console.log(`温めるページ（${plan.warm.length}）: ${plan.warm.join(" ")}`);
if (dry) process.exit(0);
if (!site) throw new Error("SITE_URL を指定してください");
if (!plan.changed) process.exit(0);

// 1回のパージで送れるタグは100個まで
const bodies = plan.purgeEverything ? [{ purgeEverything: true }] : chunk(plan.tags, 100).map((tags) => ({ tags }));
for (const body of bodies) {
  if (!process.env.PURGE_TOKEN) throw new Error("PURGE_TOKEN を指定してください");
  const res = await fetch(`${site}/__cache/purge`, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.PURGE_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  console.log(`purge ${res.status} ${text}`);
  if (!res.ok) process.exit(1);
}

const results = await mapLimit(plan.warm, 6, async (p) => {
  const first = await timed(`${site}${p}`);
  const second = verify ? await timed(`${site}${p}`) : null;
  return { path: p, ...first, ...(second ? { again: second.cache, againMs: second.ms } : {}) };
});
for (const r of results) console.log(JSON.stringify(r));
const bad = results.filter((r) => r.status !== 200);
if (bad.length) {
  console.error(`開けなかったページがあります: ${bad.map((r) => `${r.path}（${r.status}）`).join(", ")}`);
  process.exit(1);
}

async function timed(url) {
  const s = performance.now();
  const res = await fetch(url, { headers: { "User-Agent": "cache-warmer" } });
  await res.arrayBuffer();
  return { status: res.status, cache: res.headers.get("cf-cache-status"), ms: Math.round(performance.now() - s) };
}

function chunk(a, n) {
  const out = [];
  for (let i = 0; i < a.length; i += n) out.push(a.slice(i, i + n));
  return out;
}

async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (i < items.length) {
        const n = i++;
        out[n] = await fn(items[n]);
      }
    }),
  );
  return out;
}
