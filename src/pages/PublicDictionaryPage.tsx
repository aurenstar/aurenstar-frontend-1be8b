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

interface PublicDictionaryPageProps {
  onBackToHome: () => void;
  onSelectTerm: (slug: string) => void;
  onNavigateToTool?: (tool: 'daily-message' | 'aureneffect' | 'discover-sign') => void;
}

export const PublicDictionaryPage: React.FC<PublicDictionaryPageProps> = ({
  onBackToHome,
  onSelectTerm,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

  const categories = [
    'Todas',
    'Planetas & Astros',
    'Conceitos do Mapa',
    'Signos & Elementos',
    'Fases & Movimentos',
  ];

  const filteredTerms = useMemo(() => {
    return ASTROLOGY_DICTIONARY_TERMS.filter((item) => {
      const query = searchTerm.toLowerCase();
      const matchesSearch =
        item.termo.toLowerCase().includes(query) ||
        item.resumoUmaLinha.toLowerCase().includes(query) ||
        (item.explicacaoEducativa && item.explicacaoEducativa.toLowerCase().includes(query)) ||
        item.oQueSignifica.toLowerCase().includes(query) ||
        item.oQueSignificaNaAstrologia.toLowerCase().includes(query);

      const matchesCat =
        selectedCategory === 'Todas' || item.categoria === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [searchTerm, selectedCategory]);

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
            <span>Voltar ao Início</span>
          </button>
        </div>

        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFFFF]/80 border border-[#D9E8F8] text-[#2878D0] text-xs font-bold uppercase tracking-wider mb-3 shadow-2xs">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Enciclopédia Descomplicada</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#172B4D] tracking-tight mb-3 leading-tight">
            Aurenstar Dictionary
          </h1>

          <p className="text-sm sm:text-base text-[#647DA5] leading-relaxed max-w-2xl mx-auto">
            Clique na palavra que você tem dúvida para abrir a **página completa** com a explicação simples,
            o significado prático e exemplos divertidos do dia a dia.
          </p>
        </div>

        {/* Search & Categories Filter Card */}
        <div className="bg-[#FFFFFF] rounded-3xl border border-[#D9E8F8] shadow-sm p-5 sm:p-7 mb-8 relative overflow-hidden">
          {/* Subtle top gradient line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#2878D0] via-[#17366F] to-[#F51B83]" />

          {/* Search Input */}
          <div className="relative mb-5">
            <Search className="w-5 h-5 text-[#647DA5] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Digite o termo que você quer entender... (ex: Mercúrio retrógrado, Ascendente, Lua Cheia)"
              className="w-full pl-12 pr-4 py-3.5 bg-[#E4F1FF]/30 border border-[#D9E8F8] rounded-2xl text-sm sm:text-base text-[#172B4D] placeholder:text-[#647DA5]/60 font-medium outline-none focus:border-[#2878D0] focus:bg-white focus:ring-2 focus:ring-[#2878D0]/15 transition-all shadow-2xs"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#647DA5] hover:text-[#172B4D] p-1 cursor-pointer"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Category Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#D9E8F8]">
            <span className="text-xs font-bold text-[#647DA5] mr-1 hidden sm:inline">
              Categorias:
            </span>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#2878D0] text-white shadow-2xs scale-[1.02]'
                      : 'bg-[#E4F1FF]/40 text-[#647DA5] border border-[#D9E8F8] hover:border-[#2878D0]/50 hover:bg-white'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Counter */}
        <div className="flex items-center justify-between mb-6 text-xs text-[#647DA5] font-medium px-2">
          <span>
            Mostrando <strong className="text-[#172B4D]">{filteredTerms.length}</strong> páginas exclusivas de significados
          </span>
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('Todas');
              }}
              className="text-[#2878D0] font-bold hover:underline cursor-pointer"
            >
              Ver todas as palavras
            </button>
          )}
        </div>

        {/* Terms Catalog (Cards Grid) */}
        {filteredTerms.length === 0 ? (
          <div className="bg-[#FFFFFF] rounded-3xl border border-[#D9E8F8] p-12 text-center shadow-xs">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-lg font-bold text-[#172B4D] mb-1">Nenhum termo encontrado</h3>
            <p className="text-xs text-[#647DA5] max-w-sm mx-auto mb-4">
              Tente buscar por "Mercúrio", "Ascendente", "Lua", "Vênus" ou "Casas".
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('Todas');
              }}
              className="px-5 py-2.5 rounded-xl bg-[#2878D0] text-white text-xs font-bold cursor-pointer hover:bg-[#17366F] transition-colors"
            >
              Limpar Busca
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredTerms.map((term) => (
              <a
                key={term.id}
                href={`#/dicionario/${term.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectTerm(term.slug);
                }}
                className="bg-[#FFFFFF] rounded-3xl border border-[#D9E8F8] hover:border-[#2878D0]/50 shadow-sm hover:shadow-md transition-all p-5 sm:p-6 flex flex-col justify-between cursor-pointer group hover:-translate-y-0.5 text-left block"
              >
                <div>
                  {/* Top Bar inside card */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-2xl">{term.icone}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#E4F1FF] text-[#2878D0]">
                      {term.categoria}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-extrabold text-[#172B4D] group-hover:text-[#2878D0] transition-colors leading-snug mb-2">
                    {term.termo}
                  </h3>

                  {/* Resumo curto e convite natural para abrir o significado */}
                  <p className="text-xs sm:text-[13px] leading-relaxed mb-3 group-hover:text-[#172B4D] transition-colors font-medium">
                    <span className="block text-[#172B4D] font-semibold text-xs sm:text-[13.5px] leading-snug mb-2.5 group-hover:text-[#2878D0] transition-colors">
                      {term.chamadaCuriosa || term.resumoUmaLinha}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-[#2878D0] group-hover:text-[#17366F] transition-colors">
                      <span className="underline decoration-[#2878D0]/30 underline-offset-2">Ver explicação completa</span>
                      <span className="text-xs transition-transform group-hover:translate-x-1 font-black">→</span>
                    </span>
                  </p>
                </div>

                {/* Bottom Action Link */}
                <div className="pt-3 border-t border-[#D9E8F8] flex items-center justify-end text-xs font-bold text-[#2878D0]">
                  <div className="w-7 h-7 rounded-full bg-[#E4F1FF] group-hover:bg-[#2878D0] text-[#2878D0] group-hover:text-white flex items-center justify-center transition-colors shadow-2xs">
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

