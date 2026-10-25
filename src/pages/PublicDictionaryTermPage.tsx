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
  const term: DictionaryTerm =
    getDictionaryTermBySlug(termSlug) || ASTROLOGY_DICTIONARY_TERMS[0];

  const [copied, setCopied] = useState(false);

  // SEO Dynamic Title and Structured Data
  useEffect(() => {
    if (term) {
      document.title = `${term.tituloSEO} | Aurenstar Dictionary`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', term.resumoUmaLinha);
      }

      // Inject Schema.org DefinedTerm structured data for Google SEO
      const scriptId = 'schema-dictionary-term';
      let script = document.getElementById(scriptId) as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }

      const schemaData = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'DefinedTerm',
            name: term.termo,
            description: term.oQueSignifica,
            inDefinedTermSet: {
              '@type': 'DefinedTermSet',
              name: 'Aurenstar Dictionary',
              url: `${window.location.origin}/#/dicionario`,
            },
          },
        ],
      };

      script.textContent = JSON.stringify(schemaData);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      const script = document.getElementById('schema-dictionary-term');
      if (script) {
        script.remove();
      }
    };
  }, [term]);

  // Termos relacionados
  const relatedTerms = (term.termosRelacionados || [])
    .map((slug) => getDictionaryTermBySlug(slug))
    .filter((t): t is DictionaryTerm => Boolean(t));

  const pageUrl = `${window.location.origin}/#/dicionario/${term.slug}`;

  const handleShare = () => {
    const text =
      `📖 *${term.termo}* — O que significa na Astrologia?\n\n` +
      `🌍 *O que é:* ${term.oQueSignifica}\n\n` +
      `✨ *Na prática:* ${term.oQueSignificaNaAstrologia}\n\n` +
      `💡 *Exemplo simples:* "${term.exemploFicticio}"\n\n` +
      `Veja a página completa sem palavras difíceis em: ${pageUrl}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full bg-[#C9E5FF] min-h-screen pt-24 sm:pt-28 pb-20 select-none animate-fadeIn text-[#172B4D]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Navigation Toolbar & Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-4 border-b border-[#D9E8F8]">
          <nav aria-label="Navegação estrutural" className="flex items-center gap-1.5 sm:gap-2 text-xs text-[#647DA5]">
            <button
              type="button"
              onClick={onBackToHome}
              className="hover:text-[#172B4D] transition-colors cursor-pointer"
            >
              Início
            </button>
            <ChevronRight className="w-3 h-3 text-[#647DA5]" />
            <button
              type="button"
              onClick={onBackToDictionary}
              className="hover:text-[#172B4D] transition-colors cursor-pointer"
            >
              Aurenstar Dictionary
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
            <span>Ver Todas as Palavras</span>
          </button>
        </div>

        {/* SEO Article Header */}
        <header className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E4F1FF] border border-[#D9E8F8] text-[#2878D0] text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
            <span className="text-sm">{term.icone}</span>
            <span>{term.categoria}</span>
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
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#2878D0] via-[#17366F] to-[#F51B83]" />

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
                  Explicação descomplicada e sem palavras técnicas
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#2878D0] hover:bg-[#17366F] text-white text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Link Copiado com Sucesso!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Compartilhar Essa Página</span>
                </>
              )}
            </button>
          </div>

          {/* Bloco 1: O que significa? */}
          <section className="mb-6 p-5 sm:p-6 rounded-2xl bg-[#E4F1FF]/30 border border-[#D9E8F8]">
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#2878D0] mb-2.5 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#2878D0]" />
              <span>O que significa?</span>
            </h3>
            <p className="text-sm sm:text-base text-[#172B4D] leading-relaxed font-normal">
              {term.oQueSignifica}
            </p>
          </section>

          {/* Bloco 2: O que isso significa na astrologia? */}
          <section className="mb-6 p-5 sm:p-6 rounded-2xl bg-[#FFE0EF]/30 border border-[#FFE0EF]">
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#F51B83] mb-2.5 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F51B83]" />
              <span>O que isso significa na astrologia?</span>
            </h3>
            <p className="text-sm sm:text-base text-[#172B4D] leading-relaxed font-normal">
              {term.oQueSignificaNaAstrologia}
            </p>
          </section>

          {/* Bloco 3: Exemplo fictício do dia a dia */}
          <section className="mb-6 p-5 sm:p-6 rounded-2xl bg-[#E4F1FF]/40 border border-[#D9E8F8]">
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#17366F] mb-2.5 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-[#17366F]" />
              <span>Exemplo fictício do dia a dia:</span>
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
                  Quer ver como isso afeta o seu dia hoje?
                </span>
                <span className="text-xs text-[#647DA5]">
                  Faça um teste rápido e gratuito com linguagem clara e direta.
                </span>
              </div>
              <button
                type="button"
                onClick={() => onNavigateToTool(term.ferramentaRelacionada!.rota)}
                className="px-4 py-2.5 rounded-xl bg-[#2878D0] hover:bg-[#17366F] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-2 shrink-0 active:scale-95"
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
              <span>Explore more Aurenstar Dictionary terms on their own pages:</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {relatedTerms.map((rel) => (
                <a
                  key={rel.id}
                  href={`#/dicionario/${rel.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectTerm(rel.slug);
                  }}
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
                    <span>Abrir página</span>
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
            <span>Voltar ao Índice Completo de Palavras</span>
          </button>
        </div>
      </div>
    </div>
  );
};

