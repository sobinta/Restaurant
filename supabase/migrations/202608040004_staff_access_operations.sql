create or replace function public.create_staff_invitation(
  invitation_branch_id uuid,
  invitation_email text,
  invitation_token_hash bytea,
  invitation_roles text[],
  invitation_expires_at timestamptz,
  invitation_actor uuid
)
returns public.staff_invitations
language plpgsql
security definer
set search_path = ''
as $$
declare
  created_invitation public.staff_invitations;
  requested_role text;
begin
  if invitation_email is null or invitation_email <> lower(invitation_email) then
    raise exception 'INVALID_EMAIL' using errcode = '22023';
  end if;
  if cardinality(invitation_roles) = 0 or invitation_roles is null then
    raise exception 'ROLES_REQUIRED' using errcode = '22023';
  end if;
  if invitation_expires_at <= now() or invitation_expires_at > now() + interval '30 days' then
    raise exception 'INVALID_EXPIRY' using errcode = '22023';
  end if;
  if exists (
    select 1 from unnest(invitation_roles) requested(key)
    left join public.roles role on role.key = requested.key
    where role.key is null or role.scope <> 'branch'
  ) then
    raise exception 'INVALID_ROLE' using errcode = '22023';
  end if;

  update public.staff_invitations
  set status = 'revoked', revoked_at = now()
  where branch_id = invitation_branch_id
    and email = invitation_email
    and status = 'pending';

  insert into public.staff_invitations (branch_id, email, token_hash, invited_by, expires_at)
  values (invitation_branch_id, invitation_email, invitation_token_hash, invitation_actor, invitation_expires_at)
  returning * into created_invitation;

  foreach requested_role in array invitation_roles loop
    insert into public.staff_invitation_roles (invitation_id, role_key)
    values (created_invitation.id, requested_role);
  end loop;

  insert into public.audit_logs (actor_user_id, branch_id, action, target_type, target_id, context)
  values (invitation_actor, invitation_branch_id, 'staff.invitation.created', 'staff_invitation', created_invitation.id::text, jsonb_build_object('roles', invitation_roles));

  return created_invitation;
end;
$$;

create or replace function public.accept_staff_invitation(
  invitation_token_hash bytea,
  accepting_user_id uuid,
  accepting_email text
)
returns public.branch_memberships
language plpgsql
security definer
set search_path = ''
as $$
declare
  invitation public.staff_invitations;
  membership public.branch_memberships;
begin
  select * into invitation
  from public.staff_invitations
  where token_hash = invitation_token_hash
  for update;

  if invitation.id is null then raise exception 'INVITATION_NOT_FOUND' using errcode = 'P0002'; end if;
  if invitation.status <> 'pending' then raise exception 'INVITATION_NOT_PENDING' using errcode = '22023'; end if;
  if invitation.expires_at <= now() then
    update public.staff_invitations set status = 'expired' where id = invitation.id;
    raise exception 'INVITATION_EXPIRED' using errcode = '22023';
  end if;
  if lower(accepting_email) <> invitation.email then raise exception 'INVITATION_EMAIL_MISMATCH' using errcode = '42501'; end if;

  insert into public.branch_memberships (branch_id, user_id, status, invited_by, joined_at)
  values (invitation.branch_id, accepting_user_id, 'active', invitation.invited_by, now())
  on conflict (branch_id, user_id) do update
  set status = 'active', joined_at = coalesce(public.branch_memberships.joined_at, now()), suspended_at = null, revoked_at = null
  returning * into membership;

  delete from public.branch_membership_roles where membership_id = membership.id;
  insert into public.branch_membership_roles (membership_id, role_key, assigned_by)
  select membership.id, role_key, invitation.invited_by
  from public.staff_invitation_roles
  where invitation_id = invitation.id;

  update public.staff_invitations
  set status = 'accepted', accepted_by = accepting_user_id, accepted_at = now()
  where id = invitation.id;

  insert into public.audit_logs (actor_user_id, branch_id, action, target_type, target_id, context)
  values (accepting_user_id, invitation.branch_id, 'staff.invitation.accepted', 'branch_membership', membership.id::text, jsonb_build_object('invitation_id', invitation.id));

  return membership;
end;
$$;

create or replace function public.replace_member_roles(
  target_membership_id uuid,
  replacement_roles text[],
  operation_actor uuid
)
returns public.branch_memberships
language plpgsql
security definer
set search_path = ''
as $$
declare
  membership public.branch_memberships;
  requested_role text;
begin
  select * into membership from public.branch_memberships where id = target_membership_id for update;
  if membership.id is null then raise exception 'MEMBERSHIP_NOT_FOUND' using errcode = 'P0002'; end if;
  if cardinality(replacement_roles) = 0 or replacement_roles is null then raise exception 'ROLES_REQUIRED' using errcode = '22023'; end if;
  if exists (
    select 1 from unnest(replacement_roles) requested(key)
    left join public.roles role on role.key = requested.key
    where role.key is null or role.scope <> 'branch'
  ) then raise exception 'INVALID_ROLE' using errcode = '22023'; end if;

  delete from public.branch_membership_roles where membership_id = membership.id;
  foreach requested_role in array replacement_roles loop
    insert into public.branch_membership_roles (membership_id, role_key, assigned_by)
    values (membership.id, requested_role, operation_actor);
  end loop;

  insert into public.audit_logs (actor_user_id, branch_id, action, target_type, target_id, context)
  values (operation_actor, membership.branch_id, 'staff.roles.replaced', 'branch_membership', membership.id::text, jsonb_build_object('roles', replacement_roles));
  return membership;
end;
$$;

create or replace function public.set_member_status(
  target_membership_id uuid,
  replacement_status public.membership_status,
  operation_actor uuid
)
returns public.branch_memberships
language plpgsql
security definer
set search_path = ''
as $$
declare
  membership public.branch_memberships;
begin
  if replacement_status not in ('active', 'suspended', 'revoked') then raise exception 'INVALID_STATUS' using errcode = '22023'; end if;
  update public.branch_memberships
  set status = replacement_status,
      suspended_at = case when replacement_status = 'suspended' then now() else null end,
      revoked_at = case when replacement_status = 'revoked' then now() else null end
  where id = target_membership_id
  returning * into membership;
  if membership.id is null then raise exception 'MEMBERSHIP_NOT_FOUND' using errcode = 'P0002'; end if;

  insert into public.audit_logs (actor_user_id, branch_id, action, target_type, target_id, context)
  values (operation_actor, membership.branch_id, 'staff.status.changed', 'branch_membership', membership.id::text, jsonb_build_object('status', replacement_status));
  return membership;
end;
$$;

create or replace function public.upsert_push_subscription(
  subscription_user_id uuid,
  subscription_branch_id uuid,
  subscription_endpoint text,
  subscription_endpoint_hash bytea,
  subscription_p256dh text,
  subscription_auth_secret text,
  subscription_user_agent text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare subscription_id uuid;
begin
  insert into public.push_subscriptions (user_id, branch_id, endpoint, endpoint_hash, p256dh, auth_secret, user_agent)
  values (subscription_user_id, subscription_branch_id, subscription_endpoint, subscription_endpoint_hash, subscription_p256dh, subscription_auth_secret, subscription_user_agent)
  on conflict (user_id, endpoint_hash) do update
  set branch_id = excluded.branch_id, endpoint = excluded.endpoint, p256dh = excluded.p256dh,
      auth_secret = excluded.auth_secret, user_agent = excluded.user_agent, revoked_at = null, last_seen_at = now()
  returning id into subscription_id;
  return subscription_id;
end;
$$;

revoke all on function public.create_staff_invitation(uuid,text,bytea,text[],timestamptz,uuid) from public, anon, authenticated;
revoke all on function public.accept_staff_invitation(bytea,uuid,text) from public, anon, authenticated;
revoke all on function public.replace_member_roles(uuid,text[],uuid) from public, anon, authenticated;
revoke all on function public.set_member_status(uuid,public.membership_status,uuid) from public, anon, authenticated;
revoke all on function public.upsert_push_subscription(uuid,uuid,text,bytea,text,text,text) from public, anon, authenticated;

grant execute on function public.create_staff_invitation(uuid,text,bytea,text[],timestamptz,uuid) to service_role;
grant execute on function public.accept_staff_invitation(bytea,uuid,text) to service_role;
grant execute on function public.replace_member_roles(uuid,text[],uuid) to service_role;
grant execute on function public.set_member_status(uuid,public.membership_status,uuid) to service_role;
grant execute on function public.upsert_push_subscription(uuid,uuid,text,bytea,text,text,text) to service_role;
