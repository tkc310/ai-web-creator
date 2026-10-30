# デザインと制作

## デザイン案の出し方

1. ヒアリング結果から、方向性の違う3案を作る（例: 信頼感重視 / 親しみ重視 / 写真を大きく見せる）。案を作るときに frontend-design スキルを読み込み、その指針に沿って書体、色、余白、レイアウトを決める
2. 各案はトップページのファーストビューだけを作り、3案をタブで切り替えられる1つのアーティファクトにして見せる（preview.md の「複数のページやデザイン案」）。見せる前に、各案をスマホの狭い幅（このページの「スマホの幅」）で確かめる。スマホと PC の見え方はプレビューの中で切り替えられる
3. オーナーに1つ選んでもらう。「Aの色でBのレイアウト」のような組み合わせも受け付ける
4. 選ばれた案で全ページを作る
5. 全ページができたら、frontend-design スキルでブラッシュアップする（次の「frontend-design スキルでのブラッシュアップ」）
6. ブラッシュアップ後に、スマホの幅の確認と品質チェック（quality-gate.md）をやり直す

デザインでは、テンプレートのような見た目を避け、業種と対象者に合う書体、色、余白を選びます。

### 利用の上限で止まっても続けられるようにする

制作は長い作業で、Pro のプランでは途中で Claude の利用の上限に当たることがあります。止まっても続きから再開できるように、次のことを守ります。

- 作業のまとまり（3案を見せた、案が決まった、ページを1つ作った、仕上げた、品質チェックをした、監査をした）が終わるたびに、作業用のブランチにコミットして push する
- 同じときに、SITE.md の「制作の進み具合」の表を更新する（終わったこと、次にすること、オーナーに確かめ中のこと）
- 上限に当たって止まったら、止まった理由と、上限が戻るおよその時刻をオーナーに一文で伝え、再開のひと言（SKILL.md の「オーナーとの話し方」）を添える
- 時間とトークンを多く使う作業（全ページの仕上げ、セキュリティ監査）の前は、始めてよいかを先に聞く（security-audit.md の「頼み方」）

## frontend-design スキルでのブラッシュアップ

デザインの判断（案づくりと仕上げ）には、Anthropic の frontend-design スキルを使います。AI が作るサイトにありがちな、どこかで見たような見た目を避けるためです。

### 使えるようにする

デザインに入る前に、使えるスキルの一覧に frontend-design があるかを確かめます。

- ない場合は、オーナーの claude.ai のアカウントで有効にしてもらう（カスタマイズの画面で、Anthropic 公式の frontend-design を探して有効にする。3分くらい）。アカウントで有効にしたスキルとプラグインは、チャット、Cowork、Claude Code のクラウドの会話（サイトのプロジェクトを含む）に読み込まれる。画面の表示名は変わることがあるので、案内の前に Claude のヘルプで確かめる
- サイトのリポジトリの `.claude/settings.json` や `.claude/skills/` に置く方法は使わない。クラウドの会話（特にプロジェクトの会話）では読み込まれないため（Claude Code のドキュメントの cloud-environments と skills の「Use skills in Cowork and cloud sessions」）
- パソコンのターミナルで Claude Code を使う場合は、`/plugin install frontend-design@claude-plugins-official` でも入れられる
- オーナーが有効にできない場合や、Claude 以外のエージェントでは、待たずに進め、このページの「仕上げで見るところ」を自分で確かめる。使えなかったことは実行ログに書く

### 仕上げで見るところ

全ページができたあと、frontend-design スキルを読み込んで、次の観点で見直します。直すのはデザインの細部だけで、ページ構成、文章、オーナーが選んだ案の方向性は変えません。

1. 書体: 見出しと本文の組み合わせ、文字の大きさの段階、行の高さ、日本語の字間
2. 色: 選んだ案の色の使い方がページ間でそろっているか、強調色を使いすぎていないか
3. 余白とリズム: セクションの間隔、要素の揃え、カードやボタンの角の丸さがそろっているか
4. 細部: ボタンやリンクのホバーとフォーカスの見た目、写真の切り抜き、アイコンの線の太さ
5. スマホ: 狭い幅での見出しの改行位置、ヘッダーとメニュー、ボタンの押しやすさ（このページの「スマホの幅」）

直した部分は、変更前と変更後をプレビュー（preview.md）で見せてから main に入れます。Lighthouse の点数（特にパフォーマンスとユーザー補助）を下げる変更は入れません。アニメーションや装飾のためにライブラリや重い Web フォントを足さないのは、ブラッシュアップでも同じです。

構築をサブエージェント `site-builder` に任せる場合も、デザインの判断とブラッシュアップの指示はこのスキル（effort high）で行い、直す内容を具体的に書いて渡します。

## スマホの幅

スマホの表示は、iPhone SE の幅（375px）で崩れないことを必ず確かめます。古い iPhone SE（第1世代）や、画面の文字を大きくしている人の見え方に近い 320px でも、横スクロールが出ないようにします。一般的な iPhone（390px 前後）だけで確かめると、ヘッダーのメニューやボタンが狭い幅で2行に折り返していても気づけません。

作るときに守ること:

- ヘッダーは、ロゴとメニューが 320px でも1行に収まるようにする。収まらないメニューは、メニューボタン（開くと一覧が出るもの）にまとめる。ロゴの横の会社名は短くするか、狭い幅では小さくする
- ボタンやリンクの文字は折り返さないように、文字数と余白を決める（`white-space: nowrap` で無理に収めて、はみ出させない）
- 横に並べる要素（料金表、比較の表、カード）は、狭い幅では縦に並べるか、その部分だけ横にスクロールできるようにする
- 長い英単語や URL、メールアドレスは `overflow-wrap: anywhere` で折り返す
- タップする部分は 44×44px 以上にする
- 固定の幅（`width: 400px` など）は使わず、`max-width` と `%`、`min()` を使う

確かめ方（準備は下の「確かめる前の準備」）:

```bash
python3 skills/web-creator/scripts/check_mobile_width.py http://localhost:4321/ http://localhost:4321/news/sample/
```

320px、375px、390px の3つの幅で、横スクロール、画面からはみ出した要素、ヘッダーの中の折り返しを調べ、幅ごとのスクリーンショットを `mobile-shots/` に保存します。問題があれば NG と原因の要素を表示します。最後にスクリーンショットを目で見て、見出しの改行位置や重なりがないかを確かめます。ロゴとメニューを2段に分けるなど、意図して2段にしたヘッダーは NG と出ても問題ありません。

確かめるページは、Lighthouse で測るページ（quality-gate.md の「測るページ」）と同じにします。`mobile-shots/` はリポジトリに入れません（templates/gitignore.txt）。

### 確かめる前の準備

check_mobile_width.py、make_preview.py（URL を渡す場合）、run_lighthouse.sh は、ビルドしたサイトを作業環境の中で配信してから使います。

```bash
pnpm run build
pnpm astro preview --host 127.0.0.1 --port 4321 &   # 終わったら kill %1 で止める
python3 -c "import playwright" 2>/dev/null || { pip install playwright && python3 -m playwright install chromium; }
```

Chromium がすでに入っている作業環境では、`python3 -m playwright install chromium` の代わりに、その場所を `CHROME_PATH` で渡します（run_lighthouse.sh と同じ）。

## 共通の作り方

- スマートフォンで見たときの表示を先に作る
- 画像は WebP または AVIF にし、表示サイズに合わせて複数サイズを用意する。`width` と `height` を必ず指定する（レイアウトのずれを防ぐ）
- ファーストビューの画像だけ `fetchpriority="high"`、それ以外は `loading="lazy"`
- Webフォントは使う文字の太さを2種類までにする。日本語フォントを使う場合はサブセット化するか、システムフォントを使う
- JavaScript は必要な場所だけに書く。スライダーやアニメーションのライブラリは入れない
- 色のコントラスト比は 4.5:1 以上。画像には内容を説明する alt を付ける
- お問い合わせ: ヒアリングで選んだ方法（Google フォームのリンク / 埋め込み / 自前のフォーム / 置かない）で作る。手順は references/forms.md

## 使うツールとバージョン

作り始めるときに、すべて最新版で始めます。版の番号は作業する日に調べ、記憶にある番号を使いません（基準は versions.md、調べ方は runtime-update スキルの「最新版の調べ方」）。

- Node.js: 最新の LTS 版（作業する日に、状態が LTS の版のうち一番新しいもの）。`.node-version` に書く（templates/node-version.txt）。Current と奇数番は使わない（runtime-update の Node.js の基準）
- pnpm: 最新版。`package.json` の `packageManager` に書く（templates/package-json-fields.md）
- 依存パッケージ: 最新版。`pnpm create astro@latest`、`pnpm add <パッケージ>@latest` で入れる。npm と yarn は使わない
- pnpm の設定: templates/pnpm-workspace.yaml を置く（公開から3日たっていない版は入れない、インストール時のスクリプトは許可したものだけ）
- GitHub Actions: templates/github/ のワークフローと dependabot.yml（GitHub Actions の更新だけ）を、すべてのサイトに置く

## 作り始め（どのページの形でも同じ）

1ページの LP も含めて、すべて Astro のプロジェクトとして作ります。あとからページや記事を足すときも、同じリポジトリに足すだけで済みます。

1. 空のテンプレート（minimal）で、作業用の一時フォルダにプロジェクトを作り、サイトのリポジトリに写す。サイトのリポジトリには skills/、AGENTS.md、CLAUDE.md などがすでにあり、空でないフォルダでは作成のツールが質問で止まるため、別の場所で作る。`cp --update=none` は同じ名前のファイルを上書きしないので、skills/、AGENTS.md、CLAUDE.md、README.md は消えない（`cp -n` は coreutils の版によって、飛ばしたファイルがあると終了コード1を返すので使わない）

   ```bash
   tmp="$(mktemp -d)"
   pnpm create astro@latest "$tmp/site" --template minimal --no-install --no-git --skip-houston --yes
   cp -R --update=none "$tmp/site/." .
   rm -rf "$tmp"
   pnpm install
   ```

   テンプレートを取りに行けずに止まったとき（作業環境から GitHub のファイルを取得できないとき）は、`package.json`（templates/package-json-fields.md の scripts）、`astro.config.mjs`（`defineConfig({})` だけ）、`src/pages/index.astro` を手で作り、`pnpm add astro@latest` で入れる。サンプルのページや部品は残さない
2. `pnpm add -D wrangler@latest` で wrangler を入れる。公開のワークフロー（wrangler-action）は、入っている版を使うので、公開に使う版が pnpm-lock.yaml で固定され、runtime-update で更新できる（入れないと、公開のたびにその時点の wrangler を入れて動く）
3. `pnpm astro add sitemap --yes` で `@astrojs/sitemap` を入れ、`astro.config.mjs` の `site` に本番の URL（決まっていなければ workers.dev の URL）を書く
4. templates/ から、`.node-version`、`package.json` の項目、`pnpm-workspace.yaml`、`.gitignore`、`wrangler.jsonc`（このページの下の例）、GitHub Actions のワークフローを置く（deploy-and-autofix.md の「初回の設定」）
5. `src/layouts/Base.astro` に、head（タイトル、description、OGP、canonical、JSON-LD）をまとめる
6. `src/pages/404.astro` を作る（`wrangler.jsonc` の `not_found_handling: "404-page"` で使う）
7. `public/` に robots.txt、llms.txt、favicon、OG 画像を置く
8. `pnpm run build` を通し、`dist/` にページができることを確かめる
9. 作業用のブランチ（`claude/` で始まる名前。プロジェクトのスレッドでは、スレッドのブランチ）にコミットして push する。初めての公開（deploy-and-autofix.md）までは main に入れない

## ページの形ごとの構成

### 1ページの LP

```
src/
  pages/
    index.astro   … ページはこの1枚。セクションを順に並べる
    404.astro
  layouts/
    Base.astro    … head、OGP、JSON-LD をまとめる
  components/     … セクションごとの部品（Hero.astro、Features.astro、Contact.astro など）
  styles/         … 全体の CSS
public/            … robots.txt、llms.txt、favicon、og 画像、images/
astro.config.mjs   … site に本番 URL、@astrojs/sitemap を追加
wrangler.jsonc     … assets.directory は "./dist"
```

- 文章はセクションの部品の中に書く。お知らせなどの記事がないので、Content Collections は使わない
- ページ内のリンク（`#features` など）でセクションに移動できるようにし、ヘッダーのメニューもページ内リンクにする
- お問い合わせは、ヒアリングで選んだ方法で作る（forms.md）。サイトと同じ見た目のフォームを選んだ場合だけ、下の「一部のページだけ SSR にする場合」を行う
- あとでお知らせやページを足す場合は、下の「複数ページ・記事あり」の構成にそのまま広げる

### 複数ページ・記事あり

```
src/
  pages/        … index.astro, about.astro, news/index.astro, news/[slug].astro など
  layouts/      … Base.astro（head、OGP、JSON-LD をまとめる）
  components/
  content/      … news/*.md, blog/*.md
  content.config.ts … 記事の frontmatter の型（title, date, description, image, draft）
public/          … robots.txt, llms.txt, favicon, og 画像
astro.config.mjs … site に本番URLを設定、@astrojs/sitemap を追加
wrangler.jsonc   … assets.directory は "./dist"
```

- 記事一覧、記事ページ、タグ一覧は Content Collections から生成する
- `draft: true` の記事はビルドに含めない
- llms.txt はビルド時に記事一覧から生成するページ（`src/pages/llms.txt.ts`）にしてもよい
- アダプターは入れない（SSG のみ）。全ページがビルド時に HTML になり、`dist/` を静的アセットとして配信する

## 一部のページだけ SSR にする場合

stack-selection.md の「SSR を使う場面」に当てはまる場合だけ行います。

1. `pnpm astro add cloudflare --yes` でアダプターを追加する
2. SSR にするファイルだけに `export const prerender = false` を書く。ほかのページはそのまま SSG で出力される
3. 使わない機能は無効にする。セッションを使わないなら `session: false`。画像の変換は Cloudflare Images を使わず、ビルド時に変換する設定（`imageService: 'compile'`）にする（課金や設定の増加を避けるため）
4. `wrangler.jsonc` はアダプターのドキュメントに従う。Astro 6 以降は `main` に `@astrojs/cloudflare/entrypoints/server` を指定し、静的アセットの設定はアダプターが行う
5. SSR のページの動作を、ビルドしたものを `wrangler dev` などで実際に呼び出して確認する
6. site-maintenance スキルの「要保守構成の初期設定」を行う

```js
// astro.config.mjs（一部 SSR の例）
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

## wrangler.jsonc の例（SSG のみ）

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

リポジトリの直下に `.node-version` を置きます。GitHub Actions はこのファイルの Node.js のバージョンを使います。templates/node-version.txt は埋めて使うひな形で、数字は入っていません。作業する日の最新の LTS 版のメジャー番号を runtime-update スキルの「最新版の調べ方」で調べ、数字だけを書きます（例: `printf '26\n' > .node-version`）。`<` が残ったままだと、GitHub Actions が Node.js を用意できずに失敗します。
