## 2024-05-10 - Add aria labels and aria-pressed attributes to filter buttons and copy buttons
**Learning:** Adding descriptive `aria-label` attributes to icon-only buttons (like the copy button) and dynamically adding `aria-pressed` to filter toggles significantly improves accessibility for screen readers without altering the visual design.
**Action:** Always check for interactive elements that lack text content or rely purely on visual state, and enhance them with appropriate ARIA attributes.
## 2024-07-02 - Custom Button Groups Need Radio ARIA Roles
**Learning:** When using mapped buttons to act as a single-selection (radio) input (e.g., Category or Urgency selection), simply highlighting the active button is not accessible. Screen readers cannot deduce that they are mutually exclusive options within a group.
**Action:** Always wrap custom single-selection button lists in `<div role="radiogroup" aria-labelledby="[id]">`, assign `role="radio"` and `aria-checked` to each `<button>`, and ensure they have `focus-visible` outlines for keyboard navigators.
