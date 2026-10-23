import React from 'react';

interface CosmicLogoProps {
  className?: string;
}

export const CosmicLogo: React.FC<CosmicLogoProps> = ({
  className = 'h-7 sm:h-8 w-auto',
}) => {
  return (
    <svg
      viewBox="0 0 200 110"
      className={`${className} transition-transform duration-200 group-hover:scale-105 shrink-0`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Outer Horns / Crescents: Warm Rose-Gold / Peach to Pastel Lilac */}
        <linearGradient id="crescentGradLeft" x1="20" y1="20" x2="90" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fff1f2" />
          <stop offset="25%" stopColor="#fde047" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#f3e8ff" />
          <stop offset="85%" stopColor="#d8b4fe" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>

        <linearGradient id="crescentGradRight" x1="180" y1="20" x2="110" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fff1f2" />
          <stop offset="25%" stopColor="#fde047" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#f3e8ff" />
          <stop offset="85%" stopColor="#d8b4fe" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>

        {/* Inner Crescent: Vibrant Violet / Purple with specular depth */}
        <linearGradient id="innerVioletLeft" x1="30" y1="25" x2="80" y2="85" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="45%" stopColor="#7e22ce" />
          <stop offset="100%" stopColor="#581c87" />
        </linearGradient>

        <linearGradient id="innerVioletRight" x1="170" y1="25" x2="120" y2="85" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="45%" stopColor="#7e22ce" />
          <stop offset="100%" stopColor="#581c87" />
        </linearGradient>

        {/* Central 4-Pointed Star: Warm Radiant Gold */}
        <radialGradient id="centerStarGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="20%" stopColor="#fef08a" />
          <stop offset="65%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </radialGradient>
      </defs>

      {/* ===================== LEFT LOOP ===================== */}
      {/* 1. Inner Purple Loop Body */}
      <path
        d="M58 24 C34 24 16 38 16 55 C16 72 34 86 58 86 C74 86 88 74 96 59 C88 44 74 24 58 24 Z"
        fill="url(#innerVioletLeft)"
        stroke="#1e192b"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />

      {/* Inner Circular Hole */}
      <ellipse cx="58" cy="55" rx="24" ry="17" fill="#FFFFFF" stroke="#1e192b" strokeWidth="2.2" />

      {/* 2. Top-Left Outer Horn Crescent */}
      <path
        d="M96 24 C76 13 46 11 26 22 C18 27 15 34 15 34 C15 34 20 30 32 27 C48 22 72 24 88 34 C92 37 96 42 96 42 C96 42 94 32 96 24 Z"
        fill="url(#crescentGradLeft)"
        stroke="#1e192b"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      {/* 3. Bottom-Left Outer Horn Crescent */}
      <path
        d="M96 86 C76 97 46 99 26 88 C18 83 15 76 15 76 C15 76 20 80 32 83 C48 88 72 86 88 76 C92 73 96 68 96 68 C96 68 94 78 96 86 Z"
        fill="url(#crescentGradLeft)"
        stroke="#1e192b"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      {/* Left Specular Glint */}
      <path
        d="M20 46 C18 52 19 58 22 64"
        stroke="#ffffff"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeOpacity="0.8"
      />

      {/* ===================== RIGHT LOOP ===================== */}
      {/* 1. Inner Purple Loop Body */}
      <path
        d="M142 24 C166 24 184 38 184 55 C184 72 166 86 142 86 C126 86 112 74 104 59 C112 44 126 24 142 24 Z"
        fill="url(#innerVioletRight)"
        stroke="#1e192b"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />

      {/* Inner Circular Hole */}
      <ellipse cx="142" cy="55" rx="24" ry="17" fill="#FFFFFF" stroke="#1e192b" strokeWidth="2.2" />

      {/* 2. Top-Right Outer Horn Crescent */}
      <path
        d="M104 24 C124 13 154 11 174 22 C182 27 185 34 185 34 C185 34 180 30 168 27 C152 22 128 24 112 34 C108 37 104 42 104 42 C104 42 106 32 104 24 Z"
        fill="url(#crescentGradRight)"
        stroke="#1e192b"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      {/* 3. Bottom-Right Outer Horn Crescent */}
      <path
        d="M104 86 C124 97 154 99 174 88 C182 83 185 76 185 76 C185 76 180 80 168 83 C152 88 128 86 112 76 C108 73 104 68 104 68 C104 68 106 78 104 86 Z"
        fill="url(#crescentGradRight)"
        stroke="#1e192b"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      {/* Right Specular Glint */}
      <path
        d="M180 46 C182 52 181 58 178 64"
        stroke="#ffffff"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeOpacity="0.8"
      />

      {/* ===================== CENTRAL 4-POINTED STAR ===================== */}
      {/* Outer White Contour for separation */}
      <path
        d="M100 7 L109 46 L142 55 L109 64 L100 103 L91 64 L58 55 L91 46 Z"
        fill="none"
        stroke="#ffffff"
        strokeWidth="4.5"
        strokeLinejoin="round"
      />

      {/* Outer Dark Stroke */}
      <path
        d="M100 7 L109 46 L142 55 L109 64 L100 103 L91 64 L58 55 L91 46 Z"
        fill="#1e192b"
        stroke="#1e192b"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />

      {/* Star Golden Core */}
      <path
        d="M100 9 L108 47 L139 55 L108 63 L100 101 L92 63 L61 55 L92 47 Z"
        fill="url(#centerStarGlow)"
      />

      {/* Delicate Facet Light Highlights */}
      <path
        d="M100 9 L108 47 L100 55 Z"
        fill="#ffffff"
        fillOpacity="0.45"
      />
      <path
        d="M100 55 L92 63 L100 101 Z"
        fill="#ffffff"
        fillOpacity="0.35"
      />
      <path
        d="M61 55 L100 55 L92 47 Z"
        fill="#ffffff"
        fillOpacity="0.4"
      />
      <path
        d="M100 55 L139 55 L108 63 Z"
        fill="#ca8a04"
        fillOpacity="0.3"
      />

      {/* Center Bright Glint */}
      <circle cx="100" cy="55" r="3.5" fill="#ffffff" fillOpacity="0.9" />
    </svg>
  );
};
