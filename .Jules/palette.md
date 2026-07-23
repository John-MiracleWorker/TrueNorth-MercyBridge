## 2024-05-10 - Add aria labels and aria-pressed attributes to filter buttons and copy buttons
**Learning:** Adding descriptive `aria-label` attributes to icon-only buttons (like the copy button) and dynamically adding `aria-pressed` to filter toggles significantly improves accessibility for screen readers without altering the visual design.
**Action:** Always check for interactive elements that lack text content or rely purely on visual state, and enhance them with appropriate ARIA attributes.

## 2024-05-30 - Accessible Custom Radio Buttons
**Learning:** When replacing standard `<select>` or `<input type="radio">` elements with custom button groups to act as radio selectors, wrapping the group in a `<div role="radiogroup" aria-labelledby="...">` and using `role="radio"` with the `aria-checked` attribute on the individual custom buttons maintains context and state for screen readers.
**Action:** Always verify that custom form controls (like selectable button grids for categories or urgency) implement the correct ARIA roles and state attributes so they function properly for assistive technologies.
