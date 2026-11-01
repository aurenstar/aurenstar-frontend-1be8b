import React from 'react';
import { BookOpen, CalendarDays, Compass, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ScrollReveal } from './ScrollReveal';

type ToolKey = 'daily-message' | 'aureneffect' | 'discover-sign' | 'describe-me';

interface ToolExplainerSectionProps {
  onNavigate: (tool: ToolKey) => void;
}

export const ToolExplainerSection: React.FC<ToolExplainerSectionProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const lang = language || 'pt';

  const copy = {
    en: {
      eyebrow: 'CHOOSE YOUR NEXT STEP',
      title: 'One experience for every moment',
      subtitle: 'Start with the tool that best matches what you are looking for right now.',
      open: 'Open tool',
      cards: [
        ['Aurendaily', 'Receive personalized guidance for your day.', 'daily-message', 'DAILY GUIDANCE', CalendarDays],
        ['Aureneffect', 'Understand the moment you are experiencing now.', 'aureneffect', 'REAL-TIME INSIGHTS', Sparkles],
        ['Sign Calculator', 'Discover your sun sign from your date of birth.', 'discover-sign', 'DISCOVER YOUR SIGN', Compass],
        ['Aurenstar Unfiltered', 'Create a personal description made to share.', 'describe-me', 'SHAREABLE PROFILE', BookOpen],
      ] as const,
    },
    pt: {
      eyebrow: 'ESCOLHA O SEU PRÓXIMO PASSO',
      title: 'Uma experiência para cada momento',
      subtitle: 'Comece pela ferramenta que melhor combina com o que você procura agora.',
      open: 'Abrir ferramenta',
      cards: [
        ['Aurendaily', 'Receba orientações personalizadas para o seu dia.', 'daily-message', 'ORIENTAÇÃO DIÁRIA', CalendarDays],
        ['Aureneffect', 'Compreenda o momento que você está vivendo agora.', 'aureneffect', 'INSIGHTS EM TEMPO REAL', Sparkles],
        ['Sign Calculator', 'Descubra seu signo solar a partir da sua data de nascimento.', 'discover-sign', 'DESCUBRA SEU SIGNO', Compass],
        ['Aurenstar Unfiltered', 'Crie uma descrição pessoal feita para compartilhar.', 'describe-me', 'PERFIL COMPARTILHÁVEL', BookOpen],
      ] as const,
    },
    es: {
      eyebrow: 'ELIGE TU PRÓXIMO PASO',
      title: 'Una experiencia para cada momento',
      subtitle: 'Empieza con la herramienta que mejor combina con lo que buscas ahora.',
      open: 'Abrir herramienta',
      cards: [
        ['Aurendaily', 'Recibe orientación personalizada para tu día.', 'daily-message', 'GUÍA DIARIA', CalendarDays],
        ['Aureneffect', 'Comprende el momento que estás viviendo ahora.', 'aureneffect', 'TIEMPO REAL', Sparkles],
        ['Sign Calculator', 'Descubre tu signo solar con tu fecha de nacimiento.', 'discover-sign', 'DESCUBRE TU SIGNO', Compass],
        ['Aurenstar Unfiltered', 'Crea una descripción personal para compartir.', 'describe-me', 'PERFIL COMPARTIBLE', BookOpen],
      ] as const,
    },
  }[lang];

  return (
    <section className="relative w-full overflow-hidden border-b border-[#B9D9F5] bg-[#C9E5FF] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal distance={18} duration={700}>
          <div className="mb-9 max-w-3xl">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#2878D0]">{copy.eyebrow}</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.03em] text-[#172B4D] sm:text-4xl">{copy.title}</h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[#647DA5]">{copy.subtitle}</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {copy.cards.map(([title, description, route, category, Icon], index) => (
            <ScrollReveal key={title} delay={index * 55} distance={16} duration={650}>
              <button
                type="button"
                onClick={() => onNavigate(route)}
                className="group relative flex min-h-[260px] h-full w-full flex-col overflow-hidden rounded-[22px] border border-[#A9CEF1] border-t-[3px] border-t-[#2878D0] bg-[#C9E5FF] p-6 text-left shadow-[0_10px_24px_rgba(23,54,111,0.08)] transition-all duration-300 hover:-translate-y-2 hover:border-[#F51B83] hover:border-t-[#F51B83] hover:bg-white hover:shadow-[0_18px_34px_rgba(23,54,111,0.15)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F51B83]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF0F7] text-sm font-extrabold text-[#F51B83] ring-1 ring-[#F8B4D3] transition duration-300 group-hover:bg-[#F51B83] group-hover:text-white">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="mt-5 inline-flex w-fit rounded-full border border-[#B9D9F5] bg-[#EAF4FF] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#2878D0]">
                  {category}
                </span>
                <span className="mt-3 flex items-center gap-2 text-lg font-extrabold leading-tight text-[#172B4D] transition-colors group-hover:text-[#2878D0]">
                  <Icon className="h-5 w-5 text-[#2878D0] transition-colors group-hover:text-[#F51B83]" />
                  {title}
                </span>
                <span className="mt-3 text-sm leading-6 text-[#647DA5]">{description}</span>
                <span className="mt-auto pt-5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#2878D0] transition-colors group-hover:text-[#F51B83]">
                  {copy.open} <span aria-hidden="true">→</span>
                </span>
              </button>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
