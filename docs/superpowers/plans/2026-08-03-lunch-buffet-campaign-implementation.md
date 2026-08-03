# Lunch Buffet Campaign Implementation Plan

## 1. Campaign data and localization

- Add one canonical lunch buffet data object with schedule and prices.
- Add German, English, Persian, and Arabic copy for navigation, popup, homepage, and menu surfaces.
- Format euro prices through the existing locale-aware formatter.

## 2. Intro coordination

- Extend the cinematic timing to approximately 3.4 seconds.
- Add a stable completion callback for natural completion and Skip.
- Preserve the short reduced-motion behavior.

## 3. Once-per-session popup

- Add a buffet campaign modal driven by intro completion.
- Persist its displayed state in `sessionStorage`.
- Connect reservation and menu-scroll actions to existing flows.

## 4. Permanent buffet discovery

- Add the desktop navigation link.
- Add the homepage buffet feature section.
- Add a Buffet menu category and dedicated experience card.
- Ensure the mobile Menu action reaches the menu and exposes the category.

## 5. Responsive and accessible presentation

- Style all surfaces with theme tokens for eight palettes and both layouts.
- Verify RTL, focus handling, Escape/backdrop dismissal, reduced motion, and mobile bottom-nav spacing.

## 6. Verification

- Add Playwright coverage for loader duration, skip, session frequency, both popup actions, navigation, menu filtering, mobile, desktop, and RTL.
- Run lint and the production build.
