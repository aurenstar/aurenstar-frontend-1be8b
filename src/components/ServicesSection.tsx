import React, { useState } from 'react';
import { ArrowUpRight, Sparkles, Clock, BarChart3, CheckCircle, ChevronRight } from 'lucide-react';

interface ServicesSectionProps {
  onSelectService: (serviceName: string) => void;
  lang: 'pt' | 'en';
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectService,
  lang,
}) => {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const t = {
    pt: {
      tag: 'SERVIÇOS',
      title: 'Consultoria completa e inovação que funciona',
      sub: 'Seja para organizar a rotina hoje ou preparar o crescimento de amanhã, mostramos o caminho mais rápido com segurança.',
      getStarted: 'COMEÇAR AGORA',
      learnMore: 'Ver detalhes simples',
      services: [
        {
          id: 'ai-strategy',
          tag: 'Estratégia com IA',
          title: 'IA Descomplicada',
          desc: 'Identificamos onde você perde tempo todo dia e colocamos robôs amigáveis para cuidar do trabalho chato.',
          icon: Sparkles,
          iconBg: 'bg-[#d2f829] text-black',
          image:
            '/assets/img/1573496359142-b8d87734a5-600.webp',
          perks: ['Atendimento rápido 24h', 'Respostas automáticas inteligentes', 'Zero dor de cabeça técnica'],
        },
        {
          id: 'business-consulting',
          tag: 'Consultoria de Negócios',
          title: 'Organização Prática',
          desc: 'Ajudamos a destravar vendas, ajustar preços e criar uma experiência que faz seus clientes voltarem sempre.',
          icon: Clock,
          iconBg: 'bg-blue-100 text-blue-600',
          image:
            '/assets/img/1556761175-5973dc0f32e7-600.webp',
          perks: ['Menos estresse na rotina', 'Mais tempo para sua família', 'Processo claro passo a passo'],
        },
        {
          id: 'data-insights',
          tag: 'Informações e Métricas',
          title: 'Controle Visual Fácil',
          desc: 'Transformamos números confusos em gráficos limpinhos e fáceis de entender para você tomar decisões sem medo.',
          icon: BarChart3,
          iconBg: 'bg-emerald-100 text-emerald-600',
          image:
            '/assets/img/1551288049-bebda4e38f71-600.webp',
          perks: ['Painel visual no celular', 'Alertas de gastos e lucros', 'Previsão de vendas futuras'],
        },
      ],
    },
    en: {
      tag: 'SERVICES',
      title: 'Comprehensive consulting and intelligent innovation',
      sub: 'Whether you are optimizing today or building for tomorrow, we help you move faster with confidence.',
      getStarted: 'GET STARTED',
      learnMore: 'Explore details',
      services: [
        {
          id: 'ai-strategy',
          tag: 'AI Strategy',
          title: 'AI Strategy',
          desc: 'We help you identify opportunities for AI adoption and implement the right solutions effortlessly.',
          icon: Sparkles,
          iconBg: 'bg-[#d2f829] text-black',
          image:
            '/assets/img/1573496359142-b8d87734a5-600.webp',
          perks: ['24/7 Smart Assistance', 'Automated customer triage', 'Zero technical debt'],
        },
        {
          id: 'business-consulting',
          tag: 'Business Consulting',
          title: 'Business Consulting',
          desc: 'We help you identify opportunities for top growth and implement the right strategies.',
          icon: Clock,
          iconBg: 'bg-blue-100 text-blue-600',
          image:
            '/assets/img/1556761175-5973dc0f32e7-600.webp',
          perks: ['Streamlined operations', 'More freedom in your schedule', 'Crystal clear roadmap'],
        },
        {
          id: 'data-insights',
          tag: 'Data & Insights',
          title: 'Data & Insights',
          desc: 'We help you identify opportunities for Big Data use and implement modern analytics.',
          icon: BarChart3,
          iconBg: 'bg-emerald-100 text-emerald-600',
          image:
            '/assets/img/1551288049-bebda4e38f71-600.webp',
          perks: ['Mobile friendly dashboard', 'Instant financial clarity', 'Future projection engine'],
        },
      ],
    },
  }[lang];

  return (
    <section id="services" className="py-20 lg:py-28 bg-slate-50 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Title and Button */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-slate-500 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
              <span>{t.tag}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
              {t.title}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600">
              {t.sub}
            </p>
          </div>

          <button
            onClick={() => onSelectService('AI Strategy')}
            className="self-start md:self-auto shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-xs sm:text-sm text-black bg-[#d2f829] hover:bg-[#beea21] shadow-sm hover:shadow transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
          >
            <span>{t.getStarted}</span>
            <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center text-white">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>

        {/* 3 Service Cards Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {t.services.map((service, index) => {
            const Icon = service.icon;
            const isHovered = activeCard === index;

            return (
              <div
                key={service.id}
                onMouseEnter={() => setActiveCard(index)}
                onMouseLeave={() => setActiveCard(null)}
                className={`bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm transition-all duration-300 flex flex-col justify-between ${
                  isHovered ? '-translate-y-2 shadow-xl border-slate-300' : ''
                }`}
              >
                <div>
                  {/* Top Icon Badge */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs ${service.iconBg}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                      {service.tag}
                    </span>
                  </div>

                  {/* Image showcase */}
                  <div className="mt-5 h-44 rounded-2xl overflow-hidden relative group">
                    <img loading="lazy" decoding="async"
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-80" />
                  </div>

                  {/* Title & Description */}
                  <h3 className="mt-5 text-xl sm:text-2xl font-bold text-slate-900">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    {service.desc}
                  </p>

                  {/* Perks list */}
                  <ul className="mt-4 space-y-2 pt-4 border-t border-slate-100">
                    {service.perks.map((perk, pIdx) => (
                      <li
                        key={pIdx}
                        className="flex items-center gap-2 text-xs font-medium text-slate-700"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Action */}
                <div className="mt-6 pt-2">
                  <button
                    onClick={() => onSelectService(service.title)}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200/90 text-slate-900 font-bold text-xs flex items-center justify-between transition-colors cursor-pointer group"
                  >
                    <span>{t.learnMore}</span>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
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
