import { cardImage } from '../utils/cardImage';
import React, { useState } from 'react';
import {
  ArrowLeft,
  Star,
  ArrowRight,
  Lightbulb,
  Sparkles,
  Check,
  Share2,
  Calendar,
  RotateCcw,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { CoverArt } from '../components/CoverArt';
import { BLOG_ARTICLES } from '../data/blogArticles';
import { SIGNS_DATA, LAST_DISCOVERED_SIGN_KEY, SignInfo } from '../data/signsData';

interface DiscoverSignResultPageProps {
  onBackToForm: () => void;
  onBackToHome: () => void;
  onNavigateToBlog: () => void;
  onOpenArticle: (id: string) => void;
  onSelectSignFilter: (signKey: string) => void;
}

export const DiscoverSignResultPage: React.FC<DiscoverSignResultPageProps> = ({
  onBackToForm,
  onBackToHome,
  onNavigateToBlog,
  onOpenArticle,
  onSelectSignFilter,
}) => {
  const { language } = useLanguage();
  const lang = (language || 'pt') as 'pt' | 'en' | 'es';
  const tr = (pt: string, en: string, es: string) => (lang === 'en' ? en : lang === 'es' ? es : pt);

  // Carrega o signo salvo
  const [savedData] = useState<{ signKey: string; day?: number; month?: number } | null>(() => {
    try {
      const raw = localStorage.getItem(LAST_DISCOVERED_SIGN_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // silencioso
    }
    return null;
  });

  const [copied, setCopied] = useState(false);

  const signKey = savedData?.signKey || 'gemeos';
  const currentSign: SignInfo = SIGNS_DATA[signKey] || SIGNS_DATA.gemeos;

  const recommended = BLOG_ARTICLES.find((a) => a.id === currentSign.articleId) || BLOG_ARTICLES.find((a) => a.zodiacSigns?.includes(signKey));

  const handleCopy = () => {
    const text = `✨ Meu Signo é ${currentSign.name[lang] || currentSign.name.pt} ${currentSign.symbol} ✨\n` +
      `📅 ${currentSign.period[lang] || currentSign.period.pt}\n\n` +
      `🌟 Essência:\n${currentSign.essence[lang] || currentSign.essence.pt}\n\n` +
      `Descubra o seu signo de forma simples em: ${window.location.origin}/#/discover-sign`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full bg-[#C9E5FF] min-h-screen pt-24 sm:pt-28 pb-20 select-none animate-fadeIn text-[#172B4D]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Barra Superior de Navegação */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#D9E8F8]">
          <button
            type="button"
            onClick={onBackToForm}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#647DA5] hover:text-[#172B4D] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>{tr('Fazer Outro Teste','Take Another Test','Hacer Otra Prueba')}</span>
          </button>

          <button
            type="button"
            onClick={onNavigateToBlog}
            className="text-xs sm:text-sm font-bold text-[#3982C8] hover:text-[#17366F] transition-colors cursor-pointer"
          >
            {tr('Ver Dicas no Blog →', 'See Tips on the Blog →', 'Ver Consejos en el Blog →')}
          </button>
        </div>

        {/* Hero compacto */}
        <header className="relative mb-5 overflow-hidden rounded-3xl bg-[#3982C8] px-5 py-5 text-white shadow-[0_10px_28px_rgba(23,54,111,0.15)] sm:px-7">
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 overflow-hidden opacity-30"><CoverArt tone="blue" /></div>
          <div className="relative flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-4xl font-black text-[#3982C8] shadow-lg">
              {currentSign.symbol}{'\uFE0E'}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wider text-white/80">{tr('Seu Signo é', 'Your Sign is', 'Tu Signo es')}</p>
              <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                {currentSign.name[lang] || currentSign.name.pt}
              </h1>
              <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 font-semibold text-white/90"><Calendar className="h-3.5 w-3.5" />{currentSign.period[lang] || currentSign.period.pt}</span>
                <span className="inline-flex items-center rounded-full bg-white px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#3982C8]">
                  {tr('Elemento', 'Element', 'Elemento')} {currentSign.element[lang] || currentSign.element.pt}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Mensagem + artigo, mesmo tamanho */}
        <div className="mb-6 flex flex-col gap-4">
          <section className="flex flex-col rounded-3xl border border-[#D9E8F8] bg-white p-3.5 shadow-sm">
            <div className="flex flex-1 flex-col p-3 sm:p-5">
              <span className="mb-3 inline-block w-fit rounded-full bg-[#3982C8] px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white sm:text-[11px]">
                {tr('Sua Essência','Your Essence','Tu Esencia')}
              </span>
              <h2 className="mb-2 text-lg font-extrabold leading-snug text-[#172B4D] sm:text-xl">
                {tr('Como é ser', 'What it is like to be', 'Cómo es ser')} {currentSign.name[lang] || currentSign.name.pt}
              </h2>
              <p className="text-sm leading-relaxed text-[#647DA5] sm:text-base">{currentSign.essence[lang] || currentSign.essence.pt}</p>
            </div>
          </section>

          {recommended && (
            <>
            <h3 className="mt-4 text-center text-lg font-extrabold uppercase tracking-wider text-[#17366F] sm:text-xl">{tr('Artigo para você','Article for you','Artículo para ti')}</h3>
            <div
              role="button"
              tabIndex={0}
              onClick={() => onOpenArticle(recommended.id)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpenArticle(recommended.id); } }}
              aria-label={`${tr('Artigo para você','Article for you','Artículo para ti')}: ${recommended.title[lang] || recommended.title.pt}`}
              className="group flex w-full cursor-pointer items-center justify-between gap-3 rounded-2xl border border-[#D9E8F8] bg-white p-3 shadow-sm transition-all duration-300 hover:border-[#3982C8]/40 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#3982C8]/40 sm:gap-6 sm:rounded-3xl sm:p-4"
            >
              <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-28 sm:w-44 sm:rounded-2xl">
                <img src={cardImage(recommended.image)} alt={recommended.title[lang] || recommended.title.pt} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="min-w-0 flex-1 pr-1 sm:pr-2">
                <span className="mb-1 block text-[10px] font-extrabold uppercase tracking-wider text-[#E73578] sm:text-xs">
                  {recommended.category[lang] || recommended.category.pt}
                </span>
                <h4 className="mb-1 line-clamp-2 text-xs font-bold leading-snug text-[#172B4D] transition-colors group-hover:text-[#3982C8] sm:text-base lg:text-lg">
                  {recommended.title[lang] || recommended.title.pt}
                </h4>
                <p className="line-clamp-2 text-[11px] font-normal leading-relaxed text-[#647DA5] sm:text-xs">
                  {recommended.subtitle[lang] || recommended.subtitle.pt}
                </p>
              </div>
              <div className="shrink-0 pr-1 text-[#17366F] transition-all duration-300 group-hover:translate-x-1.5 group-hover:text-[#3982C8] sm:pr-2">
                <ArrowRight className="h-5 w-5 stroke-[2.2] sm:h-6 sm:w-6" />
              </div>
            </div>
            </>
          )}
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={onBackToForm}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-[#3982C8] bg-white px-6 py-2.5 text-sm font-extrabold text-[#3982C8] transition-all hover:bg-[#3982C8] hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-[#3982C8]/30"
          >
            <RotateCcw className="h-4 w-4" />
            <span>{tr('Colocar Outra Data','Enter Another Date','Poner Otra Fecha')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
