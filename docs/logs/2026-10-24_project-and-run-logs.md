# 2026-10-24 サイトごとのプロジェクトと、実行ログの改善ループ

- きっかけ: 利用者の作業や環境を毎回説明し直さずに済むようにしたい。利用者のリポジトリに実行ログを残し、改善ループを回したい。古いログは定期的に要約・削除したい
- 変えたファイル: skills/web-creator（SKILL.md、references/project-setup.md、references/run-logs.md、references/hearing.md、templates/project-instructions.md、templates/IMPROVEMENTS.md、templates/log.md、templates/SITE.md、templates/AGENTS.md、templates/github/workflows/autofix.yml）、skills/site-review/SKILL.md、skills/site-content-update/SKILL.md、skills/site-maintenance（SKILL.md、references/routine-prompt.md）、README.md、AGENTS.md、docs/how-to-use.md、docs/other-agents.md、docs/logs/README.md、prompts/README.md、.agents/skills と .claude/skills のリンク

## やったこと

1. 段階2を、サイトごとの Claude Code のプロジェクトで進める流れにした。段階1の Claude が、ヒアリングの答えと作業の環境からプロジェクトの指示の下書きを作る
2. 役割を分けた。プロジェクトの指示は「誰と、どう作業するか」、SITE.md は「このサイトは何か」（プロジェクトが使えない場合の置き場所も兼ねる）、logs/ は「何をして、何が起きたか」
3. エージェントが動くたびに1つ実行ログを書き、改善点を logs/IMPROVEMENTS.md にまとめ、作業の前に読む決まりにした。autofix、保守、記事の更新のスキルにも入れた
4. site-review スキルを追加した。改善点の整理と、保管期間（既定90日）を過ぎたログの月ごとの要約・削除、2年より前の要約の年ごとのまとめを行う

## 確認したこと（2026-10-24）

- Claude Code のプロジェクトは Pro と Max でベータ版として順次提供中。Team と Enterprise はまだ。プロジェクトの指示は16,000字まで（https://code.claude.com/docs/en/claude-projects）
- クラウドのスレッドは、リポジトリの CLAUDE.md を読むが、`.claude/skills/` のスキルは読まない。アカウントでオンにしたスキルは読む（同上）。そのため、プロジェクトの指示で tkc310/ai-web-creator の SKILL.md を読ませ、サイトの CLAUDE.md（AGENTS.md）に最低限の決まりを書く形にした
- プロジェクトの中から作ったスケジュールタスクは、プロジェクトの「Scheduled tasks」に並ぶ（同上）

## 確認できなかったこと

- プロジェクトを実際に作り、スレッドが指示どおり SITE.md とログを読むかは試していない（このアカウントで動かせる環境がないため）
- site-review の要約と削除を、実際のログで試していない

## 次回の改善点

- 実際のサイトでプロジェクトを作り、手順の画面の名前（Projects、Project settings、Memory）が合っているかを確かめる
- 静的なサイトで振り返りのスケジュールタスクを作るかどうかの、オーナーへの聞き方を試して調整する
