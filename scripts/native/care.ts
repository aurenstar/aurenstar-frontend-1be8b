/**
 * Weekly care of the native articles (only for the robot and the team, never shown on the site):
 * 1) Reads what Google shows for each article (data/search-console.json: the searches that contain the article's search words).
 * 2) Writes the semaphore: data/native-report.json and data/native-report.md.
 * 3) With --apply: improves the title and description of pages that appear but are not clicked, (nothing is ever retired, hidden or deleted: pages with no sign after 120 days are only flagged in the report).
 *   npx tsx scripts/native/care.ts [--apply]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fold, checkArticle, type NativeArticle } from '../../server/engine/nativeArticle';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIR = path.join(root, 'data/native-articles');
const TERMS = path.join(root, 'data/native-terms');
const APPLY = process.argv.includes('--apply');
const KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
const TODAY = new Date().toISOString().slice(0, 10);

/** Days without any sign before a page is only FLAGGED in the report (nothing is hidden or deleted: Google needs months to trust new pages). */
export const RETIRE_DAYS = 120;
export type NativeVerdict = 'novo' | 'funcionando' | 'aparece-sem-clique' | 'aparecendo' | 'sem-sinal';
export interface Stats { impressions: number; clicks: number; position: number | null }
type Row = { query?: string; clicks?: number; impressions?: number; position?: number };

export function statsFor(keyword: string, rows: Row[]): Stats {
  const k = fold(keyword);
  const st: Stats = { impressions: 0, clicks: 0, position: null };
  for (const r of rows) {
    if (!fold(String(r.query || '')).includes(k)) continue;
    st.impressions += Number(r.impressions) || 0;
    st.clicks += Number(r.clicks) || 0;
    const p = Number(r.position) || 0;
    if (p && (st.position === null || p < st.position)) st.position = p;
  }
  return st;
}

/** New: under 21 days, Google needs time. Working: clicks, or page 1 with some views. Seen but not clicked: 100+ views and under 1% clicks. No sign: nothing after 120 days. */
export function verdictOf(st: Stats, ageDays: number): NativeVerdict {
  if (ageDays < 21) return 'novo';
  if (st.clicks >= 3 || (st.position !== null && st.position <= 10 && st.impressions >= 30)) return 'funcionando';
  if (st.impressions >= 100 && st.clicks / st.impressions < 0.01) return 'aparece-sem-clique';
  if (st.impressions > 0) return 'aparecendo';
  return ageDays >= RETIRE_DAYS ? 'sem-sinal' : 'aparecendo';
}

const days = (from: string) => Math.floor((Date.parse(TODAY) - Date.parse(from)) / 86400000);
const file = (a: NativeArticle) => path.join(a.kind === 'term' ? TERMS : DIR, a.lang, `${a.slug}.json`);
const loadDir = (dir: string, kind?: 'term'): NativeArticle[] => (fs.existsSync(dir) ? fs.readdirSync(dir).flatMap((l) => fs.readdirSync(path.join(dir, l)).filter((f) => f.endsWith('.json')).map((f) => ({ ...JSON.parse(fs.readFileSync(path.join(dir, l, f), 'utf8')), ...(kind ? { kind } : {}) }) as NativeArticle)) : []);

async function betterMeta(a: NativeArticle): Promise<{ title: string; description: string } | null> {
  if (!KEY) return null;
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}` },
    body: JSON.stringify({ model: MODEL, response_format: { type: 'json_object' }, messages: [{ role: 'user', content: `This ${a.lang} astrology article shows up on Google for "${a.keyword}" but people rarely click. Write a clearer, more inviting title (max 70 characters) and meta description (110 to 160 characters) in the same language. Keep the exact search words "${a.keyword}" in the title. Be honest: promise only what the article gives, no clickbait, no emojis.\nCurrent title: ${a.title}\nCurrent description: ${a.description}\nIntro: ${a.intro.slice(0, 500)}\nReturn ONLY JSON {"title":"","description":""}` }] }),
  });
  if (!res.ok) return null;
  const j: any = JSON.parse(String((await res.json() as any)?.choices?.[0]?.message?.content || '{}'));
  const next = { ...a, title: String(j.title || ''), description: String(j.description || '') };
  return checkArticle(next).length || next.title === a.title ? null : { title: next.title, description: next.description };
}

async function main() {
  const rows: Row[] = fs.existsSync(path.join(root, 'data/search-console.json')) ? JSON.parse(fs.readFileSync(path.join(root, 'data/search-console.json'), 'utf8')) : [];
  const articles: NativeArticle[] = [...loadDir(DIR), ...loadDir(TERMS, 'term')];
  const out: { lang: string; slug: string; busca: string; buscasPorMes: number; dias: number; impressions: number; clicks: number; position: number | null; veredito: NativeVerdict; acao?: string }[] = [];
  for (const a of articles) {
    const st = statsFor(a.keyword, rows);
    const v = a.retired ? 'sem-sinal' : verdictOf(st, days(a.date));
    let action = '';
    if (APPLY && v === 'aparece-sem-clique' && (!a.metaRewrittenAt || days(a.metaRewrittenAt) >= 30)) {
      const m = await betterMeta(a).catch(() => null);
      if (m) { Object.assign(a, m, { metaRewrittenAt: TODAY }); fs.writeFileSync(file(a), JSON.stringify(a, null, 1) + '\n'); action = 'título e descrição melhorados'; }
    }
    out.push({ lang: a.lang, slug: `${a.kind === 'term' ? 'dicionario/' : ''}${a.slug}`, busca: a.keyword, buscasPorMes: a.volume, dias: days(a.date), ...st, veredito: v, acao: action || undefined });
  }
  const count = (v: NativeVerdict) => out.filter((e) => e.veredito === v).length;
  const perLang = new Map<string, { n: number; imp: number; clk: number }>();
  for (const e of out) { const c = perLang.get(e.lang) || { n: 0, imp: 0, clk: 0 }; c.n++; c.imp += e.impressions; c.clk += e.clicks; perLang.set(e.lang, c); }
  const report = { updated: TODAY, resumo: { artigos: out.length, novos: count('novo'), funcionando: count('funcionando'), apareceSemClique: count('aparece-sem-clique'), aparecendo: count('aparecendo'), semSinal: count('sem-sinal'), impressoes: out.reduce((a, e) => a + e.impressions, 0), cliques: out.reduce((a, e) => a + e.clicks, 0) }, idiomas: [...perLang].map(([lang, c]) => ({ lang, artigos: c.n, impressoes: c.imp, cliques: c.clk })).sort((a, b) => b.impressoes - a.impressoes), artigos: out.sort((a, b) => b.impressions - a.impressions) };
  fs.writeFileSync(path.join(root, 'data/native-report.json'), JSON.stringify(report, null, 1) + '\n');
  const s = report.resumo;
  const L = [`# Artigos e verbetes nativos: semáforo (${TODAY})`, '', '_Só para o robô e para a equipe. Não aparece no site._', '', `**${s.artigos} artigos** · 🆕 novos (menos de 3 semanas): ${s.novos} · ✅ funcionando: ${s.funcionando} · 👀 aparecendo: ${s.aparecendo} · 🟡 aparece mas ninguém clica: ${s.apareceSemClique} · ⛔ sem sinal: ${s.semSinal}`, `Aparições no Google: ${s.impressoes} · Cliques: ${s.cliques}`, '', '## Por idioma', '', '| Idioma | Artigos | Aparições | Cliques |', '|---|---|---|---|', ...report.idiomas.map((i) => `| ${i.lang} | ${i.artigos} | ${i.impressoes} | ${i.cliques} |`)];
  const show = (title: string, v: NativeVerdict) => { const l = report.artigos.filter((e) => e.veredito === v).slice(0, 15); if (l.length) L.push('', `## ${title}`, '', ...l.map((e) => `- ${e.lang}/${e.slug} ("${e.busca}"): ${e.impressions} aparições, ${e.clicks} cliques${e.position ? `, melhor posição ${Math.round(e.position)}` : ''}${e.acao ? ` → ${e.acao}` : ''}`)); };
  show('✅ O que está funcionando', 'funcionando'); show('🟡 Aparece, mas ninguém clica (o robô melhora título e descrição)', 'aparece-sem-clique'); show(`⛔ Sem sinal depois de ${RETIRE_DAYS} dias (só um aviso: a página continua no ar)`, 'sem-sinal');
  L.push('', '_O Search Console guardado aqui traz as buscas, não a página: cada artigo é ligado pelas buscas que contêm as palavras dele._', '');
  fs.writeFileSync(path.join(root, 'data/native-report.md'), L.join('\n'));
  console.log('native care:', JSON.stringify(report.resumo));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) await main();
