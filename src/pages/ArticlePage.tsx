import React, { useEffect, useState, useMemo } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Share2,
  Check,
  Bookmark,
  Sparkles,
  ChevronRight,
  Star,
  Home,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import {
  BlogArticleContent,
  BLOG_ARTICLES,
  AURENSTAR_AVATAR,
} from '../data/blogArticles';
import { ShareModal } from '../components/ShareModal';

interface ArticlePageProps {
  articleId: string;
  onBackToBlog: () => void;
  onBackToHome: () => void;
  onSelectArticle: (id: string) => void;
  onNavigateToDailyMessage?: () => void;
  onNavigateToAurenEffect?: () => void;
  onNavigateToDiscoverSign?: () => void;
}

export const ArticlePage: React.FC<ArticlePageProps> = ({
  articleId,
  onBackToBlog,
  onBackToHome,
  onSelectArticle,
  onNavigateToDailyMessage,
  onNavigateToAurenEffect,
  onNavigateToDiscoverSign,
}) => {
  const { language, t } = useLanguage();
  const lang = (language || 'pt') as 'pt' | 'en' | 'es';

  const [copied, setCopied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Check if article is already saved in browser favorites
  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem('aurenstar_browser_favorites') || '[]'
      );
      setIsBookmarked(saved.includes(articleId));
    } catch {
      setIsBookmarked(false);
    }
  }, [articleId]);

  const [bookmarkToast, setBookmarkToast] = useState<{
    show: boolean;
    message: string;
    submessage: string;
  } | null>(null);

  const article =
    BLOG_ARTICLES.find((a) => a.id === articleId) || BLOG_ARTICLES[0];

  // Scroll to top on article change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [articleId]);

  // Track window scroll progress for top progress bar
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  const handleToggleBookmark = () => {
    const nextState = !isBookmarked;
    setIsBookmarked(nextState);

    try {
      const saved = JSON.parse(
        localStorage.getItem('aurenstar_browser_favorites') || '[]'
      );
      let updated: string[];
      if (nextState) {
        updated = Array.from(new Set([...saved, article.id]));
      } else {
        updated = saved.filter((id: string) => id !== article.id);
      }
      localStorage.setItem(
        'aurenstar_browser_favorites',
        JSON.stringify(updated)
      );
    } catch {
      // Storage fallback
    }

    if (nextState) {
      const isMac =
        typeof navigator !== 'undefined' &&
        /Mac|iPod|iPhone|iPad/.test(navigator.platform);
      const shortcut = isMac ? '⌘ + D' : 'Ctrl + D';

      setBookmarkToast({
        show: true,
        message: l.bookmarkSuccess,
        submessage: l.bookmarkTip(shortcut),
      });
    } else {
      setBookmarkToast({
        show: true,
        message: l.bookmarkRemoved,
        submessage: '',
      });
    }

    setTimeout(() => {
      setBookmarkToast(null);
    }, 4500);
  };

  // Logical narrative next chapter flow
  const NEXT_CHAPTER_MAP: Record<string, string> = {
    'post-1': 'post-gemeos',     // Sun Signs -> Gemini Freedom Deep-Dive
    'post-gemeos': 'post-4',     // Gemini -> Zodiac Elements & Compatibility
    'post-4': 'post-2',          // Compatibility -> Moon Phases & Lunar Cycles
    'post-2': 'post-3',          // Moon Phases -> Morning Calm Rituals
    'post-3': 'post-5',          // Morning Rituals -> Cozy Peaceful Space at Home
    'post-5': 'post-6',          // Home Peace -> Zodiac & Evening Gratitude
    'post-6': 'post-1',          // Gratitude -> Sun Signs & Core Essence
  };

  const nextArticle = useMemo(() => {
    // 1. Explicit narrative chapter flow
    const targetId = NEXT_CHAPTER_MAP[article.id];
    if (targetId) {
      const found = BLOG_ARTICLES.find((a) => a.id === targetId);
      if (found) return found;
    }

    // 2. Same category fallback
    const sameCat = BLOG_ARTICLES.find(
      (a) => a.id !== article.id && a.category.pt === article.category.pt
    );
    if (sameCat) return sameCat;

    // 3. Sequential fallback
    const currentIdx = BLOG_ARTICLES.findIndex((a) => a.id === article.id);
    const nextIdx = (currentIdx + 1) % BLOG_ARTICLES.length;
    return BLOG_ARTICLES[nextIdx] || BLOG_ARTICLES[0];
  }, [article.id]);

  const labels = {
    pt: {
      backBtn: 'Voltar ao Blog',
      home: 'Início',
      blog: 'Blog',
      authorTitle: 'Insights Aurenstar',
      takeaways: 'Principais Reflexões',
      continueReading: 'CONTINUE LENDO',
      copiedToast: 'Link copiado com sucesso!',
      shareBtn: 'Compartilhar',
      bookmarkBtn: 'Salvar reflexão',
      bookmarked: 'Salvo nos favoritos',
      bookmarkSuccess: 'Publicação favoritada no seu navegador! ✨',
      bookmarkTip: (key: string) =>
        `Dica: Pressione ${key} para fixar na barra de favoritos do navegador.`,
      bookmarkRemoved: 'Publicação removida dos seus favoritos.',
      readMore: 'Ler artigo',
    },
    en: {
      backBtn: 'Back to Blog',
      home: 'Home',
      blog: 'Blog',
      authorTitle: 'Aurenstar Insights',
      takeaways: 'Key Takeaways',
      continueReading: 'CONTINUE READING',
      copiedToast: 'Link copied successfully!',
      shareBtn: 'Share',
      bookmarkBtn: 'Save reflection',
      bookmarked: 'Saved to favorites',
      bookmarkSuccess: 'Post saved to your browser favorites! ✨',
      bookmarkTip: (key: string) =>
        `Tip: Press ${key} to pin to your browser bookmarks bar.`,
      bookmarkRemoved: 'Post removed from your favorites.',
      readMore: 'Read article',
    },
    es: {
      backBtn: 'Volver al Blog',
      home: 'Inicio',
      blog: 'Blog',
      authorTitle: 'Insights Aurenstar',
      takeaways: 'Puntos Clave',
      continueReading: 'CONTINÚA LEYENDO',
      copiedToast: '¡Enlace copiado con éxito!',
      shareBtn: 'Compartir',
      bookmarkBtn: 'Guardar reflexión',
      bookmarked: 'Guardado en favoritos',
      bookmarkSuccess: '¡Publicación guardada en los favoritos del navegador! ✨',
      bookmarkTip: (key: string) =>
        `Consejo: Presiona ${key} para fijar en la barra del navegador.`,
      bookmarkRemoved: 'Publicación eliminada de tus favoritos.',
      readMore: 'Leer artículo',
    },
  };

  const l = labels[lang] || labels.pt;

  return (
    <article className="w-full bg-[#C9E5FF] min-h-screen text-[#172B4D] pt-20 sm:pt-24 pb-24 animate-fadeIn select-none">
      {/* Top Reading Progress Bar (Fixed at top) */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-black/5 z-50">
        <div
          className="h-full bg-gradient-to-r from-[#2878D0] via-[#17366F] to-[#F51B83] transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Toolbar & Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 mb-6 border-b border-[#D9E8F8]">
          {/* Breadcrumbs */}
          <nav aria-label="Navegação estrutural" className="flex items-center gap-2 text-xs text-[#647DA5]">
            <button
              onClick={onBackToHome}
              className="flex items-center gap-1 hover:text-[#172B4D] transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>{l.home}</span>
            </button>
            <ChevronRight className="w-3 h-3 text-[#647DA5]" />
            <button
              onClick={onBackToBlog}
              className="hover:text-[#172B4D] transition-colors cursor-pointer"
            >
              {l.blog}
            </button>
            <ChevronRight className="w-3 h-3 text-[#647DA5]" />
            <span className="font-semibold text-[#172B4D] truncate max-w-[150px] sm:max-w-xs">
              {article.category[lang] || article.category.pt}
            </span>
          </nav>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onBackToBlog}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#D9E8F8] bg-white/80 hover:bg-white text-xs font-bold text-[#172B4D] transition-all cursor-pointer shadow-xs group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              <span>{l.backBtn}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#D9E8F8] bg-white hover:bg-[#E4F1FF]/40 text-xs font-semibold text-[#647DA5] hover:text-[#172B4D] transition-all cursor-pointer shadow-xs group"
              title={l.shareBtn}
            >
              <Share2 className="w-3.5 h-3.5 text-[#2878D0] group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">{l.shareBtn}</span>
            </button>

            <button
              onClick={handleToggleBookmark}
              className={`p-2 rounded-full border transition-all cursor-pointer shadow-xs ${
                isBookmarked
                  ? 'border-[#2878D0] bg-[#2878D0] text-white shadow-sm ring-2 ring-[#2878D0]/30 scale-105'
                  : 'border-[#D9E8F8] bg-white hover:bg-[#E4F1FF]/40 text-[#647DA5] hover:text-[#172B4D]'
              }`}
              title={isBookmarked ? l.bookmarked : l.bookmarkBtn}
              aria-label={isBookmarked ? l.bookmarked : l.bookmarkBtn}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current text-white' : ''}`} />
            </button>
          </div>
        </div>

        {/* Main Article Container Card (White reading canvas on #C9E5FF background) */}
        <div className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-10 border border-[#D9E8F8] shadow-md mb-10">
          {/* Article Header */}
        <header className="mb-8">
          {/* Category Pill & Read Time */}
          <div className="flex items-center gap-3 mb-4">
            <span
              className={`inline-block px-3.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider text-white shadow-xs ${article.categoryColor}`}
            >
              {article.category[lang] || article.category.pt}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-[#647DA5] font-medium">
              <Clock className="w-3.5 h-3.5 text-[#647DA5]" />
              {article.readTime[lang] || article.readTime.pt}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#172B4D] leading-tight mb-4 tracking-tight">
            {article.title[lang] || article.title.pt}
          </h1>

          {/* Subtitle / Excerpt */}
          <p className="text-sm sm:text-lg text-[#647DA5] leading-relaxed mb-6 font-normal">
            {article.subtitle[lang] || article.subtitle.pt}
          </p>

          {/* Author Profile Row with Date & Time */}
          <div className="flex items-center gap-3.5 py-3.5 border-y border-[#D9E8F8]">
            <img
              src={AURENSTAR_AVATAR}
              alt="Aurenstar"
              className="w-11 h-11 rounded-full object-cover shrink-0 ring-1 ring-black/5 shadow-2xs"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-xs sm:text-sm font-bold text-[#172B4D] leading-tight truncate">
                Aurenstar
              </span>
              <span className="text-[11px] text-[#647DA5] font-medium leading-tight mt-0.5">
                {l.authorTitle} • {article.author.dateTime[lang] || article.author.dateTime.pt}
              </span>
            </div>
          </div>
        </header>

        {/* Featured Image - Aligned with Aurenstar profile */}
        <figure className="mb-10 w-full">
          <div className="w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-[#D9E8F8] shadow-sm bg-slate-50">
            <img
              src={article.image}
              alt={article.title[lang] || article.title.pt}
              className="w-full h-auto max-h-[380px] sm:max-h-[420px] object-cover"
            />
          </div>
          {article.imageCaption && (
            <figcaption className="text-xs text-[#647DA5] mt-2.5 italic font-medium">
              {article.imageCaption[lang] || article.imageCaption.pt}
            </figcaption>
          )}
        </figure>

        {/* Article Body Content */}
        <div className="prose max-w-none text-[#172B4D]">
          {/* Quote Callout Box */}
          {article.quote && (
            <blockquote className="my-8 p-6 rounded-2xl bg-[#E4F1FF] border-l-4 border-[#2878D0] shadow-xs">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#2878D0] shrink-0 mt-0.5" />
                <p className="text-sm sm:text-base font-semibold italic text-[#172B4D] leading-relaxed">
                  "{article.quote[lang] || article.quote.pt}"
                </p>
              </div>
            </blockquote>
          )}

          {/* Sections */}
          {article.sections.map((section, idx) => (
            <section key={`sec-${idx}`} className="mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-[#17366F] mb-3 tracking-tight">
                {section.heading[lang] || section.heading.pt}
              </h2>
              {section.paragraphs.map((p, pIdx) => (
                <p
                  key={`p-${pIdx}`}
                  className="text-sm sm:text-base text-[#172B4D] leading-relaxed mb-4 font-normal"
                >
                  {p[lang] || p.pt}
                </p>
              ))}
            </section>
          ))}

          {/* Key Takeaways Box */}
          {article.keyTakeaways && (
            <div className="my-10 p-6 sm:p-7 rounded-2xl bg-[#E4F1FF]/60 border border-[#D9E8F8] shadow-xs">
              <h3 className="text-sm sm:text-base font-bold text-[#17366F] uppercase tracking-wider mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#2878D0]" />
                {l.takeaways}
              </h3>
              <ul className="space-y-2.5">
                {(article.keyTakeaways[lang] || article.keyTakeaways.pt).map(
                  (item, kIdx) => (
                    <li
                      key={`takeaway-${kIdx}`}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-[#172B4D]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2878D0] mt-2 shrink-0" />
                      <span>{item}</span>
                    </li>
                  )
                )}
              </ul>
            </div>
          )}
        </div>
        </div>

        {/* =========================================================================
            NEXT CHAPTER / CONTINUE LENDO CARD (Matching user uploaded card)
            ========================================================================= */}
        {nextArticle && (
          <section className="pt-10 pb-4 border-t border-[#D9E8F8] max-w-3xl mx-auto my-10">
            {/* Centered Heading */}
            <h3 className="text-center font-extrabold text-lg sm:text-xl text-[#17366F] tracking-wider uppercase mb-5">
              {l.continueReading}
            </h3>

            {/* Horizontal Chapter Card matching Card Continue Lendo.png */}
            <div
              onClick={() => onSelectArticle(nextArticle.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectArticle(nextArticle.id);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`${l.continueReading}: ${nextArticle.title[lang] || nextArticle.title.pt}`}
              className="w-full bg-white rounded-2xl sm:rounded-3xl border border-[#D9E8F8] shadow-sm hover:shadow-md hover:border-[#2878D0]/40 transition-all duration-300 p-3 sm:p-4.5 flex items-center justify-between gap-3 sm:gap-6 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#2878D0]/40"
            >
              {/* Left Thumbnail Image */}
              <div className="w-28 sm:w-44 h-20 sm:h-28 rounded-xl sm:rounded-2xl overflow-hidden shrink-0 bg-slate-100 relative shadow-2xs">
                <img
                  src={nextArticle.image}
                  alt={nextArticle.title[lang] || nextArticle.title.pt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>

              {/* Middle Content */}
              <div className="flex-1 min-w-0 pr-1 sm:pr-2">
                <span className="block text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-[#2878D0] mb-1">
                  {nextArticle.category[lang] || nextArticle.category.pt}
                </span>

                <h4 className="font-bold text-xs sm:text-base lg:text-lg text-[#172B4D] leading-snug group-hover:text-[#2878D0] transition-colors line-clamp-2 mb-1">
                  {nextArticle.title[lang] || nextArticle.title.pt}
                </h4>

                <p className="text-[11px] sm:text-xs text-[#647DA5] leading-relaxed line-clamp-2 font-normal">
                  {nextArticle.subtitle[lang] || nextArticle.subtitle.pt}
                </p>
              </div>

              {/* Right Arrow */}
              <div className="shrink-0 text-[#17366F] group-hover:text-[#2878D0] group-hover:translate-x-1.5 transition-all duration-300 pr-1 sm:pr-2">
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Modal Interativo de Compartilhamento em Redes Sociais */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={article.title[lang] || article.title.pt}
        image={article.image}
        category={article.category[lang] || article.category.pt}
      />

      {/* Floating Bookmark Toast Notification */}
      {bookmarkToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-white/95 backdrop-blur-md border border-[#2878D0]/30 rounded-2xl p-4 shadow-xl shadow-[#2878D0]/15 flex items-start gap-3 animate-fadeIn">
          <div className="w-8 h-8 rounded-full bg-[#2878D0]/10 text-[#2878D0] flex items-center justify-center shrink-0 mt-0.5">
            <Bookmark className="w-4 h-4 fill-current" />
          </div>
          <div className="flex-1 min-w-0 pr-1">
            <p className="text-xs sm:text-sm font-bold text-[#172B4D] leading-tight">
              {bookmarkToast.message}
            </p>
            {bookmarkToast.submessage && (
              <p className="text-[11px] text-[#647DA5] leading-snug mt-1">
                {bookmarkToast.submessage}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => setBookmarkToast(null)}
            className="text-[#647DA5] hover:text-[#172B4D] p-0.5 cursor-pointer"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>
      )}
    </article>
  );
};
