## 2024-05-10 - Add aria labels and aria-pressed attributes to filter buttons and copy buttons
**Learning:** Adding descriptive `aria-label` attributes to icon-only buttons (like the copy button) and dynamically adding `aria-pressed` to filter toggles significantly improves accessibility for screen readers without altering the visual design.
**Action:** Always check for interactive elements that lack text content or rely purely on visual state, and enhance them with appropriate ARIA attributes.

## 2026-05-26 - Enhance Custom Button Groups with Proper Roles and Keyboard Focus
**Learning:** When using UI components like `div` wraps around custom `<button>` toggles (acting like radio buttons), they lack structural grouping for screen readers. Using `role="group"` and an `aria-labelledby` referencing the section's heading restores this context. Furthermore, custom buttons often miss `focus-visible` styles, making keyboard navigation difficult.
**Action:** When implementing custom group controls, ensure they are wrapped in a `role="group"` with a descriptive label, and always include `focus-visible` utility classes for clear keyboard focus indicators.
