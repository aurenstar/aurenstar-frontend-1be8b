// Cloudflare Pages Function -> /nl, /nl/blog, /ja/contact ...  (only the language prefixes listed in public/_routes.json reach it)
// Serves the English prerendered page with the head of that language (translated title and descriptions, its own canonical
// address, hreflang list). The page text is translated in the browser. Anything that is not a language address passes through.
import { translateStrings, type TranslateEnv } from '../../server/engine/translateStrings';
import { localizeHtml } from '../../server/engine/localizePage';
import { isUrlLanguage } from '../../src/utils/urlLang';

interface Context {
  request: Request;
  env: TranslateEnv & { ASSETS: { fetch: (r: Request) => Promise<Response> } };
  params: { lang?: string; path?: string | string[] };
  next: () => Promise<Response>;
}

export const onRequest = async ({ request, env, params, next }: Context): Promise<Response> => {
  const lang = String(params.lang || '').toLowerCase();
  if (!isUrlLanguage(lang) || (request.method !== 'GET' && request.method !== 'HEAD')) return next();

  const url = new URL(request.url);
  const rest = Array.isArray(params.path) ? params.path.join('/') : String(params.path || '');
  const pagePath = ('/' + rest).replace(/\/+$/, '') || '/';

  // /nl/ -> /nl (one address per page)
  if (rest === '' && url.pathname.endsWith('/') && url.pathname.length > 1) {
    return Response.redirect(`${url.origin}/${lang}${url.search}`, 301);
  }

  // Native articles (written directly in this language, not translated): /<lang>/blog/<slug> and the list /<lang>/articles are ready-made
  // standalone pages saved by the build under /_native/<lang>/. If one exists, serve it as it is.
  if (rest === 'articles' || /^blog\/[^/]+$/.test(rest)) {
    const nativePath = rest === 'articles' ? `/_native/${lang}/` : `/_native/${lang}/${rest.slice(5)}`;
    const nat = await env.ASSETS.fetch(new Request(new URL(nativePath, url).toString(), { headers: { Accept: 'text/html' }, redirect: 'manual' }));
    if ((nat.headers.get('Content-Type') || '').includes('text/html') && nat.ok) {
      return new Response(request.method === 'HEAD' ? null : await nat.text(), { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Content-Language': lang, 'Cache-Control': 'public, max-age=300' } });
    }
  }

  // redirect: 'manual' -> an old address that has a redirect in _redirects (/blog/post-aries ...) is not served under the old
  // address; the visitor and Google are sent on to the new one, keeping the language prefix (/pt/blog/old -> /pt/blog/new).
  const asset = await env.ASSETS.fetch(new Request(new URL(pagePath, url).toString(), { headers: { Accept: 'text/html' }, redirect: 'manual' }));
  if (asset.status >= 300 && asset.status < 400 && asset.headers.get('Location')) {
    const target = new URL(asset.headers.get('Location') as string, url);
    if (target.origin === url.origin) {
      const path = target.pathname === `/${lang}` || target.pathname.startsWith(`/${lang}/`) ? target.pathname : `/${lang}${target.pathname === '/' ? '' : target.pathname}`;
      return Response.redirect(`${url.origin}${path}${target.search || url.search}`, 301);
    }
  }
  const type = asset.headers.get('Content-Type') || '';
  if (!asset.ok || !type.includes('text/html')) return asset; // unknown address: real 404 as usual

  const html = await asset.text();
  const page = await localizeHtml(html, lang, pagePath, async (strings) => {
    const r = await translateStrings(env, request, lang, strings);
    return r.ok ? r.texts : null;
  });
  return new Response(request.method === 'HEAD' ? null : page, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Language': lang,
      'Cache-Control': 'public, max-age=300',
    },
  });
};
