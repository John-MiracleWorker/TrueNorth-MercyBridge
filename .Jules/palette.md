## 2024-05-10 - Add aria labels and aria-pressed attributes to filter buttons and copy buttons
**Learning:** Adding descriptive `aria-label` attributes to icon-only buttons (like the copy button) and dynamically adding `aria-pressed` to filter toggles significantly improves accessibility for screen readers without altering the visual design.
**Action:** Always check for interactive elements that lack text content or rely purely on visual state, and enhance them with appropriate ARIA attributes.

## 2026-06-06 - Add semantic roles to custom radio button groups
**Learning:** When using custom button groups in place of standard radio inputs, screen readers lack context without explicit ARIA roles. Using `role="radiogroup"` on the container, properly linked via `aria-labelledby` to its label's `id`, along with `role="radio"` and dynamic `aria-checked` on the individual buttons, restores native radio accessibility semantics without altering visual design.
**Action:** Always wrap custom radio-style selection buttons with `role="radiogroup"` and apply `role="radio"` and `aria-checked` to the choices.
