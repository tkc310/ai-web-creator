# 公開と自動修正

## 流れ

```
エージェントが変更を main に push
  → GitHub Actions「deploy」: build（ビルド）→ publish（Cloudflare Workers に公開）→ smoke（公開後の確認）
     build のジョブで失敗したら
  → GitHub Actions「autofix」: Claude が原因を調べ、記事・画像・ログの中で直す → 変更の範囲を確かめる
     → コミットした状態からビルドし直す → push → 公開 → 公開後の確認
     それでも失敗したら、範囲の外の修正が要るときは、試行回数の上限に達したら
  → GitHub の Issue でオーナーに通知（GitHub からメールが届く）
     publish か smoke のジョブだけが失敗したときと、自動修正用の鍵がないときは、Claude を起動せずに Issue で知らせる
```

deploy.yml はジョブを3つ（`build`、`publish`、`smoke`）に分けています。autofix は、どのジョブが失敗したかをジョブの名前と結果で見分けます。ステップの名前では見分けないので、ステップの名前は変えてもかまいませんが、ジョブの名前（とジョブに `name:` を付けないこと）は変えません。`publish` のジョブはビルドをやり直してから公開します（ジョブの間でビルドの出力を受け渡すより壊れにくいため）。

ビルドや公開の段階で失敗した場合、Cloudflare 上の前回のサイトは差し替わらずに表示され続けます。オーナーに説明するときは、まずこの点を伝えます。公開後の確認で失敗した場合だけは、新しい版がすでに公開されています（下の「表示がおかしいときに戻す」）。

deploy と autofix は同じ同時実行のグループ（`publish`）で動くので、2つの公開が重なることはありません。autofix はグループをジョブの単位に書いているので、実際に動くときだけグループに入ります（deploy が成功したあとに起動して何もせずに終わる実行が、待っている deploy を取り消さないようにするため）。autofix は、失敗した版より新しいコミットが main にある場合と、作業の間に main が進んだ場合は、何もせずに終えます（新しい版の deploy が動くため）。

## 初回の設定

1. サイトのリポジトリに次をコピーする
   - templates/github/workflows/deploy.yml、autofix.yml、check.yml → `.github/workflows/`
   - templates/github/dependabot.yml → `.github/dependabot.yml`
   - templates/github/smoke-test.txt → `.github/smoke-test.txt`（下の「公開後の確認」。`<...>` を埋める）
   - templates/github/scripts/smoke.sh → `.github/scripts/smoke.sh`（公開後の確認の処理。deploy と autofix の両方が動かす。ワークフローのファイルではないので、`.github/workflows/` の push が拒否される場合も、ふつうに push できる）
   - templates/gitignore.txt → `.gitignore`
   - templates/node-version.txt → `.node-version`（Node.js のバージョン。ひな形なので、runtime-update スキルの基準で調べた、作業する日の最新の LTS 版のメジャー番号だけを書く）
   - templates/claude/settings.json → `.claude/settings.json`、templates/claude/agents/site-builder.md → `.claude/agents/site-builder.md`（使うモデルの設定。versions.md）
   - 要保守構成（一部のページを SSR にする場合）は、site-maintenance スキルの「要保守構成の初期設定」も行う
   - `.github/workflows/` のファイルの push が拒否されたら、下の「ワークフローのファイルを push できないとき」に進む
2. `wrangler.jsonc` を置く（build.md の例）
3. GitHub の Secrets を確かめる（値の登録はオーナーが行う。account-setup.md）
   - 必須: `CLOUDFLARE_API_TOKEN`、`CLOUDFLARE_ACCOUNT_ID`
   - 任意: 自動修正用の鍵。`CLAUDE_CODE_OAUTH_TOKEN` か `ANTHROPIC_API_KEY` のどちらか1つ。autofix.yml は両方の入力を渡しているので、どちらを登録してもワークフローは書き換えない。登録していなければ、失敗したときに Claude は起動せず、Issue で知らせるだけになる
4. アカウントの workers.dev のサブドメインがあるかを確かめる（account-setup.md の「2. Cloudflare」の手順8）。なければ、初めての公開で workers.dev の URL が使えない
5. `.github/smoke-test.txt` の `<...>` を、`https://<Worker の名前>.<アカウントのサブドメイン>.workers.dev/` とページの文字に書き換える。1ページのサイト（お知らせの一覧がないサイト）では、`/news/` の行を消す。push の前に、コメントの行（`#` で始まる行）のほかに `<` が残っていないことを確かめる

   ```bash
   grep -nE '^[^#]*<' .github/smoke-test.txt .node-version && echo "まだ <...> が残っています"
   ```

   残っている行は、公開後の確認で飛ばされ、Actions に警告が出る。確かめたページが0件のときは、初めての公開では警告だけで、2回目以降の公開では失敗になる
6. main に push し、Actions のタブで deploy の3つのジョブ（build、publish、smoke）が成功したことを確認する
7. `https://<Worker の名前>.<アカウントのサブドメイン>.workers.dev` で表示を確認する

## 公開後の確認（スモークテスト）

deploy ワークフローは、公開のあとに `.github/smoke-test.txt` に書いたページを開き、決めた状態（ふだんは 200）で、決めた文字を含むかを確かめます。CI を増やさないため、確かめるのはこれだけです。処理は `.github/scripts/smoke.sh` にまとめてあり、autofix の公開後の確認も同じものを動かします（autofix では、Claude が書き換えたものを動かさないよう、失敗した版のコミットから写して動かす）。

```
# .github/smoke-test.txt
https://example.co.jp/ 株式会社サンプル
https://example.co.jp/news/ お知らせ
https://example.co.jp/contact/ お問い合わせ
```

- 1行に1つ、URL と、そのページに必ず含まれる文字を空白で区切って書く。文字には空白を含めてよい。`#` で始まる行は読まない
- 200 以外の状態を確かめたいページは、URL のあとに3桁の数字で状態を書く（例: `https://example.co.jp/api/contact 405`。お問い合わせの受け口は、ブラウザで開くと 405 を返す）。状態を書いた行は、転送をたどらずにその応答を確かめる。状態を書かない行は 200 として、転送をたどってから確かめる
- 応答のヘッダーに `cf-mitigated: challenge` があるページ（Cloudflare のセキュリティの確認の画面が返った）は、失敗にせず警告にする。サイトは動いていて、GitHub Actions からの自動のアクセスが止められているだけのことが多いため。すべてのページがそうなったときは、確認が働いていないことを警告に出す（Cloudflare のドキュメント「Detect a Challenge Page response」、2026-10-30 確認: https://developers.cloudflare.com/cloudflare-challenges/challenge-types/challenge-pages/detect-response/ ）
- 載せるのは、トップページと、ページの種類ごとに代表1つ（Lighthouse で測るページと同じ。quality-gate.md）。多くて5ページにする
- 文字は、表示が崩れても残る固有の言葉（サイト名、見出し）を選ぶ。日付や件数のように変わるものは選ばない
- 文字はページの HTML の中で探す。`&` や `<` を含む見出しは HTML の中では `&amp;` や `&lt;` になっているので、その書き方で書くか、記号を含まない言葉を選ぶ
- 転送（301 など）はたどってから確かめる
- 反映を待つため、1ページにつき10秒おきに5回まで試す（1回15秒まで待つ）
- つながらない（状態 000）か 5xx のときは、独自ドメインにつないだ直後で証明書の発行を待っている可能性があるので、そのページで最大8分（`SMOKE_WAIT_SECONDS`）まで試し続ける。すべてのページで待つ長さの合計は、最初の確認から12分（`SMOKE_TOTAL_WAIT_SECONDS`）までにする（5ページがすべてつながらなくても、40分待ち続けないようにするため）。404 や、文字が見つからないときは、5回で終える。smoke のジョブの時間の上限は25分
- `<...>` が残っている行は飛ばし、Actions に警告を出す。ファイルがない場合も同じ
- 確かめたページが0件のとき（ファイルがない、すべての行に `<...>` が残っている）は、初めての公開では警告だけにし、2回目以降の公開（前に成功した deploy がある）では失敗にする。確認が働かないまま公開を続けないようにするため
- 1ページのサイトでは、ひな形の `/news/` の行を消す（ないページを確かめて失敗しないように）
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
3. `wrangler.jsonc` に次を追加し、同じコミットで `.github/smoke-test.txt` の URL を本番のドメインに直して push する。公開後の確認は、本番のドメインにつながるまで最大8分待つ。それでも失敗したら、取り消す前に数分おいて、ページを開けるかを確かめ直す（下の「公開後の確認をやり直す」）。`routes` を足すと、`workers_dev` を書いていない限り、次の公開から workers.dev の URL は使えなくなる（versions.md の「時点つきの事実」）

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

- 記事とデータ: `src/content/` の `.md`、`.json`、`.yaml`、`.yml`（下のフォルダも含む）
- 画像: `src/content/`、`src/assets/`、`public/` の jpg、jpeg、png、webp、avif、gif
- 実行ログ（`logs/`）と監査ログ（`audit-log/`）の `.md`

その中でも、`public/_headers`、`public/_redirects`、`public/_routes.json` と、実行できるコードを書ける `.mdx` は `AUTOFIX_DENIED_PATHS` で外しています。ページの部品やレイアウト（`.astro`）、CSS、設定、依存パッケージの修正が必要な場合は、autofix は直さず、Issue でオーナーに知らせます。オーナーが Claude に「サイトの公開が失敗しているので直して」と頼むと、プロジェクトの会話で直します。

1ページのサイト（お知らせの一覧がないサイト）は、文章が `.astro` のページに入っているので、autofix で直せるのは画像とログくらいです。ビルドの失敗のほとんどは Issue での知らせになります。オーナーには、公開するときに「1ページのサイトでは、公開の失敗は自動では直らないことが多く、知らせのメールが来たら Claude に頼んでください」と伝えます。

Claude が変えたあと、ワークフローがビルドより前に、追加、変更、削除、名前の変更のすべてのパスを確かめます。日本語のファイル名もそのまま読めるように、`core.quotePath=false` と NUL 区切りで読みます。範囲の外のファイル、ファイルの削除、シンボリックリンク、実行できるファイルが1つでもあれば、コミットも push もせずに、変わったファイルの一覧を書いた Issue を立てて止まります。サイトの構成に合わせて範囲を変える場合は、SITE.md の「決めたことと理由」に理由を書きます。

### 安全のための作り

- checkout は `persist-credentials: false` にし、Claude が動く作業フォルダに書き込みの鍵を残さない。git の設定の認証情報（`extraheader` など）は、Claude を起動する前と、Claude が終わったあとの範囲の確認のときの2回消す（claude-code-action が実行の間に書き込むことがあるため）
- Claude が動かすコマンドの環境から、Anthropic などの鍵を取り除く（`CLAUDE_CODE_SUBPROCESS_ENV_SCRUB`。名前で鍵と分かる変数と、値が鍵の形の変数を取り除く。`GITHUB_TOKEN` は残るので、ジョブの permissions は要るものだけにしている。Claude Code のドキュメント「Environment variables」の What the subprocess environment scrub removes）
- Claude に渡す道具を絞る（autofix.yml の `claude_args`）
  - Edit は変えてよいフォルダだけ。Edit の許可は Write にも効くので、新しいログのファイル（`logs/` と `audit-log/`）も作れる。`Write(パス)` の書き方は Claude Code では当たらないので使わない
  - Bash は引数まで決めた `git log -5`、`git diff HEAD~1`、`git status` だけ。`Bash(git log:*)` のように `*` を付けると、`git log --output=<ファイル>` でどんなファイルにも書けてしまうため。日付と時刻は、ワークフローが調べてプロンプトに入れる
  - 作業フォルダの外は読ませない（`blockReadsOutsideWorkingDirectories`）。作業フォルダの中でも、`.git/`、`.env*`、`.dev.vars*` は拒否のルールで読ませない。`/proc`、`/sys`、ホームの git の認証情報も拒否する
  - `cat`、`head`、`grep`、`ls` のような読むだけのコマンドは、Claude Code では許可なしで動く。Read の拒否のルールは、`cat .git/config` のようにファイルの名前を書いたコマンドにも効くが、名前を書かずに読むコマンド（フォルダの中を `grep -r` で探す、など）や、スクリプトが自分で開くファイルには効かない（Claude Code のドキュメント「Configure permissions」の Read-only commands と Read and Edit）。そのため、環境変数をまとめて出す `env`、`printenv`、`set`、`export`、`declare`、`compgen` は Bash の拒否のルールに書き、鍵そのものは `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB` で環境から取り除き、最後に check_text.py でログと Issue に鍵の形の文字がないかを確かめる。実際に読めないことは、使い捨てのリポジトリで確かめる（配布元の README の「版の付け方」の手順4。未確認）
  - ウェブの取得（WebFetch、WebSearch）は使わせない
  - 決まりの書き方は Claude Code のドキュメント「Configure permissions」による（versions.md の「時点つきの事実」）。実際に読めないことは、使い捨てのリポジトリで確かめる（配布元の README の「版の付け方」の手順4）
- scripts/check_text.py は、作業フォルダのものを動かさない。失敗した版のコミットから `git show` で `$RUNNER_TEMP` に写し、`python3 -I`（作業フォルダやスクリプトのフォルダから Python のファイルを読み込まない）で動かす。Claude が作業フォルダに置いたファイルが、確かめる道具に読み込まれないようにするため
- 範囲の外のファイルや、機密情報の疑いが見つかったときは、`git reset --hard` と `git clean -ffdx` で作業フォルダを元に戻してから、Issue を立てる
- Claude には pnpm を動かさせない。範囲の確認のあと、作業フォルダを `git clean` で空にし、コミットした状態から `pnpm install` と `pnpm run build` をやり直す。Claude が作業フォルダに置いたもの（依存パッケージの中身など）は、ビルドにも公開にも使われない
- 依存パッケージのキャッシュは使わない（Claude が手を入れる作業環境のものを保存しないため）
- push は、ビルドが通ったあと、main が進んでいないことを確かめてから行う
- scripts/check_text.py がないときは、変えたファイルを確かめずに公開しないよう、コミットせずに止める
- 記事（`src/content/`）は、失敗した版のファイルを `$RUNNER_TEMP` に写して check_text.py の `--baseline` で比べ、新しく増えた指摘だけで止める。もとから動画の埋め込み（iframe のタグ）がある記事の frontmatter を直しただけで止まらないようにするため。実行ログと監査ログ（`logs/`、`audit-log/`）では、埋め込みやスクリプトのタグの記述は調べない（公開されるページにならないため。機密情報、見えない文字、AI に向けた命令の疑いは調べる）。プロンプトでも「ログにはタグを山かっこのまま書かない」と頼んでいる
- autofix の Claude は、CLAUDE.md と AGENTS.md を読み込んでも、プロンプトだけに従う（CLAUDE.md のひな形の先頭と、プロンプトの手順1に書いている）。作業用のブランチへの切り替えやオーナーへの確認のような、ふだんの作業の決まりを当てはめないため
- サイトの `.claude/settings.json` には、許可（`permissions.allow`）と hooks を書かない。autofix の Claude もこのファイルを読むので、許可が広がるため。templates/claude/settings.json はモデルと effort だけにしている

### 試行回数の上限

- 過去24時間に autofix のコミット（`fix(autofix):`）が `AUTOFIX_MAX_PER_DAY` 回（標準は3回）あったら、Claude を起動せずに Issue で知らせる。Claude が変えたのがログ（`logs/`、`audit-log/`）だけのときは、コミットを `chore(autofix):` にして、回数に数えない（一時的な障害で公開をやり直しただけのため）
- ラベル `autofix` の Issue が開いている間は、Claude を起動せず、その Issue にコメントを足す。Claude を起動しない知らせ（下の「Claude を起動しないもの」の公開だけ、公開後の確認だけの失敗など）は、ラベル `deploy-notice` の Issue にするので、開いていても自動修正は止まらない
- 自動修正用の鍵が受け付けられなかったとき（Claude を無料のプランに下げた月、鍵の期限切れや取り消しなど）は、ラベル `autofix-paused` の Issue（題名「Claude が使えないため、自動修正が止まっています」）にする。開いていても自動修正は止めないので、Pro に戻せばそのまま動く。同じラベルの Issue が開いていれば、新しく立てずにコメントを足す。自動修正の Claude が次に動いたら、ワークフローの最後のステップがこの Issue を閉じる。見分け方は、`execution_file` の assistant のメッセージの `error` が `authentication_failed` か `oauth_org_not_allowed` のとき、または結果の文に認証の失敗の文言（`Failed to authenticate`、`Invalid API key`、`API Error: 401` など）があり、料金（`total_cost_usd`）が 0 のとき（Agent SDK のドキュメント「TypeScript reference」の SDKAssistantMessageError と、Claude Code のドキュメント「Errors」の OAuth token revoked or expired、2026-10-31 確認: https://code.claude.com/docs/en/agent-sdk/typescript 、https://code.claude.com/docs/en/errors ）。認証の文言が出ずに `is_error: true` だけで終わる例も報告されている（anthropics/claude-code-action の Issue #1281）。見分けられなかったときは、下の「Claude の実行が途中で止まった」の Issue になり、その先頭にも無料のプランを書いている。無料のプランの鍵で実際にどう失敗するかは、作者が配布元の README の「版の付け方」の手順4で確かめる（未確認）
- 1回の実行で Claude が使えるのは30ターンまで（`--max-turns 30`）。上限で止まったときは、Issue の本文で、鍵や利用の上限で止まった場合と書き分ける（claude-code-action の `execution_file` の最後の結果が `error_max_turns` かで見分ける。Claude Code のドキュメント「How the agent loop works」の Handle the result。`execution_file` の形は実機で確かめる）

### Claude を起動しないもの

Claude を起動するのは、deploy の `build` のジョブが失敗したときだけです。次は Claude を起動せず、Issue を立てて、autofix の実行は成功として終えます（失敗の通知メールが deploy と autofix の2通にならないようにするため）。公開だけ、公開後の確認だけの失敗と、ジョブの結果が読めない場合はラベル `deploy-notice`、それ以外（ビルドの失敗）はラベル `autofix` を付けます。

- `smoke`（公開後の確認）だけが失敗した場合。新しい版はもう公開されていて、見出しを意図して変えたのかもしれないため、自動では戻さない。Issue に「独自ドメインにつないだ直後なら、数分おいて確かめ直して」「見出しを意図して変えたなら、確認のリストを直して」「表示がおかしいなら、直前の変更を取り消して」の3つの頼み方を書く
- `publish`（Cloudflare への公開）だけが失敗した場合。Cloudflare のトークンの期限切れや権限の不足、workers.dev のサブドメインがない、など、記事や画像では直せない原因が多いため
- 自動修正用の鍵が登録されていない場合、試行回数の上限に達した場合、自動修正の Issue が開いている場合
- ジョブの結果が読めない場合（時間切れ、GitHub 側の不調など）

次は Claude が起動しても直せないので、Issue で知らせることになります。

- 無料枠の上限（GitHub Actions の実行時間。非公開リポジトリは、Free プランで毎月12ドル分。Linux の標準のランナーで約2,000分。GitHub のドキュメント「GitHub Actions billing」、2026-10-30 確認: https://docs.github.com/en/billing/concepts/product-billing/github-actions 。最新の値は作業の日に確かめる）
- 記事、画像、ログの外のファイル（`.astro`、設定、依存パッケージ）の修正が必要な問題

### Issue の本文

Issue の本文は、何が起きたかで書き分けます。どの場合も、公開中のサイトが前回の版のままか、新しい版になっているかを最初の1文に書きます。

| 起きたこと | 公開中のサイト | 本文に書く頼み方 |
|---|---|---|
| ビルドの失敗を直せなかった、範囲の外の修正が要る | 前回の版のまま | 「サイトの公開が失敗しているので直して」 |
| 自動修正用の鍵が受け付けられなかった（ラベル `autofix-paused`） | 前回の版のまま | 「Claude が無料のプランなどで使えないため、自動修正は止まっています。Pro に戻すか、GitHub の画面で直してください」。Pro に戻した日に送るひと言と、Pro のままなら鍵を直すよう頼む文も書く |
| Claude の実行が途中で止まった | 前回の版のまま | 考えられる原因を並べる（無料のプランに下げている、鍵の期限切れか取り消し、鍵の登録の間違い、利用の上限、一時的な不調）。鍵の発行日は SITE.md の「技術」。「公開が失敗しているので直して。自動修正用の鍵の期限も確かめて」 |
| Claude が30ターンの上限で止まった | 前回の版のまま | 鍵や利用の上限の問題ではない。「サイトの公開が失敗しているので直して」 |
| 公開の段階だけの失敗 | 前回の版のまま | Cloudflare の鍵や設定の可能性。「サイトの公開が失敗しているので直して」 |
| 公開後の確認だけの失敗（deploy でも autofix の公開のあとでも） | 新しい版 | 上の3つの頼み方 |

ラベルは、ビルドの段階の失敗と、自動修正で公開したあとの失敗が `autofix`（開いている間は自動修正を試さない）、Claude を起動しない知らせが `deploy-notice`（開いていても自動修正は止まらない）、自動修正用の鍵が受け付けられなかった知らせが `autofix-paused`（開いていても自動修正は止まらない。自動修正がまた動いたら自動で閉じる）です。

Claude が調べた原因（autofix が書いた `logs/*_autofix.md`）は、check_text.py で確かめてから、本文の「自動修正の Claude が調べた原因」に入れます（3,000字まで）。範囲の外の修正が要るときも、どのファイルをどう変えるかが Issue に残るので、オーナーが Issue を Claude に見せれば、調べ直さずに直せます。機密情報や AI に向けた命令の疑いがあるときは、本文に入れません。

## Issue を閉じる人

autofix と deploy-notice の Issue は、Claude が原因を直して公開し直したあとに閉じます。オーナーが「直して」と頼んだ会話の中で、公開後の確認が OK になったことを確かめてから閉じ、オーナーに「◯日の公開の失敗は、◯◯を直して公開し直しました」と一言伝えます。オーナーが自分で閉じてもかまいません。ラベル autofix の Issue（題名「サイトの公開に失敗しました」）は、閉じるまで autofix が動きません。ラベル deploy-notice の Issue（題名「サイトの公開について確認してください」）は、開いていても autofix を止めません。ラベル autofix-paused の Issue（題名「Claude が使えないため、自動修正が止まっています」）も autofix を止めず、自動修正の Claude が次に動いたときにワークフローが閉じます。Pro に戻した日の作業（site-review の「Pro に戻した日」）では、この Issue に書かれた失敗の公開が直っているかを確かめます。

クラウドの作業環境では `gh issue` と `gh pr` が使えません（GitHub の GraphQL が拒否される。versions.md の「時点つきの事実」）。Issue やプルリクエストの操作は、REST の `gh api` で行います。

下の `{owner}/{repo}` は、gh が作業フォルダの origin から読み取って置き換えます。クラウドの作業環境では origin が中継の住所になっていて、読み取れないことがあります（`none of the git remotes configured for this repository point to a known GitHub host` などと出る）。そのときは、同じ呼び出しの最初に `export GH_REPO=<owner>/<repo>`（SITE.md の「技術」の「リポジトリ」の値）を書きます。gh は、`GH_REPO` があれば `{owner}/{repo}` をその値で置き換えます（`gh api --help`）。

- Issue を閉じる: `gh api -X PATCH 'repos/{owner}/{repo}/issues/<番号>' -f state=closed`
- 開いている autofix の Issue を探す: `gh api 'repos/{owner}/{repo}/issues?state=open&labels=autofix' --jq '.[].number'`（知らせは `labels=deploy-notice`、鍵が受け付けられなかった知らせは `labels=autofix-paused`）
- プルリクエストを作る: `gh api 'repos/{owner}/{repo}/pulls' -f title='<題名>' -f head='<ブランチ>' -f base=main -f body='<本文>'`
- Issue を作る（保守や振り返りでオーナーに確かめたいことを知らせる）: `gh api 'repos/{owner}/{repo}/issues' -f title='<題名>' -f body="$(cat <本文のファイル>)" -f 'labels[]=owner-check'`。本文はファイルに書いて check_text.py で確かめてから渡す。ラベルがまだなければ、先に `gh api 'repos/{owner}/{repo}/labels' -f name=owner-check -f color=0E8A16 -f description='オーナーに確かめたいこと'` で作る（すでにあれば 422 が返るだけなので、そのまま進める）
- `gh api` も GitHub のツールも使えないときは、Issue の代わりに SITE.md の「オーナーへの確認待ち」に書き、次にオーナーと話すときに伝える
- 失敗したジョブをやり直す: `gh run rerun <実行の番号> --failed`（REST なので使える）

autofix が自動で直した場合は、次にオーナーと話すときに「◯日に記事の画像の指定に誤りがあり、自動で直して公開しました」と一言伝えます。

## ワークフローのファイルを push できないとき

Claude の GitHub アプリ経由では、`.github/workflows/` のファイルを足したり変えたりする push が拒否される、という報告があります（2026年10月時点で未確認。GitHub では、アプリがワークフローのファイルを変えるには workflows の権限が要る）。初回の設定や、スキルの更新でワークフローを変えるときに、push が `refusing to allow ... workflow` のような理由で拒否されたら、次の手順に切り替えます。所要時間は、ファイル1つにつき5分くらいです。

標準は、ファイルを渡して GitHub の画面に置いてもらう方法（Upload files）です。長い中身を貼り付けるより、写し間違いが起きません。

1. Claude: ワークフローのファイル以外の変更だけを、先にコミットして push する
2. Claude: 置くファイルを、オーナーがダウンロードできる形で渡す（ファイルを保存できるボタンを付けたアーティファクトなど）。ファイルの名前はリポジトリでの名前と同じ（`deploy.yml` など）にし、置く場所（`.github/workflows/`）を一緒に伝える。比べるために、作業用のフォルダ（リポジトリの外）に同じファイルを残しておく
3. オーナー: ブラウザで `https://github.com/<owner>/<repo>/upload/main/.github/workflows` を開き（Claude が URL を渡す。リポジトリの画面の「Add file」→「Upload files」と同じ画面で、置く場所が `.github/workflows/` になっている）、ダウンロードしたファイルをドラッグして置き、「Commit changes」を押す。同じ名前のファイルがあれば上書きされる。所要時間は3分くらい
4. Claude: 取り込んで、置いたファイルが渡したものと同じかを確かめる（`git pull --ff-only origin main && cmp .github/workflows/deploy.yml <作業用のフォルダ>/deploy.yml && echo 同じです`）。違っていたら、どこが違うかを伝えて置き直してもらう
5. 上の URL の画面が開けない、ファイルを渡せない、またはドラッグできない（スマートフォンだけ、など）ときは、貼り付けに切り替える。Claude が中身をコピーできる形で見せ、オーナーが「Add file」→「Create new file」で、名前の欄に `.github/workflows/deploy.yml` のように置く場所を入れ、中身を貼って「Commit changes」を押す。変えるファイルは、そのファイルを開いて鉛筆のボタン（Edit this file）から貼り替える。確かめ方は4と同じ
6. Dependabot の GitHub Actions の更新のプルリクエスト（ワークフローのファイルを変えるもの）も、Claude がマージできないことがある。そのときは、Claude が変更を読んで要点を伝え、オーナーにプルリクエストの画面の「Merge pull request」を押してもらう

`upload/<ブランチ>/<フォルダ>` の URL で、まだないフォルダ（`.github/workflows/`）に置けるかは、作者が配布元の README の「版の付け方」の手順3で確かめる（未確認）。

拒否されたかどうかと、この手順で進めたことは、SITE.md の「決めたことと理由」に書きます。拒否されるかは、作者が配布元の README の「版の付け方」の手順3で確かめ、結果を versions.md の「時点つきの事実」に書きます。

## 公開後の確認をやり直す

独自ドメインにつないだ直後は、証明書の発行や反映に時間がかかり、公開後の確認が失敗することがあります。このときに直前の変更を取り消すと、独自ドメインの接続まで消えてしまいます。オーナーから「公開後の確認をもう一度して」と頼まれたとき、または Issue に公開後の確認だけの失敗が書かれていたときは、取り消す前に次を行います。

1. 失敗してから数分たっていなければ、数分待つ
2. `.github/smoke-test.txt` のページを開き（WebFetch か curl。作業環境から届かないときは quality-gate.md の「作業環境から本番のサイトに届かないとき」）、状態と文字を確かめる
3. すべて OK なら、deploy の実行の失敗したジョブをやり直す（`gh run rerun <実行の番号> --failed`。使えなければ、オーナーに Actions の画面の「Re-run failed jobs」を押してもらう）。OK になったら Issue を閉じ、オーナーに「つながるまで時間がかかっていただけでした」と伝える
4. 見出しを意図して変えていた場合は、`.github/smoke-test.txt` を今のページに合わせて直し、push する
5. 表示がおかしい場合だけ、下の「表示がおかしいときに戻す」に進む

## 表示がおかしいときに戻す

公開後の確認で失敗した、またはオーナーから「表示がおかしい」と言われたときは、新しい版が公開されています。原因がすぐに直せない場合は、直前の変更を取り消して前の状態に戻します。独自ドメインにつないだ直後の失敗なら、先に上の「公開後の確認をやり直す」を行います。

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

- 依存パッケージは `pnpm-lock.yaml` で固定する。更新は runtime-update スキルでまとめて行う（要保守構成は毎月1日と15日の保守、静的なサイトは月1回の振り返り）。それ以外の作業のついでに更新しない
- 記事の追加では、エージェントが push の前に手元でビルドを通す
- Node.js のバージョンは `.node-version` の1か所で決める。ワークフローは `node-version-file` でこのファイルを読む
- 振り返りのスケジュールタスクを作らなかった静的なサイトでは、使っている Node.js のサポート終了日を SITE.md の「技術」に書いておき、その半年前にオーナーへ更新を提案する（runtime-update スキル）
