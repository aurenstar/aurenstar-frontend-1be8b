// Cloudflare Pages Function -> GET /api/visitor
// Tells the page which country the visitor is in (from the network address) and which language fits.
// Nothing is stored and nothing personal is returned.
import { visitorLocale, SITE_LANGUAGES } from '../../server/engine/countries';

export const onRequestGet = async ({ request }: { request: Request }): Promise<Response> => {
  const v = visitorLocale(request);
  const uiLanguage = (SITE_LANGUAGES as readonly string[]).includes(v.language) ? v.language : 'en';
  return new Response(JSON.stringify({ country: v.country, language: v.language, uiLanguage, known: v.known }), {
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'private, max-age=3600' },
  });
};
