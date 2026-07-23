## 2024-05-10 - Add aria labels and aria-pressed attributes to filter buttons and copy buttons
**Learning:** Adding descriptive `aria-label` attributes to icon-only buttons (like the copy button) and dynamically adding `aria-pressed` to filter toggles significantly improves accessibility for screen readers without altering the visual design.
**Action:** Always check for interactive elements that lack text content or rely purely on visual state, and enhance them with appropriate ARIA attributes.
## 2024-05-28 - Custom Radio Group Accessibility
**Learning:** When using custom UI (like Tailwind-styled buttons) to simulate `<input type="radio">` choices, adding just an `onClick` creates accessibility black holes. Screen readers cannot deduce that the distinct `<button>` elements are mutually exclusive choices in a single group.
**Action:** Always wrap the custom option list in a `<div role="radiogroup">` and connect it to its visual label using `aria-labelledby`. Ensure individual options have `role="radio"` and track their selected state properly using `aria-checked` instead of `aria-pressed`.
