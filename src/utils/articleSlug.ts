import { BLOG_ARTICLES, BlogArticleContent } from '../data/blogArticles';

/**
 * Keyword URLs for blog articles.
 *
 * The article `id` ("post-1", "post-aries"...) is internal and stays untouched,
 * so every existing component keeps working. The public URL uses a slug derived
 * from the English title (the site default language). Old id-based URLs are
 * still resolved by `findArticleByParam`, and redirected to the slug URL.
 */

const MAX_SLUG_LENGTH = 70;

export function slugify(text: string): string {
  const base = text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (base.length <= MAX_SLUG_LENGTH) return base;
  const cut = base.slice(0, MAX_SLUG_LENGTH);
  const lastDash = cut.lastIndexOf('-');
  return (lastDash > 30 ? cut.slice(0, lastDash) : cut).replace(/-+$/, '');
}

/**
 * Addresses that must never change even if the title is edited (pages already indexed by Google).
 * The slug normally comes from the English title, so changing a title would move the page and the old address would return 404.
 */
const FIXED_SLUGS: Record<string, string> = {
  'wp-443': 'gemini-red-flags-behaviors-people-often-misread',
};

const slugById = new Map<string, string>();
const idBySlug = new Map<string, string>();

for (const article of BLOG_ARTICLES) {
  let slug = FIXED_SLUGS[article.id] || slugify(article.title.en) || article.id;
  // Guarantee uniqueness if two titles ever collapse into the same slug.
  if (idBySlug.has(slug)) slug = `${slug}-${slugify(article.id)}`;
  slugById.set(article.id, slug);
  idBySlug.set(slug, article.id);
}

export function getArticleSlug(article: Pick<BlogArticleContent, 'id'>): string {
  return slugById.get(article.id) ?? article.id;
}

export function getArticleSlugById(id: string): string {
  return slugById.get(id) ?? id;
}

/** Accepts either a public slug or a legacy internal id. */
export function findArticleByParam(param: string): BlogArticleContent | undefined {
  const clean = decodeURIComponent(param || '').trim().toLowerCase();
  if (!clean) return undefined;
  const id = idBySlug.get(clean) ?? BLOG_ARTICLES.find((a) => a.id.toLowerCase() === clean)?.id;
  return id ? BLOG_ARTICLES.find((a) => a.id === id) : undefined;
}

const MONTHS: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

/** "Oct 04, 2026" (EN display date) -> "2026-10-04". Returns undefined if unparseable. */
export function getArticleIsoDate(article: BlogArticleContent): string | undefined {
  const match = /^([A-Za-z]{3})[a-z]*\s+(\d{1,2}),\s*(\d{4})$/.exec(article.date.en.trim());
  if (!match) return undefined;
  const month = MONTHS[match[1].toLowerCase()];
  if (month === undefined) return undefined;
  const date = new Date(Date.UTC(Number(match[3]), month, Number(match[2])));
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString().slice(0, 10);
}
