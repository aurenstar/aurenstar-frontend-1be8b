/**
 * Turns one of our stories (data/stories/<lang>/<slug>.json) into what the WordPress "Web Stories" plugin stores:
 *   story_data = the drawing the plugin editor opens (picture, dark veil, logo, pink label, white texts)
 *   content    = the page markup the plugin keeps (the site later wraps it, see wrapPluginStory)
 * Design v2 (approved by the owner on 24/11/2026): the cover picture fills every screen, a dark veil grows toward the bottom,
 * the original colored Aurenstar logo sits on top, a pink label, big white title and text, and a last screen that promises the article.
 */
import { BOILERPLATE, GA_ID, bgPath, coverPath, esc, LOGO, posterPath, signOf, type RelatedStory, type WebStory } from './webStory';
import { END_HEADLINE, END_KICKER, END_PROMISE, SIGN_HOOKS } from './storyHooks';

const W = 412, H = 732;
const PINK = '#E73578';
const DATA_VERSION = 47;
const rgb = (hex: string, a?: number) => ({ color: { r: parseInt(hex.slice(1, 3), 16), g: parseInt(hex.slice(3, 5), 16), b: parseInt(hex.slice(5, 7), 16), ...(a === undefined ? {} : { a }) } });
export const coverV2Path = (sign: string) => `/stories/img/cover-v2-${sign}.webp`;
export const STORY_LOGO = '/stories/img/logo-story.png';
const POS = ['0% 50%', '100% 50%', '50% 50%', '0% 50%', '100% 50%'];

type El =
  | { kind: 'img'; src: string; w0: number; h0: number; x: number; y: number; w: number; h: number; link?: string; radius?: number; bg?: boolean; pos?: string; anim?: string }
  | { kind: 'veil'; x: number; y: number; w: number; h: number }
  | { kind: 'shape'; color: string; x: number; y: number; w: number; h: number; radius: number }
  | { kind: 'text'; text: string; x: number; y: number; w: number; h: number; size: number; weight: number; color: string; font: 'Montserrat' | 'Inter'; upper?: boolean; link?: string; align?: 'left' | 'center'; delay?: number };

const lines = (t: string, perLine: number) => Math.max(1, Math.ceil(t.length / perLine));
let uid = 0;
const id = (s: string) => `${s}-${++uid}`;

/** One screen: picture, dark veil, logo on top, then the parts. */
function screen(bg: string, site: string, parts: El[], pos = '50% 50%', anim = 'zoom-in'): El[] {
  return [
    { kind: 'img', src: bg, w0: 720, h0: 1080, x: 0, y: 0, w: W, h: H, bg: true, pos, anim },
    { kind: 'veil', x: 0, y: 0, w: W, h: H },
    { kind: 'img', src: site + STORY_LOGO, w0: 540, h0: 173, x: 22.7, y: 26.3, w: 123.6, h: 39.6 },
    ...parts,
  ];
}

const pill = (text: string, y: number, delay: number): El[] => {
  const kw = Math.min(316, text.length * 9 + 28);
  return [
    { kind: 'shape', color: PINK, x: 24, y, w: kw, h: 28, radius: 14 },
    { kind: 'text', text, x: 24, y: y + 6, w: kw, h: 18, size: 11, weight: 800, color: '#FFFFFF', font: 'Montserrat', upper: true, align: 'center', delay },
  ];
};
const title = (text: string, y: number, size: number, perLine: number, delay: number): [El, number] => {
  const h = lines(text, perLine) * (size + 6);
  return [{ kind: 'text', text, x: 24, y, w: 364, h, size, weight: 800, color: '#FFFFFF', font: 'Montserrat', delay }, h];
};
const body = (text: string, y: number, size: number, perLine: number, delay: number, color = '#FFFFFF'): [El, number] => {
  const h = lines(text, perLine) * Math.round(size * 1.4);
  return [{ kind: 'text', text, x: 24, y, w: 364, h, size, weight: 500, color, font: 'Montserrat', delay }, h];
};

export function pluginStory(s: WebStory, site: string, related: RelatedStory[] = [], more = 'Continue lendo', coverUrl?: string) {
  uid = 0;
  const sign = signOf(s);
  const bgFor = (theme: string) => coverUrl || (sign ? site + coverV2Path(sign) : site + bgPath(theme as never));
  const pages: { name: string; els: El[]; outlink?: { url: string; label: string } }[] = [];
  const bottom = H - 120; // keeps the text above the "read more" button

  // cover
  {
    const [t, th] = title(s.title, 0, 34, 15, 0.2), [d, dh] = body(s.description, 0, 17, 32, 0.5);
    const sw = s.swipe ? 30 : 0, total = th + 12 + dh + sw, top = bottom - total;
    t.y = top; d.y = top + th + 12;
    const parts: El[] = [t, d];
    if (s.swipe) parts.push({ kind: 'text', text: `${s.swipe} →`, x: 24, y: top + th + 12 + dh + 12, w: 364, h: 20, size: 14, weight: 800, color: '#FFD27A', font: 'Montserrat', delay: 0.8 });
    pages.push({ name: 'cover', els: screen(bgFor(s.theme), site, parts) });
  }
  for (const [i, g] of s.pages.entries()) {
    const [t, th] = title(g.title, 0, 28, 18, 0.3), [b, bh] = body(g.text, 0, 18, 30, 0.6);
    const kick = g.kicker ? 42 : 0, top = bottom - (kick + th + 12 + bh);
    const parts: El[] = [];
    if (g.kicker) parts.push(...pill(g.kicker, top, 0.1));
    t.y = top + kick; b.y = top + kick + th + 12;
    parts.push(t, b);
    pages.push({ name: `p${i + 1}`, els: screen(bgFor(g.theme), site, parts, POS[i % POS.length], i % 2 ? 'zoom-in' : 'zoom-out') });
  }
  // last screen: label, headline, one concrete promise of the article, then the pink button
  {
    const hooks = sign ? SIGN_HOOKS[s.lang]?.[sign] : undefined;
    const kicker = END_KICKER[s.lang] || s.more || more;
    const headline = hooks && END_HEADLINE[s.lang] ? END_HEADLINE[s.lang](hooks[0]) : s.cta.text;
    const promise = hooks && END_PROMISE[s.lang] ? END_PROMISE[s.lang](hooks[1]) : '';
    const [t, th] = title(headline, 0, 32, 16, 0.3);
    const [p, ph] = promise ? body(promise, 0, 18, 30, 0.7) : [undefined, 0];
    const top = bottom - (42 + th + (promise ? 14 + ph : 0));
    t.y = top + 42;
    const parts: El[] = [...pill(kicker, top, 0.1), t];
    if (p) { p.y = top + 42 + th + 14; parts.push(p); }
    pages.push({ name: 'end', els: screen(bgFor('night'), site, parts, '50% 50%', 'zoom-in'), outlink: { url: s.cta.url.startsWith('/') ? site + s.cta.url : s.cta.url, label: s.cta.label } });
    if (related.length) {
      let y = 96;
      for (const r of related.slice(0, 3)) { pages[pages.length - 1].els.push({ kind: 'text', text: r.title, x: 24, y, w: 364, h: 40, size: 15, weight: 700, color: '#FFFFFF', font: 'Montserrat', link: site + r.url }); y += 44; }
    }
  }

  // ---- what the editor opens ----
  const story_data = {
    version: DATA_VERSION,
    pages: pages.map((pg) => ({
      id: id('page'),
      elements: pg.els.map((e) => {
        const base = { id: id('el'), x: e.x, y: e.y, width: e.w, height: e.h, rotationAngle: 0 };
        if (e.kind === 'veil') return { ...base, type: 'shape', mask: { type: 'rectangle' }, backgroundColor: rgb('#000000', 0.5), flip: { vertical: false, horizontal: false } };
        if (e.kind === 'shape') return { ...base, type: 'shape', mask: { type: 'rectangle' }, backgroundColor: rgb(e.color), flip: { vertical: false, horizontal: false }, borderRadius: { locked: true, topLeft: e.radius, topRight: e.radius, bottomRight: e.radius, bottomLeft: e.radius } };
        if (e.kind === 'img') return { ...base, type: 'image', ...(e.bg ? { isBackground: true } : {}), resource: { type: 'image', mimeType: /\.png$/.test(e.src) ? 'image/png' : /\.jpe?g$/.test(e.src) ? 'image/jpeg' : 'image/webp', src: e.src, width: e.w0, height: e.h0, alt: '', isPlaceholder: false }, scale: 100, focalX: 50, focalY: 50, flip: { vertical: false, horizontal: false }, mask: { type: 'rectangle' }, ...(e.link ? { link: { url: e.link } } : {}) };
        const txt = e.upper ? e.text.toUpperCase() : e.text;
        return { ...base, type: 'text', content: `<span style="color: ${e.color}; font-weight: ${e.weight}">${esc(txt)}</span>`, font: { family: e.font, service: 'fonts.google.com', fallbacks: ['sans-serif'], weights: [400, 500, 700, 800], styles: ['regular'], variants: [[0, 400], [0, 500], [0, 700], [0, 800]] }, fontSize: e.size, lineHeight: 1.25, textAlign: e.align || 'left', padding: { horizontal: 0, vertical: 0, locked: true }, backgroundColor: { color: { r: 196, g: 196, b: 196, a: 0 } }, ...(e.link ? { link: { url: e.link } } : {}) };
      }),
      backgroundColor: rgb('#17366F'),
      ...(pg.outlink ? { pageAttachment: { url: pg.outlink.url, ctaText: pg.outlink.label, theme: 'custom', icon: '', backgroundColor: PINK, textColor: '#FFFFFF' } } : {}),
    })),
    autoAdvance: false,
    defaultPageDuration: 7,
  };

  // ---- what the plugin stores as the page markup (inline styles; the site turns them into classes) ----
  const pct = (v: number, t: number) => `${((v / t) * 100).toFixed(3)}%`;
  const place = (e: El) => `position:absolute;left:${pct(e.x, W)};top:${pct(e.y, H)};width:${pct(e.w, W)};height:${pct(e.h, H)}`;
  const FS = (n: number) => `calc(${n} * var(--story-page-vh))`;
  const rendered = (e: El): string => {
    if (e.kind === 'veil') return `<div style="${place(e)};background:linear-gradient(180deg,rgba(0,0,0,0.30) 0%,rgba(0,0,0,0.22) 35%,rgba(0,0,0,0.93) 100%)"></div>`;
    if (e.kind === 'shape') return `<div style="${place(e)};background-color:${e.color};border-radius:${e.radius}px" animate-in="fade-in" animate-in-delay="0.1s"></div>`;
    if (e.kind === 'img') {
      const im = `<amp-img src="${esc(e.src)}" width="${e.w0}" height="${e.h0}" layout="fill" object-fit="contain" object-position="0% 50%" alt=""></amp-img>`;
      return e.link ? `<a href="${esc(e.link)}" style="${place(e)};display:block">${im}</a>` : `<div style="${place(e)}">${im}</div>`;
    }
    const css = `${place(e)};font-family:Montserrat,-apple-system,Segoe UI,Roboto,Arial,sans-serif;font-size:${FS(e.size / 6.6)};font-weight:${e.weight};color:${e.color};line-height:1.3;margin:0;text-shadow:0 1px 8px rgba(0,0,0,0.65)${e.align === 'center' ? ';text-align:center' : ''}${e.upper ? ';text-transform:uppercase' : ''}`;
    const t = esc(e.text), anim = `animate-in="fly-in-bottom" animate-in-delay="${e.delay ?? 0.2}s"`;
    return e.link ? `<a href="${esc(e.link)}" style="${css};text-decoration:none" ${anim}>${t}</a>` : `<p style="${css}" ${anim}>${t}</p>`;
  };
  const markup = pages.map((pg) => {
    const bgEl = pg.els[0] as Extract<El, { kind: 'img' }>;
    const bgLayer = `<amp-story-grid-layer template="fill" animate-in="${bgEl.anim || 'zoom-in'}" animate-in-duration="9s"><amp-img src="${esc(bgEl.src)}" width="720" height="1080" layout="fill" object-fit="cover" object-position="${bgEl.pos || '50% 50%'}" alt=""></amp-img></amp-story-grid-layer>`;
    return `<amp-story-page id="${pg.name}">${bgLayer}<amp-story-grid-layer template="fill"><div style="position:relative;width:100%;height:100%">${pg.els.slice(1).map(rendered).join('')}</div></amp-story-grid-layer>${pg.outlink ? `<amp-story-page-outlink layout="nodisplay" theme="custom" cta-accent-color="${PINK}" cta-accent-element="background"><a href="${esc(pg.outlink.url)}">${esc(pg.outlink.label)}</a></amp-story-page-outlink>` : ''}</amp-story-page>`;
  }).join('');
  const poster = coverUrl || posterPath(s);
  const content = `<amp-story standalone="" title="${esc(s.title)}" publisher="Aurenstar" publisher-logo-src="${esc(site + LOGO)}" poster-portrait-src="${esc(poster.startsWith('http') ? poster : site + poster)}">${markup}</amp-story>`;
  return { story_data, content };
}

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
