import React from 'react';
import { ArrowLeft, ExternalLink, Sparkles } from 'lucide-react';

interface CreditsPageProps {
  onBackToHome: () => void;
  onNavigateToBlog: () => void;
}

const TOOLS = [
  {
    name: 'Swiss Ephemeris',
    by: 'Astrodienst AG',
    what: 'Calculates the exact positions of the Sun, Moon, planets and the rising sign (ascendant) used by our tools.',
    license: 'GNU AGPL-3.0',
    link: 'https://www.astro.com/swisseph/',
    linkLabel: 'astro.com/swisseph',
    extra: {
      label: 'Source code of our calculation service',
      url: 'https://github.com/aurenstar/aurenstar-engine',
    },
  },
  {
    name: 'IANA Time Zone Database',
    by: 'IANA',
    what: 'Gives the real clock time and daylight-saving rules of each place and year, so your birth time is converted correctly.',
    license: 'Public domain',
    link: 'https://www.iana.org/time-zones',
    linkLabel: 'iana.org/time-zones',
  },
  {
    name: 'GeoNames',
    by: 'GeoNames.org',
    what: 'Provides the list of cities, their coordinates and time zones for the city search.',
    license: 'Creative Commons Attribution 4.0 (CC BY 4.0)',
    link: 'https://www.geonames.org/',
    linkLabel: 'geonames.org',
  },
];

export const CreditsPage: React.FC<CreditsPageProps> = ({ onBackToHome, onNavigateToBlog }) => (
  <div className="w-full bg-[#C9E5FF] min-h-screen pt-24 sm:pt-28 pb-20 text-[#172B4D]">
    <div className="max-w-2xl mx-auto px-4 sm:px-6">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#D9E8F8]">
        <button
          type="button"
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#647DA5] hover:text-[#172B4D] transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Home</span>
        </button>
        <button
          type="button"
          onClick={onNavigateToBlog}
          className="text-xs sm:text-sm font-bold text-[#2878D0] hover:text-[#17366F] transition-colors cursor-pointer"
        >
          Explore Blog Posts →
        </button>
      </div>

      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E4F1FF] border border-[#D9E8F8] text-[#2878D0] text-xs font-bold uppercase tracking-wider mb-3 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Transparency</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 leading-tight">Tools &amp; Credits</h1>
        <p className="text-sm sm:text-base text-[#647DA5] leading-relaxed max-w-lg mx-auto">
          Our astrology tools are built on trusted scientific tools and open data. Here is what we use and who made it.
        </p>
      </div>

      <div className="space-y-5">
        {TOOLS.map((tool) => (
          <section
            key={tool.name}
            className="bg-white rounded-3xl border border-[#D9E8F8] shadow-md p-6 sm:p-7 relative"
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#2878D0] rounded-t-3xl" />
            <h2 className="text-lg font-extrabold">{tool.name}</h2>
            <p className="text-xs font-bold uppercase tracking-wider text-[#647DA5] mt-0.5">by {tool.by}</p>
            <p className="text-sm text-[#647DA5] leading-relaxed mt-3">{tool.what}</p>
            <p className="text-sm mt-3">
              <span className="font-bold text-[#17366F]">License: </span>
              <span className="text-[#647DA5]">{tool.license}</span>
            </p>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold">
              <a
                href={tool.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[#2878D0] hover:text-[#17366F] transition-colors"
              >
                {tool.linkLabel}
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              {tool.extra && (
                <a
                  href={tool.extra.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#2878D0] hover:text-[#17366F] transition-colors"
                >
                  {tool.extra.label}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  </div>
);
