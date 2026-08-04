# Supabase Authentication and Multi-Branch RBAC Design

**Date:** 2026-08-04  
**Status:** Approved in conversation; awaiting written-spec approval  
**Scope:** Phase 1 of the Arshida restaurant operations platform

## 1. Outcome

Replace the current local/demo identity state with production-oriented Supabase authentication and authorization. Public users receive only the `customer` role. Restaurant staff access is invitation-based, scoped to one or more branches, and supports multiple simultaneous roles per user. The initial `superadmin` is provisioned securely and is never inferred from public registration order.

This phase also replaces the mobile Appearance navigation action with an Account action, adds dedicated authentication/account/workspace routes, and establishes protected dashboard shells for later operational phases.

## 2. Delivery strategy

The operations platform will be built as tested vertical slices:

1. Authentication, profiles, branches, multi-role RBAC, invitations, protected routes, and audit logging.
2. Menu customization schema, owner editor, and customer item customizer.
3. Server-authoritative order creation, pricing, discounts, coupons, and payment boundaries.
4. Kitchen Display System with stations, expediter flow, item stages, and Realtime.
5. Waiter/front-of-house tools, floor plan, guest CRM context, and ready notifications.
6. Cashier, payment, invoicing, and order closing.
7. Delivery assignment and fulfilment-specific tracking.
8. Owner/manager reporting, inventory, shifts, branch settings, observability, and hardening.

Phase 1 must not simulate later operational features as if they were live. It provides polished protected workspace shells and clearly identifies unavailable modules.

## 3. Roles and scope

| Role | Scope | Phase 1 destination |
| --- | --- | --- |
| `customer` | User account | Profile, orders, reservations, addresses, preferences |
| `waiter` | Branch | Front-of-house workspace shell |
| `kitchen` | Branch | Kitchen workspace shell and station selection shell |
| `cashier` | Branch | Cashier workspace shell |
| `delivery` | Branch | Delivery workspace shell |
| `manager` | Branch | Branch management workspace |
| `superadmin` | Global | All branches, managers, and system settings |

A user may hold multiple roles in the same branch and different roles across branches. `superadmin` is global and cannot be granted by a branch manager.

## 4. Authentication

Supported methods:

- Email and password registration and sign-in.
- Mandatory email confirmation, controlled by the Supabase project configuration.
- Password recovery and reset.
- Optional Magic Link sign-in.
- Secure auth callback handling with validated redirects.

Public signup always creates a customer profile. Staff roles are acquired only through a valid invitation or a privileged server-side administrative operation.

The initial superadmin is created by an explicit bootstrap/seed workflow using a secure environment value such as `INITIAL_ADMIN_EMAIL`. Administrative credentials and the Supabase service-role key are never exposed to the browser, committed to Git, or requested through chat.

## 5. Data model

### `profiles`

One row per Supabase Auth user. Contains non-authoritative personal information, locale, onboarding state, and account status. Authorization is not derived from user-editable profile fields.

### `branches`

Restaurant branches with identity, locale, timezone, contact details, operational status, and configuration metadata.

### `roles`

Canonical roles listed in section 3. System roles are seeded and are not user-created.

### `permissions`

Fine-grained permission keys for future operational modules, such as `staff.invite`, `menu.write`, or `orders.kitchen.update`.

### `role_permissions`

Maps canonical roles to permissions. Changes are restricted to privileged server-side administration.

### `branch_memberships`

Associates a user with a branch and membership lifecycle state. A membership can be invited, active, suspended, or revoked.

### `branch_membership_roles`

Associates one or more roles with a branch membership. This normalized join prevents a client-editable role array from becoming an authorization source.

### `staff_invitations`

Stores hashed invitation tokens, target email, branch, proposed roles, inviter, expiry, consumption, revocation, and timestamps. Raw invitation tokens are never stored.

### `customer_preferences`

Stores customer-facing preferences that are safe for the account owner to edit. It is not used for authorization.

### `push_subscriptions`

Stores per-device Web Push subscriptions, linked to the authenticated user and optionally to a current branch/workspace context.

### `audit_logs`

Append-only security and administration events containing actor, action, target, branch, safe structured context, request correlation data, and timestamp. Secrets and raw credentials are excluded.

## 6. Authorization and RLS

- RLS is enabled on every application table.
- Public users cannot assign roles or branch memberships.
- Customers can read/update only their permitted profile and preference fields.
- Users can read only their own memberships and authorized branch information.
- Managers can manage eligible memberships only in branches they manage.
- Managers cannot grant, revoke, or modify `superadmin`.
- Privileged mutations use server-side functions and re-check authorization inside the transaction.
- UI permission gates improve usability but never replace database authorization.
- Private Realtime topics are scoped by user, branch, workspace, and event type.
- Revoked or suspended membership is rejected by RLS even if the client still has stale UI state.

Custom claims may be used as a performance aid, but database membership is authoritative for mutable branch access. Claim refresh and token staleness must not create an authorization window.

## 7. Server-side functions

Phase 1 functions:

- `bootstrap-profile`: idempotently completes a safe customer profile after confirmed authentication.
- `invite-staff-member`: validates inviter permissions and creates a single-use invitation.
- `accept-staff-invitation`: validates token hash, email, expiry, revocation, and consumption before creating membership roles transactionally.
- `update-member-roles`: validates actor scope and prevents superadmin escalation.
- `suspend-branch-member`: suspends branch access and records the action.
- `register-push-subscription`: validates and stores an authenticated device subscription.
- Initial-admin bootstrap: a deployment/seed command or restricted server function, not a public endpoint.

The `switch-active-workspace` interaction primarily validates a selected membership against server data; storing a UI preference does not grant access.

## 8. Frontend routes

```text
/auth/login
/auth/register
/auth/forgot-password
/auth/reset-password
/auth/callback
/account
/account/profile
/workspaces
/workspace/:branchId
/workspace/:branchId/owner
/workspace/:branchId/waiter
/workspace/:branchId/kitchen
/workspace/:branchId/cashier
/workspace/:branchId/delivery
/forbidden
```

Routing rules:

- Signed-out Account navigation opens the dedicated login page.
- A customer with no staff memberships enters `/account`.
- A user with one staff workspace may continue to the last valid workspace.
- A user with multiple roles or branches sees the workspace selector.
- Protected routes display a neutral session-loading state until authorization is resolved, preventing content flash.
- Unauthorized routes resolve to a localized `403` experience.

## 9. Mobile and desktop experience

- Replace the fifth mobile bottom-navigation Appearance action with Account/User.
- Preserve theme and language controls in the mobile menu/sheet.
- Connect the existing desktop profile icon to the new account gateway.
- Authentication and workspace screens are dedicated pages on mobile, not constrained modals.
- The workspace switcher displays branch and role explicitly.
- The last valid workspace may be remembered as a convenience, but is revalidated on each use.

The approved visual direction continues the existing premium cinematic identity. All eight themes remain supported.

## 10. Localization and accessibility

- German remains the default language; English, Persian, and Arabic are supported.
- Persian body text uses Vazirmatn and Persian headings use Lalezar.
- Persian and Arabic layouts are RTL; German and English are LTR.
- Form fields use persistent labels, associated error text, and an optional form-level error summary.
- Loading, success, invalid link, expired link, unconfirmed account, suspended account, and network failure each have distinct states.
- Keyboard navigation, visible focus, modal focus management where applicable, semantic landmarks, live status announcements, and mobile touch target sizing are required.

## 11. Realtime and Web Push foundation

- Auth and membership changes invalidate cached workspace access.
- In-app notifications use private Realtime channels.
- Web Push subscriptions are opt-in, per device, and revocable.
- Operational alerts are implemented in later phases, but Phase 1 supplies the secure subscription and preference foundation.
- Sensitive payload details are not placed in push notification bodies when the device is locked.

## 12. Environment and repository layout

Browser-safe environment variables:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

Server-only secrets, including `INITIAL_ADMIN_EMAIL` and service credentials, are configured through the deployment/Supabase secret store and never use a `VITE_` prefix.

The repository will version:

- `supabase/config.toml`
- ordered SQL migrations
- deterministic non-secret seed data
- Edge Functions and shared authorization helpers
- `.env.example` containing placeholders only
- frontend Supabase client/session providers
- automated authorization and browser tests

Real `.env` files remain ignored.

## 13. Failure behavior

- Valid cached sessions may render non-sensitive account framing during temporary network loss.
- Sensitive administrative mutations are not queued offline.
- Retryable failures provide an explicit retry action.
- Expired sessions redirect through sign-in while preserving a validated internal return path.
- Invalid, expired, revoked, or consumed invitation links have distinct localized outcomes.
- A server-detected permission change immediately removes access and returns the user to the workspace selector or account area.
- Database and function errors are logged with correlation identifiers; raw internal errors are not shown to users.

## 14. Verification and acceptance

Phase 1 is accepted only when:

- Public registration cannot create any role other than customer.
- Email confirmation, password reset, and optional Magic Link flows return to approved application routes.
- A browser client cannot mutate its own role, membership, or permission.
- RLS rejects direct unauthorized reads and writes.
- Managers are confined to authorized branches and cannot manage superadmins.
- Invitations are expiring, revocable, single-use, and email-bound.
- Suspended/revoked staff lose operational access.
- Active sessions respond safely to membership changes.
- Protected pages do not flash unauthorized content.
- Authentication and workspace flows work in all four languages and both text directions.
- The mobile Account action works at narrow viewport widths without overlap.
- No administrative secret is present in the production bundle.
- Administrative mutations produce complete audit records.
- Lint and production build pass.
- Unit, RLS integration, Edge Function integration, and browser authentication tests pass against the designated test environment.

## 15. Explicit non-goals for Phase 1

- Real payment capture.
- Final server-authoritative order creation and pricing.
- Complete menu customization UI.
- Production KDS, waiter, cashier, delivery, inventory, reporting, or shift workflows.
- Pretending placeholder dashboard data is live operational data.

These are committed roadmap slices and will build on the Phase 1 security model.

## 16. Rollout safeguards

- Apply migrations to local/test Supabase before the primary project.
- Back up schema/data before production-affecting migrations.
- Verify RLS using separate customer, staff, manager, and superadmin test identities.
- Provision the initial superadmin through a controlled operator command and verify the exact target email before execution.
- Roll out frontend route changes only after required database objects and functions are available.

