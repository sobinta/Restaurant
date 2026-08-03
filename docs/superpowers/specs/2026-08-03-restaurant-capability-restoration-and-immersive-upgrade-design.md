# Restaurant Capability Restoration and Immersive Upgrade

## Objective

Upgrade the existing Arshida restaurant website without replacing its approved visual identity. Restore every capability that existed before the visual redesign, make it consistent with both approved layouts and all eight color themes, and add differentiated guest and restaurant-owner capabilities that make the product credible as a complete restaurant platform.

The initial local version must contain the same visible product capabilities planned for the final product. It must not contain “coming soon” sections, dead controls, or presentational-only flows. Integrations that require a specific restaurant account or commercial provider use functional local adapters with realistic success, pending, and failure states. The same interfaces will later connect to production services.

## Confirmed Direction

- Preserve the current visual foundation, two selectable layouts, eight color themes, and four languages.
- German remains the default language. English, Persian, and Arabic remain fully supported, including RTL behavior for Persian and Arabic.
- Make the design more distinctive through a coherent cinematic motion system rather than replacing it with the restrained visual language of the reference restaurants reviewed.
- Use the selected **Film Light and Negative** motion direction: controlled light sweeps, subtle film texture, typographic masks, and editorial page transitions.
- Use the selected **Cinematic Narrative** dish-page direction: short film first, full-width gallery, chef narrative, and progressive storytelling through scroll.
- Implement a dual live-order model: restaurant staff can update an order manually, while an optional autopilot mode advances a sample order during a sales presentation.

## Product Modes and Navigation

The existing **Cinematic Experience** and **Editorial Brand Journal** layouts remain selectable through the site-layout control. Both layouts expose the same complete functionality and data. Layout selection affects composition and storytelling, never feature availability.

The eight approved themes remain selectable and continue to use semantic color tokens. All new components use these tokens for typography, buttons, status colors, borders, focus indicators, overlays, and charts. Status meaning remains consistent across themes and never relies on color alone.

Dish and event content uses real routes rather than modal-only navigation:

- `/menu/:dishSlug`
- `/events/:eventSlug`
- `/account`
- `/order/:orderId`
- `/restaurant` for the protected restaurant workspace in the production architecture

The local build may open account and restaurant workspace views within the single-page application, but route state must remain shareable and reload-safe.

## Cinematic Entry and Motion System

On every new page load or browser refresh, the Arshida logo appears as a short cinematic title sequence before the main page is revealed. The sequence uses a moving light beam, subtle film grain, masked letterforms, and a clean transition into the hero. It should feel like a short title card, not an advertisement.

- Target duration: 1.8–2.4 seconds.
- A skip action appears for keyboard and pointer users.
- `prefers-reduced-motion` replaces the sequence with a short opacity transition.
- Page content remains accessible in the document and focus is moved safely after the sequence.
- Route-to-route transitions are shorter than the initial entry and never block repeated navigation.
- Scroll reveals use transforms and opacity only where possible to preserve rendering performance.
- Film grain is subtle, non-blocking, and disabled on constrained devices when necessary.

## Dish Detail Experience

Every menu item links to a dedicated cinematic narrative page. The page contains:

1. A poster-first hero with an optional muted short film. The poster remains visible until the video can play.
2. Dish name, short positioning statement, current price, preparation time, rating, and availability.
3. A full-width image gallery with keyboard, touch, and pointer controls.
4. A chef narrative covering the inspiration and creation of the dish.
5. Ingredient provenance and production stories.
6. Ingredients, allergens, dietary labels, and nutrition information.
7. Preparation or doneness options where applicable.
8. Recommended beverage, side, and dessert pairings.
9. Quantity, customization, special notes, and add-to-order controls.
10. Favorite and share actions.
11. Related dishes based on flavor, dietary compatibility, and current availability.

Unavailable media shows a branded fallback and retry control. Unavailable dishes remain discoverable for storytelling but cannot be ordered; the UI explains the availability state and can offer an alert when the dish returns.

## Real 360-Degree Table Experience

The table preview uses actual equirectangular panoramas captured or rendered from each table position. Photo Sphere Viewer is the selected viewer because it supports standard equirectangular panoramas, mouse drag, touch gestures, zoom, gyroscope support, markers, and 360-degree media.

Each table panorama supports:

- smooth full 360-degree horizontal movement and appropriate vertical movement;
- mouse drag, touch drag, wheel/pinch zoom, keyboard controls, and fullscreen;
- optional gyroscope control on supported mobile devices after explicit permission;
- an initial subtle auto-rotation that stops immediately after user interaction;
- hotspots for window view, stage, bar, accessibility, proximity notes, and other table-specific information;
- direct table selection and reservation from within the panorama;
- a visible fallback image and standard table card if WebGL or the panorama fails;
- loading progress and a retry action;
- accessible non-visual table details equivalent to hotspot content.

The owner workspace can assign, replace, preview, and publish a panorama for each table and manage its hotspots. Source photos use a 2:1 equirectangular format or a supported cubemap format.

## Special Night and Event Experience

Every special-night card at the end of the homepage is clickable and links to a complete event page. Each event contains:

- cinematic cover media and gallery;
- event story and concept;
- date, doors-open time, start time, and expected duration;
- performers, chef, host, or collaborators;
- full event program or timeline;
- event-specific menu and beverage pairing;
- price, included items, cancellation terms, dress guidance, and age restrictions where applicable;
- remaining capacity and seating options;
- accessibility and transport information;
- reservation or ticket purchase flow;
- add-to-calendar, favorite, and share actions.

The event booking updates remaining capacity locally and appears in the guest account and restaurant workspace immediately.

## Ordering and Live Fulfilment

The restored ordering flow supports:

- pickup;
- delivery;
- dine-in ordering from a table QR code.

Delivery requests collect and validate an address and calculate a delivery fee. Dine-in requests retain the verified table identifier from the QR entry point, with a local manual table selector for testing. Pickup exposes the expected collection window.

Checkout creates a persistent order with item snapshots, customization choices, pricing, fulfilment type, customer details, timestamps, and status history. The order appears immediately in both the guest tracker and the restaurant order board.

The canonical status pipeline is:

1. `submitted`
2. `confirmed`
3. `preparing`
4. `cooking`
5. `quality_check`
6. `ready`
7. `courier_handoff` for delivery orders
8. `completed`

Pickup and dine-in orders skip irrelevant courier stages. Staff can advance, reverse with a reason, pause, or cancel an order. Every change records a timestamp and updates the guest-facing timeline. Status labels are fully localized.

Autopilot mode is explicitly controlled from the restaurant workspace. It advances a selected local order on realistic short demonstration intervals and can be paused or reset. It is never active by default in a production-connected environment.

## Guest Account and Differentiated Features

The account experience includes profile data, current and past orders, live order tracking, reservations, event bookings, favorites, loyalty status, and rewards.

Additional guest-focused capabilities are:

- a preference profile for dietary needs, allergens, disliked ingredients, preferred flavors, and desired spend;
- contextual recommendations based on those preferences and current availability;
- a “Design a Special Evening” flow for occasion, preferred atmosphere, table, menu, timing, and special requests;
- a smart waitlist for a specific date, time, party size, table, or dining area;
- an availability alert when the preferred table becomes available;
- favorite dishes, tables, and events;
- reward redemption with immediate balance and reward-history updates;
- discreet post-visit feedback with a restaurant response path.

Recommendations must explain why an item is suggested and must never present allergen compatibility as a guarantee. Explicit allergen warnings override promotional recommendations.

## Restaurant Workspace

The owner-facing workspace includes role-aware views for owner/manager, kitchen, reception, and marketing.

### Live Order Board

- Drag-and-drop columns matching the canonical order pipeline.
- Timers for time spent in each status.
- Order details, customer notes, allergen warnings, fulfilment type, and payment state.
- Manual status controls usable without drag-and-drop.
- Pause, cancellation, delay reason, and guest-facing message actions.
- Autopilot controls for local presentations.

### Reservations and Floor

- Calendar and service-period views.
- Interactive floor map with availability and occupancy.
- Table assignment, reassignment, and reservation details.
- 360-degree panorama and hotspot management per table.
- Waitlist matching and promotion into available slots.
- A table popularity heatmap and booking conversion view.

### Menu and Media

- Dish creation and editing in all four languages.
- Price, category, customization, allergens, nutrition, availability, and inventory status.
- Gallery, poster, short video, and narrative management.
- Pairing and related-dish management.
- Temporary “86/unavailable” controls reflected immediately in ordering.

### Events

- Event creation and editing in all four languages.
- Program, media, menu, collaborators, capacity, pricing, and booking terms.
- Booking list, capacity updates, and attendee export-ready structure.

### CRM, Loyalty, and Campaigns

- Guest profiles with visits, spend, preferences, allergens, occasions, favorite table, and service notes.
- Segments for VIP guests, birthdays, anniversaries, inactive guests, dietary preferences, and behavior.
- Loyalty rules, balance history, reward catalog, and redemption state.
- Campaign creation with audience, offer, schedule, and performance state.
- Promo codes and validation rules.
- Private feedback inbox and negative-feedback escalation.

### Analytics

- Dish impressions, detail views, add-to-cart rate, purchases, revenue, and estimated margin.
- Order volume and fulfilment time by channel and time period.
- Reservation demand, cancellations, waitlist conversions, and table popularity.
- Event page views, booking conversion, capacity, and revenue.
- Campaign reach and conversion using locally generated presentation data.

### Brand and QR Management

- Restaurant name, descriptor, logo, contact details, hours, and social links.
- Both site layouts, all eight themes, and four-language content.
- A QR generator for each table with a table-bound dine-in route and printable card preview.

## Local Data and Real-Time Architecture

The initial version uses a local-first repository layer instead of embedding state in UI components.

- IndexedDB stores persistent entities and media metadata.
- `BroadcastChannel` synchronizes customer and restaurant views across tabs and windows.
- A domain event bus distributes updates within a tab.
- Seed data creates a complete realistic restaurant state on first use.
- A reset action restores seed data after explicit confirmation.
- Versioned local migrations protect data as the schema evolves.

UI components consume repository and service interfaces. Production adapters can later replace local repositories with HTTP APIs, real-time channels, authentication, object storage, payments, email, and SMS without changing domain components.

The domain model includes guests, dishes, dish media, tables, panoramas, hotspots, reservations, waitlist requests, events, event bookings, cart items, orders, order status events, loyalty transactions, rewards, feedback, campaigns, promo codes, and brand settings.

## External Integration Adapters

The local build includes functional adapters for:

- payment authorization, success, decline, and cancellation;
- SMS and email delivery logs;
- media upload progress, completion, retry, and failure;
- authentication sessions and role selection;
- delivery quote and courier status simulation.

Local adapter behavior is clearly identified only inside the restaurant workspace. The public restaurant site behaves like a finished product and contains no “demo” or “preview” messaging.

## Accessibility, Localization, and Responsive Behavior

- All controls are keyboard accessible and expose visible focus states.
- Dialogs trap focus, restore focus, and close consistently.
- Live status changes use polite accessible announcements.
- Motion respects reduced-motion preferences.
- Status and chart meaning never depends on color alone.
- German, English, Persian, and Arabic cover navigation, metadata, validation, empty states, errors, statuses, media labels, owner tools, and seeded content.
- Persian and Arabic use complete RTL mirroring, including directional controls and drawer placement.
- Mobile retains ordering, reservation, 360-degree control, live tracking, and owner critical actions without horizontal overflow.

## Error Handling and Recovery

- Panorama, image, and video failures provide branded fallbacks, retry, and equivalent textual information.
- Failed local writes preserve the user’s input and show a recoverable error.
- Cross-tab synchronization conflicts resolve using entity versions and most-recent valid domain events.
- Checkout cannot submit duplicate orders while a request is pending.
- Capacity and availability are revalidated at the final reservation or event-booking step.
- Invalid status transitions are rejected and explained.
- Destructive owner actions require confirmation and are recorded in local activity history.

## Performance

- Route-level code splitting separates public pages and the restaurant workspace.
- Images use responsive sources and lazy loading below the fold.
- Videos use posters, metadata-first loading, and user/device-aware playback.
- Panoramas load only when requested and may use tiled/multi-resolution assets for production photography.
- Motion prioritizes compositor-friendly transforms and opacity.
- The cinematic loader must not delay content beyond its target duration when assets are slow.

## Verification and Acceptance Criteria

The upgrade is complete when:

1. All restored and new public features work in both layouts and all eight themes.
2. All public and owner-facing copy is available in the four languages with correct LTR/RTL behavior.
3. A new order persists through refresh, appears in the restaurant board, and updates live in the guest tracker when its status changes in another tab.
4. Autopilot can advance, pause, and reset a selected order without corrupting manual order state.
5. Every menu item opens a reload-safe dedicated page with working media, details, customization, favorite, and order actions.
6. Every special-night card opens a complete reload-safe event page and its booking updates capacity and both account views.
7. A supplied 2:1 panorama can be assigned to a table and controlled smoothly by mouse, touch, keyboard, fullscreen, zoom, and supported gyroscope input.
8. Reservation, waitlist, loyalty redemption, QR dine-in, CRM, campaign, menu, media, and analytics flows are functional with persistent local data.
9. Media, payment, and synchronization failure states are recoverable.
10. Keyboard accessibility, reduced-motion behavior, responsive layouts, linting, production build, and critical end-to-end flows pass verification.

## Out of Scope for the Local Build

The following require restaurant-specific production credentials or infrastructure and therefore use the adapters described above:

- settlement of real money;
- delivery of real SMS and email;
- production identity verification and password recovery;
- cloud object storage and transcoding;
- production POS, kitchen display, courier, accounting, or reservation-provider integration;
- multi-location tenancy and billing.

These integrations remain part of the final product architecture and do not require redesigning the user experience.
