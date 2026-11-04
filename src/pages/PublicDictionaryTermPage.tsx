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
  registerFullTerm,
} from '../data/astrologyDictionaryData';
import { CoverArt } from '../components/CoverArt';
import { TermIcon } from '../components/TermIcon';
import { onPlainClick } from '../utils/links';
import { useLanguage } from '../context/LanguageContext';
import { updateSeo } from '../utils/seo';
import { categoryLabel, localizeTerm } from '../data/astrologyDictionaryTranslations';

const COPY = {
  en: { home: 'Home', dict: 'Aurenstar Dictionary', seeAll: 'See All Terms', simple: 'A simple explanation, no technical words', copied: 'Link Copied!', share: 'Share This Page', what: 'What does it mean?', whatAstro: 'What does it mean in astrology?', example: 'A fictional everyday example:', want: 'Want to see how this affects your day today?', quick: 'Take a quick, free test in clear, simple language.', more: 'Explore more Aurenstar Dictionary terms on their own pages:', open: 'Open page', back: 'Back to the Full Dictionary', shareTitle: 'What does it mean in astrology?', itIs: 'What it is:', practice: 'In practice:', simpleEx: 'Simple example:', seeFull: 'See the full page, without difficult words, at:', faq: 'Common questions' },
  pt: { home: 'Início', dict: 'Dicionário Aurenstar', seeAll: 'Ver Todos os Termos', simple: 'Uma explicação simples, sem palavras técnicas', copied: 'Link Copiado!', share: 'Compartilhar Esta Página', what: 'O que significa?', whatAstro: 'O que significa na astrologia?', example: 'Um exemplo fictício do dia a dia:', want: 'Quer ver como isso afeta o seu dia hoje?', quick: 'Faça um teste rápido e gratuito, em linguagem simples e clara.', more: 'Explore mais termos do Dicionário Aurenstar, cada um na sua própria página:', open: 'Abrir página', back: 'Voltar ao Dicionário Completo', shareTitle: 'O que significa na astrologia?', itIs: 'O que é:', practice: 'Na prática:', simpleEx: 'Exemplo simples:', seeFull: 'Veja a página completa, sem palavras difíceis, em:', faq: 'Perguntas frequentes' },
  es: { home: 'Inicio', dict: 'Diccionario Aurenstar', seeAll: 'Ver Todos los Términos', simple: 'Una explicación sencilla, sin palabras técnicas', copied: '¡Enlace Copiado!', share: 'Compartir Esta Página', what: '¿Qué significa?', whatAstro: '¿Qué significa en astrología?', example: 'Un ejemplo ficticio del día a día:', want: '¿Quieres ver cómo esto afecta tu día de hoy?', quick: 'Haz una prueba rápida y gratuita, en un lenguaje claro y sencillo.', more: 'Explora más términos del Diccionario Aurenstar, cada uno en su propia página:', open: 'Abrir página', back: 'Volver al Diccionario Completo', shareTitle: '¿Qué significa en astrología?', itIs: 'Qué es:', practice: 'En la práctica:', simpleEx: 'Ejemplo sencillo:', seeFull: 'Mira la página completa, sin palabras difíciles, en:', faq: 'Preguntas frecuentes' },
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
  const baseTerm = getDictionaryTermBySlug(termSlug) || ASTROLOGY_DICTIONARY_TERMS[0];
  const term: DictionaryTerm = localizeTerm(baseTerm, lang);
  // Automatically written terms arrive light; fetch the full text (once) when their page opens.
  const isLight = !baseTerm.oQueSignifica;
  const [loadFailed, setLoadFailed] = useState(false);
  const [, setLoadedTick] = useState(0);
  useEffect(() => {
    if (!isLight) return;
    let stop = false;
    setLoadFailed(false);
    fetch(`/dictionary-data/${baseTerm.slug}.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('missing'))))
      .then((full: DictionaryTerm) => {
        if (stop) return;
        registerFullTerm(full);
        setLoadedTick((n) => n + 1);
        try { updateSeo('dicionario-termo', { termSlug: baseTerm.slug }); } catch { /* head stays as built */ }
      })
      .catch(() => { if (!stop) setLoadFailed(true); });
    return () => { stop = true; };
  }, [baseTerm.slug, isLight]);

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

  if (isLight) {
    return (
      <div className="w-full bg-[#C9E5FF] min-h-screen pt-24 sm:pt-28 pb-20 text-[#172B4D]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#D9E8F8]">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17366F]">{term.termo}</h1>
            <p className="mt-2 text-sm text-[#647DA5]">{term.resumoUmaLinha}</p>
            {loadFailed ? (
              <button type="button" onClick={onBackToDictionary} className="mt-6 px-4 py-2.5 rounded-full bg-[#E73578] text-white text-xs font-bold cursor-pointer">{c.back}</button>
            ) : (
              <div className="mt-6 space-y-3 animate-pulse" aria-hidden="true">
                <div className="h-4 rounded bg-[#E4F1FF]" /><div className="h-4 rounded bg-[#E4F1FF] w-11/12" /><div className="h-4 rounded bg-[#E4F1FF] w-9/12" />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

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
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3982C8] hover:text-[#17366F] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{c.seeAll}</span>
          </button>
        </div>

        {/* Cover-style header */}
        <header className="relative mb-8 overflow-hidden rounded-[2rem] bg-[#3982C8] p-6 text-white shadow-[0_14px_40px_rgba(23,54,111,0.18)] sm:p-10">
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 overflow-hidden sm:inset-y-0 sm:left-auto sm:right-0 sm:h-auto sm:w-2/5"><CoverArt tone="blue" /></div>
          <div className="relative flex flex-col gap-5 pb-14 sm:flex-row sm:items-center sm:pb-0 sm:pr-[34%]">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-white text-[#3982C8] shadow-lg"><TermIcon slug={term.slug} className="h-10 w-10" /></div>
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
                <span>{categoryLabel(term.categoria, lang)}</span>
              </div>
              <h1 className="text-2xl font-black leading-tight tracking-tight sm:text-4xl">{term.perguntaGoogle}</h1>
              <span aria-hidden className="mt-4 block h-1 w-12 rounded-full bg-[#E73578]" />
              <p className="mt-4 text-sm leading-relaxed text-white/90 sm:text-base">{term.resumoUmaLinha}</p>
            </div>
          </div>
        </header>

        {/* Card Principal da Explicação */}
        <article className="relative mb-8 overflow-hidden rounded-3xl border border-[#D9E8F8] bg-white p-6 shadow-md sm:p-10">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[#D9E8F8] pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3982C8] text-white shadow-sm"><TermIcon slug={term.slug} className="h-6 w-6" /></div>
              <div>
                <h2 className="text-xl font-black text-[#172B4D] sm:text-2xl">{term.termo}</h2>
                <span className="text-xs text-[#647DA5]">{c.simple}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#E73578] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#D0306C] active:scale-95"
            >
              {copied ? (<><Check className="h-3.5 w-3.5" /><span>{c.copied}</span></>) : (<><Share2 className="h-3.5 w-3.5" /><span>{c.share}</span></>)}
            </button>
          </div>

          {/* Bloco 1: O que significa? */}
          <section className="mb-6 p-5 sm:p-6 rounded-2xl bg-[#3982C8] text-white">
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white/90 mb-2.5 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-white" />
              <span>{c.what}</span>
            </h3>
            <p className="text-sm sm:text-base text-white leading-relaxed font-medium">
              {term.oQueSignifica}
            </p>
          </section>

          {/* Bloco 2: O que isso significa na astrologia? */}
          <section className="mb-6 p-5 sm:p-6 rounded-2xl bg-[#E73578] text-white">
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white/90 mb-2.5 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-white" />
              <span>{c.whatAstro}</span>
            </h3>
            <p className="text-sm sm:text-base text-white leading-relaxed font-medium">
              {term.oQueSignificaNaAstrologia}
            </p>
          </section>

          {/* Bloco 3: Exemplo fictício do dia a dia */}
          <section className="mb-6 p-5 sm:p-6 rounded-2xl bg-[#E4F1FF] border border-[#D9E8F8]">
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#17366F] mb-2.5 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-[#17366F]" />
              <span>{c.example}</span>
            </h3>
            <p className="text-sm sm:text-base text-[#172B4D] leading-relaxed font-normal italic">
              {`"${term.exemploFicticio.replace(/^["“]|["”]$/g, '')}"`}
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
                className="px-4 py-2.5 rounded-full bg-[#E73578] hover:bg-[#D0306C] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-2 shrink-0 active:scale-95"
              >
                <span>{term.ferramentaRelacionada.nome}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </article>

        {/* Questions and answers: shown to everyone (the same text is in the page's FAQ data for search engines) */}
        {term.faq && term.faq.length > 0 && (
          <section className="mb-10" aria-label={c.faq}>
            <h2 className="text-base font-extrabold text-[#17366F] mb-4">{c.faq}</h2>
            <div className="space-y-3">
              {term.faq.map((f, i) => (
                <div key={i} className="rounded-2xl bg-white border border-[#D9E8F8] p-4 sm:p-5">
                  <h3 className="text-sm sm:text-base font-bold text-[#17366F] mb-1">{f.pergunta}</h3>
                  <p className="text-sm text-[#647DA5] leading-relaxed">{f.resposta}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Termos Relacionados */}
        {relatedTerms.length > 0 && (
          <div className="mb-12">
            <h3 className="text-base font-extrabold text-[#17366F] mb-4 flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#3982C8]" />
              <span>{c.more}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {relatedTerms.map((rel, ri) => {
                const pink = ri % 2 === 1;
                return (
                  <a
                    key={rel.id}
                    href={`/dicionario/${rel.slug}`}
                    onClick={onPlainClick(() => onSelectTerm(rel.slug))}
                    className="group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl p-4 text-left text-white shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
                    style={{ background: pink ? '#E73578' : '#3982C8' }}
                  >
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 overflow-hidden opacity-70"><CoverArt tone={pink ? 'pink' : 'blue'} variant={ri} /></div>
                    <div className="relative">
                      <div className="mb-2 flex items-center gap-2.5">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm" style={{ color: pink ? '#E73578' : '#3982C8' }}><TermIcon slug={rel.slug} className="h-5 w-5" /></span>
                        <span className="text-sm font-extrabold leading-snug">{rel.termo}</span>
                      </div>
                      <p className="mb-14 line-clamp-2 text-[12px] leading-relaxed text-white/90">{rel.resumoUmaLinha}</p>
                    </div>
                    <div className="relative -mt-10 flex items-center gap-1.5 text-[11px] font-bold">
                      <span className="rounded-full bg-white px-3 py-1" style={{ color: pink ? '#E73578' : '#3982C8' }}>{c.open}</span>
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* Botão de Retorno ao Catálogo do Dicionário */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onBackToDictionary}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#3982C8] hover:bg-[#E73578] text-white border border-transparent text-xs sm:text-sm font-bold shadow-2xs transition-all cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>{c.back}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

