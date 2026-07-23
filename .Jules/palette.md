## 2024-05-10 - Add aria labels and aria-pressed attributes to filter buttons and copy buttons
**Learning:** Adding descriptive `aria-label` attributes to icon-only buttons (like the copy button) and dynamically adding `aria-pressed` to filter toggles significantly improves accessibility for screen readers without altering the visual design.
**Action:** Always check for interactive elements that lack text content or rely purely on visual state, and enhance them with appropriate ARIA attributes.

## 2024-05-15 - Improve accessibility for custom button radio groups
**Learning:** When using custom button groups to act as radio selectors, wrapping the group in a `<div role="radiogroup" aria-labelledby="...">` and assigning `role="radio"` and `aria-checked` attributes to the individual `<button>` elements maintains context and state for screen readers, bridging the gap between visual design and semantics.
**Action:** Always add semantic roles (`radiogroup` and `radio`) and states (`aria-checked`) when building standard form inputs with visually customized button components to preserve accessibility.
