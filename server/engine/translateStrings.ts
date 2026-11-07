/**
 * Puts short site texts in another language. Each batch is saved in the database once and reused for everyone.
 * Shared by /api/translate-ui and by the language addresses (/nl/..., /ja/...).
 */
import { glossaryRules, brandsKept } from './glossary';
import { countHit, getCachedReading, saveReading, usageKey, type UsageEnv } from './usage';
import { languageName } from './countries';

const CACHE_VERSION = 'v2';
const CACHE_SECONDS = 365 * 24 * 3600;
export const MAX_STRINGS = 120;
export const MAX_CHARS_EACH = 2500;
const MAX_NEW_PER_IP_PER_DAY = 200;
const MAX_NEW_PER_DAY = 20000;

export type TranslateEnv = UsageEnv & { OPENAI_API_KEY?: string; OPENAI_MODEL?: string };

export async function translateStrings(
  env: TranslateEnv,
  request: Request,
  lang: string,
  rawStrings: string[],
): Promise<{ ok: true; texts: string[] } | { ok: false; reason: string }> {
  const strings = rawStrings.map((t) => String(t ?? '').slice(0, MAX_CHARS_EACH)).slice(0, MAX_STRINGS);
  if (!strings.length) return { ok: false, reason: 'empty' };

  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(strings.join('\u0001')));
  const sig = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
  const key = await usageKey(env, ['ui-loc', CACHE_VERSION, lang, sig]);

  const cached = await getCachedReading<{ texts: string[] }>(env, key, CACHE_SECONDS);
  if (cached?.texts?.length === strings.length) return { ok: true, texts: cached.texts };

  if (!env.OPENAI_API_KEY) return { ok: false, reason: 'no-key' };
  const day = new Date().toISOString().slice(0, 10);
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  if ((await countHit(env, await usageKey(env, ['ui-loc-ip', day, ip]), 24 * 3600)) > MAX_NEW_PER_IP_PER_DAY) return { ok: false, reason: 'limit' };
  if ((await countHit(env, await usageKey(env, ['ui-loc-all', day]), 24 * 3600)) > MAX_NEW_PER_DAY) return { ok: false, reason: 'limit' };

  const language = lang === 'pt' ? 'Brazilian Portuguese' : languageName(lang);
  const prompt = `Translate every string of the JSON array below into ${language}. They are short texts of a friendly astrology website (menus, buttons, titles, short sentences).
Rules: natural, warm and simple ${language}, as a native speaker would write it on a website; same meaning and same length (buttons stay short). Keep emojis, symbols, numbers, punctuation, line breaks, URLs, hashtags, @mentions, HTML tags and entities exactly. A string may contain numbered markers like <i1>…</i1>, <i2>…</i2>: translate the text inside them, keep every marker with the same number, in the same order, and translate the whole string as ONE natural sentence. ${glossaryRules(lang, language)} Do not add, remove, merge or explain anything. Never mention translation or artificial intelligence. Empty strings stay empty.
Return ONLY valid JSON: {"texts": [ ...exactly ${strings.length} strings, same order... ]}

${JSON.stringify(strings)}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 40000);
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.OPENAI_API_KEY}` },
      signal: controller.signal,
      body: JSON.stringify({ model: env.OPENAI_MODEL || 'gpt-4.1-mini', response_format: { type: 'json_object' }, messages: [{ role: 'user', content: prompt }] }),
    });
    if (!res.ok) return { ok: false, reason: 'failed' };
    const json: any = await res.json();
    const parsed = JSON.parse(String(json?.choices?.[0]?.message?.content || '{}').replace(/^```json\s*|```$/g, ''));
    const texts = Array.isArray(parsed?.texts) ? parsed.texts.map((t: unknown) => String(t ?? '')) : [];
    if (texts.length !== strings.length) return { ok: false, reason: 'failed' };
    // a translation that lost a brand name is replaced by the original text for that string
    texts.forEach((t: string, i: number) => { if (!brandsKept(strings[i], t)) texts[i] = strings[i]; });
    await saveReading(env, key, { texts });
    return { ok: true, texts };
  } catch {
    return { ok: false, reason: 'error' };
  } finally {
    clearTimeout(timer);
  }
}
