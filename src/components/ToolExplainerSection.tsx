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
        ['Aurendaily', 'Receive personalized guidance for your day.', 'daily-message', 'DAILY GUIDANCE', CalendarDays, '#2B9FC0'],
        ['Aureneffect', 'Understand the moment you are experiencing now.', 'aureneffect', 'REAL-TIME INSIGHTS', Sparkles, '#68469B'],
        ['Sign Calculator', 'Discover your sun sign from your date of birth.', 'discover-sign', 'DISCOVER YOUR SIGN', Compass, '#ED8CB2'],
        ['Aurenstar Unfiltered', 'Create a personal description made to share.', 'describe-me', 'SHAREABLE PROFILE', BookOpen, '#2878D0'],
      ] as const,
    },
    pt: {
      eyebrow: 'ESCOLHA O SEU PRÓXIMO PASSO',
      title: 'Uma experiência para cada momento',
      subtitle: 'Comece pela ferramenta que melhor combina com o que você procura agora.',
      open: 'Abrir ferramenta',
      cards: [
        ['Aurendaily', 'Receba orientações personalizadas para o seu dia.', 'daily-message', 'ORIENTAÇÃO DIÁRIA', CalendarDays, '#2B9FC0'],
        ['Aureneffect', 'Compreenda o momento que você está vivendo agora.', 'aureneffect', 'INSIGHTS EM TEMPO REAL', Sparkles, '#68469B'],
        ['Sign Calculator', 'Descubra seu signo solar a partir da sua data de nascimento.', 'discover-sign', 'DESCUBRA SEU SIGNO', Compass, '#ED8CB2'],
        ['Aurenstar Unfiltered', 'Crie uma descrição pessoal feita para compartilhar.', 'describe-me', 'PERFIL COMPARTILHÁVEL', BookOpen, '#2878D0'],
      ] as const,
    },
    es: {
      eyebrow: 'ELIGE TU PRÓXIMO PASO',
      title: 'Una experiencia para cada momento',
      subtitle: 'Empieza con la herramienta que mejor combina con lo que buscas ahora.',
      open: 'Abrir herramienta',
      cards: [
        ['Aurendaily', 'Recibe orientación personalizada para tu día.', 'daily-message', 'GUÍA DIARIA', CalendarDays, '#2B9FC0'],
        ['Aureneffect', 'Comprende el momento que estás viviendo ahora.', 'aureneffect', 'TIEMPO REAL', Sparkles, '#68469B'],
        ['Sign Calculator', 'Descubre tu signo solar con tu fecha de nacimiento.', 'discover-sign', 'DESCUBRE TU SIGNO', Compass, '#ED8CB2'],
        ['Aurenstar Unfiltered', 'Crea una descripción personal para compartir.', 'describe-me', 'PERFIL COMPARTIBLE', BookOpen, '#2878D0'],
      ] as const,
    },
  }[lang];

  return (
    <section className="relative w-full overflow-hidden border-b border-[#B9D9F5] bg-[#C9E5FF] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal distance={18} duration={700}>
          <div className="mb-10 max-w-3xl">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#2878D0]">{copy.eyebrow}</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.03em] text-[#172B4D] sm:text-4xl">{copy.title}</h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[#647DA5]">{copy.subtitle}</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {copy.cards.map(([title, description, route, category, Icon, accent], index) => (
            <ScrollReveal key={title} delay={index * 55} distance={16} duration={650}>
              <button
                type="button"
                onClick={() => onNavigate(route)}
                className="group flex h-full min-h-[350px] w-full flex-col overflow-hidden rounded-[24px] border border-[#B9D9F5] bg-white text-left shadow-[0_12px_26px_rgba(23,54,111,0.08)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_36px_rgba(23,54,111,0.16)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F51B83]"
              >
                <span className="relative block h-[118px] shrink-0 overflow-hidden rounded-t-[23px]" style={{ backgroundColor: accent }}>
                  <span className="absolute -left-5 -top-10 h-28 w-28 rounded-full bg-white/15" />
                  <span className="absolute -right-8 top-5 h-24 w-24 rounded-full bg-white/15" />
                  <span className="absolute bottom-[-22px] left-5 flex h-[76px] w-[76px] items-center justify-center rounded-[22px] border-4 border-white bg-white text-[#2878D0] shadow-[0_8px_18px_rgba(23,54,111,0.18)] transition-transform duration-300 group-hover:scale-105">
                    <Icon className="h-8 w-8" />
                  </span>
                </span>
                <span className="flex flex-1 flex-col p-5 pt-8">
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#2878D0]">{category}</span>
                  <span className="mt-2 text-xl font-extrabold leading-tight text-[#172B4D] transition-colors group-hover:text-[#2878D0]">{title}</span>
                  <span className="mt-3 text-sm leading-6 text-[#647DA5]">{description}</span>
                  <span className="mt-auto pt-6 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#2878D0] transition-colors group-hover:text-[#F51B83]">
                    {copy.open} <span aria-hidden="true">→</span>
                  </span>
                </span>
              </button>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
