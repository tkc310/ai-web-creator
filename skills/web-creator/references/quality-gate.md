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

```bash
bash <スキルの場所>/scripts/run_lighthouse.sh https://<サイトの名前>.<アカウントのサブドメイン>.workers.dev/
```

### 作業環境から本番のサイトに届かないとき

クラウドの作業環境（Claude Code のクラウドセッション、Cowork）は、外への通信が許可された行き先に限られています。最初の設定では、公開したサイト（workers.dev や独自ドメイン）や、Lighthouse 本体の取得先に届かないことがあります。`run_lighthouse.sh` が「届きません」と止まったら、オーナーに作業環境のネットワークの許可を足してもらいます。設定を変えると、動いている会話にも1分くらいで反映されます。

足すホストは、サイトのホスト（`*.<アカウントのサブドメイン>.workers.dev`、独自ドメインなら `example.co.jp` と `www.example.co.jp`）です。パッケージの配布元（npm）も使うので、既定の許可の一覧は残します。

| 作業している場所 | 設定の場所 | 選ぶもの |
|---|---|---|
| Cowork（Claude のアプリ） | 設定 → 機能（Capabilities）→ コードの実行のネットワークの許可（Domain allowlist） | 「Package managers only」を選び、「Additional allowed domains」にサイトのホストを1行ずつ入れる |
| Claude Code（claude.ai/code、デスクトップアプリの Code） | 会話の名前の右の「∨」→「Edit cloud environment」→「Network access」 | 「Custom」を選び、「Allowed domains」にサイトのホストを1行ずつ入れ、「Also include default list of common package managers」にチェックを入れる |

- 2026年10月の時点で、「Additional allowed domains」が効かないという不具合の報告があります（Cowork を含む）。足しても届かない場合だけ、計測のあいだ「すべてのドメイン」（All domains / Full）にし、終わったら元に戻すよう伝えます。守りが弱くなることも一文で伝えます
- Team・Enterprise のプランでは、この設定は組織の管理者しか変えられないことがあります。その場合は下の「オーナーに計測してもらう」に進みます
- 画面の表示名は変わることがあるので、案内の前に Claude Code のドキュメント（Configure cloud environments）と Claude のヘルプセンターで確認します

### オーナーに計測してもらう（最後の手段）

作業環境の設定を変えられない場合は、オーナーのパソコンの Chrome で計測してもらいます（5分くらい）。

1. https://pagespeed.web.dev/ を開く
2. 入力欄にサイトのアドレスを貼り、「分析」を押す
3. 「携帯電話」が選ばれたまま、4つの丸の数字が見える画面のスクリーンショットをチャットに貼ってもらう（数字だけを送ってもらってもよい）

PageSpeed Insights の API は、鍵なしでは失敗することが多いため使いません。

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
