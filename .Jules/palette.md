## 2024-06-20 - Expanded Content Needs Accessibility State
**Learning:** Found a common pattern in the React codebase where interactive content toggle buttons lack an `aria-expanded` property. Specifically in `MercyBridgeAdmin.tsx`, a `<button>` expands and collapses a review area based on state (`isExpanded`), but screen readers have no way of knowing whether the content is expanded or not.
**Action:** When implementing clickable content expanders/accordions, consistently use `aria-expanded={isExpanded}` and `aria-controls="[id]"` to inform assistive technology of the state change.
