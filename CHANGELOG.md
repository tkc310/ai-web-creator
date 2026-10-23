# CHANGELOG

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
