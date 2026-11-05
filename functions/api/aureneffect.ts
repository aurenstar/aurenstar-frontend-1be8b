// Cloudflare Pages Function -> POST /api/aureneffect
// Same logic as the local Express server (see server/api.ts), but here the sky is calculated with the
// real Swiss Ephemeris engine (see server/engine). If it is ever unavailable, the older approximate
// calculation inside handleAurenEffect is used instead, so the page never breaks.
// Optional secrets: OPENAI_API_KEY (ChatGPT, preferred) or GEMINI_API_KEY (Cloudflare dashboard > Pages > Settings > Variables and Secrets).
import { handleAurenEffect, type PreciseSky } from '../../server/api';
import type { ChartEnv } from '../../server/engine/chart';
import { preciseSky } from '../../server/engine/sky';
import { countHit, getCachedReading, saveReading, usageKey, type UsageEnv } from '../../server/engine/usage';
import { humanCheck, humanCheckFailed } from '../../server/engine/turnstile';

const WINDOW_SECONDS = 4 * 3600; // one reading every 4 hours
const MAX_NEW_READINGS_PER_IP_PER_WINDOW = 10;

interface Context {
  request: Request;
  env: ChartEnv & UsageEnv & { GEMINI_API_KEY?: string; OPENAI_API_KEY?: string; OPENAI_MODEL?: string };
}

export const onRequestPost = async ({ request, env }: Context): Promise<Response> => {
  if (!(await humanCheck(request, env as any))) return humanCheckFailed();
  let body: unknown = {};
  try {
    body = await request.json();
  } catch {
    // empty or invalid JSON body: the handler falls back to its defaults
  }
  const b = (body || {}) as Record<string, unknown>;
  const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' };
  const firstName = String(b.name || '').trim().split(/\s+/)[0];

  // 1) The same person (name + birth data) gets the same reading again for 4 hours.
  const personKey = await usageKey(env, ['effect', firstName, b.birthDate as string, b.birthTime as string, b.geonameid as number, b.lang as string]);
  const cached = await getCachedReading<unknown>(env, personKey, WINDOW_SECONDS);
  if (cached) return new Response(JSON.stringify(cached), { headers });

  // 2) One network address can only create a few different readings per window.
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const ipKey = await usageKey(env, ['effect-ip', ip]);
  if ((await countHit(env, ipKey, WINDOW_SECONDS)) > MAX_NEW_READINGS_PER_IP_PER_WINDOW) {
    return new Response(JSON.stringify({ success: false, limited: true }), { headers });
  }

  const precise = await preciseSky(body, env, new URL(request.url).origin);
  const result = await handleAurenEffect(body, env.GEMINI_API_KEY, precise, { key: env.OPENAI_API_KEY, model: env.OPENAI_MODEL });
  // Only readings written by the AI are kept (a ready-made fallback is not worth holding for 4 hours).
  if ((result as { data?: { generatedByAI?: boolean } }).data?.generatedByAI) await saveReading(env, personKey, result);
  return new Response(JSON.stringify(result), { headers });
};
