/**
 * Turns a prerendered English page into its language-address version (/nl/blog ...):
 * translated title + descriptions, language and canonical address of that version, and the list of all language versions (hreflang).
 * The body is translated in the browser (SiteLocalizer), the same way for people and for Google's renderer.
 */
import { SITE_URL_LANGUAGES, isTranslatedLanguage, langTag } from '../../src/utils/urlLang';

const SITE = 'https://aurenstar.com';
const RTL = new Set(['ar', 'he', 'fa', 'ur']);

const unescape = (v: string) => v.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const escAttr = (v: string) => v.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escText = (v: string) => v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const META_KEYS: [string, string][] = [
  ['name', 'description'],
  ['property', 'og:title'],
  ['property', 'og:description'],
  ['name', 'twitter:title'],
  ['name', 'twitter:description'],
];
const metaRe = (attr: string, key: string) => new RegExp(`(<meta\\s+${attr}="${key}"\\s+content=")([^"]*)(")`);

/** Address of the same page in a language ("/blog" + "nl" -> "https://aurenstar.com/nl/blog"). */
export const langUrl = (pagePath: string, lang: string) => `${SITE}/${lang}${pagePath === '/' ? '' : pagePath}`;

export function hreflangLinks(pagePath: string): string {
  const en = `${SITE}${pagePath === '/' ? '/' : pagePath}`;
  const lines = [`<link rel="alternate" hreflang="x-default" href="${en}" />`, `<link rel="alternate" hreflang="en" href="${en}" />`];
  // Only the versions Google should index (English + the hand-written pt and es). The machine-translated copies are noindex, so they are not listed.
  for (const l of SITE_URL_LANGUAGES) lines.push(`<link rel="alternate" hreflang="${langTag(l)}" href="${langUrl(pagePath, l)}" />`);
  return lines.join('\n    ');
}

export async function localizeHtml(
  html: string,
  lang: string,
  pagePath: string,
  translate: (strings: string[]) => Promise<string[] | null>,
  fixed?: { t: string; d?: string } | null,
): Promise<string> {
  const titleMatch = /<title>([\s\S]*?)<\/title>/.exec(html);
  const wanted: { kind: 'title' | 'meta'; attr?: string; key?: string; value: string }[] = [];
  if (titleMatch) wanted.push({ kind: 'title', value: unescape(titleMatch[1]) });
  for (const [attr, key] of META_KEYS) {
    const m = metaRe(attr, key).exec(html);
    if (m) wanted.push({ kind: 'meta', attr, key, value: unescape(m[2]) });
  }
  // Hand-written / ready-made title and description for this page and language (built at deploy time) win over the machine translation.
  const fixedFor = (w: { kind: string; key?: string }): string | null => {
    if (!fixed) return null;
    if (w.kind === 'title' || w.key === 'og:title' || w.key === 'twitter:title') return fixed.t || null;
    if (fixed.d && (w.key === 'description' || w.key === 'og:description' || w.key === 'twitter:description')) return fixed.d;
    return null;
  };
  const need = wanted.filter((w) => fixedFor(w) === null);
  // The noscript text (what crawlers without JavaScript read) repeats the title and the description.
  const tr = need.length ? await translate(need.map((w) => w.value)) : [];
  const okTr = !!tr && tr.length === need.length;
  let ti = 0;
  const texts: (string | null)[] = wanted.map((w) => {
    const f = fixedFor(w);
    if (f !== null) return f;
    const v = okTr ? (tr as string[])[ti] || w.value : null;
    ti++;
    return v;
  });

  let page = html;
  wanted.forEach((w, i) => {
    const text = texts[i];
    if (text === null) return;
    if (w.kind === 'title') page = page.replace(/<title>[\s\S]*?<\/title>/, `<title>${escText(text)}</title>`);
    else page = page.replace(metaRe(w.attr as string, w.key as string), (_m, a, _v, c) => `${a}${escAttr(text)}${c}`);
  });
  const titleT = texts[wanted.findIndex((w) => w.kind === 'title')];
  const descT = texts[wanted.findIndex((w) => w.key === 'description')];
  if (titleT && descT) {
    page = page.replace(/<noscript><h1>[\s\S]*?<\/h1><p>[\s\S]*?<\/p>/, `<noscript><h1>${escText(titleT)}</h1><p>${escText(descT)}</p>`);
  }
  const here = langUrl(pagePath, lang);
  // The readable English text in the HTML would not match the page language: the app shows the right language in the browser.
  page = page.replace(/<main data-prerendered[\s\S]*?<\/main>/, '');
  page = page
    .replace(/<html lang="[^"]*"/, `<html lang="${langTag(lang)}"${RTL.has(lang) ? ' dir="rtl"' : ''}`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${here}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${here}$2`)
    .replace(/(<meta property="og:locale" content=")[^"]*(")/, `$1${langTag(lang).replace("-", "_")}$2`)
    .replace('</head>', `    ${hreflangLinks(pagePath)}\n  </head>`);
  // Machine-translated copies (only the head is translated, the text loads in the browser): keep them for visitors but out of Google's index,
  // so Google never shows an empty/wrong-language copy or treats it as a duplicate. Native, English, pt and es pages stay indexed.
  if (isTranslatedLanguage(lang)) {
    page = /<meta\s+name="robots"[^>]*>/.test(page)
      ? page.replace(/<meta\s+name="robots"[^>]*>/, '<meta name="robots" content="noindex,follow" />')
      : page.replace('</head>', '    <meta name="robots" content="noindex,follow" />\n  </head>');
  }
  return page;
}
