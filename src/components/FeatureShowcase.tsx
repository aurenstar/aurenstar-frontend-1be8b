import React, { useState } from 'react';
import { Sparkles, CheckCircle2, TrendingUp, Zap, Clock, ShieldCheck, BarChart3 } from 'lucide-react';

interface FeatureShowcaseProps {
  lang: 'pt' | 'en';
}

export const FeatureShowcase: React.FC<FeatureShowcaseProps> = ({ lang }) => {
  // Interactive state for Card 1 (Automation)
  const [autoReplies, setAutoReplies] = useState(true);
  const [orderSync, setOrderSync] = useState(true);
  const [weeklyAlerts, setWeeklyAlerts] = useState(false);

  // Interactive state for Card 2 (Analytics view)
  const [activeMetric, setActiveMetric] = useState<'sales' | 'time' | 'happiness'>('time');

  const t = {
    pt: {
      headline: 'Onde o olhar humano encontra a inteligência prática',
      subhead:
        'Não usamos tecnologia para substituir pessoas, mas para tirar as tarefas chatas do caminho e deixar você livre para criar e crescer.',
      card1Title: 'Automação sem complicação',
      card1Desc:
        'Organize seu dia a dia com passos automáticos simples: menos erros, menos cansaço e muito mais produtividade.',
      card2Title: 'Análise de dados descomplicada',
      card2Desc:
        'Transforme anotações e números espalhados em respostas claras para você saber exatamente qual decisão tomar.',
      simTitle: 'Experimente ativar as rotinas:',
      hoursSaved: 'Horas salvas por semana:',
      livePreview: 'Resultado em Tempo Real',
    },
    en: {
      headline: 'Where human insight meets intelligent technology',
      subhead:
        'We help businesses harness technology not to replace human creativity, but to amplify it — enabling smarter decisions and faster.',
      card1Title: 'Automation & optimization',
      card1Desc:
        'Streamline your operations through intelligent workflow automation that saves time, reduces errors, and boosts productivity.',
      card2Title: 'Data analytics & insights',
      card2Desc:
        'Transform raw data into strategic insight using dashboards and predictive models.',
      simTitle: 'Try toggling automated routines:',
      hoursSaved: 'Hours saved per week:',
      livePreview: 'Live Interactive Preview',
    },
  }[lang];

  // Calculated hours saved based on toggles
  const totalHours =
    (autoReplies ? 8 : 0) + (orderSync ? 12 : 0) + (weeklyAlerts ? 5 : 0);

  return (
    <section className="py-20 lg:py-28 bg-white text-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
            {t.headline}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            {t.subhead}
          </p>
        </div>

        {/* 2 Massive Feature Split Cards */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Feature Card 1: Automation */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-3xl p-7 sm:p-9 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
            {/* Visual Playground Mockup */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="ml-2 text-xs font-semibold text-slate-400">
                    Rotinas Automáticas
                  </span>
                </div>
                <div className="text-[11px] font-bold text-[#d2f829] bg-[#d2f829]/10 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  <span>{totalHours}h livres / sem</span>
                </div>
              </div>

              {/* Toggles */}
              <div className="mt-4 space-y-2.5 text-xs">
                <div
                  onClick={() => setAutoReplies(!autoReplies)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 cursor-pointer transition-colors border border-slate-700/50"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-4 h-4 rounded-md flex items-center justify-center ${
                        autoReplies ? 'bg-emerald-500 text-black' : 'bg-slate-700'
                      }`}
                    >
                      {autoReplies && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>
                    <span>Respostas rápidas a mensagens comuns</span>
                  </div>
                  <span className="font-bold text-emerald-400">+8h</span>
                </div>

                <div
                  onClick={() => setOrderSync(!orderSync)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 cursor-pointer transition-colors border border-slate-700/50"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-4 h-4 rounded-md flex items-center justify-center ${
                        orderSync ? 'bg-emerald-500 text-black' : 'bg-slate-700'
                      }`}
                    >
                      {orderSync && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>
                    <span>Organização de pedidos e recibos</span>
                  </div>
                  <span className="font-bold text-emerald-400">+12h</span>
                </div>

                <div
                  onClick={() => setWeeklyAlerts(!weeklyAlerts)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 cursor-pointer transition-colors border border-slate-700/50"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-4 h-4 rounded-md flex items-center justify-center ${
                        weeklyAlerts ? 'bg-emerald-500 text-black' : 'bg-slate-700'
                      }`}
                    >
                      {weeklyAlerts && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>
                    <span>Resumo da semana direto no WhatsApp</span>
                  </div>
                  <span className="font-bold text-emerald-400">+5h</span>
                </div>
              </div>

              {/* White Floating Expense Mini-Card overlay */}
              <div className="mt-4 bg-white text-slate-800 p-3.5 rounded-xl shadow-lg flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">
                    Controle de Gastos
                  </div>
                  <div className="text-base font-extrabold text-slate-900 mt-0.5">
                    $4,900{' '}
                    <span className="text-xs text-slate-400 font-normal">/ $10,000</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    100% Organizado
                  </span>
                  <div className="text-[10px] text-slate-400 mt-0.5">50+ tarefas feitas</div>
                </div>
              </div>
            </div>

            {/* Bottom text */}
            <div className="mt-7">
              <h3 className="text-2xl font-bold text-slate-900">{t.card1Title}</h3>
              <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
                {t.card1Desc}
              </p>
            </div>
          </div>

          {/* Feature Card 2: Analytics & Insights */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-3xl p-7 sm:p-9 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
            {/* Visual Playground Mockup */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-md">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => setActiveMetric('time')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      activeMetric === 'time'
                        ? 'bg-black text-[#d2f829]'
                        : 'text-slate-600 hover:text-black'
                    }`}
                  >
                    Tempo Livre
                  </button>
                  <button
                    onClick={() => setActiveMetric('sales')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      activeMetric === 'sales'
                        ? 'bg-black text-[#d2f829]'
                        : 'text-slate-600 hover:text-black'
                    }`}
                  >
                    Vendas
                  </button>
                  <button
                    onClick={() => setActiveMetric('happiness')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      activeMetric === 'happiness'
                        ? 'bg-black text-[#d2f829]'
                        : 'text-slate-600 hover:text-black'
                    }`}
                  >
                    Satisfação
                  </button>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  +42% neste mês
                </span>
              </div>

              {/* Chart visualization */}
              <div className="mt-5">
                <div className="flex items-end justify-between gap-3 h-28 pt-4">
                  {[
                    { label: 'Jan', val: activeMetric === 'sales' ? 40 : 50 },
                    { label: 'Fev', val: activeMetric === 'sales' ? 55 : 62 },
                    { label: 'Mar', val: activeMetric === 'sales' ? 68 : 74 },
                    { label: 'Abr', val: activeMetric === 'sales' ? 82 : 86 },
                    { label: 'Hoje', val: 96 },
                  ].map((bar, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1.5">
                      <div className="text-[10px] font-bold text-slate-500">
                        {bar.val}%
                      </div>
                      <div
                        className={`w-full rounded-t-lg transition-all duration-500 ${
                          idx === 4 ? 'bg-[#d2f829] border border-black/10' : 'bg-blue-400'
                        }`}
                        style={{ height: `${bar.val}%` }}
                      />
                      <span className="text-[10px] font-bold text-slate-400">
                        {bar.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mini dark card insight */}
              <div className="mt-4 bg-slate-900 text-white p-3 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#d2f829] animate-ping" />
                  <span className="font-semibold text-slate-200">
                    Previsão para o próximo mês:
                  </span>
                </div>
                <span className="font-extrabold text-[#d2f829]">Crescimento Contínuo</span>
              </div>
            </div>

            {/* Bottom text */}
            <div className="mt-7">
              <h3 className="text-2xl font-bold text-slate-900">{t.card2Title}</h3>
              <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
                {t.card2Desc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
