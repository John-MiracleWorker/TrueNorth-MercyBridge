## 2024-05-10 - Add aria labels and aria-pressed attributes to filter buttons and copy buttons
**Learning:** Adding descriptive `aria-label` attributes to icon-only buttons (like the copy button) and dynamically adding `aria-pressed` to filter toggles significantly improves accessibility for screen readers without altering the visual design.
**Action:** Always check for interactive elements that lack text content or rely purely on visual state, and enhance them with appropriate ARIA attributes.

## 2024-05-27 - Accessible Custom Button Groups
**Learning:** When standard `<select>` or `<input type="radio">` elements are replaced by custom buttons acting as a mutually exclusive choice (like Category or Urgency selectors), screen readers lose the context that these buttons are a grouped choice. Providing an ID to the label, wrapping the buttons in a `<div role="group" aria-labelledby="[label-id]">`, and adding `aria-pressed` to individual buttons reinstates this vital context.
**Action:** Always wrap custom radio-style button lists in a `role="group"` with an `aria-labelledby` referencing its label, and manage the `aria-pressed` state on the buttons themselves.
