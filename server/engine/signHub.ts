/**
 * Sign hub pages: one standalone page per zodiac sign and language (en /signs/gemini, pt /pt/signos/gemeos, es /es/signos/geminis).
 * They gather the sign's essentials (dates, element, personality, advice) and link to every article about it, so Google
 * understands that the sign is a strong topic of the site and the articles get internal links. Text comes from src/data/signsData.ts.
 */
import { langTag } from '../../src/utils/urlLang';
import type { SignInfo } from '../../src/data/signsData';
import { hubSlug, hubUrlPath, type HubLang } from '../../src/utils/signHubLinks';
export { hubSlug, hubUrlPath };
export type { HubLang };

const SITE = 'https://aurenstar.com';
export const HUB_LANGS: HubLang[] = ['en', 'pt', 'es'];
const esc = (v: string) => v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');


const T: Record<HubLang, {
  home: string; dict: string; contact: string; tools: string; articles: string; faq: string; articlesAbout: (n: string) => string; cta: string; facts: string;
  title: (n: string) => string; desc: (n: string, p: string, e: string) => string;
  period: string; element: string; advice: string;
  q: { dates: (n: string) => string; element: (n: string) => string; personality: (n: string) => string; tip: (n: string) => string };
  a: { dates: (n: string, p: string) => string; element: (n: string, e: string) => string };
}> = {
  en: {
    home: 'Home', dict: 'Dictionary', contact: 'Contact', tools: 'Free tools', articles: 'Articles', faq: 'Common questions', articlesAbout: (n) => `Articles about ${n}`, cta: 'Discover your sign', facts: 'Quick facts',
    title: (n) => `${n}: Personality, Traits and Everything About the Sign`,
    desc: (n, p, e) => `${n} (${p}): ${e.toLowerCase()} sign. Personality, strengths and articles to understand ${n} in simple language.`,
    period: 'Dates', element: 'Element', advice: 'A simple tip',
    q: { dates: (n) => `What are the dates of ${n}?`, element: (n) => `What element is ${n}?`, personality: (n) => `What is ${n} like?`, tip: (n) => `What helps ${n} day to day?` },
    a: { dates: (n, p) => `${n} covers ${p}.`, element: (n, e) => `${n} is a ${e.toLowerCase()} sign.` },
  },
  pt: {
    home: 'Início', dict: 'Dicionário', contact: 'Contato', tools: 'Ferramentas grátis', articles: 'Artigos', faq: 'Perguntas frequentes', articlesAbout: (n) => `Artigos sobre ${n}`, cta: 'Descubra o seu signo', facts: 'Em resumo',
    title: (n) => `${n}: personalidade, características e tudo sobre o signo`,
    desc: (n, p, e) => `${n} (${p}): signo de ${e.toLowerCase()}. Personalidade, pontos fortes e artigos para entender ${n} de forma simples.`,
    period: 'Datas', element: 'Elemento', advice: 'Uma dica simples',
    q: { dates: (n) => `Quais são as datas de ${n}?`, element: (n) => `Qual é o elemento de ${n}?`, personality: (n) => `Como é ${n}?`, tip: (n) => `O que ajuda ${n} no dia a dia?` },
    a: { dates: (n, p) => `${n} vai de ${p}.`, element: (n, e) => `${n} é um signo de ${e.toLowerCase()}.` },
  },
  es: {
    home: 'Inicio', dict: 'Diccionario', contact: 'Contacto', tools: 'Herramientas gratis', articles: 'Artículos', faq: 'Preguntas frecuentes', articlesAbout: (n) => `Artículos sobre ${n}`, cta: 'Descubre tu signo', facts: 'En resumen',
    title: (n) => `${n}: personalidad, rasgos y todo sobre el signo`,
    desc: (n, p, e) => `${n} (${p}): signo de ${e.toLowerCase()}. Personalidad, puntos fuertes y artículos para entender ${n} de forma sencilla.`,
    period: 'Fechas', element: 'Elemento', advice: 'Un consejo sencillo',
    q: { dates: (n) => `¿Cuáles son las fechas de ${n}?`, element: (n) => `¿Qué elemento es ${n}?`, personality: (n) => `¿Cómo es ${n}?`, tip: (n) => `¿Qué ayuda a ${n} en el día a día?` },
    a: { dates: (n, p) => `${n} va del ${p}.`, element: (n, e) => `${n} es un signo de ${e.toLowerCase()}.` },
  },
};

const HUB_CSS = `*{box-sizing:border-box}body{margin:0;font:17px/1.7 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue","Noto Sans",sans-serif;color:#172B4D;background:#C9E5FF;min-height:100vh}
.top{max-width:1180px;margin:0 auto;padding:18px 24px;display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.top img{height:40px;width:auto;margin-inline-end:auto;display:block}
.top a.p{padding:10px 18px;border-radius:999px;background:#E4F1FF;color:#3982C8;text-decoration:none;font-weight:500;font-size:.85rem;letter-spacing:.06em;text-transform:uppercase}
.top a.p.on{background:#E73578;color:#fff}
main{max-width:880px;margin:0 auto;padding:18px 20px 56px}
.hero{text-align:center;padding:34px 26px 38px}
.sym{display:inline-flex;align-items:center;justify-content:center;width:72px;height:72px;border-radius:50%;background:#E73578;color:#fff;font:400 2.2rem/1 "Segoe UI Symbol","Noto Sans Symbols",sans-serif;margin-bottom:14px}
h1{font-size:2.5rem;line-height:1.15;margin:0;font-weight:900;color:#3982C8;letter-spacing:-.01em}
h1 em{display:block;font-style:normal;color:#E73578;font-size:.62em;line-height:1.25;margin-top:.25em}
.lead{font-size:1.1rem;color:#647DA5;margin:16px auto 0;max-width:620px}
.chips{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:20px 0 0}
.chips span{background:#E4F1FF;color:#3982C8;font-weight:700;font-size:.9rem;padding:8px 18px;border-radius:999px}.chips span.k{background:#FBE1EB;color:#E73578}
.card{background:#fff;border-radius:24px;padding:28px 30px;margin:0 0 20px;box-shadow:0 10px 26px rgba(23,54,111,.08)}
.card.pk{background:#FBE1EB}.card.pk h2::after{background:#E73578}
h2{font-size:1rem;margin:0 0 1.1em;color:#172B4D;font-weight:800;letter-spacing:.2em;text-transform:uppercase}
h2::after{content:"";display:block;width:48px;height:4px;border-radius:4px;background:#3982C8;margin-top:10px}
p{margin:.3em 0;color:#172B4D}.card.pk p{color:#172B4D}a{color:#3982C8;text-decoration:none}a:hover{color:#E73578}
ul.l{list-style:none;padding:0;margin:.3em 0;display:grid;gap:10px}ul.l li{padding:14px 18px;background:#E4F1FF;border-radius:16px;font-weight:600}ul.l li a{color:#17366F}ul.l li a::after{content:" \\2192";color:#E73578}
.cta{display:inline-block;margin:6px 0 24px;padding:.95em 2.2em;background:#E73578;color:#fff!important;border-radius:999px;text-decoration:none!important;font-weight:700;letter-spacing:.04em;box-shadow:0 10px 24px rgba(231,53,120,.30)}
.ctaw{text-align:center}
details{border-top:1px solid #D9E8F8;padding:.8em 0}details:first-of-type{border-top:0}summary{cursor:pointer;font-weight:600;color:#172B4D}summary::marker{color:#E73578}details p{color:#647DA5}
footer{max-width:880px;margin:0 auto;padding:10px 20px 40px;display:flex;gap:18px;flex-wrap:wrap;justify-content:center;font-size:.9rem}footer a{color:#647DA5}
@media(max-width:560px){.card{padding:22px 20px;border-radius:20px}h1{font-size:1.9rem}.top a.p{padding:8px 13px;font-size:.75rem}}`;

const clip = (s: string, max = 155) => (s.length <= max ? s : `${s.slice(0, max - 1).replace(/[\s,;:.-]+\S*$/, '')}…`);

export function renderSignHub(lang: HubLang, sign: SignInfo, articles: { title: string; href: string }[], sections: { h: string; p: string }[] = []): string {
  const t = T[lang], n = sign.name[lang], p = sign.period[lang], e = sign.element[lang];
  const base = lang === 'en' ? '' : `/${lang}`;
  const url = `${SITE}${hubUrlPath(sign, lang)}`;
  const title = t.title(n), description = clip(t.desc(n, p, e));
  const faq = [
    { q: t.q.dates(n), a: t.a.dates(n, p) },
    { q: t.q.element(n), a: t.a.element(n, e) },
    { q: t.q.personality(n), a: sign.essence[lang] },
    { q: t.q.tip(n), a: sign.advice[lang] },
  ];
  const jsonLd = [
    { '@context': 'https://schema.org', '@type': 'CollectionPage', name: title, description, inLanguage: langTag(lang), url },
    { '@context': 'https://schema.org', '@type': 'FAQPage', inLanguage: langTag(lang), mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: t.home, item: `${SITE}${base || '/'}` }, { '@type': 'ListItem', position: 2, name: n, item: url }] },
  ];
  const alt = HUB_LANGS.map((l) => `<link rel="alternate" hreflang="${langTag(l)}" href="${SITE}${hubUrlPath(sign, l)}" />`).join('\n') + `\n<link rel="alternate" hreflang="x-default" href="${SITE}${hubUrlPath(sign, 'en')}" />`;
  const tag = langTag(lang);
  return `<!doctype html>
<html lang="${tag}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${esc(title)} | Aurenstar</title>
<meta name="description" content="${esc(description)}" />
<meta name="robots" content="index,follow" />
<link rel="canonical" href="${esc(url)}" />
${alt}
<link rel="icon" href="/favicon-32.png" />
<meta property="og:site_name" content="Aurenstar" />
<meta property="og:type" content="website" />
<meta property="og:locale" content="${tag.replace('-', '_')}" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(description)}" />
<meta property="og:url" content="${esc(url)}" />
<meta property="og:image" content="${SITE}/logo-aurenstar.webp" />
<meta name="twitter:card" content="summary" />
<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>
<style>${HUB_CSS}</style>
</head>
<body>
<header class="top"><a href="${base || '/'}"><img src="/logo-aurenstar.webp" alt="Aurenstar" /></a><a class="p" href="${base || '/'}">${esc(t.home)}</a><a class="p" href="${lang === 'en' ? '/dictionary' : base + '/dicionario'}">${esc(t.dict)}</a><a class="p" href="${base}/blog">Blog</a><a class="p" href="${base}/newsletter">Newsletter</a><a class="p" href="${base || ''}/#faq">FAQ</a><a class="p" href="${base}/contact">${esc(t.contact)}</a></header>
<main>
<section class="card hero"><div class="sym">${esc(sign.symbol)}&#xFE0E;</div><h1>${esc(n)}<em>${esc(title.slice(n.length).replace(/^[:\s]+/, ''))}</em></h1><p class="lead">${esc(sign.essence[lang])}</p><div class="chips"><span class="k">${esc(p)}</span><span>${esc(e)}</span></div></section>
${sections.map((x) => `<section class="card"><h2>${esc(x.h)}</h2>\n<p>${esc(x.p)}</p></section>`).join('\n')}
<section class="card pk"><h2>${esc(t.advice)}</h2>
<p>${esc(sign.advice[lang])}</p></section>
${articles.length ? `<section class="card"><h2>${esc(t.articlesAbout(n))}</h2>\n<ul class="l">${articles.map((a) => `<li><a href="${esc(a.href)}">${esc(a.title)}</a></li>`).join('\n')}</ul></section>` : ''}
<div class="ctaw"><a class="cta" href="${base}/discover-sign">${esc(t.cta)}</a></div>
<section class="card"><h2>${esc(t.faq)}</h2>
${faq.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('\n')}</section>
</main>
<footer><a href="${base || '/'}">Aurenstar</a><a href="${base}/about">About</a><a href="${base}/privacy">Privacy</a></footer>
</body>
</html>
`;
}
