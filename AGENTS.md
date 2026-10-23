# AGENTS.md

このリポジトリは、AIエージェントにウェブサイト制作を任せるためのスキルとプロンプトを公開しています。

## サイト制作を頼まれたエージェントへ

- skills/web-creator/SKILL.md から読み始める。記事やお知らせの更新だけを頼まれた場合は skills/site-content-update/SKILL.md を読む
- references/ と templates/ は、該当するステップに入ったときに読む

## このリポジトリを改善するエージェントへ

- 作業の前に README.md を読み、目的と方針を確認する
- スキルを直すときは、prompts/ と README.md の説明が食い違わないようにする
- 料金、仕様、サービスの状況など変わりやすい情報は、書く前に検索で確認する
- スキルや README を変えたら CHANGELOG.md に書く
- コミットメッセージは Conventional Commits に従う（例: `feat(skills): ...`、`docs: ...`）
- パスワード、API トークン、個人情報、特定のサイトの情報はどのファイルにも書かない
