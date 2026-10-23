import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { AurenstarLogo } from './AurenstarLogo';

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
    { key: 'dicionario' as const, label: 'Dicionário' },
    { key: 'blog' as const, label: t.nav.blog },
    { key: 'newsletter' as const, label: 'NEWSLETTER' },
    { key: 'contact' as const, label: t.nav.contact },
  ];

  const handleItemClick = (key: 'home' | 'blog' | 'contact' | 'newsletter' | 'dicionario') => {
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Brand Logo & Name */}
        <button
          onClick={() => handleItemClick('home')}
          className="flex items-center cursor-pointer group focus:outline-none"
          aria-label="Aurenstar Home"
        >
          <AurenstarLogo className="h-8 sm:h-9 w-auto" />
        </button>

        {/* Center: Navigation Links with Pill Capsule Outline */}
        <nav className="flex items-center gap-2 sm:gap-3">
          {navItems.map((item) => {
            const isActive = activePage === item.key;
            return (
              <button
                key={item.key}
                onClick={() => handleItemClick(item.key)}
                className={`group relative text-[11px] sm:text-xs font-semibold tracking-wider transition-all duration-200 cursor-pointer focus:outline-none flex items-center justify-center shrink-0 rounded-full px-3.5 sm:px-4.5 py-1 sm:py-1.5 border ${
                  isActive
                    ? 'border-[#2878D0] text-[#17366F] bg-[#FFFFFF] font-bold shadow-2xs'
                    : 'border-[#D9E8F8] text-[#172B4D] hover:border-[#2878D0] hover:text-[#2878D0] hover:bg-[#FFFFFF]'
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Circular Flag Language Translation Switcher */}
        <LanguageSwitcher />
      </div>
    </header>
  );
};
