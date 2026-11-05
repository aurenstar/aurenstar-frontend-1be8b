import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Quote, Star } from 'lucide-react';

interface TestimonialsSectionProps {
  lang: 'pt' | 'en';
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ lang }) => {
  const [startIndex, setStartIndex] = useState(0);

  const t = {
    pt: {
      tag: 'DEPOIMENTOS',
      title: 'O que dizem sobre trabalhar com a gente?',
      sub: 'Veja o que pessoas reais compartilharam depois de simplificar seus negócios conosco.',
      items: [
        {
          id: '1',
          name: 'Lucas Ferreira',
          role: 'Fundador, Tech Innovations',
          quote:
            'Eles trouxeram clareza para problemas que pareciam nós impossíveis de desatar. Quebraram barreiras e deixaram tudo simples de rodar.',
          image:
            '/assets/img/1507003211169-0a1dd7228f-600.webp',
          company: 'TECH INNOVATIONS',
        },
        {
          id: '2',
          name: 'Mariana Duarte',
          role: 'Diretora, Studio Criativo',
          quote:
            'A clareza deles resolveu nossos maiores entraves. Abriram novos caminhos e criaram rotinas que dão gosto de executar todos os dias.',
          image:
            '/assets/img/1580489944761-15a19d6549-600.webp',
          company: 'STUDIO CRIATIVO',
        },
        {
          id: '3',
          name: 'Renato Albuquerque',
          role: 'Gestor, Logística Express',
          quote:
            'Encontramos foco muito rápido. Tiraram toda a enrolação e nos deram a certeza e a tranquilidade que precisávamos para crescer.',
          image:
            '/assets/img/1500648767791-00dcc994a4-600.webp',
          company: 'LOGÍSTICA EXPRESS',
        },
        {
          id: '4',
          name: 'Beatriz Lima',
          role: 'CEO, E-commerce Viva',
          quote:
            'Nunca imaginei que organizar as finanças e o atendimento pudesse ser tão leve. O suporte é carinhoso, rápido e muito eficiente!',
          image:
            '/assets/img/1573496359142-b8d87734a5-600.webp',
          company: 'VIVA E-COMMERCE',
        },
      ],
    },
    en: {
      tag: 'TESTIMONIALS',
      title: 'What they say about us?',
      sub: "Here's what they shared about their experience working with our team.",
      items: [
        {
          id: '1',
          name: 'John Doe',
          role: 'Founder, Tech Innovations',
          quote:
            'They brought clarity to complex problems, breaking down barriers and delivering innovative solutions.',
          image:
            '/assets/img/1507003211169-0a1dd7228f-600.webp',
          company: 'TECH INNOVATIONS',
        },
        {
          id: '2',
          name: 'Jane Doe',
          role: 'Creative Director',
          quote:
            'Their insight resolved difficult hurdles, opening new paths and creating highly effective strategies.',
          image:
            '/assets/img/1580489944761-15a19d6549-600.webp',
          company: 'STUDIO GROUP',
        },
        {
          id: '3',
          name: 'Mike Doe',
          role: 'Managing Partner',
          quote:
            'We found focus fast with clear requirements, cutting ambiguity and providing true confidence.',
          image:
            '/assets/img/1500648767791-00dcc994a4-600.webp',
          company: 'EXPRESS LOGISTICS',
        },
        {
          id: '4',
          name: 'Sarah Connor',
          role: 'E-commerce Director',
          quote:
            'Never thought managing workflows could feel this effortless. The team is warm, fast, and remarkably sharp.',
          image:
            '/assets/img/1573496359142-b8d87734a5-600.webp',
          company: 'VIVA COMMERCE',
        },
      ],
    },
  }[lang];

  const handleNext = () => {
    setStartIndex((prev) => (prev + 1) % t.items.length);
  };

  const handlePrev = () => {
    setStartIndex((prev) => (prev - 1 + t.items.length) % t.items.length);
  };

  // 3 items visible in rotation
  const visibleItems = [
    t.items[startIndex],
    t.items[(startIndex + 1) % t.items.length],
    t.items[(startIndex + 2) % t.items.length],
  ];

  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Nav Arrows */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-slate-500 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
              <span>{t.tag}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
              {t.title}
            </h2>

            <p className="mt-4 text-base sm:text-lg text-slate-600">
              {t.sub}
            </p>
          </div>

          {/* Arrows */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={handlePrev}
              className="w-11 h-11 rounded-full bg-white hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-800 transition-colors shadow-xs cursor-pointer active:scale-95"
              aria-label="Anterior"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="w-11 h-11 rounded-full bg-white hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-800 transition-colors shadow-xs cursor-pointer active:scale-95"
              aria-label="Próximo"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3 Portrait Photo Cards */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {visibleItems.map((item) => (
            <div
              key={item.id}
              className="h-[460px] sm:h-[490px] rounded-3xl overflow-hidden relative shadow-lg group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between p-6 sm:p-7 text-white"
            >
              {/* Background Photo */}
              <img loading="lazy" decoding="async"
                src={item.image}
                alt={item.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90"
              />

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-black/60" />

              {/* Top Company Badge */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-xs font-black tracking-widest uppercase bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white/90">
                  {item.company}
                </span>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
              </div>

              {/* Bottom Quote & Author */}
              <div className="relative z-10">
                <Quote className="w-8 h-8 text-[#d2f829] opacity-90 mb-3" />
                <p className="text-sm sm:text-base font-medium leading-relaxed text-slate-100 italic">
                  “{item.quote}”
                </p>

                <div className="mt-5 pt-4 border-t border-white/20">
                  <div className="font-bold text-white text-base">
                    {item.name}
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5">
                    {item.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
