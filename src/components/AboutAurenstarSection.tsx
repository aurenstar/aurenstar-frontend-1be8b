import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ScrollReveal } from './ScrollReveal';
import { CoverArt } from './CoverArt';

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
        ['01', 'PLATAFORMA', 'O que é a Aurenstar?', 'Um espaço acolhedor que reúne leituras, artigos e explicações para transformar a astrologia em orientações que você consegue usar no dia a dia, com clareza e respeito às suas escolhas.', 'platform'],
        ['02', 'MÉTODO', 'Como funciona', 'Você escolhe a experiência que combina com o seu momento, informa apenas o necessário e recebe uma leitura que transforma símbolos em reflexão prática.', 'method'],
        ['03', 'MISSÃO', 'Nossa missão', 'Ajudar você a se conhecer melhor e tomar decisões com mais calma, oferecendo clareza, acolhimento e direção sem dizer o que você deve fazer.', 'mission'],
        ['04', 'LINGUAGEM SIMPLES', 'Astrologia sem complicação', 'Explicamos a astrologia sem jargões, com textos diretos, exemplos próximos e espaço para você tirar suas próprias conclusões.', 'daily-guidance'],
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
        ['01', 'PLATFORM', 'What Aurenstar really offers', 'A welcoming space that brings readings, articles, and explanations together so astrology can become clear, practical guidance for your everyday life.', 'platform'],
        ['02', 'METHOD', 'From your sign to a useful reflection', 'Choose the experience that fits your moment, share only what is needed, and receive a reading that turns astrological symbols into practical reflection.', 'method'],
        ['03', 'MISSION', 'Astrology with clarity and care', 'Help people understand themselves and move forward with more calm, while respecting each person’s choices instead of telling them what to do.', 'mission'],
        ['04', 'SIMPLE LANGUAGE', 'Astrology without the jargon', 'We explain astrology with direct words, friendly examples, and context that makes each idea easier to understand from the first reading.', 'daily-guidance'],
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
        ['02', 'MÉTODO', 'Cómo funciona', 'Elige la experiencia que combina con tu momento, comparte solo lo necesario y recibe una lectura clara para reflexionar sobre tu día.', 'method'],
        ['03', 'MISIÓN', 'Nuestra misión', 'Ayudar a las personas a comprenderse mejor y avanzar con más calma, sin decirles qué deben hacer.', 'mission'],
        ['04', 'LENGUAJE SIMPLE', 'Astrología sin complicaciones', 'Explicamos la astrología con palabras claras, ejemplos cercanos y sin tecnicismos innecesarios.', 'daily-guidance'],
      ],
    },
  }[lang] || undefined;

  const t = copy || ({ } as any);

  return (
    <section id="about" className="w-full border-y border-[#B7D8F5] bg-[#C9E5FF] py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal distance={24} duration={700}>
          <div className="grid gap-6 md:grid-cols-[0.85fr_1.15fr] md:items-stretch md:gap-8">
            {/* Intro panel - same artwork language as the profile cover */}
            <div className="relative flex flex-col overflow-hidden rounded-[28px] bg-[#2878D0] p-7 text-white shadow-[0_14px_36px_rgba(23,54,111,0.18)] sm:p-9">
              <span className="pointer-events-none absolute inset-x-0 bottom-0 h-44 overflow-hidden"><CoverArt tone="blue" /></span>
              <p className="relative text-[11px] font-extrabold uppercase tracking-[0.24em] text-white/80">{t.eyebrow}</p>
              <h2 className="relative mt-3 text-3xl font-extrabold leading-[1.1] text-white sm:text-4xl">{t.title}</h2>
              <span aria-hidden className="relative mt-4 block h-1 w-12 rounded-full bg-[#F51B83]" />
              <p className="relative mt-4 text-[15px] leading-7 text-white/90">{t.intro}</p>
              <button type="button" onClick={() => onOpenCard?.('platform')} className="relative mt-7 inline-flex items-center self-start rounded-full bg-[#F51B83] px-6 py-3 text-sm font-bold text-white shadow-[0_8px_18px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:bg-[#D9166F] focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
                {t.button}<span className="ml-2" aria-hidden="true">→</span>
              </button>
              <span className="mt-auto block h-24" aria-hidden />
            </div>

            <div>
              <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-[#D9E8F8] bg-white px-4 py-2 shadow-sm">
                <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-[#F51B83]" />
                <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#2878D0]">{t.label}</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {t.items.map(([number, category, title, description, slug], index) => {
                  const pink = index === 1 || index === 2;
                  return (
                    <button
                      type="button"
                      key={slug}
                      onClick={() => onOpenCard?.(slug)}
                      style={{ backgroundColor: pink ? '#F51B83' : '#2878D0' }}
                      className="group relative flex min-h-[200px] flex-col overflow-hidden rounded-[20px] p-4 text-left shadow-[0_10px_24px_rgba(23,54,111,0.16)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(23,54,111,0.26)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      <span className="pointer-events-none absolute bottom-0 right-0 h-20 w-44 overflow-hidden"><CoverArt tone={pink ? 'pink' : 'blue'} /></span>
                      <span className="relative flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/85">{category}</span>
                        <span className="text-[10px] font-extrabold tracking-[0.2em] text-white/60">{number}</span>
                      </span>
                      <span className="relative mt-1.5 block text-[16px] font-extrabold leading-tight text-white">{title}</span>
                      <span className="relative mt-1.5 block text-[12px] leading-[1.15rem] text-white/90">{description}</span>
                      <span className="relative mt-auto inline-flex items-center gap-1.5 self-start rounded-full bg-white px-3.5 py-1 text-[11px] font-bold text-[#172B4D] shadow-[0_4px_10px_rgba(23,54,111,0.18)] transition-all duration-300 group-hover:gap-2.5">
                        {lang === 'en' ? 'Explore' : 'Explorar'} <span aria-hidden="true">→</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
