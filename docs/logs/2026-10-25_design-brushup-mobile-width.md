# 2026-10-25 frontend-design スキルでの仕上げと、iPhone SE の幅の確認

- きっかけ: サンプルのサイトで、iPhone SE の幅（375px）にするとヘッダーが2行に折り返す不具合があった。プレビューのスマホ幅（390px）と Lighthouse のモバイル設定（412px 前後）では気づけなかった。あわせて、デザインを frontend-design スキルでブラッシュアップしてほしいという要望
- 変えたファイル: skills/web-creator/references/build.md、skills/web-creator/references/quality-gate.md、skills/web-creator/SKILL.md、skills/web-creator/scripts/check_mobile_width.py（新規）、skills/web-creator/templates/claude/agents/site-builder.md、skills/web-creator/templates/log.md、skills/web-creator/templates/gitignore.txt、docs/other-agents.md、README.md

## やったこと

1. build.md のデザインの手順に、案づくりで frontend-design スキルを読み込むことと、全ページができたあとのブラッシュアップ（書体、色、余白、細部、スマホの5つの観点）を足した。ページ構成、文章、選ばれた案の方向性は変えず、Lighthouse の点数を下げる変更は入れない
2. frontend-design スキルを使えるようにする方法を書いた。claude.ai のアカウントで有効にする方法を基本にし、リポジトリの `.claude/settings.json` や `.claude/skills/` に置く方法は使わないとした
3. build.md に「スマホの幅」を足した。375px と 320px で、横スクロール、はみ出し、ヘッダーやボタンの折り返しがないように作る決まりと、確かめ方
4. scripts/check_mobile_width.py を作った。320px、375px、390px で、横スクロール、右端からはみ出した要素、ヘッダーの中の文字と並びの折り返し、ヘッダーの高さの変化を調べ、幅ごとのスクリーンショットを保存する
5. quality-gate.md に「5. スマホの幅（iPhone SE）」を足し、SKILL.md の品質の基準、site-builder、ログのテンプレート、Claude 以外のエージェントでの代わり、README に反映した

## 確認したこと（2026-10-25）

- check_mobile_width.py を、ヘッダーが折り返すページ、横にはみ出すページ、崩れないページの3つで動かし、前の2つで NG と原因の要素、最後の1つで OK が出ることを確かめた
- Claude Code のクラウドの会話では、リポジトリの `.claude/settings.json` で有効にしたプラグインは読み込まれず、プロジェクトの会話ではリポジトリの `.claude/skills/` も読み込まれない。claude.ai のアカウントで有効にしたスキルは読み込まれる（https://code.claude.com/docs/en/cloud-environments 、https://code.claude.com/docs/en/skills の「Use skills in Cowork and cloud sessions」）
- 公式マーケットプレイスからの入れ方は `/plugin install <名前>@claude-plugins-official`（https://code.claude.com/docs/en/discover-plugins）

## 確認できなかったこと

- claude.ai の設定画面で frontend-design を有効にする画面の正確な表示名。スキルには「案内の前に Claude のヘルプで確かめる」と書いた
- 実際のサイトの制作で、ブラッシュアップの5つの観点が足りるか

## 次回の改善点

- 次のサイト制作で、ブラッシュアップの前後でオーナーの評価や Lighthouse の点数がどう変わったかを記録し、観点を見直す
- check_mobile_width.py の折り返しの判定が、意図して2段にしたヘッダーで NG になる。誤検知が多ければ、判定の対象を絞る
- プレビュー（make_preview.py）のスマホ幅は 390px のまま。iPhone SE の幅への切り替えを足すかを検討する
