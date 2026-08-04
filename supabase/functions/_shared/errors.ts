import { corsHeaders } from './cors.ts';

export class HttpError extends Error {
  status: number;
  code: string;
  constructor(status: number, code: string) { super(code); this.status = status; this.code = code; }
}

export const json = (request: Request, body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders(request), 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
});

export const errorResponse = (request: Request, error: unknown, correlationId: string) => {
  const status = error instanceof HttpError ? error.status : 500;
  const code = error instanceof HttpError ? error.code : 'INTERNAL_ERROR';
  if (!(error instanceof HttpError)) console.error(JSON.stringify({ correlationId, error }));
  return json(request, { error: code, correlationId }, status);
};
