// Cloudflare Pages Function -> POST /api/transits   { date, time?, geonameid? }
// Where the planets are RIGHT NOW compared with this person's birth chart (real Swiss Ephemeris positions).
import { ChartInputError, computeChart, type ChartEnv } from '../../server/engine/chart';
import { transitsToNatal } from '../../server/engine/aspects';
import { countHit, usageKey, type UsageEnv } from '../../server/engine/usage';

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });

const PLANETS = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'] as const;

export const onRequestPost = async ({ request, env }: { request: Request; env: ChartEnv & UsageEnv }) => {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  if ((await countHit(env, await usageKey(env, ['transits-ip', ip]), 3600)) > 60) return json({ error: 'Too many requests. Try again later.' }, 429);
  let body: any;
  try { body = await request.json(); } catch { return json({ error: 'Send a JSON body: { "date": "YYYY-MM-DD", "time": "HH:MM", "geonameid": 123 }' }, 400); }
  try {
    const origin = new URL(request.url).origin;
    const now = new Date();
    const [birth, sky] = await Promise.all([
      computeChart(body, env, origin),
      computeChart({ date: now.toISOString().slice(0, 10), time: now.toISOString().slice(11, 16) }, env, origin),
    ]);
    const pick = (c: typeof birth) => Object.fromEntries(PLANETS.map((p) => [p, c.planets[p].longitude]));
    const transits = transitsToNatal(pick(sky), pick(birth)).slice(0, 12);
    return json({
      now: now.toISOString(),
      retrograde: PLANETS.filter((p) => sky.planets[p].retrograde),
      moon: { sign: sky.moon.sign, degree: sky.moon.degree },
      transits,
    });
  } catch (error) {
    if (error instanceof ChartInputError) return json({ error: error.message }, 400);
    console.error('transits error', error);
    return json({ error: 'Calculation is temporarily unavailable.' }, 502);
  }
};
