import React from 'react';
import { BookOpen, CalendarDays, Compass, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ScrollReveal } from './ScrollReveal';
import { onPlainClick } from '../utils/links';

type ToolKey = 'daily-message' | 'aureneffect' | 'discover-sign' | 'describe-me';

interface ToolExplainerSectionProps { onNavigate: (tool: ToolKey) => void; }

const accents = ['#2B9FC0', '#68469B', '#E78AAE', '#2878D0'];

// Real URLs so search engines can follow the cards; a normal click still navigates in-app.
const TOOL_PATHS: Record<ToolKey, string> = {
  'daily-message': '/daily-message',
  aureneffect: '/aureneffect',
  'discover-sign': '/discover-sign',
  'describe-me': '/descreva-me',
};

export const ToolExplainerSection: React.FC<ToolExplainerSectionProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const lang = language || 'en';
  const copy = {
    en: { eyebrow: 'CHOOSE YOUR NEXT STEP', title: 'One experience for every moment.', subtitle: 'Start with the tool that best matches what you are looking for right now.', open: 'Open tool', cards: [['Daily guidance', 'Aurendaily', 'Receive personalized guidance for your day.', 'daily-message', CalendarDays, '/assets/tools/tool-daily.svg'], ['Real-time insights', 'Aureneffect', 'Understand the moment you are experiencing now.', 'aureneffect', Sparkles, '/assets/tools/tool-aureneffect.svg'], ['Discover your sign', 'Sign Calculator', 'Discover your sun sign from your date of birth.', 'discover-sign', Compass, '/assets/tools/tool-signcalc.svg'], ['Shareable profile', 'Aurenstar Unfiltered', 'Create a personal description made to share.', 'describe-me', BookOpen, '/assets/tools/tool-unfiltered.svg']] as const },
    pt: { eyebrow: 'ESCOLHA O SEU PRÓXIMO PASSO', title: 'Uma experiência para cada momento.', subtitle: 'Comece pela ferramenta que melhor combina com o que você procura agora.', open: 'Abrir ferramenta', cards: [['Orientação diária', 'Aurendaily', 'Receba orientações personalizadas para o seu dia.', 'daily-message', CalendarDays, '/assets/tools/tool-daily.svg'], ['Informações em tempo real', 'Efeito Auren', 'Compreenda o momento que você está vivendo agora.', 'aureneffect', Sparkles, '/assets/tools/tool-aureneffect.svg'], ['Descubra seu signo', 'Sign Calculator', 'Descubra seu signo solar a partir da sua data de nascimento.', 'discover-sign', Compass, '/assets/tools/tool-signcalc.svg'], ['Perfil compartilhável', 'Aurenstar Sem Filtro', 'Crie uma descrição pessoal feita para compartilhar.', 'describe-me', BookOpen, '/assets/tools/tool-unfiltered.svg']] as const },
    es: { eyebrow: 'ELIGE TU PRÓXIMO PASO', title: 'Una experiencia para cada momento.', subtitle: 'Empieza con la herramienta que mejor combina con lo que buscas ahora.', open: 'Abrir herramienta', cards: [['Orientación diaria', 'Aurendaily', 'Recibe orientación personalizada para tu día.', 'daily-message', CalendarDays, '/assets/tools/tool-daily.svg'], ['Información en tiempo real', 'Aureneffect', 'Comprende el momento que estás viviendo ahora.', 'aureneffect', Sparkles, '/assets/tools/tool-aureneffect.svg'], ['Descubre tu signo', 'Sign Calculator', 'Descubre tu signo solar con tu fecha de nacimiento.', 'discover-sign', Compass, '/assets/tools/tool-signcalc.svg'], ['Perfil para compartir', 'Aurenstar Sin Filtro', 'Crea una descripción personal para compartir.', 'describe-me', BookOpen, '/assets/tools/tool-unfiltered.svg']] as const },
  }[lang];

  return <section className="relative w-full overflow-hidden border-b border-[#B9D9F5] bg-[#C9E5FF] py-16 sm:py-20">
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <ScrollReveal distance={18} duration={700}><div className="mb-10 max-w-3xl">
        <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#2878D0]">{copy.eyebrow}</p>
        <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[#172B4D] sm:text-4xl">{copy.title}</h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#647DA5]">{copy.subtitle}</p>
      </div></ScrollReveal>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {copy.cards.map(([, title, description, route, , image], index) => <ScrollReveal key={title} delay={index * 55} distance={16} duration={650} className="h-full">
          <a
            href={TOOL_PATHS[route]}
            onClick={onPlainClick(() => onNavigate(route))}
            className="group relative flex h-full w-full flex-col overflow-hidden rounded-[24px] bg-white text-left shadow-[0_10px_26px_rgba(23,54,111,0.08)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_24px_44px_rgba(23,54,111,0.18)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F51B83]"
          >
            {/* Colored tab with cut bottom corners, sitting behind the picture */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 block h-[88px]"
              style={{
                backgroundColor: accents[index],
                clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 25px), calc(100% - 24px) 100%, 24px 100%, 0 calc(100% - 25px))',
              }}
            />
            {/* Picture */}
            <span className="relative mx-6 mt-6 block h-[134px] shrink-0 overflow-hidden rounded-[18px] bg-white/40">
              <img src={image} alt="" width={520} height={280} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </span>
            <span className="flex flex-1 flex-col px-6 pb-8 pt-7">
              <span className="text-[21px] font-semibold leading-snug text-[#172B4D] transition-colors duration-300 group-hover:text-[#2878D0]">{title}</span>
              <span className="mt-3 text-[14px] leading-6 text-[#647DA5]">{description}</span>
            </span>
          </a>
        </ScrollReveal>)}
      </div>
    </div>
  </section>;
};

