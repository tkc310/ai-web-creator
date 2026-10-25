# 2026-10-25 数百ページのメディアの構成（JSON の事前ビルド＋Workers の SSR）を検証

- きっかけ: オーナーから、数百ページのメディアを EmDash を使わずに作る構想（JSON の事前ビルドと SSR、ハッシュでのスキップ、インデックスの分割、SSR のキャッシュとパージ、Claude のスケジュールタスクでの予約投稿、GitHub アカウントごとの権限、R2 の画像）を example ディレクトリで検証してほしいと依頼
- 変えたファイル: docs/verification/（新規）、README.md、CHANGELOG.md、.gitignore（検証用の example/media-json-ssr/ は作って計測したあと、オーナーの指示で削除）
- 検証の記録: [docs/verification/2026-10-25_media-json-ssr/](../verification/2026-10-25_media-json-ssr/README.md)

## やったこと

1. example/media-json-ssr/ にサンプルを作った。記事の Markdown を JSON にする scripts/build-data.mjs、JSON から HTML を組み立てる Worker（src/）、パージと温め、予約投稿、R2 への画像のアップロード、権限の同期と確認のスクリプト、サイトのリポジトリに置くワークフロー（deploy.yml、check.yml）
2. SSR のキャッシュには、2026年に追加された Workers Cache を使った。workers.dev でも使え、`ctx.cache.purge({ tags })` で変わったページだけを消せる。Worker の中からしか呼べないため、秘密の文字列付きの `/__cache/purge` を作り、CI から呼ぶ形にした
3. 300 / 1,000 / 3,000 / 10,000 本のダミー記事で、ビルドの時間、変更なし・1本修正・1本追加のときのパージの範囲、出力の大きさ、手元の Worker の応答時間を測り、同じ記事を Astro で全ページ HTML にしたときの時間と比べた
4. 1万本で見つかった重さ（タグの一覧 629 KB、全期間の検索 73 ms）を、タグの年ごとの分割と、検索を新しい順に読んで50件で止める形に直した
5. Lighthouse（モバイル、手元）でトップ、記事、タグの一覧が4項目とも100、320px と 375px で横スクロールなしを確認した

## 確認したこと

- Workers Cache: workers.dev で使える、Cache-Tag とタグでのパージ、cross_version_cache（wrangler 4.107.0 以上）、事前に入れる API はない、有効にすると静的ファイルへのリクエストも Workers のリクエストとして課金される（developers.cloudflare.com/workers/cache/、2026-10-25）
- Workers の無料プランの静的ファイルは1つの版で 2 万ファイルまで（Cloudflare の changelog 2025-09-02）
- GitHub のルールセットは、Free では公開リポジトリだけ。非公開は Pro / Team 以上（docs.github.com の managing-rulesets、2026-10-25）
- 数値と計測のソースは docs/verification/2026-10-25_media-json-ssr/

## 確認できなかったこと

- 手元の wrangler dev（4.152.0）では Workers Cache が動かず（`ctx.cache` がない）、キャッシュのヒット、パージ、温め、エッジでの応答時間は測れなかった。本番の Cloudflare での計測は、オーナーの判断で行わない
- GitHub Actions 上でのワークフロー、スケジュールタスクでの予約投稿の起動、ルールセットを入れたリポジトリでの書き手のプルリクエスト

## 次回の改善点

- 今回の Astro の計測（3,000 本で約 7 秒）は最小構成での値。外部の記事では、MDX や画像、OGP 画像のあるサイトで 1秒あたり 16 ページの例もある（docs/verification の「外部の参考記事と、今回の計測の限界」）。build.md に、記事の多いサイトでビルドを速く保つ決まり（OGP 画像を毎回作り直さない、ビルドのキャッシュを CI で残す、など）を足すかを検討する

- JSON＋SSR の構成は、Astro＋Cloudflare のビルドが十分に速いため採用しない（オーナーの判断）。stack-selection.md には足さない
- 一覧と検索用の JSON は、Astro のサイトのブラウザ側の検索や絞り込みに使えそう。サイト内検索が必要なサイトで検討する
- 画像を R2 の独自ドメインで配り、Worker・CDN・R2 にリクエストを分散させる形を、記事の多いサイト向けに検討する
- 書き手ごとの権限（GitHub アカウントごとの権限、CODEOWNERS、ルールセット、プルリクエストでの確認）は Astro のサイトでも使えるので、スキルの選択肢にするかを検討する
- 予約投稿のスケジュールタスクを、site-content-update の手順に入れるかを検討する
