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
    en: {
      title: 'EXPLORE AURENSTAR TOOLS',
      subtitle: 'Choose the experience that fits what you want to discover today.',
      cards: [
        ['Aurenstar Daily', 'Receive a personalized astrology message for your day.', 'daily-message', CalendarDays],
        ['Aureneffect', 'Understand the energy of the exact moment you ask for your reading.', 'aureneffect', Sparkles],
        ['Aurenstar Zodiac Calculator', 'Discover your sun sign from your birth date.', 'discover-sign', Compass],
        ['Aurenstar Dictionary', 'Learn astrology terms through clear explanations and examples.', 'dicionario', BookOpen],
        ['Aurenstar Unfiltered', 'Create a playful, personal description made to share.', 'describe-me', UserRound],
      ] as const,
    },
    pt: {
      title: 'EXPLORE AS FERRAMENTAS AURENSTAR',
      subtitle: 'Escolha a experiência que combina com o que você quer descobrir hoje.',
      cards: [
        ['Aurenstar Daily', 'Receba uma mensagem astrológica personalizada para o seu dia.', 'daily-message', CalendarDays],
        ['Aureneffect', 'Entenda a energia do momento exato em que você faz a consulta.', 'aureneffect', Sparkles],
        ['Aurenstar Zodiac Calculator', 'Descubra seu signo solar pela data de nascimento.', 'discover-sign', Compass],
        ['Aurenstar Dictionary', 'Aprenda termos de astrologia com explicações claras e exemplos.', 'dicionario', BookOpen],
        ['Aurenstar Unfiltered', 'Crie uma descrição pessoal, divertida e feita para compartilhar.', 'describe-me', UserRound],
      ] as const,
    },
    es: {
      title: 'EXPLORA LAS HERRAMIENTAS AURENSTAR',
      subtitle: 'Elige la experiencia que combina con lo que quieres descubrir hoy.',
      cards: [
        ['Aurenstar Daily', 'Recibe un mensaje astrológico personalizado para tu día.', 'daily-message', CalendarDays],
        ['Aureneffect', 'Comprende la energía del momento exacto de tu consulta.', 'aureneffect', Sparkles],
        ['Aurenstar Zodiac Calculator', 'Descubre tu signo solar con tu fecha de nacimiento.', 'discover-sign', Compass],
        ['Aurenstar Dictionary', 'Aprende términos de astrología con explicaciones claras y ejemplos.', 'dicionario', BookOpen],
        ['Aurenstar Unfiltered', 'Crea una descripción personal, divertida y fácil de compartir.', 'describe-me', UserRound],
      ] as const,
    },
  }[lang];

  return (
    <section className="w-full bg-[#C9E5FF] py-10 sm:py-12 border-b border-[#D9E8F8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollReveal distance={18} duration={700}>
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="font-extrabold text-sm sm:text-base tracking-[0.2em] uppercase text-[#172B4D]">{copy.title}</h2>
            <p className="mt-2 text-sm text-[#647DA5]">{copy.subtitle}</p>
            <div className="w-12 h-1 bg-gradient-to-r from-[#2878D0] via-[#17366F] to-[#F51B83] rounded-full mx-auto mt-2.5" />
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {copy.cards.map(([title, description, route, Icon], index) => (
            <ScrollReveal key={route} delay={index * 45} distance={14} duration={650}>
              <button
                type="button"
                onClick={() => onNavigate(route)}
                className="group h-full w-full text-left rounded-2xl bg-white border border-[#D9E8F8] p-4 sm:p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2878D0]"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#E4F1FF] text-[#2878D0] group-hover:bg-[#2878D0] group-hover:text-white transition-colors">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-3 text-sm font-extrabold leading-snug text-[#172B4D]">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-[#647DA5]">{description}</p>
                <span className="mt-3 inline-block text-xs font-bold text-[#2878D0]">{lang === 'pt' ? 'Explorar →' : lang === 'es' ? 'Explorar →' : 'Explore →'}</span>
              </button>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

