import React from 'react';
import { Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ScrollReveal } from './ScrollReveal';

// Official multicolor Google wordmark matching image.png
const GoogleLogo: React.FC<{ className?: string }> = ({ className = 'h-3 w-auto' }) => (
  <svg
    viewBox="0 0 74 24"
    className={`inline-block shrink-0 ${className}`}
    aria-label="Google"
    fill="none"
  >
    <path
      d="M9.24 10.87v2.85h6.63c-.26 1.83-1.63 3.63-4.22 3.63-3.6 0-6.52-2.97-6.52-6.63s2.92-6.63 6.52-6.63c1.9 0 3.25.75 4.19 1.66l2.09-2.09C16.14 1.94 13.9 1 11.65 1 5.92 1 1.25 5.67 1.25 11.4s4.67 10.4 10.4 10.4c5.99 0 9.96-4.21 9.96-10.14 0-.69-.07-1.25-.17-1.79H9.24z"
      fill="#4285F4"
    />
    <path
      d="M29.5 11.4c0 3.39-2.6 5.86-5.86 5.86s-5.86-2.47-5.86-5.86 2.6-5.86 5.86-5.86 5.86 2.47 5.86 5.86zm-2.56 0c0-2.12-1.52-3.58-3.3-3.58-1.78 0-3.3 1.46-3.3 3.58 0 2.1 1.52 3.58 3.3 3.58 1.78 0 3.3-1.48 3.3-3.58z"
      fill="#EA4335"
    />
    <path
      d="M42.5 11.4c0 3.39-2.6 5.86-5.86 5.86s-5.86-2.47-5.86-5.86 2.6-5.86 5.86-5.86 5.86 2.47 5.86 5.86zm-2.56 0c0-2.12-1.52-3.58-3.3-3.58-1.78 0-3.3 1.46-3.3 3.58 0 2.1 1.52 3.58 3.3 3.58 1.78 0 3.3-1.48 3.3-3.58z"
      fill="#FBBC05"
    />
    <path
      d="M54.5 5.86v10.82c0 4.45-2.62 6.27-5.74 6.27-2.92 0-4.68-1.96-5.34-3.54l2.23-.93c.4 1 1.39 2.19 3.11 2.19 2.03 0 3.29-1.26 3.29-3.61v-.88h-.09c-.6.74-1.75 1.4-3.2 1.4-3.05 0-5.84-2.66-5.84-6.02 0-3.39 2.79-6.05 5.84-6.05 1.45 0 2.6 1.15 3.2 1.88h.09V5.86h2.45zm-2.34 5.56c0-2.07-1.39-3.56-3.18-3.56-1.76 0-3.25 1.49-3.25 3.56 0 2.05 1.49 3.54 3.25 3.54 1.79 0 3.18-1.49 3.18-3.54z"
      fill="#4285F4"
    />
    <path d="M57.5 1.5h2.56v15.76H57.5V1.5z" fill="#34A853" />
    <path
      d="M69.8 13.56l2.03 1.35c-.66.98-2.27 2.69-5.11 2.69-3.5 0-6.13-2.7-6.13-6.2 0-3.69 2.66-6.2 5.83-6.2 3.2 0 4.76 2.54 5.27 3.94l.28.74-8.49 3.51c.65 1.28 1.66 1.94 3.1 1.94 1.44 0 2.42-.71 3.22-1.77zm-6.65-2.36l5.68-2.35c-.31-.79-1.22-1.35-2.32-1.35-1.4 0-3.37 1.23-3.36 3.7z"
      fill="#EA4335"
    />
  </svg>
);

interface ReviewItem {
  id: string;
  badge: {
    en: string;
    pt: string;
    es: string;
  };
  badgeColor: string;
  quote: {
    en: string;
    pt: string;
    es: string;
  };
  rating: number;
  author: {
    name: string;
    date: {
      en: string;
      pt: string;
      es: string;
    };
    avatar: string;
  };
}

const REVIEWS_LIST: ReviewItem[] = [
  {
    id: 'rev-1',
    badge: {
      en: 'VERIFIED REVIEW',
      pt: 'AVALIAÇÃO VERIFICADA',
      es: 'OPINIÓN VERIFICADA',
    },
    badgeColor: 'bg-[#3982C8] text-white',
    quote: {
      en: 'Our experience was absolutely incredible! The destinations and celestial messages were even more beautiful than expected. Every single detail is thoughtful.',
      pt: 'Minha experiência foi absolutamente incrível! O cuidado com cada detalhe e a clareza das mensagens diárias trouxeram muita paz para o meu dia.',
      es: '¡Nuestra experiencia fue absolutamente increíble! Los mensajes celestiales y cada detalle estuvieron perfectamente cuidados.',
    },
    rating: 5,
    author: {
      name: 'İlyas Qantayev',
      date: {
        en: '12 days ago',
        pt: '12 dias atrás',
        es: 'hace 12 días',
      },
      avatar:
        '/assets/img/1507003211169-0a1dd7228f-120.webp',
    },
  },
  {
    id: 'rev-2',
    badge: {
      en: 'DAILY HABIT',
      pt: 'HÁBITO DIÁRIO',
      es: 'HÁBITO DIARIO',
    },
    badgeColor: 'bg-[#17366F] text-white',
    quote: {
      en: 'The daily advice is stunning and perfectly crafted. Aurenstar brings so much serenity and purpose to my routine. Truly exceptional!',
      pt: 'A leitura diária é maravilhosa e me traz muita clareza mental e serenidade. Começar a manhã com a Aurenstar virou meu hábito favorito!',
      es: 'La orientación diaria es maravillosa y me brinda mucha serenidad y propósito. ¡Un servicio verdaderamente excepcional!',
    },
    rating: 5,
    author: {
      name: 'Mike Kenje',
      date: {
        en: '2 weeks ago',
        pt: '2 semanas atrás',
        es: 'hace 2 semanas',
      },
      avatar:
        '/assets/img/1500648767791-00dcc994a4-120.webp',
    },
  },
  {
    id: 'rev-3',
    badge: {
      en: 'COMMUNITY',
      pt: 'COMUNIDADE',
      es: 'COMUNIDAD',
    },
    badgeColor: 'bg-[#3982C8] text-white',
    quote: {
      en: 'We had a wonderful experience from start to finish. Everything is simple to understand, gentle, and deeply inspiring.',
      pt: 'Tive uma experiência fantástica desde o primeiro momento. Tudo muito simples de entender, acolhedor e cheio de paz.',
      es: 'Tuvimos una experiencia maravillosa de principio a fin. Todo muy simple de entender, cálido e inspirador.',
    },
    rating: 5,
    author: {
      name: 'Natalia Ojhov',
      date: {
        en: '3 days ago',
        pt: '3 dias atrás',
        es: 'hace 3 días',
      },
      avatar:
        '/assets/img/1494790108377-be9c29b293-120.webp',
    },
  },
  {
    id: 'rev-4',
    badge: {
      en: 'INSPIRATION',
      pt: 'INSPIRAÇÃO',
      es: 'INSPIRACIÓN',
    },
    badgeColor: 'bg-[#E73578] text-white',
    quote: {
      en: 'Exceeded all my expectations! The daily guidance brings clarity and comfort whenever I face important decisions or busy days.',
      pt: 'Superou todas as minhas expectativas! As frases e conselhos me dão um momento de calma e reflexão nos dias mais corridos.',
      es: '¡Superó todas mis expectativas! La orientación diaria brinda calma y reflexión en los momentos más importantes.',
    },
    rating: 5,
    author: {
      name: 'Lucas Benítez',
      date: {
        en: '1 month ago',
        pt: '1 mês atrás',
        es: 'hace 1 mes',
      },
      avatar:
        '/assets/img/1534528741775-53994a69da-120.webp',
    },
  },
  {
    id: 'rev-5',
    badge: {
      en: 'CALM & PEACE',
      pt: 'PAZ & CALMA',
      es: 'PAZ Y CALMA',
    },
    badgeColor: 'bg-[#E73578] text-white',
    quote: {
      en: 'Fast, beautiful, and deeply soothing. Finding my astrological sign advice here is the most peaceful start to any morning.',
      pt: 'Rápido, bonito e acolhedor. Descobrir a mensagem do meu signo aqui é a forma mais leve e positiva de começar o dia.',
      es: 'Rápido, hermoso y relajante. Descubrir el mensaje de mi signo aquí es el comienzo más pacífico para la mañana.',
    },
    rating: 5,
    author: {
      name: 'Emma Watson-Reid',
      date: {
        en: '5 days ago',
        pt: '5 dias atrás',
        es: 'hace 5 días',
      },
      avatar:
        '/assets/img/1517841905240-472988babd-120.webp',
    },
  },
  {
    id: 'rev-6',
    badge: {
      en: 'EXCELLENCE',
      pt: 'EXCELÊNCIA',
      es: 'EXCELENCIA',
    },
    badgeColor: 'bg-[#17366F] text-white',
    quote: {
      en: 'The clean aesthetic and simple words make reading a genuine joy. No complex jargon, just pure direction and warmth.',
      pt: 'O design limpo e as palavras fáceis de compreender tornam tudo muito prazeroso. Sem termos técnicos, apenas boas energias.',
      es: 'La estética limpia y las palabras sencillas hacen que la lectura sea un auténtico placer. Pura dirección y calidez.',
    },
    rating: 5,
    author: {
      name: 'Gabriel Martins',
      date: {
        en: '3 weeks ago',
        pt: '3 semanas atrás',
        es: 'hace 3 semanas',
      },
      avatar:
        '/assets/img/1535713875002-d1d0cf377f-120.webp',
    },
  },
];

export const ReviewsSection: React.FC = () => {
  const { language } = useLanguage();
  const lang = (language || 'pt') as 'pt' | 'en' | 'es';

  const texts = {
    en: {
      title: 'REAL REVIEWS FROM REAL PEOPLE',
      stats: 'Results of the opinions of 3,893 people: 4.5/5',
    },
    pt: {
      title: 'AVALIAÇÕES REAIS DE PESSOAS REAIS',
      stats: 'Resultados da opinião de 3.893 pessoas: 4.5/5',
    },
    es: {
      title: 'OPINIONES REALES DE PERSONAS REALES',
      stats: 'Resultados de la opinión de 3.893 personas: 4.5/5',
    },
  };

  const t = texts[lang] || texts.en;

  // Duplicate for seamless infinite loop (just like BrandMarquee)
  const setA = [...REVIEWS_LIST];
  const setB = [...REVIEWS_LIST];

  return (
    <section id="reviews" className="w-full bg-[#C9E5FF] border-y border-[#D9E8F8] py-10 sm:py-12 select-none overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header matching Trending Articles and About Aurenstar com fade-in e slide-up */}
        <ScrollReveal delay={0} distance={20} duration={750}>
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="font-extrabold text-sm sm:text-base tracking-[0.2em] uppercase text-[#172B4D]">
              {t.title}
            </h2>
            <div className="w-12 h-1 bg-[#3982C8] rounded-full mx-auto mt-2.5" />
            <div className="flex items-center justify-center gap-2 text-xs text-[#647DA5] mt-2.5 font-semibold">
              <span>{t.stats}</span>
              <Star className="w-3.5 h-3.5 fill-[#3982C8] text-[#3982C8]" />
              <span className="text-[#647DA5]">•</span>
              <GoogleLogo className="h-3.5 w-auto" />
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Infinite Edge-to-Edge Animated Marquee Track com fade-in e slide-up suave */}
      <ScrollReveal delay={100} distance={22} duration={750}>
        <div className="relative w-full overflow-hidden py-1">
          {/* Soft edge fade masks for seamless horizontal transition */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-20 bg-[#C9E5FF] z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-20 bg-[#C9E5FF] z-10" />

          {/* Marquee Container with hover pause */}
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
            {/* Set 1 */}
            <div className="flex shrink-0 items-stretch gap-4 sm:gap-4.5 pr-4 sm:pr-4.5">
              {setA.map((item, idx) => (
                <article
                  key={`rev-a-${idx}`}
                  className="w-[280px] sm:w-[320px] bg-[#FFFFFF] border border-[#D9E8F8] hover:border-[#3982C8]/50 rounded-2xl p-4 sm:p-4.5 shadow-[0_2px_12px_rgba(23,54,111,0.04)] hover:shadow-[0_12px_28px_rgba(57, 130, 200,0.12)] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between cursor-pointer group shrink-0"
                >
                  <div>
                    {/* Top Row: Category Badge + 5 Gold Stars */}
                    <div className="flex items-center justify-between mb-2.5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                          idx % 3 === 0
                            ? 'bg-[#3982C8] text-white'
                            : idx % 3 === 1
                            ? 'bg-[#17366F] text-white'
                            : 'bg-[#E73578] text-white'
                        }`}
                      >
                        {item.badge[lang] || item.badge.en}
                      </span>
                      <div className="flex items-center gap-0.5">
                        {[...Array(item.rating)].map((_, starIdx) => (
                          <Star
                            key={starIdx}
                            className="w-3 h-3 fill-[#3982C8] text-[#3982C8]"
                          />
                        ))}
                      </div>
                    </div>

                    {/* Review Quote Text */}
                    <p className="text-xs sm:text-[13px] text-[#647DA5] leading-relaxed mb-4 line-clamp-4 font-normal">
                      "{item.quote[lang] || item.quote.en}"
                    </p>
                  </div>

                  {/* Author Info Row matching image.png with date + Google symbol */}
                  <div className="flex items-center gap-2.5 pt-3 border-t border-[#D9E8F8] mt-auto">
                    <img loading="lazy" decoding="async"
                      src={item.author.avatar}
                      alt={item.author.name}
                      className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-black/5"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-[#172B4D] leading-tight truncate">
                        {item.author.name}
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] text-[#647DA5] font-medium leading-tight">
                          {item.author.date[lang] || item.author.date.en}
                        </span>
                        <GoogleLogo className="h-2.5 sm:h-3 w-auto" />
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Set 2 (Seamless loop clone) */}
            <div
              className="flex shrink-0 items-stretch gap-4 sm:gap-4.5 pr-4 sm:pr-4.5"
              aria-hidden="true"
            >
              {setB.map((item, idx) => (
                <article
                  key={`rev-b-${idx}`}
                  className="w-[280px] sm:w-[320px] bg-[#FFFFFF] border border-[#D9E8F8] hover:border-[#3982C8]/50 rounded-2xl p-4 sm:p-4.5 shadow-[0_2px_12px_rgba(23,54,111,0.04)] hover:shadow-[0_12px_28px_rgba(57, 130, 200,0.12)] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between cursor-pointer group shrink-0"
                >
                  <div>
                    {/* Top Row: Category Badge + 5 Gold Stars */}
                    <div className="flex items-center justify-between mb-2.5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                          idx % 3 === 0
                            ? 'bg-[#3982C8] text-white'
                            : idx % 3 === 1
                            ? 'bg-[#17366F] text-white'
                            : 'bg-[#E73578] text-white'
                        }`}
                      >
                        {item.badge[lang] || item.badge.en}
                      </span>
                      <div className="flex items-center gap-0.5">
                        {[...Array(item.rating)].map((_, starIdx) => (
                          <Star
                            key={starIdx}
                            className="w-3 h-3 fill-[#3982C8] text-[#3982C8]"
                          />
                        ))}
                      </div>
                    </div>

                    {/* Review Quote Text */}
                    <p className="text-xs sm:text-[13px] text-[#647DA5] leading-relaxed mb-4 line-clamp-4 font-normal">
                      "{item.quote[lang] || item.quote.en}"
                    </p>
                  </div>

                  {/* Author Info Row matching image.png with date + Google symbol */}
                  <div className="flex items-center gap-2.5 pt-3 border-t border-[#D9E8F8] mt-auto">
                    <img loading="lazy" decoding="async"
                      src={item.author.avatar}
                      alt={item.author.name}
                      className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-black/5"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-[#172B4D] leading-tight truncate">
                        {item.author.name}
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] text-[#647DA5] font-medium leading-tight">
                          {item.author.date[lang] || item.author.date.en}
                        </span>
                        <GoogleLogo className="h-2.5 sm:h-3 w-auto" />
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
};
