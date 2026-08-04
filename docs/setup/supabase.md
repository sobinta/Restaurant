# Supabase setup for Arshida

## Prerequisites

- Node.js and npm
- Docker Desktop for local Supabase validation
- Supabase CLI through `npx supabase`
- A Supabase project operator account for linking/deployment

The browser uses only `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. Never expose `SUPABASE_SERVICE_ROLE_KEY` through a `VITE_` variable.

## Local environment

Copy `.env.example` to `.env.local` and provide browser-safe project values. Real environment files are ignored by Git.

```powershell
npm install
npx supabase start
npx supabase db reset
npx supabase test db
npm run test
npm run lint
npm run build
```

Browser-flow verification uses Python Playwright:

```powershell
python -m pip install playwright
python -m playwright install chromium
python C:\path\to\webapp-testing\scripts\with_server.py --server "npm run dev -- --host 127.0.0.1 --port 43128" --port 43128 -- python tests\e2e\auth_gateway.py
```

If Docker Desktop is stopped, SQL/RLS tests cannot run. Do not apply unvalidated migrations directly to the production project.

## Supabase Auth configuration

In Authentication → URL Configuration:

- Set the production Site URL.
- Add the deployed application callback URLs.
- Add local callback URLs for development.
- Do not use broad production wildcards when exact callback URLs are available.

Required application callbacks:

```text
/auth/callback
/auth/reset-password
/staff/invitations/accept
```

Enable email/password signup and email confirmation. Configure a production SMTP provider before inviting real staff. Magic Link is optional in the UI but uses the same approved redirect allow-list.

## Edge Function secrets

Configure these through Supabase secrets or the deployment platform, never in Git:

```text
PUBLIC_APP_URL
ALLOWED_ORIGINS
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_ANON_KEY or SUPABASE_PUBLISHABLE_KEY
```

`ALLOWED_ORIGINS` is a comma-separated exact allow-list. Localhost is accepted only by the development CORS helper.

Deploy after database migrations:

```powershell
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push --dry-run
npx supabase db push
npx supabase functions deploy invite-staff-member
npx supabase functions deploy accept-staff-invitation
npx supabase functions deploy update-member-roles
npx supabase functions deploy suspend-branch-member
npx supabase functions deploy register-push-subscription
```

## Initial superadmin

The first public signup never becomes an administrator. Provision the initial administrator only from a trusted operator shell after migrations are deployed:

```powershell
$env:SUPABASE_URL='https://YOUR_PROJECT_REF.supabase.co'
$env:SUPABASE_SERVICE_ROLE_KEY='set-locally-never-in-chat'
$env:INITIAL_ADMIN_EMAIL='owner@example.com'
$env:CONFIRM_PROJECT_REF='YOUR_PROJECT_REF'
$env:PUBLIC_APP_URL='https://restaurant.example.com'
npm run admin:bootstrap
```

The command requires an exact project-ref confirmation, invites the user if necessary, assigns `superadmin` server-side, and writes an audit record.

## Web Push

Generate VAPID keys in a trusted server environment. Put only the public key in `VITE_VAPID_PUBLIC_KEY`; keep the private key in the server secret store. Push subscription registration is implemented in Phase 1. Operational notification delivery is introduced with the kitchen/waiter slices.

## Required smoke identities

Validate with separate accounts:

- customer
- waiter
- kitchen
- cashier
- delivery
- manager
- superadmin

Test branch isolation, multi-role membership, suspended access, expired invitations, and a manager attempting to modify another manager. All must be rejected or allowed according to the design specification.

## Dependency advisory

At implementation time, npm reports `GHSA-qwww-vcr4-c8h2` against current React Router releases and proposes a downgrade that reintroduces a larger set of redirect/XSS advisories. Arshida is a `BrowserRouter` SPA and does not use React Server Components or Server Actions, the affected execution mode. Keep the current release, do not use `npm audit fix --force`, and upgrade as soon as an upstream patched release is available.
