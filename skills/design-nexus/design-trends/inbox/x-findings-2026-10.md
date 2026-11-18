# X findings 2026-10

- 収集者: Takashi's Grok Bot assistant
- 収集日時: 2026-11-01 10:10 JST（反応数はすべて 2026-11-01 10:05〜10:10 JST 頃のスナップショット）
- 検索の範囲: 2026-10-01 〜 2026-10-31（JST）。公開投稿のフルアーカイブ検索（start 2026-09-30T15:00Z / end 2026-10-31T15:00Z）、relevancy 順、各 25 件。`-is:retweet`、一部 `-is:reply` / `has:media` / `lang:ja`。
- 注意: X の検索 API には反応数フィルタが無く、`min_faves` はクエリから外されました（API の応答で明示）。そのため上位はクエリの relevancy 順で取り、いいねで並べ直しています。10 月分は前回（2026-10-31 12:45 JST）の DB 作成時にすでに各項目へ展開済みなので、本ファイルは (a) 既存ソースの取り直した数値、(b) 前回の DB に無い 10 月の投稿、の 2 本立てです。10-31 のスナップショット値を新しい月の数値として扱わないでください。
- 使ったクエリ（英語）: "UI design"/"web design"/"design trend"、"design system"/"DESIGN.md"/"design tokens"、"AI design"/"vibe design"/"Figma MCP"/"Claude Design"/"AI slop"、animation/motion/"scroll-driven"/"view transitions"、typography/typeface/font/"color palette"、"liquid glass"/glassmorphism/dither/ASCII/shader/isometric/"exploded view"/"light mode"/bento/WebGL、"Claude Design"/"frontend design"/"design skill"/taste、"generative UI"/"agent UX"/"agentic UX"、from:figma/framer/shadcn/jh3yy/jakubkrehel/emilkowalski、"web design"/"landing page"/"UI inspiration" has:media
- 使ったクエリ（日本語）: UIデザイン/Webデザイン/デザインシステム/デザイントレンド、AIデザイン/Figma/モーションデザイン/フォント、デザイン AI/Claude Design/バイブデザイン/DESIGN.md、配色/タイポグラフィ/アニメーション/モーション × UI/Web/サイト

## 投稿（前回の DB に無い 10 月の投稿）

- URL: https://x.com/jh3yy/status/2115951140521332909
- 投稿日時: 2026-10-30 08:37 JST
- 著者: @jh3yy
- いいね: 918
- 表示: 28453
- リポスト: 49
- ブックマーク: 779
- メモ: CSS View Transitions のページ遷移集を公開し、「copy-paste / copy for agent」と書いている。投稿は「エージェントに渡せる形で配る」と主張。本文から確認できるのは、View Transitions 製の遷移セットであることとエージェント向けコピーがあることまで。
- 関連: T07

- URL: https://x.com/diegohaz/status/2113018164116144303
- 投稿日時: 2026-10-22 06:22 JST
- 著者: @diegohaz
- いいね: 105
- 表示: 6011
- リポスト: 4
- ブックマーク: 63
- メモ: CSS/React の View Transitions でナビゲーション UI を作った例。anchor positioning のアニメーションは回避策が多く大変だったと書いている。font-weight の変化でレイアウトシフトが出ないことにも言及。
- 関連: T07

- URL: https://x.com/okapi_fukugyo/status/2112175372171379170
- 投稿日時: 2026-10-19 22:33 JST
- 著者: @okapi_fukugyo
- いいね: 208
- 表示: 17014
- リポスト: 27
- ブックマーク: 281
- メモ: 「AI に作らせたサイトが同じデザインになるのはお手本を渡していないから」とし、実在プロダクト 2,000 件以上を DESIGN.md 形式でまとめたサイトを紹介（配色、フォントと文字サイズ等）。件数はリンク先の主張で未確認。日本語圏で DESIGN.md＋リファレンス駆動が広がっている根拠。
- 関連: T02, T05

- URL: https://x.com/emalorenzo/status/2106491428851560524
- 投稿日時: 2026-10-04 06:07 JST
- 著者: @emalorenzo
- いいね: 153
- 表示: 6162
- リポスト: 7
- ブックマーク: 95
- メモ: スペイン語。Pinterest で参照集め → AI に design system を作らせる → design.md → agents.md から design.md を読ませる、という手順を半ば冗談で列挙。DESIGN.md の流れが英語圏外にも出ている例。
- 関連: T02, T05

- URL: https://x.com/yutafuru/status/2105966083576369641
- 投稿日時: 2026-10-02 19:20 JST
- 著者: @yutafuru
- いいね: 147
- 表示: 13586
- リポスト: 8
- ブックマーク: 154
- メモ: カナリーのデザインシステム「NestUI」の参照設計を GitHub 公開し、「デザイナーの思考フローを AI に渡す」と紹介。日本企業のエージェント向けデザインシステム公開事例。内容はリンク先未確認。
- 関連: T02

- URL: https://x.com/rwspatin/status/2106437552844444129
- 投稿日時: 2026-10-04 02:33 JST
- 著者: @rwspatin
- いいね: 53
- 表示: 79360
- リポスト: 3
- ブックマーク: 43
- メモ: 「AI 製フロントエンドは紫グラデーション、Inter、角丸カード、絵文字アイコンで全部同じに見える」とし、Anthropic の frontend-design スキルで作り impeccable で批評する構成を紹介。いいねは小さいが表示は大きい。
- 関連: T01

- URL: https://x.com/codex_lab_/status/2114738908424741148
- 投稿日時: 2026-10-27 00:20 JST
- 著者: @codex_lab_
- いいね: 1030
- 表示: 63531
- リポスト: 55
- ブックマーク: 1071
- メモ: 「AI 特有の量産型デザインから脱却」として Web デザインスキル「MotionSites」の無料公開を告知（Claude 向け）。投稿は告知と主張のみで、スキルの中身は未確認。日本語圏でアンチ AI スロップ×モーション付きスキルが反応を得ている。
- 関連: T01, T06

- URL: https://x.com/thedennisobaro1/status/2105946503353106851
- 投稿日時: 2026-10-02 18:02 JST
- 著者: @thedennisobaro1
- いいね: 248
- 表示: 17434
- リポスト: 28
- ブックマーク: 656
- メモ: 「Claude Design で凡庸な結果になるのはセットアップ不足」という使い方解説スレッドの冒頭。具体手順は本文に無い（画像・続き側）。
- 関連: T03, T01

- URL: https://x.com/xDinoDeer/status/2114391423105765410
- 投稿日時: 2026-10-26 01:19 JST
- 著者: @xDinoDeer
- いいね: 262
- 表示: 62475
- リポスト: 15
- ブックマーク: 246
- メモ: 中国語。Claude Design の出力は他の vibe design エージェントより大きく上だと主張する個人の感想。比較の根拠は示されていない。
- 関連: T03

- URL: https://x.com/viktoroddy/status/2115968466838859853
- 投稿日時: 2026-10-30 09:46 JST
- 著者: @viktoroddy
- いいね: 1646
- 表示: 87534
- リポスト: 227
- ブックマーク: 2557
- メモ: 「無料の AI デザインリソース 7 選」。1 番目は「800+ のサイト用プロンプト、1000+ の背景、モーションセクション。Claude に貼って出荷」。同文の投稿が @rosemoni18（L646）、@abir35627（L273）にもあり、テンプレ化した宣伝の可能性が高い。とはいえ「AI に貼るプロンプト／セクション素材集」が 10 月に最も保存された型の一つ。
- 関連: 新規候補（AI 向けプロンプト・セクション素材パック）。T05 への統合も検討

- URL: https://x.com/himanshubuildss/status/2105902592886968702
- 投稿日時: 2026-10-02 15:07 JST
- 著者: @himanshubuildss
- いいね: 781
- 表示: 48959
- リポスト: 111
- ブックマーク: 1564
- メモ: 「vibe coding リソース 25 選」で 1 番目は自作の「200+ ビルドプロンプト」。同著者が 10-07（L37）、10-08（L114, BM190）、10-10（L252, BM709）にも同型の投稿。自己宣伝を含む。上と同じ型。
- 関連: 新規候補（AI 向けプロンプト・セクション素材パック）、T05

- URL: https://x.com/neropursue/status/2113256970916368802
- 投稿日時: 2026-10-22 22:11 JST
- 著者: @neropursue
- いいね: 631
- 表示: 26487
- リポスト: 89
- ブックマーク: 834
- メモ: デザインのインスピレーション源 9 選（日々の参照、LP、背景、アプリ UI など）。同著者 10-22 15:31（L414, BM623、「AI-ready UI components」「Agent skills for design and code」）、10-23（L396, BM562）も同型。
- 関連: T05、新規候補（AI 向けプロンプト・セクション素材パック）

- URL: https://x.com/davidhaz/status/2110662315959803905
- 投稿日時: 2026-10-15 18:21 JST
- 著者: @davidhaz
- いいね: 118
- 表示: 9108
- リポスト: 4
- ブックマーク: 79
- メモ: アニメーション付き React コンポーネント集の 2.0 更新（215 コンポーネント、クリックに反応する 60+ など）。アニメ付きコンポーネント集の供給が続いている例。
- 関連: T07, 新規候補（AI 向けプロンプト・セクション素材パック）

- URL: https://x.com/pulpxstyle/status/2110659610659139819
- 投稿日時: 2026-10-15 18:10 JST
- 著者: @pulpxstyle
- いいね: 152
- 表示: 25748
- リポスト: 3
- ブックマーク: 150
- メモ: 「AI と制作するとき、モーションは言葉では伝わりにくいので動きの見本サイトを使う」。モーションの参照を視覚で AI に渡すという実務の声。
- 関連: T05, T07

- URL: https://x.com/claudecode84/status/2108753917894922473
- 投稿日時: 2026-10-10 11:58 JST
- 著者: @claudecode84
- いいね: 158
- 表示: 19150
- リポスト: 10
- ブックマーク: 274
- メモ: 「Claude でモーション動画を作るための GitHub リポジトリ 20 選」の紹介。「Netflix のエンジニアが紹介した」は投稿の主張で未確認。
- 関連: T06

- URL: https://x.com/app_settings/status/2115908147818938475
- 投稿日時: 2026-10-30 05:46 JST
- 著者: @app_settings
- いいね: 373
- 表示: 18267
- リポスト: 9
- ブックマーク: 22
- メモ: Google Photos と Gmail の iOS アプリが Material と Liquid Glass を混ぜたナビバーになっていて、しかも両者で一貫していないと指摘。Liquid Glass が他社アプリへ波及している一方、混在による不統一への批判。
- 関連: T10

- URL: https://x.com/basit_designs/status/2109288607655829623
- 投稿日時: 2026-10-11 23:22 JST
- 著者: @basit_designs
- いいね: 312
- 表示: 9908
- リポスト: 12
- ブックマーク: 221
- メモ: グラデーション素材と liquid glass シェーダーの組み合わせ例。
- 関連: T10, T09

- URL: https://x.com/oneuios/status/2113791388747710769
- 投稿日時: 2026-10-24 09:35 JST
- 著者: @oneuios
- いいね: 97
- 表示: 4370
- リポスト: 8
- ブックマーク: 7
- メモ: X アプリの Sports Dock が Liquid Glass 風になったという投稿。反応は小さい。
- 関連: T10
- 見送り: 反応が小さい。補強程度

- URL: https://x.com/framer/status/2115830498173899095
- 投稿日時: 2026-10-30 00:37 JST
- 著者: @framer
- いいね: 144
- 表示: 10416
- リポスト: 16
- ブックマーク: 20
- メモ: Framer MCP で AI エージェントからサイト修正を出せる、という公式告知。同日 03:05 JST に移行用途の投稿（L102, V10892）もある。公式の Framer MCP 発表は Web 側で 2026-10-22 付（https://www.framer.com/updates/framer-mcp）。
- 関連: T04, T16（デザインツールの MCP 化）

- URL: https://x.com/figma/status/2115894206409723946
- 投稿日時: 2026-10-30 04:51 JST
- 著者: @figma
- いいね: 296
- 表示: 92620
- リポスト: 33
- ブックマーク: 315
- メモ: 本文はリンクのみで内容は投稿から確認できない。時期的に 10-26 の Weave モデルの MCP 経由利用（Figma release notes）関連の可能性はあるが未確認。
- 関連: T16
- 見送り: 本文がリンクだけ

- URL: https://x.com/Voxyz_ai/status/2116183356496830536
- 投稿日時: 2026-10-31 00:00 JST
- 著者: @Voxyz_ai
- いいね: 177
- 表示: 11075
- リポスト: 7
- ブックマーク: 233
- メモ: UI/UX スキルを README の書き直しにも使えるというプロンプト共有。デザインスキルの適用範囲がドキュメントにも広がっている例。根拠としては弱い。
- 関連: T01

- URL: https://x.com/shadcn/status/2115680563096940720
- 投稿日時: 2026-10-29 14:42 JST
- 著者: @shadcn
- いいね: 1252
- 表示: 58559
- リポスト: 74
- ブックマーク: 78
- メモ: 「the human behind the code is the moat. you are the moat.」。taste / 人の判断を差別化の源とする文脈で読めるが、デザインについての直接の言及ではない。
- 関連: T01
- 見送り: デザインの手法としての根拠にはならない。雰囲気の補強のみ

## 既存ソースの数値を取り直したもの（10 月投稿、2026-11-01 10:07 JST 頃）

前回値は 2026-10-31 12:45 JST 頃のスナップショット。どれも 1 日で大きくは動いておらず、状態変更の根拠にはしない。

- https://x.com/shadcn/status/2108574564586332615（T02）: L4,112 / V242,228 / RT187 / BM4,570
- https://x.com/RoundtableSpace/status/2113106821091143750（T02）: L248 / V51,201 / RT27 / BM317
- https://x.com/adriankuleszo/status/2115194369909445069（T04）: L339 / V17,373 / RT5 / BM216
- https://x.com/figma/status/2113330876407054503（T04 Code Layers）: L335 / V30,272 / RT27 / BM157
- https://x.com/inspiredDZN/status/2111868813507473437（T05）: L180 / V6,086 / RT8 / BM77
- https://x.com/N01ennn/status/2108182955671580771（T06）: L6,004 / V511,545 / RT664 / BM14,262
- https://x.com/Voxyz_ai/status/2108905392776360333（T06）: L533 / V156,394 / RT50 / BM1,495
- https://x.com/figma/status/2105329949548912914（T06）: L915 / V1,533,749 / RT77 / BM340
- https://x.com/jakubkrehel/status/2113292054151270727（T07）: L981 / V45,647 / RT20 / BM843
- https://x.com/jakubkrehel/status/2114379959263502712（T08）: L6,081 / V239,542 / RT282 / BM7,061
- https://x.com/RoundtableSpace/status/2111234483139510507（T08）: L493 / V72,622 / RT64 / BM824
- https://x.com/AskPerplexity/status/2115828571742875737（T08）: L58 / V21,163 / RT4 / BM26
- https://x.com/kail_designs/status/2108135428767596922（T09）: L55 / V3,566 / RT4 / BM90
- https://x.com/jakubkrehel/status/2114737256044871707（T11）: L202 / V14,495 / RT0 / BM13
- https://x.com/figma/status/2112669039009104059（T16）: L354 / V33,202 / RT29 / BM166
- https://x.com/figma/status/2110618179982749940（T16）: L981 / V7,224,974 / RT69 / BM174
- https://x.com/trending_repos/status/2115052997134741743（T01 Hallmark）: L338 / V28,170 / RT31 / BM508
- https://x.com/AskPerplexity/status/2113654262052098312（T05）: L106 / V35,708 / RT5 / BM72
- https://x.com/daniildesigns/status/2114718514581786764（T03）: L41 / V3,003 / RT1 / BM29
- https://x.com/ataiiam/status/2106731156691615978（T15）: L171 / V12,895 / RT15 / BM158

## X 以外で確認した参考（クラウドエージェント側で一次資料を再確認すること）

- Figma「Build by design」2026-10-15（Config India 2026）: Figma agent GA、MCP で code layers / Specs / 画像生成 / Weave、20 の MCP パートナー。https://www.figma.com/blog/build-by-design/
- Figma Specs（Markdown as a medium）2026-10-15: https://www.figma.com/blog/introducing-figma-specs/ （T16 の補強）
- Figma release notes 2026-10-26: Weave の画像・動画モデルを Figma MCP から利用可能。https://www.figma.com/release-notes/
- Framer MCP 2026-10-22: https://www.framer.com/updates/framer-mcp 、使い方 https://www.framer.com/help/articles/what-you-can-do-with-framer-mcp/ （T04/T16 か、新規「デザインツールの MCP 化」）
- NN/g「AI in UX」調査 2026-10-23（521 人）: 出力品質 54%、プライバシー 50% が障壁。https://www.nngroup.com/articles/ai-in-ux-survey-26/ （T01/T03 の留保）
- Breon.ai Research 2026-10 版: Figma Make の RCT（PM は 35% 速く、デザイナーは有意差なし、インタラクション試作のみ 26% 速い）、Designer Fund の AI in Design Report 2026（週次利用 91%）、EU AI Act 50 条の表示義務の猶予が 2026-12-02 まで。https://research.breon.ai/ （二次まとめ。一次資料で要確認。T03 の確度、T14 の透明性表示に関係）
- ideapeel 2026-10-23「UI/UX Design Trends 2026」: 「Anti-glass: the pushback on Liquid Glass」「Crafted over prompted」を挙げる。https://www.ideapeel.com/blogs/ui-ux-design-trends-2026-15-changes-shaping-saas （T10 の反対意見、T01）
- Trend Hunter「Reply Surfaces」2026-10-19: 要求起点で UI が生成される会話型インターフェース。10-05 週がピークでその後横ばい。https://www.trendhunter.com/protrends/conversational-interface-design （T15）
- Tubik「7 UI Design Trends of 2026」: monospace・グリッド・ワイヤーフレーム的な raw aesthetics。https://tubikstudio.com/blog/ui-design-trends-2026/ （T12 か新規候補。X での裏付けは今回取れていない）

## 検索したが項目にしなかったもの

- https://x.com/rosemoni18/status/2116111560074756437 、https://x.com/abir35627/status/2116494178788290900 — @viktoroddy と同文の投稿（L646 / L273）。重複・宣伝の可能性が高いので個別項目にしない。
- https://x.com/csaba_kissi/status/2113525061441429860 — 開発者向けサイト 5 選（L127, BM165）。素材集の一例だが既出の型と同じ。
- https://x.com/athrix_codes/status/2113302480016777611 — 10 月のデザイン参照集（L161, BM163）。同上。
- https://x.com/okapi_fukugyo/status/2106533285728006655 — UI 用リソース 10 選（L219, BM417）。同上（日本語）。
- https://x.com/shadcn/status/2115747963309855088 — MacBook のタッチスクリーンについての意見（L978）。UI トレンドとしては対象外。
- https://x.com/NanouuSymeon/status/2107473947188974070 — CSS ロードマップ 2026（L64）。反応が小さい。
- https://x.com/helloAlexBender/status/2114985888883306799 — 3D アニメ付き LP の作例（L79）。反応が小さい（T13 の補強程度）。
- タイポグラフィ・配色・ブルータリズム・ライトモード・Bento・ディザ単体の 10 月の高反応投稿は、今回の検索では新たに見つからなかった（T09 / T11 / T12 / T17 / T18 は X 上で新規の上積みなし）。
- Generative UI / Agent UX の 10 月の X 投稿は反応が小さいもの（@Zac_Aztec L44 など）しか見つからなかった。
