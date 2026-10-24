# 2026-10-24 Claude がリポジトリに書き込むための2つの許可

- きっかけ: HTML パターンの検証で、Claude の GitHub アプリに許可済みのリポジトリへの push が 403 で拒否された。原因は、セッションのソースにリポジトリが入っていなかったこと。スキルとガイドには GitHub アプリの許可しか書かれていなかった
- 変えたファイル: skills/web-creator/references/account-setup.md、skills/web-creator/references/project-setup.md、skills/web-creator/SKILL.md、docs/claude-account.md、docs/how-to-use.md

## やったこと

1. account-setup.md に「Claude がリポジトリに書き込むための2つの許可」を追加した。①GitHub アプリへのリポジトリの許可（「Only select repositories」の場合はあとから作ったリポジトリを足す）、②プロジェクトの Context かセッションのリポジトリの選択に入れること。エラーでの見分け方と対処を表にした
2. account-setup.md の GitHub の手順番号「6.」の重複を直した（フォーク以降を 7〜10 に）。project-setup.md の参照も直した
3. push できないときの引き継ぎ（作業一式を zip で渡す）と、zip が届いているかを最初に確かめることを書いた。作業を始める前に push できる場所かを確かめるのがいちばん確実だとした（添付漏れに気づきにくいため）
4. SKILL.md の「段階1の時点で Claude Code が使える場合」、docs/claude-account.md の「4. GitHub とつなぐ」、docs/how-to-use.md の段階2にも同じ内容を短く足した

## 確認したこと

- GitHub アプリで許可済みでも、セッションのソースにないリポジトリへの push は、git プロキシが 403（"authorized repository set" / "add the repository to the session's sources"）で拒否した（2026-10-24）
- リポジトリの追加のツールがあるセッションでは、途中で push の許可を足せた。スケジュールタスクで起動したセッションには、このツールがなかった（2026-10-24）
- 公開リポジトリは、許可がなくても git clone で読めた

## 確認できなかったこと

- プロジェクトのスレッドで、Context にないリポジトリを途中から足せるか
- GitHub アプリの「Configure」画面の表示名が、言語設定によって変わるか

## 次回の改善点

- account-setup.md に「アカウントはすでにある」場合の分岐を足す（同じ検証で見つかった点）
