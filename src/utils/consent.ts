/** Visitor's cookie choice, kept in the browser. 'all' = measurement allowed, 'essential' = nothing optional. */
export type Consent = 'all' | 'essential' | null;
const KEY = 'aurenstar_consent';
export const CONSENT_EVENT = 'aurenstar-consent';

export function getConsent(): Consent {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'all' || v === 'essential' ? v : null;
  } catch {
    return null;
  }
}

export function setConsent(value: Exclude<Consent, null>) {
  try {
    localStorage.setItem(KEY, value);
  } catch {
    // storage blocked: the choice only lasts for this visit
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}

/** Footer link "Cookie settings": shows the banner again. */
export function reopenConsent() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: null }));
}
