import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, Sparkles, Star, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { BLOG_ARTICLES, AURENSTAR_AVATAR } from '../data/blogArticles';
import { ZODIAC_SIGNS } from './BrandMarquee';
import { ScrollReveal } from './ScrollReveal';
import { SaveArticleButton } from './SaveArticleButton';
import { getArticleSlugById } from '../utils/articleSlug';
import { cardLinkClick } from '../utils/links';

interface BlogCardsSectionProps {
  onOpenArticle?: (id: string) => void;
  selectedSign?: string | null;
  onSelectSign?: (signKey: string | null) => void;
}

// Three-card carousel keeps the original card size and adds a smooth horizontal transition.
export const BlogCardsSection: React.FC<BlogCardsSectionProps> = ({
  onOpenArticle,
  selectedSign,
  onSelectSign,
}) => {
  const { language } = useLanguage();
  const lang = (language || 'pt') as 'pt' | 'en' | 'es';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Find info about the currently selected sign
  const activeSignInfo = useMemo(() => {
    if (!selectedSign) return null;
    return ZODIAC_SIGNS.find((s) => s.key === selectedSign) || null;
  }, [selectedSign]);

  const texts = {
    en: {
      sectionTitle: 'TRENDING ARTICLES',
      readMore: 'Read Article',
      searchPlaceholder: 'Search articles by title or keyword...',
      allCategories: 'All',
      clearSign: 'Clear Sign Filter',
      signBannerTitle: (signName: string, symbol: string) =>
        `Personalized Posts for ${signName} ${symbol}`,
      signBannerDesc:
        'We selected heartfelt advice, reflections, and guidance tailored to your zodiac energy.',
      resultsCount: (count: number) =>
        count === 1 ? '1 article' : `${count} articles`,
      noResultsTitle: 'No articles found',
      noResultsDesc: 'Try another keyword or clear the filter to see all articles.',
      resetFilters: 'Clear filter',
      categories: {
        ALL: 'All',
        ASTROLOGY: 'Astrology',
        'MOON PHASES': 'Moon Phases',
        WELLNESS: 'Wellness',
        'ZODIAC GUIDE': 'Zodiac Guide',
      },
    },
    pt: {
      sectionTitle: 'ARTIGOS EM DESTAQUE',
      readMore: 'Ler Artigo',
      searchPlaceholder: 'Buscar artigos por título ou palavra-chave...',
      allCategories: 'Todos',
      clearSign: 'Limpar Filtro de Signo',
      signBannerTitle: (signName: string, symbol: string) =>
        `Conteúdos Especiais para ${signName} ${symbol}`,
      signBannerDesc:
        'Selecionamos reflexões, conselhos e dicas que combinam perfeitamente com a energia do seu signo.',
      resultsCount: (count: number) =>
        count === 1 ? '1 artigo' : `${count} artigos`,
      noResultsTitle: 'Nenhum artigo encontrado',
      noResultsDesc: 'Tente outra palavra-chave ou limpe o filtro para ver todos os artigos.',
      resetFilters: 'Limpar filtro',
      categories: {
        ALL: 'Todos',
        ASTROLOGY: 'Astrologia',
        'MOON PHASES': 'Fases da Lua',
        WELLNESS: 'Bem-Estar',
        'ZODIAC GUIDE': 'Guia dos Signos',
      },
    },
    es: {
      sectionTitle: 'ARTÍCULOS DESTACADOS',
      readMore: 'Leer Artículo',
      searchPlaceholder: 'Buscar artículos por título o palabra clave...',
      allCategories: 'Todos',
      clearSign: 'Limpiar Filtro de Signo',
      signBannerTitle: (signName: string, symbol: string) =>
        `Publicaciones Especiales para ${signName} ${symbol}`,
      signBannerDesc:
        'Seleccionamos reflexiones y consejos cálidos que combinan con la energía de tu signo.',
      resultsCount: (count: number) =>
        count === 1 ? '1 artículo' : `${count} artículos`,
      noResultsTitle: 'No se encontraron artículos',
      noResultsDesc: 'Prueba con otra palabra o limpia el filtro para ver todos los artículos.',
      resetFilters: 'Limpiar filtro',
      categories: {
        ALL: 'Todos',
        ASTROLOGY: 'Astrología',
        'MOON PHASES': 'Fases Lunares',
        WELLNESS: 'Bienestar',
        'ZODIAC GUIDE': 'Guía Zodiacal',
      },
    },
  };

  const t = texts[lang] || texts.pt;

  const categoryOptions = [
    { key: 'ALL', label: t.categories.ALL },
    { key: 'ASTROLOGY', label: t.categories.ASTROLOGY },
    { key: 'MOON PHASES', label: t.categories['MOON PHASES'] },
    { key: 'WELLNESS', label: t.categories.WELLNESS },
    { key: 'ZODIAC GUIDE', label: t.categories['ZODIAC GUIDE'] },
  ];

  // Helper for accent-insensitive search
  const normalize = (str: string) =>
    str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  // Filter posts dynamically by selected sign, category, and search query
  const filteredPosts = useMemo(() => {
    return BLOG_ARTICLES.filter((post) => {
      // 1. Sign match (if user clicked their sign in the marquee)
      if (selectedSign) {
        const signLower = selectedSign.toLowerCase();
        const matchesSign =
          post.zodiacSigns?.includes(signLower) ||
          post.id.includes(signLower) ||
          normalize(post.category.pt).includes(signLower) ||
          normalize(post.title.pt).includes(signLower);

        if (!matchesSign) return false;
      }

      // 2. Category match
      if (selectedCategory !== 'ALL') {
        const catNorm = normalize(selectedCategory);
        const postCatNorm = normalize(post.category.pt);
        const matchesCat =
          postCatNorm.includes(catNorm) || catNorm.includes(postCatNorm);
        if (!matchesCat) return false;
      }

      // 3. Search query match
      if (searchQuery.trim()) {
        const q = normalize(searchQuery);
        const title = normalize(post.title[lang] || post.title.pt);
        const subtitle = normalize(post.subtitle[lang] || post.subtitle.pt);
        const category = normalize(post.category[lang] || post.category.pt);

        return title.includes(q) || subtitle.includes(q) || category.includes(q);
      }

      return true;
    });
  }, [selectedSign, selectedCategory, searchQuery, lang]);

  const slideGroups = useMemo(() => {
    const groups: typeof filteredPosts[] = [];
    for (let index = 0; index < filteredPosts.length; index += 3) {
      groups.push(filteredPosts.slice(index, index + 3));
    }
    return groups;
  }, [filteredPosts]);

  useEffect(() => {
    setCarouselIndex(0);
  }, [selectedSign, selectedCategory, searchQuery]);

  const canGoBack = carouselIndex > 0;
  const canGoForward = carouselIndex < Math.max(0, slideGroups.length - 1);

  const goToPrevious = () => setCarouselIndex((current) => Math.max(0, current - 1));
  const goToNext = () => setCarouselIndex((current) => Math.min(Math.max(0, slideGroups.length - 1), current + 1));

  return (
    <section
      id="blog"
      className="w-full bg-[#C9E5FF] border-y border-[#D9E8F8] py-10 sm:py-12 select-none"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Title harmonized with the brand com fade-in e slide-up */}
        <ScrollReveal delay={0} distance={20} duration={750}>
          <div className="mb-6 text-center sm:mb-8">
            <h2 className="font-extrabold text-sm sm:text-base tracking-[0.2em] uppercase text-[#172B4D]">
              {t.sectionTitle}
            </h2>
            <div className="mx-auto mt-2.5 h-1 w-12 rounded-full bg-[#2878D0]" />
          </div>
        </ScrollReveal>

        {/* =========================================================================
            ACTIVE SIGN PERSONALIZED BANNER
            ========================================================================= */}
        {activeSignInfo && (
          <ScrollReveal delay={50} distance={18} duration={700}>
            <div className="mb-6 p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#FFFFFF] border border-[#2878D0]/30 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#2878D0] text-white flex items-center justify-center text-xl shrink-0 shadow-xs">
                  <span>{activeSignInfo.symbol}</span>
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-[#172B4D]">
                    {t.signBannerTitle(
                      activeSignInfo[lang] || activeSignInfo.pt,
                      activeSignInfo.symbol
                    )}
                  </h3>
                  <p className="text-xs text-[#647DA5] mt-0.5 leading-relaxed font-medium">
                    {t.signBannerDesc}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectSign && onSelectSign(null)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E4F1FF] hover:bg-[#FFE0EF] text-[#172B4D] text-xs font-bold border border-[#D9E8F8] shadow-2xs transition-all cursor-pointer self-start sm:self-auto shrink-0"
              >
                <span>{t.clearSign}</span>
                <X className="w-3.5 h-3.5 text-[#647DA5]" />
              </button>
            </div>
          </ScrollReveal>
        )}

        {/* Dynamic Search & Category Filter Controls com fade-in e slide-up */}
        <ScrollReveal delay={80} distance={20} duration={750}>
          <div className="max-w-2xl mx-auto mb-6 sm:mb-8 space-y-3">
            {/* Search Input Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#647DA5]">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-10 pr-9 py-2 sm:py-2.5 bg-[#FFFFFF] border border-[#D9E8F8] rounded-full text-xs text-[#172B4D] placeholder-[#647DA5] outline-none focus:border-[#2878D0] focus:ring-2 focus:ring-[#2878D0]/20 transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#647DA5] hover:text-[#172B4D] transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5 bg-[#E4F1FF] rounded-full p-0.5" />
                </button>
              )}
            </div>

            {/* Category Filter Pills & Counter */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
                {categoryOptions.map((cat) => {
                  const isActive = selectedCategory === cat.key;
                  return (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => setSelectedCategory(cat.key)}
                      className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-[#F51B83] text-white shadow-2xs font-bold'
                          : 'bg-[#E4F1FF] border border-[#D9E8F8] text-[#2878D0] hover:bg-[#F51B83] hover:text-white hover:border-[#F51B83]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              <span className="text-[11px] text-[#647DA5] font-semibold ml-auto shrink-0">
                {t.resultsCount(filteredPosts.length)}
              </span>
            </div>
          </div>
        </ScrollReveal>

        {/* Three-card carousel with smooth horizontal scrolling */}
        {filteredPosts.length > 0 ? (
          <div className="relative">
            <div className="mb-4 flex justify-end gap-2">
              <button type="button" onClick={goToPrevious} disabled={!canGoBack} aria-label="Posts anteriores" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2878D0] bg-white text-[#2878D0] shadow-sm transition hover:bg-[#E4F1FF] disabled:cursor-not-allowed disabled:opacity-35">
                <span aria-hidden="true" className="text-xl leading-none">‹</span>
              </button>
              <button type="button" onClick={goToNext} disabled={!canGoForward} aria-label="Próximos posts" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F51B83] text-white shadow-sm transition hover:bg-[#D91470] disabled:cursor-not-allowed disabled:opacity-35">
                <span aria-hidden="true" className="text-xl leading-none">›</span>
              </button>
            </div>
            <div className="overflow-hidden">
              <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${carouselIndex * 100}%)` }}>
                {slideGroups.map((slide, slideIndex) => (
                  <div key={`slide-${slideIndex}`} className="grid min-w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {slide.map((post, index) => {
                      const title = post.title[lang] || post.title.pt;
                      const excerpt = post.subtitle[lang] || post.subtitle.pt;
                      const category = post.category[lang] || post.category.pt;
                      const date = post.date[lang] || post.date.pt;

                      return (
                        <ScrollReveal key={post.id} delay={index * 70} distance={20} duration={650} className="h-full w-full">
                          <article
                            onClick={() => onOpenArticle && onOpenArticle(post.id)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                if (onOpenArticle) onOpenArticle(post.id);
                              }
                            }}
                            tabIndex={0}
                            role="button"
                            aria-label={`${title} - ${t.readMore}`}
                            className="bg-[#FFFFFF] border border-[#D9E8F8] hover:border-[#2878D0]/60 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(23,54,111,0.06)] hover:shadow-[0_12px_28px_rgba(40,120,208,0.15)] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#2878D0]/40 h-full"
                          >
                            <div className="p-3.5 pb-0 shrink-0">
                              <div className="w-full h-40 sm:h-44 overflow-hidden rounded-[18px] bg-[#E4F1FF] relative">
                                <img src={post.image} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-[#17366F]/10 transition-colors pointer-events-none" />
                              </div>
                            </div>
                            <div className="p-5 flex flex-col justify-between flex-1">
                              <div>
                                <span className="inline-block px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider mb-2.5 bg-[#E4F1FF] text-[#2878D0]">{category}</span>
                                <div className="mb-2 flex items-start justify-between gap-3"><h3 className="min-w-0 flex-1 font-bold text-sm sm:text-base text-[#172B4D] leading-snug group-hover:text-[#2878D0] transition-colors line-clamp-2"><a href={`/blog/${getArticleSlugById(post.id)}`} onClick={cardLinkClick}>{title}</a></h3><SaveArticleButton articleId={post.id} /></div>
                                <p className="text-xs text-[#647DA5] leading-relaxed mb-4 line-clamp-3 font-normal">{excerpt}</p>
                              </div>
                              <div className="flex items-center gap-2.5 pt-3 border-t border-[#D9E8F8] mt-auto">
                                <img src={AURENSTAR_AVATAR} alt="Aurenstar" className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-black/5" />
                                <div className="flex flex-col min-w-0">
                                  <span className="text-xs font-bold text-[#172B4D] leading-tight truncate">Aurenstar <span aria-label="Verificado" title="Perfil verificado" className="ml-1 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#2878D0] text-white align-middle"><Check className="h-2.5 w-2.5" strokeWidth={3} /></span></span>
                                  <span className="text-[10px] text-[#647DA5] font-medium leading-tight mt-0.5">{date}</span>
                                </div>
                              </div>
                            </div>
                          </article>
                        </ScrollReveal>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
      ) : (
          <ScrollReveal delay={60} distance={20}>
            <div className="bg-[#FFFFFF] border border-[#D9E8F8] rounded-2xl p-8 text-center max-w-sm mx-auto my-4 shadow-2xs animate-fadeIn">
              <Search className="w-6 h-6 text-[#2878D0] mx-auto mb-2" />
              <p className="text-xs font-bold text-[#172B4D] mb-1">
                {t.noResultsTitle}
              </p>
            <p className="text-[11px] text-[#647DA5] mb-4">
              {t.noResultsDesc}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('ALL');
                if (onSelectSign) onSelectSign(null);
              }}
              className="px-4 py-1.5 rounded-full bg-[#2878D0] hover:bg-[#17366F] text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              {t.resetFilters}
            </button>
          </div>
        </ScrollReveal>
      )}
    </div>
  </section>
  );
};
