import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface BottomBannerProps {
  onGetStarted: () => void;
  lang: 'pt' | 'en';
}

export const BottomBanner: React.FC<BottomBannerProps> = ({
  onGetStarted,
  lang,
}) => {
  const t = {
    pt: {
      trusted: 'Mais de 5.000 pessoas confiam',
      title: 'Combinamos calor humano com inteligência descomplicada',
      sub: 'Nossa equipe conecta bom senso, estratégia prática e tecnologia moderna para você tomar decisões certas, economizar horas no dia e ter prazer em ver seu projeto crescer.',
      getStarted: 'COMEÇAR AGORA',
    },
    en: {
      trusted: 'Trusted over 5,000+',
      title: 'We combine human insight with artificial intelligence',
      sub: 'Our consulting team bridges strategic thinking and advanced AI technologies to help companies streamline processes, improve decision-making, and create intelligent digital experiences.',
      getStarted: 'GET STARTED',
    },
  }[lang];

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto rounded-3xl overflow-hidden relative min-h-[460px] sm:min-h-[520px] flex items-center justify-center text-center p-6 sm:p-12 shadow-2xl">
        {/* Background Image: Dandelion field with blue sky matching Screenshot 8 */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80"
            alt="Field of dandelions under blue sky"
            className="w-full h-full object-cover object-bottom"
          />
          {/* Subtle gradient overlay to enhance text readability */}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Content Box */}
        <div className="relative z-10 max-w-3xl mx-auto text-white">
          {/* Trusted avatars badge */}
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/30 mb-6 shadow-xs">
            <span className="text-xs sm:text-sm font-semibold text-white">
              {t.trusted}
            </span>
            <div className="flex items-center -space-x-2">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
                alt="user"
                className="w-6 h-6 rounded-full border border-white object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80"
                alt="user"
                className="w-6 h-6 rounded-full border border-white object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=80&q=80"
                alt="user"
                className="w-6 h-6 rounded-full border border-white object-cover"
              />
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] drop-shadow-md">
            {t.title}
          </h2>

          <p className="mt-5 text-sm sm:text-base md:text-lg text-slate-100 max-w-2xl mx-auto leading-relaxed drop-shadow-sm font-normal">
            {t.sub}
          </p>

          <div className="mt-8 flex justify-center">
            <button
              onClick={onGetStarted}
              className="px-7 sm:px-8 py-3.5 rounded-full text-xs sm:text-sm font-black tracking-wider uppercase bg-[#d2f829] hover:bg-[#beea21] text-black shadow-xl transition-all duration-200 cursor-pointer flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              <span>{t.getStarted}</span>
              <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center text-white">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
