// Cloudflare Pages Function -> GET /api/comments (approved comments) and POST /api/comments { name?, message, stars?, sign?, lang, website }
// New comments are saved as "pending": they appear on the site only after the owner approves them in the database.
import { countHit, listComments, recordComment, usageKey, type UsageEnv } from '../../server/engine/usage';
import { humanCheck, humanCheckFailed } from '../../server/engine/turnstile';
import { translateStrings, type TranslateEnv } from '../../server/engine/translateStrings';
import { moderateComment, statusFor } from '../../server/engine/moderateComment';
import { isTranslatedLanguage } from '../../src/utils/urlLang';

const json = (data: unknown, status = 200, cache = 'no-store') =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': cache } });

// GET /api/comments?lang=nl  ->  the same comments with the text in the reader's language (translated once, saved for everyone).
// `original` keeps what the person wrote and `translated` says whether the text changed. If translating fails the originals are shown.
export const onRequestGet = async ({ request, env }: { request: Request; env: UsageEnv }): Promise<Response> => {
  const comments = await listComments(env, 20);
  const asked = (new URL(request.url).searchParams.get('lang') || '').toLowerCase();
  if (!comments.length || !(['en', 'pt', 'es'].includes(asked) || isTranslatedLanguage(asked))) return json({ comments }, 200, 'public, max-age=60');
  const r = await translateStrings(env as TranslateEnv, request, asked, comments.map((c) => c.message));
  if (!r.ok) return json({ comments }, 200, 'public, max-age=60');
  const norm = (s: string) => s.trim().replace(/\s+/g, ' ');
  return json({
    comments: comments.map((c, i) => {
      const text = r.texts[i] || c.message;
      const changed = norm(text).toLowerCase() !== norm(c.message).toLowerCase();
      return changed ? { ...c, message: text, original: c.message, translated: true } : c;
    }),
  }, 200, 'public, max-age=60');
};

export const onRequestPost = async ({ request, env }: { request: Request; env: UsageEnv }): Promise<Response> => {
  if (!(await humanCheck(request, env as any))) return humanCheckFailed();
  let b: Record<string, unknown> = {};
  try { b = (await request.json()) as Record<string, unknown>; } catch { return json({ ok: false }, 400); }
  if (b.website) return json({ ok: true }); // hidden field: only robots fill it, pretend it worked
  const message = String(b.message || '').trim();
  const name = String(b.name || '').trim().slice(0, 40);
  if (message.length < 5 || message.length > 600) return json({ ok: false, reason: 'length' }, 400);
  if (/https?:\/\/|www\.|\.(com|net|org|ru|xyz|top)\b|@\S+\.\S+/i.test(message + ' ' + name)) return json({ ok: false, reason: 'links' }, 400);
  // The name must look like a real first name: letters only (any alphabet), no digits, symbols, links or repeated letters.
  if (name && (!/^\p{L}[\p{L}\p{M}'’. -]{1,29}$/u.test(name) || /(.)\1{3,}/iu.test(name) || name.split(/\s+/).length > 3)) return json({ ok: false, reason: 'name' }, 400);
  const stars = Number(b.stars);
  const lang = (['pt', 'en', 'es'] as const).find((l) => l === b.lang) || 'en';
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const day = new Date().toISOString().slice(0, 10);
  if ((await countHit(env, await usageKey(env, ['comment-ip', day, ip]), 24 * 3600)) > 3) return json({ ok: false, reason: 'limit' }, 429);
  // Country comes from the network (Cloudflare header), only the 2-letter code is kept, never the address itself.
  const cc = (request.headers.get('CF-IPCountry') || '').toUpperCase();
  const country = /^[A-Z]{2}$/.test(cc) && cc !== 'XX' && cc !== 'T1' ? cc : '';
  const entry = { name, message, stars: stars >= 1 && stars <= 5 ? Math.round(stars) : 0, sign: String(b.sign || '').slice(0, 20), lang, country };
  // AI moderation: approve / hide / leave pending. Needs the database secret key (to choose the status); without it the comment stays pending.
  const e = env as UsageEnv & { SUPABASE_SERVICE_KEY?: string; OPENAI_API_KEY?: string; OPENAI_MODEL?: string };
  if (e.SUPABASE_SERVICE_KEY && e.OPENAI_API_KEY) {
    const m = await moderateComment(e, entry);
    if (name && m.nameOk === false) return json({ ok: false, reason: 'name' }, 400); // nickname, offensive or famous name: the person is asked to fix it
    try {
      const base = (e.SUPABASE_URL || 'https://bnetpqdpeufookvvsnaj.supabase.co').replace(/\/$/, '');
      const res = await fetch(`${base}/rest/v1/site_comments`, {
        method: 'POST',
        headers: { apikey: e.SUPABASE_SERVICE_KEY, Authorization: `Bearer ${e.SUPABASE_SERVICE_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify({ name: entry.name, message: entry.message, stars: entry.stars || null, sign: entry.sign, lang: entry.lang, country: country || null, status: statusFor(m.verdict), moderated_by: 'ai', moderation_note: m.reason, moderated_at: new Date().toISOString() }),
      });
      if (res.ok) return json({ ok: true });
    } catch { /* falls back to the normal (pending) save below */ }
  }
  const saved = await recordComment(env, entry);
  return saved ? json({ ok: true }) : json({ ok: false, reason: 'unavailable' }, 502);
};
