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

/** Words that are not about astrology (Google's AI, shoes, diseases...). Left out of the demand count. */
const NOT_ASTROLOGY = /gemini|gemeni|gèminis|mediamarkt|new ?balance|cancer(?!ian)|hodgkin|melanom|\bsein\b|mc$|^mc |lion$|square|canceru|\bgbm\b|colon|pancreas|nike|adidas|iphone|samsung|jordan|tv na/i;
export interface Goals { buscasPorMes: number; cauteloso: number; medido: number; otimista: number; metas: { share: string; cauteloso: number; medido: number; otimista: number }[] }
/** Monthly searches worldwide for the words we measured, and the visits that 0.05% and 0.5% of them would mean. Each word is capped (50k / 100k) so one huge word cannot inflate it. */
export function visitGoals(rows: { keyword?: string; volume?: number }[]): Goals {
  const sum = (cap: number) => rows.reduce((a, r) => (NOT_ASTROLOGY.test(String(r.keyword || '')) ? a : a + Math.min(Number(r.volume) || 0, cap)), 0);
  const medido = sum(50_000), otimista = sum(100_000), cauteloso = Math.round(medido / 1.65);
  const at = (pct: number) => ({ cauteloso: Math.round(cauteloso * pct), medido: Math.round(medido * pct), otimista: Math.round(otimista * pct) });
  return { buscasPorMes: medido, cauteloso, medido, otimista, metas: [{ share: '0,05%', ...at(0.0005) }, { share: '0,5%', ...at(0.005) }] };
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
  const worldRows: { keyword?: string; volume?: number }[] = read('data/keyword-planner-world.json') || [];
  const metas = visitGoals([...planner, ...worldRows]);
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
    metas,
    categorias,
    termos: entries.sort((a, b) => b.impressoes - a.impressoes || b.buscasMensaisNoMundo - a.buscasMensaisNoMundo),
  };
}

export function toMarkdown(r: ReturnType<typeof buildReport>): string {
  const L: string[] = [`# Relatório interno do dicionário (${r.updated})`, '', '_Só para o robô e para a equipe. Não aparece no site._', ''];
  const s = r.resumo;
  L.push(`**${s.termosPublicados} verbetes publicados** · ✅ funcionando: ${s.funcionando} · 🟡 quase na página 1: ${s.quase} · 👀 aparecendo: ${s.aparecendo} · ⏳ sem dados ainda: ${s.semDados}`, `Aparições no Google: ${s.impressoes} · Cliques: ${s.cliques}`, '', '## Por assunto', '', '| Assunto | Verbetes | Aparições | Cliques | Peso do robô |', '|---|---|---|---|---|');
  for (const c of r.categorias) L.push(`| ${c.categoria} | ${c.termos} | ${c.impressoes} | ${c.cliques} | x${c.boost} |`);
  const g = r.metas;
  const n = (x: number) => x.toLocaleString('pt-BR');
  L.push('', '## 🎯 Metas de visitas por mês (se o site aparecer para uma fatia das buscas medidas)', '', `Buscas por mês nas palavras medidas (43 idiomas, sem o que não é astrologia): cauteloso ~${n(g.cauteloso)} · medido ~${n(g.medido)} · otimista ~${n(g.otimista)}`, '', '| Fatia | Cauteloso | Medido | Otimista |', '|---|---|---|---|');
  for (const m of g.metas) L.push(`| ${m.share} | ${n(m.cauteloso)} visitas | ${n(m.medido)} visitas | ${n(m.otimista)} visitas |`);
  L.push('', `Cliques reais no Google hoje: ${s.cliques}. Compare com a linha de 0,05% para ver quanto falta.`);
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
