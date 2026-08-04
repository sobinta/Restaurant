# Live Order Tracker Redesign — Implementation Plan

## Goal

Implement the approved eight-stage service ribbon and Live Signal panel on the customer order page while preserving the existing order pipeline, receipt, localization, themes, and restaurant workspace behavior.

## Implementation Steps

1. **Extend localized page copy**
   - Add Live Signal, update-time, estimate, stage-state, and accessibility labels in German, English, Persian, and Arabic.
   - Continue using the existing localized status labels as the single source of truth.

2. **Refactor the customer tracker composition**
   - Keep the compact order identity hero and receipt.
   - Introduce a framed tracker surface containing the service ribbon, active-stage summary, and Live Signal panel.
   - Derive all active/completed/future states from the existing order object and history.

3. **Build the semantic stage ribbon**
   - Map each order status to its icon and stable semantic color.
   - Render eight stages for delivery and seven for pickup/dine-in.
   - Show stage number, localized label, timestamp, and accessible current-state semantics.

4. **Add Live Signal motion and reduced-motion support**
   - Add a soft breathing highlight to the active stage and live dot.
   - Add five low-amplitude decorative signal bars.
   - Disable nonessential animation when `prefers-reduced-motion: reduce` is active.

5. **Implement mobile active-stage auto-focus**
   - Maintain references for each rendered stage.
   - On initial render and only when the active order status changes, bring the active stage to the horizontal center with `scrollIntoView`.
   - Use immediate positioning for reduced-motion users and preserve manual scrolling between status changes.
   - Confirm native behavior in both LTR and RTL languages.

6. **Create responsive and theme-aware styling**
   - Use a two-column tracker on desktop, a stacked layout on tablet, and Live Signal above a horizontally scrollable ribbon on mobile.
   - Keep stage colors controlled across all four dark and four light palettes.
   - Prevent document-level horizontal overflow and maintain clear typography at small widths.

7. **Verify behavior and presentation**
   - Run lint and production build.
   - Test delivery and non-delivery stage counts, active/completed/future states, receipt regression, missing-order state, normal/reduced motion, and mobile auto-focus.
   - Visually inspect German and Persian layouts on desktop and mobile in dark and light themes.

8. **Publish**
   - Commit implementation changes on the feature branch.
   - Push to GitHub, open a draft pull request, verify deployment checks, mark ready, merge into `main`, and synchronize the local branch.

## Expected Files

- `src/pages/LiveOrderPage.jsx`
- `src/data/platformData.js`
- `src/index.css`
- Browser-test artifacts kept outside version control

## Acceptance Criteria

- The live tracker accurately reflects the shared order state without a parallel simulation.
- The active stage is immediately visible on mobile and smoothly follows status changes without recurring forced scrolling.
- RTL, reduced motion, four languages, eight themes, delivery/pickup differences, and existing receipt behavior remain correct.
- Lint, production build, and targeted browser tests pass before merge.
