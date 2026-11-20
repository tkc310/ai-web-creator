<div align="center">

**English** | [日本語](README.ja.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | [한국어](README.ko.md)

# ai-web-creator

**Skills and prompts that let you build, publish, and keep running a website of the kind you used to order from a web agency, just by talking to Claude**

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

If these skills help you, a ⭐ Star on the repository would mean a lot.

[Quick start](#quick-start) ・ [Features](#features) ・ [Documentation](#documentation) ・ [Skill layout](#skill-layout) ・ [Feedback](#feedback) ・ [License](#license)

</div>

---

Skills and prompts for handing the creation, publishing, and ongoing operation of a website (landing page, corporate site, blog, or media site) to Claude, the AI agent. The goal is that people who are not familiar with IT can own a safe, well-designed website just by talking with Claude.

> [!IMPORTANT]
> Anyone can read this repository, but it is not open source. It may be used only by purchasers of the companion articles sold on note that state they include a license for these skills (including the magazine that bundles the articles). See [LICENSE](LICENSE) and the [License](#license) section below.

> [!NOTE]
> The skills, documents, and prompts are written in Japanese, and the companion articles are sold in Japanese. This page is a translation for convenience. If it differs from the [Japanese README](README.ja.md) or [LICENSE](LICENSE), the Japanese text prevails.

## Features

- **Done through conversation**: answer multiple-choice questions, and Claude takes you through planning, design, building, and publishing. You never have to pick technologies by name
- **After launch, just ask**: send the key points of a news item or blog post, and Claude drafts, proofreads, previews, and publishes it. There is no admin panel
- **Deploys that rarely fail, and fix themselves when they do**: CI only checks the build and the live site after publishing. If an article update breaks the build, Claude fixes it on GitHub Actions and publishes again
- **Quality measured before launch**: Lighthouse (mobile) targets 95+ for Performance and 100 for the rest. SEO and AIO are covered with sitemap.xml, llms.txt, JSON-LD, and OGP
- **Safe by design**: secrets are never read, and instructions hidden in drafts or web pages are never followed. A security audit runs before launch and whenever features change
- **The owner owns everything**: all GitHub and Cloudflare accounts are in the owner's name. Nothing depends on the agent or the builder
- **Built-in improvement loop**: run logs, audit logs, and improvement notes are kept, and a monthly review improves both the skills and the site

## Quick start

Send the following message in a Claude chat (paid plan). See [Requirements](#requirements) below for what you need.

```
Load the skills (the skills folder) at https://github.com/tkc310/ai-web-creator
and help me build my website.
Once loaded, first tell me the version of the skills you loaded (the newest heading in CHANGELOG.md).
I am not familiar with IT.
Please give me choices when you ask questions, and ask at most four at a time.
```

Claude asks multiple-choice questions and takes you through planning, building, and publishing. After launch you never need to open an admin panel: send the key points of a news item or blog post as bullet points, and Claude drafts, proofreads, and publishes it. For sites with articles, you get to try the whole flow once with Claude right after launch: write the draft in a Claude document, check it in a preview, reply "OK", and it goes live. Changes are shown as an HTML preview in a Claude artifact before they are published. Tell Claude in the chat what you want changed (on Team and Enterprise you can also select text or images on the preview and comment). Claude also walks you through creating and setting up your GitHub and Cloudflare accounts. When building starts, you move to Claude Code (claude.ai/code). There, Claude copies the latest version of these skills into the skills/ folder of your site's repository. No fork of this repository is made. See [How to use the skills and prompts](docs/how-to-use.md) (Japanese) for details. Updates and questions after launch also only take a message to Claude. Other ways to ask are in [prompts/README.md](prompts/README.md) (Japanese).

## Requirements

- A paid Claude plan (Pro or Max). Team and Enterprise also work, but follow the steps that do not use Claude Code projects ([project-setup.md](skills/web-creator/references/project-setup.md)). Once a static site is finished, you can drop to the Free plan in months without updates (see [Notes](#notes))
- A GitHub account (the free plan is fine)
- A Cloudflare account (the free plan is fine)
- A domain for the site's address (if you don't have one, you get one along the way)
- "Code execution and file creation" turned on under Claude's "Capabilities" settings (used to load the skills from GitHub; if you can't turn it on, see "段階1" in [how-to-use.md](docs/how-to-use.md))

Claude guides you through creating the GitHub and Cloudflare accounts along the way. Each person uses their own login, and for a company site the GitHub repository goes in the company's Organization (GitHub's terms do not allow one login to be shared by several people; see [account-setup.md](skills/web-creator/references/account-setup.md)). The key for automatic fixes is optional; you can publish without it (see [Notes](#notes)). Visits start being counted with Cloudflare Web Analytics (free, no cookies) once a custom domain is connected ([analytics.md](skills/web-creator/references/analytics.md)).

## Not supported

The target is "sites that present information": company or shop sites, landing pages, blogs, and media sites with up to a few thousand articles. The following are not supported. Even then, the skills can still help you make a mock-up or specification to hand to a web agency.

- Media sites with more than several thousand articles
- Client work where the client posts through an admin panel after launch (sites built with these skills have no admin panel; updates are requested from Claude)
- Member accounts for visitors, and comments written by visitors
- Business systems such as online shops (e-commerce), payments, or booking

## Documentation

All documents are in Japanese.

- [Claude account sign-up guide](docs/claude-account.md): creating an account, paid plans, settings to make first, connecting GitHub
- [How to use the skills and prompts](docs/how-to-use.md): the flow from consultation to building, publishing, and operating
- [Building a contact form](docs/forms.md): Google Forms (link or embed) and a form that matches the site's look (Cloudflare Email Sending), plus other services and caveats
- [Using with Cursor or ChatGPT](docs/other-agents.md): loading the skills in agents other than Claude, and substitutes for Claude-only features

## Models

Which models to use and how much reasoning effort to apply are summarized in [versions.md](skills/web-creator/references/versions.md). Planning and design use effort high; building (creating, updating, maintaining, auto-fixing) uses effort medium. These are set in the skills' frontmatter, the subagent definition (templates/claude/agents/site-builder.md), the site repository's `.claude/settings.json`, and the arguments of the auto-fix workflow; versions.md also lists every place the same value is written.

## Contents

| Folder | Contents |
|---|---|
| [skills/web-creator](skills/web-creator/SKILL.md) | The skill that runs the whole site build: hearing, choosing the technology, preparing accounts, design and building, pre-launch quality checks, publishing, auto-fix |
| [skills/site-content-update](skills/site-content-update/SKILL.md) | Updating articles and news after launch. Reads drafts from the chat, Google Docs, or Claude documents and publishes them. If no place for the draft is given, the owner writes it in a Claude document, and it is published after an "OK" on the preview (the standard flow) |
| [skills/site-maintenance](skills/site-maintenance/SKILL.md) | Scheduled maintenance for sites that need it. Brings the stack up to date on the 1st and 15th of every month. Small updates (patch and minor) go to main after checks; large ones (major and GitHub Actions) are left as pull requests for the owner's OK |
| [skills/site-review](skills/site-review/SKILL.md) | Reviewing run logs. Sorts out and applies improvements, and summarizes then deletes old logs month by month. Also handles the checks before dropping Claude to the Free plan and the tasks on the day you return to Pro |
| [tkc310/design-nexus](https://github.com/tkc310/design-nexus) (referenced) | The design skill. Decides the direction from three options and a token plan, keeps the look consistent with DESIGN.md, and verifies with lint and render checks. Not stored in this repository; at install time the version in [external-skills.txt](skills/web-creator/references/external-skills.txt) is fetched into the site's skills/design-nexus |
| [skills/runtime-update](skills/runtime-update/SKILL.md) | Keeps Node.js (latest LTS), pnpm, and dependencies up to date, and the Workers compatibility_date current |
| [prompts](prompts/README.md) | Prompts the site owner can copy and use |
| [docs/verification](docs/verification/README.md) | Records of verifying the setup: results of building and measuring samples before adding something to the skills |
| [.github](.github/workflows/check-skills.yml) | Checks for this repository itself (bash syntax in Markdown, YAML, check_text.py, MANIFEST.txt, no return of outdated setups), the release workflow, and the issue form for sending improvements. Not copied to site repositories |

## Skill layout

```
skills/
├── web-creator/
│   ├── SKILL.md                 … the overall flow and how to talk with the owner
│   ├── references/              … details for each step (read when needed)
│   │   ├── hearing.md
│   │   ├── stack-selection.md   … everything is Astro; what is out of scope, static or partly SSR
│   │   ├── versions.md          … the baseline for models and versions (other files refer here)
│   │   ├── external-skills.txt  … versions of referenced skills (design-nexus)
│   │   ├── skills-install.md    … installing and updating the skills in the site repository's skills/
│   │   ├── account-setup.md
│   │   ├── connectors.md        … connectors (MCP) for Cloudflare and Google
│   │   ├── project-setup.md     … a Claude project per site
│   │   ├── build.md
│   │   ├── quality-gate.md
│   │   ├── deploy-and-autofix.md … publishing, post-publish checks, auto-fix (allowed scope and limits)
│   │   ├── forms.md             … contact forms (Google Forms / Cloudflare Email Sending)
│   │   ├── analytics.md         … analytics (Cloudflare Web Analytics)
│   │   ├── migration.md         … moving from WordPress or STUDIO
│   │   ├── client-handoff.md    … handing a site over to a client (removing skills/)
│   │   ├── preview.md
│   │   ├── article-tutorial.md  … adding the first article together with the owner after launch
│   │   ├── run-logs.md          … run logs and the improvement loop
│   │   ├── audit-log.md         … audit log
│   │   ├── security-audit.md    … security audits before launch and when features change
│   │   └── security-rules.md    … safety rules (shared by all skills)
│   ├── scripts/                 … fetch_external_skills.sh (fetches design-nexus), run_lighthouse.sh, check_mobile_width.py (iPhone SE width), make_preview.py, check_text.py (secrets and injection checks)
│   └── templates/               … SITE.md, AGENTS.md.tmpl and CLAUDE.md.tmpl (drop .tmpl when placing them at the site root), project instructions, handoff message (handoff.md), logs, IMPROVEMENTS.md, workflows, smoke-test.txt and scripts/smoke.sh (post-publish checks), dependabot.yml (GitHub Actions only), pnpm-workspace.yaml, llms.txt, JSON-LD, forms (forms/), and more
├── site-content-update/
│   ├── SKILL.md                 … the standard flow for adding articles and news
│   ├── scripts/                 … optimize_images.py (strips photo metadata and compresses)
│   └── templates/               … article-draft.md (draft template for Claude documents)
├── site-maintenance/
│   ├── SKILL.md
│   └── references/              … how to set up the routine, and its prompt
├── site-review/
│   └── SKILL.md                 … reviews, and summarizing and deleting old logs
├── runtime-update/
│   └── SKILL.md
└── (design-nexus/)              … the design skill; not stored here, fetched from tkc310/design-nexus when installed into a site
```

## Design principles

### Every site is built with Astro

One-page landing pages and sites with articles are all built with Astro. With a single way of building, adding news or pages to a landing page later just means adding them to the same repository. The owner never chooses technology names; the agent only decides the following ([stack-selection.md](skills/web-creator/references/stack-selection.md)):

- Whether the site is out of scope (see [Not supported](#not-supported))
- Whether every page is output statically (SSG) or only some pages use SSR. SSG is the default; only pages that need processing on every request, such as handling a contact form submission, use SSR
- The shape of the site (one page / multiple pages / with articles)

Media sites with many articles are fine with Astro's static build up to a few thousand articles (about 7 seconds for 3,000 and about 18 seconds for 10,000; [verification record](docs/verification/2026-10-25_media-json-ssr/README.md)). Media beyond several thousand articles are out of scope not because of build time, but because searching and organizing articles as Markdown files becomes too heavy a burden.

Member accounts and comments are out of scope because mistakes in how personal data is stored or operated easily become security holes, and they are not something to recommend to users who are not developers.

### Sites that need maintenance are maintained automatically twice a month

When some pages use SSR, dependency code runs on the live site, so the site is treated as "needing maintenance".

- A Claude scheduled task (formerly called a routine) runs on the 1st and 15th of each month and updates Node.js (latest LTS), pnpm, and dependencies, and the Workers compatibility_date. Small updates (patch and minor) go to main once the build and checks pass. Large updates (major and GitHub Actions) are left as pull requests and merged only after the owner's OK in the next conversation. Unattended runs never merge pull requests ([site-maintenance](skills/site-maintenance/SKILL.md), [runtime-update](skills/runtime-update/SKILL.md))
- Versions published less than three days ago are not installed (to avoid attacks that ship a hijacked version right after publishing). Vulnerabilities are checked with `pnpm audit`, and serious ones are fixed first
- Dependabot is used only for GitHub Actions updates (the reason is under "時点つきの事実" in [versions.md](skills/web-creator/references/versions.md)). Dependabot pull requests are not merged automatically; Claude reads the changes during maintenance or reviews and checks with the owner
- Updates that need a paid plan or a new Cloudflare service, or that change the license, are not merged automatically; the owner is asked first

Static-only sites do not set up this maintenance because no dependency code runs on the live site. Instead, they are updated the same way during the monthly review ([site-review](skills/site-review/SKILL.md)).

### The stack always uses the latest versions

Sites are built with the latest LTS of Node.js (what Node.js officially recommends for production; never Current before it becomes LTS, and never odd-numbered releases), the latest pnpm for package management, and the latest dependencies, and are kept current through the maintenance and reviews above (the baseline is in [versions.md](skills/web-creator/references/versions.md); how to build is under "使うツールとバージョン" in [build.md](skills/web-creator/references/build.md)).

### Development happens in the cloud; publishing uses GitHub and Cloudflare

Development happens in the agent's cloud environment, and no development tools are installed on the owner's computer. The site's content is stored on GitHub and published from GitHub Actions to Cloudflare Workers. All accounts are created in the owner's name (for a company site, GitHub uses the company's Organization), so nothing depends on the agent or the builder.

### Skills are copied into the site's repository

When building starts, Claude copies the latest version of this repository (a tag; until there is a tag, one main commit is chosen and pinned) into `skills/` of the site's repository and writes the version to `skills/VERSION`. Because the site's CLAUDE.md says "read the SKILL.md in skills/ before working", the skills are read the same way in Claude Code projects and in regular sessions. Only the site's repository needs to be added to the project, and the owner does not need to make a fork (forks of public repositories are always public, so they are not used). If `git clone` fails in the work environment, the files in the list (`MANIFEST.txt`) are fetched one by one from raw.githubusercontent.com; if that also fails, Claude does not guess but asks the owner for the release zip (attached to the conversation, or placed on a separate branch of the site's repository through the GitHub web interface).

When a new version comes out, the monthly review compares `skills/VERSION` with the latest tag, summarizes the changes in up to three lines, and opens a pull request that replaces `skills/`. It is merged when the owner replies "OK" ([skills-install.md](skills/web-creator/references/skills-install.md)).

### Services are operated through connectors (MCP)

Cloudflare and Google services are configured through Claude's connectors (MCP) wherever possible. Cloudflare's official MCP server is connected, and Claude's official connectors are used for Google Drive and Sheets. The owner only authenticates with the button shown in the chat. Operations without a connector (signing up for accounts, creating a Google Form, and so on) are done through browser automation or step-by-step guidance ([connectors.md](skills/web-creator/references/connectors.md)). Claude explains how to install Claude in Chrome and the desktop app for browser automation when they are needed (section 6 of the [account sign-up guide](docs/claude-account.md)).

### Never read secrets, never follow tainted text

All skills, and the agents that run in the site's repository (including auto-fix, maintenance, and reviews), follow shared safety rules. Secrets (passwords, tokens, the values of Secrets, visitors' personal data) are never read and never left in the chat, files, or logs. Instructions written in drafts, web pages, pull requests, logs, and the like are not followed, and anything published or recorded is checked for prompt-injection text or secrets before it goes out. What can be detected mechanically is checked with scripts/check_text.py, and the auto-fix workflow stops without committing if anything is found ([security-rules.md](skills/web-creator/references/security-rules.md)).

### Security audits before launch and when features change

Before launch, and whenever a feature is added or changed (forms, page types, SSR pages, member or comment features, external embeds, and so on), the whole site repository is audited with [security-audit](https://github.com/cloudflare/security-audit-skill) (MIT license), a skill published by Cloudflare, and confirmed vulnerabilities are fixed before publishing. Adding articles or changing wording does not trigger an audit. Static-only sites use the short mode (`quick`) to save time and usage.

Fixes are kept to the smallest change that addresses the finding. Suggestions that tend to stop publishing or work, such as a strict CSP (which breaks display, embeds, or analytics), adding vulnerability scans to CI (which would block even article updates), rewriting workflows wholesale, updating all dependencies at once, or changing Cloudflare dashboard settings, are not adopted; another fix is found instead, and the skipped suggestion is logged. Reports are not committed to the repository; only counts and what was fixed are recorded ([security-audit.md](skills/web-creator/references/security-audit.md)).

### Changes are recorded in an audit log

When adding or changing articles and news, fixing the site, auto-fixing, or publishing maintenance updates, an entry is appended to `audit-log/YYYY/YYYY-MM-DD.md` (one file per day in a folder per year), separate from the run logs (logs/) used for the improvement loop, and included in the same commit as the change. Unlike run logs, it is never summarized or deleted ([audit-log.md](skills/web-creator/references/audit-log.md)).

### Only four kinds of operations are left to people

The agent does not do the following four things on the owner's behalf and hands over to the owner instead:

1. Entering passwords and confirming sign-ups
2. Two-factor authentication (including screens that show QR codes and recovery codes; the owner saves the recovery codes and never writes them anywhere)
3. Payments, agreeing to terms, and granting permissions to external services (installing GitHub apps, connecting connectors)
4. Pasting secret strings such as API tokens

The list of operations and the total time (about 30 to 40 minutes) are shown to the owner before starting ("オーナーの操作の一覧" in [account-setup.md](skills/web-creator/references/account-setup.md)).

Irreversible operations such as switching a domain or deleting an existing site are done only after explaining what will happen and getting the owner's consent.

### Deploys rarely fail, and fix themselves when they do

CI only checks that "the build passes" and that the main pages can be viewed after publishing. The post-publish check confirms that the pages listed in the site repository's `.github/smoke-test.txt` return 200 (each line can also specify a status such as `405`) and contain the expected text. A page that returns Cloudflare's security challenge screen is a warning, not a failure (`.github/scripts/smoke.sh`). Pull requests on every site only check the build. Linters and tests are run by the agent while it works.

If the build or publish stage fails, Claude investigates and fixes the cause on GitHub Actions and publishes again ([autofix.yml](skills/web-creator/templates/github/workflows/autofix.yml)). Claude may only change articles, images, and logs (`src/content/`, `src/assets/`, images in `public/`, `logs/`, `audit-log/`). If the cause is in page components or layouts (.astro) or settings (package.json, astro.config.*, and so on), or if a file outside the scope was changed, it does not push; it reports to the owner with an issue and stops. The owner then shows that issue to Claude to get it fixed. Auto-fix runs at most three times in 24 hours, and does not run while an auto-fix issue (label autofix) is open. Notification issues that do not start Claude (label deploy-notice) do not block auto-fix even when open. When the auto-fix key is rejected (for example in a month when Claude was dropped to the Free plan), a single issue (label autofix-paused) saying "Auto-fix is paused because Claude is unavailable. Return to Pro or fix it on GitHub" is opened, and later failures add comments to it. This issue does not block auto-fix either, and it is closed once auto-fix runs again.

The deploy workflow is split into three jobs: build, publish, and post-publish check (smoke), and autofix behaves differently depending on which job failed. Claude is started only when the build fails. Failures only in the publish stage (such as an expired Cloudflare key) and failures only in the post-publish check (the site is already live with the new version) are reported with an issue without running Claude. The issue says whether the live site is the previous or the new version, the cause Claude found, and what the owner should send to Claude. Rolling back is also requested from Claude ("表示がおかしいときに戻す" in [deploy-and-autofix.md](skills/web-creator/references/deploy-and-autofix.md)). If the build or publish stage fails, the previous site stays live on Cloudflare. On sites without an auto-fix key, Claude does not run and only an issue is opened.

### Design is decided and finished with the design-nexus skill, and checked down to iPhone SE width

Everything from design options to the final polish is done with [design-nexus](https://github.com/tkc310/design-nexus), a skill published by the author. The owner picks one of three options rooted in the subject, color and type tokens are collected in DESIGN.md to keep pages consistent, lint and render checks confirm the accessibility floor, and a critique pass finishes the work. This avoids a template-like look. It is not copied into this repository; when the skills are installed into a site, the pinned version ([external-skills.txt](skills/web-creator/references/external-skills.txt)) is fetched into the site's skills/design-nexus, so the owner does not have to enable any skill. Mobile display is checked not only at typical iPhone widths but also at iPhone SE width (375px) and 320px for horizontal scrolling, overflow, and wrapping in the header or buttons, using [check_mobile_width.py](skills/web-creator/scripts/check_mobile_width.py) and screenshots ([build.md](skills/web-creator/references/build.md)).

### Quality is measured before launch

Lighthouse (mobile) targets 95+ for Performance and 100 for Accessibility, Best Practices, and SEO. sitemap.xml, robots.txt, llms.txt, structured data (JSON-LD), and OGP are set up. Structured data only describes what is shown on the page. Measurements are taken in Claude's cloud work environment, only on key pages such as the top page (one representative per page type), and again on the live site after launch. If the work environment cannot reach the live site, Claude asks whether you are using chat or Code and then explains how to add the site's address to the network allowlist. The detailed criteria are in [quality-gate.md](skills/web-creator/references/quality-gate.md).

### A Claude project for each site

Building and operating happen in a Claude Code project created for each site. The project instructions describe the owner's environment (computer, browser, where drafts are kept, and so on) and the working rules, so nothing has to be explained again in each conversation. The owner just writes requests in the project's conversation. For accounts that cannot use projects, the same content goes in SITE.md, and requests are made from new sessions ([project-setup.md](skills/web-creator/references/project-setup.md)).

### Easy to hand over after launch

The site's repository holds a handover memo (SITE.md), an explanation for the owner (README.md), run logs (logs/), and the copy of the skills (skills/). Even when a new conversation starts on another day, the agent reads SITE.md and continues where it left off.

### Run logs drive the improvement loop

Every time the agent runs (an owner request, auto-fix, maintenance, a review), it writes one run log in the site repository's logs/. Points worth fixing next time are collected in logs/IMPROVEMENTS.md and read before the next task. The monthly review ([site-review](skills/site-review/SKILL.md)) sorts out the improvements, and logs older than the retention period (90 days by default) are summarized by month and deleted. Improvements for the skills themselves are, by default, kept in the site's logs/IMPROVEMENTS.md with the type "スキル". Sending them to the distributor is optional; if sent, it is done with the owner's consent and with personal data removed, through the note contact form or an issue on this repository ([run-logs.md](skills/web-creator/references/run-logs.md)).

## Notes

- Prices and service specifications change. Numbers in the skills are as of writing, and the agent checks the latest information when it works
- The auto-fix key (`CLAUDE_CODE_OAUTH_TOKEN` or `ANTHROPIC_API_KEY`) is optional. Without it, failures are only reported by an issue (and GitHub's email). Issuing `CLAUDE_CODE_OAUTH_TOKEN` requires installing Claude Code on a computer and typing one command (section 3 of [account-setup.md](skills/web-creator/references/account-setup.md))
- The maintenance routine runs as a Claude scheduled task, so it uses your Claude usage (available on Pro and above)
- For static sites, you can drop Claude to the Free plan in months without updates. Free does not include Claude Code or scheduled tasks ([pricing page](https://claude.com/pricing), checked 2026-10-31). The site stays online, and text you fix on GitHub's web interface still gets published. The monthly review, scheduled posts, and auto-fix (when using a Claude plan key) stop. Sites that need maintenance should not be dropped, so that vulnerabilities in components keep getting fixed. The checks before dropping and the tasks on the day you return to Pro are under "無料のプランに下げる前と、Pro に戻した日" in [site-review](skills/site-review/SKILL.md), and how to fix text in a Free month is under "Claude を無料のプランにしている月" in the site repository's README.md ([README.owner.md](skills/web-creator/templates/README.owner.md))

## Contributing

Bug reports and suggestions are welcome. Because of the license, code contributions through pull requests are not accepted.

- Bugs or unclear explanations: let us know through an [issue](https://github.com/tkc310/ai-web-creator/issues/new/choose) (form "スキルの改善点") or the note contact form. See [Feedback](#feedback) below
- Change history: [CHANGELOG.md](CHANGELOG.md)
- Improvement records: [docs/logs/](docs/logs/README.md)
- Rules for agents that edit this repository: [AGENTS.md](AGENTS.md)
- Versioning and release procedure (for the author, in Japanese): "[版の付け方（作者向け）](README.ja.md#版の付け方作者向け)" in the Japanese README

## Feedback

Please tell us about steps that did not work or explanations that were hard to follow, through the note contact form or an issue on this repository (form "スキルの改善点"). Sending feedback is optional. Issues are public, so do not include your site's URL or personal information. Improvements Claude finds in your site's repository are kept in logs/IMPROVEMENTS.md (how to send them: "スキルの改善点を配布元に送る（任意）" in [run-logs.md](skills/web-creator/references/run-logs.md)).

If these skills help you, a Star on the repository would mean a lot (it is optional, and nothing about how you use the skills changes either way). The skills also make the same request once, after the first launch, when the owner is happy with the result.

Records of improvements made based on feedback are kept in [docs/logs/](docs/logs/README.md).

## License

You may use this under the terms of [LICENSE](LICENSE). The key points are:

- Only purchasers of the companion articles sold on note that state they include this license (including the magazine) may use it. When a purchaser uses it for a company or organization, it may be used within that company or organization. If the person in charge changes, the successor may keep using it for the same site
- You may use it to build, publish, update, and maintain your own or your company's site. For that purpose, you may copy the skills into the site's private repository and update them to new versions
- You may also use it for client work, building or maintaining sites at others' request. No additional purchase per client is needed. skills/ may stay in the client site's private repository only while you are building or maintaining it. When you step away, remove skills/ unless the client is also a purchaser (leaving it would redistribute the skills; steps are in [client-handoff.md](skills/web-creator/references/client-handoff.md))
- You may not distribute or sell the skills or prompts, give them to non-purchasers, or make and distribute something similar
- Using it for AI training, training datasets, RAG indexes, or knowledge bases that answer non-purchasers, and crawling for those purposes, is prohibited. Purchasers loading it into their own AI agent is fine
- Pages, text, code, and logs of sites built with the skills belong to the purchaser and may be used freely. When handing a site's repository to someone else, remove skills/ (no need if they are also a purchaser)
- There is no warranty

The Japanese text of [LICENSE](LICENSE) governs.
