/**
 * Language addresses: /nl/blog, /ja/contact, /pt/blog ... show the same page in that language (so each language can be found on Google).
 * English keeps the normal addresses. Portuguese and Spanish use the hand-written texts; the other languages are translated.
 */
export const SITE_URL_LANGUAGES = ['pt', 'es'] as const;

/** Languages whose texts are translated for the visitor (no hand-written version). */
export const TRANSLATED_URL_LANGUAGES = [
  'de', 'fr', 'it', 'nl', 'ja', 'ko', 'zh', 'ru', 'tr', 'pl', 'ar', 'hi',
  'id', 'th', 'vi', 'sv', 'da', 'no', 'fi', 'el', 'he', 'uk', 'cs', 'ro',
  // second wave (every address is two letters): bg hu sk hr sr ca lt lv sl et ms bn ta te mr ur fa, plus tl = Filipino and tw = Traditional Chinese
  'bg', 'hu', 'sk', 'hr', 'sr', 'ca', 'lt', 'lv', 'sl', 'et', 'ms', 'bn', 'ta', 'te', 'mr', 'ur', 'fa', 'tl', 'tw',
] as const;

/** The real language tag when the two-letter address is not it (Google wants zh-TW and fil in hreflang; "tw" would mean Twi). */
const LANG_TAG: Record<string, string> = { tw: 'zh-TW', tl: 'fil' };
export const langTag = (code: string): string => LANG_TAG[code] || code;

/** Every language address: Portuguese, Spanish and the translated ones. */
export const URL_LANGUAGES = [...SITE_URL_LANGUAGES, ...TRANSLATED_URL_LANGUAGES] as const;

/** Country whose everyday references the article adaptation uses for each language address. */
export const URL_LANG_COUNTRY: Record<string, string> = {
  de: 'DE', fr: 'FR', it: 'IT', nl: 'NL', ja: 'JP', ko: 'KR', zh: 'CN', ru: 'RU', tr: 'TR', pl: 'PL', ar: 'SA', hi: 'IN',
  id: 'ID', th: 'TH', vi: 'VN', sv: 'SE', da: 'DK', no: 'NO', fi: 'FI', el: 'GR', he: 'IL', uk: 'UA', cs: 'CZ', ro: 'RO',
  bg: 'BG', hu: 'HU', sk: 'SK', hr: 'HR', sr: 'RS', ca: 'ES', lt: 'LT', lv: 'LV', sl: 'SI', et: 'EE', ms: 'MY', bn: 'BD', ta: 'IN', te: 'IN', mr: 'IN',
  ur: 'PK', fa: 'IR', tl: 'PH', tw: 'TW',
};

export const isUrlLanguage = (code: string): boolean => (URL_LANGUAGES as readonly string[]).includes(code);
export const isTranslatedLanguage = (code: string): boolean => (TRANSLATED_URL_LANGUAGES as readonly string[]).includes(code);
export const isSiteUrlLanguage = (code: string): boolean => (SITE_URL_LANGUAGES as readonly string[]).includes(code);

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
