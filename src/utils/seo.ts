export type SeoPage =
  | 'home'
  | 'blog'
  | 'article'
  | 'contact'
  | 'newsletter'
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

const SITE_URL = 'https://aurenstar.com';
const DEFAULT_DESCRIPTION =
  'Explore astrology in simple language with daily messages, zodiac guidance, and the Aurenstar astrology dictionary.';

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
  newsletter: {
    title: 'Aurenstar Astrology Newsletter',
    description: 'Receive thoughtful astrology guidance and new Aurenstar articles.',
    path: '/newsletter',
  },
  'daily-message': {
    title: 'Daily Astrology Message | Aurenstar',
    description: 'Receive a gentle, practical astrology message for your day.',
    path: '/daily-message',
  },
  'daily-reading-result': {
    title: 'Your Daily Astrology Reading | Aurenstar',
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
    title: 'Discover Your Zodiac Sign | Aurenstar',
    description: 'Find your zodiac sign and explore its personality, element, and guidance.',
    path: '/discover-sign',
  },
  'discover-sign-result': {
    title: 'Your Zodiac Sign | Aurenstar',
    description: 'Explore your zodiac sign and personalized guidance from Aurenstar.',
    path: '/discover-sign-result',
  },
  dictionary: {
    title: 'Astrology Dictionary | Aurenstar',
    description: 'Understand astrology terms in clear, welcoming language.',
    path: '/dictionary',
  },
  dicionario: {
    title: 'Astrology Dictionary | Aurenstar',
    description: 'Understand astrology terms in clear, welcoming language.',
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
    title: 'Describe Me | Aurenstar Astrology',
    description: 'Create a personal, playful astrology description designed to share.',
    path: '/descreva-me',
  },
  'describe-me-result': {
    title: 'Your Astrology Description | Aurenstar',
    description: 'Read and share your personalized Aurenstar astrology description.',
    path: '/descreva-me-result',
  },
};

function setMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

function setCanonical(url: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.rel = 'canonical';
    document.head.appendChild(element);
  }
  element.href = url;
}

function setStructuredData(data: Record<string, unknown>) {
  const id = 'aurenstar-seo-jsonld';
  document.getElementById(id)?.remove();
  const script = document.createElement('script');
  script.id = id;
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

export function updateSeo(page: SeoPage, options?: { articleId?: string; termSlug?: string }) {
  const copy = pageCopy[page] ?? pageCopy.home;
  const path =
    page === 'article' && options?.articleId
      ? `/blog/${encodeURIComponent(options.articleId)}`
      : page === 'dicionario-termo' && options?.termSlug
        ? `/dicionario/${encodeURIComponent(options.termSlug)}`
        : copy.path;
  const url = `${SITE_URL}${path}`;

  document.title = copy.title;
  setMeta('name', 'description', copy.description || DEFAULT_DESCRIPTION);
  setMeta('property', 'og:title', copy.title);
  setMeta('property', 'og:description', copy.description || DEFAULT_DESCRIPTION);
  setMeta('property', 'og:type', page === 'article' ? 'article' : 'website');
  setMeta('property', 'og:url', url);
  setMeta('name', 'twitter:title', copy.title);
  setMeta('name', 'twitter:description', copy.description || DEFAULT_DESCRIPTION);
  setCanonical(url);

  setStructuredData({
    '@context': 'https://schema.org',
    '@type': page === 'article' ? 'Article' : 'WebPage',
    name: copy.title,
    description: copy.description,
    url,
    isPartOf: { '@type': 'WebSite', name: 'Aurenstar', url: SITE_URL },
  });
}

