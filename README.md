# ai-web-creator

制作会社に頼んでいた規模のウェブサイト（LP、コーポレートサイト、ブログ、メディア）を、AIエージェントの Claude に任せて作り、公開し、運用し続けるためのスキルとプロンプトです。

ITに詳しくない人が、Claude と対話するだけで、安全でデザインのよいサイトを持てるようにすることを目指しています。

## はじめての方へ

- [Claude のアカウント登録ガイド](docs/claude-account.md): アカウントの作り方、有料プラン、最初にしておく設定、GitHub とのつなぎ方
- [スキルとプロンプトの使い方](docs/how-to-use.md): 相談から制作、公開、運用までの進め方
- [Cursor や ChatGPT で使う](docs/other-agents.md): Claude 以外のエージェントでスキルを読み込む方法と、Claude にしかない機能の置き換え

## 使い方

Claude（有料プラン）のチャットに次の文章を送ります。

```
GitHub の tkc310/ai-web-creator にあるスキル（skills フォルダ）を読み込んで、
私のサイト作りを手伝ってください。
私は IT に詳しくありません。
質問は選択肢をつけて、一度に5つまでにしてください。
```

Claude が選択肢つきの質問をしながら、企画、制作、公開まで進めます。公開後は管理画面を開く必要がなく、お知らせやブログは要点を箇条書きで送るだけで、Claude が下書きと校正をして公開します。公開前の変更は、Claude のアーティファクトで HTML のプレビューを見せてから公開します。GitHub や Cloudflare のアカウントの作り方や設定のしかたも、Claude が対話しながら教えます。制作に入るときは Claude Code（claude.ai/code）に移ります。詳しくは [スキルとプロンプトの使い方](docs/how-to-use.md) を参照してください。公開後の更新や質問も、Claude に話しかけるだけで済みます。ほかの頼み方は [prompts/README.md](prompts/README.md) にあります。

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
| [skills/site-content-update](skills/site-content-update/SKILL.md) | 公開後の記事・お知らせの更新。チャット、Google ドキュメント、Claude のドキュメントから原稿を読み取って公開する |
| [skills/site-maintenance](skills/site-maintenance/SKILL.md) | 要保守構成のサイトの定期保守。Dependabot の更新を2週間に1回レビュー・修正・マージする |
| [skills/runtime-update](skills/runtime-update/SKILL.md) | Dependabot が扱わない Node.js のメジャーバージョンと Workers の compatibility_date の更新 |
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

- Dependabot が npm のパッケージと GitHub Actions の更新をプルリクエストにする
- Claude のスケジュールタスク（旧称: ルーティン）が毎月1日と15日に動き、更新をレビューし、壊れていれば直して、問題なければマージする（[site-maintenance](skills/site-maintenance/SKILL.md)）
- Dependabot が扱わない Node.js のメジャーバージョンと Workers の compatibility_date は、同じルーティンの中で Claude が基準に従って更新する（[runtime-update](skills/runtime-update/SKILL.md)）
- データベースの構造が変わる更新、有料プランが必要になる更新、ライセンスが変わる更新は、自動ではマージせずオーナーに確認する

静的だけのサイトは、公開されたサイトで依存パッケージが動かないため、この保守を設定しません。

### 開発はクラウドで行い、公開は GitHub と Cloudflare で行う

開発はエージェントのクラウド環境で行い、オーナーのパソコンには開発ツールを入れません。サイトの中身は GitHub に保存し、GitHub Actions から Cloudflare Workers に公開します。アカウントはすべてオーナーの名義で作るので、エージェントや制作者に依存しません。

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

Lighthouse（モバイル）で、パフォーマンス95以上、ユーザー補助・おすすめの方法・SEO は100を目標にします。sitemap.xml、robots.txt、llms.txt、構造化データ（JSON-LD）、OGP を整えます。構造化データには、ページに表示している内容だけを書きます。基準の詳細は [quality-gate.md](skills/web-creator/references/quality-gate.md) にあります。

### 公開後も引き継げるようにする

サイトのリポジトリには、引き継ぎメモ（SITE.md）、オーナー向けの説明（README.md）、作業ログ（logs/）を置きます。別の日に新しい会話を始めても、エージェントは SITE.md を読んで続きから作業できます。

## スキルの構成

```
skills/
├── web-creator/
│   ├── SKILL.md                 … 進め方の全体とオーナーとの話し方
│   ├── references/              … ステップごとの詳細（必要なときに読む）
│   │   ├── hearing.md
│   │   ├── stack-selection.md
│   │   ├── account-setup.md
│   │   ├── build.md
│   │   ├── quality-gate.md
│   │   ├── deploy-and-autofix.md
│   │   └── migration.md         … CMS やノーコードツールからの引っ越し
│   ├── scripts/run_lighthouse.sh
│   └── templates/               … SITE.md、AGENTS.md、ワークフロー、dependabot.yml、llms.txt、JSON-LD など
├── site-content-update/
│   └── SKILL.md
├── site-maintenance/
│   ├── SKILL.md
│   └── references/              … ルーティンの作り方とプロンプト
└── runtime-update/
    └── SKILL.md
```

## 注意

- 料金やサービスの仕様は変わります。スキルの中の数値は作成時点のもので、エージェントは作業時に最新の情報を確認します
- 自動修正のワークフローを使うには、GitHub Actions から Claude を呼ぶための鍵（`CLAUDE_CODE_OAUTH_TOKEN` または `ANTHROPIC_API_KEY`）が必要です
- 保守ルーティンは Claude のスケジュールタスクで動くため、Claude の利用量を使います（Pro 以上のプランで利用できます）

## フィードバック

うまく動かなかった手順や、分かりにくかった説明は、Issue で教えてください。サイトの URL や個人情報は書かないでください。

いただいた意見をもとに改善した記録は [docs/logs/](docs/logs/README.md) に残しています。
