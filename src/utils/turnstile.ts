/**
 * Browser side of the bot protection (see server/engine/turnstile.ts).
 * Does nothing unless VITE_TURNSTILE_SITE_KEY is set. When it is, every call to the costly /api endpoints
 * carries a fresh, invisible "this is a person" proof in the header x-turnstile.
 */
const SITE_KEY = (import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined)?.trim();
const PROTECTED = /^\/api\/(aureneffect|aurendaily|unfiltered|translate-ui|translate|localize|compatibility|transits|subscribe|comments)(\?|$)/;

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
// A proof that arrived when nobody was waiting (the person ticked the box late) is kept for the next request.
// Cloudflare proofs live 5 minutes and work once.
let kept: { token: string; at: number } | null = null;
const KEEP_MS = 240_000;
let hint: HTMLElement | null = null;
let boxEl: HTMLElement | null = null;
let hideTimer: ReturnType<typeof setTimeout> | null = null;
let extend: (() => void) | null = null;

const HINT: Record<string, string> = {
  pt: 'Só uma verificação rápida: marque a caixinha para continuar.',
  es: 'Solo una verificación rápida: marca la casilla para continuar.',
  en: 'Just a quick check: tick the box to continue.',
};
const showHint = (on: boolean) => {
  if (!hint) return;
  hint.textContent = HINT[(document.documentElement.lang || 'en').slice(0, 2)] || HINT.en;
  hint.style.display = on ? 'block' : 'none';
};

// The Cloudflare box stays on screen with "Sucesso!" after it is solved: show it only while a person has to tick it,
// and take it away shortly after it is done.
const showBox = (on: boolean, delay = 0) => {
  if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
  // not display:none, so the check keeps running invisibly
  const apply = () => { if (boxEl) boxEl.style.cssText = on ? '' : 'height:0;overflow:hidden;opacity:0;pointer-events:none'; };
  if (delay > 0) hideTimer = setTimeout(apply, delay); else apply();
};

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
      holder.style.cssText = 'position:fixed;bottom:12px;right:12px;z-index:99999;display:flex;flex-direction:column;align-items:flex-end;gap:6px;max-width:calc(100vw - 24px)';
      hint = document.createElement('div');
      hint.style.cssText = 'display:none;background:#fff;color:#172B4D;border:1px solid #D9E8F8;border-radius:12px;padding:8px 12px;font:600 12px system-ui,sans-serif;box-shadow:0 6px 18px rgba(23,54,111,.18)';
      holder.appendChild(hint);
      const box = document.createElement('div');
      boxEl = box;
      holder.appendChild(box);
      document.body.appendChild(holder);
      widgetId = api.render(box, {
        sitekey: SITE_KEY,
        execution: 'execute',
        appearance: 'interaction-only',
        // the box appeared: the person needs time to tick it, so wait for them
        'before-interactive-callback': () => { showBox(true); showHint(true); extend?.(); },
        callback: (token: string) => {
          showHint(false);
          showBox(false, 1500);
          if (pending) pending(token);
          else kept = { token, at: Date.now() };
        },
        'error-callback': () => { showHint(false); showBox(false, 1500); pending?.(null); },
        'timeout-callback': () => { showHint(false); showBox(false, 1500); pending?.(null); },
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
    if (kept && Date.now() - kept.at < KEEP_MS) { const t = kept.token; kept = null; return t; }
    kept = null;
    const api = await load();
    if (!api || !widgetId) return null;
    return new Promise<string | null>((resolve) => {
      let timer = setTimeout(() => { extend = null; pending = null; resolve(null); }, 20000);
      extend = () => { clearTimeout(timer); timer = setTimeout(() => { extend = null; pending = null; showHint(false); resolve(null); }, 120000); };
      pending = (token) => { clearTimeout(timer); extend = null; pending = null; resolve(token); };
      try { api.reset(widgetId as string); api.execute(widgetId as string); } catch { clearTimeout(timer); extend = null; pending = null; resolve(null); }
    });
  };
  const next = queue.then(run, run);
  queue = next.catch(() => null);
  return next;
}

/** Starts the check early, while the person is still typing, so the proof is ready when they press send. */
let warming = false;
function warmUp() {
  if (warming || (kept && Date.now() - kept.at < KEEP_MS - 30_000)) return;
  warming = true;
  freshToken()
    .then((t) => { if (t) kept = { token: t, at: Date.now() }; })
    .catch(() => null)
    .finally(() => { warming = false; });
}

/** Wraps window.fetch once. */
export function installHumanCheck() {
  if (!SITE_KEY || typeof window === 'undefined') return;
  // First time someone touches a form field: run the check in the background (kept for the next request, valid ~4 min).
  window.addEventListener('focusin', (e) => {
    const t = e.target as HTMLElement | null;
    if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) warmUp();
  });
  const original = window.fetch.bind(window);
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    try {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.pathname + input.search : input.url;
      if (PROTECTED.test(url.replace(location.origin, '')) && !(url.includes('/api/comments') && (init?.method || 'GET').toUpperCase() === 'GET')) {
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
