import { FEATURES } from '../data/features';
import { ASTROLOGY_DICTIONARY_TERMS, getDictionaryTermBySlug } from '../data/astrologyDictionaryData';
import { BLOG_ARTICLES } from '../data/blogArticles';
import { findArticleByParam, getArticleIsoDate, getArticleSlug } from './articleSlug';
import { MIN_ARTICLES_TO_INDEX, getArticlesInCategory, getCategoryBySlug } from './blogCategories';

/**
 * Pure SEO data (no DOM access).
 *
 * Used by:
 *  - src/utils/seo.ts            -> applies it to <head> in the browser on navigation
 *  - scripts/prerender.ts        -> bakes it into the static HTML of every route at build time
 * so the HTML that crawlers and link-preview bots receive is identical to what the
 * browser would set later.
 */

export type SeoPage =
  | 'home'
  | 'blog'
  | 'article'
  | 'contact'
  | 'credits'
  | 'privacy'
  | 'terms'
  | 'compatibility'
  | 'transits'
  | 'newsletter'
  | 'admin'
  | 'daily-message'
  | 'daily-reading-result'
  | 'aureneffect'
  | 'aureneffect-result'
  | 'discover-sign'
  | 'discover-sign-result'
  | 'dictionary'
  | 'dicionario'
  | 'dicionario-termo'
  | 'about-detail'
  | 'describe-me'
  | 'describe-me-result';

export interface SeoOptions {
  articleId?: string; // accepts a public slug or a legacy id
  termSlug?: string;
  aboutSection?: string;
  categorySlug?: string; // blog category (page 'blog' + categorySlug -> /blog/categoria/<slug>)
}

export interface SeoData {
  title: string;
  description: string;
  path: string;
  url: string;
  robots: 'index,follow' | 'noindex,follow';
  ogType: 'website' | 'article';
  image: string;
  locale: string;
  lang: string; // value for <html lang>
  publishedTime?: string;
  jsonLd: Record<string, unknown>;
}

export const SITE_URL = 'https://aurenstar.com';
export const SITE_NAME = 'Aurenstar';
/** Own images are stored as paths ("/assets/..."); search engines and social networks need the full address. */
const absoluteUrl = (u: string) => (u.startsWith('/') ? `${SITE_URL}${u}` : u);

export const DEFAULT_IMAGE = `${SITE_URL}/og-aurenstar.png`;
const LOGO_URL = `${SITE_URL}/assets/aurenstar-logo-v2.png`;

const DEFAULT_DESCRIPTION =
  'Explore astrology in simple language with daily messages, zodiac guidance, and the Aurenstar astrology dictionary.';

/** Pages that must not be indexed: personal results and the internal editorial panel. */
const NOINDEX_PAGES = new Set<SeoPage>([
  'daily-reading-result',
  'aureneffect-result',
  'discover-sign-result',
  'describe-me-result',
  'dictionary',
  'admin',
]);

export const ABOUT_SECTIONS: Record<string, { title: string; description: string }> = {
  platform: {
    title: 'What Aurenstar Actually Offers | About Aurenstar',
    description:
      'Aurenstar brings astrology into one calm, practical space. Each area has a clear purpose, so you can choose the kind of help you need.',
  },
  method: {
    title: 'A Clear Path From Sign to Insight | About Aurenstar',
    description:
      'The experience starts with information you can understand and ends with an idea you can apply. Every reading is a starting point for your own perspective.',
  },
  mission: {
    title: 'Astrology With Clarity and Responsibility | About Aurenstar',
    description:
      'Aurenstar exists to make astrology feel useful and welcoming without promising certainty. The goal is to support reflection, not to decide your life for you.',
  },
};

const pageCopy: Record<SeoPage, { title: string; description: string; path: string }> = {
  home: {
    title: 'Aurenstar | Simple Astrology, Daily Guidance & Zodiac Insights',
    description: DEFAULT_DESCRIPTION,
    path: '/',
  },
  blog: {
    title: 'Astrology Blog | Aurenstar',
    description: 'Practical astrology articles, zodiac insights, and simple explanations from Aurenstar.',
    path: '/blog',
  },
  article: {
    title: 'Astrology Article | Aurenstar',
    description: 'Read an accessible astrology guide from Aurenstar.',
    path: '/blog',
  },
  contact: { title: 'Contact Aurenstar', description: 'Get in touch with the Aurenstar team.', path: '/contact' },
  credits: {
    title: 'Tools & Credits | Aurenstar',
    description: 'The scientific tools and open data behind Aurenstar: Swiss Ephemeris, IANA Time Zone Database and GeoNames.',
    path: '/credits',
  },
  compatibility: {
    title: 'Zodiac Compatibility Calculator | Aurenstar',
    description: 'Enter two birth dates and see how well two people match in love, talking, feelings and energy, in simple words.',
    path: '/compatibility',
  },
  transits: {
    title: 'Your Sky Today: Daily Transits | Aurenstar',
    description: 'See how today’s planets touch your birth chart, and which planets are moving backward, explained in simple words.',
    path: '/transits',
  },
  privacy: { title: 'Privacy Policy | Aurenstar', description: 'How Aurenstar handles your data, cookies and privacy choices.', path: '/privacy' },
  terms: { title: 'Terms of Service | Aurenstar', description: 'The simple rules for using Aurenstar astrology tools and content.', path: '/terms' },
  admin: { title: 'Admin | Aurenstar', description: 'Owner-only panel.', path: '/admin' },
  newsletter: {
    title: 'Aurenstar Newsletter | Astrology News & New Articles',
    description: 'Subscribe to get new astrology articles, tips and Aurenstar news in your inbox.',
    path: '/newsletter',
  },
  'daily-message': {
    title: 'Aurendaily | Personalized Daily Astrology',
    description: 'Receive a gentle, practical astrology message for your day.',
    path: '/daily-message',
  },
  'daily-reading-result': {
    title: 'Aurendaily Reading | Aurenstar',
    description: 'Your personalized daily astrology reflection from Aurenstar.',
    path: '/daily-reading-result',
  },
  aureneffect: {
    title: 'Discover Your Auren Effect | Aurenstar',
    description: 'Explore a personalized reflection inspired by your birth details and intentions.',
    path: '/aureneffect',
  },
  'aureneffect-result': {
    title: 'Your Auren Effect Reading | Aurenstar',
    description: 'Explore your personalized Auren Effect reading.',
    path: '/aureneffect-result',
  },
  'discover-sign': {
    title: 'Sign Calculator | Discover Your Sign',
    description: 'Find your zodiac sign and explore its personality, element, and guidance.',
    path: '/discover-sign',
  },
  'discover-sign-result': {
    title: 'Sign Calculator Result | Aurenstar',
    description: 'Explore your zodiac sign and personalized guidance from Aurenstar.',
    path: '/discover-sign-result',
  },
  dictionary: {
    title: 'Aurenstar Dictionary | Astrology Terms',
    description: 'Understand astrology terms in clear, welcoming language.',
    path: '/dictionary',
  },
  dicionario: {
    title: 'Astrology Dictionary: What Every Term Means | Aurenstar',
    description:
      'Find out what Mercury retrograde, Rising sign, Full Moon and other astrology terms mean, explained in simple words with everyday examples.',
    path: '/dicionario',
  },
  'dicionario-termo': {
    title: 'Astrology Term | Aurenstar Dictionary',
    description: 'Learn what an astrology term means in simple language.',
    path: '/dicionario',
  },
  'about-detail': {
    title: 'About Aurenstar | Simple Astrology Tools',
    description: 'Learn how Aurenstar daily messages, sign discovery, astrology dictionary, and blog work.',
    path: '/about',
  },
  'describe-me': {
    title: 'Aurenstar Unfiltered | Personalized Astrology Description',
    description: 'Create a personal, playful Aurenstar Unfiltered astrology description designed to share.',
    path: '/descreva-me',
  },
  'describe-me-result': {
    title: 'Aurenstar Unfiltered Result | Aurenstar',
    description: 'Read and share your personalized Aurenstar Unfiltered astrology description.',
    path: '/descreva-me-result',
  },
};

/** Every static route (no params). Used by the prerender and sitemap scripts. */
export const STATIC_ROUTES: SeoPage[] = ([
  'home',
  'blog',
  'contact',
  'credits',
  'privacy',
  'terms',
  'compatibility',
  'transits',
  'newsletter',
  'admin',
  'daily-message',
  'daily-reading-result',
  'aureneffect',
  'aureneffect-result',
  'discover-sign',
  'discover-sign-result',
  'dictionary',
  'dicionario',
  'describe-me',
  'describe-me-result',
] as SeoPage[]).filter((p) => (p !== 'compatibility' || FEATURES.compatibility) && (p !== 'transits' || FEATURES.transits));

export function truncate(text: string, max = 158): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 80 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.-]+$/, '')}…`;
}

/** Appends the brand only when the whole title still fits a search-result line (~65 chars). */
function withBrand(title: string): string {
  const branded = `${title} | ${SITE_NAME}`;
  return branded.length <= 65 ? branded : title;
}

const ORGANIZATION = {
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: { '@type': 'ImageObject', url: LOGO_URL, width: 2172, height: 724 },
};

const WEBSITE = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: ['en', 'pt', 'es'],
  publisher: { '@id': `${SITE_URL}/#organization` },
};

function breadcrumb(items: { name: string; url: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function getSeoData(page: SeoPage, options: SeoOptions = {}): SeoData {
  const copy = pageCopy[page] ?? pageCopy.home;

  let title = copy.title;
  let description = copy.description || DEFAULT_DESCRIPTION;
  let path = copy.path;
  let robots: SeoData['robots'] = NOINDEX_PAGES.has(page) ? 'noindex,follow' : 'index,follow';
  let ogType: SeoData['ogType'] = 'website';
  let image = DEFAULT_IMAGE;
  let locale = 'en_US';
  let lang = 'en';
  let publishedTime: string | undefined;
  let pageNode: Record<string, unknown> | undefined;
  const extraNodes: Record<string, unknown>[] = [];
  let crumbs: { name: string; url: string }[] | undefined;

  if (page === 'article') {
    const article = options.articleId ? findArticleByParam(options.articleId) : undefined;
    if (article) {
      const slug = getArticleSlug(article);
      title = withBrand(article.title.en);
      description = truncate(article.subtitle.en);
      path = `/blog/${slug}`;
      ogType = 'article';
      image = absoluteUrl(article.image);
      publishedTime = getArticleIsoDate(article);
      const url = `${SITE_URL}${path}`;
      pageNode = {
        '@type': 'Article',
        '@id': `${url}#article`,
        headline: article.title.en,
        description,
        image: [absoluteUrl(article.image)],
        ...(publishedTime ? { datePublished: publishedTime, dateModified: publishedTime } : {}),
        author: { '@type': 'Organization', name: article.author.name || SITE_NAME, url: SITE_URL },
        publisher: { '@id': `${SITE_URL}/#organization` },
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        articleSection: article.category.en,
        inLanguage: 'en',
        isPartOf: { '@id': `${SITE_URL}/#website` },
      };
      crumbs = [
        { name: 'Home', url: SITE_URL },
        { name: 'Blog', url: `${SITE_URL}/blog` },
        { name: article.title.en, url },
      ];
    } else {
      // Unknown article: never let this soft-404 get indexed.
      robots = 'noindex,follow';
      path = '/blog';
    }
  } else if (page === 'dicionario-termo') {
    const term = options.termSlug ? getDictionaryTermBySlug(options.termSlug) : undefined;
    if (term) {
      title = withBrand(term.tituloSEO);
      // The one-line summary is often too short for a search snippet; extend it with the explanation.
      const summary = term.resumoUmaLinha || '';
      description = truncate(
        summary.length < 110 && term.explicacaoEducativa
          ? `${summary} ${term.explicacaoEducativa}`
          : summary || term.explicacaoEducativa
      );
      path = `/dicionario/${term.slug}`;
      const url = `${SITE_URL}${path}`;
      pageNode = {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: term.tituloSEO,
        description,
        inLanguage: 'en',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        mainEntity: {
          '@type': 'DefinedTerm',
          name: term.termo,
          description: truncate(term.oQueSignifica || term.resumoUmaLinha, 300),
          url,
          inDefinedTermSet: {
            '@type': 'DefinedTermSet',
            '@id': `${SITE_URL}/dicionario#termset`,
            name: 'Aurenstar Astrology Dictionary',
            url: `${SITE_URL}/dicionario`,
          },
        },
      };
      // FAQPage markup: the same questions and answers are shown on the page (see PublicDictionaryTermPage).
      if (term.faq && term.faq.length > 0) {
        extraNodes.push({
          '@type': 'FAQPage',
          '@id': `${url}#faq`,
          mainEntity: term.faq.map((f) => ({ '@type': 'Question', name: f.pergunta, acceptedAnswer: { '@type': 'Answer', text: f.resposta } })),
        });
      }
      crumbs = [
        { name: 'Home', url: SITE_URL },
        { name: 'Dictionary', url: `${SITE_URL}/dicionario` },
        { name: term.termo, url },
      ];
    } else {
      robots = 'noindex,follow';
      path = '/dicionario';
    }
  } else if (page === 'about-detail') {
    title = 'About Aurenstar | Clear, Gentle Astrology You Can Use';
    description = 'Meet Aurenstar: five free astrology tools, a real sky calculation with the Swiss Ephemeris and simple, kind language in English, Portuguese and Spanish.';
    path = '/about';
    crumbs = [
      { name: 'Home', url: SITE_URL },
      { name: 'About', url: `${SITE_URL}${path}` },
    ];
  } else if (page === 'blog') {
    const category = getCategoryBySlug(options.categorySlug);
    let listed = BLOG_ARTICLES;
    crumbs = [
      { name: 'Home', url: SITE_URL },
      { name: 'Blog', url: `${SITE_URL}/blog` },
    ];
    if (category) {
      listed = getArticlesInCategory(category.key);
      title = `${category.name.en} Articles | Aurenstar Blog`;
      description = category.description;
      path = `/blog/categoria/${category.slug}`;
      // Thin category pages stay reachable for visitors but are kept out of Google until they grow.
      if (listed.length < MIN_ARTICLES_TO_INDEX) robots = 'noindex,follow';
      crumbs.push({ name: category.name.en, url: `${SITE_URL}${path}` });
    } else if (options.categorySlug) {
      robots = 'noindex,follow'; // unknown category
    }
    const listUrl = `${SITE_URL}${path}`;
    pageNode = {
      '@type': 'CollectionPage',
      '@id': `${listUrl}#webpage`,
      url: listUrl,
      name: title,
      description,
      inLanguage: 'en',
      isPartOf: { '@id': `${SITE_URL}/#website` },
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: listed.map((article, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: article.title.en,
          url: `${SITE_URL}/blog/${getArticleSlug(article)}`,
        })),
      },
    };
  } else if (page === 'dicionario') {
    crumbs = [
      { name: 'Home', url: SITE_URL },
      { name: 'Dictionary', url: `${SITE_URL}/dicionario` },
    ];
    pageNode = {
      '@type': 'CollectionPage',
      '@id': `${SITE_URL}/dicionario#webpage`,
      url: `${SITE_URL}/dicionario`,
      name: title,
      description,
      inLanguage: 'en',
      isPartOf: { '@id': `${SITE_URL}/#website` },
      mainEntity: { '@id': `${SITE_URL}/dicionario#termset` },
    };
    extraNodes.push({
      '@type': 'DefinedTermSet',
      '@id': `${SITE_URL}/dicionario#termset`,
      name: 'Aurenstar Astrology Dictionary',
      url: `${SITE_URL}/dicionario`,
      inLanguage: 'en',
      hasDefinedTerm: ASTROLOGY_DICTIONARY_TERMS.map((term) => ({
        '@type': 'DefinedTerm',
        name: term.termo,
        url: `${SITE_URL}/dicionario/${term.slug}`,
      })),
    });
  }

  const url = path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`;

  if (!pageNode) {
    pageNode = {
      '@type': page === 'blog' ? 'CollectionPage' : 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: title,
      description,
      isPartOf: { '@id': `${SITE_URL}/#website` },
    };
  }

  const graph: Record<string, unknown>[] = [ORGANIZATION, WEBSITE, pageNode, ...extraNodes];
  if (crumbs) graph.push(breadcrumb(crumbs));

  return {
    title,
    description,
    path,
    url,
    robots,
    ogType,
    image,
    locale,
    lang,
    publishedTime,
    jsonLd: { '@context': 'https://schema.org', '@graph': graph },
  };
}
