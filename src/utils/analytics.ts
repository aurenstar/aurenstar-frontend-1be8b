/**
 * Google Analytics 4 for a single-page app.
 *
 * Turned on by setting the build variable VITE_GA_MEASUREMENT_ID (e.g. G-XXXXXXXXXX) in
 * Cloudflare Pages > Settings > Variables. Without it everything here does nothing.
 *
 * Who is measured (see region.ts):
 *  - Countries that ask first (Europe, United Kingdom, Brazil...; also when the country is unknown):
 *      nothing is sent until the visitor answers the cookie banner.
 *      "Accept all"     -> normal measurement with cookies.
 *      "Only essential" -> Google "consent mode": anonymous counting, no cookies stored.
 *  - Other countries: counted from the first page, no banner, without advertising features.
 *      The visitor can still choose "Only essential" with the footer link "Cookie settings".
 *
 * The browser URL changes without a full reload when visitors move around the site, so
 * a page_view is sent manually on every route change (automatic page views are disabled
 * to avoid counting the first page twice).
 */
import { getConsent, CONSENT_EVENT } from './consent';
import { getConsentRule, type ConsentRule } from './region';

type GtagWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };

const MEASUREMENT_ID = (import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined)?.trim();

let initialized = false;
let lastTrackedPath = '';
let rule: ConsentRule | null = null;

/** What the visitor allows right now: their own answer, or "all" in countries where no banner is needed. */
function effectiveChoice(): 'all' | 'essential' | null {
  const own = getConsent();
  if (own) return own;
  return rule === 'free' ? 'all' : null;
}

function gtagFn(): (...args: unknown[]) => void {
  const w = window as GtagWindow;
  return w.gtag as (...args: unknown[]) => void;
}

function init(choice: 'all' | 'essential'): boolean {
  if (!MEASUREMENT_ID || typeof window === 'undefined') return false;
  if (initialized) return true;
  const w = window as GtagWindow;
  w.dataLayer = w.dataLayer || [];
  w.gtag = function gtag() {
    // gtag.js requires the `arguments` object itself to be pushed
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer!.push(arguments);
  };
  // Consent mode: advertising stays off; the analytics cookie only when the visitor allows it.
  w.gtag('consent', 'default', {
    analytics_storage: choice === 'all' ? 'granted' : 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  w.gtag('js', new Date());
  w.gtag('config', MEASUREMENT_ID, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`;
  document.head.appendChild(script);
  initialized = true;
  return true;
}

function send() {
  try {
    const choice = effectiveChoice();
    if (!choice) return; // asked-first country and no answer yet: nothing is measured
    if (!init(choice)) return;
    const path = window.location.pathname + window.location.search;
    if (path === lastTrackedPath) return; // same URL re-rendered (e.g. language switch)
    lastTrackedPath = path;
    gtagFn()('event', 'page_view', {
      page_path: path,
      page_location: window.location.href,
      page_title: document.title,
    });
  } catch {
    // analytics must never break the site
  }
}

/** Call after the document title has been updated for the new route. */
export function trackPageView() {
  if (!MEASUREMENT_ID || typeof window === 'undefined') return;
  if (rule) {
    send();
    return;
  }
  getConsentRule().then((r) => {
    rule = r;
    send();
  });
}

/** Optional custom events (share, newsletter signup...). */
export function trackEvent(name: string, params?: Record<string, unknown>) {
  try {
    const choice = effectiveChoice();
    if (!choice || !init(choice)) return;
    gtagFn()('event', name, params);
  } catch {
    // ignore
  }
}

// The visitor answered (or changed their answer) after the page loaded.
if (typeof window !== 'undefined') {
  window.addEventListener(CONSENT_EVENT, (e) => {
    const detail = (e as CustomEvent).detail;
    if (detail !== 'all' && detail !== 'essential') return; // banner reopened, nothing chosen yet
    try {
      if (initialized) {
        gtagFn()('consent', 'update', { analytics_storage: detail === 'all' ? 'granted' : 'denied' });
      }
    } catch {
      // ignore
    }
    trackPageView(); // counts the page they are on right now if nothing was sent yet
  });
}
