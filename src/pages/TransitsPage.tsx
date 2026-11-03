import React, { useState } from 'react';
import { ArrowLeft, Orbit, Loader2, Moon, RotateCcw } from 'lucide-react';
import { ToolHero } from '../components/ToolHero';
import { PersonFields, emptyPerson, personPayload, type Person } from '../components/PersonFields';
import { useLanguage } from '../context/LanguageContext';
import { retrogradeLine, signName, transitLine, type Lang } from '../utils/astroText';

interface Result {
  retrograde: string[];
  moon: { sign: string; degree: number };
  transits: { transit: string; natal: string; type: string; orb: number }[];
}

const T = {
  en: { back: 'Back to Home', blog: 'Explore Blog Posts →', tag: 'Right now', title: 'Your Sky Today', subtitle: 'See how the planets of today touch your birth chart, in simple words.', go: 'Show my sky today', wait: 'Looking at today’s sky…', err: 'We could not calculate right now. Please try again in a moment.', limit: 'Too many tries from this connection. Please try again later.', human: 'We could not confirm you are a person. Reload the page and try again.', moonNow: (s: string) => `Today the Moon is in ${s}.`, touches: 'What touches you today', backward: 'Planets moving backward', none: 'Nothing strong today. A calm day for you.', again: 'Check another date', approx: 'Without the birth time, the Moon part can be slightly off.' },
  pt: { back: 'Voltar ao Início', blog: 'Ver Artigos do Blog →', tag: 'Agora', title: 'Seu Céu de Hoje', subtitle: 'Veja como os planetas de hoje tocam o seu mapa de nascimento, em palavras simples.', go: 'Mostrar o meu céu de hoje', wait: 'Olhando o céu de hoje…', err: 'Não conseguimos calcular agora. Tente de novo em instantes.', limit: 'Muitas tentativas desta conexão. Tente de novo mais tarde.', human: 'Não conseguimos confirmar que você é uma pessoa. Recarregue a página e tente de novo.', moonNow: (s: string) => `Hoje a Lua está em ${s}.`, touches: 'O que toca você hoje', backward: 'Planetas andando para trás', none: 'Nada forte hoje. Um dia calmo para você.', again: 'Ver outra data', approx: 'Sem a hora de nascimento, a parte da Lua pode variar um pouco.' },
  es: { back: 'Volver al Inicio', blog: 'Ver Artículos del Blog →', tag: 'Ahora', title: 'Tu Cielo de Hoy', subtitle: 'Mira cómo los planetas de hoy tocan tu carta de nacimiento, con palabras simples.', go: 'Mostrar mi cielo de hoy', wait: 'Mirando el cielo de hoy…', err: 'No pudimos calcular ahora. Inténtalo de nuevo en un momento.', limit: 'Demasiados intentos desde esta conexión. Inténtalo más tarde.', human: 'No pudimos confirmar que eres una persona. Recarga la página e inténtalo de nuevo.', moonNow: (s: string) => `Hoy la Luna está en ${s}.`, touches: 'Lo que te toca hoy', backward: 'Planetas yendo hacia atrás', none: 'Nada fuerte hoy. Un día tranquilo para ti.', again: 'Ver otra fecha', approx: 'Sin la hora de nacimiento, la parte de la Luna puede variar un poco.' },
} as const;

export const TransitsPage: React.FC<{ onBackToHome: () => void; onNavigateToBlog: () => void }> = ({ onBackToHome, onNavigateToBlog }) => {
  const { language } = useLanguage();
  const lang = (language === 'pt' || language === 'es' ? language : 'en') as Lang;
  const t = T[lang];
  const [p, setP] = useState<Person>(emptyPerson());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<Result | null>(null);

  const go = async () => {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/transits', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(personPayload(p)) });
      if (res.status === 429) return setError(t.limit);
      if (res.status === 403) return setError(t.human);
      if (!res.ok) return setError(t.err);
      setResult(await res.json());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setError(t.err);
    } finally {
      setBusy(false);
    }
  };
  const card = 'bg-white rounded-3xl border border-[#D9E8F8] shadow-md p-6 sm:p-8 mb-6';

  return (
    <div className="w-full bg-[#C9E5FF] min-h-screen pt-24 sm:pt-28 pb-20 text-[#172B4D]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#D9E8F8]">
          <button type="button" onClick={onBackToHome} className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#647DA5] hover:text-[#172B4D] transition-colors cursor-pointer group">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /><span>{t.back}</span>
          </button>
          <button type="button" onClick={onNavigateToBlog} className="text-xs sm:text-sm font-bold text-[#2878D0] hover:text-[#17366F] transition-colors cursor-pointer">{t.blog}</button>
        </div>

        {!result ? (
          <>
            <ToolHero icon={<Orbit className="h-8 w-8" />} tag={t.tag} title={t.title} subtitle={t.subtitle} />
            <div className={card}><PersonFields id="me" value={p} onChange={setP} lang={lang} showName={false} /></div>
            {error && <p role="alert" className="mb-4 text-sm font-semibold text-[#F51B83]">{error}</p>}
            <button type="button" onClick={go} disabled={busy} className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#F51B83] hover:bg-[#D9166F] disabled:opacity-70 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#F51B83]/25 transition-all cursor-pointer">
              {busy ? <><Loader2 className="h-4 w-4 animate-spin" />{t.wait}</> : t.go}
            </button>
          </>
        ) : (
          <>
            <div className="rounded-[2rem] bg-[#2878D0] text-white p-6 sm:p-8 mb-6 shadow-[0_14px_40px_rgba(23,54,111,0.18)]">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/80"><Moon className="h-4 w-4" />{t.title}</p>
              <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold leading-tight">{t.moonNow(signName(result.moon.sign, lang))}</h1>
            </div>
            <div className={card}>
              <h2 className="text-base font-extrabold mb-3">{t.touches}</h2>
              {result.transits.length === 0 ? (
                <p className="text-sm text-[#647DA5]">{t.none}</p>
              ) : (
                <ul className="space-y-3">{result.transits.slice(0, 6).map((x, i) => <li key={i} className="text-sm leading-relaxed text-[#647DA5]">{transitLine(x.transit, x.natal, x.type, lang)}</li>)}</ul>
              )}
            </div>
            {result.retrograde.length > 0 && (
              <div className={card}>
                <h2 className="flex items-center gap-2 text-base font-extrabold mb-3"><RotateCcw className="h-5 w-5 text-[#F51B83]" />{t.backward}</h2>
                <ul className="space-y-2">{result.retrograde.filter((r) => r !== 'sun' && r !== 'moon').map((r) => <li key={r} className="text-sm leading-relaxed text-[#647DA5]">{retrogradeLine(r, lang)}</li>)}</ul>
              </div>
            )}
            {!p.time && <p className="mb-6 text-center text-[11px] text-[#647DA5]">{t.approx}</p>}
            <button type="button" onClick={() => setResult(null)} className="mx-auto flex items-center justify-center rounded-full border-2 border-[#2878D0] px-6 py-2.5 text-sm font-bold text-[#2878D0] hover:bg-[#2878D0] hover:text-white transition-colors cursor-pointer">{t.again}</button>
          </>
        )}
      </div>
    </div>
  );
};
