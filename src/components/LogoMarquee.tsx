import React from 'react';

export const LogoMarquee: React.FC = () => {
  const logos = [
    { name: 'AlphaTech', icon: '✦' },
    { name: 'Vertex', icon: '▲' },
    { name: 'Horizon AI', icon: '◆' },
    { name: 'PulseFlow', icon: '●' },
    { name: 'NexaGlobal', icon: '◈' },
    { name: 'Synapse', icon: '❖' },
  ];

  return (
    <div className="bg-slate-50 border-y border-slate-200/80 py-7 overflow-hidden relative">
      <div className="flex animate-marquee items-center gap-12 sm:gap-16 whitespace-nowrap">
        {[...logos, ...logos, ...logos].map((logo, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2.5 text-slate-400 hover:text-slate-600 transition-colors select-none"
          >
            <span className="text-xl font-bold opacity-75">{logo.icon}</span>
            <span className="text-base sm:text-lg font-bold tracking-tight uppercase">
              {logo.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
