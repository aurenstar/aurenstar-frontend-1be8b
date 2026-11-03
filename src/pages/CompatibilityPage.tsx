import React, { useState } from 'react';
import { ArrowLeft, HeartHandshake, Loader2, Check, AlertTriangle } from 'lucide-react';
import { ToolHero } from '../components/ToolHero';
import { PersonFields, emptyPerson, personPayload, type Person } from '../components/PersonFields';
import { useLanguage } from '../context/LanguageContext';
import { areaName, careLine, compatVerdict, signName, strongLine, type Lang } from '../utils/astroText';

interface Aspect { a: string; b: string; type: string }
interface Result {
  score: number;
  areas: Record<string, number>;
  signs: { a: { sun: string; moon: string }; b: { sun: string; moon: string } };
  strongest: Aspect[];
  challenges: Aspect[];
}

const T = {
  en: { back: 'Back to Home', blog: 'Explore Blog Posts →', tag: 'For two', title: 'Compatibility', subtitle: 'Enter the birth dates of two people and see how well they fit, in simple words.', one: 'Person 1', two: 'Person 2', go: 'See our compatibility', wait: 'Comparing the two skies…', err: 'We could not calculate right now. Please try again in a moment.', limit: 'Too many tries from this connection. Please try again later.', human: 'We could not confirm you are a person. Reload the page and try again.', flows: 'What flows', care: 'What needs care', again: 'Compare other people', sun: 'Sun', moon: 'Moon', matchOf: (a: string, b: string) => `${a} & ${b}`, nobody: 'Person 1 & Person 2', approx: 'Without the birth time, the Moon sign can be slightly off.' },
  pt: { back: 'Voltar ao Início', blog: 'Ver Artigos do Blog →', tag: 'Para dois', title: 'Compatibilidade', subtitle: 'Coloque a data de nascimento de duas pessoas e veja, em palavras simples, o quanto combinam.', one: 'Pessoa 1', two: 'Pessoa 2', go: 'Ver a nossa compatibilidade', wait: 'Comparando os dois céus…', err: 'Não conseguimos calcular agora. Tente de novo em instantes.', limit: 'Muitas tentativas desta conexão. Tente de novo mais tarde.', human: 'Não conseguimos confirmar que você é uma pessoa. Recarregue a página e tente de novo.', flows: 'O que flui', care: 'O que pede cuidado', again: 'Comparar outras pessoas', sun: 'Sol', moon: 'Lua', matchOf: (a: string, b: string) => `${a} e ${b}`, nobody: 'Pessoa 1 e Pessoa 2', approx: 'Sem a hora de nascimento, o signo da Lua pode variar um pouco.' },
  es: { back: 'Volver al Inicio', blog: 'Ver Artículos del Blog →', tag: 'Para dos', title: 'Compatibilidad', subtitle: 'Escribe la fecha de nacimiento de dos personas y mira, con palabras simples, cuánto combinan.', one: 'Persona 1', two: 'Persona 2', go: 'Ver nuestra compatibilidad', wait: 'Comparando los dos cielos…', err: 'No pudimos calcular ahora. Inténtalo de nuevo en un momento.', limit: 'Demasiados intentos desde esta conexión. Inténtalo más tarde.', human: 'No pudimos confirmar que eres una persona. Recarga la página e inténtalo de nuevo.', flows: 'Lo que fluye', care: 'Lo que pide cuidado', again: 'Comparar otras personas', sun: 'Sol', moon: 'Luna', matchOf: (a: string, b: string) => `${a} y ${b}`, nobody: 'Persona 1 y Persona 2', approx: 'Sin la hora de nacimiento, el signo de la Luna puede variar un poco.' },
} as const;

const Ring: React.FC<{ score: number }> = ({ score }) => {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative h-36 w-36 shrink-0">
      <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
        <circle cx="64" cy="64" r={r} fill="none" stroke="#E4F1FF" strokeWidth="12" />
        <circle cx="64" cy="64" r={r} fill="none" stroke="#F51B83" strokeWidth="12" strokeLinecap="round" strokeDasharray={`${(score / 100) * c} ${c}`} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-4xl font-extrabold text-[#172B4D]">{score}%</div>
    </div>
  );
};

export const CompatibilityPage: React.FC<{ onBackToHome: () => void; onNavigateToBlog: () => void }> = ({ onBackToHome, onNavigateToBlog }) => {
  const { language } = useLanguage();
  const lang = (language === 'pt' || language === 'es' ? language : 'en') as Lang;
  const t = T[lang];
  const [a, setA] = useState<Person>({ ...emptyPerson(), year: 1995 });
  const [b, setB] = useState<Person>({ ...emptyPerson(), month: 11, day: 3, year: 1993 });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<Result | null>(null);

  const go = async () => {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/compatibility', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ a: personPayload(a), b: personPayload(b) }) });
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

  const names = t.matchOf(a.name.trim().split(/\s+/)[0] || t.one, b.name.trim().split(/\s+/)[0] || t.two);
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
            <ToolHero icon={<HeartHandshake className="h-8 w-8" />} tag={t.tag} title={t.title} subtitle={t.subtitle} tone="pink" />
            <div className={card}>
              <h2 className="text-base font-extrabold mb-4">{t.one}</h2>
              <PersonFields id="a" value={a} onChange={setA} lang={lang} />
            </div>
            <div className={card}>
              <h2 className="text-base font-extrabold mb-4">{t.two}</h2>
              <PersonFields id="b" value={b} onChange={setB} lang={lang} />
            </div>
            {error && <p role="alert" className="mb-4 text-sm font-semibold text-[#F51B83]">{error}</p>}
            <button type="button" onClick={go} disabled={busy} className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#F51B83] hover:bg-[#D9166F] disabled:opacity-70 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#F51B83]/25 transition-all cursor-pointer">
              {busy ? <><Loader2 className="h-4 w-4 animate-spin" />{t.wait}</> : t.go}
            </button>
          </>
        ) : (
          <>
            <div className={`${card} text-center`}>
              <p className="text-xs font-bold uppercase tracking-wider text-[#F51B83] mb-1">{names}</p>
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-6 my-4">
                <Ring score={result.score} />
                <div className="text-left max-w-xs">
                  <h1 className="text-2xl font-extrabold leading-tight">{compatVerdict(result.score, lang)}</h1>
                  <p className="mt-2 text-xs text-[#647DA5]">
                    {t.sun}: {signName(result.signs.a.sun, lang)} · {signName(result.signs.b.sun, lang)}<br />
                    {t.moon}: {signName(result.signs.a.moon, lang)} · {signName(result.signs.b.moon, lang)}
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-left">
                {Object.entries(result.areas).map(([k, v]) => (
                  <div key={k}>
                    <div className="flex justify-between text-xs font-bold text-[#17366F] mb-1"><span>{areaName(k, lang)}</span><span>{v}%</span></div>
                    <div className="h-2 rounded-full bg-[#E4F1FF]"><div className="h-2 rounded-full bg-[#2878D0]" style={{ width: `${v}%` }} /></div>
                  </div>
                ))}
              </div>
            </div>

            {result.strongest.length > 0 && (
              <div className={card}>
                <h2 className="flex items-center gap-2 text-base font-extrabold mb-3"><Check className="h-5 w-5 text-[#2878D0]" />{t.flows}</h2>
                <ul className="space-y-2">{result.strongest.map((s, i) => <li key={i} className="text-sm leading-relaxed text-[#647DA5]">{strongLine(s.a, s.b, lang)}</li>)}</ul>
              </div>
            )}
            {result.challenges.length > 0 && (
              <div className={card}>
                <h2 className="flex items-center gap-2 text-base font-extrabold mb-3"><AlertTriangle className="h-5 w-5 text-[#F51B83]" />{t.care}</h2>
                <ul className="space-y-2">{result.challenges.map((s, i) => <li key={i} className="text-sm leading-relaxed text-[#647DA5]">{careLine(s.a, s.b, lang)}</li>)}</ul>
              </div>
            )}
            {(!a.time || !b.time) && <p className="mb-6 text-center text-[11px] text-[#647DA5]">{t.approx}</p>}
            <button type="button" onClick={() => setResult(null)} className="mx-auto flex items-center justify-center rounded-full border-2 border-[#2878D0] px-6 py-2.5 text-sm font-bold text-[#2878D0] hover:bg-[#2878D0] hover:text-white transition-colors cursor-pointer">{t.again}</button>
          </>
        )}
      </div>
    </div>
  );
};
