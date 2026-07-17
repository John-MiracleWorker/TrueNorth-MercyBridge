## 2024-05-10 - Add aria labels and aria-pressed attributes to filter buttons and copy buttons
**Learning:** Adding descriptive `aria-label` attributes to icon-only buttons (like the copy button) and dynamically adding `aria-pressed` to filter toggles significantly improves accessibility for screen readers without altering the visual design.
**Action:** Always check for interactive elements that lack text content or rely purely on visual state, and enhance them with appropriate ARIA attributes.
## 2024-06-26 - Add accessible radiogroup roles to RequestHelp selection buttons
**Learning:** Found that custom selection buttons imitating radio groups lack semantic roles for screen readers and miss appropriate `focus-visible` outline styles, which impacts keyboard navigation and accessibility.
**Action:** Always wrap custom radio button collections in a `<div role="radiogroup" aria-labelledby="...">` and add `role="radio"`, `aria-checked`, and `focus-visible:ring-2` to the individual `<button>` items.
