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
      ['Aurenstar Daily', 'Get a short message to start your day based on your sign. Example: a suggestion to pause before replying to someone.', 'daily-message', CalendarDays],
      ['Aureneffect', 'Understand the moment you are living now. Example: if you feel tired or restless, receive a reflection and a simple suggestion.', 'aureneffect', Sparkles],
      ['Aurenstar Zodiac Calculator', 'Discover your sun sign with your birth date. Example: June 2 reveals Gemini.', 'discover-sign', Compass],
      ['Aurenstar Dictionary', 'Look up astrology terms in simple language. Example: learn what “rising sign” means in an everyday situation.', 'dicionario', BookOpen],
      ['Aurenstar Unfiltered', 'Create a fun profile using your name and birth details. Then share the result with anyone you like.', 'describe-me', UserRound],
    ] as const },
    pt: { title: 'COMO A AURENSTAR PODE AJUDAR VOCÊ', subtitle: 'Cada espaço tem um propósito simples e uma forma prática de acompanhar o seu dia.', cards: [
      ['Aurenstar Daily', 'Receba uma mensagem curta para começar o dia de acordo com o seu signo. Exemplo: uma sugestão para fazer uma pausa antes de responder alguém.', 'daily-message', CalendarDays],
      ['Aureneffect', 'Entenda melhor o momento que você está vivendo agora. Exemplo: se estiver cansado ou inquieto, receba uma reflexão e uma sugestão simples.', 'aureneffect', Sparkles],
      ['Aurenstar Zodiac Calculator', 'Descubra seu signo solar informando a data de nascimento. Exemplo: 2 de junho revela Gêmeos.', 'discover-sign', Compass],
      ['Aurenstar Dictionary', 'Consulte termos da astrologia com explicações fáceis. Exemplo: veja o que “ascendente” significa em uma situação do dia a dia.', 'dicionario', BookOpen],
      ['Aurenstar Unfiltered', 'Crie um perfil divertido usando seu nome e seus dados de nascimento. Depois, compartilhe o resultado com quem quiser.', 'describe-me', UserRound],
    ] as const },
    es: { title: 'CÓMO AURENSTAR PUEDE AYUDARTE', subtitle: 'Cada espacio tiene un propósito sencillo y una forma práctica de acompañar tu día.', cards: [
      ['Aurenstar Daily', 'Recibe un mensaje corto para empezar el día según tu signo. Ejemplo: una sugerencia para hacer una pausa antes de responder.', 'daily-message', CalendarDays],
      ['Aureneffect', 'Comprende mejor el momento que estás viviendo. Ejemplo: si estás cansado o inquieto, recibe una reflexión y una sugerencia sencilla.', 'aureneffect', Sparkles],
      ['Aurenstar Zodiac Calculator', 'Descubre tu signo solar con tu fecha de nacimiento. Ejemplo: el 2 de junio revela Géminis.', 'discover-sign', Compass],
      ['Aurenstar Dictionary', 'Consulta términos de astrología con explicaciones fáciles. Ejemplo: descubre qué significa “ascendente” en una situación cotidiana.', 'dicionario', BookOpen],
      ['Aurenstar Unfiltered', 'Crea un perfil divertido con tu nombre y tus datos de nacimiento. Después, compártelo con quien quieras.', 'describe-me', UserRound],
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
              <button type="button" onClick={() => onNavigate(route)} className="group relative block min-h-[360px] h-full w-full overflow-hidden rounded-2xl border border-[#D7E7F8] bg-[#FFFFFF] p-5 text-left shadow-[0_8px_24px_rgba(23,54,111,0.07)] transition-all duration-300 hover:-translate-y-1 hover:border-[#2878D0]/60 hover:shadow-[0_16px_32px_rgba(23,54,111,0.14)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2878D0] sm:p-6">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#2878D0] via-[#7C5CC4] to-[#F51B83] opacity-80 transition-opacity group-hover:opacity-100" />
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#D6E8FA] bg-[#EEF6FF] text-[#2878D0] transition-colors duration-300 group-hover:border-[#F2C5DD] group-hover:bg-[#FCE7F2] group-hover:text-[#C21867]"><Icon className="h-5 w-5" /></span>
                  <span className="pt-1 text-[10px] font-extrabold tracking-[0.18em] text-[#A1B6D5]">0{index + 1}</span>
                </div>
                <h3 className="mt-4 text-[15px] font-extrabold leading-snug text-[#172B4D]">{title}</h3>
                <p className="mt-3 text-sm leading-[1.7] text-[#647DA5]">{description}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#7C96BA]"><span className="h-1.5 w-1.5 rounded-full bg-[#F51B83]" />{lang === 'pt' ? 'Exemplo prático' : lang === 'es' ? 'Ejemplo práctico' : 'Practical example'}</span>
                <span className="mt-4 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-[#2878D0] transition-colors group-hover:text-[#F51B83]">{lang === 'pt' ? 'Saiba mais' : lang === 'es' ? 'Saber más' : 'Learn more'} <span aria-hidden="true">→</span></span>
              </button>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

