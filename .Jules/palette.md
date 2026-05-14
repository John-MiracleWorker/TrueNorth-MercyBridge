## 2024-05-10 - Add aria labels and aria-pressed attributes to filter buttons and copy buttons
**Learning:** Adding descriptive `aria-label` attributes to icon-only buttons (like the copy button) and dynamically adding `aria-pressed` to filter toggles significantly improves accessibility for screen readers without altering the visual design.
**Action:** Always check for interactive elements that lack text content or rely purely on visual state, and enhance them with appropriate ARIA attributes.
## 2024-05-14 - Admin Queue Async Buttons
**Learning:** During loading states in review queues, failing to set `disabled={processingId !== null}` allows double-clicking and potentially spamming API requests for state transitions.
**Action:** When adding `Loader2` or loading states to interactive UI, always verify that the parent button receives the corresponding `disabled` boolean attribute.
