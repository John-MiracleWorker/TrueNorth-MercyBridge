## 2024-05-10 - Add aria labels and aria-pressed attributes to filter buttons and copy buttons
**Learning:** Adding descriptive `aria-label` attributes to icon-only buttons (like the copy button) and dynamically adding `aria-pressed` to filter toggles significantly improves accessibility for screen readers without altering the visual design.
**Action:** Always check for interactive elements that lack text content or rely purely on visual state, and enhance them with appropriate ARIA attributes.
## 2024-07-07 - Accessibility for Toggleable Content
**Learning:** Collapsible sections like the AI "Thinking" state lack structural context for screen readers when toggled by a basic button, making it hard to know if the content expanded or what button controls it.
**Action:** When adding collapsible or toggleable content (like accordions or detailed insights), explicitly add `aria-expanded={boolean}` on the trigger `<button>` and `aria-controls="[id]"` matching the ID of the dynamically rendered content container.
