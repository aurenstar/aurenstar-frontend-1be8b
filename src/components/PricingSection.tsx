import React, { useState } from 'react';
import { Rocket, Star, Flame, Check, ArrowUpRight } from 'lucide-react';

interface PricingSectionProps {
  onSelectPlan: (planName: string, price: string) => void;
  lang: 'pt' | 'en';
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  onSelectPlan,
  lang,
}) => {
  const [annualBilling, setAnnualBilling] = useState(false);

  const t = {
    pt: {
      tag: 'PLANOS',
      title: 'Planos flexíveis pensados para cada momento seu',
      sub: 'Seja para dar os primeiros passos ou para expandir sua estrutura, temos um formato sob medida sem surpresas.',
      monthly: 'Cobrança Mensal',
      annual: 'Cobrança Anual',
      saveBadge: 'Economize 20%',
      monthSuffix: '/mês',
      getStarted: 'COMEÇAR AGORA',
      plans: [
        {
          id: 'starter',
          name: 'PLANO INICIANTE',
          icon: Rocket,
          highlight: false,
          desc: 'Perfeito para quem quer começar a organizar a rotina e tirar tarefas repetitivas da frente.',
          monthlyPrice: 'R$ 2.500',
          annualPrice: 'R$ 2.000',
          features: [
            'Consultoria prática passo a passo (até 10 horas)',
            'Mapeamento simples de rotinas do seu negócio',
            'Configuração de 2 automações amigáveis',
            'Suporte prioritário por WhatsApp e e-mail',
          ],
        },
        {
          id: 'growth',
          name: 'PLANO CRESCIMENTO',
          icon: Star,
          highlight: true,
          badge: 'Mais Escolhido ⭐',
          desc: 'Ideal para quem já tem clientes e quer faturar mais com menos cansaço e tudo rodando liso.',
          monthlyPrice: 'R$ 8.500',
          annualPrice: 'R$ 6.800',
          features: [
            'Consultor dedicado para cuidar da sua estratégia',
            'Automações completas de ponta a ponta',
            'Painel visual no celular com suas metas e lucros',
            'Relatórios em linguagem clara toda semana',
          ],
        },
        {
          id: 'enterprise',
          name: 'PLANO SOB MEDIDA',
          icon: Flame,
          highlight: false,
          desc: 'Feito para equipes maiores que querem uma transformação completa e acompanhamento de perto.',
          monthlyPrice: 'R$ 10.500',
          annualPrice: 'R$ 8.400',
          features: [
            'Plano personalizado de longo prazo',
            'Arquitetura de sistemas integrada e segura',
            'Painéis avançados com inteligência pensante',
            'Suporte vip 24 horas por dia',
          ],
        },
      ],
    },
    en: {
      tag: 'PRICING',
      title: 'Flexible Plans Built for Every Stage of Growth',
      sub: 'Whether you are just starting your AI journey or scaling enterprise-wide innovation, we offer tailored solutions that grow with you.',
      monthly: 'Monthly',
      annual: 'Annual',
      saveBadge: 'Save 20%',
      monthSuffix: '/month',
      getStarted: 'GET STARTED',
      plans: [
        {
          id: 'starter',
          name: 'STARTER PLAN',
          icon: Rocket,
          highlight: false,
          desc: 'Perfect for small teams beginning to explore AI and automation.',
          monthlyPrice: '$2,500',
          annualPrice: '$2,000',
          features: [
            'Strategy consultation (up to 10 hours)',
            'Business process mapping',
            'Basic AI workflow setup',
            'Email support',
          ],
        },
        {
          id: 'growth',
          name: 'GROWTH PLAN',
          icon: Star,
          highlight: true,
          badge: 'Most Popular ⭐',
          desc: 'Designed for growing companies ready to integrate AI into their operations.',
          monthlyPrice: '$8,500',
          annualPrice: '$6,800',
          features: [
            'Dedicated consultant',
            'End-to-end automation setup',
            'Predictive analytics dashboards',
            'AI-driven reporting & insights',
          ],
        },
        {
          id: 'enterprise',
          name: 'ENTERPRISE PLAN',
          icon: Flame,
          highlight: false,
          desc: 'Custom-built for enterprises seeking full-scale transformation optimization.',
          monthlyPrice: '$10,500',
          annualPrice: '$8,400',
          features: [
            'Tailored AI implementation roadmap',
            'Custom automation architecture',
            'Advanced data analytics & security',
            '24/7 premium support',
          ],
        },
      ],
    },
  }[lang];

  return (
    <section id="pricing" className="py-20 lg:py-28 bg-white text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-slate-500 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
            <span>{t.tag}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
            {t.title}
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            {t.sub}
          </p>

          {/* Billing Switch */}
          <div className="mt-8 inline-flex items-center gap-3 bg-slate-100 p-1.5 rounded-full border border-slate-200">
            <button
              onClick={() => setAnnualBilling(false)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                !annualBilling
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-black'
              }`}
            >
              {t.monthly}
            </button>
            <button
              onClick={() => setAnnualBilling(true)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                annualBilling
                  ? 'bg-black text-white shadow-sm'
                  : 'text-slate-600 hover:text-black'
              }`}
            >
              <span>{t.annual}</span>
              <span className="bg-[#d2f829] text-black text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {t.plans.map((plan) => {
            const Icon = plan.icon;
            const price = annualBilling ? plan.annualPrice : plan.monthlyPrice;

            if (plan.highlight) {
              // GROWTH PLAN: Vibrant Lime Card
              return (
                <div
                  key={plan.id}
                  className="bg-[#d2f829] text-black rounded-3xl p-8 sm:p-9 shadow-xl relative flex flex-col justify-between border-2 border-black/10 transform lg:-translate-y-2 hover:-translate-y-3 transition-transform"
                >
                  <div>
                    {/* Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-9 h-9 rounded-full bg-black text-[#d2f829] flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-black tracking-wider uppercase bg-black text-white px-3 py-1 rounded-full shadow-xs">
                        {plan.badge || plan.name}
                      </span>
                    </div>

                    <div className="text-xs font-black tracking-widest uppercase text-black/70">
                      {plan.name}
                    </div>

                    <p className="mt-2 text-sm font-semibold text-black/80 leading-relaxed">
                      {plan.desc}
                    </p>

                    <div className="mt-6 flex items-baseline gap-1">
                      <span className="text-4xl sm:text-5xl font-black tracking-tight text-black">
                        {price}
                      </span>
                      <span className="text-sm font-bold text-black/70">
                        {t.monthSuffix}
                      </span>
                    </div>

                    {/* Features list */}
                    <ul className="mt-8 space-y-3.5 border-t border-black/15 pt-6 text-sm font-semibold text-black">
                      {plan.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-black text-[#d2f829] flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Dark Button */}
                  <div className="mt-8">
                    <button
                      onClick={() => onSelectPlan(plan.name, price)}
                      className="w-full py-4 rounded-full font-black text-xs sm:text-sm tracking-wider uppercase bg-black hover:bg-slate-900 text-white shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-98"
                    >
                      <span>{t.getStarted}</span>
                      <ArrowUpRight className="w-4 h-4 text-[#d2f829]" />
                    </button>
                  </div>
                </div>
              );
            }

            // Normal White Cards: Starter & Enterprise
            return (
              <div
                key={plan.id}
                className="bg-white text-slate-900 rounded-3xl p-8 sm:p-9 shadow-sm hover:shadow-xl border border-slate-200/90 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold tracking-wider uppercase text-slate-400">
                      {plan.name}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    {plan.desc}
                  </p>

                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">
                      {price}
                    </span>
                    <span className="text-sm font-semibold text-slate-400">
                      {t.monthSuffix}
                    </span>
                  </div>

                  {/* Features list */}
                  <ul className="mt-8 space-y-3.5 border-t border-slate-100 pt-6 text-sm text-slate-700">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-900 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Button */}
                <div className="mt-8">
                  <button
                    onClick={() => onSelectPlan(plan.name, price)}
                    className="w-full py-4 rounded-full font-bold text-xs sm:text-sm tracking-wider uppercase bg-slate-900 hover:bg-black text-white shadow-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-98"
                  >
                    <span>{t.getStarted}</span>
                    <ArrowUpRight className="w-4 h-4 text-[#d2f829]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
