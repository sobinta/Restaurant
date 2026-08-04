import { requireMembershipScope, requireUser, serviceClient } from '../_shared/auth.ts';
import { handleOptions } from '../_shared/cors.ts';
import { errorResponse, HttpError, json } from '../_shared/errors.ts';

Deno.serve(async (request) => {
  const options = handleOptions(request); if (options) return options;
  const correlationId = crypto.randomUUID();
  try {
    if (request.method !== 'POST') throw new HttpError(405, 'METHOD_NOT_ALLOWED');
    const user = await requireUser(request);
    const body = await request.json();
    const membershipId = String(body.membershipId || '');
    const status = String(body.status || '');
    if (!membershipId || !['active', 'suspended', 'revoked'].includes(status)) throw new HttpError(400, 'INVALID_MEMBERSHIP_STATUS');
    await requireMembershipScope(user.id, membershipId, 'staff.suspend');
    const { data, error } = await serviceClient.rpc('set_member_status', { target_membership_id: membershipId, replacement_status: status, operation_actor: user.id });
    if (error) throw error;
    return json(request, { membership: data, correlationId });
  } catch (error) { return errorResponse(request, error, correlationId); }
});
