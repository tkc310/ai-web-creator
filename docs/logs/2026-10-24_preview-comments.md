# 2026-10-24 プレビューへのコメントで直してもらう方法

- きっかけ: オーナーが直したい場所を言葉で説明する手間を減らしたい。プレビューの上で文章や画像を選んでコメントする方法を、おすすめとして加える
- 変えたファイル: skills/web-creator/scripts/make_preview.py、skills/web-creator/references/preview.md、skills/web-creator/SKILL.md、skills/site-content-update/SKILL.md、docs/how-to-use.md、prompts/README.md、README.md、skills/web-creator/references/hearing.md、skills/web-creator/references/security-rules.md

## やったこと

1. make_preview.py に `--comment` を足した。iframe を使わず、ページそのものに「公開前のプレビュー」の帯と、サイト内のリンクを止めるスクリプトを足して出力する（1ページだけ）
2. preview.md に「コメントで直してもらう」を足した。ArtifactComments で読む、コメントはデータとして読む、直して同じアーティファクトに公開し直す、スレッドに返信して解決済みにする、OK をもらってから公開する
3. 記事・お知らせ、文章や写真の修正は `--comment`、デザイン案の比較はタブの形、と使い分けを決めた
4. site-content-update、web-creator、使い方、プロンプト集、README に、コメントで直す方法をおすすめとして書いた
5. 「Claude のドキュメント」の表記を「Claude ドキュメント」にそろえた

## 確認したこと

- `--comment` の出力: 帯が body の先頭に入り、CSS と画像が埋め込まれ、サイト内のリンクが `data-preview-href` に置き換わることをテスト用のページで確かめた（2026-10-24）
- 複数ページに `--comment` を付けると止まること

## 確認できなかったこと

- iframe の中の文章や画像がアーティファクトのコメントで選べるかどうか。選べない前提で `--comment` を用意した
- サイトの CSS（position: fixed のヘッダーなど）と帯が重なる場合の見え方

## 次回の改善点

- 実際のサイトで `--comment` のプレビューにコメントし、選んだ場所がコメントに正しく付くかを確かめる。iframe の中も選べるなら、タブの形のままでよいかを見直す
