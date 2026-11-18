# Working alongside other tools

design-nexus keeps the direction, the tokens, and the Floor. Other skills or tools may own the medium or the parts. Never let them become a second art director.

| Situation | Hand to | design-nexus still owns |
|---|---|---|
| The project uses a component library (shadcn/ui, Radix, MUI, Chakra, Mantine) | The library's own skill or docs for installing and composing parts | Theme tokens: override the library's default radius, neutrals, and accent so its stock look doesn't leak (R04, R06). Density, type, signature. |
| The deliverable is a Figma file | Figma's MCP skills (`figma-generate-design`, `figma-use`) for writing layers, reusing published components and variables | The direction and token plan, written first; Floor checks on any code built from it |
| The deliverable is a Canva design, social sizes, or a brand-kit check | Canva's skills (`edit-design`, `resize-for-social-media`, `brand-check`) | Copy and hierarchy guidance; contrast of the brand palette (`tokens-check.mjs`) |
| Google Stitch or a `DESIGN.md` in Google's spec format | Stitch skills for generation | `tokens-check.mjs` and `lint.mjs --design` read that format's front matter as well |
| Motion-heavy or gesture work | Read `motion.md` first; a dedicated motion skill may refine curves | The frequency test: what should not animate at all |

When two sources disagree, the order of authority in `SKILL.md` decides. Say which source you followed.
