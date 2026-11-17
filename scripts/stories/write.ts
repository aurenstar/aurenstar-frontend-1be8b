/**
 * Writes Web Stories (one per sign) directly in each language, for the languages the wave plan (data/native-plan.json) has opened.
 *   npx tsx scripts/stories/write.ts --max 6 [--langs de,fr] [--dry]
 * Needs OPENAI_API_KEY (skips quietly without it). Respects "paused" in the plan, the daily limit and the quality gates in build.ts.
 * Saves data/stories/<lang>/<sign>-<lang>.json only when every check passes. Portuguese, English and Spanish are hand-written: never touched here.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { activeWave } from '../native/plan';
import planFile from '../../data/native-plan.json';
import { buildStory, SIGN_FACTS, type Ask } from './build';
import { HAND_LANGS } from '../../server/engine/webStory';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const arg = (n: string) => { const i = process.argv.indexOf(`--${n}`); return i < 0 ? undefined : process.argv[i + 1]; };
const DRY = process.argv.includes('--dry');
const KEY = process.env.OPENAI_API_KEY;
const WAVE = activeWave();
const LANGS = (arg('langs') || process.env.STORY_LANGS || WAVE.langs.join(',')).split(',').map((s) => s.trim()).filter((l) => l && !HAND_LANGS.includes(l));
const MAX = Math.max(0, Math.min(600, Number(arg('max') ?? (process.env.STORY_MAX || 6))));
const MODELS = { write: process.env.OPENAI_WRITE_MODEL || 'gpt-4.1', review: process.env.OPENAI_MODEL || 'gpt-4.1-mini' };
const PRICE: Record<string, [number, number]> = { 'gpt-4.1': [2, 8], 'gpt-4.1-mini': [0.4, 1.6] };
// STORY_CAP_USD = the most this run may spend (set by the workflow when the owner asks for all languages); otherwise the plan's daily limit
const DAILY_CAP = Number(process.env.STORY_CAP_USD || (planFile as any).dailyCapUsd || process.env.NATIVE_DAILY_CAP_USD || 0.10);
const COST_FILE = path.join(root, 'data/native-cost.json');
const today = new Date().toISOString().slice(0, 10);
const readCost = (): Record<string, any> => { try { return JSON.parse(fs.readFileSync(COST_FILE, 'utf8')); } catch { return {}; } };
let spent = 0;

const ask: Ask = async (kind, prompt) => {
  const model = MODELS[kind];
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}` },
    body: JSON.stringify({ model, response_format: { type: 'json_object' }, temperature: kind === 'write' ? 0.7 : 0, messages: [{ role: 'user', content: prompt }] }),
  });
  if (!res.ok) throw new Error(`model error ${res.status}`);
  const j: any = await res.json();
  const [pi, po] = PRICE[model] || [2, 8];
  spent += ((j?.usage?.prompt_tokens || 0) * pi + (j?.usage?.completion_tokens || 0) * po) / 1e6;
  return JSON.parse(String(j?.choices?.[0]?.message?.content || '{}'));
};

async function main() {
  if (WAVE.paused && !arg('langs')) { console.log('stories: paused in data/native-plan.json'); return; }
  if (!KEY && !DRY) { console.log('stories: no OPENAI_API_KEY, nothing to do'); return; }
  let made = 0;
  for (const lang of LANGS) {
    const hasArticles = fs.existsSync(path.join(root, 'data/native-articles', lang)) && fs.readdirSync(path.join(root, 'data/native-articles', lang)).some((f) => f.endsWith('.json'));
    for (const s of SIGN_FACTS) {
      if (made >= MAX) break;
      const file = path.join(root, 'data/stories', lang, `${s.en.toLowerCase()}-${lang}.json`);
      if (fs.existsSync(file)) continue;
      if ((readCost()[today]?.usd || 0) + spent >= DAILY_CAP) { console.log(`stories: daily limit of US$${DAILY_CAP} reached, stopping`); made = MAX; break; }
      if (DRY) { console.log(`stories: would write ${lang}/${s.key}`); made++; continue; }
      try {
        const r = await buildStory(lang, s, hasArticles ? 'articles' : 'tool', ask, today);
        if (!r.story) { console.log(`stories: ${lang}/${s.key} rejected (${r.why})`); continue; }
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, JSON.stringify(r.story, null, 2) + '\n');
        console.log(`stories: wrote ${lang}/${s.key}`); made++;
      } catch (e: any) { console.log(`stories: ${lang}/${s.key} failed (${e.message})`); }
    }
  }
  if (!DRY && spent > 0) {
    const all = readCost(); const d = all[today] || { usd: 0, articles: 0, kind: {} };
    d.usd = Math.round((d.usd + spent) * 1e5) / 1e5; d.kind.story = Math.round(((d.kind.story || 0) + spent) * 1e5) / 1e5; all[today] = d;
    fs.writeFileSync(COST_FILE, JSON.stringify(all, null, 1) + '\n');
  }
  console.log(`stories: ${made} written, about US$${spent.toFixed(4)} spent`);
}
main();
