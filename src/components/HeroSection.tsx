import { translateUi } from '../utils/uiTranslate';
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ScrollReveal } from './ScrollReveal';
import { BrandMarquee } from './BrandMarquee';

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
  const { t, language, visitorLanguage } = useLanguage();

  // Visitors from a country the menus are not written for: the typed phrases are translated whole (never letter by letter).
  const [localPhrases, setLocalPhrases] = useState<TypewriterPhrase[] | null>(null);
  useEffect(() => {
    setLocalPhrases(null);
    if (!visitorLanguage) return;
    let cancelled = false;
    const source = HERO_PHRASES.en;
    translateUi(visitorLanguage, source.map((p) => `<i1>${p.prefix.trim()}</i1><i2>${p.highlight}</i2>`)).then((out) => {
      if (cancelled || !out) return;
      const parsed = out.map((o) => {
        const m = /<i1>([\s\S]*?)<\/i1>\s*<i2>([\s\S]*?)<\/i2>/.exec(o);
        return m ? { prefix: m[1].trim() + ' ', highlight: m[2].trim() } : null;
      });
      if (parsed.every(Boolean)) setLocalPhrases(parsed as TypewriterPhrase[]);
    });
    return () => {
      cancelled = true;
    };
  }, [visitorLanguage]);
  const phrases = localPhrases || HERO_PHRASES[language] || HERO_PHRASES.pt;

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
    <>
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
            data-no-translate
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


      </div>
    </section>

    <BrandMarquee />

    </>
  );
};
