# Claude のアカウント登録ガイド

このリポジトリのスキルを使うための、Claude のアカウントの作り方と、最初にしておく設定をまとめています。所要時間は15分くらいです。

画面の名前や配置は変わることがあります。手順と違う画面が出たときは、Claude に画面の写真（スクリーンショット）を貼って「次に何を押せばいい？」と聞いてください。

## 用意するもの

1. メールアドレス、または Google アカウント
2. SMS（ショートメッセージ）を受け取れる携帯電話
3. 支払いに使うクレジットカードなど（有料プランにするため）

## 1. アカウントを作る

1. ブラウザで claude.ai を開く
2. 「Continue with Google」で Google アカウントを使うか、メールアドレスを入れて「Continue with email」を押す
3. メールアドレスの場合は、届いたメール（件名「Secure link to log in to Claude.ai」）のリンクを開く
4. 電話番号を入れ、SMS で届いた6けたのコードを入れる。電話番号の確認は、新しくアカウントを作るときに必ず求められます
5. 名前などを入れて登録を終える

メールが届かないときは、迷惑メールのフォルダを確認し、@mail.anthropic.com からのメールを受け取れるようにしてから、数分おいてやり直します。

## 2. 有料プランにする

サイトを作る作業（クラウドで動く Claude Code）と、定期的な保守（スケジュールタスク）は、Pro 以上のプランで使えます。

1. claude.ai の左下のアカウント名から、設定（Settings）を開く
2. プランのアップグレードの画面で Pro を選ぶ
3. 支払い情報を入れて確定する

料金は執筆時点で、Pro が月20ドル（年払いなら月17ドル相当）です。最新の料金は [Claude の料金ページ](https://claude.com/pricing) で確認してください。サイトを作っている期間に利用上限に何度も当たる場合は、その月だけ上位のプランにする方法もあります。

## 3. 最初にしておく設定

1. 設定の「Capabilities」で「Code execution and file creation」をオンにする。スキルを使うのに必要です
2. デスクトップアプリ（Mac / Windows）を入れておくと、アカウント登録などの画面を Claude がブラウザで進められるようになります（入れなくても、Claude が手順を案内します）
3. スマートフォンのアプリを入れておくと、外出先からも更新を頼めます

## 4. GitHub とつなぐ（GitHub のアカウントを作ったあと）

サイトを作る作業は、claude.ai/code（デスクトップアプリでは「Code」）で行います。ここで GitHub とつなぎます。GitHub のアカウントの作り方は、Claude が対話しながら案内します。

1. claude.ai/code を開き、表示に従って GitHub でサインインし、接続を許可する
2. サイト用の非公開リポジトリで Claude が作業できるよう、Claude の GitHub アプリをインストールする。インストールの画面で、サイトのリポジトリを選ぶ
3. 環境（Environment）は、最初に作られる「Default」のままでよい

公開されているリポジトリ（このリポジトリなど）は、GitHub アプリを入れなくても読み込めます。非公開のリポジトリは、GitHub アプリを入れたものだけで作業できます。

## 5. ほかのサービスとつなぐ（必要になったとき）

Claude は「コネクタ」という機能で、Cloudflare や Google のサービスを直接操作できます。必要な場面になると Claude が案内するので、先に設定しておく必要はありません。

| つなぐサービス | 使う場面 | つなぎ方 |
|---|---|---|
| Cloudflare | DNS、公開の設定、お問い合わせフォームの設定 | Claude の「Customize」→「Connectors」→「Add custom connector」で、URL に `https://mcp.cloudflare.com/mcp` を入れて追加し、Cloudflare の画面で許可する権限を選ぶ |
| Google ドライブ、Google ドキュメント | 原稿を Google ドキュメントで渡すとき | Claude がチャットに出す接続のボタンを押し、Google の画面で許可する |
| Google スプレッドシート | Google フォームの回答を Claude にまとめてもらうとき | 同上 |
| ムームードメイン | ドメインを取るとき（.jp など） | 同上 |

許可する権限は、必要なものだけにします。使わなくなったコネクタは、同じ画面で外せます。Claude のディレクトリにないサービスをつなぐ「カスタムコネクタ」は、信頼できる会社の公式のものだけを追加してください。

## 次にすること

[スキルとプロンプトの使い方](how-to-use.md) に進みます。

## 参考

- [Claude ヘルプ: ログイン](https://support.claude.com/en/articles/13189465-log-in-to-your-claude-account)
- [Claude ヘルプ: 電話番号の確認](https://support.claude.com/en/articles/8287232-verify-your-phone-number)
- [Claude ヘルプ: スキルを使う](https://support.claude.com/en/articles/12512180-use-skills-in-claude)
- [Claude Code: クラウドで始める](https://code.claude.com/docs/en/web-quickstart)
- [Claude: カスタムコネクタ（英語）](https://claude.com/docs/connectors/custom/remote-mcp)
- [Cloudflare の MCP サーバー（英語）](https://developers.cloudflare.com/agents/model-context-protocol/cloudflare/servers-for-cloudflare/)
