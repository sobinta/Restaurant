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
    const body = await request.json();
    const endpoint = String(body.subscription?.endpoint || '');
    const p256dh = String(body.subscription?.keys?.p256dh || '');
    const authSecret = String(body.subscription?.keys?.auth || '');
    const branchId = body.branchId ? String(body.branchId) : null;
    if (!endpoint.startsWith('https://') || !p256dh || !authSecret || endpoint.length > 4096) throw new HttpError(400, 'INVALID_PUSH_SUBSCRIPTION');
    const { data, error } = await serviceClient.rpc('upsert_push_subscription', {
      subscription_user_id: user.id, subscription_branch_id: branchId,
      subscription_endpoint: endpoint, subscription_endpoint_hash: await sha256Hex(endpoint),
      subscription_p256dh: p256dh, subscription_auth_secret: authSecret,
      subscription_user_agent: request.headers.get('user-agent')?.slice(0, 500) || null,
    });
    if (error) throw error;
    return json(request, { subscriptionId: data, correlationId }, 201);
  } catch (error) { return errorResponse(request, error, correlationId); }
});
