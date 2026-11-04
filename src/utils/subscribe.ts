/** Sends an address to the t-shirt waiting list. Call it only when the visitor ticked the consent box. */
export async function subscribeEmail(opts: { email: string; sign?: string; lang: string; source: 'footer' | 'newsletter_page' }): Promise<boolean> {
  try {
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: opts.email.trim(), sign: opts.sign || '', lang: opts.lang, source: opts.source, consent: true }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
