// Cloudflare Pages Function -> /api/reco
//   GET  ?sign=gemini                       -> { article: "wp-123" }  (the article to recommend for that sign; counts as "shown")
//   POST { sign, article, kind: click|journey } -> counts a click / a click that kept reading
// Anonymous: stores only sign + article + three counters. No IP, no person (the IP is only used, scrambled, to limit abuse).
import { countHit, usageKey, type UsageEnv } from '../../server/engine/usage';
import { articlesOfSign, bump, getStats, pick } from '../../server/engine/reco';

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });
const BOT = /bot|crawl|spider|slurp|headless|lighthouse|preview|monitor/i;

export const onRequestGet = async ({ request, env }: { request: Request; env: UsageEnv }): Promise<Response> => {
  const sign = (new URL(request.url).searchParams.get('sign') || '').toLowerCase();
  const candidates = articlesOfSign(sign);
  if (!candidates.length) return json({ article: null });
  if (candidates.length === 1) return json({ article: candidates[0] });
  const chosen = pick(candidates, await getStats(env, sign));
  if (!chosen) return json({ article: null });
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const day = new Date().toISOString().slice(0, 10);
  const human = !BOT.test(request.headers.get('User-Agent') || '');
  if (human && (await countHit(env, await usageKey(env, ['reco-ip', day, ip]), 24 * 3600)) <= 40) await bump(env, sign, chosen, 'shown');
  return json({ article: chosen });
};

export const onRequestPost = async ({ request, env }: { request: Request; env: UsageEnv }): Promise<Response> => {
  let b: Record<string, unknown> = {};
  try { b = (await request.json()) as Record<string, unknown>; } catch { return json({ ok: false }, 400); }
  const sign = String(b.sign || '').toLowerCase();
  const article = String(b.article || '');
  const kind = String(b.kind || '');
  if ((kind !== 'click' && kind !== 'journey') || !articlesOfSign(sign).includes(article)) return json({ ok: false }, 400);
  if (BOT.test(request.headers.get('User-Agent') || '')) return json({ ok: true });
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const day = new Date().toISOString().slice(0, 10);
  if ((await countHit(env, await usageKey(env, ['reco-ip-' + kind, day, ip]), 24 * 3600)) > 20) return json({ ok: true }); // quietly ignore extra
  await bump(env, sign, article, kind as 'click' | 'journey');
  return json({ ok: true });
};
