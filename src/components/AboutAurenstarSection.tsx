import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ScrollReveal } from './ScrollReveal';

interface AboutAurenstarSectionProps {
  onOpenCard?: (section: string) => void;
}

// One soft gradient and one glossy illustration per card (public/assets/about/).
const CARD_GRADIENTS = [
  'linear-gradient(180deg, #5B8FDB 0%, #8FB4EA 55%, #CFE0F7 100%)',
  'linear-gradient(180deg, #E0711A 0%, #F59E4C 55%, #FCD3A6 100%)',
  'linear-gradient(180deg, #E5499A 0%, #F58CC0 55%, #FFC2DF 100%)',
  'linear-gradient(180deg, #6D4ED9 0%, #9B86EE 55%, #CFC3F8 100%)',
];
const CARD_IMAGES = [
  '/assets/about/about-platform.svg',
  '/assets/about/about-method.svg',
  '/assets/about/about-mission.svg',
  '/assets/about/about-language.svg',
];

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
              <div className="grid gap-4 sm:grid-cols-2">
                {t.items.map(([, category, title, description, slug], index) => (
                  <button
                    type="button"
                    key={slug}
                    onClick={() => onOpenCard?.(slug)}
                    style={{ backgroundImage: CARD_GRADIENTS[index] }}
                    className="group relative flex min-h-[170px] flex-col overflow-hidden rounded-[18px] p-3.5 text-left shadow-[0_14px_30px_rgba(23,54,111,0.16)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_26px_46px_rgba(23,54,111,0.26)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F51B83] focus-visible:ring-offset-2"
                  >
                    {/* soft glass highlight */}
                    <span aria-hidden="true" className="pointer-events-none absolute -left-10 -top-16 h-44 w-64 rotate-[-12deg] rounded-full bg-white/20 blur-2xl" />
                    <span className="relative text-[11px] font-extrabold uppercase tracking-[0.16em] text-white/80">{category}</span>
                    <span className="relative mt-1 block text-[15px] font-bold leading-[1.15] text-white">{title}</span>
                    <span className="relative mt-1 block text-[11.5px] leading-[1rem] text-white/85">{description}</span>
                    <span className="relative mt-auto flex flex-1 items-center justify-center py-1">
                      <img src={CARD_IMAGES[index]} alt="" width={400} height={220} loading="lazy" style={{ width: 110, maxWidth: 110 }} className="transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-1" />
                    </span>
                    <span className="relative flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-1 text-[11.5px] font-bold text-[#172B4D] shadow-[0_6px_14px_rgba(23,54,111,0.12)] transition group-hover:bg-[#FFF0F7] group-hover:text-[#F51B83]">
                      {lang === 'en' ? 'Explore' : 'Explorar'} <span aria-hidden="true">→</span>
                    </span>
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
