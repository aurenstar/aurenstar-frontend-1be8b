import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Sparkles,
  Sun,
  Moon,
  Compass,
  Heart,
  Check,
  CheckCircle2,
  Copy,
  Share2,
  RefreshCw,
  BookOpen,
  ShieldCheck,
  Calendar,
  Clock,
  MapPin,
  User,
  Activity,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import {
  calculateAstrologicalTriad,
  queryAurenstarEngine,
  generateLocalAurenEffectReading,
  REFERENCE_CITIES,
  AurenEffectResult,
} from '../utils/aurenEngine';

interface AurenEffectPageProps {
  onBackToHome: () => void;
  onNavigateToBlog: () => void;
  onNavigateToNewsletter: () => void;
  onNavigateToResult?: () => void;
}

const STORAGE_KEY = 'aurenstar_effect_profile';
const LAST_RESULT_KEY = 'aurenstar_effect_last_result';
const LAST_CALCULATED_TIME_KEY = 'aurenstar_effect_last_calculated_at';
const SIX_HOURS_MS = 6 * 60 * 60 * 1000;

export const AurenEffectPage: React.FC<AurenEffectPageProps> = ({
  onBackToHome,
  onNavigateToBlog,
  onNavigateToNewsletter,
  onNavigateToResult,
}) => {
  const { language } = useLanguage();
  const lang = (language || 'pt') as 'pt' | 'en' | 'es';
  const copy = {
    pt: {
      backHome: 'Voltar ao Início',
      blog: 'Ver Dicas no Blog',
      realTime: 'Astrologia em Tempo Real',
      subtitle: 'Entenda como você está se sentindo hoje e receba dicas simples e práticas para o seu dia.',
      formTitle: 'Seus Dados para o Aureneffect',
      formSubtitle: 'Preencha abaixo para calcular o seu Aureneffect:',
      name: 'Seu Nome ou Apelido',
      namePlaceholder: 'Digite seu nome (ex: Andriel)',
      city: 'Cidade de Nascimento',
      birthDate: 'Data de Nascimento',
      day: 'Dia', month: 'Mês', year: 'Ano',
      birthTime: 'Hora Aproximada de Nascimento',
      exactTime: 'Ou horário exato (opcional):',
      viewCurrent: 'Ver Meu Aureneffect Atual ✨',
      calculate: 'Calcular Meu Aureneffect ✨',
    },
    en: {
      backHome: 'Back to Home',
      blog: 'Explore Blog Tips',
      realTime: 'Real-Time Astrology',
      subtitle: 'Understand how you feel today and receive simple, practical guidance for your day.',
      formTitle: 'Your Details for Aureneffect',
      formSubtitle: 'Fill in below to calculate your Aureneffect:',
      name: 'Your Name or Nickname',
      namePlaceholder: 'Type your name (e.g., Andriel)',
      city: 'Birth City',
      birthDate: 'Date of Birth',
      day: 'Day', month: 'Month', year: 'Year',
      birthTime: 'Approximate Birth Time',
      exactTime: 'Or exact time (optional):',
      viewCurrent: 'View My Current Aureneffect ✨',
      calculate: 'Calculate My Aureneffect ✨',
    },
    es: {
      backHome: 'Volver al Inicio',
      blog: 'Ver Consejos del Blog',
      realTime: 'Astrología en Tiempo Real',
      subtitle: 'Comprende cómo te sientes hoy y recibe consejos sencillos y prácticos para tu día.',
      formTitle: 'Tus Datos para Aureneffect',
      formSubtitle: 'Completa los datos para calcular tu Aureneffect:',
      name: 'Tu Nombre o Apodo',
      namePlaceholder: 'Escribe tu nombre (ej.: Andriel)',
      city: 'Ciudad de Nacimiento',
      birthDate: 'Fecha de Nacimiento',
      day: 'Día', month: 'Mes', year: 'Año',
      birthTime: 'Hora Aproximada de Nacimiento',
      exactTime: 'O hora exacta (opcional):',
      viewCurrent: 'Ver Mi Aureneffect Actual ✨',
      calculate: 'Calcular Mi Aureneffect ✨',
    },
  }[lang];

  // Form State
  const [name, setName] = useState('Andriel');
  const [birthDay, setBirthDay] = useState(15);
  const [birthMonth, setBirthMonth] = useState(6);
  const [birthYear, setBirthYear] = useState(2000);
  const [birthTime, setBirthTime] = useState('14:30');
  const [quickTimePeriod, setQuickTimePeriod] = useState<'manha' | 'tarde' | 'noite' | 'madrugada' | 'exato'>('tarde');
  const [birthCity, setBirthCity] = useState('sao-paulo');

  // Interactive Checklist
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Engine & UI State
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);
  const [result, setResult] = useState<AurenEffectResult | null>(null);
  const [cooldownRemainingMs, setCooldownRemainingMs] = useState<number>(0);

  // Check 6-hour cooldown rule
  useEffect(() => {
    const updateCooldown = () => {
      try {
        const lastTime = Number(localStorage.getItem(LAST_CALCULATED_TIME_KEY) || '0');
        if (lastTime) {
          const diff = Date.now() - lastTime;
          if (diff < SIX_HOURS_MS) {
            setCooldownRemainingMs(SIX_HOURS_MS - diff);
            return;
          }
        }
      } catch {
        // ignore
      }
      setCooldownRemainingMs(0);
    };

    updateCooldown();
    const interval = setInterval(updateCooldown, 10000);
    return () => clearInterval(interval);
  }, []);

  // Restore saved profile on mount
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem(STORAGE_KEY);
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        if (parsed.name) setName(parsed.name);
        if (parsed.birthDay) setBirthDay(parsed.birthDay);
        if (parsed.birthMonth) setBirthMonth(parsed.birthMonth);
        if (parsed.birthYear) setBirthYear(parsed.birthYear);
        if (parsed.birthTime) setBirthTime(parsed.birthTime);
        if (parsed.birthCity) setBirthCity(parsed.birthCity);
      }

      const savedResult = localStorage.getItem(LAST_RESULT_KEY);
      if (savedResult) {
        setResult(JSON.parse(savedResult));
      }
    } catch {
      // Ignora erro de parsing
    }
  }, []);

  const handleTimePeriodSelect = (period: 'manha' | 'tarde' | 'noite' | 'madrugada') => {
    setQuickTimePeriod(period);
    if (period === 'manha') setBirthTime('09:00');
    if (period === 'tarde') setBirthTime('14:30');
    if (period === 'noite') setBirthTime('20:00');
    if (period === 'madrugada') setBirthTime('03:30');
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Se estiver em cooldown de 6 horas e já tiver resultado anterior, abre o resultado atual
    if (cooldownRemainingMs > 0 && result) {
      if (onNavigateToResult) {
        onNavigateToResult();
      }
      return;
    }

    setIsLoading(true);
    setLoadingStep(1);

    // Save profile to localStorage
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          name,
          birthDay,
          birthMonth,
          birthYear,
          birthTime,
          birthCity,
        })
      );
    } catch {
      // silencioso
    }

    const birthDateISO = `${birthYear}-${String(birthMonth).padStart(2, '0')}-${String(birthDay).padStart(2, '0')}`;

    // Animação progressiva das 3 camadas
    const timer1 = setTimeout(() => setLoadingStep(2), 600);
    const timer2 = setTimeout(() => setLoadingStep(3), 1200);

    try {
      // Faz chamada à Camada 03 no servidor
      const response = await fetch('/api/aureneffect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          birthDate: birthDateISO,
          birthTime,
          birthCity,
        }),
      });

      if (!response.ok) {
        throw new Error('Falha na resposta do servidor');
      }

      const json = await response.json();
      if (json.success && json.data) {
        setResult(json.data);
        localStorage.setItem(LAST_RESULT_KEY, JSON.stringify(json.data));
      } else {
        throw new Error('Dado inválido');
      }
    } catch (err) {
      console.warn('Fallback local do Aureneffect ativado:', err);
      // Fallback local instantâneo da Camada 01 e 02
      const [h, m] = (birthTime || '14:30').split(':').map((n) => parseInt(n, 10) || 0);
      const triad = calculateAstrologicalTriad(birthYear, birthMonth, birthDay, h, m, birthCity);
      const trigger = queryAurenstarEngine(triad);
      const cityName = REFERENCE_CITIES[birthCity]?.label || 'São Paulo, SP';
      const localResult = generateLocalAurenEffectReading(
        name,
        `${String(birthDay).padStart(2, '0')}/${String(birthMonth).padStart(2, '0')}/${birthYear}`,
        birthTime,
        cityName,
        triad,
        trigger
      );
      setResult(localResult);
      try {
        localStorage.setItem(LAST_RESULT_KEY, JSON.stringify(localResult));
      } catch {
        // silencioso
      }
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setIsLoading(false);
      setCompletedSteps([]);
      try {
        localStorage.setItem(LAST_CALCULATED_TIME_KEY, String(Date.now()));
        setCooldownRemainingMs(SIX_HOURS_MS);
      } catch {
        // ignore
      }
      if (onNavigateToResult) {
        onNavigateToResult();
      } else {
        window.scrollTo({ top: 380, behavior: 'smooth' });
      }
    }
  };

  const toggleStep = (stepNumber: number) => {
    if (completedSteps.includes(stepNumber)) {
      setCompletedSteps(completedSteps.filter((s) => s !== stepNumber));
    } else {
      setCompletedSteps([...completedSteps, stepNumber]);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const text = `✨ Efeito Auren de ${result.userName} ✨\n` +
      `☀️ Sol em ${result.astronomy.sun.sign} | 🌙 Lua em ${result.astronomy.moon.sign} | 🧭 Ascendente em ${result.astronomy.ascendant.sign}\n` +
      `🌌 Lua de Hoje: ${result.astronomy.todayMoon.sign} (${result.astronomy.todayMoon.phase})\n\n` +
      `💭 Por que estou agindo assim hoje:\n${result.question1Answer}\n\n` +
      `🚀 O que fazer agora:\n${result.practicalSteps.map((s) => `${s.stepNumber}. ${s.title}: ${s.action}`).join('\n')}\n\n` +
      `Descubra o seu Efeito Auren gratuitamente em: ${window.location.origin}/#/aureneffect`;

    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleShareWhatsApp = () => {
    if (!result) return;
    const text = `✨ Meu Efeito Auren de Hoje (${result.userName}) ✨\n` +
      `Por que estou me sentindo assim hoje:\n"${result.question1Answer.slice(0, 160)}..."\n\n` +
      `Descubra o seu também na Aurenstar: ${window.location.origin}/#/aureneffect`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="w-full bg-[#C9E5FF] min-h-screen pt-24 sm:pt-28 pb-20 select-none animate-fadeIn text-[#172B4D] relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[550px] h-[300px] bg-gradient-to-tr from-[#2878D0]/15 via-[#FFE0EF]/40 to-[#F51B83]/15 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Navigation Breadcrumbs */}
        <div className="flex items-center justify-between mb-6 pb-2">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 hover:bg-white text-xs sm:text-sm font-bold text-[#647DA5] hover:text-[#172B4D] border border-[#D9E8F8] shadow-2xs transition-all cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-[#2878D0]" />
            <span>{copy.backHome}</span>
          </button>

          <button
            type="button"
            onClick={onNavigateToBlog}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E4F1FF] hover:bg-[#FFE0EF] text-xs sm:text-sm font-bold text-[#2878D0] border border-[#D9E8F8] transition-all cursor-pointer"
          >
            <span>{copy.blog}</span>
            <span>→</span>
          </button>
        </div>

        {/* Page Top Heading (CSS selector 1) */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#D9E8F8] text-[#2878D0] text-xs font-extrabold uppercase tracking-wider mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#F51B83]" />
            <span>{copy.realTime}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172B4D] tracking-tight mb-2.5 leading-tight">
            Aureneffect
          </h1>

          <p className="text-sm text-[#647DA5] leading-relaxed max-w-md mx-auto font-medium">
            {copy.subtitle}
          </p>
        </div>

        {/* =========================================================================
            USER INPUT FORM (CSS selector 2)
            ========================================================================= */}
        <div className="bg-[#FFFFFF] rounded-3xl border border-[#D9E8F8] shadow-md hover:shadow-lg p-6 sm:p-9 mb-8 transition-all relative overflow-hidden">
          {/* Subtle top decorative border */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#2878D0] via-[#17366F] to-[#F51B83]" />

          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#D9E8F8]">
            <div className="w-10 h-10 rounded-2xl bg-[#E4F1FF] text-[#2878D0] flex items-center justify-center font-bold shadow-2xs">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#172B4D]">
                {copy.formTitle}
              </h2>
              <p className="text-xs text-[#647DA5]">
                {copy.formSubtitle}
              </p>
            </div>
          </div>

          <form onSubmit={handleGenerate} className="space-y-6">
            {/* 1. Nome e Cidade */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Campo 1: Nome */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#172B4D] mb-2 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#2878D0]" />
                  <span>{copy.name}</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={copy.namePlaceholder}
                  className="w-full bg-[#E4F1FF]/30 border border-[#D9E8F8] rounded-2xl px-4 py-3 text-sm text-[#172B4D] font-semibold outline-none focus:border-[#2878D0] focus:bg-white focus:ring-2 focus:ring-[#2878D0]/15 transition-all shadow-2xs"
                  required
                />
              </div>

              {/* Campo 2: Cidade de Nascimento */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#172B4D] mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#F51B83]" />
                  <span>{copy.city}</span>
                </label>
                <div className="relative">
                  <select
                    value={birthCity}
                    onChange={(e) => setBirthCity(e.target.value)}
                    className="w-full appearance-none bg-[#E4F1FF]/30 border border-[#D9E8F8] rounded-2xl px-4 py-3 text-sm font-semibold text-[#172B4D] outline-none focus:border-[#2878D0] focus:bg-white cursor-pointer pr-9 shadow-2xs"
                  >
                    {Object.entries(REFERENCE_CITIES).map(([key, item]) => (
                      <option key={key} value={key}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-[#647DA5] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* 2. Data de Nascimento */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#172B4D] mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#2878D0]" />
                <span>{copy.birthDate}</span>
              </label>
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                {/* Dia */}
                <div>
                  <span className="block text-[11px] font-bold text-[#647DA5] mb-1">{copy.day}</span>
                  <div className="relative">
                    <select
                      value={birthDay}
                      onChange={(e) => setBirthDay(Number(e.target.value))}
                      className="w-full appearance-none bg-[#E4F1FF]/30 border border-[#D9E8F8] rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-[#172B4D] outline-none focus:border-[#2878D0] focus:bg-white cursor-pointer pr-8"
                    >
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-[#647DA5] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Mês */}
                <div>
                  <span className="block text-[11px] font-bold text-[#647DA5] mb-1">{copy.month}</span>
                  <div className="relative">
                    <select
                      value={birthMonth}
                      onChange={(e) => setBirthMonth(Number(e.target.value))}
                      className="w-full appearance-none bg-[#E4F1FF]/30 border border-[#D9E8F8] rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-[#172B4D] outline-none focus:border-[#2878D0] focus:bg-white cursor-pointer pr-8"
                    >
                      {[
                        'Janeiro',
                        'Fevereiro',
                        'Março',
                        'Abril',
                        'Maio',
                        'Junho',
                        'Julho',
                        'Agosto',
                        'Setembro',
                        'Outubro',
                        'Novembro',
                        'Dezembro',
                      ].map((m, idx) => (
                        <option key={idx + 1} value={idx + 1}>
                          {m}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-[#647DA5] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Ano */}
                <div>
                  <span className="block text-[11px] font-bold text-[#647DA5] mb-1">{copy.year}</span>
                  <div className="relative">
                    <select
                      value={birthYear}
                      onChange={(e) => setBirthYear(Number(e.target.value))}
                      className="w-full appearance-none bg-[#E4F1FF]/30 border border-[#D9E8F8] rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-[#172B4D] outline-none focus:border-[#2878D0] focus:bg-white cursor-pointer pr-8"
                    >
                      {Array.from({ length: 90 }, (_, i) => 2026 - i).map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-[#647DA5] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Horário Aproximado de Nascimento */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#172B4D] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#2878D0]" />
                  <span>{copy.birthTime}</span>
                </label>
                {birthTime && (
                  <span className="text-xs text-[#2878D0] font-bold bg-[#E4F1FF] px-2.5 py-0.5 rounded-full border border-[#D9E8F8]">
                    {birthTime}
                  </span>
                )}
              </div>

              {/* Botões de Período Padronizados */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'manha' as const, label: 'Manhã', time: '09h', icon: '🌅' },
                  { id: 'tarde' as const, label: 'Tarde', time: '14h30', icon: '☀️' },
                  { id: 'noite' as const, label: 'Noite', time: '20h', icon: '🌙' },
                  { id: 'madrugada' as const, label: 'Madrugada', time: '03h30', icon: '✨' },
                ].map((period) => {
                  const isSelected = quickTimePeriod === period.id;
                  return (
                    <button
                      key={period.id}
                      type="button"
                      onClick={() => handleTimePeriodSelect(period.id)}
                      className={`p-3 rounded-2xl text-xs font-bold transition-all cursor-pointer border text-center flex flex-col items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#2878D0] text-white border-[#2878D0] shadow-sm scale-[1.02]'
                          : 'bg-[#E4F1FF]/30 border-[#D9E8F8] text-[#172B4D] hover:border-[#2878D0] hover:bg-white'
                      }`}
                    >
                      <span className="text-lg">{period.icon}</span>
                      <span className="leading-tight">
                        {period.label} <span className="opacity-75 text-[10px]">({period.time})</span>
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Ou Digitar Horário Exato (Discreto e Simples) */}
              <div className="mt-2.5 flex items-center justify-end gap-2">
                <span className="text-[11px] text-[#647DA5] font-medium">{copy.exactTime}</span>
                <input
                  type="time"
                  value={birthTime}
                  onChange={(e) => {
                    setBirthTime(e.target.value);
                    setQuickTimePeriod('exato');
                  }}
                  className="px-3 py-1.5 rounded-xl border border-[#D9E8F8] bg-[#E4F1FF]/30 text-xs font-bold text-[#172B4D] outline-none focus:border-[#2878D0] focus:bg-white"
                />
              </div>
            </div>

            {/* Botão de Ação com Regra de 6 Horas */}
            <div className="pt-3">
              {cooldownRemainingMs > 0 ? (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-[#E4F1FF] border border-[#D9E8F8] text-center">
                    <p className="text-[11px] text-[#647DA5] mt-0.5 font-medium">
                      Próxima leitura liberada em cerca de{' '}
                      <span className="font-bold text-[#172B4D]">
                        {Math.floor(cooldownRemainingMs / (1000 * 60 * 60))}h{' '}
                        {Math.ceil((cooldownRemainingMs % (1000 * 60 * 60)) / (1000 * 60))}min
                      </span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigateToResult) onNavigateToResult();
                    }}
                    className="w-full py-4 px-6 rounded-2xl bg-[#2878D0] hover:bg-[#17366F] text-white font-extrabold text-sm sm:text-base shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2.5 group active:scale-[0.99]"
                  >
                    <Sparkles className="w-4 h-4 transition-transform group-hover:rotate-12" />
                    <span>{copy.viewCurrent}</span>
                  </button>
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 px-6 rounded-2xl bg-[#2878D0] hover:bg-[#17366F] text-white font-extrabold text-sm sm:text-base shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2.5 group active:scale-[0.99] disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>
                        {loadingStep === 1 && '1/3 Mapeando Posições dos Astros...'}
                        {loadingStep === 2 && '2/3 Cruzando com a Lua de Hoje...'}
                        {loadingStep === 3 && '3/3 Lapidando seu Efeito Auren...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 transition-transform group-hover:rotate-12" />
                      <span>{copy.calculate}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

