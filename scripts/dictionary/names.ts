/**
 * Native names per language, chosen by REAL search volume (data/keyword-planner.json).
 * Example: Brazilians search "mapa astral" ~201,000 times a month and "mapa natal" only ~4,400, so the Portuguese pages say "mapa astral".
 * Each group lists the ways a concept is called in one language. The most searched name wins (a tie keeps the first one listed).
 * A name is only swapped for another of the same gender, so "uma carta natal" never becomes "uma mapa astral".
 * Run:  npx tsx scripts/dictionary/names.ts   (writes data/term-names.json and fixes the pt/es texts of the published terms)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export type Lang = 'pt' | 'es';
export interface Variant { s: string; p?: string; g?: 'm' | 'f'; skip?: boolean; bad?: boolean } // skip: never chosen (other country / merged numbers); bad: a wrong leftover, always replaced
export interface Group { id: string; pt?: Variant[]; es?: Variant[] }

export const GROUPS: Group[] = [
  { id: 'natal chart',
    pt: [{ s: 'mapa astral', p: 'mapas astrais', g: 'm' }, { s: 'mapa natal', p: 'mapas natais', g: 'm' }, { s: 'carta natal', p: 'cartas natais', g: 'f', skip: true }, { s: 'carta astral', p: 'cartas astrais', g: 'f', skip: true }], // Brazil says "mapa"; Google merges the "carta" numbers, so they never win
    es: [{ s: 'carta astral', p: 'cartas astrales', g: 'f' }, { s: 'carta natal', p: 'cartas natales', g: 'f' }] },
  { id: 'north node', pt: [{ s: 'nodo norte', g: 'm' }, { s: 'nódulo norte', g: 'm', bad: true }] },
  { id: 'south node', pt: [{ s: 'nodo sul', g: 'm' }, { s: 'nódulo sul', g: 'm', bad: true }] },
  { id: 'imum coeli', es: [{ s: 'fondo del cielo', g: 'm' }, { s: 'imum coeli', g: 'm' }] },
  { id: 'conjunction', es: [{ s: 'conjunción', p: 'conjunciones', g: 'f' }, { s: 'conjunction', p: 'conjunctions', g: 'f', bad: true }] },
  { id: 'birth time', pt: [{ s: 'hora de nascimento', g: 'f' }, { s: 'horário de nascimento', g: 'm' }] },
];

const fold = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
const marketOf = (l: Lang) => l; // the n8n flow labels rows 'pt' | 'es' | 'en'

function volumes(): Record<Lang, Map<string, number>> {
  const out = { pt: new Map<string, number>(), es: new Map<string, number>() };
  try {
    const rows = JSON.parse(fs.readFileSync(path.join(root, 'data/keyword-planner.json'), 'utf8')) as { keyword?: string; volume?: number; market?: string }[];
    for (const r of rows) {
      const m = String(r.market || '');
      const l = (m === 'br' ? 'pt' : m === 'mx' ? 'es' : m) as Lang;
      if (l !== 'pt' && l !== 'es') continue;
      const k = fold(String(r.keyword || ''));
      out[l].set(k, Math.max(out[l].get(k) || 0, Number(r.volume) || 0));
    }
  } catch { /* no volume data: the first name listed is used */ }
  return out;
}

export interface Chosen { group: string; lang: Lang; name: string; volume: number; all: { name: string; volume: number }[] }
export function chooseNames(vol = volumes()): Chosen[] {
  const out: Chosen[] = [];
  for (const g of GROUPS) for (const lang of ['pt', 'es'] as Lang[]) {
    const vs = g[lang];
    if (!vs) continue;
    const scored = vs.filter((v) => !v.skip && !v.bad).map((v, i) => ({ v, i, volume: vol[lang].get(fold(v.s)) || 0 }));
    scored.sort((a, b) => b.volume - a.volume || a.i - b.i);
    out.push({ group: g.id, lang, name: scored[0].v.s, volume: scored[0].volume, all: scored.map((x) => ({ name: x.v.s, volume: x.volume })) });
  }
  return out;
}

/** Keeps the original capitalisation: "mapa natal" -> "mapa astral", "Mapa Natal" -> "Mapa Astral", "MAPA" -> "MAPA ASTRAL". */
function caseLike(src: string, to: string): string {
  if (src === src.toUpperCase() && src.length > 3) return to.toUpperCase();
  if (/^\p{Lu}/u.test(src)) {
    const titled = /\s\p{Lu}/u.test(src);
    const small = new Set(['de', 'del', 'da', 'do', 'das', 'dos', 'la', 'el', 'e', 'y']);
    return titled ? to.split(' ').map((w, i) => (i > 0 && small.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1))).join(' ') : to.charAt(0).toUpperCase() + to.slice(1);
  }
  return to;
}
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Replaces the less searched names with the most searched one inside a text. Returns the new text and how many swaps were made. */
const VOL = volumes();
function vol(lang: Lang, name: string): number { return VOL[lang].get(fold(name)) || 0; }
export function applyNames(text: string, lang: Lang, chosen = chooseNames()): { text: string; swaps: number } {
  let swaps = 0;
  let out = text;
  for (const c of chosen.filter((x) => x.lang === lang)) {
    const g = GROUPS.find((x) => x.id === c.group)!;
    const vs = g[lang]!;
    const win = vs.find((v) => v.s === c.name)!;
    for (const v of vs) {
      if (v.s === win.s || (v.g && win.g && v.g !== win.g)) continue;
      // Swap only for a clear gain (at least 1.5x more searches), or when the old name is a known mistake. Equal numbers = leave the text alone.
      const old = c.all.find((a) => a.name === v.s)?.volume ?? vol(lang, v.s);
      if (!v.bad && !(c.volume > old * 1.5)) continue;
      const pairs: [string, string][] = [[v.s, win.s]];
      if (v.p && win.p) pairs.unshift([v.p, win.p]);
      for (const [from, to] of pairs) {
        out = out.replace(new RegExp(`(?<![\\p{L}])${esc(from)}(?![\\p{L}])`, 'giu'), (m) => { swaps++; return caseLike(m, to); });
      }
    }
  }
  return { text: out, swaps };
}

const TEXT_KEYS = ['termo', 'perguntaGoogle', 'resumoUmaLinha', 'chamadaCuriosa', 'oQueSignifica', 'oQueSignificaNaAstrologia', 'exemploFicticio'];
/** Fixes the names inside the pt/es texts of one term (in place). Returns the number of swaps. */
export function applyNamesToTerm(term: any, chosen = chooseNames()): number {
  let n = 0;
  for (const lang of ['pt', 'es'] as Lang[]) {
    const tr = term?.traducoes?.[lang];
    if (!tr) continue;
    for (const k of TEXT_KEYS) if (typeof tr[k] === 'string') { const r = applyNames(tr[k], lang, chosen); tr[k] = r.text; n += r.swaps; }
    for (const f of tr.faq || []) for (const k of ['pergunta', 'resposta']) if (typeof f[k] === 'string') { const r = applyNames(f[k], lang, chosen); f[k] = r.text; n += r.swaps; }
  }
  return n;
}

/** A short hint for the translation prompt, so new terms are written with the names people really search. */
export function nameHint(chosen = chooseNames()): string {
  const parts = chosen.filter((c) => c.all.length > 1).map((c) => `${c.lang === 'pt' ? 'Portuguese' : 'Spanish'} "${c.group}" = "${c.name}"`);
  return parts.length ? ` Use these names, they are what people search: ${parts.join('; ')}.` : '';
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const chosen = chooseNames();
  fs.writeFileSync(path.join(root, 'data/term-names.json'), JSON.stringify({ updated: new Date().toISOString().slice(0, 10), names: chosen }, null, 2) + '\n');
  const file = path.join(root, 'src/data/dictionaryGenerated.json');
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const arr: any[] = Array.isArray(data) ? data : data.terms;
  let total = 0;
  for (const t of arr) total += applyNamesToTerm(t, chosen);
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
  console.log(`names: ${total} name swaps in ${arr.length} terms`);
  for (const c of chosen) console.log(`  ${c.lang} ${c.group}: ${c.all.map((a) => `${a.name} (${a.volume})`).join(' | ')} -> ${c.name}`);
}
void marketOf;
