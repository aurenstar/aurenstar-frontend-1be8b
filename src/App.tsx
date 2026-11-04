import React, { useState, useEffect, useRef, useCallback, startTransition, lazy, Suspense } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { stripLangPrefix } from './utils/urlLang';
import { SiteLocalizer } from './components/SiteLocalizer';
import { AdBlockGate } from './components/AdBlockGate';
import { ConsentBanner } from './components/ConsentBanner';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { BrandMarquee } from './components/BrandMarquee';
import { FaqSection } from './components/FaqSection';
import { CommentsSection } from './components/CommentsSection';
import { TshirtCapture } from './components/TshirtCapture';
import { isOnTshirtList } from './utils/subscribe';
import { BlogCardsSection } from './components/BlogCardsSection';
import { AboutAurenstarSection } from './components/AboutAurenstarSection';
import { ToolExplainerSection } from './components/ToolExplainerSection';
import { Footer } from './components/Footer';
import { FEATURES } from './data/features';
import { updateSeo } from './utils/seo';
import { trackPageView } from './utils/analytics';
import { findArticleByParam, getArticleSlugById } from './utils/articleSlug';
import { getCategoryByKey, getCategoryBySlug, getCategoryPath } from './utils/blogCategories';

// Pages other than the home screen load only when visited (smaller first download).
const BlogPage = lazy(() => import('./pages/BlogPage').then((m) => ({ default: m.BlogPage })));
const ArticlePage = lazy(() => import('./pages/ArticlePage').then((m) => ({ default: m.ArticlePage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })));
const CreditsPage = lazy(() => import('./pages/CreditsPage').then((m) => ({ default: m.CreditsPage })));
const LegalPage = lazy(() => import('./pages/LegalPage').then((m) => ({ default: m.LegalPage })));
const CompatibilityPage = lazy(() => import('./pages/CompatibilityPage').then((m) => ({ default: m.CompatibilityPage })));
const TransitsPage = lazy(() => import('./pages/TransitsPage').then((m) => ({ default: m.TransitsPage })));
const NewsletterPage = lazy(() => import('./pages/NewsletterPage').then((m) => ({ default: m.NewsletterPage })));
const DailyMessagePage = lazy(() => import('./pages/DailyMessagePage').then((m) => ({ default: m.DailyMessagePage })));
const DailyReadingResultPage = lazy(() => import('./pages/DailyReadingResultPage').then((m) => ({ default: m.DailyReadingResultPage })));
const AurenEffectPage = lazy(() => import('./pages/AurenEffectPage').then((m) => ({ default: m.AurenEffectPage })));
const AurenEffectResultPage = lazy(() => import('./pages/AurenEffectResultPage').then((m) => ({ default: m.AurenEffectResultPage })));
const DiscoverSignPage = lazy(() => import('./pages/DiscoverSignPage').then((m) => ({ default: m.DiscoverSignPage })));
const DiscoverSignResultPage = lazy(() => import('./pages/DiscoverSignResultPage').then((m) => ({ default: m.DiscoverSignResultPage })));
const DictionaryLayout = lazy(() => import('./components/dictionary/DictionaryLayout').then((m) => ({ default: m.DictionaryLayout })));
const PublicDictionaryPage = lazy(() => import('./pages/PublicDictionaryPage').then((m) => ({ default: m.PublicDictionaryPage })));
const PublicDictionaryTermPage = lazy(() => import('./pages/PublicDictionaryTermPage').then((m) => ({ default: m.PublicDictionaryTermPage })));
const DescribeMePage = lazy(() => import('./pages/DescribeMePage').then((m) => ({ default: m.DescribeMePage })));
const DescribeMeResultPage = lazy(() => import('./pages/DescribeMeResultPage').then((m) => ({ default: m.DescribeMeResultPage })));
const AboutProfilePage = lazy(() => import('./pages/AboutProfilePage').then((m) => ({ default: m.AboutProfilePage })));

export type AppPageRoute =
  | 'home'
  | 'blog'
  | 'article'
  | 'contact'
  | 'credits'
  | 'privacy'
  | 'terms'
  | 'compatibility'
  | 'transits'
  | 'newsletter'
  | 'daily-message'
  | 'daily-reading-result'
  | 'aureneffect'
  | 'aureneffect-result'
  | 'discover-sign'
  | 'discover-sign-result'
  | 'dictionary'
  | 'dicionario'
  | 'dicionario-termo'
  | 'about-detail'
  | 'describe-me'
  | 'describe-me-result';

/** Slim version of the sign-up, right after the tools, so more visitors see it without scrolling to the end. */
function TshirtMiniSection() {
  if (isOnTshirtList()) return null;
  return (
    <section className="w-full bg-[#C9E5FF] px-0 py-6 sm:py-8">
      <TshirtCapture source="home" variant="mini" />
    </section>
  );
}

export default function App() {
  const [currentPage, setCurrentPageNow] = useState<AppPageRoute>('home');
  // After the first route is read, page changes are 'transitions': the page you are on stays on screen
  // until the next one has finished loading (no empty gap with the footer jumping up).
  const booted = useRef(false);
  const setCurrentPage = useCallback((p: AppPageRoute) => {
    if (booted.current) startTransition(() => setCurrentPageNow(p));
    else setCurrentPageNow(p);
  }, []);
  const [currentArticleId, setCurrentArticleId] = useState<string>('post-1');
  const [currentTermSlug, setCurrentTermSlug] = useState<string>('what-is-mercury-retrograde');
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  // Blog category shown on /blog ('ALL') or /blog/categoria/<slug>
  const [blogCategory, setBlogCategory] = useState<string>('ALL');

  // Initialize and synchronize with browser hash / history for pageview strategy
  useEffect(() => {
    const syncRouteFromHash = () => {
      const path = stripLangPrefix(window.location.pathname).replace(/\/$/, '') || '/';
      const hash = window.location.hash;
      const route = path !== '/' ? path : hash;
      const normalizedRoute = route.replace(/^#\/?/, '/');
      // Keep dedicated pages reachable on Netlify whether the browser preserves
      // the pathname or rewrites it to a hash route during the first load.
      const routeMatches = (...values: string[]) => values.includes(path) || values.includes(hash) || values.includes(normalizedRoute);
      if (route.startsWith('/blog/categoria/')) {
        const categorySlug = route.replace('/blog/categoria/', '').split('?')[0].replace(/\/$/, '');
        setBlogCategory(getCategoryBySlug(categorySlug)?.key ?? 'ALL');
        setCurrentPage('blog');
      } else if (route.startsWith('/blog/') || route.startsWith('#/article/')) {
        const rawParam = (route.startsWith('/blog/') ? route.replace('/blog/', '') : route.replace('#/article/', ''))
          .split('?')[0];
        // Public URLs use a keyword slug; legacy id URLs (/blog/post-1) still resolve.
        const found = findArticleByParam(rawParam);
        setCurrentArticleId(found?.id ?? (rawParam || 'post-1'));
        setCurrentPage('article');
        if (found && path.startsWith('/blog/') && rawParam !== getArticleSlugById(found.id)) {
          window.history.replaceState(window.history.state, '', `/blog/${getArticleSlugById(found.id)}`);
        }
      } else if (
        normalizedRoute.startsWith('/dicionario/') ||
        normalizedRoute.startsWith('/dictionary/') ||
        normalizedRoute.startsWith('/dicionary/')
      ) {
        const raw = normalizedRoute.replace(/^\/(?:dicionario|dictionary|dicionary)\//, '');
        const slug = raw.split('?')[0].trim().toLowerCase();
        setCurrentTermSlug(slug || 'what-is-mercury-retrograde');
        setCurrentPage('dicionario-termo');
      } else if (path === '/blog' || hash === '#/blog') {
        setBlogCategory('ALL');
        setCurrentPage('blog');
      } else if (path === '/contact' || hash === '#/contact') {
        setCurrentPage('contact');
      } else if (path === '/credits' || hash === '#/credits') {
        setCurrentPage('credits');
      } else if (FEATURES.compatibility && (path === '/compatibility' || hash === '#/compatibility')) {
        setCurrentPage('compatibility');
      } else if (FEATURES.transits && (path === '/transits' || hash === '#/transits')) {
        setCurrentPage('transits');
      } else if (path === '/privacy' || hash === '#/privacy') {
        setCurrentPage('privacy');
      } else if (path === '/terms' || hash === '#/terms') {
        setCurrentPage('terms');
      } else if (path === '/newsletter' || hash === '#/newsletter') {
        setCurrentPage('newsletter');
      } else if (routeMatches('/descreva-me', '/describe-me', '#/descreva-me')) {
        setCurrentPage('describe-me');
      } else if (routeMatches('/descreva-me-result', '/describe-me-result', '#/descreva-me-result')) {
        setCurrentPage('describe-me-result');
      } else if (path === '/daily-message' || hash === '#/daily-message') {
        setCurrentPage('daily-message');
      } else if (path === '/daily-reading-result' || hash === '#/daily-reading-result' || hash === '#/daily-reading') {
        setCurrentPage('daily-reading-result');
      } else if (path === '/aureneffect-result' || hash === '#/aureneffect-result') {
        setCurrentPage('aureneffect-result');
      } else if (path === '/aureneffect' || hash === '#/aureneffect') {
        setCurrentPage('aureneffect');
      } else if (path === '/discover-sign' || hash === '#/discover-sign') {
        setCurrentPage('discover-sign');
      } else if (path === '/discover-sign-result' || hash === '#/discover-sign-result') {
        setCurrentPage('discover-sign-result');
      } else if (path === '/dictionary' || hash === '#/dictionary' || hash === '#/aurenstar-dictionary') {
        // The internal dictionary editor is a work tool: visitors of the live site get the public dictionary instead.
        // To open the editor on the live site, run localStorage.setItem('aurenstar_admin','1') once in that browser.
        let admin = import.meta.env.DEV;
        try { admin = admin || localStorage.getItem('aurenstar_admin') === '1'; } catch { /* storage blocked */ }
        setCurrentPage(admin ? 'dictionary' : 'dicionario');
      } else if (path === '/dicionario' || hash === '#/dicionario' || hash === '#/dicionary') {
        setCurrentPage('dicionario');
      } else if (path === '/about' || path.startsWith('/about/')) {
        setCurrentPage('about-detail');
      } else {
        setCurrentPage('home');
      }
    };

    syncRouteFromHash();
    booted.current = true;
    window.addEventListener('popstate', syncRouteFromHash);
    window.addEventListener('hashchange', syncRouteFromHash);
    return () => {
      window.removeEventListener('popstate', syncRouteFromHash);
      window.removeEventListener('hashchange', syncRouteFromHash);
    };
  }, []);

  useEffect(() => {
    try {
      updateSeo(currentPage, {
        articleId: currentArticleId,
        termSlug: currentTermSlug,
        categorySlug: getCategoryByKey(blogCategory)?.slug,
      });
    } catch (error) {
      // SEO metadata must never prevent the application UI from rendering.
      console.error('Unable to update SEO metadata:', error);
    }
    // Deferred briefly: on a deep link the first render still shows 'home' before the URL is read,
    // and that intermediate state must not be counted as a page view.
    const pageViewTimer = window.setTimeout(trackPageView, 100);
    return () => window.clearTimeout(pageViewTimer);
  }, [currentPage, currentArticleId, currentTermSlug, blogCategory]);

  const handleNavigate = (page: AppPageRoute) => {
    setCurrentPage(page);
    if (page === 'blog') setBlogCategory('ALL');
    if (page === 'home') {
      window.history.pushState({ page: 'home' }, '', '/');
    } else {
      // Public URLs of the "describe me" pages are /descreva-me*
      const path =
        page === 'about-detail'
          ? '/about'
          : page === 'dicionario'
          ? '/dicionario'
          : page === 'describe-me'
          ? '/descreva-me'
          : page === 'describe-me-result'
          ? '/descreva-me-result'
          : `/${page}`;
      window.history.pushState({ page }, '', path);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectBlogCategory = (categoryKey: string) => {
    setBlogCategory(categoryKey);
    setCurrentPage('blog');
    window.history.pushState({ page: 'blog', category: categoryKey }, '', getCategoryPath(categoryKey));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenArticle = (articleId: string) => {
    setCurrentArticleId(articleId);
    setCurrentPage('article');
    window.history.pushState(
      { page: 'article', id: articleId },
      '',
      `/blog/${encodeURIComponent(getArticleSlugById(articleId))}`
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenTerm = (termSlug: string) => {
    const cleanSlug = termSlug.toLowerCase().trim();
    setCurrentTermSlug(cleanSlug);
    setCurrentPage('dicionario-termo');
    window.history.pushState(
      { page: 'dicionario-termo', slug: cleanSlug },
      '',
      `/dicionario/${encodeURIComponent(cleanSlug)}`
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAbout = (_section?: string) => {
    setCurrentPage('about-detail');
    window.history.pushState({ page: 'about-detail' }, '', '/about');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToDescribeMe = () => handleNavigate('describe-me');
  const handleNavigateToDescribeMeResult = () => handleNavigate('describe-me-result');

  if (currentPage === 'dictionary') {
    return (
      <LanguageProvider>
        <Suspense fallback={null}>
          <DictionaryLayout onBackToPublicSite={() => handleNavigate('home')} />
        </Suspense>
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider>
      <SiteLocalizer />
      <AdBlockGate />
      <ConsentBanner />
      <div className="min-h-screen bg-[#C9E5FF] text-[#172B4D] font-sans selection:bg-[#E73578] selection:text-[#FFFFFF] flex flex-col justify-between">
        {/* Top Header with Navigation & Language Switcher */}
        <Navbar
          activePage={
            currentPage === 'article'
              ? 'blog'
              : currentPage === 'dicionario-termo'
              ? 'dicionario'
              : currentPage === 'daily-message' ||
                currentPage === 'aureneffect' ||
                currentPage === 'discover-sign'
              ? 'home'
              : currentPage
          }
          onNavigate={handleNavigate}
        />

        {/* Dynamic Page Routing (Dedicated Views for Pageviews Strategy) */}
        <Suspense fallback={<main className="flex-1 min-h-[100vh]" />}>
        {currentPage === 'home' && (
          <main className="flex-1">
            {/* Hero Section with direct page routes */}
            <HeroSection
              onNavigateToDailyMessage={() => handleNavigate('daily-message')}
              onNavigateToAurenEffect={() => handleNavigate('aureneffect')}
              onNavigateToDiscoverSign={() => handleNavigate('discover-sign')}
              onNavigateToDescribeMe={handleNavigateToDescribeMe}
            />

            {/* Tool navigation section shown directly after the hero */}
            <ToolExplainerSection onNavigate={(tool) => handleNavigate(tool)} />
            <TshirtMiniSection />

            {/* Trending Articles Section */}
            <BlogCardsSection
              onOpenArticle={handleOpenArticle}
              selectedSign={selectedSign}
              onSelectSign={setSelectedSign}
            />

            {/* About Aurenstar Section */}
            <AboutAurenstarSection onOpenCard={handleOpenAbout} />

            {/* T-shirt waiting list (hidden for people already on it), then the FAQ as the last section */}
            <CommentsSection />
            <FaqSection />

            {/* Zodiac panel above the footer */}
            <BrandMarquee
              joinFooter
              selectedSign={selectedSign}
              onSelectSign={setSelectedSign}
            />


          </main>
        )}

        {currentPage === 'blog' && (
          <main className="flex-1">
            {/* Dedicated Separate Blog Catalog Page */}
            <BlogPage
              onBackToHome={() => handleNavigate('home')}
              onOpenArticle={handleOpenArticle}
              selectedCategory={blogCategory}
              onSelectCategory={handleSelectBlogCategory}
            />
          </main>
        )}

        {currentPage === 'article' && (
          <main className="flex-1">
            {/* Dedicated Full Page Article (Pageviews Strategy) */}
            <ArticlePage
              articleId={currentArticleId}
              onBackToBlog={() => handleNavigate('blog')}
              onBackToHome={() => handleNavigate('home')}
              onSelectArticle={handleOpenArticle}
              onNavigateToDailyMessage={() => handleNavigate('daily-message')}
              onNavigateToAurenEffect={() => handleNavigate('aureneffect')}
              onNavigateToDiscoverSign={() => handleNavigate('discover-sign')}
            />
          </main>
        )}

        {currentPage === 'contact' && (
          <main className="flex-1">
            {/* Dedicated Contact Page */}
            <ContactPage
              onBackToHome={() => handleNavigate('home')}
              onNavigateToBlog={() => handleNavigate('blog')}
            />
          </main>
        )}

        {currentPage === 'credits' && (
          <main className="flex-1">
            <CreditsPage
              onBackToHome={() => handleNavigate('home')}
              onNavigateToBlog={() => handleNavigate('blog')}
            />
          </main>
        )}

        {currentPage === 'compatibility' && (
          <main className="flex-1">
            <CompatibilityPage onBackToHome={() => handleNavigate('home')} onNavigateToBlog={() => handleNavigate('blog')} />
          </main>
        )}

        {currentPage === 'transits' && (
          <main className="flex-1">
            <TransitsPage onBackToHome={() => handleNavigate('home')} onNavigateToBlog={() => handleNavigate('blog')} />
          </main>
        )}

        {(currentPage === 'privacy' || currentPage === 'terms') && (
          <main className="flex-1">
            <LegalPage kind={currentPage} onBackToHome={() => handleNavigate('home')} />
          </main>
        )}

        {currentPage === 'newsletter' && (
          <main className="flex-1">
            {/* Dedicated Functional Newsletter Page */}
            <NewsletterPage
              onBackToHome={() => handleNavigate('home')}
              onNavigateToBlog={() => handleNavigate('blog')}
            />
          </main>
        )}

        {/* Tool 1: Dedicated Daily Message Form Page */}
        {currentPage === 'daily-message' && (
          <main className="flex-1">
            <DailyMessagePage
              onBackToHome={() => handleNavigate('home')}
              onNavigateToBlog={() => handleNavigate('blog')}
              onOpenArticle={handleOpenArticle}
              onNavigateToResult={() => handleNavigate('daily-reading-result')}
            />
          </main>
        )}

        {/* Dedicated Daily Reading Result Page (Pageviews Strategy + Story Card) */}
        {currentPage === 'daily-reading-result' && (
          <main className="flex-1">
            <DailyReadingResultPage
              onBackToHome={() => handleNavigate('home')}
              onNavigateToBlog={() => handleNavigate('blog')}
              onOpenArticle={handleOpenArticle}
              onNavigateToForm={() => handleNavigate('daily-message')}
            />
          </main>
        )}

        {/* Tool 2: Dedicated Auren Effect Page */}
        {currentPage === 'aureneffect' && (
          <main className="flex-1">
            <AurenEffectPage
              onBackToHome={() => handleNavigate('home')}
              onNavigateToBlog={() => handleNavigate('blog')}
              onNavigateToNewsletter={() => handleNavigate('newsletter')}
              onNavigateToResult={() => handleNavigate('aureneffect-result')}
            />
          </main>
        )}

        {/* Dedicated Auren Effect Result Page (Pageviews Strategy) */}
        {currentPage === 'aureneffect-result' && (
          <main className="flex-1">
            <AurenEffectResultPage
              onBackToForm={() => handleNavigate('aureneffect')}
              onBackToHome={() => handleNavigate('home')}
              onNavigateToBlog={() => handleNavigate('blog')}
            />
          </main>
        )}

        {/* Tool 3: Dedicated Discover Sign Page */}
        {currentPage === 'discover-sign' && (
          <main className="flex-1">
            <DiscoverSignPage
              onBackToHome={() => handleNavigate('home')}
              onNavigateToBlog={() => handleNavigate('blog')}
              onNavigateToResult={() => handleNavigate('discover-sign-result')}
            />
          </main>
        )}

        {/* Dedicated Discover Sign Result Page */}
        {currentPage === 'discover-sign-result' && (
          <main className="flex-1">
            <DiscoverSignResultPage
              onBackToForm={() => handleNavigate('discover-sign')}
              onBackToHome={() => handleNavigate('home')}
              onNavigateToBlog={() => handleNavigate('blog')}
              onOpenArticle={handleOpenArticle}
              onSelectSignFilter={(sign) => {
                setSelectedSign(sign);
                handleNavigate('home');
              }}
            />
          </main>
        )}

        {/* Dedicated Public Astrology Dictionary */}
        {currentPage === 'dicionario' && (
          <main className="flex-1">
            <PublicDictionaryPage
              onBackToHome={() => handleNavigate('home')}
              onSelectTerm={handleOpenTerm}
              onNavigateToTool={(tool) => handleNavigate(tool)}
            />
          </main>
        )}

        {/* Dedicated Individual Astrology Term Page (SEO Magnet: e.g. /dicionario/what-is-mercury-retrograde) */}
        {currentPage === 'dicionario-termo' && (
          <main className="flex-1">
            <PublicDictionaryTermPage
              termSlug={currentTermSlug}
              onBackToDictionary={() => handleNavigate('dicionario')}
              onBackToHome={() => handleNavigate('home')}
              onSelectTerm={handleOpenTerm}
              onNavigateToTool={(tool) => handleNavigate(tool)}
            />
          </main>
        )}

        {currentPage === 'about-detail' && (
          <main className="flex-1">
            <AboutProfilePage
              onNavigate={(page) => handleNavigate(page as AppPageRoute)}
              onOpenArticle={handleOpenArticle}
            />
          </main>
        )}

        {currentPage === 'describe-me' && (
          <main className="flex-1">
            <DescribeMePage
              onBackToHome={() => handleNavigate('home')}
              onNavigateToBlog={() => handleNavigate('blog')}
              onNavigateToResult={handleNavigateToDescribeMeResult}
            />
          </main>
        )}

        {currentPage === 'describe-me-result' && (
          <main className="flex-1">
            <DescribeMeResultPage
              onBackToForm={() => handleNavigate('describe-me')}
              onBackToHome={() => handleNavigate('home')}
              onNavigateToBlog={() => handleNavigate('blog')}
              onOpenArticle={handleOpenArticle}
            />
          </main>
        )}

        {/* Footer with Universal Navigation */}
        </Suspense>

        <Footer onNavigate={handleNavigate} />
      </div>
    </LanguageProvider>
  );
}

