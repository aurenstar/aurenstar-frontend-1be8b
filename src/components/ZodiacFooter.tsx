import React from 'react';
import { Star } from 'lucide-react';

export const ZodiacFooter: React.FC = () => {
  return (
    <footer className="py-8 text-center text-xs text-slate-400 border-t border-slate-100 bg-white">
      <div className="flex items-center justify-center gap-1.5 font-medium mb-1 text-slate-600">
        <Star className="w-3.5 h-3.5 fill-[#d2f829] text-black" />
        <span>Your Daily Zodiac Message & Star Sign Guidance</span>
      </div>
      <div>Designed with positivity, warmth, and peace of mind.</div>
    </footer>
  );
};
