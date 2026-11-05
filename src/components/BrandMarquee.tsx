import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export interface ZodiacSignItem {
  key: string;
  symbol: string;
  pt: string;
  en: string;
  es: string;
}

export const ZODIAC_SIGNS: ZodiacSignItem[] = [
  { key: 'aries', symbol: '♈', pt: 'Áries', en: 'Aries', es: 'Aries' },
  { key: 'touro', symbol: '♉', pt: 'Touro', en: 'Taurus', es: 'Tauro' },
  { key: 'gemeos', symbol: '♊', pt: 'Gêmeos', en: 'Gemini', es: 'Géminis' },
  { key: 'cancer', symbol: '♋', pt: 'Câncer', en: 'Cancer', es: 'Cáncer' },
  { key: 'leao', symbol: '♌', pt: 'Leão', en: 'Leo', es: 'Leo' },
  { key: 'virgem', symbol: '♍', pt: 'Virgem', en: 'Virgo', es: 'Virgo' },
  { key: 'libra', symbol: '♎', pt: 'Libra', en: 'Libra', es: 'Libra' },
  { key: 'escorpiao', symbol: '♏', pt: 'Escorpião', en: 'Scorpio', es: 'Escorpio' },
  { key: 'sagitario', symbol: '♐', pt: 'Sagitário', en: 'Sagittarius', es: 'Sagitario' },
  { key: 'capricornio', symbol: '♑', pt: 'Capricórnio', en: 'Capricorn', es: 'Capricornio' },
  { key: 'aquario', symbol: '♒', pt: 'Aquário', en: 'Aquarius', es: 'Acuario' },
  { key: 'peixes', symbol: '♓', pt: 'Peixes', en: 'Pisces', es: 'Piscis' },
];

interface BrandMarqueeProps {
  selectedSign?: string | null;
  onSelectSign?: (signKey: string | null) => void;
  /** Fade into the footer colour (only the strip right above the footer). */
  joinFooter?: boolean;
}

export const BrandMarquee: React.FC<BrandMarqueeProps> = ({
  selectedSign,
  onSelectSign,
  joinFooter = false,
}) => {
  const { language } = useLanguage();
  const lang = (language || 'pt') as 'pt' | 'en' | 'es';

  const handleSignClick = (signKey: string) => {
    if (onSelectSign) {
      if (selectedSign === signKey) {
        onSelectSign(null); // Toggle off if already active
      } else {
        onSelectSign(signKey);
        setTimeout(() => {
          document.getElementById('blog')?.scrollIntoView({ behavior: 'smooth' });
        }, 80);
      }
    }
  };

  const setA = ZODIAC_SIGNS;
  const setB = ZODIAC_SIGNS;
  const signColors = ['text-[#3982C8]'];

  return (
    <div
      id="painel-palavras"
      className={`w-full py-5 sm:py-6 overflow-hidden select-none ${joinFooter ? 'bg-gradient-to-b from-[#C9E5FF] to-[#E4F1FF]' : 'bg-[#C9E5FF] border-y border-[#A9CDF0]'}`}
    >
      {/* Infinite Edge-to-Edge Marquee Track with ONLY WORDS */}
      <div
        className="aurenstar-marquee-track flex w-max hover:[animation-play-state:paused]"
        aria-label="Zodiac signs"
      >
        {/* Set 1 */}
        <div className="flex shrink-0 items-center gap-10 sm:gap-14 pr-10 sm:pr-14">
          {setA.map((sign, idx) => {
            const isSelected = selectedSign === sign.key;
            return (
              <button
                key={`a-${idx}`}
                type="button"
                style={{ fontWeight: 800, letterSpacing: '-0.025em' }}
                onClick={() => handleSignClick(sign.key)}
                className={`text-base sm:text-lg font-bold tracking-tight transition-colors duration-200 cursor-pointer shrink-0 bg-transparent border-0 p-0 outline-none ${
                  isSelected
                    ? 'text-[#3982C8] underline underline-offset-4 decoration-[#E73578]'
                    : `${signColors[idx % signColors.length]} hover:opacity-70`
                }`}
              >
                {sign[lang] || sign.pt}
              </button>
            );
          })}
        </div>

        {/* Set 2 (Identical clone for seamless continuous edge-to-edge loop) */}
        <div
          className="flex shrink-0 items-center gap-10 sm:gap-14 pr-10 sm:pr-14"
          aria-hidden="true"
        >
          {setB.map((sign, idx) => {
            const isSelected = selectedSign === sign.key;
            return (
              <button
                key={`b-${idx}`}
                type="button"
                style={{ fontWeight: 800, letterSpacing: '-0.025em' }}
                onClick={() => handleSignClick(sign.key)}
                tabIndex={-1}
                className={`text-base sm:text-lg font-bold tracking-tight transition-colors duration-200 cursor-pointer shrink-0 bg-transparent border-0 p-0 outline-none ${
                  isSelected
                    ? 'text-[#3982C8] underline underline-offset-4 decoration-[#E73578]'
                    : `${signColors[idx % signColors.length]} hover:opacity-70`
                }`}
              >
                {sign[lang] || sign.pt}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

