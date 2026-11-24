import { SIGNS_DATA, type SignInfo } from '../data/signsData';

/** Addresses of the sign hub pages (en /signs/gemini, pt /pt/signos/gemeos, es /es/signos/geminis) and which sign an article is about. */
export type HubLang = 'en' | 'pt' | 'es';
const fold = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
const slugOf = (s: string) => fold(s).replace(/[^a-z0-9]+/g, '-');

export const hubSlug = (s: SignInfo, lang: HubLang) => slugOf(s.name[lang]);
export const hubUrlPath = (s: SignInfo, lang: HubLang) => (lang === 'en' ? `/signs/${hubSlug(s, 'en')}` : `/${lang}/signos/${hubSlug(s, lang)}`);

/** The sign an article is about: the one named first in its English title (null if none, e.g. "Zodiac Compatibility..."). */
export function signForTitle(titleEn: string): SignInfo | null {
  const t = fold(titleEn);
  let best: { s: SignInfo; at: number } | null = null;
  for (const s of Object.values(SIGNS_DATA)) {
    const m = new RegExp(`\\b${fold(s.name.en)}\\b`).exec(t);
    if (m && (!best || m.index < best.at)) best = { s, at: m.index };
  }
  return best ? best.s : null;
}

/** Text of the link that goes from an article back to its sign page. */
export const hubLinkLabel = (name: string, lang: HubLang) =>
  lang === 'pt' ? `Tudo sobre ${name}: personalidade, datas e todos os artigos`
    : lang === 'es' ? `Todo sobre ${name}: personalidad, fechas y todos los artículos`
      : `Everything about ${name}: personality, dates and all articles`;
