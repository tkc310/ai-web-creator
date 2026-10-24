# 2026-10-24 通信の許可の案内を、チャットとコードで分ける

- きっかけ: 記事の著者の指示。前回（2026-10-24_lighthouse-main-pages.md）は「設定」→「機能」に1本化したが、コード（Claude Code）でもその設定が効くかは未確認だった
- 変えたファイル: skills/web-creator/references/quality-gate.md、skills/web-creator/references/account-setup.md、skills/web-creator/SKILL.md、skills/web-creator/templates/SITE.md、skills/web-creator/scripts/run_lighthouse.sh、docs/claude-account.md、README.md

## やったこと

1. quality-gate.md の「作業環境から本番のサイトに届かないとき」で、案内の前にオーナーがチャット（Cowork）とコード（Claude Code）のどちらで作業しているかを確かめる手順を足し、案内を2つに分けた
   - チャット: 「設定」→「機能」→「外部ネットワークへの通信を許可」で、追加のドメインにサイトのホストを足す
   - コード: 会話の名前の右の「∨」→「Edit cloud environment」→「Network access」を「Custom」にし、「Allowed domains」にサイトのホストを足し、既定の一覧も含める
2. 答えを SITE.md の「作業の環境」に残し、次からは聞かない（templates/SITE.md に項目を追加）
3. account-setup.md の Cloudflare の手順9、SKILL.md、run_lighthouse.sh の案内、docs/claude-account.md、README.md をそろえた

## 確認したこと

- チャット（Cowork）: 2026-10-24 にオーナーの操作で効くことを確認（2026-10-24_lighthouse-in-cloud.md）
- コード: 設定の場所と、変更が動いている会話に約1分で反映されること（https://code.claude.com/docs/en/cloud-environments、2026-10-24 確認）

## 確認できなかったこと

- コード（Claude Code）での実際の操作と、日本語の画面での表示名

## 次回の改善点

- コードのセッションで「Edit cloud environment」から許可を足し、run_lighthouse.sh で本番を測れるかを確かめる
