import { createClient } from '@supabase/supabase-js';

const required = (name) => {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is required`);
  return value;
};

const url = required('SUPABASE_URL');
const serviceRoleKey = required('SUPABASE_SERVICE_ROLE_KEY');
const email = required('INITIAL_ADMIN_EMAIL').toLowerCase();
const confirmation = required('CONFIRM_PROJECT_REF');
const projectRef = new URL(url).hostname.split('.')[0];

if (confirmation !== projectRef) throw new Error(`Project confirmation mismatch. Expected CONFIRM_PROJECT_REF=${projectRef}`);
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('INITIAL_ADMIN_EMAIL is invalid');

const client = createClient(url, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
let user = null;
for (let page = 1; page <= 20 && !user; page += 1) {
  const { data, error } = await client.auth.admin.listUsers({ page, perPage: 100 });
  if (error) throw error;
  user = data.users.find((candidate) => candidate.email?.toLowerCase() === email) || null;
  if (data.users.length < 100) break;
}

if (!user) {
  const redirectTo = process.env.PUBLIC_APP_URL ? `${process.env.PUBLIC_APP_URL.replace(/\/$/, '')}/auth/callback` : undefined;
  const { data, error } = await client.auth.admin.inviteUserByEmail(email, { redirectTo });
  if (error) throw error;
  user = data.user;
}

const { error: roleError } = await client.from('user_global_roles').upsert({ user_id: user.id, role_key: 'superadmin' }, { onConflict: 'user_id,role_key' });
if (roleError) throw roleError;

const { error: auditError } = await client.from('audit_logs').insert({
  actor_user_id: null,
  action: 'system.initial_superadmin.provisioned',
  target_type: 'auth_user',
  target_id: user.id,
  context: { method: 'operator_bootstrap' },
});
if (auditError) throw auditError;

console.log(`Initial superadmin provisioned for ${email} in project ${projectRef}.`);
