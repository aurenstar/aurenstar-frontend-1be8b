// Cloudflare Pages Function -> POST /api/chart   { date: "1990-01-26", time?: "14:30", geonameid?: 3448439 }
// Real astronomical calculation: Swiss Ephemeris (WebAssembly) + IANA time zone history.
import { ChartInputError, computeChart, type ChartEnv, type ChartRequest } from '../../server/engine/chart';

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });

export const onRequestPost = async ({ request, env }: { request: Request; env: ChartEnv }) => {
  let body: ChartRequest;
  try {
    body = (await request.json()) as ChartRequest;
  } catch {
    return json({ error: 'Send a JSON body: { "date": "YYYY-MM-DD", "time": "HH:MM", "geonameid": 123 }' }, 400);
  }
  try {
    return json(await computeChart(body, env, new URL(request.url).origin));
  } catch (error) {
    if (error instanceof ChartInputError) return json({ error: error.message }, 400);
    console.error('chart error', error);
    return json({ error: 'Calculation is temporarily unavailable.' }, 502);
  }
};
