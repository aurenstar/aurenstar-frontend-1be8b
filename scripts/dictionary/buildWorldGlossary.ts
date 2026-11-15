/**
 * Fills data/world-glossary.json: for every language, the names people type in Google for each idea in IDEAS (see worldGlossary.ts).
 * Ideas already written by hand are kept. Missing ones (new ideas, new languages) are asked from the model in one request per language.
 * The names are only seeds: Google's real volumes (n8n flow) decide which name is used, a bad guess just measures zero.
 * Needs OPENAI_API_KEY. Run by .github/workflows/world-glossary.yml (monthly or by hand).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { IDEAS } from './worldGlossary';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const FILE = path.join(root, 'data/world-glossary.json');
const KEY = process.env.OPENAI_API_KEY;
const MODELS = [process.env.OPENAI_MODEL, 'gpt-5-mini', 'gpt-4.1-mini', 'gpt-4o-mini', 'gpt-5-nano'].filter(Boolean) as string[];

const NAMES: Record<string, string> = { de: 'German', fr: 'French', it: 'Italian', nl: 'Dutch', ja: 'Japanese', ko: 'Korean', zh: 'Simplified Chinese', zht: 'Traditional Chinese (Taiwan/Hong Kong)', ru: 'Russian', tr: 'Turkish', pl: 'Polish', ar: 'Arabic', hi: 'Hindi', id: 'Indonesian', th: 'Thai', vi: 'Vietnamese', sv: 'Swedish', da: 'Danish', no: 'Norwegian', fi: 'Finnish', el: 'Greek', he: 'Hebrew', uk: 'Ukrainian', cs: 'Czech', ro: 'Romanian', bg: 'Bulgarian', hu: 'Hungarian', sk: 'Slovak', hr: 'Croatian', sr: 'Serbian', ca: 'Catalan', lt: 'Lithuanian', lv: 'Latvian', sl: 'Slovenian', et: 'Estonian', ms: 'Malay', bn: 'Bengali', ta: 'Tamil', te: 'Telugu', mr: 'Marathi', ur: 'Urdu', fa: 'Persian', fil: 'Filipino' };

export function mergeEntry(existing: string | undefined, fresh: string | undefined): string {
  if (existing && existing.trim()) return existing; // hand-written wins
  return (fresh || '').split('|').map((s) => s.trim()).filter(Boolean).slice(0, 2).join('|');
}

async function ask(lang: string, ideas: { i: number; idea: string }[]): Promise<Record<number, string>> {
  const prompt = `For each English astrology idea below, write the 1 or 2 most common ways people in ${NAMES[lang]} type it into Google (short search words, in ${NAMES[lang]} script; if people there normally use the English or international word, write that). Separate two alternatives with "|". Return ONLY JSON: {"items":["...", ...]} with exactly ${ideas.length} items in the same order.\n\n${ideas.map((x, n) => `${n + 1}. ${x.idea}`).join('\n')}`;
  for (const model of [...new Set(MODELS)]) {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}` }, body: JSON.stringify({ model, response_format: { type: 'json_object' }, messages: [{ role: 'user', content: prompt }] }) });
      if (!res.ok) continue;
      const items = JSON.parse(String(((await res.json()) as any)?.choices?.[0]?.message?.content || '{}')).items;
      if (Array.isArray(items) && items.length === ideas.length && items.every((x) => typeof x === 'string')) return Object.fromEntries(ideas.map((x, n) => [x.i, items[n]]));
    } catch { /* try the next model */ }
  }
  return {};
}

async function main() {
  if (!KEY) { console.log('world glossary: OPENAI_API_KEY is not set, nothing to do.'); return; }
  const data = JSON.parse(fs.readFileSync(FILE, 'utf8')) as { ids: Record<string, number>; glossary: Record<string, string[]> };
  let filled = 0;
  for (const lang of Object.keys(data.ids)) {
    const cur = data.glossary[lang] || [];
    const missing = IDEAS.map((idea, i) => ({ i, idea })).filter((x) => !(cur[x.i] && cur[x.i].trim()));
    if (!missing.length || !NAMES[lang]) continue;
    const got = await ask(lang, missing);
    const next = IDEAS.map((_, i) => mergeEntry(cur[i], got[i]));
    filled += missing.filter((x) => got[x.i]).length;
    data.glossary[lang] = next;
    console.log(`  ${lang}: ${missing.filter((x) => got[x.i]).length}/${missing.length} filled`);
  }
  fs.writeFileSync(FILE, JSON.stringify(data, null, 1) + '\n');
  console.log(`world glossary: ${filled} names added`);
}
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
