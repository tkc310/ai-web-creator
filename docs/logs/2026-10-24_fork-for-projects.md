# 2026-10-24 プロジェクトにはスキルのフォークを追加する

- きっかけ: 記事の「サイトの保管庫と、スキルの保管庫の2つを追加する」を具体的にする中で、プロジェクトに追加できるリポジトリの条件を確かめたところ、配布元をそのまま追加できないことが分かった
- 変えたファイル: skills/web-creator/references/account-setup.md、references/project-setup.md、templates/project-instructions.md、SKILL.md、skills/site-review/SKILL.md、docs/how-to-use.md、docs/claude-account.md

## やったこと

1. GitHub の手順に、tkc310/ai-web-creator をオーナーのアカウントにフォークする手順を足し、Claude の GitHub アプリにはサイトのリポジトリとフォークの2つを許可する形にした
2. プロジェクトの作り方の Context を「サイトのリポジトリとフォーク」に変え、一覧に出ないときの対処（GitHub アプリの許可を足す）を書いた
3. フォークの更新は site-review で配布元と比べ、遅れていればオーナーに「Sync fork」→「Update branch」を案内する形にした。フォークには独自の変更を入れない

## 確認したこと（2026-10-24）

- プロジェクトでコードを扱う場合、リポジトリは github.com 上にあり、接続した GitHub アカウントに書き込み権限（push access）があり、Claude の GitHub アプリが入っていることが条件。スレッドが途中で追加するリポジトリも同じ条件（https://code.claude.com/docs/en/claude-projects の Check the prerequisites と Decide which repositories to add）

## 確認できなかったこと

- 実際にフォークをプロジェクトに追加して、スレッドが skills/ を読めるか
- フォークを作らずに、スレッドが公開リポジトリを直接 clone して読めるか（できればフォークは不要になる）

## 次回の改善点

- 実際のアカウントで上の2つを試し、フォークが本当に必要かを確定する
