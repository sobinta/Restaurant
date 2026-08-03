# Mobile Bottom Navigation Implementation Plan

## 1. Shared appearance controls

- Refactor the existing appearance panel so layout and palette controls can be reused.
- Add the four-language selector to the shared mobile presentation.
- Preserve desktop popover behavior.

## 2. Mobile bottom navigation

- Add a fixed five-action mobile navigation component.
- Connect Home and Menu to existing page anchors/routes.
- Connect Reserve and Order to the existing application context.
- Add a cart-count badge and a prominent central reservation action.

## 3. Mobile appearance sheet

- Render the sheet outside the hidden desktop appearance ancestor.
- Add backdrop, close button, Escape dismissal, focus restoration, and scroll locking.
- Close the sheet when the viewport changes to desktop.

## 4. Responsive styling

- Style the navigation and sheet with theme tokens so they adapt to all eight palettes.
- Respect safe-area insets, RTL, reduced motion, and 44px touch targets.
- Add bottom spacing so page content and controls remain visible.

## 5. Verification

- Extend Playwright mobile coverage for navigation actions and sheet dismissal.
- Select all eight themes and confirm persistence.
- Verify both layouts and all four languages, including RTL.
- Confirm the controls are hidden on desktop.
- Run lint and the production build.
