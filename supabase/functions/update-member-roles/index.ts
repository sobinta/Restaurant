import { requireMembershipScope, requireSuperadmin, requireUser, serviceClient } from '../_shared/auth.ts';
import { handleOptions } from '../_shared/cors.ts';
import { errorResponse, HttpError, json } from '../_shared/errors.ts';

const allowedRoles = new Set(['waiter', 'kitchen', 'cashier', 'delivery', 'manager']);

Deno.serve(async (request) => {
  const options = handleOptions(request); if (options) return options;
  const correlationId = crypto.randomUUID();
  try {
    if (request.method !== 'POST') throw new HttpError(405, 'METHOD_NOT_ALLOWED');
    const user = await requireUser(request);
    const body = await request.json();
    const membershipId = String(body.membershipId || '');
    const roles: string[] = Array.from(new Set<string>(Array.isArray(body.roles) ? body.roles.map(String) : []));
    if (!membershipId || !roles.length || roles.some((role) => !allowedRoles.has(role))) throw new HttpError(400, 'INVALID_ROLES');
    await requireMembershipScope(user.id, membershipId, 'staff.roles.write');
    if (roles.includes('manager')) await requireSuperadmin(user.id);
    const { data, error } = await serviceClient.rpc('replace_member_roles', { target_membership_id: membershipId, replacement_roles: roles, operation_actor: user.id });
    if (error) throw error;
    return json(request, { membership: data, correlationId });
  } catch (error) { return errorResponse(request, error, correlationId); }
});
