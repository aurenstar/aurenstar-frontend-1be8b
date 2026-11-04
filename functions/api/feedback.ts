// Cloudflare Pages Function -> POST /api/feedback   { tool, rating: 1 | -1, sign?, lang? }
// Anonymous thumbs up / down on a result. Stores ONLY: which tool, up or down, the star sign and the language.
// No name, no birth data, no city, no IP address is saved (the IP is only used to limit votes, as a scrambled code).
import { countHit, recordFeedback, usageKey, type UsageEnv } from '../../server/engine/usage';

const TOOLS = ['daily_message', 'auren_effect', 'discover_sign', 'describe_me'];
const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });

export const onRequestPost = async ({ request, env }: { request: Request; env: UsageEnv }): Promise<Response> => {
  let b: Record<string, unknown> = {};
  try { b = (await request.json()) as Record<string, unknown>; } catch { return json({ ok: false }, 400); }
  const tool = String(b.tool || '');
  const rating = Number(b.rating);
  if (!TOOLS.includes(tool) || (rating !== 1 && rating !== -1)) return json({ ok: false }, 400);
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const day = new Date().toISOString().slice(0, 10);
  if ((await countHit(env, await usageKey(env, ['feedback-ip', day, tool, ip]), 24 * 3600)) > 5) return json({ ok: true }); // quietly ignore extra votes
  await recordFeedback(env, tool, rating, String(b.sign || '').slice(0, 20), String(b.lang || '').slice(0, 8));
  return json({ ok: true });
};
