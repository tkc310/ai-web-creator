# T03. Vibe design（プロンプト駆動デザイン）

[索引](../index.md) · [2026-10 のスナップショット](../monthly/2026-10.md)

- **ID**: T03
- **タグ**: #workflow #ai-agent
- **概要**: vibe coding のデザイン版。自然言語でエージェントに画面を作らせ、対話しながら詰めていく。
- **特徴・適用方法**: 典型的な流れは次のとおりです。Refero などでパターンを調べる。Paper、Stitch、Figma agent、Claude Design などでモックを作る。スキル（Impeccable など）で磨く。コーディングエージェントで実装する。「eyebrow」のように、vibe design を通じて広まった語彙もあります。2026-10-15 に Figma agent は一般提供になり、キャンバスに組み込まれた、と Figma が書いている。
  - 時短は一様ではない。Figma 社員による Figma Make のランダム化比較試験がある。査読前プレプリント（[arXiv:2609.26725](https://arxiv.org/abs/2609.26725)、2026-09-22）では、完了者について全体で約 20% 短い。プロダクトマネージャーは層別推定で累計 35%（22 分 46 秒、Task 3 が主）、交互作用モデルでは 33%（21 分 58 秒）短い。デザイナーは Task 3（インタラクション）だけ 26% 短く、累計は p=0.049 の 17% で、考察は累計の有意な短縮を認めていない。公式ブログ（2026-08-11）は PM を累計 23%、作業の容易さを 37% 改善とし、PM の有意差は易しい課題側にあり難しい課題には無い、と書いている。23% はプレプリントの 35% とも 33% とも一致しない。ブログと論文で「どの課題が PM を速くしたか」も食い違う。時間は完了した課題だけ。品質は自己評価で、専門家評価はない。著者は全員 Figma。この数字で確度は上げない。
  - NN/g（2026-10-23 公開。調査は 2026-08-24〜09-11、有効 521）では、AI で作業は短いという自己報告が広く、感情は 5 点中 3.57。障壁の最多は出力品質 54%。
  - Designer Fund と Foundation Capital の AI in Design 2026 は、デザイナーの 91% がデザイン作業で少なくとも週次、75% が毎日 AI を使う、とする（2025 年の週次は 54%）。調査は 2026 年第 1 四半期で、10 月の変化ではない。配布経路の都合で AI を使う人に寄る、と報告書自身が書いている。
- **向く場面**: 個人開発や小規模チームでの探索、短期間の LP 制作、方向案を素早く量産したいとき。
- **避ける場面**: 確立したデザインシステムがあるプロダクト（Figma とシステム準拠のほうが強い）。「考えること」まで委ねてしまうリスクがある場合。
- **代表例**: Paper MCP、Google Stitch（MCP と CLI）、Claude Design（2026-04-17 公開）、Open Design（★105,063、2026-10-31 12:45 JST 頃）
- **ソース**:
  - [X: @robj3d3 2026-08-11](https://x.com/robj3d3/status/2086883206301925800) L1,750 / V204,368 / BM4,093
  - [X: @sanketnadhani 2026-10-29](https://x.com/sanketnadhani/status/2115497477189337236) L5
  - [X: Figma、Pen、Paper の比較、2026-10-26](https://x.com/daniildesigns/status/2114718514581786764) L41 / V3,003 / RT1 / BM29（2026-11-01 10:07 JST）
  - [X: @thedennisobaro1 2026-10-02](https://x.com/thedennisobaro1/status/2105946503353106851) L248 / V17,434 / RT28 / BM656（2026-11-01 10:07 JST）。Claude Design が凡庸になるのはセットアップ不足、というスレッドの冒頭。具体手順は本文に無い。
  - [X: @xDinoDeer 2026-10-26](https://x.com/xDinoDeer/status/2114391423105765410) L262 / V62,475 / RT15 / BM246（2026-11-01 10:07 JST）。中国語。Claude Design が他の vibe design より上、という個人の感想。比較の根拠は無い。確度は上げない。
  - [X: Claude Design と Figma MCP の違い、2026-09-23](https://x.com/dotey/status/2102509523684479377) L20 / V11,709
  - [Claude Design の報道（2026-04-17）](https://www.macrumors.com/2026/04/17/anthropic-claude-design/)
  - [Figma Make の時短（公式ブログ、2026-08-11）](https://www.figma.com/blog/measuring-time-savings-from-figma-make/)
  - [同じ試験のプレプリント（2026-09-22）](https://arxiv.org/abs/2609.26725)
  - [NN/g「AI in UX」2026-10-23](https://www.nngroup.com/articles/ai-in-ux-survey-26/)
  - [AI in Design 2026、ツールの章（調査は 2026 Q1）](https://stateofaidesign.com/chapters/tools)
  - [同レポートの標本についての留保](https://stateofaidesign.com/about)
  - [Figma agent の一般提供を含む 2026-10-15 の発表](https://www.figma.com/blog/build-by-design/)
- **トレンド時期**: 2026-08〜（継続中）
- **確度**: 中〜高。「vibe design」という語自体の投稿は反応が小さめです。ワークフロー投稿のほうがよく伸びています。

- **状態**: steady

## 更新履歴

- 2026-10: 初収録。継続中で、語自体の反応は小さめとあるので、状態は steady。確度は中〜高。
- 2026-10（記録 2026-11-01）: @daniildesigns の前の値は 2026-10-31 12:45 JST 頃の L41。いいねは同じ。Claude Design の使い方投稿は手順が本文に無く、比較投稿は感想。Figma Make の試験は 8 月のブログと 9 月のプレプリントで数字の切り方が違い、10 月の新規普及とは扱わない。NN/g は出力品質を最大の障壁とする。状態は steady のまま、確度は中〜高のまま。
