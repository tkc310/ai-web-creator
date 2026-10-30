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

モデルを変えるときは、`grep -rn "claude-opus-5-5" skills/` で漏れを確かめます。サイトのリポジトリにコピー済みの `.claude/settings.json`、`.claude/agents/site-builder.md`、`.github/workflows/autofix.yml` は自動では変わらないので、保守か振り返りのときに同じ値へ直します。

## Node.js、pnpm、依存パッケージ

版の番号はここに書きません。作業する日に調べて、最新のものを使います（調べ方と上げる基準は runtime-update スキル）。

| 対象 | 基準 | 書く場所（サイトのリポジトリ） |
|---|---|---|
| Node.js | 最新の LTS 版。Current と奇数番は使わない | `.node-version`、`package.json` の `engines.node` |
| pnpm | 最新版。npm と yarn は使わない | `package.json` の `packageManager` |
| 依存パッケージ | 最新版。公開から1日たっていない版は入れない | `package.json`、`pnpm-lock.yaml`、`pnpm-workspace.yaml` |
| Astro | 最新の安定版。`@astrojs/cloudflare` の設定は Astro 6 以降の書き方を前提にしている（build.md） | `package.json` |
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
- pnpm 11 以降は、公開から1日（1440分）たっていない版を入れないのが既定値（templates/pnpm-workspace.yaml では明示している）
