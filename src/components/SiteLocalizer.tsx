import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translateUi } from '../utils/uiTranslate';

/**
 * Shows the whole site in the language of the visitor's country when the site has no hand-written menus in it
 * (e.g. Dutch, Japanese, Arabic). The page is written in English; the visible texts are sent (once per page) to
 * /api/translate-ui, saved for everyone, and swapped in place. Nothing changes for English / Portuguese / Spanish
 * visitors, nor for anyone who picked a language by hand, and search engines keep reading the English page.
 */
const SKIP = 'script,style,noscript,textarea,input,code,pre,svg,[data-no-translate],[data-loc],[contenteditable="true"]';
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
    const merged = { ...loadCache(key), ...map }; // other parts of the site save here too
    const entries = Object.entries(merged);
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
    let titleWritten = '';
    const titleOriginals: string[] = [];

    document.documentElement.lang = lang;
    document.documentElement.dir = RTL.has(lang) ? 'rtl' : 'ltr';

    const hasLetters = (s: string) => /\p{L}/u.test(s);

    const INLINE = new Set(['SPAN', 'STRONG', 'EM', 'B', 'I', 'A', 'MARK', 'SMALL', 'U', 'SUB', 'SUP', 'LABEL']);
    const noGroup = new WeakSet<Element>(); // blocks whose joined translation did not fit: translated piece by piece instead
    type Item = { kind: 'T' | 'E'; node: Text };
    const orig = (t: Text) => (written.get(t) === t.nodeValue ? originals.get(t) || '' : t.nodeValue || '');
    const lead = (v: string) => v.slice(0, v.length - v.trimStart().length);
    const trail = (v: string) => v.slice(v.trimEnd().length);

    /** A sentence made of text + small inline pieces (<span>, <strong>...) is translated as ONE sentence. */
    function blockItems(P: Element): Item[] | null {
      if (noGroup.has(P) || INLINE.has(P.tagName) === false && P.closest(SKIP)) return null;
      const items: Item[] = [];
      for (const c of Array.from(P.childNodes)) {
        if (c.nodeType === 3) {
          if (hasLetters(c.nodeValue || '') || written.has(c as Text)) items.push({ kind: 'T', node: c as Text });
        } else if (c.nodeType === 1) {
          const el = c as Element;
          if (el.tagName === 'BR') continue;
          if (!INLINE.has(el.tagName) || el.closest(SKIP)) return null;
          const kids = Array.from(el.childNodes);
          if (!kids.length) continue;
          if (kids.length !== 1 || kids[0].nodeType !== 3) return null;
          const t = kids[0] as Text;
          if (hasLetters(orig(t)) ) items.push({ kind: 'E', node: t });
        }
      }
      return items.length >= 2 && items.some((i) => i.kind === 'E') ? items : null;
    }
    const groupString = (items: Item[]) => {
      let k = 0;
      return items.map((i) => (i.kind === 'T' ? orig(i.node) : `<i${++k}>${orig(i.node).trim()}</i${k}>`)).join('');
    };
    function parseGroup(out: string, items: Item[]): string[] | null {
      const kinds: string[] = [];
      const texts: string[] = [];
      const re = /<i(\d+)>([\s\S]*?)<\/i\1>/g;
      let pos = 0;
      let expect = 1;
      let m: RegExpExecArray | null;
      while ((m = re.exec(out))) {
        const before = out.slice(pos, m.index);
        if (before.trim()) { kinds.push('T'); texts.push(before); }
        if (Number(m[1]) !== expect++) return null;
        kinds.push('E'); texts.push(m[2]);
        pos = m.index + m[0].length;
      }
      const after = out.slice(pos);
      if (after.trim()) { kinds.push('T'); texts.push(after); }
      const wanted = items.filter((i) => hasLetters(orig(i.node)) || i.kind === 'E').map((i) => i.kind);
      return kinds.join() === wanted.join() ? texts : null;
    }

    function collect() {
      const loose: Text[] = [];
      const groups = new Map<Element, Item[]>();
      const seenBlocks = new Set<Element>();
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let n: Node | null;
      while ((n = walker.nextNode())) {
        const t = n as Text;
        const v = t.nodeValue || '';
        if (written.get(t) === v) {
          // already ours; if a sibling changed we still look at the block below
        } else if (!hasLetters(v)) continue;
        const parent = t.parentElement;
        if (!parent || parent.closest(SKIP)) continue;
        const candidates = [parent, INLINE.has(parent.tagName) ? parent.parentElement : null].filter(Boolean) as Element[];
        let handled = false;
        for (const P of candidates) {
          if (seenBlocks.has(P)) { handled = true; break; }
          const items = blockItems(P);
          if (items && items.some((i) => i.node === t)) {
            seenBlocks.add(P);
            if (items.some((i) => written.get(i.node) !== i.node.nodeValue)) groups.set(P, items);
            handled = true;
            break;
          }
        }
        if (!handled && written.get(t) !== v) loose.push(t);
      }
      const attrNodes: { el: Element; attr: string; value: string }[] = [];
      document.body.querySelectorAll('[placeholder],[aria-label]').forEach((el) => {
        if (el.closest(SKIP.replace('input,', ''))) return;
        for (const attr of ['placeholder', 'aria-label']) {
          const value = el.getAttribute(attr);
          if (value && hasLetters(value) && attrOriginals.get(el)?.[attr] === undefined) attrNodes.push({ el, attr, value });
        }
      });
      const shareLinks: { el: Element; key: string; value: string }[] = [];
      document.body.querySelectorAll('a[href]').forEach((el) => {
        if (hrefOriginals.has(el)) return;
        const href = el.getAttribute('href') || '';
        if (!SHARE_HOSTS.test(href)) return;
        try {
          const u = new URL(href);
          const key = ['text', 'quote'].find((k) => u.searchParams.get(k));
          const value = key ? (u.searchParams.get(key) as string) : '';
          if (key && value.length > 11 && /\s/.test(value) && hasLetters(value)) shareLinks.push({ el, key, value });
        } catch {
          // not a valid link
        }
      });
      return { loose, groups, attrNodes, shareLinks };
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

    const setText = (t: Text, out: string) => {
      const v = orig(t);
      const next = lead(v) + out.trim() + trail(v);
      if (!originals.has(t) || written.get(t) !== t.nodeValue) originals.set(t, v);
      written.set(t, next);
      t.nodeValue = next;
    };

    async function run() {
      if (running) {
        again = true;
        return;
      }
      running = true;
      try {
        do {
          again = false;
          const { loose, groups, attrNodes, shareLinks } = collect();
          const wanted = new Set<string>();
          loose.forEach((t) => wanted.add((t.nodeValue || '').trim()));
          groups.forEach((items) => wanted.add(groupString(items)));
          attrNodes.forEach((a) => wanted.add(a.value.trim()));
          shareLinks.forEach((l) => wanted.add(l.value));
          const titleOriginal = document.title && document.title !== titleWritten ? document.title : '';
          if (titleOriginal && hasLetters(titleOriginal)) wanted.add(titleOriginal);
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

          loose.forEach((t) => {
            const out = cache[(t.nodeValue || '').trim()];
            if (out && t.isConnected) setText(t, out);
          });
          groups.forEach((items, P) => {
            const out = cache[groupString(items)];
            if (!out) return;
            const parts = parseGroup(out, items);
            const nodes = items.filter((i) => hasLetters(orig(i.node)) || i.kind === 'E');
            if (!parts || parts.length !== nodes.length) {
              noGroup.add(P); // translate this block piece by piece on the next round
              again = true;
              return;
            }
            nodes.forEach((i, k) => i.node.isConnected && setText(i.node, parts[k]));
          });
          attrNodes.forEach(({ el, attr, value }) => {
            const out = cache[value.trim()];
            if (!out) return;
            attrOriginals.set(el, { ...(attrOriginals.get(el) || {}), [attr]: value });
            el.setAttribute(attr, out);
          });
          shareLinks.forEach(({ el, key, value }) => {
            const out = cache[value];
            if (!out) return;
            const href = el.getAttribute('href') || '';
            try {
              const u = new URL(href);
              u.searchParams.set(key, out);
              hrefOriginals.set(el, href);
              el.setAttribute('href', u.toString());
            } catch {
              // leave the link as it is
            }
          });
          if (titleOriginal && cache[titleOriginal]) {
            titleOriginals.push(titleOriginal);
            titleWritten = cache[titleOriginal];
            document.title = titleWritten;
          }
        } while (again && !stopped);
      } finally {
        running = false;
      }
    }

    // ---- Texts that leave the site (copy, share to WhatsApp / X / Telegram...) are translated too ----
    const SHARE_HOSTS = /^https?:\/\/(api\.whatsapp\.com\/send|wa\.me\/|(www\.)?twitter\.com\/intent\/|(www\.)?x\.com\/intent\/|t\.me\/share|(www\.)?facebook\.com\/sharer)/i;
    const hrefOriginals = new Map<Element, string>();
    const translateOne = async (text: string): Promise<string> => {
      if (!text || text.length < 12 || !/\s/.test(text) || !hasLetters(text)) return text;
      try {
        const out = await Promise.race([
          translateUi(lang, [text]),
          new Promise<null>((resolve) => window.setTimeout(() => resolve(null), 4000)),
        ]);
        return out?.[0] || text;
      } catch {
        return text;
      }
    };
    const origWrite = navigator.clipboard?.writeText?.bind(navigator.clipboard);
    if (origWrite) {
      try {
        navigator.clipboard.writeText = async (text: string) => origWrite(await translateOne(text));
      } catch {
        // read-only in this browser: copied text stays as is
      }
    }
    const origShare = typeof navigator.share === 'function' ? navigator.share.bind(navigator) : null;
    if (origShare) {
      try {
        navigator.share = async (data?: ShareData) => {
          if (!data) return origShare(data);
          const [text, title] = await Promise.all([data.text ? translateOne(data.text) : data.text, data.title ? translateOne(data.title) : data.title]);
          return origShare({ ...data, text, title });
        };
      } catch {
        // keep the original
      }
    }
    const origOpen = window.open.bind(window);
    window.open = ((url?: string | URL, target?: string, features?: string) => {
      const href = String(url || '');
      if (!SHARE_HOSTS.test(href)) return origOpen(url as any, target, features);
      let u: URL;
      try {
        u = new URL(href);
      } catch {
        return origOpen(url as any, target, features);
      }
      const key = ['text', 'quote'].find((k) => u.searchParams.get(k));
      if (!key) return origOpen(url as any, target, features);
      const win = origOpen('about:blank', target, features); // opened right away so the browser allows it
      if (!win) return origOpen(url as any, target, features);
      translateOne(u.searchParams.get(key) as string).then((out) => {
        u.searchParams.set(key, out);
        try {
          win.location.href = u.toString();
        } catch {
          // window closed meanwhile
        }
      });
      return win;
    }) as typeof window.open;

    const schedule = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => !stopped && run(), 350);
    };
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    const titleEl = document.querySelector('title');
    if (titleEl) observer.observe(titleEl, { childList: true, characterData: true, subtree: true });
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
      if (origWrite) { try { navigator.clipboard.writeText = origWrite; } catch { /* ignore */ } }
      if (origShare) { try { navigator.share = origShare; } catch { /* ignore */ } }
      window.open = origOpen as typeof window.open;
      hrefOriginals.forEach((href, el) => el.setAttribute('href', href));
      attrOriginals.forEach((attrs, el) => {
        Object.entries(attrs).forEach(([a, v]) => el.setAttribute(a, v));
      });
      if (titleWritten && document.title === titleWritten && titleOriginals.length) document.title = titleOriginals[titleOriginals.length - 1];
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
