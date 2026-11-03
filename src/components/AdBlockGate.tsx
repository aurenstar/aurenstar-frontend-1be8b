import React, { useCallback, useEffect, useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

/**
 * Asks visitors to turn off their ad blocker.
 * Detection is done only in the browser, after the page loads, so search engines (which have no
 * ad blocker) always receive the full page and nothing is hidden from them.
 *
 * Two checks: (1) a hidden "bait" box with names ad blockers hide, (2) a request to a path ad
 * blockers refuse to load. Either one failing means a blocker is active.
 */
async function adBlockerActive(): Promise<boolean> {
  // 1) bait element
  const bait = document.createElement('div');
  bait.className = 'adsbox ad-banner ad-placement pub_300x250 textads banner-ads';
  bait.setAttribute('aria-hidden', 'true');
  bait.style.cssText = 'position:absolute;left:-9999px;top:-9999px;width:10px;height:10px;';
  document.body.appendChild(bait);
  await new Promise((r) => setTimeout(r, 120));
  const hidden =
    !bait.offsetParent || bait.offsetHeight === 0 || getComputedStyle(bait).display === 'none' || getComputedStyle(bait).visibility === 'hidden';
  bait.remove();
  if (hidden) return true;

  // 2) blocked request (a network error means a blocker stopped it; a 404 still counts as "loaded")
  try {
    await fetch(`/ads/ads.js?_=${Date.now()}`, { cache: 'no-store' });
    return false;
  } catch {
    return typeof navigator !== 'undefined' ? navigator.onLine !== false : true;
  }
}

const TEXT = {
  pt: {
    title: 'Desative o bloqueador de anúncios',
    body: 'A Aurenstar é gratuita e se mantém com anúncios. Para continuar, desligue o bloqueador de anúncios neste site e toque no botão abaixo.',
    btn: 'Já desativei, continuar',
    still: 'Ainda detectamos o bloqueador. Desative-o para este site e tente de novo.',
  },
  en: {
    title: 'Please turn off your ad blocker',
    body: 'Aurenstar is free and supported by ads. To keep going, turn off your ad blocker for this site and tap the button below.',
    btn: "I've turned it off, continue",
    still: 'We still detect the blocker. Please disable it for this site and try again.',
  },
  es: {
    title: 'Desactiva tu bloqueador de anuncios',
    body: 'Aurenstar es gratis y se mantiene con anuncios. Para continuar, desactiva el bloqueador en este sitio y toca el botón.',
    btn: 'Ya lo desactivé, continuar',
    still: 'Aún detectamos el bloqueador. Desactívalo para este sitio e inténtalo de nuevo.',
  },
} as const;

export const AdBlockGate: React.FC = () => {
  const { language } = useLanguage();
  const t = TEXT[(language === 'pt' || language === 'es' ? language : 'en') as 'pt' | 'en' | 'es'];
  const [blocked, setBlocked] = useState(false);
  const [retried, setRetried] = useState(false);

  const check = useCallback(async () => {
    try {
      setBlocked(await adBlockerActive());
    } catch {
      setBlocked(false);
    }
  }, []);

  useEffect(() => {
    // Never run for the internal admin area or for automated test runs.
    if (typeof window === 'undefined') return;
    if (location.pathname.startsWith('/dictionary') || navigator.webdriver) return;
    const timer = setTimeout(check, 1200);
    return () => clearTimeout(timer);
  }, [check]);

  useEffect(() => {
    if (!blocked) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [blocked]);

  if (!blocked) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      data-testid="adblock-gate"
      className="fixed inset-0 z-[100000] flex items-center justify-center bg-[#172B4D]/70 backdrop-blur-md px-4"
    >
      <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 text-center shadow-2xl border border-[#D9E8F8]">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E4F1FF] text-[#2878D0]">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-extrabold text-[#172B4D] mb-2">{t.title}</h2>
        <p className="text-sm leading-relaxed text-[#647DA5] mb-5">{t.body}</p>
        {retried && <p className="text-xs font-semibold text-[#F51B83] mb-3">{t.still}</p>}
        <button
          type="button"
          onClick={async () => {
            await check();
            setRetried(true);
          }}
          className="w-full rounded-full bg-[#F51B83] hover:bg-[#D9166F] px-6 py-3 text-sm font-bold text-white transition-colors cursor-pointer"
        >
          {t.btn}
        </button>
      </div>
    </div>
  );
};
