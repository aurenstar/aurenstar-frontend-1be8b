import React, { useState, useMemo } from 'react';
import {
  Search,
  BookOpen,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import {
  ASTROLOGY_DICTIONARY_TERMS,
} from '../data/astrologyDictionaryData';
import { onPlainClick } from '../utils/links';
import { useLanguage } from '../context/LanguageContext';
import { categoryLabel, localizeTerm } from '../data/astrologyDictionaryTranslations';
import { CoverArt } from '../components/CoverArt';

const COPY = {
  en: { back: 'Back to Home', tag: 'Astrology Made Simple', title: 'Aurenstar Dictionary', intro: 'Tap the word you are curious about to open its full page with a simple explanation, the practical meaning and fun everyday examples.', placeholder: 'Type the term you want to understand... (e.g., Mercury retrograde, Rising sign, Full Moon)', clear: 'Clear', categories: 'Categories:', all: 'All', showing: 'Showing', one: 'meaning page', many: 'meaning pages', seeAll: 'See all terms', none: 'No terms found', tryText: 'Try searching for "Mercury", "Rising", "Moon", "Venus" or "Houses".', clearSearch: 'Clear Search', read: 'Read the full explanation' },
  pt: { back: 'Voltar ao Início', tag: 'Astrologia Simples', title: 'Dicionário Aurenstar', intro: 'Toque na palavra que você quer entender para abrir a página completa, com uma explicação simples, o significado prático e exemplos divertidos do dia a dia.', placeholder: 'Digite o termo que você quer entender... (ex.: Mercúrio retrógrado, Ascendente, Lua Cheia)', clear: 'Limpar', categories: 'Categorias:', all: 'Todas', showing: 'Mostrando', one: 'página de significado', many: 'páginas de significado', seeAll: 'Ver todos os termos', none: 'Nenhum termo encontrado', tryText: 'Tente procurar por "Mercúrio", "Ascendente", "Lua", "Vênus" ou "Casas".', clearSearch: 'Limpar busca', read: 'Ler a explicação completa' },
  es: { back: 'Volver al Inicio', tag: 'Astrología Simple', title: 'Diccionario Aurenstar', intro: 'Toca la palabra que quieres entender para abrir su página completa, con una explicación sencilla, el significado práctico y ejemplos divertidos del día a día.', placeholder: 'Escribe el término que quieres entender... (ej.: Mercurio retrógrado, Ascendente, Luna Llena)', clear: 'Borrar', categories: 'Categorías:', all: 'Todas', showing: 'Mostrando', one: 'página de significado', many: 'páginas de significado', seeAll: 'Ver todos los términos', none: 'No se encontraron términos', tryText: 'Prueba buscando "Mercurio", "Ascendente", "Luna", "Venus" o "Casas".', clearSearch: 'Borrar búsqueda', read: 'Leer la explicación completa' },
} as const;

interface PublicDictionaryPageProps {
  onBackToHome: () => void;
  onSelectTerm: (slug: string) => void;
  onNavigateToTool?: (tool: 'daily-message' | 'aureneffect' | 'discover-sign') => void;
}

export const PublicDictionaryPage: React.FC<PublicDictionaryPageProps> = ({
  onBackToHome,
  onSelectTerm,
}) => {
  const { language } = useLanguage();
  const lang = (language || 'en') as 'en' | 'pt' | 'es';
  const c = COPY[lang];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Planets & Bodies',
    'Chart Concepts',
    'Signs & Elements',
    'Phases & Movements',
  ];

  const filteredTerms = useMemo(() => {
    return ASTROLOGY_DICTIONARY_TERMS.map((raw) => localizeTerm(raw, lang)).filter((item) => {
      const query = searchTerm.toLowerCase();
      const matchesSearch =
        item.termo.toLowerCase().includes(query) ||
        item.resumoUmaLinha.toLowerCase().includes(query) ||
        (item.explicacaoEducativa && item.explicacaoEducativa.toLowerCase().includes(query)) ||
        item.oQueSignifica.toLowerCase().includes(query) ||
        item.oQueSignificaNaAstrologia.toLowerCase().includes(query);

      const matchesCat =
        selectedCategory === 'All' || item.categoria === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [searchTerm, selectedCategory, lang]);

  return (
    <div className="w-full bg-[#C9E5FF] min-h-screen pt-24 sm:pt-28 pb-20 select-none animate-fadeIn text-[#172B4D]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Navigation Toolbar */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#D9E8F8]">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#647DA5] hover:text-[#172B4D] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>{c.back}</span>
          </button>
        </div>

        {/* Hero panel: same artwork language as the Aurenstar profile cover */}
        <div className="relative mb-8 overflow-hidden rounded-[2rem] bg-[#3982C8] p-6 text-white shadow-[0_14px_40px_rgba(23,54,111,0.18)] sm:p-10">
          <div className="pointer-events-none absolute inset-0"><CoverArt tone="blue" /></div>
          <div className="relative max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
              <BookOpen className="h-3.5 w-3.5" />
              <span>{c.tag}</span>
            </div>
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">{c.title}</h1>
            <span aria-hidden className="mt-4 block h-1 w-12 rounded-full bg-[#E73578]" />
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/90 sm:text-base">{c.intro}</p>
          </div>

          {/* Search */}
          <div className="relative mt-7 max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#647DA5]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={c.placeholder}
              className="w-full rounded-2xl border-2 border-transparent bg-white py-3.5 pl-12 pr-20 text-sm font-medium text-[#172B4D] shadow-md outline-none placeholder:text-[#647DA5]/70 focus:border-[#E73578] sm:text-base"
            />
            {searchTerm && (
              <button type="button" onClick={() => setSearchTerm('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer p-1 text-xs font-bold text-[#647DA5] hover:text-[#172B4D]">
                {c.clear}
              </button>
            )}
          </div>

          {/* Category filters */}
          <div className="relative mt-4 flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                    isSelected ? 'bg-[#E73578] text-white shadow-md' : 'bg-white/15 text-white hover:bg-white hover:text-[#3982C8]'
                  }`}
                >
                  {cat === 'All' ? c.all : categoryLabel(cat as Parameters<typeof categoryLabel>[0], lang)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Counter */}
        <div className="flex items-center justify-between mb-6 text-xs text-[#647DA5] font-medium px-2">
          <span>
            {c.showing} <strong className="text-[#172B4D]">{filteredTerms.length}</strong> {filteredTerms.length === 1 ? c.one : c.many}
          </span>
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
              className="text-[#3982C8] font-bold hover:underline cursor-pointer"
            >
              {c.seeAll}
            </button>
          )}
        </div>

        {/* Terms Catalog (Cards Grid) */}
        {filteredTerms.length === 0 ? (
          <div className="bg-[#FFFFFF] rounded-3xl border border-[#D9E8F8] p-12 text-center shadow-xs">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3982C8] text-white"><Search className="h-6 w-6" /></div>
            <h3 className="text-lg font-bold text-[#172B4D] mb-1">{c.none}</h3>
            <p className="text-xs text-[#647DA5] max-w-sm mx-auto mb-4">
              {c.tryText}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
              className="px-5 py-2.5 rounded-xl bg-[#3982C8] text-white text-xs font-bold cursor-pointer hover:bg-[#17366F] transition-colors"
            >
              {c.clearSearch}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredTerms.map((term) => {
              return (
                <a
                  key={term.id}
                  href={`/dicionario/${term.slug}`}
                  onClick={onPlainClick(() => onSelectTerm(term.slug))}
                  className="group flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-[#D9E8F8] bg-white p-3 text-left shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_36px_rgba(23,54,111,0.18)]"
                >
                  <span className="flex flex-1 flex-col px-3 pb-2 pt-3">
                    <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#647DA5]">{categoryLabel(term.categoria, lang)}</span>
                    <h3 className="mb-3 self-start rounded-full bg-[#E4F1FF] px-4 py-1.5 text-base font-extrabold leading-snug text-[#17366F] transition-colors group-hover:bg-[#3982C8] group-hover:text-white">{term.termo}</h3>
                    <span className="mb-4 block text-[13px] font-medium leading-relaxed text-[#647DA5]">{term.chamadaCuriosa || term.resumoUmaLinha}</span>
                    <span className="mt-auto inline-flex items-center gap-2 self-start rounded-full px-4 py-1.5 text-xs font-bold text-white shadow-sm transition-all duration-300 group-hover:gap-3" style={{ background: '#3982C8' }}>
                      {c.read} <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </span>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

