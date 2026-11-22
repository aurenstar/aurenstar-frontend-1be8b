/**
 * Creates (or updates) our stories inside the WordPress "Web Stories" plugin.
 *   npx tsx scripts/stories/pushToWordPress.ts [--lang pt] [--slug <slug>] [--publish] [--new-only] [--max 40] [--dry]
 * Needs WP_APP_PASSWORD (the WordPress application password) and optionally WP_USER / WP_URL.
 * Without --publish new stories are saved as DRAFT and old ones keep their status, so nothing goes live by accident.
 * One story = one WordPress story with the same slug; running it twice only updates.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkStory, type WebStory } from '../../server/engine/webStory';
import { pluginStory } from '../../server/engine/storyPlugin';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const arg = (n: string) => { const i = process.argv.indexOf(`--${n}`); return i > 0 ? process.argv[i + 1] : undefined; };
const flag = (n: string) => process.argv.includes(`--${n}`);
const WP = (process.env.WP_URL || 'https://blog.aurenstar.com').replace(/\/$/, '');
const SITE = 'https://aurenstar.com';
const USER = process.env.WP_USER || 'oficialsafare';
const PASS = (process.env.WP_APP_PASSWORD || '').trim();
const auth = 'Basic ' + Buffer.from(`${USER}:${PASS}`).toString('base64');
const NEW_ONLY = flag('new-only');
const MORE: Record<string, string> = { pt: 'Continue lendo', en: 'Keep reading', es: 'Sigue leyendo' };

async function wp(method: string, p: string, body?: unknown) {
  const res = await fetch(`${WP}/wp-json${p}`, { method, headers: { Authorization: auth, 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  const txt = await res.text();
  let json: any; try { json = JSON.parse(txt); } catch { json = { raw: txt.slice(0, 200) }; }
  return { status: res.status, json };
}

const stories: WebStory[] = [];
const dir = path.join(root, 'data/stories');
for (const l of fs.readdirSync(dir)) for (const f of fs.readdirSync(path.join(dir, l)).filter((x) => x.endsWith('.json')).sort()) stories.push(JSON.parse(fs.readFileSync(path.join(dir, l, f), 'utf8')));

const pick = stories.filter((s) => (!arg('lang') || s.lang === arg('lang')) && (!arg('slug') || s.slug === arg('slug')) && !checkStory(s).length).slice(0, Number(arg('max') || 700));
console.log(`${pick.length} stories to send${flag('dry') ? ' (dry run)' : ''}${flag('publish') ? ', status: publish' : ', status: draft for new ones'}`);
if (!flag('dry') && !PASS) { console.error('WP_APP_PASSWORD is empty: the secret is missing.'); process.exit(1); }

let made = 0, updated = 0, failed = 0;
for (const s of pick) {
  // no "keep reading" cards on the last screen (the owner prefers the page to end on the article button)
  const related: never[] = [];
  const { story_data, content } = pluginStory(s, SITE, related, s.more || MORE[s.lang] || 'Keep reading');
  if (flag('dry')) { console.log(`ok ${s.lang}/${s.slug}: ${story_data.pages.length} pages, ${content.length} chars`); continue; }
  const found = await wp('GET', `/web-stories/v1/web-story?slug=${encodeURIComponent(s.slug)}&status=any&_fields=id,status`);
  if (found.status === 401 || found.status === 403) { console.error(`WordPress refused the password (${found.status}). Stop.`); process.exit(1); }
  const old = Array.isArray(found.json) ? found.json[0] : undefined;
  if (old && NEW_ONLY) continue;
  const payload: Record<string, unknown> = { title: s.title, slug: s.slug, excerpt: s.description, story_data, content };
  if (flag('publish')) payload.status = 'publish'; else if (!old) payload.status = 'draft';
  const r = old ? await wp('POST', `/web-stories/v1/web-story/${old.id}`, payload) : await wp('POST', '/web-stories/v1/web-story', payload);
  if (r.status >= 200 && r.status < 300) { old ? updated++ : made++; console.log(`${old ? 'updated' : 'created'} ${s.lang}/${s.slug} -> id ${r.json.id} (${r.json.status})`); }
  else { failed++; console.error(`FAILED ${s.lang}/${s.slug}: ${r.status} ${r.json.message || r.json.raw || ''}`); }
}
console.log(`done: ${made} created, ${updated} updated, ${failed} failed`);
if (failed) process.exit(1);
