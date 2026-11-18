# T01. アンチ AI スロップ／"taste"

[索引](../index.md) · [2026-10 のスナップショット](../monthly/2026-10.md)

- **ID**: T01
- **タグ**: #anti-pattern #ai-agent #visual
- **概要**: AI が生成した UI に共通して出る既定値の組み合わせを「AI スロップ」と呼び、意図的に避ける動き。2026 年のデザイン界の合言葉は「taste（審美眼）」になった。
- **特徴・適用方法**:
  - 典型的な兆候（tells）: インディゴ〜紫のグラデーション、何も指定しない Inter、同じ形の 3 枚のフィーチャーカード、角丸と影が 1 種類だけ、全体の中央揃え、見出しの上の eyebrow ラベル、カードの中のカード、絵文字アイコン、中身のない見出しコピー。
  - 対処は次の順です。まずフォントを決める。色は装飾ではなく意味で使う（primary、warning など）。角丸に階層をつける。フォーカス状態をデザインする。同じ形のカードを並べない。
  - 紫や Inter 自体が悪いわけではありません。Stripe は紫、Linear は Inter を使っています。問題は、決めずに既定値のまま使うことです。単一のスコアに最適化しすぎると、今度は別の形で均質化します。
  - 日本語圏では「AI 感」ではなく「テンプレート感」として捉えるほうが有用だ、という指摘もあります。
  - NN/g の記事（2026-10-23 公開。調査は 2026-08-24〜09-11、有効回答 521、便宜的サンプル）では、導入の障壁の最多が出力品質（54%）、次いでデータプライバシー（50%）。自由記述には、他人の AI 出力を直す負担として slop という語が出る。感情の平均は 5 点中 3.57。時短の自己報告と、仕上がりへの不満が同時にある。
- **向く場面**: AI で生成した LP、SaaS の UI、プロトタイプの仕上げとレビュー。
- **避ける場面**: チェックリストを機械的に当てはめるだけになるとき。ブランドがすでに紫や Inter を体系的に使っているとき。
- **代表例**: Impeccable（検出器）、Hallmark（ブラウザで lint）、Taste Skill（frame check）、hankimis/ai-design-tells（Tell Score）
- **ソース**:
  - [X: @AIHighlight 2026-08-12](https://x.com/AIHighlight/status/2087213301130236311) L57 / V15,801
  - [X: @rajanndube 2026-08-10「2026: taste」](https://x.com/rajanndube/status/2086531125338685715) L9
  - [X: @masaru21 2026-09-05「AI 感よりテンプレート感」](https://x.com/masaru21/status/2096028491628355669) L102 / V16,085
  - [X: @kazm_n18 2026-10-09](https://x.com/kazm_n18/status/2108392512989925715) L14
  - [X: Hallmark が Trending、2026-10-27](https://x.com/trending_repos/status/2115052997134741743) L338 / V28,170 / RT31 / BM508（2026-11-01 10:07 JST）
  - [X: @rwspatin 2026-10-04](https://x.com/rwspatin/status/2106437552844444129) L53 / V79,360 / RT3 / BM43（2026-11-01 10:07 JST）。紫グラデーション、Inter、角丸カード、絵文字アイコンを列挙し、frontend-design スキルと Impeccable を紹介。いいねは小さく、表示は大きい。
  - [X: @codex_lab_ 2026-10-27、MotionSites](https://x.com/codex_lab_/status/2114738908424741148) L1,030 / V63,531 / RT55 / BM1,071（2026-11-01 10:07 JST）。アンチ AI スロップのスキル告知。スキルの中身は未確認。
  - [NN/g「AI in UX」2026-10-23](https://www.nngroup.com/articles/ai-in-ux-survey-26/)
  - [Spot the slop](https://www.mania.design/blog/spot-the-slop-a-ui-designers-guide-to-fixing-ai-defaults/)
  - [AI slop design tells](https://www.925studios.co/blog/ai-slop-design-tells)
  - [27 tells と、202 サイトによる較正](https://labs.iovstudio.kr/papers/ai-design-tells.pdf)
- **トレンド時期**: 2026-08 から増え、2026-10 下旬（Hallmark、Impeccable、Taste が GitHub Trending 入り）がピーク。
- **確度**: 高

- **状態**: rising

## 更新履歴

- 2026-10: 初収録。本文は 2026-10 下旬をピークとしているので、状態は rising。確度は高。
- 2026-10（記録 2026-11-01）: Hallmark の反応数を更新。前の値は 2026-10-31 12:45 JST 頃の L338（表示などは当時未記録）。1 日でいいねは動いていない。NN/g の調査と、スキル告知の投稿を追加。MotionSites の中身は未確認。@shadcn の「you are the moat」（L1,252）はデザイン手法の根拠にならないのでソースに入れていない。状態は rising のまま、確度は高のまま。
