import { createClient, type User } from 'npm:@supabase/supabase-js@2';
import { HttpError } from './errors.ts';

const url = Deno.env.get('SUPABASE_URL') || '';
const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const publicKey = Deno.env.get('SUPABASE_ANON_KEY') || Deno.env.get('SUPABASE_PUBLISHABLE_KEY') || '';

export const serviceClient = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
export const publicClient = createClient(url, publicKey, { auth: { persistSession: false, autoRefreshToken: false } });

export const requireUser = async (request: Request): Promise<User> => {
  const authorization = request.headers.get('authorization');
  if (!authorization?.startsWith('Bearer ')) throw new HttpError(401, 'AUTH_REQUIRED');
  const { data, error } = await serviceClient.auth.getUser(authorization.slice(7));
  if (error || !data.user) throw new HttpError(401, 'INVALID_SESSION');
  return data.user;
};

export const isSuperadmin = async (userId: string) => {
  const { data, error } = await serviceClient.from('user_global_roles').select('role_key').eq('user_id', userId).eq('role_key', 'superadmin').maybeSingle();
  if (error) throw error;
  return Boolean(data);
};

export const requireSuperadmin = async (userId: string) => {
  if (!await isSuperadmin(userId)) throw new HttpError(403, 'SUPERADMIN_REQUIRED');
};

export const requireBranchPermission = async (userId: string, branchId: string, permission: string) => {
  if (await isSuperadmin(userId)) return;

  const { data, error } = await serviceClient.from('branch_memberships')
    .select('status, branch_membership_roles(role_key, roles(role_permissions(permission_key)))')
    .eq('user_id', userId).eq('branch_id', branchId).eq('status', 'active').maybeSingle();
  if (error) throw error;
  const allowed = data?.branch_membership_roles?.some((membershipRole) => (
    membershipRole.roles?.some((role) => role.role_permissions?.some((item) => item.permission_key === permission))
  ));
  if (!allowed) throw new HttpError(403, 'PERMISSION_DENIED');
};

export const requireMembershipScope = async (userId: string, membershipId: string, permission: string) => {
  const { data, error } = await serviceClient.from('branch_memberships').select('branch_id, user_id, branch_membership_roles(role_key)').eq('id', membershipId).maybeSingle();
  if (error) throw error;
  if (!data) throw new HttpError(404, 'MEMBERSHIP_NOT_FOUND');
  if (data.user_id === userId) throw new HttpError(409, 'SELF_MANAGEMENT_NOT_ALLOWED');
  if (data.branch_membership_roles?.some((role: { role_key: string }) => role.role_key === 'manager')) await requireSuperadmin(userId);
  await requireBranchPermission(userId, data.branch_id, permission);
  return data;
};
