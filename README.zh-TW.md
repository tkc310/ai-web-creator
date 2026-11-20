<div align="center">

[English](README.md) | [日本語](README.ja.md) | [简体中文](README.zh-CN.md) | **繁體中文** | [한국어](README.ko.md)

# ai-web-creator

**只需與 Claude 對話，就能製作、發布並持續營運過去需要委託網站製作公司的網站的技能與提示詞**

[![check-skills](https://img.shields.io/github/actions/workflow/status/tkc310/ai-web-creator/check-skills.yml?branch=main&label=check-skills&logo=githubactions&logoColor=white)](https://github.com/tkc310/ai-web-creator/actions/workflows/check-skills.yml)
[![Release](https://img.shields.io/github/v/release/tkc310/ai-web-creator?label=release)](https://github.com/tkc310/ai-web-creator/releases)
[![Last commit](https://img.shields.io/github/last-commit/tkc310/ai-web-creator)](https://github.com/tkc310/ai-web-creator/commits/main)
[![Issues](https://img.shields.io/github/issues/tkc310/ai-web-creator)](https://github.com/tkc310/ai-web-creator/issues)
[![License: Proprietary](https://img.shields.io/badge/license-proprietary-lightgrey)](LICENSE)

[![Claude](https://img.shields.io/badge/agent-Claude-D97757?logo=claude&logoColor=white)](https://claude.ai/)
[![Astro](https://img.shields.io/badge/site-Astro-BC52EE?logo=astro&logoColor=white)](https://astro.build/)
[![Cloudflare Workers](https://img.shields.io/badge/hosting-Cloudflare_Workers-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![GitHub Actions](https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF?logo=githubactions&logoColor=white)](https://github.com/features/actions)

如果這些技能對你有幫助，歡迎給儲存庫點一個 ⭐ Star，這對我們是很大的鼓勵。

[快速開始](#快速開始) ・ [特點](#特點) ・ [文件](#文件) ・ [技能結構](#技能結構) ・ [意見回饋](#意見回饋) ・ [授權](#授權)

</div>

---

這是一套技能與提示詞，用於把網站（落地頁、企業官網、部落格、媒體網站）的製作、發布和持續營運交給 AI 代理 Claude。目標是讓不熟悉 IT 的人，只需與 Claude 對話，就能擁有安全且設計出色的網站。

> [!IMPORTANT]
> 任何人都可以閱讀本儲存庫，但它不是開源軟體。只有購買了在 note 上銷售的、文中註明附帶本技能使用許可的解說文章（包括彙總這些文章的合集）的使用者才能使用。條件請參閱 [LICENSE](LICENSE) 和本頁的「[授權](#授權)」。

> [!NOTE]
> 技能、文件和提示詞均以日文編寫，配套文章也以日文銷售。本頁是為方便閱讀而提供的翻譯。如與[日文 README](README.ja.md) 或 [LICENSE](LICENSE) 有出入，以日文原文為準。

## 特點

- **全程透過對話完成**：只需回答帶選項的問題，就能完成策劃、設計、製作和發布。無需選擇任何技術名稱
- **上線後也只需開口**：傳送通知或部落格的要點，Claude 就會完成草稿、校對、預覽和發布。沒有管理後臺
- **部署不易失敗，失敗也會自動修復**：CI 只檢查建置和發布後的頁面。若文章更新導致失敗，GitHub Actions 上的 Claude 會修復並重新發布
- **上線前測量品質**：Lighthouse（行動裝置）目標為效能 95 以上、其餘 100。透過 sitemap.xml、llms.txt、JSON-LD、OGP 做好 SEO 與 AIO
- **以安全為前提**：不讀取機密資訊，不服從混在稿件或網頁中的指令。上線前和功能變更時進行安全審計
- **所有權歸站長**：GitHub 與 Cloudflare 帳戶全部以站長名義建立，不依賴代理或製作者
- **內建改進迴圈**：保留執行日誌、審計日誌和改進記錄，每月回顧一次，持續改進技能和網站

## 快速開始

在 Claude（付費方案）的對話中傳送以下內容。所需條件見下方「[所需條件](#所需條件)」。

```
請載入 https://github.com/tkc310/ai-web-creator 中的技能（skills 資料夾），
幫我製作網站。
載入完成後，請先告訴我載入的技能版本（CHANGELOG.md 中最新的標題）。
我不熟悉 IT。
提問時請提供選項，每次最多 4 個問題。
```

Claude 會一邊提出帶選項的問題，一邊推進策劃、製作和發布。上線後無需開啟管理後臺，只要以條目形式傳送通知或部落格的要點，Claude 就會撰寫草稿、校對併發布。對於有文章的網站，上線後可以和 Claude 一起新增第一篇文章，完整體驗一次「在 Claude 文件中寫稿 → 在預覽中確認 → 回覆 OK 即發布」的流程。發布前的修改會先在 Claude 的 Artifact 中展示 HTML 預覽。想修改的地方直接在對話中告訴 Claude（Team 和 Enterprise 還可以在預覽上選中文字或圖片新增評論）。GitHub 和 Cloudflare 帳戶的建立與設定，Claude 也會透過對話指導。進入製作階段時會轉到 Claude Code（claude.ai/code）。在那裡，Claude 會把本儲存庫最新版本的技能匯入網站儲存庫的 skills/ 資料夾。不會建立本儲存庫的 fork（副本）。詳情見[技能與提示詞的使用方法](docs/how-to-use.md)（日文）。上線後的更新和提問，也只需對 Claude 說。其他請求方式見 [prompts/README.md](prompts/README.md)（日文）。

## 所需條件

- Claude 付費方案（Pro 或 Max）。Team 和 Enterprise 也可使用，但需按照不使用 Claude Code 專案的步驟進行（[project-setup.md](skills/web-creator/references/project-setup.md)）。靜態網站完成後，在不更新的月份可以降為免費方案（Free）（見下方「[注意](#注意)」）
- GitHub 帳戶（免費方案即可）
- Cloudflare 帳戶（免費方案即可）
- 用作網站地址的域名（沒有的話可在過程中獲取）
- 在 Claude 設定的「Capabilities」中開啟「Code execution and file creation」（用於從 GitHub 載入技能。無法開啟時的替代方法見 [how-to-use.md](docs/how-to-use.md) 的「段階1」）

GitHub 和 Cloudflare 帳戶的建立，Claude 會在過程中引導。兩者都是一人一個登入，企業網站則把 GitHub 儲存庫放在公司的 Organization 中（GitHub 的條款不允許多人共用一個登入。[account-setup.md](skills/web-creator/references/account-setup.md)）。自動修復用的金鑰是可選的，不設定也能發布（見下方「[注意](#注意)」）。訪問量在接入自定義域名後，開始用 Cloudflare Web Analytics（免費、不使用 Cookie）統計（[analytics.md](skills/web-creator/references/analytics.md)）。

## 不支援的內容

物件是「展示資訊的網站」：公司或店鋪介紹網站、落地頁、部落格、文章數在幾千篇以內的媒體等。以下內容不支援。即便如此，也可以用來製作交給網站製作公司的樣稿或需求文件。

- 文章超過數千篇的媒體
- 受託製作中，上線後由客戶透過管理後臺發布內容的網站（用本技能製作的網站沒有管理後臺，更新請交給 Claude）
- 訪客註冊的會員功能、訪客發表的評論功能
- 網店（電商）、支付、預約系統等業務系統

## 文件

所有文件均為日文。

- [Claude 帳戶註冊指南](docs/claude-account.md)：建立帳戶、付費方案、最初的設定、連線 GitHub
- [技能與提示詞的使用方法](docs/how-to-use.md)：從諮詢到製作、發布、營運的流程
- [聯絡表單的製作方法](docs/forms.md)：Google 表單（連結、嵌入）以及與網站外觀一致的表單（Cloudflare Email Sending）的引入方法，其他服務的介紹與注意事項
- [在 Cursor 或 ChatGPT 中使用](docs/other-agents.md)：在 Claude 以外的代理中載入技能的方法，以及 Claude 獨有功能的替代

## 使用的模型

使用的模型以及思考深度（effort）的區分彙總在 [versions.md](skills/web-creator/references/versions.md) 中。策劃和設計用 effort high，建置（製作、更新、維護、自動修復）用 effort medium。這些在技能的 frontmatter、子代理定義（templates/claude/agents/site-builder.md）、網站儲存庫的 `.claude/settings.json` 以及自動修復工作流的引數中設定，versions.md 中也列出了同一值寫在哪些地方。

## 內容

| 資料夾 | 內容 |
|---|---|
| [skills/web-creator](skills/web-creator/SKILL.md) | 推進網站製作全流程的技能：需求訪談、技術選型、帳戶準備、設計與製作、上線前品質檢查、發布、自動修復 |
| [skills/site-content-update](skills/site-content-update/SKILL.md) | 上線後文章與通知的更新。從對話、Google 文件、Claude 文件讀取稿件併發布。未指定稿件位置時，請站長在 Claude 文件中寫稿，在預覽中得到「OK」後發布（標準流程） |
| [skills/site-maintenance](skills/site-maintenance/SKILL.md) | 需要維護的網站的定期維護。每月 1 日和 15 日把技術棧更新到最新。小更新（補丁和次版本）確認後合入 main，大更新（主版本和 GitHub Actions）保留拉取請求，等待站長 OK |
| [skills/site-review](skills/site-review/SKILL.md) | 回顧執行日誌。整理並落實改進點，把舊日誌按月彙總後刪除。降為 Claude 免費方案前的檢查，以及恢復 Pro 當天的工作也在這裡進行 |
| [tkc310/design-nexus](https://github.com/tkc310/design-nexus)（引用） | 設計技能。用三個方案和 token 計劃確定方向，用 DESIGN.md 統一外觀，用 lint 和渲染檢查進行確認。不存放在本儲存庫，匯入時按 [external-skills.txt](skills/web-creator/references/external-skills.txt) 中的版本獲取到網站的 skills/design-nexus |
| [skills/runtime-update](skills/runtime-update/SKILL.md) | 把 Node.js（最新 LTS）、pnpm、依賴包保持為最新，並更新 Workers 的 compatibility_date |
| [prompts](prompts/README.md) | 站長可以複製使用的提示詞集 |
| [docs/verification](docs/verification/README.md) | 結構驗證記錄。在納入技能前製作樣例並測量的結果 |
| [.github](.github/workflows/check-skills.yml) | 本儲存庫自身的檢查（Markdown 中 bash 的語法、YAML、check_text.py、MANIFEST.txt、舊結構的描述是否迴歸）、發布工作流，以及提交改進點的 Issue 表單。不復制到網站儲存庫 |

## 技能結構

```
skills/
├── web-creator/
│   ├── SKILL.md                 … 整體流程以及與站長的溝通方式
│   ├── references/              … 各步驟的細節（需要時閱讀）
│   │   ├── hearing.md
│   │   ├── stack-selection.md   … 全部使用 Astro。判斷是否不支援、靜態還是部分 SSR
│   │   ├── versions.md          … 模型與版本的基準（其他檔案引用這裡）
│   │   ├── external-skills.txt  … 引用的技能（design-nexus）的版本
│   │   ├── skills-install.md    … 將技能匯入、更新到網站儲存庫的 skills/
│   │   ├── account-setup.md
│   │   ├── connectors.md        … 用於操作 Cloudflare 和 Google 的聯結器（MCP）
│   │   ├── project-setup.md     … 每個網站一個 Claude 專案
│   │   ├── build.md
│   │   ├── quality-gate.md
│   │   ├── deploy-and-autofix.md … 發布、發布後檢查、自動修復（允許修改的範圍和次數上限）
│   │   ├── forms.md             … 聯絡表單（Google 表單 / Cloudflare Email Sending）
│   │   ├── analytics.md         … 訪問分析（Cloudflare Web Analytics）
│   │   ├── migration.md         … 從 WordPress 或 STUDIO 遷移
│   │   ├── client-handoff.md    … 受託製作中把網站交給客戶時（移除 skills/ 的步驟）
│   │   ├── preview.md
│   │   ├── article-tutorial.md  … 上線後與站長一起新增第一篇文章的教程
│   │   ├── run-logs.md          … 執行日誌與改進迴圈
│   │   ├── audit-log.md         … 審計日誌
│   │   ├── security-audit.md    … 上線前及功能變更時的安全審計
│   │   └── security-rules.md    … 安全規則（所有技能通用）
│   ├── scripts/                 … fetch_external_skills.sh（獲取 design-nexus）、run_lighthouse.sh、check_mobile_width.py（檢查 iPhone SE 寬度）、make_preview.py、check_text.py（檢查機密資訊與汙染）
│   └── templates/               … SITE.md、AGENTS.md.tmpl 和 CLAUDE.md.tmpl（放到網站根目錄時去掉 .tmpl）、專案說明、交接文字（handoff.md）、日誌、IMPROVEMENTS.md、工作流、smoke-test.txt 和 scripts/smoke.sh（發布後檢查）、dependabot.yml（僅 GitHub Actions）、pnpm-workspace.yaml、llms.txt、JSON-LD、表單（forms/）等
├── site-content-update/
│   ├── SKILL.md                 … 新增文章與通知的標準流程
│   ├── scripts/                 … optimize_images.py（刪除照片後設資料並壓縮）
│   └── templates/               … article-draft.md（Claude 文件稿件模板）
├── site-maintenance/
│   ├── SKILL.md
│   └── references/              … 例行任務的設定方法與提示詞
├── site-review/
│   └── SKILL.md                 … 回顧，以及舊日誌的彙總與刪除
├── runtime-update/
│   └── SKILL.md
└── （design-nexus/）            … 設計技能。不存放在本儲存庫，匯入網站時從 tkc310/design-nexus 獲取
```

## 設計方針

### 所有網站都用 Astro 製作

單頁落地頁和有文章的網站都用 Astro 製作。只有一種製作方式，所以之後給落地頁新增通知或頁面時，只需在同一個儲存庫中新增。不讓站長選擇技術名稱，代理只決定以下幾點（[stack-selection.md](skills/web-creator/references/stack-selection.md)）：

- 是否屬於不支援的範圍（見上方「[不支援的內容](#不支援的內容)」）
- 全部頁面靜態輸出（SSG），還是隻有部分頁面使用 SSR。預設 SSG，只有像處理聯絡表單提交這樣每次訪問都需要處理的頁面才用 SSR
- 頁面形式（單頁 / 多頁 / 有文章）

文章較多的媒體，在幾千篇以內用 Astro 的靜態建置就足夠（3,000 篇約 7 秒，1 萬篇約 18 秒。[驗證記錄](docs/verification/2026-10-25_media-json-ssr/README.md)）。不支援超過數千篇的媒體，原因不是建置時間，而是用 Markdown 檔案持續檢索和整理文章的負擔過大。

會員功能和評論功能一旦在個人資訊的儲存或營運上出錯，很容易成為安全漏洞，不適合推薦給不熟悉開發的使用者，因此不在支援範圍內。

### 需要維護的網站每月自動維護兩次

部分頁面使用 SSR 時，依賴包的程式碼會線上上網站執行，因此作為「需要維護的結構」處理。

- Claude 的定時任務（舊稱：例行任務）在每月 1 日和 15 日執行，把 Node.js（最新 LTS）、pnpm、依賴包更新到最新，並更新 Workers 的 compatibility_date。小更新（補丁和次版本）在建置和檢查透過後合入 main。大更新（主版本和 GitHub Actions）保留拉取請求，在下次對話中得到站長 OK 後再合入。無人值守的執行不會合並拉取請求（[site-maintenance](skills/site-maintenance/SKILL.md)、[runtime-update](skills/runtime-update/SKILL.md)）
- 不安裝發布未滿 3 天的版本（避免發布後立即植入被劫持版本的攻擊）。用 `pnpm audit` 檢查漏洞，優先修復嚴重的問題
- Dependabot 只用於 GitHub Actions 的更新（原因見 [versions.md](skills/web-creator/references/versions.md) 的「時点つきの事実」）。Dependabot 的拉取請求不會自動合併，在維護或回顧時由 Claude 閱讀變更並向站長確認
- 需要付費方案或新的 Cloudflare 服務的更新、會改變許可的更新，不自動合併，而是向站長確認

僅靜態的網站不會線上上執行依賴包，因此不設定此維護。取而代之，在每月一次的回顧（[site-review](skills/site-review/SKILL.md)）中同樣更新到最新。

### 技術棧始終使用最新版本

Node.js 使用最新 LTS（Node.js 官方推薦用於生產的版本。不使用成為 LTS 之前的 Current 和奇數版本），包管理使用最新的 pnpm，依賴包也用最新版本，並透過上述維護和回顧保持最新（基準見 [versions.md](skills/web-creator/references/versions.md)，製作方法見 [build.md](skills/web-creator/references/build.md) 的「使うツールとバージョン」）。

### 開發在雲端進行，發布使用 GitHub 和 Cloudflare

開發在代理的雲環境中進行，不在站長的電腦上安裝開發工具。網站內容儲存在 GitHub，由 GitHub Actions 發布到 Cloudflare Workers。所有帳戶都以站長名義建立（企業網站的 GitHub 使用公司的 Organization），因此不依賴代理或製作者。

### 技能匯入到網站的儲存庫

進入製作階段時，Claude 會把本儲存庫的最新版本（標籤。在沒有標籤期間，固定 main 的某一個提交）複製到網站儲存庫的 `skills/`，並把版本寫入 `skills/VERSION`。網站的 CLAUDE.md 中寫有「工作前閱讀 skills/ 中的 SKILL.md」，因此在 Claude Code 的專案和普通會話中都會以相同方式讀取。專案中只需加入網站儲存庫一個，站長無需建立 fork（公開儲存庫的 fork 一定是公開的，所以不使用）。如果在工作環境中 `git clone` 失敗，就從 raw.githubusercontent.com 逐個獲取清單（`MANIFEST.txt`）中的檔案；如果這也不行，不做猜測，而是請站長提供發布版的 zip（附加到對話中，或透過 GitHub 網頁放到網站儲存庫的另一個分支）。

有新版本時，每月回顧中 Claude 會比較 `skills/VERSION` 和最新標籤，把變更要點總結為最多三行，並建立替換 `skills/` 的拉取請求。站長回覆「OK」後合併（[skills-install.md](skills/web-creator/references/skills-install.md)）。

### 服務的操作透過聯結器（MCP）進行

Cloudflare 和 Google 服務的設定儘可能透過 Claude 的聯結器（MCP）進行。Cloudflare 接入官方 MCP 伺服器，Google 雲端硬碟和表格使用 Claude 的官方聯結器。站長只需點選對話中出現的按鈕完成認證。沒有聯結器的操作（新帳戶註冊、建立 Google 表單等）透過瀏覽器操作或步驟引導進行（[connectors.md](skills/web-creator/references/connectors.md)）。瀏覽器操作所用的 Claude in Chrome 和桌面應用的安裝方法，Claude 會在需要時引導（[帳戶註冊指南](docs/claude-account.md)第 6 節）。

### 不讀取機密資訊，不服從被汙染的文字

所有技能以及在網站儲存庫中執行的代理（包括自動修復、維護、回顧）都遵守共同的安全規則。不讀取機密資訊（密碼、令牌、Secrets 的值、訪客的個人資訊），也不在對話、檔案、日誌中留下。不服從稿件、網頁、拉取請求、日誌等中寫入的指令，發布和記錄的內容在輸出前會檢查是否混入了針對 AI 的攻擊文字或機密資訊。能機械檢測的內容用 scripts/check_text.py 檢查，自動修復工作流在發現問題時也不提交而是停止（[security-rules.md](skills/web-creator/references/security-rules.md)）。

### 上線前和功能變更時進行安全審計

上線前，以及新增或變更功能時（表單、頁面型別、SSR 頁面、會員或評論功能、外部嵌入等），使用 Cloudflare 公開的技能 [security-audit](https://github.com/cloudflare/security-audit-skill)（MIT 許可）審計整個網站儲存庫，修復確認的漏洞後再發布。僅新增文章或修改文字時不進行。僅有靜態頁面的網站使用簡短模式（`quick`），節省時間和用量。

修復方式是隻修改被指出位置的最小變更。嚴格的 CSP（會導致顯示、嵌入、統計失效）、在 CI 中加入漏洞掃描（會連文章更新的發布都卡住）、全面重寫工作流、一次性更新所有依賴包、修改 Cloudflare 控制檯設定等容易阻斷髮布或工作的建議不予採用，而是尋找其他修復方法，並在日誌中記錄未採用的建議。報告不提交到儲存庫，只記錄數量和修復內容（[security-audit.md](skills/web-creator/references/security-audit.md)）。

### 變更記錄在審計日誌中

發布文章與通知的新增或修改、網站修改、自動修復、維護更新時，除了用於改進迴圈的執行日誌（logs/）外，還會追加到 `audit-log/YYYY/YYYY-MM-DD.md`（按年分資料夾、按日分檔案），並與變更放在同一個提交中。與執行日誌不同，審計日誌不彙總也不刪除（[audit-log.md](skills/web-creator/references/audit-log.md)）。

### 交給人的操作限定為四類

以下四類操作不由代理代辦，而是交給站長：

1. 輸入密碼和確認註冊
2. 兩步驗證（包括顯示二維碼和恢復碼的頁面。恢復碼由站長儲存，不寫在任何地方）
3. 付款、同意條款、授予外部服務許可權（安裝 GitHub 應用、連線聯結器）
4. 貼上 API 令牌等機密字串

操作清單和總時間（約 30 到 40 分鐘）會在開始前展示給站長（[account-setup.md](skills/web-creator/references/account-setup.md) 的「オーナーの操作の一覧」）。

像切換域名、刪除現有網站這樣無法撤銷的操作，會先說明會發生什麼，得到站長同意後再進行。

### 部署不易失敗，失敗也會自動修復

CI 只檢查「建置是否透過」以及發布後主要頁面能否訪問。發布後檢查會確認網站儲存庫 `.github/smoke-test.txt` 中寫的頁面返回 200（每行也可以指定 `405` 等狀態），幷包含指定的文字。返回 Cloudflare 安全驗證頁面的頁面作為警告而非失敗處理（`.github/scripts/smoke.sh`）。拉取請求在所有網站上只檢查建置。Linter 和測試由代理在工作中執行。

建置或發布階段失敗時，Claude 會在 GitHub Actions 上調查原因、修復並重新發布（[autofix.yml](skills/web-creator/templates/github/workflows/autofix.yml)）。Claude 只能修改文章、圖片和日誌（`src/content/`、`src/assets/`、`public/` 中的圖片、`logs/`、`audit-log/`）。如果原因在頁面元件或佈局（.astro）、設定（package.json、astro.config.* 等）中，或者修改了範圍外的檔案，就不推送，而是透過 Issue 通知站長並停止。站長把該 Issue 給 Claude 看，請它修復。自動修復 24 小時內最多 3 次，自動修復的 Issue（標籤 autofix）開啟期間不會執行。不啟動 Claude 的通知 Issue（標籤 deploy-notice）即使開啟也不會阻止自動修復。自動修復用的金鑰不被接受時（例如把 Claude 降為免費方案的月份），只開一個 Issue（標籤 autofix-paused）：「由於無法使用 Claude，自動修復已暫停。請恢復 Pro，或在 GitHub 網頁上修改」，之後只追加評論。這個 Issue 也不會阻止自動修復，自動修復恢復執行後會關閉。

deploy 工作流分為建置（build）、發布（publish）、發布後檢查（smoke）三個作業，autofix 根據失敗的作業改變行為。只有建置失敗時才啟動 Claude。只有發布階段失敗（如 Cloudflare 金鑰過期）和只有發布後檢查失敗（網站已以新版本發布）時，不執行 Claude，而是用 Issue 通知。Issue 中會寫明線上網站是上一個版本還是新版本、Claude 調查到的原因，以及站長髮給 Claude 的請求方式。回滾也交給 Claude（[deploy-and-autofix.md](skills/web-creator/references/deploy-and-autofix.md) 的「表示がおかしいときに戻す」）。建置或發布階段失敗時，Cloudflare 上的上一個網站會繼續顯示。沒有設定自動修復金鑰的網站，Claude 不會執行，只用 Issue 通知。

### 設計用 design-nexus 技能確定並收尾，並檢查到 iPhone SE 寬度

從設計方案到最終打磨，都使用作者公開的 [design-nexus](https://github.com/tkc310/design-nexus) 技能。請站長從三個紮根於主題的方案中選擇一個，把顏色和字型的 token 彙總到 DESIGN.md 以統一各頁面的外觀，用 lint 和渲染檢查確認無障礙的底線，再透過點評完成收尾。這是為了避免模板化的外觀。它不復制到本儲存庫，在把技能匯入網站時，按固定的版本（[external-skills.txt](skills/web-creator/references/external-skills.txt)）獲取到網站的 skills/design-nexus，因此站長無需啟用任何技能。行動裝置顯示不僅在常見的 iPhone 寬度，也在 iPhone SE 寬度（375px）和 320px 下，用 [check_mobile_width.py](skills/web-creator/scripts/check_mobile_width.py) 和截圖確認沒有橫向滾動、溢位，以及頁首或按鈕的換行（[build.md](skills/web-creator/references/build.md)）。

### 上線前測量品質

Lighthouse（行動裝置）的目標是效能 95 以上，無障礙、最佳實踐、SEO 為 100。整理 sitemap.xml、robots.txt、llms.txt、結構化資料（JSON-LD）和 OGP。結構化資料只描述頁面上顯示的內容。測量在 Claude 的雲工作環境中進行，只測首頁等主要頁面（每種頁面型別一個代表），上線後也會線上上網站測量。工作環境無法訪問線上網站時，Claude 會先詢問你使用的是對話還是 Code，再說明如何把網站地址加入網路訪問許可。詳細標準見 [quality-gate.md](skills/web-creator/references/quality-gate.md)。

### 每個網站一個 Claude 專案

製作和營運在為每個網站建立的 Claude Code 專案中進行。專案說明中寫有站長的環境（電腦、瀏覽器、稿件存放位置等）和工作規則，因此不必在每次對話中重新說明。站長只需在專案的對話中寫下請求。無法使用專案的帳戶，則把同樣的內容寫在 SITE.md 中，從新會話發起請求（[project-setup.md](skills/web-creator/references/project-setup.md)）。

### 上線後也能交接

網站儲存庫中放有交接備忘錄（SITE.md）、給站長的說明（README.md）、執行日誌（logs/）和技能副本（skills/）。即使改天開始新的對話，代理也能讀取 SITE.md 接著工作。

### 用執行日誌驅動改進迴圈

代理每次執行（站長的請求、自動修復、維護、回顧）都會在網站儲存庫的 logs/ 中寫一份執行日誌。值得下次修改的地方彙總在 logs/IMPROVEMENTS.md 中，在下次工作前閱讀。每月一次的回顧（[site-review](skills/site-review/SKILL.md)）會整理改進點，超過儲存期限（預設 90 天）的日誌按月彙總後刪除。技能本身的改進點，預設也以型別「スキル」記錄在網站的 logs/IMPROVEMENTS.md 中。是否傳送給發布方是可選的，傳送時需得到站長同意並去除個人資訊，透過 note 的聯絡視窗或本儲存庫的 Issue 傳送（[run-logs.md](skills/web-creator/references/run-logs.md)）。

## 注意

- 價格和服務規格會變化。技能中的數值是編寫時的資料，代理在工作時會確認最新資訊
- 自動修復用的金鑰（`CLAUDE_CODE_OAUTH_TOKEN` 或 `ANTHROPIC_API_KEY`）是可選的。不設定的話，失敗時只會透過 Issue（以及 GitHub 的郵件）通知。簽發 `CLAUDE_CODE_OAUTH_TOKEN` 需要在電腦上安裝 Claude Code 並輸入一行命令（[account-setup.md](skills/web-creator/references/account-setup.md) 第 3 節）
- 維護例行任務透過 Claude 的定時任務執行，會消耗 Claude 的用量（Pro 及以上方案可用）
- 靜態網站在不更新的月份可以把 Claude 降為免費方案（Free）。Free 不能使用 Claude Code 和定時任務（[價格頁面](https://claude.com/pricing)，2026-10-31 確認）。網站會繼續顯示，在 GitHub 網頁上修改的文字也會照常發布。每月回顧、定時發布、自動修復（使用 Claude 方案金鑰時）會停止。需要維護的網站為了持續修復元件漏洞，不應降級。降級前的檢查和恢復 Pro 當天的工作見 [site-review](skills/site-review/SKILL.md) 的「無料のプランに下げる前と、Pro に戻した日」，免費月份修改文字的方法見網站儲存庫 README.md（[README.owner.md](skills/web-creator/templates/README.owner.md)）的「Claude を無料のプランにしている月」

## 參與貢獻

歡迎報告問題和提出改進建議。由於許可的原因，不接受透過拉取請求提交程式碼。

- 問題或難以理解的說明：請透過 [Issue](https://github.com/tkc310/ai-web-creator/issues/new/choose)（表單「スキルの改善点」）或 note 的聯絡視窗告訴我們。詳情見下方「[意見回饋](#意見回饋)」
- 變更歷史：[CHANGELOG.md](CHANGELOG.md)
- 改進記錄：[docs/logs/](docs/logs/README.md)
- 修改本儲存庫的代理所遵守的規則：[AGENTS.md](AGENTS.md)
- 版本命名與發布步驟（面向作者，日文）：日文 README 的「[版の付け方（作者向け）](README.ja.md#版の付け方作者向け)」

## 意見回饋

無法正常執行的步驟或難以理解的說明，請透過 note 的聯絡視窗或本儲存庫的 Issue（表單「スキルの改善点」）告訴我們。是否傳送由你決定。Issue 是公開的，請不要寫網站的 URL 或個人資訊。Claude 在網站儲存庫中發現的改進點儲存在 logs/IMPROVEMENTS.md 中（傳送方法見 [run-logs.md](skills/web-creator/references/run-logs.md) 的「スキルの改善点を配布元に送る（任意）」）。

如果這些技能對你有幫助，歡迎給儲存庫點一個 Star（完全自願，不點也不會影響任何使用方式）。技能也會在首次上線完成、站長滿意時，提出一次同樣的請求。

根據大家的意見進行改進的記錄儲存在 [docs/logs/](docs/logs/README.md) 中。

## 授權

可在 [LICENSE](LICENSE) 的條件下使用。要點如下：

- 只有在 note 上銷售的、文中註明附帶使用許可的解說文章（包括合集）的購買者才能使用。購買者為公司或團體使用時，可在該公司或團體內部使用。負責人變更後，繼任者也可以繼續為同一網站使用
- 可用於自己或本公司網站的製作、發布、更新和維護。為此，可以把技能複製到網站的私有儲存庫，並更新到新版本
- 也可用於接受他人委託製作或維護客戶網站的工作。不需要為每個客戶額外購買。只有在持續製作或維護期間，才能在客戶網站的私有儲存庫中放置 skills/。不再負責時，除非客戶本人也是購買者，否則需移除 skills/（因為這屬於技能的再分發。步驟見 [client-handoff.md](skills/web-creator/references/client-handoff.md)）
- 不得分發或銷售技能和提示詞、交給非購買者，或製作並分發類似的內容
- 禁止用於 AI 訓練、訓練資料集、RAG 索引、為非購買者提供回答的知識庫，以及為此進行的爬取。購買者把它載入到自己的 AI 代理中沒有問題
- 用技能製作的網站頁面、文字、程式碼和日誌歸購買者所有，可以自由使用。把網站儲存庫交給他人時，請移除 skills/（對方也是購買者時無需移除）
- 不提供任何保證

以 [LICENSE](LICENSE) 的日文原文為準。
