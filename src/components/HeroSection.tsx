import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ScrollReveal } from './ScrollReveal';

interface HeroSectionProps {
  onNavigateToDailyMessage?: () => void;
  onNavigateToAurenEffect?: () => void;
  onNavigateToDiscoverSign?: () => void;
  onNavigateToDescribeMe?: () => void;
}

interface TypewriterPhrase {
  prefix: string;
  highlight: string;
}

const HERO_PHRASES: Record<string, TypewriterPhrase[]> = {
  pt: [
    { prefix: 'Sua Orientação ', highlight: 'Astrológica Diária' },
    { prefix: 'Astrologia ', highlight: 'Sem Palavras Difíceis' },
    { prefix: 'Mensagens Simples ', highlight: 'para o Seu Signo' },
    { prefix: 'Conselhos Práticos ', highlight: 'para o Seu Dia' },
    { prefix: 'Descubra a Força ', highlight: 'do Seu Céu' },
  ],
  en: [
    { prefix: 'Your Daily ', highlight: 'Zodiac Guidance' },
    { prefix: 'Astrology in ', highlight: 'Simple Words' },
    { prefix: 'Daily Messages ', highlight: 'for Your Sign' },
    { prefix: 'Gentle Advice to ', highlight: 'Brighten Your Day' },
    { prefix: 'Discover the ', highlight: 'Power of Your Stars' },
  ],
  es: [
    { prefix: 'Tu Guía ', highlight: 'Astrológica Diaria' },
    { prefix: 'Astrología ', highlight: 'Sin Palabras Difíciles' },
    { prefix: 'Mensajes Simples ', highlight: 'para Tu Signo' },
    { prefix: 'Consejos Cálidos para ', highlight: 'Tu Día a Día' },
    { prefix: 'Descubre la Fuerza ', highlight: 'de Tus Estrellas' },
  ],
};

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigateToDailyMessage,
  onNavigateToAurenEffect,
  onNavigateToDiscoverSign,
  onNavigateToDescribeMe,
}) => {
  const { t, language } = useLanguage();
  const phrases = HERO_PHRASES[language] || HERO_PHRASES.pt;

  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setPhraseIndex(0);
    setCharIndex(0);
    setIsDeleting(false);
  }, [language]);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex] || phrases[0];
    const fullText = `${currentPhrase.prefix}${currentPhrase.highlight}`;

    let timer: NodeJS.Timeout;

    if (!isDeleting && charIndex < fullText.length) {
      const typingSpeed = 65 + Math.random() * 25;
      timer = setTimeout(() => {
        setCharIndex((prev) => prev + 1);
      }, typingSpeed);
    } else if (!isDeleting && charIndex === fullText.length) {
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 2300);
    } else if (isDeleting && charIndex > 0) {
      timer = setTimeout(() => {
        setCharIndex((prev) => prev - 1);
      }, 35);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, phraseIndex, phrases]);

  const currentPhrase = phrases[phraseIndex] || phrases[0];
  const prefixLength = currentPhrase.prefix.length;

  const currentPrefix =
    charIndex <= prefixLength
      ? currentPhrase.prefix.slice(0, charIndex)
      : currentPhrase.prefix;

  const currentHighlight =
    charIndex > prefixLength
      ? currentPhrase.highlight.slice(0, charIndex - prefixLength)
      : '';

  return (
    <section
      id="hero"
      className="relative overflow-hidden min-h-screen flex items-center justify-center bg-[#C9E5FF] text-[#172B4D] pt-24 sm:pt-28 pb-16"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#E4F1FF] rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-[#FFE0EF]/60 rounded-full blur-3xl animate-float-alt" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E4F1FF]/80 rounded-full blur-[140px] pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <ScrollReveal delay={0} distance={20} duration={800}>
          <h1
            aria-label={`${currentPhrase.prefix}${currentPhrase.highlight}`}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.12] text-[#172B4D] min-h-[96px] sm:min-h-[125px] md:min-h-[150px] flex items-center justify-center"
          >
            <span className="inline-block">
              <span className="text-[#2878D0]">{currentPrefix}</span>
              {currentHighlight && (
                <span className="text-[#F51B83]">
                  {currentHighlight}
                </span>
              )}
              <span
                className="inline-block w-[3px] sm:w-[4px] lg:w-[5px] h-[0.85em] align-middle ml-1 sm:ml-1.5 bg-[#2878D0] rounded-full animate-pulse"
                aria-hidden="true"
              />
            </span>
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={120} distance={22} duration={800}>
          <p className="mt-6 text-base sm:text-lg md:text-xl text-[#647DA5] max-w-2xl mx-auto font-medium leading-relaxed">
            {t.hero.subtitle}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={240} distance={24} duration={800}>
          <div className="mt-10 sm:mt-12 mx-auto max-w-5xl rounded-2xl border border-white/80 bg-white/45 p-3 sm:p-4 shadow-[0_12px_30px_rgba(23,43,77,0.08)] backdrop-blur-sm">
            <p className="mb-3 text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em] text-[#647DA5]">
              {language === 'pt' ? 'Escolha uma experiência' : language === 'es' ? 'Elige una experiencia' : 'Choose an experience'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={onNavigateToDailyMessage}
              className="w-full sm:w-[235px] h-[54px] px-4 rounded-full text-xs sm:text-sm font-bold tracking-[0.08em] uppercase bg-[#2878D0] text-white border border-[#2878D0] hover:bg-[#F51B83] hover:border-[#F51B83] active:bg-[#F51B83] active:border-[#F51B83] transition-colors duration-200 cursor-pointer flex items-center justify-center"
            >
              <span>{t.hero.dailyMessage}</span>
            </button>

            <button
              type="button"
              onClick={onNavigateToAurenEffect}
              className="w-full sm:w-[235px] h-[54px] px-4 rounded-full text-xs sm:text-sm font-bold tracking-[0.08em] uppercase bg-[#2878D0] hover:bg-[#F51B83] hover:border-[#F51B83] active:bg-[#F51B83] active:border-[#F51B83] text-white transition-colors duration-200 cursor-pointer flex items-center justify-center border border-[#2878D0]"
            >
              <span>{t.hero.aurenEffect}</span>
            </button>

            <button
              type="button"
              onClick={onNavigateToDiscoverSign}
              className="w-full sm:w-[235px] h-[54px] px-4 rounded-full text-xs sm:text-sm font-bold tracking-[0.08em] uppercase bg-[#2878D0] text-white border border-[#2878D0] hover:bg-[#F51B83] hover:border-[#F51B83] active:bg-[#F51B83] active:border-[#F51B83] transition-colors duration-200 cursor-pointer flex items-center justify-center"
            >
              <span>{t.hero.discoverSign}</span>
            </button>

            <button
              type="button"
              onClick={onNavigateToDescribeMe}
              className="w-full sm:w-[235px] h-[54px] px-3 rounded-full text-[11px] sm:text-xs font-bold tracking-[0.06em] uppercase whitespace-nowrap bg-[#2878D0] text-white border border-[#2878D0] hover:bg-[#F51B83] hover:border-[#F51B83] active:bg-[#F51B83] active:border-[#F51B83] transition-colors duration-200 cursor-pointer flex items-center justify-center"
            >
              <span>{t.hero.describeMe}</span>
            </button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
