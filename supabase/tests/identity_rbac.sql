begin;
create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions, pgtap;

select extensions.plan(16);

select extensions.has_table('public', 'profiles', 'profiles table exists');
select extensions.has_table('public', 'branches', 'branches table exists');
select extensions.has_table('public', 'branch_memberships', 'branch memberships table exists');
select extensions.has_table('public', 'branch_membership_roles', 'multi-role join table exists');
select extensions.has_table('public', 'user_global_roles', 'global roles are modeled separately');
select extensions.has_table('public', 'staff_invitations', 'staff invitations table exists');
select extensions.has_table('public', 'audit_logs', 'audit log table exists');

select extensions.ok(row_security_active('public.profiles'::regclass), 'profiles RLS is active');
select extensions.ok(row_security_active('public.branch_memberships'::regclass), 'membership RLS is active');
select extensions.ok(row_security_active('public.staff_invitations'::regclass), 'invitation RLS is active');
select extensions.ok(row_security_active('public.audit_logs'::regclass), 'audit RLS is active');

select extensions.ok(
  exists (
    select 1
    from pg_constraint
    where conrelid = 'public.roles'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) like '%key ~%'
  ),
  'role keys are constrained'
);

select extensions.ok(
  exists (
    select 1
    from pg_constraint constraint_record
    join pg_class referenced_table on referenced_table.oid = constraint_record.confrelid
    join pg_namespace referenced_schema on referenced_schema.oid = referenced_table.relnamespace
    where constraint_record.conrelid = 'public.user_global_roles'::regclass
      and constraint_record.contype = 'f'
      and referenced_schema.nspname = 'auth'
      and referenced_table.relname = 'users'
  ),
  'global roles require a real auth user'
);

select extensions.ok(
  exists (
    select 1
    from pg_constraint
    where conrelid = 'public.user_global_roles'::regclass
      and contype = 'f'
      and confrelid = 'public.roles'::regclass
  ),
  'global assignments reference canonical roles'
);

select extensions.ok(
  exists (
    select 1
    from pg_constraint
    where conrelid = 'public.branch_membership_roles'::regclass
      and contype = 'f'
      and confrelid = 'public.branch_memberships'::regclass
  ),
  'branch role assignments require a membership'
);

select extensions.ok(
  exists (
    select 1
    from pg_constraint
    where conrelid = 'public.branch_membership_roles'::regclass
      and contype = 'f'
      and confrelid = 'public.roles'::regclass
  ),
  'branch assignments reference canonical roles'
);

select * from extensions.finish();
rollback;
