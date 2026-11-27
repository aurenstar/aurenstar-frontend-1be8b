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

const HUB_CSS = `*{box-sizing:border-box}body{margin:0;font:16px/1.65 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue","Noto Sans",sans-serif;color:#172B4D;background:#C9E5FF;min-height:100vh}
.top{max-width:1180px;margin:0 auto;padding:18px 24px;display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.top img{height:40px;width:auto;margin-inline-end:auto;display:block}
.top a.p{padding:10px 18px;border-radius:999px;background:#E4F1FF;color:#3982C8;text-decoration:none;font-weight:500;font-size:.85rem;letter-spacing:.06em;text-transform:uppercase}
.top a.p.on{background:#E73578;color:#fff}
main{max-width:900px;margin:0 auto;padding:10px 20px 56px}
.prof{background:#fff;border:1px solid #D9E8F8;border-radius:32px;padding:20px;box-shadow:0 14px 40px rgba(23,54,111,.10)}
.cover{position:relative;height:224px;border-radius:16px;background:#3982C8}
.cover svg{position:absolute;inset:0;width:100%;height:100%;border-radius:16px}
.av{position:absolute;left:22px;bottom:-36px;width:96px;height:96px;border-radius:16px;border:4px solid #fff;background:#fff;box-shadow:0 4px 12px rgba(23,54,111,.18);display:flex;align-items:center;justify-content:center;color:#E73578;font:400 3.4rem/1 "Segoe UI Symbol","Noto Sans Symbols",sans-serif}
.head{display:flex;gap:18px;flex-wrap:wrap;justify-content:space-between;align-items:flex-start;padding:50px 6px 8px}
.id{flex:1 1 320px;min-width:0}
h1{font-size:1.55rem;line-height:1.25;margin:0;color:#172B4D;font-weight:800;display:flex;gap:8px;align-items:flex-start}
.ck{flex:none;width:24px;height:24px;margin-top:3px;border-radius:50%;background:#3982C8;display:inline-flex;align-items:center;justify-content:center}
.sub{margin:4px 0 8px;font-size:.85rem;color:#647DA5}
.lead{margin:0;color:#172B4D}
.stats{display:flex;gap:10px;flex-wrap:wrap}
.stat{min-width:104px;max-width:190px;text-align:center;background:#fff;border:1px solid #D9E8F8;border-radius:16px;padding:12px 12px 10px;box-shadow:0 1px 3px rgba(23,54,111,.08)}
.stat i{display:inline-flex;width:36px;height:36px;border-radius:12px;align-items:center;justify-content:center;margin-bottom:6px}
.stat i svg{width:18px;height:18px}
.stat b{display:block;font-size:.95rem;font-weight:800;color:#172B4D;line-height:1.25}
.stat span{display:block;font-size:.68rem;color:#647DA5;margin-top:2px}
.box{border:1px solid #D9E8F8;border-radius:16px;padding:20px 22px;margin:14px 0 0;background:#fff}
.box.pk{background:#FFF5FA;border-color:#F7B5D2}
h2{font-size:.9rem;margin:0 0 .8em;color:#172B4D;font-weight:800;letter-spacing:.18em;text-transform:uppercase;display:inline-block;padding-bottom:7px;border-bottom:3px solid #E73578}
p{margin:.3em 0;color:#172B4D}a{color:#3982C8;text-decoration:none}a:hover{color:#E73578}
ul.l{list-style:none;padding:0;margin:.3em 0;display:grid;gap:10px}ul.l li{padding:12px 16px;background:#F4F9FF;border:1px solid #D9E8F8;border-radius:14px;font-weight:600;border-inline-start:4px solid #E73578}
.cta{display:inline-block;margin:18px 0 2px;padding:.9em 2em;background:#E73578;color:#fff!important;border-radius:999px;text-decoration:none!important;font-weight:700;box-shadow:0 8px 20px rgba(231,53,120,.30)}
.ctaw{text-align:center}
details{border-top:1px solid #D9E8F8;padding:.75em 0}details:first-of-type{border-top:0}summary{cursor:pointer;font-weight:600;color:#172B4D}summary::marker{color:#E73578}details p{color:#647DA5}
footer{max-width:900px;margin:0 auto;padding:10px 20px 40px;display:flex;gap:18px;flex-wrap:wrap;justify-content:center;font-size:.9rem}footer a{color:#647DA5}
@media(max-width:560px){.prof{padding:12px;border-radius:24px}.cover{height:150px}.av{width:80px;height:80px;font-size:2.8rem;left:14px;bottom:-30px}.head{padding-top:42px}.top a.p{padding:8px 13px;font-size:.75rem}}`;

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
<section class="prof">
<div class="cover"><svg viewBox="0 0 800 224" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden="true"><ellipse cx="640" cy="112" rx="300" ry="86" transform="rotate(-18 640 112)" stroke="#fff" stroke-opacity="0.28" stroke-width="14"/><ellipse cx="640" cy="112" rx="220" ry="58" transform="rotate(-18 640 112)" stroke="#E73578" stroke-opacity="0.9" stroke-width="8"/><circle cx="90" cy="40" r="90" fill="#fff" fill-opacity="0.08"/><circle cx="330" cy="215" r="70" fill="#fff" fill-opacity="0.08"/><path d="M520 50 l7 18 18 7 -18 7 -7 18 -7 -18 -18 -7 18 -7z" fill="#fff"/><path d="M730 150 l5 13 13 5 -13 5 -5 13 -5 -13 -13 -5 13 -5z" fill="#E73578"/><path d="M250 70 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4z" fill="#fff" fill-opacity="0.8"/><circle cx="420" cy="40" r="3" fill="#fff" fill-opacity="0.7"/><circle cx="180" cy="150" r="2.5" fill="#fff" fill-opacity="0.6"/><circle cx="470" cy="170" r="3" fill="#fff" fill-opacity="0.6"/><circle cx="780" cy="40" r="3" fill="#fff" fill-opacity="0.7"/></svg><div class="av">${esc(sign.symbol)}&#xFE0E;</div></div>
<div class="head"><div class="id"><h1>${esc(title)}<span class="ck"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg></span></h1><p class="sub">@aurenstar &middot; aurenstar.com</p><p class="lead">${esc(sign.essence[lang])}</p></div>
<div class="stats"><div class="stat"><i style="background:#3982C8"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/></svg></i><b>${esc(p)}</b><span>${esc(t.period)}</span></div><div class="stat"><i style="background:#E73578"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c3 4 6 6 6 10a6 6 0 0 1-12 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3 0-6 2-9z"/></svg></i><b>${esc(e)}</b><span>${esc(t.element)}</span></div>${articles.length ? `<div class="stat"><i style="background:#3982C8"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h9l4 4v14H6z"/><path d="M9 12h7M9 16h7"/></svg></i><b>${articles.length}</b><span>${esc(t.articles)}</span></div>` : ''}</div></div>
${sections.map((x) => `<div class="box"><h2>${esc(x.h)}</h2>\n<p>${esc(x.p)}</p></div>`).join('\n')}
<div class="box pk"><h2>${esc(t.advice)}</h2>
<p>${esc(sign.advice[lang])}</p></div>
${articles.length ? `<div class="box"><h2>${esc(t.articlesAbout(n))}</h2>\n<ul class="l">${articles.map((a) => `<li><a href="${esc(a.href)}">${esc(a.title)}</a></li>`).join('\n')}</ul></div>` : ''}
<div class="ctaw"><a class="cta" href="${base}/discover-sign">${esc(t.cta)}</a></div>
<div class="box"><h2>${esc(t.faq)}</h2>
${faq.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('\n')}</div>
</section>
</main>
<footer><a href="${base || '/'}">Aurenstar</a><a href="${base}/about">About</a><a href="${base}/privacy">Privacy</a></footer>
</body>
</html>
`;
}
