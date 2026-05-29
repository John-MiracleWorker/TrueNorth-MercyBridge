## 2024-05-10 - Add aria labels and aria-pressed attributes to filter buttons and copy buttons
**Learning:** Adding descriptive `aria-label` attributes to icon-only buttons (like the copy button) and dynamically adding `aria-pressed` to filter toggles significantly improves accessibility for screen readers without altering the visual design.
**Action:** Always check for interactive elements that lack text content or rely purely on visual state, and enhance them with appropriate ARIA attributes.

## 2024-05-24 - Add ARIA Roles to Custom Button Selectors
**Learning:** Custom button groups acting as radio button selectors lack semantic meaning for screen readers. Adding `role="radiogroup"` to the container and `role="radio"` with `aria-checked` to the buttons makes the context and state clear to assistive technologies.
**Action:** When creating form inputs out of `<div>` and `<button>` elements, always ensure appropriate ARIA roles (`radiogroup`, `radio`, `checkbox`, etc.) and state attributes are applied to maintain accessibility.
