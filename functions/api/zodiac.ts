// Cloudflare Pages Function -> POST /api/zodiac
// Same logic as the local Express server (see server/api.ts).
// Optional secret: GEMINI_API_KEY (Cloudflare dashboard > Pages > Settings > Variables and Secrets).
// Without it the endpoint answers with the built-in curated readings, exactly like local dev.
import { handleZodiac } from '../../server/api';

interface Context {
  request: Request;
  env: { GEMINI_API_KEY?: string };
}

export const onRequestPost = async ({ request, env }: Context): Promise<Response> => {
  let body: unknown = {};
  try {
    body = await request.json();
  } catch {
    // empty or invalid JSON body: the handler falls back to its defaults
  }
  const result = await handleZodiac(body, env.GEMINI_API_KEY);
  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
};
