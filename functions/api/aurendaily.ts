// Cloudflare Pages Function -> POST /api/aurendaily
// Daily message for the person's sign, written by AI from the real sky (Swiss Ephemeris + IANA time zones + GeoNames city).
// Needs the OPENAI_API_KEY secret; without it (or on any failure) it answers { success: false } and the page shows its ready-made reading.
import { handleAurenDaily } from '../../server/api';
import type { ChartEnv } from '../../server/engine/chart';
import { preciseSky } from '../../server/engine/sky';

interface Context {
  request: Request;
  env: ChartEnv & { OPENAI_API_KEY?: string; OPENAI_MODEL?: string };
}

export const onRequestPost = async ({ request, env }: Context): Promise<Response> => {
  let body: unknown = {};
  try {
    body = await request.json();
  } catch {
    // empty or invalid body
  }
  const precise = await preciseSky(body, env, new URL(request.url).origin);
  const result = await handleAurenDaily(body, precise, { key: env.OPENAI_API_KEY, model: env.OPENAI_MODEL });
  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
};
