# アクセス解析

サイトを公開するときに、標準で Cloudflare Web Analytics を有効にします。オーナーが「どのくらい見られている？」と聞いたときに、Claude が数字を読み取って答えられるようにするためです。

## Cloudflare Web Analytics を標準にする理由

- 無料で使える。訪問者の記録に Cookie や localStorage を使わない（Cloudflare の Web Analytics のページ）。Cookie の同意のバナーを足さずに済む
- サイトのドメインが Cloudflare を通っていれば（独自ドメインをつないだあと）、サイトのコードを変えずに有効にできる。ページの表示に使う計測用のスクリプトは、Cloudflare が配信のときに差し込む
- Cloudflare のコネクタ（connectors.md）で、有効にする操作も、数字を読む操作もできる

Google アナリティクス（GA4）は、オーナーが希望したときだけ入れます（下の「Google アナリティクスを頼まれたとき」）。

## 有効にする（独自ドメインをつないだとき）

deploy-and-autofix.md の「独自ドメインの接続」と、migration.md の段階2の最後に行います。所要時間は5分くらいで、オーナーの操作はありません。

1. エージェント: 何をするか（「アクセス数を数える仕組みを有効にします。費用はかからず、訪問者の Cookie は使いません」）を一文で伝える
2. エージェント: コネクタで、すでにサイトが登録されていないかを確かめる（`GET /accounts/{account_id}/rum/site_info/list`）
3. エージェント: 登録されていなければ、ドメインのゾーンを指定して、自動で差し込む設定で登録する（`POST /accounts/{account_id}/rum/site_info`、本文は `{"zone_tag": "<ゾーンの ID>", "auto_install": true}`）。コネクタが使えない場合は、オーナーに Cloudflare のダッシュボードの「Web Analytics」→「Add a site」で、サイトのドメインを選んでもらう
4. エージェント: 公開したページを開き、HTML に `static.cloudflareinsights.com` の計測用のスクリプトが入っていることを確かめる。入っていない場合は、`public/_headers` に `Cache-Control: no-transform` がないかを確かめる（あると差し込まれない。Cloudflare のドキュメント）
5. エージェント: Lighthouse の点数が下がっていないかを、トップページで測って確かめる（quality-gate.md）
6. エージェント: SITE.md の「技術」に「アクセス解析: Cloudflare Web Analytics（有効にした日）」と書き、プライバシーポリシーのページに、アクセスの統計を Cloudflare の仕組みで取っていることを1文足す（forms.md の「プライバシーポリシー」）。ページの文章を変えるので、足した文をプレビュー（preview.md）でオーナーに見せ、「OK」をもらってから公開する

独自ドメインをつながず、workers.dev の URL だけで公開を続ける場合は、自動で差し込めません。Web Analytics にホスト名を登録して計測用のスクリプト（JS snippet）を受け取り、`src/layouts/Base.astro` の `</body>` の前に置きます。Cloudflare を通っていないサイトとしての登録は、アカウントで10サイトまでです（Cloudflare のドキュメント「Limits」）。

## 数字を読む（オーナーに聞かれたとき）

オーナーに「今月どのくらい見られている？」と聞かれたら、次の順に答えます。

1. コネクタで、Cloudflare の GraphQL の分析の API から、Web Analytics の数字（ページの表示回数、訪問の数、よく見られたページ、どこから来たか）を、聞かれた期間で読む。データセットの名前と項目は、作業の日に Cloudflare のドキュメント（GraphQL Analytics API の Web Analytics の例）で確かめる
2. 最初の一行で、期間と数字を答える（例: 「10月のページの表示は1,240回で、9月より12%増えました」）
3. よく見られたページと、来た経路（検索、SNS、直接）を3つまで添える
4. 答えた内容を実行ログに書く。訪問者の個人を特定できる情報は扱わない

オーナーが自分で見たい場合は、Cloudflare のダッシュボードの「Web Analytics」でサイトを選ぶと見られることを、画面の名前を確かめてから案内します。

## Google アナリティクスを頼まれたとき

- 外部のスクリプトを読み込むので、パフォーマンスの点数が下がることがある。入れた場合と入れない場合のトップページの点数を測って伝え、入れるかを決めてもらう
- 訪問者の端末に Cookie を保存するので、プライバシーポリシーに、Google アナリティクスを使っていることと、データの集め方と使い方を書く。Google の規約で、この記載が求められている（Google アナリティクスのヘルプ「Privacy Disclosures Policy」）
- 測定 ID（`G-` で始まるもの）は秘密ではないので、エージェントが扱ってよい。Google アナリティクスの管理画面へのログインと、プロパティの作成はオーナーが行う
- 引っ越しで旧サイトの測定 ID を引き継ぐ場合は、migration.md の「アクセス解析と Search Console」

## 出典（2026-10-30 確認）

- Cloudflare Web Analytics（無料、Cookie や localStorage を使わない）: https://www.cloudflare.com/web-analytics/
- 有効にする手順（Cloudflare を通るサイトは自動で差し込む。`Cache-Control: no-transform` があると差し込まれない）: https://developers.cloudflare.com/web-analytics/get-started/
- 登録できるサイトの数（Cloudflare を通らないサイトは10、通るサイトは制限なし）: https://developers.cloudflare.com/web-analytics/limits/
- Web Analytics のサイトを登録する API（`/accounts/{account_id}/rum/site_info`）: Cloudflare の API の仕様（コネクタの `search()` で確かめた）
- Google アナリティクスのプライバシーの記載: https://support.google.com/analytics/answer/7318509
