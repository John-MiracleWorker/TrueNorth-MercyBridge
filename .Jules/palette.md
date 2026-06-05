## 2024-05-10 - Add aria labels and aria-pressed attributes to filter buttons and copy buttons
**Learning:** Adding descriptive `aria-label` attributes to icon-only buttons (like the copy button) and dynamically adding `aria-pressed` to filter toggles significantly improves accessibility for screen readers without altering the visual design.
**Action:** Always check for interactive elements that lack text content or rely purely on visual state, and enhance them with appropriate ARIA attributes.

## 2024-05-14 - Accessible Custom Radio Groups
**Learning:** When replacing standard `<select>` or `<input type="radio">` elements with custom button groups for better UI design, they lose their semantic meaning and state communication for screen readers. Users won't know they are selecting from a group of mutually exclusive options.
**Action:** Always wrap custom button-based selectors in a `<div role="radiogroup" aria-labelledby="[label-id]">`, and apply `role="radio"` and `aria-checked={boolean}` to the individual buttons. Make sure the descriptive label has the matching `id`.
