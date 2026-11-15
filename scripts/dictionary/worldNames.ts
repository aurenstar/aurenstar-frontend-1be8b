/**
 * Worldwide step: the 24 extra languages of the site.
 * 1) For each core idea, which name do people in that language really search? (exact volumes from data/keyword-planner-world.json)
 *    Decisive winners are saved in data/world-names.json; the translation glossary (server/engine/glossary.ts) uses them,
 *    so every translated page of that language writes the idea the same, most searched way.
 * 2) How many people search each idea in all these languages together? That worldwide total is added to the robot's priority
 *    for the matching English question (see demand.ts), so ideas wanted everywhere are written first.
 * Run:  npx tsx scripts/dictionary/worldNames.ts
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import world from '../../data/world-glossary.json';
import { IDEAS } from './worldGlossary';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const fold = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

/** Names whose numbers are not about astrology (other meanings), so they never win and never count. */
export const NOT_RELIABLE = new Set(['de|radix', 'nl|geboortekaart', 'fr|carte du ciel', 'medium coeli']);
const isBad = (lang: string, name: string) => NOT_RELIABLE.has(`${lang}|${fold(name)}`) || NOT_RELIABLE.has(fold(name));

/** Ideas whose names are clean nouns that can sit in a translation glossary ("birth chart", not "houses astrology"). */
const GLOSSARY_IDEAS = new Set(['natal chart', 'zodiac signs', 'rising sign', 'moon sign', 'sun sign', 'mercury retrograde', 'saturn return', 'north node', 'synastry']);

const CORE_IDEAS = 20;
const EXTRA_COUNTED = new Set(['stellium', 'chiron astrology', 'black moon lilith']);
type Row = { keyword: string; volume: number; lang: string };
function volumes(): Map<string, number> {
  const m = new Map<string, number>();
  try {
    const rows = JSON.parse(fs.readFileSync(path.join(root, 'data/keyword-planner-world.json'), 'utf8')) as Row[];
    for (const r of rows) m.set(`${r.lang}|${fold(r.keyword)}`, Math.max(m.get(`${r.lang}|${fold(r.keyword)}`) || 0, Number(r.volume) || 0));
  } catch { /* no data yet */ }
  return m;
}

export interface WorldChoice { lang: string; idea: string; name: string; volume: number }
/** Decisive winners: at least 500 searches a month and at least twice the next name. */
export function chooseWorldNames(vol = volumes()): WorldChoice[] {
  const out: WorldChoice[] = [];
  for (const [lang, list] of Object.entries(world.glossary as Record<string, string[]>)) {
    list.forEach((entry, i) => {
      const idea = IDEAS[i];
      if (!GLOSSARY_IDEAS.has(idea)) return;
      const scored = entry.split('|').filter((n) => !isBad(lang, n)).map((n) => ({ n, v: vol.get(`${lang}|${fold(n)}`) || 0 })).sort((a, b) => b.v - a.v);
      if (!scored.length || scored[0].v < 500) return;
      if (scored[1] && scored[0].v < scored[1].v * 2) return;
      out.push({ lang, idea, name: scored[0].n, volume: scored[0].v });
    });
  }
  return out;
}

/**
 * Total monthly searches per idea over all languages (exact names only, reliable ones only).
 * Only clean astrology ideas count (the first 20 minus the phrase-like ones). The second-wave ideas are bare names ("Gemini" is also Google's AI, "Libra" a currency,
 * "Jupiter" a planet in every language), so their numbers are not about astrology. One name is also capped at 1 million a month.
 */
export function worldTotals(vol = volumes()): Map<string, number> {
  const tot = new Map<string, number>();
  for (const [lang, list] of Object.entries(world.glossary as Record<string, string[]>)) {
    list.forEach((entry, i) => {
      if (i >= CORE_IDEAS) return;
      const idea = IDEAS[i];
      if (!GLOSSARY_IDEAS.has(idea) && !EXTRA_COUNTED.has(idea)) return; // phrase-like ideas ("transits", "conjunction") are common words in many languages
      let best = 0;
      for (const n of entry.split('|')) if (!isBad(lang, n)) best = Math.max(best, vol.get(`${lang}|${fold(n)}`) || 0);
      if (best) tot.set(idea, (tot.get(idea) || 0) + Math.min(best, 1_000_000));
    });
  }
  return tot;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const picks = chooseWorldNames();
  const byLang: Record<string, Record<string, string>> = {};
  for (const p of picks) (byLang[p.lang] ||= {})[p.idea] = p.name;
  fs.writeFileSync(path.join(root, 'data/world-names.json'), JSON.stringify({ updated: new Date().toISOString().slice(0, 10), names: byLang }, null, 1) + '\n');
  const tot = [...worldTotals().entries()].sort((a, b) => b[1] - a[1]);
  console.log(`world names: ${picks.length} decisive names in ${Object.keys(byLang).length} languages`);
  console.log('worldwide demand:', tot.map(([k, v]) => `${k} ${v}`).join(' | '));
}
