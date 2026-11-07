import React, { useEffect, useState } from 'react';
import { ArrowLeft, Clock, Share2, Check, Bookmark, Sparkles, ChevronRight, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { BlogArticleContent, BLOG_ARTICLES } from '../data/blogArticles';

// Official Aurenstar brand avatar SVG
const AURENSTAR_AVATAR = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g" x1="0%25" y1="0%25" x2="100%25" y2="100%25"><stop offset="0%25" stop-color="%233982C8"/><stop offset="50%25" stop-color="%2317366F"/><stop offset="100%25" stop-color="%23E73578"/></linearGradient></defs><circle cx="50" cy="50" r="50" fill="url(%23g)"/><path d="M50 18 L55 42 L79 42 L60 56 L67 80 L50 66 L33 80 L40 56 L21 42 L45 42 Z" fill="%23ffffff"/></svg>`;

interface ArticleModalProps {
  articleId: string | null;
  onClose: () => void;
  onSelectArticle: (id: string) => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  articleId,
  onClose,
  onSelectArticle,
}) => {
  const { language } = useLanguage();
  const lang = (language || 'pt') as 'pt' | 'en' | 'es';

  const [copied, setCopied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const article = BLOG_ARTICLES.find((a) => a.id === articleId) || null;

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (article) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [article, onClose]);

  // Track scroll inside reader
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const progress =
      (target.scrollTop / (target.scrollHeight - target.clientHeight)) * 100;
    setScrollProgress(Math.min(100, Math.max(0, progress)));
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (!article) return null;

  // Find next article
  const currentIndex = BLOG_ARTICLES.findIndex((a) => a.id === article.id);
  const nextArticle = BLOG_ARTICLES[(currentIndex + 1) % BLOG_ARTICLES.length];

  const labels = {
    pt: {
      backBtn: 'Voltar para o Blog',
      authorTitle: 'Astrologia & Bem-Estar',
      takeaways: 'Principais Reflexões',
      nextArticle: 'Próxima Leitura',
      copiedToast: 'Link copiado!',
      shareBtn: 'Compartilhar',
      bookmarkBtn: 'Salvar',
    },
    en: {
      backBtn: 'Back to Blog',
      authorTitle: 'Astrology & Wellness',
      takeaways: 'Key Takeaways',
      nextArticle: 'Next Article',
      copiedToast: 'Link copied!',
      shareBtn: 'Share',
      bookmarkBtn: 'Save',
    },
    es: {
      backBtn: 'Volver al Blog',
      authorTitle: 'Astrología y Bienestar',
      takeaways: 'Puntos Principales',
      nextArticle: 'Próxima Lectura',
      copiedToast: '¡Enlace copiado!',
      shareBtn: 'Compartir',
      bookmarkBtn: 'Guardar',
    },
  };

  const l = labels[lang] || labels.pt;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-[#1E1E2F]/60 backdrop-blur-sm flex justify-center overflow-hidden animate-fadeIn"
    >
      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-black/10 z-50">
        <div
          className="h-full bg-[#3982C8] transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Reader Container */}
      <div
        onScroll={handleScroll}
        className="w-full max-w-4xl h-full bg-[#FFFFFF] overflow-y-auto flex flex-col justify-between shadow-2xl relative"
      >
        {/* Sticky Top Navigation Bar */}
        <header className="sticky top-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#D9E8F8] px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#172B4D] hover:text-[#3982C8] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>{l.backBtn}</span>
          </button>

          {/* Action buttons (Share, Bookmark, Close) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#D9E8F8] bg-white hover:bg-[#E4F1FF] text-xs font-semibold text-[#647DA5] hover:text-[#3982C8] transition-all cursor-pointer shadow-2xs"
              title={l.shareBtn}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">{l.copiedToast}</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{l.shareBtn}</span>
                </>
              )}
            </button>

            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-2 rounded-full border border-[#D9E8F8] bg-white hover:bg-[#E4F1FF] transition-all cursor-pointer shadow-2xs ${
                isBookmarked ? 'text-[#3982C8] fill-[#3982C8]' : 'text-[#647DA5]'
              }`}
              title={l.bookmarkBtn}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-[#3982C8]' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full border border-[#D9E8F8] bg-white hover:bg-rose-50 text-[#647DA5] hover:text-rose-600 transition-all cursor-pointer shadow-2xs ml-1"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Article Body Content */}
        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 w-full">
          {/* Metadata pill & read time */}
          <div className="flex items-center gap-3 mb-4">
            <span
              className={`inline-block px-3 py-1 rounded-full text-[10px] sm:text-xs font-extrabold uppercase tracking-wider ${article.categoryColor}`}
            >
              {article.category[lang] || article.category.pt}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-[#647DA5] font-medium">
              <Clock className="w-3.5 h-3.5" />
              {article.readTime[lang] || article.readTime.pt}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#172B4D] leading-tight mb-4 tracking-tight">
            {article.title[lang] || article.title.pt}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-[#647DA5] leading-relaxed mb-6 font-normal">
            {article.subtitle[lang] || article.subtitle.pt}
          </p>

          {/* Author Header Row */}
          <div className="flex items-center gap-3 py-3 border-y border-[#D9E8F8] mb-8">
            <img decoding="async"
              src={AURENSTAR_AVATAR}
              alt="Aurenstar"
              className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-black/5"
            />
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-bold text-[#172B4D] leading-tight">
                Aurenstar
              </span>
              <span className="text-[11px] text-[#647DA5] mt-0.5">
                {l.authorTitle} • {article.author.dateTime[lang] || article.author.dateTime.pt}
              </span>
            </div>
          </div>

          {/* Featured Image */}
          <figure className="mb-8">
            <div className="rounded-2xl overflow-hidden border border-[#D9E8F8] shadow-sm max-h-[380px] bg-slate-100">
              <img decoding="async"
                src={article.image}
                alt={article.title[lang] || article.title.pt}
                className="w-full h-full object-cover max-h-[380px]"
              />
            </div>
            <figcaption className="text-center text-xs text-[#647DA5] mt-2.5 italic">
              {article.imageCaption[lang] || article.imageCaption.pt}
            </figcaption>
          </figure>

          {/* Article Editorial Sections */}
          <div className="space-y-8 text-[#172B4D]">
            {article.sections.map((section, sIdx) => (
              <section key={`sec-${sIdx}`} className="space-y-3">
                <h2 className="text-lg sm:text-xl font-bold text-[#172B4D] tracking-tight">
                  {section.heading[lang] || section.heading.pt}
                </h2>
                {section.paragraphs.map((p, pIdx) => (
                  <p
                    key={`p-${pIdx}`}
                    className="text-sm sm:text-base leading-relaxed text-[#647DA5] font-normal"
                  >
                    {p[lang] || p.pt}
                  </p>
                ))}
              </section>
            ))}

            {/* Blockquote with brand decoration */}
            <div className="my-8 p-5 sm:p-6 rounded-2xl bg-[#E4F1FF] border-l-4 border-[#3982C8] border-y border-r border-[#D9E8F8] shadow-xs">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#3982C8] shrink-0 mt-0.5" />
                <p className="text-sm sm:text-base italic font-medium text-[#172B4D] leading-relaxed">
                  "{article.quote[lang] || article.quote.pt}"
                </p>
              </div>
            </div>

            {/* Key Takeaways Card */}
            {(article.keyTakeaways?.[lang]?.length || article.keyTakeaways?.pt?.length) ? (
            <div className="p-5 sm:p-6 rounded-2xl bg-[#FFFFFF] border border-[#D9E8F8] shadow-xs">
              <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#172B4D] mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#3982C8]" />
                {l.takeaways}
              </h3>
              <ul className="space-y-2.5">
                {(article.keyTakeaways[lang] || article.keyTakeaways.pt).map((item, tIdx) => (
                  <li key={`takeaway-${tIdx}`} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#647DA5]">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            ) : null}
          </div>

          {/* Next Article Card recommendation */}
          {nextArticle && (
            <div className="mt-12 pt-8 border-t border-[#D9E8F8]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#647DA5] mb-3 block">
                {l.nextArticle}
              </span>
              <button
                onClick={() => onSelectArticle(nextArticle.id)}
                className="w-full text-left bg-white border border-[#D9E8F8] hover:border-[#3982C8]/50 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 transition-all duration-200 hover:-translate-y-0.5 shadow-2xs group cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img decoding="async"
                    src={nextArticle.image}
                    alt={nextArticle.title[lang] || nextArticle.title.pt}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase mb-1.5 ${nextArticle.categoryColor}`}
                    >
                      {nextArticle.category[lang] || nextArticle.category.pt}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-[#172B4D] group-hover:text-[#3982C8] transition-colors truncate">
                      {nextArticle.title[lang] || nextArticle.title.pt}
                    </h4>
                    <span className="text-[11px] text-[#647DA5] mt-0.5 block">
                      {nextArticle.readTime[lang] || nextArticle.readTime.pt}
                    </span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#E4F1FF] group-hover:bg-[#3982C8] group-hover:text-white flex items-center justify-center shrink-0 transition-all text-[#3982C8]">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          )}
        </main>

        <footer className="border-t border-[#D9E8F8] bg-white px-4 sm:px-8 py-4 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#647DA5] hover:text-[#3982C8] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{l.backBtn}</span>
          </button>
          <span className="text-xs text-[#647DA5]">Aurenstar © {new Date().getFullYear()}</span>
        </footer>
      </div>
    </div>
  );
};
