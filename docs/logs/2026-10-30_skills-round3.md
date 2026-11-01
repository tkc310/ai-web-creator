# 2026-10-30 受託制作の扱い、自動修正の段階の見分け方、取り込みの手順、クラウドの GitHub の制限

- きっかけ: スキルの評価（3回目の修正）で見つかった不具合と不足。受託制作で、購入の記録がないとスキルの取り込みが止まる。autofix が日本語のステップ名で失敗の段階を見分けている。取り込みの手順がシェルの変数を Bash の呼び出しの間で引き継ぐ前提になっている。プロジェクトのスレッドがブランチで作業するのに、main への push の決まりがない。空のリポジトリで始める手順になっている、など
- 変えたファイル: LICENSE、README.md、AGENTS.md、CHANGELOG.md、docs/how-to-use.md、prompts/README.md、skills/web-creator/SKILL.md、references/（account-setup.md、analytics.md、build.md、deploy-and-autofix.md、forms.md、hearing.md、migration.md、project-setup.md、security-audit.md、security-rules.md、skills-install.md、stack-selection.md、versions.md、新規 client-handoff.md）、templates/（github/workflows/autofix.yml・deploy.yml、AGENTS.md → AGENTS.md.tmpl、CLAUDE.md → CLAUDE.md.tmpl、SITE.md、handoff.md、project-instructions.md、node-version.txt、pnpm-workspace.yaml、forms/contact-handler.ts、新規 forms/google-form-embed.html）、skills/site-content-update/SKILL.md、skills/site-maintenance（SKILL.md、references/routine-prompt.md）、skills/site-review/SKILL.md、skills/runtime-update/SKILL.md

## やったこと

1. 受託制作の扱いを変えた。解説記事の購入者は、お客さまのサイトの制作と保守にもスキルを使える。お客さまごとの追加の購入はない。お客さまのサイトの非公開のリポジトリに skills/ を置けるのは、制作か保守を続けている間だけ。手を離すときは、お客さまが購入者でなければ skills/ を除く（LICENSE の英文の要約と 2、README の「ライセンス」）。stack-selection.md と skills-install.md から、購入の記録がなければ取り込みを止める処理を外し、SITE.md に制作者と保守の終わりの予定を書く形にした。hearing.md の「事前の許諾」を消した。SITE.md と handoff.md の受託制作の欄を「はい（制作者、保守の終わり）」にした
2. references/client-handoff.md を作った。お客さまに引き渡すときの手順（鍵とスケジュールタスクの片づけ、skills/ と skills/ への参照を外す、git の履歴の扱い、権限を外す、引き渡したあとに一度公開して確かめる）と、お客さまに伝えること
3. deploy.yml を3つのジョブ（build、publish、smoke）に分けた。autofix は、どのジョブが失敗したかをジョブの名前と結果で見分ける（日本語のステップ名との一致をやめた）。Claude を起動するのは build のジョブが失敗したときだけにし、publish だけの失敗、smoke だけの失敗、鍵がない、回数の上限、Issue が開いている、ジョブの結果が読めない、のときは Issue を立てて実行を成功で終える
4. autofix.yml を直した
   - concurrency をジョブの単位に移した（deploy が成功したあとに何もせずに終わる実行が、待っている deploy を取り消さないようにする）
   - Issue の本文を、起きたことで書き分ける。公開中のサイトが前回の版か新しい版かを最初に書く。Claude の実行が途中で止まったときは、鍵の期限切れか利用の上限の可能性と、鍵の発行日の場所を書く。Claude が書いた実行ログ（原因と必要な変更）を check_text.py で確かめてから本文に入れる（3,000字まで）
   - Claude が変えたのがログだけのときは、コミットを `chore(autofix):` にして、回数に数えない
   - scripts/check_text.py がないときは、確かめずに公開しないよう、コミットせずに止める
   - ファイルのモードの確認に `git --literal-pathspecs` を付けた（名前に `*` などを含むファイルの誤判定を避ける）
5. 公開後の確認で、つながらない（状態 000）か 5xx のときは、そのページで最大8分まで待つようにした（独自ドメインにつないだ直後の証明書の発行待ち）。404 や文字が見つからないときは、今までどおり5回で終える。deploy-and-autofix.md に「公開後の確認をやり直す」を足し、migration.md の切り替えの手順と prompts/README.md にも、取り消す前に数分おいて確かめる、を足した
6. skills-install.md の初回の手順を、2つのかたまり（版を選んで clone する／写す）にし、それぞれを1回の Bash の呼び出しで実行する形にした。作業用のフォルダを `/tmp/ai-web-creator-src` に固定し、選んだ版はファイルで次のかたまりに渡す。clone した版の skills-install.md を読み直す手順、サイトのリポジトリに main があるかの確認、skills/ の独自の変更の見つけ方（skills/VERSION を最後に変えたコミットからの差分）、写したものが取り込み元と一致するかの確認を足した。security-audit.md の `$audit` も固定のフォルダにした
7. clone できないときの代わりとして、リリースに付ける zip（skills/、LICENSE、VERSION）からの取り込みの手順を書いた。README の「版の付け方」に、zip の作り方と、main にはタグを打つ版だけを入れることと、最初のタグの前に自動修正の3つの経路を確かめる手順を足した
8. 引き継ぎ文、プロジェクトの指示、prompts/README.md に、配布元は `git clone` で取得する（GitHub の API やリポジトリの追加は使わない）と書いた。account-setup.md に、通信の許可に github.com があるかを確かめる手順を足した
9. プロジェクトの指示、AGENTS.md のひな形、SKILL.md に、公開は main への push で、作業用のブランチで作った場合はオーナーの「OK」のあとに `git push origin HEAD:main` で入れる、と書いた。site-maintenance の `gh pr list` と `gh pr merge --delete-branch` を、REST の `gh api` に置き換え、ブランチを消さないようにした。Issue やプルリクエストの操作を `gh api` で行う書き方を deploy-and-autofix.md に書いた
10. サイトのリポジトリを「Add a README file」をオンにして作るようにした（account-setup.md、docs/how-to-use.md）
11. 自動修正用の鍵（`CLAUDE_CODE_OAUTH_TOKEN`）の期限を、毎月の振り返りで、発行から11か月を過ぎたら作り直しを頼む形にした。発行日を書く場所を SITE.md の「技術」にそろえた
12. pnpm の `minimumReleaseAge` を1日から3日（4320分）にした。astro、@astrojs/cloudflare、wrangler のメジャー更新は、自動ではマージせず、プレビューと要点をオーナーに見せてからにした
13. お問い合わせフォームのひな形で、送信回数の制限を Turnstile の確認のあとに移し、確認の通信の失敗を `fail("captcha")` で受けるようにした
14. 利用の上限で止まっても続けられるように、作業のまとまりごとにコミットして push する、SITE.md の「制作の進み具合」を更新する、再開のひと言、監査の前に聞く、を書いた（build.md、SITE.md、SKILL.md、security-audit.md、project-instructions.md）
15. 予約投稿を、1回だけ動くタスクにし、日時をオーナーに伝え、SITE.md に記録し、公開されたかを次に話すときに確かめる形にした。画像の手順の前に Pillow の確認を入れた（site-content-update）
16. 小さな直し: SSG のサイトでも wrangler を devDependency に入れて版を固定する（build.md、runtime-update）。`cp -Rn` を `cp -R --update=none` にした。templates/ の CLAUDE.md と AGENTS.md を .tmpl の名前にした（取り込んだ skills/ の中のひな形が、本物の CLAUDE.md として読み込まれないようにする）。templates/node-version.txt を、数字の入っていない埋めて使うひな形にした。account-setup.md にカスタムコネクタの URL と、選ばないコネクタを書いた。アクセス解析のプライバシーポリシーの1文はプレビューで見せてから公開する。skills/ の取り込みのコミットでは check_text.py に `--exclude skills` を付ける
17. check_text.py の skills/ での誤検出（10件）を、説明の文の書き方を変えて0件にした。Google フォームの埋め込みの HTML は templates/forms/google-form-embed.html に移した

## 確認したこと

- YAML: autofix.yml、deploy.yml、check.yml、dependabot.yml を `python3 -c "import yaml; yaml.safe_load(...)"` で読み込めた。ワークフローのシェルを取り出して `bash -n` で確かめた。deploy.yml と autofix.yml の公開後の確認のシェルが同じであることを diff で確かめた
- autofix の判定（偽の gh コマンドで試した）: build の失敗は claude、鍵なし・Issue が開いている・回数の上限・publish だけの失敗・smoke だけの失敗・ジョブの結果が読めないは issue、新しいコミットが main にあるは skip。`chore(autofix):` は回数に数えない
- 範囲の確認（一時的な git リポジトリで試した）: 記事とログは `fix(autofix):`、ログだけは `chore(autofix):`、変更なしは changed=false。範囲の外の .astro、.mdx、削除、ログの名前の symlink、秘密の文字列、check_text.py がない場合は止まった。`[2026]cafe.jpg`、`a*.md`、日本語と空白の名前の記事は通った。実行ログの控えは、範囲の外で止まったときも残り、symlink は控えなかった
- Issue の本文（偽の gh コマンドで試した）: Claude の失敗、ビルドの失敗、公開のあとの確認の失敗、公開の失敗のそれぞれで文が切り替わった。AI に向けた命令の疑いがある実行ログは本文に入らなかった
- 公開後の確認（手元の HTTP サーバーで試した）: 200 と文字ありは OK、`&amp;` で書いた文字は OK、404 は5回で NG、つながらないポートは待ち時間まで試して NG、`<...>` の行は飛ばして警告
- skills-install.md の手順（文書のかたまりをそのまま取り出し、配布元を手元の git リポジトリに置き換えて試した）: main がないリポジトリでは止まった。タグの版を取り込めて、skills/VERSION、scripts/check_text.py ができた。取り込み直しは通り、コミットした独自の変更と、コミットしていない変更は終了コード2で止まった。新しいタグとの CHANGELOG の差分を読めた。zip から取り込めた。skills-install.md がない古い版は止まった。取り込みのコミットの確かめ（`--exclude skills`）は終了コード0
- contact-handler.ts: `npx -p typescript@5 tsc --noEmit --strict` で通った
- check_text.py: skills/、LICENSE、README.md、prompts/、docs/（docs/logs/ を除く）、AGENTS.md、CHANGELOG.md で0件
- scripts/ の Python は `python3 -m py_compile`、run_lighthouse.sh は `bash -n` で通った
- 検索で確かめた事実（2026-10-30）:
  - クラウドの作業環境の GitHub の中継は、ブランチの削除とタグの push を拒否し、push するブランチは制限しない。GraphQL を拒否するので `gh pr` と `gh issue` は 403 になり、REST の `gh api` を使う。セッションに追加していないリポジトリへの API と、archive・codeload の取得は、公開リポジトリでも 403。github.com は Trusted の既定の許可に入っている: https://code.claude.com/docs/en/cloud-environments
  - 新しく始めるときは README のあるリポジトリを作る: https://code.claude.com/docs/en/web-quickstart
  - coreutils 9.4 の `cp -n` は、非推奨の警告を出し `--update=none` を勧める（作業環境で確かめた）

## 確認できなかったこと

- 配布元の main へのマージとタグ（v2026.11.0）、リリースへの zip の添付。作者が行う作業のため、行っていない
- GitHub Actions の上での動き: 3つのジョブに分けた deploy.yml の `gh run view --json jobs` のジョブの名前、ジョブの単位の concurrency と deploy のワークフローの単位の concurrency が同じグループとして扱われること、claude-code-action の失敗が `steps.claude.outcome` に出ること。使い捨てのリポジトリで、README の「版の付け方」の手順4として確かめる
- autofix の Claude が .git や /proc を読めるか、Edit の許可で新しいファイルを作れるか（実機で確かめてから設定を変える）
- `claude setup-token` で作った鍵を無効にする画面の場所（client-handoff.md では、案内の前にドキュメントで確かめる、と書いた）

## 次回の改善点

- 最初のタグを打つ前に、README の「版の付け方」の手順3と4（空のリポジトリでの取り込み、自動修正の3つの経路）を実際に行い、結果を versions.md に書く
- 受託制作で引き渡すときの git の履歴の扱い（標準は新しいリポジトリに写す）と、業務委託先や下請けが使えるかを、作者が決めたら LICENSE と client-handoff.md に書く
- アクセス解析を有効にする時期（今は独自ドメインをつないだとき）を、作者の決定に合わせる
