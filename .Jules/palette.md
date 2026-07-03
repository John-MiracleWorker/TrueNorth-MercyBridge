## 2024-05-10 - Add aria labels and aria-pressed attributes to filter buttons and copy buttons
**Learning:** Adding descriptive `aria-label` attributes to icon-only buttons (like the copy button) and dynamically adding `aria-pressed` to filter toggles significantly improves accessibility for screen readers without altering the visual design.
**Action:** Always check for interactive elements that lack text content or rely purely on visual state, and enhance them with appropriate ARIA attributes.

## 2026-07-03 - Radiogroup Accessibility for Custom Button Lists
**Learning:** When using custom button groups to act as radio selectors, screen readers lose the context of mutually exclusive options without proper ARIA roles.
**Action:** Always wrap custom radio selectors in a div with `role="radiogroup"` and `aria-labelledby`, and give individual buttons `role="radio"` and `aria-checked` state along with focus-visible styling.
