## 2024-05-10 - Add aria labels and aria-pressed attributes to filter buttons and copy buttons
**Learning:** Adding descriptive `aria-label` attributes to icon-only buttons (like the copy button) and dynamically adding `aria-pressed` to filter toggles significantly improves accessibility for screen readers without altering the visual design.
**Action:** Always check for interactive elements that lack text content or rely purely on visual state, and enhance them with appropriate ARIA attributes.

## 2026-06-04 - Accessible Custom Radio Groups
**Learning:** When using standard `<button>` elements styled as cards to function as a radio group (single selection from multiple options), screen readers cannot infer this relationship or the current selection state automatically. Adding `role="radiogroup"` to the container and `role="radio"` with dynamic `aria-checked` attributes to the buttons is required for assistive technologies to correctly interpret and announce the UI.
**Action:** When creating custom radio buttons (like selectable cards or pill toggles) that replace native `<input type="radio">`, ensure the container has `role="radiogroup"` (with an accessible name via `aria-labelledby`) and the individual buttons have `role="radio"` and `aria-checked`.
