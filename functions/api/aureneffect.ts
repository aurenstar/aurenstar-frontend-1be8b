// Cloudflare Pages Function -> POST /api/aureneffect
// Same logic as the local Express server (see server/api.ts), but here the sky is calculated with the
// real Swiss Ephemeris engine (see server/engine). If it is ever unavailable, the older approximate
// calculation inside handleAurenEffect is used instead, so the page never breaks.
// Optional secrets: OPENAI_API_KEY (ChatGPT, preferred) or GEMINI_API_KEY (Cloudflare dashboard > Pages > Settings > Variables and Secrets).
import { handleAurenEffect, type PreciseSky } from '../../server/api';
import type { ChartEnv } from '../../server/engine/chart';
import { preciseSky } from '../../server/engine/sky';

interface Context {
  request: Request;
  env: ChartEnv & { GEMINI_API_KEY?: string; OPENAI_API_KEY?: string; OPENAI_MODEL?: string };
}

export const onRequestPost = async ({ request, env }: Context): Promise<Response> => {
  let body: unknown = {};
  try {
    body = await request.json();
  } catch {
    // empty or invalid JSON body: the handler falls back to its defaults
  }
  const precise = await preciseSky(body, env, new URL(request.url).origin);
  const result = await handleAurenEffect(body, env.GEMINI_API_KEY, precise, { key: env.OPENAI_API_KEY, model: env.OPENAI_MODEL });
  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
};
