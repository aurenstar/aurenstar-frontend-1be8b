// Builds one Web Story for one sign in one language with an AI writer (the call is passed in, so tests can use a fake one).
import { checkStory, type WebStory, type Theme } from '../../server/engine/webStory';
import { SIGN_FACTS, LANG_NAME, NON_LATIN, type SignFacts } from './signs';

export type Ask = (model: 'write' | 'review', prompt: string) => Promise<any>;
const ENGLISH = new Set('the and of to is are with for that this you your they their can will from when what who has have about'.split(' '));

export const promptFor = (lang: string, s: SignFacts, goes: 'articles' | 'tool') => `You are a native ${LANG_NAME[lang] || lang}-speaking astrology writer for the website Aurenstar. Write ONE Google Web Story (short full-screen tap-through story) about the sign ${s.en}, directly in ${LANG_NAME[lang] || lang}: do not translate from English. Use the name people in that language really use for this sign.

Facts you must use as given (do not invent others): dates ${s.dates} (always say "around", write the month names in that language); element ${s.element}; quality ${s.mode}; ruler ${s.ruler}.

Write exactly 5 screens:
1 the basics (dates, element, quality, ruler), 2 a strength, 3 a thing to watch out for, 4 in love, 5 at work.
Rules:
- Every screen: "kicker" (2-3 words, e.g. "Strength"), "title" (2-5 words), "text" (ONE or TWO short sentences, at most 190 characters).
- Everyday words, warm and clear. Astrology for reflection and fun: no promises, no medical, legal or money advice, no stereotypes that insult anyone. Every astrology statement must be commonly accepted.
- No links, no mention of AI or translation, no English words except proper names.
- "title" of the story: 20 to 60 characters, like "${s.en}: what to know" in that language. "description": 70 to 160 characters.
- "ctaText": 3 to 8 words that invite the reader to go on (the last screen). "ctaLabel": 2 to 4 words for the button, which opens ${goes === 'articles' ? 'the list of Aurenstar articles in this language' : 'a free tool that finds your sign'}. "swipe": 2 to 4 words meaning "Tap to continue". "more": 2 to 3 words meaning "Keep reading" (a heading above links to other stories).
Return ONLY JSON: {"title":"","description":"","swipe":"","more":"","ctaText":"","ctaLabel":"","pages":[{"kicker":"","title":"","text":""}]}`;

const THEMES = (el: SignFacts['element']): Theme[] => [el, el, 'night', el, 'night', el].slice(0, 5) as Theme[];

/** Quality gate for a story written by the model. Returns the problems found (empty = fine). */
export function problemsOf(w: any, lang: string, s: SignFacts): string[] {
  const p: string[] = [];
  const pages = Array.isArray(w?.pages) ? w.pages : [];
  if (pages.length !== 5) return ['needs exactly 5 screens'];
  const all = [w.title, w.description, w.ctaText, w.ctaLabel, w.swipe, ...pages.flatMap((g: any) => [g.kicker, g.title, g.text])].map((x) => String(x || ''));
  if (all.some((x) => !x.trim())) p.push('empty field');
  const letters = all.join(' ').match(/\p{L}/gu) || [];
  const ascii = letters.filter((c) => /[a-zA-Z]/.test(c)).length;
  if (NON_LATIN.has(lang) && letters.length && ascii / letters.length > 0.25) p.push('not in the language script');
  if (!NON_LATIN.has(lang)) {
    const words = all.join(' ').toLowerCase().match(/[a-z]+/g) || [];
    if (words.length && words.filter((x) => ENGLISH.has(x)).length / words.length > 0.08) p.push('looks like English');
  }
  if (/https?:|www\./i.test(all.join(' '))) p.push('has a link');
  if (/\b(AI|IA|KI)\b/.test(all.join(' ')) && lang !== 'pt') p.push('mentions AI');
  return p;
}

export async function buildStory(lang: string, s: SignFacts, goes: 'articles' | 'tool', ask: Ask, today: string): Promise<{ story?: WebStory; why?: string }> {
  for (let attempt = 0; attempt < 2; attempt++) {
    const w = await ask('write', promptFor(lang, s, goes));
    const bad = problemsOf(w, lang, s);
    if (bad.length) { if (attempt) return { why: bad.join(', ') }; continue; }
    const story: WebStory = {
      lang, slug: `${s.en.toLowerCase()}-${lang}`, date: today, title: String(w.title).trim(), description: String(w.description).trim(), theme: s.element, sign: s.key,
      swipe: String(w.swipe).trim(),
      ...(w.more && String(w.more).trim().length <= 30 ? { more: String(w.more).trim() } : {}),
      pages: w.pages.map((g: any, i: number) => ({ theme: THEMES(s.element)[i], kicker: String(g.kicker).trim(), title: String(g.title).trim(), text: String(g.text).trim() })),
      cta: { text: String(w.ctaText).trim(), label: String(w.ctaLabel).trim(), url: goes === 'articles' ? `/${lang}/articles` : `/${lang}/discover-sign` },
    };
    const bad2 = checkStory(story);
    if (bad2.length) { if (attempt) return { why: bad2.join(', ') }; continue; }
    // second reader: a different call that rejects wrong astrology, clickbait or unnatural language
    const r = await ask('review', `You are a strict native ${LANG_NAME[lang] || lang} editor of astrology content. Facts that are correct: ${s.en} is ${s.dates}, ${s.element} element, ${s.mode}, ruled by ${s.ruler}. Read this story JSON and answer ONLY JSON {"ok":true|false,"problems":["..."]}. ok=false if the language is unnatural or machine-translated, a fact about the sign is wrong or insulting, a screen promises outcomes or gives medical/legal/money advice, or the sign is named wrongly for that language.\n${JSON.stringify({ ...story, sign: undefined, slug: undefined, theme: undefined, lang: undefined, date: undefined })}`);
    if (r?.ok === true) return { story };
    if (attempt) return { why: `editor: ${(r?.problems || []).join('; ') || 'rejected'}` };
  }
  return { why: 'not written' };
}
export { SIGN_FACTS };
