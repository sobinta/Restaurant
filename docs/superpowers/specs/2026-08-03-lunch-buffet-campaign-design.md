# Lunch Buffet Campaign and Extended Intro Design

## Goal

Introduce Arshida's weekday lunch buffet as a real, discoverable restaurant offering rather than a temporary advertisement. The campaign must appear once per browser session after the cinematic intro and remain permanently accessible through the site navigation, homepage, and food menu.

## Offer

- Availability: Monday through Friday
- Time: 11:30–15:30
- Adult price: €12.50
- Children under 12: €8.99

These facts must use locale-aware number formatting and appear consistently in German, English, Persian, and Arabic.

## Extended cinematic intro

The standard intro remains skippable and increases from roughly 2.2 seconds to roughly 3.4 seconds. Its visual sequence should breathe rather than freeze: the light sweep, mark reveal, restaurant name, and exit each receive a distinct beat. Reduced-motion mode remains brief and does not delay access to the page.

The loader emits a completion event when it finishes naturally or is skipped. Campaign timing depends on that event rather than a duplicated timeout, preventing the popup from overlapping the intro.

## Session campaign popup

After the homepage intro completes, wait briefly and open the buffet campaign modal. Show it only when the session key `arshida-buffet-seen` is absent. Set the key when the modal is displayed, so closing or navigating does not cause repeated interruptions during the same browser session.

The popup contains the weekday schedule, service time, adult price, child price, and two actions:

- Reserve buffet table — opens the existing reservation flow with a buffet note/preselection.
- View buffet in menu — closes the modal and scrolls to the buffet menu section.

It supports backdrop, close-button, and Escape dismissal, traps focus, respects RTL, and uses the current theme tokens. It must not appear on dish, event, live-order, or restaurant-workspace routes.

## Permanent discovery

### Main navigation

Desktop navigation receives a Lunch Buffet link targeting the homepage buffet section. Mobile retains the five-item bottom navigation; its Menu action leads to the food menu where the Buffet category is available.

### Homepage section

A distinctive buffet feature sits between the food menu and restaurant story. It presents the offer as a weekday ritual, shows both prices and service hours, and provides reservation and menu actions. Its design adapts to all eight themes and both cinematic/editorial layouts.

### Food menu

Add a Buffet category to the existing menu filters. A dedicated buffet experience card appears in that category and communicates that the price represents buffet access rather than one dish. The card contains the schedule, time, adult price, child price, and a reservation action. On mobile this is the canonical place reached through the bottom Menu action.

## Data and component boundaries

- A single `lunchBuffet` data object stores schedule, prices, and localized copy.
- `CinematicLoader` reports completion through an `onComplete` callback.
- `BuffetCampaignModal` owns session display and campaign actions.
- `BuffetSection` owns the permanent homepage presentation.
- The menu category and buffet card read from the same data object to prevent conflicting details.

## Validation

- Intro remains visible for approximately 3.4 seconds and can be skipped.
- Popup waits for intro completion and appears once per session only on the homepage.
- Both popup actions reach the correct existing flows.
- Desktop navigation reaches the buffet section.
- The buffet category and card are accessible through the mobile Menu action.
- Monday–Friday, 11:30–15:30, €12.50, and €8.99 remain consistent in all surfaces and languages.
- All eight themes, both layouts, four languages, RTL, mobile safe areas, Escape dismissal, reduced motion, lint, and production build pass.
