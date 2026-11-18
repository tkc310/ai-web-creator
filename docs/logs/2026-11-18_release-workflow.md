# 2026-11-18 タグとリリースを GitHub の画面から作れるようにする

- きっかけ: 作者がパソコンで作業できないため、v2026.11.1 のタグとリリースを代わりに作ってほしいという依頼
- 変えたファイル: .github/workflows/release.yml（新規）、README.md、CHANGELOG.md、MANIFEST.txt

## やったこと

1. CHANGELOG.md の版の見出しを「## v2026.11.1（2026-11-18）」にし、MANIFEST.txt を v2026.11.1 で作り直して main に入れた（README の「版の付け方」の手順2）。main の check-skills（--manifest）は成功に戻った
2. Claude Code のクラウドのセッションから、タグの push（`git push origin v2026.11.1`）、git の tags と refs の API、リリースの作成の API を試したが、すべて中継に断られた（「Write access to this GitHub API path is not permitted through this proxy」「Creating, editing, or deleting releases is not permitted for this session type」、2026-11-18）
3. 手で動かすワークフロー release.yml を足した。入力したタグの形、タグがまだないこと、CHANGELOG.md のいちばん上の見出し、MANIFEST.txt の `# tag:`、check_skills.py --manifest を確かめてから、注釈つきのタグを push し、README と同じ中身の zip を作ってリリースに添付する。作者が Actions の画面の Run workflow で動かす

## 確認できなかったこと

- 版の付け方の手順3と4（使い捨てのサイトのリポジトリでの通しの確かめ）は、今回は行っていない

## 次回の改善点

- release.yml を初めて動かしたあと、タグが注釈つきで作られ、zip の中身が README の手順と同じかを確かめる
