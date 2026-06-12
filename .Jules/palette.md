## 2024-05-10 - Add aria labels and aria-pressed attributes to filter buttons and copy buttons
**Learning:** Adding descriptive `aria-label` attributes to icon-only buttons (like the copy button) and dynamically adding `aria-pressed` to filter toggles significantly improves accessibility for screen readers without altering the visual design.
**Action:** Always check for interactive elements that lack text content or rely purely on visual state, and enhance them with appropriate ARIA attributes.

## 2024-05-14 - Use ARIA roles for custom button-based radio groups
**Learning:** When using a grid of `<button>` elements to act visually as radio options (e.g., selecting a category or urgency), it is essential to wrap them in a `<div role="radiogroup">` and add `role="radio"` and `aria-checked` attributes to the buttons. This ensures screen readers announce the options correctly rather than treating them as unrelated buttons.
**Action:** When converting standard `<input type="radio">` or `<select>` elements into custom button groups for better styling, always apply `role="radiogroup"` and `role="radio"` with the proper `aria-checked` and `aria-labelledby` attributes.
