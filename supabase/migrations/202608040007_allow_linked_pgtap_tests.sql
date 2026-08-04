-- The hosted CLI runs `supabase test db --linked` as cli_login_postgres.
-- Grant only schema lookup so pgTAP can execute against the linked database.
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'cli_login_postgres') then
    grant usage on schema extensions to cli_login_postgres;
  end if;
end
$$;
