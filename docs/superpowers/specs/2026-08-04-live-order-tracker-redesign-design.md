# Live Order Tracker Redesign

## Objective

Redesign the customer-facing live order page into a distinctive, highly legible tracking experience inspired by the clarity of Domino's Pizza Tracker without copying its visual language. Preserve the real ARSHIDA order-status pipeline and elevate it with an eight-stage service ribbon, a live-signal panel, stage-specific colors, and restrained motion.

## Approved Direction

The approved composition combines:

- **Option A:** a segmented service ribbon showing the complete order journey.
- **Live Signal from Option C:** a focused panel showing the current state, last update, estimated time, and a small animated signal waveform.

The result must feel like ARSHIDA: dark culinary atmosphere, editorial typography, precise utility labels, restrained color, and motion used only to communicate live state.

## Page Composition

The existing order ID and current-status hero remain, but the tracking experience becomes the visual center of the page.

Desktop structure:

1. Route header and back action.
2. Compact order identity area with order number and localized current message.
3. A framed live-tracker surface.
4. The eight-stage service ribbon in the main tracker area.
5. The Live Signal panel beside the ribbon.
6. Order details and receipt below the tracker.

The oversized order number may remain expressive, but vertical spacing is tightened so the tracker is visible sooner without a large empty gap.

## Service Ribbon

The ribbon uses the statuses already provided by `ORDER_STATUSES`:

1. Order received.
2. Restaurant confirmed.
3. Preparing.
4. Cooking / in the oven.
5. Final quality check.
6. Ready for handoff.
7. With the courier.
8. Delivered.

Non-delivery orders continue to omit the courier stage, producing a seven-stage ribbon without a dead segment.

Each stage has a stable semantic color family so users can distinguish stages at a glance:

- Received: cool slate.
- Confirmed: muted sage.
- Preparing: warm amber.
- Cooking: ember orange.
- Quality check: muted violet.
- Ready: fresh mint.
- Courier: clear blue.
- Delivered: confident green.

The colors are controlled and slightly desaturated so they coexist with all eight ARSHIDA themes. They do not replace text labels or icons. Completed segments retain their own stage color with a calm appearance; the active segment is brighter; future segments remain neutral and outlined.

Each segment includes its icon, localized label, sequence number, and timestamp when available. The segmented shape evokes forward movement but does not reproduce Domino's beveled, glossy, or branded tracker.

## Live Signal Panel

The Live Signal panel appears beside the service ribbon on desktop and above the ribbon on mobile. It contains:

- `LIVE SIGNAL` utility label.
- Localized current-stage title.
- Localized “updated moments ago” or exact last-update time.
- Current estimate.
- Five narrow signal bars with a slow, low-amplitude motion.

Only the active stage, live indicator, and signal bars animate. The active state uses a soft brightness pulse comparable to slow breathing, not flashing. The effect must remain subtle, avoid abrupt opacity changes, and stop under `prefers-reduced-motion: reduce`.

## Desktop and Tablet Layout

On wide screens, the tracker surface uses two columns:

- Main column: service ribbon and a concise active-stage message.
- Side column: Live Signal panel and estimate.

At tablet widths, the Live Signal panel moves above or below the ribbon as a full-width strip if the side column becomes too narrow. The full stage path remains readable without text collisions.

## Mobile Auto-Focus Behavior

On mobile, the Live Signal panel is shown before the service ribbon. The ribbon is a horizontal scroll container sized for legible segments.

The active stage must always be brought into view automatically:

- When the page first renders, the current stage scrolls into the center or nearest practical center of the viewport.
- When the order status changes, the ribbon smoothly advances to the new active stage without user input.
- In Persian and Arabic, movement follows the RTL scroll direction automatically.
- The user may still inspect earlier or later stages manually; the tracker does not continuously fight manual scrolling when the status has not changed.
- Auto-focus runs only when the active status changes or the page first opens.
- Reduced-motion mode uses an immediate, non-animated reposition.

This behavior uses stage element references and the active status as the trigger. It must not use timers that repeatedly force the scroll position.

## Data and Live Updates

The redesign consumes the existing order object, history, estimate, type, and status from `AppContext`. It does not create a parallel or simulated state machine.

When the restaurant workspace advances an order, the customer's tracker updates from the same shared order data. Timestamps continue to come from order history. A missing history entry shows a neutral placeholder without breaking the ribbon.

If an order ID is not found, the existing safe no-active-order state remains.

## Localization and Direction

All new customer-facing labels are localized in German, English, Persian, and Arabic. Stage names continue to use `orderStatusCopy`. Time, numbers, alignment, segment direction, icons, and automatic mobile movement respect LTR and RTL.

The component must remain readable in all four dark and four light themes. Stage colors are semantic accents on top of theme-derived surfaces, borders, and text.

## Accessibility

- The tracker retains `aria-live="polite"` for meaningful status changes.
- Current status is communicated by text, icon, position, and an accessible state marker—not color alone.
- Completed and future statuses remain distinguishable without animation.
- Motion stops under reduced-motion preferences.
- Horizontal mobile scrolling remains keyboard and touch accessible.
- Signal animation is decorative and hidden from assistive technology.

## Implementation Boundary

This change targets the customer-facing `LiveOrderPage` and its localized copy and styles. The restaurant workspace pipeline, cart checkout, order creation, status history, profile order shortcut, and receipt calculations remain functionally unchanged except for regression verification.

## Verification

Before publication, verify:

- The correct active stage and all prior completed stages render from the existing order status.
- Delivery shows eight stages and pickup/dine-in omit courier cleanly.
- Every stage uses its assigned semantic color while active and completed states remain legible.
- Live Signal shows the same status and estimate as the order hero.
- The active stage and signal waveform animate subtly in normal mode.
- Reduced-motion mode disables pulse and waveform motion.
- Mobile initially centers the active stage.
- A simulated status change automatically advances the mobile ribbon to the new stage exactly once.
- Manual mobile inspection is not overridden until the status changes again.
- German and Persian desktop layouts render correctly.
- German and Persian mobile auto-focus respects direction.
- Dark and light themes retain sufficient contrast.
- No horizontal page overflow is introduced outside the ribbon container.
- Existing receipt details and missing-order state still work.
- Lint and production build pass.

## Delivery

Implementation will use a focused feature branch. After browser verification and visual review, changes will be committed, pushed to `sobinta/Restaurant`, opened as a pull request, checked by Vercel, merged into `main`, and synchronized back to local `main`.
