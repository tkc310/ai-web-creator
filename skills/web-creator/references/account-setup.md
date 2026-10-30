# アカウント準備

サイトを公開するには、GitHub と Cloudflare のアカウントが必要です。Claude のアカウント作成は、このリポジトリの docs/claude-account.md で案内しています。

オーナーは登録や設定の方法を知らない前提で、画面ごとに対話しながら教えます。オーナーが分からない画面のスクリーンショットを貼ったら、どこを押すか、何を入れるかを具体的に答えます。

## 基本方針

- アカウントはオーナー本人の名義で作ります。エージェントや制作者の名義で作ると、将来オーナーが自分で管理できなくなるためです。
- ログインは人ごとに分けます。1つのログインを複数の人で使いません。GitHub の利用規約も「a single login may not be shared by multiple people」と、ログインの共有を認めていません（GitHub 利用規約の B.3、2026-10-30 確認: https://docs.github.com/en/site-policy/github-terms/github-terms-of-service ）
- 会社のサイトは、担当者が代わっても困らないよう、会社の GitHub の Organization（組織のアカウント。無料）にリポジトリを置き、担当者は自分のアカウントで招待される形を標準にします（下の「会社のサイトのとき」）。Cloudflare も、担当者は自分のログインで、会社の Cloudflare のアカウントの Members に入ります。会社の共有アドレス（info@ など）は、Organization の連絡先や知らせの宛先に使います
- エージェントはコネクタ（MCP）とブラウザ操作で設定を進めますが、次の4つはオーナーに交代します。
  1. パスワードの入力と登録の確定
  2. 2段階認証の設定とコード入力（QR コードと復旧コードが表示される画面を含む）
  3. 支払い情報の入力、規約への同意
  4. APIトークンなど秘密の文字列のコピーと貼り付け（鍵が表示される画面を含む）
- 交代するときは「今この画面です。やることは2つです」と、画面の位置と操作を番号付きで伝えます。終わったら「できた」と返してもらいます。
- ブラウザ操作やスクリーンショットで画面を見ながら進めているときは、QR コード、復旧コード、鍵が表示される前に交代します。その画面のスクリーンショットは撮らず、チャットに貼らないよう、先に一文で伝えます。
- 個人のサイトでは、GitHub の Organization を作りません（下の「会社のサイトのとき」は会社や団体のサイトだけ）。

## オーナーの操作の一覧

始める前に、オーナーに次の一覧と合計の時間を見せます。終わったものは、SITE.md の「アカウントの準備（オーナーの操作）」のチェック欄に写します（段階1では引き継ぎ文の「アカウントの準備」に書き、Claude Code に移ってから SITE.md に写す）。

| いつ | オーナーの操作 | 時間 |
|---|---|---|
| GitHub | アカウントを作る（メール、パスワード、ユーザー名、確認コード）。2段階認証を設定し、復旧コードを保存する。「Create repository」を押す。GitHub の接続を許可し、Claude の GitHub アプリを入れる | 15分くらい（アカウントがあれば5分） |
| GitHub（会社のサイトだけ） | Organization を作り、2人目の Owner を招待する | 10分くらい |
| Cloudflare | アカウントを作り、確認のメールを開く。2段階認証を設定し、復旧コードを保存する。Claude に Cloudflare のコネクタを足して許可する。API トークンを作ってコピーし、GitHub の Secrets に貼る | 10〜20分くらい |
| ドメインを買うときだけ | 候補から選び、購入と支払いをする | 10分くらい |
| Claude Code で初めて公開するとき | 作業環境の通信の許可に、サイトのホストを足す | 3分くらい |
| 任意 | 自動修正用の鍵を作り、GitHub の Secrets に貼る（下の「3. 自動修正用の Claude の鍵」） | 10〜15分くらい |

合計は、GitHub と Cloudflare と通信の許可で30〜40分くらいです。会社のサイト、ドメインの購入、自動修正用の鍵があれば、その分を足します。

## 操作の手段

使える順に試します（詳しくは connectors.md）。

1. コネクタ（MCP）。アカウントを作ったあとの設定は、まずコネクタで行う。Cloudflare は公式の MCP サーバーをつなぐ
2. Claude in Chrome（オーナーの Chrome を操作。オーナーのログイン状態をそのまま使える）
3. Claude デスクトップアプリ内のブラウザ
4. コンピューター操作（スクリーンショットを見ながらクリック・入力）

アカウントの新規登録そのものは、コネクタではできないので、ブラウザ操作か手順の案内で行います。どれも使えない場合は、画面ごとの手順を番号付きで示し、オーナーに操作してもらいます。

### ブラウザ操作の準備（Claude in Chrome）

ブラウザ操作のツールがこの会話にあるかは、ツールの一覧で確かめます（Claude in Chrome は `mcp__claude-in-chrome__*`、デスクトップアプリ内のブラウザは `mcp__Claude_Browser__*` か `mcp__remote-devices__Claude_Browser__*`。有効にするツール `enable__...` だけがある場合は、先にそれを呼ぶ）。呼んでも「パソコンにつながっていない」と返ったときは、次の順に進めます。

1. オーナーに、この会話がパソコンにつながっていないことを平易に伝え、つなぎ方を案内する（docs/claude-account.md の「6. Claude にブラウザを操作してもらう」の「4. 会話をパソコンにつなぐ」）。デスクトップアプリや拡張機能を入れていない場合は、同じ節の1〜3の手順を案内する。所要時間は15分くらい
2. オーナーが入れたくない、またはつながらない場合は、次のどちらかを選んでもらう
   - Claude in Chrome のサイドパネルに貼る指示文を渡す。オーナーが Chrome の右上の Claude のマークからサイドパネルを開いて貼り、結果（作ったもののリンクなど）を会話に貼り返す。指示文には、やることを番号付きで、ログイン・パスワード・2段階認証・支払いの画面では止まってオーナーに交代すること、ほかのファイルを変更・削除しないこと、最後に表示してほしい結果を書く（例: templates/forms/chrome-google-form-prompt.md）
   - 画面ごとの手順を番号付きで案内し、オーナーが操作する
3. 指示文で作ってもらったものは、結果を受け取ったあとに、読める範囲で中身を確かめる（例: 公開された Google フォームを WebFetch で開き、題名と質問を確かめる）

接続を待つ間も、つながらないことを何度も繰り返して伝えず、2 の方法で先に進められることを添えます。オーナーが「Google Drive で」「スプレッドシートで」のようにコネクタを指定した場合も、そのコネクタでできないこと（Google フォームの作成など）は一文で伝え、できることに役割を分けます（例: フォームはサイドパネルで作り、テストの回答が表に入ったかを Google Sheets のコネクタで確かめる）。

## アカウントがすでにある場合

始める前に、GitHub と Cloudflare のアカウントを持っているかを選択肢で聞きます（持っている / 持っていない / わからない）。「わからない」は、会社のメールアドレスで登録の画面を開き、「すでに登録されています」と出るかで確かめます。

| 持っているもの | 進め方 |
|---|---|
| GitHub のアカウント | 下の「1. GitHub」の手順1〜3を飛ばす。手順4で2段階認証が有効かを確かめ、無効なら設定してもらう。有効なら、復旧コードを保存してあるかを聞き、なければ手順4の復旧コードの手順で保存してもらう。会社のサイトを置く場合は、そのアカウントのまま、下の「会社のサイトのとき」で Organization を作ってそこにリポジトリを置く（担当者の個人のリポジトリに置くと、担当者が辞めたときに管理できなくなるため）。すでに会社の Organization があれば、そこに置く |
| 会社の共有アドレスで作った1つのログインを、複数の人で使っている | 規約に合わないので、この機会に、担当者ごとのログインと Organization の形に移すことを勧める（site-review の「担当者が代わったとき」の最後の段落と同じ手順） |
| Cloudflare のアカウント | 下の「2. Cloudflare」の手順1〜4を飛ばす。2段階認証が有効か（有効なら、復旧コードを保存してあるか）、ほかのサイトやドメインが入っているかを確かめる。ほかのサイトがある場合は、手順7の API トークンの Zone Resources をこのサイトのドメインだけにしぼり、既存の DNS やサイトに触れないことをオーナーに伝える。手順8の workers.dev のサブドメインは、すでにあればそのまま使う |
| ドメイン | 手順6の「持っている場合」に進む。今のサイトがあれば migration.md を先に読む |
| Claude の GitHub アプリ | 「1. GitHub」の手順8で、このサイトのリポジトリが許可に入っているかを確かめ、なければ足してもらう（下の「Claude がリポジトリに書き込むための2つの許可」） |
| GitHub の Secrets（`CLOUDFLARE_API_TOKEN` など） | 別のサイトのリポジトリに登録した鍵は、このリポジトリには入っていない。リポジトリごとに登録する |

すでにあるアカウントのパスワードや2段階認証のコードを、オーナーに聞いたり、チャットに書いてもらったりはしません。ログインはオーナーが行います。

## 1. GitHub（設計図の保管庫）

所要時間: 15分くらい（アカウントがある場合は5分くらい）

1. エージェント: github.com/signup を開く
2. オーナー: メールアドレス、パスワード、ユーザー名を入力し、パズル認証と確認コードを入力する
3. エージェント: プランは Free のままにする（非公開リポジトリも無料で作れる）
4. オーナー: 2段階認証を設定する（Settings → Password and authentication。認証アプリを推奨）
   - オーナー: 設定の最後に表示される復旧コード（recovery codes。16個で、1つずつ1回だけ使える）を、「Download」か「Print」か「Copy」で保存する。保存先は、パスワードの管理アプリか、印刷した紙を決まった場所に保管する。保存先と中身は SITE.md にもチャットにも書かない。認証アプリの入ったスマートフォンをなくしたり替えたりしたときに、これがないとログインできなくなる
   - エージェント: 「復旧コードを保存できましたか」と聞き、「できた」をもらってから次に進む。あとからでも、Settings → Password and authentication の「Recovery codes」の「View」で表示して保存できる（GitHub のドキュメント「Configuring two-factor authentication recovery methods」、2026-10-30 確認: https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa/configuring-two-factor-authentication-recovery-methods ）
5. エージェント: サイト用の非公開リポジトリを作る画面（github.com/new）を開き、名前を提案する。会社のサイトでは、「Owner」に下の「会社のサイトのとき」で作った Organization を選ぶ。Private を選び、「Add a README file」（README を足す）をオンにする。README がない空のリポジトリには main ブランチがなく、Claude Code のプロジェクトのスレッドが作業を始められないため
6. オーナー: 「Create repository」を押す
7. エージェント: claude.ai/code で GitHub に接続する手順を案内する（docs/claude-account.md の「4. GitHub とつなぐ」）
8. オーナー: GitHub の接続を許可し、Claude の GitHub アプリをインストールする。インストール先は、リポジトリを置いたアカウント（会社のサイトでは Organization）を選び、リポジトリの選択で、サイトのリポジトリを選ぶ（権限の許可にあたるため、オーナーが行う。Organization へのインストールには、その Organization の Owner の権限が要る）

### 会社のサイトのとき（Organization に置く）

所要時間: 10分くらい。会社や団体のサイトでは、手順5の前に行います。個人のサイトでは要りません。

1. オーナー: 自分の GitHub のアカウントで、右上の自分の画像 → 「Settings」→ 左の「Access」の「Organizations」→ 「New organization」を押す（GitHub のドキュメント「Creating a new organization from scratch」）
2. オーナー: プランは Free を選ぶ。Organization の名前（会社名の英数字）と、連絡先のメールアドレス（会社の共有アドレスでよい）を入れ、会社のものであることを選ぶ画面が出たら、会社を選んで会社名を入れる。画面の項目は変わることがあるので、エージェントはスクリーンショットを見て案内する
3. オーナー: できるだけ、2人目の Owner（代表や、もう1人の担当者。自分の GitHub のアカウントを持っている人）を、Organization の「People」から招待する。Owner が1人だけだと、その人が辞めたときに管理できなくなるため。すぐに招待できなければ、SITE.md の「アカウント」に「Owner は1人」と書き、年に1回の点検で確かめる（site-review の「5. 年に1回の点検」）
4. エージェント: SITE.md の「アカウント」に、Organization の名前と Owner の人数を書く（名前と立場だけ。メールアドレスは書かない）

担当者が代わったときは、後任を Organization に招待し、前の担当者を外します（site-review の「担当者が代わったとき」）。

Claude Code の作業環境の通信の許可（Network access）に github.com を足す必要はありません。GitHub の操作（スキルの取り込みの `git clone` を含む）は、通信の許可の設定と関係なく、GitHub 専用の中継を通ります（versions.md の「時点つきの事実」）。

非公開のリポジトリで Claude Code が作業するには、Claude の GitHub アプリのインストールが必要です。Claude Code のプロジェクト（project-setup.md）に入れるリポジトリは、サイトのリポジトリ1つだけです。スキルは、制作に入るときに Claude がサイトのリポジトリの `skills/` に取り込みます（skills-install.md）。配布元のフォークは作りません（公開リポジトリのフォークは必ず公開になるため）。

### Claude がリポジトリに書き込むための2つの許可

GitHub のアカウントを作っただけでは、Claude はリポジトリに書き込めません（公開リポジトリでも同じです。読むことだけはできます）。次の2つがそろって、はじめて push できます。

1. Claude の GitHub アプリに、そのリポジトリを許可する（上の手順8）
   - インストールの画面で「Only select repositories」を選んだ場合、あとから作ったリポジトリは自動では入らない。リポジトリを新しく作ったら、GitHub の Settings → Applications → Installed GitHub Apps にある Claude の「Configure」で、そのリポジトリを足してもらう
2. Claude Code のプロジェクトかセッションに、そのリポジトリを入れる
   - プロジェクトでは Context に追加する（project-setup.md）。プロジェクトを使わない場合は、セッションを始めるときのリポジトリの選択で選ぶ
   - 1 が済んでいても、2 がないと push は拒否される。段階1から Claude Code で進めている場合も、サイトのリポジトリを作った時点で、リポジトリを選んだプロジェクトかセッションに移る

push できないときは、エラーで見分けます。

| 様子 | 原因 | 対処 |
|---|---|---|
| プロジェクトやセッションのリポジトリの一覧に出てこない | 1 の許可がない | GitHub アプリにリポジトリを足してもらい、画面を開き直してもらう |
| push が 403 で拒否され、"authorized repository set" や "add the repository to the session's sources" と出る | 2 がない | セッションの途中でリポジトリを追加できる場合（リポジトリの追加のツールがある場合）は追加する。できない場合は、作業一式（.git を含む）を zip にしてオーナーに渡し、リポジトリを選んだ新しいセッション（またはプロジェクト）に添付して続きを頼んでもらう |

zip での引き継ぎは、添付の漏れに気づきにくい方法です。作業を始める前に、push できるプロジェクトかセッションにいるかを確かめておくのがいちばん確実です。zip で引き継いだ場合は、新しいセッションで最初に zip が届いているかを確かめ、届いていなければ添付し直してもらいます。

## 2. Cloudflare（サイトの公開先）

所要時間: 10〜20分くらい（ドメインを取る場合は追加で10分）

1. エージェント: dash.cloudflare.com/sign-up を開く
2. オーナー: メールアドレスとパスワードを入力し、届いたメールの確認リンクを開く
3. オーナー: 2段階認証を設定する
   - オーナー: 設定の最後に表示される復旧コード（backup codes）を、「Download」か「Print」か「Copy」で保存する。保存先は GitHub の復旧コードと同じ決め方にし、SITE.md にもチャットにも書かない。1つのコードは1回だけ使える
   - エージェント: 「復旧コードを保存できましたか」と聞き、「できた」をもらってから次に進む。あとからは、My Profile → Authentication の Two-Factor Authentication の「Manage」で作り直せる（作り直すと前のコードは使えなくなる。Cloudflare のドキュメント「Two-factor authentication」、2026-10-30 確認: https://developers.cloudflare.com/fundamentals/user-profiles/2fa/ ）
4. エージェント: プランは Free を選ぶ。会社のサイトでは、あとで Manage Account → Members から、2人目の管理者（権限は Super Administrator - All Privileges）を招待しておくよう勧める（1人が辞めると管理できなくなるため。Cloudflare のドキュメント「Roles」、2026-10-30 確認: https://developers.cloudflare.com/fundamentals/manage-members/roles/ ）
5. Claude と Cloudflare をつなぐ（connectors.md の「カスタムコネクタの追加」）
   - オーナー: Claude の「Customize」→「Connectors」→「Add custom connector」で、名前に Cloudflare、URL に `https://mcp.cloudflare.com/mcp` を入れて追加し、Cloudflare の画面で権限を選んで許可する（5分くらい）。コネクタの一覧（ディレクトリ）にある「Cloudflare Developer Platform」は、DNS、Turnstile、メール送信の操作に足りないので選ばない（connectors.md の「カスタムコネクタの追加」）
   - 以降の DNS の確認と変更、アカウントIDの読み取り、Workers の設定は、エージェントがコネクタで行う。コネクタが使えない場合は、これまでどおりブラウザ操作で行う
6. ドメイン
   - 持っていない場合: 候補をエージェントが3つほど出し、空き状況を確認する。購入と支払いはオーナーが行う
     - .com などは Cloudflare Registrar で取得できる
     - .jp・.co.jp は Cloudflare Registrar では取得できない（2026年10月時点の確認）。お名前.com などの国内の登録業者で取得し、ネームサーバーを Cloudflare に向ける。取得前に Cloudflare の TLD の一覧で最新の対応状況を確認する
     - 国内の登録業者のうち、ムームードメインには Claude のディレクトリに載ったコネクタがあり、空きの検索と DNS の設定をエージェントが進められる（支払いはオーナーがムームードメインのサイトで行う）（ムームードメインの発表は、空きの検索、購入の手続き、DNS の設定を挙げていて、ネームサーバーの変更は挙げていない。GMOペパボのプレスリリース、2026-10-30 確認: https://dime.jp/company_news/detail/?pr=2736382 ）。ネームサーバーの変更は、Claude がコネクタのツールでできるかを確かめ、できなければオーナーがムームードメインの画面で行う（migration.md の「段階1」の4と同じ案内）。特に希望がなければ、こちらを勧める
   - 持っている場合: 今の管理会社（お名前.com、Xserver など）は変えずに、ネームサーバーを Cloudflare に向ける手順を案内する。ドメインの契約は今の会社のままで、移すのはネームサーバーだけ（Cloudflare 側の費用はかからない）。ネームサーバーは公開の数日前に移してよく、サイトの向き先（Workers の独自ドメイン）は公開するときに変える（deploy-and-autofix.md の「独自ドメインの接続」）。今のサイトがある場合は、migration.md の「5. ドメインと DNS の切り替え」の順に進める
7. APIトークン（GitHub から公開するための鍵）。強い権限が要るため、コネクタでは作らない
   - エージェント: My Profile → API Tokens → Create Token を開き、「Edit Cloudflare Workers」テンプレートを選ぶところまで進める
   - オーナー: 「Create Token」を押し、表示されたトークンをコピーする
   - 会社のサイトで、Manage Account → Account API tokens（アカウントのトークン。作った人が抜けても使い続けられるように作られている）が使える場合は、そちらで同じ権限のトークンを作るのを勧める（Cloudflare のドキュメント「Account API tokens」、2026-10-30 確認: https://developers.cloudflare.com/fundamentals/api/get-started/account-owned-tokens/ ）。同じテンプレートが選べるかは画面で確かめ、選べなければ上の My Profile のトークンで作り、担当者が代わったときに作り直す（site-review の「担当者が代わったとき」）
   - エージェント: アカウントIDを読み取る（コネクタがあればコネクタで、なければダッシュボードの右側の英数字）。アカウントIDは秘密ではないので、エージェントが扱ってよい
8. workers.dev のサブドメイン（確認用の URL `https://<Worker の名前>.<サブドメイン>.workers.dev` の部分）を確かめる。初めての公開と、公開後の確認（`.github/smoke-test.txt`）で使う。2分くらい
   - エージェント: コネクタで `GET /accounts/{account_id}/workers/subdomain` を呼び、サブドメインがあるかを確かめる
   - ない場合: エージェントが候補を1つ出し（会社名やサイト名の英数字。アカウント全体で使い、あとから変えると、今の workers.dev の URL がすべて変わる）、オーナーの「はい」を得てから、コネクタで `PUT /accounts/{account_id}/workers/subdomain`（本文は `{"subdomain": "<候補>"}`）で作る。コネクタがない場合は、オーナーに Cloudflare のダッシュボードの「Workers & Pages」を開いてもらい、サブドメインを決める画面が出たら候補を入れてもらう
   - エージェント: 決まったサブドメインを SITE.md の「技術」に書き、`.github/smoke-test.txt` の `<...>` を埋める（deploy-and-autofix.md の「初回の設定」）
9. GitHub に鍵を登録する
   - エージェント: サイトのリポジトリの Settings → Secrets and variables → Actions → New repository secret を開く
   - オーナー: 名前に `CLOUDFLARE_API_TOKEN` と入れ、コピーしたトークンを値の欄に貼り、保存する
   - エージェント: `CLOUDFLARE_ACCOUNT_ID` を同じ画面で登録する（値はアカウントID）
10. Claude の作業環境から、公開したサイトに届くようにする（公開後の品質チェックで使う。3分くらい）。段階1のチャットでは行わず、Claude Code に移ったあと、初めて公開するとき（workers.dev の URL が決まったとき）に頼む。チャットの設定を変えても、Claude Code の作業環境には効かないため
    - エージェント: オーナーがチャット（Cowork）とコード（Claude Code）のどちらで作業しているかを確かめる（設定の画面が違うため。SITE.md に書いてなければ選択肢をつけて聞き、答えを SITE.md に書く）
    - オーナー: 許可に、サイトのホスト（`*.<アカウントのサブドメイン>.workers.dev`、独自ドメインを使うならそのドメイン）を足す。チャットなら「設定」→「機能」（英語の画面では「Capabilities」）→「外部ネットワークへの通信を許可」、コードなら会話の名前の右の「∨」→「Edit cloud environment」→「Network access」（手順は quality-gate.md の「作業環境から本番のサイトに届かないとき」）

## 3. 自動修正用の Claude の鍵（任意）

公開が失敗したときに GitHub Actions の上で Claude に直してもらうには、GitHub Actions から Claude を呼ぶための鍵が要ります。設定しなくてもサイトは公開でき、失敗したときは GitHub の Issue（メールが届く）で知らせるので、オーナーが Claude に「直して」と頼めば直せます。公開したあとに足すこともできます。autofix.yml のコミットは GitHub が用意するトークン（GITHUB_TOKEN）で行うため、この用途のために追加の権限は要りません。

最初に、どちらにするかを選択肢で聞きます。

| 選択肢 | 手間 | 費用 | 向いている人 |
|---|---|---|---|
| A. 見送る（あとで足せる） | なし | なし | パソコンを使わない人、まず公開したい人、1ページのサイト（文章が .astro のページにあり、自動修正で直せることが少ない。deploy-and-autofix.md の「autofix の範囲」） |
| B. Claude のプランの鍵（`CLAUDE_CODE_OAUTH_TOKEN`） | パソコンで1行のコマンドを打つ。15分くらい | プランの利用量の中で使う | パソコンがあり、Pro、Max、Team、Enterprise のどれかを使っている人 |
| C. API キー（`ANTHROPIC_API_KEY`） | Claude Console でキーを作る。10分くらい | 使った分だけ料金がかかる（プランとは別の支払い） | パソコンがない、または会社で API の契約がある人 |

B の手順（オーナーのパソコンで行う。SKILL.md の「開発する場所」の例外）:

1. エージェント: オーナーのパソコン（Mac / Windows）に合わせて、Claude Code を入れるコマンドを Claude Code のドキュメントで確かめて案内する
2. オーナー: ターミナル（Windows は PowerShell）を開き、案内されたコマンドを貼って実行する
3. オーナー: `claude setup-token` を実行し、開いたブラウザで Claude にログインして許可する
4. オーナー: 表示された鍵をコピーする。チャットには貼らない
5. オーナー: GitHub の Settings → Secrets and variables → Actions → New repository secret で、名前 `CLAUDE_CODE_OAUTH_TOKEN` として貼って保存する（画面はエージェントが開く）
6. オーナー: 鍵を発行したあとは、パソコンの Claude Code を消してかまわない（鍵は GitHub に登録したもので動く）

C の手順:

1. オーナー: Claude Console（Anthropic の API の管理画面）にログインし、支払い方法を登録する
2. オーナー: 使いすぎを防ぐため、Console の利用の上限（月の上限額）を設定する。自動修正は失敗したときだけ動き、1回の実行は30ターンまで
3. オーナー: API キーを作ってコピーし、名前 `ANTHROPIC_API_KEY` で GitHub の Secrets に登録する

B の鍵（`claude setup-token` で作るもの）の有効期限は1年です（versions.md の「時点つきの事実」）。発行した日を SITE.md の「技術」の「自動修正用の鍵」に書きます。月1回の振り返り（site-review の「1. 読む」の5）で、発行から11か月を過ぎていたら、オーナーに作り直しを頼みます。振り返りを設定していないサイトでは、発行から11か月後の日付を、オーナーのカレンダーに入れてもらいます。鍵の発行方法、有効期限、画面の名前は変わることがあるため、案内の前に anthropics/claude-code-action の README と Claude Code のドキュメントで最新の手順を確認します。autofix.yml は両方の入力を渡しているので、B と C のどちらを選んでもワークフローは書き換えません。

## 終わったら

- SITE.md の「アカウント」に、サービス名、持ち主（Organization か個人のアカウント）、管理できる人の人数（Organization の Owner、Cloudflare の Super Administrator）、2段階認証の有無と復旧コードを保存したか（「済み」とだけ）を書く。パスワード、トークン、復旧コードとその保存先、メールアドレスは書かない。「アカウントの準備（オーナーの操作）」のチェック欄も更新する
- 作業ログに、オーナーに交代した回数と、つまずいた画面を書く
