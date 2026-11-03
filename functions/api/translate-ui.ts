// Cloudflare Pages Function -> POST /api/translate-ui   body: { strings: string[], lang?: string }
// Puts the texts of the site (menus, buttons, titles...) in the visitor's language.
// The language comes from the language address (/nl/...) when the page was opened on one, otherwise from the visitor's country.
// Each batch is saved in the database once and reused. On any failure the answer is {success:false} and the page stays in English.
import { translateStrings, type TranslateEnv } from '../../server/engine/translateStrings';
import { visitorLocale, isTranslatedLanguage, SITE_LANGUAGES } from '../../server/engine/countries';
import { humanCheck, humanCheckFailed } from '../../server/engine/turnstile';

export const onRequestPost = async ({ request, env }: { request: Request; env: TranslateEnv }): Promise<Response> => {
  if (!(await humanCheck(request, env as any))) return humanCheckFailed();
  const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' };
  const fail = (reason = 'failed') => new Response(JSON.stringify({ success: false, reason }), { headers });
  try {
    const body: any = await request.json();
    const asked = String(body?.lang || '').toLowerCase();
    let lang = '';
    if (isTranslatedLanguage(asked)) {
      lang = asked;
    } else {
      const v = visitorLocale(request);
      // The site already has hand-written English, Portuguese and Spanish menus.
      if (!v.known || (SITE_LANGUAGES as readonly string[]).includes(v.language)) return fail('not-needed');
      lang = v.language;
    }
    const strings: string[] = Array.isArray(body?.strings) ? body.strings : [];
    const r = await translateStrings(env, request, lang, strings);
    if (!r.ok) return fail(r.reason);
    return new Response(JSON.stringify({ success: true, language: lang, texts: r.texts }), { headers });
  } catch {
    return fail('error');
  }
};
