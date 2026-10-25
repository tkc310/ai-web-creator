#!/usr/bin/env node
// permissions/members.json を元に、GitHub のリポジトリの権限を合わせる。
//
// 使い方:
//   node scripts/sync-permissions.mjs plan [owner/repo]      今の権限との差分を表示する（GITHUB_TOKEN があれば今の権限を読む）
//   node scripts/sync-permissions.mjs apply owner/repo       差分を GitHub に反映する（招待を送る。取り消せないのでオーナーの了承を得てから）
//   node scripts/sync-permissions.mjs codeowners             .github/CODEOWNERS の中身を表示する
//   node scripts/sync-permissions.mjs ruleset                main を守るルールセット（API に送る JSON）を表示する
//   node scripts/sync-permissions.mjs check-pr <PRの作者> <変更したファイル>...
//                                                            書き手が触ってよいファイルだけを変えたかを調べる（CI で使う）
//
// 役割と GitHub の権限:
//   admin → admin、editor → maintain、writer → push、viewer → pull
//   writer は push 権限を持つが、ルールセットで main への直接の push を禁じ、プルリクエストと
//   check-pr の通過、CODEOWNERS（編集者）の承認を必須にする。これで「自分の記事だけ」を守る
//
// 注意: ルールセットは、GitHub Free では公開リポジトリだけで使える。非公開のリポジトリで使うには
// GitHub Pro / Team が必要（2026-10-25 に docs.github.com の managing-rulesets で確認）

import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const conf = JSON.parse(await readFile(path.join(ROOT, "permissions/members.json"), "utf8"));
const [cmd = "plan", ...rest] = process.argv.slice(2);

const memberOf = (login) => conf.members.find((m) => m.github.toLowerCase() === String(login).toLowerCase());

switch (cmd) {
  case "plan":
  case "apply":
    await sync(rest[0], cmd === "apply");
    break;
  case "codeowners":
    console.log(codeowners());
    break;
  case "ruleset":
    console.log(JSON.stringify(ruleset(), null, 2));
    break;
  case "check-pr":
    process.exit((await checkPr(rest[0], rest.slice(1))) ? 0 : 1);
  default:
    console.error(`知らないコマンドです: ${cmd}`);
    process.exit(1);
}

async function sync(repo, apply) {
  const want = new Map(conf.members.map((m) => [m.github.toLowerCase(), conf.roles[m.role].github]));
  const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;
  let have = new Map();
  if (repo && token) {
    const res = await gh(`/repos/${repo}/collaborators?per_page=100&affiliation=direct`, token);
    have = new Map(res.map((c) => [c.login.toLowerCase(), c.role_name]));
  } else {
    console.log("（GITHUB_TOKEN とリポジトリの指定がないので、今の権限は読まずに、あるべき権限だけを表示します）");
  }
  const changes = [];
  for (const [login, perm] of want) if (have.get(login) !== perm) changes.push({ login, from: have.get(login) ?? "なし", to: perm });
  for (const [login, perm] of have) if (!want.has(login)) changes.push({ login, from: perm, to: "（members.json にない。apply では消さない）" });
  for (const c of changes) console.log(`${c.login}: ${c.from} → ${c.to}`);
  if (!changes.length) console.log("差分はありません");
  if (!apply) return;
  if (!repo || !token) throw new Error("apply にはリポジトリ（owner/repo）と GITHUB_TOKEN が必要です");
  for (const c of changes.filter((c) => !c.to.startsWith("（"))) {
    // オーナー本人は collaborator にできないので飛ばす
    if (repo.split("/")[0].toLowerCase() === c.login) continue;
    await gh(`/repos/${repo}/collaborators/${c.login}`, token, "PUT", { permission: c.to });
    console.log(`反映しました: ${c.login} → ${c.to}（初めての人には招待が届きます）`);
  }
}

function codeowners() {
  const editors = conf.members.filter((m) => m.role === "editor" || m.role === "admin").map((m) => `@${m.github}`);
  const admins = conf.members.filter((m) => m.role === "admin").map((m) => `@${m.github}`);
  return [
    "# scripts/sync-permissions.mjs codeowners で作ったファイル。直接は書き換えない",
    `* ${admins.join(" ")}`,
    `/content/ ${editors.join(" ")}`,
    `/images.lock.json ${editors.join(" ")}`,
    `/permissions/ ${admins.join(" ")}`,
    `/.github/ ${admins.join(" ")}`,
    "",
  ].join("\n");
}

function ruleset() {
  return {
    name: "main を守る",
    target: "branch",
    enforcement: "active",
    conditions: { ref_name: { include: ["~DEFAULT_BRANCH"], exclude: [] } },
    // 管理者（リポジトリの admin）は、急ぎの修正と自動修正のために例外にする
    bypass_actors: [{ actor_id: 5, actor_type: "RepositoryRole", bypass_mode: "always" }],
    rules: [
      { type: "deletion" },
      { type: "non_fast_forward" },
      { type: "pull_request", parameters: { required_approving_review_count: 1, require_code_owner_review: true, dismiss_stale_reviews_on_push: true, require_last_push_approval: false, required_review_thread_resolution: false } },
      { type: "required_status_checks", parameters: { strict_required_status_checks_policy: false, required_status_checks: [{ context: "permissions" }] } },
    ],
  };
}

async function checkPr(author, files) {
  const m = memberOf(author);
  if (!m) {
    console.error(`${author} は permissions/members.json にいません`);
    return false;
  }
  const role = conf.roles[m.role];
  const errors = [];
  for (const f of files) {
    if (!role.paths.some((p) => glob(p, f))) errors.push(`${f}: ${role.label}は変更できません`);
    else if (role.ownPostsOnly && f.startsWith("content/posts/") && f.endsWith(".md")) {
      // 変更後の作者と、main での作者の両方が本人であること（他人の記事の作者を書き換えて奪えないようにする）
      const text = existsSync(path.join(ROOT, f)) ? await readFile(path.join(ROOT, f), "utf8") : null;
      const before = gitShow(`origin/main:./${f}`);
      const authorNow = text ? frontAuthor(text) : null;
      const authorBefore = before ? frontAuthor(before) : null;
      if ((authorNow ?? authorBefore) !== m.author || (authorBefore ?? m.author) !== m.author) errors.push(`${f}: 書き手は自分の記事（author: ${m.author}）だけを変更できます`);
    }
  }
  for (const e of errors) console.error(e);
  if (!errors.length) console.log(`${author}（${role.label}）: 問題ありません（${files.length} ファイル）`);
  return errors.length === 0;
}

function frontAuthor(text) {
  return text.match(/^author:\s*(.+)$/m)?.[1].trim().replace(/^["']|["']$/g, "") ?? "editor";
}

function gitShow(ref) {
  try {
    return execFileSync("git", ["show", ref], { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  } catch {
    return null;
  }
}

function glob(pattern, file) {
  const re = new RegExp(`^${pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*\*/g, "\0").replace(/\*/g, "[^/]*").replace(/\0/g, ".*")}$`);
  return re.test(file);
}

async function gh(p, token, method = "GET", body) {
  const res = await fetch(`https://api.github.com${p}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`GitHub API ${method} ${p}: ${res.status} ${await res.text()}`);
  return res.status === 204 ? null : res.json();
}
