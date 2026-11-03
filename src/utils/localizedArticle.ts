import type { BlogArticleContent } from '../data/blogArticles';

/** Country version of an article as returned by /api/localize. */
export interface LocalizedArticle {
  category: string;
  title: string;
  subtitle: string;
  quote: string;
  imageCaption: string;
  sections: { heading: string; paragraphs: string[] }[];
  keyTakeaways: string[];
}

export interface LocalizedResponse {
  success: boolean;
  country?: string;
  language?: string;
  rtl?: boolean;
  article?: LocalizedArticle;
}

type Lang = 'pt' | 'en' | 'es';

/**
 * Puts the country version on top of the original article, in the language slot the page is reading
 * (so the page keeps using `article.title[lang]` everywhere). Sizes that do not match are ignored (safe fallback).
 */
export function applyLocalized(base: BlogArticleContent, lang: Lang, loc: LocalizedArticle): BlogArticleContent {
  if (!loc || !loc.title || loc.sections?.length !== base.sections.length) return base;
  const put = <T extends Record<Lang, any>>(obj: T | undefined, value: any): T | undefined =>
    obj && value ? ({ ...obj, [lang]: value } as T) : obj;
  return {
    ...base,
    category: put(base.category, loc.category) as BlogArticleContent['category'],
    title: put(base.title, loc.title) as BlogArticleContent['title'],
    subtitle: put(base.subtitle, loc.subtitle) as BlogArticleContent['subtitle'],
    quote: put(base.quote, loc.quote) as BlogArticleContent['quote'],
    imageCaption: put(base.imageCaption, loc.imageCaption) as BlogArticleContent['imageCaption'],
    sections: base.sections.map((s, i) => {
      const ls = loc.sections[i];
      if (!ls || ls.paragraphs?.length !== s.paragraphs.length) return s;
      return {
        heading: put(s.heading, ls.heading) as typeof s.heading,
        paragraphs: s.paragraphs.map((p, j) => put(p, ls.paragraphs[j]) as typeof p),
      };
    }),
    keyTakeaways:
      base.keyTakeaways && loc.keyTakeaways?.length === (base.keyTakeaways[lang] || []).length
        ? ({ ...base.keyTakeaways, [lang]: loc.keyTakeaways } as BlogArticleContent['keyTakeaways'])
        : base.keyTakeaways,
  };
}
