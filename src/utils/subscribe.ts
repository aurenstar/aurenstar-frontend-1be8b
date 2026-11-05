export type SubscribeSource = 'footer' | 'newsletter_page' | 'result' | 'article' | 'home';

const FLAG = 'aurenstar_tshirt_list';
const NEWS_FLAG = 'aurenstar_newsletter_list';
export type ListName = 'tshirts' | 'newsletter';

/** True when this browser already joined the list: the sign-up cards then stay hidden. */
export function isOnTshirtList(): boolean {
  try { return localStorage.getItem(FLAG) === '1'; } catch { return false; }
}

/** True when this browser already joined the newsletter. */
export function isOnNewsletterList(): boolean {
  try { return localStorage.getItem(NEWS_FLAG) === '1'; } catch { return false; }
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
    if (res.ok && opts.list === 'newsletter') { try { localStorage.setItem(NEWS_FLAG, '1'); } catch { /* ignore */ } }
    return res.ok;
  } catch {
    return false;
  }
}

/** How many people joined the t-shirt coupon list (no cap, the number only goes up). taken = null when it could not be checked: the page then shows no number.
 *  The answer is reused for 10 minutes (kept in the browser, even after closing it) (all cards on the page share one call, and so do the next pages), saving server calls. */
let spotsMemo: { at: number; value: { taken: number | null } } | null = null;
let spotsInFlight: Promise<{ taken: number | null }> | null = null;
const SPOTS_KEY = 'aurenstar_spots';
const SPOTS_MS = 600_000; // 10 minutes
export async function getCouponSpots(): Promise<{ taken: number | null }> {
  const now = Date.now();
  if (spotsMemo && now - spotsMemo.at < SPOTS_MS) return spotsMemo.value;
  try {
    const raw = localStorage.getItem(SPOTS_KEY);
    if (raw) {
      const c = JSON.parse(raw) as { at: number; value: { taken: number | null } };
      if (now - c.at < SPOTS_MS) { spotsMemo = c; return c.value; }
    }
  } catch { /* storage blocked */ }
  if (spotsInFlight) return spotsInFlight;
  spotsInFlight = (async () => {
    try {
      const res = await fetch('/api/tshirt-spots');
      if (!res.ok) return { taken: null };
      const d = (await res.json()) as { taken?: number | null };
      const value = { taken: typeof d.taken === 'number' ? d.taken : null };
      spotsMemo = { at: Date.now(), value };
      try { localStorage.setItem(SPOTS_KEY, JSON.stringify(spotsMemo)); } catch { /* storage blocked */ }
      return value;
    } catch {
      return { taken: null };
    } finally {
      spotsInFlight = null;
    }
  })();
  return spotsInFlight;
}
