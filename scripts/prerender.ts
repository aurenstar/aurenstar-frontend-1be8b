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
import { FEATURES } from '../src/data/features';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BLOG_ARTICLES } from '../src/data/blogArticles';
import { REMOVED_ARTICLES } from '../src/data/removedArticles';
import mergedTerms from '../src/data/mergedDictionaryTerms.json';
import { ASTROLOGY_DICTIONARY_TERMS } from '../src/data/astrologyDictionaryData';
import { hreflangLinks, langUrl } from '../server/engine/localizePage';
import { renderWebStory, checkStory, storyPath, type WebStory } from '../server/engine/webStory';
import { wrapPluginStory, type WpStory } from '../server/engine/storyPlugin';
import { renderStoriesIndex } from '../server/engine/storiesIndex';
import { renderNativeArticle, renderNativeHub, pathOf, hubPath, type NativeArticle } from '../server/engine/nativeArticle';
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

// Which languages we ask Google to index: the three main ones plus every language that already has native articles (written from what people
// search in that country). The other languages (translated copies) stay reachable and keep their hreflang, but are left out of the sitemap so Google
// spends its time on the pages that matter. A language enters the sitemap on its own as soon as it gets its first native article.
// Set SITEMAP_ALL=1 to put every language back.
const hasFiles = (d: string) => fs.existsSync(path.join(root, d)) && fs.readdirSync(path.join(root, d)).some((x) => x.endsWith('.json'));
const strongLangs = new Set<string>(['en', 'pt', 'es']);
for (const d of ['data/native-articles', 'data/native-terms']) if (fs.existsSync(path.join(root, d))) for (const l of fs.readdirSync(path.join(root, d))) if (hasFiles(`${d}/${l}`)) strongLangs.add(l);
const sitemapLangs = () => URL_LANGUAGES.filter((l) => strongLangs.has(l) || process.env.SITEMAP_ALL === '1');

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

// 2-removed. Placeholder articles that no longer exist: old id and keyword addresses (the language addresses follow these through functions/[lang]) -> the real article, or the blog list
for (const removed of REMOVED_ARTICLES) {
  const replacement = removed.replacement ? BLOG_ARTICLES.find((a) => a.id === removed.replacement) : undefined;
  if (removed.replacement && !replacement) throw new Error(`removed article ${removed.id}: replacement ${removed.replacement} not found`);
  const to = replacement ? `/blog/${getArticleSlug(replacement)}` : '/blog';
  redirects.push(`/blog/${removed.id} ${to} 301`);
  redirects.push(`/blog/${removed.slug} ${to} 301`);
}

// 2-merged. Two dictionary entries about the same idea were joined into one: the old address goes to the kept one (the language addresses follow through functions/[lang]).
for (const m of mergedTerms) redirects.push(`/dicionario/${m.from} /dicionario/${m.into} 301`);

// 2a. Old WordPress addresses (blog.aurenstar.com/2026/10/19/<wp-slug>/) -> the same article on the new site.
// Cloudflare sends blog.aurenstar.com/<path> to /old-blog/<path>; functions/old-blog looks the WordPress slug up in this map
// (a small file instead of one redirect line per post, because Cloudflare allows only 100 pattern lines).
const oldBlogMap: Record<string, string> = {};
for (const article of BLOG_ARTICLES) {
  const wpSlug = (article as { wordpress?: { slug?: string } }).wordpress?.slug;
  if (wpSlug) oldBlogMap[wpSlug] = getArticleSlug(article);
}

// 2b. Blog category pages (/blog/categoria/<slug>); thin ones are written but marked noindex
for (const category of BLOG_CATEGORIES) {
  emit(getSeoData('blog', { categorySlug: category.slug }));
}

// 3. Dictionary terms
fs.mkdirSync(path.join(dist, 'dictionary-data'), { recursive: true });
for (const term of ASTROLOGY_DICTIONARY_TERMS) {
  emit(getSeoData('dicionario-termo', { termSlug: term.slug }), undefined, termBody(term));
  // the term page in the browser fetches its full text from here (the bundle only carries a light copy)
  fs.writeFileSync(path.join(dist, 'dictionary-data', `${term.slug}.json`), JSON.stringify(term));
}

// Article translations (pt/es) made by the robot: the article page loads the one it needs from /article-data/.
{
  const from = path.join(root, 'data/article-translations');
  const to = path.join(dist, 'article-data');
  fs.mkdirSync(to, { recursive: true });
  if (fs.existsSync(from)) for (const f of fs.readdirSync(from).filter((n) => n.endsWith('.json'))) fs.writeFileSync(path.join(to, f), JSON.stringify(JSON.parse(fs.readFileSync(path.join(from, f), 'utf8')).article));
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
if (!FEATURES.transits) redirects.push('/transits / 301'); // tool removed from the site
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
// Every indexable page + the same page in each language address (/nl/..., /ja/...), all pointing at each other.
// The language versions of each page are linked to each other by hreflang tags inside the pages themselves (a valid way, equal to listing them
// here), so the sitemap only lists addresses: ~16x smaller. One sitemap file may not be too big (Google reads up to 50 MB / 50,000 URLs, Cloudflare serves files up to 25 MB, and every
// page here lists ~26 language versions). So pages are cut into parts of PAGES_PER_FILE, and sitemap.xml becomes an index
// that lists the parts. With few pages it stays one plain sitemap.xml. This is what makes the dictionary able to grow without a ceiling.
const PAGES_PER_FILE = Number(process.env.SITEMAP_PAGES_PER_FILE) || 1500;
const urlEntries = (items: typeof sitemap) =>
  items
    .flatMap(({ loc, path: pagePath, lastmod }) => {
      const mod = lastmod ? `<lastmod>${lastmod}</lastmod>` : '';
      return [
        `  <url><loc>${escapeXml(loc)}</loc>${mod}</url>`,
        ...sitemapLangs().map((l) => `  <url><loc>${escapeXml(langUrl(pagePath, l))}</loc>${mod}</url>`),
      ];
    })
    .join('\n');
const urlset = (body: string) =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
// Native articles (written directly in each language, see server/engine/nativeArticle.ts): one standalone page each + a list page per language.
// They are written to dist/_native/<lang>/... (the language function serves them at /<lang>/blog/<slug> and /<lang>/articles) and get their own sitemap file.
const readNative = (dir: string, kind?: 'term'): NativeArticle[] => {
  const d = path.join(root, dir);
  return fs.existsSync(d) ? fs.readdirSync(d).flatMap((l) => fs.readdirSync(path.join(d, l)).filter((f) => f.endsWith('.json')).map((f) => ({ ...JSON.parse(fs.readFileSync(path.join(d, l, f), 'utf8')), ...(kind ? { kind } : {}) }) as NativeArticle)) : [];
};
const nativeAll: NativeArticle[] = [...readNative('data/native-articles'), ...readNative('data/native-terms', 'term')];
const nativeByLang = new Map<string, NativeArticle[]>();
for (const a of nativeAll.sort((x, y) => y.volume - x.volume)) nativeByLang.set(a.lang, [...(nativeByLang.get(a.lang) || []), a]);
const nativeUrls: { loc: string; lastmod: string }[] = [];
for (const [lang, list] of nativeByLang) {
  fs.mkdirSync(path.join(dist, '_native', lang), { recursive: true });
  const live = list.filter((a) => !a.retired);
  for (const a of list) {
    // articles: /_native/<lang>/<slug>.html ; dictionary entries: /_native/<lang>/d/<slug>.html
    if (a.kind === 'term') fs.mkdirSync(path.join(dist, '_native', lang, 'd'), { recursive: true });
    fs.writeFileSync(path.join(dist, '_native', lang, a.kind === 'term' ? `d/${a.slug}.html` : `${a.slug}.html`), renderNativeArticle(a, live.filter((x) => x.kind === a.kind)));
    if (!a.retired) nativeUrls.push({ loc: `${SITE_URL}${pathOf(a)}`, lastmod: a.date });
  }
  if (live.length) {
    fs.writeFileSync(path.join(dist, '_native', lang, 'index.html'), renderNativeHub(lang, live));
    nativeUrls.push({ loc: `${SITE_URL}${hubPath(lang)}`, lastmod: live.map((a) => a.date).sort().pop() as string });
  }
}
if (nativeUrls.length) fs.writeFileSync(path.join(dist, 'sitemap-native.xml'), urlset(nativeUrls.map((u) => `  <url><loc>${escapeXml(u.loc)}</loc><lastmod>${u.lastmod}</lastmod></url>`).join('\n')));

// Web Stories (Google, see server/engine/webStory.ts): one AMP page each, written to dist/stories/<lang>/<slug>.html (served at /stories/<lang>/<slug>), own sitemap file.
const storyUrls: { loc: string; lastmod: string }[] = [];
const storiesDir = path.join(root, 'data/stories');
// Stories published in the WordPress plugin (data/wp-stories, see scripts/stories/syncWpStories.ts) live at /blog/stories/<slug>.
// A story that is in WordPress replaces our own /stories/<lang>/<slug> page: that old address is redirected for good.
const wpDir = path.join(root, 'data/wp-stories');
const wpStories: WpStory[] = fs.existsSync(wpDir) ? fs.readdirSync(wpDir).filter((x) => x.endsWith('.json')).sort().map((f) => JSON.parse(fs.readFileSync(path.join(wpDir, f), 'utf8'))) : [];
const inWp = new Set(wpStories.map((w) => w.slug));
if (fs.existsSync(storiesDir)) {
  for (const l of fs.readdirSync(storiesDir)) {
    const all: WebStory[] = fs.readdirSync(path.join(storiesDir, l)).filter((x) => x.endsWith('.json')).sort().map((f) => JSON.parse(fs.readFileSync(path.join(storiesDir, l, f), 'utf8')));
    for (const st of all) {
      const f = `${st.slug}.json`;
      const bad = checkStory(st);
      if (bad.length) { console.warn(`prerender: story ${l}/${f} skipped (${bad.join(', ')})`); continue; }
      if (inWp.has(st.slug)) { redirects.push(`${storyPath(st)} /blog/stories/${st.slug} 301`); continue; }
      fs.mkdirSync(path.join(dist, 'stories', st.lang), { recursive: true });
      fs.writeFileSync(path.join(dist, 'stories', st.lang, `${st.slug}.html`), renderWebStory(st, SITE_URL));
storyUrls.push({ loc: `${SITE_URL}${storyPath(st)}`, lastmod: st.date });
    }
  }
}
for (const w of wpStories) {
  fs.mkdirSync(path.join(dist, 'blog', 'stories'), { recursive: true });
  fs.writeFileSync(path.join(dist, 'blog', 'stories', `${w.slug}.html`), wrapPluginStory(w, SITE_URL));
  storyUrls.push({ loc: `${SITE_URL}/blog/stories/${w.slug}`, lastmod: w.modified });
}
if (wpStories.length) {
  fs.mkdirSync(path.join(dist, 'blog', 'stories'), { recursive: true });
  fs.writeFileSync(path.join(dist, 'blog', 'stories', 'index.html'), renderStoriesIndex(wpStories, SITE_URL));
  storyUrls.unshift({ loc: `${SITE_URL}/blog/stories/`, lastmod: wpStories.map((w) => w.modified).sort().pop() as string });
}
if (storyUrls.length) fs.writeFileSync(path.join(dist, 'sitemap-stories.xml'), urlset(storyUrls.map((u) => `  <url><loc>${escapeXml(u.loc)}</loc><lastmod>${u.lastmod}</lastmod></url>`).join('\n')));

const sorted = sitemap.sort((a, b) => a.loc.localeCompare(b.loc));
if (sorted.length <= PAGES_PER_FILE && !nativeUrls.length && !storyUrls.length) {
  fs.writeFileSync(path.join(dist, 'sitemap.xml'), urlset(urlEntries(sorted)));
} else {
  const parts: string[] = [];
  for (let i = 0; i < sorted.length; i += PAGES_PER_FILE) {
    const name = `sitemap-${parts.length + 1}.xml`;
    fs.writeFileSync(path.join(dist, name), urlset(urlEntries(sorted.slice(i, i + PAGES_PER_FILE))));
    parts.push(name);
  }
  if (nativeUrls.length) parts.push('sitemap-native.xml');
  if (storyUrls.length) parts.push('sitemap-stories.xml');
  const today = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(
    path.join(dist, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${parts.map((n) => `  <sitemap><loc>${SITE_URL}/${n}</loc><lastmod>${today}</lastmod></sitemap>`).join('\n')}\n</sitemapindex>\n`
  );
}

// RSS feed of the blog (/blog/feed.xml). Pinterest reads it and turns every new article into a pin automatically.
// Newest first, last 50 articles. Image: the tall "-card" picture when the article has one (2:3, ideal for pins), else its normal picture.
const feedItems = BLOG_ARTICLES.map((article) => ({ article, iso: getArticleIsoDate(article) }))
  .filter((x) => x.iso)
  .sort((a, b) => (b.iso as string).localeCompare(a.iso as string) || getArticleSlug(a.article).localeCompare(getArticleSlug(b.article)))
  ;
const feedImage = (img: string) => {
  const card = img.replace(/\.webp$/, '-card.webp');
  const pick = card !== img && fs.existsSync(path.join(dist, card.replace(/^\//, ''))) ? card : img;
  return pick.startsWith('/') ? `${SITE_URL}${pick}` : pick;
};
// Pinterest board section (the "playlist" inside a board) for each article, worked out from its address.
const SIGNS = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
const signOf = (slug: string) => SIGNS.find((sg) => slug.includes(sg));
function sectionOf(slug: string): string {
  if (/horoscope/.test(slug)) return 'Horoscopes';
  if (/friend/.test(slug)) return 'Friendship';
  if (/money|budget|financ|side-hustle|wealth/.test(slug)) return 'Money & Wealth';
  if (/career|work|negotiation|job|talent/.test(slug)) return 'Career & Work';
  if (/red-flag|stress|hurt|pulls-away|turn-off|trigger|mistake/.test(slug)) return 'Red Flags & Challenges';
  if (/love|relationship|bed|soulmate|compatib|dating|body-language|family|romance|desire/.test(slug)) return 'Love & Relationships';
  return 'Personality & Traits';
}
// Feed key = one Pinterest board: one per zodiac sign, "compatibility", and "general" (everything else, daily horoscopes included).
const feedKeyOf = (slug: string) => signOf(slug) ?? (/compatib/.test(slug) ? 'compatibility' : 'general');
const buildFeed = (title: string, file: string, entries: typeof feedItems) =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">\n<channel>\n` +
  `  <title>${escapeXml(title)}</title>\n  <link>${SITE_URL}/blog</link>\n  <description>Astrology in simple language: zodiac guides, personality and daily insights.</description>\n  <language>en-US</language>\n` +
  `  <atom:link href="${SITE_URL}/blog/${file}" rel="self" type="application/rss+xml" />\n` +
  `  <lastBuildDate>${new Date(`${feedItems[0]?.iso ?? '2026-01-01'}T12:00:00Z`).toUTCString()}</lastBuildDate>\n` +
  entries
    .map(({ article, iso }) => {
      const slug = getArticleSlug(article);
      const link = `${SITE_URL}/blog/${slug}`;
      const img = feedImage(article.image);
      return (
        `  <item>\n    <title>${escapeXml(article.title.en)}</title>\n    <link>${link}</link>\n    <guid isPermaLink="true">${link}</guid>\n` +
        `    <pubDate>${new Date(`${iso}T12:00:00Z`).toUTCString()}</pubDate>\n    <category>${escapeXml(sectionOf(slug))}</category>\n` +
        `    <description>${escapeXml(article.subtitle.en)}</description>\n` +
        `    <enclosure url="${escapeXml(img)}" length="0" type="${img.endsWith('.webp') ? 'image/webp' : img.endsWith('.png') ? 'image/png' : 'image/jpeg'}" />\n` +
        `    <media:content url="${escapeXml(img)}" medium="image" />\n  </item>`
      );
    })
    .join('\n') +
  `\n</channel>\n</rss>\n`;
fs.mkdirSync(path.join(dist, 'blog'), { recursive: true });
fs.writeFileSync(path.join(dist, 'blog', 'feed.xml'), buildFeed(`${SITE_NAME} Blog`, 'feed.xml', feedItems.slice(0, 50)));
// One feed per Pinterest board section: feed-<sign>-<section>.xml (e.g. feed-gemini-love.xml). Pinterest lets an RSS feed save straight into a section,
// so every pin lands in the right "playlist". Also feed-general-<section>.xml (daily horoscopes, guides) and feed-compatibility.xml (one board, no sections).
// Empty combinations are still written (with zero items) so a new article is picked up the moment it appears.
const SECTION_SLUGS: Record<string, string> = {
  'Personality & Traits': 'personality',
  'Love & Relationships': 'love',
  'Career & Work': 'career',
  'Money & Wealth': 'money',
  'Red Flags & Challenges': 'redflags',
  Friendship: 'friendship',
  Horoscopes: 'horoscopes',
};
for (const key of [...SIGNS, 'general']) {
  for (const [sectionName, sectionSlug] of Object.entries(SECTION_SLUGS)) {
    const entries = feedItems.filter(({ article }) => {
      const slug = getArticleSlug(article);
      return feedKeyOf(slug) === key && sectionOf(slug) === sectionName;
    });
    fs.writeFileSync(path.join(dist, 'blog', `feed-${key}-${sectionSlug}.xml`), buildFeed(`${SITE_NAME} Blog - ${key} - ${sectionName}`, `feed-${key}-${sectionSlug}.xml`, entries));
  }
}
fs.writeFileSync(
  path.join(dist, 'blog', 'feed-compatibility.xml'),
  buildFeed(`${SITE_NAME} Blog - compatibility`, 'feed-compatibility.xml', feedItems.filter(({ article }) => feedKeyOf(getArticleSlug(article)) === 'compatibility'))
);
redirects.push('/blog/feed /blog/feed.xml 301', '/feed /blog/feed.xml 301');

fs.writeFileSync(path.join(dist, 'old-blog-map.json'), JSON.stringify(oldBlogMap));

// _routes.json: the only addresses that run Functions (the API and the language addresses); everything else is static.
fs.writeFileSync(
  path.join(dist, '_routes.json'),
  JSON.stringify({ version: 1, include: ['/api/*', '/old-blog', '/old-blog/*', ...URL_LANGUAGES.flatMap((l) => [`/${l}`, `/${l}/*`])], exclude: [] }, null, 2) + '\n'
);

// _redirects: keep the hand-written rules from public/_redirects and add the generated ones
const redirectsPath = path.join(dist, '_redirects');
const existing = fs.existsSync(redirectsPath) ? fs.readFileSync(redirectsPath, 'utf8').trimEnd() : '';
fs.writeFileSync(
  redirectsPath,
  `${existing ? `${existing}\n\n` : ''}# Generated by scripts/prerender.ts\n${redirects.join('\n')}\n`
);

console.log(
  `prerender: ${seen.size} pages written, ${nativeAll.length} native articles, ${sitemap.length * (sitemapLangs().length + 1)} URLs in sitemap (${[...strongLangs].filter((l) => URL_LANGUAGES.includes(l as any)).length + 0} languages; the rest are left out on purpose), ${redirects.length} redirect rules (${SITE_URL})`
);
