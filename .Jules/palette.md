## 2024-05-10 - Add aria labels and aria-pressed attributes to filter buttons and copy buttons
**Learning:** Adding descriptive `aria-label` attributes to icon-only buttons (like the copy button) and dynamically adding `aria-pressed` to filter toggles significantly improves accessibility for screen readers without altering the visual design.
**Action:** Always check for interactive elements that lack text content or rely purely on visual state, and enhance them with appropriate ARIA attributes.

## $(date +%Y-%m-%d) - Add aria-expanded and aria-controls to toggle buttons
**Learning:** Toggle buttons that show/hide content (like the "Thinking" block in StewardshipCoach) need explicit `aria-expanded` and `aria-controls` attributes so screen reader users know the state of the content and which content is being toggled.
**Action:** Always check toggle buttons and ensure they have `aria-expanded` reflecting their state, and an `aria-controls` pointing to the `id` of the content they reveal/hide.
