// Cloudflare Pages Function -> GET /api/comments (approved comments) and POST /api/comments { name?, message, stars?, sign?, lang, website }
// New comments are saved as "pending": they appear on the site only after the owner approves them in the database.
import { countHit, listComments, recordComment, usageKey, type UsageEnv } from '../../server/engine/usage';
import { humanCheck, humanCheckFailed } from '../../server/engine/turnstile';

const json = (data: unknown, status = 200, cache = 'no-store') =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': cache } });

export const onRequestGet = async ({ env }: { env: UsageEnv }): Promise<Response> =>
  json({ comments: await listComments(env, 20) }, 200, 'public, max-age=60');

export const onRequestPost = async ({ request, env }: { request: Request; env: UsageEnv }): Promise<Response> => {
  if (!(await humanCheck(request, env as any))) return humanCheckFailed();
  let b: Record<string, unknown> = {};
  try { b = (await request.json()) as Record<string, unknown>; } catch { return json({ ok: false }, 400); }
  if (b.website) return json({ ok: true }); // hidden field: only robots fill it, pretend it worked
  const message = String(b.message || '').trim();
  const name = String(b.name || '').trim().slice(0, 40);
  if (message.length < 5 || message.length > 600) return json({ ok: false, reason: 'length' }, 400);
  if (/https?:\/\/|www\.|\.(com|net|org|ru|xyz|top)\b|@\S+\.\S+/i.test(message + ' ' + name)) return json({ ok: false, reason: 'links' }, 400);
  const stars = Number(b.stars);
  const lang = (['pt', 'en', 'es'] as const).find((l) => l === b.lang) || 'en';
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const day = new Date().toISOString().slice(0, 10);
  if ((await countHit(env, await usageKey(env, ['comment-ip', day, ip]), 24 * 3600)) > 3) return json({ ok: false, reason: 'limit' }, 429);
  // Country comes from the network (Cloudflare header), only the 2-letter code is kept, never the address itself.
  const cc = (request.headers.get('CF-IPCountry') || '').toUpperCase();
  const country = /^[A-Z]{2}$/.test(cc) && cc !== 'XX' && cc !== 'T1' ? cc : '';
  const saved = await recordComment(env, { name, message, stars: stars >= 1 && stars <= 5 ? Math.round(stars) : 0, sign: String(b.sign || '').slice(0, 20), lang, country });
  return saved ? json({ ok: true }) : json({ ok: false, reason: 'unavailable' }, 502);
};
