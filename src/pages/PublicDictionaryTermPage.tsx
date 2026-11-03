import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Share2,
  Check,
  Sparkles,
  HelpCircle,
  Lightbulb,
  Compass,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import {
  DictionaryTerm,
  ASTROLOGY_DICTIONARY_TERMS,
  getDictionaryTermBySlug,
} from '../data/astrologyDictionaryData';
import { onPlainClick } from '../utils/links';
import { useLanguage } from '../context/LanguageContext';
import { categoryLabel, localizeTerm } from '../data/astrologyDictionaryTranslations';

const COPY = {
  en: { home: 'Home', dict: 'Aurenstar Dictionary', seeAll: 'See All Terms', simple: 'A simple explanation, no technical words', copied: 'Link Copied!', share: 'Share This Page', what: 'What does it mean?', whatAstro: 'What does it mean in astrology?', example: 'A fictional everyday example:', want: 'Want to see how this affects your day today?', quick: 'Take a quick, free test in clear, simple language.', more: 'Explore more Aurenstar Dictionary terms on their own pages:', open: 'Open page', back: 'Back to the Full Dictionary', shareTitle: 'What does it mean in astrology?', itIs: 'What it is:', practice: 'In practice:', simpleEx: 'Simple example:', seeFull: 'See the full page, without difficult words, at:' },
  pt: { home: 'Início', dict: 'Dicionário Aurenstar', seeAll: 'Ver Todos os Termos', simple: 'Uma explicação simples, sem palavras técnicas', copied: 'Link Copiado!', share: 'Compartilhar Esta Página', what: 'O que significa?', whatAstro: 'O que significa na astrologia?', example: 'Um exemplo fictício do dia a dia:', want: 'Quer ver como isso afeta o seu dia hoje?', quick: 'Faça um teste rápido e gratuito, em linguagem simples e clara.', more: 'Explore mais termos do Dicionário Aurenstar, cada um na sua própria página:', open: 'Abrir página', back: 'Voltar ao Dicionário Completo', shareTitle: 'O que significa na astrologia?', itIs: 'O que é:', practice: 'Na prática:', simpleEx: 'Exemplo simples:', seeFull: 'Veja a página completa, sem palavras difíceis, em:' },
  es: { home: 'Inicio', dict: 'Diccionario Aurenstar', seeAll: 'Ver Todos los Términos', simple: 'Una explicación sencilla, sin palabras técnicas', copied: '¡Enlace Copiado!', share: 'Compartir Esta Página', what: '¿Qué significa?', whatAstro: '¿Qué significa en astrología?', example: 'Un ejemplo ficticio del día a día:', want: '¿Quieres ver cómo esto afecta tu día de hoy?', quick: 'Haz una prueba rápida y gratuita, en un lenguaje claro y sencillo.', more: 'Explora más términos del Diccionario Aurenstar, cada uno en su propia página:', open: 'Abrir página', back: 'Volver al Diccionario Completo', shareTitle: '¿Qué significa en astrología?', itIs: 'Qué es:', practice: 'En la práctica:', simpleEx: 'Ejemplo sencillo:', seeFull: 'Mira la página completa, sin palabras difíciles, en:' },
} as const;

interface PublicDictionaryTermPageProps {
  termSlug: string;
  onBackToDictionary: () => void;
  onBackToHome: () => void;
  onSelectTerm: (slug: string) => void;
  onNavigateToTool: (tool: 'daily-message' | 'aureneffect' | 'discover-sign') => void;
}

export const PublicDictionaryTermPage: React.FC<PublicDictionaryTermPageProps> = ({
  termSlug,
  onBackToDictionary,
  onBackToHome,
  onSelectTerm,
  onNavigateToTool,
}) => {
  const { language } = useLanguage();
  const lang = (language || 'en') as 'en' | 'pt' | 'es';
  const c = COPY[lang];
  const term: DictionaryTerm = localizeTerm(
    getDictionaryTermBySlug(termSlug) || ASTROLOGY_DICTIONARY_TERMS[0],
    lang,
  );

  const [copied, setCopied] = useState(false);

  // Title, description and structured data come from src/utils/seoData.ts (applied by App.tsx).
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [termSlug]);

  // Termos relacionados
  const relatedTerms = (term.termosRelacionados || [])
    .map((slug) => getDictionaryTermBySlug(slug))
    .filter((t): t is DictionaryTerm => Boolean(t))
    .map((t) => localizeTerm(t, lang));

  const pageUrl = `${window.location.origin}/dicionario/${term.slug}`;

  const handleShare = () => {
    const text =
      `📖 *${term.termo}* — ${c.shareTitle}\n\n` +
      `🌍 *${c.itIs}* ${term.oQueSignifica}\n\n` +
      `✨ *${c.practice}* ${term.oQueSignificaNaAstrologia}\n\n` +
      `💡 *${c.simpleEx}* "${term.exemploFicticio}"\n\n` +
      `${c.seeFull} ${pageUrl}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full bg-[#C9E5FF] min-h-screen pt-24 sm:pt-28 pb-20 select-none animate-fadeIn text-[#172B4D]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Navigation Toolbar & Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-4 border-b border-[#D9E8F8]">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 sm:gap-2 text-xs text-[#647DA5]">
            <button
              type="button"
              onClick={onBackToHome}
              className="hover:text-[#172B4D] transition-colors cursor-pointer"
            >
              {c.home}
            </button>
            <ChevronRight className="w-3 h-3 text-[#647DA5]" />
            <button
              type="button"
              onClick={onBackToDictionary}
              className="hover:text-[#172B4D] transition-colors cursor-pointer"
            >
              {c.dict}
            </button>
            <ChevronRight className="w-3 h-3 text-[#647DA5]" />
            <span className="font-bold text-[#172B4D] truncate max-w-[140px] sm:max-w-xs">
              {term.termo}
            </span>
          </nav>

          <button
            type="button"
            onClick={onBackToDictionary}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2878D0] hover:text-[#17366F] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{c.seeAll}</span>
          </button>
        </div>

        {/* SEO Article Header */}
        <header className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E4F1FF] border border-[#D9E8F8] text-[#2878D0] text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
            <span className="text-sm">{term.icone}</span>
            <span>{categoryLabel(term.categoria, lang)}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#172B4D] tracking-tight mb-4 leading-tight">
            {term.perguntaGoogle}
          </h1>

          <p className="text-sm sm:text-base text-[#647DA5] leading-relaxed max-w-2xl mx-auto font-normal">
            {term.resumoUmaLinha}
          </p>
        </header>

        {/* Card Principal da Explicação */}
        <article className="bg-[#FFFFFF] rounded-3xl border border-[#D9E8F8] shadow-md hover:shadow-lg transition-all p-6 sm:p-10 mb-8 relative overflow-hidden">
          {/* Barra sutil colorida no topo */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#2878D0]" />

          {/* Cabeçalho do Card com Nome e Ação de Compartilhar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-[#D9E8F8]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#E4F1FF] text-[#2878D0] flex items-center justify-center text-3xl font-black shadow-2xs">
                {term.icone}
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#172B4D]">
                  {term.termo}
                </h2>
                <span className="text-xs text-[#647DA5]">
                  {c.simple}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#2878D0] hover:bg-[#F51B83] text-white text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>{c.copied}</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{c.share}</span>
                </>
              )}
            </button>
          </div>

          {/* Bloco 1: O que significa? */}
          <section className="mb-6 p-5 sm:p-6 rounded-2xl bg-[#E4F1FF]/30 border border-[#D9E8F8]">
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#2878D0] mb-2.5 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#2878D0]" />
              <span>{c.what}</span>
            </h3>
            <p className="text-sm sm:text-base text-[#172B4D] leading-relaxed font-normal">
              {term.oQueSignifica}
            </p>
          </section>

          {/* Bloco 2: O que isso significa na astrologia? */}
          <section className="mb-6 p-5 sm:p-6 rounded-2xl bg-[#FFE0EF]/30 border border-[#FFE0EF]">
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#F51B83] mb-2.5 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F51B83]" />
              <span>{c.whatAstro}</span>
            </h3>
            <p className="text-sm sm:text-base text-[#172B4D] leading-relaxed font-normal">
              {term.oQueSignificaNaAstrologia}
            </p>
          </section>

          {/* Bloco 3: Exemplo fictício do dia a dia */}
          <section className="mb-6 p-5 sm:p-6 rounded-2xl bg-[#E4F1FF]/40 border border-[#D9E8F8]">
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#17366F] mb-2.5 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-[#17366F]" />
              <span>{c.example}</span>
            </h3>
            <p className="text-sm sm:text-base text-[#172B4D] leading-relaxed font-normal italic">
              "{term.exemploFicticio}"
            </p>
          </section>


          {/* Ferramenta Recomendada Direta */}
          {term.ferramentaRelacionada && (
            <div className="mt-8 pt-6 border-t border-[#D9E8F8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-[#172B4D] block">
                  {c.want}
                </span>
                <span className="text-xs text-[#647DA5]">
                  {c.quick}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onNavigateToTool(term.ferramentaRelacionada!.rota)}
                className="px-4 py-2.5 rounded-full bg-[#2878D0] hover:bg-[#F51B83] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-2 shrink-0 active:scale-95"
              >
                <span>{term.ferramentaRelacionada.nome}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </article>

        {/* Termos Relacionados */}
        {relatedTerms.length > 0 && (
          <div className="mb-12">
            <h3 className="text-base font-extrabold text-[#17366F] mb-4 flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#2878D0]" />
              <span>{c.more}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {relatedTerms.map((rel) => (
                <a
                  key={rel.id}
                  href={`/dicionario/${rel.slug}`}
                  onClick={onPlainClick(() => onSelectTerm(rel.slug))}
                  className="p-4 bg-white hover:bg-[#E4F1FF]/30 border border-[#D9E8F8] hover:border-[#2878D0]/40 rounded-2xl shadow-xs transition-all text-left cursor-pointer group flex flex-col justify-between block"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{rel.icone}</span>
                      <span className="font-extrabold text-xs sm:text-sm text-[#172B4D] group-hover:text-[#2878D0] transition-colors">
                        {rel.termo}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#647DA5] line-clamp-2 leading-relaxed mb-3">
                      {rel.resumoUmaLinha}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#D9E8F8] flex items-center justify-between text-[11px] font-bold text-[#2878D0]">
                    <span>{c.open}</span>
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Botão de Retorno ao Catálogo do Dicionário */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onBackToDictionary}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#E4F1FF] hover:bg-[#F51B83] text-[#2878D0] hover:text-white border border-[#D9E8F8] hover:border-[#F51B83] text-xs sm:text-sm font-bold shadow-2xs transition-all cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-[#2878D0]" />
            <span>{c.back}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

