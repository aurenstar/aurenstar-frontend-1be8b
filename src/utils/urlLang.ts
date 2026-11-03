/**
 * Language addresses: /nl/blog, /ja/contact ... show the same page in that language (so each language can be found on Google).
 * English, Portuguese and Spanish keep their normal addresses (their texts are written by hand and switched inside the page).
 */
export const URL_LANGUAGES = [
  'de', 'fr', 'it', 'nl', 'ja', 'ko', 'zh', 'ru', 'tr', 'pl', 'ar', 'hi',
  'id', 'th', 'vi', 'sv', 'da', 'no', 'fi', 'el', 'he', 'uk', 'cs', 'ro',
] as const;

/** Country whose everyday references the article adaptation uses for each language address. */
export const URL_LANG_COUNTRY: Record<string, string> = {
  de: 'DE', fr: 'FR', it: 'IT', nl: 'NL', ja: 'JP', ko: 'KR', zh: 'CN', ru: 'RU', tr: 'TR', pl: 'PL', ar: 'SA', hi: 'IN',
  id: 'ID', th: 'TH', vi: 'VN', sv: 'SE', da: 'DK', no: 'NO', fi: 'FI', el: 'GR', he: 'IL', uk: 'UA', cs: 'CZ', ro: 'RO',
};

export const isUrlLanguage = (code: string): boolean => (URL_LANGUAGES as readonly string[]).includes(code);

/** "/nl/blog" -> "nl"; anything else -> "". */
export function getUrlLang(pathname: string = typeof location !== 'undefined' ? location.pathname : ''): string {
  const m = /^\/([a-z]{2})(?:\/|$)/.exec(pathname);
  return m && isUrlLanguage(m[1]) ? m[1] : '';
}

/** "/nl/blog" -> "/blog", "/nl" -> "/". */
export function stripLangPrefix(pathname: string): string {
  const lang = getUrlLang(pathname);
  return lang ? pathname.slice(lang.length + 1) || '/' : pathname;
}

/** "/blog" -> "/nl/blog", "/" -> "/nl". Other kinds of addresses are returned unchanged. */
export function withLangPrefix(href: string, lang: string): string {
  if (!lang || !href.startsWith('/') || href.startsWith('//') || href.startsWith('/api/') || getUrlLang(href)) return href;
  if (href === '/') return `/${lang}`;
  return `/${lang}${href}`;
}

/**
 * On a language address, every address the app writes into the browser bar keeps the language
 * ("/blog/x" -> "/nl/blog/x"), so people and Google stay in that language while moving through the site.
 */
export function installLangHistory(): void {
  if (typeof window === 'undefined') return;
  const lang = getUrlLang();
  if (!lang) return;
  (['pushState', 'replaceState'] as const).forEach((method) => {
    const original = window.history[method].bind(window.history);
    window.history[method] = (state: any, title: string, url?: string | URL | null) =>
      original(state, title, typeof url === 'string' ? withLangPrefix(url, lang) : url);
  });
}
