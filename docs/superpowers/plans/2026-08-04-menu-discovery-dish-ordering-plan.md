# Menu Discovery and Dish Ordering Implementation Plan

## Goal

Implement the approved luxury showcase plus menu-list experience, refresh the dish-detail ordering layout, fix buffet refresh behavior and placement, and correct the cinematic hero crop in LTR and RTL without regressing existing platform features.

## 1. Shared Copy and Menu Data

- Extend localized page copy for menu-page headings, filters, row actions, success messages, media labels, cart shortcut, and empty states in German, English, Persian, and Arabic.
- Keep `enrichedDishes` as the canonical collection.
- Add a small shared category-validation helper if needed so homepage links and `/menu` filtering use the same category IDs.
- Verify buffet data remains canonical and is not duplicated in page components.

## 2. Reusable Ordering UI

- Extract a focused order-action component or hook for local “added” feedback while delegating cart state to `AppContext`.
- Build a reusable menu-row component with image, concise metadata, details link, and explicit order action.
- Ensure buttons have localized accessible names and do not rely on icon-only meaning.

## 3. Dedicated Full Menu Page

- Add `src/pages/MenuPage.jsx` and lazy-load it from `App.jsx`.
- Add the exact `/menu` route before `/menu/:slug`.
- Read and validate `category` through React Router search parameters.
- Synchronize category changes back to the URL.
- Implement localized search, empty reset, buffet promotional row, and responsive dish rows.
- Preserve Navbar, Footer, appearance, language, cart, and mobile bottom navigation behavior.

## 4. Homepage Menu and Buffet Flow

- Move the existing `BuffetSection` before `MenuSection`.
- Remove `BuffetMenuCard` from the homepage dish grid.
- Keep the homepage menu as a curated discovery area rather than a full list.
- Add category-aware “View more” links to `/menu?category=<id>`.
- Replace icon-only add controls with clear localized order actions and visible success feedback.
- Update the buffet modal's menu action to target the repositioned buffet section.

## 5. Refresh-Scoped Buffet Modal

- Remove `sessionStorage` suppression.
- Add an application-mount ref guard so the campaign opens once after the intro per full page load.
- Verify browser refresh reopens the campaign and internal route navigation does not.

## 6. Cinematic Hero LTR/RTL Crop

- Adjust desktop hero image positioning away from the text using logical direction state.
- Mirror the offset for Persian and Arabic.
- Reset image positioning in the mobile text-first layout.
- Verify both site-layout modes remain visually balanced.

## 7. Dish Detail Redesign

- Replace the video-first full-viewport hero with an image-first dish hero.
- Create a two-column desktop content shell.
- Order media as gallery images first and constrained short film last.
- Move quantity, notes, pricing, favorite, share, cart shortcut, and primary order action into a sticky desktop side card.
- Provide a non-sticky mobile order card and a compact mobile CTA that clears the existing bottom navigation.
- Preserve not-found, share, favorite, and video-error behavior.

## 8. Styling and Responsive States

- Add theme-token-based styles for the full-menu introduction, filters, buffet row, dish rows, success states, detail shell, gallery, constrained film, and sticky order card.
- Test representative dark and light themes for contrast.
- Add LTR/RTL and desktop/tablet/mobile rules.
- Preserve reduced-motion behavior and avoid horizontal overflow.

## 9. Automated and Visual Verification

- Run `npm run lint` and `npm run build`.
- Use browser automation against the isolated local server to test:
  - refresh-scoped buffet modal;
  - buffet section order and absence of duplication;
  - category deep links and invalid-category fallback;
  - menu search and reset;
  - add-to-cart from homepage, full menu, and dish detail;
  - detail route navigation;
  - gallery-before-film order;
  - sticky desktop ordering rail;
  - mobile clearance above the bottom navigation;
  - German/English LTR and Persian/Arabic RTL hero crop.
- Capture desktop and mobile screenshots for visual inspection.

## 10. GitHub Delivery

- Review the final diff for unintended files and secret material.
- Commit implementation and test changes intentionally on `agent/menu-discovery-dish-ordering`.
- Push the branch to `sobinta/Restaurant`.
- Open a draft pull request with summary and verification evidence.
- Confirm required checks pass, mark ready, and merge to `main`.
- Synchronize local `main` and verify local and remote heads match.
