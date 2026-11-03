/**
 * Automatic quality checks for a dictionary term written by the generator.
 * A term is published only if it passes EVERY check, so nothing reaches the site without being checked.
 */
import type { DictionaryTerm } from '../../src/data/astrologyDictionaryData';

export const CATEGORIES = ['Planets & Bodies', 'Chart Concepts', 'Signs & Elements', 'Phases & Movements'] as const;
const FORBIDDEN = /\b(AI|A\.I\.)\b|artificial intelligence|chatgpt|openai|language model|as an ai|machine learning|\bGPT\b/i;
const RISKY = /\b(cure[sd]?|diagnos\w+|guarantee[sd]?|will definitely|is certain to|invest(?:ment)? advice|stop taking|medication|lawsuit|you will die)\b/i;
const MOJIBAKE = /[�]|Ã.|â€/;

const words = (s: string) => s.trim().split(/\s+/).filter(Boolean);
const sentences = (s: string) => s.split(/(?<=[.!?])\s+/).filter((x) => x.trim().length > 0);

/** Simple-words check: short sentences and short words on average. */
export function readability(text: string) {
  const w = words(text);
  const s = sentences(text);
  const avgSentence = w.length / Math.max(1, s.length);
  const avgWord = w.join('').replace(/[^A-Za-z]/g, '').length / Math.max(1, w.length);
  return { avgSentence, avgWord };
}

export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/, '');
}

export function validateTerm(t: Partial<DictionaryTerm>, existing: { id: string; slug: string }[]): string[] {
  const p: string[] = [];
  const need = (k: keyof DictionaryTerm) => {
    const v = t[k];
    if (typeof v !== 'string' || !v.trim()) p.push(`missing ${String(k)}`);
  };
  (['id', 'slug', 'termo', 'tituloSEO', 'perguntaGoogle', 'icone', 'resumoUmaLinha', 'explicacaoEducativa', 'chamadaCuriosa', 'oQueSignifica', 'oQueSignificaNaAstrologia', 'exemploFicticio', 'dicaRapida'] as const).forEach(need);
  if (p.length) return p;

  if (!CATEGORIES.includes(t.categoria as any)) p.push('invalid categoria');
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(t.slug!) || t.slug!.length < 8 || t.slug!.length > 80) p.push('bad slug');
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(t.id!)) p.push('bad id');
  if (existing.some((e) => e.slug === t.slug || e.id === t.id)) p.push('slug or id already exists');

  const len = (k: keyof DictionaryTerm, min: number, max: number) => {
    const n = String(t[k]).trim().length;
    if (n < min || n > max) p.push(`${String(k)} length ${n} (needs ${min}-${max})`);
  };
  len('tituloSEO', 20, 70);
  len('perguntaGoogle', 10, 90);
  len('resumoUmaLinha', 30, 160);
  len('explicacaoEducativa', 40, 220);
  len('oQueSignifica', 140, 800);
  len('oQueSignificaNaAstrologia', 140, 900);
  len('exemploFicticio', 90, 600);
  len('dicaRapida', 20, 170);

  const mj = t.miniJogo;
  if (!mj || !mj.pergunta || !Array.isArray(mj.opcoes) || mj.opcoes.length < 2 || mj.opcoes.length > 4) p.push('miniJogo needs a question and 2-4 options');
  else {
    if (mj.opcoes.filter((o) => o.correta).length !== 1) p.push('miniJogo needs exactly one correct option');
    if (mj.opcoes.some((o) => !o.texto || !o.explicacao)) p.push('miniJogo option without text or explanation');
  }
  if (!Array.isArray(t.faq) || t.faq.length < 2 || t.faq.length > 5 || t.faq.some((f) => !f.pergunta || !f.resposta)) p.push('faq needs 2-5 complete items');

  const all = JSON.stringify(t);
  if (FORBIDDEN.test(all)) p.push('mentions AI / the writer tool');
  if (RISKY.test(all)) p.push('contains a risky claim (cure, guarantee, medical...)');
  if (MOJIBAKE.test(all)) p.push('broken characters');
  if (/\b(you|your)\b.*\bwill\b.*\b(die|divorce|get rich)\b/i.test(all)) p.push('predicts a fixed future');

  const body = [t.oQueSignifica, t.oQueSignificaNaAstrologia, t.exemploFicticio].join(' ');
  const r = readability(body);
  if (r.avgSentence > 26) p.push(`sentences too long (avg ${r.avgSentence.toFixed(1)} words)`);
  if (r.avgWord > 5.7) p.push(`words too hard (avg ${r.avgWord.toFixed(1)} letters)`);
  return p;
}
