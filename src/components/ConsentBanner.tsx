import React, { useEffect, useState } from 'react';
import { Cookie } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { CONSENT_EVENT, getConsent, setConsent } from '../utils/consent';

const TEXT = {
  pt: {
    title: 'Sua privacidade',
    body: 'Usamos cookies para contar visitas e melhorar o site. Você escolhe.',
    all: 'Aceitar todos',
    essential: 'Só os essenciais',
    more: 'Saiba mais',
  },
  en: {
    title: 'Your privacy',
    body: 'We use cookies to count visits and improve the site. You choose.',
    all: 'Accept all',
    essential: 'Only essential',
    more: 'Learn more',
  },
  es: {
    title: 'Tu privacidad',
    body: 'Usamos cookies para contar visitas y mejorar el sitio. Tú eliges.',
    all: 'Aceptar todas',
    essential: 'Solo esenciales',
    more: 'Más información',
  },
} as const;

export const ConsentBanner: React.FC = () => {
  const { language } = useLanguage();
  const t = TEXT[(language === 'pt' || language === 'es' ? language : 'en') as 'pt' | 'en' | 'es'];
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (location.pathname.startsWith('/dictionary') || navigator.webdriver) return;
    setOpen(getConsent() === null);
    const onChange = () => setOpen(getConsent() === null);
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  if (!open) return null;
  return (
    <div role="dialog" aria-label={t.title} data-testid="consent-banner" className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-4 sm:bottom-4 sm:max-w-sm z-[9000] rounded-2xl bg-white border border-[#D9E8F8] shadow-xl p-4">
      <div className="flex items-start gap-3">
        <div className="shrink-0 flex h-9 w-9 items-center justify-center rounded-xl bg-[#E4F1FF] text-[#2878D0]">
          <Cookie className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-[#172B4D]">{t.title}</p>
          <p className="text-xs leading-relaxed text-[#647DA5] mt-0.5">
            {t.body}{' '}
            <a href="/privacy" className="font-semibold text-[#2878D0] hover:underline">{t.more}</a>
          </p>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={() => setConsent('essential')} className="flex-1 rounded-full border border-[#D9E8F8] bg-white px-3 py-2 text-xs font-bold text-[#17366F] hover:bg-[#E4F1FF] transition-colors cursor-pointer">{t.essential}</button>
        <button type="button" onClick={() => setConsent('all')} className="flex-1 rounded-full bg-[#F51B83] px-3 py-2 text-xs font-bold text-white hover:bg-[#D9166F] transition-colors cursor-pointer">{t.all}</button>
      </div>
    </div>
  );
};
