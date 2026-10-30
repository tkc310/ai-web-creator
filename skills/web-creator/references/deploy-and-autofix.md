# 公開と自動修正

## 流れ

```
エージェントが変更を main に push
  → GitHub Actions「deploy」: ビルド → Cloudflare Workers に公開 → 公開後の確認（主なページが見られるか）
     ビルドか公開の段階で失敗したら
  → GitHub Actions「autofix」: Claude が原因を調べ、記事・画像・ログの中で直す → 変更の範囲を確かめる
     → コミットした状態からビルドし直す → push → 公開 → 公開後の確認
     それでも失敗したら、範囲の外の修正が要るときは、試行回数の上限に達したら
  → GitHub の Issue でオーナーに通知（GitHub からメールが届く）
     公開後の確認だけが失敗したときと、自動修正用の鍵がないときは、Claude を起動せずに Issue で知らせる
```

ビルドや公開の段階で失敗した場合、Cloudflare 上の前回のサイトは差し替わらずに表示され続けます。オーナーに説明するときは、まずこの点を伝えます。公開後の確認で失敗した場合だけは、新しい版がすでに公開されています（下の「表示がおかしいときに戻す」）。

deploy と autofix は同じ同時実行のグループ（`publish`）で動くので、2つの公開が重なることはありません。autofix は、失敗した版より新しいコミットが main にある場合と、作業の間に main が進んだ場合は、何もせずに終えます（新しい版の deploy が動くため）。

## 初回の設定

1. サイトのリポジトリに次をコピーする
   - templates/github/workflows/deploy.yml、autofix.yml、check.yml → `.github/workflows/`
   - templates/github/dependabot.yml → `.github/dependabot.yml`
   - templates/github/smoke-test.txt → `.github/smoke-test.txt`（下の「公開後の確認」。`<...>` を埋める）
   - templates/gitignore.txt → `.gitignore`
   - templates/node-version.txt → `.node-version`（Node.js のバージョン。runtime-update スキルの基準で、作業する日の最新の LTS 版にする）
   - templates/claude/settings.json → `.claude/settings.json`、templates/claude/agents/site-builder.md → `.claude/agents/site-builder.md`（使うモデルの設定。versions.md）
   - 要保守構成（一部のページを SSR にする場合）は、site-maintenance スキルの「要保守構成の初期設定」も行う
2. `wrangler.jsonc` を置く（build.md の例）
3. GitHub の Secrets を確かめる（値の登録はオーナーが行う。account-setup.md）
   - 必須: `CLOUDFLARE_API_TOKEN`、`CLOUDFLARE_ACCOUNT_ID`
   - 任意: 自動修正用の鍵。`CLAUDE_CODE_OAUTH_TOKEN` か `ANTHROPIC_API_KEY` のどちらか1つ。autofix.yml は両方の入力を渡しているので、どちらを登録してもワークフローは書き換えない。登録していなければ、失敗したときに Claude は起動せず、Issue で知らせるだけになる
4. アカウントの workers.dev のサブドメインがあるかを確かめる（account-setup.md の「2. Cloudflare」の手順8）。なければ、初めての公開で workers.dev の URL が使えない
5. `.github/smoke-test.txt` の `<...>` を、`https://<Worker の名前>.<アカウントのサブドメイン>.workers.dev/` とページの文字に書き換える。push の前に、`<` が残っていないことを確かめる

   ```bash
   grep -n '<' .github/smoke-test.txt && echo "まだ <...> が残っています"
   ```

   残っている行は、公開後の確認で飛ばされ、Actions に警告が出る（失敗にはならない）
6. main に push し、Actions のタブで deploy が成功し、「公開後の確認」が OK になったことを確認する
7. `https://<Worker の名前>.<アカウントのサブドメイン>.workers.dev` で表示を確認する

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
- 文字はページの HTML の中で探す。`&` や `<` を含む見出しは HTML の中では `&amp;` や `&lt;` になっているので、その書き方で書くか、記号を含まない言葉を選ぶ
- 転送（301 など）はたどってから確かめる
- 反映を待つため、1ページにつき10秒おきに5回まで試す（1回15秒まで待つ）
- `<...>` が残っている行は飛ばし、Actions に警告を出す。ファイルがない場合も、確認は省かれ、警告が出る
- 独自ドメインにつなぐときは、`wrangler.jsonc` に独自ドメインを書くのと同じコミットで、URL を本番のドメインに直す（下の「独自ドメインの接続」）
- ページの名前や見出しを変えたときは、同じコミットでこのファイルも直す
- autofix は `.github/` を変えられないので、このファイルを変えて確認を通すことはできない

## 独自ドメインの接続

取り消しにくい操作なので、オーナーの了承を得てから行います。今のサイトがある場合は、ここではなく migration.md の「5. ドメインと DNS の切り替え」で行います。

時期は2つに分かれます。

- ネームサーバーを Cloudflare に向ける操作は、数日前に済ませてよい。サイトの向き先は変わらない（今のサイトがない新しいドメインなら、いつ行ってもよい）
- サイトの向き先を Workers に変える操作（下の手順3）は、公開するときに行う

手順:

1. ドメインを Cloudflare に追加する（Cloudflare で取得した場合は済んでいる）
2. 他社で取得したドメインは、その会社の管理画面でネームサーバーを Cloudflare が指定する2つに変更する（オーナーが操作。反映に数時間〜1日かかることがある）
   - 既存のメールがある場合は、MX レコードなどが Cloudflare 側に引き継がれているかを切り替え前に必ず確認する。漏れるとメールが届かなくなる
3. `wrangler.jsonc` に次を追加し、同じコミットで `.github/smoke-test.txt` の URL を本番のドメインに直して push する。`routes` を足すと、`workers_dev` を書いていない限り、次の公開から workers.dev の URL は使えなくなる（versions.md の「時点つきの事実」）

```jsonc
"routes": [
  { "pattern": "example.co.jp", "custom_domain": true },
  { "pattern": "www.example.co.jp", "custom_domain": true }
]
```

4. www あり・なしのどちらかに統一するリダイレクトを設定する
5. `astro.config.mjs` の `site`、canonical、sitemap、llms.txt、JSON-LD の URL を本番ドメインにそろえる
6. アクセス解析（Cloudflare Web Analytics）を有効にする（analytics.md）

## プレビュー

公開前の確認は、Claude のアーティファクトで HTML のプレビューを作って見せます（preview.md）。大きな変更はブランチで作り、プレビューで了承を得てから main に入れます。フォームの送信など、実際のサーバーで動かさないと確かめられない機能を触って確認したい場合は、`wrangler versions upload` のプレビュー URL を使う方法がありますが、手順は実施前に Cloudflare のドキュメントで確認します。

## autofix の範囲

autofix が直すのは「直前の変更が原因で、ビルドか公開ができない」ケースのうち、記事、画像、ログの中で直せるものです。

### 変えてよいファイル

autofix.yml の `AUTOFIX_ALLOWED_PATHS` に書いた形のファイルだけです。標準は、安全を優先して次のものに限っています。

- 記事とデータ: `src/content/` の `.md`、`.json`、`.yaml`
- 画像: `src/content/`、`src/assets/`、`public/` の jpg、png、webp、avif、gif
- 実行ログ（`logs/`）と監査ログ（`audit-log/`）の `.md`

その中でも、`public/_headers`、`public/_redirects`、`public/_routes.json` と、実行できるコードを書ける `.mdx` は `AUTOFIX_DENIED_PATHS` で外しています。ページの部品やレイアウト（`.astro`）、CSS、設定、依存パッケージの修正が必要な場合は、autofix は直さず、Issue でオーナーに知らせます。オーナーが Claude に「サイトの公開が失敗しているので直して」と頼むと、プロジェクトの会話で直します。

Claude が変えたあと、ワークフローがビルドより前に、追加、変更、削除、名前の変更のすべてのパスを確かめます。日本語のファイル名もそのまま読めるように、`core.quotePath=false` と NUL 区切りで読みます。範囲の外のファイル、ファイルの削除、シンボリックリンク、実行できるファイルが1つでもあれば、コミットも push もせずに、変わったファイルの一覧を書いた Issue を立てて止まります。サイトの構成に合わせて範囲を変える場合は、SITE.md の「決めたことと理由」に理由を書きます。

### 安全のための作り

- checkout は `persist-credentials: false` にし、Claude が動く作業フォルダに書き込みの鍵を残さない。claude-code-action が設定したかもしれない認証情報も、範囲の確認のときに消す
- Claude が動かすコマンドの環境から、Anthropic などの鍵を取り除く（`CLAUDE_CODE_SUBPROCESS_ENV_SCRUB`）
- Claude には pnpm を動かさせない。範囲の確認のあと、作業フォルダを `git clean` で空にし、コミットした状態から `pnpm install` と `pnpm run build` をやり直す。Claude が作業フォルダに置いたもの（依存パッケージの中身など）は、ビルドにも公開にも使われない
- 依存パッケージのキャッシュは使わない（Claude が手を入れる作業環境のものを保存しないため）
- push は、ビルドが通ったあと、main が進んでいないことを確かめてから行う

### 試行回数の上限

- 過去24時間に autofix のコミット（`fix(autofix):`）が `AUTOFIX_MAX_PER_DAY` 回（標準は3回）あったら、Claude を起動せずに Issue で知らせる
- ラベル `autofix` の Issue が開いている間は、Claude を起動せず、その Issue にコメントを足す
- 1回の実行で Claude が使えるのは30ターンまで（`--max-turns 30`）

### Claude を起動しないもの

次は Claude を起動せず、Issue で知らせます。

- 公開後の確認だけが失敗した場合。新しい版はもう公開されていて、見出しを意図して変えたのかもしれないため、自動では戻さない。Issue に「見出しを意図して変えたなら、確認のリストを直して」「表示がおかしいなら、直前の変更を取り消して」の2つの頼み方を書く
- 自動修正用の鍵が登録されていない場合

次は Claude が起動しても直せないので、Issue で知らせることになります。

- Cloudflare のトークンの期限切れ、権限不足（オーナーが再発行する）
- 無料枠の上限（GitHub Actions の実行時間。非公開リポジトリは Free プランで月2,000分。最新の値は GitHub のドキュメントで確認する）
- 記事、画像、ログの外のファイル（`.astro`、設定、依存パッケージ）の修正が必要な問題

## Issue を閉じる人

autofix の Issue は、Claude が原因を直して公開し直したあとに閉じます。オーナーが「直して」と頼んだ会話の中で、公開後の確認が OK になったことを確かめてから閉じ、オーナーに「◯日の公開の失敗は、◯◯を直して公開し直しました」と一言伝えます。オーナーが自分で閉じてもかまいません。閉じるまで autofix は動きません。

autofix が自動で直した場合は、次にオーナーと話すときに「◯日に記事の画像の指定に誤りがあり、自動で直して公開しました」と一言伝えます。

## 表示がおかしいときに戻す

公開後の確認で失敗した、またはオーナーから「表示がおかしい」と言われたときは、新しい版が公開されています。原因がすぐに直せない場合は、直前の変更を取り消して前の状態に戻します。

1. 戻すことと、戻すと何が消えるか（直前に足した記事など）を一文で伝え、オーナーの「はい」を待つ
2. 原因のコミットを `git revert` で取り消すコミットを作り、main に push する。deploy が前の内容で公開し直す
3. 公開後の確認が OK になったことと、表示を確かめ、オーナーに伝える。監査ログに「取り消し」として書く

急いで前の版に戻す必要がある場合は、`wrangler rollback`（Cloudflare 上の前の版に戻す）も使えます。ただし、リポジトリの main は新しいままなので、次の push でまた新しい版が公開されます。使ったあとは、上の 2 で main もそろえます。自動の戻しはワークフローに入れていません。公開後の確認の失敗には、見出しを意図して変えただけの場合が含まれ、自動で戻すと意図した変更まで消えるためです。

## 知らせが届く場所

オーナーへの知らせは、次の3か所に届きます。オーナーにも、この3つを伝えておきます。

| 届く場所 | 届くもの | オーナーがすること |
|---|---|---|
| GitHub からのメール（Issue とワークフローの失敗） | 自動修正で直せなかった公開の失敗、保守で確認が必要な更新 | Claude に「GitHub から来たお知らせを見て対応して」と頼む |
| Claude のスケジュールタスクの画面 | 保守と振り返りの実行の結果 | ふだんは見なくてよい。確認が必要なときは、次の会話で Claude から聞く |
| プロジェクトの会話（またはセッション） | 確認が必要な項目（スキルの新しい版、GitHub Actions の更新、有料プランが必要な更新） | 「OK」か「見送って」で返す。有料プランが要る更新は、費用も一緒に伝える |

GitHub は、ワークフローが失敗すると push した人に通知メールを送ります。autofix が直した場合も、最初の失敗の通知は届くことがあるので、オーナーには「失敗の通知が来ても、自動で直った場合は何もしなくてよい」と伝えておきます。

## 失敗を減らすための決まり

- 依存パッケージは `pnpm-lock.yaml` で固定する。更新は runtime-update スキルでまとめて行う（要保守構成は2週間ごとの保守、静的なサイトは月1回の振り返り）。それ以外の作業のついでに更新しない
- 記事の追加では、エージェントが push の前に手元でビルドを通す
- Node.js のバージョンは `.node-version` の1か所で決める。ワークフローは `node-version-file` でこのファイルを読む
- 振り返りのスケジュールタスクを作らなかった静的なサイトでは、使っている Node.js のサポート終了日を SITE.md の「技術」に書いておき、その半年前にオーナーへ更新を提案する（runtime-update スキル）
