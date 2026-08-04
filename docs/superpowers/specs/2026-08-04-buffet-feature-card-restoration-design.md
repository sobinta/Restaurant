# Buffet Feature Card Restoration

## Objective

Replace the current minimal lunch-buffet band between the homepage hero and menu introduction with the previously approved, image-led two-column buffet card shown in the user's reference image. Preserve all current buffet functionality, localization, themes, and responsive behavior.

## Selected Direction

The selected direction is **Option A — adaptive restoration of the original card**.

The component retains the original visual hierarchy rather than copying a fixed burgundy screenshot:

- A large buffet photograph occupies one side.
- The service time is overlaid prominently at the bottom of the photograph.
- The opposite side contains the localized campaign narrative, schedule, prices, reservation action, and menu link.
- Card colors derive from the active theme tokens so all four dark and four light palettes remain intentional and readable.

## Desktop Layout

The restored buffet section remains immediately after the hero and immediately before the “Das Aktuelle Menü” introduction.

Inside the section, a single framed feature card uses an approximately equal two-column layout:

- **Image column:** overhead lunch-table photograph, subtle contrast treatment, lower gradient for text legibility, and `11:30 — 15:30` as a large display overlay.
- **Content column:** eyebrow, buffet title, description, schedule, adult price, child-under-12 price, primary reservation button, and secondary full-menu link.

The card has the substantial scale, rounded outer silhouette, and quiet internal dividers visible in the reference. It must replace the current time-column, center-copy, arched-price-box composition completely; those elements are not retained behind or around the new card.

## Theme Behavior

The card uses the existing semantic theme variables rather than fixed colors:

- The content panel uses a theme-derived secondary or elevated surface.
- Primary text uses the correct text color for that surface.
- Supporting copy and dividers use mixed theme values with sufficient contrast.
- The reservation button continues to use the active accent and accent-text pair.
- The image overlay remains neutral enough to work with every palette.

Representative dark and light themes must both be inspected. No palette-specific hard-coded burgundy treatment is introduced.

## LTR and RTL Behavior

In German and English, the photograph appears on the left and content on the right.

In Persian and Arabic, the visual order mirrors: content appears on the right in reading order and the photograph occupies the opposite side. Logical CSS properties are used for spacing, dividers, alignment, and rounded corners.

Time and numeric prices remain visually stable and readable regardless of document direction.

## Mobile Behavior

Below the mobile breakpoint, the card becomes a single-column composition:

1. Photograph with time overlay.
2. Content and description.
3. Schedule and price pair.
4. Full-width reservation action and clearly accessible menu link.

The image must remain tall enough to feel editorial rather than becoming a thumbnail. Content must not overlap the existing fixed bottom navigation, create horizontal overflow, or produce clipped prices in Persian or Arabic.

## Preserved Behavior

- The section retains the `lunch-buffet` anchor used by the campaign popup.
- The campaign popup continues to scroll to this section.
- The reservation action continues to set the buffet reservation intent and open the existing reservation flow.
- The menu action continues to open `/menu?category=buffet`.
- Monday–Friday, 11:30–15:30, €12.50 adult pricing, and €8.99 children-under-12 pricing remain unchanged.
- German, English, Persian, and Arabic continue to use the shared `lunchBuffet` data.

## Implementation Boundary

Only the homepage buffet presentation and its targeted styles are changed. The full-menu buffet row, popup, reservation modal, menu discovery page, dish pages, mobile navigation, live ordering, and restaurant workspace are outside this change except for regression verification.

Obsolete homepage buffet layout styles are removed or replaced so the old minimal composition cannot reappear through cascade conflicts.

## Verification

Before publication, verify:

- The restored card is the only buffet presentation between hero and menu introduction.
- The current minimal band layout is absent.
- Reservation and menu-link actions still work.
- The popup's menu action still scrolls to the restored card.
- Desktop German and Persian layouts mirror correctly.
- Mobile German and Persian layouts stack without clipping or horizontal overflow.
- At least one dark and one light theme have readable text, dividers, prices, and buttons.
- Lint and production build pass.
- Desktop and mobile screenshots match the reference structure and maintain the ARSHIDA design system.

## Delivery

Implementation will use a focused feature branch. After browser verification, changes will be committed, pushed to `sobinta/Restaurant`, opened as a pull request, checked by Vercel, merged into `main`, and synchronized back to local `main`.
