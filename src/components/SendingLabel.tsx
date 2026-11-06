import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

const TEXT = {
  pt: { first: 'Enviando… só um instante', slow: 'Quase lá… verificando que você é gente 😊', short: 'Enviando…' },
  en: { first: 'Sending… just a moment', slow: 'Almost there… checking you are human 😊', short: 'Sending…' },
  es: { first: 'Enviando… un momento', slow: 'Casi listo… verificando que eres persona 😊', short: 'Enviando…' },
} as const;

/** Spinner + friendly message for the send buttons, so the page never looks frozen. After 4 s the message explains the wait. */
export default function SendingLabel({ lang, compact = false }: { lang: string; compact?: boolean }) {
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setSlow(true), 4000);
    return () => clearTimeout(id);
  }, []);
  const k = (lang === 'pt' || lang === 'es' ? lang : 'en') as 'pt' | 'en' | 'es';
  const text = compact ? TEXT[k].short : slow ? TEXT[k].slow : TEXT[k].first;
  return (
    <span className="inline-flex items-center justify-center gap-2" role="status" aria-live="polite">
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      <span>{text}</span>
    </span>
  );
}
