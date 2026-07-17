## 2024-05-10 - Add aria labels and aria-pressed attributes to filter buttons and copy buttons
**Learning:** Adding descriptive `aria-label` attributes to icon-only buttons (like the copy button) and dynamically adding `aria-pressed` to filter toggles significantly improves accessibility for screen readers without altering the visual design.
**Action:** Always check for interactive elements that lack text content or rely purely on visual state, and enhance them with appropriate ARIA attributes.

## 2024-05-15 - Add semantic roles and focus to custom radio button groups
**Learning:** When using visually styled custom `button` groups to act as radio selectors (e.g., Category and Urgency selectors), screen readers and keyboard users completely lose context without correct semantic ARIA roles (`role="radiogroup"`, `role="radio"`, `aria-checked`, `aria-labelledby`) and visual focus styling (`focus-visible`).
**Action:** Whenever replacing standard `<select>` or `<input type="radio">` with custom components, explicitly declare the structure with `role="radiogroup"` and assign `role="radio"` with the `aria-checked` attribute on the items, along with visible keyboard focus styling.
