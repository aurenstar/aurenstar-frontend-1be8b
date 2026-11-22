import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderWebStory, checkStory, storyPath, posterPath, coverPath, SIGNS, type WebStory } from '../server/engine/webStory';

import { pluginStory, wrapPluginStory } from '../server/engine/storyPlugin';
import { buildArticleStory, promptForArticle } from '../scripts/stories/buildFromArticle';
import { buildStory, problemsOf } from '../scripts/stories/build';
import { SIGN_FACTS } from '../scripts/stories/signs';

let failed = 0;
const ok = (name: string, cond: boolean) => { if (!cond) { failed++; console.log('FAIL', name); } else console.log('ok  ', name); };

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..', 'data', 'stories');
const all: WebStory[] = fs.readdirSync(root).flatMap((l) => fs.readdirSync(path.join(root, l)).filter((f) => f.endsWith('.json')).map((f) => JSON.parse(fs.readFileSync(path.join(root, l, f), 'utf8'))));
const SITE = 'https://aurenstar.com';

ok('stories: the pilot stories exist (pt and en)', all.length >= 6 && all.some((s) => s.lang === 'pt') && all.some((s) => s.lang === 'en'));
for (const s of all) {
  const bad = checkStory(s);
  ok(`story ${s.lang}/${s.slug}: passes the checks`, bad.length === 0);
  const html = renderWebStory(s, SITE);
  ok(`story ${s.lang}/${s.slug}: is an AMP story page`, /<html amp /.test(html) && html.includes('amp-story-1.0.js') && html.includes('<amp-story standalone'));
  ok(`story ${s.lang}/${s.slug}: self canonical`, html.includes(`<link rel="canonical" href="${SITE}${storyPath(s)}">`));
  ok(`story ${s.lang}/${s.slug}: poster, logo and publisher set`, html.includes(`poster-portrait-src="${SITE}${posterPath(s)}"`) && html.includes('publisher-logo-src=') && html.includes('publisher="Aurenstar"'));
  ok(`story ${s.lang}/${s.slug}: poster image file exists`, fs.existsSync(path.join(__dirname, '..', 'public', posterPath(s))));
  ok(`story ${s.lang}/${s.slug}: last page links to the tool`, html.includes('<amp-story-page-outlink') && html.includes(`href="${SITE}${s.cta.url}"`));
  ok(`story ${s.lang}/${s.slug}: no script besides the AMP ones and JSON-LD`, (html.match(/<script(?![^>]*(ampproject|ld\+json))/g) || []).length === 0);
}
ok('stories: the 12 signs each have a story in pt and en', SIGNS.every((k) => ['pt', 'en'].every((l) => all.some((s) => s.lang === l && s.sign === k))));
for (const s of all.filter((x) => x.sign)) ok(`story ${s.lang}/${s.slug}: cover with the sign symbol exists and is used`, fs.existsSync(path.join(__dirname, '..', 'public', coverPath(s.sign as string))) && renderWebStory(s, SITE).includes(coverPath(s.sign as string)));
ok('stories: slugs are unique per language', new Set(all.map((s) => `${s.lang}/${s.slug}`)).size === all.length);
ok('check: too few pages is rejected', checkStory({ ...all[0], pages: all[0].pages.slice(0, 2) }).length > 0);
ok('check: a long page text is rejected', checkStory({ ...all[0], pages: all[0].pages.map((p) => ({ ...p, text: 'x'.repeat(300) })) }).length > 0);
ok('render: text is escaped', !renderWebStory({ ...all[0], title: 'A <b>"quoted"</b> story title' }, SITE).includes('<b>'));

// Stories written by the robot in other languages (the AI call is replaced by a fake one here)
const widder = SIGN_FACTS[0];
const page = (i: number) => ({ kicker: `Stärke ${i}`, title: `Mut und Antrieb ${i}`, text: 'Der Widder packt Dinge an, ohne lange zu zögern, und reißt andere mit sich.' });
const good = () => ({ title: 'Widder: das solltest du wissen', description: 'Das Wichtigste über das Sternzeichen Widder in wenigen Bildschirmen: Stärken, Schwächen, Liebe und Beruf.', swipe: 'Weiter tippen', ctaText: 'Mehr über den Widder lesen', ctaLabel: 'Artikel ansehen', pages: [1, 2, 3, 4, 5].map(page) });
const fake = (w: any, review: any = { ok: true }) => async (kind: 'write' | 'review') => (kind === 'write' ? w : review);
const built = await buildStory('de', widder, 'articles', fake(good()), '2026-11-17');
ok('robot story: a good German story is accepted', !!built.story && built.story.sign === 'aries' && built.story.lang === 'de' && checkStory(built.story as WebStory).length === 0);
ok('robot story: button goes to the language article list when it has articles', built.story?.cta.url === '/de/articles');
ok('robot story: button goes to the tool when the language has no articles yet', (await buildStory('de', widder, 'tool', fake(good()), '2026-11-17')).story?.cta.url === '/de/discover-sign');
ok('robot story: poster is the language-neutral one of the sign', !!built.story && posterPath(built.story) === '/stories/img/poster-sign-aries.webp' && fs.existsSync(path.join(__dirname, '..', 'public', posterPath(built.story))));
ok('robot story: 4 screens are rejected', !(await buildStory('de', widder, 'articles', fake({ ...good(), pages: [1, 2, 3, 4].map(page) }), '2026-11-17')).story);
ok('robot story: English text for German is rejected', problemsOf({ ...good(), pages: [1, 2, 3, 4, 5].map(() => ({ kicker: 'Strength', title: 'Courage and drive', text: 'The sign is the one that will start things with the people that you know and that you can trust.' })) }, 'de', widder).length > 0);
ok('robot story: Latin letters for Arabic are rejected', problemsOf(good(), 'ar', widder).length > 0);
ok('robot story: a link is rejected', problemsOf({ ...good(), description: 'Mehr auf https://example.com bei Widder und seinen Eigenschaften im Überblick hier' }, 'de', widder).length > 0);
ok('robot story: the editor can reject', !(await buildStory('de', widder, 'articles', fake(good(), { ok: false, problems: ['wrong fact'] }), '2026-11-17')).story);
ok('robot story: Arabic page is right to left', renderWebStory({ ...(built.story as WebStory), lang: 'ar' }, SITE).includes('dir="rtl"'));
// WordPress plugin: our story -> plugin data -> page at /blog/stories
{
  const s = all.find((x) => x.slug === 'escorpiao-personalidade-em-5-telas') as WebStory;
  const rel = all.filter((x) => x.lang === s.lang && x.slug !== s.slug).slice(0, 3).map((o) => ({ title: o.title, url: `/blog/stories/${o.slug}`, sign: o.sign, theme: o.theme }));
  const pl = pluginStory(s, SITE, rel, 'Continue lendo');
  ok('plugin story: one plugin page per screen (cover + pages + last)', pl.story_data.pages.length === s.pages.length + 2);
  ok('plugin story: data version and elements are set', pl.story_data.version === 47 && pl.story_data.pages.every((p: any) => p.elements.length >= 4));
  ok('plugin story: last page has the article button', pl.story_data.pages[pl.story_data.pages.length - 1].pageAttachment?.url.startsWith(SITE) === true && pl.content.includes('<amp-story-page-outlink'));
  ok('plugin story: keep-reading cards point to /blog/stories', rel.length === 3 && rel.every((r) => pl.content.includes(`${SITE}${r.url}`)));
  const page = wrapPluginStory({ slug: s.slug, lang: 'pt-BR', title: s.title, description: s.description, modified: '2026-11-17', content: pl.content }, SITE);
  ok('wp story page: AMP story with canonical on /blog/stories', /<html amp /.test(page) && page.includes(`<link rel="canonical" href="${SITE}/blog/stories/${s.slug}">`) && page.includes('<amp-story standalone'));
  ok('wp story page: no inline style attributes and no scripts from content', !/\sstyle="/.test(page.split('</head>')[1]) && !/<script/i.test(page.split('</head>')[1].replace(/<amp-analytics[\s\S]*?<\/amp-analytics>/g, '')));
  ok('wp story page: Google Analytics reports views, swipes, finishing and the click to the article', page.includes('<amp-analytics type="gtag"') && ['story-page-visible', 'story-last-page-visible', 'story-click-through'].every((t) => page.includes(t)));
  ok('wp story page: poster and publisher kept', page.includes('poster-portrait-src=') && page.includes('publisher="Aurenstar"'));
}
// stories made from existing articles (to bring readers to the article)
{
  const art = { lang: 'de', slug: 'sternzeichen-loewe-test-de', title: 'Sternzeichen Löwe: Eigenschaften und Tipps', summary: 'Alles über das Sternzeichen Löwe, seine Stärken und Schwächen im Alltag.', text: 'Löwe ist stolz und großzügig. '.repeat(30), url: '/de/blog/sternzeichen-loewe-test' };
  const pageW = (i: number) => ({ kicker: 'Überraschung', title: `Deine Stärke Nummer ${i}`, text: 'Löwe zeigt Wärme und Mut, wenn es darauf ankommt, und die Menschen um ihn herum spüren das sofort und gern.' });
  const goodW = () => ({ title: 'Warum Löwe nie leise bleibt', description: 'Ein kurzer Blick auf das, was Löwe im Alltag antreibt und warum andere ihn so schnell mögen und bewundern.', swipe: 'Tippen zum Weiterlesen', ctaText: 'Willst du den Rest wissen?', ctaLabel: 'Ganzen Artikel lesen', pages: [1, 2, 3, 4, 5].map(pageW) });
  const fakeAsk = (w: any, rv: any = { ok: true }) => async (k: 'write' | 'review') => (k === 'write' ? w : rv);
  const r = await buildArticleStory(art, fakeAsk(goodW()), '2026-11-17');
  ok('article story: built, links to the article and is marked as article', !!r.story && r.story.cta.url === '/de/blog/sternzeichen-loewe-test' && r.story.kind === 'article' && r.story.pages.length === 5);
  ok('article story: poster is the sky picture of its theme and exists', !!r.story && posterPath(r.story) === `/stories/img/bg-${r.story.theme}.webp` && fs.existsSync(path.join(__dirname, '..', 'public', posterPath(r.story))));
  ok('article story: passes the story checks and renders as AMP', !!r.story && checkStory(r.story).length === 0 && /<html amp /.test(renderWebStory(r.story, SITE)));
  ok('article story: the editor can reject', !(await buildArticleStory(art, fakeAsk(goodW(), { ok: false, problems: ['not in article'] }), '2026-11-17')).story);
  ok('article story: 4 screens are rejected', !(await buildArticleStory(art, fakeAsk({ ...goodW(), pages: [1, 2, 3, 4].map(pageW) }), '2026-11-17')).story);
  ok('article story: the prompt carries the article and the click goal', promptForArticle(art).includes('Sternzeichen Löwe') && promptForArticle(art).includes('HOOK') && promptForArticle(art).includes('German'));
}
process.exit(failed ? 1 : 0);
// stories tied to dates (data/story-seasonal.json)
{
  const plan = JSON.parse(fs.readFileSync(path.join(root, '..', 'story-seasonal.json'), 'utf8'));
  const wpList = (await import('../src/data/wordpressArticles.generated.json')).default as any[];
  ok('seasonal plan: every event has date, showFrom before date, text for every language and an existing article', plan.events.length > 0 && plan.events.every((e: any) => /^\d{4}-\d{2}-\d{2}$/.test(e.date) && e.showFrom < e.date && e.facts.length > 60 && plan.langs.every((l: string) => e.when[l]) && wpList.some((a) => a.id === e.article)));
}
