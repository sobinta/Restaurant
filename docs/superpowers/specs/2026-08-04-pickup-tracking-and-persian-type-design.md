# Pickup-Aware Tracking and Persian Typography

## Objective

Synchronize the customer live tracker with the fulfilment method selected during online checkout, add an order dossier to the unused area of the Live Signal rail, and establish Vazirmatn and Lalezar as the Persian body and display typefaces throughout the site.

## Approved Visual Direction

The approved sidebar treatment is **Option A — Order Dossier**. It retains the existing colored service ribbon and Live Signal identity while using the currently empty middle area of the side rail for concise operational order details.

The dossier must feel integrated with the tracker rather than like a second receipt. It uses the rail's existing surface, fine rules, compact utility labels, and restrained image thumbnails.

## Fulfilment-Aware Status Journeys

The application continues to use the existing internal status identifiers and shared order state. Customer-facing stages and labels are derived from `order.type`; no parallel status machine is introduced.

### Delivery

Delivery retains all eight stages:

1. Order received.
2. Confirmed by restaurant.
3. Preparing.
4. Cooking / in the oven.
5. Final quality check.
6. Ready for handoff.
7. With the courier.
8. Delivered.

### Pickup

Pickup omits the courier stage and renders seven stages. The final two stages use pickup-specific copy:

1. Order received.
2. Confirmed by restaurant.
3. Preparing.
4. Cooking / in the oven.
5. Final quality check.
6. Ready for pickup at the restaurant.
7. Picked up by the customer.

Internally, these final stages continue to map to `ready` and `completed`. This keeps persisted orders, live updates, history, restaurant operations, and profile links compatible.

### Dine-in

Dine-in also omits the courier stage and uses service-specific final copy:

1. Order received.
2. Confirmed by restaurant.
3. Preparing.
4. Cooking / in the oven.
5. Final quality check.
6. Ready to serve.
7. Served at the table.

The final stages map to the same internal `ready` and `completed` identifiers.

## Restaurant Workspace Coordination

The restaurant workspace remains the source of order-status changes. Advancing a pickup or dine-in order must skip `courier_handoff` rather than moving the order into a delivery-only state.

Manual advance, back, drag/drop, and presentation autopilot must use an order-type-aware status sequence. Delivery orders use all eight statuses; pickup and dine-in use seven. The completed workspace column can contain all completed fulfilment types, while customer-facing labels remain type-specific.

## Order Dossier

The dossier occupies the middle of the existing Live Signal side rail, between the estimate and current-signal reading on desktop.

It displays:

- Order number.
- Localized order date.
- Localized order time.
- Fulfilment type.
- Restaurant name and address for pickup.
- Restaurant name, table number, or service location for dine-in.
- Delivery destination for delivery orders, with the restaurant identity retained as the order source.
- Ordered dishes with quantity and a compact image when available.

The item's existing `dishId` is used to find its localized title and thumbnail from the menu dataset. Legacy items without `dishId` fall back to their stored name and a restrained ARSHIDA monogram tile.

The list area has a fixed maximum height and `overflow-y: auto`. Short orders do not show an unnecessary scrollbar. Long orders scroll within the dossier without increasing the tracker height or moving the Live Signal reading out of place. Scrollbars remain subtle, keyboard accessible, and direction-aware.

## Responsive Behavior

### Desktop

The side rail remains beside the service ribbon. Its vertical order is:

1. Live estimate.
2. Order dossier.
3. Live Signal current-state reading and waveform.

### Tablet

When the tracker becomes stacked, the rail becomes a full-width information band. The dossier uses a compact multi-column layout when space permits.

### Mobile

The Live Signal area remains above the service ribbon. The dossier becomes a full-width block within that area, with a compact metadata grid and an internally scrollable dish list. The current status and active stage remain immediately visible, and the existing automatic stage-centering behavior is preserved.

## Typography

The Google Fonts import adds `Lalezar` while retaining `Vazirmatn`.

Typography is language-specific:

- When `html[lang="fa"]` is active, all normal interface and content text uses Vazirmatn.
- Persian semantic headings `h1` through `h6` and existing heading-like display selectors use Lalezar.
- Numeric data, prices, times, order IDs, and brand marks retain their established Latin/data type treatment when that improves legibility.
- German and English keep the current Manrope/Cormorant system.
- Arabic keeps its current Arabic type treatment and is not unintentionally switched to the Persian display face.

The Persian heading override must include prominent component titles that are not semantic heading elements, including major hero titles, event and dish titles, tracker current-state display text, modal titles, and editorial section titles. Buttons, labels, navigation, form controls, paragraphs, and metadata remain Vazirmatn.

## Localization

All new labels are provided in German, English, Persian, and Arabic, including:

- Pickup final-stage labels.
- Dine-in final-stage labels.
- Order dossier title and field labels.
- Fulfilment type labels.
- Restaurant and delivery-location labels.
- Empty or unavailable item-image fallback text when exposed accessibly.

Dates and times use `Intl.DateTimeFormat` with the active language. Direction, alignment, and scroll behavior respect LTR and RTL.

## Data and Failure Handling

- Missing `createdAt` falls back to the earliest history timestamp; if neither exists, the field displays a neutral dash.
- Missing customer delivery address displays a localized unavailable label rather than an empty row.
- Missing menu metadata does not remove an ordered item; its stored name and monogram fallback remain visible.
- Unknown order types use the non-delivery seven-stage sequence and neutral fulfilment copy without exposing delivery-only stages.
- Existing missing-order handling remains unchanged.

## Accessibility

- Status remains communicated by text, icon, sequence, and `aria-current`, not color alone.
- The dossier dish list is a labeled region and becomes keyboard scrollable only when it overflows.
- Dish thumbnails use empty alt text when the adjacent title already names the dish; fallback tiles are decorative.
- Reduced-motion behavior from the current tracker remains unchanged.
- Persian and Arabic reading order is validated independently.

## Verification

Before publication, verify:

- Delivery shows all eight delivery stages.
- Pickup shows seven stages, omits courier, and uses pickup-specific final labels.
- Dine-in shows seven stages and uses service-specific final labels.
- Workspace advance, back, drag/drop, and autopilot never place non-delivery orders into `courier_handoff`.
- Live updates stay synchronized between workspace and customer tracker.
- Dossier number, localized date/time, fulfilment detail, location, and items match the order data.
- A long item list scrolls internally without growing the tracker or hiding the Live Signal reading.
- Legacy items without `dishId` render a name and fallback tile.
- Persian body text uses Vazirmatn and Persian headings use Lalezar across representative home, menu, dish, event, modal, tracker, footer, and mobile navigation views.
- German, English, and Arabic typography is not regressed.
- German and Persian layouts work across at least one dark and one light theme, followed by automated checks across all eight themes.
- Existing mobile active-stage auto-focus continues to work in LTR and RTL.
- Lint, production build, and targeted browser tests pass.

## Delivery

Implementation will remain on the focused feature branch. After browser and visual verification, the change will be committed, pushed to `sobinta/Restaurant`, opened as a pull request, checked by Vercel, merged into `main`, and synchronized back to local `main`.
