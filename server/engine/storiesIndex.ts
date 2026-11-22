/**
 * The page aurenstar.com/blog/stories: a gallery of every published Web Story, grouped by language.
 * Same look as the site (sky blue background, white rounded cards, Montserrat titles, pink pills).
 * Plain HTML, no scripts: fast, and Google can follow every link.
 */
import { esc, GA_ID, LOGO } from './webStory';
import type { WpStory } from './storyPlugin';

const ORDER = ['en', 'pt', 'es'];

function langName(code: string): string {
  try { return new Intl.DisplayNames([code], { type: 'language' }).of(code) || code; } catch { return code; }
}

export function renderStoriesIndex(stories: WpStory[], site: string): string {
  const url = `${site}/blog/stories`;
  const byLang = new Map<string, WpStory[]>();
  for (const s of stories) byLang.set(s.lang, [...(byLang.get(s.lang) || []), s]);
  const langs = [...byLang.keys()].sort((a, b) => {
    const ia = ORDER.indexOf(a), ib = ORDER.indexOf(b);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib) || a.localeCompare(b);
  });
  const poster = (s: WpStory) => (s.content.match(/poster-portrait-src="([^"]+)"/) || [])[1] || `${site}/stories/img/bg-air.webp`;
  const sections = langs.map((l) => {
    const cards = byLang.get(l)!.sort((a, b) => b.modified.localeCompare(a.modified) || a.title.localeCompare(b.title)).map((s) =>
      `<a class="card" href="/blog/stories/${esc(s.slug)}"><span class="pic"><img src="${esc(poster(s))}" width="180" height="320" loading="lazy" alt=""><span class="play">&#9654;</span></span><span class="t">${esc(s.title)}</span></a>`).join('\n');
    return `<section id="${esc(l)}"><h2><span class="pill">${esc(l.toUpperCase())}</span> ${esc(langName(l))}</h2><div class="grid">\n${cards}\n</div></section>`;
  }).join('\n');
  const nav = langs.map((l) => `<a href="#${esc(l)}">${esc(l.toUpperCase())}</a>`).join('');
  const ld = {
    '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Astrology Web Stories', url,
    publisher: { '@type': 'Organization', name: 'Aurenstar', logo: { '@type': 'ImageObject', url: `${site}${LOGO}` } },
    mainEntity: { '@type': 'ItemList', itemListElement: stories.slice(0, 100).map((s, i) => ({ '@type': 'ListItem', position: i + 1, url: `${site}/blog/stories/${s.slug}` })) },
  };
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Astrology Web Stories | Aurenstar</title>
<meta name="description" content="Quick, swipeable astrology stories: signs, compatibility, houses and more. Pick a story and swipe through in 30 seconds.">
<link rel="canonical" href="${esc(url)}/">
<link rel="icon" href="/favicon-32.png" sizes="32x32">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700;800&display=swap" rel="stylesheet">
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date());gtag("config","${GA_ID}");</script>
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>
<style>
*{box-sizing:border-box}body{margin:0;background:#C9E5FF;color:#172B4D;font-family:Montserrat,system-ui,sans-serif}
a{color:inherit;text-decoration:none}
header{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 20px;max-width:1100px;margin:0 auto}
header img{height:36px;width:auto;background:#fff;border-radius:999px;padding:6px 14px;display:block}
header a.back{font-weight:700;font-size:14px;color:#17366F}
.hero{max-width:1100px;margin:0 auto;padding:8px 20px 4px}
h1{font-weight:800;color:#17366F;font-size:clamp(26px,5vw,42px);line-height:1.15;margin:12px 0 8px}
.hero p{margin:0 0 14px;font-size:16px;line-height:1.5;max-width:640px}
.nav{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0 6px}
.nav a,.pill{background:#E73578;color:#fff;font-weight:800;font-size:12px;border-radius:999px;padding:6px 12px;display:inline-block}
main{max-width:1100px;margin:0 auto;padding:0 20px 56px}
h2{font-weight:800;color:#17366F;font-size:22px;margin:30px 0 14px;display:flex;align-items:center;gap:10px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:14px}
.card{background:#fff;border-radius:22px;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 6px 18px rgba(23,54,111,.12);transition:transform .15s}
.card:hover{transform:translateY(-3px)}
.pic{position:relative;display:block;aspect-ratio:9/12;overflow:hidden;background:#3982C8}
.pic img{width:100%;height:100%;object-fit:cover;display:block}
.play{position:absolute;right:10px;bottom:10px;background:#E73578;color:#fff;border-radius:999px;width:30px;height:30px;display:flex;align-items:center;justify-content:center;font-size:12px}
.t{padding:12px 14px 16px;font-weight:700;font-size:14px;line-height:1.35;color:#172B4D}
footer{text-align:center;padding:0 20px 40px;font-size:13px;color:#17366F}
</style>
</head>
<body>
<header><a href="/"><img src="/logo-aurenstar.webp" width="108" height="36" alt="Aurenstar"></a><a class="back" href="/blog">Blog &rarr;</a></header>
<div class="hero">
<h1>Astrology Web Stories</h1>
<p>Swipe through short, visual stories about signs, compatibility, houses and more. Each one takes about 30 seconds, then opens the full article.</p>
<div class="nav">${nav}</div>
</div>
<main>
${sections}
</main>
<footer>&copy; Aurenstar</footer>
</body>
</html>
`;
}
