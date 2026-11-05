/**
 * Does the visitor's country ask for a "yes" BEFORE we measure visits?
 *
 * 'required' = show the cookie banner and wait for the answer (Europe, United Kingdom, Brazil and other
 *              countries with a consent-first rule). Also used whenever we cannot tell the country: when in doubt, ask.
 * 'free'     = no banner; visits are counted without advertising features, and the visitor can still opt out
 *              any time with the "Cookie settings" link in the footer.
 *
 * The country comes from /api/visitor (the visitor's network address; nothing is stored there).
 */
export type ConsentRule = 'required' | 'free';

/** ISO country codes where we ask first. Broad on purpose. */
const CONSENT_FIRST = new Set([
  // European Union
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE',
  // Rest of the European Economic Area, United Kingdom, Switzerland
  'IS', 'LI', 'NO', 'GB', 'CH',
  // Brazil and other countries with a consent-first (or very similar) privacy law
  'BR', 'CA', 'AR', 'UY', 'CL', 'CO', 'PE', 'TR', 'KR', 'JP', 'ZA', 'IN', 'TH', 'SG', 'MY', 'ID', 'VN', 'SA', 'AE',
]);

const CACHE_KEY = 'aurenstar_consent_rule';
const CACHE_MS = 24 * 60 * 60 * 1000; // same as the visitor lookup: one day

let memo: Promise<ConsentRule> | null = null;

function readCache(): ConsentRule | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as { r?: string; t?: number };
    if ((v.r === 'required' || v.r === 'free') && typeof v.t === 'number' && Date.now() - v.t < CACHE_MS) return v.r;
  } catch {
    // ignore
  }
  return null;
}

function writeCache(r: ConsentRule) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ r, t: Date.now() }));
  } catch {
    // ignore
  }
}

export function getConsentRule(): Promise<ConsentRule> {
  if (memo) return memo;
  const cached = readCache();
  if (cached) {
    memo = Promise.resolve(cached);
    return memo;
  }
  memo = fetch('/api/visitor')
    .then((r) => (r.ok ? r.json() : null))
    .then((d: { country?: string; known?: boolean } | null): ConsentRule => {
      // Country unknown, or the lookup failed: ask (and do not remember this guess).
      if (!d || !d.known || !d.country) return 'required';
      const rule: ConsentRule = CONSENT_FIRST.has(String(d.country).toUpperCase()) ? 'required' : 'free';
      writeCache(rule);
      return rule;
    })
    .catch((): ConsentRule => 'required');
  return memo;
}
