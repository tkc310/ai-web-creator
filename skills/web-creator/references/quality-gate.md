# 公開前の健康診断（品質チェック）

公開前と大きな変更の後に、次の3つを確認します。結果はログに残し、オーナーには「4項目とも満点近くです」のように要約して伝えます。

## 1. Lighthouse

`scripts/run_lighthouse.sh` で、トップページと代表的なページ（記事ページ、問い合わせページ）を計測します。計測はモバイル設定で行います。

```bash
# ビルドしてローカルで配信してから計測する
bash <スキルの場所>/scripts/run_lighthouse.sh http://localhost:4321/ http://localhost:4321/news/sample/
```

| 項目 | 目標 | 届かないときに最初に疑うこと |
|---|---|---|
| パフォーマンス | 95以上 | 画像のサイズと形式、Webフォント、外部の埋め込み（地図、SNS、動画） |
| ユーザー補助 | 100 | コントラスト、alt、見出しの順番、ボタンやリンクの名前 |
| おすすめの方法 | 100 | コンソールのエラー、古い書き方、HTTPのままの外部リソース |
| SEO | 100 | title と description、リンクの文言、robots の設定、canonical |

Core Web Vitals の目安は、LCP 2.5秒以内、CLS 0.1以下です。INP は実際の利用者のデータでしか測れないため、計測ではトータルブロッキングタイム（TBT）を代わりに見ます。

公開後は本番URLでもう一度計測します（Cloudflare 経由の配信で数値が変わるため）。

外部の埋め込みが原因で目標に届かない場合は、削らずに「代わりの方法と、その場合の点数」をオーナーに示して選んでもらいます。

## 2. SEO（検索エンジン向け）

- すべてのページに固有の `<title>` と `<meta name="description">` がある
- `<link rel="canonical">` が本番URLを指している
- OGP（`og:title`、`og:description`、`og:image`、`og:url`）と `twitter:card` がある。OG画像は 1200×630
- `sitemap.xml`（Astro は `@astrojs/sitemap` で自動生成、HTML 版は手で作る）
- `robots.txt` に `Sitemap: https://ドメイン/sitemap-index.xml`（HTML 版は `/sitemap.xml`）を書く
- 見出しは h1 が1つ、h2・h3 が順番どおり
- 引っ越しの場合は、旧URLから新URLへの 301 リダイレクトを `_redirects` に書く（migration.md）
- 公開後、オーナーの了承を得て Google Search Console にサイトを登録し、サイトマップを送信する。所有権の確認には Cloudflare の DNS に TXT レコードを追加する

## 3. AIO（AI検索・AIエージェント向け）

- `llms.txt` をサイト直下に置く。サイトの説明、主要ページへのリンク、問い合わせ先を Markdown で書く（templates/llms.txt）
  - Google は llms.txt を検索順位に使わないと表明しています（2026年5月の AI 最適化ガイドでも「作る必要はない」と記載）。一方で Chrome の Lighthouse には、AIエージェント向けの実験的な監査として llms.txt のチェックが加わりました。置いても不利益はないため置きますが、内容が古くなると AI に誤った情報を渡すので、ページを増やしたら更新します
- 各ページの冒頭で「何の会社か」「誰向けか」「どこにあるか」に一文で答える
- 会社名、住所、電話番号は全ページで同じ表記にする
- Cloudflare には AI のクローラーを遮断する設定があります。AI 検索に載せたいか、学習には使われたくないかをオーナーに聞き、ダッシュボードの設定と robots.txt を合わせます

## 4. 構造化データ（JSON-LD）とリッチリザルト

ページに表示している内容だけを書きます。表示していない情報や、事実と違う情報をマークアップすると、Google の手動による対策（ペナルティ）の対象になります。

| ページ | 使う型 | 注意 |
|---|---|---|
| トップ | `Organization`（店舗なら `LocalBusiness` の適切な下位型）、`WebSite` | 自社が自社につけたレビューや評価（`aggregateRating`）は書かない。リッチリザルトの対象外で、ガイドライン違反になり得る |
| 下層ページ | `BreadcrumbList` | パンくずを実際に表示している場合だけ |
| お知らせ・ブログ | `NewsArticle` または `BlogPosting` | `headline`、`datePublished`、`dateModified`、`author`、`image` |
| 求人 | `JobPosting` | 実際に募集中の求人だけ。締め切ったら外す |
| イベント | `Event` | 日時、場所、主催者 |

使わないもの:

- `FAQPage`: 2026年5月から Google 検索で FAQ のリッチリザルトが表示されなくなりました。書いても害はありませんが、表示は期待できないので新しくは足しません
- `HowTo`: リッチリザルトの表示が終了しています

公開前に、Google のリッチリザルトテストと Schema Markup Validator で構文エラーがないことを確認します。テンプレートは templates/jsonld/ にあります。

## 記録

計測結果（4項目の点数、LCP、CLS、TBT）と、直した内容をログに残します。点数が前回より5点以上下がった変更は、原因を書きます。
