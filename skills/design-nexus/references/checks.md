# Checks

Three tiers. IDs match `scripts/lint.mjs` and `scripts/render-check.mjs` output.

- **Floor (F)**: never ships. Fix every one. Lint exits with code 2 while any remain.
- **Reflex (R)**: an AI-default tell. Fix it, or keep it with a reason: `design-nexus: keep R02 because the brand gradient is mandated`. A kept item must be listed in the final report.
- **Finish (N)**: polish. Fix when budget allows.

Audit severity maps as: Floor → P0, Reflex that hurts the brief → P1, other Reflex → P2, Finish → P3.

## Floor

| ID | Check | Detected by |
|---|---|---|
| F01 | Text contrast below 4.5:1 (3:1 for large text), at rest or inside a control on hover or keyboard focus; UI component contrast below 3:1, including a text field, select, or textarea whose border, fill, or drawn wrapper is below 3:1 against its surface | render, tokens |
| F02 | Focus indicator removed or invisible | lint, render |
| F03 | Image without `alt` | lint |
| F04 | HTML document missing `lang` or viewport meta | lint |
| F05 | Animation without a `prefers-reduced-motion` path | lint, render |
| F06 | Click handler on a non-interactive element without role and keyboard support | lint |
| F07 | Form field without a programmatic label (placeholder is not a label) | lint |
| F08 | Horizontal scroll at 320px or other tested widths | render |
| F09 | Tap target smaller than 24×24px (44px on mobile surfaces) | render |
| F10 | Icon-only button or link without an accessible name | lint |
| F11 | Redesign lost a link, field, handler, or heading from the before-snapshot (a field that gained a name, id, label, or more specific text type still counts as kept) | render `--compare` |
| F12 | Text smaller than 12px | lint, render |
| F13 | A control's `aria-label` leaves out words it shows (WCAG 2.5.3 Label in Name); toggles' on/off state text is exempt | render |

## Reflex

| ID | Tell | Detected by |
|---|---|---|
| R01 | An overused default face as the primary family (Inter, Roboto, Arial, Helvetica, Open Sans, Poppins, Montserrat, Lato, bare system-ui; Japanese: Noto Sans JP alone with no other voice) | lint |
| R02 | Purple/indigo/violet gradient as default decoration | lint |
| R03 | Gradient-filled text | lint |
| R04 | One of the three default looks, unless the brief asks for it: (a) warm cream background + high-contrast serif + terracotta accent; (b) near-black background + single acid-green or vermilion accent; (c) broadsheet hairlines, zero radius, dense columns; (d) the agent house look: pale cool paper, one ink-blue or teal accent plus highlighter yellow, serif body with mono micro-labels, hairline rules, 2–4px radius, no shadows, dark closing band | audit, eval diversity |
| R05 | Emoji used as icons in headings, buttons, or list markers | lint |
| R06 | Large uniform radius on everything | lint |
| R07 | Glassmorphism (backdrop blur) on many surfaces | lint |
| R08 | Color sprawl: more than 12 distinct colors, or colors outside DESIGN.md tokens | lint |
| R09 | Template hero: centered headline + subhead + "Get started" / "Learn more" pair over a gradient blob; or "big number, small label, gradient accent" stat strip | lint (partial), audit |
| R10 | Template or hype copy: lorem ipsum, "Welcome to", "Unlock", "Elevate", "Seamless", "Revolutionize", "Supercharge", "Empower", "Next-generation", "Cutting-edge", "Game-changer"; 「革新的な」「次世代の」「シームレスな」「〜を加速」「圧倒的な」 | lint |
| R11 | Numbered markers (01 / 02 / 03) that don't encode a real sequence | lint (hint), audit |
| R12 | `transition: all` | lint |
| R13 | Feature grid of identical icon-in-a-circle cards | audit |
| R14 | Japanese text set with italic or negative letter-spacing (lint), or multi-line Japanese running text below line-height 1.6 (render) | lint, render |
| R15 | Every section has the same structure (heading + cards) | audit |
| R16 | A font named in CSS is never loaded (no `@font-face`, font CDN link, or `next/font`), so visitors see a fallback and the type plan never appears | lint |
| R17 | Layout break inside a container at some width: in-flow content escaping a bordered or filled panel, text cut off by `overflow: hidden`, or a figure (price, count, date) wrapping mid-number | render |
| R18 | Content removed at the narrowest width instead of reflowed: text readable at 1280px is hidden (`display: none`, zero size) at 320px. Navigation and `aria-hidden` decoration are exempt | render |
| R19 | The page talks about itself: a note to the owner or reviewer in visible copy or `alt` text ("sample data", "placeholder name", "before publishing", "draft note", TODO;「サンプルデータ」「ダミー」「表示見本」「実際の画面ではありません」「公開前に確認」). Move it to NOTES.md | lint |
| R20 | Informative text below 14px at 1280: three or more blocks of hints, metadata, captions, table cells, or errors set at 12–13px | render |
| R21 | Text drawn over other text at some width (a collapsed totals row, a label under a button), after clipping by overflow and visually-hidden containers; content scrolling under a fixed or sticky bar is not counted | render |
| R24 | At 768px or narrower, a sideways scroll box (not a nav, tab or chip strip) hides at least 20% of its width with text past its edge: a command's end, a table's columns, a date strip | render |
| R25 | At 1280 or 768, the first enabled filled action (a button or link with a solid fill that stands out from its surface) starts below the first screen (900px) | render |

## Finish

| ID | Check | Detected by |
|---|---|---|
| N01 | `z-index` of 1000 or more | lint |
| N02 | More than 5 `!important` in a file | lint |
| N03 | More than 10 inline styles in a file | lint |
| N04 | Image without `width`/`height` (layout shift) | lint |
| N05 | HTML document missing `<title>` or meta description | lint |
| N06 | Broken image | render |
| N07 | Headings without `text-wrap: balance` | lint (hint) |
| N08 | Token plan incomplete or odd (same display and body family, no spacing base, type ratio outside 1.1–1.618) | tokens |
| N09 | DESIGN.md and the code disagree: a DESIGN.md color is not used in the code, or a same-named custom property holds a different value (checked when the scan includes the theme) | lint `--design` |

## Without tools

If scripts cannot run, walk this list by reading the code and the brief. State in the report that checks were manual, and which IDs you could not verify (F01, F08, F09 need a render).
