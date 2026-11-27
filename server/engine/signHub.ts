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
  home: string; tools: string; articles: string; faq: string; articlesAbout: (n: string) => string; cta: string; facts: string;
  title: (n: string) => string; desc: (n: string, p: string, e: string) => string;
  period: string; element: string; advice: string;
  q: { dates: (n: string) => string; element: (n: string) => string; personality: (n: string) => string; tip: (n: string) => string };
  a: { dates: (n: string, p: string) => string; element: (n: string, e: string) => string };
}> = {
  en: {
    home: 'Home', tools: 'Free tools', articles: 'Articles', faq: 'Common questions', articlesAbout: (n) => `Articles about ${n}`, cta: 'Discover your sign', facts: 'Quick facts',
    title: (n) => `${n}: Personality, Traits and Everything About the Sign`,
    desc: (n, p, e) => `${n} (${p}): ${e.toLowerCase()} sign. Personality, strengths and articles to understand ${n} in simple language.`,
    period: 'Dates', element: 'Element', advice: 'A simple tip',
    q: { dates: (n) => `What are the dates of ${n}?`, element: (n) => `What element is ${n}?`, personality: (n) => `What is ${n} like?`, tip: (n) => `What helps ${n} day to day?` },
    a: { dates: (n, p) => `${n} covers ${p}.`, element: (n, e) => `${n} is a ${e.toLowerCase()} sign.` },
  },
  pt: {
    home: 'Início', tools: 'Ferramentas grátis', articles: 'Artigos', faq: 'Perguntas frequentes', articlesAbout: (n) => `Artigos sobre ${n}`, cta: 'Descubra o seu signo', facts: 'Em resumo',
    title: (n) => `${n}: personalidade, características e tudo sobre o signo`,
    desc: (n, p, e) => `${n} (${p}): signo de ${e.toLowerCase()}. Personalidade, pontos fortes e artigos para entender ${n} de forma simples.`,
    period: 'Datas', element: 'Elemento', advice: 'Uma dica simples',
    q: { dates: (n) => `Quais são as datas de ${n}?`, element: (n) => `Qual é o elemento de ${n}?`, personality: (n) => `Como é ${n}?`, tip: (n) => `O que ajuda ${n} no dia a dia?` },
    a: { dates: (n, p) => `${n} vai de ${p}.`, element: (n, e) => `${n} é um signo de ${e.toLowerCase()}.` },
  },
  es: {
    home: 'Inicio', tools: 'Herramientas gratis', articles: 'Artículos', faq: 'Preguntas frecuentes', articlesAbout: (n) => `Artículos sobre ${n}`, cta: 'Descubre tu signo', facts: 'En resumen',
    title: (n) => `${n}: personalidad, rasgos y todo sobre el signo`,
    desc: (n, p, e) => `${n} (${p}): signo de ${e.toLowerCase()}. Personalidad, puntos fuertes y artículos para entender ${n} de forma sencilla.`,
    period: 'Fechas', element: 'Elemento', advice: 'Un consejo sencillo',
    q: { dates: (n) => `¿Cuáles son las fechas de ${n}?`, element: (n) => `¿Qué elemento es ${n}?`, personality: (n) => `¿Cómo es ${n}?`, tip: (n) => `¿Qué ayuda a ${n} en el día a día?` },
    a: { dates: (n, p) => `${n} va del ${p}.`, element: (n, e) => `${n} es un signo de ${e.toLowerCase()}.` },
  },
};

const HUB_CSS = `*{box-sizing:border-box}body{margin:0;font:17px/1.7 system-ui,-apple-system,"Segoe UI",Roboto,"Noto Sans",sans-serif;color:#172B4D;background:linear-gradient(135deg,#C9E5FF 0%,#DCEBFF 55%,#E9E4FA 100%);background-attachment:fixed;min-height:100vh}
.top{max-width:1040px;margin:0 auto;padding:16px 20px;display:flex;gap:10px;flex-wrap:wrap;align-items:center}
.top img{height:38px;width:auto;margin-inline-end:10px;display:block}
.top a.p{padding:9px 18px;border-radius:999px;background:#E4F1FF;color:#3982C8;text-decoration:none;font-weight:600;font-size:.82rem;letter-spacing:.04em;text-transform:uppercase}
.top a.p.on{background:#E73578;color:#fff}
main{max-width:820px;margin:0 auto;padding:8px 20px 48px}
.card{background:#fff;border:1px solid #D9E8F8;border-radius:24px;padding:26px 28px;margin:0 0 18px;box-shadow:0 8px 30px rgba(57,130,200,.10)}
.hero{text-align:center;padding:34px 28px}
.sym{display:inline-flex;align-items:center;justify-content:center;width:72px;height:72px;border-radius:20px;background:#FBE1EB;color:#E73578;font-size:2.2rem;margin-bottom:10px}
h1{font-size:1.9rem;line-height:1.25;margin:.2em 0;color:#17366F}
h2{font-size:1.25rem;margin:0 0 .5em;color:#17366F}
.lead{font-size:1.08rem;color:#647DA5;margin:.4em auto 0;max-width:640px}
.facts{display:flex;gap:12px;flex-wrap:wrap}.facts div{flex:1 1 200px;background:#E4F1FF;border-radius:16px;padding:14px 18px}
.facts span{display:block;font-size:.75rem;text-transform:uppercase;letter-spacing:.06em;color:#647DA5;font-weight:700}.facts b{color:#17366F;font-size:1.1rem}
p{margin:.3em 0}a{color:#3982C8}ul.l{padding-inline-start:1.1em;margin:.3em 0}ul.l li{margin:.35em 0}
.cta{display:inline-block;margin:.2em 0 18px;padding:.85em 1.7em;background:#E73578;color:#fff;border-radius:999px;text-decoration:none;font-weight:700;box-shadow:0 6px 18px rgba(231,53,120,.30)}
details{border-top:1px solid #D9E8F8;padding:.7em 0}details:first-of-type{border-top:0}summary{cursor:pointer;font-weight:700;color:#17366F}
footer{max-width:820px;margin:0 auto;padding:10px 20px 36px;display:flex;gap:18px;flex-wrap:wrap;justify-content:center;font-size:.9rem}footer a{color:#647DA5}
@media(max-width:560px){.card{padding:20px 18px;border-radius:20px}h1{font-size:1.5rem}}`;

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
<header class="top"><a href="${base || '/'}"><img src="/assets/aurenstar-logo-v2.png" alt="Aurenstar" /></a><a class="p" href="${base || '/'}">${esc(t.home)}</a><a class="p" href="${base}/discover-sign">${esc(t.tools)}</a><a class="p" href="${base}/blog">${esc(t.articles)}</a></header>
<main>
<section class="card hero"><div class="sym">${esc(sign.symbol)}</div><h1>${esc(title)}</h1><p class="lead">${esc(sign.essence[lang])}</p></section>
<section class="card"><h2>${esc(t.facts)}</h2><div class="facts"><div><span>${esc(t.period)}</span><b>${esc(p)}</b></div><div><span>${esc(t.element)}</span><b>${esc(e)}</b></div></div></section>
${sections.map((x) => `<section class="card"><h2>${esc(x.h)}</h2>\n<p>${esc(x.p)}</p></section>`).join('\n')}
<section class="card"><h2>${esc(t.advice)}</h2>
<p>${esc(sign.advice[lang])}</p></section>
${articles.length ? `<section class="card"><h2>${esc(t.articlesAbout(n))}</h2>\n<ul class="l">${articles.map((a) => `<li><a href="${esc(a.href)}">${esc(a.title)}</a></li>`).join('\n')}</ul></section>` : ''}
<div style="text-align:center"><a class="cta" href="${base}/discover-sign">${esc(t.cta)}</a></div>
<section class="card"><h2>${esc(t.faq)}</h2>
${faq.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('\n')}</section>
</main>
<footer><a href="${base || '/'}">Aurenstar</a><a href="${base}/about">About</a><a href="${base}/privacy">Privacy</a></footer>
</body>
</html>
`;
}
