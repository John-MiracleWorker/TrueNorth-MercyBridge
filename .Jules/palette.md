## 2024-05-19 - Missing ARIA labels and focus styles on custom radio buttons

**Learning:** Custom button groups acting as radio selectors in forms (like category and urgency in `RequestHelp.tsx`) often lack proper ARIA semantics (`role="group"`, `role="radio"`, `aria-checked`, `aria-label` or `aria-labelledby`) and keyboard navigation support compared to standard `<input type="radio">` or `<select>`. Also, many interactive elements might lack clear focus rings.

**Action:** Add `role="group"` around the buttons, add `aria-pressed` (or `role="radio"` with `aria-checked`) to individual buttons to communicate their toggle state. Ensure focus states are clear (e.g., using `focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none`).
