#!/usr/bin/env node
// 同じダミー記事を Astro（SSG で全ページを HTML にする）でビルドしたときの時間を測る。
// 使い方（Node.js 22.23.4 以上）:
//   node gen-dummy.mjs 3000 work/3000/content
//   node bench-astro.mjs work 3000
// <作業フォルダ>/astro に最小の Astro のプロジェクトを作り、<作業フォルダ>/<本数>/content を読ませる
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const [workArg = "work", ...rest] = process.argv.slice(2);
const WORK = path.resolve(workArg);
const dir = path.join(WORK, "astro");
const counts = rest.map(Number).filter(Boolean);

if (!existsSync(path.join(dir, "node_modules"))) {
  await mkdir(path.join(dir, "src/pages/posts"), { recursive: true });
  await mkdir(path.join(dir, "src/pages/archive"), { recursive: true });
  await writeFile(path.join(dir, "package.json"), JSON.stringify({ name: "bench-astro", private: true, type: "module" }));
  await writeFile(path.join(dir, "pnpm-workspace.yaml"), "minimumReleaseAge: 1440\nallowBuilds:\n  esbuild: true\n  sharp: true\n");
  execFileSync("pnpm", ["add", "astro@latest"], { cwd: dir, stdio: "inherit" });
}
await writeFile(path.join(dir, "astro.config.mjs"), 'import { defineConfig } from "astro/config";\nexport default defineConfig({ output: "static" });\n');
await writeFile(
  path.join(dir, "src/content.config.ts"),
  `import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: process.env.CONTENT_DIR }),
  schema: z.object({ title: z.string(), date: z.coerce.date(), tags: z.array(z.string()), summary: z.string() }),
});
export const collections = { posts };
`,
);
await writeFile(
  path.join(dir, "src/pages/posts/[slug].astro"),
  `---
import { getCollection, render } from "astro:content";
export async function getStaticPaths() {
  const posts = await getCollection("posts");
  return posts.map((p) => ({ params: { slug: p.id.split("/").pop() }, props: { p } }));
}
const { p } = Astro.props;
const { Content } = await render(p);
---
<html lang="ja"><head><meta charset="utf-8"><title>{p.data.title}</title></head><body><h1>{p.data.title}</h1><Content /></body></html>
`,
);
await writeFile(
  path.join(dir, "src/pages/archive/[year].astro"),
  `---
import { getCollection } from "astro:content";
export async function getStaticPaths() {
  const posts = await getCollection("posts");
  const years = [...new Set(posts.map((p) => String(p.data.date.getUTCFullYear())))];
  return years.map((year) => ({ params: { year }, props: { posts: posts.filter((p) => String(p.data.date.getUTCFullYear()) === year) } }));
}
const { posts } = Astro.props;
---
<html lang="ja"><head><meta charset="utf-8"><title>archive</title></head><body><ol>{posts.map((p) => <li>{p.data.title}</li>)}</ol></body></html>
`,
);

const results = [];
for (const n of counts) {
  const env = { ...process.env, CONTENT_DIR: path.join(WORK, String(n), "content") };
  for (const label of ["cold", "nochange"]) {
    if (label === "cold") execFileSync("rm", ["-rf", path.join(dir, ".astro"), path.join(dir, "node_modules/.astro"), path.join(dir, "dist")]);
    const s = performance.now();
    execFileSync("npx", ["astro", "build"], { cwd: dir, env, stdio: "ignore" });
    const ms = Math.round(performance.now() - s);
    const pages = (await readdir(path.join(dir, "dist/posts"))).length;
    results.push({ posts: n, label, ms, pages });
    console.log(`Astro ${n}本 ${label}: ${ms}ms（記事ページ ${pages}）`);
  }
}
console.log(JSON.stringify(results));
