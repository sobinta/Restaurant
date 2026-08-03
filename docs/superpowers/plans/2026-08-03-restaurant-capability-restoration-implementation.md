# Restaurant Capability Restoration — Implementation Plan

## Delivery Strategy

Build the approved local-first product in vertical slices. Each slice must leave the application runnable and must reuse the semantic theme, localization, and modal patterns already present. Public UI must never expose demo or preview language; local simulation controls belong only in the restaurant workspace.

## Phase 1 — Foundation

### 1. Domain data and persistence

- Create focused data modules for dishes, events, tables, orders, guests, rewards, campaigns, and analytics seed data.
- Add a versioned local repository backed by IndexedDB with a safe localStorage fallback.
- Add resettable seed data without overwriting an existing compatible local database.
- Define canonical order statuses and valid transitions.
- Add a domain-event layer and `BroadcastChannel` synchronization.
- Move order, reservation, loyalty, and management state out of UI components and into repositories/services.

### 2. Navigation and routing

- Add React Router and define reload-safe public routes for home, dishes, events, account, live orders, and restaurant workspace.
- Preserve hash navigation for homepage sections where appropriate.
- Add route-aware scroll restoration and short cinematic route transitions.
- Ensure direct navigation works under the Vite development server and production fallback configuration.

### 3. Shared UI primitives

- Split the current monolithic application into focused route, feature, and shared-component modules.
- Preserve the approved semantic theme tokens and add semantic status/chart tokens.
- Build reusable page shell, dialog, media, status timeline, empty/error state, form, tabs, and data-card components.

## Phase 2 — Cinematic Public Experience

### 4. Film-light entry sequence

- Build the selected Film Light and Negative logo sequence.
- Keep duration within 1.8–2.4 seconds and provide skip and reduced-motion behavior.
- Prevent focus loss and avoid blocking the application when media or fonts load slowly.
- Add shorter masked transitions for internal route changes.

### 5. Dedicated dish pages

- Route every menu card to `/menu/:dishSlug` while preserving quick-add actions.
- Build poster-first short-video hero behavior with muted inline playback and manual controls.
- Add a keyboard/touch gallery, chef story, ingredient provenance, allergens, nutrition, pairings, availability, favorites, sharing, customization, notes, and add-to-cart.
- Add realistic localized content for every seeded dish.
- Add media error, retry, and fallback states.

### 6. Dedicated event pages

- Make every homepage event card clickable.
- Add cover media, gallery, story, performers, timeline, event menu, terms, capacity, ticket/reservation flow, calendar download, favorite, and share actions.
- Persist bookings and update remaining capacity across customer and restaurant views.

## Phase 3 — Commerce and Guest Account

### 7. Complete ordering flow

- Restore pickup, delivery, and QR/table ordering modes.
- Add delivery address, fee, pickup time, verified/manual table data, promo code, special notes, and local payment adapter states.
- Create a persistent order snapshot at checkout and prevent duplicate submissions.
- Show a confirmation with direct links to the live tracker and account.

### 8. Live order tracking

- Build a complete localized timeline for submitted, confirmed, preparing, cooking, quality check, ready, courier handoff, and completed.
- Adapt the timeline to delivery, pickup, and dine-in orders.
- Sync restaurant changes across tabs and announce changes accessibly.
- Show timestamps, estimates, delay/cancellation messages, fulfilment information, and ordered items.

### 9. Guest account

- Restore profile, bookings, current/past orders, loyalty balance, reward catalog, and redemption.
- Add preferences, allergies, favorites, waitlist, special-evening planner, event bookings, and feedback.
- Ensure allergen warnings override recommendations and recommendation reasons are visible.

## Phase 4 — Reservation and 360 Experience

### 10. Panorama viewer

- Install and integrate Photo Sphere Viewer with a reusable React wrapper.
- Support 2:1 equirectangular media, mouse/touch drag, zoom, fullscreen, keyboard, optional gyroscope, auto-rotation, markers, and cleanup on unmount.
- Add loading, unsupported-browser, failure, retry, reduced-motion, and text-equivalent states.
- Seed at least one functional panorama suitable for local presentation.

### 11. Reservation and waitlist

- Connect the floor map and table cards to the panorama viewer.
- Allow table selection and reservation directly from the panorama.
- Persist bookings, validate availability at confirmation, and add waitlist matching.
- Add a complete reservation summary, deposit adapter, confirmation, and account/restaurant updates.

## Phase 5 — Restaurant Workspace

### 12. Workspace shell and roles

- Add an owner/kitchen/reception/marketing role selector for local use.
- Create role-aware navigation without implying production authentication.
- Make critical kitchen and reception views usable on tablets.

### 13. Live order board

- Add status columns, timers, order details, warnings, manual status actions, drag-and-drop, delay, cancellation, and guest messaging.
- Add presentation autopilot with advance, pause, reset, and per-order selection.
- Validate every transition and preserve an activity history.

### 14. Reservation and floor operations

- Add calendar/service views, floor availability, assignment/reassignment, waitlist matching, and table heatmap.
- Add panorama assignment metadata and hotspot editor controls.

### 15. Content, events, CRM, loyalty, and campaigns

- Add localized dish/media availability controls and pairing management.
- Add event editing, capacity, attendee list, and booking state.
- Restore and expand CRM profiles, segmentation, notes, preferences, occasions, and service history.
- Add reward rules, promo codes, campaign configuration, and private feedback escalation.
- Restore per-table QR generation and printable preview.

### 16. Analytics and branding

- Add seeded but state-responsive order, dish, reservation, event, table, and campaign metrics.
- Add charts/tables that use non-color labels and semantic tokens.
- Preserve restaurant branding, layouts, themes, languages, hours, contact, and social settings.

## Phase 6 — Product Quality

### 17. Localization and accessibility

- Complete all German, English, Persian, and Arabic copy for public and owner views.
- Verify RTL direction, directional icons, drawers, timelines, charts, forms, and panorama controls.
- Verify keyboard navigation, focus management, live regions, labels, error association, and reduced-motion behavior.

### 18. Responsive and performance work

- Verify mobile, tablet, laptop, and wide-screen layouts in both site modes and representative light/dark themes.
- Lazy-load routes, videos, galleries, panoramas, and restaurant workspace modules.
- Use responsive images, poster-first video loading, and compositor-friendly motion.

### 19. Verification

- Run lint and production build after each major phase and at completion.
- Add unit coverage for repositories, totals, promotions, status transitions, capacity, and loyalty transactions.
- Add browser tests for ordering and cross-tab status updates, dish route reload, event booking, reservation/360, reward redemption, QR table ordering, language/RTL, theme/layout persistence, and workspace operations.
- Perform a final browser walkthrough and capture evidence for desktop and mobile.

## Completion Rule

The work is complete only when all acceptance criteria in the approved design specification pass, every visible control performs a meaningful action, persistent local data survives refresh, and the public site contains no demo/preview messaging.
