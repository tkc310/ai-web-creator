# 2026-10-30 自動修正の権限、スレッドの始まるブランチ、引っ越しの転送と個人情報

- きっかけ: スキルの評価（4回目の修正）で見つかった不具合と不足。autofix の許可が広い（`Bash(git log:*)` で何でも書ける、Read が作業フォルダの外まで読める、範囲の外で止まったあとに作業フォルダのファイルが動きうる）。プロジェクトのスレッドは毎回 main から始まるのに、取り込んだ skills/ と SITE.md が作業用のブランチにしかない。`?p=` を Bulk Redirects で転送できると書いていた。WXR の個人情報と SPF の `a` を扱っていない。公開後の確認だけの失敗の Issue が自動修正を止める、など
- 変えたファイル: AGENTS.md、README.md、CHANGELOG.md、docs/how-to-use.md、skills/web-creator/references/（account-setup.md、analytics.md、build.md、client-handoff.md、connectors.md、deploy-and-autofix.md、migration.md、project-setup.md、quality-gate.md、skills-install.md、versions.md）、skills/web-creator/scripts/check_text.py、skills/web-creator/templates/（AGENTS.md.tmpl、CLAUDE.md.tmpl、SITE.md、project-instructions.md、gitignore.txt、github/smoke-test.txt、github/workflows/autofix.yml・deploy.yml）、skills/site-review/SKILL.md、skills/site-maintenance/SKILL.md

## やったこと

1. autofix.yml の Claude の権限を狭めた
   - Bash は `git log -5`、`git diff HEAD~1`、`git status` の3つを、`*` のない書き方で許可した。日付と時刻は、ワークフローが調べてプロンプトに入れる。Claude に check_text.py と date を動かさせない
   - Read、Glob、Grep を許可から外した。作業フォルダの中は許可なしで読め、外は claude-code-action の `settings` の入力で渡す `blockReadsOutsideWorkingDirectories` で断る。`.git/`、`/proc`、`/sys`、`.env*`、`.dev.vars*`、ホームの git の認証情報、`git *--output*`、`git -c`、`git -C`、WebFetch、WebSearch を拒否のルールにした
   - Edit の許可は `./` から始まるパスにした。Write のルールは書かない（Claude Code では当たらない。Edit の許可が Write にも効く）
   - 認証情報（`extraheader` など）の掃除を、Claude の実行の前の準備のステップにも入れた
   - check_text.py は、失敗した版のコミットから `git show` で `$RUNNER_TEMP` に写し、`python3 -I` で動かす（範囲の確認と Issue の本文の確認の両方）
   - 範囲の外、check_text.py がない、機密情報の疑いのときは、`git reset --hard` と `git clean -ffdx` で作業フォルダを戻してから Issue を立てる。Issue の本文も `$RUNNER_TEMP` に書く
2. Claude を起動しない知らせ（公開だけ、公開後の確認だけの失敗、ジョブの結果が読めない）の Issue を、ラベル `deploy-notice` にした。開いていても自動修正は止まらない。ビルドの段階の失敗は今までどおり `autofix`
3. 公開後の確認を直した。前に成功した deploy があるのに確かめたページが0件なら失敗にする（`gh api` で deploy.yml の成功した実行の数を読む。smoke のジョブに `actions: read` を足した）。つながらないときに待つ長さの合計を12分（`SMOKE_TOTAL_WAIT_SECONDS`）までにし、smoke のジョブの時間の上限を25分にした。deploy-and-autofix.md の確認の grep を `grep -nE '^[^#]*<'` にし、1ページのサイトでは `/news/` の行を消すと書いた
4. スキルの取り込みのコミットを、初回だけ `git push origin HEAD:main` で main にも入れる手順（初回の手順の8）を足した。取り込みのときに SITE.md を置き、作業用のブランチの名前を書く。build.md の9を「サイトの中身は初めての公開まで main に入れない（skills/、SITE.md、AGENTS.md、CLAUDE.md は除く）」にした。CLAUDE.md のひな形に、SITE.md の作業用のブランチに切り替えること、skills/ の SKILL.md を読むこと、skills/ を書き換えないことを、`@AGENTS.md` に加えて直接書いた
5. 取り込みの手順で、コミットしていない skills/ が残っているだけなら消して進めるようにした（コミットした変更があれば今までどおり終了コード2）。main の確認を `git ls-remote --exit-code --heads origin main` にし、`set -euo pipefail` にした。zip で取り込んだサイトの更新の手順を足した
6. account-setup.md の手順9（通信の許可に github.com を足す）を消し、GitHub の操作は通信の許可と関係なく専用の中継を通ると書いた（skills-install.md、versions.md も）
7. migration.md を直した
   - `?p=` は `_redirects` でも Bulk Redirects でも条件にできず、リダイレクトのルール（無料で10件）だけで転送できる、とした。まずパーマリンクの設定を確かめ、投稿名の形なら対応は要らない、基本の形なら引っ越しの前に投稿名に変える、残りは10件まで、それでも足りなければ Worker（要保守構成）をオーナーに相談、の順を書いた
   - WXR に個人情報（投稿者、コメントした人の名前、メールアドレス、IP アドレス）が入ること、社内の決まりの確認と、だめなら公開ページから取り出す分岐、リポジトリの外で読みコミットしないこと、終わったら消すことを書いた。`.gitignore` のひな形に `*.WordPress.*.xml` と `wordpress-export*.xml` を足した
   - 段階1に SPF の `a` を書き換える手順（7）を足し、DNSSEC を調べる・有効にするのをエージェント、DS の登録をオーナーにそろえた（8）
   - 段階2の手順1を「最新の版にする」と「変わったページと大事な10ページを確かめてもらう」にした。studio.site の住所のままの場合と、管理者の権限がない場合を足した
8. Claude の GitHub アプリでワークフローのファイルを push できないときの手順を deploy-and-autofix.md に書き、取り込みの更新、引き渡し、保守の Dependabot のマージから参照した
9. プロジェクトのスレッドが確認を待つときの手順（Overview の「Waiting on you」）を project-setup.md と docs/how-to-use.md に書いた。プロジェクトの指示と AGENTS.md のひな形に、main に入れる前はスレッドの中で確かめる、制作中は作業用のブランチから始める、を足した
10. connectors.md の Cloudflare のコネクタの権限に、アクセス解析、転送のルール、DNSSEC を足し、権限が足りないときにつなぎ直すか、オーナーがダッシュボードで操作する分岐を書いた
11. client-handoff.md の新しいリポジトリの手順を、お客さまが README なしで作る → 制作者を招待し GitHub アプリに許可する → 制作者がセッションに足す → Claude が push する → お客さまが Secrets を入れる、の順にした。お客さまが購入者かは本人に聞き、SITE.md に残す
12. site-review の「担当者が代わったとき」を、引き継ぐもの4つ、後任の Claude で作り直すもの4つ、前の担当者が外すものに分け、「Claude は担当者ごとの契約」と書いた
13. AGENTS.md の利用条件（日本語と英語）に、お客さまのサイト（LICENSE の 2）を足した
14. analytics.md の最初の文を「独自ドメインをつないだときに」にそろえた
15. README の「版の付け方」に、タグとリリースは作者のパソコンで行うこと（クラウドのセッションの中継はタグの push を拒否する）と、手順3（使い捨てのリポジトリで取り込みから公開まで通す、2つ目のスレッドから見えるか、ワークフローのファイルを足して push できるか）を足した。手順4に、ラベルの確かめと、Claude が `.git/config` と `/proc` を読めないことの確かめを足した。CHANGELOG のタグのない見出しを版の見出しの下にまとめる、と書いた
16. 小さな直し: check_text.py が、前後が絵文字の ZWJ（U+200D）を見えない文字に数えないようにした。quality-gate.md と account-setup.md の「機能」に「Capabilities」を併記した

## 確認したこと

- YAML: autofix.yml、deploy.yml、check.yml、dependabot.yml を `python3 -c "import yaml; yaml.safe_load(...)"` で読み込めた。ワークフローの run のシェルを YAML から取り出して、すべて `bash -n` で通した。deploy.yml と autofix.yml の公開後の確認のシェルが同じであることを diff で確かめた
- 公開後の確認（手元の HTTP サーバーと偽の gh で試した）: ファイルなしは初めてなら警告で終了コード0、2回目以降は失敗。`<...>` の行だけのときも同じ。200 と `&amp;` を含む文字は OK。つながらない2ページでは、1ページ目が待つ長さまで待ち、2ページ目は合計の上限に達していたので1回で終えた
- 範囲の確認（一時的な git リポジトリで、YAML から取り出したシェルを動かした）: 記事とログは `fix(autofix):`、ログだけは `chore(autofix):`。`scripts/pathlib.py` を足した場合、scripts/check_text.py を書き換えた場合、秘密の文字列を足した場合、失敗した版に check_text.py がない場合は止まり、作業フォルダは元に戻った（`git status` が空）
- skills-install.md の手順（文書のかたまりを取り出し、配布元を手元の git リポジトリに置き換えて試した）: 8つのかたまりが `bash -n` で通った。初回の取り込み、コミットしていない skills/ が残っているだけの再実行（消して進む）、コミットしていない変更だけ（消して進む）は通り、コミットした独自の変更は終了コード2で止まった
- check_text.py: 家族、肌の色つきの職業、ハートと炎の ZWJ の絵文字は0件、文字の間の ZWJ と ZWSP は検出した。`python3 -m py_compile` で通った。skills/、LICENSE、README.md、prompts/、docs/（docs/logs/ を除く）、AGENTS.md、CHANGELOG.md で0件
- 検索で確かめた事実（2026-10-30）:
  - クラウドの作業環境の GitHub の中継は、タグの push とブランチの削除を拒否する。GitHub の操作は access level と関係なく専用の中継を通る: https://code.claude.com/docs/en/cloud-environments
  - プロジェクトのスレッドは既定のブランチから新しいブランチを作って始まり、始めるブランチは頼みごとかプロジェクトの指示で変えられる。確認はスレッドの中に出て、プロジェクトの会話からは答えられない。クラウドのスレッドは `.claude/settings.json` の許可のルールを読まない: https://code.claude.com/docs/en/claude-projects
  - CLAUDE.md の `@パス` の読み込み（相対パスは CLAUDE.md のある場所から。外を指すときだけ承認の画面）: https://code.claude.com/docs/en/memory
  - 許可のルール（`:*` は後ろの `*` と同じ、`*` のない書き方は完全一致、`Write(パス)` は当たらず Edit の許可が書き込みに効く、`//` で始まる絶対パス、Read の拒否は cat などにも効く）: https://code.claude.com/docs/en/permissions
  - `permissions.blockReadsOutsideWorkingDirectories`（v2.1.257 以降）: https://code.claude.com/docs/en/settings-reference 。claude-code-action の `settings` の入力は JSON の文字列を受け取る: https://github.com/anthropics/claude-code-action/blob/main/docs/usage.md
  - `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB`（鍵を取り除き、`GITHUB_TOKEN` は残す。Linux では /proc から他のプロセスの環境を読めない）: https://code.claude.com/docs/en/env-vars
  - Bulk Redirects の転送元にクエリ文字列は書けない: https://developers.cloudflare.com/rules/url-forwarding/bulk-redirects/reference/url-components/ 。Single Redirects は無料のプランで10件: https://developers.cloudflare.com/rules/url-forwarding/#availability
  - WordPress のエクスポートには、投稿、コメント、カスタムフィールド、ユーザーなどが入る: https://wordpress.org/documentation/article/tools-export-screen/
  - Cloudflare の API の MCP サーバーは、権限を選んで接続でき、足りない権限は step-up authorization で求める: https://developers.cloudflare.com/changelog/post/2026-08-22-wrangler-mcp-optional-oauth-scopes/ 、https://developers.cloudflare.com/changelog/post/2026-10-19-cloudflare-mcp-step-up/

## 確認できなかったこと

- 配布元の main へのマージ、タグ（v2026.11.0）、リリースへの zip の添付。作者が行う作業で、タグはクラウドのセッションからは push できないため、行っていない
- GitHub Actions の上での動き: claude-code-action の中で `settings` の入力、`--disallowedTools`、`blockReadsOutsideWorkingDirectories` が効き、Claude が `.git/config` や `/proc` を読めないこと。Edit の許可で新しいログのファイルを作れること。claude-code-action が実行の間に git の設定へ認証情報を書くか。smoke のジョブの `gh api` で deploy.yml の成功した実行の数が読めること。README の「版の付け方」の手順3と4で確かめる
- プロジェクトのスレッドで `@AGENTS.md` が読み込まれるか（文書に書かれていない）。CLAUDE.md に決まりを直接書いて補った
- Claude の GitHub アプリでワークフローのファイルを push できないという報告（Issue の題名だけを見た）。代わりの手順を書いた
- Cloudflare のコネクタの権限の画面で、アクセス解析、転送のルール、DNSSEC がどの名前で出るか。Claude のコネクタで step-up authorization の追加の許可が出るか

## 次回の改善点

- 作者が README の「版の付け方」の手順3と4を行ったら、結果（ワークフローのファイルの push、`@AGENTS.md`、autofix の読めない範囲）を versions.md に書き、未確認の記述を直す
- Cloudflare のコネクタの権限の名前を実機で確かめ、connectors.md に書く
- concurrency で取り消された deploy を autofix が拾い直すか（評価の low。今は新しい版の deploy が動くので直していない）
