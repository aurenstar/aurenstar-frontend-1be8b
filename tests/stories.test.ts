import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderWebStory, checkStory, storyPath, posterPath, coverPath, SIGNS, type WebStory } from '../server/engine/webStory';

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
process.exit(failed ? 1 : 0);
