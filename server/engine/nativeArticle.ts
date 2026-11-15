/**
 * Native articles: written directly in a language for what people there search (not translated from English).
 * Each one is a plain, fast, standalone page (no JavaScript needed): the text is in the HTML, with its own title, description, address
 * and structured data. This file holds the shape, the quality checks and the page templates, shared by the writer and the build.
 */
import { langTag } from '../../src/utils/urlLang';

const SITE = 'https://aurenstar.com';
const RTL = new Set(['ar', 'he', 'fa', 'ur']);

export interface NativeArticle {
  lang: string; keyword: string; volume: number; slug: string; date: string;
  title: string; description: string; intro: string;
  sections: { h2: string; paragraphs: string[] }[];
  faq: { q: string; a: string }[];
  ui: { home: string; tools: string; articles: string; faq: string; more: string };
}

export const fold = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
const esc = (v: string) => v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const articlePath = (lang: string, slug: string) => `/${lang}/blog/${slug}`;
export const hubPath = (lang: string) => `/${lang}/articles`;

// ---------- quality checks (an article that fails any of them is NOT saved) ----------
const SCRIPTS: Record<string, RegExp> = {
  ja: /[぀-ヿ一-鿿]/, zh: /[一-鿿]/, zht: /[一-鿿]/, ko: /[가-힯]/, ar: /[؀-ۿ]/, fa: /[؀-ۿ]/, ur: /[؀-ۿ]/, he: /[֐-׿]/,
  ru: /[Ѐ-ӿ]/, uk: /[Ѐ-ӿ]/, bg: /[Ѐ-ӿ]/, hi: /[ऀ-ॿ]/, mr: /[ऀ-ॿ]/, bn: /[ঀ-৿]/, ta: /[஀-௿]/, te: /[ఀ-౿]/, th: /[฀-๿]/, el: /[Ͱ-Ͽ]/,
};
const NO_SPACES = new Set(['ja', 'zh', 'zht', 'th']);
const EN_WORDS = /\b(the|and|of|is|are|with|that|this|for|your|you)\b/gi;
const AI_WORDS = /\b(AI|IA)\b|artificial intelligence|chatgpt|openai|as an ai|translated by/i;
const allText = (a: NativeArticle) => [a.title, a.description, a.intro, ...a.sections.flatMap((s) => [s.h2, ...s.paragraphs]), ...a.faq.flatMap((f) => [f.q, f.a])].join('\n');
export const sizeOf = (lang: string, text: string) => (NO_SPACES.has(lang) ? text.replace(/\s/g, '').length : text.split(/\s+/).filter(Boolean).length);

export function checkArticle(a: NativeArticle): string[] {
  const bad: string[] = [];
  const str = (v: unknown, min = 1) => typeof v === 'string' && v.trim().length >= min;
  if (!str(a.title, 8) || !str(a.description, 40) || !str(a.intro, 80)) bad.push('missing title, description or intro');
  if (!Array.isArray(a.sections) || a.sections.length < 4 || a.sections.some((s) => !str(s.h2, 3) || !Array.isArray(s.paragraphs) || s.paragraphs.length < 1)) bad.push('needs at least 4 sections with paragraphs');
  if (!Array.isArray(a.faq) || a.faq.length < 3 || a.faq.some((f) => !str(f.q, 6) || !str(f.a, 20))) bad.push('needs at least 3 questions with answers');
  if (!a.ui || !['home', 'tools', 'articles', 'faq', 'more'].every((k) => str((a.ui as any)[k]))) bad.push('missing page words');
  if (bad.length) return bad;
  const text = allText(a);
  const need = NO_SPACES.has(a.lang) ? 1500 : 650;
  if (sizeOf(a.lang, text) < need) bad.push(`too short (${sizeOf(a.lang, text)} < ${need})`);
  if (a.title.length > 90 || a.title.length < 8) bad.push('title length');
  if (a.description.length > 200) bad.push('description too long');
  const kw = fold(a.keyword);
  const hits = fold(text).split(kw).length - 1;
  if (hits < 2) bad.push(`the search words "${a.keyword}" appear ${hits} times (need 2+)`);
  if (!fold(`${a.title} ${a.intro} ${a.sections.map((s) => s.h2).join(' ')}`).includes(kw)) bad.push('the search words are not in the title, intro or a heading');
  const script = SCRIPTS[a.lang];
  if (script) {
    const letters = text.replace(/[\s\d\p{P}\p{S}]/gu, '');
    const inScript = [...letters].filter((c) => script.test(c)).length;
    if (!letters.length || inScript / letters.length < 0.6) bad.push('text is not mostly in the language script');
  } else if (a.lang !== 'en') {
    const en = (text.match(EN_WORDS) || []).length;
    if (en / Math.max(1, sizeOf(a.lang, text)) > 0.04) bad.push('looks written in English');
  }
  if (AI_WORDS.test(text)) bad.push('mentions AI');
  if (/https?:\/\//i.test(text)) bad.push('contains a link');
  return bad;
}

// ---------- pages ----------
const CSS = `body{margin:0;font:18px/1.7 system-ui,-apple-system,Segoe UI,Roboto,"Noto Sans",sans-serif;color:#1d1b2e;background:#faf8ff}
header,footer{max-width:760px;margin:0 auto;padding:18px 20px;display:flex;gap:18px;flex-wrap:wrap;align-items:center}
header a.b{font-weight:700;letter-spacing:.08em;text-decoration:none;color:#4b2a8f}
a{color:#5b34b0}main{max-width:760px;margin:0 auto;padding:8px 20px 40px}
h1{font-size:2rem;line-height:1.25;margin:.4em 0}h2{font-size:1.35rem;margin:1.6em 0 .4em}
.lead{font-size:1.1rem;color:#3a3556}.cta{display:inline-block;margin:1.4em 0;padding:.8em 1.4em;background:#5b34b0;color:#fff;border-radius:999px;text-decoration:none;font-weight:600}
details{border-top:1px solid #e3dcf5;padding:.6em 0}summary{cursor:pointer;font-weight:600}ul.l{padding-inline-start:1.1em}footer{font-size:.9rem;color:#6b6585;border-top:1px solid #e3dcf5}`;

function shell(lang: string, title: string, description: string, canonical: string, jsonLd: unknown[], body: string, ui: NativeArticle['ui'], ogType: string): string {
  const tag = langTag(lang);
  return `<!doctype html>
<html lang="${tag}"${RTL.has(lang) ? ' dir="rtl"' : ''}>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${esc(title)} | Aurenstar</title>
<meta name="description" content="${esc(description)}" />
<meta name="robots" content="index,follow" />
<link rel="canonical" href="${esc(canonical)}" />
<link rel="alternate" hreflang="${tag}" href="${esc(canonical)}" />
<link rel="icon" href="/favicon-32.png" />
<meta property="og:site_name" content="Aurenstar" />
<meta property="og:type" content="${ogType}" />
<meta property="og:locale" content="${tag.replace('-', '_')}" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(description)}" />
<meta property="og:url" content="${esc(canonical)}" />
<meta property="og:image" content="${SITE}/logo-aurenstar.webp" />
<meta name="twitter:card" content="summary" />
<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>
<style>${CSS}</style>
</head>
<body>
<header><a class="b" href="/${lang}">AURENSTAR</a><a href="/${lang}">${esc(ui.home)}</a><a href="/${lang}/discover-sign">${esc(ui.tools)}</a><a href="${hubPath(lang)}">${esc(ui.articles)}</a></header>
${body}
<footer><a href="/${lang}">Aurenstar</a><a href="/${lang}/about">About</a><a href="/${lang}/privacy">Privacy</a></footer>
</body>
</html>
`;
}

export function renderNativeArticle(a: NativeArticle, others: NativeArticle[] = []): string {
  const url = `${SITE}${articlePath(a.lang, a.slug)}`;
  const jsonLd = [
    { '@context': 'https://schema.org', '@type': 'Article', headline: a.title, description: a.description, inLanguage: langTag(a.lang), mainEntityOfPage: url, datePublished: a.date, dateModified: a.date, author: { '@type': 'Organization', name: 'Aurenstar' }, publisher: { '@type': 'Organization', name: 'Aurenstar', logo: { '@type': 'ImageObject', url: `${SITE}/logo-aurenstar.webp` } } },
    { '@context': 'https://schema.org', '@type': 'FAQPage', inLanguage: langTag(a.lang), mainEntity: a.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
  ];
  const more = others.filter((o) => o.slug !== a.slug).slice(0, 5);
  const body = `<main>
<h1>${esc(a.title)}</h1>
<p class="lead">${esc(a.intro)}</p>
${a.sections.map((s) => `<h2>${esc(s.h2)}</h2>\n${s.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('\n')}`).join('\n')}
<a class="cta" href="/${a.lang}/discover-sign">${esc(a.ui.tools)}</a>
<h2>${esc(a.ui.faq)}</h2>
${a.faq.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('\n')}
${more.length ? `<h2>${esc(a.ui.more)}</h2>\n<ul class="l">${more.map((o) => `<li><a href="${articlePath(o.lang, o.slug)}">${esc(o.title)}</a></li>`).join('')}</ul>` : ''}
</main>`;
  return shell(a.lang, a.title, a.description, url, jsonLd, body, a.ui, 'article');
}

export function renderNativeHub(lang: string, list: NativeArticle[]): string {
  const ui = list[0].ui;
  const url = `${SITE}${hubPath(lang)}`;
  const body = `<main><h1>${esc(ui.articles)}</h1>\n<ul class="l">${list.map((o) => `<li><a href="${articlePath(lang, o.slug)}">${esc(o.title)}</a><br /><small>${esc(o.description)}</small></li>`).join('\n')}</ul></main>`;
  return shell(lang, ui.articles, list[0].description, url, [{ '@context': 'https://schema.org', '@type': 'CollectionPage', name: ui.articles, inLanguage: langTag(lang), url }], body, ui, 'website');
}
