/**
 * Native-article topics: for each site language, the strongest things people search IN that language (data/keyword-planner-world.json),
 * kept only when they are really about astrology. Nothing is published here: this only makes the list (data/native-topics.json).
 * 1) Cheap filter: the words must contain an astrology name of that language (data/world-glossary.json), not be a known other meaning,
 *    and have at least two words (a bare "leo" or "mars" is not a topic).
 * 2) Same wish written in another order ("aszendent berechnen" / "berechnung aszendent") counts once.
 * 3) If OPENAI_API_KEY is set, a model checks each remaining topic ("is this really about astrology?") and gives the article angle.
 * Run:  npx tsx scripts/dictionary/nativeTopics.ts [--lang de,tr] [--per 40]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import world from '../../data/world-glossary.json';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const fold = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
const arg = (n: string) => { const i = process.argv.indexOf(`--${n}`); return i < 0 ? undefined : process.argv[i + 1]; };

/** Other meanings that look like astrology words (Google's AI, shoes, a payment company, diseases...). */
export const OTHER_MEANINGS = /gemini|gemeni|gèminis|medium coeli|mediamarkt|new ?balance|cancer(?!ian)|hodgkin|melanom|\bsein\b|lion$|canceru|\bgbm\b|colon|pancreas|nike|adidas|iphone|samsung|jordan|tv na|スクエア|レジ|pos |カード|bitcoin|crypto/i;

/** A search with a loose number ("trine 5") is unclear: an article would have to guess what it means. */
export const hasNumber = (kw: string) => /\d/.test(kw);
export interface Topic { lang: string; keyword: string; volume: number; reason?: string }
type Row = { keyword: string; volume: number; lang: string };

/** Key that is the same for the same words in any order. */
export const intentKey = (kw: string) => fold(kw).split(/\s+/).filter(Boolean).sort().join(' ');

export function candidates(lang: string, rows: Row[], per = 40): Topic[] {
  const entries = (world.glossary as Record<string, string[]>)[lang] || [];
  const names = new Set<string>();
  for (const e of entries) for (const n of e.split('|')) { const f = fold(n); if (f.length >= 4) names.add(f); }
  const seen = new Set<string>();
  const out: Topic[] = [];
  for (const r of rows.filter((x) => x.lang === lang).sort((a, b) => b.volume - a.volume)) {
    const f = fold(r.keyword);
    if (OTHER_MEANINGS.test(r.keyword) || hasNumber(r.keyword) || r.keyword.split(/\s+/).length < 2) continue;
    if (![...names].some((n) => f.includes(n))) continue;
    const k = intentKey(r.keyword);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push({ lang, keyword: r.keyword, volume: Math.min(r.volume, 1_000_000) });
    if (out.length >= per) break;
  }
  return out;
}

async function check(lang: string, list: Topic[]): Promise<Topic[]> {
  const key = process.env.OPENAI_API_KEY;
  if (!key || !list.length) return list;
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
      response_format: { type: 'json_object' },
      messages: [{ role: 'user', content: `These are Google searches in language "${lang}". For each, say if a person typing it wants ASTROLOGY content (zodiac, birth chart, horoscope, planets in astrology). Searches about shops, apps, payment, health, tech, TV, music, names of people or places are NOT astrology. Return ONLY JSON {"items":[{"i":number,"astrology":boolean,"why":"max 8 words, English"}]}.\n${JSON.stringify(list.map((t, i) => ({ i, q: t.keyword })))}` }],
    }),
  });
  if (!res.ok) { console.log(`${lang}: model check failed (${res.status}), keeping the cheap filter only`); return list; }
  const j: any = await res.json();
  const items: { i: number; astrology: boolean; why?: string }[] = JSON.parse(String(j?.choices?.[0]?.message?.content || '{}')).items || [];
  const yes = new Map(items.filter((x) => x.astrology).map((x) => [x.i, x.why || '']));
  return list.filter((_, i) => yes.has(i)).map((t) => ({ ...t, reason: yes.get(list.indexOf(t)) }));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const rows = JSON.parse(fs.readFileSync(path.join(root, 'data/keyword-planner-world.json'), 'utf8')) as Row[];
  const only = arg('lang')?.split(',');
  const per = Number(arg('per') ?? 40);
  const langs = [...new Set(rows.map((r) => r.lang))].filter((l) => !only || only.includes(l));
  const out: Record<string, Topic[]> = {};
  for (const l of langs) { out[l] = await check(l, candidates(l, rows, per)); console.log(l, out[l].length); }
  fs.writeFileSync(path.join(root, 'data/native-topics.json'), JSON.stringify({ updated: new Date().toISOString().slice(0, 10), topics: out }, null, 1) + '\n');
}
