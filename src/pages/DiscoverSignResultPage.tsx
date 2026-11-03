import React, { useState } from 'react';
import {
  ArrowLeft,
  Star,
  ArrowRight,
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
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
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
            className="text-xs sm:text-sm font-bold text-[#2878D0] hover:text-[#17366F] transition-colors cursor-pointer"
          >
            {tr('Ver Dicas no Blog →', 'See Tips on the Blog →', 'Ver Consejos en el Blog →')}
          </button>
        </div>

        {/* Cover-style result header */}
        <header className="relative mb-6 overflow-hidden rounded-3xl bg-[#2878D0] p-4 text-white shadow-[0_10px_28px_rgba(23,54,111,0.15)] sm:p-5">
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 overflow-hidden sm:inset-y-0 sm:left-auto sm:right-0 sm:h-auto sm:w-1/2"><CoverArt tone="blue" /></div>
          <div className="relative flex flex-col gap-4 pb-8 sm:flex-row sm:items-center sm:gap-4 sm:pb-0 sm:pr-[34%]">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-3xl font-black text-[#2878D0] shadow-lg">
              {currentSign.symbol}{'\uFE0E'}
            </div>
            <div>
              <div className="mb-2 inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
                {tr('Resultado da Sua Data de Nascimento','Your Birth Date Result','Resultado de Tu Fecha de Nacimiento')}
              </div>
              <h1 className="text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
                {tr('Seu Signo é', 'Your Sign is', 'Tu Signo es')} {currentSign.name[lang] || currentSign.name.pt}
              </h1>
              <span aria-hidden className="mt-2 block h-1 w-10 rounded-full bg-[#F51B83]" />
              <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/90">
                <span className="inline-flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{currentSign.period[lang] || currentSign.period.pt}</span>
                <span className="inline-flex items-center rounded-full bg-white px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-[#2878D0]">
                  {tr('Elemento', 'Element', 'Elemento')} {currentSign.element[lang] || currentSign.element.pt}
                </span>
              </p>
            </div>
          </div>
        </header>

        {/* Essence card */}
        <div className="mb-6 overflow-hidden rounded-3xl border border-[#D9E8F8] bg-white p-3 shadow-md">
          <div className="relative overflow-hidden rounded-2xl bg-[#17366F] p-5 text-white sm:p-6">
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 overflow-hidden opacity-50"><CoverArt tone="blue" variant={1} /></div>
            <div className="relative">
              <h2 className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-white/90">
                <Star className="h-4 w-4" />
                <span>{tr('Sua Essência e Jeito de Ser','Your Essence and Way of Being','Tu Esencia y Forma de Ser')}</span>
              </h2>
              <p className="mb-12 text-sm font-medium leading-relaxed sm:text-base">
                {currentSign.essence[lang] || currentSign.essence.pt}
              </p>
            </div>
          </div>

          <div className="space-y-2.5 p-3 pt-4">
            <button
              type="button"
              onClick={handleCopy}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#2878D0] px-4 py-3 text-xs font-extrabold text-white shadow-sm transition-all hover:bg-[#17366F] sm:text-sm"
            >
              {copied ? (
                <><Check className="h-4 w-4" /><span>{tr('Copiado com Sucesso!','Copied!','¡Copiado!')}</span></>
              ) : (
                <><Share2 className="h-4 w-4" /><span>{tr('Compartilhar Meu Signo','Share My Sign','Compartir Mi Signo')}</span></>
              )}
            </button>
          </div>
        </div>

        {/* Artigo recomendado do signo */}
        {recommended && (
          <button
            type="button"
            onClick={() => onOpenArticle(recommended.id)}
            className="group mb-6 flex w-full cursor-pointer items-stretch overflow-hidden rounded-3xl border border-[#D9E8F8] bg-white text-left shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <img src={recommended.image} alt="" loading="lazy" className="hidden h-auto w-32 shrink-0 object-cover sm:block" />
            <div className="flex-1 p-4 sm:p-5">
              <span className="inline-flex rounded-full bg-[#F51B83] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white">
                {tr('Artigo para você','Article for you','Artículo para ti')}
              </span>
              <h3 className="mt-2 text-base font-extrabold leading-snug text-[#172B4D] sm:text-lg">
                {recommended.title[lang] || recommended.title.pt}
              </h3>
              <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#2878D0] group-hover:text-[#F51B83]">
                {tr('Ler no blog','Read on the blog','Leer en el blog')} <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </button>
        )}

        {/* Botão para Testar Outra Data */}
        <div className="text-center">
          <button
            type="button"
            onClick={onBackToForm}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#2878D0] hover:bg-[#F51B83] text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{tr('Colocar Outra Data de Nascimento','Enter Another Birth Date','Poner Otra Fecha de Nacimiento')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
