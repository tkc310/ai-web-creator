# 2026-10-30 Astro への統一、自動修正の範囲と回数の制限、公開後の確認、引っ越しの手順、版の基準の集約、スキルの取り込み方式

- きっかけ: オーナーの方針（サイトはすべて Astro で作る。HTML 直書きと EmDash の構成をやめる。配布はフォークをやめ、サイトのリポジトリにスキルを取り込む）と、スキルの評価で見つかった不具合（自動修正の範囲が無制限、公開後の確認がない、質問の上限がツールと合わない、package-lock.json の記述、保守の間隔の食い違い、STUDIO の移行手順がない、アカウントがある場合の分岐がない、モデル名とバージョンが散らばっている、公開リポジトリのフォークが必ず公開になる）
- 変えたファイル: skills/web-creator/SKILL.md、references/（stack-selection.md、build.md、hearing.md、migration.md、deploy-and-autofix.md、forms.md、account-setup.md、project-setup.md、preview.md、quality-gate.md、security-audit.md、article-tutorial.md、新規 versions.md、新規 skills-install.md）、templates/（github/workflows/autofix.yml・deploy.yml・check.yml、新規 github/smoke-test.txt、forms/wrangler-contact.jsonc・contact-handler.ts、forms/html-worker.ts を削除、AGENTS.md、SITE.md、project-instructions.md、claude/agents/site-builder.md）、scripts/make_preview.py、skills/site-maintenance（SKILL.md、references/routine-prompt.md、routine-setup.md）、skills/runtime-update/SKILL.md、skills/site-review/SKILL.md、skills/site-content-update/SKILL.md、docs/how-to-use.md、docs/forms.md、docs/claude-account.md、prompts/README.md、README.md、AGENTS.md、LICENSE、CHANGELOG.md

## やったこと

1. stack-selection.md を書き直した。サイトはすべて Astro で、標準は SSG。アクセスのたびに処理が要るページだけ SSR にし、その場合だけ要保守構成にする。対象外（記事が数千本を超えるメディア、公開後の投稿をお客さまが管理画面から行う受託制作、会員機能、コメント機能、EC、予約）を表にし、見分け方、理由、伝え方を書いた。千本台までのメディアが Astro で足りる根拠として、docs/verification の計測（3,000 本で約 7 秒、1 万本で約 18 秒）を残した
2. build.md に、1ページの LP を Astro で作る構成と、どのページの形でも同じ作り始めの手順（minimal のテンプレート、sitemap、404 ページ、templates の配置）を書いた。HTML 直書きと EmDash の節を消した
3. HTML 直書きと EmDash の記述を、スキル、templates、scripts、docs、prompts、README から外した。forms.md と docs/forms.md の EmDash のフォームプラグインの節、templates/forms/html-worker.ts、wrangler-contact.jsonc の HTML 用の設定、site-maintenance のデータベースの構造変更の扱い、make_preview.py の説明の HTML と EmDash の分岐を消した。make_preview.py にはコードの分岐はなく、説明の文だけを直した
4. autofix.yml に、変えてよいパスの許可リスト（`AUTOFIX_ALLOWED_PATHS`）と、その中でも変えてはいけないパス（`AUTOFIX_DENIED_PATHS`）を入れた。push の前に、追加・変更・削除・名前の変更のすべてのパスを `git diff --cached --name-only --no-renames` で確かめ、範囲の外があればコミットも push もせずに Issue を立てて失敗させる。試行回数の上限として、過去24時間の autofix のコミットが3回以上なら Claude を起動しない、ラベル `autofix` の Issue が開いている間は起動しない、を入れた。Issue は既存のものがあればコメントを足す
5. deploy.yml と autofix.yml に、公開後の確認（スモークテスト）のステップを足した。確かめるページと文字は、サイトのリポジトリの `.github/smoke-test.txt` で決める（templates/github/smoke-test.txt）。autofix は `.github/` を変えられないので、確認を書き換えて通すことはできない。ワークフローから HTML だけのサイト向けの条件分岐を消した
6. 質問の上限を、AskUserQuestion に合わせて「一度に4問、1問の選択肢は4つまで」にした（SKILL.md、hearing.md、templates/AGENTS.md、project-instructions.md、README.md、docs/how-to-use.md、prompts/README.md）。hearing.md は1回目を4問にし、会員・コメント・EC・予約の有無は2回目の「ほしい機能」で聞くようにした
7. deploy-and-autofix.md の `package-lock.json` を `pnpm-lock.yaml` に直し、「更新は月1回まで」を、要保守構成は2週間ごと、静的なサイトは月1回の振り返りで runtime-update を使う形にそろえた。SKILL.md の脆弱性の確認の手順も `pnpm-lock.yaml` に直した
8. migration.md を書き直した。WordPress と STUDIO それぞれの中身の取り出し、URL の対応表と 301 リダイレクト、メタ情報、画像、フォーム、アクセス解析と Search Console、メール、ドメインと DNS の切り替え（ネームサーバーを先に移す2段階、DNSSEC、TTL）、切り替え後の確認、戻し方、旧サービスの解約時期を書き、出典を付けた
9. account-setup.md に、アカウントやドメインがすでにある場合の分岐を足した
10. モデル名、effort、ツールのバージョン、時点つきの事実（Dependabot と pnpm 11 のロックファイル）を references/versions.md にまとめ、ほかのファイルからは参照するようにした。SKILL.md の frontmatter など機械が読む設定は値を残し、versions.md に「同じ値を書いている場所」として一覧にした
11. 配布のしかたを、購入者のフォークから、サイトのリポジトリの `skills/` への取り込みに変えた。references/skills-install.md に、配布元の最新のタグ（なければ main の最新のコミット）を clone して `skills/` にコピーし、`skills/VERSION` に版を書く手順と、解説記事に添付した zip から取り込む別の入口（配布元を非公開にしたときの切り替え先）を書いた。account-setup.md と project-setup.md からフォークの手順を外し、プロジェクトに入れるのはサイトのリポジトリ1つにした。templates/AGENTS.md と project-instructions.md に「作業の前に skills/ の SKILL.md を読む」を入れた。site-review の振り返りは、Sync fork の案内をやめ、`skills/VERSION` と最新のタグを比べて、新しければ CHANGELOG の差分を3行にまとめ、`skills/` を差し替えるプルリクエストを作ってオーナーに確認する手順にした。保守と振り返りのスケジュールタスクのプロンプトも、サイトのリポジトリの skills/ を読む形にした
12. 版の付け方（タグ `vYYYY.MM.N`）と、skills/ を変えたらタグを打つことを README.md と AGENTS.md に書いた。LICENSE の利用者の範囲を、特定の題名から「利用許諾が付くと記事の中で示している解説記事（マガジンを含む）」に変え、フォークの記述を、非公開のリポジトリへの複製と、フォークを使わないことに書き換えた。サイトのリポジトリをほかの人に渡すときは skills/ を除くことも足した

## 確認したこと

- YAML: `python3 -c "import yaml; yaml.safe_load(open(...))"` で autofix.yml、deploy.yml、check.yml、dependabot.yml を読み込めることを確かめた
- autofix.yml の範囲の確認のスクリプトを取り出し、手元の git リポジトリで試した。記事・ログ・監査ログ・public/ の変更と、記事の削除は push に進み、package.json、src/pages/api/、public/_headers、scripts/ への名前の変更、.github/ への追加、`src/contentx/` や `publicfoo` のような接頭辞だけが同じパスは止まった。変更がない場合は再公開だけに進んだ。check_text.py が命令の疑いを見つけた場合も止まった
- 試行回数の確認のスクリプトを、`fix(autofix):` のコミットが3つあるリポジトリで試し、止まることを確かめた
- 公開後の確認のスクリプトを、手元の HTTP サーバーで試した。200 で文字を含むページは OK、文字を含まないページと 404 は NG、`.github/smoke-test.txt` がないときは警告だけで成功になった。行末の CR と空行、`#` の行を読み飛ばすことも確かめた
- scripts/ の Python: `python3 -m py_compile` で4本とも通った。`run_lighthouse.sh` は `bash -n` で通った。check_text.py を、変えた主なファイルと templates/ に対して実行し、検出なしで終わった。make_preview.py を小さなページで実行し、プレビューができた
- AskUserQuestion の上限（1回に1〜4問、1問に2〜4択、header は12文字まで）: https://code.claude.com/docs/en/agent-sdk/user-input （2026-10-30 確認）
- WordPress のエクスポート（WXR に投稿、固定ページ、カスタムフィールド、カテゴリ、タグなどが入る）: https://wordpress.org/documentation/article/tools-export-screen/ （2026-10-30 確認）
- STUDIO はサイトのデータ（デザイン、ページの情報、ソースコード、CMS のデータ）をエクスポートできず、フォームの回答だけ CSV で書き出せる: https://help.studio.design/ja/articles/8860404 （2026-10-30 確認）
- STUDIO の独自ドメインでの公開は有料プランの機能で、A レコードで接続し、メールの機能はない: https://help.studio.design/en/articles/4358865-publish-your-site-with-a-custom-domain （2026-10-30 確認）
- STUDIO ではドメインを購入できない: https://help.studio.design/en/articles/9144063-can-i-purchase-a-domain-through-studio-design （2026-10-30 確認）
- STUDIO の料金ページでは、独自ドメインで公開できるプランは月額590円（年払い）からとされている: https://studio.design/ja/pricing （2026-10-30 確認。スキルには金額を書かず、有料プランが要ることだけを書いた）
- Workers の `_redirects` は固定 2,000 件、動的 100 件まで、Worker のコードが返すページには効かない: https://developers.cloudflare.com/workers/static-assets/redirects/ （2026-10-30 確認）
- Workers の独自ドメインは有効な Cloudflare のゾーンが必要で、同じ名前の CNAME があると作れない: https://developers.cloudflare.com/workers/configuration/routing/custom-domains/ （2026-10-30 確認）
- ネームサーバーの変更は反映に最大24時間、DNSSEC の DS レコードは先に消す、プロキシをオンにしたレコードの TTL は Auto（300秒）: https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/ 、https://developers.cloudflare.com/dns/dnssec/ 、https://developers.cloudflare.com/dns/manage-dns-records/reference/dns-record-types/ （2026-10-30 確認）
- エックスサーバーのドメインの特典は「サーバー契約が続く限り永久無料」: https://www.xserver.ne.jp/campaign/campaign_250204.php （2026-10-30 確認）

## 確認できなかったこと

- STUDIO のヘルプのページは、作業環境から直接は開けず、要約を取得する方法で読んだ。STUDIO のプランを下げたときに独自ドメインの接続がどうなるかの公式の説明は見つからなかったため、「独自ドメインでの公開は有料プランの機能」という事実だけを書き、下げたあとの動きは断定していない
- STUDIO の公開ページの HTML に本文が入っているか（表示に JavaScript が要るか）は確かめていない。migration.md には、入っていない場合はブラウザ操作で読み取る、と両方の場合を書いた
- WXR に画像の添付ファイルの項目が入ることは、WordPress の公式の説明では確かめられなかった。migration.md では、画像は本文と添付ファイルの項目の URL から取得する、と書いた
- autofix.yml と deploy.yml を GitHub Actions の上では動かしていない（ステップの中身を取り出して手元で試しただけ）。`gh issue list --label`、`gh label create --force`、claude-code-action と組み合わせたときの動きは、最初のサイトで確かめる
- 配布元にはまだタグがない。タグを打つまでは、skills-install.md の手順で main の最新のコミットを取り込む

## 次回の改善点

- 作者が最初のタグ（例: `v2026.11.0`）を打つ
- 最初のサイトで、autofix の範囲の外の検出、試行回数の上限、公開後の確認が GitHub Actions の上で動くことを確かめる
- 公開後の確認で失敗したときに、前の版に自動で戻す（`wrangler rollback`）かを検討する。今は autofix と Issue で知らせるだけ
- autofix の Claude の Edit と Write を、権限の設定でもパスで制限できるかを調べる（今はワークフローの確認だけで止めている）
- 配布元を非公開にする場合の zip の作り方（中身、`VERSION` の書式）を決め、skills-install.md の入口 B を確かめる
