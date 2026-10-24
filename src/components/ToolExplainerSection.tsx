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
      ['Aurenstar Daily', 'A personalized daily message based on your zodiac sign.', 'daily-message', CalendarDays],
      ['Aureneffect', 'A real-time reading about the moment you are experiencing now.', 'aureneffect', Sparkles],
      ['Aurenstar Zodiac Calculator', 'Find your sun sign by entering your date of birth.', 'discover-sign', Compass],
      ['Aurenstar Dictionary', 'Simple explanations for astrology terms and ideas.', 'dicionario', BookOpen],
      ['Aurenstar Unfiltered', 'A playful, shareable profile created from your birth details.', 'describe-me', UserRound],
    ] as const },
    pt: { title: 'COMO A AURENSTAR PODE AJUDAR VOCÊ', subtitle: 'Cada espaço tem um propósito simples e uma forma prática de acompanhar o seu dia.', cards: [
      ['Aurenstar Daily', 'Uma mensagem diária personalizada com base no seu signo.', 'daily-message', CalendarDays],
      ['Aureneffect', 'Uma leitura em tempo real sobre o momento que você está vivendo.', 'aureneffect', Sparkles],
      ['Aurenstar Zodiac Calculator', 'Descubra seu signo solar informando sua data de nascimento.', 'discover-sign', Compass],
      ['Aurenstar Dictionary', 'Explicações simples para termos e ideias da astrologia.', 'dicionario', BookOpen],
      ['Aurenstar Unfiltered', 'Um perfil divertido e compartilhável criado com seus dados de nascimento.', 'describe-me', UserRound],
    ] as const },
    es: { title: 'CÓMO AURENSTAR PUEDE AYUDARTE', subtitle: 'Cada espacio tiene un propósito sencillo y una forma práctica de acompañar tu día.', cards: [
      ['Aurenstar Daily', 'Un mensaje diario personalizado según tu signo zodiacal.', 'daily-message', CalendarDays],
      ['Aureneffect', 'Una lectura en tiempo real sobre el momento que estás viviendo.', 'aureneffect', Sparkles],
      ['Aurenstar Zodiac Calculator', 'Descubre tu signo solar con tu fecha de nacimiento.', 'discover-sign', Compass],
      ['Aurenstar Dictionary', 'Explicaciones sencillas de términos e ideas de astrología.', 'dicionario', BookOpen],
      ['Aurenstar Unfiltered', 'Un perfil divertido y compartible creado con tus datos de nacimiento.', 'describe-me', UserRound],
    ] as const },
  }[lang];

  return (
    <section className="relative w-full overflow-hidden border-b border-[#D9E8F8] bg-[#C9E5FF] py-14 sm:py-20">
      <div className="pointer-events-none absolute -left-20 top-14 h-64 w-64 rounded-full bg-[#2878D0]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-8 h-72 w-72 rounded-full bg-[#F51B83]/10 blur-3xl" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollReveal distance={18} duration={700}>
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="font-extrabold text-sm sm:text-base tracking-[0.2em] uppercase text-[#172B4D]">{copy.title}</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#647DA5]">{copy.subtitle}</p>
            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-[#2878D0] via-[#17366F] to-[#F51B83]" />
            <p className="mx-auto mt-4 max-w-xl text-xs font-semibold uppercase tracking-[0.14em] text-[#2878D0]">{lang === 'pt' ? 'Escolha uma experiência e descubra como ela pode acompanhar você' : lang === 'es' ? 'Elige una experiencia y descubre cómo puede acompañarte' : 'Choose an experience and see how it can support you'}</p>
          </div>
        </ScrollReveal>
        <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {copy.cards.map(([title, description, route, Icon], index) => (
            <ScrollReveal key={title} delay={index * 45} distance={14} duration={650}>
              <button type="button" onClick={() => onNavigate(route)} className={`group relative block min-h-[285px] h-full w-full overflow-hidden rounded-2xl border border-[#D7E7F8] bg-gradient-to-br ${index % 2 === 0 ? 'from-white via-white to-[#F1F7FF]' : 'from-white via-white to-[#FBF0FA]'} p-5 text-left shadow-[0_8px_24px_rgba(23,54,111,0.07)] transition-all duration-300 hover:-translate-y-1 hover:border-[#2878D0]/60 hover:shadow-[0_16px_32px_rgba(23,54,111,0.14)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2878D0] sm:p-6`}>
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#2878D0] via-[#7C5CC4] to-[#F51B83] opacity-80 transition-opacity group-hover:opacity-100" />
                <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-[#2878D0]/[0.06] blur-xl transition-all duration-500 group-hover:scale-150 group-hover:bg-[#F51B83]/[0.10]" />
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#D6E8FA] bg-[#EEF6FF] text-[#2878D0] transition-all duration-300 group-hover:rotate-6 group-hover:border-[#F2C5DD] group-hover:bg-[#FCE7F2] group-hover:text-[#C21867]"><Icon className="h-5 w-5" /></span>
                  <span className="pt-1 text-[10px] font-extrabold tracking-[0.18em] text-[#A1B6D5]">0{index + 1}</span>
                </div>
                <h3 className="mt-4 text-[15px] font-extrabold leading-snug text-[#172B4D]">{title}</h3>
                <p className="mt-4 text-sm leading-[1.65] text-[#647DA5]">{description}</p>
                <span className="mt-7 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-[#2878D0] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#F51B83]">{lang === 'pt' ? 'Saiba mais' : lang === 'es' ? 'Saber más' : 'Learn more'} <span aria-hidden="true">→</span></span>
              </button>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

