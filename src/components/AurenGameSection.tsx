import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { DailyCardModal } from './DailyCardModal';

interface SignInfo {
  id: string;
  nameEn: string;
  namePt: string;
  nameEs: string;
  symbol: string;
  dates: string;
  element: 'fire' | 'earth' | 'air' | 'water';
}

const ZODIAC_SIGNS: SignInfo[] = [
  { id: 'aries', nameEn: 'Aries', namePt: 'Áries', nameEs: 'Aries', symbol: '♈', dates: '21 Mar - 19 Abr', element: 'fire' },
  { id: 'taurus', nameEn: 'Taurus', namePt: 'Touro', nameEs: 'Tauro', symbol: '♉', dates: '20 Abr - 20 Mai', element: 'earth' },
  { id: 'gemini', nameEn: 'Gemini', namePt: 'Gêmeos', nameEs: 'Géminis', symbol: '♊', dates: '21 Mai - 20 Jun', element: 'air' },
  { id: 'cancer', nameEn: 'Cancer', namePt: 'Câncer', nameEs: 'Cáncer', symbol: '♋', dates: '21 Jun - 22 Jul', element: 'water' },
  { id: 'leo', nameEn: 'Leo', namePt: 'Leão', nameEs: 'Leo', symbol: '♌', dates: '23 Jul - 22 Ago', element: 'fire' },
  { id: 'virgo', nameEn: 'Virgo', namePt: 'Virgem', nameEs: 'Virgo', symbol: '♍', dates: '23 Ago - 22 Set', element: 'earth' },
  { id: 'libra', nameEn: 'Libra', namePt: 'Libra', nameEs: 'Libra', symbol: '♎', dates: '23 Set - 22 Out', element: 'air' },
  { id: 'scorpio', nameEn: 'Scorpio', namePt: 'Escorpião', nameEs: 'Escorpio', symbol: '♏', dates: '23 Out - 21 Nov', element: 'water' },
  { id: 'sagittarius', nameEn: 'Sagittarius', namePt: 'Sagitário', nameEs: 'Sagitario', symbol: '♐', dates: '22 Nov - 21 Dez', element: 'fire' },
  { id: 'capricorn', nameEn: 'Capricorn', namePt: 'Capricórnio', nameEs: 'Capricornio', symbol: '♑', dates: '22 Dez - 19 Jan', element: 'earth' },
  { id: 'aquarius', nameEn: 'Aquarius', namePt: 'Aquário', nameEs: 'Acuario', symbol: '♒', dates: '20 Jan - 18 Fev', element: 'air' },
  { id: 'pisces', nameEn: 'Pisces', namePt: 'Peixes', nameEs: 'Piscis', symbol: '♓', dates: '19 Fev - 20 Mar', element: 'water' },
];

export const AurenGameSection: React.FC = () => {
  const { language } = useLanguage();
  const lang = language as 'en' | 'pt' | 'es';

  const [selectedSign, setSelectedSign] = useState<SignInfo>(ZODIAC_SIGNS[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  const titles = {
    en: {
      title: 'Choose Your Sign',
      selectNotice: 'Click to select your star sign:',
      viewMessage: 'View Message',
    },
    pt: {
      title: 'Escolha Seu Signo',
      selectNotice: 'Clique para escolher o seu signo:',
      viewMessage: 'Ver Mensagem',
    },
    es: {
      title: 'Elige Tu Signo',
      selectNotice: 'Haz clic para elegir tu signo:',
      viewMessage: 'Ver Mensaje',
    },
  };

  const t = titles[lang];

  const getSignName = (sign: SignInfo) => {
    if (lang === 'pt') return sign.namePt;
    if (lang === 'es') return sign.nameEs;
    return sign.nameEn;
  };

  const handleSignClick = (sign: SignInfo, index: number) => {
    setSelectedSign(sign);
    setModalIndex(index);
    setIsModalOpen(true);
  };

  return (
    <section id="aureneffect" className="w-full bg-[#C9E5FF] border-y border-[#D9E8F8] py-14 sm:py-16 select-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with only the clean title */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#172B4D] tracking-tight leading-tight">
            {t.title}
          </h2>
        </div>

        {/* 12 Star Signs Grid */}
        <div className="bg-[#FFFFFF] border border-[#D9E8F8] rounded-3xl p-5 sm:p-7 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs sm:text-sm font-bold text-[#647DA5] uppercase tracking-wider flex items-center gap-1.5">
              <Star className="w-4 h-4 text-[#2878D0]" />
              {t.selectNotice}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#E4F1FF] text-[#2878D0] border border-[#D9E8F8]">
              {getSignName(selectedSign)} • {selectedSign.dates}
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 sm:gap-3">
            {ZODIAC_SIGNS.map((sign, index) => {
              const isSelected = selectedSign.id === sign.id;
              return (
                <button
                  key={sign.id}
                  onClick={() => handleSignClick(sign, index)}
                  className={`relative p-3.5 sm:p-4 rounded-2xl border text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center group hover:-translate-y-0.5 ${
                    isSelected
                      ? 'bg-[#2878D0] text-[#FFFFFF] border-[#2878D0] shadow-md scale-[1.02]'
                      : 'bg-[#FFFFFF] text-[#172B4D] border-[#D9E8F8] hover:border-[#2878D0] hover:bg-[#E4F1FF]'
                  }`}
                >
                  <span
                    className={`text-2xl sm:text-3xl mb-1.5 transition-transform group-hover:scale-110 ${
                      isSelected ? 'text-[#FFFFFF]' : 'text-[#2878D0]'
                    }`}
                  >
                    {sign.symbol}
                  </span>
                  <span className="text-xs font-bold leading-tight truncate w-full">
                    {getSignName(sign)}
                  </span>
                  <span
                    className={`text-[10px] mt-0.5 font-medium ${
                      isSelected ? 'text-[#FFFFFF]/80' : 'text-[#647DA5]'
                    }`}
                  >
                    {sign.dates}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Daily Card Modal with the selected sign's guidance */}
      <DailyCardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialIndex={modalIndex}
      />
    </section>
  );
};
