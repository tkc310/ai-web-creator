# 2026-10-25 公開後に記事を追加するチュートリアル

- きっかけ: お知らせや記事のあるサイトで、一通り完成したあとに、オーナーと一緒に記事を追加するチュートリアルがほしいという要望。原稿の置き場所の指定がなければ Claude ドキュメントで書いてもらい、HTML のアーティファクトでプレビューを確かめ、承認されたら公開する流れにする
- 変えたファイル: skills/web-creator/references/article-tutorial.md（新規）、skills/web-creator/SKILL.md、skills/site-content-update/SKILL.md、skills/web-creator/templates/SITE.md、prompts/README.md、docs/how-to-use.md、docs/other-agents.md、README.md、CHANGELOG.md

## やったこと

1. references/article-tutorial.md を作った。対象（記事のあるサイトだけ）、時期（公開と表示の確認のあと）、原稿の置き場所の決め方（SITE.md やプロジェクトの指示に指定があればそれ、なければ Claude ドキュメント）、6つの手順（原稿のドキュメントを用意する → 書いてもらう → 記事にする → プレビューで確かめてもらう → 公開する → 振り返って記録する）、2本目からの流れ
2. web-creator の「進め方の全体像」に「7. 記事の追加体験」を足し、以降の番号を繰り下げた。「公開後の対応」にも、指定がなければ Claude ドキュメントを使うことと、チュートリアルを書いた
3. site-content-update に「原稿の置き場所の指定がないとき」を足し、description に「新しい記事の原稿を用意して」を加えた
4. SITE.md のひな形の「更新の方法」に、原稿の置き場所の既定と、チュートリアルを行ったかどうかの欄を足した
5. オーナー向けに、prompts/README.md に頼み方を、docs/how-to-use.md の「公開したあと」に流れを、docs/other-agents.md に Claude 以外のエージェントでの代わりを足した

## 確認できなかったこと

- Claude Code のクラウドの会話で、Claude ドキュメントのツール（Docs）がいつも使えるか。使えない環境ではチャットに原稿を書いてもらう、とした
- Claude ドキュメントに貼った写真を、Docs のツールで取り出せるか。取り出せない場合はチャットへの添付を頼む、とした

## 次回の改善点

- 実際のサイトでチュートリアルを行い、オーナーがつまずいた点（ドキュメントの開き方、コメントの送り方など）をもとに、手順とひな形を見直す
- 写真をドキュメントから取り出せるかを確かめ、取り出せるならひな形の案内を「ドキュメントに貼る」に絞る
