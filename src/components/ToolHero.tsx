import React from 'react';
import { Check, Clock, Gift, Moon, MoonStar, Sun, Sunrise, Zap } from 'lucide-react';
import { CoverArt } from './CoverArt';

/** Cover-style header used at the top of every tool page. */
export const ToolHero: React.FC<{
  icon: React.ReactNode;
  tag: string;
  title: string;
  subtitle: string;
  tone?: 'blue' | 'pink';
}> = ({ icon, tag, title, subtitle, tone = 'blue' }) => (
  <header
    className="relative mb-6 overflow-hidden rounded-[2rem] p-6 text-white shadow-[0_14px_40px_rgba(23,54,111,0.18)] sm:p-9"
    style={{ background: tone === 'pink' ? '#E73578' : '#3982C8' }}
  >
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 overflow-hidden sm:inset-y-0 sm:left-auto sm:right-0 sm:h-auto sm:w-1/2">
      <CoverArt tone={tone} />
    </div>
    <div className="relative flex flex-col gap-4 pb-12 sm:flex-row sm:items-center sm:gap-5 sm:pb-0 sm:pr-[38%]">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-white shadow-lg" style={{ color: tone === 'pink' ? '#E73578' : '#3982C8' }}>
        {icon}
      </div>
      <div>
        <div className="mb-2 inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">{tag}</div>
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">{title}</h1>
        <span aria-hidden className="mt-3 block h-1 w-12 rounded-full" style={{ background: tone === 'pink' ? '#fff' : '#E73578' }} />
        <p className="mt-3 text-sm leading-relaxed text-white/90">{subtitle}</p>
      </div>
    </div>
  </header>
);

const BENEFITS = {
  pt: [['Grátis', 'Sem pagar nada, sem cadastro.'], ['Rápido', 'Pronto em menos de 1 minuto.'], ['Palavras simples', 'Sem termos difíceis.']],
  en: [['Free', 'No payment, no sign-up.'], ['Quick', 'Ready in under a minute.'], ['Simple words', 'No hard terms.']],
  es: [['Gratis', 'Sin pagar, sin registro.'], ['Rápido', 'Listo en menos de un minuto.'], ['Palabras simples', 'Sin términos difíciles.']],
} as const;
const BENEFIT_ICONS = [Gift, Zap, Check];

/** Three small solid cards shown under the tool forms. */
export const ToolBenefits: React.FC<{ lang: 'pt' | 'en' | 'es' }> = ({ lang }) => (
  <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
    {BENEFITS[lang].map(([title, desc], i) => {
      const Icon = BENEFIT_ICONS[i];
      const pink = i === 1;
      return (
        <div key={title} className="relative overflow-hidden rounded-2xl p-4 text-white shadow-md" style={{ background: pink ? '#E73578' : '#3982C8' }}>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 overflow-hidden opacity-60"><CoverArt tone={pink ? 'pink' : 'blue'} variant={i} /></div>
          <div className="relative">
            <span className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white" style={{ color: pink ? '#E73578' : '#3982C8' }}><Icon className="h-4 w-4" /></span>
            <p className="text-sm font-extrabold">{title}</p>
            <p className="mb-5 text-[12px] text-white/90">{desc}</p>
          </div>
        </div>
      );
    })}
  </div>
);

const PERIOD_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  manha: Sunrise, tarde: Sun, noite: Moon, madrugada: MoonStar, exato: Clock,
};
export const PeriodIcon: React.FC<{ id: string; className?: string }> = ({ id, className = 'h-4 w-4' }) => {
  const I = PERIOD_ICONS[id] || Clock;
  return <I className={className} />;
};
