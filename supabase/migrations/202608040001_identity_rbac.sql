create extension if not exists pgcrypto with schema extensions;

create type public.role_scope as enum ('account', 'branch', 'global');
create type public.account_status as enum ('active', 'suspended', 'deleted');
create type public.membership_status as enum ('invited', 'active', 'suspended', 'revoked');
create type public.invitation_status as enum ('pending', 'accepted', 'revoked', 'expired');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  phone text,
  avatar_path text,
  locale text not null default 'de' check (locale in ('de', 'en', 'fa', 'ar')),
  status public.account_status not null default 'active',
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.branches (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null check (char_length(name) between 1 and 120),
  legal_name text,
  timezone text not null default 'Europe/Berlin',
  locale text not null default 'de' check (locale in ('de', 'en', 'fa', 'ar')),
  currency text not null default 'EUR' check (currency ~ '^[A-Z]{3}$'),
  email text,
  phone text,
  address jsonb not null default '{}'::jsonb,
  settings jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.roles (
  key text primary key check (key ~ '^[a-z][a-z0-9_]*$'),
  name text not null,
  scope public.role_scope not null,
  is_system boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.permissions (
  key text primary key check (key ~ '^[a-z][a-z0-9_.]*$'),
  description text not null,
  created_at timestamptz not null default now()
);

create table public.role_permissions (
  role_key text not null references public.roles(key) on delete cascade,
  permission_key text not null references public.permissions(key) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (role_key, permission_key)
);

create table public.user_global_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role_key text not null references public.roles(key) on delete restrict,
  assigned_by uuid references auth.users(id) on delete set null,
  assigned_at timestamptz not null default now(),
  primary key (user_id, role_key)
);

create table public.branch_memberships (
  id uuid primary key default gen_random_uuid(),
  branch_id uuid not null references public.branches(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status public.membership_status not null default 'invited',
  invited_by uuid references auth.users(id) on delete set null,
  joined_at timestamptz,
  suspended_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (branch_id, user_id)
);

create table public.branch_membership_roles (
  membership_id uuid not null references public.branch_memberships(id) on delete cascade,
  role_key text not null references public.roles(key) on delete restrict,
  assigned_by uuid references auth.users(id) on delete set null,
  assigned_at timestamptz not null default now(),
  primary key (membership_id, role_key)
);

create table public.staff_invitations (
  id uuid primary key default gen_random_uuid(),
  branch_id uuid not null references public.branches(id) on delete cascade,
  email text not null check (email = lower(email)),
  token_hash bytea not null unique,
  status public.invitation_status not null default 'pending',
  invited_by uuid not null references auth.users(id) on delete restrict,
  expires_at timestamptz not null,
  accepted_by uuid references auth.users(id) on delete set null,
  accepted_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (expires_at > created_at)
);

create table public.staff_invitation_roles (
  invitation_id uuid not null references public.staff_invitations(id) on delete cascade,
  role_key text not null references public.roles(key) on delete restrict,
  primary key (invitation_id, role_key)
);

create table public.customer_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  dietary_preferences text[] not null default '{}',
  allergen_notes text,
  marketing_email boolean not null default false,
  push_enabled boolean not null default false,
  preferred_branch_id uuid references public.branches(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint_hash bytea not null,
  endpoint text not null,
  p256dh text not null,
  auth_secret text not null,
  user_agent text,
  branch_id uuid references public.branches(id) on delete cascade,
  revoked_at timestamptz,
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, endpoint_hash)
);

create table public.audit_logs (
  id bigint generated always as identity primary key,
  actor_user_id uuid references auth.users(id) on delete set null,
  branch_id uuid references public.branches(id) on delete set null,
  action text not null check (char_length(action) between 3 and 120),
  target_type text,
  target_id text,
  context jsonb not null default '{}'::jsonb,
  correlation_id uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now()
);

create index branch_memberships_user_idx on public.branch_memberships (user_id, status);
create index branch_memberships_branch_idx on public.branch_memberships (branch_id, status);
create index staff_invitations_email_idx on public.staff_invitations (email, status, expires_at desc);
create index audit_logs_branch_created_idx on public.audit_logs (branch_id, created_at desc);
create index audit_logs_actor_created_idx on public.audit_logs (actor_user_id, created_at desc);
create index push_subscriptions_user_active_idx on public.push_subscriptions (user_id) where revoked_at is null;

insert into public.roles (key, name, scope, is_system)
values
  ('customer', 'Customer', 'account', true),
  ('waiter', 'Waiter', 'branch', true),
  ('kitchen', 'Kitchen', 'branch', true),
  ('cashier', 'Cashier', 'branch', true),
  ('delivery', 'Delivery', 'branch', true),
  ('manager', 'Manager', 'branch', true),
  ('superadmin', 'Superadmin', 'global', true)
on conflict (key) do nothing;

insert into public.permissions (key, description)
values
  ('account.read_self', 'Read own customer account'),
  ('account.update_self', 'Update own safe profile fields'),
  ('branch.read', 'Read assigned branch'),
  ('staff.read', 'Read staff membership in an assigned branch'),
  ('staff.invite', 'Invite eligible staff to an assigned branch'),
  ('staff.roles.write', 'Manage eligible staff roles in an assigned branch'),
  ('staff.suspend', 'Suspend or reactivate eligible branch staff'),
  ('audit.read', 'Read branch audit events'),
  ('orders.waiter.read', 'Read front-of-house orders'),
  ('orders.kitchen.read', 'Read kitchen orders'),
  ('orders.kitchen.update', 'Update kitchen preparation state'),
  ('payments.manage', 'Manage branch payments and invoices'),
  ('delivery.read_assigned', 'Read orders assigned for delivery'),
  ('system.manage', 'Manage global system configuration')
on conflict (key) do nothing;

insert into public.role_permissions (role_key, permission_key)
values
  ('customer', 'account.read_self'),
  ('customer', 'account.update_self'),
  ('waiter', 'branch.read'),
  ('waiter', 'orders.waiter.read'),
  ('kitchen', 'branch.read'),
  ('kitchen', 'orders.kitchen.read'),
  ('kitchen', 'orders.kitchen.update'),
  ('cashier', 'branch.read'),
  ('cashier', 'payments.manage'),
  ('delivery', 'branch.read'),
  ('delivery', 'delivery.read_assigned'),
  ('manager', 'branch.read'),
  ('manager', 'staff.read'),
  ('manager', 'staff.invite'),
  ('manager', 'staff.roles.write'),
  ('manager', 'staff.suspend'),
  ('manager', 'audit.read'),
  ('superadmin', 'system.manage')
on conflict do nothing;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger branches_set_updated_at before update on public.branches
for each row execute function public.set_updated_at();
create trigger memberships_set_updated_at before update on public.branch_memberships
for each row execute function public.set_updated_at();
create trigger invitations_set_updated_at before update on public.staff_invitations
for each row execute function public.set_updated_at();
create trigger preferences_set_updated_at before update on public.customer_preferences
for each row execute function public.set_updated_at();
create trigger push_subscriptions_set_updated_at before update on public.push_subscriptions
for each row execute function public.set_updated_at();

create or replace function public.validate_scoped_role()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  expected_scope public.role_scope;
begin
  select scope into expected_scope from public.roles where key = new.role_key;

  if tg_table_name in ('branch_membership_roles', 'staff_invitation_roles') and expected_scope <> 'branch' then
    raise exception 'Role % is not branch-scoped', new.role_key using errcode = '23514';
  end if;

  if tg_table_name = 'user_global_roles' and expected_scope = 'branch' then
    raise exception 'Role % requires a branch membership', new.role_key using errcode = '23514';
  end if;

  return new;
end;
$$;

create trigger branch_role_scope before insert or update on public.branch_membership_roles
for each row execute function public.validate_scoped_role();
create trigger invitation_role_scope before insert or update on public.staff_invitation_roles
for each row execute function public.validate_scoped_role();
create trigger global_role_scope before insert or update on public.user_global_roles
for each row execute function public.validate_scoped_role();

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, locale)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''), split_part(coalesce(new.email, ''), '@', 1)),
    case when new.raw_user_meta_data ->> 'locale' in ('de', 'en', 'fa', 'ar') then new.raw_user_meta_data ->> 'locale' else 'de' end
  )
  on conflict (id) do nothing;

  insert into public.user_global_roles (user_id, role_key)
  values (new.id, 'customer')
  on conflict (user_id, role_key) do nothing;

  insert into public.customer_preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

alter table public.profiles enable row level security;
alter table public.branches enable row level security;
alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;
alter table public.user_global_roles enable row level security;
alter table public.branch_memberships enable row level security;
alter table public.branch_membership_roles enable row level security;
alter table public.staff_invitations enable row level security;
alter table public.staff_invitation_roles enable row level security;
alter table public.customer_preferences enable row level security;
alter table public.push_subscriptions enable row level security;
alter table public.audit_logs enable row level security;

alter table public.audit_logs force row level security;

grant usage on schema public to anon, authenticated;
revoke all on table
  public.profiles,
  public.branches,
  public.roles,
  public.permissions,
  public.role_permissions,
  public.user_global_roles,
  public.branch_memberships,
  public.branch_membership_roles,
  public.staff_invitations,
  public.staff_invitation_roles,
  public.customer_preferences,
  public.push_subscriptions,
  public.audit_logs
from anon, authenticated;
