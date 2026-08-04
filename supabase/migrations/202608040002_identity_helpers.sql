create or replace function public.current_user_has_global_role(requested_role text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.user_global_roles ugr
    join public.profiles p on p.id = ugr.user_id
    where ugr.user_id = (select auth.uid())
      and ugr.role_key = requested_role
      and p.status = 'active'
  );
$$;

create or replace function public.current_user_is_superadmin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.current_user_has_global_role('superadmin');
$$;

create or replace function public.current_user_has_branch_role(
  requested_branch_id uuid,
  requested_roles text[]
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.current_user_is_superadmin() or exists (
    select 1
    from public.branch_memberships bm
    join public.branch_membership_roles bmr on bmr.membership_id = bm.id
    join public.profiles p on p.id = bm.user_id
    where bm.user_id = (select auth.uid())
      and bm.branch_id = requested_branch_id
      and bm.status = 'active'
      and p.status = 'active'
      and bmr.role_key = any(requested_roles)
  );
$$;

create or replace function public.current_user_has_permission(
  requested_branch_id uuid,
  requested_permission text
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.current_user_is_superadmin() or exists (
    select 1
    from public.branch_memberships bm
    join public.branch_membership_roles bmr on bmr.membership_id = bm.id
    join public.role_permissions rp on rp.role_key = bmr.role_key
    join public.profiles p on p.id = bm.user_id
    where bm.user_id = (select auth.uid())
      and bm.branch_id = requested_branch_id
      and bm.status = 'active'
      and p.status = 'active'
      and rp.permission_key = requested_permission
  );
$$;

create or replace function public.current_user_can_read_profile(requested_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select requested_user_id = (select auth.uid())
    or public.current_user_is_superadmin()
    or exists (
      select 1
      from public.branch_memberships target_membership
      where target_membership.user_id = requested_user_id
        and public.current_user_has_permission(target_membership.branch_id, 'staff.read')
    );
$$;

revoke all on function public.current_user_has_global_role(text) from public;
revoke all on function public.current_user_is_superadmin() from public;
revoke all on function public.current_user_has_branch_role(uuid, text[]) from public;
revoke all on function public.current_user_has_permission(uuid, text) from public;
revoke all on function public.current_user_can_read_profile(uuid) from public;

grant execute on function public.current_user_has_global_role(text) to authenticated;
grant execute on function public.current_user_is_superadmin() to authenticated;
grant execute on function public.current_user_has_branch_role(uuid, text[]) to authenticated;
grant execute on function public.current_user_has_permission(uuid, text) to authenticated;
grant execute on function public.current_user_can_read_profile(uuid) to authenticated;
