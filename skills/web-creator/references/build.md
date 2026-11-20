# デザインと制作

## デザイン案の出し方

デザインの判断（案づくり、トークンの決定、検証、仕上げ）は、design-nexus スキル（`skills/design-nexus/SKILL.md`）で行います。進め方は、このページの下の「design-nexus スキルの使い方」にあります。

1. design-nexus を読み込み、ヒアリングの答えから、方向性の違う3案を作る（design-nexus の build の手順2「Directions」。構成、価値、書体のジャンル、面の扱いが違う3案）。各案に、色、書体、余白、シグネチャ（そのサイトで覚えてもらう要素）のトークン計画を付ける（手順3「Token plan」と手順4「Challenge the plan」）
2. 各案はトップページのファーストビューだけを作り、3案をタブで切り替えられる1つのアーティファクトにして見せる（preview.md の「複数のページやデザイン案」）。見せる前に、各案をスマホの狭い幅（このページの「スマホの幅」）で確かめる。スマホと PC の見え方はプレビューの中で切り替えられる。design-nexus は推す案を1つ決めてそのまま進めるが、ここではおすすめを添えてオーナーに選んでもらう
3. オーナーに1つ選んでもらう。「Aの色でBのレイアウト」のような組み合わせも受け付ける
4. 選ばれた案のトークン計画を、サイトのリポジトリの直下の `DESIGN.md` に書く（ひな形は `skills/design-nexus/templates/DESIGN.md`）。`node skills/design-nexus/scripts/tokens-check.mjs DESIGN.md` で、配色のコントラストと整合性を確かめる
5. 選ばれた案で全ページを作る。色と大きさは DESIGN.md のトークン（CSS のカスタムプロパティ）だけを使う
6. 全ページができたら、design-nexus の検証と仕上げを行う（下の「仕上げの進め方」）
7. 仕上げのあとに、スマホの幅の確認と品質チェック（quality-gate.md）をやり直す

デザインでは、テンプレートのような見た目を避け、業種と対象者に合う書体、色、余白を選びます。

### 利用の上限で止まっても続けられるようにする

制作は長い作業で、Pro のプランでは途中で Claude の利用の上限に当たることがあります。止まっても続きから再開できるように、次のことを守ります。

- 作業のまとまり（3案を見せた、案が決まった、ページを1つ作った、仕上げた、品質チェックをした、監査をした）が終わるたびに、作業用のブランチにコミットして push する
- 同じときに、SITE.md の「制作の進み具合」の表を更新する（終わったこと、次にすること、オーナーに確かめ中のこと）
- 上限に当たって止まったら、止まった理由と、上限が戻るおよその時刻をオーナーに一文で伝え、再開のひと言（SKILL.md の「オーナーとの話し方」）を添える
- 時間とトークンを多く使う作業（全ページの仕上げ、セキュリティ監査）の前は、始めてよいかを先に聞く（security-audit.md の「頼み方」）

## design-nexus スキルの使い方

design-nexus は、作者が公開しているデザインのスキル（https://github.com/tkc310/design-nexus ）です。主題に根ざした3案とトークン計画で方向性を決め、依存のないチェック（lint、レンダーチェック、配色のチェック）でアクセシビリティとスマホの幅の最低ライン（Floor）を確かめ、DESIGN.md でページ間の見た目をそろえます。和文の組版にも対応しています。AI が作るサイトにありがちな、どこかで見たような見た目を避けるために使います。

### 使えるようにする

design-nexus は、配布元に同梱せず、作者のリポジトリ（https://github.com/tkc310/design-nexus ）を参照しています。skills-install.md の初回の手順の3で、`skills/web-creator/references/external-skills.txt` に決めた版を取得して `skills/design-nexus/` に置くので、オーナーが claude.ai のアカウントで有効にしたり、パソコンに入れたりする操作は要りません。デザインに入るときに `skills/design-nexus/SKILL.md` を読み、そこに書かれた `references/`、`scripts/`、`templates/` は `skills/design-nexus/` からの道のりとして読みます。

- `skills/design-nexus/` がないとき（古い版を取り込んだ、取り込みのときに取得できなかった）は、`bash skills/web-creator/scripts/fetch_external_skills.sh ./skills` をもう一度試す。置けたら `skills/VERSION` の最後に、skills-install.md の初回の手順の3と同じ行を足してコミットする。古い版で `external-skills.txt` がなければ、skills-install.md の「新しい版への更新」で新しい版に差し替えてから始める。差し替えられないときは、待たずに進め、下の「仕上げで見るところ」を自分で確かめて、使えなかったことを実行ログに書く
- frontend-design などほかのデザインのスキルは、design-nexus と同時に読み込まない（design-nexus の「Order of authority」。決まりがぶつかって、見た目がそろわなくなるため）
- `skills/design-nexus/` の中は直さない（次の取り込みで、決めた版に戻る）。直したいことは、サイトの決まりなら DESIGN.md に、スキルの改善点なら logs/IMPROVEMENTS.md（種類「スキル」）に書く

### このスキルとの決まりの合わせ方

- design-nexus には、次のことを「依頼（brief）」として渡す。design-nexus の既定と食い違うときは、こちらを優先する（design-nexus の「Order of authority」で、依頼は既定より上にある）
  - ヒアリングの答え（SITE.md の要点と logs/YYYY-MM-DD_hearing.md）。design-nexus の手順1「Ground」の質問（最大5つ）はしない。ヒアリングで聞いておらず、答えで方向が変わるものだけを、選択肢をつけて聞く（SKILL.md の「オーナーとの話し方」）
  - このページの「共通の作り方」と quality-gate.md の基準（Lighthouse の点数、軽さ）。アニメーションや装飾のためにライブラリや重い Web フォントを足さない
  - security-rules.md の決まり
- 流行の手法のデータベース（`skills/design-nexus/design-trends/`）は、ヒアリングでオーナーが「流行を取り入れたい」と答えたときだけ開く
- 予算は、トップページを `deep`、ほかのページを `standard`、公開後の小さな直しを `quick` にする。予算はオーナーに伝えず、実行ログに書く
- design-nexus が NOTES.md に書くように求めること（仮に置いた文章や数値など）は、実行ログ（logs/）に書き、NOTES.md は作らない。実在しないお客さまの声、実績の数値、取引先のロゴは、仮でもページに置かない
- 領域（surface）は `marketing` を使い、記事の一覧やお知らせのページも同じ参照で作る。日本語のページなので `references/japanese.md` を必ず読む
- 実行ログに、選んだ方向性、シグネチャ、lint とレンダーチェックの結果（段階ごとの件数）、理由をつけて残した指摘を書く

### 仕上げの進め方

全ページができたあと、design-nexus の手順6〜9（Verify、Critique、Remove one accessory、Record）を行います。直すのはデザインの細部だけで、ページ構成、文章、オーナーが選んだ案の方向性は変えません。

1. 検証する。ビルドして配信した状態（このページの「確かめる前の準備」）で、次を実行する。Floor の指摘（終了コード2）は必ず直す。Reflex の指摘は、直すか、理由をコードのコメント（`design-nexus: keep R03 because ...`）に書いて残す

   ```bash
   node skills/design-nexus/scripts/lint.mjs src/ --design DESIGN.md
   node skills/design-nexus/scripts/render-check.mjs http://localhost:4321/
   ```

   レンダーチェックは Node.js の Playwright を使います。見つからないときは自動で飛ばされるので、サイトの依存パッケージに Playwright を足さずに、check_mobile_width.py とスクリーンショットで代わりにします。スクリーンショットの保存先 `.design-nexus/shots/` はリポジトリに入れません（templates/gitignore.txt）
2. 講評する。320、768、1280、1920px のスクリーンショット（なければコード）を design-nexus の `references/audit.md` で見て、上位3つの問題を直し、もう一度検証する。トップページ（deep）では、サブエージェントが使えれば、別の文脈のサブエージェントに講評を頼む
3. いちばん要らない装飾を1つ外す
4. DESIGN.md に、足したトークンと部品、見送った案（Learnings）、使った見た目（Looks used）を書く

### 仕上げで見るところ

design-nexus のチェックに加えて、次の観点で全ページを見直します。design-nexus を読み込めないときも、この5つは必ず見ます。

1. 書体: 見出しと本文の組み合わせ、文字の大きさの段階、行の高さ、日本語の字間
2. 色: 選んだ案の色の使い方がページ間でそろっているか（DESIGN.md のトークンだけを使っているか）、強調色を使いすぎていないか
3. 余白とリズム: セクションの間隔、要素の揃え、カードやボタンの角の丸さがそろっているか
4. 細部: ボタンやリンクのホバーとフォーカスの見た目、写真の切り抜き、アイコンの線の太さ
5. スマホ: 狭い幅での見出しの改行位置、ヘッダーとメニュー、ボタンの押しやすさ（このページの「スマホの幅」）

直した部分は、変更前と変更後をプレビュー（preview.md）で見せてから main に入れます。Lighthouse の点数（特にパフォーマンスとユーザー補助）を下げる変更は入れません。

構築をサブエージェント `site-builder` に任せる場合も、デザインの判断と仕上げの指示はこのスキル（effort high）で行い、DESIGN.md を読むことと、直す内容を具体的に書いて渡します。

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

- Node.js: 最新の LTS の完全な版（versions.md。Current と奇数番は使わない）。`.node-version` は templates/node-version.txt を、中身を書き換えずに置く（runtime-update の Node.js の基準）
- pnpm: 最新版。`package.json` の `packageManager` に書く（templates/package-json-fields.md）
- 依存パッケージ: 最新版。`pnpm create astro@latest`、`pnpm add <パッケージ>@latest` で入れる。npm と yarn は使わない
- pnpm の設定: templates/pnpm-workspace.yaml を置く（公開から3日たっていない版は入れない、インストール時のスクリプトは許可したものだけ）
- GitHub Actions: templates/github/ のワークフローと dependabot.yml（GitHub Actions の更新だけ）を、すべてのサイトに置く

## 作り始め（どのページの形でも同じ）

1ページの LP も含めて、すべて Astro のプロジェクトとして作ります。あとからページや記事を足すときも、同じリポジトリに足すだけで済みます。

1. 空のテンプレート（minimal）で、作業用の一時フォルダにプロジェクトを作り、サイトのリポジトリに写す。依存パッケージはまだ入れない（`--no-install`）。サイトのリポジトリには skills/、AGENTS.md、CLAUDE.md などがすでにあり、空でないフォルダでは作成のツールが質問で止まるため、別の場所で作る。`cp --update=none` は同じ名前のファイルを上書きしないので、skills/、AGENTS.md、CLAUDE.md、README.md は消えない（`cp -n` は coreutils の版によって、飛ばしたファイルがあると終了コード1を返すので使わない）

   ```bash
   tmp="$(mktemp -d)"
   pnpm create astro@latest "$tmp/site" --template minimal --no-install --no-git --skip-houston --yes
   cp -R --update=none "$tmp/site/." .
   rm -rf "$tmp"
   ```

   テンプレートを取りに行けずに止まったとき（作業環境から GitHub のファイルを取得できないとき）は、`package.json`（templates/package-json-fields.md の scripts）、`astro.config.mjs`（`defineConfig({})` だけ）、`src/pages/index.astro` を手で作る。`astro` は手順3で入れる。サンプルのページや部品は残さない
2. `pnpm install` の前に、pnpm と Node.js の設定を置く。templates/ から `.node-version`、`pnpm-workspace.yaml`（公開から3日たっていない版を入れない設定と、インストール時のスクリプトの許可）、`package.json` の項目（`packageManager`、`engines`。templates/package-json-fields.md）を置く。先に入れると、この設定なしで依存パッケージが入り、pnpm-lock.yaml を作り直すことになるため
3. 依存パッケージを入れる。`pnpm install` はここで1回だけ行う（手で作った場合は、続けて `pnpm add astro@latest`）。続けて `pnpm add -D wrangler@latest` で wrangler を入れる。公開のワークフロー（wrangler-action）は、入っている版を使うので、公開に使う版が pnpm-lock.yaml で固定され、runtime-update で更新できる（入れないと、公開のたびにその時点の wrangler を入れて動く）。`pnpm astro add sitemap --yes` で `@astrojs/sitemap` を入れ、`astro.config.mjs` の `site` に本番の URL（決まっていなければ workers.dev の URL）を書く

   ```bash
   pnpm install
   pnpm add -D wrangler@latest
   pnpm astro add sitemap --yes
   ```

4. templates/ から、`.gitignore`、`wrangler.jsonc`（このページの下の例）、GitHub Actions のワークフローと `.github/scripts/smoke.sh` を置く（deploy-and-autofix.md の「初回の設定」）
5. `src/layouts/Base.astro` に、head（タイトル、description、OGP、canonical、JSON-LD）をまとめる
6. `src/pages/404.astro` を作る（`wrangler.jsonc` の `not_found_handling: "404-page"` で使う）
7. `public/` に robots.txt、llms.txt、favicon、OG 画像を置く
8. `pnpm run build` を通し、`dist/` にページができることを確かめる
9. 作業用のブランチ（`claude/` で始まる名前。プロジェクトのスレッドでは、スレッドのブランチ）にコミットして push する。ブランチの名前は SITE.md の「制作の進み具合」の「作業用のブランチ」に書く。サイトの中身は、初めての公開（deploy-and-autofix.md）まで main に入れない。ただし、skills/、scripts/check_text.py、SITE.md、AGENTS.md、CLAUDE.md は、取り込みのときに main にも入れる（skills-install.md の初回の手順の8。プロジェクトのスレッドは、新しく始まるたびに main から始まるため）

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

リポジトリの直下に `.node-version` を置きます。GitHub Actions はこのファイルの Node.js のバージョンを使います。templates/node-version.txt を、中身を書き換えずに `.node-version` として置きます（完全な版。版の番号は versions.md）。メジャー番号だけにすると、パッチが揃いません。
