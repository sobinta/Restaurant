# Restaurant Website Visual Redesign

Date: 2026-08-03

## Objective

Redesign the existing Arshida restaurant application as a polished, production-style restaurant website that can immediately attract prospective restaurant clients. The public experience must never describe itself as a demo, reference, preview, presenter mode, or sales tool.

The redesign preserves the existing menu, ordering, cart, promotions, reservation wizard, table map, 360-degree table view, profile, loyalty, CRM, campaign, localization, and white-label capabilities. Management-only capabilities move out of the public navigation.

## Experience Direction

The visual language is luxurious, contemporary, and cinematic. It uses strong food imagery, expressive typography, controlled contrast, restrained motion, and deliberately composed layouts. The design avoids generic dashboard cards, decorative gradients without purpose, excessive pills, and ornamental effects that compete with the food.

The product offers two complete public layouts. Both consume the same content and application state:

1. **Cinematic Experience:** a high-impact food-led hero, immediate reservation call to action, 360-degree table experience, featured menu, events, social proof, and ordering.
2. **Editorial Brand Journal:** a magazine-like seasonal cover, chef and sourcing stories, editorial menu features, and persistent access to reservation and ordering.

The visitor can switch layouts through a two-position control labeled “Site layout.” In RTL languages the control mirrors visually while preserving the meaning of both choices. Switching layouts must not reset the cart, reservation progress, signed-in profile state, language, or selected color theme.

## Color System

The site includes eight complete themes, arranged as four dark/light families. Theme selection is available in the public appearance panel and persists on the current device.

### Dark themes

- **D1 — Obsidian, Saffron, Olive:** `#12130F`, `#3D422E`, `#D7A84B`, `#F4EEE1`
- **D2 — Black Plum, Rose Copper, Oyster:** `#1D101B`, `#672F4F`, `#DD8B72`, `#F8EDE9`
- **D3 — Night Forest, Amber, Porcelain:** `#091B17`, `#24624E`, `#D49A55`, `#F3F0E7`
- **D4 — Midnight Ink, Champagne, Oxblood:** `#08111D`, `#274C67`, `#D4BD87`, `#802E39`

### Light themes

- **L1 — Pearl, Sage, Saffron:** `#FBFCF6`, `#DFE4CF`, `#34412C`, `#B87916`
- **L2 — Oyster, Smoky Rose, Plum:** `#FFF9F8`, `#EAD9DF`, `#5B2948`, `#B85063`
- **L3 — Green Mist, Jade, Caramel:** `#F8FCFA`, `#D4E6DF`, `#1D5947`, `#BF6B2F`
- **L4 — Ice, Steel Blue, Wine:** `#F8FBFD`, `#D6E0EB`, `#264F72`, `#923947`

Each theme defines semantic tokens rather than raw component colors: page background, elevated surface, interactive surface, primary and secondary text, muted text, primary and secondary actions, action text, borders, focus ring, success, warning, error, overlay, and shadows. Hover, active, disabled, and focus states derive from those tokens. Text and interactive controls must meet WCAG AA contrast for their rendered size in every theme.

## Localization

German is the default language. English, Persian, and Arabic are also available. All public and management interface copy, validation, empty states, status messages, button labels, metadata, and sample content are included in each language.

- German and English render left-to-right.
- Persian and Arabic render right-to-left.
- Layout direction, directional icons, drawers, breadcrumb/order, and control alignment respond to the active direction.
- Language, theme, and site-layout preferences persist locally.
- Existing mojibake or incorrectly encoded content is replaced with valid UTF-8 text.

## Public Information Architecture

The public site contains:

- a focused header with menu, experiences, reservation, cart, account, language, and appearance controls;
- a layout-specific hero;
- digital menu search, category and dietary filters, dish details, customization, and add-to-order actions;
- ordering for pickup, delivery, and dine-in QR modes;
- a reservation flow with date, party size, table map, 360-degree view, guest details, and confirmation;
- chef, sourcing, seasonal-menu, and restaurant-story content;
- events and promotions;
- guest testimonials and trust signals;
- profile, order status, booking history, and loyalty rewards;
- location, contact details, opening hours, newsletter, and a complete footer.

The appearance control is compact and secondary to reservation and ordering. It contains only the two layout choices and the eight theme choices. Language selection remains a separate control.

## Management Boundary

CRM, campaigns, restaurant branding, logo/name/tagline editing, and administrative appearance defaults are removed from the public header and promotional content. A subtle “Restaurant Login” link in the footer opens the separate management surface. The current mock management functionality remains available there.

This redesign does not add production authentication, a backend, live payments, persistent server storage, or third-party messaging. The management boundary is structural and presentational in this phase; it must not claim security that does not exist.

## State and Component Boundaries

- **Appearance state:** active theme and active layout, persisted locally and exposed through semantic attributes/tokens.
- **Locale state:** active language, translation lookup, document language, and direction.
- **Commerce state:** cart contents, quantities, promo code, order mode, and totals.
- **Reservation state:** step, date/time, party size, table selection, 360 viewer, guest details, and confirmation.
- **Guest state:** profile, loyalty, booking history, and active order.
- **Management state:** branding presets, CRM records, campaigns, and manager-only panels.

Public sections use these shared state boundaries and do not duplicate business logic between the two layouts. Layout-specific components control composition only. Switching layout or theme is therefore presentation-only.

## Interaction and Motion

- Use one orchestrated entrance sequence in the hero and restrained section reveals.
- Use motion for layout/theme transitions and meaningful feedback, not continuous decoration.
- Respect `prefers-reduced-motion` by removing nonessential movement and shortening transitions.
- Provide visible keyboard focus, accessible names, predictable Escape behavior in overlays, focus trapping in modals, and appropriately sized touch targets.
- Keep reservation and ordering calls to action consistently named across triggers, dialogs, confirmations, and status messages.

## Validation, Errors, and Empty States

- Validate forms at the field level and explain how to correct invalid values.
- Announce important form and cart status updates accessibly.
- Disable destructive or impossible actions with an explanatory state.
- Provide useful empty states for cart, search results, bookings, rewards, campaigns, and CRM lists.
- Retain user-entered data when a recoverable action fails.
- Use each theme’s semantic success, warning, and error colors without relying on color alone.

## Responsive Behavior

The site is designed for mobile, tablet, laptop, and wide desktop. Mobile navigation collapses without hiding primary reservation/cart actions. Menu filters remain horizontally usable or wrap cleanly. Dialogs become safe full-height sheets where appropriate. The table map and 360 interaction provide touch instructions and usable controls on small screens.

## Acceptance Criteria

- Both layouts render the same complete feature set and share state.
- All eight themes can be selected in either layout.
- Text, buttons, controls, overlays, and feedback states remain legible and visually coherent in all sixteen layout/theme combinations.
- German loads by default; German, English, Persian, and Arabic can be selected without broken or untranslated interface text.
- RTL direction works throughout Persian and Arabic experiences.
- Public navigation contains no demo/presenter/white-label/CRM messaging.
- Management tools are reachable only through the separate management entry.
- Existing cart, menu, reservation, 360-view, profile, loyalty, CRM, campaign, and branding interactions continue to work.
- Core flows work with keyboard and touch, reduced-motion preferences are respected, and responsive layouts have no horizontal overflow.
- Production build and lint complete successfully.

## Out of Scope

- Real authentication and authorization
- Backend APIs and databases
- Production payment processing
- Real SMS/email delivery
- A production content-management system
- Replacement of mock restaurant data with a client-specific content package
