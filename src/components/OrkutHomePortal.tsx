import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Search,
  X,
  ArrowRight,
  Heart,
  Star,
  BookOpen,
  Calendar,
  Compass,
  Clock,
  TrendingUp,
  Flame,
  ChevronRight,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { BLOG_ARTICLES, BlogArticleContent } from '../data/blogArticles';
import { ZODIAC_SIGNS } from './BrandMarquee';

interface OrkutHomePortalProps {
  onOpenArticle: (id: string) => void;
  onNavigateToDailyMessage: () => void;
  onNavigateToAurenEffect: () => void;
  onNavigateToDiscoverSign: () => void;
  onNavigateToDictionary: () => void;
  onNavigateToBlog: () => void;
  selectedSign: string | null;
  onSelectSign: (sign: string | null) => void;
  searchQuery?: string;
  onClearSearch?: () => void;
  activeCategory?: string;
  onSelectCategory?: (category: string) => void;
}

export const OrkutHomePortal: React.FC<OrkutHomePortalProps> = ({
  onOpenArticle,
  onNavigateToDailyMessage,
  onNavigateToAurenEffect,
  onNavigateToDiscoverSign,
  onNavigateToDictionary,
  onNavigateToBlog,
  selectedSign,
  onSelectSign,
  searchQuery = '',
  onClearSearch,
  activeCategory = 'TODOS',
  onSelectCategory,
}) => {
  const { language } = useLanguage();
  const lang = (language || 'pt') as 'pt' | 'en' | 'es';

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [currentCategory, setCurrentCategory] = useState<string>(activeCategory);

  // Sync with prop if provided
  React.useEffect(() => {
    if (activeCategory) {
      setCurrentCategory(activeCategory);
    }
  }, [activeCategory]);

  React.useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const texts = {
    pt: {
      heroTag: 'PORTAL MODERNO DE ASTROLOGIA & AMOR',
      heroTitle: 'Descubra a Sabedoria dos Signos com Leveza & Carinho',
      heroSubtitle:
        'Seu espaço diário para entender personalidade, relacionamentos, horóscopo e conselhos práticos sem nenhuma complicação.',
      exploreSignBtn: 'Explorar meu signo',
      readHoroscopeBtn: 'Ler horóscopo do dia',
      compatibilityBtn: 'Compatibilidade no amor',
      signsSectionTitle: 'Escolha o seu Signo do Zodíaco',
      signsSectionSubtitle: 'Clique em um signo para ver previsões, compatibilidade e artigos dedicados',
      allArticlesTitle: 'Artigos Recentes & Leituras Recomendadas',
      allArticlesSubtitle: 'Conteúdo editorial com linguagem simples, acolhedora e inspiradora',
      readArticle: 'Ler artigo completo',
      categories: {
        TODOS: 'Todos',
        ASTROLOGIA: 'Astrologia',
        AMOR: 'Amor & Relações',
        PERSONALIDADE: 'Personalidade',
        LUA: 'Fases da Lua',
        BEM_ESTAR: 'Bem-Estar',
        FAMOSOS: 'Famosos',
        LIFESTYLE: 'Lifestyle',
      },
      sidebarDailyTitle: 'Horóscopo do Dia',
      sidebarDailyEnergy: 'Energia de Hoje: Paciência & Conexão Afetuosa',
      sidebarDailyDesc:
        'Aproveite a manhã para cultivar conversas francas e valorizar quem caminha ao seu lado.',
      sidebarDailyBtn: 'Ver Mensagem Completa',
      sidebarTopicsTitle: 'Tópicos Populares',
      sidebarTrendingTitle: 'Mais Lidos da Semana',
      sidebarToolsTitle: 'Ferramentas Práticas',
      aurenEffectTitle: 'Efeito Aurenstar',
      aurenEffectDesc: 'Alinhamento astrológico calculado a cada 6 horas.',
      discoverSignTitle: 'Sign Calculator',
      discoverSignDesc: 'Descubra seu signo solar e características com sua data.',
      dictTitle: 'Aurenstar Dictionary',
      dictDesc: 'Aprenda astrologia sem termos difíceis de entender.',
      clearFilter: 'Limpar filtro',
      activeFilterSign: (name: string, symbol: string) => `Filtrando por ${name} ${symbol}`,
    },
    en: {
      heroTag: 'MODERN ASTROLOGY & LOVE PORTAL',
      heroTitle: 'Discover Zodiac Wisdom with Warmth & Clarity',
      heroSubtitle:
        'Your daily haven for understanding personality, relationships, horoscopes, and practical guidance without complicated words.',
      exploreSignBtn: 'Explore my sign',
      readHoroscopeBtn: 'Daily horoscope',
      compatibilityBtn: 'Love compatibility',
      signsSectionTitle: 'Choose Your Zodiac Sign',
      signsSectionSubtitle: 'Click on any sign to see daily energy, love compatibility, and tailored reads',
      allArticlesTitle: 'Recent Articles & Recommended Reads',
      allArticlesSubtitle: 'Editorial content crafted with accessible, uplifting and friendly language',
      readArticle: 'Read full article',
      categories: {
        TODOS: 'All',
        ASTROLOGIA: 'Astrology',
        AMOR: 'Love & Relationships',
        PERSONALIDADE: 'Personality',
        LUA: 'Moon Phases',
        BEM_ESTAR: 'Wellness',
        FAMOSOS: 'Celebrities',
        LIFESTYLE: 'Lifestyle',
      },
      sidebarDailyTitle: 'Daily Horoscope',
      sidebarDailyEnergy: "Today's Energy: Patience & Warm Connection",
      sidebarDailyDesc:
        'Take a quiet moment this morning to listen to your intuition and cherish close bonds.',
      sidebarDailyBtn: 'View Full Message',
      sidebarTopicsTitle: 'Popular Topics',
      sidebarTrendingTitle: 'Trending This Week',
      sidebarToolsTitle: 'Astrology Tools',
      aurenEffectTitle: 'Auren Effect',
      aurenEffectDesc: 'Astrological triad calculated every 6 hours.',
      discoverSignTitle: 'Sign Calculator',
      discoverSignDesc: 'Calculate your exact star sign and profile from your birthday.',
      dictTitle: 'Aurenstar Dictionary',
      dictDesc: 'Clear definitions explaining astrological concepts without jargon.',
      clearFilter: 'Clear filter',
      activeFilterSign: (name: string, symbol: string) => `Filtered by ${name} ${symbol}`,
    },
    es: {
      heroTag: 'PORTAL MODERNO DE ASTROLOGÍA Y AMOR',
      heroTitle: 'Descubre la Sabiduría de los Signos con Claridad y Afecto',
      heroSubtitle:
        'Tu espacio diario para comprender personalidad, relaciones, horóscopo y consejos prácticos sin palabras difíciles.',
      exploreSignBtn: 'Explorar mi signo',
      readHoroscopeBtn: 'Leer horóscopo del día',
      compatibilityBtn: 'Compatibilidad en el amor',
      signsSectionTitle: 'Elige tu Signo Zodiacal',
      signsSectionSubtitle: 'Haz clic en un signo para ver predicciones, compatibilidad y artículos',
      allArticlesTitle: 'Artículos Recientes y Recomendados',
      allArticlesSubtitle: 'Contenido editorial con lenguaje sencillo, amable y acogedor',
      readArticle: 'Leer artículo completo',
      categories: {
        TODOS: 'Todos',
        ASTROLOGIA: 'Astrología',
        AMOR: 'Amor y Relaciones',
        PERSONALIDADE: 'Personalidad',
        LUA: 'Fases Lunares',
        BEM_ESTAR: 'Bienestar',
        FAMOSOS: 'Famosos',
        LIFESTYLE: 'Lifestyle',
      },
      sidebarDailyTitle: 'Horóscopo del Día',
      sidebarDailyEnergy: 'Energía de Hoy: Paciencia y Afecto Genuino',
      sidebarDailyDesc:
        'Aprovecha la mañana para conectar con calma y valorar a las personas especiales en tu vida.',
      sidebarDailyBtn: 'Ver Mensaje Completo',
      sidebarTopicsTitle: 'Temas Populares',
      sidebarTrendingTitle: 'Más Leídos de la Semana',
      sidebarToolsTitle: 'Herramientas Prácticas',
      aurenEffectTitle: 'Efecto Aurenstar',
      aurenEffectDesc: 'Alineación calculada cada 6 horas.',
      discoverSignTitle: 'Sign Calculator',
      discoverSignDesc: 'Calcula tu signo solar con tu fecha de nacimiento.',
      dictTitle: 'Aurenstar Dictionary',
      dictDesc: 'Aprende astrología sin tecnicismos complejos.',
      clearFilter: 'Limpiar filtro',
      activeFilterSign: (name: string, symbol: string) => `Filtrando por ${name} ${symbol}`,
    },
  }[lang];

  // Category filter list
  const categoryKeys = [
    { key: 'TODOS', label: texts.categories.TODOS },
    { key: 'ASTROLOGIA', label: texts.categories.ASTROLOGIA },
    { key: 'AMOR', label: texts.categories.AMOR },
    { key: 'PERSONALIDADE', label: texts.categories.PERSONALIDADE },
    { key: 'LUA', label: texts.categories.LUA },
    { key: 'BEM_ESTAR', label: texts.categories.BEM_ESTAR },
  ];

  // Selected sign info
  const activeSignInfo = useMemo(() => {
    if (!selectedSign) return null;
    return ZODIAC_SIGNS.find((s) => s.key === selectedSign) || null;
  }, [selectedSign]);

  // Filtered articles
  const filteredArticles = useMemo(() => {
    return BLOG_ARTICLES.filter((article) => {
      // 1. Search Query
      if (localSearch.trim()) {
        const q = localSearch.toLowerCase();
        const title = (article.title[lang] || article.title.pt).toLowerCase();
        const subtitle = (article.subtitle[lang] || article.subtitle.pt).toLowerCase();
        const cat = (article.category[lang] || article.category.pt).toLowerCase();
        if (!title.includes(q) && !subtitle.includes(q) && !cat.includes(q)) {
          return false;
        }
      }

      // 2. Category Filter
      if (currentCategory !== 'TODOS') {
        const catUpper = (article.category.pt || '').toUpperCase();
        if (currentCategory === 'AMOR' && !catUpper.includes('AMOR') && !catUpper.includes('RELAC')) {
          return false;
        }
        if (currentCategory === 'ASTROLOGIA' && !catUpper.includes('ASTROLOGIA') && !catUpper.includes('SIGNO')) {
          return false;
        }
        if (currentCategory === 'PERSONALIDADE' && !catUpper.includes('PERSONALIDADE') && !catUpper.includes('SIGNO')) {
          return false;
        }
        if (currentCategory === 'LUA' && !catUpper.includes('LUA') && !catUpper.includes('FASES')) {
          return false;
        }
        if (currentCategory === 'BEM_ESTAR' && !catUpper.includes('BEM-ESTAR') && !catUpper.includes('SAÚDE')) {
          return false;
        }
      }

      return true;
    });
  }, [localSearch, currentCategory, lang]);

  // Trending articles for sidebar
  const trendingArticles = useMemo(() => {
    return BLOG_ARTICLES.slice(0, 5);
  }, []);

  const handleCategoryClick = (catKey: string) => {
    setCurrentCategory(catKey);
    onSelectCategory?.(catKey);
  };

  return (
    <div className="w-full bg-[#C9E5FF] min-h-screen py-6 sm:py-8 select-none text-[#172B4D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* =========================================================================
            75% MAIN CONTENT + 25% SIDEBAR CONTAINER
            ========================================================================= */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* =======================================================================
              MAIN COLUMN (75%)
              ======================================================================= */}
          <div className="w-full lg:w-[72%] xl:w-[74%] space-y-6">
            {/* 1. HERO EDITORIAL BANNER */}
            <section className="bg-white rounded-2xl sm:rounded-3xl border border-[#D9E8F8] p-6 sm:p-8 shadow-xs overflow-hidden relative">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="max-w-xl space-y-3.5 text-center md:text-left">
                  {/* Category Pill Tag (Rosa Suave com Texto Rosa Vibrante) */}
                  <span className="inline-block bg-[#FFE0EF] text-[#F51B83] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {texts.heroTag}
                  </span>

                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#172B4D] tracking-tight leading-tight">
                    {texts.heroTitle}
                  </h1>

                  <p className="text-sm sm:text-base text-[#647DA5] leading-relaxed font-normal">
                    {texts.heroSubtitle}
                  </p>

                  {/* Button Row (Rosa Primário, Azul Secundário, Branco Neutro) */}
                  <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                    {/* Botão Primário Rosa (rounded-full, 44px altura, px-6, sem borda) */}
                    <button
                      type="button"
                      onClick={() => {
                        const target = document.getElementById('orkut-signos');
                        target?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="h-11 px-6 rounded-full bg-[#F51B83] hover:bg-[#D91470] text-white text-xs sm:text-sm font-semibold transition-colors duration-150 cursor-pointer shadow-xs inline-flex items-center gap-2 active:scale-95"
                    >
                      <span>{texts.exploreSignBtn}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    {/* Botão Secundário Azul (rounded-xl, 42px altura, px-5) */}
                    <button
                      type="button"
                      onClick={onNavigateToDailyMessage}
                      className="h-10 sm:h-11 px-5 rounded-xl bg-[#2878D0] hover:bg-[#1D65B5] text-white text-xs sm:text-sm font-semibold transition-colors duration-150 cursor-pointer shadow-xs inline-flex items-center gap-1.5 active:scale-95"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{texts.readHoroscopeBtn}</span>
                    </button>

                    {/* Botão Neutro Branco (rounded-xl, borda 1px #D9E8F8, hover #E4F1FF) */}
                    <button
                      type="button"
                      onClick={onNavigateToAurenEffect}
                      className="h-10 sm:h-11 px-4.5 rounded-xl bg-white hover:bg-[#E4F1FF] text-[#2878D0] border border-[#D9E8F8] text-xs sm:text-sm font-semibold transition-colors duration-150 cursor-pointer inline-flex items-center gap-1.5 active:scale-95"
                    >
                      <Heart className="w-4 h-4 text-[#F51B83]" />
                      <span>{texts.compatibilityBtn}</span>
                    </button>
                  </div>
                </div>

                {/* Editorial Illustration Card */}
                <div className="w-full md:w-56 lg:w-64 shrink-0 rounded-2xl overflow-hidden border border-[#D9E8F8] bg-[#E4F1FF] p-2 shadow-2xs">
                  <img
                    src="https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80"
                    alt="Astrology & Stars"
                    className="w-full h-44 sm:h-52 object-cover rounded-xl"
                  />
                  <div className="p-2.5 text-center">
                    <span className="text-[11px] font-bold text-[#2878D0] block">
                      Aurenstar Diário
                    </span>
                    <span className="text-[10px] text-[#647DA5]">
                      Sem palavras difíceis • 100% acolhedor
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. ZODIAC 12 SIGNS SELECTOR (CIRCULAR BUTTONS 58-68px) */}
            <section
              id="orkut-signos"
              className="bg-white rounded-2xl sm:rounded-3xl border border-[#D9E8F8] p-6 sm:p-7 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6 pb-3 border-b border-[#D9E8F8]">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#172B4D] flex items-center gap-2">
                    <Star className="w-5 h-5 text-[#2878D0] fill-[#2878D0]" />
                    <span>{texts.signsSectionTitle}</span>
                  </h2>
                  <p className="text-xs text-[#647DA5] mt-0.5">
                    {texts.signsSectionSubtitle}
                  </p>
                </div>

                {selectedSign && (
                  <button
                    type="button"
                    onClick={() => onSelectSign(null)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F51B83] hover:text-[#D91470] bg-[#FFE0EF] px-3 py-1 rounded-full cursor-pointer transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>{texts.clearFilter}</span>
                  </button>
                )}
              </div>

              {/* 12 Signs Circular Grid: Alternating between soft blue #E4F1FF and soft pink #FFE0EF */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
                {ZODIAC_SIGNS.map((sign, index) => {
                  const isSelected = selectedSign === sign.key;
                  // Alternating color scheme (even: soft blue, odd: soft pink)
                  const isEven = index % 2 === 0;
                  const defaultBg = isEven ? 'bg-[#E4F1FF]' : 'bg-[#FFE0EF]';
                  const defaultTextColor = isEven ? 'text-[#2878D0]' : 'text-[#F51B83]';

                  return (
                    <button
                      key={sign.key}
                      type="button"
                      onClick={() => onSelectSign(isSelected ? null : sign.key)}
                      className="group flex flex-col items-center justify-center p-2 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      {/* Circular Button: 58-68px diameter */}
                      <div
                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-2xl sm:text-3xl transition-transform duration-150 group-hover:scale-105 shadow-2xs ${
                          isSelected
                            ? 'bg-[#E4F1FF] border-2 border-[#2878D0] ring-2 ring-[#2878D0]/30 text-[#2878D0]'
                            : `${defaultBg} ${defaultTextColor} border border-[#D9E8F8]`
                        }`}
                      >
                        <span>{sign.symbol}</span>
                      </div>

                      {/* Sign Name Below */}
                      <span
                        className={`text-xs font-bold mt-2 tracking-tight transition-colors ${
                          isSelected ? 'text-[#2878D0] underline' : 'text-[#172B4D] group-hover:text-[#2878D0]'
                        }`}
                      >
                        {sign[lang] || sign.pt}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Sign Banner if selected */}
              {activeSignInfo && (
                <div className="mt-5 p-4 rounded-xl bg-[#E4F1FF] border border-[#D9E8F8] flex items-center justify-between gap-3 animate-fadeIn">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{activeSignInfo.symbol}</span>
                    <div>
                      <span className="text-xs font-bold text-[#17366F] block">
                        {texts.activeFilterSign(
                          activeSignInfo[lang] || activeSignInfo.pt,
                          activeSignInfo.symbol
                        )}
                      </span>
                      <span className="text-[11px] text-[#647DA5]">
                        Exibindo artigos recomendados para o seu signo.
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectSign(null)}
                    className="text-xs font-bold text-[#F51B83] hover:underline cursor-pointer"
                  >
                    Ver todos os signos
                  </button>
                </div>
              )}
            </section>

            {/* 3. RECENT ARTICLES GRID WITH CATEGORY TABS */}
            <section
              id="orkut-artigos"
              className="bg-white rounded-2xl sm:rounded-3xl border border-[#D9E8F8] p-6 sm:p-7 shadow-xs"
            >
              {/* Header & Category Filter Tabs */}
              <div className="mb-6 pb-4 border-b border-[#D9E8F8] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-[#172B4D] flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-[#2878D0]" />
                      <span>{texts.allArticlesTitle}</span>
                    </h2>
                    <p className="text-xs text-[#647DA5] mt-0.5">
                      {texts.allArticlesSubtitle}
                    </p>
                  </div>

                  <span className="text-xs font-semibold text-[#647DA5]">
                    {filteredArticles.length} {filteredArticles.length === 1 ? 'artigo' : 'artigos'}
                  </span>
                </div>

                {/* Category Filter Buttons */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
                  {categoryKeys.map((cat) => {
                    const isActive = currentCategory === cat.key;
                    return (
                      <button
                        key={cat.key}
                        type="button"
                        onClick={() => handleCategoryClick(cat.key)}
                        className={`h-8 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors duration-150 cursor-pointer ${
                          isActive
                            ? 'bg-[#2878D0] text-white shadow-2xs font-bold'
                            : 'bg-white text-[#17366F] border border-[#D9E8F8] hover:bg-[#E4F1FF] hover:text-[#2878D0]'
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Articles Grid (Cartões brancos, borda #D9E8F8, cantos 12-16px, padding 16-24px, etiqueta rosa suave) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredArticles.map((article) => {
                  const title = article.title[lang] || article.title.pt;
                  const subtitle = article.subtitle[lang] || article.subtitle.pt;
                  const categoryName = article.category[lang] || article.category.pt;
                  const dateStr = article.date[lang] || article.date.pt;
                  const readTimeStr = article.readTime[lang] || article.readTime.pt;

                  return (
                    <article
                      key={article.id}
                      onClick={() => onOpenArticle(article.id)}
                      className="group bg-white rounded-2xl border border-[#D9E8F8] hover:border-[#2878D0] p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        {/* Article Image with 8-12px rounded corners */}
                        <div className="w-full h-40 sm:h-44 rounded-xl overflow-hidden mb-3.5 bg-[#E4F1FF] relative">
                          <img
                            src={article.image}
                            alt={title}
                            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                            loading="lazy"
                          />
                          {/* Category Badge in Soft Pink with Vibrant Pink Text */}
                          <div className="absolute top-2.5 left-2.5">
                            <span className="bg-[#FFE0EF] text-[#F51B83] text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs">
                              {categoryName}
                            </span>
                          </div>
                        </div>

                        {/* Title with Dark Navy Text */}
                        <h3 className="text-sm sm:text-base font-bold text-[#172B4D] group-hover:text-[#2878D0] transition-colors leading-snug line-clamp-2 mb-2">
                          {title}
                        </h3>

                        {/* Subtitle / Excerpt */}
                        <p className="text-xs text-[#647DA5] leading-relaxed line-clamp-2 mb-3">
                          {subtitle}
                        </p>
                      </div>

                      {/* Footer with Metadata & Blue Link */}
                      <div className="pt-3 border-t border-[#D9E8F8] flex items-center justify-between text-xs text-[#647DA5]">
                        <div className="flex items-center gap-2">
                          <span>{dateStr}</span>
                          <span>•</span>
                          <span>{readTimeStr}</span>
                        </div>

                        {/* Blue Action Link */}
                        <span className="text-[#2878D0] group-hover:text-[#1D65B5] font-semibold text-xs inline-flex items-center gap-1">
                          <span>{texts.readArticle}</span>
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </div>

          {/* =======================================================================
              SIDEBAR COLUMN (25%)
              ======================================================================= */}
          <aside className="w-full lg:w-[28%] xl:w-[26%] space-y-6">
            {/* SIDEBAR CARD 1: DAILY HOROSCOPE */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#D9E8F8] p-5 sm:p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#FFE0EF] text-[#F51B83] flex items-center justify-center text-sm font-bold">
                  ✨
                </div>
                <h3 className="text-base font-bold text-[#172B4D]">
                  {texts.sidebarDailyTitle}
                </h3>
              </div>

              <div className="p-3.5 rounded-xl bg-[#E4F1FF] border border-[#D9E8F8] mb-3.5">
                <span className="text-xs font-bold text-[#2878D0] block mb-1">
                  {texts.sidebarDailyEnergy}
                </span>
                <p className="text-xs text-[#17366F] leading-relaxed">
                  {texts.sidebarDailyDesc}
                </p>
              </div>

              {/* Botão Primário Rosa */}
              <button
                type="button"
                onClick={onNavigateToDailyMessage}
                className="w-full h-11 px-4 rounded-full bg-[#F51B83] hover:bg-[#D91470] text-white text-xs font-semibold transition-colors duration-150 cursor-pointer shadow-xs flex items-center justify-center gap-2 active:scale-95"
              >
                <span>{texts.sidebarDailyBtn}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* SIDEBAR CARD 2: POPULAR TOPICS */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#D9E8F8] p-5 sm:p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-4 pb-2.5 border-b border-[#D9E8F8]">
                <TrendingUp className="w-4 h-4 text-[#2878D0]" />
                <h3 className="text-base font-bold text-[#172B4D]">
                  {texts.sidebarTopicsTitle}
                </h3>
              </div>

              <div className="space-y-2">
                {[
                  { label: 'Amor & Compatibilidade', count: '12 artigos', cat: 'AMOR' },
                  { label: 'Lua & Emoções', count: '8 artigos', cat: 'LUA' },
                  { label: 'Signos & Personalidade', count: '15 artigos', cat: 'PERSONALIDADE' },
                  { label: 'Trabalho & Carreira Astral', count: '6 artigos', cat: 'ASTROLOGIA' },
                  { label: 'Aurenstar Dictionary', count: '16 termos', route: 'dicionario' },
                ].map((topic, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (topic.route === 'dicionario') {
                        onNavigateToDictionary();
                      } else if (topic.cat) {
                        handleCategoryClick(topic.cat);
                        document.getElementById('orkut-artigos')?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-[#E4F1FF] text-left transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <span className="text-xs font-semibold text-[#17366F] group-hover:text-[#2878D0]">
                      {topic.label}
                    </span>
                    <span className="text-[11px] font-medium text-[#647DA5] bg-white border border-[#D9E8F8] px-2 py-0.5 rounded-full">
                      {topic.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* SIDEBAR CARD 3: TRENDING ARTICLES WITH NOSTALGIC NUMBERS */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#D9E8F8] p-5 sm:p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-4 pb-2.5 border-b border-[#D9E8F8]">
                <Flame className="w-4 h-4 text-[#F51B83]" />
                <h3 className="text-base font-bold text-[#172B4D]">
                  {texts.sidebarTrendingTitle}
                </h3>
              </div>

              <div className="space-y-3">
                {trendingArticles.map((art, idx) => {
                  const artTitle = art.title[lang] || art.title.pt;
                  const isFirst = idx === 0;

                  return (
                    <button
                      key={art.id}
                      type="button"
                      onClick={() => onOpenArticle(art.id)}
                      className="w-full text-left flex items-start gap-3 group cursor-pointer"
                    >
                      {/* Nostalgic number badge */}
                      <span
                        className={`w-6 h-6 rounded-lg shrink-0 flex items-center justify-center text-xs font-black ${
                          isFirst
                            ? 'bg-[#FFE0EF] text-[#F51B83]'
                            : 'bg-[#E4F1FF] text-[#2878D0]'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span className="text-xs font-semibold text-[#172B4D] group-hover:text-[#2878D0] line-clamp-2 leading-snug transition-colors">
                        {artTitle}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SIDEBAR CARD 4: PRACTICAL ASTROLOGY TOOLS */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#D9E8F8] p-5 sm:p-6 shadow-xs space-y-3">
              <h3 className="text-base font-bold text-[#172B4D] pb-2 border-b border-[#D9E8F8]">
                {texts.sidebarToolsTitle}
              </h3>

              {/* Tool 1: Auren Effect */}
              <div className="p-3 rounded-xl border border-[#D9E8F8] bg-[#E4F1FF]/40 hover:bg-[#E4F1FF] transition-colors">
                <span className="text-xs font-bold text-[#17366F] block mb-0.5">
                  🔮 {texts.aurenEffectTitle}
                </span>
                <p className="text-[11px] text-[#647DA5] mb-2 leading-relaxed">
                  {texts.aurenEffectDesc}
                </p>
                <button
                  type="button"
                  onClick={onNavigateToAurenEffect}
                  className="w-full h-8 rounded-xl bg-[#2878D0] hover:bg-[#1D65B5] text-white text-[11px] font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  <span>Calcular Triade</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {/* Tool 2: Discover Sign */}
              <div className="p-3 rounded-xl border border-[#D9E8F8] bg-[#FFE0EF]/40 hover:bg-[#FFE0EF] transition-colors">
                <span className="text-xs font-bold text-[#17366F] block mb-0.5">
                  🌟 {texts.discoverSignTitle}
                </span>
                <p className="text-[11px] text-[#647DA5] mb-2 leading-relaxed">
                  {texts.discoverSignDesc}
                </p>
                <button
                  type="button"
                  onClick={onNavigateToDiscoverSign}
                  className="w-full h-8 rounded-xl bg-white text-[#F51B83] border border-[#FFE0EF] hover:bg-[#F51B83] hover:text-white text-[11px] font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  <span>Descobrir Signo</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {/* Tool 3: Dictionary */}
              <div className="p-3 rounded-xl border border-[#D9E8F8] bg-[#E4F1FF]/40 hover:bg-[#E4F1FF] transition-colors">
                <span className="text-xs font-bold text-[#17366F] block mb-0.5">
                  📖 {texts.dictTitle}
                </span>
                <p className="text-[11px] text-[#647DA5] mb-2 leading-relaxed">
                  {texts.dictDesc}
                </p>
                <button
                  type="button"
                  onClick={onNavigateToDictionary}
                  className="w-full h-8 rounded-xl bg-white text-[#2878D0] border border-[#D9E8F8] hover:bg-[#E4F1FF] text-[11px] font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  <span>Aurenstar Dictionary</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

