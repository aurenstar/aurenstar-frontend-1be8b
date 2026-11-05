/**
 * Translates the WordPress articles into Brazilian Portuguese and Spanish, checks them, and saves one file per article and language:
 *   data/article-translations/<article id>.<pt|es>.json   { hash, article }
 *   npm run articles:translate -- --max 6      (needs OPENAI_API_KEY in the environment)
 *   npm run articles:translate -- --dry        (offline test with a canned answer; writes nothing)
 * An article is translated again only when its English text changed (hash). The build copies the files to /article-data/ and the
 * article page loads the one it needs. A translation that fails any check is NOT saved (the article stays in English until the next run).
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { BLOG_ARTICLES } from '../src/data/blogArticles';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(root, 'data/article-translations');
const arg = (n: string) => { const i = process.argv.indexOf(`--${n}`); return i < 0 ? undefined : process.argv[i + 1]; };
const MAX = Math.max(0, Math.min(30, Number(arg('max') ?? 6)));
const DRY = process.argv.includes('--dry');
const KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.OPENAI_MODEL || 'gpt-6-luna';
const PRICE_IN = Number(process.env.PRICE_IN ?? 0.1);
const PRICE_OUT = Number(process.env.PRICE_OUT ?? 0.5);
const LANGS = { pt: 'Brazilian Portuguese (warm, simple everyday words, "você")', es: 'neutral Latin American Spanish (warm, simple everyday words)' } as const;
type Lang = keyof typeof LANGS;
let tokIn = 0;
let tokOut = 0;

interface Sec { heading: string; paragraphs: string[] }
interface Source { title: string; subtitle: string; quote: string; imageCaption: string; keyTakeaways: string[]; sections: Sec[] }

const sourceOf = (a: (typeof BLOG_ARTICLES)[number]): Source => ({
  title: a.title.en, subtitle: a.subtitle.en, quote: a.quote.en, imageCaption: a.imageCaption.en,
  keyTakeaways: (a.keyTakeaways?.en as string[]) || [],
  sections: a.sections.map((s) => ({ heading: s.heading.en, paragraphs: s.paragraphs.map((p) => p.en) })),
});
const hashOf = (s: Source) => crypto.createHash('sha1').update(JSON.stringify(s)).digest('hex').slice(0, 12);

async function ask(lang: Lang, payload: unknown, kind: string): Promise<any> {
  if (DRY) return JSON.parse(JSON.stringify(payload), (_k, v) => (typeof v === 'string' ? `[${lang}] ${v}` : v));
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}` },
    body: JSON.stringify({
      model: MODEL,
      response_format: { type: 'json_object' },
      messages: [{ role: 'user', content: `Translate this astrology blog article ${kind} into ${LANGS[lang]}. Keep the meaning, tone, short sentences and every name. Do not add or remove anything, do not mention AI or translation. Return ONLY JSON with exactly the same structure and the same number of items in every list.\n\n${JSON.stringify(payload)}` }],
    }),
  });
  if (!res.ok) throw new Error(`model error ${res.status}`);
  const j: any = await res.json();
  tokIn += j?.usage?.prompt_tokens || 0;
  tokOut += j?.usage?.completion_tokens || 0;
  return JSON.parse(String(j?.choices?.[0]?.message?.content || '{}'));
}

const EN_WORDS = /\b(the|and|of|is|are|with|that|this|for|your|you)\b/gi;
const AI_WORDS = /\b(AI|IA)\b|artificial|chatgpt|openai|translat(?:ed|ion) by/i;
const strings = (v: unknown): string[] => (typeof v === 'string' ? [v] : Array.isArray(v) ? v.flatMap(strings) : v && typeof v === 'object' ? Object.values(v).flatMap(strings) : []);

/** Problems found in a translated piece (empty list = good). */
function problems(src: unknown, out: unknown): string[] {
  const a = strings(src), b = strings(out), p: string[] = [];
  if (a.length !== b.length) return ['different number of texts'];
  if (b.some((t) => !t.trim())) p.push('empty text');
  const sa = a.join(' '), sb = b.join(' ');
  if (!DRY) {
    if (sb.length < sa.length * 0.6 || sb.length > sa.length * 2) p.push(`length ${sb.length} vs ${sa.length}`);
    if (b.some((t, i) => t.length > 80 && t === a[i])) p.push('left in English');
    const words = sb.split(/\s+/).length;
    if (((sb.match(EN_WORDS) || []).length / Math.max(1, words)) > 0.04) p.push('too much English');
  }
  if (AI_WORDS.test(sb)) p.push('mentions AI');
  return p;
}

async function translate(src: Source, lang: Lang) {
  const head = { title: src.title, subtitle: src.subtitle, quote: src.quote, imageCaption: src.imageCaption, keyTakeaways: src.keyTakeaways };
  const h = await ask(lang, head, '(title and summary parts)');
  const hp = problems(head, h);
  if (hp.length) throw new Error(`header: ${hp.join(', ')}`);
  const sections: Sec[] = [];
  let batch: Sec[] = [], size = 0;
  const flush = async () => {
    if (!batch.length) return;
    const out = await ask(lang, { sections: batch }, '(body sections)');
    const outSecs: Sec[] = out.sections;
    if (!Array.isArray(outSecs) || outSecs.length !== batch.length || outSecs.some((s, i) => s.paragraphs?.length !== batch[i].paragraphs.length)) throw new Error('sections: structure changed');
    const bp = problems(batch, outSecs);
    if (bp.length) throw new Error(`sections: ${bp.join(', ')}`);
    sections.push(...outSecs.map((s) => ({ heading: String(s.heading), paragraphs: s.paragraphs.map(String) })));
    batch = []; size = 0;
  };
  for (const s of src.sections) {
    const len = JSON.stringify(s).length;
    if (size + len > 6000) await flush();
    batch.push(s); size += len;
  }
  await flush();
  return { title: h.title, subtitle: h.subtitle, quote: h.quote, imageCaption: h.imageCaption, keyTakeaways: h.keyTakeaways, sections };
}

async function main() {
  if (!DRY && !KEY) { console.log('articles: OPENAI_API_KEY is not set, nothing to do.'); return; }
  fs.mkdirSync(DIR, { recursive: true });
  const todo: { id: string; lang: Lang; src: Source; hash: string }[] = [];
  for (const a of BLOG_ARTICLES.filter((x) => x.id.startsWith('wp-'))) {
    const src = sourceOf(a), hash = hashOf(src);
    for (const lang of Object.keys(LANGS) as Lang[]) {
      const f = path.join(DIR, `${a.id}.${lang}.json`);
      let current = '';
      try { current = JSON.parse(fs.readFileSync(f, 'utf8')).hash; } catch { /* not translated yet */ }
      if (current !== hash) todo.push({ id: a.id, lang, src, hash });
    }
  }
  console.log(`articles: ${todo.length} translation(s) pending`);
  let done = 0;
  for (const t of todo.slice(0, MAX * 2)) {
    try {
      const article = await translate(t.src, t.lang);
      if (!DRY) fs.writeFileSync(path.join(DIR, `${t.id}.${t.lang}.json`), JSON.stringify({ hash: t.hash, article }));
      done++;
      console.log(`  + ${t.id} ${t.lang}`);
    } catch (e) {
      console.log(`  - ${t.id} ${t.lang} skipped: ${(e as Error).message}`);
    }
  }
  if (tokIn || tokOut) console.log(`articles: model ${MODEL} used ${tokIn} in + ${tokOut} out tokens = about US$ ${((tokIn * PRICE_IN + tokOut * PRICE_OUT) / 1e6).toFixed(4)}`);
  console.log(`articles: ${done} translation(s) saved${DRY ? ' (dry run)' : ''}`);
}
main().catch((e) => { console.error('articles failed:', e.message); process.exit(1); });
