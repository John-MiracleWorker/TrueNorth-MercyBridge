## 2024-05-10 - Add aria labels and aria-pressed attributes to filter buttons and copy buttons
**Learning:** Adding descriptive `aria-label` attributes to icon-only buttons (like the copy button) and dynamically adding `aria-pressed` to filter toggles significantly improves accessibility for screen readers without altering the visual design.
**Action:** Always check for interactive elements that lack text content or rely purely on visual state, and enhance them with appropriate ARIA attributes.

## 2024-05-15 - Add aria-expanded and aria-controls attributes to expand/collapse regions
**Learning:** Adding `aria-expanded` and `aria-controls` to toggle buttons connected to expand/collapse regions dramatically improves accessibility. The `aria-expanded` attribute dynamically signals the state to screen readers, while `aria-controls` programmatically maps the button to the content it reveals.
**Action:** Always include `aria-expanded` on accordion-style trigger buttons, and link the button to the revealed content container ID using `aria-controls`.
