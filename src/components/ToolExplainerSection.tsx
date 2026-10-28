import React from 'react';
import { BookOpen, CalendarDays, Compass, Sparkles, UserRound } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ScrollReveal } from './ScrollReveal';

type ToolKey = 'daily-message' | 'aureneffect' | 'discover-sign' | 'dicionario' | 'describe-me';

interface ToolExplainerSectionProps {
  onNavigate: (tool: ToolKey) => void;
}

export const ToolExplainerSection: React.FC<ToolExplainerSectionProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const lang = language || 'en';
  const copy = {
    en: { title: 'HOW AURENSTAR CAN HELP YOU', subtitle: 'Each space has a simple purpose and practical way to support your day.', cards: [
      ['Aurendaily', 'A personalized daily message based on your zodiac sign.', 'daily-message', CalendarDays],
      ['Aureneffect', 'A real-time reading about the moment you are experiencing now.', 'aureneffect', Sparkles],
      ['Sign Calculator', 'Find your sun sign by entering your date of birth.', 'discover-sign', Compass],
      ['Aurenstar Dictionary', 'Simple explanations for astrology terms and ideas.', 'dicionario', BookOpen],
      ['Aurenstar Unfiltered', 'A playful, shareable profile created from your birth details.', 'describe-me', UserRound],
    ] as const },
    pt: { title: 'COMO A AURENSTAR PODE AJUDAR VOCÊ', subtitle: 'Cada espaço tem um propósito simples e uma forma prática de acompanhar o seu dia.', cards: [
      ['Aurendaily', 'Uma mensagem diária personalizada com base no seu signo.', 'daily-message', CalendarDays],
      ['Aureneffect', 'Uma leitura em tempo real sobre o momento que você está vivendo.', 'aureneffect', Sparkles],
      ['Sign Calculator', 'Descubra seu signo solar informando sua data de nascimento.', 'discover-sign', Compass],
      ['Aurenstar Dictionary', 'Explicações simples para termos e ideias da astrologia.', 'dicionario', BookOpen],
      ['Aurenstar Unfiltered', 'Um perfil divertido e compartilhável criado com seus dados de nascimento.', 'describe-me', UserRound],
    ] as const },
    es: { title: 'CÓMO AURENSTAR PUEDE AYUDARTE', subtitle: 'Cada espacio tiene un propósito sencillo y una forma práctica de acompañar tu día.', cards: [
      ['Aurendaily', 'Un mensaje diario personalizado según tu signo zodiacal.', 'daily-message', CalendarDays],
      ['Aureneffect', 'Una lectura en tiempo real sobre el momento que estás viviendo.', 'aureneffect', Sparkles],
      ['Sign Calculator', 'Descubre tu signo solar con tu fecha de nacimiento.', 'discover-sign', Compass],
      ['Aurenstar Dictionary', 'Explicaciones sencillas de términos e ideas de astrología.', 'dicionario', BookOpen],
      ['Aurenstar Unfiltered', 'Un perfil divertido y compartible creado con tus datos de nacimiento.', 'describe-me', UserRound],
    ] as const },
  }[lang];

  return (
    <section className="relative w-full overflow-hidden border-b border-[#B8D8F5] bg-[#C9E5FF] py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal distance={18} duration={700}>
          <div className="mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#2878D0]">{copy.title}</p>
              <h2 className="mt-3 max-w-2xl text-3xl font-extrabold leading-tight text-[#172B4D] sm:text-4xl">
                {lang === 'pt' ? 'Uma experiência para cada momento.' : lang === 'es' ? 'Una experiencia para cada momento.' : 'One experience for every moment.'}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#647DA5]">{copy.subtitle}</p>
            </div>
            <span className="hidden rounded-full border border-[#B8D8F5] bg-white/80 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#2878D0] sm:inline-flex">
              {lang === 'pt' ? 'Escolha seu próximo passo' : lang === 'es' ? 'Elige tu próximo paso' : 'Choose your next step'}
            </span>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {copy.cards.map(([title, description, route, Icon], index) => (
            <ScrollReveal key={title} delay={index * 55} distance={16} duration={650}>
              <button type="button" onClick={() => onNavigate(route)} className="group relative flex min-h-[245px] h-full w-full flex-col overflow-hidden rounded-3xl border border-[#B8D8F5] bg-white p-6 text-left shadow-[0_10px_26px_rgba(23,54,111,0.08)] transition-all duration-300 hover:-translate-y-2 hover:border-[#F51B83]/60 hover:shadow-[0_18px_34px_rgba(23,54,111,0.15)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2878D0]">
                <div className="absolute left-0 top-0 h-1.5 w-16 rounded-br-full bg-[#2878D0] transition-all duration-300 group-hover:w-full group-hover:bg-[#F51B83]" />
                <div className="flex items-start justify-between">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#CFE4FA] bg-[#EEF6FF] text-[#2878D0] transition-all duration-300 group-hover:border-[#F8B7D5] group-hover:bg-[#FFF0F7] group-hover:text-[#F51B83]"><Icon className="h-6 w-6" /></span>
                  <span className="text-xs font-extrabold tracking-[0.18em] text-[#A1B6D5]">{String(index + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="mt-5 text-lg font-extrabold leading-snug text-[#172B4D] group-hover:text-[#2878D0]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#647DA5]">{description}</p>
                <span className="mt-auto inline-flex items-center gap-2 pt-5 text-xs font-extrabold uppercase tracking-[0.14em] text-[#2878D0] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#F51B83]">{lang === 'pt' ? 'Explorar' : lang === 'es' ? 'Explorar' : 'Explore'} <span aria-hidden="true">→</span></span>
              </button>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

