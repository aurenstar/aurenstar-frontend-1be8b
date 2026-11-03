import React from 'react';

interface AurenstarLogoProps {
  className?: string;
  variant?: 'gradient' | 'pink';
}

export const AurenstarLogo: React.FC<AurenstarLogoProps> = ({
  className = 'h-8 sm:h-9 w-auto',
  variant = 'gradient',
}) => {
  // Keep the existing component API and layout sizing while using the new
  // transparent brand asset in the main header/footer preview.
  if (variant === 'gradient') {
    return (
      <img decoding="async"
        src="/logo-aurenstar.webp"
        alt="Aurenstar"
        className={`select-none shrink-0 object-contain ${className}`}
        style={{ display: 'inline-block' }}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 320 75"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none shrink-0 overflow-visible ${className}`}
      aria-label="Aurenstar Logo"
      style={{ display: 'inline-block' }}
    >
      <defs>
        {/* Exact gradient matching the uploaded Aurenstar.png logo */}
        <linearGradient
          id="aurenstarExactGrad"
          x1="18"
          y1="38"
          x2="302"
          y2="38"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#7154F3" />
          <stop offset="12%" stopColor="#7B56EB" />
          <stop offset="25%" stopColor="#8C58C5" />
          <stop offset="38%" stopColor="#A05CAE" />
          <stop offset="50%" stopColor="#B66096" />
          <stop offset="63%" stopColor="#C86584" />
          <stop offset="76%" stopColor="#D86C72" />
          <stop offset="88%" stopColor="#E47860" />
          <stop offset="100%" stopColor="#EC874F" />
        </linearGradient>

        {/* Soft, delicate shadow matching the image */}
        <filter id="aurenstarShadow" x="-15%" y="-20%" width="130%" height="145%">
          <feDropShadow dx="0" dy="2.2" stdDeviation="2.4" floodColor="#000000" floodOpacity="0.12" />
        </filter>

        {/* Precise arc curvature path */}
        <path id="aurenstarArc" d="M 18 64 Q 160 36 302 64" fill="none" />
      </defs>

      {/* Arched Wordmark with Filter Shadow */}
      <g filter="url(#aurenstarShadow)">
        <text
          fill={variant === 'pink' ? '#F51B83' : 'url(#aurenstarExactGrad)'}
          style={{
            fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            fontWeight: 900,
            fontSize: '43px',
            letterSpacing: '0.04em',
          }}
          className="select-none font-black"
        >
          <textPath href="#aurenstarArc" startOffset="50%" textAnchor="middle">
            AURENSTAR
          </textPath>
        </text>
      </g>
    </svg>
  );
};

