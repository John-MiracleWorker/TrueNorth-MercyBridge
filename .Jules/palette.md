## 2024-05-10 - Add aria labels and aria-pressed attributes to filter buttons and copy buttons
**Learning:** Adding descriptive `aria-label` attributes to icon-only buttons (like the copy button) and dynamically adding `aria-pressed` to filter toggles significantly improves accessibility for screen readers without altering the visual design.
**Action:** Always check for interactive elements that lack text content or rely purely on visual state, and enhance them with appropriate ARIA attributes.

## 2026-06-18 - Accessible Custom Radio Groups
**Learning:** When replacing standard `<select>` or `<input type="radio">` elements with custom button groups (like grid layouts for options), they lose native semantics. Screen readers won't announce them as a set of options or read their selection state.
**Action:** Always wrap custom button option sets in a `<div role="radiogroup" aria-labelledby="[label-id]">`, and add `role="radio"` and `aria-checked={boolean}` to the individual custom buttons to maintain context and state for screen readers.
