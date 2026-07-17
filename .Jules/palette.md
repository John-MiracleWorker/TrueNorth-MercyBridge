## 2024-05-10 - Add aria labels and aria-pressed attributes to filter buttons and copy buttons
**Learning:** Adding descriptive `aria-label` attributes to icon-only buttons (like the copy button) and dynamically adding `aria-pressed` to filter toggles significantly improves accessibility for screen readers without altering the visual design.
**Action:** Always check for interactive elements that lack text content or rely purely on visual state, and enhance them with appropriate ARIA attributes.

## 2024-06-27 - Accessible File Upload Dropzones
**Learning:** Using a `div` with an `onClick` handler and a `hidden` input for a custom drag-and-drop or file upload area completely removes the file input from keyboard navigation and screen readers. Users cannot tab to the upload control.
**Action:** Always wrap custom dropzones in a `<label>` element containing an `<input type="file" className="sr-only">`. Use Tailwind's `focus-within:` utility on the `<label>` to provide visual focus styling when the hidden input receives focus via keyboard navigation.
