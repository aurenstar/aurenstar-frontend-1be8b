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
import { checkStory, signOf, type WebStory } from '../../server/engine/webStory';
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
const OPENAI_KEY = (process.env.OPENAI_API_KEY || '').trim();
const COVER_MAX = Number(process.env.STORY_COVER_MAX || 10); // new pictures made per run (about US$0.02 each)
let coversMade = 0;
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

/**
 * Stories about a sign use that sign's cover. Any other story gets its own picture, made by the robot (gpt-image-1-mini),
 * saved in the WordPress media library (so it is live at once) and found again on the next run by its name.
 */
async function coverFor(s: WebStory): Promise<string | undefined> {
  if (signOf(s) || !OPENAI_KEY) return undefined;
  const name = `story-cover-${s.slug}`.slice(0, 80);
  const found = await wp('GET', `/wp/v2/media?slug=${encodeURIComponent(name)}&_fields=id,source_url`);
  if (Array.isArray(found.json) && found.json[0]?.source_url) return found.json[0].source_url;
  if (coversMade >= COVER_MAX || flag('dry')) return undefined;
  const prompt = `Cinematic realistic photograph, vertical 2:3, soft golden light, one or two real people living the moment of this idea: "${s.title}". Natural expressions, shallow depth of field, calm empty space in the lower half. No text, no letters, no logos, no watermark.`;
  const res = await fetch('https://api.openai.com/v1/images/generations', { method: 'POST', headers: { Authorization: `Bearer ${OPENAI_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ model: 'gpt-image-1-mini', prompt, size: '1024x1536', quality: 'medium', output_format: 'jpeg', output_compression: 80, n: 1 }) });
  const j: any = await res.json().catch(() => ({}));
  const b64 = j?.data?.[0]?.b64_json;
  if (!res.ok || !b64) { console.error(`cover failed for ${s.slug}: ${res.status} ${j?.error?.message || ''}`); return undefined; }
  const up = await fetch(`${WP}/wp-json/wp/v2/media`, { method: 'POST', headers: { Authorization: auth, 'Content-Type': 'image/jpeg', 'Content-Disposition': `attachment; filename="${name}.jpg"` }, body: Buffer.from(b64, 'base64') });
  const uj: any = await up.json().catch(() => ({}));
  if (!up.ok || !uj.source_url) { console.error(`cover upload failed for ${s.slug}: ${up.status}`); return undefined; }
  await wp('POST', `/wp/v2/media/${uj.id}`, { slug: name, alt_text: s.title });
  coversMade++;
  console.log(`cover made for ${s.slug}`);
  return uj.source_url;
}

let made = 0, updated = 0, failed = 0;
for (const s of pick) {
  // no "keep reading" cards on the last screen (the owner prefers the page to end on the article button)
  const related: never[] = [];
  const cover = flag('dry') ? undefined : await coverFor(s);
  const { story_data, content } = pluginStory(s, SITE, related, s.more || MORE[s.lang] || 'Keep reading', cover);
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
