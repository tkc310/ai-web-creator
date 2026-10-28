# 2026-10-28 EmDash の判定を、記事の数と受託制作の2つにし、会員機能とコメント機能を対象外にした

- きっかけ: オーナーの依頼。会員機能とコメント機能は、個人情報の持ち方しだいでセキュリティの穴になりやすい。利用者は開発に詳しくない人なので、安全を優先して EmDash の分岐から外し、対象外にする。代わりに、記事が数千本規模のメディアと、受託制作で顧客が AI を使わずに管理画面から更新するケースを EmDash の分岐にする。コメント機能と、記事の閲覧権限をしぼる程度の会員機能なら比較的安全に作れることは軽く触れる
- 変えたファイル: skills/web-creator/references/stack-selection.md、hearing.md、migration.md、security-audit.md、skills/web-creator/SKILL.md、skills/web-creator/templates/AGENTS.md、README.md

## やったこと

1. stack-selection.md の判定を、Q2「記事が数千本規模になるか」、Q3「受託制作で顧客が管理画面から投稿するか」に変えた。どちらかが「はい」なら C（EmDash）、どちらも「いいえ」なら B（Astro）
2. stack-selection.md に「対象外: 会員機能とコメント機能」を足した。理由、伝え方、比較的安全な代わり（外部のコメント埋め込み、閲覧をしぼる程度の外部の認証）、コミュニティや会員の個人情報の管理が必要な場合は制作会社への依頼を勧めることを書いた
3. 受託制作のケースの見出しから「補足」を外し、C を選ぶ理由の1つにした
4. SKILL.md の「対応しないもの」、hearing.md の対象外の要望、migration.md の WordPress からの移行、README.md の方針を、同じ判定にそろえた。security-audit.md と templates/AGENTS.md の監査の対象から「会員やコメントの機能」を外し、「管理画面の権限」にした

## 確認したこと

- 3,000 本で約 7 秒、1 万本で約 18 秒というビルドの計測（docs/verification/2026-10-25_media-json-ssr/）は残し、数千本規模で C にする理由を、ビルドの時間だけでなく記事の管理の負担とした

## 追記（同日）

- オーナーの指摘で、外部のサービスで代わりに作る案内をやめた。コメント機能と閲覧権限をしぼる程度の会員機能は EmDash だけで安全に作れるが、利用者が開発に詳しくないため推奨せず、このスキルでは対象外とする書き方にそろえた（stack-selection.md、hearing.md、migration.md、SKILL.md、README.md）

## 次回の改善点

- 特になし
