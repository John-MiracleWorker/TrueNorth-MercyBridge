## 2024-05-10 - Add aria labels and aria-pressed attributes to filter buttons and copy buttons
**Learning:** Adding descriptive `aria-label` attributes to icon-only buttons (like the copy button) and dynamically adding `aria-pressed` to filter toggles significantly improves accessibility for screen readers without altering the visual design.
**Action:** Always check for interactive elements that lack text content or rely purely on visual state, and enhance them with appropriate ARIA attributes.

## 2024-06-21 - Accessible Custom Radio Buttons
**Learning:** Custom UI components built with regular buttons that function as radio groups (like the Category and Urgency selectors in RequestHelp.tsx) are not inherently understood by screen readers. They require explicit ARIA roles.
**Action:** Always add `role="radiogroup"` to the container `div`, ensure it has an `aria-labelledby` pointing to a visible label, and add `role="radio"` along with `aria-checked` to the individual custom buttons to maintain context and state for screen readers. Ensure these elements also have `focus-visible` styling for keyboard navigation.
