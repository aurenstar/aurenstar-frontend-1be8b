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
    // Google Search Console ownership proof: set GSC_VERIFICATION (build variable) to the code Google gives you.
    ...(process.env.GSC_VERIFICATION ? [`<meta name="google-site-verification" content="${escapeAttr(process.env.GSC_VERIFICATION)}" />`] : []),
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

function noscriptBlock(seo: SeoData, hasBody = false): string {
  if (hasBody) return '<noscript></noscript>'; // the page text is already in the HTML
  const links = NOSCRIPT_LINKS.map(([label, href]) => `<a href="${href}">${label}</a>`).join(' · ');
  return `<noscript><h1>${escapeText(seo.title)}</h1><p>${escapeText(seo.description)}</p><nav>${links}</nav></noscript>`;
}

/**
 * Readable page text placed inside <div id="root">. Visitors never see it for long: React replaces it
 * the moment the app starts. Search engines and link bots read it straight from the HTML file.
 * It is the same text the app shows, so nothing is hidden from anyone.
 */
const STATIC_STYLE = 'max-width:720px;margin:0 auto;padding:32px 16px;font-family:system-ui,sans-serif;color:#172B4D;line-height:1.6';
const pEl = (t: string) => `<p>${escapeText(t)}</p>`;
const MAIN = (inner: string) => `<main data-prerendered style="${STATIC_STYLE}">${inner}</main>`;

function articleBody(article: (typeof BLOG_ARTICLES)[number]): string {
  const sections = article.sections
    .map((sec) => `<section><h2>${escapeText(sec.heading.en)}</h2>${sec.paragraphs.map((p) => pEl(p.en)).join('')}</section>`)
    .join('');
  const takeaways = article.keyTakeaways.en.length
    ? `<section><h2>Key takeaways</h2><ul>${article.keyTakeaways.en.map((k) => `<li>${escapeText(k)}</li>`).join('')}</ul></section>`
    : '';
  return MAIN(
    `<article><p>${escapeText(article.category.en)} · ${escapeText(article.readTime.en)}</p><h1>${escapeText(article.title.en)}</h1>` +
      `${pEl(article.subtitle.en)}<blockquote>${escapeText(article.quote.en)}</blockquote>${sections}${takeaways}</article>` +
      `<nav><a href="/blog">All articles</a> · <a href="/">Aurenstar</a></nav>`
  );
}

function termBody(term: (typeof ASTROLOGY_DICTIONARY_TERMS)[number]): string {
  const faq = (term.faq || []).map((f) => `<h3>${escapeText(f.pergunta)}</h3>${pEl(f.resposta)}`).join('');
  return MAIN(
    `<article><p>${escapeText(term.categoria)}</p><h1>${escapeText(term.perguntaGoogle || term.termo)}</h1>${pEl(term.resumoUmaLinha)}` +
      `<h2>What it means</h2>${pEl(term.oQueSignifica)}<h2>What it means in astrology</h2>${pEl(term.oQueSignificaNaAstrologia)}` +
      `<h2>Example</h2>${pEl(term.exemploFicticio)}<h2>Quick tip</h2>${pEl(term.dicaRapida)}${faq ? `<h2>Questions</h2>${faq}` : ''}</article>` +
      `<nav><a href="/dicionario">All terms</a> · <a href="/">Aurenstar</a></nav>`
  );
}

function listingBody(seo: SeoData): string {
  const articles = BLOG_ARTICLES.map((a) => `<li><a href="/blog/${getArticleSlug(a)}">${escapeText(a.title.en)}</a> — ${escapeText(a.subtitle.en)}</li>`).join('');
  const terms = ASTROLOGY_DICTIONARY_TERMS.slice(0, 60).map((t) => `<li><a href="/dicionario/${t.slug}">${escapeText(t.termo)}</a></li>`).join('');
  const links = NOSCRIPT_LINKS.map(([label, href]) => `<a href="${href}">${label}</a>`).join(' · ');
  return MAIN(`<h1>${escapeText(seo.title)}</h1>${pEl(seo.description)}<nav>${links}</nav><h2>Articles</h2><ul>${articles}</ul><h2>Astrology dictionary</h2><ul>${terms}</ul>`);
}

function render(seo: SeoData, body = ''): string {
  return template
    .replace(/<html lang="[^"]*"/, `<html lang="${seo.lang}"`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeText(seo.title)}</title>`)
    .replace('<!--seo-head-->', headBlock(seo))
    .replace('<!--seo-noscript-->', noscriptBlock(seo, !!body))
    .replace('<div id="root"></div>', () => `<div id="root">${body}</div>`);
}

function outputFileFor(urlPath: string): string {
  if (urlPath === '/') return path.join(dist, 'index.html');
  return path.join(dist, `${urlPath.replace(/^\//, '')}.html`);
}

const seen = new Set<string>();
const sitemap: { loc: string; path: string; lastmod?: string }[] = [];
const redirects: string[] = [];

function emit(seo: SeoData, lastmod?: string, body = '') {
  if (seen.has(seo.path)) return;
  seen.add(seo.path);
  const file = outputFileFor(seo.path);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, render(seo, body));
  if (seo.robots === 'index,follow') sitemap.push({ loc: seo.url, path: seo.path, lastmod });
}

// 1. Static pages (the home page overwrites dist/index.html with its own SEO)
for (const page of STATIC_ROUTES) {
  const seo = getSeoData(page);
  emit(seo, undefined, ['home', 'blog', 'dicionario'].includes(page as string) ? listingBody(seo) : '');
}

// 2. Blog articles (+ redirect from the legacy /blog/<id> URL to the keyword slug)
for (const article of BLOG_ARTICLES) {
  const seo = getSeoData('article', { articleId: article.id });
  emit(seo, getArticleIsoDate(article), articleBody(article));
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
  emit(getSeoData('dicionario-termo', { termSlug: term.slug }), undefined, termBody(term));
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
// One sitemap file may not be too big (Google reads up to 50 MB / 50,000 URLs, Cloudflare serves files up to 25 MB, and every
// page here lists ~26 language versions). So pages are cut into parts of PAGES_PER_FILE, and sitemap.xml becomes an index
// that lists the parts. With few pages it stays one plain sitemap.xml. This is what makes the dictionary able to grow without a ceiling.
const PAGES_PER_FILE = Number(process.env.SITEMAP_PAGES_PER_FILE) || 100;
const urlEntries = (items: typeof sitemap) =>
  items
    .flatMap(({ loc, path: pagePath, lastmod }) => {
      const mod = lastmod ? `<lastmod>${lastmod}</lastmod>` : '';
      const alt = alternates(pagePath);
      return [
        `  <url><loc>${escapeXml(loc)}</loc>${mod}${alt}</url>`,
        ...URL_LANGUAGES.map((l) => `  <url><loc>${escapeXml(langUrl(pagePath, l))}</loc>${mod}${alt}</url>`),
      ];
    })
    .join('\n');
const urlset = (body: string) =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${body}\n</urlset>\n`;
const sorted = sitemap.sort((a, b) => a.loc.localeCompare(b.loc));
if (sorted.length <= PAGES_PER_FILE) {
  fs.writeFileSync(path.join(dist, 'sitemap.xml'), urlset(urlEntries(sorted)));
} else {
  const parts: string[] = [];
  for (let i = 0; i < sorted.length; i += PAGES_PER_FILE) {
    const name = `sitemap-${parts.length + 1}.xml`;
    fs.writeFileSync(path.join(dist, name), urlset(urlEntries(sorted.slice(i, i + PAGES_PER_FILE))));
    parts.push(name);
  }
  const today = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(
    path.join(dist, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${parts.map((n) => `  <sitemap><loc>${SITE_URL}/${n}</loc><lastmod>${today}</lastmod></sitemap>`).join('\n')}\n</sitemapindex>\n`
  );
}

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
