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
    <section className="relative w-full overflow-hidden border-b border-[#B9D9F5] bg-[#C9E5FF] py-14 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollReveal distance={18} duration={700}>
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="font-extrabold text-sm sm:text-base tracking-[0.2em] uppercase text-[#172B4D]">{copy.title}</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#647DA5]">{copy.subtitle}</p>
            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-[#2878D0]" />
            <p className="mx-auto mt-4 max-w-xl text-xs font-semibold uppercase tracking-[0.14em] text-[#2878D0]">{lang === 'pt' ? 'Escolha uma experiência e descubra como ela pode acompanhar você' : lang === 'es' ? 'Elige una experiencia y descubre cómo puede acompañarte' : 'Choose an experience and see how it can support you'}</p>
          </div>
        </ScrollReveal>
        <div className="relative grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {copy.cards.map(([title, description, route, Icon], index) => (
            <ScrollReveal key={title} delay={index * 45} distance={14} duration={650}>
              <button type="button" onClick={() => onNavigate(route)} className="group relative flex min-h-[300px] h-full w-full flex-col overflow-hidden rounded-[24px] border border-[#B7D8F5] bg-white text-left shadow-[0_10px_22px_rgba(23,54,111,0.10)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_18px_34px_rgba(23,54,111,0.16)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F51B83]">
                <div className={`relative h-[92px] shrink-0 overflow-hidden px-5 pt-4 ${['bg-[#2878D0]','bg-[#17366F]','bg-[#6B55B7]','bg-[#F51B83]','bg-[#E58AAE]'][index]}`}>
                  <div className="absolute -right-5 -top-8 h-24 w-24 rounded-full border-[14px] border-white/15 transition-transform duration-500 group-hover:scale-125" />
                  <div className="relative flex items-start justify-between">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/95 text-[#2878D0] shadow-sm transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105"><Icon className="h-5 w-5" /></span>
                    <span className="text-[11px] font-extrabold tracking-[0.18em] text-white/90">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <span className="mb-3 inline-flex w-fit rounded-full bg-[#E7F1FF] px-3 py-1 text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#2878D0]">{index === 0 ? (lang === 'pt' ? 'ORIENTAÇÃO DIÁRIA' : 'DAILY GUIDANCE') : index === 1 ? (lang === 'pt' ? 'TEMPO REAL' : 'REAL TIME') : index === 2 ? (lang === 'pt' ? 'SEU SIGNO' : 'YOUR SIGN') : index === 3 ? (lang === 'pt' ? 'DICIONÁRIO' : 'DICTIONARY') : (lang === 'pt' ? 'PERFIL' : 'PROFILE')}</span>
                  <h3 className="text-[15px] font-extrabold leading-snug text-[#172B4D] transition-colors duration-300 group-hover:text-[#2878D0]">{title}</h3>
                  <p className="mt-3 text-sm leading-[1.6] text-[#647DA5]">{description}</p>
                  <span className="mt-auto pt-5 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-[#2878D0] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#F51B83]">{lang === 'pt' ? 'Abrir ferramenta' : lang === 'es' ? 'Abrir herramienta' : 'Open tool'} <span aria-hidden="true">→</span></span>
                </div>
              </button>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

