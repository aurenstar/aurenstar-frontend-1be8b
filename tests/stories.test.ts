import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderWebStory, checkStory, storyPath, posterPath, coverPath, SIGNS, type WebStory } from '../server/engine/webStory';

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
process.exit(failed ? 1 : 0);
