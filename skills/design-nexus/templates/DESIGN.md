# DESIGN.md

The single source of truth for this project's design. Agents read it before any UI work and update it after. Keep it short; link to code for detail.

## Subject

- Subject:
- Audience:
- Job of the main surface:
- Surface type: marketing | product | mobile | content

## Direction

One paragraph: the concept, what it borrows from the subject's world, and the signature element.

## Tokens

Machine-readable. `scripts/tokens-check.mjs` and `scripts/lint.mjs --design` parse this block.

```tokens
color.bg: #RRGGBB
color.surface: #RRGGBB
color.text: #RRGGBB
color.muted: #RRGGBB
color.accent: #RRGGBB
color.on-accent: #RRGGBB
color.border: #RRGGBB
color.danger: #RRGGBB
dark.color.bg: #RRGGBB
dark.color.text: #RRGGBB
dark.color.accent: #RRGGBB
dark.color.on-accent: #RRGGBB
font.display: "<family>", <generic>
font.body: "<family>", <generic>
font.utility: "<family>", <generic>
type.base: 16px
type.ratio: 1.25
space.base: 4px
radius.default: <px>
pairs: text/bg, muted/bg, text/surface, on-accent/accent, accent/bg
```

Replace every `#RRGGBB` and `<family>`; delete the `dark.` lines if there is no dark scheme. Then run `node scripts/tokens-check.mjs DESIGN.md`. A Google-format `DESIGN.md` (YAML front matter with `colors`, `typography`, `components`) is read too.

## Patterns

- Buttons:
- Inputs and forms:
- Cards / panels:
- Tables:
- Navigation:
- Motion:

## Page overrides

Pages that intentionally deviate. Format: `path — what differs — why`.

## Looks used

One line per shipped surface: value (light/dark/mid), ground hue and accent hue, type genre, surface treatment. Read before choosing a new direction.

## Learnings

Dated notes on what worked, what was rejected, and user feedback. Agents append here during retro.
