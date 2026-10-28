import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ScrollReveal } from './ScrollReveal';

interface AboutAurenstarSectionProps {
  onOpenCard?: (section: string) => void;
}

export const AboutAurenstarSection: React.FC<AboutAurenstarSectionProps> = ({ onOpenCard }) => {
  const { language } = useLanguage();
  const lang = (language || 'pt') as 'pt' | 'en' | 'es';

  const copy = {
    pt: {
      eyebrow: 'A AURENSTAR EM POUCAS PALAVRAS',
      title: 'Astrologia clara, acolhedora e útil.',
      intro: 'A Aurenstar transforma a astrologia em reflexões simples para a vida real. Cada experiência foi criada para ajudar você a fazer uma pausa, se compreender melhor e escolher o próximo passo com mais clareza.',
      button: 'Conheça mais sobre nós',
      label: 'O QUE VOCÊ ENCONTRA AQUI',
      lead: 'Quatro formas simples de usar a astrologia como apoio para o seu dia.',
      items: [
        ['01', 'PLATAFORMA', 'O que é a Aurenstar?', 'Um espaço acolhedor para receber orientações do seu signo e levar mais intenção para o dia.', 'platform'],
        ['02', 'MÉTODO', 'Como funciona', 'Você escolhe a experiência que combina com o momento e recebe uma leitura feita para você.', 'method'],
        ['03', 'MISSÃO', 'Nossa missão', 'Ajudar pessoas a se conectarem com seus sentimentos com mais clareza, calma e direção.', 'mission'],
        ['04', 'LINGUAGEM SIMPLES', 'Tudo em palavras simples', 'Explicamos a astrologia sem complicar, com textos próximos, diretos e fáceis de entender.', 'daily-guidance'],
      ],
    },
    en: {
      eyebrow: 'AURENSTAR IN A FEW WORDS',
      title: 'Astrology made clear, gentle, and useful.',
      intro: 'Aurenstar turns astrology into simple reflections for real life. Each experience helps you pause, understand yourself, and choose your next step with more clarity.',
      button: 'Learn more about us',
      label: 'WHAT YOU FIND HERE',
      lead: 'Four simple ways to use astrology as support for your day.',
      items: [
        ['01', 'PLATFORM', 'What is Aurenstar?', 'A welcoming space for sign-based guidance that brings more intention to your day.', 'platform'],
        ['02', 'METHOD', 'How it works', 'Choose the experience that fits your moment and receive a reading made for you.', 'method'],
        ['03', 'MISSION', 'Our mission', 'Help people connect with their feelings through more clarity, calm, and direction.', 'mission'],
        ['04', 'SIMPLE LANGUAGE', 'Everything in simple words', 'Astrology explained without the complicated parts, in clear and friendly language.', 'daily-guidance'],
      ],
    },
    es: {
      eyebrow: 'AURENSTAR EN POCAS PALABRAS',
      title: 'Astrología clara, cercana y útil.',
      intro: 'Aurenstar convierte la astrología en reflexiones sencillas para la vida real. Cada experiencia te ayuda a hacer una pausa, entenderte mejor y elegir tu próximo paso.',
      button: 'Conoce más sobre nosotros',
      label: 'LO QUE ENCUENTRAS AQUÍ',
      lead: 'Cuatro formas sencillas de usar la astrología como apoyo para tu día.',
      items: [
        ['01', 'PLATAFORMA', '¿Qué es Aurenstar?', 'Un espacio acogedor para recibir orientación de tu signo y vivir el día con más intención.', 'platform'],
        ['02', 'MÉTODO', 'Cómo funciona', 'Elige la experiencia que combina con tu momento y recibe una lectura hecha para ti.', 'method'],
        ['03', 'MISIÓN', 'Nuestra misión', 'Ayudar a las personas a conectar con sus sentimientos con claridad, calma y dirección.', 'mission'],
        ['04', 'LENGUAJE SIMPLE', 'Todo en palabras simples', 'Astrología explicada de forma clara, cercana y fácil de entender.', 'daily-guidance'],
      ],
    },
  }[lang] || undefined;

  const t = copy || ({ } as any);

  return (
    <section id="about" className="w-full border-y border-[#B7D8F5] bg-[#C9E5FF] py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal distance={24} duration={700}>
          <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-center md:gap-16">
            <div className="max-w-xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[#2878D0]">{t.eyebrow}</p>
              <h2 className="mt-4 text-4xl font-extrabold leading-[1.08] text-[#172B4D] sm:text-5xl">{t.title}</h2>
              <p className="mt-6 text-base leading-8 text-[#5575A4]">{t.intro}</p>
              <button type="button" onClick={() => onOpenCard?.('platform')} className="mt-8 inline-flex items-center rounded-full bg-[#F51B83] px-6 py-3 text-sm font-bold text-white shadow-[0_8px_18px_rgba(245,27,131,0.2)] transition hover:-translate-y-0.5 hover:bg-[#D91470] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2878D0] focus-visible:ring-offset-2">
                {t.button}<span className="ml-2" aria-hidden="true">→</span>
              </button>
            </div>

            <div>
              <div className="mb-5 border-l-2 border-[#F51B83] pl-4">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#2878D0]">{t.label}</p>
                <p className="mt-2 max-w-lg text-sm leading-6 text-[#647DA5]">{t.lead}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {t.items.map(([number, category, title, description, slug]) => (
                  <button type="button" key={slug} onClick={() => onOpenCard?.(slug)} className="group relative flex min-h-[190px] flex-col items-start rounded-2xl border border-[#A9CEF1] bg-white/60 p-5 text-left transition duration-300 hover:-translate-y-1 hover:border-[#F51B83] hover:bg-white hover:shadow-[0_14px_28px_rgba(23,54,111,0.12)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2878D0]">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF0F7] text-sm font-extrabold text-[#F51B83] transition group-hover:bg-[#F51B83] group-hover:text-white">{number}</span>
                    <span className="mt-4 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#2878D0]">{category}</span>
                    <span className="mt-2 text-lg font-extrabold leading-tight text-[#172B4D]">{title}</span>
                    <span className="mt-2 text-sm leading-6 text-[#647DA5]">{description}</span>
                    <span className="absolute right-5 top-5 text-xl text-[#9DB9D9] transition group-hover:translate-x-1 group-hover:text-[#F51B83]" aria-hidden="true">↗</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
