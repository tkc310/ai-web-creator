# T07. 「情報としてのモーション」と CSS ネイティブの動き

[索引](../index.md) · [2026-10 のスナップショット](../monthly/2026-10.md)

- **ID**: T07
- **タグ**: #motion #interaction
- **概要**: 装飾としてのスクロールアニメから、状態変化を伝える機能としてのモーションへ移っている。実装も JS ライブラリから CSS ネイティブへ寄っている。
- **特徴・適用方法**: scroll-driven animations（`animation-timeline`、`view-timeline`）、View Transitions（クロスドキュメントを含む）、anchor positioning はいずれも Interop 2026 の対象。アニメーションでは width、height、left ではなく transform を動かす（レイアウト計算を避けて、カクつきを防ぐ）。エージェントは CSS で書けるものまで JS で書きがちなので、明示的に指示する。配布側では、View Transitions の見本を「エージェントにコピーする」形で出す投稿が出ている。本文から確認できるのは、遷移のセットとエージェント向けコピーがあることまで。anchor positioning は、実装側で回避策が多い、という 10 月の作業報告がある。仕様が Interop の対象であることと、今日の実装が楽であることは別である。
- **向く場面**: カルーセル、ページ遷移、ローディング、操作のフィードバック。
- **避ける場面**: `prefers-reduced-motion` に対応していないとき。意味のない「ふわっと出る」演出。
- **代表例**: scroll-driven animations、View Transitions、anchor positioning（いずれも Interop 2026）。個別のプロダクト名はソースにありません。
- **ソース**:
  - [X: @jh3yy 2026-08-29、scroll-driven のカルーセル](https://x.com/jh3yy/status/2093465874321563782) L1,191 / V44,449
  - [X: @jakubkrehel 2026-10-23、transform の tip](https://x.com/jakubkrehel/status/2113292054151270727) L981 / V45,647 / RT20 / BM843（2026-11-01 10:07 JST）
  - [X: @jh3yy 2026-10-30、View Transitions](https://x.com/jh3yy/status/2115951140521332909) L918 / V28,453 / RT49 / BM779（2026-11-01 10:07 JST）。copy-paste / copy for agent と書いている。
  - [X: @diegohaz 2026-10-22](https://x.com/diegohaz/status/2113018164116144303) L105 / V6,011 / RT4 / BM63（2026-11-01 10:07 JST）。View Transitions のナビゲーション。anchor positioning は回避策が多く、font-weight の変化はレイアウトシフトを避ける、と書いている。
  - [X: @pulpxstyle 2026-10-15](https://x.com/pulpxstyle/status/2110659610659139819) L152 / V25,748 / RT3 / BM150（2026-11-01 10:07 JST）。モーションは見本で AI に渡す、という声。参照の集め方は [T05](T05-reference-driven.md)。
  - [X: @davidhaz 2026-10-15](https://x.com/davidhaz/status/2110662315959803905) L118 / V9,108 / RT4 / BM79（2026-11-01 10:07 JST）。アニメーション付き React コンポーネント集の更新告知（215 コンポーネント、という投稿の主張）。
  - [X: @bug_d3v 2026-09-29](https://x.com/bug_d3v/status/2104862326859985005) L8
  - [Interop 2026](https://web.dev/blog/interop-2026)
  - [Kairo の 2026 トレンドレポート（Trend 3: Motion as Information）](https://www.kairocreations.com/kairo-tools/articles/2026-web-design-trends-report)
- **トレンド時期**: 2026 通年
- **確度**: 高

- **状態**: steady

## 更新履歴

- 2026-10: 初収録。2026 通年とあるので、状態は steady。確度は高。
- 2026-10（記録 2026-11-01）: 前の値（2026-10-31 12:45 JST 頃）は @jakubkrehel L983 / V45,551。いいねは 983 から 981。View Transitions の見本と、anchor positioning の実装負担を追加。急増とは書けないので状態は steady のまま、確度は高のまま。
