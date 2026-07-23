## 2024-05-10 - Add aria labels and aria-pressed attributes to filter buttons and copy buttons
**Learning:** Adding descriptive `aria-label` attributes to icon-only buttons (like the copy button) and dynamically adding `aria-pressed` to filter toggles significantly improves accessibility for screen readers without altering the visual design.
**Action:** Always check for interactive elements that lack text content or rely purely on visual state, and enhance them with appropriate ARIA attributes.

## 2024-05-19 - Accessible Custom Radio Groups
**Learning:** When creating custom button-based radio selectors instead of using native `<input type="radio">`, explicit accessibility attributes must be used to maintain screen reader support. Standard UI components like Radix `<Label>` require an explicit `id` when referenced by custom elements.
**Action:** Always wrap custom radio button groups in a `div` with `role="radiogroup"` and `aria-labelledby="[label-id]"`. Ensure the accompanying label has a matching `id`. Each custom button within the group must have `role="radio"` and dynamically manage the `aria-checked` boolean attribute based on the current selection state.
