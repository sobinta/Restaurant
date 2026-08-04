# Pickup-Aware Tracking and Persian Typography — Implementation Plan

## Goal

Make order tracking derive its stages and customer labels from the selected fulfilment method, add the approved order dossier to the Live Signal rail, and apply Vazirmatn/Lalezar consistently to Persian content without regressing other languages, themes, or live updates.

## Steps

1. **Define fulfilment-aware status utilities**
   - Add a shared helper that returns the valid status sequence for delivery, pickup, and dine-in orders.
   - Add type-specific localized copy for the `ready` and `completed` stages.
   - Reuse the helper in the customer tracker and restaurant workspace advance/back/autopilot paths.

2. **Extend localized order-detail copy**
   - Add dossier labels, fulfilment names, restaurant/location labels, and unavailable fallbacks in German, English, Persian, and Arabic.
   - Keep all date/time formatting locale-driven.

3. **Build the order dossier**
   - Render order number, creation date/time, fulfilment information, restaurant or destination details, and ordered items.
   - Resolve item images and localized names from `dishId`; render a monogram fallback for legacy items.
   - Add an internally scrollable, accessible item list for long orders.

4. **Integrate the dossier responsively**
   - Place it between the estimate and Live Signal reading on desktop.
   - Convert it to a compact full-width block on tablet and mobile.
   - Preserve the current active-stage auto-centering and prevent page-level overflow.

5. **Apply Persian typography**
   - Add Lalezar to the existing font import.
   - Scope Vazirmatn body typography to `html[lang="fa"]`.
   - Scope Lalezar to Persian semantic headings and audited display-title selectors.
   - Keep German/English typography and Arabic Noto treatment intact; retain data fonts for prices, IDs, and times.

6. **Verify order workflows**
   - Confirm delivery uses eight stages.
   - Confirm pickup and dine-in use seven stages and skip courier in customer and restaurant workflows.
   - Confirm advance, back, drag/drop, and autopilot remain synchronized with the customer page.

7. **Verify presentation and accessibility**
   - Test long and legacy item lists, keyboard scrolling, missing data fallbacks, LTR/RTL, reduced motion, desktop/mobile layouts, and dark/light palettes.
   - Inspect representative Persian pages for Vazirmatn body and Lalezar headings.
   - Run lint and production build.

8. **Publish**
   - Commit implementation changes on the feature branch.
   - Push to GitHub, open a draft pull request, verify Vercel checks, mark ready, merge into `main`, and synchronize local `main`.

## Expected Files

- `src/context/AppContext.jsx` or a focused shared order-status utility
- `src/pages/LiveOrderPage.jsx`
- `src/pages/RestaurantWorkspace.jsx`
- `src/data/platformData.js`
- `src/index.css`
- Browser-test artifacts outside version control

## Acceptance Criteria

- Pickup and dine-in never enter the courier stage through any supported workspace action.
- Customer labels accurately reflect delivery, pickup, or table service while existing status IDs remain compatible.
- The approved dossier shows real order data and scrolls internally for long lists.
- Persian text and headings use the requested fonts across the complete public site.
- Four languages, eight themes, live synchronization, mobile auto-focus, lint, build, and targeted browser tests pass.
