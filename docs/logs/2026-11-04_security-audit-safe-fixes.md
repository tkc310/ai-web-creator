# 2026-11-04 セキュリティ監査の直し方に、公開と作業を止めない決まりを足す

- きっかけ: 作者の依頼。公開前の健康診断で Cloudflare の security-audit を実行する流れに、デプロイや開発の流れを妨げる改善策を除外する決まりを入れる。開発に詳しくない利用者が困らないようにする
- 変えたファイル: skills/web-creator/references/security-audit.md、skills/web-creator/references/quality-gate.md、skills/web-creator/SKILL.md、skills/web-creator/references/audit-log.md、skills/web-creator/templates/audit-log.md、docs/how-to-use.md、README.md、CHANGELOG.md

## やったこと

1. 監査を実行する手順（公開前と機能の変更時、一時フォルダへの clone、完全な監査としての頼み方）はすでにあったため、手順はそのままにし、結果をどう直すかの基準を足した
2. security-audit.md に「直し方の決まり（公開と作業を止めない）」を足した。採用する直し方の条件（指摘の箇所だけ、ビルドとプレビューと Lighthouse が変わらない、CI と公開の流れを増やさない、テンプレートの写しを大きく書き換えない）、採用しない提案の表（厳しい CSP、CI の脆弱性の検査、ワークフローの全面的な書き換え、依存パッケージの一斉更新、Cloudflare のダッシュボードの設定、機能を外す変更）と代わりにすること、任意で入れてよい hardening の例を書いた
3. 頼み方に、remediation を決まりに合わせる指示と、profile の選び方（静的なページだけなら `quick`、フォームや SSR があれば `standard`、変えた範囲だけなら scoped run）を足した
4. 結果の扱いで、hardening を直すのは「任意で入れてよいもの」だけにし、見送った提案はログにだけ残すことにした。オーナーに判断を求めるのは機能を外すか変えるときだけ
5. 監査ログと実行ログに、見送った提案の件数と理由、使った版と profile を書くようにした
6. quality-gate.md、SKILL.md、README.md、docs/how-to-use.md の説明をそろえた

## 確認したこと

- security-audit-skill（https://github.com/cloudflare/security-audit-skill 、コミット c1c8a8c、2026-09-14）の SKILL.md と README を読んだ（2026-11-04）。6段階の流れ、confirmed / needs_validation / rejected の3つの結果、`quick` / `standard` / `deep` の profile と scoped run、「Defense-in-depth gaps are not vulnerabilities」「Recommend the smallest effective source fix」の原則は、既存の security-audit.md の記述と食い違っていない
- CLIENT-SIDE.md と CLOUD-AND-DEPLOYMENT.md、SUPPLY-CHAIN-AND-RELEASE.md でも、読み取りだけのページのヘッダーの不足や、権限の最小化の不足だけでは hardening として扱うとしている
- `python3 .github/scripts/check_skills.py` と check_text.py が通る

## 確認できなかったこと

- 実際のサイトのリポジトリで `quick` の監査を通し、見送りの表どおりに提案が分かれるかは試していない
- main の check-skills は、タグのあとに skills/ を変えたため MANIFEST.txt と合わず失敗する（#13 から続いている状態）。次のタグを打つときに、README の「版の付け方」の手順2で MANIFEST.txt を作り直す

## 次回の改善点

- 実際のサイトで監査をしたら、見送った提案の種類をログから集め、表に足すものがないかを見る
