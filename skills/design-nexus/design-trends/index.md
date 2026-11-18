# 索引

全月の一覧です。直近月の要約は [latest.md](latest.md)、集め方は [COLLECTING.md](COLLECTING.md) です。次の空き ID は **T19** です。

初出は、この DB に項目を立てた月です。時期は、本文の「トレンド時期」を索引用に短くしたものです。状態の意味は [README.md](README.md) にあります。

## タグ索引

| タグ | 意味 | ID |
|---|---|---|
| `#workflow` | 制作プロセス | [T02](trends/T02-design-md.md) [T03](trends/T03-vibe-design.md) [T04](trends/T04-design-in-code.md) [T05](trends/T05-reference-driven.md) [T16](trends/T16-spec-handoff.md) |
| `#visual` | 見た目のスタイル | [T01](trends/T01-anti-ai-slop.md) [T08](trends/T08-exploded-view.md) [T09](trends/T09-dither-ascii-shader.md) [T10](trends/T10-liquid-glass.md) [T11](trends/T11-light-mode.md) [T13](trends/T13-immersive-3d.md) [T18](trends/T18-vivid-retro.md) |
| `#motion` | 動き | [T06](trends/T06-agent-motion.md) [T07](trends/T07-motion-as-information.md) |
| `#typography` | 文字 | [T12](trends/T12-editorial-type.md) |
| `#layout` | 配置 | [T12](trends/T12-editorial-type.md) [T17](trends/T17-bento-grid.md) |
| `#color` | 色 | [T11](trends/T11-light-mode.md) [T18](trends/T18-vivid-retro.md) |
| `#interaction` | 操作とフィードバック | [T07](trends/T07-motion-as-information.md) [T13](trends/T13-immersive-3d.md) [T14](trends/T14-agent-ux.md) [T15](trends/T15-generative-ui.md) |
| `#ai-agent` | エージェントと一緒に作るときに関係する | [T01](trends/T01-anti-ai-slop.md) [T02](trends/T02-design-md.md) [T03](trends/T03-vibe-design.md) [T05](trends/T05-reference-driven.md) [T06](trends/T06-agent-motion.md) [T08](trends/T08-exploded-view.md) [T14](trends/T14-agent-ux.md) [T15](trends/T15-generative-ui.md) |
| `#system` | デザインシステム | [T02](trends/T02-design-md.md) [T16](trends/T16-spec-handoff.md) |
| `#anti-pattern` | 避けたいもの | [T01](trends/T01-anti-ai-slop.md) |
| `#mature` | 定番化・沈静化している | [T17](trends/T17-bento-grid.md) |

## ID 索引

| ID | 名前 | タグ | 時期 | 確度 | 状態 | 初出 | 最終更新 |
|---|---|---|---|---|---|---|---|
| [T01](trends/T01-anti-ai-slop.md) | アンチ AI スロップ／"taste" | #anti-pattern #ai-agent #visual | 2026-08〜（10 月がピーク） | 高 | rising | 2026-10 | 2026-10 |
| [T02](trends/T02-design-md.md) | DESIGN.md／エージェントが読めるデザインシステム | #system #ai-agent #workflow | 2026-04 仕様公開、8〜10 月に普及 | 高 | rising | 2026-10 | 2026-10 |
| [T03](trends/T03-vibe-design.md) | Vibe design（プロンプト駆動デザイン） | #workflow #ai-agent | 2026-08〜 | 中〜高 | steady | 2026-10 | 2026-10 |
| [T04](trends/T04-design-in-code.md) | Design in code／デザインエンジニアリング | #workflow | 継続中（2026 下期に Code Layers が登場） | 高 | rising | 2026-10 | 2026-10 |
| [T05](trends/T05-reference-driven.md) | リファレンス駆動デザイン | #workflow #ai-agent | 2026-08〜 | 中〜高 | steady | 2026-10 | 2026-10 |
| [T06](trends/T06-agent-motion.md) | エージェントによるモーションデザイン（HTML→動画） | #motion #ai-agent | 2026-10 上旬に急拡散 | 高 | rising | 2026-10 | 2026-10 |
| [T07](trends/T07-motion-as-information.md) | 「情報としてのモーション」と CSS ネイティブの動き | #motion #interaction | 2026 通年（Interop 2026） | 高 | steady | 2026-10 | 2026-10 |
| [T08](trends/T08-exploded-view.md) | 技術イラスト／分解図・アイソメトリック | #visual #ai-agent | 2026-10 中旬〜 | 高 | rising | 2026-10 | 2026-10 |
| [T09](trends/T09-dither-ascii-shader.md) | ディザ／ASCII／シェーダーのテクスチャ | #visual | 2026-08〜10 | 中 | steady | 2026-10 | 2026-10 |
| [T10](trends/T10-liquid-glass.md) | Liquid Glass／グラスモーフィズム | #visual | 2025-06 発表、2026 年に各 OS へ波及 | 高 | steady | 2026-10 | 2026-10 |
| [T11](trends/T11-light-mode.md) | ライトモード回帰 | #color #visual | 2025〜2026 | 中 | steady | 2026-10 | 2026-10 |
| [T12](trends/T12-editorial-type.md) | エディトリアルな密度と、差別化手段としてのタイポグラフィ | #typography #layout | 2025〜2026 | 中 | steady | 2026-10 | 2026-10 |
| [T13](trends/T13-immersive-3d.md) | 3D／WebGL の没入型サイト | #visual #interaction | 2026 通年 | 中〜高 | steady | 2026-10 | 2026-10 |
| [T14](trends/T14-agent-ux.md) | エージェント UX パターン（意図プレビュー・承認ゲート） | #interaction #ai-agent | 2026 下期 | 高 | rising | 2026-10 | 2026-10 |
| [T15](trends/T15-generative-ui.md) | Generative UI | #interaction #ai-agent | 2026 下期 | 中 | rising | 2026-10 | 2026-10 |
| [T16](trends/T16-spec-handoff.md) | Spec 駆動のデザイン受け渡し | #workflow #system | 2026-10〜 | 中〜高 | rising | 2026-10 | 2026-10 |
| [T17](trends/T17-bento-grid.md) | Bento grid | #layout #mature | 2023〜（定番化） | 中 | mature | 2026-10 | 2026-10 |
| [T18](trends/T18-vivid-retro.md) | ビビッド配色、レトロ・Y2K・レトロフューチャー | #color #visual | 2026（レポート上） | 低〜中 | steady | 2026-10 | 2026-10 |
