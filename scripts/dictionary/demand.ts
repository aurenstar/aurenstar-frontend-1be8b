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


// ---- Short searches ("yod astrology", "mercury retrograde", "virgo") -> clean questions. Only well-known concepts, so no junk gets written. ----
const SIGN_NAMES = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
const BODY_NAMES: Record<string, string> = { sun: 'the Sun', moon: 'the Moon', mercury: 'Mercury', venus: 'Venus', mars: 'Mars', jupiter: 'Jupiter', saturn: 'Saturn', uranus: 'Uranus', neptune: 'Neptune', pluto: 'Pluto', chiron: 'Chiron', lilith: 'Lilith', 'north node': 'the North Node', 'south node': 'the South Node' };
// [phrase, article]  article: a | an | the | '' (none) | PL (plural: "What are ...")
const CONCEPTS: [string, string][] = [
  ['stellium', 'a'], ['yod', 'a'], ['grand trine', 'a'], ['grand cross', 'a'], ['t-square', 'a'], ['kite', 'a'], ['mystic rectangle', 'a'], ['conjunction', 'a'], ['opposition', 'an'], ['trine', 'a'], ['sextile', 'a'], ['quincunx', 'a'],
  ['retrograde', 'a'], ['mercury retrograde', ''], ['saturn return', ''], ['solar return', 'a'], ['lunar return', 'a'], ['synastry', ''], ['composite chart', 'a'], ['davison chart', 'a'], ['natal chart', 'a'], ['draconic chart', 'a'], ['progressed chart', 'a'],
  ['secondary progressions', 'PL'], ['solar arc directions', 'PL'], ['transits', 'PL'], ['aspects', 'PL'], ['houses', 'PL'], ['whole sign houses', 'PL'], ['placidus houses', 'PL'], ['angular houses', 'PL'], ['cadent houses', 'PL'], ['succedent houses', 'PL'],
  ['midheaven', 'the'], ['ascendant', 'the'], ['descendant', 'the'], ['imum coeli', 'the'], ['part of fortune', 'the'], ['vertex', 'the'], ['rising sign', 'a'], ['moon sign', 'a'], ['sun sign', 'a'], ['cusp', 'a'], ['decan', 'a'], ['decans', 'PL'], ['orb', 'an'],
  ['dignities', 'PL'], ['essential dignities', 'PL'], ['void of course moon', 'a'], ['new moon', 'a'], ['full moon', 'a'], ['blood moon', 'a'], ['lunar eclipse', 'a'], ['solar eclipse', 'a'], ['eclipse', 'an'],
  ['cardinal signs', 'PL'], ['fixed signs', 'PL'], ['mutable signs', 'PL'], ['fire signs', 'PL'], ['earth signs', 'PL'], ['air signs', 'PL'], ['water signs', 'PL'], ['elements', 'PL'],
  ['sidereal astrology', ''], ['tropical astrology', ''], ['vedic astrology', ''], ['western astrology', ''], ['lunar nodes', 'PL'], ['planets', 'PL'], ['zodiac signs', 'PL'], ['big three', 'the'],
];
const ordinalOf = (n: number) => `${n}${n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th'}`;
const CONCEPT_BY_KEY = new Map<string, [string, string]>();
for (const [ph, art] of CONCEPTS) { const k = conceptKey(ph); if (k) CONCEPT_BY_KEY.set(k, [ph, art]); }

/** "yod astrology" -> "What is a yod in astrology?" ; "venus in leo" -> "What does Venus in Leo mean?" ; null when it is not a known concept. */
export function termToQuestion(raw: string, qualifiedOverride?: boolean): string | null {
  // A bare word like "gemini", "cancer", "mars" or "kite" is mostly NOT astrology (an AI, a disease, a candy, a toy). It only counts with an astrology word next to it.
  const qualified = qualifiedOverride ?? /\b(astrology|astrological|astro|meaning|sign|signs|zodiac|horoscope|natal|birth chart)\b/i.test(raw);
  let t = raw.toLowerCase().replace(/[^a-z0-9' -]/g, ' ').replace(/\s+/g, ' ').trim();
  t = t.replace(/\b(astrology|astrological|meaning|definition|explained|in astrology)\b/g, ' ').replace(/\bbirth chart\b/g, 'natal chart').replace(/\s+/g, ' ').trim();
  if (!t) return null;
  const cap = (x: string) => x.replace(/\b\w/g, (c) => c.toUpperCase());
  // sign alone ("virgo", "virgo sign", "virgo zodiac sign")
  const signOnly = t.replace(/\b(zodiac sign|sign|zodiac)\b/g, '').trim();
  if (SIGN_NAMES.includes(signOnly)) { if (!qualified) return null; return `What does ${cap(signOnly)} mean in astrology?`; }
  // body alone
  if (BODY_NAMES[t]) return qualified ? `What does ${BODY_NAMES[t]} mean in astrology?` : null;
  // body in sign / in Nth house
  const m = t.match(/^(sun|moon|mercury|venus|mars|jupiter|saturn|uranus|neptune|pluto|chiron|lilith|north node|south node) in (?:the )?(?:(aries|taurus|gemini|cancer|leo|virgo|libra|scorpio|sagittarius|capricorn|aquarius|pisces)|(\d{1,2})(?:st|nd|rd|th)? house)$/);
  if (m) {
    if (m[2]) return `What does ${BODY_NAMES[m[1]]} in ${cap(m[2])} mean?`;
    const h = Number(m[3]); if (h >= 1 && h <= 12) return `What does ${BODY_NAMES[m[1]]} in the ${ordinalOf(h)} house mean?`;
    return null;
  }
  const h = t.match(/^(?:the )?(\d{1,2})(?:st|nd|rd|th)? house$/);
  if (h) { const n = Number(h[1]); return n >= 1 && n <= 12 ? `What does the ${ordinalOf(n)} house mean in astrology?` : null; }
  const retro = t.match(/^(sun|moon|venus|mars|jupiter|saturn|uranus|neptune|pluto|chiron|lilith) retrograde$/);
  if (retro) return `What does ${BODY_NAMES[retro[1]]} retrograde mean in astrology?`;
  const hit = CONCEPT_BY_KEY.get(conceptKey(t));
  if (!hit) return null;
  const [ph, art] = hit;
  if (!qualified && !/\s/.test(ph)) return null; // one-word concepts ("kite", "orb", "vertex") need an astrology word with them
  return art === 'PL' ? `What are ${ph} in astrology?` : `What is ${art ? art + ' ' : ''}${ph} in astrology?`;
}

// ---- Portuguese / Spanish searches -> the English question we write about (the site serves all three languages) ----
const FOLD = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const FOREIGN: [string, string][] = [
  ['touro', 'taurus'], ['tauro', 'taurus'], ['gemeos', 'gemini'], ['geminis', 'gemini'], ['leao', 'leo'], ['virgem', 'virgo'], ['escorpiao', 'scorpio'], ['escorpio', 'scorpio'], ['sagitario', 'sagittarius'], ['capricornio', 'capricorn'], ['aquario', 'aquarius'], ['acuario', 'aquarius'], ['peixes', 'pisces'], ['piscis', 'pisces'],
  ['aries', 'aries'], ['cancer', 'cancer'], ['leo', 'leo'], ['virgo', 'virgo'], ['libra', 'libra'],
  ['sol', 'sun'], ['lua', 'moon'], ['luna', 'moon'], ['mercurio', 'mercury'], ['venus', 'venus'], ['marte', 'mars'], ['jupiter', 'jupiter'], ['saturno', 'saturn'], ['urano', 'uranus'], ['netuno', 'neptune'], ['neptuno', 'neptune'], ['plutao', 'pluto'], ['pluton', 'pluto'], ['quiron', 'chiron'], ['lilith', 'lilith'],
  ['nodo norte', 'north node'], ['nodo sul', 'south node'], ['nodo sur', 'south node'], ['nodos lunares', 'lunar nodes'], ['parte da fortuna', 'part of fortune'], ['parte de la fortuna', 'part of fortune'],
  ['mapa astral', 'natal chart'], ['carta natal', 'natal chart'], ['ascendente', 'ascendant'], ['descendente', 'descendant'], ['meio do ceu', 'midheaven'], ['medio cielo', 'midheaven'], ['fundo do ceu', 'imum coeli'], ['fondo del cielo', 'imum coeli'],
  ['signo solar', 'sun sign'], ['signo lunar', 'moon sign'], ['signo ascendente', 'rising sign'], ['retrogrado', 'retrograde'], ['retrograda', 'retrograde'], ['conjuncao', 'conjunction'], ['conjuncion', 'conjunction'], ['oposicao', 'opposition'], ['oposicion', 'opposition'],
  ['trigono', 'trine'], ['trino', 'trine'], ['sextil', 'sextile'], ['quincuncio', 'quincunx'], ['stellium', 'stellium'], ['stelium', 'stellium'], ['estelio', 'stellium'], ['yod', 'yod'], ['grande trigono', 'grand trine'], ['grande cruz', 'grand cross'], ['grande cruzamento', 'grand cross'],
  ['eclipse lunar', 'lunar eclipse'], ['eclipse solar', 'solar eclipse'], ['eclipse', 'eclipse'], ['lua nova', 'new moon'], ['luna nueva', 'new moon'], ['lua cheia', 'full moon'], ['luna llena', 'full moon'], ['lua de sangue', 'blood moon'], ['luna de sangre', 'blood moon'],
  ['retorno de saturno', 'saturn return'], ['retorno de saturno', 'saturn return'], ['revolucao solar', 'solar return'], ['revolucion solar', 'solar return'], ['sinastria', 'synastry'], ['cuspide', 'cusp'], ['decanato', 'decan'],
  ['casas astrologicas', 'houses'], ['casas', 'houses'], ['casa', 'house'], ['aspectos', 'aspects'], ['transitos', 'transits'], ['planetas', 'planets'], ['elementos', 'elements'],
  ['signos do zodiaco', 'zodiac signs'], ['signos del zodiaco', 'zodiac signs'], ['signos', 'signs'], ['em', 'in'], ['en', 'in'],
];
const FOREIGN_SORTED = [...FOREIGN].sort((a, b) => b[0].length - a[0].length);
const FOREIGN_NOISE = /\b(o que e|o que significa|o que quer dizer|quer dizer|que es|que significa|que quiere decir|significado de|significados de|significado do|significado da|significado|significados|significa|na astrologia|en astrologia|astrologia|astrologico|astrologica|qual|cual|como|el|la|los|las|lo|o|a|os|as|de|do|da|dos|das|del|no|na|nos|nas|um|uma|un|una|e|es)\b/g;
const WORD_ORD: Record<string, number> = { primeira: 1, primera: 1, segunda: 2, terceira: 3, tercera: 3, quarta: 4, cuarta: 4, quinta: 5, sexta: 6, setima: 7, septima: 7, oitava: 8, octava: 8, nona: 9, novena: 9, decima: 10, 'decima primeira': 11, 'decima segunda': 12 };

/** "o que significa mercurio retrogrado" -> "What is mercury retrograde in astrology?". null if any word is unknown (we never guess). */
export function foreignToQuestion(raw: string): string | null {
  let t = ` ${FOLD(raw).replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim()} `;
  t = t.replace(/\b(\d{1,2})\s*(?:a|o)?\s+casa\b/g, ' $1th house ').replace(/\bcasa\s+(\d{1,2})\b/g, ' $1th house ');
  for (const [w, n] of Object.entries(WORD_ORD)) t = t.replace(new RegExp(`\\b${w}\\s+casa\\b`, 'g'), ` ${n}th house `);
  const houseNum = (t.match(/\b(\d{1,2})th house\b/) || [])[1];
  t = t.replace(/\b\d{1,2}th house\b/g, ' ');
  for (const [pt, en] of FOREIGN_SORTED) t = t.replace(new RegExp(`(?<=\\s)${pt}(?=\\s)`, 'g'), `\u0001${en}\u0001`);
  const pieces = t.split('\u0001');
  const leftovers = pieces.filter((_, i) => i % 2 === 0).join(' ').replace(FOREIGN_NOISE, ' ').replace(/\s+/g, ' ').trim();
  if (leftovers) return null; // a word we do not know: skip instead of guessing
  let phrase = pieces.filter((_, i) => i % 2 === 1).join(' ').replace(/\s+/g, ' ').trim();
  if (houseNum) phrase = BODY_NAMES[phrase] ? `${phrase} in ${houseNum}th house` : `${phrase} ${houseNum}th house`.trim();
  if (!phrase) return null;
  const q = termToQuestion(phrase, /signific|astrolog|signo|zodiac|horoscop|natal|astral|carta/.test(FOLD(raw)));
  return q && !BLOCK.test(q) ? q : null;
}

/** "what is a stellium in astrology" -> a clean question; returns null when it is not a good dictionary question. */
export function toQuestion(raw: string): string | null {
  let q = raw.trim().replace(/\s+/g, ' ').replace(/\?+$/, '');
  if (!/^(what|why|how|when|which|is|does|do|are|can)\b/i.test(q)) {
    const m = q.match(/^(.*?)\s+meaning(?:\s+astrology)?$/i); // "chiron meaning astrology" -> "What does chiron mean in astrology?"
    const known = termToQuestion(m ? m[1] : q, m ? true : undefined); // known concepts get the cleanest wording ("What is a yod in astrology?")
    if (known) q = known.replace(/\?$/, '');
    else if (!m) return null;
    else {
      const subject = m[1].trim();
      if (/\b(and|of|the|for|in|my|your|with|vs)$/i.test(subject)) return null; // "zodiac signs and meaning" is not a clean question
      const plural = /\b(signs|houses|planets|aspects|elements|transits|nodes|cusps|decans|eclipses|retrogrades|symbols|degrees)$/i.test(subject);
      q = `what ${plural ? 'do' : 'does'} ${subject} mean in astrology`;
    }
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

/**
 * Volumes an n8n flow gets from the Google Ads API (Keyword Planner) and saves monthly as data/keyword-planner.json:
 * [{ keyword, volume, market: 'us' | 'br' | 'mx', comp: 0-100 }]  (market and comp are optional).
 * Searches in Portuguese (Brazil) and Spanish (Mexico) are matched to the English question we write about, because every term is published in all three languages.
 * Priority = total monthly searches x ease. Ease is lower when Google says advertisers fight over it (mild weight, it is an ads signal),
 * and higher when aurenstar.com already shows up around positions 8-20 in Google for it (a small push can win page 1).
 */
const PLANNER_JSON = path.join(root, 'data/keyword-planner.json');
function gscPositions(): Map<string, number> {
  const m = new Map<string, number>();
  try {
    const rows = JSON.parse(fs.readFileSync(GSC_FILE, 'utf8')) as { query?: string; impressions?: number; position?: number }[];
    for (const r of Array.isArray(rows) ? rows : []) {
      const q = toQuestion(String(r.query || ''));
      const pos = Number(r.position) || 0;
      if (!q || !pos || (Number(r.impressions) || 0) < 3) continue;
      const k = conceptKey(q);
      if (!m.has(k) || pos < (m.get(k) as number)) m.set(k, pos);
    }
  } catch { /* no Search Console data yet */ }
  return m;
}
export function plannerPriority(volume: number, comp: number | null, position: number | null): number {
  const ease = 1 - 0.4 * ((comp ?? 50) / 100); // 1.0 (no ad competition) ... 0.6 (heavy ad competition)
  const push = position !== null && position >= 8 && position <= 20 ? 1.5 : 1; // already close to page 1
  return Math.round(volume * ease * push);
}
function readPlannerJson(): DemandItem[] {
  try {
    const rows = JSON.parse(fs.readFileSync(PLANNER_JSON, 'utf8')) as { keyword?: string; volume?: number | string; market?: string; comp?: number | string }[];
    const pos = gscPositions();
    const byConcept = new Map<string, { q: string; best: number; total: number; compSum: number; compW: number }>();
    for (const r of Array.isArray(rows) ? rows : []) {
      const volume = Number(r.volume) || 0;
      if (volume <= 0) continue;
      const market = String(r.market || 'us');
      const q = market === 'us' ? toQuestion(String(r.keyword || '')) : foreignToQuestion(String(r.keyword || ''));
      if (!q) continue;
      const k = conceptKey(q) || slugify(q);
      const cur = byConcept.get(k) || { q, best: 0, total: 0, compSum: 0, compW: 0 };
      cur.total += volume;
      if (volume > cur.best) { cur.best = volume; cur.q = q; }
      if (r.comp !== undefined && r.comp !== null && r.comp !== '') { cur.compSum += Number(r.comp) * volume; cur.compW += volume; }
      byConcept.set(k, cur);
    }
    const out: DemandItem[] = [];
    for (const [k, v] of byConcept) {
      const comp = v.compW ? v.compSum / v.compW : null;
      out.push({ ...seedFromQuestion(v.q), score: 1_000_000 + plannerPriority(v.total, comp, pos.get(k) ?? null), source: 'keyword-planner', volume: v.total });
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
