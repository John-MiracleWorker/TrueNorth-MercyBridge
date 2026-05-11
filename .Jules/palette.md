## 2024-05-08 - Accessible close buttons
**Learning:** Found that multiple modals and preview sections utilized `<button>` tags with generic close icons (`<X>`) without any accessible `aria-label` or explicit `type="button"`. Screen readers could not correctly announce the purpose of these icon-only buttons, reducing accessibility for modal navigation and document management.
**Action:** Always provide descriptive `aria-label` attributes on icon-only buttons (e.g., `aria-label="Close modal"`). Additionally, always specify `type="button"` to avoid unintended form submissions in dynamic interfaces.
## 2024-05-18 - Accessible Custom Button Groups
**Learning:** When replacing standard `<select>` or `<input type="radio">` with custom button groups for better UI (like the Category and Urgency selectors in RequestHelp.tsx), screen readers lose the context. The buttons aren't grouped together and their selection state isn't announced properly.
**Action:** Always wrap custom selection button groups in `<div role="group" aria-labelledby="label-id">` and add `aria-pressed={isSelected}` to each button to ensure screen reader users understand the options and which one is active.
