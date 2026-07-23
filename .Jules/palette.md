## 2024-05-10 - Add aria labels and aria-pressed attributes to filter buttons and copy buttons
**Learning:** Adding descriptive `aria-label` attributes to icon-only buttons (like the copy button) and dynamically adding `aria-pressed` to filter toggles significantly improves accessibility for screen readers without altering the visual design.
**Action:** Always check for interactive elements that lack text content or rely purely on visual state, and enhance them with appropriate ARIA attributes.

## 2024-05-10 - File Upload Dropzone Accessibility
**Learning:** Custom file dropzones built with a `div` and `onClick` handler pointing to a `hidden` input are completely inaccessible to keyboard and screen reader users. The `hidden` class removes the input from the accessibility tree, preventing focus.
**Action:** Always wrap custom file dropzones in an accessible `<label>` that points to an `sr-only` (screen-reader only) `<input type="file">`. This keeps the input focusable without displaying it. Crucially, apply `focus-within` styles to the label so keyboard users receive a clear visual focus indicator when tabbing to the hidden input.
