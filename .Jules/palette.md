## 2024-05-10 - Add aria labels and aria-pressed attributes to filter buttons and copy buttons
**Learning:** Adding descriptive `aria-label` attributes to icon-only buttons (like the copy button) and dynamically adding `aria-pressed` to filter toggles significantly improves accessibility for screen readers without altering the visual design.
**Action:** Always check for interactive elements that lack text content or rely purely on visual state, and enhance them with appropriate ARIA attributes.

## 2024-05-12 - ARIA Roles for Custom Radio Button Groups
**Learning:** When replacing standard `<select>` or `<input type="radio">` elements with custom button groups to act as radio selectors, users utilizing screen readers can lose the context of the grouping and state.
**Action:** Wrap the custom button group in a `<div role="group" aria-labelledby="...">`, ensure the related label has a matching `id`, and use the `aria-pressed` attribute on the individual custom buttons to maintain context and state for screen readers.
