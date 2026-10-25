# 例: 数百〜数千本の記事を持つメディア（JSON の事前ビルド＋Workers の SSR）

記事の多いメディアを、EmDash（データベースと管理画面を持つ CMS）を使わずに、GitHub と Cloudflare だけで運用できるかを確かめるためのサンプルです。ページの HTML は事前に作らず、記事と一覧の JSON だけを事前に作り、アクセスがあったときに Worker が JSON から HTML を組み立てます。組み立てた HTML は Workers Cache に置き、記事が変わったときだけ、その記事と一覧のキャッシュを入れ替えます。

検証の結果と分かったことは、このページの「計測の結果」と「分かったこと」にまとめています。スキル（skills/web-creator）にはまだ組み込んでいません。

## 全体の流れ

```
記事を書く（content/posts/<年>/<slug>.md、画像は R2）
  │  main に入る（書き手はプルリクエスト → 編集者が承認）
  ▼
GitHub Actions: deploy
  1. scripts/build-data.mjs で JSON を作る
     - 記事ごとのハッシュが前回と同じなら、Markdown の変換を飛ばす
     - 前回の manifest と比べて、何も変わっていなければ公開を飛ばす
  2. wrangler deploy（JSON は Static Assets。変わったファイルだけが上がる）
  3. scripts/purge-and-warm.mjs
     - 変わった記事と一覧のタグだけを Workers Cache からパージする
     - トップ、変わった記事、一覧を開いて、キャッシュを温める
  ▼
アクセス: Workers Cache にあればそのまま返す（Worker は動かない）
          なければ Worker が JSON を読み、HTML を組み立てて返し、キャッシュに置く
```

予約投稿は、公開時刻に一度だけ動く Claude のスケジュールタスクが deploy を動かします。常に動く cron は置きません。

## ファイル

| ファイル | 内容 |
|---|---|
| `content/posts/<年>/<slug>.md` | 記事。frontmatter は title、date（必須）、publishAt（予約投稿）、draft、tags、author、summary、image（＋imageWidth、imageHeight、imageAlt） |
| `site.config.json` | サイト名、URL、タグの一覧、分割のルール（`shard.maxPerShard`）、1ページの件数 |
| `scripts/build-data.mjs` | 記事 → JSON。ハッシュによるスキップ、分割、sitemap.xml、llms.txt、パージの計画（`.cache/purge-plan.json`） |
| `src/worker.ts` | ルーティング、JSON の読み込み、検索、R2 の画像の配信、パージの受け口 `/__cache/purge` |
| `src/render.ts` | HTML の組み立て（テンプレート文字列。ライブラリなし）、OGP、JSON-LD |
| `scripts/purge-and-warm.mjs` | 公開のあとのパージと温め |
| `scripts/schedule.mjs` | 予約投稿の一覧と、スケジュールタスクを作るときの値 |
| `scripts/upload-images.mjs` | 画像を R2 に上げ、記事に書く frontmatter を表示する |
| `scripts/sync-permissions.mjs` | GitHub のアカウントごとの権限（`permissions/members.json`）、CODEOWNERS、ルールセット、プルリクエストの確認 |
| `github/workflows/deploy.yml`、`check.yml` | サイトのリポジトリの `.github/workflows/` に置くワークフロー |
| `scripts/gen-dummy.mjs`、`bench.mjs`、`bench-latency.mjs`、`bench-astro.mjs` | 計測用 |
| `logs/` | 計測の結果（JSON） |

依存パッケージは開発用の `wrangler` と `marked`（ビルド時の Markdown の変換）だけです。公開された Worker は依存パッケージのコードを含みません（バンドルは 20 KiB、gzip で 7 KiB）。

## 動かし方

```bash
pnpm install
pnpm run build                 # dist/ に JSON などを作る
echo 'PURGE_TOKEN=local-test' > .dev.vars
npx wrangler dev               # http://localhost:8787
node scripts/upload-images.mjs --local <画像>   # 手元の R2 に画像を上げる
```

計測:

```bash
node scripts/bench.mjs 300 1000 3000 10000              # ビルド（logs/bench-build-*.json）
npx wrangler dev --assets bench-work/3000/dist --port 8789
node scripts/bench-latency.mjs http://localhost:8789 30 post-01500
node scripts/bench-astro.mjs 300 1000 3000 10000        # 比較: Astro で全ページを HTML にする
```

## 仕組み

### 1. JSON の事前ビルドと分割

- 記事1本ごとに `data/posts/<slug>.json`（本文の HTML を含む）
- 一覧と検索用の索引は、公開日の年で分ける（`data/index/<年>.json`、`data/search/<年>.json`）。1つの年が `maxPerShard`（既定 400）本を超えたら、その年だけ月で分ける（`2026-10` など）
- タグの一覧も、`maxPerShard` 本を超えたタグは新しい 400 本だけを本体に入れ、残りを `data/tags/<タグ>/<年>.json` に分ける。一覧は `/tags/<タグ>/<年>/` で見られる
- `data/shards.json` に分割の目録（年、件数、タグ）を置く。ハッシュは入れない（記事を足したときに目録が変わる回数を減らす）
- 記事の詳細の JSON は、ほかの記事に左右されない作りにしている（関連記事や前後の記事を入れない）。1本の記事を直したとき、パージが記事1つで済むようにするため

### 2. ハッシュによるスキップ

- 記事ごとに「原稿＋変換処理（build-data.mjs と marked の版）」のハッシュを取り、`.cache/posts/<ハッシュ>.json` に変換結果を残す。同じハッシュの記事は変換しない
- 出力の JSON は、中身が変わったときだけ書き換える
- 前回の manifest（記事と分割ファイルごとのハッシュ）と比べ、差がなければ `changed=false` を出し、CI は公開とパージを飛ばす
- `.cache` は GitHub Actions のキャッシュに置く。消えていても、公開中の `/manifest.json` と比べるので、差分のパージはできる（どちらもなければ全部をパージする）

### 3. SSR のキャッシュとパージ、温め

- Workers Cache（2026年に追加された、Worker の前に置くキャッシュ）を使う。workers.dev でも独自ドメインでも使え、ゾーンの設定がいらない。キャッシュに当たると Worker は動かず、CPU 時間もかからない（Cloudflare のドキュメント、2026-10-25 に確認）
- ページは `Cache-Tag` を付けて返す（記事 `post:<slug>`、年の一覧 `index:<年>`、タグ `tag:<タグ>`、トップ `latest`、検索 `search`）。`ctx.cache.purge({ tags })` で、変わったものだけを消す
- `cross_version_cache: true` にして、記事だけの公開でキャッシュを捨てないようにしている。Worker のコードや設定が変わったとき（manifest の `templateHash` が変わったとき）は、全部をパージする
- パージは Worker の中からしか呼べないので、秘密の文字列（`PURGE_TOKEN`）付きの `POST /__cache/purge` を用意し、CI から呼ぶ
- Workers Cache には「事前に入れておく」API がないため、パージのあとに `purge-and-warm.mjs` が主なページを開いて温める（Claude が手で開いてもよい）
- 404 はキャッシュしない（予約投稿が公開された直後に、古い 404 が残らないようにする）

### 4. 予約投稿（Claude のスケジュールタスクをその都度使う）

1. 記事の frontmatter に `publishAt: 2026-11-20T09:00:00+09:00` を書いて main に入れる。ビルドは publishAt を過ぎていない記事を出力しない（JSON にも sitemap にも出ない）
2. Claude が `node scripts/schedule.mjs <owner/repo>` を実行し、表示された値（`run_once_at` は publishAt の2分後）で、一度だけ動くスケジュールタスクを作る
3. 時刻になると、新しい会話が「記事が取り下げられていないかの確認 → deploy の workflow_dispatch → ページが開けるかの確認 → 失敗なら自動修正の手順」を行う

publishAt を過ぎると manifest に記事が増えるので、原稿が変わっていなくてもハッシュの比較で「変わった」と判定され、公開とパージが行われます。

### 5. 権限（GitHub のアカウントごと）

`permissions/members.json` に、GitHub のユーザー名と役割を書きます。GitHub のアカウントは各自が自分で作ります（パスワードと2段階認証は本人が行うため）。

| 役割 | GitHub の権限 | できること |
|---|---|---|
| admin（オーナー） | admin | すべて |
| editor（編集者） | maintain | 全部の記事と画像。書き手のプルリクエストを承認する |
| writer（書き手） | push | 自分の記事（frontmatter の author が自分）だけを作成・編集。main には直接入れられない |
| viewer（閲覧者） | pull | 読むだけ（非公開のリポジトリのとき） |

- `node scripts/sync-permissions.mjs plan <owner/repo>` で今の権限との差分を見て、オーナーの了承を得てから `apply` する（招待が届く）
- `codeowners` で `.github/CODEOWNERS` を、`ruleset` で main を守るルールセット（プルリクエスト必須、CODEOWNERS の承認必須、check の `permissions` 必須）を出す
- プルリクエストでは check.yml が `check-pr` を動かし、書き手が自分の記事以外（他人の記事、src/、設定）を変えていないかを確かめる。他人の記事の author を書き換えて奪うことも止める
- ルールセットは、GitHub Free では公開リポジトリだけで使える。非公開のリポジトリで書き手を制限するには GitHub Pro か Team が必要（2026-10-25 に GitHub のドキュメントで確認）。ルールセットがない場合、書き手は push 権限で main に直接入れられてしまうので、書き手は fork からのプルリクエストにするか、プランを上げる

### 6. 画像は R2

- 画像は Git にも Worker の静的ファイルにも入れず、R2 に置いて `/img/<キー>` で配る（Worker が R2 から読む。Workers Cache で1年キャッシュ）
- キーは「年/名前-中身のハッシュ8桁.拡張子」。同じ URL の中身は変わらないので、`immutable` にできる
- `images.lock.json` に上げた画像を記録し、同じ画像を上げ直さない。幅と高さもファイルから読んで表示する（記事に書いて、表示のずれを防ぐ）
- 先に skills/site-content-update/scripts/optimize_images.py でメタ情報を消して軽くしておく

### 7. SEO と AIO

- sitemap.xml、robots.txt、llms.txt はビルド時に作る（llms.txt は年ごとの一覧、タグ、新着30本と、機械で読むための JSON の場所）
- 記事は BlogPosting と BreadcrumbList、トップは WebSite（SearchAction）の JSON-LD。表示している内容だけを書く
- 検索結果のページは noindex
- Lighthouse（モバイル、手元の wrangler dev）: トップ、記事、タグの一覧のどれも、パフォーマンス・ユーザー補助・おすすめの方法・SEO が 100。320px と 375px で横スクロールなし

## 計測の結果（2026-10-25）

作業環境: Claude Code のクラウド環境（Intel Xeon 4コア）、Node.js 24.22.1、marked 18.1.1、wrangler 4.152.0、Astro 7.4.2。ダミー記事は1本 1,500〜2,500 字、2019〜2026 年に均等に配置、タグ2つまで。

### ビルドの時間（`scripts/bench.mjs`、ミリ秒、node の起動を含む）

| 記事数 | 初回（全部変換） | 変更なし | 1本の本文を修正 | 1本を追加 | 出力ファイル数 |
|---:|---:|---:|---:|---:|---:|
| 300 | 248 | 189（公開を飛ばす） | 222（変換1本、パージ1タグ） | 206（パージ6タグ） | 331 |
| 1,000 | 595 | 464（同） | 468（同） | 474（6タグ） | 1,031 |
| 3,000 | 1,531 | 1,269（同） | 1,150（同） | 1,147（7タグ） | 3,095 |
| 10,000 | 4,257 | 3,274（同） | 3,300（同） | 3,239（7タグ） | 10,267 |

比較: 同じ記事を Astro で全ページ HTML にした場合（`scripts/bench-astro.mjs`、記事ページと年の一覧だけの最小構成）

| 記事数 | Astro 初回 | Astro 2回目 |
|---:|---:|---:|
| 300 | 3,095 | 2,023 |
| 1,000 | 3,663 | 3,484 |
| 3,000 | 6,825 | 6,866 |
| 10,000 | 18,442 | 18,029 |

### 手元の Worker の応答時間（`scripts/bench-latency.mjs`、wrangler dev、30回の中央値、ミリ秒）

手元では Workers Cache が動かないため、すべて「キャッシュに当たらず Worker が組み立てた」時間です。

| 記事数 | 記事 | トップ | 年の一覧 | タグの一覧 | 検索（全期間） | 検索（年でしぼる） | JSON を直接 |
|---:|---:|---:|---:|---:|---:|---:|---:|
| 300 | 5.9 | 5.9 | 5.8 | 5.4 | 9.3 | 6.0 | 3.1 |
| 3,000 | 6.3 | 6.1 | 6.0 | 5.9 | 14.2 | 7.1 | 3.2 |
| 10,000 | 5.5 | 5.5 | 12.6 | 7.3 | 16.4 | 12.1 | 4.6 |

1万本で、年の一覧（月ごとに分けた年は 12 ファイルを読む）と検索が重くなります。最初の計測では、タグの一覧（1つ 629 KB）と全期間の検索（94 ファイルを全部読む、中央値 73 ms）がさらに重かったため、タグを年で分け、検索は新しい順に読んで50件で止めるように直しました（上の表は直したあと）。

### 出力の大きさ

| 記事数 | 記事の JSON（合計 / 1本の最大） | 一覧の分割（最大） | 検索の索引（最大） | タグ（最大） | sitemap.xml |
|---:|---:|---:|---:|---:|---:|
| 300 | 956 KB / 4 KB | 9 KB | 18 KB | 18 KB | 34 KB |
| 3,000 | 9.8 MB / 4 KB | 89 KB | 175 KB | 93 KB | 330 KB |
| 10,000 | 32.6 MB / 4 KB | 25 KB（月ごと） | 50 KB（月ごと） | 93 KB | 1.1 MB |

## 分かったこと

1. 数百〜数千本なら、ビルドの時間は問題にならない。Astro で全ページを HTML にしても 3,000 本で 7 秒、1万本で 18 秒だった。JSON の事前ビルドは Astro より 4〜6 倍速いが、どちらも GitHub Actions の待ち時間（数十秒）より短い。「ビルドが遅いから SSR にする」理由は、この規模では成り立たない
2. ハッシュによるスキップで減るのは、ビルドの時間より「公開とパージの量」。変更なしでも、記事を全部読んでハッシュを比べる時間（初回の 75〜80%）はかかる。効くのは、変更がないときに公開とパージを飛ばせること、1本の修正でパージが記事1つ（本文だけの修正のとき）で済むこと
3. 一覧と検索は、分割しないと記事数に比例して重くなる。年で分け、多い年とタグだけを細かく分け、検索は新しい順に読んで早く止めると、1万本でも手元で 15 ms 前後に収まった。それ以上は、外部の検索（クライアント側の全文検索など）を検討する
4. Workers Cache を有効にすると、静的ファイル（JSON、sitemap.xml）へのリクエストも含めて、すべてのリクエストが Workers のリクエストとして数えられる（Cloudflare のドキュメント、2026-10-25 に確認）。無料プランは1日 10 万リクエストまでなので、アクセスの多いメディアでは Workers の有料プラン（月5ドル〜）が前提になる。全部を静的ファイルにする Astro の SSG なら、静的ファイルへのリクエストは無料で無制限
5. Workers の無料プランの静的ファイルは1つの版で 2 万ファイルまで。この構成は記事1本につき JSON が1つなので、記事が2万本に近づくと上限にかかる（Astro の SSG でも同じ）。その規模では、記事の JSON をまとめるか、R2 や KV に置く
6. この構成は Worker のコードが公開されたサイトで動くので「要保守構成」になる。ただし Worker は依存パッケージを含まない（20 KiB）ため、保守の中身は wrangler と compatibility_date の更新が中心で、EmDash より軽い
7. 手元の wrangler dev（4.152.0）では Workers Cache が動かない（`ctx.cache` がなく、`cf-cache-status` も付かない）。キャッシュのヒット、パージ、温めは本番の Cloudflare でしか確かめられない

### どれを選ぶか（スキルへの反映の案）

- 数百〜数千本で、更新が1日数本まで: これまでどおり Astro（SSG のみ）。ビルドは十分に速く、要保守構成にならず、静的ファイルのリクエストは無料
- 次のどれかに当てはまるとき、この構成（JSON＋SSR）を検討する: 記事が1万本を超えて増え続ける / 1日に何十回も更新し、全ページの再ビルドと公開が重い / サイト内検索や予約投稿をサーバー側で行いたい / 書き手ごとの権限が必要（権限の仕組みは Astro でも使える）
- 管理画面が必須のときだけ EmDash（最終手段）

## 未検証のこと

- 本番の Cloudflare での動作（Workers Cache のヒット、タグでのパージ、温め、エッジでの応答時間）。手元では Workers Cache が動かないため
- GitHub Actions の上での deploy.yml と check.yml（キャッシュの復元と保存、`changed=false` での公開の省略、自動修正 autofix.yml との組み合わせ）
- スケジュールタスクによる予約投稿の実際の起動
- ルールセットと CODEOWNERS を入れたリポジトリでの、書き手のプルリクエスト
- R2 の画像を本番のバケットから配る時間と、R2 の無料枠（読み取り回数）の消費

## 本番に入れるときの手順（オーナーの了承が必要なもの）

1. R2 のバケットを作る（`wrangler r2 bucket create media-json-ssr-images`）。R2 を初めて使うアカウントでは、ダッシュボードで R2 を有効にする（支払い情報の登録が必要な場合はオーナーが行う）
2. `PURGE_TOKEN` を決めて `wrangler secret put PURGE_TOKEN` で Worker に登録し、同じ値を GitHub の Secrets に登録する（秘密の文字列の貼り付けはオーナーが行う）
3. GitHub の Variables に `SITE_URL` を登録する
4. 書き手がいる場合は、`sync-permissions.mjs plan` の結果をオーナーに見せてから `apply`、CODEOWNERS とルールセットを入れる
