/**
 * Google Analytics 4 for a single-page app.
 *
 * Turned on by setting the build variable VITE_GA_MEASUREMENT_ID (e.g. G-XXXXXXXXXX) in
 * Cloudflare Pages > Settings > Variables. Without it everything here does nothing.
 *
 * The browser URL changes without a full reload when visitors move around the site, so
 * a page_view is sent manually on every route change (automatic page views are disabled
 * to avoid counting the first page twice).
 */
type GtagWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };

const MEASUREMENT_ID = (import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined)?.trim();

let initialized = false;
let lastTrackedPath = '';

function init(): boolean {
  if (!MEASUREMENT_ID || typeof window === 'undefined') return false;
  if (initialized) return true;
  const w = window as GtagWindow;
  w.dataLayer = w.dataLayer || [];
  w.gtag = function gtag() {
    // gtag.js requires the `arguments` object itself to be pushed
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer!.push(arguments);
  };
  w.gtag('js', new Date());
  w.gtag('config', MEASUREMENT_ID, { send_page_view: false });
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`;
  document.head.appendChild(script);
  initialized = true;
  return true;
}

/** Call after the document title has been updated for the new route. */
export function trackPageView() {
  try {
    if (!init()) return;
    const path = window.location.pathname + window.location.search;
    if (path === lastTrackedPath) return; // same URL re-rendered (e.g. language switch)
    lastTrackedPath = path;
    (window as GtagWindow).gtag!('event', 'page_view', {
      page_path: path,
      page_location: window.location.href,
      page_title: document.title,
    });
  } catch {
    // analytics must never break the site
  }
}

/** Optional custom events (share, newsletter signup...). */
export function trackEvent(name: string, params?: Record<string, unknown>) {
  try {
    if (!init()) return;
    (window as GtagWindow).gtag!('event', name, params);
  } catch {
    // ignore
  }
}
