# デザインと制作

## デザイン案の出し方

1. ヒアリング結果から、方向性の違う3案を作る（例: 信頼感重視 / 親しみ重視 / 写真を大きく見せる）
2. 各案はトップページのファーストビューだけを作り、スマートフォンとパソコンのスクリーンショットを並べて見せる
3. オーナーに1つ選んでもらう。「Aの色でBのレイアウト」のような組み合わせも受け付ける
4. 選ばれた案で全ページを作る

デザインでは、テンプレートのような見た目を避け、業種と対象者に合う書体、色、余白を選びます。frontend-design スキルが使える環境では、それに従います。

## 共通の作り方

- スマートフォンで見たときの表示を先に作る
- 画像は WebP または AVIF にし、表示サイズに合わせて複数サイズを用意する。`width` と `height` を必ず指定する（レイアウトのずれを防ぐ）
- ファーストビューの画像だけ `fetchpriority="high"`、それ以外は `loading="lazy"`
- Webフォントは使う文字の太さを2種類までにする。日本語フォントを使う場合はサブセット化するか、システムフォントを使う
- JavaScript は必要な場所だけに書く。スライダーやアニメーションのライブラリは入れない
- 色のコントラスト比は 4.5:1 以上。画像には内容を説明する alt を付ける
- お問い合わせ: メールリンク、Googleフォームの埋め込み、または外部フォームサービスから、ヒアリングの答えに合わせて選ぶ

## A. HTML / CSS / JavaScript

```
public/
  index.html
  assets/ (css, images)
  robots.txt, sitemap.xml, llms.txt, favicon
wrangler.jsonc  … assets.directory は "./public"
```

## B. Astro

```
src/
  pages/        … index.astro, about.astro, news/[slug].astro など
  layouts/      … Base.astro（head、OGP、JSON-LD をまとめる）
  content/      … news/*.md, blog/*.md
  content.config.ts … 記事の frontmatter の型（title, date, description, image, draft）
public/          … robots.txt, llms.txt, favicon, og 画像
astro.config.mjs … site に本番URLを設定、@astrojs/sitemap を追加
wrangler.jsonc   … assets.directory は "./dist"
```

- 記事一覧、記事ページ、タグ一覧は Content Collections から生成する
- `draft: true` の記事はビルドに含めない
- llms.txt はビルド時に記事一覧から生成するページ（`src/pages/llms.txt.ts`）にしてもよい

## C. EmDash

EmDash の公式ドキュメントに従ってセットアップします。テンプレートを選び、Cloudflare 上に Workers、D1、R2 を作成します。作成時は課金の有無をオーナーに確認します。テーマのデザインは B と同じ方針で作ります。

## wrangler.jsonc の例（A・B 共通）

```jsonc
{
  "name": "example-site",
  "compatibility_date": "2026-10-01",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "404-page"
  }
}
```

`compatibility_date` は作成した日付にします。
