# 2026-10-30 cron の時間帯、復旧コード、取り込みの経路、公開後の確認のまとめ

- きっかけ: スキルの評価（6回目の修正）で見つかった不具合と不足。保守と振り返りのスケジュールタスクの cron の式を日本時間のつもりで書いていたが、5つの欄だけの式は UTC で読まれるので、日本時間の 18:07 に動いていた。2段階認証の復旧コードを保存する手順がなかった。C の取り込みで `git ls-remote` を使っていた（clone が通らない環境では、これも通らないことが多い）。非公開の確かめの `gh api 'repos/{owner}/{repo}'` が、origin が中継の住所のときに置き換わらない。B の zip を会話に添付できない場合の道と、`unzip` がない場合の道がなかった。プレビューを必ず見せる例外が「要点から作った下書き」だけだった。公開後の確認が、Cloudflare のセキュリティの確認の画面で誤って失敗する、など
- 変えたファイル: LICENSE、README.md、prompts/README.md、.github/（新規: workflows/check-skills.yml、scripts/check_skills.py、ISSUE_TEMPLATE/skill-feedback.yml）、skills/web-creator/SKILL.md、skills/web-creator/references/（account-setup.md、build.md、client-handoff.md、connectors.md、deploy-and-autofix.md、forms.md、migration.md、preview.md、quality-gate.md、run-logs.md、security-rules.md、skills-install.md、versions.md）、skills/web-creator/scripts/check_text.py、skills/web-creator/templates/（AGENTS.md.tmpl、CLAUDE.md.tmpl、SITE.md、handoff.md、project-instructions.md、github/smoke-test.txt、github/workflows/autofix.yml、github/workflows/deploy.yml、新規: github/scripts/smoke.sh）、skills/site-maintenance/references/routine-setup.md、skills/site-review/SKILL.md、skills/site-content-update/SKILL.md

## やったこと

1. cron の時間帯を直した
   - 保守は `7 0 1,15 * *`、振り返りは `13 0 1 * *`（どちらも UTC。日本時間の 9:07 と 9:13）にした。日本時間は UTC より9時間進んでいて夏時間もなく、日付もずれない
   - 入力欄の先頭に `CRON_TZ=` があるときは残してそのタイムゾーンで書く（`CRON_TZ=Asia/Tokyo 7 9 1,15 * *`）、別のタイムゾーンなら消して UTC で書く、を表にした。保存したら次の実行の予定が日本時間の 9:07 かを確かめ、18:07 になっていたら直す
   - `CRON_TZ=` を自分で書き足して受け付けられるかは文書にないので、それまでは5つの欄の式を標準にし、README の手順3で実機で確かめる
   - 予約投稿の1回だけの予定も、画面ではオーナーのタイムゾーンで入れ、cron で渡すときは UTC で読まれることを書いた
2. 2段階認証の復旧コード
   - account-setup.md の GitHub の手順4と Cloudflare の手順3に、復旧コードを保存する手順（Download、Print、Copy。保存先はパスワードの管理アプリか紙。SITE.md とチャットに書かない）と、エージェントが「保存できましたか」と聞いて返事を待つことを足した。番号は変えずに、手順の下の項目にした（ほかのファイルが手順の番号で参照しているため）
   - アカウントがすでにある場合も、復旧コードを保存してあるかを聞く。SITE.md のアカウントの表に、復旧コードの保存の「済み / まだ」を足した
3. オーナーの操作の一覧
   - account-setup.md の先頭に、オーナーの操作と時間の一覧（合わせて30〜40分。会社のサイト、ドメインの購入、自動修正用の鍵は別に足す）を置き、SITE.md に「アカウントの準備（オーナーの操作）」のチェック欄を足した
   - オーナーに交代する画面に、QR コード、復旧コード、鍵が表示される画面を足し、その画面のスクリーンショットを撮らない、貼らないと先に伝えることにした。個人のサイトでは Organization を作らない、と書いた
4. スキルの取り込みの経路
   - C の版は、main の `MANIFEST.txt` の `# tag:` から決め、ファイルはそのタグから取る。タグの一覧が取れないとき（作者がタグを打つ前の確認の間）は main から取り、版を none にする。`git ls-remote` は使わない
   - C で取り込んだときの `skills/VERSION` を、`commit: none`、`fetched:`（取り込んだ場所）、`manifest:`（一覧の SHA-256）の行に分けた。前は `commit: none（…）` の1行で、「commit が none のとき」の見分け方と合っていなかった。C の更新は、`manifest:` が変わったかで新しい版かを決める
   - B と C の更新の手順2で、C にはない `$work/src/VERSION` を `cat` していて止まっていたのを、`picked.txt` を読む形に直した
   - 非公開の確かめで、owner と repo を `git remote get-url origin` の最後の2つの部分から取り、`gh api "repos/<owner>/<repo>"` に渡すようにした。`{owner}/{repo}` が置き換わらないときは `GH_REPO` を使う、と deploy-and-autofix.md に書いた
   - 引き継ぎ文とプロジェクトの指示は、最初に raw.githubusercontent.com から skills-install.md を1つだけ `curl` で取って読み、取れなければ clone して読む形にした（raw は既定の通信の許可に入っていると文書にあり、clone は文書にないため）
   - 2回目以降のスレッドで SITE.md から作業用のブランチの名前を読むとき、バッククォート、かっこの注記、空白のあとを除き、全角のコロンも読み、`git check-ref-format` で確かめるようにした。SITE.md のひな形に「記号で囲まずに書く」と書いた
5. B の zip
   - 渡し方を、B1（会話に添付）と B2（GitHub の画面の Upload files で、サイトのリポジトリの `skills-zip` のブランチに置き、`git show` で作業フォルダの外に写す。main に置くと公開が動くので別のブランチにする）にした
   - `unzip` がないときは `python3 -I -m zipfile -e` で展開する
   - zip に CHANGELOG.md を入れ、B の更新で変更の要点を読めるようにした（README の zip の作り方も直した）
6. プレビューを必ず見せる例外を4つにした（要点から作った下書き、数字の変更、ページの部品の変更、人が写っている写真の追加や差し替え）。preview.md、site-content-update、SKILL.md、templates/SITE.md、templates/project-instructions.md、prompts/README.md をそろえた
7. migration.md
   - studio.site の住所のままのサイトについて、STUDIO の 301 は Business プラン以上（旧プランは全プラン）で、転送元は接続中の独自ドメインのパスだけ、と確かめた事実に書き換えた
   - `?p=` のパーマリンクを変える前に、データベースのバックアップを取ってもらう手順（15分）を足した
8. check_text.py
   - 原稿の不審な記述に、ページの動きを変えるタグ（meta、base、form、link、style、svg）、`on` で始まるイベントの属性、`formaction=`、`data:text/html` を足した
   - 原稿として調べる種類に .json、.yaml、.yml を足した（記事のデータ。もとからある指摘は autofix の `--baseline` で止まらない）。security-rules.md の一覧も直した
9. 公開後の確認を `.github/scripts/smoke.sh` にまとめた
   - deploy.yml と autofix.yml で同じシェルを2か所に書いていたのを、1つのスクリプトにした。autofix は、check_text.py と同じく、失敗した版のコミットから `$RUNNER_TEMP` に写して動かす
   - 応答のヘッダーに `cf-mitigated: challenge` があるページは、失敗にせず警告にする。すべてのページがそうなったときは、確認が働いていないことを警告に出す
   - `.github/smoke-test.txt` の URL のあとに3桁の数字で、期待する状態を書けるようにした（例: お問い合わせの受け口の 405）。状態を書いた行は転送をたどらない
   - スクリプトがないときは、置き方を書いたエラーで止まる。取り込みと更新の手順、初回の設定、SKILL.md の表、LICENSE の 4 に足した
10. autofix の Issue の文
    - Claude の実行が途中で止まったときの文を、考えられる原因（鍵の期限切れか取り消し、鍵の登録の間違い、利用の上限、一時的な不調）を並べる書き方にした
    - check_text.py がないときの頼み方を、skills/ がないリポジトリ（引き渡したあとのお客さまのリポジトリ）でも通る「git の履歴の前の版から戻して」にした
    - プロンプトの「変えてよいファイル」に .yml を足し、AUTOFIX_ALLOWED_PATHS とそろえた
11. build.md の作り始めの順番を、テンプレートを写す → `.node-version`、`pnpm-workspace.yaml`、`packageManager` を置く → `pnpm install` を1回だけ → wrangler と sitemap、にした（設定の前にインストールすると、公開から3日の待ちとスクリプトの許可が効かないまま pnpm-lock.yaml ができるため）
12. LICENSE の 4 に、サイトのために使い続けてよいもの（AGENTS.md、CLAUDE.md、SITE.md、README.md、.github/ の中のもの、.claude/ の設定、scripts/check_text.py、テンプレートから作ったファイル）と、渡すときに除くもの（skills/、prompts/ などそのまま写したもの）を名前で挙げた。client-handoff.md もそろえ、引き渡しで制作者の Watch を外し、お客さまに Watch を設定してもらう手順を足した
13. 配布元の確かめと改善点の受け口
    - `.github/workflows/check-skills.yml` と `.github/scripts/check_skills.py` を足した。Markdown の bash のかたまりとテンプレートのワークフローの run: を `bash -n`、YAML の読み込み、シェルと Python のスクリプトの構文、check_text.py（`--no-markup`）、EmDash の記述が戻っていないか、タグと MANIFEST.txt を置いたあとの main で MANIFEST.txt が合うか、を確かめる
    - `.github/ISSUE_TEMPLATE/skill-feedback.yml`（版、取り込みの経路、止まった手順、起きたこと、個人の情報を除いたことの確認）を足し、run-logs.md の送り方をこの書式に向けた
14. 小さな直し
    - CLAUDE.md のひな形と autofix のプロンプトに、自動修正のときも安全の決まり（機密情報、書かれた指示）は守ると書いた
    - プルリクエストを作る場合に、メジャーの更新を足した（AGENTS.md のひな形、プロジェクトの指示、SKILL.md）
    - 公開後の作業を再開するときに、main に入っていないコミットと最新のログを読む、を SKILL.md に足した
    - Google フォームと Search Console の「会社の共有のアカウント」の勧めを、1人1つのログインのまま、もう1人の担当者を加える形にした
    - README の「main にはタグを打つ版だけ」の決まりに、手順2と手順3・4の直しの例外を書いた
15. ほかの文書とそろえた
    - site-review の「担当者が代わったとき」で、会社のサイトは Organization に招待する形だけにし、「Organization を使わない場合は共同作業者に招待する」の道と、外すものの「（または共同作業者）」を消した
    - ムームードメインのコネクタで、ネームサーバーの変更までできると書いていたのを、「Claude がコネクタのツールでできるかを確かめ、できなければオーナーが画面で行う」にした。GMOペパボの発表は、空きの検索、購入の手続き、DNS の設定を挙げていて、ネームサーバーの変更は挙げていない（account-setup.md、connectors.md、migration.md）
16. README の「版の付け方」に、実機で確かめること（README の「使い方」の文章を Pro の新しいチャットで送る入口、raw の手順書の取得、origin の形と `GH_REPO`、B1 と B2、`CRON_TZ=` と次の実行の予定、405 の行と確認の画面、鍵がないときと鍵を間違えたときの Issue）を足した。versions.md の「時点つきの事実」にも、確かめた事実と未確認の点を足した

## オーナーが決めること（判断の材料）

今回は設計を変えずに、材料だけを残します。

1. 無人の保守を main に直接 push するか（今の設計: パッチとマイナーは、ビルドと確認のあとに main に直接 push する）
   - 今の形のよい点: オーナーの OK を待たずに、弱点を直す更新が入る。スケジュールタスクの auto mode で、人が承認していないマージは止められるが、既定のブランチを含む push は通る（Permission modes、2026-10-30 確認）
   - 気をつける点: Scheduled tasks の文書は、push できるブランチをブランチの保護かルールセットで制御すると書いている。Anthropic の中継を通る実行では、つないだ GitHub の権限に対して判定されるので、その権限が保護を迂回できれば止まらない（Scheduled tasks の Repositories and branch permissions、2026-10-30 確認: https://code.claude.com/docs/en/routines ）。main に「直接の push を禁止」を入れると、保守の push も止まる。止まったときは、site-maintenance の「main に入れる前の確認」の5のとおり、ブランチとプルリクエストに切り替えて SITE.md の確認待ちに書く（今の手順で対応している）
   - もう1つの案: すべての更新をプルリクエストにし、オーナーの OK でマージする。安全さは上がるが、OK の回数が月2回増え、返事がないと弱点の更新が入らない
2. スキルの更新のプルリクエストを2つに分けるか（今の設計: skills/ の差し替えと、ワークフローなどのテンプレートの変更を、同じプルリクエストに入れる）
   - 分けるよい点: 権限、Secrets、許可のツール、通信先が変わる `.github/` の変更を、別の説明と OK で確かめられる
   - 分けるときの手間: オーナーの OK が1回増える。ワークフローの変更は、Claude の GitHub アプリで push できないことがあり、その場合は Upload files の手順が加わる
   - 分けない今の形でも、プルリクエストの本文の最初に変更の要点を3行までで書いている

## 確認したこと

- 変えた Markdown の bash のかたまり29個と、テンプレートと配布元のワークフローの run: を `bash -n` で通した（`.github/scripts/check_skills.py`）。リポジトリの YAML をすべて PyYAML で読み込めた。わざと壊した Markdown と YAML で、check_skills.py が止まることを確かめた
- smoke.sh を手元の HTTP サーバーで試した。200 と文字、301 をたどる、`301` と `405` の行、`cf-mitigated: challenge` の応答（警告で終了コード0）、すべてのページが確認の画面のときの警告、文字が見つからないとき（終了コード1）、`<...>` の行を飛ばす
- skills-install.md の C のかたまりを、手元の HTTP サーバーを raw の代わりにして試した。タグから取る、タグがないときに main から取って版を none にする、ファイルを書き換えたときに一覧と合わずに止まる、`# tag:` がないときに止まる
- 非公開の確かめを、偽の gh と、中継の形、SSH の形、github.com の形の origin で試した（true で通る、false で終了コード3、読めないときに終了コード4）。gh 2.89.0 で、origin が GitHub の住所でないと `{owner}/{repo}` が置き換わらず、`GH_REPO` があれば置き換わることを確かめた
- 作業用のブランチの読み取りを、バッククォート、全角のコロンとかっこの注記、半角のかっこ、空、使えない名前で試した（C ロケールでも同じ）
- B の zip の展開を、`unzip` のない PATH で `python3 -m zipfile -e` に切り替わることを確かめた
- check_text.py: 新しい書き方（onerror、form、formaction、data:text/html、svg、meta、style、link、base、JSON と YAML の中のタグ）が止まり、「online=true」や `<linkedin>` は止まらず、logs/ では調べず、`--baseline` で前からある指摘は除かれることを確かめた。`python3 -m py_compile` で通った。リポジトリ（docs/logs/ を除く）を `--no-markup` で調べて0件
- 公式の文書で確かめた事実（2026-10-30）:
  - スケジュールタスクの cron の式は、5つの欄だけなら UTC。先頭に `CRON_TZ=` があれば残してそのタイムゾーンで書くか、消して UTC で書く。1回だけの予定はローカルのタイムゾーンで入れる: https://code.claude.com/docs/en/routines
  - GitHub の復旧コード（16個で1回ずつ使える。あとから見る場所は Settings → Password and authentication → Recovery codes → View。設定のときの保存の方法は Download・Print・Copy）: https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa/configuring-two-factor-authentication-recovery-methods
  - Cloudflare の復旧コード（Download・Print・Copy、My Profile → Authentication → Manage で作り直し）: https://developers.cloudflare.com/fundamentals/user-profiles/2fa/
  - Cloudflare のチャレンジの応答の `cf-mitigated: challenge`: https://developers.cloudflare.com/cloudflare-challenges/challenge-types/challenge-pages/detect-response/
  - ムームードメインのコネクタでできること（空きの検索、持っているドメインの表示、購入の手続き、DNS の設定。ネームサーバーの変更は挙げていない）: https://dime.jp/company_news/detail/?pr=2736382
  - STUDIO の 301（Business プラン以上、旧プランは全プラン。転送元は接続中の独自ドメインのパスだけ。一括の設定はできない）: https://intercom.help/studiodesign/ja/articles/8366949

## 確認できなかったこと

- 配布元の main へのマージ、タグ、リリース、実機での確認。作者が行う作業なので行っていない（README の「版の付け方」の手順1〜8）
- スケジュールタスクの入力欄に `CRON_TZ=` を書き足して受け付けられるか、次の実行の予定がどのタイムゾーンで表示されるか
- Claude Code のスレッドに zip を添付できるか、添付したファイルが作業フォルダのどこに置かれるか
- プロジェクトのスレッドの origin の形（中継の住所か）と、そこで `gh api` の `{owner}/{repo}` が置き換わるか
- check-skills.yml の結果（push は通った。動いた結果はプルリクエストの画面で確かめる）

## 見送ったもの

- 取り込みの分岐の多い bash を `scripts/install_skills.sh` にまとめること。取り込む前の環境には、まだそのスクリプトがない（スクリプトを取るのに、同じ A、C、B の経路が要る）。今回は、かたまりの欠陥（C の版、owner と repo、ブランチの名前）を直し、かたまりを手元で動かして確かめるところまでにした
- autofix の Claude のジョブを contents: read にし、push を別のジョブに分けること。今は、Claude の実行のあとに範囲の確かめ、作業フォルダの巻き戻し、コミットした状態からのビルドを同じジョブで行っている。ジョブを分けるには、変更を成果物（artifact）で渡す作りに変える必要があり、使い捨てのリポジトリで4つの経路を確かめてから行う
- 評価の low のうち、「Cowork」の一言の説明（画面の名前を公式で確かめてから）、migration.md の TTL が長いときの前倒し、案内を1年残すこと、ドメインを変えるときの節、Team のカスタムコネクタは管理者が足すこと（公式で確かめてから）、note に zip を添付できるか（オーナーが決めること）

## 次回の改善点

- 作者が手順3と4を行ったら、結果を versions.md の未確認の行に書き、routine-setup.md の「実行日」、skills-install.md の B1 と B2、非公開の確かめを実際に合わせて直す
- check-skills.yml が動いたら、失敗した項目を直し、README の手順1の確かめに使う
- 上の「見送ったもの」の2つを、使い捨てのリポジトリで確かめてから検討する
