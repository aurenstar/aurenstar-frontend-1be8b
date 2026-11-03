// Cloudflare Pages Function -> POST /api/translate-ui   body: { strings: string[] }
// Puts the texts of the site (menus, buttons, titles...) in the language of the visitor's country.
// The country comes from Cloudflare (never from the request body). Each batch is saved in the database once and reused.
// On any failure the answer is {success:false} and the page simply stays in English.
import { countHit, getCachedReading, saveReading, usageKey, type UsageEnv } from '../../server/engine/usage';
import { visitorLocale, languageName, SITE_LANGUAGES } from '../../server/engine/countries';

const CACHE_VERSION = 'v1';
const CACHE_SECONDS = 365 * 24 * 3600;
const MAX_STRINGS = 120;
const MAX_CHARS_EACH = 400;
const MAX_NEW_PER_IP_PER_DAY = 60;
const MAX_NEW_PER_DAY = 2000;

interface Context {
  request: Request;
  env: UsageEnv & { OPENAI_API_KEY?: string; OPENAI_MODEL?: string };
}

export const onRequestPost = async ({ request, env }: Context): Promise<Response> => {
  const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' };
  const fail = (reason = 'failed') => new Response(JSON.stringify({ success: false, reason }), { headers });
  try {
    const v = visitorLocale(request);
    // The site already has hand-written English, Portuguese and Spanish menus.
    if (!v.known || (SITE_LANGUAGES as readonly string[]).includes(v.language)) return fail('not-needed');

    const body: any = await request.json();
    const strings: string[] = Array.isArray(body?.strings)
      ? body.strings.map((t: unknown) => String(t ?? '').slice(0, MAX_CHARS_EACH)).slice(0, MAX_STRINGS)
      : [];
    if (!strings.length) return fail('empty');

    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(strings.join('\u0001')));
    const sig = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
    const key = await usageKey(env, ['ui-loc', CACHE_VERSION, v.language, sig]);

    const cached = await getCachedReading<{ texts: string[] }>(env, key, CACHE_SECONDS);
    if (cached?.texts?.length === strings.length) {
      return new Response(JSON.stringify({ success: true, language: v.language, texts: cached.texts }), { headers });
    }

    if (!env.OPENAI_API_KEY) return fail('no-key');
    const day = new Date().toISOString().slice(0, 10);
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    if ((await countHit(env, await usageKey(env, ['ui-loc-ip', day, ip]), 24 * 3600)) > MAX_NEW_PER_IP_PER_DAY) return fail('limit');
    if ((await countHit(env, await usageKey(env, ['ui-loc-all', day]), 24 * 3600)) > MAX_NEW_PER_DAY) return fail('limit');

    const lang = languageName(v.language);
    const prompt = `Translate every string of the JSON array below into ${lang}. They are short texts of a friendly astrology website (menus, buttons, titles, short sentences).
Rules: natural, warm and simple ${lang}, as a native speaker would write it on a website; same meaning and same length (buttons stay short). Keep emojis, symbols, numbers, punctuation, line breaks, HTML tags and entities exactly. Keep the brand names Aurenstar, Aurendaily, Aureneffect and Unfiltered unchanged. Use the usual ${lang} names for zodiac signs. Do not add, remove, merge or explain anything. Never mention translation or artificial intelligence. Empty strings stay empty.
Return ONLY valid JSON: {"texts": [ ...exactly ${strings.length} strings, same order... ]}

${JSON.stringify(strings)}`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 40000);
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.OPENAI_API_KEY}` },
        signal: controller.signal,
        body: JSON.stringify({ model: env.OPENAI_MODEL || 'gpt-6.1-terra', response_format: { type: 'json_object' }, messages: [{ role: 'user', content: prompt }] }),
      });
      if (!res.ok) return fail();
      const json: any = await res.json();
      const parsed = JSON.parse(String(json?.choices?.[0]?.message?.content || '{}').replace(/^```json\s*|```$/g, ''));
      const texts = Array.isArray(parsed?.texts) ? parsed.texts.map((t: unknown) => String(t ?? '')) : [];
      if (texts.length !== strings.length) return fail();
      await saveReading(env, key, { texts });
      return new Response(JSON.stringify({ success: true, language: v.language, texts }), { headers });
    } finally {
      clearTimeout(timer);
    }
  } catch {
    return fail('error');
  }
};
