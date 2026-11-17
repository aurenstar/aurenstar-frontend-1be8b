// Google Web Stories: full-screen tap-through stories written as valid AMP pages (https://amp.dev/documentation/guides-and-tutorials/start/create_successful_stories).
// One story = one data file in data/stories/<lang>/<slug>.json. The build writes dist/stories/<lang>/<slug>.html and sitemap-stories.xml.
// Stories live under /stories/<lang>/<slug> (not under /<lang>/..., so no language function touches them).

export interface StoryPage { theme: Theme; kicker?: string; title: string; text: string }
export type Theme = 'fire' | 'earth' | 'air' | 'water' | 'night';
export interface WebStory {
  lang: string; slug: string; date: string; title: string; description: string;
  theme: Theme; pages: StoryPage[];
  cta: { text: string; label: string; url: string };
  sign?: string; // one of SIGNS: the cover then gets that sign's symbol
  swipe?: string; // short hint on the cover, e.g. "Toque para avançar"
  more?: string; // heading above the related cards on the last screen
}

export const SIGNS = ['aries', 'touro', 'gemeos', 'cancer', 'leao', 'virgem', 'libra', 'escorpiao', 'sagitario', 'capricornio', 'aquario', 'peixes'];
export const coverPath = (sign: string) => `/stories/img/cover-${sign}.webp`;
export const STORY_THEMES: Theme[] = ['fire', 'earth', 'air', 'water', 'night'];
export const storyPath = (s: Pick<WebStory, 'lang' | 'slug'>) => `/stories/${s.lang}/${s.slug}`;
// Hand-written stories (pt, en, es) have a poster with their own title. Stories the robot writes in other languages use a language-neutral poster per sign (symbol only, no text).
export const HAND_LANGS = ['pt', 'en', 'es'];
export const posterPath = (s: Pick<WebStory, 'lang' | 'slug'> & { sign?: string }) => (s.sign && !HAND_LANGS.includes(s.lang) ? `/stories/img/poster-sign-${s.sign}.webp` : `/stories/img/poster-${s.lang}-${s.slug}.webp`);
const RTL = new Set(['ar', 'he', 'fa', 'ur']);
export const bgPath = (t: Theme) => `/stories/img/bg-${t}.webp`;
const LOGO = '/stories/img/logo-96.png';
const LOCALE: Record<string, string> = { pt: 'pt-BR', en: 'en', es: 'es' };

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Problems that would stop Google from showing the story. Empty = fine. */
export function checkStory(s: WebStory): string[] {
  const p: string[] = [];
  if (!/^[a-z0-9-]+$/.test(s.slug)) p.push('slug');
  if (s.title.length < 8 || s.title.length > 70) p.push('title length');
  if (s.description.length < 40 || s.description.length > 200) p.push('description length');
  if (s.pages.length < 4 || s.pages.length > 12) p.push('pages must be 4 to 12');
  for (const [i, g] of s.pages.entries()) {
    if (!g.title || g.title.length > 60) p.push(`page ${i + 1} title`);
    if (!g.text || g.text.length > 220) p.push(`page ${i + 1} text (max 220 characters, short is better)`);
    if (!STORY_THEMES.includes(g.theme)) p.push(`page ${i + 1} theme`);
  }
  if (!/^\/[^/]/.test(s.cta.url) && !/^https:\/\//.test(s.cta.url)) p.push('cta url');
  if (s.sign && !SIGNS.includes(s.sign)) p.push('sign');
  if (!s.cta.text || !s.cta.label) p.push('cta text');
  return p;
}

const BOILERPLATE =
  '<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>';

// Look of the site: blue background (#C9E5FF family), white rounded cards, blue headings (#3982C8, Montserrat 800), pink accents (#E73578), navy text (#172B4D), pill shapes.
const CSS = `
amp-story{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:#172B4D}
.low{padding:28px 24px 96px;align-content:end}
.logo{position:absolute;top:26px;left:20px;background:#fff;border-radius:999px;padding:6px 14px;box-shadow:0 4px 14px rgba(23,54,111,.25)}
.card{background:rgba(255,255,255,.95);border:1px solid #D9E8F8;border-radius:28px;padding:26px 24px 28px;box-shadow:0 10px 30px rgba(23,54,111,.25)}
.k{display:inline-block;margin:0 0 14px;padding:6px 14px;border-radius:999px;background:#E73578;color:#fff;font-size:13px;letter-spacing:.12em;text-transform:uppercase;font-weight:700}
h1,h2{margin:0 0 12px;line-height:1.1;font-family:Montserrat,-apple-system,"Segoe UI",Arial,sans-serif;font-weight:800;color:#3982C8}
h1{font-size:36px}
h2{font-size:30px}
.pk{color:#E73578}
p{margin:0;font-size:20px;line-height:1.4;color:#172B4D}
.sub{color:#647DA5}
.hint{margin-top:18px;font-size:15px;color:#E73578;font-weight:700}
.cta{font-size:28px}
.more{display:grid;gap:10px}
.rc{display:flex;align-items:center;gap:14px;background:#E4F1FF;border:1px solid #D9E8F8;border-radius:20px;padding:8px 16px 8px 8px;text-decoration:none}
.rc amp-img{border-radius:14px;overflow:hidden;flex:none}
.rc span{color:#17366F;font-weight:700;font-size:17px;line-height:1.25}
`;

/** The full AMP page for one story. `site` is the origin, e.g. https://aurenstar.com */
export type RelatedStory = { title: string; url: string; sign?: string; theme: Theme };
const MORE: Record<string, string> = { pt: 'Continue lendo', en: 'Keep reading', es: 'Sigue leyendo' };

export function renderWebStory(s: WebStory, site: string, related: RelatedStory[] = []): string {
  const url = `${site}${storyPath(s)}`;
  const loc = LOCALE[s.lang] || s.lang;
  const img = (src: string, alt = '') => `<amp-img src="${esc(src)}" width="720" height="1280" layout="responsive" alt="${esc(alt)}"></amp-img>`;
  const logo = `<div class="logo"><amp-img src="${esc(site + '/logo-aurenstar.webp')}" width="108" height="36" layout="fixed" alt="Aurenstar"></amp-img></div>`;
  const cover = `<amp-story-page id="cover">
<amp-story-grid-layer template="fill">${img(s.sign ? coverPath(s.sign) : bgPath(s.theme))}</amp-story-grid-layer>
<amp-story-grid-layer template="vertical" class="low">
${logo}
<div class="card"><h1>${esc(s.title)}</h1><p class="sub">${esc(s.description)}</p>${s.swipe ? `<p class="hint">${esc(s.swipe)} →</p>` : ''}</div>
</amp-story-grid-layer>
</amp-story-page>`;
  const pages = s.pages.map((g, i) => `<amp-story-page id="p${i + 1}">
<amp-story-grid-layer template="fill">${img(bgPath(g.theme))}</amp-story-grid-layer>
<amp-story-grid-layer template="vertical" class="low">
${logo}
<div class="card">${g.kicker ? `<p class="k">${esc(g.kicker)}</p>` : ''}<h2>${esc(g.title)}</h2><p>${esc(g.text)}</p></div>
</amp-story-grid-layer>
</amp-story-page>`).join('\n');
  const last = `<amp-story-page id="end">
<amp-story-grid-layer template="fill">${img(bgPath('night'))}</amp-story-grid-layer>
<amp-story-grid-layer template="vertical" class="low">
${logo}
<div class="card"><h2 class="cta">${esc(s.cta.text)}</h2>${related.length ? `<p class="k">${esc(s.more || MORE[s.lang] || MORE.en)}</p><div class="more">${related.slice(0, 3).map((r) => `<a class="rc" href="${esc(site + r.url)}"><amp-img src="${esc(site + (r.sign ? coverPath(r.sign) : bgPath(r.theme)))}" width="64" height="64" layout="fixed" object-fit="cover" alt=""></amp-img><span>${esc(r.title)}</span></a>`).join('')}</div>` : ''}</div>
</amp-story-grid-layer>
<amp-story-page-outlink layout="nodisplay" theme="custom" cta-accent-color="#E73578" cta-accent-element="background"><a href="${esc(s.cta.url.startsWith('/') ? site + s.cta.url : s.cta.url)}">${esc(s.cta.label)}</a></amp-story-page-outlink>
</amp-story-page>`;
  const ld = { '@context': 'https://schema.org', '@type': 'Article', headline: s.title, description: s.description, datePublished: s.date, dateModified: s.date, inLanguage: loc, mainEntityOfPage: url, image: `${site}${posterPath(s)}`, author: { '@type': 'Organization', name: 'Aurenstar' }, publisher: { '@type': 'Organization', name: 'Aurenstar', logo: { '@type': 'ImageObject', url: `${site}${LOGO}` } } };
  return `<!doctype html>
<html amp lang="${esc(loc)}"${RTL.has(s.lang) ? ' dir="rtl"' : ''}>
<head>
<meta charset="utf-8">
<script async src="https://cdn.ampproject.org/v0.js"></script>
<script async custom-element="amp-story" src="https://cdn.ampproject.org/v0/amp-story-1.0.js"></script>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@800&amp;display=swap" rel="stylesheet">
<title>${esc(s.title)} | Aurenstar</title>
<link rel="canonical" href="${esc(url)}">
<meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
<meta name="description" content="${esc(s.description)}">
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>
${BOILERPLATE}
<style amp-custom>${CSS.replace(/\n/g, '')}</style>
</head>
<body>
<amp-story standalone title="${esc(s.title)}" publisher="Aurenstar" publisher-logo-src="${esc(site + LOGO)}" poster-portrait-src="${esc(site + posterPath(s))}">
${cover}
${pages}
${last}
</amp-story>
</body>
</html>
`;
}
