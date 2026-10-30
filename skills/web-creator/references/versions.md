# モデルとバージョンの基準

使う Claude のモデル、ツールのバージョン、時点つきの事実を、このファイルにまとめます。ほかのファイルの説明はここを参照し、モデル名や版の番号を書き写しません。

例外は、機械が読む設定です。次の「同じ値を書いている場所」は、このファイルを参照できないため値を直接書いています。値を変えるときは、このファイルと一緒に、表のすべてを同じコミットで直します。

## Claude のモデル

| 項目 | 値 |
|---|---|
| モデル | Claude Opus 5.5（モデル ID: `claude-opus-5-5`） |
| 計画とデザイン | effort high。ヒアリングの整理、技術の選定、ページ構成、デザイン案、引っ越しの計画、品質チェックで見つかった問題の原因の分析 |
| 構築 | effort medium。ページの実装、記事の追加、修正、公開作業、保守、振り返り、自動修正 |

オーナーに頼むときの言い方: 「モデルの一覧から Claude Opus 5.5 を選んでください」「考える深さ（effort）を medium にしてください」。

### 同じ値を書いている場所

| ファイル | 書いている値 |
|---|---|
| skills/web-creator/SKILL.md の frontmatter | `model: claude-opus-5-5`、`effort: high` |
| skills/site-content-update、site-maintenance、site-review、runtime-update の SKILL.md の frontmatter | `model: claude-opus-5-5`、`effort: medium` |
| templates/claude/agents/site-builder.md の frontmatter | `model: claude-opus-5-5`、`effort: medium` |
| templates/claude/settings.json | `"model": "claude-opus-5-5"`、`"effortLevel": "medium"` |
| templates/github/workflows/autofix.yml の `claude_args` | `--model claude-opus-5-5`、`--effort medium` |

モデルを変えるときは、`grep -rn "claude-opus-5-5" skills/` で漏れを確かめます。

モデル以外にも、次の3か所は版の番号を直接書いています。

| ファイル | 書いている値 | 直すとき |
|---|---|---|
| templates/node-version.txt | 埋めて使うひな形（数字は入れていない）。サイトの `.node-version` には、作業の日の最新の LTS 版のメジャー番号を書く（2026-10-30 時点は `26`） | 変えない。サイトでは runtime-update の基準で確かめて書く |
| scripts/run_lighthouse.sh の `LIGHTHOUSE_VERSION` | Lighthouse の版（`13.6.0`） | 新しい版が出て、公開から3日以上たったとき。結果の比べやすさのため、版は固定して上げる |
| references/security-audit.md の `npx -y skills@...` | skills（スキルを入れるツール）の版（`1.7.4`） | 使う前に、公開から3日以上たった新しい版があれば上げる |
サイトのリポジトリにコピー済みの `.claude/settings.json`、`.claude/agents/site-builder.md`、`.github/workflows/autofix.yml` は自動では変わらないので、保守か振り返りのときに同じ値へ直します。

## Node.js、pnpm、依存パッケージ

サイトで使う版の番号は、作業する日に調べて、最新のものを使います（調べ方と上げる基準は runtime-update スキル）。下の「時点つきの事実」に、最後に確かめた日の最新を書いておきます。

| 対象 | 基準 | 書く場所（サイトのリポジトリ） |
|---|---|---|
| Node.js | 最新の LTS 版。Current と奇数番は使わない | `.node-version`、`package.json` の `engines.node` |
| pnpm | 最新版。npm と yarn は使わない | `package.json` の `packageManager` |
| 依存パッケージ | 最新版。公開から3日たっていない版は入れない（`minimumReleaseAge: 4320`） | `package.json`、`pnpm-lock.yaml`、`pnpm-workspace.yaml` |
| Astro | 最新の安定版。`@astrojs/cloudflare` の設定は Astro 6 以降の書き方を前提にしている（build.md）。Astro 7 と `@astrojs/cloudflare` 14 でも同じ書き方（2026-10-30 確認） | `package.json` |
| Workers の `compatibility_date` | 作成した日。6か月以上前になったら1か月前の日付に上げる | `wrangler.jsonc` |

## GitHub Actions

templates/github/workflows/ のワークフローは、次の版を使っています。サイトのリポジトリでは Dependabot（templates/github/dependabot.yml）が月1回、更新のプルリクエストを作ります。

| アクション | 版 |
|---|---|
| actions/checkout | v7 |
| actions/setup-node | v7 |
| pnpm/action-setup | v6 |
| cloudflare/wrangler-action | v4 |
| anthropics/claude-code-action | v1 |

新しいメジャー版が出ていたら、このリポジトリのテンプレートとこの表を同じコミットで直します。

## 時点つきの事実

変わる可能性がある事実です。確かめた日を添え、古くなっていたら調べ直して直します。

- Dependabot は、pnpm 11 以降のロックファイルを正しく読めない問題がある（2026年10月時点。dependabot-core の Issue #14919、#15904）。そのため、依存パッケージの更新は runtime-update スキルで行い、Dependabot は GitHub Actions の更新だけに使う。GitHub の Dependabot alerts も同じ理由で頼りにせず、`pnpm audit` で弱点を確かめる
- pnpm 11 以降は、公開から1日（1440分）たっていない版を入れないのが既定値（templates/pnpm-workspace.yaml では、Dependabot の cooldown（7日）に近づけて3日（4320分）にしている）。pnpm 12 でも既定値は 1440（pnpm の設定のドキュメント、2026-10-30 確認）
- 2026-10-30 に確かめた最新: Node.js 26（2026-10-28 に LTS になった。サポートは 2029-04-30 まで。24 は 2026-10-20 から Maintenance LTS）、pnpm 12.16.1、Astro 7.4.4（Node.js 22.23.4 以上）、`@astrojs/cloudflare` 14.4.3（Astro 7 が前提）、wrangler 4.156.0（Node.js 22 以上）。出典: https://raw.githubusercontent.com/nodejs/Release/main/schedule.json 、npm のレジストリ（`pnpm view <パッケージ> version engines`）
- Claude Code のプロジェクトのスレッドは、リポジトリの CLAUDE.md、`.claude/CLAUDE.md`、`.claude/rules/`（パスを指定していないもの）だけを読み、`.claude/skills/`、`.claude/agents/`、`.claude/settings.json` は読まない。プロジェクトを使わないクラウドのセッション（リポジトリ1つ）は、`.claude/skills/`、`.claude/agents/`、`.claude/settings.json` も読む（Claude Code のドキュメント「Configure cloud environments」の What carries over from your setup、2026-10-30 確認）。そのため、スキルは skills/ に置いて CLAUDE.md から読ませ、site-builder と effort の設定は、読まれない場面ではオーナーに effort を選んでもらう（SKILL.md の「使うモデル」）
- claude.ai にスキルを ZIP で登録するとき、SKILL.md の frontmatter に使えるのは name、description、license、allowed-tools、compatibility、metadata だけで、それ以外の項目（このスキルの model と effort など）があると登録を断られるという報告がある（anthropics/claude-code の Issue #24826、2026-10-30 確認）。そのため、ZIP での登録の手順は載せていない
- `claude setup-token` で作る `CLAUDE_CODE_OAUTH_TOKEN` は、有効期限が1年の OAuth トークンで、Pro、Max、Team、Enterprise のプランで作れる。モデルへのリクエストだけに使え、claude.ai のコネクタは使えない（Claude Code のドキュメント「Authentication」の Generate a long-lived token、2026-10-30 確認: https://code.claude.com/docs/en/authentication ）
- クラウドの作業環境（Claude Code のクラウドのセッションとプロジェクトのスレッド）の GitHub の中継（GitHub proxy）は、ブランチの削除とタグの push を拒否し、どのブランチへの push かは制限しない。GitHub の GraphQL を拒否するので、`gh pr` と `gh issue` は 403 になる。代わりに REST の `gh api repos/{owner}/{repo}/...` を使う。`gh run` などの REST のコマンドは使える。セッションに追加していないリポジトリへの API と、`github.com/{owner}/{repo}/archive/`、`codeload.github.com` の取得は、公開リポジトリでも 403 になる。`git clone` は、通信の許可に github.com があれば使える（Trusted の既定の許可に入っている）。空のリポジトリではなく README のあるリポジトリから始める（Claude Code のドキュメント「Configure cloud environments」の GitHub proxy と Default allowed domains、「Get started with Claude Code in the cloud」、2026-10-30 確認: https://code.claude.com/docs/en/cloud-environments 、https://code.claude.com/docs/en/web-quickstart ）
- プロジェクトのスレッドは、既定では自分のブランチで作業し、必要ならプルリクエストを開く。このスキルでは公開を main への push で行うので、プロジェクトの指示と AGENTS.md に「OK のあとに `git push origin HEAD:main` で main に入れる」と書いている（templates/project-instructions.md、templates/AGENTS.md.tmpl）
- `wrangler.jsonc` に `routes`（独自ドメイン）を足し、`workers_dev` を書いていない場合は、次の公開から workers.dev の URL が使えなくなる（Cloudflare のドキュメント「workers.dev」、2026-10-30 確認）。独自ドメインをつなぐコミットで、`.github/smoke-test.txt` の URL も本番のドメインに直す
