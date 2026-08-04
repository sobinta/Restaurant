import { requireUser, serviceClient } from '../_shared/auth.ts';
import { handleOptions } from '../_shared/cors.ts';
import { sha256Hex } from '../_shared/crypto.ts';
import { errorResponse, HttpError, json } from '../_shared/errors.ts';

Deno.serve(async (request) => {
  const options = handleOptions(request); if (options) return options;
  const correlationId = crypto.randomUUID();
  try {
    if (request.method !== 'POST') throw new HttpError(405, 'METHOD_NOT_ALLOWED');
    const user = await requireUser(request);
    const { token } = await request.json();
    if (typeof token !== 'string' || token.length < 32 || token.length > 128 || !user.email) throw new HttpError(400, 'INVALID_INVITATION_TOKEN');
    const { data, error } = await serviceClient.rpc('accept_staff_invitation', {
      invitation_token_hash: await sha256Hex(token), accepting_user_id: user.id, accepting_email: user.email.toLowerCase(),
    });
    if (error) {
      if (error.message?.includes('EXPIRED')) throw new HttpError(410, 'INVITATION_EXPIRED');
      if (error.message?.includes('MISMATCH')) throw new HttpError(403, 'INVITATION_EMAIL_MISMATCH');
      if (error.message?.includes('NOT_FOUND')) throw new HttpError(404, 'INVITATION_NOT_FOUND');
      throw error;
    }
    return json(request, { membership: data, correlationId });
  } catch (error) { return errorResponse(request, error, correlationId); }
});
