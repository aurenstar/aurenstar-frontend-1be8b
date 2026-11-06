// Brevo (e-mail lists). A COPY of each new subscriber is sent to the right Brevo list; the database stays the source of truth.
// Off until the owner adds these in Cloudflare Pages > Settings > Variables and secrets (never in code):
//   BREVO_API_KEY            secret   (Brevo > SMTP & API > API keys)
//   BREVO_LIST_NEWSLETTER    text     number of the newsletter list in Brevo
//   BREVO_LIST_TSHIRTS       text     number of the t-shirt launch list in Brevo
// Missing key or list number = nothing is sent. A Brevo failure never breaks the sign-up.

export interface BrevoEnv {
  BREVO_API_KEY?: string;
  BREVO_LIST_NEWSLETTER?: string;
  BREVO_LIST_TSHIRTS?: string;
}

export async function sendToBrevo(
  env: BrevoEnv,
  s: { email: string; list: 'tshirts' | 'newsletter'; sign: string; lang: string; country: string; source: string },
): Promise<'sent' | 'off' | 'failed'> {
  const listId = Number(s.list === 'newsletter' ? env.BREVO_LIST_NEWSLETTER : env.BREVO_LIST_TSHIRTS);
  if (!env.BREVO_API_KEY || !Number.isInteger(listId) || listId <= 0) return 'off';
  try {
    const res = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: { 'api-key': env.BREVO_API_KEY, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        email: s.email,
        listIds: [listId],
        updateEnabled: true, // same person signing up twice just updates the contact
        attributes: { SIGN: s.sign, LANG: s.lang, COUNTRY: s.country, SOURCE: s.source },
      }),
    });
    return res.ok ? 'sent' : 'failed';
  } catch {
    return 'failed';
  }
}
