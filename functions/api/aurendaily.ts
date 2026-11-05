// Cloudflare Pages Function -> POST /api/aurendaily
// Daily message for the person's sign, written by AI from the real sky (Swiss Ephemeris + IANA time zones + GeoNames city).
// Needs the OPENAI_API_KEY secret; without it (or on any failure) it answers { success: false } and the page shows its ready-made reading.
import { handleAurenDaily } from '../../server/api';
import type { ChartEnv } from '../../server/engine/chart';
import { preciseSky } from '../../server/engine/sky';
import { countHit, getCachedReading, saveReading, usageKey, washingtonDate, type UsageEnv } from '../../server/engine/usage';
import { humanCheck, humanCheckFailed } from '../../server/engine/turnstile';

const MAX_NEW_READINGS_PER_IP_PER_DAY = 8;

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
  const day = washingtonDate();
  const firstName = String(b.name || '').trim().split(/\s+/)[0];

  // 1) The same person (name + birth data) gets the same reading again all day (until midnight in Washington).
  const personKey = await usageKey(env, ['daily', day, firstName, b.birthDate as string, b.birthTime as string, b.geonameid as number, b.lang as string]);
  const cached = await getCachedReading<unknown>(env, personKey, 2 * 24 * 3600);
  if (cached) return new Response(JSON.stringify(cached), { headers });

  // 2) One network address can only create a few different readings per day.
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const ipKey = await usageKey(env, ['daily-ip', day, ip]);
  if ((await countHit(env, ipKey, 24 * 3600)) > MAX_NEW_READINGS_PER_IP_PER_DAY) {
    return new Response(JSON.stringify({ success: false, limited: true }), { headers });
  }

  const precise = await preciseSky(body, env, new URL(request.url).origin);
  const result = await handleAurenDaily(body, precise, { key: env.OPENAI_API_KEY, model: env.OPENAI_MODEL });
  if ((result as { success?: boolean }).success) await saveReading(env, personKey, result);
  return new Response(JSON.stringify(result), { headers });
};
