# CHANGELOG

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
