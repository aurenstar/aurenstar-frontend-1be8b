import { getUrlLang } from './urlLang';

/** Translates a short list of site texts into the visitor's language (same saved texts as the page translator). */
export async function translateUi(lang: string, strings: string[]): Promise<string[] | null> {
  const cacheKey = `aurenstar_ui_${lang}_v1`;
  let cache: Record<string, string> = {};
  try {
    cache = JSON.parse(localStorage.getItem(cacheKey) || '{}') || {};
  } catch {
    cache = {};
  }
  const missing = strings.filter((s) => !cache[s]);
  if (missing.length) {
    try {
      const res = await fetch('/api/translate-ui', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ strings: missing, lang: getUrlLang() || undefined }),
      });
      const d = res.ok ? await res.json() : null;
      if (!d?.success || !Array.isArray(d.texts) || d.texts.length !== missing.length) return null;
      missing.forEach((s, i) => {
        if (d.texts[i]) cache[s] = d.texts[i];
      });
      try {
        localStorage.setItem(cacheKey, JSON.stringify(cache));
      } catch {
        // storage full: translated again next visit
      }
    } catch {
      return null;
    }
  }
  const out = strings.map((s) => cache[s]);
  return out.every(Boolean) ? out : null;
}
