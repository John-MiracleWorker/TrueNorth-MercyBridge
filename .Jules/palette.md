## 2024-05-10 - Add aria labels and aria-pressed attributes to filter buttons and copy buttons
**Learning:** Adding descriptive `aria-label` attributes to icon-only buttons (like the copy button) and dynamically adding `aria-pressed` to filter toggles significantly improves accessibility for screen readers without altering the visual design.
**Action:** Always check for interactive elements that lack text content or rely purely on visual state, and enhance them with appropriate ARIA attributes.
## 2026-07-06 - Accessible Custom Radio Buttons
**Learning:** When standard `<input type="radio">` elements are replaced by custom buttons (like category or urgency selectors), screen reader users lose the ability to know what is selected and what grouping the buttons belong to. Using basic buttons doesn't naturally communicate their group state or active status to assistive technology.
**Action:** Use `role="radiogroup"` on the container paired with `aria-labelledby` pointing to the group label's `id`. For each item, apply `role="radio"` and `aria-checked={boolean}` to ensure state is announced, and always ensure `focus-visible` is configured for keyboard access.
