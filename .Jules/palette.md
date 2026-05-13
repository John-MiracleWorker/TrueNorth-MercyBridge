## 2023-10-27 - [Add ARIA roles to custom radio buttons in RequestHelp]
**Learning:** Custom UI elements like "radio buttons" that are visually styled differently need `role="group"`, `aria-labelledby`, and `aria-pressed` for screen readers to properly announce their groupings and states.
**Action:** Next time creating a custom interactive list like radio button or toggle, always use appropriate ARIA tags and groups.
