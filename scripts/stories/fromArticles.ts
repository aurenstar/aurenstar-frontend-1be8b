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
import { buildArticleStory, promptForArticle, type ArticleSource } from './buildFromArticle';
import type { Ask } from './build';
import { readBatch, submitBatch } from './batch';

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

// BATCH mode (STORY_BATCH=1, used by the daily robot): today's writing requests are sent as one OpenAI batch (about half price, answers within 24h),
// and the answers of the previous day's batch are turned into stories. REVIEW: only 1 story in STORY_REVIEW_EVERY (default 3) gets the second AI read,
// except the date stories (facts must be right) and any story whose first try was rejected.
const BATCH = process.env.STORY_BATCH === '1';
const REVIEW_EVERY = Math.max(1, Number(process.env.STORY_REVIEW_EVERY || 3));
const statePath = path.join(root, 'data/story-batch.json');
const hash = (x: string) => [...x].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
const cost = (model: string, pt: number, ot: number, share = 1) => { const [pi, po] = PRICE[model] || [2, 8]; return ((pt * pi + ot * po) / 1e6) * share; };

const callModel = async (kind: 'write' | 'review', prompt: string): Promise<any> => {
  const model = MODELS[kind];
  const res = await fetch(`${process.env.OPENAI_BASE || 'https://api.openai.com/v1'}/chat/completions`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}` }, body: JSON.stringify({ model, response_format: { type: 'json_object' }, temperature: kind === 'write' ? 0.8 : 0, messages: [{ role: 'user', content: prompt }] }) });
  if (!res.ok) throw new Error(`model error ${res.status}`);
  const j: any = await res.json();
  spent += cost(model, j?.usage?.prompt_tokens || 0, j?.usage?.completion_tokens || 0);
  return JSON.parse(String(j?.choices?.[0]?.message?.content || '{}'));
};
const seasonalSlugs = new Set<string>();
function askFor(a: ArticleSource, firstWrite?: any): Ask {
  let writes = 0;
  return async (kind, prompt) => {
    if (kind === 'write') { writes++; return writes === 1 && firstWrite ? firstWrite : callModel('write', prompt); }
    if (!seasonalSlugs.has(a.slug) && writes < 2 && hash(a.slug) % REVIEW_EVERY !== 0) return { ok: true, problems: [] };
    return callModel('review', prompt);
  };
}

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
for (const x of seasonal) seasonalSlugs.add(x.slug);

const hasStory = (x: ArticleSource) => fs.existsSync(path.join(root, 'data/stories', x.lang, `${x.slug}.json`));
const pending = () => sources.filter((x) => (!LANGS || LANGS.includes(x.lang)) && x.text.length > 200 && !hasStory(x));
console.log(`articles without a story: ${pending().length}${DRY ? ' (dry run)' : ''}${BATCH ? ' [batch mode]' : ''}`);
let made = 0;

async function makeOne(a: ArticleSource, firstWrite?: any) {
  try {
    const r = await buildArticleStory(a, askFor(a, firstWrite), today);
    if (!r.story) { console.log(`rejected ${a.lang}/${a.slug} (${r.why})`); return; }
    const file = path.join(root, 'data/stories', a.lang, `${a.slug}.json`);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(r.story, null, 2) + '\n');
    console.log(`wrote ${a.lang}/${a.slug}`); made++;
  } catch (e: any) { console.log(`failed ${a.lang}/${a.slug} (${e.message})`); }
}

if (DRY) {
  for (const a of pending().slice(0, MAX)) { console.log(`would write ${a.lang}/${a.slug}`); made++; }
} else if (!KEY) {
  console.log('stories: no OPENAI_API_KEY, nothing to do');
} else if (BATCH) {
  // 1) yesterday's batch: turn the answers into stories
  if (fs.existsSync(statePath)) {
    const st = JSON.parse(fs.readFileSync(statePath, 'utf8')) as { id: string; items: ArticleSource[] };
    const r = await readBatch(KEY, st.id);
    if (r.state === 'waiting') { console.log(`stories: batch ${st.id} is still running, will look again tomorrow`); process.exit(0); }
    for (const a of st.items) {
      if (hasStory(a)) continue;
      if (spent >= CAP) { console.log(`stories: limit of US$${CAP} reached, stopping`); break; }
      const ans = r.answers.get(a.slug);
      if (ans) spent += cost(MODELS.write, ans.promptTokens, ans.outputTokens, 0.5);
      await makeOne(a, ans?.json);
    }
    fs.rmSync(statePath);
    console.log(`stories: batch ${st.id} ${r.state === 'done' ? 'collected' : 'was lost (it will be asked again)'}`);
  }
  // 2) today's batch: ask for the next stories (about US$0.003 each at batch price, counted against the cap)
  const queue = pending().slice(0, Math.max(0, Math.min(MAX, Math.floor((CAP - spent) / 0.003))));
  if (queue.length) {
    const id = await submitBatch(KEY, MODELS.write, queue.map((a) => ({ id: a.slug, prompt: promptForArticle(a) })), 0.8);
    fs.writeFileSync(statePath, JSON.stringify({ id, createdAt: today, items: queue }, null, 1) + '\n');
    console.log(`stories: sent batch ${id} with ${queue.length} stories to write`);
  }
} else {
  for (const a of pending()) {
    if (made >= MAX) break;
    if (spent >= CAP) { console.log(`stories: limit of US$${CAP} reached, stopping`); break; }
    await makeOne(a);
  }
}
console.log(`stories from articles: ${made} written, about US$${spent.toFixed(4)} spent`);
