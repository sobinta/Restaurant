import { requireBranchPermission, publicClient, requireSuperadmin, requireUser, serviceClient } from '../_shared/auth.ts';
import { handleOptions } from '../_shared/cors.ts';
import { randomToken, sha256Hex } from '../_shared/crypto.ts';
import { errorResponse, HttpError, json } from '../_shared/errors.ts';

const allowedRoles = new Set(['waiter', 'kitchen', 'cashier', 'delivery', 'manager']);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

Deno.serve(async (request) => {
  const options = handleOptions(request); if (options) return options;
  const correlationId = crypto.randomUUID();
  try {
    if (request.method !== 'POST') throw new HttpError(405, 'METHOD_NOT_ALLOWED');
    const user = await requireUser(request);
    const body = await request.json();
    const branchId = String(body.branchId || '');
    const email = String(body.email || '').trim().toLowerCase();
    const roles: string[] = Array.from(new Set<string>(Array.isArray(body.roles) ? body.roles.map(String) : []));
    if (!branchId || !emailPattern.test(email) || !roles.length || roles.some((role) => !allowedRoles.has(role))) throw new HttpError(400, 'INVALID_INVITATION');
    await requireBranchPermission(user.id, branchId, 'staff.invite');
    if (roles.includes('manager')) await requireSuperadmin(user.id);

    const token = randomToken();
    const tokenHash = await sha256Hex(token);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const appUrl = (Deno.env.get('PUBLIC_APP_URL') || '').replace(/\/$/, '');
    if (!appUrl) throw new HttpError(503, 'PUBLIC_APP_URL_NOT_CONFIGURED');
    const { data, error } = await serviceClient.rpc('create_staff_invitation', {
      invitation_branch_id: branchId, invitation_email: email, invitation_token_hash: tokenHash,
      invitation_roles: roles, invitation_expires_at: expiresAt, invitation_actor: user.id,
    });
    if (error) throw error;

    const redirectTo = `${appUrl}/auth/callback?returnTo=${encodeURIComponent(`/staff/invitations/accept?token=${token}`)}`;
    const { error: emailError } = await publicClient.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo, shouldCreateUser: true } });
    if (emailError) {
      await serviceClient.from('staff_invitations').update({ status: 'revoked', revoked_at: new Date().toISOString() }).eq('id', data.id);
      throw new HttpError(502, 'INVITATION_EMAIL_FAILED');
    }

    return json(request, { invitationId: data.id, expiresAt, correlationId }, 201);
  } catch (error) { return errorResponse(request, error, correlationId); }
});
