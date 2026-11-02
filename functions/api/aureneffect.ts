// Cloudflare Pages Function -> POST /api/aureneffect
// Same logic as the local Express server (see server/api.ts), but here the sky is calculated with the
// real Swiss Ephemeris engine (see server/engine). If it is ever unavailable, the older approximate
// calculation inside handleAurenEffect is used instead, so the page never breaks.
// Optional secret: GEMINI_API_KEY (Cloudflare dashboard > Pages > Settings > Variables and Secrets).
import { handleAurenEffect, type PreciseSky } from '../../server/api';
import { buildTriadFromLongitudes } from '../../src/utils/aurenEngine';
import { computeChart, type ChartEnv } from '../../server/engine/chart';

interface Context {
  request: Request;
  env: ChartEnv & { GEMINI_API_KEY?: string };
}

async function preciseSky(body: any, env: ChartEnv, origin: string): Promise<PreciseSky | null> {
  const geonameid = Number(body?.geonameid);
  if (!geonameid || typeof body?.birthDate !== 'string') return null;
  try {
    const birth = await computeChart({ date: body.birthDate, time: body.birthTime || null, geonameid }, env, origin);
    if (!birth.angles || !birth.place) return null;
    // "Today's sky" = the Moon right now (UTC clock, no place needed)
    const now = new Date();
    const today = await computeChart(
      { date: now.toISOString().slice(0, 10), time: now.toISOString().slice(11, 16) },
      env,
      origin,
    );
    const place = birth.place;
    const cityName = [place.name, place.region, place.country].filter(Boolean).join(', ');
    return {
      cityName,
      triad: buildTriadFromLongitudes({
        sun: birth.sun.longitude,
        moon: birth.moon.longitude,
        ascendant: birth.angles.ascendant.longitude,
        todaySun: today.sun.longitude,
        todayMoon: today.moon.longitude,
        julianDate: birth.time.julianDayUt,
      }),
    };
  } catch (error) {
    console.error('precise sky unavailable, using approximate fallback', error);
    return null;
  }
}

export const onRequestPost = async ({ request, env }: Context): Promise<Response> => {
  let body: unknown = {};
  try {
    body = await request.json();
  } catch {
    // empty or invalid JSON body: the handler falls back to its defaults
  }
  const precise = await preciseSky(body, env, new URL(request.url).origin);
  const result = await handleAurenEffect(body, env.GEMINI_API_KEY, precise);
  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
};
