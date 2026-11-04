import React, { useState } from 'react';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { trackEvent } from '../utils/analytics';
import { TshirtCapture } from './TshirtCapture';
import { SignArticleCard } from './SignArticleCard';

type Tool = 'daily_message' | 'auren_effect' | 'discover_sign' | 'describe_me';

const TEXT = {
  pt: { ask: 'Gostou do seu resultado?', up: 'Gostei', down: 'Não gostei', thanks: 'Obrigado! Sua opinião ajuda a melhorar. 💙', note: 'Anônimo: não guardamos quem você é.' },
  en: { ask: 'Did you like your result?', up: 'I liked it', down: 'Not for me', thanks: 'Thank you! Your opinion helps us improve. 💙', note: 'Anonymous: we do not store who you are.' },
  es: { ask: '¿Te gustó tu resultado?', up: 'Me gustó', down: 'No me gustó', thanks: '¡Gracias! Tu opinión nos ayuda a mejorar. 💙', note: 'Anónimo: no guardamos quién eres.' },
} as const;

const doneKey = (tool: string) => `aurenstar_feedback_${tool}_${new Date().toISOString().slice(0, 10)}`;

/** Thumbs up / down under a result. Sends only the tool, the vote, the sign and the language: nothing personal. */
export const FeedbackButtons: React.FC<{ tool: Tool; sign?: string }> = ({ tool, sign }) => {
  const { language } = useLanguage();
  const lang = (language === 'pt' || language === 'es' ? language : 'en') as 'pt' | 'en' | 'es';
  const t = TEXT[lang];
  const [done, setDone] = useState(() => {
    try { return localStorage.getItem(doneKey(tool)) === '1'; } catch { return false; }
  });

  const vote = (rating: 1 | -1) => {
    setDone(true);
    try { localStorage.setItem(doneKey(tool), '1'); } catch { /* ignore */ }
    trackEvent('result_feedback', { tool, rating });
    fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tool, rating, sign: sign || '', lang }),
    }).catch(() => { /* a lost vote never bothers the visitor */ });
  };

  return (
    <>
    <div className="mx-auto my-8 w-full max-w-3xl rounded-2xl border border-[#D9E8F8] bg-white p-5 text-center shadow-sm">
      {done ? (
        <p className="text-sm font-bold text-[#17366F]">{t.thanks}</p>
      ) : (
        <>
          <p className="text-sm font-bold text-[#172B4D]">{t.ask}</p>
          <div className="mt-3 flex justify-center gap-3">
            <button type="button" onClick={() => vote(1)} className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#3982C8] px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-[#3375B4]">
              <ThumbsUp className="h-4 w-4" /> {t.up}
            </button>
            <button type="button" onClick={() => vote(-1)} className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#D9E8F8] bg-white px-5 py-2 text-xs font-bold text-[#17366F] transition-colors hover:bg-[#E4F1FF]">
              <ThumbsDown className="h-4 w-4" /> {t.down}
            </button>
          </div>
          <p className="mt-2 text-[11px] text-[#647DA5]">{t.note}</p>
        </>
      )}
    </div>
    <SignArticleCard sign={sign} tool={tool} />
    <TshirtCapture source="result" sign={sign} />
    </>
  );
};
