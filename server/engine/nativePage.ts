/**
 * Native text for the main pages of the site (tools, home ...), written directly in a language for what people there search.
 * The page itself (the tool) stays the same; the language function swaps the head (title, description, keywords) and adds a readable
 * text block with questions and answers below the app. Data: data/native-pages/<lang>/<page>.json -> dist/native-pages.json.
 */
import { langTag } from '../../src/utils/urlLang';

export interface NativePage {
  lang: string; page: string; keyword: string; volume?: number;
  title: string; description: string; intro: string;
  sections: { h2: string; paragraphs: string[] }[];
  faq: { q: string; a: string }[];
  tags?: string[]; ui?: { faq?: string };
}
const esc = (v: string) => v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function checkNativePage(p: NativePage): string[] {
  const bad: string[] = [];
  const s = (v: unknown, n: number) => typeof v === 'string' && v.trim().length >= n;
  if (!s(p?.title, 8) || !s(p?.description, 40) || !s(p?.intro, 40) || !s(p?.keyword, 2)) bad.push('missing title, description, intro or keyword');
  if (!Array.isArray(p?.sections) || p.sections.length < 2 || p.sections.some((x) => !s(x.h2, 3) || !Array.isArray(x.paragraphs) || !x.paragraphs.length)) bad.push('needs sections');
  if (!Array.isArray(p?.faq) || p.faq.length < 3 || p.faq.some((f) => !s(f.q, 6) || !s(f.a, 20))) bad.push('needs 3+ questions');
  if (p?.title && p.title.length > 90) bad.push('title too long');
  if (p?.description && p.description.length > 200) bad.push('description too long');
  return bad;
}

export function injectNativePage(html: string, p: NativePage): string {
  const kws = [p.keyword, ...(p.tags || [])].filter((v, i, a) => v && a.findIndex((x) => x.toLowerCase() === v.toLowerCase()) === i);
  const head =
    `    <meta name="keywords" content="${esc(kws.join(', '))}" />\n` +
    `    <script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', inLanguage: langTag(p.lang), mainEntity: p.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }).replace(/</g, '\\u003c')}</script>\n`;
  const block =
    `<section data-no-translate lang="${langTag(p.lang)}" style="max-width:760px;margin:0 auto;padding:32px 20px;font:17px/1.7 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1d1b2e">` +
    `<h2 style="font-size:1.5rem;margin:0 0 .5em">${esc(p.title)}</h2><p>${esc(p.intro)}</p>` +
    p.sections.map((s) => `<h3 style="font-size:1.2rem;margin:1.4em 0 .3em">${esc(s.h2)}</h3>${s.paragraphs.map((x) => `<p>${esc(x)}</p>`).join('')}`).join('') +
    `<h3 style="font-size:1.2rem;margin:1.4em 0 .3em">${esc(p.ui?.faq || 'FAQ')}</h3>` +
    p.faq.map((f) => `<details style="border-top:1px solid #e3dcf5;padding:.6em 0"><summary style="cursor:pointer;font-weight:600">${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('') +
    (p.tags?.length ? `<p>${p.tags.map((t) => `<span style="display:inline-block;margin:0 6px 6px 0;padding:2px 10px;border:1px solid #e3dcf5;border-radius:999px;font-size:.85rem;color:#4b2a8f">${esc(t)}</span>`).join(' ')}</p>` : '') +
    `</section>\n`;
  let out = html.replace('</head>', `${head}  </head>`);
  out = /<\/body>/.test(out) ? out.replace('</body>', `${block}</body>`) : out + block;
  return out;
}
