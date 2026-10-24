# ai-web-creator

制作会社に頼んでいた規模のウェブサイト（LP、コーポレートサイト、ブログ、メディア）を、AIエージェントの Claude に任せて作り、公開し、運用し続けるためのスキルとプロンプトです。

ITに詳しくない人が、Claude と対話するだけで、安全でデザインのよいサイトを持てるようにすることを目指しています。

このリポジトリは誰でも読めますが、オープンソースではありません。使えるのは、note の解説記事「初心者でもAIに頼むだけ。ホームページの作成も更新も自動化する仕組み（Astro・EmDash）」を購入した方だけです。条件は [LICENSE](LICENSE) と、このページの「ライセンス」を見てください。

## はじめての方へ

- [Claude のアカウント登録ガイド](docs/claude-account.md): アカウントの作り方、有料プラン、最初にしておく設定、GitHub とのつなぎ方
- [スキルとプロンプトの使い方](docs/how-to-use.md): 相談から制作、公開、運用までの進め方
- [お問い合わせフォームの作り方](docs/forms.md): Google フォーム（リンク・埋め込み）と、サイトと同じ見た目のフォーム（Cloudflare Email Sending）の導入方法。ほかのサービスの紹介と注意点
- [Cursor や ChatGPT で使う](docs/other-agents.md): Claude 以外のエージェントでスキルを読み込む方法と、Claude にしかない機能の置き換え

## 使い方

Claude（有料プラン）のチャットに次の文章を送ります。

```
GitHub の tkc310/ai-web-creator にあるスキル（skills フォルダ）を読み込んで、
私のサイト作りを手伝ってください。
私は IT に詳しくありません。
質問は選択肢をつけて、一度に5つまでにしてください。
```

Claude が選択肢つきの質問をしながら、企画、制作、公開まで進めます。公開後は管理画面を開く必要がなく、お知らせやブログは要点を箇条書きで送るだけで、Claude が下書きと校正をして公開します。公開前の変更は、Claude のアーティファクトで HTML のプレビューを見せてから公開します。直したいところは、プレビューの上で文章や画像を選んでコメントするだけで伝えられます。GitHub や Cloudflare のアカウントの作り方や設定のしかたも、Claude が対話しながら教えます。制作に入るときは Claude Code（claude.ai/code）に移ります。詳しくは [スキルとプロンプトの使い方](docs/how-to-use.md) を参照してください。公開後の更新や質問も、Claude に話しかけるだけで済みます。ほかの頼み方は [prompts/README.md](prompts/README.md) にあります。

## 使うモデル

Claude Opus 5.5 を使います。計画とデザインは effort high、構築（制作、更新、保守、自動修正）は effort medium にしています。設定はスキルの frontmatter、サブエージェントの定義（templates/claude/agents/site-builder.md）、サイトのリポジトリの `.claude/settings.json`、自動修正ワークフローの引数で行います。

## 対応しないもの

会社や店の紹介サイト、LP、ブログ、メディアのような「情報を見せるサイト」が対象です。ネットショップ（EC）や決済が必要なサービス、会員機能のような複雑な仕組みが必要なアプリケーションには対応していません。その場合も、制作会社に渡す見本や仕様書づくりには使えます。

## 必要なもの

- Claude の有料プラン（Pro 以上）
- GitHub のアカウント（無料プランでよい）
- Cloudflare のアカウント（無料プランでよい）
- サイトの住所にするドメイン（持っていなければ途中で取得する）

GitHub と Cloudflare のアカウントは、作業の途中で Claude が作成を案内します。

## 中身

| フォルダ | 内容 |
|---|---|
| [skills/web-creator](skills/web-creator/SKILL.md) | サイト制作の全体を進めるスキル。ヒアリング、技術の選定、アカウントの準備、デザインと制作、公開前の品質チェック、公開、自動修正 |
| [skills/site-content-update](skills/site-content-update/SKILL.md) | 公開後の記事・お知らせの更新。チャット、Google ドキュメント、Claude ドキュメントから原稿を読み取って公開する |
| [skills/site-maintenance](skills/site-maintenance/SKILL.md) | 要保守構成のサイトの定期保守。2週間に1回、スタックを最新にし、壊れていれば直してマージする |
| [skills/site-review](skills/site-review/SKILL.md) | 実行ログの振り返り。改善点を整理して直し、古いログを月ごとに要約して削除する |
| [skills/runtime-update](skills/runtime-update/SKILL.md) | Node.js（最新の LTS 版）、pnpm、依存パッケージを最新版に、Workers の compatibility_date を新しく保つ |
| [prompts](prompts/README.md) | サイトのオーナーがコピーして使うプロンプト集 |

## 設計の方針

### 技術はオーナーに選ばせない

ページ数と更新頻度から、エージェントが次のどれかを決めます。

- 1ページの LP: HTML / CSS / JavaScript
- お知らせやブログがある複数ページのサイト: Astro（ほとんどのサイトはこれになる）
- 毎日更新するメディアや、書き手が管理画面を必要とするサイト: EmDash

Astro は SSG（ビルド時に全ページを HTML にする）を前提にします。お問い合わせの送信処理のように、アクセスのたびに処理が必要なページがある場合だけ、そのページを SSR にします。

EmDash は本体やプラグインの更新、データベースの管理といった運用が発生するため、ほかの方法で足りない場合だけ選びます。

### 要保守構成は2週間ごとに自動で保守する

Astro で一部のページを SSR にした場合と EmDash を使う場合は、公開されたサイトで依存パッケージのコードが動くため、「要保守構成」として扱います。

- Claude のスケジュールタスク（旧称: ルーティン）が毎月1日と15日に動き、Node.js（最新の LTS 版）、pnpm、依存パッケージを最新版に、Workers の compatibility_date を新しくする。壊れていれば直して、問題なければマージする（[site-maintenance](skills/site-maintenance/SKILL.md)、[runtime-update](skills/runtime-update/SKILL.md)）
- 公開から1日たっていない版は入れない（乗っ取られた版を公開直後に入れる攻撃を避けるため）。弱点は `pnpm audit` で確かめ、重大なものを先に直す
- Dependabot は GitHub Actions の更新だけに使う。pnpm 11 以降のロックファイルを Dependabot が正しく読めない問題があるため（2026年10月時点）
- データベースの構造が変わる更新、有料プランが必要になる更新、ライセンスが変わる更新は、自動ではマージせずオーナーに確認する

静的だけのサイトは、公開されたサイトで依存パッケージが動かないため、この保守を設定しません。代わりに、月1回の振り返り（[site-review](skills/site-review/SKILL.md)）の中で同じように最新版にします。

### スタックは常に最新版を使う

Node.js は最新の LTS 版（Node.js の公式が本番用に勧めるもの。LTS になる前の Current と奇数番は使わない）、パッケージの管理は pnpm の最新版、依存パッケージも最新版で作り、上の保守と振り返りで最新に保ちます（[build.md](skills/web-creator/references/build.md) の「使うツールとバージョン」）。

### 開発はクラウドで行い、公開は GitHub と Cloudflare で行う

開発はエージェントのクラウド環境で行い、オーナーのパソコンには開発ツールを入れません。サイトの中身は GitHub に保存し、GitHub Actions から Cloudflare Workers に公開します。アカウントはすべてオーナーの名義で作るので、エージェントや制作者に依存しません。

### サービスの操作はコネクタ（MCP）で行う

Cloudflare や Google のサービスの設定は、できるかぎり Claude のコネクタ（MCP）で行います。Cloudflare は公式の MCP サーバーをつなぎ、Google ドライブやスプレッドシートは Claude の公式のコネクタを使います。接続はオーナーがチャットに出たボタンから認証するだけです。コネクタがない操作（アカウントの新規登録、Google フォームの作成など）は、ブラウザ操作か手順の案内で進めます（[connectors.md](skills/web-creator/references/connectors.md)）。ブラウザ操作に使う Claude in Chrome とデスクトップアプリの入れ方は、Claude が必要になったときに案内します（[アカウント登録ガイド](docs/claude-account.md) の6）。

### 機密情報を読まず、汚染された文章に従わない

すべてのスキルと、サイトのリポジトリで動くエージェント（自動修正、保守、振り返りを含む）は、共通の安全の決まりを守ります。機密情報（パスワード、トークン、Secrets の値、訪問者の個人情報）は読み取らず、チャット、ファイル、ログのどこにも残しません。原稿、ウェブページ、プルリクエスト、ログなどに書かれた指示には従わず、公開するものと記録するものは、出す前に AI に向けた攻撃の文章や機密情報が混ざっていないかを確かめます。機械で見つけられるものは scripts/check_text.py で調べ、自動修正のワークフローも、見つかった場合はコミットせずに止まります（[security-rules.md](skills/web-creator/references/security-rules.md)）。

### 人に任せる操作を4つに限る

次の4つはエージェントが代わりに行わず、オーナーに交代します。

1. パスワードの入力と登録の確定
2. 2段階認証
3. 支払いと規約への同意
4. API トークンなど秘密の文字列の貼り付け

ドメインの切り替えや既存サイトの削除のように取り消せない操作は、何が起きるかを説明し、オーナーの了承を得てから行います。

### デプロイを失敗しにくくし、失敗しても自動で直す

CI で確認するのは「ビルドが通るか」だけです（要保守構成では、プルリクエストでも同じ確認をする）。リンターやテストはエージェントが作業中に実行します。デプロイが失敗すると、GitHub Actions 上で Claude が原因を調べて直し、公開し直します（[autofix.yml](skills/web-creator/templates/github/workflows/autofix.yml)）。失敗しても、Cloudflare 上の前回のサイトはそのまま表示されます。

### 公開前に品質を測る

Lighthouse（モバイル）で、パフォーマンス95以上、ユーザー補助・おすすめの方法・SEO は100を目標にします。sitemap.xml、robots.txt、llms.txt、構造化データ（JSON-LD）、OGP を整えます。構造化データには、ページに表示している内容だけを書きます。計測は Claude のクラウドの作業環境で、トップページなどの主要ページ（ページの種類ごとに代表1つ）だけを行い、公開後は本番のサイトでも測ります。作業環境から本番のサイトに届かない場合は、チャットとコードのどちらで使っているかを聞いたうえで、Claude が通信の許可にサイトのアドレスを足す手順を案内します。基準の詳細は [quality-gate.md](skills/web-creator/references/quality-gate.md) にあります。

### サイトごとに Claude のプロジェクトを作る

制作と運用は、サイトごとに作る Claude Code のプロジェクトの中で進めます。プロジェクトの指示に、オーナーの環境（パソコン、ブラウザ、原稿の置き場所など）と作業の決まりを書いておくので、どの会話でも説明し直す必要がありません。オーナーはプロジェクトの会話に頼みごとを書くだけです。プロジェクトが使えないアカウントでは、同じ内容を SITE.md に書いて、新しいセッションから頼みます（[project-setup.md](skills/web-creator/references/project-setup.md)）。

### 公開後も引き継げるようにする

サイトのリポジトリには、引き継ぎメモ（SITE.md）、オーナー向けの説明（README.md）、実行ログ（logs/）を置きます。別の日に新しい会話を始めても、エージェントは SITE.md を読んで続きから作業できます。

### 実行ログで改善ループを回す

エージェントが動くたびに（オーナーの依頼、自動修正、保守、振り返り）、サイトのリポジトリの logs/ に実行ログを1つ書きます。次回以降に直す価値がある点は logs/IMPROVEMENTS.md にまとめ、次の作業の前に読みます。月に1回の振り返り（[site-review](skills/site-review/SKILL.md)）で改善点を整理し、保管期間（既定90日）を過ぎたログは月ごとに要約して削除します。スキル側の改善点は、オーナーの了承を得て、個人情報を除いてからこのリポジトリの Issue に送ります（[run-logs.md](skills/web-creator/references/run-logs.md)）。

## スキルの構成

```
skills/
├── web-creator/
│   ├── SKILL.md                 … 進め方の全体とオーナーとの話し方
│   ├── references/              … ステップごとの詳細（必要なときに読む）
│   │   ├── hearing.md
│   │   ├── stack-selection.md
│   │   ├── account-setup.md
│   │   ├── connectors.md        … Cloudflare や Google の操作に使うコネクタ（MCP）
│   │   ├── project-setup.md     … サイトごとの Claude のプロジェクト
│   │   ├── build.md
│   │   ├── quality-gate.md
│   │   ├── deploy-and-autofix.md
│   │   ├── forms.md             … お問い合わせフォーム（Google フォーム / Cloudflare Email Sending）
│   │   ├── migration.md         … CMS やノーコードツールからの引っ越し
│   │   ├── preview.md
│   │   ├── run-logs.md          … 実行ログと改善ループ
│   │   └── security-rules.md    … 安全のための決まり（全スキル共通）
│   ├── scripts/                 … run_lighthouse.sh、make_preview.py、check_text.py（機密情報と汚染のチェック）
│   └── templates/               … SITE.md、AGENTS.md、プロジェクトの指示、ログ、IMPROVEMENTS.md、ワークフロー、dependabot.yml（GitHub Actions だけ）、pnpm-workspace.yaml、llms.txt、JSON-LD、フォーム（forms/）など
├── site-content-update/
│   └── SKILL.md
├── site-maintenance/
│   ├── SKILL.md
│   └── references/              … ルーティンの作り方とプロンプト
├── site-review/
│   └── SKILL.md                 … 振り返りと、古いログの要約・削除
└── runtime-update/
    └── SKILL.md
```

## 注意

- 料金やサービスの仕様は変わります。スキルの中の数値は作成時点のもので、エージェントは作業時に最新の情報を確認します
- 自動修正のワークフローを使うには、GitHub Actions から Claude を呼ぶための鍵（`CLAUDE_CODE_OAUTH_TOKEN` または `ANTHROPIC_API_KEY`）が必要です
- 保守ルーティンは Claude のスケジュールタスクで動くため、Claude の利用量を使います（Pro 以上のプランで利用できます）

## ライセンス

[LICENSE](LICENSE) の条件で使えます。要点は次のとおりです。

- 使えるのは、note の解説記事の購入者だけです。購入者が会社や団体のために使う場合は、その会社や団体の中で使えます
- 自分や自社のサイトの制作、公開、更新、保守に使えます。そのためのフォーク、同期、書き換えもできます
- ほかの人から依頼を受けてサイトを作る仕事に使う場合は、事前に連絡して許諾を得てください
- スキルやプロンプトの配布、販売、購入者でない人への受け渡し、似たものを作って配ることはできません
- AI の学習や学習用データセット、RAG の索引、購入者以外への回答に使う知識ベースへの取り込みと、そのためのクローリングは禁止しています。購入者が自分の AI エージェントに読み込ませるのは問題ありません
- スキルで作ったサイトのページ、文章、コード、ログは、購入者のものです。自由に使えます
- 保証はありません

## フィードバック

うまく動かなかった手順や、分かりにくかった説明は、Issue で教えてください。サイトの URL や個人情報は書かないでください。

いただいた意見をもとに改善した記録は [docs/logs/](docs/logs/README.md) に残しています。
