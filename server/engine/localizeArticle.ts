/**
 * Cultural localization of a blog article for a country (not a word-for-word translation).
 * - The original stays untouched; the country version is created once, saved in the database, and reused.
 * - Source text: the Portuguese article for Portuguese-speaking countries, the Spanish one for Spanish-speaking
 *   countries, English for everyone else. Output is the same structure as the original, in the visitor's language.
 */
import { BLOG_ARTICLES, type BlogArticleContent } from '../../src/data/blogArticles';
import { countryName, languageName } from './countries';

export interface LocalizedArticle {
  category: string;
  title: string;
  subtitle: string;
  quote: string;
  imageCaption: string;
  sections: { heading: string; paragraphs: string[] }[];
  keyTakeaways: string[];
}

export interface LocalizeEnv {
  OPENAI_API_KEY?: string;
  OPENAI_MODEL?: string;
}

const MAX_BATCH_CHARS = 5000;

export function pickSource(article: BlogArticleContent, language: string): 'pt' | 'es' | 'en' {
  return language === 'pt' ? 'pt' : language === 'es' ? 'es' : 'en';
}

/** Flattens the article into a list of strings (and remembers how to put it back together). */
export function flatten(article: BlogArticleContent, src: 'pt' | 'es' | 'en') {
  const texts: string[] = [];
  const add = (s: string | undefined) => texts.push(String(s ?? ''));
  add(article.category[src]);
  add(article.title[src]);
  add(article.subtitle[src]);
  add(article.quote?.[src]);
  add(article.imageCaption?.[src]);
  const shape = article.sections.map((s) => ({ p: s.paragraphs.length }));
  article.sections.forEach((s) => {
    add(s.heading[src]);
    s.paragraphs.forEach((p) => add(p[src]));
  });
  const takeaways = article.keyTakeaways?.[src] || [];
  takeaways.forEach((t) => add(t));
  return { texts, shape, takeawayCount: takeaways.length };
}

export function rebuild(out: string[], shape: { p: number }[], takeawayCount: number): LocalizedArticle {
  let i = 0;
  const next = () => out[i++] ?? '';
  const category = next(), title = next(), subtitle = next(), quote = next(), imageCaption = next();
  const sections = shape.map((s) => {
    const heading = next();
    const paragraphs = Array.from({ length: s.p }, () => next());
    return { heading, paragraphs };
  });
  const keyTakeaways = Array.from({ length: takeawayCount }, () => next());
  return { category, title, subtitle, quote, imageCaption, sections, keyTakeaways };
}

function batches(texts: string[]): number[][] {
  const groups: number[][] = [];
  let cur: number[] = [];
  let size = 0;
  texts.forEach((t, idx) => {
    if (cur.length && size + t.length > MAX_BATCH_CHARS) {
      groups.push(cur);
      cur = [];
      size = 0;
    }
    cur.push(idx);
    size += t.length;
  });
  if (cur.length) groups.push(cur);
  return groups;
}

export function buildPrompt(country: string, language: string, src: string, texts: string[]): string {
  const countryEn = countryName(country);
  const languageEn = languageName(language);
  const sameLanguage = language === src;
  return `You are the cultural localization editor of Aurenstar, a warm, simple and uplifting astrology website.
Adapt the JSON array of strings below for readers in ${countryEn}, written in ${languageEn}.

THIS IS CULTURAL LOCALIZATION, NOT A LITERAL TRANSLATION:
- Replace references that feel foreign to a reader in ${countryEn} (brands, shops, apps, foods and drinks, transport, sports, holidays, seasons, school or work routines, currency, measurement units) with natural, familiar local equivalents. Examples: in Brazil "Starbucks" becomes a food-delivery app or a local coffee break; in India a coffee becomes "chai" and "Uber" becomes an auto-rickshaw or tuk-tuk; Fahrenheit and miles become Celsius and kilometres where that is the local habit.
- Keep the astrological meaning, the warm and casual tone, simple everyday words, and the length of each string.
- Do not invent facts, add advice, remove ideas, or merge or split strings. Return exactly ${texts.length} strings in the same order. Empty strings stay empty.
- Keep every HTML tag, HTML entity, emoji and line break exactly as in the source.
- Keep the brand names Aurenstar, Aurendaily and Aureneffect unchanged. Write zodiac sign names the usual way in ${languageEn}.
- Never mention translation, localization or artificial intelligence.
${sameLanguage ? `- The source is already in ${languageEn}: change ONLY the foreign cultural references and keep every other word exactly as written.\n` : ''}
Return ONLY valid JSON: {"texts": [ ...${texts.length} strings... ]}

${JSON.stringify(texts)}`;
}

async function callModel(env: LocalizeEnv, prompt: string, expected: number, signal: AbortSignal): Promise<string[] | null> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.OPENAI_API_KEY}` },
    signal,
    body: JSON.stringify({
      model: env.OPENAI_MODEL || 'gpt-6.1-terra',
      response_format: { type: 'json_object' },
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) return null;
  const json: any = await res.json();
  const parsed = JSON.parse(String(json?.choices?.[0]?.message?.content || '{}').replace(/^```json\s*|```$/g, ''));
  const out = Array.isArray(parsed?.texts) ? parsed.texts.map((t: unknown) => String(t ?? '')) : [];
  return out.length === expected ? out : null;
}

/** Returns the localized article, or null when anything fails (the page then keeps the original). */
export async function localizeArticle(
  env: LocalizeEnv,
  articleId: string,
  country: string,
  language: string,
): Promise<LocalizedArticle | null> {
  const article = BLOG_ARTICLES.find((a) => a.id === articleId);
  if (!article || !env.OPENAI_API_KEY) return null;
  const src = pickSource(article, language);
  const { texts, shape, takeawayCount } = flatten(article, src);
  const groups = batches(texts);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 55000);
  try {
    const parts = await Promise.all(
      groups.map((idxs) => callModel(env, buildPrompt(country, language, src, idxs.map((i) => texts[i])), idxs.length, controller.signal)),
    );
    if (parts.some((p) => !p)) return null;
    const out = new Array<string>(texts.length).fill('');
    groups.forEach((idxs, g) => idxs.forEach((idx, k) => (out[idx] = (parts[g] as string[])[k])));
    // A title or a paragraph that came back empty means a broken answer: do not keep it.
    if (!out[1] || out.slice(5).some((t, k) => !t && texts[5 + k])) return null;
    return rebuild(out, shape, takeawayCount);
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
