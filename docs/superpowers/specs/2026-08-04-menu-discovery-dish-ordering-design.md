# Menu Discovery and Dish Ordering Redesign

## Objective

Create a premium, complete menu-discovery journey that matches ARSHIDA's existing visual system while making ordering obvious and fast. The redesign must preserve all existing restaurant-platform capabilities, all eight appearance themes, the cinematic and editorial site layouts, four languages, and RTL behavior.

## Confirmed Direction

The selected direction is **A — Luxury showcase plus menu list**:

- The homepage remains a curated, cinematic showcase.
- A dedicated `/menu` page provides a fast, row-based full-menu experience.
- Dish detail pages become image-first editorial pages with a persistent desktop ordering rail.
- Ordering remains prominent at every point where a dish is presented.

## Homepage Composition

The homepage content order is:

1. Cinematic or editorial hero, according to the selected site layout.
2. The existing lunch-buffet feature, repositioned before the menu introduction.
3. The menu introduction headed by “Das Aktuelle Menü” in German.
4. Category controls and curated dish cards.
5. The remaining story, experience, events, and newsletter sections.

The current buffet card embedded inside the homepage dish grid is removed, and the separate buffet section after the menu is moved intact to the position immediately before the menu introduction. This produces one homepage buffet presentation. On the full-menu page, the buffet is represented by a dedicated promotional row when `all` or `buffet` is selected, so the buffet category remains useful without duplicating the homepage section.

Each homepage dish category (`signature`, `main`, `starter`, and `dessert`) exposes a localized “View more” action. Selecting it navigates to `/menu?category=<category-id>`. The buffet feature links to `/menu?category=buffet`. The destination page opens with that category active while still allowing the guest to switch categories or search all dishes.

Homepage dish cards retain their premium photography and editorial styling but receive a clearly labeled, high-contrast order button in addition to the details action. Adding a dish updates the shared cart immediately and provides visible success feedback.

## Full Menu Page

Add a dedicated route at `/menu`. It uses the same global navigation, appearance controls, language controls, cart, footer, and shared dish data as the rest of the site.

The page contains:

- A compact editorial introduction.
- Category filters synchronized with the `category` query parameter.
- A localized dish search field.
- A row-based menu list.
- A useful empty state with an action that clears search and category filters.

Each dish row contains:

- A small, high-quality dish image.
- Localized dish name and category.
- A concise localized description.
- Price, rating, and preparation time.
- A prominent localized order action.
- A localized details action linking to `/menu/:slug`.

On mobile, the row becomes a compact card without hiding either primary action. Content must maintain clearance above the existing fixed bottom navigation.

If the query-string category is missing or invalid, the page safely falls back to the all-dishes view. Category changes update the query string so the filtered view is linkable and survives refresh.

## Dish Detail Page

The dish page becomes image-first instead of video-first. Its structure is:

1. A photographic dish hero with the dish name, description, rating, preparation time, and signature label.
2. Chef story and provenance.
3. Image gallery, with all dish images presented before any video.
4. Nutrition, allergens, and pairing information.
5. A short dish film as the last media item.

The film is constrained to the main content column rather than spanning the viewport. It uses the dish image as its poster. If video loading fails, the poster remains as a graceful visual fallback and no empty media area is shown.

On desktop, the content uses a two-column shell:

- The main column contains the narrative, gallery, facts, and film.
- The side column contains a sticky ordering card.

The sticky card includes the dish name, unit and calculated price, quantity controls, order notes, primary add-to-order action, favorite action, share action, and a cart shortcut. It uses `position: sticky` with header-aware top spacing so it stays visible without covering the footer.

On smaller screens, the side card returns to normal document flow. A compact mobile order action remains visible above the existing bottom navigation without obstructing content or duplicating interactive controls unnecessarily.

## Hero Image Position and RTL

On desktop cinematic layout, the hero photograph is biased toward the visual edge opposite the text:

- LTR languages: the plate moves toward the right edge, away from left-aligned copy.
- RTL languages: the plate moves toward the left edge, away from right-aligned copy.

This is implemented with logical-direction-aware styling. Mobile retains its existing text-first structure and gets an explicit image-position reset so the desktop offset does not create an unintended crop.

The editorial layout must also remain balanced in both directions, but no structural redesign of that approved layout is in scope.

## Buffet Campaign Behavior

The buffet campaign modal appears once per full application load, after the cinematic intro completes. Refreshing or directly reloading the site therefore shows it again. Client-side navigation during the same application lifetime does not repeatedly reopen it.

The current session-storage suppression is removed and replaced with an application-mount guard. The modal remains dismissible, accessible, responsive, and localized. Its “View menu” action closes the modal and scrolls to the buffet section now positioned before the menu introduction.

The buffet facts remain:

- Monday through Friday.
- 11:30–15:30.
- Adults: €12.50.
- Children under 12: €8.99.

## Data and Component Boundaries

The existing enriched dish collection remains the canonical data source for:

- Homepage dish cards.
- Full-menu rows.
- Dish detail pages.
- Cart entries.

Shared localized UI copy is extended in the current translation data rather than hard-coded into page components. New page behavior is separated into focused units:

- A dedicated full-menu page owns query-string filtering, search, and menu rows.
- Reusable order actions own cart success feedback.
- The dish detail page owns its media sequence and sticky order card.
- Homepage menu components own only curated discovery and category deep links.

No unrelated refactor of the restaurant operations workspace, live-order system, reservations, events, panorama, profile, or loyalty features is included.

## Accessibility and Interaction Requirements

- All interactive controls have localized accessible names.
- Images have meaningful localized alternative text where appropriate.
- Keyboard focus remains visible in every theme.
- Order and details actions are not communicated by color alone.
- Text and CTA contrast must remain readable in all four dark and four light themes.
- Reduced-motion preferences continue to disable nonessential motion.
- Sticky elements must not obscure the footer, mobile bottom navigation, or modal content.
- LTR and RTL layouts must preserve reading order and logical button placement.

## Error and Empty States

- An invalid menu category falls back to all dishes.
- A search with no results shows a localized empty state and clear-reset action.
- A missing dish slug shows the existing not-found state with a safe route back to the menu.
- A failed dish video displays the poster image instead of an empty player.
- Add-to-cart success is shown locally and the shared cart count updates immediately.

## Verification

Before publication, verify:

- Lint and production build pass.
- The buffet modal appears after every browser refresh, but not repeatedly during in-app navigation.
- The modal's menu action reaches the repositioned buffet section.
- The buffet section appears before “Das Aktuelle Menü” and no duplicate buffet block remains after the menu.
- Every homepage category action opens `/menu` with the correct category selected.
- Direct URLs with valid, invalid, and missing category parameters behave correctly.
- Search, empty-state reset, details links, and order actions work on the full-menu page.
- Adding from homepage, menu list, and dish page updates the same cart.
- Dish images precede the constrained video.
- The desktop order rail remains visible while scrolling and stops naturally with its container.
- Mobile ordering remains usable above the fixed bottom navigation.
- Cinematic hero plate positioning is correct in German/English and mirrored in Persian/Arabic.
- Representative dark and light themes maintain readable text and controls.
- Desktop and mobile screenshots show no overlap, clipping, or horizontal overflow.

## Delivery

Implementation will be completed on a focused feature branch. After verification, all work will be intentionally committed, pushed to `sobinta/Restaurant`, opened as a pull request, and merged into `main`. Local `main` will then be synchronized with the remote merge result.
