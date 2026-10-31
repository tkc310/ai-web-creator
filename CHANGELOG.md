# CHANGELOG

## v2026.11.0（未リリース）

最初のタグ `v2026.11.0` で出す版です。下の日付の見出し（2026-10-30 から 2026-10-31 まで）の変更をまとめて含みます。タグを打つ日に「未リリース」を日付に書き換えます（README の「版の付け方」の手順2）。

### 2026-10-31

- feat(skills): 作り終えた静的なサイトで、更新しない月に Claude を無料のプラン（Free）に下げる使い方に対応した。下げる前の確認（要保守構成でないか、予約投稿、開いている Issue とプルリクエスト、確認待ち、最新の公開、鍵の種類）と、Pro に戻した日の作業（スケジュールタスクがオンか、無料の月の GitHub の画面での編集を監査ログに書く、Issue の片付け、保守と振り返りをまとめて1回）を足した。SITE.md に「Claude のプラン」を足し、「無料の月」のまま会話が始まったら戻した日の作業を先に行う（site-review、site-maintenance、templates/SITE.md、templates/AGENTS.md.tmpl、templates/CLAUDE.md.tmpl、templates/project-instructions.md、AGENTS.md）
- feat(skills): autofix で、自動修正用の鍵が受け付けられなかったとき（`execution_file` の `authentication_failed` など）を見分け、「Claude が無料のプランなどで使えないため、自動修正は止まっています。Pro に戻すか、GitHub の画面で直してください」という Issue（ラベル autofix-paused）にした。自動修正を止めず、同じ Issue にコメントを足し、自動修正がまた動いたら閉じる。見分けられないときの「考えられる原因」の先頭に無料のプランを足した（autofix.yml、deploy-and-autofix.md）
- docs(skills): オーナー向けの README に、無料の月に GitHub の画面で記事の文章を直す手順（5手順）、写真と新しい記事は Pro に戻してから、失敗したときと戻し方、Pro に戻した日に送るひと言を足した（templates/README.owner.md、docs/how-to-use.md、docs/claude-account.md、prompts/README.md）
- docs: プランの前提（Free では Claude Code とスケジュールタスクが使えない、鍵の発行は Pro 以上、解約は支払った期間の終わりに効く、止まっていたスケジュールタスクはオンに戻す）と、認証の失敗の出方を versions.md にまとめ、README の「必要なもの」「注意」と routine-setup.md をそろえた。README の「版の付け方」の手順4に、違う鍵と無料のプランの鍵で autofix-paused の Issue が立つかを確かめる手順を足した（versions.md、README.md、routine-setup.md）

### 2026-10-30（6）

- fix(skills): 保守と振り返りのスケジュールタスクの cron の式を、UTC の書き方（`7 0 1,15 * *`、`13 0 1 * *`。日本時間の 9:07 と 9:13）に直した。5つの欄だけの式は UTC で読まれるため、前の式では日本時間の 18:07 に動いていた。入力欄に `CRON_TZ=` があるときの書き方と、次の実行の予定の確かめ方を足した（routine-setup.md、site-review、site-content-update の予約投稿、versions.md）
- fix(skills): GitHub と Cloudflare の2段階認証で、復旧コードを保存する手順と、保存したかを返事で確かめる手順を足した。オーナーの操作と時間の一覧を account-setup.md の先頭に置き、SITE.md にチェック欄を足した。QR コード、復旧コード、鍵が表示される画面ではスクリーンショットを撮らない（account-setup.md、templates/SITE.md）
- fix(skills): スキルの取り込みの C の版を、main の MANIFEST.txt の `# tag:` から決め、そのタグからファイルを取るようにした（`git ls-remote` を使わない）。`skills/VERSION` の C の行を `commit: none`、`fetched:`、`manifest:` に分け、更新は `manifest:` で見分ける。B と C の更新で止まっていた `VERSION` の読み方を直した。非公開の確かめは origin の URL から owner と repo を取り出して渡す。SITE.md の作業用のブランチの名前を、記号や注記を除いて読む（skills-install.md、templates/SITE.md、deploy-and-autofix.md、versions.md）
- fix(skills): 引き継ぎ文とプロジェクトの指示は、最初に raw.githubusercontent.com から skills-install.md を1つだけ取って読み、取れなければ clone する形にした（templates/handoff.md、templates/project-instructions.md、prompts/README.md）
- fix(skills): B の zip を、会話に添付できないときに GitHub の画面でサイトのリポジトリの別のブランチに置く道（B2）と、`unzip` がないときの `python3 -m zipfile` を足した。zip に CHANGELOG.md を入れる（skills-install.md、README.md）
- fix(skills): 公開後の確認を `.github/scripts/smoke.sh` にまとめ、deploy と autofix の両方で使うようにした。Cloudflare のセキュリティの確認の画面（`cf-mitigated: challenge`）は失敗にせず警告にし、`.github/smoke-test.txt` に期待する状態（`405` など）を書けるようにした（templates/github/scripts/smoke.sh、deploy.yml、autofix.yml、smoke-test.txt、deploy-and-autofix.md、build.md、SKILL.md）
- fix(skills): プレビューを必ず見せる例外を、要点から作った下書きのほかに、数字の変更、ページの部品の変更、人が写っている写真の追加や差し替えにも広げた（preview.md、site-content-update、SKILL.md、templates/SITE.md、templates/project-instructions.md、prompts/README.md）
- fix(skills): check_text.py が原稿で止める書き方に、meta、base、form、link、style、svg のタグ、`on` で始まる属性、`formaction=`、`data:text/html` を足し、記事のデータの JSON と YAML も調べるようにした（scripts/check_text.py、security-rules.md）
- fix(skills): autofix の Issue で、Claude が途中で止まったときの原因の候補を並べた。check_text.py がないときの頼み方を、skills/ のないリポジトリでも通る形にした。データの .yml の扱いを許可の範囲とそろえた。CLAUDE.md のひな形とプロンプトに、自動修正でも安全の決まりは守ると書いた（autofix.yml、templates/CLAUDE.md.tmpl、deploy-and-autofix.md）
- fix(skills): 作り始めの順番を、`.node-version`、`pnpm-workspace.yaml`、`packageManager` を置いてから `pnpm install` を1回だけ行う形にした（build.md）
- fix(skills): 引っ越しで、studio.site の住所のままのサイトは STUDIO の 301 で転送できない（転送元は接続中の独自ドメインのパスだけ）と、確かめた事実に書き換えた。`?p=` のパーマリンクを変える前に、データベースのバックアップを取る手順を足した（migration.md、versions.md）
- docs: LICENSE の 4 に、サイトのために使い続けてよいものと、渡すときに除くもの（skills/、prompts/ など）を名前で挙げた。引き渡しで Watch を付け替える手順を足した（LICENSE、client-handoff.md）
- chore: 配布元の確かめのワークフロー（check-skills.yml。Markdown とワークフローの bash の構文、YAML、check_text.py、MANIFEST.txt、古い構成の記述）と、改善点を送る Issue の書式を足した（.github/、run-logs.md、README.md）
- docs(skills): 担当者が代わったときは、会社のサイトでは Organization に招待する形だけにした（共同作業者の道を外した）。ムームードメインのネームサーバーの変更は、Claude がコネクタでできるかを確かめ、できなければオーナーが画面で行う、にした（site-review、account-setup.md、connectors.md、migration.md）
- docs: README の「版の付け方」に、実機で確かめること（最初の入口、raw の手順書、origin の形と `GH_REPO`、zip の添付と Upload files、`CRON_TZ=`、405 の行と確認の画面、鍵がないときの Issue）と、main に直接入れる例外を書いた。プルリクエストを作る場合にメジャーの更新を足し、Google フォームと Search Console の共有のアカウントの勧めをやめた（README.md、templates/AGENTS.md.tmpl、templates/project-instructions.md、SKILL.md、forms.md、quality-gate.md）

### 2026-10-30（5）

- fix(skills): 無人の保守（スケジュールタスク）でプルリクエストをマージしないようにした。パッチとマイナーの更新は、ビルドと確認が通ったら `git push origin HEAD:main` で main に入れ、メジャーと GitHub Actions の更新はプルリクエストを残して、次の会話でオーナーの OK をもらってから入れる。止められた操作はやり直さず、プルリクエストと SITE.md の「オーナーへの確認待ち」に残す。`git clean` と `git reset --hard` を使わない確かめ方にした（site-maintenance、routine-prompt.md、routine-setup.md、runtime-update、site-review、templates/AGENTS.md.tmpl、templates/SITE.md、versions.md）
- fix(skills): check_text.py が、ログ（`logs/`、`audit-log/`）の iframe のタグなどの書き方で、自動修正を誤って止めていたのを直した。ログは埋め込みの書き方を調べず、`--no-markup` と、失敗の前からあった指摘を除く `--baseline` を足した。autofix は失敗した版の記事を写して比べ、新しく増えた指摘だけで止まる（scripts/check_text.py、autofix.yml、deploy-and-autofix.md）
- fix(skills): autofix の Claude が、サイトの CLAUDE.md と AGENTS.md の作業の決まりに従わず、ワークフローのプロンプトだけに従うようにした。`env`、`printenv` などを拒否の規則に足し、ログにタグを山かっこのまま書かないようにした。操作の回数の上限で止まったときの Issue の文を、鍵や利用の上限のときと書き分けた（autofix.yml、templates/CLAUDE.md.tmpl、deploy-and-autofix.md、versions.md）
- fix(skills): スキルの取り込みで `git clone` が失敗したときに、raw.githubusercontent.com から一覧（`MANIFEST.txt`）のファイルを取って SHA-256 で確かめる道（C）を足し、それも通らなければ推測せずにリリースの zip（B）を頼むようにした。取り込みと更新の前に、サイトのリポジトリが非公開かを `gh api` で確かめる。初回の main への push の前にオーナーの OK をもらう。2回目以降のスレッドで作業用のブランチに切り替える手順と、浅い clone の更新の手順を足した（skills-install.md、templates/handoff.md、templates/project-instructions.md、templates/CLAUDE.md.tmpl、templates/AGENTS.md.tmpl、prompts/README.md、client-handoff.md、README.md）
- fix(skills): 会社のサイトでは、GitHub の Organization にリポジトリを置き、1人1つのログインで使うのを標準にした（GitHub の規約の B.3）。Cloudflare には2人目の Super Administrator を招く。担当者が代わったときは、Organization への招待を標準にし、共有のログインの引き継ぎをやめた。作り直すものに CLOUDFLARE_API_TOKEN を、引き継ぐものにドメインの会社の担当と連絡先を足し、外すものを5つにした（account-setup.md、site-review、client-handoff.md、templates/SITE.md、README.md、docs/how-to-use.md）
- fix(skills): プレビューの直し方を、プランで分けた。Pro と Max はチャットで伝え、Team と Enterprise はプレビューの上のコメントで伝える。共有の注意（Pro と Max はリンクで誰でも開ける、確認のあとに止める）を足した（preview.md、site-content-update、article-tutorial.md、SKILL.md、docs/how-to-use.md、README.md）
- fix(skills): 予約投稿で、OK をもらったコミットを SITE.md とタスクの本文に書き、公開のときに記事と画像が変わっていたら公開せずに止まるようにした（site-content-update）
- fix(skills): ワークフローのファイルを push できないときの標準を、GitHub の画面の「Upload files」にし、`git pull --ff-only` と `cmp` で確かめるようにした。Issue を `gh api` で作る書き方と、使えないときに SITE.md に書く道を足した。1ページのサイトでは autofix が効きにくいことを書いた（deploy-and-autofix.md、templates/README.owner.md、site-maintenance）
- fix(skills): 引っ越しに、`?p=` のパーマリンクを変える段階（1-0。変える前の控えと戻し方）、切り替えの前日の保存、解約の前に保存したファイルが開けるかの確認を足した。MX はメールの会社が案内する名前を先にした。WXR の添付の場所を探して移す手順と、添付できないときと管理者の権限がないときに `/wp-json/wp/v2` から取る道を足した（migration.md）
- docs(skills): 通信の許可は、Claude Code で初めて公開するときに頼む。プロジェクトでは Project settings の General と Environment から設定を開く（account-setup.md、quality-gate.md、SKILL.md、docs/claude-account.md）
- docs: 段階1で「Code execution and file creation」が要ることと、オンにできないときにリリースの zip のファイルを添付する道を書いた。版の確かめ方を「v で始まる版の名前」にした。README の「版の付け方」に、`MANIFEST.txt` の作り方、`gh auth login`、実機で確かめること（clone、raw、新しいフォルダへの Upload files、Pro のコメント、更新、保守の1回の実行、`env` の拒否、上限の Issue）、versions.md への記録を足した（docs/how-to-use.md、README.md、versions.md）
- chore(skills): 保守の間隔の書き方を「毎月1日と15日」にそろえ、GitHub Actions の無料枠を「毎月12ドル分」にそろえた（README.md、forms.md、stack-selection.md、SKILL.md、runtime-update、dependabot.yml、docs/forms.md、docs/other-agents.md、deploy-and-autofix.md）
- docs(site-review): 記事を買った note のアカウントのログインは、note の規約で確かめるまで後任に渡さない、とした（記事とそろえる）

### 2026-10-30（4）

- fix(skills): 自動修正（autofix.yml）で Claude に渡す権限を狭めた。Bash は引数まで決めた `git log -5`、`git diff HEAD~1`、`git status` だけにし（`Bash(git log:*)` では `--output=` でどのファイルにも書けた）、日付はワークフローがプロンプトに入れる。Read、Glob、Grep を許可から外し、作業フォルダの外を読ませない設定（`blockReadsOutsideWorkingDirectories`）と、`.git/`、`/proc`、`/sys`、`.env*`、`.dev.vars*`、ホームの認証情報、git の書き出しのオプション、WebFetch と WebSearch の拒否を足した。認証情報の掃除を Claude の実行の前にも行う。scripts/check_text.py は、失敗した版のコミットから `git show` で `$RUNNER_TEMP` に写して `python3 -I` で動かす。範囲の外や機密情報の疑いのときは `git reset --hard` と `git clean -ffdx` で作業フォルダを戻す（autofix.yml、deploy-and-autofix.md、versions.md）
- fix(skills): Claude を起動しない知らせ（公開だけ、公開後の確認だけの失敗など）の Issue を、ラベル `deploy-notice` にし、開いていても自動修正を止めないようにした（autofix.yml、deploy-and-autofix.md、README.md）
- fix(skills): 公開後の確認で、確かめたページが0件のときは、2回目以降の公開で失敗にした。すべてのページで待つ長さの合計に12分の上限を設け、smoke のジョブの時間の上限を25分にした。ひな形の確認の grep をコメントの行に当たらない形にし、1ページのサイトでは /news/ の行を消すと書いた（deploy.yml、autofix.yml、smoke-test.txt、deploy-and-autofix.md）
- fix(skills): スキルの取り込みのコミットを、初回だけ `git push origin HEAD:main` で main にも入れるようにした（プロジェクトのスレッドは毎回 main から始まるため）。SITE.md を取り込みのときに置き、作業用のブランチの名前を書く。CLAUDE.md のひな形に、SITE.md の作業用のブランチに切り替えることと、skills/ の SKILL.md を読むことを直接書いた（skills-install.md、build.md、templates/CLAUDE.md.tmpl、AGENTS.md.tmpl、project-instructions.md、versions.md）
- fix(skills): 取り込みの手順で、コミットしていない skills/ が残っているだけなら消して進める、main の確認を `git ls-remote --exit-code --heads origin main` にする、`pipefail` を付ける、を直した。zip で取り込んだサイトの更新の手順（2つの skills/ を `diff -r` で比べる）を足した。通信の許可に github.com を足す手順（account-setup.md の手順9）を消した（skills-install.md、account-setup.md、versions.md）
- fix(skills): 引っ越しで、`?p=` の転送は Bulk Redirects でも `_redirects` でもできず、リダイレクトのルール（無料で10件）だけで行うと直し、パーマリンクの設定を確かめる順を書いた。WXR の個人情報の扱い（社内の決まりの確認、リポジトリの外で読む、コミットしない、終わったら消す）と、`.gitignore` の除外を足した。SPF の `a` の書き換え、DNSSEC の分担、切り替えの当日の確かめ方、studio.site の住所のままの場合、管理者の権限がない場合を足した（migration.md、templates/gitignore.txt）
- docs(skills): Claude の GitHub アプリでワークフローのファイルを push できないときの手順（オーナーが GitHub の画面で置く、Dependabot のマージを押す）を書いた（deploy-and-autofix.md、skills-install.md、client-handoff.md、site-maintenance）
- docs(skills): プロジェクトのスレッドが確認を待つときに、Overview の「Waiting on you」から許可を押す手順と、公開の前の「OK」はスレッドの中で返すことを書いた（project-setup.md、docs/how-to-use.md、templates/project-instructions.md、templates/AGENTS.md.tmpl）
- docs(skills): Cloudflare のコネクタの権限に、アクセス解析、転送のルール、DNSSEC を足し、権限が足りないときの分岐（つなぎ直す、オーナーがダッシュボードで操作する）を書いた（connectors.md、versions.md）
- docs(skills): お客さまの新しいリポジトリへの引き渡しの順番を、作る → 招待と許可 → セッションに足す → push → Secrets にした。お客さまが購入者かは本人に聞いて SITE.md に残す（client-handoff.md、templates/SITE.md）
- docs(skills): 担当者が代わったときを、引き継ぐものと後任の Claude で作り直すもの、前の担当者が外すものに分けた。GitHub と Cloudflare は後任を招待するのを標準にし、共有のアドレスで作った場合だけパスワードと2段階認証のアプリを移す（site-review）
- docs: AGENTS.md の利用条件に、お客さまのサイト（LICENSE の 2）を足した。アクセス解析を有効にする時期を「独自ドメインをつないだとき」にそろえた。README の「版の付け方」に、タグは作者のパソコンから push することと、ワークフローのファイルを足して push できるかの確認を足した（AGENTS.md、analytics.md、README.md）
- chore(skills): check_text.py が、絵文字をつなぐ ZWJ を見えない文字として数えないようにした。設定の画面の「機能」に英語の名前（Capabilities）を併記した（scripts/check_text.py、quality-gate.md、account-setup.md）

### 2026-10-30（3）

- docs(license): 受託制作の「受託ライセンス（1サイト分）」をやめた。解説記事の購入者は、お客さまのサイトの制作と保守にも使える（お客さまごとの追加の購入はない）。お客さまのサイトの非公開のリポジトリに skills/ を置けるのは制作か保守を続けている間だけで、手を離すときは、お客さまが購入者でなければ skills/ を除く。お客さまにスキルそのものを渡すことと販売は禁止のまま。変更前に購入した人の利用は、LICENSE の 6 のとおり続けられる（LICENSE、README.md、stack-selection.md、skills-install.md、hearing.md、templates/SITE.md、templates/handoff.md）
- feat(skills): お客さまにサイトを引き渡すときの手順を足した（鍵とスケジュールタスクの片づけ、skills/ と skills/ への参照を外す、git の履歴の扱い、権限を外す、引き渡したあとの公開の確認）（新規 references/client-handoff.md、SKILL.md、README.md）
- fix(skills): deploy.yml を build、publish、smoke の3つのジョブに分け、autofix がジョブの名前と結果で失敗の段階を見分けるようにした。Claude を起動するのはビルドの失敗のときだけにし、公開の段階だけの失敗、公開後の確認だけの失敗、鍵がないときなどは、Issue を立てて実行を成功で終える。concurrency をジョブの単位に移した。Issue の本文を、公開中のサイトが前回の版か新しい版か、Claude の実行が止まった（鍵の期限切れか利用の上限）、などで書き分け、Claude が調べた原因を確かめてから入れる。ログだけの変更は `chore(autofix):` にして回数に数えない。check_text.py がなければ公開せずに止まる（deploy.yml、autofix.yml、deploy-and-autofix.md、SKILL.md、README.md、site-maintenance）
- fix(skills): 公開後の確認で、つながらないときと 5xx のときは最大8分待つようにし、独自ドメインにつないだ直後の失敗で取り消す前に確かめ直す手順を足した（deploy.yml、autofix.yml、deploy-and-autofix.md、migration.md、prompts/README.md）
- fix(skills): スキルの取り込みの手順を、1回の Bash の呼び出しで実行する2つのかたまりにし、作業用のフォルダを固定した。clone した版の手順を読み直す、main があるかを確かめる、skills/ の独自の変更を見つける、写したものが一致するかを確かめる、を足した。リリースの zip から取り込む手順を書いた。配布元は `git clone` で取得すると書いた（skills-install.md、security-audit.md、templates/handoff.md、templates/project-instructions.md、prompts/README.md、account-setup.md、README.md）
- fix(skills): 公開は main への push で、プロジェクトのスレッドの作業用のブランチからは、オーナーの OK のあとに `git push origin HEAD:main` で入れると書いた。クラウドの作業環境では `gh pr` と `gh issue` が使えないので、`gh api` に置き換え、ブランチを消さないようにした（templates/project-instructions.md、templates/AGENTS.md.tmpl、SKILL.md、site-maintenance、deploy-and-autofix.md、versions.md）
- fix(skills): サイトのリポジトリを README つきで作るようにした（account-setup.md、docs/how-to-use.md）
- fix(skills): 自動修正用の鍵の期限を毎月の振り返りで確かめ、発行から11か月で作り直しを頼むようにした。発行日を書く場所を SITE.md の「技術」にそろえた（site-review、account-setup.md、templates/SITE.md）
- fix(skills): 依存パッケージの待ち期間（minimumReleaseAge）を1日から3日にし、astro、@astrojs/cloudflare、wrangler のメジャー更新は自動でマージしないようにした（pnpm-workspace.yaml、versions.md、runtime-update、site-maintenance、site-review、build.md、security-audit.md、README.md）
- fix(skills): お問い合わせフォームのひな形で、送信回数の制限を Turnstile の確認のあとに移し、確認の失敗を受けるようにした（templates/forms/contact-handler.ts、forms.md）
- feat(skills): 利用の上限で止まっても続けられるよう、作業のまとまりごとのコミットと push、SITE.md の「制作の進み具合」、再開のひと言、監査の前の確認を足した（build.md、templates/SITE.md、SKILL.md、security-audit.md、templates/project-instructions.md）
- feat(skills): 予約投稿を1回だけ動くタスクにし、日時の連絡、SITE.md への記録、公開されたかの確認を足した。画像の処理の前に Pillow を確かめるようにした（site-content-update）
- chore(skills): wrangler を devDependency に入れて版を固定する、`cp -R --update=none` にする、templates の CLAUDE.md と AGENTS.md を .tmpl の名前にする、node-version.txt を埋めて使うひな形にする、カスタムコネクタの URL を書く、アクセス解析の1文をプレビューで見せる、取り込みのコミットでは check_text.py に `--exclude skills` を付ける、を直した。skills/ の説明の文の書き方を変え、check_text.py の誤検出をなくした（build.md、runtime-update、templates/、account-setup.md、analytics.md、security-rules.md、forms.md、新規 templates/forms/google-form-embed.html、project-setup.md）
- docs: main にはタグを打つ版だけを入れること、リリースに zip を付けること、最初のタグの前に自動修正の3つの経路を確かめることを、版の付け方に書いた（README.md、AGENTS.md）

### 2026-10-30（2）

- fix(skills): 自動修正（autofix.yml）の安全を固めた。変えてよい範囲を記事、画像、ログ（`src/content/`、`src/assets/`、`public/` の画像、`logs/`、`audit-log/`）に絞り、.astro やレイアウトの修正は Issue にしてオーナーに知らせる。checkout に `persist-credentials: false` を付け、Claude が使えるツールをパスつきの Edit に限り、範囲の確認と秘密の確認をビルドより前に移し、コミットした状態から作り直して公開する。削除、symlink、実行ビット、`public/_redirects` を止める。日本語のファイル名で範囲の確認と秘密の確認が効かなかった不具合（git の既定の core.quotePath）を `core.quotePath=false` と `-z` で直した。`anthropic_api_key` も渡し、鍵がないときは Claude を起動せずに Issue にする。deploy と autofix を同じ concurrency の group にし、push の前に main が進んでいないかを確かめる（autofix.yml、deploy.yml、deploy-and-autofix.md、templates/AGENTS.md、security-rules.md、README.md）
- fix(skills): 公開後の確認（smoke-test）を直した。`<...>` が残った行は確かめずに警告を出し、初回の公開で必ず失敗しないようにした。`curl -L` で転送をたどり、`&amp;` の書き方を注記した。公開後の確認だけが失敗したときは Claude を起動せずに Issue にし、戻し方（git revert）を書いた（deploy.yml、autofix.yml、smoke-test.txt、deploy-and-autofix.md）
- fix(skills): check_text.py が、存在しないパス、読めない文字コードのファイルを「調べられない」として終了コード1で返すようにし、画像などのバイナリを飛ばし、`--exclude` を足した（scripts/check_text.py）
- feat(skills): Cloudflare の workers.dev のサブドメインを確かめ、なければ作る手順を足した。ネームサーバーは数日前、サイトの向き先は公開のときに切り替える、と時期を分けて書いた（account-setup.md、deploy-and-autofix.md、migration.md）
- fix(skills): スキルの取り込みの手順を、リポジトリの直下への移動、`mktemp -d` の作業用フォルダ、`scripts/` の作成、check_text.py の同期、タグがないときの `tag: none` に直した。タグがない間は main のコミットに固定し、古い main（skills-install.md がない版）は取り込まずに止める。プロジェクトのスレッドが読み込むものの説明を、ドキュメントに合わせて直した（skills-install.md、versions.md、site-review）
- feat(skills): 引き継ぎ文のテンプレートを足し、最初の段落を「skills-install.md の手順で取り込んでから」に固定した（新規 templates/handoff.md、SKILL.md、prompts/README.md）
- fix(skills): 「このファイルを直す」と「skills/ は書き換えない」の矛盾を、「skills/ は直さず、扱いを SITE.md に、違いを logs/IMPROVEMENTS.md に種類『スキル』で書く」にそろえた（stack-selection.md、forms.md、connectors.md、migration.md、skills-install.md、templates/project-instructions.md）
- feat(skills): 引っ越しの手順に、DNS の記録の控え（スクリーンショットかゾーンファイル、DKIM との照らし合わせ）、DNSSEC を止めたあとの待ち時間、MX がドメインそのものを指す場合、旧サイトを読む前の通信の許可、切り替えの瞬間の予告、末尾の / の転送を足した（migration.md）
- feat(skills): アクセス解析の手順を足した。独自ドメインをつないだときに Cloudflare Web Analytics を標準で有効にし、オーナーに聞かれたら数字を読んで答える。Google アナリティクスは希望されたときだけ入れる（新規 references/analytics.md、quality-gate.md、SKILL.md、templates/SITE.md、docs/how-to-use.md）
- docs(skills): 自動修正用の鍵を任意にし、発行の場所（パソコンに Claude Code を入れる例外）、所要時間、API キーの費用と上限を書いた（account-setup.md、SKILL.md、deploy-and-autofix.md、README.md）
- feat(skills): フォームのひな形で、許可する Origin を一覧（`SITE_ORIGINS`）にし、送信回数の制限（Rate Limiting のバインディング）と Turnstile のホスト名の確認を足した。`.gitignore` に `.dev.vars` を足した（templates/forms/、forms.md、gitignore.txt）
- fix(skills): Dependabot に cooldown を入れ、GitHub Actions の更新は自動でマージせずオーナーに確認するようにした。Lighthouse と security-audit の skills の版を固定した（dependabot.yml、site-maintenance、routine-prompt.md、site-review、run_lighthouse.sh、security-audit.md、versions.md）
- chore(skills): Node.js 26 が LTS になったため、templates/node-version.txt を 26 にした。Astro 7、pnpm 12 と、作業の日の最新の版を versions.md に書いた（versions.md、node-version.txt、build.md、runtime-update）
- fix(skills): `pnpm create astro` を一時フォルダで対話なしに動かしてから写すようにし、プレビューのサーバーと Playwright の準備を書いた。`<スキルの場所>` を `skills/<名前>/` に直した（build.md、preview.md、quality-gate.md、site-builder.md、site-content-update、SKILL.md）
- feat(skills): スキルの改善点は logs/IMPROVEMENTS.md に残すまでを標準にし、配布元に送るのは任意にした（run-logs.md、site-review、README.md）。年に1回の点検（鍵とトークンの期限、ドメインの更新）と、担当者が代わったときの手順を足した（site-review）
- docs(license): 受託制作は「受託ライセンス（1サイト分）」をお客さまのサイト1つにつき1つ購入する形にし、できること（お客さまの名義の非公開のリポジトリに置く、制作か保守を続けている間だけ）と、手を離すときに skills/ を除くことを書いた。購入した担当者が代わっても、後任が同じサイトのために使い続けられることを足した。変更前に購入した人の利用は、LICENSE の 6 のとおり続けられる（LICENSE、stack-selection.md、skills-install.md、README.md）
- docs: 最初に送る文章を配布元の URL つきにし、読み込んだ版を最初に答えてもらうようにした。読み込めないときの分かれ道、知らせが届く場所、アクセス数の見方、プロンプト（戻す、予約投稿、引き継ぎなど）を足し、使えない ZIP の登録の節を外した。Team と Enterprise はプロジェクトを使わない手順で進めることを書いた。最初のタグの打ち方と、更新の提供の続け方を README に書いた（README.md、docs/how-to-use.md、docs/claude-account.md、prompts/README.md、templates/README.owner.md、docs/verification/README.md）

### 2026-10-30

- refactor(skills): サイトはすべて Astro で作るようにした。1ページの LP も Astro で作り、HTML 直書きの構成と EmDash の構成をスキル、templates、scripts、docs、prompts、README から外した。標準は SSG で、アクセスのたびに処理が要るページだけ SSR（要保守構成）にする。対象外（記事が数千本を超えるメディア、公開後の投稿をお客さまが管理画面から行う受託制作、会員機能、コメント機能、EC、予約）を表にして判定を明確にした（stack-selection.md、build.md、SKILL.md、hearing.md、forms.md、preview.md、quality-gate.md、security-audit.md、article-tutorial.md、site-maintenance、runtime-update、site-review、site-content-update、templates、make_preview.py、docs/how-to-use.md、docs/forms.md、README.md）
- fix(skills): 自動修正（autofix.yml）が変えてよいパスを決め、範囲の外のファイルが変わっていたら push せずに Issue を立てて止まるようにした。過去24時間に3回、または自動修正の Issue が開いている間は動かない上限も入れた（autofix.yml、deploy-and-autofix.md、README.md）
- feat(skills): 公開後に、`.github/smoke-test.txt` に書いた主なページが 200 を返し、決めた文字を含むかを確かめるステップを deploy.yml と autofix.yml に足した（templates/github/smoke-test.txt、deploy-and-autofix.md、SKILL.md、templates/SITE.md、templates/AGENTS.md）
- fix(skills): 質問の上限を AskUserQuestion に合わせて「一度に4問、1問の選択肢は4つまで」にした。`package-lock.json` の記述を `pnpm-lock.yaml` に直し、依存パッケージの更新の間隔を保守と振り返りの間隔にそろえた（SKILL.md、hearing.md、deploy-and-autofix.md、templates/AGENTS.md、project-instructions.md、README.md、docs/how-to-use.md、prompts/README.md）
- feat(skills): 引っ越しの手順に、WordPress と STUDIO それぞれの中身の取り出し、URL の対応表と 301 リダイレクト、メタ情報、画像、フォーム、アクセス解析、メール、DNS の切り替え（TTL）、戻し方、旧サービスの解約時期を、出典つきで書いた（migration.md）。アカウントがすでにある場合の分岐を足した（account-setup.md）
- refactor(skills): モデル名、effort、ツールのバージョン、時点つきの事実を references/versions.md にまとめ、ほかのファイルからは参照するようにした（versions.md、SKILL.md、routine-setup.md、runtime-update、site-maintenance、dependabot.yml、autofix.yml、docs/how-to-use.md、README.md、AGENTS.md）
- feat(skills): 配布のしかたを、購入者のフォークから、サイトのリポジトリの `skills/` への取り込みに変えた。配布元の最新のタグを取り込み、版を `skills/VERSION` に残し、月1回の振り返りで新しい版をプルリクエストで提案する。解説記事に添付した zip から取り込む入口も用意した（新規 references/skills-install.md、account-setup.md、project-setup.md、site-review、routine-prompt.md、templates/AGENTS.md、project-instructions.md、site-builder.md、docs/how-to-use.md、docs/claude-account.md、prompts/README.md、README.md、AGENTS.md）
- docs(license): 利用できる人を、利用許諾が付くと記事の中で示している解説記事（マガジンを含む）の購入者にした。フォークの記述を、非公開のリポジトリへの複製に改め、サイトのリポジトリをほかの人に渡すときは skills/ を除くことを足した（LICENSE、README.md）。変更前に購入した人の利用は、LICENSE の 6 のとおり続けられる

## 2026-10-28（2）

- feat(skills): EmDash を選ぶ条件を、記事が数千本規模のメディアと、受託制作で顧客が AI を使わずに管理画面から投稿するサイトの2つにした。会員機能とコメント機能は、個人情報の持ち方しだいでセキュリティの穴になりやすいため対象外にし、コメント機能と閲覧権限をしぼる程度の会員機能は EmDash で安全に作れるが、開発に詳しくない利用者には推奨しないため対象外とする形にした（stack-selection.md、hearing.md、migration.md、security-audit.md、SKILL.md、templates/AGENTS.md、README.md）

## 2026-10-28

- feat(skills): EmDash を選ぶ補足のケースとして、受託制作で構築までを請け負い、公開後の記事の投稿は顧客が AI を使わずに管理画面から行う場合を追加。Claude に頼んで更新する本来の使い方から外れることを明記し、判定の条件、LICENSE の事前の許諾の確認、SITE.md に書く分担や権限、audit-log と自動修正の対象外になることを定めた（stack-selection.md、hearing.md、SKILL.md、README.md）

## 2026-10-25（2）

- feat(skills): EmDash を選ぶ条件を、会員機能やコメント機能が必要なコミュニティサイトで、外部のサービスでは足りない場合に変えた。記事の数、更新の頻度、管理画面の希望だけでは選ばない。数千本までは Astro の静的ビルドで足り、数千本を超えてビルドが負担になったら仕組みの見直しや乗り換えを検討する。EmDash のプラグインは安定していないものがあるため、必要な機能は Claude が実装する（stack-selection.md、hearing.md、migration.md、SKILL.md、README.md）
- feat(skills): 公開前と機能の追加・変更のときに、Cloudflare の security-audit スキルでリポジトリ全体を監査し、確定した脆弱性を直す手順を追加（references/security-audit.md、quality-gate.md、SKILL.md、templates/AGENTS.md、templates/SITE.md、docs/how-to-use.md、README.md）
- feat(skills): 改善ループの実行ログとは別に、記事・お知らせ・サイトの変更を記録する監査ログ（audit-log/YYYY/YYYY-MM-DD.md）を追加。変更と同じコミットに入れ、要約も削除もしない（references/audit-log.md、templates/audit-log.md、run-logs.md、site-content-update、site-maintenance、site-review、autofix.yml、templates/AGENTS.md、docs/how-to-use.md、README.md）

## 2026-10-25

- docs(verification): 数百〜数千本の記事を持つメディアを、JSON の事前ビルドと Workers の SSR で配信する構成を検証し、結果を docs/verification/2026-10-25_media-json-ssr/ に記録した。計測の元データ、ダミー記事の生成と Astro のビルド計測のソースを含む。数千本の Astro のビルドは約7秒で十分に速いため、JSON＋SSR の構成は採用しない。一覧と検索用の JSON はブラウザ側の検索に活用できる点、リクエストを Worker・CDN・R2 に分散させる方式が望ましい点も記載した。検証用のサンプル（example/media-json-ssr）は削除した（docs/logs/2026-10-25_media-json-ssr-example.md）

- fix(skills): optimize_images.py で、元の画像が指定の幅より小さいときに同じ幅のファイルを重ねて書き出し、srcset に重複して並んでいたのを直した（site-content-update）

- feat(skills): optimize_images.py に `--mode clean` を追加。Astro の `astro:assets` がビルド時に縮小と AVIF・WebP への変換をするサイトでは、スクリプトはメタ情報の削除と上限の幅までの縮小だけを行い、処理を重ねないようにした。`public/` に画像を置く標準の構成では Astro は変換しないため、従来どおりスクリプトで変換する（site-content-update）

- feat(skills): 記事・お知らせの追加を「Claude ドキュメントに原稿を書く → HTML のアーティファクトでプレビュー → OK で公開 → 記録」の標準の流れとして site-content-update に定めた。原稿のひな形を templates/article-draft.md に移し、チュートリアルはこの流れを一度通すものにした（site-content-update、references/article-tutorial.md、README.md）

- feat(skills): 記事のあるサイトで、公開後にオーナーと1本目の記事を追加するチュートリアルを追加。原稿の置き場所の指定がなければ Claude ドキュメントにひな形を作って書いてもらい、アーティファクトのプレビューで了承を得てから公開する。2本目からは「新しい記事の原稿を用意して」で同じ流れにする（references/article-tutorial.md、SKILL.md、site-content-update、templates/SITE.md、prompts/README.md、docs/how-to-use.md、docs/other-agents.md、README.md）

- feat(skills): デザイン案づくりと全ページの完成後に、frontend-design スキルでブラッシュアップする手順を追加。claude.ai のアカウントで有効にする使い方と、使えない場合の見直しの観点も記載（build.md、SKILL.md、docs/other-agents.md、README.md）
- feat(skills): スマホの表示を iPhone SE の幅（375px）と 320px でも確かめるようにした。作り方の決まりと、横スクロール、はみ出し、ヘッダーの折り返しを調べる scripts/check_mobile_width.py を追加（build.md、quality-gate.md、SKILL.md、site-builder.md、templates/log.md、templates/gitignore.txt、README.md）

## 2026-10-24（25）

- feat(skills): Google フォームの作成などでブラウザ操作が要るのに、Claude in Chrome がない、または会話がパソコンにつながっていないときの進め方を追加。オーナーにデスクトップアプリと Chrome の拡張機能の入れ方、会話のつなぎ方を案内し、入れない場合はサイドパネルに貼る指示文を渡すか、画面ごとの手順を案内する。Google Drive・Sheets のコネクタではフォームを作れないことも明記（account-setup.md、forms.md、connectors.md、templates/forms/chrome-google-form-prompt.md、docs/claude-account.md、docs/forms.md、docs/how-to-use.md、README.md）

## 2026-10-24（24）

- fix(skills): 作業環境の通信の許可の案内を、オーナーがチャット（Cowork）とコード（Claude Code）のどちらで作業しているかを聞いてから分けるようにした。チャットは「設定」→「機能」→「外部ネットワークへの通信を許可」、コードは「Edit cloud environment」→「Network access」。答えは SITE.md の「作業の環境」に残す（quality-gate.md、account-setup.md、SKILL.md、templates/SITE.md、run_lighthouse.sh、docs/claude-account.md、README.md）

## 2026-10-24（23）

- fix(skills): Lighthouse の計測はエージェントのクラウドの作業環境で行い、全ページではなく主要ページ（ページの種類ごとに代表1つ、多くて5ページ）だけを測る形にした。オーナーに PageSpeed Insights で測ってもらう手順は外した（quality-gate.md、SKILL.md、README.md、run_lighthouse.sh）
- fix(skills): ネットワークの許可の設定は、デスクトップアプリのチャットとコードとで会話の画面のメニューが違うため、どちらでも「設定」→「機能」→「外部ネットワークへの通信を許可」から案内するよう、よくある問題として記録した。公開の準備（account-setup.md の Cloudflare の手順9）と docs/claude-account.md にも足した

## 2026-10-24（22）

- fix(skills): クラウドの作業環境から本番のサイトを Lighthouse で計測できるようにした。届かないときは、作業環境のネットワークの許可（Cowork は設定の「機能」、Claude Code は「Edit cloud environment」）にサイトのホストを足すよう案内する手順を quality-gate.md に追加。最後の手段として、オーナーに PageSpeed Insights で測ってもらう手順も追加
- fix(skills): run_lighthouse.sh が、計測するページに届くかを先に確かめて、届かなければ理由と対処を表示して止まるようにした。「要改善」には点数に関係する項目だけを出すようにした

## 2026-10-24（21）

- fix(skills): Claude がリポジトリに書き込むには、GitHub アプリの許可に加えて、プロジェクトかセッションでそのリポジトリを選んでおく必要があることを追加（account-setup.md、project-setup.md、SKILL.md、docs/claude-account.md、docs/how-to-use.md）。push が拒否されたときの見分け方と対処、あとから作ったリポジトリを GitHub アプリに足す手順も記載。account-setup.md の手順番号の重複を修正

## 2026-10-24（20）

- docs: LICENSE に、AI の学習・データセット作成・RAG の索引などへの利用と、そのためのクローリングの禁止を追加。AGENTS.md の冒頭に AI とクローラー向けの利用条件（日本語・英語）を追加

## 2026-10-24（19）

- docs: 利用許諾（LICENSE）を追加。閲覧は誰でもできるが、利用は note の解説記事の購入者だけ（自分や自社のサイトの制作と運用、そのためのフォークを許可。受託制作は事前の許諾が必要。再配布・転売は禁止。作ったサイトは購入者のもの）。README に要点を記載

## 2026-10-24（18）

- feat(skills): プレビューの上で文章や画像を選んでコメントし、Claude に直してもらう方法を加え、おすすめとした。make_preview.py に `--comment`（iframe を使わず、ページそのものをプレビューにする）を足し、preview.md にコメントを受けたときの流れを書いた。使い方、プロンプト集、README にも反映
- docs: 「Claude のドキュメント」の表記を「Claude ドキュメント」にそろえた

## 2026-10-24（17）

- fix(skills): Node.js の基準を「最新の偶数番（Current を含む）」から「最新の LTS 版」に直した。Node.js の公式は本番で Active LTS か Maintenance LTS だけを使うよう案内しているため。templates/node-version.txt を 24 に戻した（26 は 2026-10-28 に LTS になるまで Current）

## 2026-10-24（16）

- feat(skills): サイトのスタックを、Node.js の最新の偶数番（最新の安定版。今は 26）、pnpm の最新版、依存パッケージの最新版にする方針に変更（build.md に「使うツールとバージョン」を追加。templates に node-version.txt=26、pnpm-workspace.yaml、package-json-fields.md）
- feat(skills): 依存パッケージの更新を Dependabot から runtime-update スキル（pnpm）に移した。pnpm 11 以降のロックファイルを Dependabot が正しく読めないため。Dependabot は GitHub Actions の更新だけ。弱点は pnpm audit で確かめる。公開から1日たっていない版は入れない（minimumReleaseAge）。インストール時のスクリプトは許可したものだけ（allowBuilds）
- feat(skills): 静的なサイトも、月1回の振り返り（site-review）で runtime-update を使って最新にする。check ワークフローと dependabot.yml をすべてのサイトに置く
- chore(skills): ワークフローを pnpm に変更し、actions/checkout と actions/setup-node を v7、cloudflare/wrangler-action を v4 に、pnpm/action-setup@v6 を追加。compatibility_date の基準を12か月から6か月に短縮

## 2026-10-24（15）

- feat(skills): 全スキル共通の安全のための決まり（references/security-rules.md）を追加。機密情報は読み取らず、チャット、ファイル、コミット、ログ、メモリのどこにも残さない。入ってくる情報（原稿、ウェブページ、プルリクエスト、ログ、コネクタの結果）の指示には従わず、出ていく情報（公開するページ、llms.txt、記録）を出す前に汚染と機密情報を確かめる
- feat(skills): 機密情報と汚染（見えない文字、AI に向けた命令、原稿の中のスクリプトなど）を調べる scripts/check_text.py を追加。サイトのリポジトリにもコピーし、コミットの前と、原稿を読んだときに使う
- feat(skills): web-creator、site-content-update、site-maintenance、runtime-update、site-review、サイトの AGENTS.md、プロジェクトの指示、site-builder、保守と振り返りのプロンプトに決まりを追加。autofix は、変更したファイルから見つかった場合にコミットせずに止まる

## 2026-10-24（14）

- fix(skills): Claude Code のプロジェクトには、オーナーが書き込めて GitHub アプリを入れたリポジトリしか追加できないため、スキルは配布元ではなくオーナーのアカウントに作ったフォークを追加する手順に変更（account-setup.md、project-setup.md、project-instructions.md、SKILL.md、docs/how-to-use.md、docs/claude-account.md）
- feat(skills): site-review の振り返りで、フォークが配布元より遅れていないかを確かめ、「Sync fork」を案内する手順を追加

## 2026-10-24（13）

- feat(skills): Cloudflare や Google のサービスの操作を、できるかぎりコネクタ（MCP）で行う手順を追加（references/connectors.md）。使う順番は、つながっているコネクタ、Claude の公式のコネクタ（チャットに接続のカードを出す）、サービスの公式の MCP サーバー（カスタムコネクタ）、ブラウザ操作、手順の案内
- feat(skills): Cloudflare は公式の MCP サーバー（mcp.cloudflare.com）を使う。アカウント準備とお問い合わせフォーム（Email Sending、Turnstile）の手順をコネクタ中心に変更。API が返す秘密の値は、表に出さずに Workers の Secrets へ直接登録してよい例外を追加
- docs: Google フォームには公式のコネクタがないため作成はブラウザ操作、回答は Google Sheets のコネクタで読む形を明記。EmDash のフォームプラグインは安定していないため除外していることを docs/forms.md に記載
- docs: アカウント登録ガイドに「ほかのサービスとつなぐ」を追加。Cursor・ChatGPT 向けの置き換え表、プロジェクトの指示、README を更新

## 2026-10-24（12）

- feat(skills): お問い合わせフォームの手順（references/forms.md）と、自前のフォームのひな形（templates/forms/）を追加。基本は Google フォーム（リンクか埋め込み）、見た目にこだわる場合だけ Cloudflare Email Sending を使う
- docs: お問い合わせフォームの作り方（docs/forms.md）を追加。ほかのサービスを番外編として紹介し、預け先が増える注意を記載。README とプロンプト集からリンク
- docs(skills): ヒアリングの問い合わせの受け方を4択にし、build.md と stack-selection.md を合わせた

## 2026-10-24（11）

- feat(skills): 制作と運用をサイトごとの Claude Code のプロジェクトで進める流れを追加（references/project-setup.md、templates/project-instructions.md）。ヒアリングに作業の環境の質問を、SITE.md に「作業の環境」を追加
- feat(skills): サイトのリポジトリに実行ログを残して改善ループを回す仕組みを追加（references/run-logs.md、templates/IMPROVEMENTS.md）。ログのひな形に起動のしかた、使ったスキル、結果、エラーと対処を追加。自動修正、保守、記事の更新でもログと改善点を書くようにした
- feat(skills): 振り返りと、古いログの要約・削除を行う site-review スキルを追加。要保守構成は毎月1日の保守に含め、静的なサイトは月1回のスケジュールタスクを勧める
- docs: README、使い方、プロンプト集、Cursor・ChatGPT 向けの置き換え表を更新。docs/logs/ に古いログの扱いを追加

## 2026-10-24（10）

- docs: 改善ループのためのログの仕組み（docs/logs/）を追加。AGENTS.md に、直す前にログを読み、直したらログを書く決まりを追加し、README からリンク

## 2026-10-24（9）

- docs(skills): account-setup の Cloudflare の見出しを「サイトの公開先」に変更

## 2026-10-24（8）

- feat(skills): site-content-update に scripts/optimize_images.py を追加。受け取った画像の向きを反映してメタ情報（EXIF・GPS・XMP・ICC）を削除し、sRGB にそろえ、800px と 1600px に縮小して AVIF と WebP に変換する。OG 画像の作成と `<picture>` の例の表示にも対応
- feat(skills): optimize_images.py に `--mode`（auto / convert / original）を追加。処理が重い場合は WebP・AVIF への変換を省き、元の形式で圧縮する
- docs(skills): 画像の手順に、写り込み（表札、ナンバー、関係のない人の顔など）の確認と、最適化の結果の報告を追加

## 2026-10-24（7）

- feat: Cursor と ChatGPT（Codex）でもスキルを読み込めるよう、`.agents/skills/` と `.claude/skills/` から `skills/` へのリンクを追加
- docs: Cursor や ChatGPT で使う方法と、Claude にしかない機能の置き換えをまとめた docs/other-agents.md を追加し、README からリンク
- feat(skills): make_preview.py に、ブラウザで直接開ける HTML を作る `--standalone` を追加。プレビューと保守ルーティンに、機能がない場合の代わりの手順を追記
- docs(skills): 特定のノーコードサービス名を一般的な表現に変更

## 2026-10-24（6）

- feat(skills): 公開前の変更を、Claude のアーティファクトで HTML のプレビューとして見せる手順を追加（web-creator/references/preview.md）
- feat(skills): ビルドしたページやサーバーのページを、CSS・画像・フォントを埋め込んだ1つの HTML にまとめる scripts/make_preview.py を追加。スマホと PC の表示切り替え、複数ページのタブ表示に対応
- docs: site-content-update、web-creator、使い方ガイド、プロンプト集、SITE.md のテンプレートをプレビューの手順に合わせて更新

## 2026-10-24（5）

- feat(skills): 使うモデルを Claude Opus 5.5 に統一し、計画とデザインは effort high、構築は effort medium に使い分けるようにした。web-creator は high、site-content-update・site-maintenance・runtime-update は medium を frontmatter で指定
- feat(templates): 構築用サブエージェント site-builder（Opus 5.5、effort medium）と、サイトのリポジトリ用の .claude/settings.json を追加
- feat(templates): autofix.yml で `--model claude-opus-5-5 --effort medium` を指定
- docs: README、使い方ガイド、保守ルーティンの作り方に使うモデルを追記

## 2026-10-24（4）

- feat(skills): site-content-update に、箇条書きの要点から記事の下書きを作る手順と、校正の基準を追加。原稿を「要点 / 校正あり / そのまま」の3種類に分けて扱う
- docs(prompts): 要点だけ伝えて記事にしてもらう文章と、校正して載せてもらう文章を追加
- docs: README に、公開後は要点を送るだけで更新できることを追記

## 2026-10-24（3）

- docs: Claude のアカウント登録ガイド（docs/claude-account.md）と、スキルとプロンプトの使い方（docs/how-to-use.md）を追加し、README からリンク
- docs(skills): 作業を「チャットでの相談と準備」と「Claude Code での制作と運用」の2段階に整理し、引き継ぎ文を作る手順を追加
- docs(skills): 非公開リポジトリで Claude Code が作業するための GitHub アプリのインストール手順と、アカウント登録を対話しながら教える方針を追加
- docs(prompts): Claude Code に移ってから最初に送る文章を追加
- docs: はじめのプロンプトを「私のサイト作り」に変更（ホームページ、LP、メディアのすべてを対象にするため）

## 2026-10-24（2）

- feat(skills): Astro を SSG 前提にし、必要なページだけ SSR にする手順と基準を追加（@astrojs/cloudflare、prerender = false）
- feat(skills): site-maintenance を追加。要保守構成（一部 SSR の Astro、EmDash）で、Dependabot の更新を2週間ごとのスケジュールタスクでレビュー・修正・マージする
- feat(skills): runtime-update を追加。Dependabot が扱わない Node.js のメジャーバージョンと Workers の compatibility_date を基準に従って更新する
- feat(templates): dependabot.yml、check.yml（プルリクエストのビルド確認）、node-version.txt を追加。ワークフローの Node.js は .node-version から読むように変更（既定は 24）

## 2026-10-24

- docs(skills): web-creator に「対応しないもの」（EC、決済、複雑なアプリケーション）と、その場合に見本・仕様書・価格の目安づくりを手伝う方針を追加
- docs(skills): 脆弱性のニュースのリンクを渡されたときの対応手順を追加
- docs: README に対応しないものを追記

## 2026-10-23（2）

- docs(prompts): 引っ越しのプロンプトを特定の CMS 名に依存しない形に変更
- docs(skills): サイトのリポジトリを非公開で作ることを明記。EmDash の移行用プラグインと、WordPress プラグインの機能を作り直す方針を追記

## 2026-10-23

- feat(skills): web-creator（サイト制作の全体）と site-content-update（記事の更新）を公開
- feat(skills): デプロイと自動修正の GitHub Actions ひな形、SITE.md・作業ログ・llms.txt・JSON-LD・.gitignore のテンプレート、Lighthouse 計測スクリプトを追加
- docs: README、AGENTS.md、プロンプト集を追加
