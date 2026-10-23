# デザインと制作

## デザイン案の出し方

1. ヒアリング結果から、方向性の違う3案を作る（例: 信頼感重視 / 親しみ重視 / 写真を大きく見せる）
2. 各案はトップページのファーストビューだけを作り、3案をタブで切り替えられる1つのアーティファクトにして見せる（preview.md の「複数のページやデザイン案」）。スマホと PC の見え方はプレビューの中で切り替えられる
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
- お問い合わせ: ヒアリングで選んだ方法（Google フォームのリンク / 埋め込み / 自前のフォーム / 置かない）で作る。手順は references/forms.md

## 使うツールとバージョン

作り始めるときに、すべて最新版で始めます。版の番号は作業する日に調べ、記憶にある番号を使いません（runtime-update スキルの「最新版の調べ方」）。

- Node.js: 最新の LTS 版（作業する日に、状態が LTS の版のうち一番新しいもの）。`.node-version` に書く（templates/node-version.txt）。Current と奇数番は使わない（runtime-update の Node.js の基準）
- pnpm: 最新版。`package.json` の `packageManager` に書く（templates/package-json-fields.md）
- 依存パッケージ: 最新版。`pnpm create astro@latest`、`pnpm add <パッケージ>@latest` で入れる。npm と yarn は使わない
- pnpm の設定: templates/pnpm-workspace.yaml を置く（公開から1日たっていない版は入れない、インストール時のスクリプトは許可したものだけ）
- GitHub Actions: templates/github/ のワークフローと dependabot.yml（GitHub Actions の更新だけ）を、すべてのサイトに置く

HTML だけのサイト（A）は package.json を置かないので、pnpm と依存パッケージはありません。フォームを自前で作る場合など、Workers のコードを持つときだけ package.json を置きます。

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
- アダプターは入れない（B-1）。全ページがビルド時に HTML になり、`dist/` を静的アセットとして配信する

### 一部のページだけ SSR にする場合（B-2）

stack-selection.md の「SSR を使う場面」に当てはまる場合だけ行います。

1. `pnpm astro add cloudflare` でアダプターを追加する
2. SSR にするファイルだけに `export const prerender = false` を書く。ほかのページはそのまま SSG で出力される
3. 使わない機能は無効にする。セッションを使わないなら `session: false`。画像の変換は Cloudflare Images を使わず、ビルド時に変換する設定（`imageService: 'compile'`）にする（課金や設定の増加を避けるため）
4. `wrangler.jsonc` はアダプターのドキュメントに従う。Astro 6 以降は `main` に `@astrojs/cloudflare/entrypoints/server` を指定し、静的アセットの設定はアダプターが行う
5. SSR のページの動作を、ビルドしたものを `wrangler dev` などで実際に呼び出して確認する
6. site-maintenance スキルの「要保守構成の初期設定」を行う

```js
// astro.config.mjs（B-2 の例）
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://example.co.jp',
  integrations: [sitemap()],
  adapter: cloudflare({ imageService: 'compile' }),
  session: false,
});
```

```ts
// src/pages/api/contact.ts（この1ファイルだけ SSR）
export const prerender = false;
export async function POST({ request }) {
  // 入力の検証、送信回数の制限、メール送信
}
```

設定の名前はアダプターのバージョンで変わることがあるため、作業時に Astro の公式ドキュメントで確認します。

## C. EmDash

EmDash の公式ドキュメントに従ってセットアップします。テンプレートを選び、Cloudflare 上に Workers、D1、R2 を作成します。作成時は課金の有無をオーナーに確認します。テーマのデザインは B と同じ方針で作ります。

## wrangler.jsonc の例（A・B-1 共通）

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

リポジトリの直下に `.node-version`（templates/node-version.txt をコピー）を置きます。GitHub Actions はこのファイルの Node.js のバージョンを使います。
