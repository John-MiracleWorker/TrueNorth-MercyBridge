## 2024-05-10 - Add aria labels and aria-pressed attributes to filter buttons and copy buttons
**Learning:** Adding descriptive `aria-label` attributes to icon-only buttons (like the copy button) and dynamically adding `aria-pressed` to filter toggles significantly improves accessibility for screen readers without altering the visual design.
**Action:** Always check for interactive elements that lack text content or rely purely on visual state, and enhance them with appropriate ARIA attributes.

## 2024-05-15 - Accessible Custom Radio Buttons
**Learning:** When using custom `<button>` groups as an alternative to standard `<input type="radio">` components, screen readers lose context of the options being part of a single group.
**Action:** Wrap the group of buttons in a `<div role="radiogroup" aria-labelledby="[label-id]">` and assign `role="radio"` and `aria-checked={boolean}` to the individual `<button>` elements to properly simulate radio selection semantics.
