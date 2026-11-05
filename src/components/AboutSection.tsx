import React from 'react';
import { Clock, Lightbulb, CheckCircle2, Globe2, Sparkles, TrendingUp } from 'lucide-react';

interface AboutSectionProps {
  lang: 'pt' | 'en';
}

export const AboutSection: React.FC<AboutSectionProps> = ({ lang }) => {
  const t = {
    pt: {
      tag: 'SOBRE NÓS',
      title1: 'Um parceiro dedicado a construir soluções',
      titleHighlight1: 'mais espertas',
      titleAnd: 'e',
      titleHighlight2: 'adaptáveis ao seu dia a dia',
      card1Title: '120+ Parceiros',
      card1Desc: 'Conectados com as melhores ferramentas e tecnologias do mundo.',
      card2Title: '100% Compromisso',
      card2Quote:
        '“A forma como organizaram tudo mudou nossa rotina. Agora trabalhamos com tranquilidade, clareza e muito mais resultados.”',
      card3Title: '520k+ Informações',
      card3Desc: 'Analisadas todos os meses para mostrar o melhor caminho com facilidade.',
      card4Title: 'Presença e Cuidado',
      card4Desc: 'Atendimento humanizado para transformar ideias em negócios de sucesso.',
    },
    en: {
      tag: 'ABOUT US',
      title1: 'A global consulting partner dedicated to building',
      titleHighlight1: 'smarter',
      titleAnd: 'and',
      titleHighlight2: 'more adaptive',
      card1Title: '120+ Providers',
      card1Desc: 'Collaborating with leading AI and cloud technology providers.',
      card2Title: '100% Commitment',
      card2Quote:
        '“Their automation strategy completely reshaped how we work. It is efficient, intelligent, and seamless.”',
      card3Title: '520k+ Data Points',
      card3Desc: 'Analyzed monthly to power strategies without any confusion.',
      card4Title: 'Global Reach & Care',
      card4Desc: 'Thoughtful human consulting turning ideas into lasting growth.',
    },
  }[lang];

  return (
    <section id="about" className="py-20 lg:py-28 bg-white text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-slate-500 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
            <span>{t.tag}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            {t.title1}{' '}
            <span className="inline-flex items-center gap-1.5 bg-blue-500 text-white px-3 py-0.5 rounded-full align-middle text-2xl sm:text-3xl md:text-4xl">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>{t.titleHighlight1}</span>
            </span>{' '}
            {t.titleAnd}{' '}
            <span className="inline-flex items-center gap-1.5 bg-[#d2f829] text-black px-3 py-0.5 rounded-full align-middle text-2xl sm:text-3xl md:text-4xl">
              <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 fill-black" />
              <span>{t.titleHighlight2}</span>
            </span>
          </h2>
        </div>

        {/* Asymmetrical 4-Card Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* Card 1: Blue Card with smiling guy */}
          <div className="md:col-span-5 bg-[#3982C8] text-white p-7 sm:p-9 rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden group">
            <div className="flex items-center justify-between z-10">
              <span className="text-xs font-extrabold tracking-widest uppercase text-blue-100 bg-white/20 px-3 py-1 rounded-full backdrop-blur-xs">
                IPSUM CO.
              </span>
              <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>

            <div className="my-6 z-10">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-white/60 shadow-lg mb-6 group-hover:scale-105 transition-transform duration-300">
                <img loading="lazy" decoding="async"
                  src="/assets/img/1534528741775-53994a69da-400.webp"
                  alt="Team lead"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-4xl sm:text-5xl font-black tracking-tight">
                {t.card1Title}
              </div>
              <p className="mt-2 text-blue-100 text-sm sm:text-base leading-relaxed">
                {t.card1Desc}
              </p>
            </div>

            <div className="z-10 flex items-center gap-2 text-xs font-bold text-blue-200">
              <CheckCircle2 className="w-4 h-4 text-[#d2f829]" />
              <span>100% verificado e seguro</span>
            </div>

            {/* Background geometric blur */}
            <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          </div>

          {/* Right column split: Card 2, Card 3, Card 4 */}
          <div className="md:col-span-7 flex flex-col gap-6">
            {/* Card 2: White card with quote and avatars */}
            <div className="bg-slate-50 border border-slate-200/90 p-7 sm:p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Compromisso Garantido
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">
                    {t.card2Title}
                  </div>
                </div>

                {/* Avatar stack */}
                <div className="flex items-center -space-x-3">
                  {[
                    '/assets/img/1534528741775-53994a69da-120.webp',
                    '/assets/img/1507003211169-0a1dd7228f-120.webp',
                    '/assets/img/1580489944761-15a19d6549-120.webp',
                    '/assets/img/1500648767791-00dcc994a4-120.webp',
                  ].map((src, i) => (
                    <img loading="lazy" decoding="async"
                      key={i}
                      src={src}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full border-2 border-white object-cover"
                    />
                  ))}
                </div>
              </div>

              <blockquote className="mt-5 text-slate-700 text-sm sm:text-base leading-relaxed font-medium italic">
                {t.card2Quote}
              </blockquote>
            </div>

            {/* Split bottom cards: Neon Lime Card + Dark Slate Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">
              {/* Card 3: Neon Lime */}
              <div className="bg-[#d2f829] text-black p-6 sm:p-7 rounded-3xl shadow-md flex flex-col justify-between hover:-translate-y-1 transition-transform">
                <div>
                  <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center mb-3">
                    <TrendingUp className="w-4 h-4 text-black" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-black tracking-tight">
                    520k+
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-black/60 mt-1">
                    Operações Automáticas
                  </div>
                </div>
                <p className="mt-4 text-xs sm:text-sm font-semibold text-black/80 leading-relaxed">
                  {t.card3Desc}
                </p>
              </div>

              {/* Card 4: Dark Slate */}
              <div className="bg-slate-900 text-white p-6 sm:p-7 rounded-3xl shadow-md flex flex-col justify-between hover:-translate-y-1 transition-transform">
                <div>
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mb-3">
                    <Globe2 className="w-4 h-4 text-[#d2f829]" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-black tracking-tight text-[#d2f829]">
                    18+
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">
                    Cidades & Regiões
                  </div>
                </div>
                <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {t.card4Desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
