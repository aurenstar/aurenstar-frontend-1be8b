/** Anonymous "which recommendation works" counters (see functions/api/reco.ts). Never blocks or breaks the page. */
export type RecoKind = 'shown' | 'click' | 'journey';

export function postReco(key: string, article: string, kind: RecoKind) {
  try {
    const body = JSON.stringify({ sign: key, article, kind });
    if (!navigator.sendBeacon?.('/api/reco', new Blob([body], { type: 'application/json' }))) {
      fetch('/api/reco', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => {});
    }
  } catch { /* ignore */ }
}

/** Remembers which card brought the visitor to the article, so "kept reading" can be counted on the article page. */
export function rememberReco(key: string, article: string) {
  try { sessionStorage.setItem('aurenstar_reco', JSON.stringify({ sign: key, article, at: Date.now() })); } catch { /* ignore */ }
}
