create or replace function public.broadcast_membership_access_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare target_user_id uuid;
begin
  if tg_table_name = 'branch_memberships' then
    target_user_id := coalesce(new.user_id, old.user_id);
  else
    select user_id into target_user_id
    from public.branch_memberships
    where id = coalesce(new.membership_id, old.membership_id);
  end if;
  if target_user_id is not null then
    perform realtime.broadcast_changes(
      'user:' || target_user_id::text || ':access',
      tg_op,
      'access_changed',
      tg_table_name,
      tg_table_schema,
      new,
      old
    );
  end if;
  return coalesce(new, old);
end;
$$;

create trigger broadcast_branch_membership_access
after insert or update or delete on public.branch_memberships
for each row execute function public.broadcast_membership_access_change();

create trigger broadcast_branch_role_access
after insert or update or delete on public.branch_membership_roles
for each row execute function public.broadcast_membership_access_change();

create policy authenticated_users_receive_own_access_events
on realtime.messages for select to authenticated
using (realtime.topic() = 'user:' || (select auth.uid())::text || ':access');
