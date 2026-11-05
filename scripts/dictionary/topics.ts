/**
 * The endless list of questions. Part 1: every combination people really search for (planet in sign, planet in
 * house, aspects between planets, rising signs) = ~500 questions, built by rule, no one has to type them.
 * Part 2 (in generate.ts): when those run low, the model suggests fresh questions and they are appended to the queue file.
 */
export interface Seed { term: string; question: string; category: 'Planets & Bodies' | 'Chart Concepts' | 'Signs & Elements' | 'Phases & Movements'; icon?: string }

const SIGNS: [string, string][] = [['Aries', '♈'], ['Taurus', '♉'], ['Gemini', '♊'], ['Cancer', '♋'], ['Leo', '♌'], ['Virgo', '♍'], ['Libra', '♎'], ['Scorpio', '♏'], ['Sagittarius', '♐'], ['Capricorn', '♑'], ['Aquarius', '♒'], ['Pisces', '♓']];
const PLANETS: [string, string, string][] = [['Sun', 'the Sun', '☀️'], ['Moon', 'the Moon', '🌙'], ['Mercury', 'Mercury', '💬'], ['Venus', 'Venus', '💖'], ['Mars', 'Mars', '🔥'], ['Jupiter', 'Jupiter', '🌟'], ['Saturn', 'Saturn', '⏳'], ['Uranus', 'Uranus', '⚡'], ['Neptune', 'Neptune', '🌊'], ['Pluto', 'Pluto', '🔮']];
const ASPECTS: [string, string][] = [['conjunct', 'conjunction'], ['opposite', 'opposition'], ['square', 'square'], ['trine', 'trine'], ['sextile', 'sextile']];
const ordinal = (n: number) => `${n}${n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th'}`;

export function ruleBasedTopics(): Seed[] {
  const out: Seed[] = [];
  for (const [p, pp, icon] of PLANETS) for (const [s, si] of SIGNS) out.push({ term: `${p} in ${s}`, question: `What does ${pp} in ${s} mean?`, category: 'Planets & Bodies', icon: si });
  for (const [p, pp, icon] of PLANETS) for (let h = 1; h <= 12; h++) out.push({ term: `${p} in the ${ordinal(h)} House`, question: `What does ${pp} in the ${ordinal(h)} house mean?`, category: 'Planets & Bodies', icon });
  for (let i = 0; i < PLANETS.length; i++) for (let j = i + 1; j < PLANETS.length; j++) for (const [verb, name] of ASPECTS)
    out.push({ term: `${PLANETS[i][0]} ${name} ${PLANETS[j][0]}`, question: `What does ${PLANETS[i][1]} ${verb} ${PLANETS[j][1]} mean in astrology?`, category: 'Chart Concepts', icon: '📐' });
  for (const [s, si] of SIGNS) out.push({ term: `${s} Rising`, question: `What does ${s} rising mean?`, category: 'Chart Concepts', icon: si });
  // interleave so every run mixes topics instead of finishing one family first
  const groups = new Map<string, Seed[]>();
  out.forEach((t) => { const k = t.question.includes('house') ? 'h' : t.category === 'Chart Concepts' && t.question.includes('aspects') ? 'a' : t.question.includes('rising') ? 'r' : 's'; (groups.get(k) || groups.set(k, []).get(k)!).push(t); });
  const lists = [...groups.values()];
  const mixed: Seed[] = [];
  for (let i = 0; lists.some((l) => i < l.length); i++) lists.forEach((l) => l[i] && mixed.push(l[i]));
  return mixed;
}
