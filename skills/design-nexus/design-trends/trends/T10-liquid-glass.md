# T10. Liquid Glass／グラスモーフィズム

[索引](../index.md) · [2026-10 のスナップショット](../monthly/2026-10.md)

- **ID**: T10
- **タグ**: #visual
- **概要**: Apple が WWDC 2025 で発表した、半透明で光を屈折させる素材表現。2026 年には Android 系の各 OS にも「Liquid Glass 風」として広がった。
- **特徴・適用方法**: 半透明、ぼかし、光沢のある縁、動的なハイライト。背景のコントラストを確保して可読性を保つ。2026-10 の X では、他社の iOS アプリへ広がる一方、Material と混ざってアプリ間で揃っていない、という指摘がある。指摘は投稿の観察で、画面は再確認していない。代理店ブログは「Anti-glass」を 2026 年のトレンドとして書き、根拠に Linear を使う。Linear 自身の記事は 2025-10-21 で、屈折を再現しなかった理由は、第三者からピクセルデータが取れないことに加え、密な業務 UI では読みにくくなるから、というもの。2026-10 に公式の撤回が出たわけではない。押し戻しを新しい山にはしない。
- **向く場面**: iOS ネイティブのアプリ、OS 風のオーバーレイ、ウィジェット。
- **避ける場面**: 情報が密な Web の業務 UI、アクセシビリティ（コントラスト）要件が厳しい画面。AI スロップの「3 つのグラスボタン」のような安易な使い方。
- **代表例**: Apple の Liquid Glass（WWDC 2025）。2026 年の Android 系 OS への「Liquid Glass 風」。2026-10 の投稿が名指しするのは Google Photos と Gmail の iOS ナビ（混在の指摘。画面は未確認）。屈折を外した例として Linear が 2025-10-21 に書いている。
- **ソース**:
  - [X: @Vaibhav51552614 2026-08-11](https://x.com/Vaibhav51552614/status/2087184870816788963) L606 / V60,397
  - [X: UI kit、2026-10-27（UTC）](https://x.com/HorizonxSo/status/2115071025964568941) L87
  - [X: 解説、2026-09-13（UTC）](https://x.com/BabuBahlerao/status/2099000909279985750) L9
  - [X: @app_settings 2026-10-30](https://x.com/app_settings/status/2115908147818938475) L373 / V18,267 / RT9 / BM22（2026-11-01 10:07 JST）。Google Photos と Gmail の iOS ナビが Material と Liquid Glass を混ぜ、両者で揃っていない、という指摘。画面は未確認。
  - [X: @basit_designs 2026-10-11](https://x.com/basit_designs/status/2109288607655829623) L312 / V9,908 / RT12 / BM221（2026-11-01 10:07 JST）。グラデーション素材と liquid glass シェーダー。
  - [Linear 自身の記事（2025-10-21）](https://linear.app/now/linear-liquid-glass)
  - [ideapeel 2026-10-23](https://www.ideapeel.com/blogs/ui-ux-design-trends-2026-15-changes-shaping-saas)。代理店ブログ。Anti-glass の節は Linear の 2025 年記事に依存する。
  - [Tubik「7 UI Design Trends of 2026」](https://tubikstudio.com/blog/ui-design-trends-2026/)。スタジオのブログ。本文は 2026-11-01 に取得できず（403）、検索結果の抜粋で節の存在を確認した。確度は上げない。
- **トレンド時期**: 2025-06 に発表され、2026 年に各 OS へ波及（Web ではすでに定番化しつつある）。
- **確度**: 高

- **状態**: steady

## 更新履歴

- 2026-10: 初収録。Web では定番化しつつあり、各 OS へは 2026 年に波及とある。定番済みの T17 とは分け、状態は steady。確度は高。
- 2026-10（記録 2026-11-01）: 他社アプリへの波及と不統一の指摘、シェーダーの作例を追加。Anti-glass を書く代理店ブログの根拠は 2025-10-21 の Linear 記事で、10 月の新しい撤回ではない。X の Sports Dock 投稿（L97）は反応が小さいのでソースに入れていない。状態は steady のまま、確度は高のまま。fading にはしない。
