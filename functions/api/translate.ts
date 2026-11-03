// Cloudflare Pages Function -> POST /api/translate
// Translates the texts of a reading the person already received (written in another language) into the language the site is showing now.
// Same meaning, same tone, nothing added. On any failure the page keeps the original text.
import { countHit, usageKey, type UsageEnv } from '../../server/engine/usage';
import { humanCheck, humanCheckFailed } from '../../server/engine/turnstile';

const MAX_PER_IP_PER_DAY = 60;

interface Context {
  request: Request;
  env: UsageEnv & { OPENAI_API_KEY?: string; OPENAI_MODEL?: string };
}

export const onRequestPost = async ({ request, env }: Context): Promise<Response> => {
  if (!(await humanCheck(request, env as any))) return humanCheckFailed();
  const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' };
  const fail = () => new Response(JSON.stringify({ success: false }), { headers });
  try {
    const body: any = await request.json();
    const lang = ['pt', 'en', 'es'].includes(body?.lang) ? (body.lang as 'pt' | 'en' | 'es') : null;
    const texts: string[] = Array.isArray(body?.texts) ? body.texts.map((t: unknown) => String(t ?? '').slice(0, 1500)).slice(0, 20) : [];
    if (!lang || !texts.length || !env.OPENAI_API_KEY) return fail();

    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const ipKey = await usageKey(env, ['translate-ip', new Date().toISOString().slice(0, 10), ip]);
    if ((await countHit(env, ipKey, 24 * 3600)) > MAX_PER_IP_PER_DAY) return fail();

    const languageName = { en: 'English', pt: 'Brazilian Portuguese', es: 'Spanish' }[lang];
    const prompt = `Translate every string of the JSON array below into ${languageName}. Keep the exact meaning, the warm and casual tone, the length and the line breaks. Do not add, remove or explain anything. Keep names of people and the brand names Aurenstar, Aurendaily and Aureneffect unchanged. Translate zodiac sign names with their usual name in ${languageName}. Empty strings stay empty.
Return ONLY valid JSON: {"texts": [ ...same number of strings, same order... ]}

${JSON.stringify(texts)}`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 25000);
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.OPENAI_API_KEY}` },
        signal: controller.signal,
        body: JSON.stringify({ model: env.OPENAI_MODEL || 'gpt-6.1-terra', response_format: { type: 'json_object' }, messages: [{ role: 'user', content: prompt }] }),
      });
      if (!res.ok) return fail();
      const json: any = await res.json();
      const parsed = JSON.parse(String(json?.choices?.[0]?.message?.content || '{}').replace(/^```json\s*|```$/g, ''));
      const out = Array.isArray(parsed?.texts) ? parsed.texts.map((t: unknown) => String(t ?? '')) : [];
      if (out.length !== texts.length) return fail();
      return new Response(JSON.stringify({ success: true, texts: out }), { headers });
    } finally {
      clearTimeout(timer);
    }
  } catch {
    return fail();
  }
};
