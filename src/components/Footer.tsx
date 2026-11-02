import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { AurenstarLogo } from './AurenstarLogo';

interface FooterProps {
  onNavigate?: (
    page:
      | 'home'
      | 'blog'
      | 'contact'
      | 'credits'
      | 'newsletter'
      | 'daily-message'
      | 'aureneffect'
      | 'discover-sign'
      | 'dictionary'
      | 'dicionario'
      | 'describe-me'
  ) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => {
        setIsSubscribed(false);
      }, 4000);
    }
  };

  const handleGoHome = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoBlog = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate('blog');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoCredits = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate('credits');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoContact = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate('contact');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoNewsletter = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate('newsletter');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#E4F1FF] border-t border-[#D9E8F8] text-[#172B4D] pt-14 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile-first grid: stack content safely instead of squeezing columns. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-start gap-8 lg:gap-12">
          {/* Column 1: Brand Info & Socials */}
          <div className="min-w-0 sm:col-span-2 lg:col-span-1">
            {/* Brand Logo & Name */}
            <div className="mb-4">
              <button
                type="button"
                onClick={handleGoHome}
                className="cursor-pointer focus:outline-none block"
                aria-label="Aurenstar Início"
              >
                <AurenstarLogo className="w-36 sm:w-44 h-auto" />
              </button>
            </div>

            {/* Subtitle / Description */}
            <p className="text-sm text-[#647DA5] leading-relaxed max-w-xs mb-6 font-normal break-words">
              {t.footer.description}
            </p>

            {/* Social Icons (Facebook, Instagram, Pinterest) */}
            <div className="flex items-center gap-4 text-[#647DA5]">
              {/* Facebook */}
              <a
                href="#facebook"
                onClick={(e) => e.preventDefault()}
                className="hover:text-[#2878D0] transition-colors cursor-pointer"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="#instagram"
                onClick={(e) => e.preventDefault()}
                className="hover:text-[#2878D0] transition-colors cursor-pointer"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              {/* Pinterest */}
              <a
                href="#pinterest"
                onClick={(e) => e.preventDefault()}
                className="hover:text-[#2878D0] transition-colors cursor-pointer"
                aria-label="Pinterest"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.357-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Company */}
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-[#172B4D] mb-4">
              {t.footer.companyTitle}
            </h3>
            <ul className="space-y-3 text-sm text-[#647DA5]">
              <li>
                <a href="#terms" onClick={(e) => e.preventDefault()} className="hover:text-[#2878D0] transition-colors cursor-pointer">
                  {t.footer.termsOfService}
                </a>
              </li>
              <li>
                <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-[#2878D0] transition-colors cursor-pointer">
                  {t.footer.privacyPolicy}
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onNavigate) onNavigate('home');
                    setTimeout(() => {
                      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-[#2878D0] transition-colors cursor-pointer"
                >
                  {t.footer.aboutUs}
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  onClick={handleGoContact}
                  className="hover:text-[#2878D0] transition-colors cursor-pointer"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="/"
                  onClick={handleGoHome}
                  className="hover:text-[#2878D0] transition-colors cursor-pointer"
                >
                  {t.footer.home}
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/aurenstar/aurenstar-engine"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#2878D0] transition-colors cursor-pointer"
                >
                  Source code
                </a>
              </li>
              <li>
                <a
                  href="/credits"
                  onClick={handleGoCredits}
                  className="hover:text-[#2878D0] transition-colors cursor-pointer"
                >
                  Tools &amp; Credits
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Product */}
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-[#172B4D] mb-4">
              {t.footer.productTitle}
            </h3>
            <ul className="space-y-3 text-sm text-[#647DA5]">
              <li>
                <a
                  href="/discover-sign"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onNavigate) onNavigate('discover-sign');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#2878D0] transition-colors cursor-pointer"
                >
                  {t.footer.discoverYourSign}
                </a>
              </li>
              <li>
                <a
                  href="/daily-message"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onNavigate) onNavigate('daily-message');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#2878D0] transition-colors cursor-pointer"
                >
                  {t.footer.dailyMessage}
                </a>
              </li>
              <li>
                <a
                  href="/aureneffect"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onNavigate) onNavigate('aureneffect');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#2878D0] transition-colors cursor-pointer"
                >
                  {t.footer.aurenEffect}
                </a>
              </li>
              <li>
                <a
                  href="/dicionario"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onNavigate) onNavigate('dicionario');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#2878D0] transition-colors cursor-pointer"
                >
                  Aurenstar Dictionary
                </a>
              </li>
              <li>
                <a
                  href="/descreva-me"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onNavigate) onNavigate('describe-me');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#2878D0] transition-colors cursor-pointer"
                >
                  Aurenstar Unfiltered
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  onClick={handleGoBlog}
                  className="hover:text-[#2878D0] transition-colors cursor-pointer"
                >
                  {t.footer.blog}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="min-w-0 sm:col-span-2 lg:col-span-1">
            <h3 className="text-sm font-bold text-[#172B4D] mb-4">
              {t.footer.newsletterTitle}
            </h3>
            <p className="text-sm text-[#647DA5] leading-relaxed mb-4 break-words">
              {t.footer.newsletterDesc}
            </p>

            {/* Pill-shaped subscription form */}
            <form onSubmit={handleSubmit} className="relative">
              <div className="flex items-center bg-[#FFFFFF] border border-[#D9E8F8] rounded-full p-1 focus-within:border-[#2878D0] focus-within:ring-2 focus-within:ring-[#2878D0]/20 transition-all shadow-xs">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.footer.emailPlaceholder}
                  className="bg-transparent px-3 sm:px-4 py-2 text-sm text-[#172B4D] placeholder-[#647DA5] outline-none flex-1 min-w-0"
                />
                <button
                  type="submit"
                  className="bg-[#2878D0] hover:bg-[#17366F] text-[#FFFFFF] text-xs sm:text-sm font-semibold px-3 sm:px-5 py-2.5 rounded-full transition-all duration-200 cursor-pointer shadow-sm hover:shadow flex items-center justify-center shrink-0 active:scale-95"
                >
                  {t.footer.subscribeBtn}
                </button>
              </div>

              {isSubscribed && (
                <p className="absolute -bottom-6 left-2 text-xs font-medium text-emerald-600 animate-fadeIn">
                  ✓ {t.footer.subscribeSuccess}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
};

