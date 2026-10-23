# 公開と自動修正

## 流れ

```
エージェントが変更を main に push
  → GitHub Actions「deploy」: ビルド → Cloudflare Workers に公開
     失敗したら
  → GitHub Actions「autofix」: Claude が原因を調べて直す → ビルド確認 → コミット → 公開
     それでも失敗したら
  → GitHub の Issue でオーナーに通知（GitHub からメールが届く）
```

公開に失敗しても、Cloudflare 上の前回のサイトは差し替わらずに表示され続けます。オーナーに説明するときは、まずこの点を伝えます。

## 初回の設定

1. サイトのリポジトリに templates/github/workflows/ の2ファイルを `.github/workflows/` として、templates/gitignore.txt を `.gitignore` としてコピーする
2. `wrangler.jsonc` を置く（build.md の例）
3. GitHub の Secrets に次の3つが登録されていることを確認する（値の登録はオーナーが行う。account-setup.md）
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
   - `CLAUDE_CODE_OAUTH_TOKEN`（または `ANTHROPIC_API_KEY`。この場合は autofix.yml の入力名も変える）
4. main に push し、Actions のタブで deploy が成功したことを確認する
5. `https://<name>.<アカウントのサブドメイン>.workers.dev` で表示を確認する

## 独自ドメインの接続

取り消しにくい操作なので、オーナーの了承を得てから行います。

1. ドメインを Cloudflare に追加する（Cloudflare で取得した場合は済んでいる）
2. 他社で取得したドメインは、その会社の管理画面でネームサーバーを Cloudflare が指定する2つに変更する（オーナーが操作。反映に数時間〜1日かかることがある）
   - 既存のメールがある場合は、MX レコードなどが Cloudflare 側に引き継がれているかを切り替え前に必ず確認する。漏れるとメールが届かなくなる
3. `wrangler.jsonc` に次を追加して push する

```jsonc
"routes": [
  { "pattern": "example.co.jp", "custom_domain": true },
  { "pattern": "www.example.co.jp", "custom_domain": true }
]
```

4. www あり・なしのどちらかに統一するリダイレクトを設定する
5. `astro.config.mjs` の `site`、canonical、sitemap、llms.txt、JSON-LD の URL を本番ドメインにそろえる

## プレビュー

大きな変更は、ブランチで作り、エージェントのクラウド環境でビルドしてスクリーンショット（スマートフォン幅とパソコン幅）を撮って見せます。オーナーが実際に触って確認したい場合は、`wrangler versions upload` のプレビューURLを使う方法がありますが、手順は実施前に Cloudflare のドキュメントで確認します。

## autofix の範囲

autofix が直すのは「直前の変更が原因で公開できない」ケースです。次は直さず、Issue で知らせます。

- Cloudflare のトークンの期限切れ、権限不足（オーナーが再発行する必要がある）
- 無料枠の上限（GitHub Actions の実行時間。非公開リポジトリは Free プランで月2,000分。最新の値は GitHub のドキュメントで確認する）
- 依存パッケージの大きな更新が必要な問題

GitHub は、ワークフローが失敗すると push した人に通知メールを送ります。autofix が直した場合も、最初の失敗の通知は届くことがあるので、オーナーには「失敗の通知が来ても、自動で直った場合は何もしなくてよい」と伝えておきます。

autofix が動いた場合は、次にオーナーと話すときに「◯日に記事の画像の指定に誤りがあり、自動で直して公開しました」と一言伝えます。

## 失敗を減らすための決まり

- 依存パッケージは `package-lock.json` で固定し、更新は月に1回までにまとめて行う
- 記事の追加では、エージェントが push の前に手元でビルドを通す
- Node.js のバージョンは deploy.yml とそろえる（22）。Node.js 22 のサポートは2027年4月に終わるため、その前に新しいバージョンへ上げる作業を SITE.md の予定に書いておく
