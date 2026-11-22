/**
 * Brings the stories PUBLISHED in the WordPress "Web Stories" plugin into the site.
 *   npx tsx scripts/stories/syncWpStories.ts [--dry]
 * Writes data/wp-stories/<slug>.json; the site build (scripts/prerender.ts) turns each one into aurenstar.com/blog/stories/<slug>.
 * Drafts are never copied. A story unpublished in WordPress disappears from the site at the next sync.
 * Needs WP_APP_PASSWORD (+ optional WP_USER, WP_URL) to read the stored page markup.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const WP = (process.env.WP_URL || 'https://blog.aurenstar.com').replace(/\/$/, '');
const PASS = (process.env.WP_APP_PASSWORD || '').trim();
const USER = process.env.WP_USER || 'oficialsafare';
const OUT = path.join(root, 'data/wp-stories');
const dry = process.argv.includes('--dry');
if (!PASS) { console.error('WP_APP_PASSWORD is empty.'); process.exit(1); }

const langOf = new Map<string, string>();
const sd = path.join(root, 'data/stories');
for (const l of fs.readdirSync(sd)) for (const f of fs.readdirSync(path.join(sd, l)).filter((x) => x.endsWith('.json'))) langOf.set(f.replace(/\.json$/, ''), l);

const headers = { Authorization: 'Basic ' + Buffer.from(`${USER}:${PASS}`).toString('base64') };
const list: any[] = [];
// WordPress gives at most 100 per page: ask page after page until it runs out
for (let page = 1; page <= 20; page++) {
  const res = await fetch(`${WP}/wp-json/web-stories/v1/web-story?status=publish&per_page=100&page=${page}&context=edit&_fields=slug,title,excerpt,content,modified_gmt`, { headers });
  if (res.status === 400 && page > 1) break; // page past the end
  if (!res.ok) { console.error(`WordPress answered ${res.status}. Nothing changed.`); process.exit(1); }
  const part = (await res.json()) as any[];
  list.push(...part);
  if (part.length < 100) break;
}
const strip = (s: string) => String(s || '').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
fs.mkdirSync(OUT, { recursive: true });
const keep = new Set<string>();
let written = 0;
for (const p of list) {
  const content = String(p.content?.raw ?? '');
  if (!p.slug || !content.includes('<amp-story')) { console.warn(`skip ${p.slug}: no story markup`); continue; }
  keep.add(`${p.slug}.json`);
  const w = { slug: p.slug, lang: langOf.get(p.slug) || 'en', title: strip(p.title?.raw ?? p.title?.rendered), description: strip(p.excerpt?.raw ?? p.excerpt?.rendered), modified: String(p.modified_gmt || '').slice(0, 10) || new Date().toISOString().slice(0, 10), content };
  const file = path.join(OUT, `${p.slug}.json`);
  const next = JSON.stringify(w, null, 1) + '\n';
  if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== next) { if (!dry) fs.writeFileSync(file, next); written++; }
}
let removed = 0;
for (const f of fs.readdirSync(OUT).filter((x) => x.endsWith('.json'))) if (!keep.has(f)) { if (!dry) fs.rmSync(path.join(OUT, f)); removed++; }
console.log(`published in WordPress: ${list.length}; written/changed: ${written}; removed: ${removed}${dry ? ' (dry run)' : ''}`);
