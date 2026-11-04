import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {/* USA Flag - English */}
      <button
        onClick={() => setLanguage('en')}
        className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full overflow-hidden transition-all duration-200 cursor-pointer shadow-2xs relative flex items-center justify-center shrink-0 ${
          language === 'en'
            ? 'ring-1.5 ring-[#3982C8] ring-offset-1 ring-offset-[#C9E5FF] scale-105'
            : 'opacity-70 hover:opacity-100 hover:scale-105'
        }`}
        title="English (US)"
        aria-label="Switch to English"
      >
        <svg viewBox="0 0 64 64" className="w-full h-full object-cover">
          <circle cx="32" cy="32" r="32" fill="#FFFFFF" />
          <clipPath id="circle-clip-us">
            <circle cx="32" cy="32" r="32" />
          </clipPath>
          <g clipPath="url(#circle-clip-us)">
            {/* Red and White Stripes */}
            <rect y="0" width="64" height="64" fill="#B22234" />
            <rect y="4.92" width="64" height="4.92" fill="#FFFFFF" />
            <rect y="14.77" width="64" height="4.92" fill="#FFFFFF" />
            <rect y="24.61" width="64" height="4.92" fill="#FFFFFF" />
            <rect y="34.46" width="64" height="4.92" fill="#FFFFFF" />
            <rect y="44.3" width="64" height="4.92" fill="#FFFFFF" />
            <rect y="54.15" width="64" height="4.92" fill="#FFFFFF" />
            {/* Canton */}
            <rect x="0" y="0" width="28" height="34.5" fill="#3C3B6E" />
            {/* Stars pattern */}
            <circle cx="6" cy="6" r="1.5" fill="#FFFFFF" />
            <circle cx="14" cy="6" r="1.5" fill="#FFFFFF" />
            <circle cx="22" cy="6" r="1.5" fill="#FFFFFF" />
            <circle cx="10" cy="11.5" r="1.5" fill="#FFFFFF" />
            <circle cx="18" cy="11.5" r="1.5" fill="#FFFFFF" />
            <circle cx="6" cy="17" r="1.5" fill="#FFFFFF" />
            <circle cx="14" cy="17" r="1.5" fill="#FFFFFF" />
            <circle cx="22" cy="17" r="1.5" fill="#FFFFFF" />
            <circle cx="10" cy="22.5" r="1.5" fill="#FFFFFF" />
            <circle cx="18" cy="22.5" r="1.5" fill="#FFFFFF" />
            <circle cx="6" cy="28" r="1.5" fill="#FFFFFF" />
            <circle cx="14" cy="28" r="1.5" fill="#FFFFFF" />
            <circle cx="22" cy="28" r="1.5" fill="#FFFFFF" />
          </g>
        </svg>
      </button>

      {/* Brazil Flag - Português */}
      <button
        onClick={() => setLanguage('pt')}
        className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full overflow-hidden transition-all duration-200 cursor-pointer shadow-2xs relative flex items-center justify-center shrink-0 ${
          language === 'pt'
            ? 'ring-1.5 ring-[#3982C8] ring-offset-1 ring-offset-[#C9E5FF] scale-105'
            : 'opacity-70 hover:opacity-100 hover:scale-105'
        }`}
        title="Português (Brasil)"
        aria-label="Mudar para Português"
      >
        <svg viewBox="0 0 64 64" className="w-full h-full object-cover">
          <circle cx="32" cy="32" r="32" fill="#009c3b" />
          <clipPath id="circle-clip-br">
            <circle cx="32" cy="32" r="32" />
          </clipPath>
          <g clipPath="url(#circle-clip-br)">
            {/* Green background */}
            <rect width="64" height="64" fill="#009c3b" />
            {/* Yellow diamond */}
            <polygon points="32,7 57,32 32,57 7,32" fill="#ffdf00" />
            {/* Blue celestial globe */}
            <circle cx="32" cy="32" r="14.5" fill="#002776" />
            {/* White curved band */}
            <path
              d="M18.5 32 C23 27, 41 27, 45.5 33"
              stroke="#FFFFFF"
              strokeWidth="2.8"
              fill="none"
              strokeLinecap="round"
            />
            {/* Constellation stars */}
            <circle cx="27" cy="38" r="0.9" fill="#FFFFFF" />
            <circle cx="31" cy="40" r="0.9" fill="#FFFFFF" />
            <circle cx="36" cy="39" r="0.9" fill="#FFFFFF" />
            <circle cx="34" cy="43" r="0.8" fill="#FFFFFF" />
            <circle cx="39" cy="41" r="0.8" fill="#FFFFFF" />
            <circle cx="33" cy="27" r="0.8" fill="#FFFFFF" />
          </g>
        </svg>
      </button>

      {/* Spain Flag - Español */}
      <button
        onClick={() => setLanguage('es')}
        className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full overflow-hidden transition-all duration-200 cursor-pointer shadow-2xs relative flex items-center justify-center shrink-0 ${
          language === 'es'
            ? 'ring-1.5 ring-[#3982C8] ring-offset-1 ring-offset-[#C9E5FF] scale-105'
            : 'opacity-70 hover:opacity-100 hover:scale-105'
        }`}
        title="Español"
        aria-label="Cambiar a Español"
      >
        <svg viewBox="0 0 64 64" className="w-full h-full object-cover">
          <circle cx="32" cy="32" r="32" fill="#FFFFFF" />
          <clipPath id="circle-clip-es">
            <circle cx="32" cy="32" r="32" />
          </clipPath>
          <g clipPath="url(#circle-clip-es)">
            {/* Red Top 25% */}
            <rect x="0" y="0" width="64" height="16" fill="#AA151B" />
            {/* Yellow Center 50% */}
            <rect x="0" y="16" width="64" height="32" fill="#F1BF00" />
            {/* Red Bottom 25% */}
            <rect x="0" y="48" width="64" height="16" fill="#AA151B" />
            {/* Spanish Coat of Arms emblem */}
            <rect x="16" y="26" width="9" height="12" rx="2" fill="#AA151B" />
            <circle cx="20.5" cy="24" r="2.5" fill="#AA151B" />
            <rect x="14" y="27" width="1.5" height="10" fill="#FFFFFF" />
            <rect x="25.5" y="27" width="1.5" height="10" fill="#FFFFFF" />
          </g>
        </svg>
      </button>
    </div>
  );
};
