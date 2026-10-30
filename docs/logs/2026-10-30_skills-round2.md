# 2026-10-30 自動修正の範囲と安全、公開後の確認、取り込み、引っ越し、アクセス解析、受託ライセンス

- きっかけ: スキルの評価（2回目の修正）で見つかった不具合と不足。日本語のファイル名で自動修正の範囲の確認と秘密の確認が効かない、初回の公開で公開後の確認が必ず失敗する、deploy と autofix が同時に動く、取り込みの手順が途中で止まる、引っ越しの DNS の手順が足りない、アクセス解析の手順がない、受託制作の扱いが決まっていない、など
- 変えたファイル: skills/web-creator/SKILL.md、references/（account-setup.md、build.md、connectors.md、deploy-and-autofix.md、forms.md、migration.md、preview.md、quality-gate.md、run-logs.md、security-audit.md、security-rules.md、skills-install.md、stack-selection.md、versions.md、新規 analytics.md）、scripts/（check_text.py、run_lighthouse.sh）、templates/（github/workflows/autofix.yml・deploy.yml、github/smoke-test.txt、github/dependabot.yml、forms/contact-handler.ts・wrangler-contact.jsonc・contact-form.html、AGENTS.md、SITE.md、README.owner.md、project-instructions.md、claude/agents/site-builder.md、gitignore.txt、node-version.txt、新規 handoff.md）、skills/site-content-update/SKILL.md、skills/site-maintenance（SKILL.md、references/routine-prompt.md）、skills/site-review/SKILL.md、skills/runtime-update/SKILL.md、docs/how-to-use.md、docs/claude-account.md、docs/verification/README.md、prompts/README.md、README.md、LICENSE、CHANGELOG.md

## やったこと

1. autofix.yml を書き直した
   - 変えてよい範囲を、記事、画像、ログ（`src/content/`、`src/assets/`、`public/` の画像、`logs/`、`audit-log/`）に絞った。.astro、設定、`public/_headers`、`public/_redirects`、`.mdx` は範囲の外
   - checkout に `persist-credentials: false` を付けた。Claude が使えるツールを、パスつきの `Edit(...)` と読み取りのコマンドに限った。`CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1` を設定した
   - 範囲の確認を、`git -c core.quotePath=false diff --cached --name-status --no-renames -z` で読むようにした。削除、`100644` 以外のモード（symlink、実行ビット）も止める
   - 範囲の確認と秘密の確認をビルドより前に移し、`git reset --hard` と `git clean -ffdx` でコミットした状態から作り直してから公開する
   - push の前に main が進んでいないかを確かめ、進んでいたら公開を飛ばす。deploy と同じ concurrency の group（`publish`）にした
   - 公開後の確認だけが失敗したとき、鍵がないとき、上限に当たったときは、Claude を起動せずに Issue にする。`anthropic_api_key` も渡す
2. deploy.yml と smoke-test.txt を直した。`<...>` が残った行は確かめずに警告を出す。`curl -L` で転送をたどる。1つも確かめなかったときは警告にする。`&amp;` の書き方を注記した
3. check_text.py が、見つからないパスと UTF-8 で読めないファイルを「調べられない」として終了コード1で返すようにした。画像などのバイナリは飛ばし、`--exclude` を足した。templates/AGENTS.md の規則9と security-rules.md の例を `core.quotePath=false` と `-z` に直した
4. account-setup.md に、workers.dev のサブドメインを確かめ、なければ作る手順（手順8）を足した。ネームサーバーは数日前、サイトの向き先は公開のとき、と時期を分けた。自動修正用の鍵を「任意」にし、見送る、Pro / Max の `claude setup-token`、API キー（上限つき）の3つから選ぶ形にした
5. skills-install.md の手順を直した。リポジトリの直下に移る、`mkdir -p scripts`、`mktemp -d` の作業用フォルダ、check_text.py の同期、`tag: none` の書き方、古い main を取り込まずに止める確認を入れた。templates/handoff.md を作り、引き継ぎ文の最初の段落を「skills-install.md の手順で取り込んでから」に固定した
6. 「このファイルを直す」と書いていた4か所（stack-selection.md、forms.md、connectors.md、migration.md）を、「skills/ は直さず、扱いを SITE.md に、違いを logs/IMPROVEMENTS.md に種類『スキル』で書く」にそろえた
7. migration.md に、DNS の記録の控えの取り方、DKIM との照らし合わせ、MX の向き先の確認、DNSSEC を止めたあとに DS が消えるまで待つこと、旧サイトを読む前の通信の許可、切り替えの瞬間の予告、末尾の / の転送を足した。STUDIO のプランを下げたときの断定を弱めた
8. references/analytics.md を作った。独自ドメインをつないだときに Cloudflare Web Analytics を有効にし、オーナーに聞かれたら数字を読んで答える。Google アナリティクスは希望されたときだけ入れる
9. フォームのひな形で、許可する Origin を一覧（`SITE_ORIGINS`）にし、送信回数の制限（Rate Limiting のバインディング）と Turnstile のホスト名の確認を足した。gitignore.txt に `.dev.vars` を足した
10. Dependabot に cooldown を入れ、GitHub Actions の更新は自動でマージしないことを、保守と振り返りの手順にそろえた。Lighthouse（13.6.0）と security-audit の skills（1.7.4）の版を固定し、versions.md の「同じ値を書いている場所」に足した
11. Node.js 26 が LTS になったため、node-version.txt を 26 にした。versions.md に Astro 7、pnpm 12 などの作業の日の最新の版と、プロジェクトのスレッドが読み込むものの事実を書いた
12. build.md で、`pnpm create astro` を一時フォルダで対話なしに動かしてから写すようにし、プレビューのサーバーと Playwright の準備を書いた。`<スキルの場所>` を実際のパスに直した
13. run-logs.md と site-review で、スキルの改善点は logs/IMPROVEMENTS.md に残すまでを標準にし、配布元に送るのは任意にした。site-review に、年に1回の点検と、担当者が代わったときの手順を足した
14. LICENSE の受託制作の項を、「受託ライセンス（1サイト分）」をお客さまのサイト1つにつき1つ購入する形にした。後任の担当者が使い続けられることを 1 に足した。stack-selection.md と skills-install.md に、受託ライセンスの記録がなければ取り込む前に止める、を足した
15. README.md、docs/how-to-use.md、prompts/README.md の最初に送る文章を、配布元の URL つきにし、読み込んだ版を最初に答えてもらうようにした。README に、最初のタグの打ち方、タグがない間の動き、更新の提供の続け方を書いた。how-to-use.md から ZIP の登録の節を外した
16. docs/verification/README.md に、記録の中の EmDash は比較のために挙げた構成で、スキルの標準ではないことを書いた

## 確認したこと

- 不具合の再現（直す前）: 一時的な git リポジトリで、既定の core.quotePath のまま日本語のファイル名の記事を足すと、範囲の確認が正しい記事を止め、トークンらしい文字列を入れたファイルを check_text.py が終了コード0で通した。テンプレートのままの smoke-test.txt では、curl が「Bad hostname」で失敗し、公開後の確認が終了コード1になった。deploy と autofix の concurrency の group が別だった
- 直したあと:
  - YAML: autofix.yml、deploy.yml、check.yml、dependabot.yml を `python3 -c "import yaml; yaml.safe_load(...)"` で読み込めた
  - 範囲の確認のスクリプトを取り出して一時的な git リポジトリで試した。日本語の名前の記事、ログ、大文字の拡張子の画像、名前に空白があるファイル、JSON のデータは通った。範囲の外の日本語の名前、.astro、package.json、削除、scripts/ への名前の変更、symlink、実行ビット、.mdx、`_headers`、`_redirects`、接頭辞だけが同じパス（`src/contentx`、`public2`）、svg、`src/content/config.ts`、AI への命令の疑い、秘密、Shift_JIS の Markdown は止まった。変更がない場合は `changed=false` になった
  - 認証情報の後始末: extraheader と remote の URL が消え、`git clean -ffdx` のあとにコミットが残ることを確かめた
  - 起動の判定（main が進んだ、公開後の確認だけの失敗、ビルドの失敗、鍵なし、回数の上限、Issue が開いている）と push の判定（main が進んだ、変わらない、ローカルの bare リポジトリへの push、non-fast-forward で拒否）を、偽の gh コマンドで試した
  - 公開後の確認を手元の HTTP サーバーで試した。`<...>` の行は飛ばして警告、301 は `-L` でたどって OK、`&amp;` で書いた文字は OK、`&` のままは NG、404 は NG。deploy.yml と autofix.yml の確認のスクリプトが同じであることを確かめた
  - check_text.py: バイナリは飛ばす。読めない文字コード、引用符つきのパス、見つからないパスは終了コード1。`--exclude skills --exclude docs/logs` を付けてこのリポジトリ全体を調べると終了コード0。付けないと skills/ の説明の文で10件の誤検出が出る
  - skills-install.md の手順を試した。配布元の今の main（タグなし）では、古い版の確認で止まった（終了コード1）。`v2026.11.0` のタグを打ったローカルの写しでは取り込めて、`skills/VERSION`、`scripts/check_text.py` ができ、既存の AGENTS.md は残った
  - contact-handler.ts: `npx -p typescript@5 tsc --noEmit --strict` で通った
  - run_lighthouse.sh は `bash -n`、scripts/ の Python は `python3 -m py_compile` で通った
- 検索で確かめた事実（2026-10-30）:
  - Node.js 26 は 2026-10-28 から LTS、サポート終了は 2029-04-30。Node.js 24 は 2026-10-20 からメンテナンスの段階: https://raw.githubusercontent.com/nodejs/Release/main/schedule.json
  - 最新の版（npm のレジストリ）: pnpm 12.16.1、astro 7.4.4（Node.js 22.23.4 以上）、@astrojs/cloudflare 14.4.3、wrangler 4.156.0、lighthouse 13.6.0、skills 1.7.4: https://registry.npmjs.org/
  - workers.dev のサブドメインの API（`/accounts/{account_id}/workers/subdomain`）と、Web Analytics の API（`/accounts/{account_id}/rum/site_info`）: Cloudflare の API の仕様（コネクタで確かめた）
  - Web Analytics（無料、Cookie を使わない。`Cache-Control: no-transform` があると差し込まれない。Cloudflare を通らないサイトは10まで）: https://developers.cloudflare.com/web-analytics/get-started/ 、https://developers.cloudflare.com/web-analytics/limits/
  - DNSSEC を止めてからネームサーバーを変える前に、DS の TTL の間待つ: https://developers.cloudflare.com/dns/dnssec/
  - Workers の静的ファイルの末尾の / の扱い: https://developers.cloudflare.com/workers/static-assets/routing/advanced/html-handling/
  - Google アナリティクスのプライバシーの記載: https://support.google.com/analytics/answer/7318509
  - claude.ai に ZIP で登録するスキルの frontmatter は、name、description、license、allowed-tools、compatibility、metadata だけが通る: https://github.com/anthropics/claude-code/issues/24826

## 確認できなかったこと

- `pnpm create astro` の新しい引数: 作業環境から GitHub のテンプレートを取得できず（403）、手元の Node.js（22.22）も Astro 7 の条件を満たさないため、試せなかった。取得できないときは手で書く分岐を build.md に残した
- GitHub Actions の上での動き: claude-code-action のパスつきの `Edit(...)` の効き方、`CLAUDE_CODE_SUBPROCESS_ENV_SCRUB` の効き方、`gh run view --json jobs` の失敗したステップの名前。実際のリポジトリで一度失敗させて確かめる
- Rate Limiting のバインディングが Workers の無料プランで使えるか
- claude.ai への ZIP の登録: 実際には登録を試さず、Issue の報告をもとに節を外した

## 次回の改善点

- 配布元のプルリクエストを main にマージし、最初のタグ（v2026.11.0）を打ったあと、空のリポジトリで取り込みから公開まで一度通す
- 実際のサイトのリポジトリで、記事の誤りによるビルドの失敗と、公開後の確認だけの失敗を一度ずつ起こし、autofix の動きと Issue の文面を確かめる
- check_text.py の skills/ の誤検出（説明の文に出てくる攻撃の例）を、除外ではなく書き方で減らせるかを検討する
