import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ScrollReveal } from './ScrollReveal';

interface FaqItem {
  question: {
    pt: string;
    en: string;
    es: string;
  };
  answer: {
    pt: string;
    en: string;
    es: string;
  };
}

const FAQS: FaqItem[] = [
  {
    question: {
      pt: 'Como a tecnologia e inteligência auxiliam na análise dos astros?',
      en: 'How do smart technology and algorithms assist in celestial analysis?',
      es: '¿Cómo asisten la tecnología y la inteligencia en el análisis celeste?',
    },
    answer: {
      pt: 'Utilizamos cálculos astronômicos precisos combinados com inteligência para organizar as tendências de cada signo em palavras simples e mensagens acolhedoras, sem termos técnicos complicados.',
      en: 'We combine precise celestial coordinates with smart algorithms to translate daily cosmic trends into simple, comforting words and actionable guidance.',
      es: 'Combinamos cálculos astronómicos con inteligencia para traducir las tendencias de cada signo en palabras sencillas y consejos reconfortantes.',
    },
  },
  {
    question: {
      pt: 'Como posso aplicar os conselhos e estratégias no meu dia a dia?',
      en: 'How can I apply these strategies and daily guidance to my routine?',
      es: '¿Cómo puedo aplicar estos consejos y estrategias en mi día a día?',
    },
    answer: {
      pt: 'Cada mensagem traz uma reflexão matinal prática, uma cor de equilíbrio e um número de foco. Você pode usar esses pequenos lembretes para manter a calma em decisões de trabalho e relacionamentos.',
      en: 'Every daily reading features a practical morning reflection, a grounding color, and a focus number to help you navigate work decisions and relationships with calm confidence.',
      es: 'Cada lectura ofrece una reflexión matutina práctica, un color de equilibrio y un número de enfoque para guiar tus decisiones cotidianas con serenidad.',
    },
  },
  {
    question: {
      pt: 'Preciso entender de astrologia técnica para usar a Aurenstar?',
      en: 'Do I need technical astrology knowledge to use Aurenstar?',
      es: '¿Necesito conocimientos técnicos de astrología para usar Aurenstar?',
    },
    answer: {
      pt: 'Não! Nosso compromisso é transformar toda a sabedoria dos astros em uma experiência agradável, leve e fácil de entender para qualquer pessoa.',
      en: 'Not at all! Our promise is to deliver all celestial wisdom in clear, uplifting, and straightforward words that anyone can immediately enjoy.',
      es: '¡Para nada! Nuestro compromiso es transformar la sabiduría celeste en una experiencia agradable, clara y accesible para todos.',
    },
  },
  {
    question: {
      pt: 'Com que frequência as leituras e artigos são atualizados?',
      en: 'How frequently are readings and blog articles updated?',
      es: '¿Con qué frecuencia se actualizan las lecturas y artículos?',
    },
    answer: {
      pt: 'A mensagem diária e a carta do zodíaco são renovadas a cada 24 horas. Nossos artigos e guias de bem-estar são publicados semanalmente para enriquecer sua jornada.',
      en: 'Daily messages and zodiac cards refresh every 24 hours. Our wellness guides and celestial articles are published weekly to enrich your journey.',
      es: 'El mensaje diario y la carta del zodíaco se renuevan cada 24 horas. Nuestros artículos y guías se publican semanalmente.',
    },
  },
  {
    question: {
      pt: 'Como funciona o leitor de artigos do blog?',
      en: 'How does the blog article reader work?',
      es: '¿Cómo funciona el lector de artículos del blog?',
    },
    answer: {
      pt: 'Basta clicar no card de qualquer artigo para abrir uma tela de leitura limpa e agradável, com barra de progresso, botão para compartilhar e pontos de reflexão.',
      en: 'Simply click on any story card to open a full reading view equipped with a progress tracker, one-click sharing, and key takeaways.',
      es: 'Basta con hacer clic en cualquier artículo para abrir una lectura limpia y agradable, con barra de progreso y puntos clave.',
    },
  },
];

export const FaqSection: React.FC = () => {
  const { language } = useLanguage();
  const lang = (language || 'pt') as 'pt' | 'en' | 'es';
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const titles = {
    pt: {
      badge: 'DÚVIDAS FREQUENTES',
      heading: 'Perguntas Comuns sobre o Aurenstar',
      subheading:
        'Respostas claras e sem complicações sobre como funcionam nossas orientações e análises diárias.',
    },
    en: {
      badge: 'FREQUENT QUESTIONS',
      heading: 'Common Questions about Aurenstar',
      subheading:
        'Clear, straightforward answers about how our celestial insights and daily strategies work.',
    },
    es: {
      badge: 'PREGUNTAS FRECUENTES',
      heading: 'Preguntas Frecuentes sobre Aurenstar',
      subheading:
        'Respuestas claras y sin complicaciones sobre el funcionamiento de nuestras guías y lecturas.',
    },
  };

  const t = titles[lang] || titles.pt;

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="w-full bg-[#C9E5FF] border-b border-[#D9E8F8] py-14 sm:py-16 select-none">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header com fade-in e slide-up */}
        <ScrollReveal delay={0} distance={20} duration={750}>
          <div className="text-center mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E4F1FF] border border-[#3982C8]/30 text-[#3982C8] text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-3">
              <HelpCircle className="w-3.5 h-3.5 text-[#3982C8]" />
              <span>{t.badge}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172B4D] tracking-tight mb-3">
              {t.heading}
            </h2>
            <p className="text-xs sm:text-sm text-[#647DA5] max-w-xl mx-auto leading-relaxed font-medium">
              {t.subheading}
            </p>
          </div>
        </ScrollReveal>

        {/* Accordion List com animação de fade-in e slide-up escalonado */}
        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <ScrollReveal
                key={`faq-${index}`}
                delay={index * 60}
                distance={20}
                duration={700}
              >
                <div
                  className={`bg-[#FFFFFF] border rounded-2xl overflow-hidden transition-all duration-200 shadow-2xs ${
                    isOpen
                      ? 'border-[#3982C8] shadow-sm'
                      : 'border-[#D9E8F8] hover:border-[#3982C8]/40'
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4 text-left cursor-pointer focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 transition-colors ${
                          isOpen ? 'bg-[#3982C8]' : 'bg-[#D9E8F8]'
                        }`}
                      />
                      <span className="font-bold text-xs sm:text-sm text-[#172B4D]">
                        {faq.question[lang] || faq.question.pt}
                      </span>
                    </div>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen
                          ? 'bg-[#E4F1FF] text-[#3982C8] rotate-180'
                          : 'bg-[#E4F1FF] text-[#647DA5]'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-[#647DA5] leading-relaxed border-t border-[#D9E8F8] animate-fadeIn">
                      <p>{faq.answer[lang] || faq.answer.pt}</p>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
