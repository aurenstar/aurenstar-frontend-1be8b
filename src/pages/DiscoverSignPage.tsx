import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Sparkles,
  Calendar,
  ChevronDown,
  Clock,
  MapPin,
  Loader2,
  Compass,
} from 'lucide-react';
import { ToolHero, ToolBenefits, PeriodIcon } from '../components/ToolHero';
import { useLanguage } from '../context/LanguageContext';
import { calculateSign, LAST_DISCOVERED_SIGN_KEY } from '../data/signsData';
import { CityAutocomplete, type PickedCity } from '../components/CityAutocomplete';
import { trackEvent } from '../utils/analytics';
import { loadSharedProfile, saveSharedProfile, timePeriodFor } from '../utils/sharedProfile';

// The calculation service answers with English sign names; the site's sign pages use these keys.
const SIGN_KEY_BY_NAME: Record<string, string> = {
  Aries: 'aries', Taurus: 'touro', Gemini: 'gemeos', Cancer: 'cancer', Leo: 'leao', Virgo: 'virgem',
  Libra: 'libra', Scorpio: 'escorpiao', Sagittarius: 'sagitario', Capricorn: 'capricornio',
  Aquarius: 'aquario', Pisces: 'peixes',
};

const CURRENT_YEAR = new Date().getFullYear();
const daysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();

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
  const [selectedYear, setSelectedYear] = useState(2000);
  const [busy, setBusy] = useState(false);
  // Shown only when the Sun changes sign on the chosen day: a time and a city settle the doubt.
  const [doubt, setDoubt] = useState<null | { before: string; after: string; likelyKey: string }>(null);
  const [birthTime, setBirthTime] = useState('');
  const [birthPlace, setBirthPlace] = useState<PickedCity | null>(null);
  const [needBoth, setNeedBoth] = useState(false);

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

  // Data typed in any other tool is already here: the person fills the form only once.
  useEffect(() => {
    const p = loadSharedProfile();
    if (p.day && p.month && p.year) { setSelectedDay(Math.min(p.day, daysInMonth(p.year, p.month))); setSelectedMonth(p.month); setSelectedYear(p.year); }
    if (p.time) setBirthTime(p.time);
    if (p.place) setBirthPlace(p.place);
  }, []);

  const handleDateChange = (d: number, m: number, y: number = selectedYear) => {
    setSelectedDay(Math.min(d, daysInMonth(y, m)));
    setSelectedMonth(m);
    setSelectedYear(y);
    setDoubt(null); // a new date needs a new check
    setNeedBoth(false);
  };

  const askChart = async (payload: { date: string; time?: string; geonameid?: number }) => {
    const res = await fetch('/api/chart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('chart unavailable');
    return res.json();
  };

  const dateISO = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;

  const handleDiscover = async () => {
    if (busy) return;
    setBusy(true);
    try {
      if (doubt) {
        // Second step: both a time and a city were typed to settle the doubt.
        if (!birthTime || !birthPlace) {
          setNeedBoth(true);
          return;
        }
        const chart = await askChart({ date: dateISO, time: birthTime, geonameid: birthPlace.geonameid });
        handleCalculateAndNavigate(SIGN_KEY_BY_NAME[chart.sun.sign]);
        return;
      }
      const chart = await askChart({ date: dateISO });
      const change = chart.accuracy?.sunSignChangesThatDay;
      if (change) {
        setDoubt({ ...change, likelyKey: SIGN_KEY_BY_NAME[chart.sun.sign] });
        return;
      }
      handleCalculateAndNavigate(SIGN_KEY_BY_NAME[chart.sun.sign]);
    } catch {
      // Calculation service unreachable: use the simple date table so the visitor still gets an answer.
      handleCalculateAndNavigate(calculateSign(selectedDay, selectedMonth));
    } finally {
      setBusy(false);
    }
  };

  const handleCalculateAndNavigate = (signToSave?: string) => {
    const finalSign = signToSave || calculateSign(selectedDay, selectedMonth);
    trackEvent('tool_submit', { tool: 'discover_sign' });
    saveSharedProfile({ day: selectedDay, month: selectedMonth, year: selectedYear, time: birthTime, place: birthPlace });
    try {
      localStorage.setItem(
        LAST_DISCOVERED_SIGN_KEY,
        JSON.stringify({
          signKey: finalSign,
          day: selectedDay,
          month: selectedMonth,
          year: selectedYear,
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
      title: 'Calculadora de Signo',
      subtitle:
        'Coloque o dia e o mês em que você nasceu para abrir a página do seu signo com conselhos simples e carinhosos.',
      backHome: 'Voltar ao Início',
      exploreBlog: 'Ver Dicas no Blog →',
      cardTitle: 'Sua Data de Nascimento',
      cardSubtitle: 'Escolha seu dia, mês e ano de nascimento:',
      dayLabel: 'Dia',
      monthLabel: 'Mês',
      yearLabel: 'Ano',
      doubtTitle: 'Dia de mudança de signo',
      doubtText: (a: string, b: string) => `Neste dia o Sol passa de ${a} para ${b}. Informe a hora e a cidade de nascimento para saber ao certo.`,
      timeLabel: 'Hora (opcional)',
      cityLabel: 'Cidade de nascimento',
      cityPlaceholder: 'Digite sua cidade',
      cityNoResults: 'Nenhuma cidade encontrada.',
      needBoth: 'Preencha a hora e escolha a cidade na lista, ou use a opção abaixo.',
      skip: 'Não sei a hora — mostrar o signo mais provável',
      btnConfirm: 'Confirmar Meu Signo',
      checking: 'Calculando…',
      btnCalculate: 'Ver Meu Signo Agora',
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
      cardSubtitle: 'Pick your birth day, month and year:',
      dayLabel: 'Day',
      monthLabel: 'Month',
      yearLabel: 'Year',
      doubtTitle: 'A sign-change day',
      doubtText: (a: string, b: string) => `On this day the Sun moves from ${a} to ${b}. Add your birth time and city to know for sure.`,
      timeLabel: 'Time (optional)',
      cityLabel: 'Birth city',
      cityPlaceholder: 'Type your city',
      cityNoResults: 'No city found.',
      needBoth: 'Add the time and pick your city from the list, or use the option below.',
      skip: "I don't know the time — show the most likely sign",
      btnConfirm: 'Confirm My Sign',
      checking: 'Calculating…',
      btnCalculate: 'Discover My Sign',
      orPickSign: 'Or choose a sign directly:',
    },
    es: {
      tag: 'Guía Sencilla de Signos',
      title: 'Calculadora de Signo',
      subtitle:
        'Elige el día y mes de tu nacimiento para abrir la página con tu signo y consejos claros para tu día.',
      backHome: 'Volver al Inicio',
      exploreBlog: 'Ver Artículos del Blog →',
      cardTitle: 'Tu Fecha de Nacimiento',
      cardSubtitle: 'Elige tu día, mes y año:',
      dayLabel: 'Día',
      monthLabel: 'Mes',
      yearLabel: 'Año',
      doubtTitle: 'Día de cambio de signo',
      doubtText: (a: string, b: string) => `Ese día el Sol pasa de ${a} a ${b}. Indica la hora y la ciudad de nacimiento para saberlo con certeza.`,
      timeLabel: 'Hora (opcional)',
      cityLabel: 'Ciudad de nacimiento',
      cityPlaceholder: 'Escribe tu ciudad',
      cityNoResults: 'No se encontró la ciudad.',
      needBoth: 'Indica la hora y elige la ciudad de la lista, o usa la opción de abajo.',
      skip: 'No sé la hora — mostrar el signo más probable',
      btnConfirm: 'Confirmar Mi Signo',
      checking: 'Calculando…',
      btnCalculate: 'Ver Mi Signo Ahora',
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
            className="text-xs sm:text-sm font-bold text-[#3982C8] hover:text-[#17366F] transition-colors cursor-pointer"
          >
            {t.exploreBlog}
          </button>
        </div>

        <ToolHero icon={<Compass className="h-8 w-8" />} tag={t.tag} title={t.title} subtitle={t.subtitle} />

        {/* Card Compacto e Simples de Data de Nascimento */}
        <div className="bg-[#FFFFFF] rounded-3xl border border-[#D9E8F8] shadow-md hover:shadow-lg transition-all p-6 sm:p-8 mb-8 relative">
          {/* Barra sutil colorida no topo */}

          {/* Cabeçalho do Card */}
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#D9E8F8]">
            <div className="w-10 h-10 rounded-2xl bg-[#3982C8] text-white flex items-center justify-center font-bold shadow-sm">
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
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#17366F] mb-1.5">
                {t.dayLabel}
              </label>
              <div className="relative">
                <select
                  value={selectedDay}
                  onChange={(e) => handleDateChange(Number(e.target.value), selectedMonth)}
                  className="w-full appearance-none bg-[#E4F1FF]/30 border border-[#D9E8F8] rounded-2xl px-4 py-2.5 text-sm font-semibold text-[#172B4D] outline-none focus:border-[#E73578] focus:bg-white cursor-pointer pr-9 shadow-2xs"
                >
                  {Array.from({ length: daysInMonth(selectedYear, selectedMonth) }, (_, i) => i + 1).map((d) => (
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
                  className="w-full appearance-none bg-[#E4F1FF]/30 border border-[#D9E8F8] rounded-2xl px-4 py-2.5 text-sm font-semibold text-[#172B4D] outline-none focus:border-[#E73578] focus:bg-white cursor-pointer pr-9 shadow-2xs"
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

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#17366F] mb-1.5">
                {t.yearLabel}
              </label>
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={(e) => handleDateChange(selectedDay, selectedMonth, Number(e.target.value))}
                  className="w-full appearance-none bg-[#E4F1FF]/30 border border-[#D9E8F8] rounded-2xl px-4 py-2.5 text-sm font-semibold text-[#172B4D] outline-none focus:border-[#E73578] focus:bg-white cursor-pointer pr-9 shadow-2xs"
                >
                  {Array.from({ length: CURRENT_YEAR - 1899 }, (_, i) => CURRENT_YEAR - i).map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#647DA5] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {doubt && (
            <div className="mb-6 rounded-2xl bg-[#E4F1FF]/60 border border-[#D9E8F8] p-4 sm:p-5">
              <p className="text-sm font-extrabold text-[#172B4D] mb-1">{t.doubtTitle}</p>
              <p className="text-xs sm:text-[13px] text-[#647DA5] leading-relaxed mb-4">
                {t.doubtText(doubt.before, doubt.after)}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#17366F] mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#3982C8]" />
                    <span>{t.timeLabel}</span>
                  </label>
                  <input
                    type="time"
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                    className="w-full bg-white border border-[#D9E8F8] rounded-2xl px-4 py-2.5 text-sm font-semibold text-[#172B4D] outline-none focus:border-[#E73578] shadow-2xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#17366F] mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#E73578]" />
                    <span>{t.cityLabel}</span>
                  </label>
                  <CityAutocomplete
                    value={birthPlace}
                    onChange={(c) => {
                      setBirthPlace(c);
                      setNeedBoth(false);
                    }}
                    placeholder={t.cityPlaceholder}
                    noResultsText={t.cityNoResults}
                    className="w-full bg-white border border-[#D9E8F8] rounded-2xl px-4 py-2.5 text-sm font-semibold text-[#172B4D] outline-none focus:border-[#E73578] shadow-2xs"
                  />
                </div>
              </div>
              {needBoth && <p className="mt-3 text-[11px] font-semibold text-[#E73578]">{t.needBoth}</p>}
              <button
                type="button"
                onClick={() => handleCalculateAndNavigate(doubt.likelyKey)}
                className="mt-3 text-xs font-bold text-[#3982C8] hover:text-[#17366F] underline underline-offset-2 cursor-pointer"
              >
                {t.skip}
              </button>
            </div>
          )}

          {/* Botão Principal: Abre a Nova Página Mostrando o Resultado */}
          <button
            type="button"
            onClick={handleDiscover}
            disabled={busy}
            className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-[#E73578] hover:bg-[#D0306C] text-white font-extrabold text-sm sm:text-base shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 group active:scale-[0.99] disabled:opacity-60"
          >
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 transition-transform group-hover:rotate-12" />}
            <span>{busy ? t.checking : doubt ? t.btnConfirm : t.btnCalculate}</span>
          </button>
        </div>

        <ToolBenefits lang={lang} />
      </div>
    </div>
  );
};

