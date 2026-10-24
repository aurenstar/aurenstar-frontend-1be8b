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

    <section id="experiences" className="relative bg-[#C9E5FF] px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-8 sm:mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2878D0]">
            {language === 'pt' ? 'Escolha seu próximo passo' : language === 'es' ? 'Elige tu próximo paso' : 'Choose your next step'}
          </p>
          <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-[#172B4D]">
            {language === 'pt' ? 'Uma experiência para cada momento' : language === 'es' ? 'Una experiencia para cada momento' : 'One experience for every moment'}
          </h2>
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#647DA5]">
            {language === 'pt' ? 'Comece pela ferramenta que mais combina com o que você busca agora.' : language === 'es' ? 'Empieza por la herramienta que más combina con lo que buscas ahora.' : 'Start with the tool that best matches what you are looking for right now.'}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button type="button" onClick={onNavigateToDailyMessage} className="group text-left rounded-2xl bg-white border border-[#D8E9FC] p-5 shadow-sm hover:-translate-y-1.5 hover:bg-[#FDFEFF] hover:border-[#F51B83] hover:shadow-[0_16px_28px_rgba(40,120,208,0.18)] active:scale-[0.99] transition-all duration-200">
            <span className="text-xs font-bold tracking-[0.16em] text-[#2878D0]">01</span>
            <span className="mt-3 inline-flex rounded-full bg-[#E4F1FF] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#2878D0]">DAILY GUIDANCE</span>
            <span className="mt-3 block text-base font-extrabold text-[#172B4D] group-hover:text-[#F51B83] transition-colors">{t.hero.dailyMessage}</span>
            <span className="mt-2 block text-sm leading-relaxed text-[#647DA5]">{language === 'pt' ? 'Receba uma orientação personalizada para o seu dia.' : language === 'es' ? 'Recibe una orientación personalizada para tu día.' : 'Receive personalized guidance for your day.'}</span>
            <span className="mt-4 inline-flex text-xs font-bold uppercase tracking-[0.12em] text-[#2878D0] group-hover:text-[#F51B83] transition-colors">{language === 'pt' ? 'Começar' : language === 'es' ? 'Empezar' : 'Start'} <span className="ml-2 inline-block transition-transform duration-200 group-hover:translate-x-1">→</span></span>
          </button>
          <button type="button" onClick={onNavigateToAurenEffect} className="group text-left rounded-2xl bg-white border border-[#D8E9FC] p-5 shadow-sm hover:-translate-y-1.5 hover:bg-[#FDFEFF] hover:border-[#F51B83] hover:shadow-[0_16px_28px_rgba(40,120,208,0.18)] active:scale-[0.99] transition-all duration-200">
            <span className="text-xs font-bold tracking-[0.16em] text-[#2878D0]">02</span>
            <span className="mt-3 inline-flex rounded-full bg-[#E4F1FF] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#2878D0]">REAL-TIME INSIGHT</span>
            <span className="mt-3 block text-base font-extrabold text-[#172B4D] group-hover:text-[#F51B83] transition-colors">{t.hero.aurenEffect}</span>
            <span className="mt-2 block text-sm leading-relaxed text-[#647DA5]">{language === 'pt' ? 'Entenda melhor o momento que você está vivendo agora.' : language === 'es' ? 'Comprende mejor el momento que estás viviendo ahora.' : 'Understand the moment you are experiencing now.'}</span>
            <span className="mt-4 inline-flex text-xs font-bold uppercase tracking-[0.12em] text-[#2878D0] group-hover:text-[#F51B83] transition-colors">{language === 'pt' ? 'Explorar' : language === 'es' ? 'Explorar' : 'Explore'} <span className="ml-2">→</span></span>
          </button>
          <button type="button" onClick={onNavigateToDiscoverSign} className="group text-left rounded-2xl bg-white border border-[#D8E9FC] p-5 shadow-sm hover:-translate-y-1.5 hover:bg-[#FDFEFF] hover:border-[#F51B83] hover:shadow-[0_16px_28px_rgba(40,120,208,0.18)] active:scale-[0.99] transition-all duration-200">
            <span className="text-xs font-bold tracking-[0.16em] text-[#2878D0]">03</span>
            <span className="mt-3 inline-flex rounded-full bg-[#FFE0EF] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#D91670]">DISCOVER YOUR SIGN</span>
            <span className="mt-3 block text-base font-extrabold text-[#172B4D] group-hover:text-[#F51B83] transition-colors">{t.hero.discoverSign}</span>
            <span className="mt-2 block text-sm leading-relaxed text-[#647DA5]">{language === 'pt' ? 'Descubra seu signo solar pela sua data de nascimento.' : language === 'es' ? 'Descubre tu signo solar con tu fecha de nacimiento.' : 'Discover your sun sign from your date of birth.'}</span>
            <span className="mt-4 inline-flex text-xs font-bold uppercase tracking-[0.12em] text-[#2878D0] group-hover:text-[#F51B83] transition-colors">{language === 'pt' ? 'Descobrir' : language === 'es' ? 'Descubrir' : 'Discover'} <span className="ml-2">→</span></span>
          </button>
          <button type="button" onClick={onNavigateToDescribeMe} className="group text-left rounded-2xl bg-white border border-[#D8E9FC] p-5 shadow-sm hover:-translate-y-1.5 hover:bg-[#FDFEFF] hover:border-[#F51B83] hover:shadow-[0_16px_28px_rgba(40,120,208,0.18)] active:scale-[0.99] transition-all duration-200">
            <span className="text-xs font-bold tracking-[0.16em] text-[#2878D0]">04</span>
            <span className="mt-3 inline-flex rounded-full bg-[#FFE0EF] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#D91670]">SHAREABLE PROFILE</span>
            <span className="mt-3 block text-base font-extrabold text-[#172B4D] group-hover:text-[#F51B83] transition-colors">{t.hero.describeMe}</span>
            <span className="mt-2 block text-sm leading-relaxed text-[#647DA5]">{language === 'pt' ? 'Crie uma descrição pessoal feita para compartilhar.' : language === 'es' ? 'Crea una descripción personal hecha para compartir.' : 'Create a personal description made to share.'}</span>
            <span className="mt-4 inline-flex text-xs font-bold uppercase tracking-[0.12em] text-[#2878D0] group-hover:text-[#F51B83] transition-colors">{language === 'pt' ? 'Criar' : language === 'es' ? 'Crear' : 'Create'} <span className="ml-2">→</span></span>
          </button>
        </div>
      </div>
    </section>
    </>
  );
};
