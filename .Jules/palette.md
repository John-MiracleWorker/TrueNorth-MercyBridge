## 2024-05-10 - Add aria labels and aria-pressed attributes to filter buttons and copy buttons
**Learning:** Adding descriptive `aria-label` attributes to icon-only buttons (like the copy button) and dynamically adding `aria-pressed` to filter toggles significantly improves accessibility for screen readers without altering the visual design.
**Action:** Always check for interactive elements that lack text content or rely purely on visual state, and enhance them with appropriate ARIA attributes.
## 2026-05-21 - AdminReviewQueue filter accessibility
**Learning:** When using custom components like a list of buttons that act as a single set of radio filters, it is important to wrap them in a role=group and supply an aria-labelledby referencing the section's heading so that screen readers can convey the correct context for those items.
**Action:** Always verify if a custom set of selection buttons acts as a related group; if so, apply the role=group with the relevant labelling.
