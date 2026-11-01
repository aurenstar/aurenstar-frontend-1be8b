import React from 'react';
import { BookOpen, CalendarDays, Compass, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ScrollReveal } from './ScrollReveal';

type ToolKey = 'daily-message' | 'aureneffect' | 'discover-sign' | 'describe-me';

interface ToolExplainerSectionProps { onNavigate: (tool: ToolKey) => void; }

const accents = ['#2B9FC0', '#68469B', '#E78AAE', '#2878D0'];

export const ToolExplainerSection: React.FC<ToolExplainerSectionProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const lang = language || 'en';
  const copy = {
    en: { eyebrow: 'CHOOSE YOUR NEXT STEP', title: 'One experience for every moment.', subtitle: 'Start with the tool that best matches what you are looking for right now.', open: 'Open tool', cards: [['Daily guidance', 'Aurendaily', 'Receive personalized guidance for your day.', 'daily-message', CalendarDays, 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=85'], ['Real-time insights', 'Aureneffect', 'Understand the moment you are experiencing now.', 'aureneffect', Sparkles, 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=85'], ['Discover your sign', 'Sign Calculator', 'Discover your sun sign from your date of birth.', 'discover-sign', Compass, 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=900&q=85'], ['Shareable profile', 'Aurenstar Unfiltered', 'Create a personal description made to share.', 'describe-me', BookOpen, 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=85']] as const },
    pt: { eyebrow: 'ESCOLHA O SEU PRÓXIMO PASSO', title: 'Uma experiência para cada momento.', subtitle: 'Comece pela ferramenta que melhor combina com o que você procura agora.', open: 'Abrir ferramenta', cards: [['Orientação diária', 'Aurendaily', 'Receba orientações personalizadas para o seu dia.', 'daily-message', CalendarDays, 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=85'], ['Informações em tempo real', 'Efeito Auren', 'Compreenda o momento que você está vivendo agora.', 'aureneffect', Sparkles, 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=85'], ['Descubra seu signo', 'Sign Calculator', 'Descubra seu signo solar a partir da sua data de nascimento.', 'discover-sign', Compass, 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=900&q=85'], ['Perfil compartilhável', 'Aurenstar Sem Filtro', 'Crie uma descrição pessoal feita para compartilhar.', 'describe-me', BookOpen, 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=85']] as const },
    es: { eyebrow: 'ELIGE TU PRÓXIMO PASO', title: 'Una experiencia para cada momento.', subtitle: 'Empieza con la herramienta que mejor combina con lo que buscas ahora.', open: 'Abrir herramienta', cards: [['Orientación diaria', 'Aurendaily', 'Recibe orientación personalizada para tu día.', 'daily-message', CalendarDays, 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=85'], ['Información en tiempo real', 'Aureneffect', 'Comprende el momento que estás viviendo ahora.', 'aureneffect', Sparkles, 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=85'], ['Descubre tu signo', 'Sign Calculator', 'Descubre tu signo solar con tu fecha de nacimiento.', 'discover-sign', Compass, 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=900&q=85'], ['Perfil para compartir', 'Aurenstar Sin Filtro', 'Crea una descripción personal para compartir.', 'describe-me', BookOpen, 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=85']] as const },
  }[lang];

  return <section className="relative w-full overflow-hidden border-b border-[#B9D9F5] bg-[#C9E5FF] py-16 sm:py-20">
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <ScrollReveal distance={18} duration={700}><div className="mb-10 max-w-3xl">
        <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#2878D0]">{copy.eyebrow}</p>
        <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[#172B4D] sm:text-4xl">{copy.title}</h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#647DA5]">{copy.subtitle}</p>
      </div></ScrollReveal>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {copy.cards.map(([category, title, description, route, Icon, image], index) => <ScrollReveal key={title} delay={index * 55} distance={16} duration={650}>
          <button type="button" onClick={() => onNavigate(route)} className="group relative flex h-full min-h-[420px] w-full flex-col overflow-hidden rounded-[24px] border border-[#B9D9F5] bg-white text-left shadow-[0_16px_28px_rgba(23,54,111,0.10)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_22px_38px_rgba(23,54,111,0.16)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F51B83]">
              <span className="relative block h-[184px] shrink-0 overflow-hidden rounded-t-[24px] bg-white">
              <span className="absolute inset-x-0 top-0 h-[132px] rounded-t-[24px]" style={{ backgroundColor: accents[index] }} />
              <span className="absolute -left-10 -top-16 h-36 w-36 rounded-full bg-white/20 transition-transform duration-500 group-hover:scale-110" />
              <span className="absolute -right-8 top-8 h-32 w-32 rounded-full bg-white/15 transition-transform duration-500 group-hover:translate-x-2" />
              <span className="absolute inset-x-5 top-5 h-[124px] overflow-hidden rounded-[18px] border border-white/80 bg-white/80 shadow-[0_10px_20px_rgba(23,54,111,0.14)] transition-transform duration-500 group-hover:-translate-y-1">
                <img src={image} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <span className="absolute inset-0 bg-white/10" />
              </span>
            </span>
            <span className="flex flex-1 flex-col px-6 pb-6 pt-6">
              <span className="inline-flex w-fit rounded-full bg-[#E7F1FF] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#2878D0]">{category}</span>
              <span className="mt-3 text-[20px] font-extrabold leading-tight text-[#172B4D] transition-colors duration-300 group-hover:text-[#2878D0]">{title}</span>
              <span className="mt-3 text-[15px] leading-7 text-[#647DA5]">{description}</span>
              <span className="mt-auto inline-flex items-center gap-2 pt-7 text-xs font-extrabold uppercase tracking-[0.14em] text-[#2878D0] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#F51B83]">{copy.open} <span aria-hidden="true">→</span></span>
            </span>
          </button>
        </ScrollReveal>)}
      </div>
    </div>
  </section>;
};

