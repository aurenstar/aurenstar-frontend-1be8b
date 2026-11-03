// Cloudflare Pages Function -> GET /api/localize?article=<id>
// Gives the article in the visitor's country version: own language + local cultural references.
// Flow: detect country -> look in the database -> if missing, create it once, save it, and reuse it for everyone after.
// On any failure the answer is {success:false} and the page simply keeps the original article.
import { countHit, getCachedReading, saveReading, usageKey, type UsageEnv } from '../../server/engine/usage';
import { visitorLocale, RTL_LANGUAGES, isTranslatedLanguage, URL_LANG_COUNTRY } from '../../server/engine/countries';
import { localizeArticle, type LocalizeEnv, type LocalizedArticle } from '../../server/engine/localizeArticle';
import { BLOG_ARTICLES } from '../../src/data/blogArticles';

const CACHE_VERSION = 'v1'; // change it to make every country version be created again (e.g. after improving the instructions)
const CACHE_SECONDS = 365 * 24 * 3600;
const MAX_NEW_PER_IP_PER_DAY = 10; // new versions one network address may trigger per day (reading saved ones is free)
const MAX_NEW_PER_DAY = 600; // new versions for the whole site per day (protects the AI bill)

interface Context {
  request: Request;
  env: UsageEnv & LocalizeEnv;
}

export const onRequestGet = async ({ request, env }: Context): Promise<Response> => {
  const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'private, max-age=600' };
  const none = (reason: string) => new Response(JSON.stringify({ success: false, reason }), { headers });
  try {
    const id = new URL(request.url).searchParams.get('article') || '';
    if (!BLOG_ARTICLES.some((a) => a.id === id)) return none('unknown-article');

    let v = visitorLocale(request);
    // Opened on a language address (/nl/...): that language wins over the visitor's country.
    const asked = (new URL(request.url).searchParams.get('lang') || '').toLowerCase();
    if (isTranslatedLanguage(asked)) v = { country: URL_LANG_COUNTRY[asked], language: asked, known: true };
    // United States (and "unknown") read the original article: nothing to adapt.
    if (v.country === 'US' && v.language === 'en') return none('original');

    const key = await usageKey(env, ['article-loc', CACHE_VERSION, id, v.country, v.language]);
    let article = await getCachedReading<LocalizedArticle>(env, key, CACHE_SECONDS);

    if (!article) {
      const day = new Date().toISOString().slice(0, 10);
      const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
      const ipHits = await countHit(env, await usageKey(env, ['article-loc-ip', day, ip]), 24 * 3600);
      if (ipHits > MAX_NEW_PER_IP_PER_DAY) return none('limit');
      const allHits = await countHit(env, await usageKey(env, ['article-loc-all', day]), 24 * 3600);
      if (allHits > MAX_NEW_PER_DAY) return none('limit');

      article = await localizeArticle(env, id, v.country, v.language);
      if (!article) return none('failed');
      await saveReading(env, key, article);
    }

    return new Response(
      JSON.stringify({ success: true, country: v.country, language: v.language, rtl: RTL_LANGUAGES.has(v.language), article }),
      { headers },
    );
  } catch {
    return none('error');
  }
};
