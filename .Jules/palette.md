## 2024-05-10 - Add aria labels and aria-pressed attributes to filter buttons and copy buttons
**Learning:** Adding descriptive `aria-label` attributes to icon-only buttons (like the copy button) and dynamically adding `aria-pressed` to filter toggles significantly improves accessibility for screen readers without altering the visual design.
**Action:** Always check for interactive elements that lack text content or rely purely on visual state, and enhance them with appropriate ARIA attributes.

## 2026-06-22 - Add ARIA Roles to Custom Radio Button Groups
**Learning:** When replacing standard `<select>` or `<input type="radio">` elements with custom button groups for UI styling, using `role="radiogroup"` with an `aria-labelledby` attribute and applying `role="radio"` along with `aria-checked` on the children correctly maintains the logical grouping and state context for screen readers.
**Action:** Always wrap custom radio inputs in a `role="radiogroup"` and apply `role="radio"` to the interactive children to preserve semantic structure and accessibility.
