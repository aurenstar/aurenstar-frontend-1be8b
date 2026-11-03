/**
 * Post-build step: `vite build && tsx scripts/prerender.ts`
 *
 * The app is a client-rendered SPA. This script does NOT change how it renders; it only
 * writes one HTML file per route with the correct <head> (title, description, canonical,
 * robots, Open Graph / Twitter, JSON-LD) already inside, so search engines and link-preview
 * bots (WhatsApp, Facebook, X, Slack...) see the right metadata without running JavaScript.
 * It also generates sitemap.xml and the legacy-URL redirects.
 *
 * Output layout (Cloudflare Pages serves /blog from blog.html, no trailing-slash redirect):
 *   dist/index.html                      -> /
 *   dist/blog.html                       -> /blog
 *   dist/blog/<slug>.html                -> /blog/<slug>
 *   dist/dicionario/<term-slug>.html     -> /dicionario/<term-slug>
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BLOG_ARTICLES } from '../src/data/blogArticles';
import { ASTROLOGY_DICTIONARY_TERMS } from '../src/data/astrologyDictionaryData';
import { hreflangLinks, langUrl } from '../server/engine/localizePage';
import { URL_LANGUAGES } from '../src/utils/urlLang';
import { getArticleIsoDate, getArticleSlug } from '../src/utils/articleSlug';
import { BLOG_CATEGORIES } from '../src/utils/blogCategories';
import {
  SITE_NAME,
  SITE_URL,
  STATIC_ROUTES,
  getSeoData,
  type SeoData,
} from '../src/utils/seoData';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const templatePath = path.join(dist, 'index.html');

if (!fs.existsSync(templatePath)) {
  console.error('dist/index.html not found. Run `vite build` first.');
  process.exit(1);
}

const template = fs.readFileSync(templatePath, 'utf8');
if (!template.includes('<!--seo-head-->')) {
  console.error('Marker <!--seo-head--> missing from index.html template.');
  process.exit(1);
}

const escapeAttr = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escapeText = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escapeXml = (value: string) => escapeText(value).replace(/"/g, '&quot;').replace(/'/g, '&apos;');

function headBlock(seo: SeoData): string {
  const lines = [
    `<meta name="description" content="${escapeAttr(seo.description)}" />`,
    `<meta name="robots" content="${seo.robots}" />`,
    `<link rel="canonical" href="${escapeAttr(seo.url)}" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:locale" content="${seo.locale}" />`,
    `<meta property="og:type" content="${seo.ogType}" />`,
    `<meta property="og:title" content="${escapeAttr(seo.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(seo.description)}" />`,
    `<meta property="og:url" content="${escapeAttr(seo.url)}" />`,
    `<meta property="og:image" content="${escapeAttr(seo.image)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttr(seo.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(seo.description)}" />`,
    `<meta name="twitter:image" content="${escapeAttr(seo.image)}" />`,
  ];
  if (seo.robots === 'index,follow') lines.push(hreflangLinks(seo.path));
  if (seo.ogType === 'article' && seo.publishedTime) {
    lines.push(`<meta property="article:published_time" content="${seo.publishedTime}" />`);
  }
  const json = JSON.stringify(seo.jsonLd).replace(/</g, '\\u003c');
  lines.push(`<script type="application/ld+json" id="aurenstar-seo-jsonld">${json}</script>`);
  return lines.join('\n    ');
}

const NOSCRIPT_LINKS: [string, string][] = [
  ['Home', '/'],
  ['Blog', '/blog'],
  ['Dictionary', '/dicionario'],
  ['Aurendaily', '/daily-message'],
  ['Auren Effect', '/aureneffect'],
  ['Sign Calculator', '/discover-sign'],
  ['About', '/about'],
  ['Contact', '/contact'],
];

function noscriptBlock(seo: SeoData): string {
  const links = NOSCRIPT_LINKS.map(([label, href]) => `<a href="${href}">${label}</a>`).join(' · ');
  return `<noscript><h1>${escapeText(seo.title)}</h1><p>${escapeText(seo.description)}</p><nav>${links}</nav></noscript>`;
}

function render(seo: SeoData): string {
  return template
    .replace(/<html lang="[^"]*"/, `<html lang="${seo.lang}"`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeText(seo.title)}</title>`)
    .replace('<!--seo-head-->', headBlock(seo))
    .replace('<!--seo-noscript-->', noscriptBlock(seo));
}

function outputFileFor(urlPath: string): string {
  if (urlPath === '/') return path.join(dist, 'index.html');
  return path.join(dist, `${urlPath.replace(/^\//, '')}.html`);
}

const seen = new Set<string>();
const sitemap: { loc: string; path: string; lastmod?: string }[] = [];
const redirects: string[] = [];

function emit(seo: SeoData, lastmod?: string) {
  if (seen.has(seo.path)) return;
  seen.add(seo.path);
  const file = outputFileFor(seo.path);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, render(seo));
  if (seo.robots === 'index,follow') sitemap.push({ loc: seo.url, path: seo.path, lastmod });
}

// 1. Static pages (the home page overwrites dist/index.html with its own SEO)
for (const page of STATIC_ROUTES) emit(getSeoData(page));

// 2. Blog articles (+ redirect from the legacy /blog/<id> URL to the keyword slug)
for (const article of BLOG_ARTICLES) {
  const seo = getSeoData('article', { articleId: article.id });
  emit(seo, getArticleIsoDate(article));
  if (article.id !== getArticleSlug(article)) {
    redirects.push(`/blog/${article.id} /blog/${getArticleSlug(article)} 301`);
  }
}

// 2b. Blog category pages (/blog/categoria/<slug>); thin ones are written but marked noindex
for (const category of BLOG_CATEGORIES) {
  emit(getSeoData('blog', { categorySlug: category.slug }));
}

// 3. Dictionary terms
for (const term of ASTROLOGY_DICTIONARY_TERMS) {
  emit(getSeoData('dicionario-termo', { termSlug: term.slug }));
}

// 4. About sections
{
  emit(getSeoData('about-detail', {}));
}

// Alias URLs the app also answers to -> one canonical URL
redirects.push('/dictionary/:slug /dicionario/:slug 301');
redirects.push('/dicionary/:slug /dicionario/:slug 301');
redirects.push('/dicionary /dicionario 301');
redirects.push('/about/:section /about 301');
redirects.push('/describe-me /descreva-me 301');
redirects.push('/describe-me-result /descreva-me-result 301');

// 404.html: Cloudflare Pages answers unknown URLs with this file AND a real 404 status
// (instead of 200 + home page, which Google treats as a "soft 404"). It is the normal app
// shell, so a legitimate client-side route that was not prerendered still renders for visitors.
const home = getSeoData('home');
fs.writeFileSync(
  path.join(dist, '404.html'),
  render({
    ...home,
    title: 'Page not found | Aurenstar',
    description: 'This page could not be found. Explore the Aurenstar blog, dictionary and astrology tools.',
    robots: 'noindex,follow',
  })
);

// sitemap.xml
const alternates = (pagePath: string) =>
  [
    `<xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(`${SITE_URL}${pagePath}`)}"/>`,
    `<xhtml:link rel="alternate" hreflang="en" href="${escapeXml(`${SITE_URL}${pagePath}`)}"/>`,
    ...URL_LANGUAGES.map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${escapeXml(langUrl(pagePath, l))}"/>`),
  ].join('');
// Every indexable page + the same page in each language address (/nl/..., /ja/...), all pointing at each other.
const urls = sitemap
  .sort((a, b) => a.loc.localeCompare(b.loc))
  .flatMap(({ loc, path: pagePath, lastmod }) => {
    const mod = lastmod ? `<lastmod>${lastmod}</lastmod>` : '';
    const alt = alternates(pagePath);
    return [
      `  <url><loc>${escapeXml(loc)}</loc>${mod}${alt}</url>`,
      ...URL_LANGUAGES.map((l) => `  <url><loc>${escapeXml(langUrl(pagePath, l))}</loc>${mod}${alt}</url>`),
    ];
  })
  .join('\n');
fs.writeFileSync(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`
);

// _routes.json: the only addresses that run Functions (the API and the language addresses); everything else is static.
fs.writeFileSync(
  path.join(dist, '_routes.json'),
  JSON.stringify({ version: 1, include: ['/api/*', ...URL_LANGUAGES.flatMap((l) => [`/${l}`, `/${l}/*`])], exclude: [] }, null, 2) + '\n'
);

// _redirects: keep the hand-written rules from public/_redirects and add the generated ones
const redirectsPath = path.join(dist, '_redirects');
const existing = fs.existsSync(redirectsPath) ? fs.readFileSync(redirectsPath, 'utf8').trimEnd() : '';
fs.writeFileSync(
  redirectsPath,
  `${existing ? `${existing}\n\n` : ''}# Generated by scripts/prerender.ts\n${redirects.join('\n')}\n`
);

console.log(
  `prerender: ${seen.size} pages written, ${sitemap.length * (URL_LANGUAGES.length + 1)} URLs in sitemap, ${redirects.length} redirect rules (${SITE_URL})`
);
