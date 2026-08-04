-- Deterministic, non-secret system data only. The initial superadmin is provisioned
-- separately by the operator bootstrap command and is never inferred from signup order.

insert into public.roles (key, name, scope, is_system)
values
  ('customer', 'Customer', 'account', true),
  ('waiter', 'Waiter', 'branch', true),
  ('kitchen', 'Kitchen', 'branch', true),
  ('cashier', 'Cashier', 'branch', true),
  ('delivery', 'Delivery', 'branch', true),
  ('manager', 'Manager', 'branch', true),
  ('superadmin', 'Superadmin', 'global', true)
on conflict (key) do update
set name = excluded.name,
    scope = excluded.scope,
    is_system = excluded.is_system;
