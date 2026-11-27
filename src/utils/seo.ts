import { getSeoData, SITE_NAME } from './seoData';
import { getUrlLang } from './urlLang';
import { translateUi } from './uiTranslate';
import type { SeoOptions, SeoPage } from './seoData';

export type { SeoPage, SeoOptions } from './seoData';

function setMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

function removeMeta(attribute: 'name' | 'property', key: string) {
  document.head.querySelector(`meta[${attribute}="${key}"]`)?.remove();
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

/**
 * Applies the same SEO data that the build step (scripts/prerender.ts) bakes into
 * the static HTML, so client-side navigation keeps the <head> in sync.
 */
export function updateSeo(page: SeoPage, options?: SeoOptions) {
  const seo = getSeoData(page, options);

  // A main page with its own native text (written for that country): the server already put the right title, description, keywords and
  // address in the head, so the browser must not replace them with the English/translated ones. Moving to another page clears the mark.
  const nativeMark = document.head.querySelector<HTMLMetaElement>('meta[name="native-page"]');
  if (nativeMark) {
    const lg = getUrlLang();
    const here = (lg ? window.location.pathname.slice(lg.length + 1) : window.location.pathname).replace(/\/+$/, '') || '/';
    if (nativeMark.content === here) { setStructuredData(seo.jsonLd); return; }
    nativeMark.remove();
  }

  document.title = seo.title;
  document.documentElement.lang = seo.lang;
  setMeta('name', 'description', seo.description);
  setMeta('name', 'robots', seo.robots);
  const urlLang = getUrlLang();
  if (urlLang) document.documentElement.lang = urlLang;
  // Language address: the canonical address is the one of that language (https://aurenstar.com/nl/blog).
  const here = urlLang ? seo.url.replace(/^(https?:\/\/[^/]+)(\/.*)?$/, (_m, origin, rest) => `${origin}/${urlLang}${rest && rest !== '/' ? rest : ''}`) : seo.url;
  setCanonical(here);

  setMeta('property', 'og:site_name', SITE_NAME);
  setMeta('property', 'og:locale', seo.locale);
  setMeta('property', 'og:type', seo.ogType);
  setMeta('property', 'og:title', seo.title);
  setMeta('property', 'og:description', seo.description);
  setMeta('property', 'og:url', here);
  setMeta('property', 'og:image', seo.image);

  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:title', seo.title);
  setMeta('name', 'twitter:description', seo.description);
  setMeta('name', 'twitter:image', seo.image);

  if (seo.ogType === 'article' && seo.publishedTime) {
    setMeta('property', 'article:published_time', seo.publishedTime);
  } else {
    removeMeta('property', 'article:published_time');
  }

  setStructuredData(seo.jsonLd);

  // Moving between pages inside a language address (no new server answer): translate the tab title and descriptions here.
  if (urlLang) {
    translateUi(urlLang, [seo.title, seo.description]).then((out) => {
      if (!out || getUrlLang() !== urlLang || document.title !== seo.title) return;
      document.title = out[0];
      setMeta('name', 'description', out[1]);
      setMeta('property', 'og:title', out[0]);
      setMeta('property', 'og:description', out[1]);
      setMeta('name', 'twitter:title', out[0]);
      setMeta('name', 'twitter:description', out[1]);
    });
  }
}
