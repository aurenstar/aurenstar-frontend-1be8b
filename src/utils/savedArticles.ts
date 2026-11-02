/**
 * "Save article" bookmark: a light per-visitor convenience stored in the browser (localStorage).
 * It never leaves the visitor's device and the site works normally if storage is unavailable.
 */
const KEY = 'aurenstar-saved-articles';
const EVENT = 'aurenstar:saved-articles';

export function getSavedArticles(): string[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

/** Toggles an article and returns true when it is now saved. */
export function toggleSavedArticle(id: string): boolean {
  const current = getSavedArticles();
  const isSaved = current.includes(id);
  const next = isSaved ? current.filter((x) => x !== id) : [...current, id];
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // storage blocked (private window...): the bookmark still reacts for this visit
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { id, saved: !isSaved } }));
  return !isSaved;
}

export function subscribeSavedArticles(listener: () => void): () => void {
  window.addEventListener(EVENT, listener);
  window.addEventListener('storage', listener);
  return () => {
    window.removeEventListener(EVENT, listener);
    window.removeEventListener('storage', listener);
  };
}
