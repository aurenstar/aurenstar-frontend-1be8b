import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

/**
 * Shows the whole site in the language of the visitor's country when the site has no hand-written menus in it
 * (e.g. Dutch, Japanese, Arabic). The page is written in English; the visible texts are sent (once per page) to
 * /api/translate-ui, saved for everyone, and swapped in place. Nothing changes for English / Portuguese / Spanish
 * visitors, nor for anyone who picked a language by hand, and search engines keep reading the English page.
 */
const SKIP = 'script,style,noscript,textarea,input,code,pre,svg,[data-no-translate],[data-seg],[contenteditable="true"]';
const RTL = new Set(['ar', 'he', 'fa', 'ur', 'dv']);
const MAX_PER_REQUEST = 100;
const MAX_CHARS_PER_REQUEST = 6000;
const CACHE_LIMIT = 3000;

const loadCache = (key: string): Record<string, string> => {
  try {
    return JSON.parse(localStorage.getItem(key) || '{}') || {};
  } catch {
    return {};
  }
};
const saveCache = (key: string, map: Record<string, string>) => {
  try {
    const entries = Object.entries(map);
    localStorage.setItem(key, JSON.stringify(Object.fromEntries(entries.slice(-CACHE_LIMIT))));
  } catch {
    // storage full or blocked: texts are simply translated again next visit
  }
};

export const SiteLocalizer: React.FC = () => {
  const { visitorLanguage } = useLanguage();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!visitorLanguage) return;
    const lang = visitorLanguage;
    const cacheKey = `aurenstar_ui_${lang}_v1`;
    const cache = loadCache(cacheKey);
    const failed = new Set<string>(); // texts the server could not translate in this visit (do not ask again)
    const originals = new Map<Text, string>();
    const written = new WeakMap<Text, string>();
    const attrOriginals = new Map<Element, Record<string, string>>();
    const prevLang = document.documentElement.lang;
    const prevDir = document.documentElement.dir;
    let stopped = false;
    let running = false;
    let again = false;
    let timer: number | undefined;
    let slow: number | undefined;

    document.documentElement.lang = lang;
    document.documentElement.dir = RTL.has(lang) ? 'rtl' : 'ltr';

    const hasLetters = (s: string) => /\p{L}/u.test(s);

    function collect() {
      const textNodes: Text[] = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let n: Node | null;
      while ((n = walker.nextNode())) {
        const t = n as Text;
        const v = t.nodeValue || '';
        if (written.get(t) === v) continue; // already ours
        if (!hasLetters(v)) continue;
        const parent = t.parentElement;
        if (!parent || parent.closest(SKIP)) continue;
        textNodes.push(t);
      }
      const attrNodes: { el: Element; attr: string; value: string }[] = [];
      document.body.querySelectorAll('[placeholder],[aria-label]').forEach((el) => {
        if (el.closest(SKIP.replace('input,', ''))) return;
        for (const attr of ['placeholder', 'aria-label']) {
          const value = el.getAttribute(attr);
          if (value && hasLetters(value) && attrOriginals.get(el)?.[attr] === undefined) attrNodes.push({ el, attr, value });
        }
      });
      return { textNodes, attrNodes };
    }

    async function translateBatch(strings: string[]) {
      try {
        const res = await fetch('/api/translate-ui', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ strings }),
        });
        const d = res.ok ? await res.json() : null;
        if (d?.success && Array.isArray(d.texts) && d.texts.length === strings.length) {
          strings.forEach((s, i) => {
            if (d.texts[i]) cache[s] = d.texts[i];
          });
          return true;
        }
      } catch {
        // network problem: stay in English
      }
      strings.forEach((s) => failed.add(s));
      return false;
    }

    async function run() {
      if (running) {
        again = true;
        return;
      }
      running = true;
      try {
        do {
          again = false;
          const { textNodes, attrNodes } = collect();
          const wanted = new Set<string>();
          textNodes.forEach((t) => wanted.add((t.nodeValue || '').trim()));
          attrNodes.forEach((a) => wanted.add(a.value.trim()));
          const missing = [...wanted].filter((s) => s && !cache[s] && !failed.has(s));

          if (missing.length) {
            slow = window.setTimeout(() => !stopped && setBusy(true), 800);
            const batches: string[][] = [];
            let cur: string[] = [];
            let size = 0;
            for (const s of missing) {
              if (cur.length >= MAX_PER_REQUEST || (cur.length && size + s.length > MAX_CHARS_PER_REQUEST)) {
                batches.push(cur);
                cur = [];
                size = 0;
              }
              cur.push(s);
              size += s.length;
            }
            if (cur.length) batches.push(cur);
            for (let i = 0; i < batches.length && !stopped; i += 3) {
              await Promise.all(batches.slice(i, i + 3).map(translateBatch));
            }
            window.clearTimeout(slow);
            if (!stopped) setBusy(false);
            saveCache(cacheKey, cache);
          }
          if (stopped) return;

          textNodes.forEach((t) => {
            const v = t.nodeValue || '';
            const core = v.trim();
            const out = cache[core];
            if (!out || !t.isConnected) return;
            const lead = v.slice(0, v.indexOf(core));
            const trail = v.slice(v.indexOf(core) + core.length);
            const next = lead + out + trail;
            originals.set(t, v);
            written.set(t, next);
            t.nodeValue = next;
          });
          attrNodes.forEach(({ el, attr, value }) => {
            const out = cache[value.trim()];
            if (!out) return;
            attrOriginals.set(el, { ...(attrOriginals.get(el) || {}), [attr]: value });
            el.setAttribute(attr, out);
          });
        } while (again && !stopped);
      } finally {
        running = false;
      }
    }

    const schedule = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => !stopped && run(), 350);
    };
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    schedule();

    return () => {
      stopped = true;
      observer.disconnect();
      window.clearTimeout(timer);
      window.clearTimeout(slow);
      setBusy(false);
      // Give the English texts back (the person picked a language by hand).
      originals.forEach((orig, t) => {
        if (t.isConnected && t.nodeValue === written.get(t)) t.nodeValue = orig;
      });
      attrOriginals.forEach((attrs, el) => {
        Object.entries(attrs).forEach(([a, v]) => el.setAttribute(a, v));
      });
      document.documentElement.lang = prevLang || 'en';
      document.documentElement.dir = prevDir || '';
    };
  }, [visitorLanguage]);

  if (!busy) return null;
  return (
    <div
      role="status"
      aria-label="…"
      className="pointer-events-none fixed bottom-4 left-4 z-50 h-8 w-8 animate-spin rounded-full border-[3px] border-white border-t-[#F51B83] shadow-md"
    />
  );
};
