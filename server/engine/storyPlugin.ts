/**
 * Turns one of our stories (data/stories/<lang>/<slug>.json) into what the WordPress "Web Stories" plugin stores:
 *   story_data = the drawing the plugin editor opens (pictures, white cards, texts)
 *   content    = the page markup the plugin keeps (the site later wraps it, see wrapPluginStory)
 * Same look as the site: blue sky picture, white rounded cards, pink pills, blue Montserrat titles, colored logo.
 */
import { BOILERPLATE, GA_ID, bgPath, coverPath, esc, LOGO, posterPath, signOf, type RelatedStory, type WebStory } from './webStory';

const W = 412, H = 732;
const BLUE = '#3982C8', PINK = '#E73578', NAVY = '#172B4D', SOFT = '#647DA5';
const DATA_VERSION = 47;
const rgb = (hex: string) => ({ color: { r: parseInt(hex.slice(1, 3), 16), g: parseInt(hex.slice(3, 5), 16), b: parseInt(hex.slice(5, 7), 16) } });

type El =
  | { kind: 'img'; src: string; w0: number; h0: number; x: number; y: number; w: number; h: number; link?: string; radius?: number; bg?: boolean }
  | { kind: 'shape'; color: string; x: number; y: number; w: number; h: number; radius: number }
  | { kind: 'text'; text: string; x: number; y: number; w: number; h: number; size: number; weight: number; color: string; font: 'Montserrat' | 'Inter'; upper?: boolean; link?: string; align?: 'left' | 'center' };

const lines = (t: string, perLine: number) => Math.max(1, Math.ceil(t.length / perLine));
let uid = 0;
const id = (s: string) => `${s}-${++uid}`;

/** Layout of one screen (everything in a 412x732 box, like the plugin does). */
function screen(bg: string, logoSrc: string, site: string, parts: El[]): El[] {
  return [
    { kind: 'img', src: site + bg, w0: 720, h0: 1280, x: 0, y: 0, w: W, h: H, bg: true },
    { kind: 'shape', color: '#FFFFFF', x: 20, y: 26, w: 132, h: 48, radius: 24 },
    { kind: 'img', src: logoSrc, w0: 540, h0: 180, x: 32, y: 31, w: 108, h: 36 },
    ...parts,
  ];
}

function card(top: number, h: number): El { return { kind: 'shape', color: '#FFFFFF', x: 24, y: top, w: 364, h, radius: 28 }; }

export function pluginStory(s: WebStory, site: string, related: RelatedStory[] = [], more = 'Continue lendo') {
  uid = 0;
  const logo = `${site}/logo-aurenstar.webp`;
  const pages: { name: string; els: El[]; outlink?: { url: string; label: string } }[] = [];
  const bottom = H - 96; // keeps the card above the "read more" button

  // cover: the sign symbol picture and a white card with the title
  {
    const tl = lines(s.title, 17), dl = lines(s.description, 32);
    const h = 28 + tl * 38 + 8 + dl * 24 + (s.swipe ? 36 : 12) + 12, top = bottom - h;
    const parts: El[] = [card(top, h),
      { kind: 'text', text: s.title, x: 48, y: top + 24, w: 316, h: tl * 38, size: 32, weight: 800, color: BLUE, font: 'Montserrat' },
      { kind: 'text', text: s.description, x: 48, y: top + 24 + tl * 38 + 8, w: 316, h: dl * 24, size: 17, weight: 400, color: SOFT, font: 'Inter' }];
    if (s.swipe) parts.push({ kind: 'text', text: `${s.swipe} →`, x: 48, y: top + h - 38, w: 316, h: 22, size: 14, weight: 700, color: PINK, font: 'Inter' });
    const cv = signOf(s);
    pages.push({ name: 'cover', els: screen(cv ? coverPath(cv) : bgPath(s.theme), logo, site, parts) });
  }
  for (const [i, g] of s.pages.entries()) {
    const tl = lines(g.title, 18), bl = lines(g.text, 30);
    const kick = g.kicker ? 46 : 0;
    const h = 26 + kick + tl * 34 + 10 + bl * 27 + 26, top = bottom - h;
    const parts: El[] = [card(top, h)];
    let y = top + 26;
    if (g.kicker) {
      const kw = Math.min(316, g.kicker.length * 10 + 28);
      parts.push({ kind: 'shape', color: PINK, x: 48, y, w: kw, h: 30, radius: 15 });
      parts.push({ kind: 'text', text: g.kicker, x: 48, y: y + 6, w: kw, h: 20, size: 12, weight: 700, color: '#FFFFFF', font: 'Inter', upper: true, align: 'center' });
      y += kick;
    }
    parts.push({ kind: 'text', text: g.title, x: 48, y, w: 316, h: tl * 34, size: 28, weight: 800, color: BLUE, font: 'Montserrat' });
    parts.push({ kind: 'text', text: g.text, x: 48, y: y + tl * 34 + 10, w: 316, h: bl * 27, size: 18, weight: 400, color: NAVY, font: 'Inter' });
    pages.push({ name: `p${i + 1}`, els: screen(bgPath(g.theme), logo, site, parts) });
  }
  // last screen: the question, 3 "keep reading" cards and the pink button to the article
  {
    const rel = related.slice(0, 3);
    const tl = lines(s.cta.text, 18);
    const h = 26 + tl * 34 + 12 + (rel.length ? 46 + rel.length * 72 : 0) + 18, top = bottom - h;
    const parts: El[] = [card(top, h), { kind: 'text', text: s.cta.text, x: 48, y: top + 26, w: 316, h: tl * 34, size: 28, weight: 800, color: BLUE, font: 'Montserrat' }];
    let y = top + 26 + tl * 34 + 12;
    if (rel.length) {
      const kw = Math.min(316, more.length * 10 + 28);
      parts.push({ kind: 'shape', color: PINK, x: 48, y, w: kw, h: 30, radius: 15 });
      parts.push({ kind: 'text', text: more, x: 48, y: y + 6, w: kw, h: 20, size: 12, weight: 700, color: '#FFFFFF', font: 'Inter', upper: true, align: 'center' });
      y += 46;
      for (const r of rel) {
        parts.push({ kind: 'shape', color: '#E4F1FF', x: 44, y, w: 324, h: 64, radius: 18 });
        parts.push({ kind: 'img', src: site + (r.sign ? coverPath(r.sign) : bgPath(r.theme)), w0: 720, h0: 1280, x: 50, y: y + 6, w: 52, h: 52, radius: 12, link: site + r.url });
        parts.push({ kind: 'text', text: r.title, x: 114, y: y + 12, w: 246, h: 40, size: 15, weight: 700, color: '#17366F', font: 'Inter', link: site + r.url });
        y += 72;
      }
    }
    pages.push({ name: 'end', els: screen(bgPath('night'), logo, site, parts), outlink: { url: s.cta.url.startsWith('/') ? site + s.cta.url : s.cta.url, label: s.cta.label } });
  }

  // ---- what the editor opens ----
  const story_data = {
    version: DATA_VERSION,
    pages: pages.map((pg) => ({
      id: id('page'),
      elements: pg.els.map((e) => {
        const base = { id: id('el'), x: e.x, y: e.y, width: e.w, height: e.h, rotationAngle: 0 };
        if (e.kind === 'shape') return { ...base, type: 'shape', mask: { type: 'rectangle' }, backgroundColor: rgb(e.color), flip: { vertical: false, horizontal: false }, borderRadius: { locked: true, topLeft: e.radius, topRight: e.radius, bottomRight: e.radius, bottomLeft: e.radius } };
        if (e.kind === 'img') return { ...base, type: 'image', ...(e.bg ? { isBackground: true } : {}), resource: { type: 'image', mimeType: e.src.endsWith('.png') ? 'image/png' : 'image/webp', src: e.src, width: e.w0, height: e.h0, alt: '', isPlaceholder: false }, scale: 100, focalX: 50, focalY: 50, flip: { vertical: false, horizontal: false }, mask: { type: 'rectangle' }, ...(e.link ? { link: { url: e.link } } : {}) };
        const txt = e.upper ? e.text.toUpperCase() : e.text;
        return { ...base, type: 'text', content: `<span style="color: ${e.color}; font-weight: ${e.weight}">${esc(txt)}</span>`, font: { family: e.font, service: 'fonts.google.com', fallbacks: ['sans-serif'], weights: [400, 700, 800], styles: ['regular'], variants: [[0, 400], [0, 700], [0, 800]] }, fontSize: e.size, lineHeight: 1.25, textAlign: e.align || 'left', padding: { horizontal: 0, vertical: 0, locked: true }, backgroundColor: { color: { r: 196, g: 196, b: 196, a: 0 } }, ...(e.link ? { link: { url: e.link } } : {}) };
      }),
      backgroundColor: rgb('#C9E5FF'),
      ...(pg.outlink ? { pageAttachment: { url: pg.outlink.url, ctaText: pg.outlink.label, theme: 'custom', icon: '', backgroundColor: PINK, textColor: '#FFFFFF' } } : {}),
    })),
    autoAdvance: false,
    defaultPageDuration: 7,
  };

  // ---- what the plugin stores as the page markup (inline styles; the site turns them into classes) ----
  const pct = (v: number, t: number) => `${((v / t) * 100).toFixed(3)}%`;
  const place = (e: El) => `position:absolute;left:${pct(e.x, W)};top:${pct(e.y, H)};width:${pct(e.w, W)};height:${pct(e.h, H)}`;
  const body = (e: El): string => {
    if (e.kind === 'shape') return `<div style="${place(e)};background-color:${e.color};border-radius:${e.radius}px"></div>`;
    if (e.kind === 'img') {
      const im = `<amp-img src="${esc(e.src)}" width="${e.w0}" height="${e.h0}" layout="fill" ${e.radius || !e.bg ? 'object-fit="cover" object-position="50% 10%" ' : ''}alt=""></amp-img>`;
      const wrap = `<div style="${place(e)};${e.radius ? `border-radius:${e.radius}px;overflow:hidden` : ''}">${im}</div>`;
      return e.link ? `<a href="${esc(e.link)}" style="${place(e)};display:block">${im}</a>` : wrap;
    }
    const css = `${place(e)};font-family:${e.font === 'Montserrat' ? 'Montserrat,sans-serif' : '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif'};font-size:${((e.size / H) * 100).toFixed(3)}vh;font-weight:${e.weight};color:${e.color};line-height:1.25;margin:0${e.align === 'center' ? ';text-align:center' : ''}${e.upper ? ';text-transform:uppercase' : ''}`;
    const t = esc(e.text);
    return e.link ? `<a href="${esc(e.link)}" style="${css};text-decoration:none">${t}</a>` : `<p style="${css}">${t}</p>`;
  };
  const markup = pages.map((pg, i) => {
    const bgEl = pg.els[0] as Extract<El, { kind: 'img' }>;
    return `<amp-story-page id="${pg.name}"><amp-story-grid-layer template="fill"><amp-img src="${esc(bgEl.src)}" width="720" height="1280" layout="responsive" alt=""></amp-img></amp-story-grid-layer><amp-story-grid-layer template="fill"><div style="position:relative;width:100%;height:100%">${pg.els.slice(1).map(body).join('')}</div></amp-story-grid-layer>${pg.outlink ? `<amp-story-page-outlink layout="nodisplay" theme="custom" cta-accent-color="${PINK}" cta-accent-element="background"><a href="${esc(pg.outlink.url)}">${esc(pg.outlink.label)}</a></amp-story-page-outlink>` : ''}</amp-story-page>`;
  }).join('');
  const content = `<amp-story standalone="" title="${esc(s.title)}" publisher="Aurenstar" publisher-logo-src="${esc(site + LOGO)}" poster-portrait-src="${esc(site + posterPath(s))}">${markup}</amp-story>`;
  return { story_data, content };
}

/** A story as saved from WordPress by scripts/stories/syncWpStories.ts */
export interface WpStory { slug: string; lang: string; title: string; description: string; modified: string; content: string }

/**
 * Wraps the markup stored in the plugin into a full AMP page that lives at aurenstar.com/blog/stories/<slug>.
 * AMP does not allow style="..." on elements, so each inline style becomes a small class in the page style.
 */
export function wrapPluginStory(w: WpStory, site: string): string {
  const url = `${site}/blog/stories/${w.slug}`;
  const rules = new Map<string, string>();
  const body = w.content
    .replace(/<\/?(?:script|iframe|style)\b[^>]*>/gi, '')
    .replace(/\sstyle="([^"]*)"/g, (_m, css: string) => {
      const c = css.replace(/&quot;/g, '"').replace(/&#039;/g, "'").trim().replace(/;$/, '');
      let cls = [...rules.entries()].find(([, v]) => v === c)?.[0];
      if (!cls) { cls = `s${rules.size}`; rules.set(cls, c); }
      return ` class="${cls}"`;
    });
  // two class attributes on one element are invalid: merge them
  const merged = body.replace(/<([a-z-]+)([^>]*?)\sclass="([^"]*)"([^>]*?)\sclass="([^"]*)"/gi, '<$1$2 class="$3 $5"$4');
  // measurement: page views, how far people swipe, finishing the story, and the click to the article (Google Analytics 4)
  const ev = (name: string, extra: Record<string, string> = {}) => ({ request: 'event', vars: { event_name: name, story_slug: w.slug, story_lang: w.lang, ...extra } });
  const analytics = { vars: { gtag_id: GA_ID, config: { [GA_ID]: { groups: 'default' } } }, triggers: {
    pageview: { on: 'visible', request: 'pageview' },
    pageVisible: { on: 'story-page-visible', ...ev('story_page', { story_page_index: '${storyPageIndex}' }) },
    lastPage: { on: 'story-last-page-visible', ...ev('story_finished') },
    toArticle: { on: 'story-click-through', ...ev('story_to_article') },
  } };
  const analyticsTag = `<amp-analytics type="gtag" data-credentials="include"><script type="application/json">${JSON.stringify(analytics).replace(/</g, '\\u003c')}</script></amp-analytics>`;
  const withAnalytics = merged.includes('</amp-story>') ? merged.replace(/<\/amp-story>\s*$/, `${analyticsTag}</amp-story>`) : merged;
  const css = `amp-story{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}${[...rules].map(([k, v]) => `.${k}{${v}}`).join('')}`;
  const poster = (w.content.match(/poster-portrait-src="([^"]+)"/) || [])[1] || `${site}/stories/img/bg-air.webp`;
  const ld = { '@context': 'https://schema.org', '@type': 'Article', headline: w.title, description: w.description, datePublished: w.modified, dateModified: w.modified, mainEntityOfPage: url, image: poster, author: { '@type': 'Organization', name: 'Aurenstar' }, publisher: { '@type': 'Organization', name: 'Aurenstar', logo: { '@type': 'ImageObject', url: `${site}${LOGO}` } } };
  return `<!doctype html>
<html amp lang="${esc(w.lang)}">
<head>
<meta charset="utf-8">
<script async src="https://cdn.ampproject.org/v0.js"></script>
<script async custom-element="amp-story" src="https://cdn.ampproject.org/v0/amp-story-1.0.js"></script>
<script async custom-element="amp-analytics" src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js"></script>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800&amp;display=swap" rel="stylesheet">
<title>${esc(w.title)} | Aurenstar</title>
<link rel="canonical" href="${esc(url)}">
<meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
<meta name="description" content="${esc(w.description)}">
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>
${BOILERPLATE}
<style amp-custom>${css}</style>
</head>
<body>
${withAnalytics}
</body>
</html>
`;
}
