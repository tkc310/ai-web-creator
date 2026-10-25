#!/usr/bin/env node
// 検証用のダミー記事を作る。使い方: node scripts/gen-dummy.mjs <本数> <出力先> [開始年] [終了年]
// 本文は 1,500〜2,500 字ほど。乱数は固定なので、何度作っても同じ記事になる（計測をそろえるため）
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const [n = "500", out = "bench-work/content", from = "2019", to = "2026"] = process.argv.slice(2);
const count = Number(n);
const tags = ["news", "event", "food", "shop", "people", "history", "nature", "column"];
const words = ["商店街", "駅前", "朝市", "古い町並み", "川沿い", "銭湯", "喫茶店", "パン屋", "祭り", "公園", "図書館", "坂道", "市場", "神社", "古書店", "八百屋", "工房", "路地", "桜並木", "港"];
let seed = 42;
const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const pick = (a) => a[Math.floor(rnd() * a.length)];

await rm(out, { recursive: true, force: true });
const start = Date.UTC(Number(from), 0, 1);
const end = Date.UTC(Number(to), 9, 20);
for (let i = 0; i < count; i++) {
  const d = new Date(start + ((end - start) * i) / Math.max(1, count - 1));
  const date = d.toISOString().slice(0, 10);
  const w1 = pick(words);
  const w2 = pick(words);
  const t = [...new Set([pick(tags), pick(tags)])];
  const paras = [];
  const len = 6 + Math.floor(rnd() * 5);
  for (let p = 0; p < len; p++) {
    paras.push(`${pick(words)}のそばを歩くと、${pick(words)}から${pick(words)}へ続く道に、季節ごとの小さな変化が見つかります。` +
      `地元の人に聞いた話では、${pick(words)}は昔から${pick(words)}と深い関わりがあり、週末には多くの人が集まるそうです。` +
      `記事番号${i}の${p + 1}段落目として、取材で分かったことをまとめました。`);
    if (p === 2) paras.push(`## ${w2}で聞いたこと`);
  }
  const slug = `post-${String(i).padStart(5, "0")}`;
  const body = `---
title: ${w1}と${w2}をめぐる話（${i}）
date: ${date}
tags: [${t.join(", ")}]
summary: ${w1}と${w2}を歩いて見つけた、まちの小さな話題を紹介します。
---

${paras.join("\n\n")}
`;
  const dir = path.join(out, date.slice(0, 4));
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, `${slug}.md`), body);
}
console.log(`${count} 本の記事を ${out} に作りました`);
