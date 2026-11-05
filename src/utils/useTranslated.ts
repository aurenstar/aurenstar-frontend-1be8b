import { useEffect, useRef, useState } from 'react';

type Lang = 'pt' | 'en' | 'es';

/**
 * The AI writes a reading in the language the person had when generating it. If the person later switches the site language,
 * this hook shows the same reading translated (same meaning), keeping the translation in the browser so it is asked only once.
 * Returns the original value until the translation is ready, or forever if translating is not possible.
 */
export function useTranslated<T>(value: T | null, fromLang: Lang | undefined, toLang: Lang, extract: (v: T) => string[], apply: (v: T, texts: string[]) => T): { value: T | null; translating: boolean } {
  const [view, setView] = useState<{ key: string; value: T } | null>(null);
  const [translating, setTranslating] = useState(false);
  const extractRef = useRef(extract);
  const applyRef = useRef(apply);
  extractRef.current = extract;
  applyRef.current = apply;

  const texts = value ? extract(value) : [];
  const signature = JSON.stringify(texts) + '|' + toLang;

  useEffect(() => {
    if (!value || !fromLang || fromLang === toLang || !texts.some((t) => t.trim())) { setTranslating(false); return; }
    const cacheKey = 'aurenstar_tr_v1_' + toLang + '_' + hash(JSON.stringify(texts));
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) { setView({ key: signature, value: applyRef.current(value, JSON.parse(cached)) }); return; }
    } catch { /* no storage */ }
    let cancelled = false;
    setTranslating(true);
    fetch('/api/translate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ texts, lang: toLang }) })
      .then((r) => r.json())
      .then((json) => {
        if (cancelled || !json?.success || !Array.isArray(json.texts)) return;
        try { localStorage.setItem(cacheKey, JSON.stringify(json.texts)); } catch { /* no storage */ }
        setView({ key: signature, value: applyRef.current(value, json.texts) });
      })
      .catch(() => { /* keep the original text */ })
      .finally(() => { if (!cancelled) setTranslating(false); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature, fromLang]);

  const showTranslated = view && view.key === signature && fromLang && fromLang !== toLang;
  return { value: showTranslated ? view.value : value, translating };
}

function hash(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}
