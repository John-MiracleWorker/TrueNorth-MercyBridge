## 2024-05-10 - Add aria labels and aria-pressed attributes to filter buttons and copy buttons
**Learning:** Adding descriptive `aria-label` attributes to icon-only buttons (like the copy button) and dynamically adding `aria-pressed` to filter toggles significantly improves accessibility for screen readers without altering the visual design.
**Action:** Always check for interactive elements that lack text content or rely purely on visual state, and enhance them with appropriate ARIA attributes.

## 2024-05-14 - Use role="group", aria-labelledby, and aria-pressed for Custom Radio Groups
**Learning:** When replacing standard `<select>` or `<input type="radio">` elements with custom button groups (like for Category or Urgency selections), screen readers lose the context that these buttons act as a single choice selector.
**Action:** Always wrap custom radio button groups in a `<div role="group" aria-labelledby="...">` and apply the `aria-pressed` attribute to the individual `<button>`s to restore semantics.
