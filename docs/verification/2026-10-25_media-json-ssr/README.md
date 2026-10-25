# 検証ログ: 数百〜数千本のメディアを JSON の事前ビルド＋Workers の SSR で配信する（2026-10-25）

- 対象: 検証用に作ったサンプル（example/media-json-ssr）。検証のあとに削除した。コードはプルリクエスト #6 の最初のコミット（5e29ad7）で見られる
- 目的: 記事の多いメディアを、EmDash（データベースと管理画面を持つ CMS）を使わずに、GitHub と Cloudflare だけで運用できるかを確かめる
- 検証した構想（オーナーの案）: 一覧・検索・記事詳細の JSON だけを事前に作り、アクセス時に Worker が SSR する / ハッシュが変わらなければビルドを飛ばす / 一覧と検索の JSON を年で分ける / SSR の結果をキャッシュし、ハッシュが変わったらパージして温め直す / 予約投稿は Claude のスケジュールタスクをその都度使う / GitHub アカウントごとの権限 / 画像は R2
- 状態: 手元（Claude Code のクラウド環境）での実装と計測で終了。本番の Cloudflare での計測は、オーナーの判断で行わない
- このフォルダ: 計測の元データ（bench-*.json）、ダミー記事を作る gen-dummy.mjs、Astro のビルドを測る bench-astro.mjs

## 検証したサンプルの構成（削除済み）

- 記事は `content/posts/<年>/<slug>.md`。ビルド（scripts/build-data.mjs、依存は marked だけ）が、記事1本ごとの JSON、年ごとの一覧と検索用の索引（1年が400本を超えたら月ごと）、タグごとの一覧（400本を超えたタグは年ごと）、目録、sitemap.xml、robots.txt、llms.txt、manifest（記事と分割ファイルごとのハッシュ）を作る。HTML は作らない
- 記事ごとに「原稿＋変換処理」のハッシュを取り、同じなら変換を飛ばす。前回の manifest と差がなければ、CI は公開を飛ばす
- Worker（依存なし、20 KiB）が JSON を静的ファイルのバインディングで読んで HTML を組み立て、`Cache-Tag`（`post:<slug>`、`index:<年>`、`tag:<タグ>` など）を付けて Workers Cache に置く。`cross_version_cache` を有効にし、記事だけの公開ではキャッシュを捨てない
- 公開のあと、CI が manifest の差分から変わったタグだけを `POST /__cache/purge`（秘密の文字列付き。中で `ctx.cache.purge`）でパージし、トップや変わった記事を開いて温める。Worker のコードが変わったときは全部をパージする
- 予約投稿は frontmatter の `publishAt`。過ぎるまでビルドに出さず、公開時刻の2分後に一度だけ動く Claude のスケジュールタスクが deploy を動かす
- 権限は `permissions/members.json`（admin / editor / writer / viewer）から GitHub の権限、CODEOWNERS、ルールセットを作り、プルリクエストで書き手が自分の記事（frontmatter の author）だけを変えたかを確かめる
- 画像は R2 に置き、キーに中身のハッシュを入れる（`年/名前-ハッシュ8桁.拡張子`）

## 結論

1. 数百〜数千本の規模では、ビルドの時間は問題にならない。同じ記事を Astro で全ページ HTML にしても、3,000 本で約 7 秒、1 万本で約 18 秒で終わった（下の「Astro との比較」。計測に使ったソースもそこに載せた）。この規模の標準は、これまでどおり Astro（SSG のみ）でよい
2. JSON＋SSR の構成は採用しない（不要）。Astro＋Cloudflare（SSG で全ページを HTML にして Workers の静的ファイルで配る）のビルドが十分に速く、SSR にすると Worker のコードを保守する必要が生まれ、Workers のリクエストの無料枠も使うため。JSON＋SSR で減らせるのは公開とキャッシュの入れ替えの量（変更なしなら公開を飛ばし、本文1本の修正ならパージは記事1つ）だが、この規模では Astro の再ビルドと再公開で困らない
3. 配信は、リクエストを Worker・CDN・R2 に分散させる方式が望ましい（次の節）。全部を Worker に通すと、Workers の無料枠（1日 10 万リクエスト）をすぐに使い切る。Astro の SSG でも、画像を R2 の独自ドメインで配る形は使える
4. 一覧と検索用の JSON（年ごとに分けた記事の一覧、タイトル・日付・タグ・本文の冒頭の索引）は、Astro のサイトでも活用できそう。Astro のビルドで静的ファイルとして書き出し、ブラウザの JavaScript が読んで、サイト内検索や絞り込み、「もっと見る」の読み込みを行う。静的ファイルなので Worker を動かさず、Workers の静的ファイルとして無料で配れる。年で分けておけば、検索で読む量を新しい年から必要な分だけにでき、記事が増えても1ファイルが大きくならない（1万本で1ファイル最大 50 KB。下の「出力の大きさ」の考え方）

## 望ましい配信の方式: Worker・CDN・R2 にリクエストを分散させる

何に対して料金や上限が数えられるかは、配り方で決まる（Cloudflare のドキュメント、2026-10-25 に確認）。

| 配り方 | 数えられるもの | 無料の範囲 |
|---|---|---|
| Worker が応答する（SSR） | Workers のリクエスト（Worker が動けば CPU 時間も） | 1日 10 万リクエスト。有料プランは月5ドル〜 |
| Workers Cache に当たった応答 | Workers のリクエスト（CPU 時間はかからない） | 同上 |
| Workers Cache を有効にした Worker の静的ファイル | Workers のリクエスト（有効にしていなければ無料） | 同上 |
| Workers の静的ファイル（Workers Cache なし） | 数えられない | 無料で無制限 |
| R2 を独自ドメインで公開し、CDN のキャッシュに当たった応答 | 数えられない | 無料 |
| R2 を独自ドメインで公開し、キャッシュに当たらなかった応答 | R2 の読み取り（Class B） | 月 1,000 万回。転送量は無料 |
| Worker の中で R2 や静的ファイルを読む処理 | 別のリクエストとしては数えない（R2 なら読み取り1回） | — |

このため、次のように役割を分けるのがよい。

- Worker: ページの HTML（SSR）だけを返す。記事や一覧の JSON は Worker の中から静的ファイルのバインディングで読む（訪問者のリクエストにはしない）
- CDN: HTML は Workers Cache、画像は R2 の前の CDN キャッシュで返し、Worker も R2 も動かさない
- R2: 画像を独自ドメイン（例: `img.example.com`）で直接公開する。画像のリクエストを Worker に通さない

注意:

- R2 の独自ドメインでの公開には、ドメインを Cloudflare で管理している必要がある。`r2.dev` の仮のアドレスは回数の制限があり、本番には使えない
- 検証したサンプルは、画像を Worker の `/img/` から配っていた（workers.dev だけで動かすため）。本番で作るときは、画像の URL を R2 の独自ドメインにする
- JSON を機械向けに公開する（llms.txt から案内している `/data/...`）と、Workers Cache を有効にした Worker では、そのリクエストも Workers のリクエストとして数えられる。アクセスが多ければ、JSON の公開をやめるか、R2 の独自ドメインに置く

出典:

- Workers Cache の料金（キャッシュに当たっても1リクエストとして数え、静的ファイルも数える）: https://developers.cloudflare.com/workers/cache/
- Workers の料金と R2 の料金（Class B は月 1,000 万回まで無料、転送量は無料）: https://developers.cloudflare.com/workers/platform/pricing/
- R2 の公開バケット（独自ドメインでキャッシュが使える、r2.dev は開発用で回数の制限あり）: https://developers.cloudflare.com/r2/buckets/public-buckets/

## 計測の環境

- Claude Code のクラウド環境（Intel Xeon 4コア）
- Node.js 24.22.1（nodejs.org の公式のバイナリ。環境に入っていた 22.22.0 は Astro 7 が対応していなかったため）
- pnpm 12.15.0、marked 18.1.1、wrangler 4.152.0、Astro 7.4.2
- ダミー記事: [gen-dummy.mjs](gen-dummy.mjs) で作成。1本 1,500〜2,500 字、2019〜2026 年に均等に配置、タグ2つまで、画像なし。乱数を固定しているので、何度作っても同じ記事になる
- 時間は node や npx の起動を含む実時間

## 計測の結果

### JSON の事前ビルド（サンプルの scripts/bench.mjs、ミリ秒）

| 記事数 | 初回（全部変換） | 変更なし | 1本の本文を修正 | 1本を追加 | 出力ファイル数 |
|---:|---:|---:|---:|---:|---:|
| 300 | 248 | 189（公開を飛ばす） | 222（変換1本、パージ1タグ） | 206（パージ6タグ） | 331 |
| 1,000 | 595 | 464（同） | 468（同） | 474（6タグ） | 1,031 |
| 3,000 | 1,531 | 1,269（同） | 1,150（同） | 1,147（7タグ） | 3,095 |
| 10,000 | 4,257 | 3,274（同） | 3,300（同） | 3,239（7タグ） | 10,267 |

元のデータ: [bench-build.json](bench-build.json)

### Astro との比較（bench-astro.mjs、ミリ秒）

同じダミー記事を、Astro の SSG（ビルド時に全ページを HTML にする）でビルドした時間。

| 記事数 | Astro 初回 | Astro 2回目 | 記事ページ数 |
|---:|---:|---:|---:|
| 300 | 3,095 | 2,023 | 301 |
| 1,000 | 3,663 | 3,484 | 1,001 |
| 3,000 | 6,825 | 6,866 | 3,001 |
| 10,000 | 18,442 | 18,029 | 10,001 |

元のデータ: [bench-astro.json](bench-astro.json)

読み方:

- 3,000 本で約 7 秒。GitHub Actions の準備（チェックアウト、Node.js と pnpm の用意、依存のインストール）だけで数十秒かかるので、ビルドの時間は全体の待ち時間をほとんど左右しない
- 2回目もほぼ同じ時間で、Astro のビルドは記事数にほぼ比例する（1本あたり約 1.8 ms）
- 最小構成での計測なので、実際のサイトはこれより遅くなる。特に `astro:assets` で画像を変換する場合は、画像の枚数に応じて大きく伸びる（このスキルの標準の構成は、画像を `public/` に置いて Astro では変換しない）。タグの一覧やページ送りのページを足しても、ページ数が増える分だけ伸びる

#### 計測に使ったソース

このフォルダの [bench-astro.mjs](bench-astro.mjs) が `<作業フォルダ>/astro/` に次の最小のプロジェクトを作り、`<作業フォルダ>/<記事数>/content` を読ませて `npx astro build` の時間を測る。初回の前に `.astro`、`node_modules/.astro`、`dist` を消す。

`astro.config.mjs`:

```js
import { defineConfig } from "astro/config";
export default defineConfig({ output: "static" });
```

`src/content.config.ts`:

```ts
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: process.env.CONTENT_DIR }),
  schema: z.object({ title: z.string(), date: z.coerce.date(), tags: z.array(z.string()), summary: z.string() }),
});
export const collections = { posts };
```

`src/pages/posts/[slug].astro`（記事1本ごとのページ）:

```astro
---
import { getCollection, render } from "astro:content";
export async function getStaticPaths() {
  const posts = await getCollection("posts");
  return posts.map((p) => ({ params: { slug: p.id.split("/").pop() }, props: { p } }));
}
const { p } = Astro.props;
const { Content } = await render(p);
---
<html lang="ja"><head><meta charset="utf-8"><title>{p.data.title}</title></head><body><h1>{p.data.title}</h1><Content /></body></html>
```

`src/pages/archive/[year].astro`（年ごとの一覧）:

```astro
---
import { getCollection } from "astro:content";
export async function getStaticPaths() {
  const posts = await getCollection("posts");
  const years = [...new Set(posts.map((p) => String(p.data.date.getUTCFullYear())))];
  return years.map((year) => ({ params: { year }, props: { posts: posts.filter((p) => String(p.data.date.getUTCFullYear()) === year) } }));
}
const { posts } = Astro.props;
---
<html lang="ja"><head><meta charset="utf-8"><title>archive</title></head><body><ol>{posts.map((p) => <li>{p.data.title}</li>)}</ol></body></html>
```

記事の例（このフォルダの [gen-dummy.mjs](gen-dummy.mjs) が作るもの）:

```markdown
---
title: 商店街と朝市をめぐる話（1500）
date: 2023-02-10
tags: [food, event]
summary: 商店街と朝市を歩いて見つけた、まちの小さな話題を紹介します。
---

（「〜のそばを歩くと、…」の段落が6〜10個と、h2 の見出しが1つ）
```

再現の手順:

```bash
cd docs/verification/2026-10-25_media-json-ssr
for n in 300 1000 3000 10000; do node gen-dummy.mjs $n work/$n/content; done
node bench-astro.mjs work 300 1000 3000 10000   # Node.js 22.23.4 以上が必要。初回は Astro をインストールする
```

`work/` は計測用の一時フォルダなので、終わったら消す（Git に入れない）。

### 手元の Worker の応答時間（サンプルの scripts/bench-latency.mjs、wrangler dev、30回の中央値、ミリ秒）

手元では Workers Cache が動かないため、すべて Worker が JSON から組み立てた時間（キャッシュなし）。

| 記事数 | 記事 | トップ | 年の一覧 | タグの一覧 | 検索（全期間） | 検索（年でしぼる） | JSON を直接 |
|---:|---:|---:|---:|---:|---:|---:|---:|
| 300 | 5.9 | 5.9 | 5.8 | 5.4 | 9.3 | 6.0 | 3.1 |
| 3,000 | 6.3 | 6.1 | 6.0 | 5.9 | 14.2 | 7.1 | 3.2 |
| 10,000 | 5.5 | 5.5 | 12.6 | 7.3 | 16.4 | 12.1 | 4.6 |

元のデータ: [bench-latency-local.json](bench-latency-local.json)

1万本の最初の計測で、タグの一覧（1ファイル 629 KB）と全期間の検索（94 ファイルを全部読む、中央値 73 ms）が重かった。タグを年で分け、検索を新しい順に読んで 50 件で止めるように直したあとの値が上の表。

### そのほか

- Lighthouse（モバイル、手元の wrangler dev）: トップ、記事、タグの一覧で、パフォーマンス・ユーザー補助・おすすめの方法・SEO がすべて 100。320px と 375px で横スクロールなし
- Worker のバンドル: 20 KiB（gzip 7 KiB）。依存パッケージのコードを含まない
- 予約投稿: `BUILD_NOW` を公開時刻の後にしてビルドすると、原稿を変えなくても manifest の差分で「変わった」と判定され、その記事、年の一覧、タグ、トップ、検索がパージの対象になった
- 権限: 書き手が他人の記事や `src/` を変えたプルリクエストを `check-pr` が止め、自分の記事だけなら通すことを確かめた

## 分かったこと（そのほか）

- ハッシュでスキップしても、変更なしのビルドは初回の 75〜80% の時間がかかる。全部の記事を読んでハッシュを比べる時間が残るため。スキップの効果は、ビルドの短縮より、公開とパージを飛ばせることにある
- Workers の無料プランの静的ファイルは1つの版で 2 万ファイルまで。記事1本につき JSON が1つなので、2 万本に近づくと上限にかかる（Astro の SSG も同じ）。その規模では、記事の JSON をまとめるか、R2 に置く
- この構成は、公開されたサイトで Worker のコードが動くので「要保守構成」になる。ただし Worker は依存パッケージを含まないので、保守は wrangler と compatibility_date の更新が中心
- GitHub のルールセット（書き手の制限に使う）は、GitHub Free では公開リポジトリだけで使える。非公開のリポジトリでは GitHub Pro か Team が必要（https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets 、2026-10-25 に確認）

## 未検証のこと（オーナーの判断で、本番の Cloudflare では検証しない）

- Workers Cache のヒット、タグでのパージ、温め、エッジでの応答時間（手元の wrangler dev 4.152.0 では `ctx.cache` がなく、Workers Cache が動かない）
- 画像を R2 の独自ドメインから配る構成
- GitHub Actions 上での公開と確認のワークフロー、自動修正との組み合わせ
- スケジュールタスクによる予約投稿の実際の起動
- ルールセットと CODEOWNERS を入れたリポジトリでの、書き手のプルリクエスト

## 次にやること

- 数千本までのメディアは、これまでどおり Astro（SSG）で作る。stack-selection.md に JSON＋SSR の構成は足さない
- Astro のサイトにサイト内検索を入れるときは、ビルド時に年ごとの一覧・検索用の JSON を書き出し、ブラウザで読む形を検討する（この検証の分け方と、新しい年から読んで必要な件数で止める読み方を使う）
- 画像を R2 の独自ドメインで配る形を、記事の多いサイト向けに検討する
