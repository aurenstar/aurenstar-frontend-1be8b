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
}

export const BrandMarquee: React.FC<BrandMarqueeProps> = ({
  selectedSign,
  onSelectSign,
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

  return (
    <div
      id="painel-palavras"
      className="w-full bg-[#3982C8] py-5 sm:py-6 overflow-hidden select-none"
    >
      {/* Infinite Edge-to-Edge Marquee Track with ONLY WORDS */}
      <div
        className="aurenstar-marquee-track flex w-max hover:[animation-play-state:paused]"
        aria-label="Zodiac signs"
      >
        {/* Set 1 */}
        <div className="flex shrink-0 items-center gap-6 sm:gap-9 pr-6 sm:pr-9">
          {setA.map((sign, idx) => {
            const isSelected = selectedSign === sign.key;
            return (
              <React.Fragment key={`a-${idx}`}>
              <button
                type="button"
                onClick={() => handleSignClick(sign.key)}
                className={`shrink-0 cursor-pointer border-0 bg-transparent p-0 text-base font-extrabold uppercase tracking-[0.14em] text-white outline-none underline-offset-[6px] decoration-2 decoration-[#E73578] transition-all duration-200 hover:underline sm:text-lg ${
                  isSelected ? 'underline' : ''
                }`}
              >
                {sign[lang] || sign.pt}
              </button>
              <span aria-hidden className="shrink-0 text-sm text-white/60">✦</span>
              </React.Fragment>
            );
          })}
        </div>

        {/* Set 2 (Identical clone for seamless continuous edge-to-edge loop) */}
        <div
          className="flex shrink-0 items-center gap-6 sm:gap-9 pr-6 sm:pr-9"
          aria-hidden="true"
        >
          {setB.map((sign, idx) => {
            const isSelected = selectedSign === sign.key;
            return (
              <React.Fragment key={`b-${idx}`}>
              <button
                type="button"
                onClick={() => handleSignClick(sign.key)}
                tabIndex={-1}
                className={`shrink-0 cursor-pointer border-0 bg-transparent p-0 text-base font-extrabold uppercase tracking-[0.14em] text-white outline-none underline-offset-[6px] decoration-2 decoration-[#E73578] transition-all duration-200 hover:underline sm:text-lg ${
                  isSelected ? 'underline' : ''
                }`}
              >
                {sign[lang] || sign.pt}
              </button>
              <span aria-hidden className="shrink-0 text-sm text-white/60">✦</span>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

