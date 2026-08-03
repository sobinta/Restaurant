# Mobile Popup, Hero, and Event Scroll Implementation Plan

## 1. Mobile popup sizing

- Override the generic mobile modal treatment only for the buffet campaign.
- Center the popup with 16px inline margins and safe vertical spacing.
- Reduce the image, typography, padding, and action footprint.
- Preserve internal scrolling, RTL, focus, and dismissal behavior.

## 2. Mobile hero ordering

- Convert the cinematic mobile hero into text, image, then metadata flow.
- Reorder the editorial mobile grid through CSS without changing desktop markup.
- Verify both layouts retain responsive proportions and all primary actions.

## 3. Event scroll restoration

- Reset the document scroll position in `EventPage` whenever the route slug changes.
- Keep the reset immediate and isolated to event-detail navigation.

## 4. Verification and publication

- Capture and inspect both mobile hero layouts and the compact popup.
- Test popup viewport margins, height, internal access, RTL, and desktop invariance.
- Test event entry from a scrolled homepage and direct slug changes.
- Run lint, production build, and relevant regression flows.
- Commit, push the feature branch, open a PR, and merge it into `main`.
