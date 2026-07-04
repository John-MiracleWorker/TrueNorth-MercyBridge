## 2024-05-10 - Add aria labels and aria-pressed attributes to filter buttons and copy buttons
**Learning:** Adding descriptive `aria-label` attributes to icon-only buttons (like the copy button) and dynamically adding `aria-pressed` to filter toggles significantly improves accessibility for screen readers without altering the visual design.
**Action:** Always check for interactive elements that lack text content or rely purely on visual state, and enhance them with appropriate ARIA attributes.
## 2024-05-11 - Make custom file uploads accessible
**Learning:** Custom file upload dropzones built with `<div>` and `hidden` inputs are completely inaccessible to keyboard users because `hidden` elements cannot receive focus.
**Action:** Always wrap custom file upload dropzones in a `<label htmlFor="...">` and use `className="sr-only"` on the `<input type="file">`. Add `focus-within` styles to the label so it visually indicates when the underlying native input receives keyboard focus.
