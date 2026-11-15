/**
 * INTERNAL report for the robot (never shown on the site): what is working, what is not, and what is going on.
 * Reads the published terms, Search Console (what people typed and where we showed up) and the Keyword Planner volumes.
 * Writes data/dictionary-report.json (the robot reads it) and data/dictionary-report.md (easy to read, in Portuguese).
 * The robot uses it in one small way: categories that get seen more get a slightly higher priority (x0.8 to x1.3).
 * Limit: Search Console data here has the search words but not the page, so a term is matched by what people typed.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { conceptKey, toQuestion, foreignToQuestion, categoryFor } from './demand';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const read = (f: string) => { try { return JSON.parse(fs.readFileSync(path.join(root, f), 'utf8')); } catch { return null; } };

export type Verdict = 'funcionando' | 'quase' | 'aparecendo' | 'sem-dados';
export interface EntryReport { slug: string; termo: string; categoria: string; impressoes: number; cliques: number; melhorPosicao: number | null; buscasMensaisNoMundo: number; veredito: Verdict }
export interface CategoryReport { categoria: string; termos: number; impressoes: number; cliques: number; impressoesPorTermo: number; boost: number }

export function verdictFor(imp: number, clicks: number, pos: number | null): Verdict {
  if (clicks > 0 || (pos !== null && pos <= 10 && imp >= 10)) return 'funcionando';
  if (pos !== null && pos > 10 && pos <= 20 && imp >= 3) return 'quase';
  if (imp > 0) return 'aparecendo';
  return 'sem-dados';
}
/** 0.8 .. 1.3 from how often a category's terms are seen compared with all published terms. Needs enough data, otherwise 1. */
export function boostFor(catPerTerm: number, allPerTerm: number, terms: number, impressions: number): number {
  if (terms < 3 || impressions < 50 || allPerTerm <= 0) return 1;
  return Math.round(Math.min(1.3, Math.max(0.8, catPerTerm / allPerTerm)) * 100) / 100;
}

export function buildReport() {
  const terms: any[] = (() => { const d = read('src/data/dictionaryGenerated.json'); return Array.isArray(d) ? d : d?.terms || []; })();
  const gsc: { query?: string; clicks?: number; impressions?: number; position?: number }[] = read('data/search-console.json') || [];
  const planner: { keyword?: string; volume?: number; market?: string }[] = read('data/keyword-planner.json') || [];
  const byKey = new Map<string, any>();
  for (const t of terms) byKey.set(conceptKey(t.perguntaGoogle || t.termo), t);
  const stats = new Map<string, { imp: number; clk: number; pos: number | null; vol: number }>();
  const slot = (k: string) => { if (!stats.has(k)) stats.set(k, { imp: 0, clk: 0, pos: null, vol: 0 }); return stats.get(k)!; };
  for (const r of gsc) {
    const q = toQuestion(String(r.query || '')) || foreignToQuestion(String(r.query || ''));
    const k = q ? conceptKey(q) : '';
    if (!k || !byKey.has(k)) continue;
    const s = slot(k);
    s.imp += Number(r.impressions) || 0;
    s.clk += Number(r.clicks) || 0;
    const p = Number(r.position) || 0;
    if (p && (s.pos === null || p < s.pos)) s.pos = p;
  }
  for (const r of planner) {
    const m = String(r.market || 'en');
    const q = m === 'us' || m === 'en' ? toQuestion(String(r.keyword || '')) : foreignToQuestion(String(r.keyword || ''));
    const k = q ? conceptKey(q) : '';
    if (k && byKey.has(k)) slot(k).vol += Number(r.volume) || 0;
  }
  const entries: EntryReport[] = terms.map((t) => {
    const s = stats.get(conceptKey(t.perguntaGoogle || t.termo)) || { imp: 0, clk: 0, pos: null, vol: 0 };
    return { slug: t.slug, termo: t.termo, categoria: t.categoria || categoryFor(t.perguntaGoogle || t.termo), impressoes: s.imp, cliques: s.clk, melhorPosicao: s.pos, buscasMensaisNoMundo: s.vol, veredito: verdictFor(s.imp, s.clk, s.pos) };
  });
  const allImp = entries.reduce((a, e) => a + e.impressoes, 0);
  const allPerTerm = entries.length ? allImp / entries.length : 0;
  const cats = new Map<string, CategoryReport>();
  for (const e of entries) {
    const c = cats.get(e.categoria) || { categoria: e.categoria, termos: 0, impressoes: 0, cliques: 0, impressoesPorTermo: 0, boost: 1 };
    c.termos++; c.impressoes += e.impressoes; c.cliques += e.cliques;
    cats.set(e.categoria, c);
  }
  const categorias = [...cats.values()].map((c) => {
    const per = c.impressoes / c.termos;
    return { ...c, impressoesPorTermo: Math.round(per * 10) / 10, boost: boostFor(per, allPerTerm, c.termos, c.impressoes) };
  });
  const count = (v: Verdict) => entries.filter((e) => e.veredito === v).length;
  return {
    updated: new Date().toISOString().slice(0, 10),
    resumo: { termosPublicados: entries.length, funcionando: count('funcionando'), quase: count('quase'), aparecendo: count('aparecendo'), semDados: count('sem-dados'), impressoes: allImp, cliques: entries.reduce((a, e) => a + e.cliques, 0) },
    categorias,
    termos: entries.sort((a, b) => b.impressoes - a.impressoes || b.buscasMensaisNoMundo - a.buscasMensaisNoMundo),
  };
}

export function toMarkdown(r: ReturnType<typeof buildReport>): string {
  const L: string[] = [`# Relatório interno do dicionário (${r.updated})`, '', '_Só para o robô e para a equipe. Não aparece no site._', ''];
  const s = r.resumo;
  L.push(`**${s.termosPublicados} verbetes publicados** · ✅ funcionando: ${s.funcionando} · 🟡 quase na página 1: ${s.quase} · 👀 aparecendo: ${s.aparecendo} · ⏳ sem dados ainda: ${s.semDados}`, `Aparições no Google: ${s.impressoes} · Cliques: ${s.cliques}`, '', '## Por assunto', '', '| Assunto | Verbetes | Aparições | Cliques | Peso do robô |', '|---|---|---|---|---|');
  for (const c of r.categorias) L.push(`| ${c.categoria} | ${c.termos} | ${c.impressoes} | ${c.cliques} | x${c.boost} |`);
  const show = (title: string, v: Verdict, n = 10) => {
    const list = r.termos.filter((e) => e.veredito === v).slice(0, n);
    if (!list.length) return;
    L.push('', `## ${title}`, '');
    for (const e of list) L.push(`- ${e.termo}: ${e.impressoes} aparições, ${e.cliques} cliques${e.melhorPosicao ? `, melhor posição ${e.melhorPosicao}` : ''}${e.buscasMensaisNoMundo ? `, ~${e.buscasMensaisNoMundo} buscas/mês no mundo` : ''}`);
  };
  show('✅ O que está funcionando', 'funcionando');
  show('🟡 Quase lá (posições 11 a 20: um empurrãozinho pode levar à página 1)', 'quase');
  show('👀 Aparecendo, mas ainda sem força', 'aparecendo');
  const waiting = r.termos.filter((e) => e.veredito === 'sem-dados' && e.buscasMensaisNoMundo > 0).sort((a, b) => b.buscasMensaisNoMundo - a.buscasMensaisNoMundo).slice(0, 10);
  if (waiting.length) { L.push('', '## ⏳ Muito procurados, mas o Google ainda não mostra a gente', ''); for (const e of waiting) L.push(`- ${e.termo}: ~${e.buscasMensaisNoMundo} buscas/mês no mundo`); }
  L.push('', '_Limite: o Search Console guardado aqui traz as palavras buscadas, não a página. Cada verbete é ligado pelo que as pessoas digitaram._', '');
  return L.join('\n');
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const r = buildReport();
  fs.writeFileSync(path.join(root, 'data/dictionary-report.json'), JSON.stringify(r, null, 2) + '\n');
  fs.writeFileSync(path.join(root, 'data/dictionary-report.md'), toMarkdown(r));
  console.log('report:', JSON.stringify(r.resumo), '| boosts:', r.categorias.map((c) => `${c.categoria} x${c.boost}`).join(', '));
}
