---
name: design-nexus
description: Design and verify distinctive, accessible UI (landing pages, product/dashboard screens, mobile, redesigns, audits). Use when building or restyling any interface, reviewing UI quality, or setting up a project's DESIGN.md. Includes a zero-dependency lint, optional render check, and a self-improvement loop.
---

# design-nexus

You are the design lead on this task. The job is an interface that fits its subject so well it could not be mistaken for a template, built to a quality floor that never ships broken, and checked by tools rather than by your own say-so.

## Order of authority

When instructions disagree, the higher one wins. Never load another design skill as an equal authority alongside this one.

1. The user's brief and explicit requests.
2. The project's `DESIGN.md` (and `PRODUCT.md` if present).
3. The **Floor** checks in `references/checks.md`.
4. This skill's defaults and references.

## Pick a mode

| Mode | Trigger | Read |
|---|---|---|
| **build** | New page, screen, or component | `references/direction.md`, `references/craft.md`, surface reference |
| **redesign** | Restyle or rebuild something that exists | `references/redesign.md`, then as build |
| **audit** | "review", "critique", "what's wrong with" | `references/checks.md`, `references/audit.md` |
| **steer** | One-word adjustments: bolder, quieter, distill, colorize, typeset, relayout, animate, de-animate, densify, airy, polish, harden | `references/steer.md` |
| **system** | No `DESIGN.md` yet and work will span several screens, or the user asks to set up a design system | `templates/DESIGN.md`, `references/direction.md` |
| **retro** | After the user gives design feedback, or at the end of a session | `references/retro.md` |

Pick the surface too, and read only that reference: `references/surface-marketing.md` (landing, portfolio, launch), `references/surface-product.md` (dashboards, admin, settings, data tools), `references/surface-mobile.md` (iOS, Android, React Native, small screens). Read `references/japanese.md` whenever the UI contains Japanese text. Read `references/motion.md` before adding any animation. Read `references/handoff.md` when the project uses a component library, or the deliverable is a Figma or Canva file.

## Budget

State the budget you chose in one line before starting.

- **quick** (one component, a small fix): skip the three directions; one render or lint pass.
- **standard** (default; one page or screen): full build loop, up to 2 fix rounds.
- **deep** (flagship page, brand-defining work, or the user asks): full loop, hero reviewed alone first, fresh-context review, up to 3 fix rounds.

## Build loop

1. **Ground.** Read `DESIGN.md` if it exists and obey it. Otherwise name the subject, the audience, and the page's single job in one sentence each. If the brief is ambiguous, ask at most five intake questions in one message, and only those whose answer would change the direction (audience, the one action, brand constraints, real material such as copy, numbers, screenshots, logos, and — only if it would change the direction — whether to incorporate current trends). If the agent cannot wait for answers, state your assumptions and proceed. Do not assume the user wants trends. Use plausible, specific content from the subject's world when real material is missing, and say so in NOTES.md and your report, not on the page. Never invent testimonials, metrics, or customer logos presented as real.

   **Trends.** Open the trend database only when this hearing shows the user wants current trends incorporated (流行を取り入れたい, or an equivalent request). If they do not, or you assumed an answer, do not open it.

   Prefer `docs/design-trends/` at the design-nexus repository root when `docs/design-trends/latest.md` exists. It is the source of truth, and the Claude Code plugin ships the repo, so the same path is present there. Otherwise use `design-trends/` beside this skill (the copy install writes next to the skill). From the directory you resolved, read `latest.md`, then `index.md`, then only the relevant files in its `trends/` folder. Do not load the database from AGENTS.md or CLAUDE.md.

   Before adopting any candidate, judge whether it helps this project: fit with purpose, audience, and brand; accessibility and performance impact; 確度 (低, 低〜中, and 未確認 are not grounds to adopt); status fading or dropped; `#mature` (not a reason to look new); `#anti-pattern` (do not apply the warned-against look; an item that is itself the warning, such as T01, may still be followed); and the item's 避ける場面. Adopt only items that pass. State in one line why each candidate was adopted or rejected. If none pass, adopt none.

2. **Directions** (standard/deep). Propose three directions that differ on structure, value, type genre, and surface (`references/direction.md` §3), at least one outside your habits. Each is two lines: a name, and what makes it belong to this subject. Recommend one and proceed with it unless the user picks.
3. **Token plan.** Before code, write: 4–6 named colors with hex, their role, and their source in the subject's world, with the accent and display face each chosen from three spread candidates (`references/direction.md` §3), type roles (display / body / utility) with families, a scale, and how each is loaded, a spacing base, radius and elevation rules, a one-sentence layout concept with an ASCII wireframe, and the **signature**: the one element the page will be remembered for, plus the unit it is built from and which other sections reuse that unit (`references/craft.md` *Layout and spacing*).
4. **Challenge the plan.** For every item ask "would this appear on any similar page?" Revise what would, and say what changed. Check the plan against the default looks in `references/checks.md` (R04 a–d, including the agent house look).
5. **Build** exactly the revised plan. Every color and size comes from the tokens; express them as CSS custom properties or the project's theme. Spend boldness in one place, keep the rest quiet.
6. **Verify with tools.** Run the lint, then the render check if available (see Tools). Fix every Floor finding. A Reflex finding is either fixed or kept with a one-line reason written in a code comment `design-nexus: keep R03 because ...`.
7. **Critique.** Check first that the default render, before any scroll or interaction, shows the signature in its meaningful state (`references/craft.md` *Default render*). Then look at the screenshots at 320, 768, 1280, and 1920 (or the code, if no render is possible) against `references/audit.md` and `references/craft.md` *Responsive*. Cover the signature in the 1280 screenshot: if the rest could belong to any product, that is the first problem. List the top three problems, fix them, re-verify. Repeat up to the budget's round limit. In **deep**, ask a fresh-context subagent to run the audit when the agent supports subagents.
8. **Remove one accessory** before finishing: the least necessary decoration, effect, or label.
9. **Record.** Update `DESIGN.md` with new tokens or patterns, add rejected ideas to its *Learnings*, and add one line to *Looks used* (value, ground and accent hue, type genre, surface), so later work doesn't repeat itself. Record what shipped, not what was planned: the lint flags DESIGN.md colors the code doesn't use (N09), and every claim in your report or notes (a removed shadow, a fixed state) must be true of the final code.

Report at the end: the direction, the signature, the lint and render results (counts by tier), and anything kept with a reason.

## Tools

Scripts live in this skill's `scripts/` folder. They need only Node 26.13.0+. Paths below are relative to the skill folder; resolve them from wherever the skill is installed.

```bash
node scripts/lint.mjs <file-or-dir> [--design DESIGN.md] [--json]   # static checks, no dependencies
node scripts/render-check.mjs <file.html|url> [--out dir] [--json]  # needs Playwright; skips cleanly without it
node scripts/tokens-check.mjs DESIGN.md                             # contrast and coherence of the token plan
```

Exit code 2 means Floor findings exist: the work is not done. If Node is unavailable, apply `references/checks.md` by reading the code yourself and say that the tools did not run.

## Non-negotiables (Floor)

These apply in every mode and every budget. Full list with IDs in `references/checks.md`.

- Text contrast at least 4.5:1 (3:1 for 24px+ or 19px+ bold). Focus is always visible. Every interactive element is reachable and operable by keyboard and has an accessible name that includes the words it shows. Form fields have a border or fill of at least 3:1 against their surface.
- Works from 320px wide with no horizontal scroll, and nothing the reader must read or copy waits past the edge of a sideways scroll box. Tap targets at least 24px (44px on mobile surfaces).
- Motion respects `prefers-reduced-motion`. Nothing essential depends on hover alone.
- Images have meaningful `alt` (or `alt=""` when decorative). Form fields have labels. Errors say what happened and how to fix it.
- In redesign mode, no link or form field from the before-snapshot disappears, and no button, heading, or handler is dropped, without the user's agreement.

## Copy

Words are design material. Name things by what the user controls ("Manage notifications", not "Configure webhooks"). Keep verbs consistent: a "Publish" button produces a "Published" toast. Sentence case. Empty states invite the next action. Avoid hype words and template phrases listed in check R10.
