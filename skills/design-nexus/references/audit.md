# Audit and critique

Use for **audit** mode and for step 7 of the build loop. Be specific and ranked; a vague critique is worthless.

## Procedure

1. Run `scripts/lint.mjs` and, if possible, `scripts/render-check.mjs`. Paste counts by tier.
2. Look at the screenshots at every width (or read the markup if no render).
3. Score each dimension 0–4 using the anchors below.
4. List findings ranked P0 → P3. Each: what, where (file:line or selector), why it matters for *this* subject and audience, and the fix.
5. End with the top three fixes you would make next. In build mode, make them.

## Dimensions

| Dim | 0 | 2 | 4 |
|---|---|---|---|
| Brief fit | Ignores the job or audience | Serves the job generically | Every major choice traces to the subject |
| Distinctiveness | Indistinguishable from a template | One memorable element, rest generic | Unmistakably this subject; signature lands |
| Hierarchy | No clear first read | First read clear, second unclear | Eye path is deliberate end to end |
| Typography | Default faces, chaotic sizes | Sound scale, uninspired pairing | Pairing has voice; scale and rhythm precise |
| Color | Clashing or low contrast | Safe and consistent | Roles disciplined; accent meaningful |
| Layout & rhythm | Cramped or uniform sections | Grid holds, rhythm flat | Spacing scale exact; structure varies with content |
| Responsive | Breaks on mobile | Works, mobile is an afterthought | Each width is designed |
| States & interaction | Missing focus/empty/error | Main states present | All states designed; motion purposeful |
| UX copy | Template or hype copy | Clear but bland | Specific, consistent verbs, useful errors |
| System consistency | Values ad hoc | Mostly tokens | Fully token-derived; DESIGN.md current |

The same dimensions and anchors are used by `eval/rubric.md` so audit results feed the improvement loop.

## Fresh-context review (deep budget)

When the agent supports subagents, give a new subagent only: the brief, the screenshots or file paths, the lint/render JSON, and this file. Ask for the scores and ranked findings as JSON. A reviewer that did not build the page sees what the builder rationalized.
