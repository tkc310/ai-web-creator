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
- クラウドの作業環境（Claude Code のクラウドのセッションとプロジェクトのスレッド）の GitHub の中継（GitHub proxy）は、ブランチの削除とタグの push を拒否し、どのブランチへの push かは制限しない。GitHub の GraphQL を拒否するので、`gh pr` と `gh issue` は 403 になる。代わりに REST の `gh api repos/{owner}/{repo}/...` を使う。`gh run` などの REST のコマンドは使える。セッションに追加していないリポジトリへの API と、`github.com/{owner}/{repo}/archive/`、`codeload.github.com` の取得は、公開リポジトリでも 403 になる。GitHub の操作は、作業環境の通信の許可（access level）と関係なく、GitHub 専用の中継を通る（「all GitHub operations go through a dedicated proxy ... independent of the environment's access level」）ので、配布元の `git clone` のために通信の許可を変える必要はない。タグの push が拒否されるので、配布元のタグは作者のパソコンから打つ（配布元の README の「版の付け方」）。空のリポジトリではなく README のあるリポジトリから始める（Claude Code のドキュメント「Configure cloud environments」の GitHub proxy と Default allowed domains、「Get started with Claude Code in the cloud」、2026-10-30 確認: https://code.claude.com/docs/en/cloud-environments 、https://code.claude.com/docs/en/web-quickstart ）
- プロジェクトのスレッドは、既定では、リポジトリの既定のブランチ（main）から新しいブランチを作って作業し、必要ならプルリクエストを開く（「works on a new branch, started from the repository's default branch」）。始めるブランチは、頼みごとかプロジェクトの指示で変えられる。このスキルでは公開を main への push で行うので、プロジェクトの指示と AGENTS.md に「OK のあとに `git push origin HEAD:main` で main に入れる」と書いている。また、スキルの取り込みのコミットを初回だけ main にも入れ（skills-install.md の初回の手順の8）、制作中は SITE.md の「作業用のブランチ」から始めるようにしている（templates/project-instructions.md、templates/AGENTS.md.tmpl、templates/CLAUDE.md.tmpl）。スレッドが許可を待つときは、確認はそのスレッドの中に出て、プロジェクトの会話からは答えられない。クラウドのスレッドは `.claude/settings.json` の許可のルールを読まない（Claude Code のドキュメント「Projects」の Review a thread's pull request と Unblock a thread waiting on approval、2026-10-30 確認: https://code.claude.com/docs/en/claude-projects ）
- CLAUDE.md の `@パス` は、そのファイルを読み込む書き方として公式に説明されている（相対パスは CLAUDE.md のある場所から。作業フォルダの外を指すときだけ承認の画面が出る）。ただし、プロジェクトのスレッドで `@AGENTS.md` が読み込まれるかは文書に書かれていないので、templates/CLAUDE.md.tmpl には `@AGENTS.md` に加えて、守ってほしい3つの決まりを直接書いている。スレッドで読まれていることは、実機で確かめる（Claude Code のドキュメント「How Claude remembers your project」の Import additional files、2026-10-30 確認: https://code.claude.com/docs/en/memory ）
- Claude Code の許可のルール: `Bash(git log:*)` と `Bash(git log *)` は同じで、後ろに何でも付けられる（`--output=<ファイル>` も）。引数を決めるときは `*` のない書き方にする。`Write(パス)` の書き方は決して当たらず、ファイルの書き込みは `Edit(パス)` の許可で決まる（Edit の許可は Write にも効く）。作業フォルダの外のパスは `//` で始める（`Read(//proc/**)`）。`permissions.blockReadsOutsideWorkingDirectories` で、Read、Grep、Glob が作業フォルダの外を読むのを断れる（Claude Code v2.1.257 以降）。`CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1` は、Claude が動かすコマンドの環境から鍵を取り除く（`GITHUB_TOKEN` は残す）。autofix.yml はこれらを使っている（Claude Code のドキュメント「Configure permissions」「Settings reference」「Environment variables」、2026-10-30 確認: https://code.claude.com/docs/en/permissions 、https://code.claude.com/docs/en/settings-reference 、https://code.claude.com/docs/en/env-vars ）。claude-code-action の中でこの設定のとおりに `.git/` や `/proc` が読めないことは、使い捨てのリポジトリで確かめる（未確認）
- Claude の GitHub アプリ経由では、`.github/workflows/` のファイルを足す push が拒否される、という報告がある（未確認。GitHub では、アプリがワークフローのファイルを変えるには workflows の権限が要る）。拒否されたときの手順は deploy-and-autofix.md の「ワークフローのファイルを push できないとき」。作者が配布元の README の「版の付け方」の手順3で確かめ、結果をここに書く
- Cloudflare の API の MCP サーバー（`https://mcp.cloudflare.com/mcp`）は、接続のときに許可する権限（OAuth のスコープ）を選べる。足りない権限が要る操作では、サーバーがその権限を求め、クライアントが追加の許可を聞く（step-up authorization）。Claude のコネクタでこの追加の許可が出るかは未確認なので、出なければコネクタをつなぎ直して権限を足すか、オーナーがダッシュボードで操作する（connectors.md の「権限の選び方」。Cloudflare の Changelog、2026-08-22 と 2026-10-19、2026-10-30 確認: https://developers.cloudflare.com/changelog/post/2026-08-22-wrangler-mcp-optional-oauth-scopes/ 、https://developers.cloudflare.com/changelog/post/2026-10-19-cloudflare-mcp-step-up/ ）
- `wrangler.jsonc` に `routes`（独自ドメイン）を足し、`workers_dev` を書いていない場合は、次の公開から workers.dev の URL が使えなくなる（Cloudflare のドキュメント「workers.dev」、2026-10-30 確認）。独自ドメインをつなぐコミットで、`.github/smoke-test.txt` の URL も本番のドメインに直す
- クラウドの作業環境では、公開リポジトリのコミットされたファイルが raw.githubusercontent.com から届き、この行き先は既定の Trusted の一覧に入っている（「Committed files from public repositories arrive through raw.githubusercontent.com」）。一方、セッションにつないでいない公開リポジトリを `git clone` できるかは文書に書かれていない（未確認）。そのため、スキルの取り込みは clone（A）が失敗したら raw（C）、それも失敗したら zip（B）の順にしている（skills-install.md。Claude Code のドキュメント「Configure cloud environments」、2026-10-30 確認: https://code.claude.com/docs/en/cloud-environments ）。どの経路が通るかは、作者が配布元の README の「版の付け方」の手順3で確かめ、結果をここに書く
- スケジュールタスク（ルーティン）の実行は auto mode で始まり、権限のモードは選べない。起動したときのプロンプトは、承認や同意の代わりにならない。ほかに指示がなければ `claude/` で始まるブランチに push し、プロンプトで別のブランチを指示できる。コミットとプルリクエストはユーザーの GitHub の名前で作られる（Claude Code のドキュメント「Scheduled tasks」、2026-10-30 確認: https://code.claude.com/docs/en/routines ）。auto mode では、人が承認していないプルリクエストのマージ、force push、`git reset --hard` と `git clean -fd`、本番への公開は既定で止められ、既定のブランチを含むブランチへの push は通る。止められた操作が3回続くか、合わせて20回になると、実行が止まって人を待つ（「Permission modes」、2026-10-30 確認: https://code.claude.com/docs/en/permission-modes ）。そのため、無人の保守ではプルリクエストをマージせず、パッチとマイナーの更新だけを確かめてから main に push する（site-maintenance）
- Claude Code では、読み取りだけのコマンド（`ls`、`cat`、`grep`、`find`、`head` など）は承認なしで通る。Read の拒否の規則は、ファイルの名前を引数に書いたコマンド（`cat`、`head`、`tail`、`sed`、`tee`）には効くが、名前を書かない `grep -r` や、ファイルを自分で開くスクリプトには効かない（「Configure permissions」、2026-10-30 確認: https://code.claude.com/docs/en/permissions ）。autofix.yml では、`env` や `printenv` などを `--disallowedTools` で断っている。claude-code-action の中で `cat .git/config` と `env` が通らないことは、使い捨てのリポジトリで確かめる（未確認）
- Claude Agent SDK の最後の結果のメッセージは、操作の回数の上限に当たったとき `subtype` が `error_max_turns` になる。claude-code-action は、実行の記録のファイルを `execution_file` の出力で渡す。autofix.yml の Issue の文は、これを読んで書き分けている（Agent SDK のドキュメント「How the agent loop works」の Handle the result と、claude-code-action の action.yml、2026-10-30 確認: https://code.claude.com/docs/en/agent-sdk/agent-loop 、https://github.com/anthropics/claude-code-action ）。記録のファイルの形が変わっていないかは、作者が手順4で確かめる
- アーティファクトのコメントは、組織の中で共有したアーティファクトで使う機能として書かれている（Team と Enterprise）。Pro と Max の共有は公開のリンクだけで、リンクだけで開いた人はコメントを見られず、書けない。作った本人が自分のアーティファクトにコメントを付けられるかは書かれていない（未確認。Claude Code のドキュメント「Artifacts」、2026-10-30 確認: https://code.claude.com/docs/en/artifacts ）
- GitHub の画面の「Upload files」（`https://github.com/<持ち主>/<リポジトリ>/upload/<ブランチ>/<フォルダ>`）で、まだないフォルダにファイルを置けるかは未確認（deploy-and-autofix.md の「ワークフローのファイルを push できないとき」）
- GitHub Free の GitHub Actions は、非公開のリポジトリで毎月12ドル分（Linux で約2,000分）まで無料で使える（GitHub のドキュメント「GitHub Actions billing」、2026-10-30 確認: https://docs.github.com/en/billing/concepts/product-billing/github-actions ）
- GitHub の利用規約の B.3 は、1つのログインを複数の人で使うことを認めていない（「a single login may not be shared by multiple people」。GitHub Terms of Service、2026-10-30 確認: https://docs.github.com/en/site-policy/github-terms/github-terms-of-service ）。そのため、会社のサイトでは Organization を作って、人ごとのアカウントを招く（account-setup.md）
- スケジュールタスクの cron の式は、5つの欄だけなら時刻を UTC で読む（`0 9 * * 1-5` は UTC の 9:00）。入力欄の先頭に `CRON_TZ=` があるときは、残してそのタイムゾーンで書くか、消して UTC で書く。1時間より短い間隔の式は受け付けない。1回だけの予定の日時は、画面でローカルのタイムゾーンで入れる（Claude Code のドキュメント「Scheduled tasks」の Add a schedule trigger、2026-10-30 確認: https://code.claude.com/docs/en/routines ）。`CRON_TZ=` を自分で書き足して受け付けられるか、次の実行の予定がどのタイムゾーンで表示されるかは書かれていない（未確認。作者が配布元の README の「版の付け方」の手順3で確かめる）
- GitHub の2段階認証の復旧コードは16個で、1つずつ1回だけ使える。あとからは Settings → Password and authentication の Recovery codes の View で見られる。作り直すと前のコードは使えなくなる。設定のときの保存の方法は Download、Print、Copy の3つ（GitHub のドキュメント「Configuring two-factor authentication recovery methods」、2026-10-30 確認: https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa/configuring-two-factor-authentication-recovery-methods ）
- Cloudflare の2段階認証の復旧コード（backup codes）は、設定のときに Download、Print、Copy で保存する。1つずつ1回だけ使える。My Profile → Authentication の Two-Factor Authentication の Manage で作り直せ、作り直すと前のコードは使えなくなる（Cloudflare のドキュメント「Two-factor authentication」、2026-10-30 確認: https://developers.cloudflare.com/fundamentals/user-profiles/2fa/ ）
- Cloudflare のセキュリティの確認の画面（チャレンジ）が返った応答には、ヘッダー `cf-mitigated: challenge` が付く（値は `challenge` だけ）。公開後の確認（`.github/scripts/smoke.sh`）は、これを失敗にせず警告にしている（Cloudflare のドキュメント「Detect a Challenge Page response」、2026-10-30 確認: https://developers.cloudflare.com/cloudflare-challenges/challenge-types/challenge-pages/detect-response/ ）
- STUDIO の 301 リダイレクト（リダイレクトページ）は Business プラン以上（旧プランは全プラン）で、転送元は接続中の独自ドメインのパスだけ。複数ページの一括の設定はできない（STUDIO ヘルプ 8366949、2026-10-30 確認: https://intercom.help/studiodesign/ja/articles/8366949 ）
- gh の `{owner}/{repo}` は、作業フォルダの origin か、環境変数 `GH_REPO` から置き換わる。origin が GitHub の住所でないと「none of the git remotes configured for this repository point to a known GitHub host」で止まる（gh 2.89.0 の `gh api --help` と手元の試し、2026-10-30）。クラウドの作業環境の origin が中継の住所かどうかは、作者が配布元の README の「版の付け方」の手順3で確かめる（未確認）。skills-install.md の非公開の確かめは、origin の URL から owner と repo を取り出して渡している
