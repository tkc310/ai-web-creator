# 2026-10-24 コネクタ（MCP）を優先する仕組み

- きっかけ: Cloudflare の操作は MCP を可能なかぎり使い、Google フォームも MCP を前提にしたい。Claude に MCP 以外の連携（公式のコネクタ）があれば、チャットにリンクを出して認証してもらう形にしたい。あわせて、EmDash のフォームプラグインを除外していることをフォームのページに書く
- 変えたファイル: skills/web-creator/references/connectors.md（新規）、references/account-setup.md、references/forms.md、SKILL.md、templates/project-instructions.md、skills/site-content-update/SKILL.md、docs/forms.md、docs/claude-account.md、docs/other-agents.md、README.md

## やったこと

1. サービスを操作する前に確かめる順番を決めた。つながっているコネクタ → Claude の公式のコネクタ（チャットにカードを出して認証）→ サービスの公式の MCP サーバー（カスタムコネクタ）→ ブラウザ操作 → 手順の案内
2. サービスごとの対応表を作った（Cloudflare、Google ドキュメント・ドライブ、スプレッドシート、フォーム、ムームードメイン、GitHub）
3. アカウント準備の Cloudflare の手順に「Claude と Cloudflare をつなぐ」を入れ、DNS やアカウントIDの読み取りをコネクタで行う形にした。API トークンの作成は強い権限が要るのでコネクタでは行わない
4. お問い合わせフォーム（Email Sending）の手順をコネクタ中心に書き直した。Turnstile のシークレットキーは、同じ処理の中で Workers の Secrets に登録し、値を出さない例外を SKILL.md と connectors.md に書いた
5. Google フォームは、作成はブラウザ操作、回答の確認は Google Sheets のコネクタ、と分けた
6. EmDash のフォームプラグインを、公開から日が浅く安定していないため除外していることを docs/forms.md と references/forms.md に書いた

## 確認したこと（2026-10-24）

- Claude のディレクトリにある Cloudflare のコネクタ（Cloudflare Developer Platform）のツールは、アカウント、KV、Workers の一覧などが中心で、DNS、Turnstile、メール送信には足りない（このセッションでディレクトリを検索して確認）
- Cloudflare 公式の MCP サーバー `https://mcp.cloudflare.com/mcp` は API 全体（2,500以上のエンドポイント）を search と execute で扱える。OAuth では許可する権限を選べる。API トークンでもつなげる（https://developers.cloudflare.com/agents/model-context-protocol/cloudflare/servers-for-cloudflare/）
- Claude のカスタムコネクタは、Free・Pro・Max では「Customize」→「Connectors」→「Add custom connector」で追加する。Team・Enterprise は組織の管理者が追加する（https://claude.com/docs/connectors/custom/remote-mcp）
- Google フォームには、Claude のディレクトリのコネクタも、Google 公式の MCP サーバーもない。Google の Workspace の MCP サーバー（2026年5月から開発者向けプレビュー）は Gmail、Drive、Calendar、Chat などで、Forms は含まれない（https://workspaceupdates.googleblog.com/2026/05/agent-tools-and-security-updates-for-workspace-developers.html）
- ディレクトリに Google Drive、Google Docs、Google Sheets、Tally、MuuMuu Domain のコネクタがある（このセッションで検索して確認）

## 確認できなかったこと

- Cloudflare の MCP サーバーで、Email Sending へのドメイン登録、Destination Addresses の登録、Turnstile のウィジェットの作成、Workers の Secret の登録が、実際にできるか（API があるかを含む）
- OAuth で選べる権限の名前

## 次回の改善点

- 実際の Cloudflare アカウントでつなぎ、上の操作が API でできるかを確かめて、connectors.md と forms.md を確定する
- EmDash のフォームプラグインの更新履歴を見て、安定したら選択肢に戻すかを見直す
