import React from 'react';
import { Check, FileText, BookOpen, Wrench } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ScrollReveal } from './ScrollReveal';
import { CoverArt } from './CoverArt';
import { SocialIcon } from './SocialIcon';
import { SOCIAL_LINKS } from '../data/socialLinks';
import { BLOG_ARTICLES } from '../data/blogArticles';
import { ASTROLOGY_DICTIONARY_TERMS } from '../data/astrologyDictionaryData';

interface AboutAurenstarSectionProps {
  onOpenCard?: (section?: string) => void;
}

// Home teaser of the /about profile page: same cover artwork, same stats, one clear way in.
export const AboutAurenstarSection: React.FC<AboutAurenstarSectionProps> = ({ onOpenCard }) => {
  const { language } = useLanguage();
  const lang = (language || 'en') as 'pt' | 'en' | 'es';

  const copy = {
    pt: {
      eyebrow: 'A AURENSTAR EM POUCAS PALAVRAS',
      title: 'Astrologia clara, acolhedora e útil.',
      intro: 'A Aurenstar transforma a astrologia em reflexões simples para a vida real. Cada experiência foi criada para ajudar você a fazer uma pausa, se compreender melhor e escolher o próximo passo com mais clareza.',
      button: 'Ver o perfil da Aurenstar',
      verified: 'Perfil verificado',
      stats: ['ferramentas', 'artigos', 'termos no dicionário'],
    },
    en: {
      eyebrow: 'AURENSTAR IN A FEW WORDS',
      title: 'Astrology made clear, gentle, and useful.',
      intro: 'Aurenstar turns astrology into simple reflections for real life. Each experience helps you pause, understand yourself, and choose your next step with more clarity.',
      button: 'See the Aurenstar profile',
      verified: 'Verified profile',
      stats: ['tools', 'articles', 'dictionary terms'],
    },
    es: {
      eyebrow: 'AURENSTAR EN POCAS PALABRAS',
      title: 'Astrología clara, cercana y útil.',
      intro: 'Aurenstar convierte la astrología en reflexiones sencillas para la vida real. Cada experiencia te ayuda a hacer una pausa, entenderte mejor y elegir tu próximo paso.',
      button: 'Ver el perfil de Aurenstar',
      verified: 'Perfil verificado',
      stats: ['herramientas', 'artículos', 'términos en el diccionario'],
    },
  }[lang];

  const stats = [
    { icon: Wrench, value: '5', label: copy.stats[0], color: '#2878D0' },
    { icon: FileText, value: String(BLOG_ARTICLES.length), label: copy.stats[1], color: '#F51B83' },
    { icon: BookOpen, value: String(ASTROLOGY_DICTIONARY_TERMS.length), label: copy.stats[2], color: '#2878D0' },
  ];

  return (
    <section id="about" className="w-full border-y border-[#B7D8F5] bg-[#C9E5FF] py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <ScrollReveal distance={24} duration={700}>
          <p className="mb-4 text-center text-xs font-extrabold uppercase tracking-[0.24em] text-[#2878D0]">{copy.eyebrow}</p>
          <div className="rounded-[2rem] border border-[#D9E8F8] bg-white p-3 shadow-[0_14px_40px_rgba(23,54,111,0.12)] sm:p-4">
            {/* Cover + avatar: the same look as the profile page */}
            <div className="relative">
              <div className="relative h-32 overflow-hidden rounded-3xl bg-[#2878D0] sm:h-44" aria-hidden><CoverArt tone="blue" /></div>
              <img src="/aurenstar-avatar.png" alt="Aurenstar" width={96} height={96} className="absolute -bottom-9 left-4 h-20 w-20 rounded-2xl border-4 border-white bg-white object-cover shadow-md sm:left-6 sm:h-24 sm:w-24" />
            </div>

            <div className="mt-12 grid gap-6 px-2 pb-3 sm:px-4 md:grid-cols-[1.25fr_1fr] md:items-center md:gap-10">
              <div>
                <div className="flex items-center gap-2 text-2xl font-extrabold text-[#172B4D]">
                  <span translate="no" className="notranslate">Aurenstar</span>
                  <span aria-label={copy.verified} title={copy.verified} className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#2878D0] text-white"><Check className="h-3.5 w-3.5" strokeWidth={3} /></span>
                </div>
                <p className="text-sm text-[#647DA5]">@aurenstar · aurenstar.com</p>
                <h2 className="mt-4 text-2xl font-extrabold leading-tight text-[#172B4D] sm:text-3xl">{copy.title}</h2>
                <p className="mt-3 text-[15px] leading-7 text-[#5575A4]">{copy.intro}</p>
                <div className="mt-5 flex flex-wrap items-center gap-4">
                  <button type="button" onClick={() => onOpenCard?.()} className="inline-flex items-center rounded-full bg-[#F51B83] px-6 py-3 text-sm font-bold text-white shadow-[0_8px_18px_rgba(245,27,131,0.25)] transition hover:-translate-y-0.5 hover:bg-[#D9166F] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F51B83]">
                    {copy.button}<span className="ml-2" aria-hidden="true">→</span>
                  </button>
                  <div className="flex items-center gap-2">
                    {SOCIAL_LINKS.map((n) => (
                      <a key={n.key} href={n.url} target="_blank" rel="noopener noreferrer" aria-label={n.label} title={n.label} className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D9E8F8] bg-[#F4F9FF] text-[#647DA5] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#2878D0] hover:bg-[#2878D0] hover:text-white">
                        <SocialIcon name={n.key} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {stats.map(({ icon: Icon, value, label, color }) => (
                  <button key={label} type="button" onClick={() => onOpenCard?.()} className="group flex flex-col items-center rounded-2xl border border-[#D9E8F8] bg-white px-2 py-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(23,54,111,0.14)]">
                    <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110" style={{ background: color }}><Icon className="h-5 w-5" /></span>
                    <span className="text-3xl font-extrabold leading-none text-[#172B4D]">{value}</span>
                    <span className="mt-1.5 text-[11px] font-semibold leading-tight text-[#647DA5]">{label}</span>
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
