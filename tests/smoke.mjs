/**
 * Automatic check of the built site (run: npm run build && npm run test:smoke).
 * Opens the main pages like a visitor would and fails if something is broken:
 * empty page, error on screen, sideways scroll on phones, broken local files,
 * wrong language, ad-blocker notice, temporary e-mails.
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json', '.webp': 'image/webp', '.avif': 'image/avif', '.jpg': 'image/jpeg', '.xml': 'application/xml', '.txt': 'text/plain' };

// Static server that behaves like the real host: unknown address -> 404 page.
const server = http.createServer((req, res) => {
  let u = decodeURIComponent(req.url.split('?')[0]);
  // On the real host a function answers /pt, /nl ... with the English page; do the same here.
  const m = u.match(/^\/(pt|es|nl|ja)(\/.*)?$/);
  if (m) u = m[2] || '/';
  for (const f of [path.join(root, u), path.join(root, u + '.html'), path.join(root, u, 'index.html')]) {
    if (f.startsWith(root) && fs.existsSync(f) && fs.statSync(f).isFile()) {
      res.writeHead(200, { 'Content-Type': mime[path.extname(f)] || 'application/octet-stream' });
      return fs.createReadStream(f).pipe(res);
    }
  }
  const nf = path.join(root, '404.html');
  res.writeHead(404, { 'Content-Type': 'text/html' });
  res.end(fs.existsSync(nf) ? fs.readFileSync(nf) : 'not found');
});
await new Promise((r) => server.listen(0, r));
const base = `http://localhost:${server.address().port}`;

const PAGES = ['/', '/blog', '/discover-sign', '/descreva-me', '/aureneffect', '/daily-message', '/newsletter', '/contact', '/credits', '/privacy', '/terms', '/about', '/dicionario', '/pt', '/es', '/nl', '/ja'];
const failures = [];
const fail = (msg) => { failures.push(msg); console.log('  FAIL', msg); };

const browser = await chromium.launch();

for (const device of [{ name: 'phone', viewport: { width: 390, height: 800 } }, { name: 'desktop', viewport: { width: 1280, height: 800 } }]) {
  for (const p of PAGES) {
    const ctx = await browser.newContext({ viewport: device.viewport });
    const page = await ctx.newPage();
    const errors = [];
    const missing = [];
    page.on('pageerror', (e) => errors.push(String(e.message).slice(0, 120)));
    page.on('response', (r) => { if (r.status() >= 400 && r.url().startsWith(base) && !r.url().includes('/api/')) missing.push(`${r.status()} ${r.url().replace(base, '')}`); });
    await page.route('**/api/**', (r) => r.fulfill({ status: 503, contentType: 'application/json', body: '{"ok":false}' }));
    await page.route('**/*', (r) => (r.request().url().startsWith(base) ? r.fallback() : r.abort()));
    try {
      const resp = await page.goto(base + p, { waitUntil: 'load' });
      await page.waitForTimeout(700);
      if (!resp || resp.status() >= 400) fail(`[${device.name}] ${p}: status ${resp && resp.status()}`);
      const info = await page.evaluate(() => ({
        h1: document.querySelectorAll('h1').length,
        text: document.body.innerText.length,
        wide: document.documentElement.scrollWidth - window.innerWidth,
        crash: /something went wrong|Application error|Cannot read prop/i.test(document.body.innerText),
        lang: document.documentElement.lang,
      }));
      if (info.h1 < 1) fail(`[${device.name}] ${p}: sem título principal (h1)`);
      if (info.text < 200) fail(`[${device.name}] ${p}: página quase vazia`);
      if (info.wide > 2) fail(`[${device.name}] ${p}: rolagem para o lado (${info.wide}px)`);
      if (info.crash) fail(`[${device.name}] ${p}: mensagem de erro na tela`);
      if (errors.length) fail(`[${device.name}] ${p}: erros no navegador: ${errors[0]}`);
      if (missing.length) fail(`[${device.name}] ${p}: arquivos faltando: ${missing.slice(0, 3).join(', ')}`);
      const want = p.startsWith('/pt') ? 'pt' : p.startsWith('/es') ? 'es' : p.startsWith('/nl') ? 'nl' : p.startsWith('/ja') ? 'ja' : 'en';
      if (!info.lang.toLowerCase().startsWith(want)) fail(`[${device.name}] ${p}: idioma da página é "${info.lang}", esperado "${want}"`);
      console.log(`ok ${device.name} ${p}`);
    } catch (e) {
      fail(`[${device.name}] ${p}: ${String(e.message).split('\n')[0]}`);
    }
    await ctx.close();
  }
}

// Unknown address must be a real 404.
{
  const r = await fetch(base + '/this-page-does-not-exist');
  if (r.status !== 404) fail(`endereço inexistente devolveu ${r.status} em vez de 404`);
}

// Ad blocker notice: shown when the bait file is blocked, hidden otherwise.
for (const blocked of [false, true]) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  await page.addInitScript(() => Object.defineProperty(navigator, 'webdriver', { get: () => false }));
  await page.route('**/api/**', (r) => r.fulfill({ status: 503, body: '{}' }));
  if (blocked) await page.route('**/ads/ads.js*', (r) => r.abort());
  await page.goto(base + '/', { waitUntil: 'load' });
  await page.waitForTimeout(2200);
  const shown = (await page.locator('[data-testid="adblock-gate"]').count()) > 0;
  if (shown !== blocked) fail(`aviso de bloqueador de anúncios: esperado ${blocked ? 'visível' : 'oculto'}, ficou ${shown ? 'visível' : 'oculto'}`);
  else console.log(`ok adblock ${blocked ? 'detectado' : 'sem bloqueador'}`);
  await ctx.close();
}

// Cookie banner: shown the first time, gone after a choice, back from the footer link.
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.addInitScript(() => Object.defineProperty(navigator, 'webdriver', { get: () => false }));
  await page.route('**/api/**', (r) => r.fulfill({ status: 503, body: '{}' }));
  await page.goto(base + '/', { waitUntil: 'load' });
  await page.waitForTimeout(800);
  const banner = page.locator('[data-testid="consent-banner"]');
  if ((await banner.count()) !== 1) fail('aviso de cookies não apareceu na primeira visita');
  await banner.getByRole('button').first().click();
  await page.waitForTimeout(300);
  if ((await banner.count()) !== 0) fail('aviso de cookies não sumiu depois da escolha');
  await page.getByRole('button', { name: /cookie settings/i }).first().click();
  await page.waitForTimeout(300);
  if ((await banner.count()) !== 1) fail('link "Cookie settings" não reabriu o aviso');
  else console.log('ok cookies: aviso, escolha e reabrir');
  await ctx.close();
}

// Temporary e-mails are refused, real ones accepted.
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.route('**/api/**', (r) => r.fulfill({ status: 503, body: '{}' }));
  await page.goto(base + '/newsletter', { waitUntil: 'load' });
  await page.waitForTimeout(500);
  const input = page.locator('main input[type="email"], input[type="email"]').first();
  const cases = [['teste@mailinator.com', false], ['maria@10minutemail.net', false], ['joao@sub.guerrillamail.com', false], ['ana@gmial.com', false], ['maria@gmail.com', true], ['joao@empresa.com.br', true]];
  for (const [value, ok] of cases) {
    await input.fill(value);
    const valid = await input.evaluate((el) => el.validity.valid);
    if (valid !== ok) fail(`e-mail ${value}: esperado ${ok ? 'aceito' : 'recusado'}`);
    else console.log(`ok email ${value} ${ok ? 'aceito' : 'recusado'}`);
  }
  await ctx.close();
}

await browser.close();
server.close();
console.log(failures.length ? `\n${failures.length} problema(s):\n- ${failures.join('\n- ')}` : '\nTudo certo ✅');
process.exit(failures.length ? 1 : 0);
