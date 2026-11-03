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
            className="text-xs sm:text-sm font-bold text-[#2878D0] hover:text-[#17366F] transition-colors cursor-pointer"
          >
            {tr('Ver Dicas no Blog →', 'See Tips on the Blog →', 'Ver Consejos en el Blog →')}
          </button>
        </div>

        {/* Hero */}
        <header className="relative mb-5 overflow-hidden rounded-[2rem] bg-[#2878D0] px-6 pb-9 pt-9 text-center text-white shadow-[0_14px_40px_rgba(23,54,111,0.18)] sm:px-10 sm:pb-11 sm:pt-11">
          <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-35"><CoverArt tone="blue" /></div>
          <div className="relative flex flex-col items-center">
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="h-3 w-3" />
              {tr('Resultado da Sua Data de Nascimento','Your Birth Date Result','Resultado de Tu Fecha de Nacimiento')}
            </span>
            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-[1.75rem] bg-white text-6xl font-black text-[#2878D0] shadow-xl ring-4 ring-white/25">
              {currentSign.symbol}{'\uFE0E'}
            </div>
            <p className="text-sm font-semibold text-white/85">{tr('Seu Signo é', 'Your Sign is', 'Tu Signo es')}</p>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              {currentSign.name[lang] || currentSign.name.pt}
            </h1>
            <span aria-hidden className="my-3 block h-1 w-12 rounded-full bg-[#F51B83]" />
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 font-semibold"><Calendar className="h-3.5 w-3.5" />{currentSign.period[lang] || currentSign.period.pt}</span>
              <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#2878D0]">
                {tr('Elemento', 'Element', 'Elemento')} {currentSign.element[lang] || currentSign.element.pt}
              </span>
            </div>
          </div>
        </header>

        {/* Essence + advice */}
        <div className="mb-5 grid gap-4 md:grid-cols-2">
          <section className="rounded-3xl border border-[#D9E8F8] bg-white p-6 shadow-md">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#2878D0] text-white"><Star className="h-5 w-5" /></span>
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#2878D0]">{tr('Sua Essência','Your Essence','Tu Esencia')}</h2>
            </div>
            <p className="text-base font-semibold leading-relaxed text-[#172B4D]">{currentSign.essence[lang] || currentSign.essence.pt}</p>
          </section>
          <section className="rounded-3xl bg-[#F51B83] p-6 text-white shadow-md">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#F51B83]"><Lightbulb className="h-5 w-5" /></span>
              <h2 className="text-xs font-extrabold uppercase tracking-wider">{tr('Dica Para Você','Tip For You','Consejo Para Ti')}</h2>
            </div>
            <p className="text-base font-semibold leading-relaxed">{currentSign.advice[lang] || currentSign.advice.pt}</p>
          </section>
        </div>

        {/* Artigo recomendado do signo */}
        {recommended && (
          <button
            type="button"
            onClick={() => onOpenArticle(recommended.id)}
            className="group mb-5 flex w-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-[#D9E8F8] bg-white text-left shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-[#F51B83]/30 sm:flex-row"
          >
            <img src={recommended.image} alt="" loading="lazy" className="h-40 w-full shrink-0 object-cover sm:h-auto sm:w-56" />
            <div className="flex flex-1 flex-col justify-center p-5 sm:p-6">
              <span className="inline-flex w-fit rounded-full bg-[#E4F1FF] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#2878D0]">
                {tr('Artigo para você','Article for you','Artículo para ti')}
              </span>
              <h3 className="mt-2 text-lg font-extrabold leading-snug text-[#172B4D] sm:text-xl">
                {recommended.title[lang] || recommended.title.pt}
              </h3>
              <span className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-[#F51B83] px-4 py-2 text-xs font-extrabold text-white transition-colors group-hover:bg-[#D9166F]">
                {tr('Ler no blog','Read on the blog','Leer en el blog')} <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </button>
        )}

        {/* Ações */}
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#2878D0] px-6 py-3 text-sm font-extrabold text-white shadow-sm transition-all hover:bg-[#17366F] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2878D0]/30 sm:w-auto"
          >
            {copied ? (
              <><Check className="h-4 w-4" /><span>{tr('Copiado com Sucesso!','Copied!','¡Copiado!')}</span></>
            ) : (
              <><Share2 className="h-4 w-4" /><span>{tr('Compartilhar Meu Signo','Share My Sign','Compartir Mi Signo')}</span></>
            )}
          </button>
          <button
            type="button"
            onClick={onBackToForm}
            className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-[#2878D0] bg-white px-6 py-2.5 text-sm font-extrabold text-[#2878D0] transition-all hover:bg-[#2878D0] hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2878D0]/30 sm:w-auto"
          >
            <RotateCcw className="h-4 w-4" />
            <span>{tr('Colocar Outra Data','Enter Another Date','Poner Otra Fecha')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
