<div align="center">

[English](README.md) | [日本語](README.ja.md) | **简体中文** | [繁體中文](README.zh-TW.md) | [한국어](README.ko.md)

# ai-web-creator

**只需与 Claude 对话，就能制作、发布并持续运营过去需要委托网站制作公司的网站的技能与提示词**

[![check-skills](https://img.shields.io/github/actions/workflow/status/tkc310/ai-web-creator/check-skills.yml?branch=main&label=check-skills&logo=githubactions&logoColor=white)](https://github.com/tkc310/ai-web-creator/actions/workflows/check-skills.yml)
[![Release](https://img.shields.io/github/v/release/tkc310/ai-web-creator?label=release&logo=github)](https://github.com/tkc310/ai-web-creator/releases/latest)
[![Release date](https://img.shields.io/github/release-date/tkc310/ai-web-creator?label=released)](https://github.com/tkc310/ai-web-creator/releases)
[![Last commit](https://img.shields.io/github/last-commit/tkc310/ai-web-creator)](https://github.com/tkc310/ai-web-creator/commits/main)
[![Commit activity](https://img.shields.io/github/commit-activity/m/tkc310/ai-web-creator)](https://github.com/tkc310/ai-web-creator/pulse)
[![License: Proprietary](https://img.shields.io/badge/license-proprietary-lightgrey)](LICENSE)

[![GitHub stars](https://img.shields.io/github/stars/tkc310/ai-web-creator?style=flat&logo=github&label=stars)](https://github.com/tkc310/ai-web-creator/stargazers)
[![Issues](https://img.shields.io/github/issues/tkc310/ai-web-creator?logo=github)](https://github.com/tkc310/ai-web-creator/issues)
[![Pull requests](https://img.shields.io/github/issues-pr/tkc310/ai-web-creator?logo=github)](https://github.com/tkc310/ai-web-creator/pulls)
![README languages](https://img.shields.io/badge/README-EN%20%7C%20JA%20%7C%20ZH--CN%20%7C%20ZH--TW%20%7C%20KO-informational)

[![Claude](https://img.shields.io/badge/agent-Claude-D97757?logo=claude&logoColor=white)](https://claude.ai/)
[![Agent Skills](https://img.shields.io/badge/format-Agent_Skills-D97757?logo=anthropic&logoColor=white)](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
[![design-nexus](https://img.shields.io/badge/design-design--nexus-6E56CF?logo=github&logoColor=white)](https://github.com/tkc310/design-nexus)
[![Astro](https://img.shields.io/badge/site-Astro-BC52EE?logo=astro&logoColor=white)](https://astro.build/)
[![Cloudflare Workers](https://img.shields.io/badge/hosting-Cloudflare_Workers-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![GitHub Actions](https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF?logo=githubactions&logoColor=white)](https://github.com/features/actions)
[![Node.js LTS](https://img.shields.io/badge/runtime-Node.js_LTS-5FA04E?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/package-pnpm-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![Lighthouse](https://img.shields.io/badge/quality-Lighthouse-F44B21?logo=lighthouse&logoColor=white)](https://developer.chrome.com/docs/lighthouse)

如果这些技能对你有帮助，欢迎给仓库点一个 ⭐ Star，这对我们是很大的鼓励。

[快速开始](#快速开始) ・ [特点](#特点) ・ [文档](#文档) ・ [技能结构](#技能结构) ・ [反馈](#反馈) ・ [许可](#许可)

</div>

---

这是一套技能与提示词，用于把网站（落地页、企业官网、博客、媒体网站）的制作、发布和持续运营交给 AI 代理 Claude。目标是让不熟悉 IT 的人，只需与 Claude 对话，就能拥有安全且设计出色的网站。

> [!IMPORTANT]
> 任何人都可以阅读本仓库，但它不是开源软件。只有购买了在 note 上销售的、文中注明附带本技能使用许可的解说文章（包括汇总这些文章的合集）的用户才能使用。条件请参阅 [LICENSE](LICENSE) 和本页的「[许可](#许可)」。

> [!NOTE]
> 技能、文档和提示词均以日语编写，配套文章也以日语销售。本页是为方便阅读而提供的翻译。如与[日语 README](README.ja.md) 或 [LICENSE](LICENSE) 有出入，以日语原文为准。

## 特点

- **全程通过对话完成**：只需回答带选项的问题，就能完成策划、设计、制作和发布。无需选择任何技术名称
- **上线后也只需开口**：发送通知或博客的要点，Claude 就会完成草稿、校对、预览和发布。没有管理后台
- **部署不易失败，失败也会自动修复**：CI 只检查构建和发布后的页面。若文章更新导致失败，GitHub Actions 上的 Claude 会修复并重新发布
- **上线前测量质量**：Lighthouse（移动端）目标为性能 95 以上、其余 100。通过 sitemap.xml、llms.txt、JSON-LD、OGP 做好 SEO 与 AIO
- **以安全为前提**：不读取机密信息，不服从混在稿件或网页中的指令。上线前和功能变更时进行安全审计
- **所有权归站长**：GitHub 与 Cloudflare 账户全部以站长名义创建，不依赖代理或制作者
- **内置改进循环**：保留运行日志、审计日志和改进记录，每月回顾一次，持续改进技能和网站

## 快速开始

在 Claude（付费套餐）的对话中发送以下内容。所需条件见下方「[所需条件](#所需条件)」。

```
请加载 https://github.com/tkc310/ai-web-creator 中的技能（skills 文件夹），
帮我制作网站。
加载完成后，请先告诉我加载的技能版本（CHANGELOG.md 中最新的标题）。
我不熟悉 IT。
提问时请提供选项，每次最多 4 个问题。
```

Claude 会一边提出带选项的问题，一边推进策划、制作和发布。上线后无需打开管理后台，只要以条目形式发送通知或博客的要点，Claude 就会撰写草稿、校对并发布。对于有文章的网站，上线后可以和 Claude 一起添加第一篇文章，完整体验一次「在 Claude 文档中写稿 → 在预览中确认 → 回复 OK 即发布」的流程。发布前的修改会先在 Claude 的 Artifact 中展示 HTML 预览。想修改的地方直接在对话中告诉 Claude（Team 和 Enterprise 还可以在预览上选中文字或图片添加评论）。GitHub 和 Cloudflare 账户的创建与设置，Claude 也会通过对话指导。进入制作阶段时会转到 Claude Code（claude.ai/code）。在那里，Claude 会把本仓库最新版本的技能导入网站仓库的 skills/ 文件夹。不会创建本仓库的 fork（副本）。详情见[技能与提示词的使用方法](docs/how-to-use.md)（日语）。上线后的更新和提问，也只需对 Claude 说。其他请求方式见 [prompts/README.md](prompts/README.md)（日语）。

## 所需条件

- Claude 付费套餐（Pro 或 Max）。Team 和 Enterprise 也可使用，但需按照不使用 Claude Code 项目的步骤进行（[project-setup.md](skills/web-creator/references/project-setup.md)）。静态网站完成后，在不更新的月份可以降为免费套餐（Free）（见下方「[注意](#注意)」）
- GitHub 账户（免费套餐即可）
- Cloudflare 账户（免费套餐即可）
- 用作网站地址的域名（没有的话可在过程中获取）
- 在 Claude 设置的「Capabilities」中开启「Code execution and file creation」（用于从 GitHub 加载技能。无法开启时的替代方法见 [how-to-use.md](docs/how-to-use.md) 的「段階1」）

GitHub 和 Cloudflare 账户的创建，Claude 会在过程中引导。两者都是一人一个登录，企业网站则把 GitHub 仓库放在公司的 Organization 中（GitHub 的条款不允许多人共用一个登录。[account-setup.md](skills/web-creator/references/account-setup.md)）。自动修复用的密钥是可选的，不设置也能发布（见下方「[注意](#注意)」）。访问量在接入自定义域名后，开始用 Cloudflare Web Analytics（免费、不使用 Cookie）统计（[analytics.md](skills/web-creator/references/analytics.md)）。

## 不支持的内容

对象是「展示信息的网站」：公司或店铺介绍网站、落地页、博客、文章数在几千篇以内的媒体等。以下内容不支持。即便如此，也可以用来制作交给网站制作公司的样稿或需求文档。

- 文章超过数千篇的媒体
- 受托制作中，上线后由客户通过管理后台发布内容的网站（用本技能制作的网站没有管理后台，更新请交给 Claude）
- 访客注册的会员功能、访客发表的评论功能
- 网店（电商）、支付、预约系统等业务系统

## 文档

所有文档均为日语。

- [Claude 账户注册指南](docs/claude-account.md)：创建账户、付费套餐、最初的设置、连接 GitHub
- [技能与提示词的使用方法](docs/how-to-use.md)：从咨询到制作、发布、运营的流程
- [联系表单的制作方法](docs/forms.md)：Google 表单（链接、嵌入）以及与网站外观一致的表单（Cloudflare Email Sending）的引入方法，其他服务的介绍与注意事项
- [在 Cursor 或 ChatGPT 中使用](docs/other-agents.md)：在 Claude 以外的代理中加载技能的方法，以及 Claude 独有功能的替代

## 使用的模型

使用的模型以及思考深度（effort）的区分汇总在 [versions.md](skills/web-creator/references/versions.md) 中。策划和设计用 effort high，构建（制作、更新、维护、自动修复）用 effort medium。这些在技能的 frontmatter、子代理定义（templates/claude/agents/site-builder.md）、网站仓库的 `.claude/settings.json` 以及自动修复工作流的参数中设置，versions.md 中也列出了同一值写在哪些地方。

## 内容

| 文件夹 | 内容 |
|---|---|
| [skills/web-creator](skills/web-creator/SKILL.md) | 推进网站制作全流程的技能：需求访谈、技术选型、账户准备、设计与制作、上线前质量检查、发布、自动修复 |
| [skills/site-content-update](skills/site-content-update/SKILL.md) | 上线后文章与通知的更新。从对话、Google 文档、Claude 文档读取稿件并发布。未指定稿件位置时，请站长在 Claude 文档中写稿，在预览中得到「OK」后发布（标准流程） |
| [skills/site-maintenance](skills/site-maintenance/SKILL.md) | 需要维护的网站的定期维护。每月 1 日和 15 日把技术栈更新到最新。小更新（补丁和次版本）确认后合入 main，大更新（主版本和 GitHub Actions）保留拉取请求，等待站长 OK |
| [skills/site-review](skills/site-review/SKILL.md) | 回顾运行日志。整理并落实改进点，把旧日志按月汇总后删除。降为 Claude 免费套餐前的检查，以及恢复 Pro 当天的工作也在这里进行 |
| [tkc310/design-nexus](https://github.com/tkc310/design-nexus)（引用） | 设计技能。用三个方案和 token 计划确定方向，用 DESIGN.md 统一外观，用 lint 和渲染检查进行确认。不存放在本仓库，导入时按 [external-skills.txt](skills/web-creator/references/external-skills.txt) 中的版本获取到网站的 skills/design-nexus |
| [skills/runtime-update](skills/runtime-update/SKILL.md) | 把 Node.js（最新 LTS）、pnpm、依赖包保持为最新，并更新 Workers 的 compatibility_date |
| [prompts](prompts/README.md) | 站长可以复制使用的提示词集 |
| [docs/verification](docs/verification/README.md) | 结构验证记录。在纳入技能前制作样例并测量的结果 |
| [.github](.github/workflows/check-skills.yml) | 本仓库自身的检查（Markdown 中 bash 的语法、YAML、check_text.py、MANIFEST.txt、旧结构的描述是否回归）、发布工作流，以及提交改进点的 Issue 表单。不复制到网站仓库 |

## 技能结构

```
skills/
├── web-creator/
│   ├── SKILL.md                 … 整体流程以及与站长的沟通方式
│   ├── references/              … 各步骤的细节（需要时阅读）
│   │   ├── hearing.md
│   │   ├── stack-selection.md   … 全部使用 Astro。判断是否不支持、静态还是部分 SSR
│   │   ├── versions.md          … 模型与版本的基准（其他文件引用这里）
│   │   ├── external-skills.txt  … 引用的技能（design-nexus）的版本
│   │   ├── skills-install.md    … 将技能导入、更新到网站仓库的 skills/
│   │   ├── account-setup.md
│   │   ├── connectors.md        … 用于操作 Cloudflare 和 Google 的连接器（MCP）
│   │   ├── project-setup.md     … 每个网站一个 Claude 项目
│   │   ├── build.md
│   │   ├── quality-gate.md
│   │   ├── deploy-and-autofix.md … 发布、发布后检查、自动修复（允许修改的范围和次数上限）
│   │   ├── forms.md             … 联系表单（Google 表单 / Cloudflare Email Sending）
│   │   ├── analytics.md         … 访问分析（Cloudflare Web Analytics）
│   │   ├── migration.md         … 从 WordPress 或 STUDIO 迁移
│   │   ├── client-handoff.md    … 受托制作中把网站交给客户时（移除 skills/ 的步骤）
│   │   ├── preview.md
│   │   ├── article-tutorial.md  … 上线后与站长一起添加第一篇文章的教程
│   │   ├── run-logs.md          … 运行日志与改进循环
│   │   ├── audit-log.md         … 审计日志
│   │   ├── security-audit.md    … 上线前及功能变更时的安全审计
│   │   └── security-rules.md    … 安全规则（所有技能通用）
│   ├── scripts/                 … fetch_external_skills.sh（获取 design-nexus）、run_lighthouse.sh、check_mobile_width.py（检查 iPhone SE 宽度）、make_preview.py、check_text.py（检查机密信息与污染）
│   └── templates/               … SITE.md、AGENTS.md.tmpl 和 CLAUDE.md.tmpl（放到网站根目录时去掉 .tmpl）、项目说明、交接文本（handoff.md）、日志、IMPROVEMENTS.md、工作流、smoke-test.txt 和 scripts/smoke.sh（发布后检查）、dependabot.yml（仅 GitHub Actions）、pnpm-workspace.yaml、llms.txt、JSON-LD、表单（forms/）等
├── site-content-update/
│   ├── SKILL.md                 … 添加文章与通知的标准流程
│   ├── scripts/                 … optimize_images.py（删除照片元数据并压缩）
│   └── templates/               … article-draft.md（Claude 文档稿件模板）
├── site-maintenance/
│   ├── SKILL.md
│   └── references/              … 例行任务的设置方法与提示词
├── site-review/
│   └── SKILL.md                 … 回顾，以及旧日志的汇总与删除
├── runtime-update/
│   └── SKILL.md
└── （design-nexus/）            … 设计技能。不存放在本仓库，导入网站时从 tkc310/design-nexus 获取
```

## 设计方针

### 所有网站都用 Astro 制作

单页落地页和有文章的网站都用 Astro 制作。只有一种制作方式，所以之后给落地页添加通知或页面时，只需在同一个仓库中添加。不让站长选择技术名称，代理只决定以下几点（[stack-selection.md](skills/web-creator/references/stack-selection.md)）：

- 是否属于不支持的范围（见上方「[不支持的内容](#不支持的内容)」）
- 全部页面静态输出（SSG），还是只有部分页面使用 SSR。默认 SSG，只有像处理联系表单提交这样每次访问都需要处理的页面才用 SSR
- 页面形式（单页 / 多页 / 有文章）

文章较多的媒体，在几千篇以内用 Astro 的静态构建就足够（3,000 篇约 7 秒，1 万篇约 18 秒。[验证记录](docs/verification/2026-10-25_media-json-ssr/README.md)）。不支持超过数千篇的媒体，原因不是构建时间，而是用 Markdown 文件持续检索和整理文章的负担过大。

会员功能和评论功能一旦在个人信息的保存或运营上出错，很容易成为安全漏洞，不适合推荐给不熟悉开发的用户，因此不在支持范围内。

### 需要维护的网站每月自动维护两次

部分页面使用 SSR 时，依赖包的代码会在线上网站运行，因此作为「需要维护的结构」处理。

- Claude 的定时任务（旧称：例行任务）在每月 1 日和 15 日运行，把 Node.js（最新 LTS）、pnpm、依赖包更新到最新，并更新 Workers 的 compatibility_date。小更新（补丁和次版本）在构建和检查通过后合入 main。大更新（主版本和 GitHub Actions）保留拉取请求，在下次对话中得到站长 OK 后再合入。无人值守的运行不会合并拉取请求（[site-maintenance](skills/site-maintenance/SKILL.md)、[runtime-update](skills/runtime-update/SKILL.md)）
- 不安装发布未满 3 天的版本（避免发布后立即植入被劫持版本的攻击）。用 `pnpm audit` 检查漏洞，优先修复严重的问题
- Dependabot 只用于 GitHub Actions 的更新（原因见 [versions.md](skills/web-creator/references/versions.md) 的「時点つきの事実」）。Dependabot 的拉取请求不会自动合并，在维护或回顾时由 Claude 阅读变更并向站长确认
- 需要付费套餐或新的 Cloudflare 服务的更新、会改变许可的更新，不自动合并，而是向站长确认

仅静态的网站不会在线上运行依赖包，因此不设置此维护。取而代之，在每月一次的回顾（[site-review](skills/site-review/SKILL.md)）中同样更新到最新。

### 技术栈始终使用最新版本

Node.js 使用最新 LTS（Node.js 官方推荐用于生产的版本。不使用成为 LTS 之前的 Current 和奇数版本），包管理使用最新的 pnpm，依赖包也用最新版本，并通过上述维护和回顾保持最新（基准见 [versions.md](skills/web-creator/references/versions.md)，制作方法见 [build.md](skills/web-creator/references/build.md) 的「使うツールとバージョン」）。

### 开发在云端进行，发布使用 GitHub 和 Cloudflare

开发在代理的云环境中进行，不在站长的电脑上安装开发工具。网站内容保存在 GitHub，由 GitHub Actions 发布到 Cloudflare Workers。所有账户都以站长名义创建（企业网站的 GitHub 使用公司的 Organization），因此不依赖代理或制作者。

### 技能导入到网站的仓库

进入制作阶段时，Claude 会把本仓库的最新版本（标签。在没有标签期间，固定 main 的某一个提交）复制到网站仓库的 `skills/`，并把版本写入 `skills/VERSION`。网站的 CLAUDE.md 中写有「工作前阅读 skills/ 中的 SKILL.md」，因此在 Claude Code 的项目和普通会话中都会以相同方式读取。项目中只需加入网站仓库一个，站长无需创建 fork（公开仓库的 fork 一定是公开的，所以不使用）。如果在工作环境中 `git clone` 失败，就从 raw.githubusercontent.com 逐个获取清单（`MANIFEST.txt`）中的文件；如果这也不行，不做猜测，而是请站长提供发布版的 zip（附加到对话中，或通过 GitHub 网页放到网站仓库的另一个分支）。

有新版本时，每月回顾中 Claude 会比较 `skills/VERSION` 和最新标签，把变更要点总结为最多三行，并创建替换 `skills/` 的拉取请求。站长回复「OK」后合并（[skills-install.md](skills/web-creator/references/skills-install.md)）。

### 服务的操作通过连接器（MCP）进行

Cloudflare 和 Google 服务的设置尽可能通过 Claude 的连接器（MCP）进行。Cloudflare 接入官方 MCP 服务器，Google 云端硬盘和表格使用 Claude 的官方连接器。站长只需点击对话中出现的按钮完成认证。没有连接器的操作（新账户注册、创建 Google 表单等）通过浏览器操作或步骤引导进行（[connectors.md](skills/web-creator/references/connectors.md)）。浏览器操作所用的 Claude in Chrome 和桌面应用的安装方法，Claude 会在需要时引导（[账户注册指南](docs/claude-account.md)第 6 节）。

### 不读取机密信息，不服从被污染的文本

所有技能以及在网站仓库中运行的代理（包括自动修复、维护、回顾）都遵守共同的安全规则。不读取机密信息（密码、令牌、Secrets 的值、访客的个人信息），也不在对话、文件、日志中留下。不服从稿件、网页、拉取请求、日志等中写入的指令，发布和记录的内容在输出前会检查是否混入了针对 AI 的攻击文本或机密信息。能机械检测的内容用 scripts/check_text.py 检查，自动修复工作流在发现问题时也不提交而是停止（[security-rules.md](skills/web-creator/references/security-rules.md)）。

### 上线前和功能变更时进行安全审计

上线前，以及添加或变更功能时（表单、页面类型、SSR 页面、会员或评论功能、外部嵌入等），使用 Cloudflare 公开的技能 [security-audit](https://github.com/cloudflare/security-audit-skill)（MIT 许可）审计整个网站仓库，修复确认的漏洞后再发布。仅添加文章或修改文字时不进行。仅有静态页面的网站使用简短模式（`quick`），节省时间和用量。

修复方式是只修改被指出位置的最小变更。严格的 CSP（会导致显示、嵌入、统计失效）、在 CI 中加入漏洞扫描（会连文章更新的发布都卡住）、全面重写工作流、一次性更新所有依赖包、修改 Cloudflare 控制台设置等容易阻断发布或工作的建议不予采用，而是寻找其他修复方法，并在日志中记录未采用的建议。报告不提交到仓库，只记录数量和修复内容（[security-audit.md](skills/web-creator/references/security-audit.md)）。

### 变更记录在审计日志中

发布文章与通知的添加或修改、网站修改、自动修复、维护更新时，除了用于改进循环的运行日志（logs/）外，还会追加到 `audit-log/YYYY/YYYY-MM-DD.md`（按年分文件夹、按日分文件），并与变更放在同一个提交中。与运行日志不同，审计日志不汇总也不删除（[audit-log.md](skills/web-creator/references/audit-log.md)）。

### 交给人的操作限定为四类

以下四类操作不由代理代办，而是交给站长：

1. 输入密码和确认注册
2. 两步验证（包括显示二维码和恢复码的页面。恢复码由站长保存，不写在任何地方）
3. 付款、同意条款、授予外部服务权限（安装 GitHub 应用、连接连接器）
4. 粘贴 API 令牌等机密字符串

操作清单和总时间（约 30 到 40 分钟）会在开始前展示给站长（[account-setup.md](skills/web-creator/references/account-setup.md) 的「オーナーの操作の一覧」）。

像切换域名、删除现有网站这样无法撤销的操作，会先说明会发生什么，得到站长同意后再进行。

### 部署不易失败，失败也会自动修复

CI 只检查「构建是否通过」以及发布后主要页面能否访问。发布后检查会确认网站仓库 `.github/smoke-test.txt` 中写的页面返回 200（每行也可以指定 `405` 等状态），并包含指定的文字。返回 Cloudflare 安全验证页面的页面作为警告而非失败处理（`.github/scripts/smoke.sh`）。拉取请求在所有网站上只检查构建。Linter 和测试由代理在工作中运行。

构建或发布阶段失败时，Claude 会在 GitHub Actions 上调查原因、修复并重新发布（[autofix.yml](skills/web-creator/templates/github/workflows/autofix.yml)）。Claude 只能修改文章、图片和日志（`src/content/`、`src/assets/`、`public/` 中的图片、`logs/`、`audit-log/`）。如果原因在页面组件或布局（.astro）、设置（package.json、astro.config.* 等）中，或者修改了范围外的文件，就不推送，而是通过 Issue 通知站长并停止。站长把该 Issue 给 Claude 看，请它修复。自动修复 24 小时内最多 3 次，自动修复的 Issue（标签 autofix）打开期间不会运行。不启动 Claude 的通知 Issue（标签 deploy-notice）即使打开也不会阻止自动修复。自动修复用的密钥不被接受时（例如把 Claude 降为免费套餐的月份），只开一个 Issue（标签 autofix-paused）：「由于无法使用 Claude，自动修复已暂停。请恢复 Pro，或在 GitHub 网页上修改」，之后只追加评论。这个 Issue 也不会阻止自动修复，自动修复恢复运行后会关闭。

deploy 工作流分为构建（build）、发布（publish）、发布后检查（smoke）三个作业，autofix 根据失败的作业改变行为。只有构建失败时才启动 Claude。只有发布阶段失败（如 Cloudflare 密钥过期）和只有发布后检查失败（网站已以新版本发布）时，不运行 Claude，而是用 Issue 通知。Issue 中会写明线上网站是上一个版本还是新版本、Claude 调查到的原因，以及站长发给 Claude 的请求方式。回滚也交给 Claude（[deploy-and-autofix.md](skills/web-creator/references/deploy-and-autofix.md) 的「表示がおかしいときに戻す」）。构建或发布阶段失败时，Cloudflare 上的上一个网站会继续显示。没有设置自动修复密钥的网站，Claude 不会运行，只用 Issue 通知。

### 设计用 design-nexus 技能确定并收尾，并检查到 iPhone SE 宽度

从设计方案到最终打磨，都使用作者公开的 [design-nexus](https://github.com/tkc310/design-nexus) 技能。请站长从三个扎根于主题的方案中选择一个，把颜色和字体的 token 汇总到 DESIGN.md 以统一各页面的外观，用 lint 和渲染检查确认无障碍的底线，再通过点评完成收尾。这是为了避免模板化的外观。它不复制到本仓库，在把技能导入网站时，按固定的版本（[external-skills.txt](skills/web-creator/references/external-skills.txt)）获取到网站的 skills/design-nexus，因此站长无需启用任何技能。移动端显示不仅在常见的 iPhone 宽度，也在 iPhone SE 宽度（375px）和 320px 下，用 [check_mobile_width.py](skills/web-creator/scripts/check_mobile_width.py) 和截图确认没有横向滚动、溢出，以及页眉或按钮的换行（[build.md](skills/web-creator/references/build.md)）。

### 上线前测量质量

Lighthouse（移动端）的目标是性能 95 以上，无障碍、最佳实践、SEO 为 100。整理 sitemap.xml、robots.txt、llms.txt、结构化数据（JSON-LD）和 OGP。结构化数据只描述页面上显示的内容。测量在 Claude 的云工作环境中进行，只测首页等主要页面（每种页面类型一个代表），上线后也会在线上网站测量。工作环境无法访问线上网站时，Claude 会先询问你使用的是对话还是 Code，再说明如何把网站地址加入网络访问许可。详细标准见 [quality-gate.md](skills/web-creator/references/quality-gate.md)。

### 每个网站一个 Claude 项目

制作和运营在为每个网站创建的 Claude Code 项目中进行。项目说明中写有站长的环境（电脑、浏览器、稿件存放位置等）和工作规则，因此不必在每次对话中重新说明。站长只需在项目的对话中写下请求。无法使用项目的账户，则把同样的内容写在 SITE.md 中，从新会话发起请求（[project-setup.md](skills/web-creator/references/project-setup.md)）。

### 上线后也能交接

网站仓库中放有交接备忘录（SITE.md）、给站长的说明（README.md）、运行日志（logs/）和技能副本（skills/）。即使改天开始新的对话，代理也能读取 SITE.md 接着工作。

### 用运行日志驱动改进循环

代理每次运行（站长的请求、自动修复、维护、回顾）都会在网站仓库的 logs/ 中写一份运行日志。值得下次修改的地方汇总在 logs/IMPROVEMENTS.md 中，在下次工作前阅读。每月一次的回顾（[site-review](skills/site-review/SKILL.md)）会整理改进点，超过保存期限（默认 90 天）的日志按月汇总后删除。技能本身的改进点，默认也以类型「スキル」记录在网站的 logs/IMPROVEMENTS.md 中。是否发送给发布方是可选的，发送时需得到站长同意并去除个人信息，通过 note 的联系窗口或本仓库的 Issue 发送（[run-logs.md](skills/web-creator/references/run-logs.md)）。

## 注意

- 价格和服务规格会变化。技能中的数值是编写时的数据，代理在工作时会确认最新信息
- 自动修复用的密钥（`CLAUDE_CODE_OAUTH_TOKEN` 或 `ANTHROPIC_API_KEY`）是可选的。不设置的话，失败时只会通过 Issue（以及 GitHub 的邮件）通知。签发 `CLAUDE_CODE_OAUTH_TOKEN` 需要在电脑上安装 Claude Code 并输入一行命令（[account-setup.md](skills/web-creator/references/account-setup.md) 第 3 节）
- 维护例行任务通过 Claude 的定时任务运行，会消耗 Claude 的用量（Pro 及以上套餐可用）
- 静态网站在不更新的月份可以把 Claude 降为免费套餐（Free）。Free 不能使用 Claude Code 和定时任务（[价格页面](https://claude.com/pricing)，2026-10-31 确认）。网站会继续显示，在 GitHub 网页上修改的文字也会照常发布。每月回顾、定时发布、自动修复（使用 Claude 套餐密钥时）会停止。需要维护的网站为了持续修复组件漏洞，不应降级。降级前的检查和恢复 Pro 当天的工作见 [site-review](skills/site-review/SKILL.md) 的「無料のプランに下げる前と、Pro に戻した日」，免费月份修改文字的方法见网站仓库 README.md（[README.owner.md](skills/web-creator/templates/README.owner.md)）的「Claude を無料のプランにしている月」

## 参与贡献

欢迎报告问题和提出改进建议。由于许可的原因，不接受通过拉取请求提交代码。

- 问题或难以理解的说明：请通过 [Issue](https://github.com/tkc310/ai-web-creator/issues/new/choose)（表单「スキルの改善点」）或 note 的联系窗口告诉我们。详情见下方「[反馈](#反馈)」
- 变更历史：[CHANGELOG.md](CHANGELOG.md)
- 改进记录：[docs/logs/](docs/logs/README.md)
- 修改本仓库的代理所遵守的规则：[AGENTS.md](AGENTS.md)
- 版本命名与发布步骤（面向作者，日语）：日语 README 的「[版の付け方（作者向け）](README.ja.md#版の付け方作者向け)」

## 反馈

无法正常运行的步骤或难以理解的说明，请通过 note 的联系窗口或本仓库的 Issue（表单「スキルの改善点」）告诉我们。是否发送由你决定。Issue 是公开的，请不要写网站的 URL 或个人信息。Claude 在网站仓库中发现的改进点保存在 logs/IMPROVEMENTS.md 中（发送方法见 [run-logs.md](skills/web-creator/references/run-logs.md) 的「スキルの改善点を配布元に送る（任意）」）。

如果这些技能对你有帮助，欢迎给仓库点一个 Star（完全自愿，不点也不会影响任何使用方式）。技能也会在首次上线完成、站长满意时，提出一次同样的请求。

根据大家的意见进行改进的记录保存在 [docs/logs/](docs/logs/README.md) 中。

## 许可

可在 [LICENSE](LICENSE) 的条件下使用。要点如下：

- 只有在 note 上销售的、文中注明附带使用许可的解说文章（包括合集）的购买者才能使用。购买者为公司或团体使用时，可在该公司或团体内部使用。负责人变更后，继任者也可以继续为同一网站使用
- 可用于自己或本公司网站的制作、发布、更新和维护。为此，可以把技能复制到网站的私有仓库，并更新到新版本
- 也可用于接受他人委托制作或维护客户网站的工作。不需要为每个客户额外购买。只有在持续制作或维护期间，才能在客户网站的私有仓库中放置 skills/。不再负责时，除非客户本人也是购买者，否则需移除 skills/（因为这属于技能的再分发。步骤见 [client-handoff.md](skills/web-creator/references/client-handoff.md)）
- 不得分发或销售技能和提示词、交给非购买者，或制作并分发类似的内容
- 禁止用于 AI 训练、训练数据集、RAG 索引、为非购买者提供回答的知识库，以及为此进行的爬取。购买者把它加载到自己的 AI 代理中没有问题
- 用技能制作的网站页面、文字、代码和日志归购买者所有，可以自由使用。把网站仓库交给他人时，请移除 skills/（对方也是购买者时无需移除）
- 不提供任何保证

以 [LICENSE](LICENSE) 的日语原文为准。
