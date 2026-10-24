# 2026-10-24 Claude in Chrome の導入の案内と、サイドパネルに貼る指示文

- きっかけ: 記事の著者の指示。Astro のサンプル制作の検証で、Google フォームを作る場面になったとき、会話がオーナーのパソコンにつながっておらず、Claude in Chrome もデスクトップアプリ内のブラウザも使えなかった。スキルには「使えない環境では手順を案内する」としかなく、拡張機能の入れ方とつなぎ方を案内できなかった。オーナーが「Google Drive で」「Google Sheets で」と指定したが、どちらのコネクタでもフォームは作れなかった。最終的に、サイドパネルに貼る指示文を渡してオーナーに作ってもらい、問題なくフォームができた
- 変えたファイル: skills/web-creator/references/account-setup.md、skills/web-creator/references/forms.md、skills/web-creator/references/connectors.md、skills/web-creator/templates/forms/chrome-google-form-prompt.md（新規）、docs/claude-account.md、docs/forms.md、docs/how-to-use.md、README.md

## やったこと

1. docs/claude-account.md に「6. Claude にブラウザを操作してもらう」を追加。デスクトップアプリ、Chrome の拡張機能、コネクタの設定でのオン（会話ごと）、会話をパソコンにつなぐ順番（カード → デスクトップアプリで開いて送る → フォルダを追加）、つながらないときのサイドパネルの使い方
2. account-setup.md の「操作の手段」に「ブラウザ操作の準備（Claude in Chrome）」を追加。ツールの有無の確かめ方、つながらないときの案内、入れない場合の2つの道（サイドパネルに貼る指示文 / 画面ごとの手順）、受け取った結果の確かめ方、コネクタを指定されたときの役割分担
3. forms.md の「作る」の2を、上の流れを指す形に直し、Google Drive・Sheets のコネクタではフォームを作れないことを明記
4. サイドパネルに貼る Google フォーム作成の指示文を templates/forms/chrome-google-form-prompt.md に追加（検証で実際に使い、フォームができたもの）

## 確認したこと

- Claude in Chrome の条件と入れ方: 有料プラン、Google Chrome のみ（ほかの Chromium 系とスマートフォンは不可）、Chrome ウェブストアから追加してログイン、デスクトップアプリの「Customize」→「Connectors」で Claude in Chrome をオン、会話ごとに手動でオン（https://support.claude.com/en/articles/12012173-get-started-with-claude-in-chrome、2026-10-24 確認）
- ウェブやスマートフォンの会話からブラウザを操作するには、デスクトップアプリが開いていてオンラインである必要がある。サイドパネルも、画面を操作する作業ではデスクトップアプリが要り、ない場合は開いているタブを読むだけになる（https://support.claude.com/en/articles/15520349-use-claude-cowork-on-web-desktop-and-mobile、2026-10-24 確認）
- Google Drive のコネクタの create_file で作れる Google の形式は文書・表・スライドとフォルダだけ（2026-10-24、コネクタのツールの説明で確認）
- サイドパネルに指示文を貼る方法で、Google フォームの作成から公開、リンクの取得までできた（2026-10-24、Astro のサンプル制作の検証）

## 確認できなかったこと

- 会話をパソコンにつなぐ手順（カード、デスクトップアプリで開く、フォルダの追加）で実際につながるか。検証ではつながらないまま、サイドパネルの方法に切り替えた
- 拡張機能の日本語の画面での表示名

## 次回の改善点

- デスクトップアプリで会話を開いたときに、ブラウザ操作のツールが現れるかを確かめ、つなぎ方の順番を直す
- アカウントの新規登録（GitHub、Cloudflare）でも、サイドパネルに貼る指示文の例を用意するか検討する
