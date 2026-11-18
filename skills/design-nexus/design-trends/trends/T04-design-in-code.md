# T04. Design in code／デザインエンジニアリング

[索引](../index.md) · [2026-10 のスナップショット](../monthly/2026-10.md)

- **ID**: T04
- **タグ**: #workflow
- **概要**: デザイナーがコードを素材として直接扱う働き方。Figma の Code Layers（2026-10-15 にオープンベータ）で、キャンバス上にもコードが載るようになった。
- **特徴・適用方法**:
  - アイデアを言葉で説明し、Figma に移して調整し、Claude に戻して実装する。動きをつけて公開する。
  - デザイナーの開発参加は 41% に倍増し、開発者のデザイン参加は 44% から 60% に増えた（Figma 2026 AI report）。
  - 反論として「Design engineering is a trap」があります。エージェントに思考まで委ねがちになるので、Paper や Figma で先に考えてからコードに行くべきだ、という意見です。
  - 2026-10 は、デザインツールがエージェントから触れる面を公式に広げた月でもある。Figma は 2026-10-15 に Code Layers を全プランでオープンベータにし、MCP から code layers、Specs、画像、公開済み Weave ワークフローを扱えるようにした。パートナーは 20。2026-10-26 には Weave の画像・動画モデル（Seedance、Kling、Nano Banana など）を外部エージェントから呼べるようにした。生成は Weave のクレジットを消費する。
  - Framer は 2026-10-22 に MCP を公開した。エージェントはキャンバスの編集、CMS、公開ができる。ヘルプ（2026-10-30 更新）では、ページ作成、ブレークポイントをまたぐ編集、ブランチ、SEO の確認まで書いている。開始時点でローカライズは未対応。エディタを開いたままでなくても動く。受け渡しの Spec 側は [T16](T16-spec-handoff.md)。独立した ID にはしていない。
- **向く場面**: インタラクションが重要な UI、デザインシステムのコンポーネント制作、小さなチーム。
- **避ける場面**: 大規模な情報設計やブランド探索など、手を動かす前に考えることが要るとき。
- **代表例**: Figma Code Layers と Figma Make、Mode（@modeinspect）、onlook
- **ソース**:
  - [X: @adriankuleszo 2026-10-28](https://x.com/adriankuleszo/status/2115194369909445069) L339 / V17,373 / RT5 / BM216（2026-11-01 10:07 JST）
  - [X: @MichaelFilipiuk 2026-09-25、反論](https://x.com/MichaelFilipiuk/status/2103480474832166978) L352 / V19,436
  - [X: @figma、Code Layers、2026-10-23](https://x.com/figma/status/2113330876407054503) L335 / V30,272 / RT27 / BM157（2026-11-01 10:07 JST）
  - [X: @framer、Framer MCP、2026-10-30](https://x.com/framer/status/2115830498173899095) L144 / V10,416 / RT16 / BM20（2026-11-01 10:07 JST）。公式告知。同日に移行用途の投稿がある、と入力ファイルは書くが、その URL は渡されていない。
  - [X: Senior Product Design Engineer の採用、2026-09-23（UTC）](https://x.com/uixmat/status/2102696698258559200) L218
  - [Figma 2026 AI report](https://www.figma.com/blog/2026-ai-report/)
  - [Figma Config 2026](https://quartr.com/events/figma-fig-config-2026_FV2VF7Z3)
  - [Figma「Build by design」2026-10-15](https://www.figma.com/blog/build-by-design/)
  - [Figma release notes（2026-10-15、2026-10-26）](https://www.figma.com/release-notes/)
  - [Framer MCP（2026-10-22）](https://www.framer.com/updates/framer-mcp)
  - [Framer MCP でできること（2026-10-30 更新）](https://www.framer.com/help/articles/what-you-can-do-with-framer-mcp/)
- **トレンド時期**: 継続中。2026-06 の Config から 2026-10 の Config India で加速。
- **確度**: 高

- **状態**: rising

## 更新履歴

- 2026-10: 初収録。2026 下期の Code Layers で加速とあるので、状態は rising。確度は高。
- 2026-10（記録 2026-11-01）: 前の値（2026-10-31 12:45 JST 頃）は @adriankuleszo L338 / V17,160、Code Layers の投稿は L335（表示は当時未記録）。動きは小さい。Code Layers のオープンベータ、Weave モデルの MCP、Framer MCP を公式ページで確認して追加。デザインツールの MCP 化は T16 と分けて書き、新しい ID にはしていない。状態は rising のまま、確度は高のまま。
