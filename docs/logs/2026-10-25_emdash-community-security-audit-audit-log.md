# 2026-10-25 EmDash の選定条件、セキュリティ監査、監査ログ

- きっかけ: オーナーの依頼。EmDash は会員機能などプラグインが必要な機能がなければ選ぶ利点が小さく、多くは Astro の静的ビルドで足りる。数千件で仕組みの見直しや乗り換えを検討する段階。プラグインは2026年10月時点で安定していないため、必要な機能は Claude に実装してもらう。あわせて、リリース前と機能の追加・変更時に Cloudflare の security-audit スキルで監査すること、改善ループとは別に年ディレクトリ・日単位の監査ログを残すこと
- 変えたファイル: skills/web-creator/references/stack-selection.md、hearing.md、migration.md、quality-gate.md、run-logs.md、security-audit.md（新規）、audit-log.md（新規）、skills/web-creator/SKILL.md、templates/AGENTS.md、templates/SITE.md、templates/audit-log.md（新規）、templates/github/workflows/autofix.yml、skills/site-content-update/SKILL.md、skills/site-maintenance/SKILL.md と references/routine-prompt.md、skills/site-review/SKILL.md、docs/how-to-use.md、README.md、CHANGELOG.md

## やったこと

1. 技術の選定の Q2・Q3 を「会員機能やコメント機能が必要か」「外部のサービスで足りないか」に変えた。記事の数や更新頻度、管理画面の希望は EmDash を選ぶ理由にしないと明記し、数千本までは Astro の静的ビルドで足りる根拠に docs/verification/2026-10-25_media-json-ssr/ を引いた。記事が増えたときのビルドの保ち方も stack-selection.md に移した
2. 「対応しないもの」から会員機能を外し、EC・決済・予約システムだけを残した
3. EmDash のプラグインは原則使わず、必要な機能はエージェントが実装する方針を書いた
4. security-audit.md を新設。行う場面、入れ方（skills CLI で --global、npm に届かないときは git clone）、頼み方、結果（confirmed / needs_validation / rejected）の扱い、報告書をコミットしないことを決めた
5. audit-log.md を新設。`audit-log/YYYY/YYYY-MM-DD.md` に追記し、変更と同じコミットに入れる。site-review の整理の対象外にした。autofix のプロンプトにも追記の手順と `TZ=Asia/Tokyo date` の許可を足した

## 確認したこと

- security-audit の出典: https://github.com/cloudflare/security-audit-skill（Cloudflare, Inc.、MIT）。6段階の流れ、既定の出力先 `~/security-audit-skill/<repo>/run-<N>`、対象のコードを動かすには外部通信のない隔離環境が要ること、明示的な監査の依頼で完全な監査になることを README と SKILL.md で確認（2026-10-25）
- `npx -y skills add https://github.com/cloudflare/security-audit-skill --skill security-audit --global --agent claude-code --yes` で `~/.claude/skills/security-audit` に入ることを、作業環境で一時的なホームを使って確かめた
- EmDash のプラグインの状況: 2026年9月29日時点で十数個（https://webhosting.today/2026/09/29/emdash-1-0-is-stable-its-sandboxed-plugins-cannot-touch-the-database-and-that-is-the-whole-pitch/）
- autofix.yml を YAML として読み込めること

## 確認できなかったこと

- 実際のサイトのリポジトリで security-audit の完全な監査を通し、かかる時間とトークンを測ること
- EmDash で会員機能やコメント機能を実装する具体的な手順（実運用の知見がたまってから build.md に足す）

## 次回の改善点

- サンプル（ai-web-creator-example-*）で security-audit を一度通し、所要時間と見つかったものを security-audit.md に反映する
