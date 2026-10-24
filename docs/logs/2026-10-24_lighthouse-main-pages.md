# 2026-10-24 Lighthouse は作業環境で主要ページだけ測る、ネットワークの許可は「設定」→「機能」から

- きっかけ: 記事の著者の指示。HTML パターンの検証で、Claude Code の会話のメニュー（Edit cloud environment）を案内したが、オーナーは Cowork（デスクトップアプリのチャット）で作業していてメニューが出なかった
- 変えたファイル: skills/web-creator/references/quality-gate.md、skills/web-creator/references/account-setup.md、skills/web-creator/SKILL.md、skills/web-creator/scripts/run_lighthouse.sh、docs/claude-account.md、README.md

## やったこと

1. quality-gate.md の Lighthouse を書き直した。計測はエージェントのクラウドの作業環境で行い、オーナーや外部の計測サービスには頼まない。全ページではなく、ページの種類ごとに代表1つ（多くて5ページ）を測る。測るページを SITE.md に残し、次回も同じページで比べる。記事の追加だけのときは測らない
2. 前回足した「オーナーに計測してもらう（最後の手段）」を外した
3. ネットワークの許可の案内を、チャットとコードで分けた表から、「設定」→「機能」→「外部ネットワークへの通信を許可」の1つの手順に変え、よくある問題として理由を書いた
4. account-setup.md の Cloudflare の手順に9（作業環境からサイトに届くようにする）を足し、公開前に済ませるようにした。docs/claude-account.md の最初の設定にも足した
5. SKILL.md の品質の基準、README.md、run_lighthouse.sh の案内の文言をそろえた

## 確認したこと

- Cowork で「設定」→「機能」のネットワークの許可に追加のドメインを足すと、クラウドの作業環境から本番のサイトに届いた（2026-10-24、前回のログ 2026-10-24_lighthouse-in-cloud.md）
- 項目名「外部ネットワークへの通信を許可」は、オーナーが日本語の画面で見た表示名（2026-10-24）

## 確認できなかったこと

- Claude Code（コード）で作業しているときにも、「設定」→「機能」の変更がクラウドの作業環境に効くか。Claude Code のドキュメントでは、クラウド環境ごとの「Network access」の設定が説明されている（https://code.claude.com/docs/en/cloud-environments）。両方の設定の関係は未確認
- 英語の画面での表示名

## 次回の改善点

- Claude Code のクラウドセッションで「設定」→「機能」の変更が効くかを確かめる。効かない場合は、quality-gate.md に「Edit cloud environment」の手順を戻す
