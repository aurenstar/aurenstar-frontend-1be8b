/**
 * Finds what people REALLY search for, so the robot writes the most wanted answers first.
 * Source 1 (automatic): Google's own search suggestions (what people type in the search box). Free, no key.
 *   The earlier a question appears in the suggestions, and the more different searches show it, the higher its score.
 * Source 2 (optional): a Keyword Planner export saved as data/keyword-planner.csv. If it is there, real monthly volume wins.
 * The result is saved in data/dictionary-demand.json (best first) and refreshed about once a week.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { slugify } from './checks';
import type { Seed } from './topics';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const DEMAND_FILE = path.join(root, 'data/dictionary-demand.json');
const PLANNER_CSV = path.join(root, 'data/keyword-planner.csv');
const GSC_FILE = path.join(root, 'data/search-console.json');

export interface DemandItem extends Seed { score: number; source: 'google-suggest' | 'keyword-planner' | 'search-console'; volume?: number }
interface DemandFile { updated: string; items: DemandItem[] }

const BASES = [
  'the sun', 'the moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto', 'chiron', 'lilith', 'the north node', 'the south node', 'the part of fortune',
  'the ascendant', 'the descendant', 'the midheaven', 'the imum coeli', 'a stellium', 'a natal chart', 'a synastry chart', 'a composite chart', 'a transit', 'a house', 'the houses',
  'a conjunction', 'an opposition', 'a square', 'a trine', 'a sextile', 'a quincunx', 'an aspect', 'a retrograde', 'mercury retrograde', 'saturn return', 'a solar return', 'progressions',
  'a new moon', 'a full moon', 'a blood moon', 'an eclipse', 'a waxing moon', 'a waning moon', 'void of course moon', 'a moon sign', 'a rising sign', 'a sun sign', 'a big three',
  'a cardinal sign', 'a fixed sign', 'a mutable sign', 'a fire sign', 'an earth sign', 'an air sign', 'a water sign', 'a cusp', 'a decan', 'a degree', 'a chart ruler', 'a planetary ruler',
  'a detriment', 'an exaltation', 'a dignity', 'a yod', 'a grand trine', 'a t-square', 'a grand cross', 'a kite', 'a mystic rectangle', 'a node', 'a lunar node', 'a dwad',
  'aries', 'taurus', 'gemini', 'cancer sign', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
  'the 1st house', 'the 2nd house', 'the 3rd house', 'the 4th house', 'the 5th house', 'the 6th house', 'the 7th house', 'the 8th house', 'the 9th house', 'the 10th house', 'the 11th house', 'the 12th house',
  'ophiuchus', 'the zodiac', 'sidereal astrology', 'tropical astrology', 'vedic astrology', 'western astrology', 'chinese zodiac', 'a birth chart', 'birth time', 'an astrological age',
];
const PATTERNS = (b: string) => [`what is ${b}`, `what does ${b} mean`, `what does ${b} mean in astrology`, `${b} meaning astrology`];
// Things that are not "meaning" questions, or that we do not want to write about (predictions, health, money, fear, tools, dates).
const BLOCK = /\b(death|die|dead|dying|pregnan|lottery|money|wealth|rich|stock|disease|illness|sick|suicide|divorce|affair|cheat|cheating|sex|sexual|toxic|evil|curse|spell|hex|will i|am i going|calculator|free|today|tomorrow|tonight|this week|this month|horoscope|20\d\d|near me|app|pdf|reddit|youtube|video|book|course|jobs|salary|tattoo|name|names|celebrit|famous|birthday|compatib|match|dating|love life)\b/i;
const ASTRO = /astrolog|zodiac|horoscope|natal|birth chart|rising|ascendant|descendant|midheaven|moon|sun sign|mercury|venus|mars|jupiter|saturn|uranus|neptune|pluto|chiron|lilith|node|retrograde|transit|aspect|house|conjunct|opposition|square|trine|sextile|stellium|eclipse|synastry|composite|solar return|aries|taurus|gemini|cancer|leo|virgo|libra|scorpio|sagittarius|capricorn|aquarius|pisces|ophiuchus|cusp|decan|sidereal|tropical|vedic/i;
const STOP = new Set(['what', 'is', 'are', 'does', 'do', 'mean', 'means', 'meaning', 'a', 'an', 'the', 'in', 'on', 'of', 'to', 'astrology', 'astrological', 'your', 'my', 'birth', 'chart', 'it', 'its', 'and', 'for', 'how', 'why', 'when', 'which', 'can', 'zodiac']);

/** Same idea, different words ("what is a stellium" = "what is a stellium in astrology"): one page is enough. */
export function conceptKey(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter((w) => w && !STOP.has(w)).sort().join(' ');
}

export function categoryFor(q: string): Seed['category'] {
  const s = q.toLowerCase();
  if (/\b(moon|eclipse|retrograde|transit|return|progression|phase|waxing|waning|void)\b/.test(s)) return 'Phases & Movements';
  if (/\b(sign|element|fire|earth|air|water|cardinal|fixed|mutable|aries|taurus|gemini|cancer|leo|virgo|libra|scorpio|sagittarius|capricorn|aquarius|pisces|ophiuchus|zodiac|cusp|decan)\b/.test(s)) return 'Signs & Elements';
  if (/\b(sun|mercury|venus|mars|jupiter|saturn|uranus|neptune|pluto|chiron|lilith|node|planet|asteroid)\b/.test(s)) return 'Planets & Bodies';
  return 'Chart Concepts';
}

/** "what is a stellium in astrology" -> a clean question; returns null when it is not a good dictionary question. */
export function toQuestion(raw: string): string | null {
  let q = raw.trim().replace(/\s+/g, ' ').replace(/\?+$/, '');
  if (!/^(what|why|how|when|which|is|does|do|are|can)\b/i.test(q)) {
    const m = q.match(/^(.*?)\s+meaning(?:\s+astrology)?$/i); // "chiron meaning astrology" -> "What does chiron mean in astrology?"
    if (!m) return null;
    const subject = m[1].trim();
    if (/\b(and|of|the|for|in|my|your|with|vs)$/i.test(subject)) return null; // "zodiac signs and meaning" is not a clean question
    const plural = /\b(signs|houses|planets|aspects|elements|transits|nodes|cusps|decans|eclipses|retrogrades|symbols|degrees)$/i.test(subject);
    q = `what ${plural ? 'do' : 'does'} ${subject} mean in astrology`;
  }
  if (q.length < 12 || q.length > 80 || BLOCK.test(q) || !ASTRO.test(q) || /\b(my|me|i)\b/i.test(q)) return null; // personal queries ("what is my birth chart") belong to the calculators, not the dictionary
  if (/^(how|when|can|do|is|are)\b/i.test(q) && !/^(how does|how do)\b/i.test(q)) return null; // keep "what ..." / "why ..." / "how does ..." style
  return `${q[0].toUpperCase()}${q.slice(1)}?`;
}

export function seedFromQuestion(question: string): Seed {
  const term = question.replace(/\?$/, '').replace(/^(what|why|how)\s+(is|are|does|do)\s+/i, '').replace(/^(an?|the)\s+/i, '').replace(/\s+mean(s)?(\s+in astrology)?$/i, '').replace(/\s+in astrology$/i, '').trim();
  return { term: term ? `${term[0].toUpperCase()}${term.slice(1)}` : question, question, category: categoryFor(question), icon: '✨' };
}

async function suggest(q: string): Promise<string[]> {
  try {
    const res = await fetch(`https://suggestqueries.google.com/complete/search?client=firefox&hl=en&gl=us&q=${encodeURIComponent(q)}`, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; aurenstar-dictionary)' } });
    if (!res.ok) return [];
    const json: any = await res.json();
    return Array.isArray(json?.[1]) ? json[1].map(String) : [];
  } catch { return []; }
}

/** Optional: volumes an n8n flow gets from the Google Ads API (Keyword Planner) and saves monthly as data/keyword-planner.json: [{keyword, volume}]. */
const PLANNER_JSON = path.join(root, 'data/keyword-planner.json');
function readPlannerJson(): DemandItem[] {
  try {
    const rows = JSON.parse(fs.readFileSync(PLANNER_JSON, 'utf8')) as { keyword?: string; volume?: number | string }[];
    const out: DemandItem[] = [];
    for (const r of Array.isArray(rows) ? rows : []) {
      const volume = Number(r.volume) || 0;
      const q = toQuestion(String(r.keyword || ''));
      if (q && volume > 0) out.push({ ...seedFromQuestion(q), score: 1_000_000 + volume, source: 'keyword-planner', volume });
    }
    return out;
  } catch { return []; }
}

/** Optional: Keyword Planner export (CSV or tab-separated). Looks for a "Keyword" column and an "Avg. monthly searches" column. */
function readPlanner(): DemandItem[] {
  const fromApi = readPlannerJson();
  if (fromApi.length) return fromApi;
  if (!fs.existsSync(PLANNER_CSV)) return [];
  const lines = fs.readFileSync(PLANNER_CSV, 'utf8').replace(/^﻿/, '').split(/\r?\n/).filter(Boolean);
  const sep = lines.some((l) => l.includes('\t')) ? '\t' : ',';
  const split = (l: string) => l.split(sep).map((c) => c.replace(/^"|"$/g, '').trim());
  const hi = lines.findIndex((l) => /keyword/i.test(l) && /avg|search/i.test(l));
  if (hi < 0) return [];
  const head = split(lines[hi]).map((h) => h.toLowerCase());
  const ki = head.findIndex((h) => h === 'keyword' || h.startsWith('keyword'));
  const vi = head.findIndex((h) => /avg.*monthly|monthly.*search/.test(h));
  if (ki < 0 || vi < 0) return [];
  const out: DemandItem[] = [];
  for (const l of lines.slice(hi + 1)) {
    const c = split(l);
    const volume = Number(String(c[vi] || '0').replace(/[^\d]/g, '')) || 0;
    const q = toQuestion(c[ki] || '');
    if (q && volume > 0) out.push({ ...seedFromQuestion(q), score: 1_000_000 + volume, source: 'keyword-planner', volume });
  }
  return out;
}

/** Optional: what people really typed in Google before landing on aurenstar.com (an n8n flow saves it weekly as data/search-console.json: [{query, clicks, impressions, position}]). */
function readSearchConsole(): DemandItem[] {
  try {
    const rows = JSON.parse(fs.readFileSync(GSC_FILE, 'utf8')) as { query?: string; clicks?: number; impressions?: number }[];
    const out: DemandItem[] = [];
    for (const r of Array.isArray(rows) ? rows : []) {
      const q = toQuestion(String(r.query || ''));
      const impressions = Number(r.impressions) || 0;
      if (q && impressions > 0) out.push({ ...seedFromQuestion(q), score: 500_000 + impressions + (Number(r.clicks) || 0) * 10, source: 'search-console', volume: impressions });
    }
    return out;
  } catch { return []; }
}

export function readDemand(): DemandFile {
  try { return JSON.parse(fs.readFileSync(DEMAND_FILE, 'utf8')) as DemandFile; } catch { return { updated: '', items: [] }; }
}

export async function refreshDemand(force = false, log = console.log): Promise<DemandFile> {
  const old = readDemand();
  const ageDays = old.updated ? (Date.now() - Date.parse(old.updated)) / 86_400_000 : Infinity;
  const planner = readPlanner();
  const gsc = readSearchConsole();
  if (!force && ageDays < 6 && old.items.length && !planner.length && !gsc.length) return old;
  const scores = new Map<string, { q: string; score: number }>();
  for (const b of BASES) {
    for (const p of PATTERNS(b)) {
      const list = await suggest(p);
      list.forEach((raw, i) => {
        if (raw.trim().toLowerCase() === p.toLowerCase()) return; // Google just echoing what we typed is not demand
        const q = toQuestion(raw);
        if (!q) return;
        const k = slugify(q.replace(/\?$/, ''));
        const cur = scores.get(k) || { q, score: 0 };
        cur.score += 11 - i; // position 1 = 10 points ... position 10 = 1 point
        scores.set(k, cur);
      });
      await new Promise((r) => setTimeout(r, 120));
    }
  }
  const items: DemandItem[] = [...scores.values()].map((v) => ({ ...seedFromQuestion(v.q), score: v.score, source: 'google-suggest' as const }));
  const merged = new Map<string, DemandItem>();
  for (const it of [...items, ...gsc, ...planner]) { const k = slugify(it.question.replace(/\?$/, '')); const cur = merged.get(k); if (!cur || it.score > cur.score) merged.set(k, it); }
  const out: DemandFile = { updated: new Date().toISOString(), items: [...merged.values()].sort((a, b) => b.score - a.score) };
  log(`dictionary: demand list refreshed (${out.items.length} real questions from Google suggestions${planner.length ? ` + ${planner.length} from Keyword Planner` : ''}${gsc.length ? ` + ${gsc.length} from Search Console` : ''})`);
  return out;
}
