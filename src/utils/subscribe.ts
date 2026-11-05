export type SubscribeSource = 'footer' | 'newsletter_page' | 'result' | 'article' | 'home';

const FLAG = 'aurenstar_tshirt_list';
export type ListName = 'tshirts' | 'newsletter';

/** True when this browser already joined the list: the sign-up cards then stay hidden. */
export function isOnTshirtList(): boolean {
  try { return localStorage.getItem(FLAG) === '1'; } catch { return false; }
}

/** Sends an address to the t-shirt waiting list. Call it only when the visitor ticked the consent box. */
export async function subscribeEmail(opts: { email: string; sign?: string; lang: string; source: SubscribeSource; list?: ListName }): Promise<boolean> {
  try {
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: opts.email.trim(), sign: opts.sign || '', lang: opts.lang, source: opts.source, list: opts.list || 'tshirts', consent: true }),
    });
    if (res.ok && (opts.list || 'tshirts') === 'tshirts') { try { localStorage.setItem(FLAG, '1'); } catch { /* ignore */ } }
    return res.ok;
  } catch {
    return false;
  }
}

/** Spots left for the launch coupon (first 100 people). left = null when it could not be checked: the page then shows no number. */
export async function getCouponSpots(): Promise<{ limit: number; left: number | null }> {
  try {
    const res = await fetch('/api/tshirt-spots');
    if (!res.ok) return { limit: 100, left: null };
    const d = (await res.json()) as { limit?: number; left?: number | null };
    return { limit: d.limit || 100, left: typeof d.left === 'number' ? d.left : null };
  } catch {
    return { limit: 100, left: null };
  }
}
