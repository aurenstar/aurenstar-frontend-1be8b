import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { BrandMarquee } from './components/BrandMarquee';
import { BlogCardsSection } from './components/BlogCardsSection';
import { FaqSection } from './components/FaqSection';
import { ReviewsSection } from './components/ReviewsSection';
import { AboutAurenstarSection } from './components/AboutAurenstarSection';
import { Footer } from './components/Footer';
import { BlogPage } from './pages/BlogPage';
import { ArticlePage } from './pages/ArticlePage';
import { ContactPage } from './pages/ContactPage';
import { NewsletterPage } from './pages/NewsletterPage';
import { DailyMessagePage } from './pages/DailyMessagePage';
import { DailyReadingResultPage } from './pages/DailyReadingResultPage';
import { AurenEffectPage } from './pages/AurenEffectPage';
import { AurenEffectResultPage } from './pages/AurenEffectResultPage';
import { DiscoverSignPage } from './pages/DiscoverSignPage';
import { DiscoverSignResultPage } from './pages/DiscoverSignResultPage';
import { DictionaryLayout } from './components/dictionary/DictionaryLayout';
import { PublicDictionaryPage } from './pages/PublicDictionaryPage';
import { PublicDictionaryTermPage } from './pages/PublicDictionaryTermPage';
import { DescribeMePage } from './pages/DescribeMePage';
import { DescribeMeResultPage } from './pages/DescribeMeResultPage';
import { AboutDetailPage } from './pages/AboutDetailPage';
import { updateSeo } from './utils/seo';

export type AppPageRoute =
  | 'home'
  | 'blog'
  | 'article'
  | 'contact'
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

export default function App() {
  const [currentPage, setCurrentPage] = useState<AppPageRoute>('home');
  const [currentArticleId, setCurrentArticleId] = useState<string>('post-1');
  const [currentTermSlug, setCurrentTermSlug] = useState<string>('what-is-mercury-retrograde');
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const [aboutSection, setAboutSection] = useState<string>('platform');

  // Initialize and synchronize with browser hash / history for pageview strategy
  useEffect(() => {
    const syncRouteFromHash = () => {
      const path = window.location.pathname.replace(/\/$/, '') || '/';
      const hash = window.location.hash;
      const route = path !== '/' ? path : hash;
      const normalizedRoute = route.replace(/^#\/?/, '/');
      if (route.startsWith('/blog/') || route.startsWith('#/article/')) {
        const id = route.startsWith('/blog/') ? route.replace('/blog/', '') : route.replace('#/article/', '');
        setCurrentArticleId(id || 'post-1');
        setCurrentPage('article');
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
        setCurrentPage('blog');
      } else if (path === '/contact' || hash === '#/contact') {
        setCurrentPage('contact');
      } else if (path === '/newsletter' || hash === '#/newsletter') {
        setCurrentPage('newsletter');
      } else if (path === '/descreva-me' || path === '/describe-me' || hash === '#/descreva-me') {
        setCurrentPage('describe-me');
      } else if (path === '/descreva-me-result' || path === '/describe-me-result' || hash === '#/descreva-me-result') {
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
        setCurrentPage('dictionary');
      } else if (path === '/dicionario' || hash === '#/dicionario' || hash === '#/dicionary') {
        setCurrentPage('dicionario');
      } else if (path.startsWith('/about/')) {
        setAboutSection(path.replace('/about/', '') || 'platform');
        setCurrentPage('about-detail');
      } else {
        setCurrentPage('home');
      }
    };

    syncRouteFromHash();
    window.addEventListener('popstate', syncRouteFromHash);
    window.addEventListener('hashchange', syncRouteFromHash);
    return () => {
      window.removeEventListener('popstate', syncRouteFromHash);
      window.removeEventListener('hashchange', syncRouteFromHash);
    };
  }, []);

  useEffect(() => {
    try {
      updateSeo(currentPage, { articleId: currentArticleId, termSlug: currentTermSlug });
    } catch (error) {
      // SEO metadata must never prevent the application UI from rendering.
      console.error('Unable to update SEO metadata:', error);
    }
  }, [currentPage, currentArticleId, currentTermSlug]);

  const handleNavigate = (page: AppPageRoute) => {
    setCurrentPage(page);
    if (page === 'home') {
      window.history.pushState({ page: 'home' }, '', '/');
    } else {
      const path = page === 'dicionario' ? '/dicionario' : `/${page}`;
      window.history.pushState({ page }, '', path);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenArticle = (articleId: string) => {
    setCurrentArticleId(articleId);
    setCurrentPage('article');
    window.history.pushState(
      { page: 'article', id: articleId },
      '',
      `/blog/${encodeURIComponent(articleId)}`
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

  const handleOpenAbout = (section: string) => {
    setAboutSection(section);
    setCurrentPage('about-detail');
    window.history.pushState({ page: 'about-detail', section }, '', `/about/${section}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToDescribeMe = () => handleNavigate('describe-me');
  const handleNavigateToDescribeMeResult = () => handleNavigate('describe-me-result');

  if (currentPage === 'dictionary') {
    return (
      <LanguageProvider>
        <DictionaryLayout onBackToPublicSite={() => handleNavigate('home')} />
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#C9E5FF] text-[#172B4D] font-sans selection:bg-[#F51B83] selection:text-[#FFFFFF] flex flex-col justify-between">
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
        {currentPage === 'home' && (
          <main className="flex-1">
            {/* Hero Section with direct page routes */}
            <HeroSection
              onNavigateToDailyMessage={() => handleNavigate('daily-message')}
              onNavigateToAurenEffect={() => handleNavigate('aureneffect')}
              onNavigateToDiscoverSign={() => handleNavigate('discover-sign')}
              onNavigateToDescribeMe={handleNavigateToDescribeMe}
            />

            {/* Brand Zodiac Marquee Panel (Above Trending Articles) */}
            <BrandMarquee
              selectedSign={selectedSign}
              onSelectSign={setSelectedSign}
            />

            {/* Trending Articles Section */}
            <BlogCardsSection
              onOpenArticle={handleOpenArticle}
              selectedSign={selectedSign}
              onSelectSign={setSelectedSign}
            />

            {/* About Aurenstar Section */}
            <AboutAurenstarSection onOpenCard={handleOpenAbout} />

            {/* User Reviews Section */}
            <ReviewsSection />

            {/* FAQ Accordion Section */}
            <FaqSection />

            {/* Brand Zodiac Marquee Panel */}
            <BrandMarquee
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
            <AboutDetailPage
              section={aboutSection}
              onBackToHome={() => handleNavigate('home')}
              onNavigateToBlog={() => handleNavigate('blog')}
              onNavigateToTool={(tool) => handleNavigate(tool)}
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
            />
          </main>
        )}

        {/* Footer with Universal Navigation */}
        <Footer onNavigate={handleNavigate} />
      </div>
    </LanguageProvider>
  );
}

