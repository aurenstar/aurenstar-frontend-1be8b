// Builds one Web Story from one EXISTING article, written to make people want to open that article (the story is the trailer, the article the film).
// The AI call is passed in so tests can use a fake one. Facts come only from the article text handed over, nothing is invented.
import { checkStory, type Theme, type WebStory } from '../../server/engine/webStory';
import { LANG_NAME, SIGN_FACTS } from './signs';
import { problemsOf, type Ask } from './build';

export interface ArticleSource { lang: string; slug: string; title: string; summary: string; text: string; url: string }
const THEMES: Theme[] = ['fire', 'water', 'air', 'earth'];
const pageThemes = (el: Theme): Theme[] => [el, el, 'night', el, 'night'];
const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

export const promptForArticle = (a: ArticleSource) => `You are a native ${LANG_NAME[a.lang] || a.lang}-speaking social editor for the astrology website Aurenstar. Write ONE Google Web Story (full-screen, tap-through) in ${LANG_NAME[a.lang] || a.lang} whose ONLY job is to make the reader want to open the full article. Write directly in ${LANG_NAME[a.lang] || a.lang}, do not translate word for word.

THE ARTICLE (the only source of facts; never invent):
Title: ${a.title}
Summary: ${a.summary}
Text: ${a.text.slice(0, 2600)}

How to get the most clicks, honestly:
- Screen 1 is the HOOK: a specific, surprising or personal idea from the article that opens a question in the reader's head (not a vague title).
- Screens 2, 3 and 4: one concrete, specific insight each, from the article, a small reveal the reader wants to read on. Speak to "you". Each ends with a little curiosity.
- Screen 5: the most interesting point, only half told: say what the reader will find in the full article, and why it matters to them.
- Never promise what the article does not deliver. No medical, legal or money advice. No links, no mention of AI. Everyday words, short.
Fields: every screen has "kicker" (1-3 words, a tag like "Surprise" or "Reason 2"), "title" (2-6 words), "text" (ONE or TWO short sentences, at most 190 characters).
Story "title": the hook, 30 to 62 characters. "description": 70 to 160 characters. "ctaText": a question or promise of 3 to 8 words. "ctaLabel": 2 to 4 words like "Read the full article". "swipe": 2 to 4 words meaning "Tap to continue".
Return ONLY JSON: {"title":"","description":"","swipe":"","ctaText":"","ctaLabel":"","pages":[{"kicker":"","title":"","text":""}]}`;

export async function buildArticleStory(a: ArticleSource, ask: Ask, today: string): Promise<{ story?: WebStory; why?: string }> {
  const dummy = SIGN_FACTS[0];
  for (let attempt = 0; attempt < 2; attempt++) {
    const w = await ask('write', promptForArticle(a));
    const bad = problemsOf(w, a.lang, dummy);
    if (bad.length) { if (attempt) return { why: bad.join(', ') }; continue; }
    const el = THEMES[hash(a.slug) % THEMES.length];
    const story: WebStory = {
      lang: a.lang, slug: a.slug, date: today, title: String(w.title).trim(), description: String(w.description).trim(), theme: el, kind: 'article', swipe: String(w.swipe).trim(),
      pages: w.pages.map((g: any, i: number) => ({ theme: pageThemes(el)[i], kicker: String(g.kicker).trim(), title: String(g.title).trim(), text: String(g.text).trim() })),
      cta: { text: String(w.ctaText).trim(), label: String(w.ctaLabel).trim(), url: a.url },
    };
    const bad2 = checkStory(story);
    if (bad2.length) { if (attempt) return { why: bad2.join(', ') }; continue; }
    const r = await ask('review', `You are a strict native ${LANG_NAME[a.lang] || a.lang} editor. Compare this Web Story with its source article and answer ONLY JSON {"ok":true|false,"problems":["..."]}. ok=false if the wording is unnatural or machine-translated, if any statement is NOT supported by the article, if it promises something the article does not give, if it is insulting, or if it gives medical/legal/money advice.\nARTICLE: ${a.title}. ${a.text.slice(0, 2000)}\nSTORY: ${JSON.stringify({ title: story.title, description: story.description, cta: story.cta.text, pages: story.pages.map((g) => ({ kicker: g.kicker, title: g.title, text: g.text })) })}`);
    if (r?.ok === true) return { story };
    if (attempt) return { why: `editor: ${(r?.problems || []).join('; ') || 'rejected'}` };
  }
  return { why: 'no result' };
}
