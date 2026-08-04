begin;

select plan(16);

select has_table('public', 'profiles', 'profiles table exists');
select has_table('public', 'branches', 'branches table exists');
select has_table('public', 'branch_memberships', 'branch memberships table exists');
select has_table('public', 'branch_membership_roles', 'multi-role join table exists');
select has_table('public', 'user_global_roles', 'global roles are modeled separately');
select has_table('public', 'staff_invitations', 'staff invitations table exists');
select has_table('public', 'audit_logs', 'audit log table exists');

select row_security_active('public.profiles'::regclass), 'profiles RLS is active';
select row_security_active('public.branch_memberships'::regclass), 'membership RLS is active';
select row_security_active('public.staff_invitations'::regclass), 'invitation RLS is active';
select row_security_active('public.audit_logs'::regclass), 'audit RLS is active';

select results_eq(
  $$ select key from public.roles order by key $$,
  $$ values ('cashier'::text), ('customer'), ('delivery'), ('kitchen'), ('manager'), ('superadmin'), ('waiter') $$,
  'canonical roles are seeded'
);

select is((select scope::text from public.roles where key = 'superadmin'), 'global', 'superadmin is global');
select is((select scope::text from public.roles where key = 'manager'), 'branch', 'manager is branch-scoped');

select throws_ok(
  $$ insert into public.user_global_roles (user_id, role_key) values (gen_random_uuid(), 'waiter') $$,
  '23503',
  null,
  'global role assignment requires a real auth user'
);

select throws_ok(
  $$ insert into public.roles (key, name, scope) values ('Bad Role', 'Bad Role', 'branch') $$,
  '23514',
  null,
  'role keys are constrained'
);

select * from finish();
rollback;
