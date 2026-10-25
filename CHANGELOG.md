# CHANGELOG

## 2026-10-25

- feat(example): 数百〜数千本の記事を持つメディアの構成を検証するサンプル example/media-json-ssr を追加。記事と一覧の JSON だけを事前に作り、Worker が SSR して Workers Cache に置く。ハッシュによる変換と公開のスキップ、年ごとの分割、タグでのパージと温め、Claude のスケジュールタスクでの予約投稿、GitHub アカウントごとの権限、R2 の画像。300〜1万本で計測し、Astro の SSG と比べた結果を README に記録（docs/logs/2026-10-25_media-json-ssr-example.md）

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
