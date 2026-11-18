# Craft rules

Use these while building. They are defaults; the brief and DESIGN.md override them.

## Hierarchy
- **One primary action per view, and it is on the first screen.** Name it before building: the brief's verb (install, book, approve, save, sign up), or "none" for a view that is only read, said in NOTES.md. At 1280 and 768 it is the only filled, accent-colored control on the first screen (about 900px); at 320 it is on the first screen or in a one-line sticky bar. A long form keeps its save in a sticky footer. Secondary actions (copy a second command, run a demo, learn more) are outlined or text links, never the same weight. If the primary action cannot be used yet, it stays in place, visibly disabled, with the reason beside it, and the step that unblocks it carries the filled style. The render check flags a first filled action below the first screen as R25.
- Size, weight, and space carry hierarchy before color does. If you need color to show what's important, the hierarchy is weak.
- The hero is a thesis: open with the most characteristic thing in the subject's world (a real product screen, the actual data, the object itself), not "big headline + two buttons + gradient blob" by reflex.

## Typography
- Pair faces deliberately: a characterful display face used sparingly, a highly readable body face, optionally a utility face for figures and labels.
- Use a modular scale (1.2–1.333). No more than 5–6 distinct sizes on a page.
- Body 16–18px; measure 60–75 characters (Japanese: 30–40 characters, see `japanese.md`).
- **Secondary text is still text.** Anything a person reads to decide or act (hints, help, metadata, captions, legends, table cells, small print, errors) is 14px or more; 12–13px is only for a one- or two-word tag that repeats something visible nearby. Raise the floor to 16px when the brief's reader is tired, older, reading at a distance, or one-handed on a phone. Make secondary text secondary with color or weight, not by shrinking it, and never stack both: muted color is for 15px and up, so 14px text uses the body ink. The render check flags informative text below 14px as R20.
- Headings get tighter line-height (1.1–1.25) and `text-wrap: balance`; body gets 1.5–1.7 and `text-wrap: pretty`.
- Numbers in tables and stats use `font-variant-numeric: tabular-nums`.
- Never fake bold or italic; load the weights you use. Use `font-display: swap`.

## Color
- Build from roles (ink, surface, accent, status), not from a brand-color-everywhere approach.
- Neutrals carry 80–90% of the surface. Accent is rare enough to mean something.
- Tint neutrals slightly toward the accent hue rather than using pure gray.
- Status colors (success, warning, danger) are reserved for status.
- Dark mode is its own palette: raise surface lightness for elevation, desaturate accents, never pure #000 with pure #FFF body text for long reading.

## Layout and spacing
- A spacing scale from one base (4 or 8px). Every gap is a step on it.
- Group by proximity: space inside a group is smaller than space between groups.
- Align to a grid; let one element break it on purpose (the signature).
- Vary section structure. A page where every section is "heading + 3 cards" is a template.
- **The signature is a system, not a widget.** Name the unit it is built from (the kiln shelf, the ticket stub, the ruled ledger line, the timetable row) and build at least two other sections from that same unit, grid, or material, so the page reads as one object. Test: cover the signature. If the rest could belong to any product, it is still a template.
- **Retire the default section frame.** "Small kicker + heading + intro paragraph, then content" on every section is the agent's template rhythm. Give each section the structure its content needs (a table, a sequence, a single large figure, a two-up comparison) and let headings sit inside that structure.
- **No half-empty rows at desktop.** At 1280 and 1920, every row either fills its width with content or is a deliberately narrow measure. When one column of a row is much shorter than the other, rebalance (move content, span the short one, or stack) instead of leaving a void.
- Cards only when content is genuinely a collection of comparable items.

## Default render
The page as loaded, before any scroll, click, or wait, is what reviewers, screenshots, and most visitors see. It must show the work at its best.
- **The signature is visible and in its meaningful state on load.** Never gate it behind scroll-triggered drawing, a hover, or a tab. A reveal animation is fine only if the element is complete without it (and under `prefers-reduced-motion`).
- **Time- or data-dependent views fall back to a representative state.** If the real clock or data would show an empty or edge state (a closed shop, zero results, an expired offer), show a typical state by default and make the edge state reachable, or pin the demo to a stated time.
- **Sticky and fixed bars never cover content** at any checked width: keep them one line high at narrow widths, reserve their height with padding so the last field and paragraph stay visible, and check the screenshots for overlap.
- **Required states live in the product, not in a gallery.** Reviewers and users judge a state by how it looks inside the component that owns it. Build each state the brief asks for into that component, on the same code path real data would take (a fetch that can fail, a filter that can return nothing, a save that can be rejected). Let the representative data carry partial states, so the default render shows them in place: one row that failed to sync, with its retry; one day with no shifts; one request awaiting approval; one bus cancelled. Whole-view states (first load, total failure, first-run empty) are reached through the real flow (type a filter with no match, press retry, go offline) and listed in NOTES.md with how to reach each. Never add a specimen gallery, a "Preview" or "Example" frame, a demo switch, or static copies of states; a static copy with `role="alert"` or `role="status"` announces something that never happened.
- **The page never talks about itself.** It is the product, not a presentation of it. Notes to the owner or reviewer ("draft", "check before publishing", "placeholder name", "sample data", "replace with a real photo", "assumption", "not the real screen") go in NOTES.md and your report, never in visible copy or `alt` text. Write invented content so it would be safe to ship as an example: plausible names, round figures, no claims about real people or companies, no invented guarantees or prices presented as policy. List every invented fact in NOTES.md. The lint flags such notes as R19.

## Responsive
Design each width; don't let it happen. The middle width (about 768px, a tablet or a narrow laptop window) breaks most often, because desktop layouts get squeezed there and mobile layouts get stretched. The tools catch overflow, not ugliness: a layout can pass every check and still be broken.
- **Open the 320, 768, 1280, and 1920 screenshots in that order** and look at each one before saying a width works. At 768 look for squeezed components, overlapping labels, and orphaned columns.
- **At 320, the signature or the primary action appears within the first screen** (about 640px). Move intro copy below it, or shorten it.
- **Grid and flex children that hold tables, code, or long words get `min-width: 0`**, or they push their track wider than the screen.
- **Narrow widths reflow content; they don't delete it.** Hide only duplicates and decoration. Anything a desktop reader can read is still there at 320: stacked, shortened, or behind a labeled disclosure, never `display: none` (R18). Collapsing the navigation into a menu is fine.
- **A component that spans the page at desktop spans it at every width.** When a grid collapses, check that wide items (rulers, timelines, charts) still get the full row, not a narrow column.
- **Figures never wrap mid-number.** Prices, totals, dates, and counts get `white-space: nowrap`; a strip of figures drops to fewer columns before its longest figure stops fitting.
- **Commands, code, and log lines never wrap mid-token.** Give them `white-space: pre` (or `nowrap`) inside a container that scrolls horizontally, with a visible edge, or shorten the sample. Never use `overflow-wrap: anywhere` on code.
- **Short labels stay whole.** Buttons, tags, and nav items get `white-space: nowrap` and a layout that has room for them. In Japanese, wrap phrases in `word-break: auto-phrase` (or `keep-all` with `<wbr>` at phrase boundaries) so words like 今日は／こちら don't split; check the largest text setting too.
- **Headings beside a taller column use `align-self: start`**, so the kicker, heading, and paragraph stay together instead of stretching apart.
- **Illustrations and diagrams get a max size per breakpoint.** In a single column, keep a decorative or explanatory graphic under about half the viewport height. Text inside an SVG must stay at least 12px when rendered at 320px; otherwise switch to an HTML version or a simplified graphic.
- **A sideways scroll box is a last resort, not the fix.** At 320 and 768, a reader rarely swipes inside a box, so whatever sits past its edge is lost: the end of an install command, the net-pay column, the last days of a calendar strip. Before reaching for `overflow-x: auto`, reflow:
  - Commands and short code wrap (`white-space: pre-wrap; overflow-wrap: anywhere`), or break at flags with a continuation `\`; keep the copy button copying the one-line form.
  - Tables below about 640px become labelled blocks (each row a card, each cell with its header as a label), with the figure the reader acts on first in each block. A dense reference table may keep a scroll only if the identifying column stays fixed and the deciding column sits right after it.
  - Date strips and timelines become a grid that wraps (a month grid, a two-row week), not a strip that runs off the screen.
  - Log or sample output may scroll, but shorten its lines so the meaningful part (level, message) shows first. The render check flags content a scroll box hides as R24. A table never escapes its panel (R17).
- **The primary action keeps a deliberate position** at every width, not wherever wrapping leaves it.
- **Wide screens are designed too.** Above 1440px, cap the measure and let the layout use the space on purpose, not a narrow centered column floating in empty ground.

## Components and states
- Every interactive element has: default, hover, focus-visible, active, disabled. Inputs also: error, with message tied by `aria-describedby`.
- Every data view has: loading (skeleton matching final layout), empty (explains and invites), error (what happened + how to fix), and overflow (long names, many items).
- Buttons say what they do ("Save changes", not "Submit").

## Imagery and icons
- Prefer real artifacts of the subject over stock. If using photos, credit them and size them (`width`/`height`) to avoid layout shift.
- One icon set, one stroke width. Icons support labels; they rarely replace them.
- No emoji as UI icons.

## Code quality
- Tokens as CSS custom properties (or the project's theme file). No stray hex values.
- Avoid `transition: all`; list properties. Animate `transform` and `opacity`.
- Watch specificity collisions (e.g. `.section` padding vs `.cta` padding) — check the rendered result, not the stylesheet.
- Semantic HTML first: `header`, `nav`, `main`, `section` with headings, `button` for actions, `a` for navigation.
