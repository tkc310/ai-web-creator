# ai-web-creator

制作会社に頼んでいた規模のウェブサイト（LP、コーポレートサイト、ブログ、メディア）を、AIエージェントの Claude に任せて作り、公開し、運用し続けるためのスキルとプロンプトです。

ITに詳しくない人が、Claude と対話するだけで、安全でデザインのよいサイトを持てるようにすることを目指しています。

## 使い方

Claude（有料プラン）に次の文章を送ります。

```
GitHub の tkc310/ai-web-creator にあるスキル（skills フォルダ）を読み込んで、
私の会社のホームページ作りを手伝ってください。
私は IT に詳しくありません。
質問は選択肢をつけて、一度に5つまでにしてください。
```

Claude が選択肢つきの質問をしながら、企画、制作、公開まで進めます。公開後の更新や質問も、Claude に話しかけるだけで済みます。ほかの頼み方は [prompts/README.md](prompts/README.md) にあります。

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
| [prompts](prompts/README.md) | サイトのオーナーがコピーして使うプロンプト集 |

## 設計の方針

### 技術はオーナーに選ばせない

ページ数と更新頻度から、エージェントが次のどれかを決めます。

- 1ページの LP: HTML / CSS / JavaScript
- お知らせやブログがある複数ページのサイト: Astro（ほとんどのサイトはこれになる）
- 毎日更新するメディアや、書き手が管理画面を必要とするサイト: EmDash

EmDash は本体やプラグインの更新、データベースの管理といった運用が発生するため、ほかの方法で足りない場合だけ選びます。

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

CI で確認するのは「ビルドが通るか」だけです。リンターやテストはエージェントが作業中に実行します。デプロイが失敗すると、GitHub Actions 上で Claude が原因を調べて直し、公開し直します（[autofix.yml](skills/web-creator/templates/github/workflows/autofix.yml)）。失敗しても、Cloudflare 上の前回のサイトはそのまま表示されます。

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
│   │   └── migration.md         … WordPress や STUDIO からの引っ越し
│   ├── scripts/run_lighthouse.sh
│   └── templates/               … SITE.md、AGENTS.md、ワークフロー、llms.txt、JSON-LD など
└── site-content-update/
    └── SKILL.md
```

## 注意

- 料金やサービスの仕様は変わります。スキルの中の数値は作成時点のもので、エージェントは作業時に最新の情報を確認します
- 自動修正のワークフローを使うには、GitHub Actions から Claude を呼ぶための鍵（`CLAUDE_CODE_OAUTH_TOKEN` または `ANTHROPIC_API_KEY`）が必要です

## フィードバック

うまく動かなかった手順や、分かりにくかった説明は、Issue で教えてください。サイトの URL や個人情報は書かないでください。
