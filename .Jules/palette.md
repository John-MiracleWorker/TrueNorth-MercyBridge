## 2024-05-10 - Add aria labels and aria-pressed attributes to filter buttons and copy buttons
**Learning:** Adding descriptive `aria-label` attributes to icon-only buttons (like the copy button) and dynamically adding `aria-pressed` to filter toggles significantly improves accessibility for screen readers without altering the visual design.
**Action:** Always check for interactive elements that lack text content or rely purely on visual state, and enhance them with appropriate ARIA attributes.
## 2026-07-08 - Accessible Collapsible Content
**Learning:** Collapsible sections need explicit ARIA states mapped between toggle and content container for screen readers to properly announce interactions and location.
**Action:** Always add `aria-expanded={boolean}` to toggle buttons and `aria-controls="[content-id]"` referencing the expanded content container's ID.
