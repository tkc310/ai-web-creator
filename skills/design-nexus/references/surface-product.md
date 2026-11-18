# Surface: product UI (dashboards, admin, settings, tools)

- **Quiet surfaces.** Neutral backgrounds, hairline or subtle-elevation separation, color reserved for status, selection, and data.
- **Density is a feature.** Default to compact rows (32–40px), tabular numerals, right-aligned numbers, left-aligned text. Offer a comfortable density only if users need it.
- **Alignment over decoration.** Shared column edges across panels; labels and values on a consistent baseline.
- **Navigation**: persistent and predictable (sidebar or top bar), current location always visible, breadcrumbs for depth > 2.
- **Tables**: sticky header, sortable columns marked, row hover, empty/loading/error states, truncation with the full value on focus or expand (not hover alone), bulk actions appear on selection.
- **Forms**: labels above fields, helper text below, inline validation on blur, errors that explain the fix, primary action at the end of the flow, destructive actions confirmed and visually distinct.
- **Charts**: start from the question the chart answers; label directly instead of legends where possible; one highlight color against neutrals; no 3D, no gratuitous gradients.
- **Feedback**: every action acknowledges within 100ms (state change, spinner, toast). Toasts use the verb of the action ("Archived").
- **Keyboard**: focus order follows layout; shortcuts for frequent actions; Escape closes overlays.
- No marketing hero on product screens. The page title states where you are and the primary action sits next to it.
