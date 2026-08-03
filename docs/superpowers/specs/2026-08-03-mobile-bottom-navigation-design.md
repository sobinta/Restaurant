# Mobile Bottom Navigation and Appearance Sheet

## Goal

Make the primary restaurant actions and all visual customization controls reliably accessible on mobile. The result should feel like a polished restaurant application while preserving the existing desktop navigation and all eight themes.

## Mobile navigation

At viewports up to 760px, show a fixed five-item navigation bar at the bottom of the screen:

1. Home — scrolls or navigates to the homepage hero.
2. Menu — opens the menu section.
3. Reserve — a visually prominent central action that opens the existing reservation flow.
4. Order — opens the cart and displays the current item count.
5. Appearance — opens the mobile appearance bottom sheet.

The bar must respect the device safe area, remain legible across all eight palettes, use localized labels, and mirror directional icon behavior in Persian and Arabic. Page content, modals, and sticky controls must reserve enough bottom spacing to remain unobstructed.

## Appearance bottom sheet

The Appearance action opens a modal bottom sheet rendered outside the desktop navigation hierarchy. This avoids the current bug where the panel inherits `display: none` from its hidden desktop parent.

The sheet contains:

- the cinematic/editorial layout selector;
- four dark palette choices;
- four light palette choices;
- visible color swatches and selected-state feedback;
- language choices for German, English, Persian, and Arabic.

Selecting a palette or layout updates the site immediately and persists through the existing theme context. The sheet remains open while comparing palettes. Language selection updates direction and content without closing the sheet.

## Interaction and accessibility

- Open and close motion uses the existing cinematic visual language with a short, restrained transition.
- The sheet closes through its close button, backdrop click, or Escape key.
- Background scrolling is locked while the sheet is open.
- Controls expose pressed/selected state and descriptive accessible labels.
- Focus moves into the sheet when opened and returns to Appearance when closed.
- Reduced-motion preferences disable the slide animation.
- Touch targets are at least 44px.

Drag-to-dismiss is intentionally excluded from this pass because a reliable accessible implementation would add disproportionate complexity; backdrop, close button, and Escape provide consistent dismissal.

## Desktop behavior

Desktop navigation and its existing appearance popover remain unchanged. The mobile bottom bar and bottom sheet are hidden above 760px. Resizing from mobile to desktop closes the mobile sheet and restores normal page scrolling.

## Component boundaries

- `MobileBottomNav` owns the five mobile actions and current cart badge.
- `MobileAppearanceSheet` owns modal presentation, focus, dismissal, and reuses the existing theme-choice UI.
- `AppearanceControls` contains the shared layout, palette, and language controls used by both desktop and mobile presentations.
- Theme and language state continue to live exclusively in `ThemeContext`.

## Validation

Automated mobile browser coverage will verify:

- the bar is visible at 390px and hidden on desktop;
- all five actions work;
- Appearance opens above the page and exposes exactly eight palette choices;
- every palette can be selected and persists after reload;
- both layouts can be selected;
- German, English, Persian, and Arabic update correctly, including RTL direction;
- backdrop, close button, and Escape dismiss the sheet;
- the page has no unintended horizontal overflow and content is not hidden behind the bar;
- lint and production build pass.
