import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  ArrowLeft,
  X,
  ChevronDown,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Check,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { BLOG_ARTICLES, BlogArticleContent, AURENSTAR_AVATAR } from '../data/blogArticles';
import { AurenstarLogo } from '../components/AurenstarLogo';
import { ShareArticleButton } from '../components/ShareArticleButton';
import { getArticleSlugById } from '../utils/articleSlug';
import { getCategoryPath } from '../utils/blogCategories';
import { cardLinkClick, onPlainClick } from '../utils/links';

interface BlogPageProps {
  onBackToHome: () => void;
  onOpenArticle: (id: string) => void;
  /** Category shown ('ALL' or a category key); each category has its own URL /blog/categoria/<slug> */
  selectedCategory: string;
  onSelectCategory: (categoryKey: string) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({
  onBackToHome,
  onOpenArticle,
  selectedCategory,
  onSelectCategory,
}) => {
  const { language } = useLanguage();
  const lang = (language || 'pt') as 'pt' | 'en' | 'es';

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'readTime' | 'popular'>('newest');
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  // Top 3 featured articles for the hero carousel banner
  const featuredArticles = useMemo(() => {
    return BLOG_ARTICLES.slice(0, 3);
  }, []);

  // Optional rotation - only if user actively enables it (disabled by default so it stops rotating on its own)
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % featuredArticles.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, featuredArticles.length]);

  const currentFeatured = featuredArticles[featuredIndex] || featuredArticles[0];

  const texts = {
    pt: {
      backHome: 'Voltar ao Início',
      blogHeading: 'Blog',
      blogSubheading:
        'Aqui compartilhamos mensagens diárias, guias dos signos e reflexões acolhedoras para inspirar a sua paz de espírito.',
      searchPlaceholder: 'Pesquisar destino, tema ou signo...',
      categories: {
        ALL: 'Todos',
        ASTROLOGIA: 'Astrologia',
        HORÓSCOPO: 'Horóscopo',
        'FASES DA LUA': 'Fases da Lua',
        'BEM-ESTAR': 'Bem-Estar',
        'GUIA DOS SIGNOS': 'Guia dos Signos',
      },
      sortLabel: 'Classificar por:',
      sortOptions: {
        newest: 'Mais Recentes',
        popular: 'Mais Populares',
        readTime: 'Tempo de Leitura',
      },
      readMore: 'Ler artigo completo',
      noResultsTitle: 'Nenhum artigo encontrado',
      noResultsDesc: 'Tente buscar com outra palavra ou selecione outra categoria.',
      clearSearch: 'Limpar busca',
    },
    en: {
      backHome: 'Back to Home',
      blogHeading: 'Blog',
      blogSubheading:
        'Here, we share daily horoscopes, zodiac guides, and inspiring stories for your inner peace.',
      searchPlaceholder: 'Search destination, topic, or sign...',
      categories: {
        ALL: 'All',
        ASTROLOGIA: 'Astrology',
        HORÓSCOPO: 'Horoscope',
        'FASES DA LUA': 'Moon Phases',
        'BEM-ESTAR': 'Wellness',
        'GUIA DOS SIGNOS': 'Zodiac Guide',
      },
      sortLabel: 'Sort by:',
      sortOptions: {
        newest: 'Newest',
        popular: 'Most Popular',
        readTime: 'Reading Time',
      },
      readMore: 'Read full article',
      noResultsTitle: 'No articles found',
      noResultsDesc: 'Try searching with another keyword or pick a different category.',
      clearSearch: 'Clear search',
    },
    es: {
      backHome: 'Volver al Inicio',
      blogHeading: 'Blog',
      blogSubheading:
        'Aquí compartimos mensajes diarios, guías zodiacales y reflexiones reconfortantes para tu paz interior.',
      searchPlaceholder: 'Buscar destino, tema o signo...',
      categories: {
        ALL: 'Todos',
        ASTROLOGIA: 'Astrología',
        HORÓSCOPO: 'Horóscopo',
        'FASES DA LUA': 'Fases Lunares',
        'BEM-ESTAR': 'Bienestar',
        'GUIA DOS SIGNOS': 'Guía Zodiacal',
      },
      sortLabel: 'Ordenar por:',
      sortOptions: {
        newest: 'Más Recientes',
        popular: 'Más Populares',
        readTime: 'Tiempo de Lectura',
      },
      readMore: 'Leer artículo completo',
      noResultsTitle: 'No se encontraron artículos',
      noResultsDesc: 'Intenta con otra palabra clave o selecciona otra categoría.',
      clearSearch: 'Limpiar búsqueda',
    },
  };

  const t = texts[lang] || texts.pt;

  // Filter and sort articles
  const filteredArticles = useMemo(() => {
    let result = BLOG_ARTICLES.filter((article) => {
      const categoryMatch =
        selectedCategory === 'ALL' || article.category.pt === selectedCategory;

      if (!categoryMatch) return false;
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const title = (article.title[lang] || article.title.pt).toLowerCase();
      const subtitle = (article.subtitle[lang] || article.subtitle.pt).toLowerCase();
      const cat = (article.category[lang] || article.category.pt).toLowerCase();
      const author = article.author.name.toLowerCase();

      return (
        title.includes(q) ||
        subtitle.includes(q) ||
        cat.includes(q) ||
        author.includes(q)
      );
    });

    if (sortBy === 'readTime') {
      result = [...result].sort((a, b) => {
        const tA = parseInt(a.readTime.pt) || 0;
        const tB = parseInt(b.readTime.pt) || 0;
        return tA - tB;
      });
    }

    return result;
  }, [selectedCategory, searchQuery, sortBy, lang]);

  return (
    <div className="w-full bg-[#C9E5FF] min-h-screen text-[#172B4D] pt-20 sm:pt-24 pb-24 animate-fadeIn select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* =========================================================================
            FEATURED HERO BANNER (Exact layout matching user's uploaded image.png)
            ========================================================================= */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[420px] sm:h-[480px] lg:h-[540px] flex flex-col justify-between p-6 sm:p-10 mb-10 group">
          {/* Stacked Background Images with Smooth Cross-Fade (Zero Flicker) */}
          {featuredArticles.map((item, idx) => (
            <img
              key={`bg-${item.id}`}
              src={item.image}
              alt={item.title[lang] || item.title.pt}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${
                featuredIndex === idx
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-105 pointer-events-none'
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-black/60 pointer-events-none" />

          {/* Previous / Next Arrow Controls for Manual Navigation */}
          <button
            type="button"
            onClick={() =>
              setFeaturedIndex(
                (prev) => (prev - 1 + featuredArticles.length) % featuredArticles.length
              )
            }
            aria-label="Destaque anterior"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/35 hover:bg-black/60 border border-white/20 flex items-center justify-center text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 hover:scale-105 cursor-pointer shadow-lg hidden sm:flex"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() =>
              setFeaturedIndex((prev) => (prev + 1) % featuredArticles.length)
            }
            aria-label="Próximo destaque"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/35 hover:bg-black/60 border border-white/20 flex items-center justify-center text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 hover:scale-105 cursor-pointer shadow-lg hidden sm:flex"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Top Bar inside the Hero: Brand Logo, Search Bar, and Back Button */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
            {/* Left: Brand Logo & Back to Home */}
            <div className="flex items-center gap-4">
              <button
                onClick={onBackToHome}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 hover:bg-black/60 border border-white/25 text-white text-xs font-semibold backdrop-blur-md transition-all cursor-pointer shadow-xs group/btn"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover/btn:-translate-x-1" />
                <span>{t.backHome}</span>
              </button>

              <div className="hidden sm:block">
                <AurenstarLogo className="h-7 w-auto brightness-0 invert" />
              </div>
            </div>

            {/* Center / Right: Rounded Search Bar matching image.png */}
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full bg-white/20 hover:bg-white/25 focus:bg-white/30 backdrop-blur-md border border-white/30 rounded-full pl-5 pr-10 py-2 text-xs text-white placeholder-white/75 outline-none shadow-sm transition-all focus:ring-2 focus:ring-white/40"
              />
              <Search className="w-4 h-4 text-white/80 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-9 top-1/2 -translate-y-1/2 p-0.5 text-white/70 hover:text-white"
                  title={t.clearSearch}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Bottom Area inside the Hero: Featured Story Title, Description, Dots & Author */}
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pt-10">
            {/* Story Details & Dots */}
            <div className="max-w-2xl">
              {/* Category Pill */}
              <div className="inline-block px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/25 text-white text-[11px] font-bold uppercase tracking-wider mb-3.5 shadow-xs">
                {currentFeatured.category[lang] || currentFeatured.category.pt}
              </div>

              {/* Title */}
              <h1
                onClick={() => onOpenArticle(currentFeatured.id)}
                className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-3 cursor-pointer hover:text-white/90 transition-colors drop-shadow-md line-clamp-2"
              >
                {currentFeatured.title[lang] || currentFeatured.title.pt}
              </h1>

              {/* Excerpt */}
              <p className="text-xs sm:text-sm text-white/85 leading-relaxed max-w-xl mb-5 drop-shadow-xs line-clamp-2 font-normal">
                {currentFeatured.subtitle[lang] || currentFeatured.subtitle.pt}
              </p>

              {/* Interactive Carousel Pagination Dots + Play/Pause Control */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {featuredArticles.map((_, idx) => (
                    <button
                      key={`dot-${idx}`}
                      onClick={() => setFeaturedIndex(idx)}
                      aria-label={`Ir para destaque ${idx + 1}`}
                      className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                        featuredIndex === idx
                          ? 'w-7 bg-white shadow-xs'
                          : 'w-2.5 bg-white/40 hover:bg-white/70'
                      }`}
                    />
                  ))}
                </div>

                {/* Auto-play toggle button */}
                <button
                  type="button"
                  onClick={() => setIsAutoPlaying((prev) => !prev)}
                  title={isAutoPlaying ? 'Pausar rotação' : 'Iniciar rotação automática'}
                  aria-label={isAutoPlaying ? 'Pausar rotação' : 'Iniciar rotação automática'}
                  className="w-6 h-6 rounded-full bg-black/40 hover:bg-black/60 border border-white/20 flex items-center justify-center text-white/90 hover:text-white transition-all cursor-pointer backdrop-blur-md"
                >
                  {isAutoPlaying ? (
                    <Pause className="w-3 h-3" />
                  ) : (
                    <Play className="w-3 h-3 ml-0.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Author Profile on Bottom Right with Aurenstar */}
            <div
              onClick={() => onOpenArticle(currentFeatured.id)}
              className="flex items-center gap-3.5 self-start md:self-end bg-black/35 backdrop-blur-md border border-white/20 p-2.5 sm:p-3 rounded-2xl cursor-pointer hover:bg-black/50 transition-all shrink-0"
            >
              <img
                src={AURENSTAR_AVATAR}
                alt="Aurenstar"
                className="w-11 h-11 rounded-full object-cover ring-2 ring-white/30 shrink-0 shadow-xs"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-xs sm:text-sm font-bold text-white leading-tight truncate">
                  Aurenstar <span aria-label={language === 'en' ? 'Verified' : 'Verificado'} title={language === 'en' ? 'Verified profile' : 'Perfil verificado'} className="ml-1 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#2878D0] text-white align-middle"><Check className="h-2.5 w-2.5" strokeWidth={3} /></span>
                </span>
                <span className="text-[11px] text-white/75 font-medium leading-tight mt-0.5">
                  Insights • {currentFeatured.author.dateTime[lang] || currentFeatured.author.dateTime.pt}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            BLOG SECTION HEADER & TOOLBAR (Matching image.png)
            ========================================================================= */}
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#172B4D] tracking-tight leading-tight mb-2">
            {t.blogHeading}
          </h2>
          <p className="text-xs sm:text-sm text-[#647DA5] leading-relaxed max-w-2xl font-normal">
            {t.blogSubheading}
          </p>
        </div>

        {/* Categories Tabs & Sort By Toolbar matching image.png */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[#D9E8F8]">
          {/* Left: Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                'ALL',
                'ASTROLOGIA',
                'HORÓSCOPO',
                'FASES DA LUA',
                'BEM-ESTAR',
                'GUIA DOS SIGNOS',
              ] as const
            ).map((catKey) => {
              const isSelected = selectedCategory === catKey;
              return (
                <a
                  key={catKey}
                  href={getCategoryPath(catKey)}
                  onClick={onPlainClick(() => onSelectCategory(catKey))}
                  aria-current={isSelected ? 'page' : undefined}
                  className={`btn-font inline-block px-4 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-tight transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-[#F51B83] text-white shadow-xs'
                      : 'bg-transparent text-[#647DA5] hover:bg-[#E4F1FF]/60 hover:text-[#172B4D]'
                  }`}
                >
                  {t.categories[catKey]}
                </a>
              );
            })}
          </div>

          {/* Right: Sort By Dropdown matching image.png */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs text-[#647DA5] font-medium hidden sm:inline">
              {t.sortLabel}
            </span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as 'newest' | 'readTime' | 'popular')
                }
                className="appearance-none bg-[#FFFFFF] hover:bg-[#E4F1FF]/40 border border-[#D9E8F8] text-[#172B4D] font-semibold text-xs sm:text-sm rounded-xl pl-3.5 pr-8 py-2 cursor-pointer outline-none focus:ring-2 focus:ring-[#2878D0]/20 transition-all"
              >
                <option value="newest">{t.sortOptions.newest}</option>
                <option value="popular">{t.sortOptions.popular}</option>
                <option value="readTime">{t.sortOptions.readTime}</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#647DA5] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* =========================================================================
            GRID OF ARTICLES: EXACTLY 3 CARDS PER ROW MATCHING cards.png
            ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
          {filteredArticles.map((article) => (
            <article
              key={article.id}
              onClick={() => onOpenArticle(article.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onOpenArticle(article.id);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`${article.title[lang] || article.title.pt} - ${t.readMore}`}
              className="bg-white rounded-2xl border border-[#D9E8F8] shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col justify-between cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#2878D0]/40"
            >
              {/* Card Image at Top - Compact proportion matching image.png */}
              <div className="p-3.5 pb-0 shrink-0">
              <div className="w-full h-40 sm:h-44 overflow-hidden rounded-[18px] bg-slate-100 relative">
                <img
                  src={article.image}
                  alt={article.title[lang] || article.title.pt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              </div>

              {/* Card Content Area matching cards.png */}
              <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
                <div>
                  {/* Category Pill Badge INSIDE body matching cards.png */}
                  <span
                    className={`inline-block px-3.5 py-1 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider bg-[#E4F1FF] text-[#2878D0] mb-3 w-fit`}
                  >
                    {article.category[lang] || article.category.pt}
                  </span>

                  {/* Article Title */}
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <h3 className="min-w-0 flex-1 font-extrabold text-base sm:text-[17px] text-[#172B4D] leading-snug group-hover:text-[#2878D0] transition-colors line-clamp-2">
                      <a href={`/blog/${getArticleSlugById(article.id)}`} onClick={cardLinkClick}>
                        {article.title[lang] || article.title.pt}
                      </a>
                    </h3>
                    <ShareArticleButton article={article} />
                  </div>

                  {/* Article Excerpt */}
                  <p className="text-xs sm:text-[13px] text-[#647DA5] leading-relaxed mb-6 line-clamp-3 font-normal">
                    {article.subtitle[lang] || article.subtitle.pt}
                  </p>
                </div>

                {/* Author Section at Bottom with Aurenstar Profile */}
                <div className="flex items-center gap-3 mt-auto">
                  <img
                    src={AURENSTAR_AVATAR}
                    alt="Aurenstar"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover shrink-0 ring-1 ring-black/5 shadow-2xs"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs sm:text-sm font-bold text-[#172B4D] leading-tight truncate">
                      Aurenstar <span aria-label={language === 'en' ? 'Verified' : 'Verificado'} title={language === 'en' ? 'Verified profile' : 'Perfil verificado'} className="ml-1 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#2878D0] text-white align-middle"><Check className="h-2.5 w-2.5" strokeWidth={3} /></span>
                    </span>
                    <span className="text-[11px] text-[#647DA5] font-medium leading-tight mt-0.5">
                      {article.author.dateTime[lang] || article.author.dateTime.pt}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {filteredArticles.length === 0 && (
          <div className="bg-[#E4F1FF]/40 border border-[#D9E8F8] rounded-2xl p-12 text-center max-w-md mx-auto my-12">
            <h4 className="text-base font-bold text-[#172B4D] mb-1.5">
              {t.noResultsTitle}
            </h4>
            <p className="text-xs sm:text-sm text-[#647DA5] mb-5">
              {t.noResultsDesc}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                onSelectCategory('ALL');
              }}
              className="px-5 py-2 rounded-full bg-[#2878D0] hover:bg-[#F51B83] text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
            >
              {t.clearSearch}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
