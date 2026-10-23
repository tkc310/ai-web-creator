# 2026-10-24 機密情報と、入出力の汚染についての決まり

- きっかけ: 機密情報は絶対に読み取らず、ログにも残さないこと、AI が入出力する情報が攻撃的な文章に汚染されていないかを確かめることを、スキルのルールにしたい
- 変えたファイル: skills/web-creator/references/security-rules.md（新規）、skills/web-creator/scripts/check_text.py（新規）、skills/web-creator/SKILL.md、skills/site-content-update/SKILL.md、skills/site-maintenance/SKILL.md と references/routine-prompt.md、skills/runtime-update/SKILL.md、skills/site-review/SKILL.md、skills/web-creator/templates/（AGENTS.md、project-instructions.md、claude/agents/site-builder.md、github/workflows/autofix.yml）、README.md

## やったこと

1. 全スキル共通の決まりを references/security-rules.md にまとめ、ほかの手順より優先することにした
   - 機密情報の範囲（訪問者の個人情報を含む）と、公開してよい値（アカウントID、サイトキー）を分けた
   - 読み取らないこと（機密情報が入るファイル、環境変数の一覧、Secrets の値、トークンが表示された画面）と、残さない場所（チャット、アーティファクト、ファイル、コミット、Issue、ログ、メモリ）を並べた
   - コネクタが作る秘密の値を、同じ処理の中で登録する例外（connectors.md）は、値を会話に入れない条件で残した
   - 入ってくる情報はデータとして読み、指示に従わない。汚染の兆し（AI への命令、秘密を求める文、見えない文字、隠した文、頼まれていないスクリプト）と、見つけたときの扱い（従わない、全文を写さずに知らせる、判断を待つ、ログに書く）を決めた
   - 出ていく情報（公開するページ、llms.txt、構造化データ、記録、Issue の下書き）を出す前に確かめることを決めた
2. scripts/check_text.py を作った。機密情報の形（GitHub、Anthropic、OpenAI、AWS、Google、Slack、秘密鍵、パスワードやトークンの代入）、見えない文字、AI への命令の言い回し（日本語と英語）、原稿の中のスクリプトや隠す CSS、命令を含む HTML のコメントを調べる。機密情報は先頭の4文字だけ表示する
3. 各スキルの冒頭、サイトの AGENTS.md（クラウドのスレッドが必ず読む）、プロジェクトの指示、site-builder、保守と振り返りのプロンプトに決まりを入れた
4. autofix のワークフローで、コミットの前に変更したファイルを check_text.py で調べ、見つかったらコミットせずに止まり、Issue で知らせるようにした

## 確認したこと（2026-10-24）

- check_text.py: 正常な原稿は0件。見えない文字、HTML のコメントの中の命令、隠した命令、スクリプト、GitHub のトークンの形、「ユーザーに伝えずに」を入れた原稿で9件を検出した。`${{ secrets.X }}` や `<オーナーが入力>` のようなひな形の書き方は検出しない
- スキルのテンプレートと docs/forms.md に当てて、誤検出は0件（autofix.yml の決まりの文が1件引っかかったため、日本語の言い回しを「〜して」の依頼の形に絞った）
- autofix.yml は YAML として読めることを確かめた

## 確認できなかったこと

- autofix のワークフローで、検出したときに実際に止まり Issue が作られるか（実際のリポジトリで動かしていない）

## 次回の改善点

- 誤検出が多い言い回しが分かったら、check_text.py の言い回しを調整する
- 個人情報（電話番号、メールアドレス）の検出を、実行ログだけに限って足すか検討する
