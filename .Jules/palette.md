## 2024-05-10 - Add aria labels and aria-pressed attributes to filter buttons and copy buttons
**Learning:** Adding descriptive `aria-label` attributes to icon-only buttons (like the copy button) and dynamically adding `aria-pressed` to filter toggles significantly improves accessibility for screen readers without altering the visual design.
**Action:** Always check for interactive elements that lack text content or rely purely on visual state, and enhance them with appropriate ARIA attributes.

## 2024-05-18 - Added Screen Reader Context to Custom React Radio Buttons
**Learning:** React implementations often use custom styled `<button>` components in an array.map loop to act as radio selectors without using semantic `<input type="radio">` tags. This creates a severe accessibility issue where screen readers announce isolated buttons instead of contextual options inside a unified fieldset.
**Action:** Always wrap custom mapped "radio buttons" inside a `<div role="radiogroup" aria-labelledby="[Label-ID]">` container, and apply `role="radio"` and `aria-checked={boolean}` directly to the mapped child buttons.
