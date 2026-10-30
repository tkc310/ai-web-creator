# 公開と自動修正

## 流れ

```
エージェントが変更を main に push
  → GitHub Actions「deploy」: ビルド → Cloudflare Workers に公開 → 公開後の確認（主なページが見られるか）
     失敗したら
  → GitHub Actions「autofix」: Claude が原因を調べて直す → 変更の範囲を確かめる → ビルド確認 → コミット → 公開 → 公開後の確認
     それでも失敗したら、範囲の外を変えようとしたら、試行回数の上限に達したら
  → GitHub の Issue でオーナーに通知（GitHub からメールが届く）
```

ビルドや公開の段階で失敗した場合、Cloudflare 上の前回のサイトは差し替わらずに表示され続けます。オーナーに説明するときは、まずこの点を伝えます。公開後の確認で失敗した場合だけは、新しい版がすでに公開されています。

## 初回の設定

1. サイトのリポジトリに次をコピーする
   - templates/github/workflows/deploy.yml、autofix.yml、check.yml → `.github/workflows/`
   - templates/github/dependabot.yml → `.github/dependabot.yml`
   - templates/github/smoke-test.txt → `.github/smoke-test.txt`（下の「公開後の確認」。`<...>` を埋める）
   - templates/gitignore.txt → `.gitignore`
   - templates/node-version.txt → `.node-version`（Node.js のバージョン。runtime-update スキルの基準で、作成時点の LTS 版にする）
   - templates/claude/settings.json → `.claude/settings.json`、templates/claude/agents/site-builder.md → `.claude/agents/site-builder.md`（使うモデルの設定。versions.md）
   - 要保守構成（一部のページを SSR にする場合）は、site-maintenance スキルの「要保守構成の初期設定」も行う
2. `wrangler.jsonc` を置く（build.md の例）
3. GitHub の Secrets に次の3つが登録されていることを確認する（値の登録はオーナーが行う。account-setup.md）
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
   - `CLAUDE_CODE_OAUTH_TOKEN`（または `ANTHROPIC_API_KEY`。この場合は autofix.yml の入力名も変える）
4. main に push し、Actions のタブで deploy が成功し、「公開後の確認」が OK になったことを確認する
5. `https://<name>.<アカウントのサブドメイン>.workers.dev` で表示を確認する

## 公開後の確認（スモークテスト）

deploy ワークフローは、公開のあとに `.github/smoke-test.txt` に書いたページを開き、状態が 200 で、決めた文字を含むかを確かめます。CI を増やさないため、確かめるのはこれだけです。

```
# .github/smoke-test.txt
https://example.co.jp/ 株式会社サンプル
https://example.co.jp/news/ お知らせ
https://example.co.jp/contact/ お問い合わせ
```

- 1行に1つ、URL と、そのページに必ず含まれる文字を空白で区切って書く。文字には空白を含めてよい。`#` で始まる行は読まない
- 載せるのは、トップページと、ページの種類ごとに代表1つ（Lighthouse で測るページと同じ。quality-gate.md）。多くて5ページにする
- 文字は、表示が崩れても残る固有の言葉（サイト名、見出し）を選ぶ。日付や件数のように変わるものは選ばない
- 反映を待つため、1ページにつき10秒おきに5回まで試す
- 独自ドメインにつないだら、URL を本番のドメインに直す（下の「独自ドメインの接続」）
- ページの名前や見出しを変えたときは、同じコミットでこのファイルも直す
- ファイルがない場合、確認は省かれ、Actions に警告が出る
- autofix は `.github/` を変えられないので、このファイルを変えて確認を通すことはできない

## 独自ドメインの接続

取り消しにくい操作なので、オーナーの了承を得てから行います。今のサイトがある場合は、先に migration.md の「ドメインと DNS の切り替え」を読みます。

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
6. `.github/smoke-test.txt` の URL を本番ドメインに直す

## プレビュー

公開前の確認は、Claude のアーティファクトで HTML のプレビューを作って見せます（preview.md）。大きな変更はブランチで作り、プレビューで了承を得てから main に入れます。フォームの送信など、実際のサーバーで動かさないと確かめられない機能を触って確認したい場合は、`wrangler versions upload` のプレビュー URL を使う方法がありますが、手順は実施前に Cloudflare のドキュメントで確認します。

## autofix の範囲

autofix が直すのは「直前の変更が原因で公開できない」ケースです。

### 変えてよいファイル

autofix.yml の `AUTOFIX_ALLOWED_PATHS` に書いたパスだけです。標準は、記事（`src/content/`）、ページと部品（`src/pages/`、`src/components/`、`src/layouts/`、`src/styles/`、`src/assets/`）、画像などの公開ファイル（`public/`）、実行ログ（`logs/`）、監査ログ（`audit-log/`）です。その中でも、SSR の処理（`src/pages/api/`）とセキュリティのヘッダー（`public/_headers`）は `AUTOFIX_DENIED_PATHS` で外しています。

Claude が変えたあと、ワークフローが push の前に、追加、変更、削除、名前の変更のすべてのパスを確かめます。範囲の外のファイル（package.json、pnpm-lock.yaml、pnpm-workspace.yaml、scripts/、.github/、wrangler.*、astro.config.* など）が1つでも変わっていたら、コミットも push もせずに、変わったファイルの一覧を書いた Issue を立てて止まります。サイトの構成に合わせて範囲を変える場合は、SITE.md の「決めたことと理由」に理由を書きます。

### 試行回数の上限

- 過去24時間に autofix のコミット（`fix(autofix):`）が `AUTOFIX_MAX_PER_DAY` 回（標準は3回）あったら、Claude を起動せずに Issue で知らせる
- ラベル `autofix` の Issue が開いている間は、Claude を起動せず、その Issue にコメントを足す。原因を直したら Issue を閉じる（閉じるまで autofix は動かない）
- 1回の実行で Claude が使えるのは30ターンまで（`--max-turns 30`）

### 直さないもの

次は直さず、Issue で知らせます。

- Cloudflare のトークンの期限切れ、権限不足（オーナーが再発行する必要がある）
- 無料枠の上限（GitHub Actions の実行時間。非公開リポジトリは Free プランで月2,000分。最新の値は GitHub のドキュメントで確認する）
- 依存パッケージの更新や、設定ファイルの変更が必要な問題（範囲の外）

GitHub は、ワークフローが失敗すると push した人に通知メールを送ります。autofix が直した場合も、最初の失敗の通知は届くことがあるので、オーナーには「失敗の通知が来ても、自動で直った場合は何もしなくてよい」と伝えておきます。

autofix が動いた場合は、次にオーナーと話すときに「◯日に記事の画像の指定に誤りがあり、自動で直して公開しました」と一言伝えます。Issue が開いている場合は、原因を直して公開し直し、Issue を閉じます。

## 失敗を減らすための決まり

- 依存パッケージは `pnpm-lock.yaml` で固定する。更新は runtime-update スキルでまとめて行う（要保守構成は2週間ごとの保守、静的なサイトは月1回の振り返り）。それ以外の作業のついでに更新しない
- 記事の追加では、エージェントが push の前に手元でビルドを通す
- Node.js のバージョンは `.node-version` の1か所で決める。ワークフローは `node-version-file` でこのファイルを読む
- 振り返りのスケジュールタスクを作らなかった静的なサイトでは、使っている Node.js のサポート終了日を SITE.md の「技術」に書いておき、その半年前にオーナーへ更新を提案する（runtime-update スキル）
