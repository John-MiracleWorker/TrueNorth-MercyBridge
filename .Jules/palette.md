## 2024-05-10 - Add aria labels and aria-pressed attributes to filter buttons and copy buttons
**Learning:** Adding descriptive `aria-label` attributes to icon-only buttons (like the copy button) and dynamically adding `aria-pressed` to filter toggles significantly improves accessibility for screen readers without altering the visual design.
**Action:** Always check for interactive elements that lack text content or rely purely on visual state, and enhance them with appropriate ARIA attributes.
## 2026-06-19 - Missing ARIA roles on custom radio button groups
**Learning:** When using custom `<button>` elements to act as radio selectors (e.g., in a grid format like Category or Urgency), it is crucial to use `role="radiogroup"` on the container, `aria-labelledby` linking it to the section label, and `role="radio"` with `aria-checked` on the buttons themselves. This ensures screen readers can announce the element types, selected state, and context properly.
**Action:** Always add proper radiogroup and radio roles with state attributes when replacing standard `<select>` or `<input type="radio">` with custom button layouts.
