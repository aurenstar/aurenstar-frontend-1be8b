import React, { useState } from 'react';
import {
  ArrowLeft,
  Sparkles,
  Star,
  BookOpen,
  Check,
  Share2,
  Calendar,
  RotateCcw,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
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
            <span>Fazer Outro Teste</span>
          </button>

          <button
            type="button"
            onClick={onNavigateToBlog}
            className="text-xs sm:text-sm font-bold text-[#2878D0] hover:text-[#17366F] transition-colors cursor-pointer"
          >
            Ver Dicas no Blog →
          </button>
        </div>

        {/* Hero do Resultado */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFFFF]/80 border border-[#D9E8F8] text-[#2878D0] text-xs font-bold uppercase tracking-wider mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#2878D0]" />
            <span>Resultado da Sua Data de Nascimento</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172B4D] tracking-tight mb-2">
            Seu Signo é {currentSign.name[lang] || currentSign.name.pt}
          </h1>

          <p className="text-sm text-[#647DA5]">
            Veja abaixo o significado simples do seu signo e dicas práticas para o seu dia a dia.
          </p>
        </div>

        {/* Card Principal do Signo */}
        <div className="bg-[#FFFFFF] rounded-3xl border border-[#D9E8F8] shadow-md hover:shadow-lg transition-all p-6 sm:p-8 mb-6 relative overflow-hidden">
          {/* Barra superior com degradê suave */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#2878D0] via-[#17366F] to-[#F51B83]" />

          {/* Cabeçalho do Card */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-[#D9E8F8]">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#E4F1FF] text-[#2878D0] flex items-center justify-center text-2xl font-black shadow-2xs">
                {currentSign.symbol}
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172B4D] tracking-tight">
                  {currentSign.name[lang] || currentSign.name.pt}
                </h2>
                <p className="text-xs text-[#647DA5] font-medium mt-0.5 flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-[#2878D0]" />
                  <span>{currentSign.period[lang] || currentSign.period.pt}</span>
                </p>
              </div>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${currentSign.elementColor} shadow-2xs`}
            >
              Elemento {currentSign.element[lang] || currentSign.element.pt}
            </span>
          </div>

          {/* Essência e Personalidade */}
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#2878D0] mb-2 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>Sua Essência e Jeito de Ser</span>
            </h3>
            <p className="text-sm sm:text-base text-[#172B4D] leading-relaxed font-normal bg-[#E4F1FF]/30 p-4 rounded-2xl border border-[#D9E8F8]">
              {currentSign.essence[lang] || currentSign.essence.pt}
            </p>
          </div>

          {/* Botões de Ação no Card */}
          <div className="space-y-3 pt-3 border-t border-[#D9E8F8]">
            {/* Botão de Compartilhar */}
            <button
              type="button"
              onClick={handleCopy}
              className="w-full py-3 px-4 rounded-2xl bg-[#2878D0] hover:bg-[#17366F] text-white font-extrabold text-xs sm:text-sm shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 group"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Copiado com Sucesso!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 transition-transform group-hover:scale-110" />
                  <span>Compartilhar Meu Signo</span>
                </>
              )}
            </button>

            {/* Ações Secundárias */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => onOpenArticle(currentSign.articleId)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#E4F1FF]/50 text-[#2878D0] border border-[#D9E8F8] text-xs font-bold transition-all cursor-pointer shadow-2xs"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Ler Artigo Especial</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelectSignFilter(signKey);
                  onBackToHome();
                  setTimeout(() => {
                    document.getElementById('blog')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#E4F1FF]/50 text-[#172B4D] border border-[#D9E8F8] text-xs font-bold transition-all cursor-pointer shadow-2xs"
              >
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Ver Posts de {currentSign.name[lang] || currentSign.name.pt}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Botão para Testar Outra Data */}
        <div className="text-center">
          <button
            type="button"
            onClick={onBackToForm}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white hover:bg-[#E4F1FF]/40 text-[#647DA5] border border-[#D9E8F8] text-xs sm:text-sm font-bold shadow-2xs transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-[#2878D0]" />
            <span>Colocar Outra Data de Nascimento</span>
          </button>
        </div>
      </div>
    </div>
  );
};
