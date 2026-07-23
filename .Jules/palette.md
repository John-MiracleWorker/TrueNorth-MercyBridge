## 2024-05-10 - Add aria labels and aria-pressed attributes to filter buttons and copy buttons
**Learning:** Adding descriptive `aria-label` attributes to icon-only buttons (like the copy button) and dynamically adding `aria-pressed` to filter toggles significantly improves accessibility for screen readers without altering the visual design.
**Action:** Always check for interactive elements that lack text content or rely purely on visual state, and enhance them with appropriate ARIA attributes.

## 2024-05-14 - Accessible Custom Radio Button Groups
**Learning:** When using custom `<button>` groups to act as radio selectors (e.g., for categories or urgency levels), standard `<Label>` components don't automatically provide context to the group. Screen readers need explicitly linked labels and state feedback.
**Action:** Always wrap custom button groups in a `<div role="group" aria-labelledby="[label-id]">`, ensure the Radix UI `<Label>` has a matching `id`, and use `aria-pressed={isActive}` on individual `<button>` elements to maintain accessible state context.
