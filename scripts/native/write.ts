/**
 * Writes native articles: directly in each language, for the searches people there really type (data/native-topics.json), not translated.
 *   npx tsx scripts/native/write.ts --max 10 --per-lang 3 [--langs de,fr] [--dry]
 * Needs OPENAI_API_KEY (skips quietly without it). Saves data/native-articles/<lang>/<slug>.json only when every quality check passes.
 * Drip: --max is the most articles per run, --per-lang the most per language in total (raise it slowly, after reading the report).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import topicsFile from '../../data/native-topics.json';
import { BLOG_ARTICLES } from '../../src/data/blogArticles';
import { getArticleSlug } from '../../src/utils/articleSlug';
import { checkArticle, fold, TOOLS, type NativeArticle } from '../../server/engine/nativeArticle';
import { intentKey } from '../dictionary/nativeTopics';
import { activeWave } from './plan';
import { ASTROLOGY_DICTIONARY_TERMS } from '../../src/data/astrologyDictionaryData';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIR = path.join(root, 'data/native-articles');
const arg = (n: string) => { const i = process.argv.indexOf(`--${n}`); return i < 0 ? undefined : process.argv[i + 1]; };
const DRY = process.argv.includes('--dry');
const KEY = process.env.OPENAI_API_KEY;
/** The wave plan (data/native-plan.json) says which languages are open today and how many articles are allowed; --langs / --max / --per-lang or the NATIVE_* variables override it. */
const WAVE = activeWave();
const LANGS = (arg('langs') || process.env.NATIVE_LANGS || WAVE.langs.join(',')).split(',').map((s) => s.trim()).filter(Boolean);
const MAX = Math.max(0, Math.min(40, Number(arg('max') ?? WAVE.maxPerDay)));
const PER_LANG = Math.max(0, Number(arg('per-lang') ?? (process.env.NATIVE_PER_LANG || WAVE.perLang)));
const WRITE_MODEL = process.env.OPENAI_WRITE_MODEL || 'gpt-4.1';
const FALLBACK_MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-mini';

const LANG_NAME: Record<string, string> = { de: 'German (Germany, Austria, Switzerland)', fr: 'French (France and French-speaking countries)', ar: 'Arabic (Modern Standard, easy to read across the Arab world)', ru: 'Russian', tr: 'Turkish', hi: 'Hindi', it: 'Italian', vi: 'Vietnamese', ja: 'Japanese', id: 'Indonesian', nl: 'Dutch', ko: 'Korean', zh: 'Simplified Chinese', pl: 'Polish', th: 'Thai', sv: 'Swedish', da: 'Danish', no: 'Norwegian', fi: 'Finnish', el: 'Greek', he: 'Hebrew', uk: 'Ukrainian', cs: 'Czech', ro: 'Romanian', bg: 'Bulgarian', hu: 'Hungarian', sk: 'Slovak', hr: 'Croatian', sr: 'Serbian (Latin script)', ca: 'Catalan', lt: 'Lithuanian', lv: 'Latvian', sl: 'Slovenian', et: 'Estonian', ms: 'Malay', bn: 'Bengali', ta: 'Tamil', te: 'Telugu', mr: 'Marathi', ur: 'Urdu', fa: 'Persian', fil: 'Filipino', zht: 'Traditional Chinese (Taiwan, Hong Kong)' };

export const load = (): NativeArticle[] => {
  if (!fs.existsSync(DIR)) return [];
  return fs.readdirSync(DIR).flatMap((l) => fs.readdirSync(path.join(DIR, l)).filter((f) => f.endsWith('.json')).map((f) => JSON.parse(fs.readFileSync(path.join(DIR, l, f), 'utf8')) as NativeArticle));
};
const tokens = (s: string) => new Set(fold(s).split(/\s+/).filter(Boolean));
/** Same wish? Every word of the shorter search has a matching word (same word, or the same first 5 letters: "berechnung"/"berechnen") in the other. */
const sameWord = (a: string, b: string) => a === b || (a.length >= 5 && b.length >= 5 && a.slice(0, 5) === b.slice(0, 5));
const similar = (a: string, b: string) => { const x = [...tokens(a)], y = [...tokens(b)]; const [s, l] = x.length <= y.length ? [x, y] : [y, x]; return s.every((t) => l.some((u) => sameWord(t, u))) || intentKey(a) === intentKey(b); };

async function ask(model: string, prompt: string): Promise<any> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}` },
    body: JSON.stringify({ model, response_format: { type: 'json_object' }, temperature: 0.7, messages: [{ role: 'user', content: prompt }] }),
  });
  if (!res.ok) throw new Error(`model error ${res.status}`);
  const j: any = await res.json();
  return JSON.parse(String(j?.choices?.[0]?.message?.content || '{}'));
}

const DICT_SLUGS = ASTROLOGY_DICTIONARY_TERMS.map((t) => t.slug).join(', ');
const promptFor = (lang: string, keyword: string) => `You are a native ${LANG_NAME[lang] || lang}-speaking astrology writer for the website Aurenstar. Write ONE original article directly in that language (do NOT translate from English) for people who type this Google search: "${keyword}".

Rules:
- Use the everyday words people in that language really use for these ideas. Use the exact search words "${keyword}" naturally in the title, the intro, at least one heading and a few times in the text.
- Answer what the person wants clearly and quickly in the intro, then go deeper. 5 to 7 sections, 1300 to 1800 words in total, never fewer than 1100 (for Japanese, Chinese and Thai: 3500 to 4500 characters). Short paragraphs, warm and simple, with small concrete examples (invented, never real people).
- The title must say honestly what the article gives (no clickbait, no wrong claims: an ascendant is not a partner, a sign is not a destiny). Every astrology statement must be correct and commonly accepted in astrology.
- Astrology for reflection and fun. Never promise outcomes, never give medical, legal or money advice, never invent studies, statistics, quotes or sources.
- No links, no mention of AI or translation, no English words except proper names.
- Include real small examples (a made-up person, a made-up situation) in at least three sections; do not repeat the same idea in different words.
- "tool": which free tool fits best: "discover-sign" (find your sign / ascendant / chart), "daily-message" (daily horoscope-style message) or "descreva-me" (a personal description). "term": the best matching entry of this astrology dictionary, exactly one of [${DICT_SLUGS}], or "" if none fits.
- "slug": 3 to 7 lowercase English words with hyphens describing the topic (ASCII only). "ui": the five short words for the page in that language: home (Home), tools (Free astrology tools), articles (Articles), faq (Frequently asked questions), more (Keep reading), dictionary (Astrology dictionary).
Return ONLY JSON: {"slug":"","title":"","description":"(110 to 160 characters)","intro":"","sections":[{"h2":"","paragraphs":[""]}],"faq":[{"q":"","a":""}],"tool":"","term":"","ui":{"home":"","tools":"","articles":"","faq":"","more":"","dictionary":""}} with 4 FAQ items.`;

/** A second reader (a different, cheaper model call) rejects articles with a wrong or clickbait title, invented facts, unnatural language or wrong astrology. */
async function review(a: NativeArticle): Promise<string[]> {
  if (DRY) return [];
  try {
    const text = [a.title, a.description, a.intro, ...a.sections.flatMap((s) => [s.h2, ...s.paragraphs]), ...a.faq.flatMap((f) => [f.q, f.a])].join('\n').slice(0, 14000);
    const j = await ask(FALLBACK_MODEL, `You are a strict editor and a native speaker of the language "${a.lang}". Review this astrology article written for the search "${a.keyword}". Reject it ("ok": false) if ANY of these is true: the title or description promises something the text does not give or is clickbait or wrong; it states invented facts, statistics, studies or quotes; it gives medical, legal or money advice or promises outcomes; the astrology is factually wrong; the language is unnatural, machine-like or mixes in another language; it is mostly filler or has no concrete examples. Return ONLY JSON {"ok":boolean,"problems":["max 10 words each"]}.\n\n${text}`);
    return j.ok === false || (Array.isArray(j.problems) && j.problems.length >= 3) ? (j.problems || ['editor rejected']).map(String) : [];
  } catch { return []; }
}

async function write(lang: string, keyword: string, volume: number, taken: Set<string>): Promise<NativeArticle | null> {
  if (DRY) {
    const p = `${keyword} ${'lorem ipsum dolor sit amet '.repeat(30)}`;
    return { lang, keyword, volume, slug: `dry-${fold(keyword).replace(/\W+/g, '-')}`, date: '2026-01-01', title: `${keyword} (dry)`, description: p.slice(0, 120), intro: p, sections: [1, 2, 3, 4].map((i) => ({ h2: `${keyword} ${i}`, paragraphs: [p] })), faq: [1, 2, 3].map((i) => ({ q: `${keyword} question ${i}?`, a: p.slice(0, 60) })), ui: { home: 'Home', tools: 'Tools', articles: 'Articles', faq: 'FAQ', more: 'More' } };
  }
  for (const model of [WRITE_MODEL, WRITE_MODEL, FALLBACK_MODEL]) {
    try {
      const j = await ask(model, promptFor(lang, keyword));
      let slug = String(j.slug || '').toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70);
      if (!slug) slug = fold(keyword).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'article';
      if (taken.has(slug)) slug = `${slug}-${lang}`;
      const a: NativeArticle = { lang, keyword, volume, slug, date: new Date().toISOString().slice(0, 10), title: j.title, description: j.description, intro: j.intro, sections: j.sections, faq: j.faq, ui: j.ui, ...(TOOLS.includes(j.tool) ? { tool: j.tool } : {}), ...(ASTROLOGY_DICTIONARY_TERMS.some((t) => t.slug === j.term) ? { term: j.term } : {}) };
      const bad = checkArticle(a);
      if (!bad.length) { const why = await review(a); if (!why.length) return a; console.log(`  ${lang} "${keyword}" (${model}) editor: ${why.join('; ')}`); continue; }
      console.log(`  ${lang} "${keyword}" (${model}) rejected: ${bad.join('; ')}`);
    } catch (e) { console.log(`  ${lang} "${keyword}" (${model}) failed: ${(e as Error).message}`); }
  }
  return null;
}

async function main() {
  if (WAVE.paused && !arg('langs')) { console.log('native articles: paused in data/native-plan.json'); return; }
  console.log(`native articles: wave "${WAVE.name}", ${LANGS.length} languages open, up to ${PER_LANG} per language, up to ${MAX} today`);
  if (!KEY && !DRY) { console.log('native articles: no OPENAI_API_KEY, nothing to do'); return; }
  const have = load();
  const englishSlugs = new Set(BLOG_ARTICLES.map((a) => getArticleSlug(a)));
  const taken = new Set(['index', ...englishSlugs, ...have.map((a) => a.slug)]);
  const queue = new Map<string, { keyword: string; volume: number }[]>();
  for (const lang of LANGS) {
    const written = have.filter((a) => a.lang === lang);
    const room = PER_LANG - written.length;
    const picks: { keyword: string; volume: number }[] = [];
    for (const t of ((topicsFile as any).topics[lang] || []) as { keyword: string; volume: number }[]) {
      if (picks.length >= room) break;
      if (written.some((w) => similar(w.keyword, t.keyword)) || picks.some((p) => similar(p.keyword, t.keyword))) continue;
      picks.push(t);
    }
    if (picks.length) queue.set(lang, picks);
  }
  let done = 0, tried = 0;
  while (done < MAX && [...queue.values()].some((q) => q.length)) {
    for (const [lang, q] of queue) {          // one per language per round, so every language moves together
      if (done >= MAX) break;
      const t = q.shift();
      if (!t) continue;
      tried++;
      const a = await write(lang, t.keyword, t.volume, taken);
      if (!a) continue;
      taken.add(a.slug);
      if (DRY) { console.log('dry ok:', lang, a.keyword, 'check:', checkArticle(a).join(';') || 'pass'); done++; continue; }
      fs.mkdirSync(path.join(DIR, lang), { recursive: true });
      fs.writeFileSync(path.join(DIR, lang, `${a.slug}.json`), JSON.stringify(a, null, 1) + '\n');
      console.log(`saved ${lang}/${a.slug}  ("${a.keyword}", ${a.volume}/mo)`);
      done++;
    }
  }
  console.log(`native articles: ${done} saved, ${tried - done} rejected or failed, ${have.length + (DRY ? 0 : done)} in total`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) await main();
