#!/usr/bin/env node
// 予約投稿の一覧を出し、Claude のスケジュールタスク（ルーティン）を作るときの値を表示する。
// 予約投稿は、frontmatter の publishAt が「今」より後の記事。ビルドではまだ公開しない。
// publishAt の時刻を過ぎてから deploy を動かせば公開される。その「動かす」を、
// 記事ごとに一度だけ動く Claude のスケジュールタスクに任せる（常に動く cron を置かない）。
//
// 使い方: node scripts/build-data.mjs && node scripts/schedule.mjs [リポジトリ（owner/name）]

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repo = process.argv[2] ?? "<owner>/<repo>";
const scheduled = JSON.parse(await readFile(path.join(ROOT, process.env.CACHE_DIR ?? ".cache", "scheduled.json"), "utf8"));

if (!scheduled.length) {
  console.log("予約投稿はありません");
  process.exit(0);
}

// 同じ時刻の記事は1つのタスクにまとめる
const byTime = new Map();
for (const s of scheduled) {
  if (!byTime.has(s.publishAt)) byTime.set(s.publishAt, []);
  byTime.get(s.publishAt).push(s);
}

for (const [at, posts] of byTime) {
  // 時刻ちょうどだと、ビルドの「今」が publishAt より前になることがあるので 2 分後に動かす
  const runAt = new Date(Date.parse(at) + 2 * 60 * 1000).toISOString();
  const slugs = posts.map((p) => p.slug);
  const task = {
    name: `予約投稿 ${slugs.join(", ")}`,
    run_once_at: runAt,
    create_new_session_on_fire: true,
    prompt: [
      `GitHub の ${repo} は、Cloudflare Workers で配信しているメディアのサイトです。予約投稿の公開時刻になりました。`,
      `1. ${repo} の main で、次の記事の frontmatter に draft: true がなく、publishAt が ${at}（UTC）と同じ時刻のままかを確かめる: ${posts.map((p) => p.file).join(", ")}`,
      "   変わっていたら（取り下げ・日時の変更）、何もせずに終える",
      `2. ${repo} の deploy ワークフローを workflow_dispatch で動かし、終わるまで待つ`,
      `3. 公開されたページ（${slugs.map((s) => `/posts/${s}/`).join(" ")}）が 200 で開けることを確かめる`,
      "4. 失敗していたら、deploy-and-autofix の手順で原因を調べて直す。直せなければ Issue でオーナーに知らせる",
      "5. logs/ に実行ログを書く（起動のしかたは「予約投稿」）",
    ].join("\n"),
  };
  console.log(JSON.stringify(task, null, 2));
}
