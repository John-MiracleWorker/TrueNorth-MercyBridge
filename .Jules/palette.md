## 2024-05-10 - Add aria labels and aria-pressed attributes to filter buttons and copy buttons
**Learning:** Adding descriptive `aria-label` attributes to icon-only buttons (like the copy button) and dynamically adding `aria-pressed` to filter toggles significantly improves accessibility for screen readers without altering the visual design.
**Action:** Always check for interactive elements that lack text content or rely purely on visual state, and enhance them with appropriate ARIA attributes.

## 2026-06-02 - Custom Radio Button Group Accessibility
**Learning:** Custom button groups used for selection (acting like radio buttons) aren't identified properly by screen readers, making forms hard to navigate.
**Action:** Wrapped the group in a `<div role="radiogroup" aria-labelledby="[label-id]">` and added `role="radio"` and `aria-checked={boolean}` to the individual buttons.
