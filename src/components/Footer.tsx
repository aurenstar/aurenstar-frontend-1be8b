import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { AurenstarLogo } from './AurenstarLogo';
import { emailMessage } from '../utils/emailGuard';
import { SOCIAL_LINKS } from '../data/socialLinks';
import { SocialIcon } from './SocialIcon';
import { reopenConsent } from '../utils/consent';

interface FooterProps {
  onNavigate?: (
    page:
      | 'home'
      | 'blog'
      | 'contact'
      | 'credits'
      | 'privacy'
      | 'terms'
      | 'newsletter'
      | 'daily-message'
      | 'aureneffect'
      | 'discover-sign'
      | 'dictionary'
      | 'dicionario'
      | 'describe-me'
      | 'about-detail'
  ) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && !emailMessage(email, language)) {
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

            {/* Social profiles (same list as the About page: src/data/socialLinks.ts) */}
            <div className="flex items-center gap-4 text-[#647DA5]">
              {SOCIAL_LINKS.map((n) => (
                <a
                  key={n.key}
                  href={n.url}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className="hover:text-[#2878D0] transition-colors cursor-pointer"
                  aria-label={n.label}
                >
                  <SocialIcon name={n.key} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Company */}
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-[#172B4D] mb-4">
              {t.footer.companyTitle}
            </h3>
            <ul className="space-y-3 text-sm text-[#647DA5]">
              <li>
                <a href="/terms" onClick={(e) => { e.preventDefault(); onNavigate?.('terms'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#2878D0] transition-colors cursor-pointer">
                  {t.footer.termsOfService}
                </a>
              </li>
              <li>
                <a href="/privacy" onClick={(e) => { e.preventDefault(); onNavigate?.('privacy'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#2878D0] transition-colors cursor-pointer">
                  {t.footer.privacyPolicy}
                </a>
              </li>
              <li>
                <button type="button" onClick={reopenConsent} className="hover:text-[#2878D0] transition-colors cursor-pointer text-left">
                  {language === 'pt' ? 'Configurar cookies' : language === 'es' ? 'Configurar cookies' : 'Cookie settings'}
                </button>
              </li>
              <li>
                <a
                  href="/about"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onNavigate) onNavigate('about-detail');
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
                  {t.footer.contactLabel}
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
                  {t.footer.sourceCode}
                </a>
              </li>
              <li>
                <a
                  href="/credits"
                  onClick={handleGoCredits}
                  className="hover:text-[#2878D0] transition-colors cursor-pointer"
                >
                  {t.footer.toolsCredits}
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
                  {t.footer.dictionaryLabel}
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
                  {t.footer.unfilteredLabel}
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
                  onChange={(e) => {
                    setEmail(e.target.value);
                    e.target.setCustomValidity(emailMessage(e.target.value, language));
                  }}
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

