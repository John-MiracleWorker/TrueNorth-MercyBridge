## 2024-05-10 - Add aria labels and aria-pressed attributes to filter buttons and copy buttons
**Learning:** Adding descriptive `aria-label` attributes to icon-only buttons (like the copy button) and dynamically adding `aria-pressed` to filter toggles significantly improves accessibility for screen readers without altering the visual design.
**Action:** Always check for interactive elements that lack text content or rely purely on visual state, and enhance them with appropriate ARIA attributes.
## 2025-02-12 - Accessible File Dropzones
**Learning:** Replacing a custom `div` + `onClick` file dropzone with an accessible `<label>` + `sr-only` `<input>` restores native keyboard accessibility and focus management without requiring JavaScript handlers or custom ARIA roles.
**Action:** Always wrap file dropzones in `<label htmlFor="id">` and use `sr-only` on the `<input type="file">` instead of `hidden`, then apply `focus-within:ring-2` on the label for visual feedback.
