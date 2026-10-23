# 2026-10-24 スタックを最新版にし、pnpm に移す

- きっかけ: サイトのスタックは Node.js の最新ステーブル版、pnpm の最新版、各パッケージも最新版を使いたい（記事には反映しない）
- 変えたファイル: skills/runtime-update/SKILL.md（書き直し）、skills/site-maintenance/SKILL.md と references/routine-prompt.md・routine-setup.md、skills/site-review/SKILL.md、skills/web-creator/SKILL.md、references/build.md・stack-selection.md・preview.md・forms.md、templates/（node-version.txt、pnpm-workspace.yaml、package-json-fields.md、github/dependabot.yml、workflows/deploy.yml・check.yml・autofix.yml、AGENTS.md、claude/agents/site-builder.md）、scripts/make_preview.py・run_lighthouse.sh、skills/site-content-update/SKILL.md、README.md

## 決めたこと

- 「最新の安定版」は、最新の偶数番の Node.js とした（Current でも LTS でもよい）。奇数番は Astro が対応していないため使わない。新しい偶数番は、astro、@astrojs/cloudflare、wrangler、emdash の engines が対応してから上げる
- pnpm は最新版を packageManager に書き、GitHub Actions は pnpm/action-setup で同じ版を使う
- 依存パッケージの更新は Dependabot をやめ、runtime-update で pnpm update --latest を使う。Dependabot は GitHub Actions の更新だけにした
- 公開から1日たっていない版は入れない（minimumReleaseAge: 1440）。最新版を使う方針の中で、乗っ取られた版を公開直後に入れる攻撃を避けるため。pnpm 11 以降の既定値と同じ
- インストール時のスクリプトは allowBuilds で許可したもの（esbuild、sharp、workerd）だけ
- 静的なサイトも、月1回の振り返りで最新にする

## 確認したこと（2026-10-24）

- Node.js: 24 は 2026-10-20 から Maintenance、26 は 2026-05-05 に公開され 2026-10-28 に LTS、25 は 2026-06-01 にサポート終了、27 は 2027-04-22 公開予定（https://raw.githubusercontent.com/nodejs/Release/main/schedule.json）
- Astro は偶数番の Node.js に対応し、奇数番には対応しない（https://docs.astro.build/en/tutorial/1-setup/1/）
- pnpm の最新は 12.15.0（2026-10-21）。12 は 2026-08-26 に公開。9 以前はサポート終了（https://www.endoflife.date/pnpm）
- pnpm の minimumReleaseAge は分単位で、v11 から既定 1440。除外は minimumReleaseAgeExclude（https://pnpm.io/settings/dependency-resolution）
- pnpm はインストール時のスクリプトを既定で止め、allowBuilds で許可する。strictDepBuilds の既定は true（https://pnpm.io/settings/build）
- Dependabot は pnpm 11・12 の2文書形式のロックファイルを正しく読めない問題が未解決（https://github.com/dependabot/dependabot-core/issues/14919 、https://github.com/dependabot/dependabot-core/issues/15904）。pnpm 11 の minimumReleaseAge と Dependabot の組み合わせで CI が失敗する問題もある（https://dev.classmethod.jp/en/articles/pnpm-11-minimum-release-age-dependabot-ci-failure/）
- pnpm/action-setup は v6 で、package.json の packageManager があれば version を省略できる（https://github.com/marketplace/actions/setup-pnpm）。actions/setup-node と actions/checkout は v7、cloudflare/wrangler-action は v4 で packageManager に pnpm を指定できる
- ワークフローと dependabot.yml、pnpm-workspace.yaml は YAML として読めることを確かめた

## 確認できなかったこと

- 実際のリポジトリで、pnpm 12 と Node.js 26 で Astro と EmDash がビルドできるか（作業環境から npm のレジストリに接続できないため）
- pnpm update --latest と minimumReleaseAge の組み合わせで、公開から1日たっていない版があるときの実際の動き
- wrangler-action v4 で、HTML だけのサイト（package.json なし）が今までどおり公開できるか

## 次回の改善点

- 実際のサイトで上の3つを試し、runtime-update の手順を直す
- Dependabot が pnpm 12 のロックファイルに対応したら、依存パッケージの更新のプルリクエストを Dependabot に戻すかを検討する
