import React from 'react';

const Sparkle: React.FC<{ x: number; y: number; r: number; fill: string; opacity?: number }> = ({ x, y, r, fill, opacity = 1 }) => (
  <path d={`M${x} ${y - r} L${x + r * 0.28} ${y - r * 0.28} L${x + r} ${y} L${x + r * 0.28} ${y + r * 0.28} L${x} ${y + r} L${x - r * 0.28} ${y + r * 0.28} L${x - r} ${y} L${x - r * 0.28} ${y - r * 0.28} Z`} fill={fill} fillOpacity={opacity} />
);

// Same artwork language as the profile cover: flat brand colour, soft circles, orbit ring and sparkles.
export const CoverArt: React.FC<{ tone: 'blue' | 'pink'; variant?: number }> = ({ tone, variant = 0 }) => {
  const orbit = tone === 'blue' ? '#F51B83' : '#FFFFFF';
  const flip = variant % 2 === 1;
  return (
    <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" fill="none" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      <ellipse cx="320" cy="100" rx="150" ry="44" transform="rotate(-18 320 100)" stroke="#fff" strokeOpacity="0.28" strokeWidth="9" />
      <ellipse cx="320" cy="100" rx="108" ry="29" transform="rotate(-18 320 100)" stroke={orbit} strokeOpacity={tone === 'blue' ? 0.95 : 0.85} strokeWidth="5" />
      <circle cx="40" cy="20" r="46" fill="#fff" fillOpacity="0.1" />
      <circle cx="170" cy="205" r="36" fill="#fff" fillOpacity="0.1" />
      <Sparkle x={262} y={34} r={13} fill="#fff" />
      <Sparkle x={370} y={150} r={8} fill={tone === 'blue' ? '#F51B83' : '#fff'} />
      <Sparkle x={125} y={42} r={7} fill="#fff" opacity={0.8} />
      <circle cx="210" cy="22" r="2" fill="#fff" fillOpacity="0.7" />
      <circle cx="92" cy="130" r="1.6" fill="#fff" fillOpacity="0.6" />
      <circle cx="235" cy="168" r="2" fill="#fff" fillOpacity="0.6" />
    </svg>
  );
};
