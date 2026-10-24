import React, { useState } from 'react';
import {
  ArrowLeft,
  Sparkles,
  Calendar,
  ChevronDown,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { calculateSign, LAST_DISCOVERED_SIGN_KEY } from '../data/signsData';

interface DiscoverSignPageProps {
  onBackToHome: () => void;
  onNavigateToBlog: () => void;
  onNavigateToResult: () => void;
}

export const DiscoverSignPage: React.FC<DiscoverSignPageProps> = ({
  onBackToHome,
  onNavigateToBlog,
  onNavigateToResult,
}) => {
  const { language } = useLanguage();
  const lang = (language || 'pt') as 'pt' | 'en' | 'es';

  const [selectedDay, setSelectedDay] = useState(15);
  const [selectedMonth, setSelectedMonth] = useState(5); // Maio

  const months = [
    { num: 1, name: { pt: 'Janeiro', en: 'January', es: 'Enero' } },
    { num: 2, name: { pt: 'Fevereiro', en: 'February', es: 'Febrero' } },
    { num: 3, name: { pt: 'Março', en: 'March', es: 'Marzo' } },
    { num: 4, name: { pt: 'Abril', en: 'April', es: 'Abril' } },
    { num: 5, name: { pt: 'Maio', en: 'May', es: 'Mayo' } },
    { num: 6, name: { pt: 'Junho', en: 'June', es: 'Junio' } },
    { num: 7, name: { pt: 'Julho', en: 'July', es: 'Julio' } },
    { num: 8, name: { pt: 'Agosto', en: 'August', es: 'Agosto' } },
    { num: 9, name: { pt: 'Setembro', en: 'September', es: 'Septiembre' } },
    { num: 10, name: { pt: 'Outubro', en: 'October', es: 'Octubre' } },
    { num: 11, name: { pt: 'Novembro', en: 'November', es: 'Noviembre' } },
    { num: 12, name: { pt: 'Dezembro', en: 'December', es: 'Diciembre' } },
  ];

  const handleDateChange = (d: number, m: number) => {
    setSelectedDay(d);
    setSelectedMonth(m);
  };

  const handleCalculateAndNavigate = (signToSave?: string) => {
    const finalSign = signToSave || calculateSign(selectedDay, selectedMonth);
    try {
      localStorage.setItem(
        LAST_DISCOVERED_SIGN_KEY,
        JSON.stringify({
          signKey: finalSign,
          day: selectedDay,
          month: selectedMonth,
        })
      );
    } catch {
      // silencioso
    }
    onNavigateToResult();
  };

  const texts = {
    pt: {
      tag: 'Guia Simples dos Signos',
      title: 'Sign Calculator',
      subtitle:
        'Coloque o dia e o mês em que você nasceu para abrir a página do seu signo com conselhos simples e carinhosos.',
      backHome: 'Voltar ao Início',
      exploreBlog: 'Ver Dicas no Blog →',
      cardTitle: 'Sua Data de Nascimento',
      cardSubtitle: 'Escolha seu dia e mês de nascimento:',
      dayLabel: 'Dia',
      monthLabel: 'Mês',
      btnCalculate: 'Ver Meu Signo Agora ✨',
      orPickSign: 'Ou se já sabe seu signo, escolha direto:',
    },
    en: {
      tag: 'Simple Zodiac Guide',
      title: 'Sign Calculator',
      subtitle:
        'Choose your birth date to open a dedicated result page with simple and warm advice.',
      backHome: 'Back to Home',
      exploreBlog: 'Explore Blog Posts →',
      cardTitle: 'Your Birth Date',
      cardSubtitle: 'Pick your birth day and month:',
      dayLabel: 'Day',
      monthLabel: 'Month',
      btnCalculate: 'Discover My Sign ✨',
      orPickSign: 'Or choose a sign directly:',
    },
    es: {
      tag: 'Guía Sencilla de Signos',
      title: 'Sign Calculator',
      subtitle:
        'Elige el día y mes de tu nacimiento para abrir la página con tu signo y consejos claros para tu día.',
      backHome: 'Volver al Inicio',
      exploreBlog: 'Ver Artículos del Blog →',
      cardTitle: 'Tu Fecha de Nacimiento',
      cardSubtitle: 'Elige tu día y mes:',
      dayLabel: 'Día',
      monthLabel: 'Mes',
      btnCalculate: 'Ver Mi Signo Ahora ✨',
      orPickSign: 'O si ya conoces tu signo, elige directo:',
    },
  };

  const t = texts[lang] || texts.pt;

  return (
    <div className="w-full bg-[#C9E5FF] min-h-screen pt-24 sm:pt-28 pb-20 select-none animate-fadeIn text-[#172B4D]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Barra Superior de Navegação */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#D9E8F8]">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#647DA5] hover:text-[#172B4D] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>{t.backHome}</span>
          </button>

          <button
            type="button"
            onClick={onNavigateToBlog}
            className="text-xs sm:text-sm font-bold text-[#2878D0] hover:text-[#17366F] transition-colors cursor-pointer"
          >
            {t.exploreBlog}
          </button>
        </div>

        {/* Cabeçalho da Página */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFFFF]/80 border border-[#D9E8F8] text-[#2878D0] text-xs font-bold uppercase tracking-wider mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.tag}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172B4D] tracking-tight mb-3 leading-tight">
            {t.title}
          </h1>

          <p className="text-sm sm:text-base text-[#647DA5] leading-relaxed max-w-lg mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Card Compacto e Simples de Data de Nascimento */}
        <div className="bg-[#FFFFFF] rounded-3xl border border-[#D9E8F8] shadow-md hover:shadow-lg transition-all p-6 sm:p-8 mb-8 relative overflow-hidden">
          {/* Barra sutil colorida no topo */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#2878D0] via-[#17366F] to-[#F51B83]" />

          {/* Cabeçalho do Card */}
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#D9E8F8]">
            <div className="w-10 h-10 rounded-2xl bg-[#E4F1FF] text-[#2878D0] flex items-center justify-center font-bold shadow-2xs">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-[#172B4D]">
                {t.cardTitle}
              </h2>
              <p className="text-xs text-[#647DA5]">
                {t.cardSubtitle}
              </p>
            </div>
          </div>

          {/* Seletores de Dia e Mês */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#17366F] mb-1.5">
                {t.dayLabel}
              </label>
              <div className="relative">
                <select
                  value={selectedDay}
                  onChange={(e) => handleDateChange(Number(e.target.value), selectedMonth)}
                  className="w-full appearance-none bg-[#E4F1FF]/30 border border-[#D9E8F8] rounded-2xl px-4 py-2.5 text-sm font-semibold text-[#172B4D] outline-none focus:border-[#2878D0] focus:bg-white cursor-pointer pr-9 shadow-2xs"
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#647DA5] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#17366F] mb-1.5">
                {t.monthLabel}
              </label>
              <div className="relative">
                <select
                  value={selectedMonth}
                  onChange={(e) => handleDateChange(selectedDay, Number(e.target.value))}
                  className="w-full appearance-none bg-[#E4F1FF]/30 border border-[#D9E8F8] rounded-2xl px-4 py-2.5 text-sm font-semibold text-[#172B4D] outline-none focus:border-[#2878D0] focus:bg-white cursor-pointer pr-9 shadow-2xs"
                >
                  {months.map((m) => (
                    <option key={m.num} value={m.num}>
                      {m.name[lang] || m.name.pt}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#647DA5] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Botão Principal: Abre a Nova Página Mostrando o Resultado */}
          <button
            type="button"
            onClick={() => handleCalculateAndNavigate()}
            className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-[#2878D0] hover:bg-[#17366F] text-white font-extrabold text-sm sm:text-base shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 group active:scale-[0.99]"
          >
            <Sparkles className="w-4 h-4 transition-transform group-hover:rotate-12" />
            <span>{t.btnCalculate}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

