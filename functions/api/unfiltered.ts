// Cloudflare Pages Function -> POST /api/unfiltered
// Aurenstar Unfiltered: a candid, shareable description from the real birth chart (Swiss Ephemeris + IANA time zones + GeoNames city).
// One portrait per person per day (Washington date): a new theme (love, career, friends...) every day, the same text if asked again the same day.
import { handleUnfiltered } from '../../server/api';
import type { ChartEnv } from '../../server/engine/chart';
import { preciseSky } from '../../server/engine/sky';
import { countHit, getCachedReading, saveReading, usageKey, washingtonDate, type UsageEnv } from '../../server/engine/usage';
import { humanCheck, humanCheckFailed } from '../../server/engine/turnstile';

const MAX_NEW_DESCRIPTIONS_PER_IP_PER_DAY = 8;

interface Context {
  request: Request;
  env: ChartEnv & UsageEnv & { OPENAI_API_KEY?: string; OPENAI_MODEL?: string };
}

export const onRequestPost = async ({ request, env }: Context): Promise<Response> => {
  if (!(await humanCheck(request, env as any))) return humanCheckFailed();
  let body: unknown = {};
  try {
    body = await request.json();
  } catch {
    // empty or invalid body
  }
  const b = (body || {}) as Record<string, unknown>;
  const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' };
  const firstName = String(b.name || '').trim().split(/\s+/)[0];

  const personKey = await usageKey(env, ['unfiltered', firstName, b.birthDate as string, b.birthTime as string, String(b.timeKnown), b.geonameid as number, b.lang as string, washingtonDate()]);
  const cached = await getCachedReading<unknown>(env, personKey, 2 * 24 * 3600);
  if (cached) return new Response(JSON.stringify(cached), { headers });

  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const ipKey = await usageKey(env, ['unfiltered-ip', new Date().toISOString().slice(0, 10), ip]);
  if ((await countHit(env, ipKey, 24 * 3600)) > MAX_NEW_DESCRIPTIONS_PER_IP_PER_DAY) {
    return new Response(JSON.stringify({ success: false, limited: true }), { headers });
  }

  const precise = await preciseSky(body, env, new URL(request.url).origin);
  const result = await handleUnfiltered(body, precise, { key: env.OPENAI_API_KEY, model: env.OPENAI_MODEL });
  if ((result as { success?: boolean }).success) await saveReading(env, personKey, result);
  return new Response(JSON.stringify(result), { headers });
};
