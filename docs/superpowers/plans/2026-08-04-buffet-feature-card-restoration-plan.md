# Buffet Feature Card Restoration Plan

## Goal

Replace the current minimal homepage buffet band with the approved image-led, two-column feature card while preserving reservation, menu navigation, localization, eight themes, RTL, and mobile behavior.

## Implementation Steps

1. Refactor `BuffetSection` in `src/App.jsx` into one framed feature card with image, time overlay, content, schedule, pricing, reservation CTA, and buffet-menu link.
2. Keep the existing `lunch-buffet` anchor and shared `lunchBuffet` data so popup scrolling and localized facts remain unchanged.
3. Replace the current `.buffet-stage`, `.buffet-time`, `.buffet-copy`, and `.buffet-prices` presentation rules with focused card, image, content, fact, and action styles.
4. Derive content-panel colors from semantic theme variables and verify one dark and one light palette.
5. Use logical grid ordering and spacing so Persian and Arabic mirror the German and English composition.
6. Add a mobile single-column layout with an editorial-height image, readable time overlay, two-column price facts, full-width reservation CTA, and accessible menu link.
7. Run lint and production build.
8. Use Playwright against the isolated local server to verify section order, popup scrolling, reservation opening, menu navigation, desktop/mobile layout, LTR/RTL mirroring, light/dark themes, and absence of horizontal overflow.
9. Review desktop and mobile screenshots against the supplied reference.
10. Commit the implementation, push the feature branch, open a draft pull request, verify Vercel checks, merge into `main`, and synchronize local `main`.
