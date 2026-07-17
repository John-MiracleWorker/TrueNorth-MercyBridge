## 2024-05-10 - Add aria labels and aria-pressed attributes to filter buttons and copy buttons
**Learning:** Adding descriptive `aria-label` attributes to icon-only buttons (like the copy button) and dynamically adding `aria-pressed` to filter toggles significantly improves accessibility for screen readers without altering the visual design.
**Action:** Always check for interactive elements that lack text content or rely purely on visual state, and enhance them with appropriate ARIA attributes.
## 2024-11-20 - Accessible file upload dropzones
**Learning:** Hidden file inputs inside `div` dropzones cause screen reader and keyboard accessibility issues.
**Action:** Use an accessible `<label>` wrapper with an `sr-only` (screen-reader only) `<input type="file">` instead of a `div` and `hidden` input. Ensure you apply `focus-within` styles to the label for native keyboard focus visibility.
