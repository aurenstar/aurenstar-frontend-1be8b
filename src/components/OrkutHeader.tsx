import React, { useState } from 'react';
import { Search, Menu, X, Undo2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { AurenstarLogo } from './AurenstarLogo';

interface OrkutHeaderProps {
  activePage?: string;
  onNavigate?: (page: any) => void;
  onSearch?: (query: string) => void;
  onSelectCategory?: (category: string) => void;
}

export const OrkutHeader: React.FC<OrkutHeaderProps> = ({
  activePage = 'home',
  onNavigate,
  onSearch,
  onSelectCategory,
}) => {
  const { language } = useLanguage();
  const { returnToClassic } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const labels = {
    pt: {
      home: 'Início',
      signs: 'Signos',
      love: 'Amor',
      relationships: 'Relações',
      personality: 'Personalidade',
      celebrities: 'Famosos',
      lifestyle: 'Lifestyle',
      blog: 'Blog',
      dictionary: 'Dicionário Aurenstar',
      searchPlaceholder: 'Pesquisar horóscopo, amor, signos...',
      returnBtn: 'Voltar ao visual clássico',
      returnHint: 'Comando: retornar',
    },
    en: {
      home: 'Home',
      signs: 'Zodiac Signs',
      love: 'Love',
      relationships: 'Relationships',
      personality: 'Personality',
      celebrities: 'Celebrities',
      lifestyle: 'Lifestyle',
      blog: 'Blog',
      dictionary: 'Aurenstar Dictionary',
      searchPlaceholder: 'Search horoscope, love, signs...',
      returnBtn: 'Return to classic view',
      returnHint: 'Command: retornar',
    },
    es: {
      home: 'Inicio',
      signs: 'Signos',
      love: 'Amor',
      relationships: 'Relaciones',
      personality: 'Personalidad',
      celebrities: 'Famosos',
      lifestyle: 'Lifestyle',
      blog: 'Blog',
      dictionary: 'Diccionario Aurenstar',
      searchPlaceholder: 'Buscar horóscopo, amor, signos...',
      returnBtn: 'Volver al diseño clásico',
      returnHint: 'Comando: retornar',
    },
  }[language as 'pt' | 'en' | 'es'] || {
    home: 'Início',
    signs: 'Signos',
    love: 'Amor',
    relationships: 'Relações',
    personality: 'Personalidade',
    celebrities: 'Famosos',
    lifestyle: 'Lifestyle',
    blog: 'Blog',
    dictionary: 'Dicionário Aurenstar',
    searchPlaceholder: 'Pesquisar horóscopo, amor, signos...',
    returnBtn: 'Voltar ao visual clássico',
    returnHint: 'Comando: retornar',
  };

  const navLinks = [
    { key: 'home', label: labels.home, action: () => onNavigate?.('home') },
    {
      key: 'signs',
      label: labels.signs,
      action: () => {
        onNavigate?.('home');
        setTimeout(() => {
          document.getElementById('orkut-signos')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      },
    },
    {
      key: 'love',
      label: labels.love,
      action: () => {
        onNavigate?.('home');
        onSelectCategory?.('AMOR');
        setTimeout(() => {
          document.getElementById('orkut-artigos')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      },
    },
    {
      key: 'personality',
      label: labels.personality,
      action: () => {
        onNavigate?.('home');
        onSelectCategory?.('PERSONALIDADE');
        setTimeout(() => {
          document.getElementById('orkut-artigos')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      },
    },
    {
      key: 'celebrities',
      label: labels.celebrities,
      action: () => {
        onNavigate?.('home');
        onSelectCategory?.('FAMOSOS');
        setTimeout(() => {
          document.getElementById('orkut-artigos')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      },
    },
    {
      key: 'lifestyle',
      label: labels.lifestyle,
      action: () => {
        onNavigate?.('home');
        onSelectCategory?.('LIFESTYLE');
        setTimeout(() => {
          document.getElementById('orkut-artigos')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      },
    },
    { key: 'blog', label: labels.blog, action: () => onNavigate?.('blog') },
    { key: 'dicionario', label: labels.dictionary, action: () => onNavigate?.('dicionario') },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
    const target = document.getElementById('orkut-artigos');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#D9E8F8] shadow-xs select-none">
      {/* Top Banner with Discrete Return Command Bar */}
      <div className="bg-[#E4F1FF] border-b border-[#D9E8F8] px-4 py-1.5 text-xs text-[#17366F] flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#F51B83] animate-pulse" />
            <span className="font-semibold text-[#17366F]">
              Aurenstar • Visual Orkut Moderno
            </span>
            <span className="hidden sm:inline text-[#647DA5]">| Astrologia, Amor & Personalidade</span>
          </div>

          {/* Return command button */}
          <button
            type="button"
            onClick={returnToClassic}
            title="Clique para voltar ou diga 'retornar'"
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white hover:bg-[#FFE0EF] text-[#2878D0] hover:text-[#F51B83] border border-[#D9E8F8] font-semibold text-[11px] transition-colors cursor-pointer shadow-2xs group"
          >
            <Undo2 className="w-3 h-3 text-[#2878D0] group-hover:text-[#F51B83] transition-colors" />
            <span>{labels.returnBtn}</span>
            <span className="hidden md:inline font-mono text-[10px] text-[#647DA5] bg-[#E4F1FF] px-1.5 rounded">
              {labels.returnHint}
            </span>
          </button>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-4">
        {/* Left: Aurenstar Logo in Vibrant Pink */}
        <button
          type="button"
          onClick={() => onNavigate?.('home')}
          className="flex items-center cursor-pointer shrink-0 focus:outline-none"
          aria-label="Aurenstar Início"
        >
          <AurenstarLogo variant="pink" className="h-8 sm:h-9 w-auto" />
        </button>

        {/* Center: Desktop Navigation with Blue Links & Active Pill */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
          {navLinks.map((item) => {
            const isActive =
              activePage === item.key ||
              (activePage === 'home' && item.key === 'home') ||
              (activePage === 'blog' && item.key === 'blog') ||
              (activePage === 'dicionario' && item.key === 'dicionario');

            return (
              <button
                key={item.key}
                type="button"
                onClick={item.action}
                className={`h-9 sm:h-10 px-3 sm:px-3.5 rounded-xl text-xs xl:text-[13px] font-semibold transition-colors duration-150 cursor-pointer flex items-center justify-center shrink-0 ${
                  isActive
                    ? 'bg-[#2878D0] text-white shadow-2xs font-bold'
                    : 'text-[#17366F] hover:bg-[#E4F1FF] hover:text-[#2878D0]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Search Input & Language Switcher */}
        <div className="flex items-center gap-3">
          {/* Search Box with Blue Icon & White Background */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center relative w-48 lg:w-56"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                onSearch?.(e.target.value);
              }}
              placeholder={labels.searchPlaceholder}
              className="w-full h-9 pl-9 pr-7 rounded-xl bg-white border border-[#D9E8F8] text-xs text-[#172B4D] placeholder-[#647DA5] outline-none focus:border-[#2878D0] focus:ring-2 focus:ring-[#2878D0]/20 transition-all shadow-2xs"
            />
            <Search className="w-4 h-4 text-[#2878D0] absolute left-2.5 pointer-events-none" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  onSearch?.('');
                }}
                className="absolute right-2 text-[#647DA5] hover:text-[#172B4D]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-[#2878D0] hover:bg-[#E4F1FF] transition-colors cursor-pointer"
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Responsive Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[#D9E8F8] px-4 py-4 space-y-3 shadow-md animate-fadeIn">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                onSearch?.(e.target.value);
              }}
              placeholder={labels.searchPlaceholder}
              className="w-full h-10 pl-9 pr-8 rounded-xl bg-white border border-[#D9E8F8] text-xs text-[#172B4D] placeholder-[#647DA5] outline-none focus:border-[#2878D0]"
            />
            <Search className="w-4 h-4 text-[#2878D0] absolute left-3 top-3 pointer-events-none" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  onSearch?.('');
                }}
                className="absolute right-3 top-3 text-[#647DA5]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Mobile Links */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {navLinks.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  item.action();
                  setMobileMenuOpen(false);
                }}
                className="h-10 px-3 rounded-xl text-xs font-semibold text-[#17366F] hover:bg-[#E4F1FF] hover:text-[#2878D0] border border-[#D9E8F8] text-left transition-colors flex items-center justify-start cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile Return to Classic */}
          <div className="pt-2 border-t border-[#D9E8F8]">
            <button
              type="button"
              onClick={() => {
                returnToClassic();
                setMobileMenuOpen(false);
              }}
              className="w-full h-10 px-3 rounded-xl text-xs font-bold text-[#2878D0] bg-[#E4F1FF] hover:bg-[#D9E8F8] transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Undo2 className="w-4 h-4" />
              <span>{labels.returnBtn}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

