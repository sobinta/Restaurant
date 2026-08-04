grant select on public.profiles to authenticated;
grant update (display_name, phone, avatar_path, locale, onboarding_completed_at) on public.profiles to authenticated;
grant select on public.branches to anon, authenticated;
grant select on public.roles, public.permissions, public.role_permissions to authenticated;
grant select on public.user_global_roles to authenticated;
grant select on public.branch_memberships, public.branch_membership_roles to authenticated;
grant select on public.staff_invitations, public.staff_invitation_roles to authenticated;
grant select, insert, update, delete on public.customer_preferences to authenticated;
grant select on public.push_subscriptions to authenticated;
grant select on public.audit_logs to authenticated;

create policy profiles_select_authorized
on public.profiles for select to authenticated
using (public.current_user_can_read_profile(id));

create policy profiles_update_self
on public.profiles for update to authenticated
using (id = (select auth.uid()) and status = 'active')
with check (id = (select auth.uid()) and status = 'active');

create policy active_branches_anon_read
on public.branches for select to anon
using (is_active);

create policy branches_authenticated_read
on public.branches for select to authenticated
using (is_active or public.current_user_is_superadmin() or public.current_user_has_permission(id, 'branch.read'));

create policy roles_authenticated_read
on public.roles for select to authenticated
using (true);

create policy permissions_authenticated_read
on public.permissions for select to authenticated
using (true);

create policy role_permissions_authenticated_read
on public.role_permissions for select to authenticated
using (true);

create policy global_roles_self_or_superadmin_read
on public.user_global_roles for select to authenticated
using (user_id = (select auth.uid()) or public.current_user_is_superadmin());

create policy memberships_authorized_read
on public.branch_memberships for select to authenticated
using (
  user_id = (select auth.uid())
  or public.current_user_is_superadmin()
  or public.current_user_has_permission(branch_id, 'staff.read')
);

create policy membership_roles_authorized_read
on public.branch_membership_roles for select to authenticated
using (
  exists (
    select 1 from public.branch_memberships bm
    where bm.id = membership_id
      and (
        bm.user_id = (select auth.uid())
        or public.current_user_is_superadmin()
        or public.current_user_has_permission(bm.branch_id, 'staff.read')
      )
  )
);

create policy invitations_authorized_read
on public.staff_invitations for select to authenticated
using (
  lower(email) = lower(coalesce((select auth.jwt() ->> 'email'), ''))
  or public.current_user_is_superadmin()
  or public.current_user_has_permission(branch_id, 'staff.read')
);

create policy invitation_roles_authorized_read
on public.staff_invitation_roles for select to authenticated
using (
  exists (
    select 1 from public.staff_invitations invitation
    where invitation.id = invitation_id
      and (
        lower(invitation.email) = lower(coalesce((select auth.jwt() ->> 'email'), ''))
        or public.current_user_is_superadmin()
        or public.current_user_has_permission(invitation.branch_id, 'staff.read')
      )
  )
);

create policy preferences_self_read
on public.customer_preferences for select to authenticated
using (user_id = (select auth.uid()));

create policy preferences_self_insert
on public.customer_preferences for insert to authenticated
with check (user_id = (select auth.uid()));

create policy preferences_self_update
on public.customer_preferences for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy preferences_self_delete
on public.customer_preferences for delete to authenticated
using (user_id = (select auth.uid()));

create policy push_subscriptions_self_read
on public.push_subscriptions for select to authenticated
using (user_id = (select auth.uid()));

create policy audit_logs_authorized_read
on public.audit_logs for select to authenticated
using (
  public.current_user_is_superadmin()
  or (branch_id is not null and public.current_user_has_permission(branch_id, 'audit.read'))
);

alter publication supabase_realtime add table public.branch_memberships;
alter publication supabase_realtime add table public.branch_membership_roles;

comment on table public.user_global_roles is 'Server-managed account/global roles. Public signup receives customer only.';
comment on table public.audit_logs is 'Append-only privileged audit trail. Clients have no insert, update, or delete grant.';
comment on column public.staff_invitations.token_hash is 'SHA-256 digest of the single-use invitation token; raw tokens are never stored.';
