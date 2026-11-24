import data from '../data/localizedSlugs.json';

/**
 * Public addresses of some articles in Portuguese and Spanish (/pt/blog/caracteristicas-de-touro-..., not the English slug).
 * Only articles listed in src/data/localizedSlugs.json have one. The old English address keeps working: it redirects (301) to the new one.
 * NEVER remove an entry once published: the address is already known to Google.
 */
type Lang = 'pt' | 'es';
const MAP = data as Record<string, Partial<Record<Lang, string>>>;
const REV: Record<Lang, Record<string, string>> = { pt: {}, es: {} };
for (const [en, o] of Object.entries(MAP)) for (const l of ['pt', 'es'] as const) if (o[l]) REV[l][o[l] as string] = en;

const isLang = (l: string): l is Lang => l === 'pt' || l === 'es';

/** English slug -> slug in that language (null if the article has none). */
export const enToLocal = (lang: string, enSlug: string): string | null => (isLang(lang) ? MAP[enSlug]?.[lang] || null : null);
/** Slug in that language -> English slug (null if it is not a localized slug). */
export const localToEn = (lang: string, slug: string): string | null => (isLang(lang) ? REV[lang][slug] || null : null);
/** "/blog/<english slug>" -> "/blog/<slug in lang>" when the article has one; any other path is returned unchanged. */
export function localizeBlogPath(pagePath: string, lang: string): string {
  const m = /^\/blog\/([^/]+)$/.exec(pagePath);
  const l = m ? enToLocal(lang, m[1]) : null;
  return l ? `/blog/${l}` : pagePath;
}
