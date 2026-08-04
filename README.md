# Arshida Restaurant Experience

A polished multilingual restaurant website built with React and Vite.

## Experience

- Two switchable layouts: Cinematic Experience and Brand Journal
- Eight accessible colour themes: four dark and four light
- German default language with English, Persian, and Arabic
- Complete LTR and RTL presentation
- Digital menu with search, filters, dish details, and ordering
- Cart, promotion code, reservation wizard, table map, and 360° table preview
- Guest profile, loyalty status, booking history, events, and newsletter
- Separate restaurant-management surface for CRM, campaigns, and branding
- Supabase email/password authentication with confirmation, recovery, and optional Magic Link
- Multi-branch, multi-role restaurant access protected by PostgreSQL RLS
- Secure staff invitations, role administration, audit history, Realtime access invalidation, and Web Push foundation
- Responsive and keyboard-accessible interactions with reduced-motion support

## Development

```bash
npm install
npm run dev
```

Configure browser-safe Supabase values using `.env.example`. Full local and deployment instructions are in [`docs/setup/supabase.md`](docs/setup/supabase.md).

## Validation

```bash
npm run build
npm run lint
npm run test
```

The public menu/order demo data remains local while the production operations platform is delivered in secure vertical slices. Phase 1 provides real Supabase identity and access foundations. Payments, server-authoritative ordering, KDS, waiter, cashier, delivery, inventory, and reporting workflows follow the approved implementation roadmap.
