import React from 'react';
import { ArrowLeft, ExternalLink, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface CreditsPageProps {
  onBackToHome: () => void;
  onNavigateToBlog: () => void;
}

type L3 = { en: string; pt: string; es: string };
const TOOLS: { name: string; by: string; what: L3; license: L3; link: string; linkLabel: string; extra?: { label: L3; url: string } }[] = [
  {
    name: 'Swiss Ephemeris',
    by: 'Astrodienst AG',
    what: {
      en: 'Calculates the exact positions of the Sun, Moon, planets and the rising sign (ascendant) used by our tools.',
      pt: 'Calcula as posições exatas do Sol, da Lua, dos planetas e do ascendente usadas pelas nossas ferramentas.',
      es: 'Calcula las posiciones exactas del Sol, la Luna, los planetas y el ascendente que usan nuestras herramientas.',
    },
    license: { en: 'GNU AGPL-3.0', pt: 'GNU AGPL-3.0', es: 'GNU AGPL-3.0' },
    link: 'https://www.astro.com/swisseph/',
    linkLabel: 'astro.com/swisseph',
    extra: {
      label: { en: 'Source code of our calculation service', pt: 'Código aberto do nosso serviço de cálculo', es: 'Código abierto de nuestro servicio de cálculo' },
      url: 'https://github.com/aurenstar/aurenstar-engine',
    },
  },
  {
    name: 'NASA JPL Development Ephemeris (DE431)',
    by: 'NASA Jet Propulsion Laboratory',
    what: {
      en: 'The planetary data that Swiss Ephemeris is built from. NASA/JPL publishes it for free, and it is the same kind of data used to track real spacecraft.',
      pt: 'Os dados dos planetas que servem de base para o Swiss Ephemeris. A NASA/JPL os publica gratuitamente, e é o mesmo tipo de dado usado para acompanhar naves espaciais reais.',
      es: 'Los datos de los planetas en los que se basa Swiss Ephemeris. La NASA/JPL los publica gratis, y es el mismo tipo de datos que se usa para seguir naves espaciales reales.',
    },
    license: { en: 'Public data from a U.S. Government laboratory', pt: 'Dados públicos de um laboratório do governo dos EUA', es: 'Datos públicos de un laboratorio del gobierno de EE. UU.' },
    link: 'https://ssd.jpl.nasa.gov/planets/eph_export.html',
    linkLabel: 'ssd.jpl.nasa.gov',
  },
  {
    name: 'IANA Time Zone Database',
    by: 'IANA',
    what: {
      en: 'Gives the real clock time and daylight-saving rules of each place and year, so your birth time is converted correctly.',
      pt: 'Informa o horário real e as regras de horário de verão de cada lugar e ano, para converter corretamente a sua hora de nascimento.',
      es: 'Da la hora real y las reglas de horario de verano de cada lugar y año, para convertir correctamente tu hora de nacimiento.',
    },
    license: { en: 'Public domain', pt: 'Domínio público', es: 'Dominio público' },
    link: 'https://www.iana.org/time-zones',
    linkLabel: 'iana.org/time-zones',
  },
  {
    name: 'GeoNames',
    by: 'GeoNames.org',
    what: {
      en: 'Provides the list of cities, their coordinates and time zones for the city search.',
      pt: 'Fornece a lista de cidades, as coordenadas e os fusos horários usados na busca de cidades.',
      es: 'Proporciona la lista de ciudades, sus coordenadas y zonas horarias para la búsqueda de ciudades.',
    },
    license: { en: 'Creative Commons Attribution 4.0 (CC BY 4.0)', pt: 'Creative Commons Atribuição 4.0 (CC BY 4.0)', es: 'Creative Commons Atribución 4.0 (CC BY 4.0)' },
    link: 'https://www.geonames.org/',
    linkLabel: 'geonames.org',
  },
];

const COPY: Record<'en' | 'pt' | 'es', { back: string; blog: string; tag: string; title: string; intro: string; by: string; license: string }> = {
  en: { back: 'Back to Home', blog: 'Explore Blog Posts →', tag: 'Transparency', title: 'Tools & Credits', intro: 'Our astrology tools are built on trusted scientific tools and open data. Here is what we use and who made it.', by: 'by', license: 'License: ' },
  pt: { back: 'Voltar ao Início', blog: 'Ver Artigos do Blog →', tag: 'Transparência', title: 'Ferramentas e Créditos', intro: 'Nossas ferramentas de astrologia usam ferramentas científicas confiáveis e dados abertos. Veja o que usamos e quem criou.', by: 'por', license: 'Licença: ' },
  es: { back: 'Volver al Inicio', blog: 'Ver Artículos del Blog →', tag: 'Transparencia', title: 'Herramientas y Créditos', intro: 'Nuestras herramientas de astrología usan herramientas científicas confiables y datos abiertos. Mira qué usamos y quién lo creó.', by: 'por', license: 'Licencia: ' },
};

export const CreditsPage: React.FC<CreditsPageProps> = ({ onBackToHome, onNavigateToBlog }) => {
  const { language } = useLanguage();
  const lang = (language || 'en') as 'en' | 'pt' | 'es';
  const c = COPY[lang];
  return (
  <div className="w-full bg-[#C9E5FF] min-h-screen pt-24 sm:pt-28 pb-20 text-[#172B4D]">
    <div className="max-w-2xl mx-auto px-4 sm:px-6">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#D9E8F8]">
        <button
          type="button"
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#647DA5] hover:text-[#172B4D] transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>{c.back}</span>
        </button>
        <button
          type="button"
          onClick={onNavigateToBlog}
          className="text-xs sm:text-sm font-bold text-[#3982C8] hover:text-[#17366F] transition-colors cursor-pointer"
        >
          {c.blog}
        </button>
      </div>

      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E4F1FF] border border-[#D9E8F8] text-[#3982C8] text-xs font-bold uppercase tracking-wider mb-3 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{c.tag}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 leading-tight">{c.title}</h1>
        <p className="text-sm sm:text-base text-[#647DA5] leading-relaxed max-w-lg mx-auto">
          {c.intro}
        </p>
      </div>

      <div className="space-y-5">
        {TOOLS.map((tool) => (
          <section
            key={tool.name}
            className="bg-white rounded-3xl border border-[#D9E8F8] shadow-md p-6 sm:p-7 relative"
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#3982C8] rounded-t-3xl" />
            <h2 className="text-lg font-extrabold">{tool.name}</h2>
            <p className="text-xs font-bold uppercase tracking-wider text-[#647DA5] mt-0.5">{c.by} {tool.by}</p>
            <p className="text-sm text-[#647DA5] leading-relaxed mt-3">{tool.what[lang]}</p>
            <p className="text-sm mt-3">
              <span className="font-bold text-[#17366F]">{c.license}</span>
              <span className="text-[#647DA5]">{tool.license[lang]}</span>
            </p>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold">
              <a
                href={tool.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[#3982C8] hover:text-[#17366F] transition-colors"
              >
                {tool.linkLabel}
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              {tool.extra && (
                <a
                  href={tool.extra.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#3982C8] hover:text-[#17366F] transition-colors"
                >
                  {tool.extra.label[lang]}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  </div>  );
};
