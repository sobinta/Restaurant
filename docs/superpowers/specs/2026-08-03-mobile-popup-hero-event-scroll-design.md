# Mobile Popup, Hero Order, and Event Scroll Design

## Scope

This refinement changes only mobile presentation and event-route scroll restoration. Desktop popup and hero layouts remain unchanged.

## Compact mobile buffet popup

At viewports up to 760px, the buffet campaign becomes a centered floating card instead of an edge-to-edge bottom sheet.

- Inline margin: 16px minimum on both sides.
- Top and bottom margin: at least 14px plus the device safe area.
- Maximum width: 430px.
- Maximum height: 82svh; overflow stays inside the card when required.
- All four corners remain rounded.
- Campaign image is reduced to approximately 160–180px high.
- Heading, spacing, and controls become more compact without removing schedule or pricing information.
- The two campaign actions share one row when space permits and stack only on very narrow screens.
- Backdrop, Escape, close button, focus behavior, RTL, and all eight themes remain unchanged.

## Mobile hero content order

Both homepage layouts place the message before the photograph on mobile.

- Cinematic layout changes from text over a full-screen photograph to a composed vertical flow: text and primary actions first, photograph second, supporting facts last.
- Editorial layout reorders its existing grid so the editorial introduction appears before the framed cover image.
- The desktop cinematic overlay and desktop editorial grid remain unchanged.
- The mobile hero keeps strong visual hierarchy and avoids duplicating text or images.

## Event route scroll restoration

Every event-detail navigation starts at the top of the route.

- `EventPage` performs an immediate `window.scrollTo(0, 0)` whenever the event slug changes.
- The behavior applies when entering from a homepage event card, switching directly between event URLs, using browser navigation, or reopening a previously visited event.
- It does not use smooth scrolling, preventing the user from seeing an unintended animated jump from the old page position.

## Validation

- At 390px, the popup has visible space on every screen edge and remains shorter than the viewport.
- All popup facts and actions remain accessible without page-level overflow.
- Cinematic and editorial mobile heroes render text before their image.
- Desktop hero and popup layouts are unchanged.
- Event pages report `scrollY = 0` after navigation from a scrolled homepage and after slug changes.
- German, English, Persian, Arabic, RTL, keyboard dismissal, lint, production build, and existing regression tests pass.
