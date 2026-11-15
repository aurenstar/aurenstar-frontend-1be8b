/** The wave plan (data/native-plan.json): which languages are open today, and how fast the robot may write. */
import plan from '../../data/native-plan.json';

export interface Wave { from: string; name: string; langs: string[]; perLang: number; maxPerDay: number }
export interface Plan { paused?: boolean; waves: Wave[] }
export interface Active { name: string; langs: string[]; perLang: number; maxPerDay: number; paused: boolean }

/** The latest wave whose date has come, with the languages of all earlier waves too. Before the first wave: nothing is open. */
export function activeWave(p: Plan = plan as Plan, today = new Date().toISOString().slice(0, 10)): Active {
  const come = [...p.waves].filter((w) => w.from <= today).sort((a, b) => a.from.localeCompare(b.from));
  if (!come.length) return { name: 'none', langs: [], perLang: 0, maxPerDay: 0, paused: !!p.paused };
  const last = come[come.length - 1];
  return { name: last.name, langs: [...new Set(come.flatMap((w) => w.langs))], perLang: last.perLang, maxPerDay: last.maxPerDay, paused: !!p.paused };
}
