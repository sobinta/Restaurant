alter table public.profiles add column email text;
create unique index profiles_email_unique_idx on public.profiles (lower(email)) where email is not null;

update public.profiles profile
set email = lower(auth_user.email)
from auth.users auth_user
where profile.id = auth_user.id and auth_user.email is not null;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, display_name, locale)
  values (
    new.id,
    lower(new.email),
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''), split_part(coalesce(new.email, ''), '@', 1)),
    case when new.raw_user_meta_data ->> 'locale' in ('de', 'en', 'fa', 'ar') then new.raw_user_meta_data ->> 'locale' else 'de' end
  )
  on conflict (id) do update set email = excluded.email;

  insert into public.user_global_roles (user_id, role_key)
  values (new.id, 'customer')
  on conflict (user_id, role_key) do nothing;

  insert into public.customer_preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

comment on column public.profiles.email is 'Server-synchronized Auth email; not client-editable.';
