// Cloudflare Pages Function -> POST /api/compatibility
//   { a: { date, time?, geonameid? }, b: { date, time?, geonameid? } }
// Compares two real birth charts (Swiss Ephemeris positions) and scores how they fit together.
import { ChartInputError, computeChart, type ChartEnv } from '../../server/engine/chart';
import { compatibility } from '../../server/engine/aspects';
import { countHit, getCachedReading, saveReading, usageKey, type UsageEnv } from '../../server/engine/usage';

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });

const PLANETS = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'] as const;

export const onRequestPost = async ({ request, env }: { request: Request; env: ChartEnv & UsageEnv }) => {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  if ((await countHit(env, await usageKey(env, ['compat-ip', ip]), 3600)) > 40) return json({ error: 'Too many requests. Try again later.' }, 429);
  let body: any;
  try { body = await request.json(); } catch { return json({ error: 'Send a JSON body with "a" and "b" birth data.' }, 400); }
  if (!body?.a || !body?.b) return json({ error: 'Send "a" and "b", each with { date, time?, geonameid? }.' }, 400);
  try {
    const key = await usageKey(env, ['compat', body.a.date, body.a.time, body.a.geonameid, body.b.date, body.b.time, body.b.geonameid]);
    const cached = await getCachedReading<unknown>(env, key, 30 * 86400);
    if (cached) return json(cached);
    const origin = new URL(request.url).origin;
    const [a, b] = await Promise.all([computeChart(body.a, env, origin), computeChart(body.b, env, origin)]);
    const pick = (c: typeof a) => Object.fromEntries(PLANETS.map((p) => [p, c.planets[p].longitude]));
    const result = compatibility(pick(a), pick(b));
    const payload = {
      score: result.score,
      areas: result.areas,
      signs: { a: { sun: a.sun.sign, moon: a.moon.sign }, b: { sun: b.sun.sign, moon: b.moon.sign } },
      strongest: result.strongest,
      challenges: result.challenges,
      aspects: result.aspects.slice(0, 14),
      accuracy: { aMoonApproximate: a.accuracy.moonApproximate, bMoonApproximate: b.accuracy.moonApproximate },
    };
    await saveReading(env, key, payload);
    return json(payload);
  } catch (error) {
    if (error instanceof ChartInputError) return json({ error: error.message }, 400);
    console.error('compatibility error', error);
    return json({ error: 'Calculation is temporarily unavailable.' }, 502);
  }
};
