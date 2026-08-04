# Supabase Authentication and Multi-Branch RBAC Implementation Plan

**Design:** `docs/superpowers/specs/2026-08-04-supabase-auth-rbac-design.md`  
**Branch:** `feat/supabase-auth-rbac`  
**Goal:** Deliver Phase 1 authentication, account, branch membership, multi-role authorization, invitation, audit, and protected workspace foundations without weakening the existing restaurant experience.

## Working rules

- Keep public website functionality and all eight themes operational.
- Public registration can produce only a customer account.
- Treat Postgres/RLS as the authorization boundary; frontend gates are presentation only.
- Never include service-role credentials or server secrets in browser code.
- Make migrations additive and deterministic.
- Use the real Supabase project only after local/test validation and an explicit migration dry run.
- Commit by coherent slice so changes remain reviewable.

## Task 1 — Supabase project foundation

**Files**

- Modify: `package.json`
- Modify: `.gitignore`
- Create: `.env.example`
- Create: `src/lib/env.js`
- Create: `src/lib/supabase.js`
- Create: `supabase/config.toml`
- Create: `supabase/seed.sql`

**Steps**

1. Add `@supabase/supabase-js` and test/runtime tooling required by later tasks.
2. Define a fail-safe environment parser for `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.
3. Create one browser Supabase client with appropriate session persistence and PKCE settings.
4. Add a safe development-unconfigured state instead of crashing the marketing site.
5. Add placeholder-only environment documentation and ensure local secrets are ignored.
6. Initialize the versioned Supabase directory and deterministic system-role seed.
7. Run lint/build.

**Commit:** `build: add Supabase project foundation`

## Task 2 — Core identity and RBAC schema

**Files**

- Create: `supabase/migrations/202608040001_identity_rbac.sql`
- Create: `supabase/migrations/202608040002_identity_helpers.sql`
- Create: `supabase/migrations/202608040003_identity_rls.sql`
- Create: `supabase/tests/identity_rbac.sql`

**Steps**

1. Add enums/types for membership and account lifecycle states.
2. Add `profiles`, `branches`, `roles`, `permissions`, `role_permissions`, `branch_memberships`, `branch_membership_roles`, `staff_invitations`, `customer_preferences`, `push_subscriptions`, and `audit_logs`.
3. Add foreign keys, uniqueness constraints, timestamps, indexes, and immutable identifiers.
4. Add safe auth-user profile bootstrap trigger that creates only customer profile state and no privileged membership.
5. Add authorization helper functions using explicit `search_path`, stable semantics, and caller-safe return types.
6. Enable RLS and add least-privilege policies for customer self-service, membership discovery, branch discovery, preferences, subscriptions, and privileged reads.
7. Prevent client-side writes to role/permission/audit tables.
8. Add SQL tests for customer isolation, branch isolation, manager scope, multi-role membership, and superadmin boundaries.
9. Reset and test locally using `npx supabase` if Docker is available; otherwise run static SQL validation and record the external validation requirement.

**Commit:** `feat: add multi-branch RBAC schema and RLS`

## Task 3 — Authentication state and callbacks

**Files**

- Create: `src/auth/AuthProvider.jsx`
- Create: `src/auth/useAuth.js`
- Create: `src/auth/authRoutes.js`
- Create: `src/auth/ProtectedRoute.jsx`
- Create: `src/auth/PermissionGate.jsx`
- Create: `src/pages/auth/AuthShell.jsx`
- Create: `src/pages/auth/LoginPage.jsx`
- Create: `src/pages/auth/RegisterPage.jsx`
- Create: `src/pages/auth/ForgotPasswordPage.jsx`
- Create: `src/pages/auth/ResetPasswordPage.jsx`
- Create: `src/pages/auth/AuthCallbackPage.jsx`
- Create: `src/pages/auth/AuthStatusPage.jsx`
- Modify: `src/main.jsx`
- Modify: `src/App.jsx`

**Steps**

1. Implement one session source of truth using `onAuthStateChange` without unsafe async callback deadlocks.
2. Load profile and authorized memberships only after session resolution.
3. Represent states explicitly: configuring, loading, signed-out, signed-in, unconfirmed, suspended, and error.
4. Build email/password login and registration.
5. Add resend-confirmation, password recovery/reset, and optional Magic Link flows.
6. Validate callback and return paths as internal application paths.
7. Add protected-route and permission-gate components that never render unauthorized content while loading.
8. Preserve marketing-site availability when Supabase environment values are absent, while disabling real account actions with a clear development message.

**Commit:** `feat: add secure Supabase authentication flows`

## Task 4 — Account and workspace experience

**Files**

- Create: `src/pages/account/AccountPage.jsx`
- Create: `src/pages/account/ProfilePage.jsx`
- Create: `src/pages/workspace/WorkspaceSelectorPage.jsx`
- Create: `src/pages/workspace/WorkspaceShell.jsx`
- Create: `src/pages/workspace/ForbiddenPage.jsx`
- Create: `src/components/account/AccountMenu.jsx`
- Create: `src/components/workspace/WorkspaceSwitcher.jsx`
- Create: `src/components/workspace/RoleBadge.jsx`
- Create: `src/components/states/AsyncState.jsx`
- Modify: `src/App.jsx`
- Modify: `src/index.css`
- Modify: `src/data/translations.js`

**Steps**

1. Replace the mobile bottom-nav Appearance action with Account/User.
2. Preserve appearance and language controls inside the mobile menu/sheet.
3. Route the desktop profile action through the same account gateway.
4. Build the approved premium mobile-first auth and workspace UI across all eight themes.
5. Add account/profile, workspace selector, and protected role-specific workspace shells.
6. Persist only the last selected workspace identifier; revalidate it against current membership before navigation.
7. Add localized 403, unavailable-backend, empty, error, and loading states.
8. Verify German default, English, Persian, and Arabic with LTR/RTL layout and required fonts.

**Commit:** `feat: add account and role workspace experience`

## Task 5 — Staff invitation and role administration functions

**Files**

- Create: `supabase/functions/_shared/auth.ts`
- Create: `supabase/functions/_shared/cors.ts`
- Create: `supabase/functions/_shared/errors.ts`
- Create: `supabase/functions/_shared/audit.ts`
- Create: `supabase/functions/invite-staff-member/index.ts`
- Create: `supabase/functions/accept-staff-invitation/index.ts`
- Create: `supabase/functions/update-member-roles/index.ts`
- Create: `supabase/functions/suspend-branch-member/index.ts`
- Create: `supabase/functions/register-push-subscription/index.ts`
- Create: `scripts/bootstrap-initial-admin.mjs`
- Modify: `package.json`

**Steps**

1. Add shared JWT verification and authorization helpers.
2. Require authenticated callers and re-check branch/role permissions in the database.
3. Generate cryptographically strong invitation tokens and store only their hashes.
4. Accept invitations transactionally with email, expiry, revocation, and single-use checks.
5. Prevent every path to client-driven superadmin escalation.
6. Add membership suspension and role replacement with complete audit events.
7. Add validated Web Push subscription registration without sending notifications yet.
8. Add an explicit operator-only initial-admin bootstrap command that confirms the target project/email and uses server-only environment values.
9. Add function tests for authorization failures and successful scoped operations.

**Commit:** `feat: add secure staff access administration`

## Task 6 — Manager-facing staff access UI

**Files**

- Create: `src/pages/workspace/StaffAccessPage.jsx`
- Create: `src/components/staff/StaffInvitationForm.jsx`
- Create: `src/components/staff/MemberRoleEditor.jsx`
- Create: `src/components/staff/AuditTimeline.jsx`
- Modify: `src/App.jsx`
- Modify: `src/index.css`
- Modify: `src/data/translations.js`

**Steps**

1. Build branch-scoped team list and invitation form.
2. Allow eligible managers to assign multiple non-superadmin roles.
3. Add suspension/reactivation controls with confirmation and server feedback.
4. Add accessible pending, consumed, expired, and revoked invitation states.
5. Add a safe audit timeline without exposing secrets or internal error payloads.
6. Hide actions without permission while keeping server rejection authoritative.

**Commit:** `feat: add staff access management UI`

## Task 7 — Realtime membership invalidation and notification foundation

**Files**

- Create: `src/realtime/useMembershipRealtime.js`
- Create: `src/notifications/push.js`
- Create: `public/service-worker.js`
- Modify: `src/auth/AuthProvider.jsx`
- Modify: `src/pages/account/AccountPage.jsx`

**Steps**

1. Subscribe to private user membership-change events.
2. Refresh authorization state and evict an invalid active workspace immediately.
3. Add explicit opt-in UI for browser notifications.
4. Register/update/revoke per-device push subscriptions.
5. Ensure notification previews contain no sensitive operational data.
6. Confirm the service worker does not interfere with Vite assets or existing navigation.

**Commit:** `feat: add realtime access and push foundation`

## Task 8 — Automated verification and production readiness

**Files**

- Create/modify tests under `src/**/*.test.*`, `tests/e2e/**`, and `supabase/tests/**`
- Modify: `package.json`
- Modify: `README.md`
- Create: `docs/setup/supabase.md`

**Steps**

1. Add unit tests for route validation, permission mapping, and workspace resolution.
2. Add browser tests for login, registration, unconfirmed email, reset, Magic Link UI, logout, mobile Account navigation, role switching, and forbidden routes.
3. Test four languages, RTL/LTR, keyboard navigation, and narrow mobile layouts.
4. Run SQL/RLS and Edge Function integration tests against local/test Supabase.
5. Scan the production bundle and repository for server secrets.
6. Run lint and production build.
7. Document Supabase Auth URL configuration, SMTP dependency, local CLI workflow, secrets, migration order, and initial-admin bootstrap.
8. Apply migrations/functions to the designated Supabase project only after validation.
9. Perform a real-project smoke test with separate customer, staff, manager, and superadmin accounts.

**Commit:** `test: verify Supabase auth and authorization flows`

## Task 9 — Publish and merge

1. Review the complete diff and ensure unrelated user changes are untouched.
2. Push `feat/supabase-auth-rbac`.
3. Open a draft pull request with architecture, setup, test evidence, and remaining operational phases.
4. Verify repository checks and deployment preview.
5. Mark ready and merge only after all required checks pass.
6. Synchronize local `main` with `origin/main` and verify the local server.

## Required external configuration

Implementation can be committed without exposing secrets, but complete real-environment validation requires the project owner to configure:

- Approved Site URL and Redirect URLs in Supabase Auth.
- Email confirmation and SMTP/provider settings.
- Server-only deployment secrets for administrative functions.
- A verified initial-admin email supplied through the secure operator environment.
- Web Push VAPID keys when push delivery is enabled.

The provided project URL and publishable key are sufficient for browser client configuration, but not for privileged deployment or initial-admin provisioning.

