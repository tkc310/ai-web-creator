# Motion

Motion explains change. If it doesn't explain anything, remove it. (Rules adapted from Emil Kowalski's design-engineering skills.)

## Should it animate? Decide by frequency

| How often the user sees it | Motion |
|---|---|
| 100+ times a day (keyboard shortcuts, command palette) | None |
| Tens of times a day (hover, list navigation) | Remove or greatly reduce |
| Occasionally (modals, drawers, toasts) | Standard |
| Rarely / first time (onboarding, success, celebration) | Room for delight |

Each animation needs a purpose: spatial continuity, state change, explanation, press feedback, or softening a jarring change. "Looks cool" on frequent UI is not a purpose. Prefer **one orchestrated moment** per page over scattered effects.

## Easing

- Enter and exit: **ease-out**. Moving or morphing on screen: ease-in-out. Hover/color: ease. Constant motion (progress, marquee): linear.
- **Never ease-in for UI**: it delays the first frames, which are the ones users watch.
- Use stronger curves than the CSS keywords:
  `--ease-out: cubic-bezier(0.23, 1, 0.32, 1); --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1); --ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);`

## Duration

| Element | Duration |
|---|---|
| Button press | 100–160ms |
| Tooltip, small popover | 125–200ms |
| Dropdown, select | 150–250ms |
| Modal, drawer | 200–500ms |

Keep UI animation under ~300ms. Exits are faster than entries. Faster feels faster.

## Component rules

- Buttons: `:active { transform: scale(0.97) }` for instant press feedback.
- Enter from `scale(0.95)` + `opacity: 0`, never from `scale(0)`.
- Popovers grow from their trigger (`transform-origin`); modals stay centered.
- Tooltips: delay the first; adjacent ones open instantly with no animation.
- Interruptible UI uses CSS transitions, not keyframes. Springs for drag and gestures (bounce 0.1–0.3).
- Stagger 30–80ms per item, never blocking interaction.
- Gate hover effects with `@media (hover: hover) and (pointer: fine)`.
- Entry without JS: `@starting-style`.

## Performance

- Animate only `transform` and `opacity`. Animating `width`, `height`, `padding`, `margin`, `top`, `left` triggers layout.
- Don't animate CSS variables on a parent (restyles every child). Keep `blur()` under 20px.
- CSS for predetermined motion; JS (or Web Animations API) for dynamic, interruptible motion.

## Reduced motion

Under `prefers-reduced-motion: reduce`, motion is "fewer and gentler", not necessarily zero: keep opacity and color transitions, remove movement, scale, and parallax. Never hide content behind an animation that won't run.

## Review

Slow animations down 2–5× or step frame by frame to check timing. Test gestures on a real device.
