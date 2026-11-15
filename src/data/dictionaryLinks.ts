/**
 * Links from a dictionary page (verbete) to the free tools and to blog articles that talk about the same thing.
 * Pure helpers: no network, no AI. The tool is picked by what the term is about; articles by shared meaningful words.
 */
import { BLOG_ARTICLES } from './blogArticles';

export type ToolRoute = 'daily-message' | 'aureneffect' | 'discover-sign' | 'transits' | 'compatibility' | 'describe-me';
type Lang = 'en' | 'pt' | 'es';
export interface ToolLink { rota: ToolRoute; nome: Record<Lang, string> }

const TOOLS: Record<'sign' | 'sky' | 'pair' | 'chart' | 'daily', ToolLink> = {
  sign: { rota: 'discover-sign', nome: { en: 'Sign Calculator', pt: 'Calculadora de Signo', es: 'Calculadora de Signo' } },
  sky: { rota: 'transits', nome: { en: 'Your Sky Today', pt: 'Seu Céu de Hoje', es: 'Tu Cielo de Hoy' } },
  pair: { rota: 'compatibility', nome: { en: 'Compatibility', pt: 'Compatibilidade', es: 'Compatibilidad' } },
  chart: { rota: 'describe-me', nome: { en: 'Aurenstar Unfiltered', pt: 'Aurenstar Unfiltered', es: 'Aurenstar Unfiltered' } },
  daily: { rota: 'daily-message', nome: { en: "Read Today's Daily Message", pt: 'Ler a Mensagem do Dia', es: 'Leer el Mensaje del Día' } },
};

const SIGNS = /\b(aries|taurus|gemini|cancer|leo|virgo|libra|scorpio|sagittarius|capricorn|aquarius|pisces|ophiuchus|sign|signs|element|cusp|decan|sun sign)\b/;
const SKY = /\b(retrograde|transit|transits|moon|eclipse|return|progression|progressions|mercury|venus|mars|jupiter|saturn|uranus|neptune|pluto|chiron|node|lilith|planet)\b/;
const PAIR = /\b(synastry|composite|davison|compatib\w*)\b/;
const CHART = /\b(chart|house|houses|ascendant|rising|descendant|midheaven|imum|coeli|aspect|aspects|conjunction|opposition|square|trine|sextile|quincunx|stellium|yod|cross|rectangle|kite|birth|fortune|degree)\b/;

/** Picks the most useful free tool for a term (by its English name/slug). */
export function toolForTerm(termEn: string, slug = ''): ToolLink {
  const s = `${termEn} ${slug.replace(/-/g, ' ')}`.toLowerCase();
  if (PAIR.test(s)) return TOOLS.pair;
  if (SIGNS.test(s) && !SKY.test(s) && !CHART.test(s)) return TOOLS.sign;
  if (CHART.test(s) && !/\b(retrograde|return|eclipse)\b/.test(s)) return TOOLS.chart;
  if (SKY.test(s)) return TOOLS.sky;
  if (SIGNS.test(s)) return TOOLS.sign;
  return TOOLS.daily;
}

const STOP = new Set(['what', 'is', 'are', 'does', 'do', 'mean', 'means', 'meaning', 'a', 'an', 'the', 'in', 'on', 'of', 'to', 'and', 'for', 'how', 'why', 'your', 'my', 'it', 'astrology', 'astrological', 'zodiac', 'sign', 'signs', 'chart', 'this', 'that', 'with', 'from', 'about', 'house', 'birth', 'time', 'month', 'moon', 'planet', 'planets']);
const words = (t: string) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w));

/** Up to `limit` blog articles whose title shares meaningful words with the term (best first). Empty when nothing really matches. */
export function relatedArticlesFor(termEn: string, slug = '', limit = 3): string[] {
  const key = new Set(words(`${termEn} ${slug.replace(/-/g, ' ')}`));
  if (!key.size) return [];
  return BLOG_ARTICLES
    .map((a) => {
      const hay = new Set(words(`${a.title.en} ${a.subtitle?.en || ''} ${a.title.pt} ${a.title.es}`));
      let score = 0;
      for (const w of key) if (hay.has(w)) score += 1;
      return { id: a.id, score };
    })
    .filter((x) => x.score >= 1)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.id);
}
