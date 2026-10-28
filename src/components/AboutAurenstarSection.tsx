// About panel
import React from 'react';
import { Sun, Star, Compass } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ScrollReveal } from './ScrollReveal';

// Official Aurenstar brand avatar SVG with design system gradient and celestial star
const AURENSTAR_AVATAR = '/aurenstar-avatar.png';

interface AboutAurenstarSectionProps {
  onOpenCard?: (section: string) => void;
}

export const AboutAurenstarSection: React.FC<AboutAurenstarSectionProps> = ({ onOpenCard }) => {
  const { language } = useLanguage();
  const lang = (language || 'pt') as 'pt' | 'en' | 'es';

  const content = {
    en: {
      title: 'ABOUT AURENSTAR',
      subtitle: 'A simple, welcoming space to understand astrology and use it in everyday life.',
      item1: {
        category: 'PLATFORM',
        categoryColor: 'bg-[#2878D0] text-white',
        title: 'What is Aurenstar?',
        p1: 'A dedicated space designed to deliver your personalized ',
        bold: 'daily zodiac message',
        p2: ', bridging ancient celestial wisdom with thoughtful daily guidance.',
        footerRole: 'Astrology',
      },
      item2: {
        category: 'METHOD',
        categoryColor: 'bg-[#17366F] text-white',
        title: 'How It Works',
        p1: 'Select your star sign above. Our approach translates cosmic rhythms into ',
        bold: "today's star sign guidance",
        p2: ' carefully tailored for you.',
        footerRole: 'Insights',
      },
      item3: {
        category: 'MISSION',
        categoryColor: 'bg-[#F51B83] text-white',
        title: 'Our Mission',
        p1: 'Helping people connect with their inner cosmos through clarity, comfort, and direction with a ',
        bold: 'sun sign daily message',
        p2: '.',
        footerRole: 'Purpose',
      },
      item4: {
        category: 'DAILY GUIDANCE',
        categoryColor: 'bg-[#2878D0] text-white',
        title: 'Daily Guidance',
        p1: 'Reading your ',
        bold: 'daily horoscope quote',
        p2: ' aligns your energy and brings peace, helping you navigate every day with clear intention.',
        footerRole: 'Reflection',
      },
    },
    pt: {
      title: 'SOBRE A AURENSTAR',
      subtitle: 'Um espaço simples e acolhedor para entender a astrologia e usá-la no dia a dia.',
      item1: {
        category: 'PLATAFORMA',
        categoryColor: 'bg-[#2878D0] text-white',
        title: 'O que é a Aurenstar?',
        p1: 'Um espaço acolhedor feito para entregar a sua ',
        bold: 'mensagem diária do signo',
        p2: ', unindo a sabedoria das estrelas com orientações gentis para o seu dia.',
        footerRole: 'Astrologia',
      },
      item2: {
        category: 'COMO FUNCIONA',
        categoryColor: 'bg-[#17366F] text-white',
        title: 'Como Funciona',
        p1: 'Basta escolher o seu signo acima. Traduzimos os ritmos cósmicos em ',
        bold: 'orientações do seu signo para hoje',
        p2: ' sob medida para você.',
        footerRole: 'Orientação',
      },
      item3: {
        category: 'NOSSA MISSÃO',
        categoryColor: 'bg-[#F51B83] text-white',
        title: 'Nossa Missão',
        p1: 'Ajudar você a se conectar com sua paz interior através de conforto e clareza com uma ',
        bold: 'mensagem diária do seu signo',
        p2: '.',
        footerRole: 'Propósito',
      },
      item4: {
        category: 'GUIA DIÁRIO',
        categoryColor: 'bg-[#2878D0] text-white',
        title: 'Orientação Diária',
        p1: 'Ler o seu ',
        bold: 'conselho do horóscopo do dia',
        p2: ' alinha sua energia e traz serenidade para viver cada momento com tranquilidade.',
        footerRole: 'Reflexão',
      },
    },
    es: {
      title: 'SOBRE AURENSTAR',
      subtitle: 'Un espacio sencillo y acogedor para entender la astrología y llevarla a tu día a día.',
      item1: {
        category: 'PLATAFORMA',
        categoryColor: 'bg-[#2878D0] text-white',
        title: '¿Qué es Aurenstar?',
        p1: 'Una plataforma dedicada a brindarte tu ',
        bold: 'mensaje diario del zodíaco',
        p2: ', uniendo la sabiduría de las estrellas con serenidad y guía para ti.',
        footerRole: 'Astrología',
      },
      item2: {
        category: 'CÓMO FUNCIONA',
        categoryColor: 'bg-[#17366F] text-white',
        title: 'Cómo Funciona',
        p1: 'Selecciona tu signo arriba. Traducimos los ritmos cósmicos en ',
        bold: 'orientaciones de tu signo para hoy',
        p2: ' pensadas para ti.',
        footerRole: 'Orientación',
      },
      item3: {
        category: 'NUESTRA MISIÓN',
        categoryColor: 'bg-[#F51B83] text-white',
        title: 'Nuestra Misión',
        p1: 'Ayudarte a conectar con tu armonía interior con consuelo y claridad a través de un ',
        bold: 'mensaje diario de tu signo',
        p2: '.',
        footerRole: 'Propósito',
      },
      item4: {
        category: 'GUÍA DIARIA',
        categoryColor: 'bg-[#2878D0] text-white',
        title: 'Orientación Diaria',
        p1: 'Leer tu ',
        bold: 'frase astrológica diaria',
        p2: ' alinea tu energía y te ayuda a vivir el día con serenidad e intención.',
        footerRole: 'Reflexión',
      },
    },
  };

  const t = content[lang] || content.en;

  const intro = {
    en: {
      eyebrow: 'AURENSTAR IN A FEW WORDS',
      title: 'Astrology made clear, gentle, and useful.',
      text: 'Aurenstar turns astrology into simple reflections for everyday life. Each experience has a different purpose, but all of them are designed to help you pause, understand yourself, and choose your next step with more clarity.',
      link: 'Learn more about us',
    },
    pt: {
      eyebrow: 'A AURENSTAR EM POUCAS PALAVRAS',
      title: 'Astrologia clara, acolhedora e útil.',
      text: 'A Aurenstar transforma a astrologia em reflexões simples para a vida real. Cada experiência tem um propósito diferente, mas todas ajudam você a fazer uma pausa, se compreender melhor e escolher o próximo passo com mais clareza.',
      link: 'Conheça mais sobre nós',
    },
    es: {
      eyebrow: 'AURENSTAR EN POCAS PALABRAS',
      title: 'Astrología clara, cercana y útil.',
      text: 'Aurenstar convierte la astrología en reflexiones sencillas para la vida real. Cada experiencia tiene un propósito diferente, pero todas te ayudan a hacer una pausa, entenderte mejor y elegir tu próximo paso con más claridad.',
      link: 'Conoce más sobre nosotros',
    },
  }[lang] || {
    eyebrow: 'AURENSTAR',
    title: 'Astrology made clear.',
    text: 'Simple reflections for everyday life.',
    link: 'Learn more',
  };

  const items = [
    {
      id: 'about-1',
      slug: 'platform',
      icon: Sun,
      image:
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      data: t.item1,
    },
    {
      id: 'about-2',
      slug: 'method',
      icon: Star,
      image:
        'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
      data: t.item2,
    },
    {
      id: 'about-3',
      slug: 'mission',
      icon: Compass,
      image:
        'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
      data: t.item3,
    },
    {
      id: 'about-4',
      slug: 'daily-guidance',
      icon: Sun,
      image:
        'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=800&q=80',
      data: t.item4,
    },
  ];

  return (
    <section id="about" className="w-full border-y border-[#B8D8F5] bg-[#C9E5FF] py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal distance={20} duration={700}>
          <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center md:gap-16">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#2878D0]">{intro.eyebrow}</p>
              <h2 className="mt-4 max-w-xl text-3xl font-extrabold leading-[1.12] text-[#172B4D] sm:text-5xl">{intro.title}</h2>
              <p className="mt-6 max-w-xl text-base leading-8 text-[#5575A4]">{intro.text}</p>
              <button type="button" onClick={() => onOpenCard?.('platform')} className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#F51B83] px-6 py-3 text-sm font-bold text-white shadow-[0_8px_18px_rgba(245,27,131,0.22)] transition-all hover:-translate-y-0.5 hover:bg-[#D91470] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2878D0] focus-visible:ring-offset-2">
                {intro.link}<span aria-hidden="true">→</span>
              </button>
            </div>
            <div>
              <div className="mb-5">
                <p className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#2878D0]"><span className="h-2.5 w-2.5 rounded-full bg-[#F51B83]" />{lang === 'pt' ? 'O QUE VOCÊ ENCONTRA AQUI' : lang === 'es' ? 'LO QUE ENCUENTRAS AQUÍ' : 'WHAT YOU FIND HERE'}</p>
                <p className="mt-2 max-w-md text-sm leading-6 text-[#647DA5]">{t.subtitle}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {items.slice(0, 3).map((item, index) => (
                  <article key={item.id} onClick={() => onOpenCard?.(item.slug)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onOpenCard?.(item.slug); }} role={onOpenCard ? 'link' : undefined} tabIndex={onOpenCard ? 0 : undefined} className="group relative flex min-h-[250px] cursor-pointer flex-col rounded-2xl border border-[#B8D8F5] border-t-4 border-t-[#2878D0] bg-white p-5 shadow-[0_8px_20px_rgba(23,54,111,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#F51B83]/70 hover:border-t-[#F51B83] hover:shadow-[0_16px_30px_rgba(23,54,111,0.14)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2878D0]">
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0F7] text-base font-extrabold text-[#F51B83] transition-colors group-hover:bg-[#F51B83] group-hover:text-white">{index + 1}</div>
                      <span className="text-xl text-[#9AB2D4] transition-all group-hover:translate-x-1 group-hover:text-[#F51B83]" aria-hidden="true">↗</span>
                    </div>
                    <span className="mt-5 inline-flex w-fit rounded-full bg-[#E4F1FF] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#2878D0] group-hover:bg-[#F51B83] group-hover:text-white">{item.data.category}</span>
                    <h3 className="mt-3 text-lg font-extrabold leading-tight text-[#172B4D] transition-colors group-hover:text-[#2878D0]">{item.data.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-[#647DA5]">{item.data.p1}{item.data.bold}{item.data.p2}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
