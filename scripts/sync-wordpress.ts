/**
 * Brings the articles written in WordPress into the site.
 *   npm run sync:wordpress
 * Reads the public WordPress API (no password needed), turns each post into a site article, saves the
 * cover image on our own address and writes src/data/wordpressArticles.generated.json.
 * Publish in WordPress -> this runs on a schedule (.github/workflows/wordpress-sync.yml) -> the site is rebuilt
 * and the article appears in /blog.
 * Set WP_URL to change the source (default: https://blog.aurenstar.com).
 */
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WP = (process.env.WP_URL || 'https://blog.aurenstar.com').replace(/\/$/, '');
const OUT = path.join(root, 'src/data/wordpressArticles.generated.json');
const IMG_DIR = path.join(root, 'public/assets/wp');

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', hellip: '…', mdash: '—', ndash: '–', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“' };
const decode = (s: string) =>
  s
    .replace(/&#(\d+);/g, (_m, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_m, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? m);
const text = (html: string) => decode(html.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();

/** <h2>/<h3> start a section; <p> and <li> become paragraphs. */
function sectionsFrom(html: string) {
  const sections: { heading: string; paragraphs: string[] }[] = [];
  let current: { heading: string; paragraphs: string[] } | null = null;
  const re = /<(h[1-6]|p|li|blockquote)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const tag = m[1].toLowerCase();
    const t = text(m[2]);
    if (!t) continue;
    if (/^h[1-6]$/.test(tag)) {
      current = { heading: t, paragraphs: [] };
      sections.push(current);
    } else {
      if (!current) { current = { heading: 'Overview', paragraphs: [] }; sections.push(current); }
      current.paragraphs.push(tag === 'li' ? `• ${t}` : t);
    }
  }
  return sections.filter((s) => s.paragraphs.length);
}

const CATEGORY: Record<string, { key: string; en: string; pt: string; es: string; color: string }> = {
  guide: { key: 'GUIA DOS SIGNOS', en: 'ZODIAC GUIDE', pt: 'GUIA DOS SIGNOS', es: 'GUÍA ZODIACAL', color: 'bg-[#3982C8] text-white' },
  wellness: { key: 'BEM-ESTAR', en: 'WELLNESS', pt: 'BEM-ESTAR', es: 'BIENESTAR', color: 'bg-[#10B981] text-white' },
  astrology: { key: 'ASTROLOGIA', en: 'ASTROLOGY', pt: 'ASTROLOGIA', es: 'ASTROLOGÍA', color: 'bg-[#56C5DC] text-white' },
};
function categoryFor(names: string[]) {
  const n = names.join('|').toLowerCase();
  if (/zodiac|personality|sign/.test(n)) return CATEGORY.guide;
  if (/emotion|wellness|friendship/.test(n)) return CATEGORY.wellness;
  return CATEGORY.astrology;
}

const MONTHS = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  pt: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  es: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
};
function dates(iso: string) {
  const d = new Date(iso.endsWith('Z') || /[+-]\d\d:\d\d$/.test(iso) ? iso : `${iso}Z`);
  const dd = String(d.getUTCDate()).padStart(2, '0');
  const y = d.getUTCFullYear();
  const hh = d.getUTCHours();
  const mm = String(d.getUTCMinutes()).padStart(2, '0');
  const en = `${MONTHS.en[d.getUTCMonth()]} ${dd}, ${y}`;
  const pt = `${dd} ${MONTHS.pt[d.getUTCMonth()]} ${y}`;
  const es = `${dd} ${MONTHS.es[d.getUTCMonth()]} ${y}`;
  return {
    date: { pt, en, es },
    dateTime: { pt: `${pt} às ${String(hh).padStart(2, '0')}:${mm}`, en: `${en} • ${hh % 12 || 12}:${mm} ${hh >= 12 ? 'PM' : 'AM'}`, es: `${es} a las ${String(hh).padStart(2, '0')}:${mm}` },
  };
}

async function getJson(url: string) {
  const res = await fetch(url, { headers: { 'User-Agent': 'AurenstarSync/1.0' } });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return { json: await res.json(), pages: Number(res.headers.get('x-wp-totalpages') || 1) };
}

async function saveImage(url: string, name: string): Promise<string | null> {
  try {
    const file = `${name}.webp`; // always saved as a light WebP
    const target = path.join(IMG_DIR, file);
    if (!fs.existsSync(target)) {
      const res = await fetch(url, { headers: { 'User-Agent': 'AurenstarSync/1.0' } });
      if (!res.ok) return null;
      fs.mkdirSync(IMG_DIR, { recursive: true });
      const raw = path.join(IMG_DIR, `${name}.source`);
      fs.writeFileSync(raw, Buffer.from(await res.arrayBuffer()));
      try {
        execFileSync('convert', [raw, '-strip', '-resize', '1200x>', '-quality', '74', target]); // ImageMagick
      } catch {
        fs.copyFileSync(raw, target); // no ImageMagick: keep the original file
      }
      fs.rmSync(raw, { force: true });
    }
    return `/assets/wp/${file}`;
  } catch {
    return null;
  }
}

async function main() {
  const posts: any[] = [];
  for (let page = 1; ; page++) {
    const { json, pages } = await getJson(`${WP}/wp-json/wp/v2/posts?per_page=50&page=${page}&_embed=1&status=publish`);
    posts.push(...json);
    if (page >= pages) break;
  }
  const articles: any[] = [];
  for (const p of posts) {
    const title = text(p.title?.rendered || '');
    const sections = sectionsFrom(p.content?.rendered || '');
    if (!title || !sections.length) continue;
    const terms = ((p._embedded?.['wp:term'] || []).flat() as any[]).filter((t) => t.taxonomy === 'category').map((t) => text(t.name));
    const cat = categoryFor(terms);
    const words = sections.reduce((n, s) => n + s.paragraphs.join(' ').split(/\s+/).length, 0);
    const mins = Math.max(1, Math.round(words / 200));
    const excerpt = text(p.excerpt?.rendered || '') || sections[0].paragraphs[0].slice(0, 160);
    const media = p._embedded?.['wp:featuredmedia']?.[0];
    const imageUrl: string | undefined = media?.source_url;
    const image = (imageUrl && (await saveImage(imageUrl, p.slug))) || '/og-aurenstar.png';
    const firstSentence = (sections[0].paragraphs[0].match(/^.{40,200}?[.!?](\s|$)/) || [sections[0].paragraphs[0].slice(0, 160)])[0].trim();
    const { date, dateTime } = dates(p.date_gmt || p.date);
    articles.push({
      id: `wp-${p.id}`,
      category: { pt: cat.pt, en: cat.en, es: cat.es },
      categoryColor: cat.color,
      readTime: { pt: `${mins} min de leitura`, en: `${mins} min read`, es: `${mins} min de lectura` },
      date,
      author: { name: 'Aurenstar', role: 'Insights', avatar: '/aurenstar-avatar.webp', dateTime, date },
      image,
      imageCaption: { pt: title, en: title, es: title },
      title: { pt: title, en: title, es: title },
      subtitle: { pt: excerpt, en: excerpt, es: excerpt },
      quote: { pt: firstSentence, en: firstSentence, es: firstSentence },
      sections: sections.map((s) => ({ heading: { pt: s.heading, en: s.heading, es: s.heading }, paragraphs: s.paragraphs.map((t) => ({ pt: t, en: t, es: t })) })),
      keyTakeaways: { pt: [], en: [], es: [] },
      wordpress: { id: p.id, slug: p.slug, modified: p.modified_gmt || p.modified },
    });
  }
  articles.sort((a, b) => (a.id < b.id ? 1 : -1));
  fs.writeFileSync(OUT, JSON.stringify(articles, null, 2) + '\n');
  console.log(`wordpress: ${articles.length} articles written from ${WP}`);
}

main().catch((e) => {
  console.error('wordpress sync failed:', e.message);
  process.exit(1);
});
