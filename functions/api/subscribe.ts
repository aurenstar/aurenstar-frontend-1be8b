// Cloudflare Pages Function -> POST /api/subscribe   { email, sign?, lang, source, consent: true }
// T-shirt waiting list. Saved ONLY when the visitor ticked the consent box; the exact sentence they agreed to is stored too.
import { countHit, recordSubscriber, usageKey, type UsageEnv } from '../../server/engine/usage';
import { humanCheck, humanCheckFailed } from '../../server/engine/turnstile';
import { emailMessage } from '../../src/utils/emailGuard';
import { NEWSLETTER_CONSENT, TSHIRT_CONSENT } from '../../src/data/subscribeConsent';

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });

export const onRequestPost = async ({ request, env }: { request: Request; env: UsageEnv }): Promise<Response> => {
  if (!(await humanCheck(request, env as any))) return humanCheckFailed();
  let b: Record<string, unknown> = {};
  try { b = (await request.json()) as Record<string, unknown>; } catch { return json({ ok: false }, 400); }
  const email = String(b.email || '').trim();
  const lang = (['pt', 'en', 'es'] as const).find((l) => l === b.lang) || 'en';
  if (b.consent !== true) return json({ ok: false, reason: 'consent' }, 400);
  if (!email || email.length > 254 || emailMessage(email, 'en')) return json({ ok: false, reason: 'email' }, 400);
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const day = new Date().toISOString().slice(0, 10);
  if ((await countHit(env, await usageKey(env, ['subscribe-ip', day, ip]), 24 * 3600)) > 30) return json({ ok: false, reason: 'limit' }, 429);
  const list = b.list === 'newsletter' ? 'newsletter' : 'tshirts';
  // Country and region come from Cloudflare (never from the form), to see where the audience lives.
  const cf = (request as any).cf as { country?: string; region?: string } | undefined;
  const cc = String(cf?.country || request.headers.get('CF-IPCountry') || '').toUpperCase();
  const country = /^[A-Z]{2}$/.test(cc) && cc !== 'XX' && cc !== 'T1' ? cc : '';
  const region = String(cf?.region || request.headers.get('CF-Region') || '').slice(0, 60);
  const saved = await recordSubscriber(env, { country, region, list, email, sign: String(b.sign || '').slice(0, 20), lang, source: String(b.source || '').slice(0, 30), consentText: (list === 'newsletter' ? NEWSLETTER_CONSENT : TSHIRT_CONSENT)[lang] });
  return saved ? json({ ok: true }) : json({ ok: false, reason: 'unavailable' }, 502);
};
