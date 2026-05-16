## 2024-05-10 - Add aria labels and aria-pressed attributes to filter buttons and copy buttons
**Learning:** Adding descriptive `aria-label` attributes to icon-only buttons (like the copy button) and dynamically adding `aria-pressed` to filter toggles significantly improves accessibility for screen readers without altering the visual design.
**Action:** Always check for interactive elements that lack text content or rely purely on visual state, and enhance them with appropriate ARIA attributes.
## 2024-05-16 - Accessible Custom Form Controls
**Learning:** When custom form controls (like button groups simulating radio selectors) are used, wrapping them in a `<div role="group" aria-labelledby="...">` and using `aria-pressed` on the individual buttons ensures the group structure and active selection state are communicated correctly to screen readers.
**Action:** When replacing native `<select>` or radio inputs with custom button groups for better UI, immediately ensure they are grouped with `role="group"` and `aria-pressed` attributes to maintain accessible semantics.
