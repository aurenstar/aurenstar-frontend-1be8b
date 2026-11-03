/**
 * Browser side of the bot protection (see server/engine/turnstile.ts).
 * Does nothing unless VITE_TURNSTILE_SITE_KEY is set. When it is, every call to the costly /api endpoints
 * carries a fresh, invisible "this is a person" proof in the header x-turnstile.
 */
const SITE_KEY = (import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined)?.trim();
const PROTECTED = /^\/api\/(aureneffect|aurendaily|unfiltered|translate-ui|translate|localize|compatibility|transits)(\?|$)/;

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  execute: (id: string) => void;
  reset: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let ready: Promise<TurnstileApi | null> | null = null;
let widgetId: string | null = null;
let pending: ((token: string | null) => void) | null = null;
let queue: Promise<unknown> = Promise.resolve();

function load(): Promise<TurnstileApi | null> {
  if (ready) return ready;
  ready = new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.onload = () => {
      const api = window.turnstile;
      if (!api) return resolve(null);
      const holder = document.createElement('div');
      holder.style.cssText = 'position:fixed;bottom:12px;right:12px;z-index:99999';
      document.body.appendChild(holder);
      widgetId = api.render(holder, {
        sitekey: SITE_KEY,
        execution: 'execute',
        appearance: 'interaction-only',
        callback: (token: string) => pending?.(token),
        'error-callback': () => pending?.(null),
        'timeout-callback': () => pending?.(null),
      });
      resolve(api);
    };
    script.onerror = () => resolve(null);
    document.head.appendChild(script);
  });
  return ready;
}

function freshToken(): Promise<string | null> {
  const run = async () => {
    const api = await load();
    if (!api || !widgetId) return null;
    return new Promise<string | null>((resolve) => {
      const timer = setTimeout(() => { pending = null; resolve(null); }, 10000);
      pending = (token) => { clearTimeout(timer); pending = null; resolve(token); };
      try { api.reset(widgetId as string); api.execute(widgetId as string); } catch { clearTimeout(timer); pending = null; resolve(null); }
    });
  };
  const next = queue.then(run, run);
  queue = next.catch(() => null);
  return next;
}

/** Wraps window.fetch once. */
export function installHumanCheck() {
  if (!SITE_KEY || typeof window === 'undefined') return;
  const original = window.fetch.bind(window);
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    try {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.pathname + input.search : input.url;
      if (PROTECTED.test(url.replace(location.origin, ''))) {
        const token = await freshToken();
        if (token) {
          const headers = new Headers(init?.headers || (input instanceof Request ? input.headers : undefined));
          headers.set('x-turnstile', token);
          return original(input, { ...init, headers });
        }
      }
    } catch {
      // fall through: the server decides
    }
    return original(input, init);
  };
}
