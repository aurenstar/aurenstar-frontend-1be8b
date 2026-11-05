import { BLOG_ARTICLES, type BlogArticleContent } from '../data/blogArticles';

/**
 * Blog categories that have their own URL: /blog/categoria/<slug>
 * `key` is the internal category value stored in BLOG_ARTICLES (category.pt).
 */
export interface BlogCategory {
  key: string;
  slug: string;
  name: { en: string; pt: string; es: string };
  description: string; // English, used for SEO
}

export const BLOG_CATEGORIES: BlogCategory[] = [
  {
    key: 'ASTROLOGIA',
    slug: 'astrology',
    name: { en: 'Astrology', pt: 'Astrologia', es: 'Astrología' },
    description: 'Beginner-friendly astrology articles that explain planets, houses and signs in plain language.',
  },
  {
    key: 'HORÓSCOPO',
    slug: 'horoscope',
    name: { en: 'Horoscope', pt: 'Horóscopo', es: 'Horóscopo' },
    description: 'Horoscope readings and gentle guidance to reflect on your day, week and month.',
  },
  {
    key: 'FASES DA LUA',
    slug: 'moon-phases',
    name: { en: 'Moon Phases', pt: 'Fases da Lua', es: 'Fases Lunares' },
    description: 'What each Moon phase means and how to use its rhythm for rest, focus and fresh starts.',
  },
  {
    key: 'BEM-ESTAR',
    slug: 'wellness',
    name: { en: 'Wellness', pt: 'Bem-Estar', es: 'Bienestar' },
    description: 'Calm, practical wellness and self-reflection ideas inspired by astrology.',
  },
  {
    key: 'GUIA DOS SIGNOS',
    slug: 'zodiac-guide',
    name: { en: 'Zodiac Guide', pt: 'Guia dos Signos', es: 'Guía Zodiacal' },
    description: 'Guides to the zodiac signs: personality, element, strengths and relationships.',
  },
];

/** A category page is only indexed by Google once it has enough articles to be worth a listing. */
export const MIN_ARTICLES_TO_INDEX = 3;

export const getCategoryBySlug = (slug?: string): BlogCategory | undefined =>
  slug ? BLOG_CATEGORIES.find((c) => c.slug === slug.trim().toLowerCase()) : undefined;

export const getCategoryByKey = (key?: string): BlogCategory | undefined =>
  key ? BLOG_CATEGORIES.find((c) => c.key === key) : undefined;

export const getCategoryPath = (key: string): string => {
  const category = getCategoryByKey(key);
  return category ? `/blog/categoria/${category.slug}` : '/blog';
};

export const getArticlesInCategory = (key: string): BlogArticleContent[] =>
  BLOG_ARTICLES.filter((article) => article.category.pt === key);
