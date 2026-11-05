/**
 * Pure astrology maths (no network, no clock): angles between planets, aspects, transits and compatibility.
 * Planet positions come from the Swiss Ephemeris engine; everything here only compares them.
 */

export type Longitudes = Record<string, number>; // planet name -> ecliptic longitude in degrees (0..360)

export interface AspectDef { type: string; angle: number; orb: number; harmony: number }

// Orb = how far from the exact angle still counts. Harmony: +1 flowing, -1 tense, 0 neutral/strong.
export const ASPECTS: AspectDef[] = [
  { type: 'conjunction', angle: 0, orb: 8, harmony: 0.6 },
  { type: 'sextile', angle: 60, orb: 5, harmony: 0.7 },
  { type: 'square', angle: 90, orb: 7, harmony: -0.8 },
  { type: 'trine', angle: 120, orb: 7, harmony: 1 },
  { type: 'quincunx', angle: 150, orb: 3, harmony: -0.3 },
  { type: 'opposition', angle: 180, orb: 8, harmony: -0.5 },
];

const LUMINARIES = new Set(['sun', 'moon']);
const SLOW = new Set(['jupiter', 'saturn', 'uranus', 'neptune', 'pluto']);

export const norm360 = (x: number) => ((x % 360) + 360) % 360;

/** Shortest distance between two longitudes: always 0..180. */
export function separation(a: number, b: number): number {
  const d = Math.abs(norm360(a) - norm360(b)) % 360;
  return d > 180 ? 360 - d : d;
}

export interface FoundAspect { a: string; b: string; type: string; orb: number; exact: number; harmony: number; strength: number }

/** The aspect (if any) formed by two longitudes. `tight` shrinks the orb (used for the fast-moving daily sky). */
export function aspectBetween(lonA: number, lonB: number, nameA = '', nameB = '', tight = 1): Omit<FoundAspect, 'a' | 'b'> | null {
  const sep = separation(lonA, lonB);
  let best: Omit<FoundAspect, 'a' | 'b'> | null = null;
  for (const def of ASPECTS) {
    let max = def.orb * tight;
    if (LUMINARIES.has(nameA) || LUMINARIES.has(nameB)) max += 1 * tight;
    const orb = Math.abs(sep - def.angle);
    if (orb <= max) {
      const strength = Math.round((1 - orb / max) * 100) / 100;
      if (!best || orb < best.orb) best = { type: def.type, orb: Math.round(orb * 100) / 100, exact: def.angle, harmony: def.harmony, strength };
    }
  }
  return best;
}

/** Every aspect between two sets of planets (e.g. sky today vs. birth chart, or person A vs. person B). */
export function aspectsBetween(setA: Longitudes, setB: Longitudes, opts: { tight?: number; skipSame?: boolean } = {}): FoundAspect[] {
  const out: FoundAspect[] = [];
  for (const [na, la] of Object.entries(setA)) {
    for (const [nb, lb] of Object.entries(setB)) {
      if (opts.skipSame && na === nb && la === lb) continue;
      const found = aspectBetween(la, lb, na, nb, opts.tight ?? 1);
      if (found) out.push({ a: na, b: nb, ...found });
    }
  }
  return out.sort((x, y) => x.orb - y.orb);
}

/** Transits: how today's planets touch a person's birth chart. Slow planets matter most. */
export function transitsToNatal(today: Longitudes, natal: Longitudes) {
  const found = aspectsBetween(today, natal, { tight: 0.6 });
  const weight = (name: string) => (SLOW.has(name) ? 3 : name === 'mars' || name === 'sun' ? 2 : name === 'moon' ? 1 : 1.5);
  return found
    .map((f) => ({ transit: f.a, natal: f.b, type: f.type, orb: f.orb, harmony: f.harmony, strength: f.strength, importance: Math.round(f.strength * weight(f.a) * 100) / 100 }))
    .sort((x, y) => y.importance - x.importance);
}

// ---------- compatibility (synastry) ----------

const PAIR_WEIGHT: Record<string, number> = {
  'sun|moon': 3, 'moon|sun': 3, 'sun|sun': 2, 'moon|moon': 2.5, 'venus|mars': 3, 'mars|venus': 3, 'venus|venus': 2, 'mars|mars': 1.5,
  'sun|venus': 2, 'venus|sun': 2, 'moon|venus': 2.5, 'venus|moon': 2.5, 'mercury|mercury': 2.5, 'sun|mercury': 1.5, 'mercury|sun': 1.5,
  'moon|mercury': 2, 'mercury|moon': 2, 'sun|mars': 1.5, 'mars|sun': 1.5, 'moon|mars': 1.5, 'mars|moon': 1.5, 'venus|mercury': 1.5, 'mercury|venus': 1.5,
  'saturn|sun': 1.5, 'sun|saturn': 1.5, 'saturn|moon': 1.5, 'moon|saturn': 1.5, 'saturn|venus': 1.5, 'venus|saturn': 1.5,
};
const AREAS: Record<string, string[]> = {
  love: ['venus', 'mars', 'moon', 'sun'],
  mind: ['mercury', 'sun', 'moon'],
  emotions: ['moon', 'venus', 'saturn'],
  energy: ['sun', 'mars', 'jupiter'],
};

export interface Compatibility {
  score: number; // 0..100 overall
  areas: Record<keyof typeof AREAS, number>;
  aspects: FoundAspect[];
  strongest: FoundAspect[];
  challenges: FoundAspect[];
}

function scoreOf(list: FoundAspect[], pick?: (a: FoundAspect) => boolean): number {
  let total = 0;
  let weight = 0;
  for (const f of list) {
    if (pick && !pick(f)) continue;
    const w = (PAIR_WEIGHT[`${f.a}|${f.b}`] ?? 1) * f.strength;
    // tense aspects are not "bad": they bring attraction and growth, so they only subtract a little
    const value = f.harmony >= 0 ? f.harmony : 0.15 * f.harmony;
    total += value * w;
    weight += w;
  }
  if (weight === 0) return 50;
  // map the average (-0.2..1) to 35..95, so nobody gets an insulting 0%
  const avg = total / weight;
  return Math.max(30, Math.min(97, Math.round(48 + avg * 50)));
}

export function compatibility(a: Longitudes, b: Longitudes): Compatibility {
  const pickPlanets = (s: Longitudes) => Object.fromEntries(Object.entries(s).filter(([k]) => ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'].includes(k)));
  const aspects = aspectsBetween(pickPlanets(a), pickPlanets(b));
  const areas = {} as Compatibility['areas'];
  for (const [area, planets] of Object.entries(AREAS)) {
    areas[area as keyof typeof AREAS] = scoreOf(aspects, (f) => planets.includes(f.a) && planets.includes(f.b));
  }
  const score = Math.round(scoreOf(aspects) * 0.5 + (areas.love + areas.mind + areas.emotions + areas.energy) / 4 * 0.5);
  return {
    score,
    areas,
    aspects,
    strongest: aspects.filter((f) => f.harmony > 0).sort((x, y) => (PAIR_WEIGHT[`${y.a}|${y.b}`] ?? 1) * y.strength - (PAIR_WEIGHT[`${x.a}|${x.b}`] ?? 1) * x.strength).slice(0, 3),
    challenges: aspects.filter((f) => f.harmony < 0).sort((x, y) => (PAIR_WEIGHT[`${y.a}|${y.b}`] ?? 1) * y.strength - (PAIR_WEIGHT[`${x.a}|${x.b}`] ?? 1) * x.strength).slice(0, 2),
  };
}

/** Plain sign-level element harmony (fire/air and earth/water get along). */
const ELEMENT = ['fire', 'earth', 'air', 'water'];
export const elementOf = (lon: number) => ELEMENT[Math.floor(norm360(lon) / 30) % 4];
