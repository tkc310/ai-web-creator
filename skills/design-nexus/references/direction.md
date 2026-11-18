# Direction: from subject to token plan

## 1. Ground the subject

Write three sentences before anything visual:

- **Subject**: what this is, in the subject's own vocabulary (a ceramics studio, a payroll tool for clinics, a CLI for log search).
- **Audience**: who arrives, what they already know, what they fear or want.
- **Job**: the single thing this page or screen must get done. One verb.

If the brief is vague, choose a concrete subject and say you chose it. Pull from the subject's world: its materials, instruments, documents, units, rituals, and real artifacts. A tide-table app borrows from nautical almanacs; a tax tool borrows from forms and ledgers. That borrowed vernacular is where distinctiveness comes from, not from effects.

## 2. Infer from the product type

Use these defaults only as a starting hypothesis, then argue with them.

| Product type | Usually wants | Usually avoid |
|---|---|---|
| Developer tool / CLI | Monospace utility face, dense information, real code and output as hero | Abstract 3D blobs, stock photos of people |
| Finance / B2B ops | Calm palette, tabular figures, precise alignment, trust through specifics | Playful bouncy motion, neon |
| Health / care | Warm but clinical clarity, generous spacing, plain language | Alarm red as brand color, jargon |
| Consumer lifestyle / food / craft | Material photography, characterful display type, tactile texture | Dashboard-like cards, generic SaaS grids |
| Creative portfolio / agency | One strong idea executed fully, editorial type, unusual layout | Template sections (features / testimonials / pricing) by reflex |
| Education / docs | Readable measure (60–75ch), strong wayfinding, code/figure styling | Decorative motion, low-contrast gray text |
| Data dashboard / admin | Quiet surfaces, aligned numerals, restrained color reserved for status and data | Gradients on cards, oversized hero headers |
| Public sector / civic | Maximum legibility and contrast, predictable patterns | Novelty for its own sake |

## 3. Three directions

Directions must differ on at least three axes, not only palette:

| Axis | Range to pick from |
|---|---|
| Structure | single column · split · grid of artifacts · full-bleed sequence · table/board · canvas/diagram-led |
| Value and temperature | light warm · light cool · mid-tone · dark · saturated ground |
| Type genre | grotesk · humanist sans · serif · slab · mono-led · condensed display · rounded · script/hand accent |
| Surface | flat hairlines · cards with real elevation · photographic · illustrated · textured material |
| Density and energy | airy and calm · dense and precise · loud and maximal |

At least one of the three must be a direction you would not pick by habit (dark, saturated, maximal, photographic, or playful) and argued from the subject, not added for contrast. Format, two lines each:

```
A — "<name>": <what it borrows from the subject's world>; <what leads the page>.
B — …
C — …
Recommend <X> because <the subject-specific reason>.
```

### Avoid the house look

Agents that follow rules like these drift into one recognizable look: pale cool paper, one ink-blue or teal accent plus a highlighter yellow, serif body with mono micro-labels, hairline rules, 2–4px corners, no shadows, and a dark closing band. It is tasteful and it is still a template (R04d). Use it only when the subject genuinely calls for a printed-document feel, and never as the default.

Steering away from a named look tends to land on its nearest neighbor: cool paper becomes sage paper, teal becomes forest green, and every page ends up with the same pale tinted ground and one warm accent. So don't choose colors by moving away from something. Choose them from the subject: every color in the token plan names its source in the subject's world (the glaze, the ticket stock, the ledger ruling, the terminal phosphor). A tinted ground with no source is a habit; use a true neutral or the source color instead. Vary value and chroma, not only hue: of the three directions, at least one has a ground that is not pale.

### Spread the candidates before choosing

Sourcing a color from the subject is necessary, not sufficient: every subject contains something warm (lamp light, wood, clay, paper, signage, warning tape), so "sourced" picks still pile up on one amber-to-orange accent and one familiar display face. Decide by comparison, not by first association:

- **Accent**: name three candidates from the subject, at least 90° apart in hue or very different in chroma (a muted ink, a saturated signal, a near-neutral), each with its source. Choose the one that carries meaning here (what the user acts on, what the subject owns, what the status means), and write one line on why not the other two. If the winner is the warmest of the three, the reason must be specific to this subject, not "warm and friendly".
- **Display face**: name three candidates from different type genres (axis table above) and choose by what the subject's own lettering looks like (its signage, labels, documents, screens), not by legibility alone; legibility is the body face's job.

If `DESIGN.md` has a *Looks used* list, or you know earlier pages you built in this session, read it first and pick a direction that differs from the last two on value, ground hue, type genre, and surface.

## 4. Token plan

Write the plan in this shape. The values are yours to choose; there are deliberately no example values here, so nothing anchors them.

```
Colors (4–6, named by role in the subject's vocabulary):
  <name>  #RRGGBB  role (text / ground / surface / accent / status) — source: where in the subject's world it comes from
  accent candidates: <three hues ≥90° apart, each with a source> → chosen: <one> because <subject-specific reason>
Type:
  display  "<family>" <weights> — where it is used, how many sizes (candidates: three genres → chosen because …)
  body     "<family>" <weight> — size, line-height
  utility  "<family>" (optional) — figures, labels
  scale    ratio from base
  loading  how each family is loaded (font CDN link, @font-face, or a system stack you accept)
Spacing: base and section rhythm
Shape: radius and elevation rules (shadows, borders, or neither, and why)
Layout: one-sentence concept + ASCII wireframe
Signature: the one element the page will be remembered for
```

Two plans that both pass this skill, to show the range. They describe where values come from, not the values, because example values get copied:

- A night-market food guide: ground and accents sampled from the stalls' signage and lantern light, so the page is dark and loud; a condensed display face at poster sizes; a dense photo grid; signature = a map strip lit stall by stall.
- A municipal permit form: the ground is the paper of the printed form, the accent is the city's own color from its seal; a humanist sans at generous sizes, large tap targets, no decoration at all; signature = a progress rail that shows every remaining step and its time estimate.

## 5. Challenge the plan

For each line ask: would this appear on any similar page? If yes, change it and record why. Then compare against R04 (the three default looks) and R01/R02 in `checks.md`. Finally confirm the token pairs pass contrast with `scripts/tokens-check.mjs`.

## When the brief or DESIGN.md already decides

Follow it exactly, even if it matches a default look. Skip directions; still write the token plan as a restatement so the build derives from it.
