## 2024-05-10 - Add aria labels and aria-pressed attributes to filter buttons and copy buttons
**Learning:** Adding descriptive `aria-label` attributes to icon-only buttons (like the copy button) and dynamically adding `aria-pressed` to filter toggles significantly improves accessibility for screen readers without altering the visual design.
**Action:** Always check for interactive elements that lack text content or rely purely on visual state, and enhance them with appropriate ARIA attributes.

## 2024-07-01 - Improving Custom Radio Groups Accessibility
**Learning:** Custom radio groups built with generic `<div>` and `<button>` elements lack semantic meaning and keyboard navigability for screen reader and keyboard users.
**Action:** Always wrap custom radio button collections in a `<div role="radiogroup">` with an `aria-labelledby` referencing an external `<label>`. Ensure individual items use `role="radio"`, update `aria-checked` dynamically, and apply `focus-visible` styling to support keyboard navigation.
