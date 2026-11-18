# T16. Spec 駆動のデザイン受け渡し

[索引](../index.md) · [2026-10 のスナップショット](../monthly/2026-10.md)

- **ID**: T16
- **タグ**: #workflow #system
- **概要**: 画面の受け渡しから、Spec（PRD や受け渡しの文脈）をキャンバス上で作り、MCP 経由でコーディングエージェントへ送る形に変わりつつある。
- **特徴・適用方法**: Figma Specs で、ラフなアイデアから詳細な仕様を作り、MCP でエージェントへ送り、Code Layer で仕上げる。Guidelines（ライブラリの使い方の規約）を併用する。
  - 2026-10-15、Figma は Specs をオープンベータにした。Markdown をキャンバス上の共同編集にし、フレーム、FigJam、code layer を埋め、リンクをコーディングエージェントへ渡す。紹介記事は、有料プランと、末尾で全プラン、の両方の書き方がある。同日のリリースノートは全プランへのオープンベータと書く。プランの書き方は記事内で揃っていない。
  - 同じ日の MCP は、code layers の生成、Specs の編集、画像生成、公開済み Weave ワークフローを足した。パートナーは 20。2026-10-26 には、Weave の画像・動画モデル（Seedance、Kling、Nano Banana など）を外部エージェントから呼べるようになった。生成は Weave のクレジットを消費する。ワークフローの作成と編集は、Weave のヘルプ（2026-09-29）では MCP からまだできない。
  - Framer は 2026-10-22 に MCP を公開した。対象は Spec の受け渡しではなく、キャンバス、CMS、公開である。ヘルプは 2026-10-30 更新。開始時点でローカライズは未対応。デザインツールが MCP を出す動きは [T04](T04-design-in-code.md) とここへ分け、独立した ID にはしていない。
- **向く場面**: PM、デザイナー、エンジニアの協働、エージェントへの実装委任。
- **避ける場面**: 探索の初期段階。
- **代表例**: Figma Specs、Guidelines、Code Layer。社内事例として挙がっているのは Reddit の AI プロトタイプ環境（投稿の主張）です。
- **ソース**:
  - [X: @figma 2026-10-21](https://x.com/figma/status/2112669039009104059) L354 / V33,202 / RT29 / BM166（2026-11-01 10:07 JST）
  - [X: @figma 2026-10-15](https://x.com/figma/status/2110618179982749940) L981 / V7,224,974 / RT69 / BM174（2026-11-01 10:07 JST）
  - [X: Reddit 社内の AI プロトタイプ環境、2026-10-26（UTC）](https://x.com/clairevo/status/2114748638065049799) L63
  - [X: @framer、Framer MCP、2026-10-30](https://x.com/framer/status/2115830498173899095) L144 / V10,416 / RT16 / BM20（2026-11-01 10:07 JST）
  - [Figma Specs（2026-10-15）](https://www.figma.com/blog/introducing-figma-specs/)
  - [Figma「Build by design」（2026-10-15）](https://www.figma.com/blog/build-by-design/)
  - [Figma release notes（2026-10-15 の Specs と MCP、2026-10-26 の Weave モデル）](https://www.figma.com/release-notes/)
  - [Weave を外部エージェントから動かすヘルプ（2026-09-29）](https://help.weavy.ai/en/articles/16202764-running-weave-tools-and-models-from-external-agents-mcp)
  - [Framer MCP（2026-10-22）](https://www.framer.com/updates/framer-mcp)
  - [Framer MCP でできること（2026-10-30 更新）](https://www.framer.com/help/articles/what-you-can-do-with-framer-mcp/)
  - 2026-10-30 の [@figma](https://x.com/figma/status/2115894206409723946)（L296 / V92,620 / RT33 / BM315、2026-11-01 10:07 JST）は本文がリンクだけで、リリースノートの Weave と結び付けられるか未確認。項目の根拠にはしていない。
- **トレンド時期**: 2026-10〜
- **確度**: 中〜高。公式ドキュメント（Figma Specs、リリースノート、Framer MCP）は互いに矛盾しない。X は Figma の発表投稿が大きく、Framer 公式投稿は L144 と小さい。第三者の導入は Reddit の投稿（主張、L63）のまま。実務にどれだけ入ったかはまだ公式発表が中心なので、高にはしない。

- **状態**: rising

## 更新履歴

- 2026-10: 初収録。2026-10 からとあるので、状態は rising。確度は中。
- 2026-10（記録 2026-11-01）: 前の値（2026-10-31 12:45 JST 頃）は 10-21 の投稿 L353、10-15 の投稿 L981 / V7,224,396。いいねは 353 から 354、981 は同じ。Specs の公式記事、MCP のリリースノート、Framer MCP を確認して追加。公式が複数で一致し、X は片方が弱いので、確度を中から中〜高にした。状態は rising のまま。高にはしない。
