#!/usr/bin/env node
// 画像を R2 に上げ、記事に書く frontmatter と Markdown を表示する。画像は Git に入れない。
// 先に skills/site-content-update/scripts/optimize_images.py でメタ情報を消して軽くしておく。
//
// 使い方:
//   node scripts/upload-images.mjs [--local] [--year 2026] <画像ファイル>...
//     --local  wrangler dev の手元の R2 に上げる（動作確認用）
//
// - キーは「年/元の名前-中身のハッシュ8桁.拡張子」。中身が同じ画像は同じキーになり、上げ直さない
// - 上げた画像は images.lock.json に記録する（このファイルは Git に入れる。画像そのものは入れない）
// - 幅と高さはファイルの先頭から読む（PNG、JPEG、WebP、GIF）。表示のずれを防ぐため記事に書く

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const local = args.includes("--local");
const yearIdx = args.indexOf("--year");
const year = yearIdx >= 0 ? args[yearIdx + 1] : String(new Date().getFullYear());
const files = args.filter((a, i) => !a.startsWith("--") && i !== yearIdx + 1);
if (!files.length) {
  console.error("使い方: node scripts/upload-images.mjs [--local] [--year 2026] <画像ファイル>...");
  process.exit(1);
}

const wrangler = JSON.parse((await readFile(path.join(ROOT, "wrangler.jsonc"), "utf8")).replace(/^\s*\/\/.*$/gm, ""));
const bucket = wrangler.r2_buckets.find((b) => b.binding === "IMAGES").bucket_name;
const lockPath = path.join(ROOT, "images.lock.json");
const lock = existsSync(lockPath) ? JSON.parse(await readFile(lockPath, "utf8")) : {};
const TYPES = { ".webp": "image/webp", ".avif": "image/avif", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".gif": "image/gif" };

for (const file of files) {
  const buf = await readFile(file);
  const ext = path.extname(file).toLowerCase();
  const type = TYPES[ext];
  if (!type) throw new Error(`対応していない形式です: ${file}`);
  const hash = createHash("sha256").update(buf).digest("hex");
  const base = path.basename(file, ext).toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "") || "image";
  const size = imageSize(buf);
  const key = lock[hash]?.key ?? `${year}/${base}-${hash.slice(0, 8)}${ext}`;

  if (lock[hash] && !local) {
    console.log(`上げ済みなので飛ばします: ${file} → /img/${key}`);
  } else {
    execFileSync("npx", ["wrangler", "r2", "object", "put", `${bucket}/${key}`, "--file", file, "--content-type", type, local ? "--local" : "--remote"], {
      cwd: ROOT,
      stdio: ["ignore", "ignore", "inherit"],
    });
    if (!local) lock[hash] = { key, width: size?.width, height: size?.height, bytes: buf.length };
    console.log(`上げました: ${file} → /img/${key}（${buf.length} バイト）`);
  }
  console.log(`  frontmatter: image: /img/${key}\n               imageWidth: ${size?.width ?? "?"}\n               imageHeight: ${size?.height ?? "?"}\n               imageAlt: （画像の説明）`);
  console.log(`  本文: ![（画像の説明）](/img/${key})`);
}
if (!local) await writeFile(lockPath, `${JSON.stringify(lock, null, 1)}\n`);

function imageSize(b) {
  // PNG
  if (b.readUInt32BE(0) === 0x89504e47) return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
  // GIF
  if (b.toString("ascii", 0, 3) === "GIF") return { width: b.readUInt16LE(6), height: b.readUInt16LE(8) };
  // WebP
  if (b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") {
    const chunk = b.toString("ascii", 12, 16);
    if (chunk === "VP8X") return { width: 1 + b.readUIntLE(24, 3), height: 1 + b.readUIntLE(27, 3) };
    if (chunk === "VP8 ") return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
    if (chunk === "VP8L") {
      const bits = b.readUInt32LE(21);
      return { width: 1 + (bits & 0x3fff), height: 1 + ((bits >> 14) & 0x3fff) };
    }
  }
  // JPEG: SOF マーカーを探す
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i < b.length) {
      if (b[i] !== 0xff) return null;
      const marker = b[i + 1];
      const len = b.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { width: b.readUInt16BE(i + 7), height: b.readUInt16BE(i + 5) };
      }
      i += 2 + len;
    }
  }
  return null;
}
