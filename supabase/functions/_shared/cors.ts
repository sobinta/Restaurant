const configuredOrigins = (Deno.env.get('ALLOWED_ORIGINS') || '')
  .split(',').map((origin) => origin.trim()).filter(Boolean);

export const corsHeaders = (request: Request) => {
  const origin = request.headers.get('origin') || '';
  const localOrigin = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
  const allowedOrigin = configuredOrigins.includes(origin) || localOrigin ? origin : configuredOrigins[0] || '';
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  };
};

export const handleOptions = (request: Request) => request.method === 'OPTIONS'
  ? new Response(null, { status: 204, headers: corsHeaders(request) })
  : null;
