import React from 'react';
import { Sun, Star, Compass, Moon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ScrollReveal } from './ScrollReveal';

// Official Aurenstar brand avatar SVG with design system gradient and celestial star
const AURENSTAR_AVATAR = '/aurenstar-avatar.png';

interface AboutAurenstarSectionProps {
  onOpenCard?: (section: string) => void;
}

export const AboutAurenstarSection: React.FC<AboutAurenstarSectionProps> = ({ onOpenCard }) => {
  const { language } = useLanguage();
  const lang = (language || 'pt') as 'pt' | 'en' | 'es';

  const content = {
    en: {
      title: 'ABOUT AURENSTAR',
      item1: {
        category: 'PLATFORM',
        categoryColor: 'bg-[#2878D0] text-white',
        title: 'What is Aurenstar?',
        p1: 'A dedicated space designed to deliver your personalized ',
        bold: 'daily zodiac message',
        p2: ', bridging ancient celestial wisdom with thoughtful daily guidance.',
        footerRole: 'Astrology',
      },
      item2: {
        category: 'METHOD',
        categoryColor: 'bg-[#17366F] text-white',
        title: 'How It Works',
        p1: 'Select your star sign above. Our approach translates cosmic rhythms into ',
        bold: "today's star sign guidance",
        p2: ' carefully tailored for you.',
        footerRole: 'Insights',
      },
      item3: {
        category: 'MISSION',
        categoryColor: 'bg-[#F51B83] text-white',
        title: 'Our Mission',
        p1: 'Helping people connect with their inner cosmos through clarity, comfort, and direction with a ',
        bold: 'sun sign daily message',
        p2: '.',
        footerRole: 'Purpose',
      },
      item4: {
        category: 'DAILY GUIDANCE',
        categoryColor: 'bg-[#2878D0] text-white',
        title: 'Daily Guidance',
        p1: 'Reading your ',
        bold: 'daily horoscope quote',
        p2: ' aligns your energy and brings peace, helping you navigate every day with clear intention.',
        footerRole: 'Reflection',
      },
    },
    pt: {
      title: 'SOBRE A AURENSTAR',
      item1: {
        category: 'PLATAFORMA',
        categoryColor: 'bg-[#2878D0] text-white',
        title: 'O que é a Aurenstar?',
        p1: 'Um espaço acolhedor feito para entregar a sua ',
        bold: 'mensagem diária do signo',
        p2: ', unindo a sabedoria das estrelas com orientações gentis para o seu dia.',
        footerRole: 'Astrologia',
      },
      item2: {
        category: 'COMO FUNCIONA',
        categoryColor: 'bg-[#17366F] text-white',
        title: 'Como Funciona',
        p1: 'Basta escolher o seu signo acima. Traduzimos os ritmos cósmicos em ',
        bold: 'orientações do seu signo para hoje',
        p2: ' sob medida para você.',
        footerRole: 'Orientação',
      },
      item3: {
        category: 'NOSSA MISSÃO',
        categoryColor: 'bg-[#F51B83] text-white',
        title: 'Nossa Missão',
        p1: 'Ajudar você a se conectar com sua paz interior através de conforto e clareza com uma ',
        bold: 'mensagem diária do seu signo',
        p2: '.',
        footerRole: 'Propósito',
      },
      item4: {
        category: 'GUIA DIÁRIO',
        categoryColor: 'bg-[#2878D0] text-white',
        title: 'Orientação Diária',
        p1: 'Ler o seu ',
        bold: 'conselho do horóscopo do dia',
        p2: ' alinha sua energia e traz serenidade para viver cada momento com tranquilidade.',
        footerRole: 'Reflexão',
      },
    },
    es: {
      title: 'SOBRE AURENSTAR',
      item1: {
        category: 'PLATAFORMA',
        categoryColor: 'bg-[#2878D0] text-white',
        title: '¿Qué es Aurenstar?',
        p1: 'Una plataforma dedicada a brindarte tu ',
        bold: 'mensaje diario del zodíaco',
        p2: ', uniendo la sabiduría de las estrellas con serenidad y guía para ti.',
        footerRole: 'Astrología',
      },
      item2: {
        category: 'CÓMO FUNCIONA',
        categoryColor: 'bg-[#17366F] text-white',
        title: 'Cómo Funciona',
        p1: 'Selecciona tu signo arriba. Traducimos los ritmos cósmicos en ',
        bold: 'orientaciones de tu signo para hoy',
        p2: ' pensadas para ti.',
        footerRole: 'Orientación',
      },
      item3: {
        category: 'NUESTRA MISIÓN',
        categoryColor: 'bg-[#F51B83] text-white',
        title: 'Nuestra Misión',
        p1: 'Ayudarte a conectar con tu armonía interior con consuelo y claridad a través de un ',
        bold: 'mensaje diario de tu signo',
        p2: '.',
        footerRole: 'Propósito',
      },
      item4: {
        category: 'GUÍA DIARIA',
        categoryColor: 'bg-[#2878D0] text-white',
        title: 'Orientación Diaria',
        p1: 'Leer tu ',
        bold: 'frase astrológica diaria',
        p2: ' alinea tu energía y te ayuda a vivir el día con serenidad e intención.',
        footerRole: 'Reflexión',
      },
    },
  };

  const t = content[lang] || content.en;

  const items = [
    {
      id: 'about-1',
      slug: 'platform',
      icon: Sun,
      image:
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      data: t.item1,
    },
    {
      id: 'about-2',
      slug: 'method',
      icon: Star,
      image:
        'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
      data: t.item2,
    },
    {
      id: 'about-3',
      slug: 'mission',
      icon: Compass,
      image:
        'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
      data: t.item3,
    },
    {
      id: 'about-4',
      slug: 'daily-guidance',
      icon: Moon,
      image:
        'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=800&q=80',
      data: t.item4,
    },
  ];

  return (
    <section id="about" className="w-full bg-[#C9E5FF] border-y border-[#D9E8F8] py-10 sm:py-12 select-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header exactly matching Trending Articles com fade-in e slide-up */}
        <ScrollReveal delay={0} distance={20} duration={750}>
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="font-extrabold text-sm sm:text-base tracking-[0.2em] uppercase text-[#172B4D]">
              {t.title}
            </h2>
            <div className="w-12 h-1 bg-[#2878D0] rounded-full mx-auto mt-2.5" />
          </div>
        </ScrollReveal>

        {/* 4 Cards Grid with the exact layout, images and typography of Trending Articles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
          {items.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <ScrollReveal
                key={item.id}
                delay={idx * 75}
                distance={24}
                duration={750}
                className="h-full"
              >
                <article
                  onClick={() => onOpenCard?.(item.slug)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') onOpenCard?.(item.slug);
                  }}
                  role={onOpenCard ? 'link' : undefined}
                  tabIndex={onOpenCard ? 0 : undefined}
                  className="bg-[#FFFFFF] border border-[#D9E8F8] hover:border-[#2878D0]/50 rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(23,54,111,0.04)] hover:shadow-[0_12px_28px_rgba(40,120,208,0.12)] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between cursor-pointer group h-full"
                >
                  {/* Card Top: High-quality featured image with hover zoom + subtle celestial icon */}
                  <div className="w-full h-32 sm:h-36 overflow-hidden bg-[#E4F1FF] relative shrink-0">
                    <img
                      src={item.image}
                      alt={item.data.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    {/* Subtle glassmorphism icon chip */}
                    <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center text-white/90 shadow-xs border border-white/20">
                      <IconComponent className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Card Body matching Trending Articles */}
                  <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1">
                    <div>
                      {/* Category Badge Pill */}
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider mb-2 ${item.data.categoryColor}`}
                      >
                        {item.data.category}
                      </span>

                      {/* Card Title */}
                      <h3 className="font-bold text-xs sm:text-[13px] text-[#172B4D] leading-snug mb-1.5 group-hover:text-[#2878D0] transition-colors line-clamp-2">
                        {item.data.title}
                      </h3>

                      {/* Excerpt with bold highlights */}
                      <p className="text-[11px] text-[#647DA5] leading-relaxed mb-3 line-clamp-3 font-normal">
                        {item.data.p1}
                        <strong className="font-semibold text-[#172B4D]">
                          {item.data.bold}
                        </strong>
                        {item.data.p2}
                      </p>
                    </div>

                    {/* Author Info Row matching Trending Articles */}
                    <div className="flex items-center gap-2 pt-2.5 border-t border-[#D9E8F8] mt-auto">
                      <img
                        src={AURENSTAR_AVATAR}
                        alt="Aurenstar"
                        className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-black/5"
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="text-[11px] sm:text-xs font-bold text-[#172B4D] leading-tight truncate">
                          Aurenstar <span aria-label="Verificado" title="Perfil verificado" className="ml-1 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#2878D0] text-[9px] font-black leading-none text-white align-middle">✓</span>
                        </span>
                        <span className="text-[10px] text-[#647DA5] font-medium leading-tight">
                          {item.data.footerRole}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

