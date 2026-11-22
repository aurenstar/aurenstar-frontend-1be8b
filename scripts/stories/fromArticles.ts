/**
 * Writes one Web Story for each EXISTING article (blog articles and the native articles), to bring readers to the article.
 *   npx tsx scripts/stories/fromArticles.ts --max 40 [--only wp|native] [--langs pt,en] [--dry]
 * Needs OPENAI_API_KEY. The most it may spend in one run is STORY_CAP_USD (default 0.30). Saves data/stories/<lang>/<slug>.json
 * only when every check passes (see buildFromArticle.ts). Articles that already have a story are skipped, so it only does new work.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import wp from '../../src/data/wordpressArticles.generated.json';
import { getArticleSlug } from '../../src/utils/articleSlug';
import { buildArticleStory, type ArticleSource } from './buildFromArticle';
import type { Ask } from './build';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const arg = (n: string) => { const i = process.argv.indexOf(`--${n}`); return i < 0 ? undefined : process.argv[i + 1]; };
const DRY = process.argv.includes('--dry');
const KEY = process.env.OPENAI_API_KEY;
const MAX = Math.max(0, Number(arg('max') ?? 40));
const ONLY = arg('only');
const LANGS = arg('langs')?.split(',').map((s) => s.trim());
const WP_LANGS = ['en', 'pt', 'es'];
const CAP = Number(process.env.STORY_CAP_USD || 0.3);
// the small model is enough for short hooks and costs about a fifth of the big one
const MODELS = { write: process.env.STORY_WRITE_MODEL || 'gpt-4.1-mini', review: process.env.OPENAI_MODEL || 'gpt-4.1-mini' };
const PRICE: Record<string, [number, number]> = { 'gpt-4.1': [2, 8], 'gpt-4.1-mini': [0.4, 1.6] };
const today = process.env.STORY_TODAY || new Date().toISOString().slice(0, 10);
let spent = 0;

const ask: Ask = async (kind, prompt) => {
  const model = MODELS[kind];
  const res = await fetch('https://api.openai.com/v1/chat/completions', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}` }, body: JSON.stringify({ model, response_format: { type: 'json_object' }, temperature: kind === 'write' ? 0.8 : 0, messages: [{ role: 'user', content: prompt }] }) });
  if (!res.ok) throw new Error(`model error ${res.status}`);
  const j: any = await res.json();
  const [pi, po] = PRICE[model] || [2, 8];
  spent += ((j?.usage?.prompt_tokens || 0) * pi + (j?.usage?.completion_tokens || 0) * po) / 1e6;
  return JSON.parse(String(j?.choices?.[0]?.message?.content || '{}'));
};

const sources: ArticleSource[] = [];
if (ONLY !== 'native') {
  for (const a of wp as any[]) {
    for (const lang of WP_LANGS) {
      const t = (v: any) => String(v?.[lang] ?? v?.en ?? '');
      const slug = getArticleSlug(a);
      sources.push({ lang, slug: `${slug}-${lang}`, title: t(a.title), summary: t(a.subtitle), text: (a.sections || []).map((s: any) => `${t(s.heading)}. ${(s.paragraphs || []).map(t).join(' ')}`).join('\n'), url: `${lang === 'en' ? '' : `/${lang}`}/blog/${slug}` });
    }
  }
}
if (ONLY !== 'wp') {
  const dir = path.join(root, 'data/native-articles');
  if (fs.existsSync(dir)) for (const l of fs.readdirSync(dir)) for (const f of fs.readdirSync(path.join(dir, l)).filter((x) => x.endsWith('.json'))) {
    const n = JSON.parse(fs.readFileSync(path.join(dir, l, f), 'utf8'));
    if (n.kind === 'term' || n.retired) continue;
    sources.push({ lang: n.lang, slug: `${n.slug}`, title: n.title, summary: n.description, text: `${n.intro}\n${(n.sections || []).map((s: any) => `${s.h2}. ${(s.paragraphs || []).join(' ')}`).join('\n')}`, url: `/${n.lang}/blog/${n.slug}` });
  }
}

// Stories tied to a date (data/story-seasonal.json): written from "showFrom" on, ahead of the other work, and they send the reader to a related article.
const seasonal: ArticleSource[] = [];
{
  const file = path.join(root, 'data/story-seasonal.json');
  if (ONLY !== 'wp' && ONLY !== 'native' && fs.existsSync(file)) {
    const plan = JSON.parse(fs.readFileSync(file, 'utf8'));
    for (const ev of plan.events as any[]) {
      if (ev.showFrom > today) continue;
      const a = (wp as any[]).find((x) => x.id === ev.article);
      if (!a) continue;
      for (const lang of plan.langs as string[]) {
        const t = (v: any) => String(v?.[lang] ?? v?.en ?? '');
        const slug = getArticleSlug(a);
        const body = (a.sections || []).slice(0, 3).map((s: any) => `${t(s.heading)}. ${(s.paragraphs || []).map(t).join(' ')}`).join('\n');
        seasonal.push({ lang, slug: `${ev.id}-${lang}`, title: t(a.title), summary: t(a.subtitle), text: `WHAT IS HAPPENING (${ev.when[lang] || ev.when.en}): ${ev.facts}\n\nTHE ARTICLE THE READER WILL OPEN (it is about the sign, not about the date; the story may use the date as the hook and then promise what the article really gives): ${t(a.title)}. ${body}`, url: `${lang === 'en' ? '' : `/${lang}`}/blog/${slug}` });
      }
    }
  }
}
sources.unshift(...seasonal);

const todo = sources.filter((s) => (!LANGS || LANGS.includes(s.lang)) && s.text.length > 200 && !fs.existsSync(path.join(root, 'data/stories', s.lang, `${s.slug}.json`)));
console.log(`articles without a story: ${todo.length}${DRY ? ' (dry run)' : ''}`);
let made = 0;
for (const a of todo) {
  if (made >= MAX) break;
  if (spent >= CAP) { console.log(`stories: limit of US$${CAP} reached, stopping`); break; }
  if (DRY) { console.log(`would write ${a.lang}/${a.slug}`); made++; continue; }
  if (!KEY) { console.log('stories: no OPENAI_API_KEY, nothing to do'); break; }
  try {
    const r = await buildArticleStory(a, ask, today);
    if (!r.story) { console.log(`rejected ${a.lang}/${a.slug} (${r.why})`); continue; }
    const file = path.join(root, 'data/stories', a.lang, `${a.slug}.json`);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(r.story, null, 2) + '\n');
    console.log(`wrote ${a.lang}/${a.slug}`); made++;
  } catch (e: any) { console.log(`failed ${a.lang}/${a.slug} (${e.message})`); }
}
console.log(`stories from articles: ${made} written, about US$${spent.toFixed(4)} spent`);
