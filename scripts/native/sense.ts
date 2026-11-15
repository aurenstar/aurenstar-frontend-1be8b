/**
 * "Does this search really mean astrology?" check for the native robot, before anything is written.
 * Same rules as the database function site_checar_sentido (the lists live in Supabase, table site_sentido_termo, 44 languages):
 *   1. needs 2+ words (languages written without spaces, like Japanese and Chinese, are checked by pieces of text instead)
 *   2. a loose number (1 to 3 digits) in a very short search is rejected
 *   3. a word from the block list (another meaning: cancer the illness, Gemini the AI, ...) rejects it
 *   4. a clear astrology word (context) accepts it
 *   5. a sign name that also means something else (ambiguous) only counts together with a word like "man", "woman", "traits" (modifier)
 * A term ending with "*" matches any word that starts with it (for languages with many word endings).
 */
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://bnetpqdpeufookvvsnaj.supabase.co';
/** The public (publishable) key: it can only call the one read-only function below. */
const SUPABASE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY || '';

export type SenseLists = Record<string, Partial<Record<'bloqueio' | 'contexto' | 'ambiguo' | 'modificador', string[]>>>;

/** Languages written without spaces between words: matched by pieces of text. */
const NO_SPACE = new Set(['ja', 'zh', 'zht', 'th', 'lo', 'km', 'my']);

export async function loadSenseLists(): Promise<SenseLists> {
  if (!SUPABASE_KEY) throw new Error('SUPABASE_PUBLISHABLE_KEY is not set');
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/site_sentido_listas_publico`, {
    method: 'POST', headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' }, body: '{}',
  });
  if (!res.ok) throw new Error(`sense lists error ${res.status}`);
  return (await res.json()) as SenseLists;
}

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const norm = (s: string) => s.toLowerCase().replace(/[\p{P}\p{S}\p{Z}\s]+/gu, ' ').trim();

function hits(text: string, terms: string[] | undefined, sub: boolean): string | null {
  for (const raw of terms || []) {
    const prefix = raw.endsWith('*');
    const term = norm(prefix ? raw.slice(0, -1) : raw);
    if (!term) continue;
    const re = new RegExp((sub ? '' : '(^| )') + esc(term) + (prefix || sub ? '' : '( |$)'), 'u');
    if (re.test(text)) return term;
  }
  return null;
}

export function checkSense(keyword: string, lang: string, lists: SenseLists): { ok: boolean; why: string } {
  const sub = NO_SPACE.has(lang);
  const t = norm(keyword || '');
  const n = t ? t.split(' ').length : 0;
  if (!t || (!sub && n < 2)) return { ok: false, why: 'less than two words' };
  if (n <= 3 && /(^| )[0-9]{1,3}( |$)/.test(t)) return { ok: false, why: 'loose number' };
  const L = lists[lang];
  if (!L || !(L.contexto || []).length) return { ok: false, why: `no astrology list for language ${lang}` };
  const blocked = hits(t, L.bloqueio, sub);
  if (blocked) return { ok: false, why: `block list: ${blocked}` };
  const ctx = hits(t, L.contexto, sub);
  if (ctx) return { ok: true, why: `context: ${ctx}` };
  const amb = hits(t, L.ambiguo, sub), mod = hits(t, L.modificador, sub);
  if (amb && mod) return { ok: true, why: `sign ${amb} + ${mod}` };
  return { ok: false, why: 'no astrology word' };
}
