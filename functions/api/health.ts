// Cloudflare Pages Function -> GET /api/health
// Answers "is everything the site needs working?" for the uptime check. Never shows any secret.
import type { ChartEnv } from '../../server/engine/chart';
import { getCachedReading, usageKey, type UsageEnv } from '../../server/engine/usage';

const DEFAULT_ENGINE_URL = 'https://aurenstar-engine.oficial-safare.workers.dev';

async function timed<T>(fn: () => Promise<T>): Promise<{ ok: boolean; ms: number }> {
  const start = Date.now();
  try {
    await Promise.race([fn(), new Promise((_r, rej) => setTimeout(() => rej(new Error('timeout')), 8000))]);
    return { ok: true, ms: Date.now() - start };
  } catch {
    return { ok: false, ms: Date.now() - start };
  }
}

export const onRequestGet = async ({ env }: { env: ChartEnv & UsageEnv & { OPENAI_API_KEY?: string } }) => {
  const [engine, database] = await Promise.all([
    timed(async () => {
      const res = await fetch(`${(env.ENGINE_URL || DEFAULT_ENGINE_URL).replace(/\/$/, '')}/api/positions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ utc: '2024-03-20T03:06:00Z', lat: 0, lon: 0, houseSystem: 'P' }),
      });
      const j: any = await res.json();
      if (!res.ok || Math.abs(j?.bodies?.sun?.longitude - 360) > 0.05 && Math.abs(j?.bodies?.sun?.longitude) > 0.05) throw new Error('bad');
    }),
    timed(async () => {
      // a read of a key that does not exist: only proves the database answers
      await getCachedReading(env, await usageKey(env, ['health']), 1);
    }),
  ]);
  const ai = { configured: Boolean(env.OPENAI_API_KEY) };
  const ok = engine.ok && ai.configured;
  return new Response(JSON.stringify({ ok, engine, database, ai, time: new Date().toISOString() }), {
    status: ok ? 200 : 503,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' },
  });
};
