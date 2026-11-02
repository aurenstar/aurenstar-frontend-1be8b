import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { AurenstarLogo } from './AurenstarLogo';
import { Menu, X } from 'lucide-react';
import { onPlainClick } from '../utils/links';

interface NavbarProps {
  activePage?: string;
  onNavigate?: (
    page:
      | 'home'
      | 'blog'
      | 'contact'
      | 'newsletter'
      | 'daily-message'
      | 'aureneffect'
      | 'discover-sign'
      | 'dictionary'
      | 'dicionario'
  ) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage = 'home',
  onNavigate,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { key: 'home' as const, label: t.nav.home },
    { key: 'dicionario' as const, label: 'DICTIONARY' },
    { key: 'blog' as const, label: t.nav.blog },
    { key: 'newsletter' as const, label: 'NEWSLETTER' },
    { key: 'contact' as const, label: t.nav.contact },
  ];

  // Real URLs so search engines can follow the menu; a normal click still navigates in-app.
  const NAV_PATHS = {
    home: '/',
    dicionario: '/dicionario',
    blog: '/blog',
    newsletter: '/newsletter',
    contact: '/contact',
  } as const;

  const handleItemClick = (key: 'home' | 'blog' | 'contact' | 'newsletter' | 'dicionario') => {
    setIsMenuOpen(false);
    if (onNavigate) {
      onNavigate(key);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FFFFFF]/95 backdrop-blur-md shadow-xs py-3 border-b border-[#D9E8F8]'
          : 'bg-transparent py-4 sm:py-5'
      }`}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        {/* Left: Brand Logo & Name */}
        <a
          href="/"
          onClick={onPlainClick(() => handleItemClick('home'))}
          className="flex items-center cursor-pointer group focus:outline-none"
          aria-label="Aurenstar Home"
        >
          <AurenstarLogo className="h-11 sm:h-12 w-auto max-w-[12rem]" />
        </a>

        {/* Center: Navigation Links with Pill Capsule Outline */}
        <nav className="hidden md:flex items-center gap-2 sm:gap-3 min-w-0">
          {navItems.map((item) => {
            const isActive = activePage === item.key;
            return (
              <a
                key={item.key}
                href={NAV_PATHS[item.key]}
                onClick={onPlainClick(() => handleItemClick(item.key))}
                aria-current={isActive ? 'page' : undefined}
                className={`btn-font group relative font-sans text-[11px] sm:text-xs leading-none font-semibold tracking-wider transition-all duration-200 cursor-pointer focus:outline-none flex items-center justify-center shrink-0 rounded-full px-3.5 sm:px-4.5 py-1 sm:py-1.5 border ${
                  isActive
                    ? 'border-[#F51B83] bg-[#F51B83] text-white font-bold shadow-[0_6px_14px_rgba(245,27,131,0.2)]'
                    : 'border-transparent bg-[#E4F1FF]/80 text-[#2878D0] hover:border-[#F51B83] hover:bg-[#F51B83] hover:text-white'
                }`}
              >
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Right: Circular Flag Language Translation Switcher */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full border border-[#D9E8F8] bg-white/80 text-[#17366F] shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2878D0]"
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {isMenuOpen && (
          <nav
            aria-label="Mobile navigation"
            className="md:hidden absolute left-3 right-3 top-[calc(100%+0.75rem)] rounded-2xl border border-[#D9E8F8] bg-white/98 p-3 shadow-xl backdrop-blur-md"
          >
            <div className="grid gap-1">
              {navItems.map((item) => {
                const isActive = activePage === item.key;
                return (
                  <a
                    key={item.key}
                    href={NAV_PATHS[item.key]}
                    onClick={onPlainClick(() => handleItemClick(item.key))}
                    className={`btn-font block w-full rounded-xl px-4 py-3 text-left text-sm font-semibold tracking-wide transition-colors ${
                      isActive
                        ? 'bg-[#E4F1FF] text-[#17366F]'
                        : 'text-[#172B4D] hover:bg-[#E4F1FF]/70'
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

