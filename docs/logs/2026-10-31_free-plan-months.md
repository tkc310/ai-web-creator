# 2026-10-31 更新しない月に Claude を無料のプランに下げる使い方

- きっかけ: 作者からの依頼。作り終えた静的なサイトは、更新しない月に Claude を無料のプラン（Free）に下げても、サイトの表示と GitHub の画面での編集からの公開は続く。この使い方を、スキルの手順として支えたい
- 変えたファイル: AGENTS.md、README.md、CHANGELOG.md、docs/claude-account.md、docs/how-to-use.md、prompts/README.md、skills/site-review/SKILL.md、skills/site-maintenance/SKILL.md、skills/site-maintenance/references/routine-setup.md、skills/web-creator/references/（deploy-and-autofix.md、versions.md）、skills/web-creator/templates/（AGENTS.md.tmpl、CLAUDE.md.tmpl、README.owner.md、SITE.md、project-instructions.md、github/workflows/autofix.yml）

## やったこと

1. site-review に「無料のプランに下げる前と、Pro に戻した日」を足した
   - 無料の月に動くものと止まるものの表（表示と GitHub の画面での編集の公開は動く。振り返り、保守、予約投稿は止まる。自動修正は鍵の種類で分かれる）
   - 下げる前の確認7つ（要保守構成なら下げない、予約投稿、開いている Issue とプルリクエスト、確認待ち、最新の deploy、振り返りを済ませる、鍵の種類）。オーナーに聞かれたら Claude が確かめて答える
   - Pro に戻した日の作業6つ（スケジュールタスクがオンか、無料の月の Claude 以外のコミットを check_text.py で調べて監査ログに書く、Issue の片付け、延ばした予約投稿、保守と振り返りをまとめて1回、SITE.md の書き換え）
   - SITE.md の「技術」に「Claude のプラン」を足し、AGENTS.md のひな形に「無料の月」のまま会話が始まったら戻した日の作業を先に行う、と書いた。CLAUDE.md のひな形、プロジェクトの指示、配布元の AGENTS.md の振り分けにも足した
   - site-maintenance の初期設定でオーナーに伝えることに、要保守構成は無料のプランに下げない、を足した
2. autofix.yml で、鍵が受け付けられなかったときを見分けるようにした
   - Issue のステップで、`execution_file` の assistant のメッセージの `error` が `authentication_failed` か `oauth_org_not_allowed` のとき、または結果の文に認証の失敗の文言があり料金が 0 のときに、ラベル autofix-paused の Issue「Claude が使えないため、自動修正が止まっています」にする
   - 本文は「Claude が無料のプランなどで使えないため、自動修正は止まっています。Pro に戻すか、GitHub の画面で直してください」と、Pro に戻した日のひと言、Pro のままなら鍵を直すよう頼む文
   - autofix-paused は、gate が見るラベル（autofix）と別なので、開いていても自動修正を止めない。Pro に戻せばそのまま動く。同じラベルの Issue が開いていれば、既存の仕組みでコメントを足す
   - 最後に「止まっていた知らせを閉じる」のステップを足し、Claude のステップが成功したら autofix-paused の Issue を閉じる
   - 見分けられなかったときの「考えられる原因」の先頭に、無料のプランに下げている、を足した
   - deploy-notice にしなかった理由: deploy-notice の Issue（公開後の確認の失敗など）が開いていると、そこに別の内容のコメントが足されて分かりにくくなるため。Pro に戻した日の作業でも、ラベルで探せるようにした
3. オーナー向けの README（templates/README.owner.md）に「Claude を無料のプランにしている月」を足した。GitHub の画面で直す5手順（ファイルを開く、鉛筆、直す、Commit changes、5分待って確かめる）、写真の差し替えと新しい記事は Pro に戻してから（位置情報を消す処理と題名と日付の確かめを Claude が行うため）、失敗したときと戻し方、Pro に戻した日に送るひと言。docs/how-to-use.md、docs/claude-account.md、prompts/README.md にも同じ流れを書いた
4. versions.md の「時点つきの事実」に、プランの前提と認証の失敗の出方をまとめ、README の「必要なもの」「注意」、routine-setup.md の書き方をそろえた
5. README の「版の付け方」の手順4に、違う値の鍵で autofix-paused の Issue が立ち、2回目はコメントになること、無料のプランに下げたアカウントの鍵での失敗の出方、Pro に戻したあとの鍵とスケジュールタスクを確かめる手順を足した

## 確認したこと

- Free では Claude Code と「Hand off and schedule tasks」が使えない。Pro では使える（Claude の料金のページ、2026-10-31 確認: https://claude.com/pricing ）
- `claude setup-token` の鍵は Claude のサブスクリプションで認証され、Pro、Max、Team、Enterprise が要る。有効期限は1年（Claude Code のドキュメント「Authentication」、2026-10-31 確認: https://code.claude.com/docs/en/authentication ）
- スケジュールタスクは Pro、Max、Ultra、Team、Enterprise で使える。サブスクリプションが止まっている間は保留になり、戻ったらオンに戻す（Claude Code のドキュメント「Scheduled tasks」の Usage and limits、2026-10-31 確認: https://code.claude.com/docs/en/routines ）
- Pro と Max の解約は、支払った期間の終わりに効く（Claude ヘルプ「Cancel your Pro or Max subscription」、2026-10-31 確認: https://support.claude.com/en/articles/8325617 ）
- 人がいない形（`-p` と Agent SDK）での OAuth の鍵の取り消しや期限切れは「Failed to authenticate: ...」と出て、構造化されたエラーは `authentication_failed`（Claude Code のドキュメント「Errors」、2026-10-31 確認: https://code.claude.com/docs/en/errors ）。Agent SDK の assistant のメッセージの `error` の値の一覧（Agent SDK のドキュメント「TypeScript reference」、2026-10-31 確認: https://code.claude.com/docs/en/agent-sdk/typescript ）
- claude-code-action は SDK のメッセージをすべて `$RUNNER_TEMP/claude-execution-output.json` に書き、失敗したときも `execution_file` の出力に渡す。結果が `subtype: success` で `is_error: true` なら失敗にする（anthropics/claude-code-action の main、2026-10-31 に読んだ）
- 認証の文言が出ずに `is_error: true`、料金 0 だけで終わる例の報告（anthropics/claude-code-action の Issue #1281、2026-10-31 確認）
- autofix.yml を YAML として読み、すべての run: を bash -n で確かめた。見分けの Python を、認証のエラーの値、文言だけ、Issue #1281 の形、ターンの上限、実際に作業したあとの 403 の文言、空の記録で試し、前の2つだけが auth になることを確かめた。Issue のステップを gh の代わりのスクリプトで動かし、題名、ラベル、本文が出ることを確かめた
- .github/scripts/check_skills.py、check_text.py（--no-markup、docs/logs を除く）、*.sh の bash -n が通った

## 確認できなかったこと

- 無料のプランに下げたアカウントの鍵が、実際にどう断られるか（401 か 403 か、`error` の値、結果の文）。Issue #1281 の形（文言なし）になると、autofix-paused ではなく「考えられる原因」の Issue になる
- Pro に戻したあと、同じ鍵がまた使えるか
- Free に下げた場合に、スケジュールタスクが「サブスクリプションが止まっている間」と同じ扱い（保留になり、戻ったらオンに戻す）になるか
- GitHub の画面の編集のボタンや「Commit changes」の名前は変わることがある

## 次回の改善点

- 作者が README の「版の付け方」の手順4で無料のプランの鍵を試したら、結果を versions.md に書き、autofix.yml の見分け方と site-review の「Pro に戻した日」の手順3を実際に合わせて直す
- Issue #1281 の形（文言なし、料金 0、ターン1）も鍵の問題として扱うかを、実機の結果を見て決める
