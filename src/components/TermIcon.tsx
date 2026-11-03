import React from 'react';
import { Orbit, Sunrise, Sun, Moon, Compass, Home, Heart, Flame, Leaf, HeartHandshake, Cake, MoonStar, Eclipse, Shuffle, Sparkles } from 'lucide-react';

const ICONS: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  'what-is-mercury-retrograde': Orbit,
  'what-is-rising-sign': Sunrise,
  'what-is-sun-sign': Sun,
  'what-is-moon-sign': Moon,
  'what-is-birth-chart': Compass,
  'what-is-saturn-return': Orbit,
  'what-are-astrological-houses': Home,
  'what-does-venus-mean': Heart,
  'what-does-mars-mean': Flame,
  'what-are-astrology-elements': Leaf,
  'what-is-synastry': HeartHandshake,
  'what-is-solar-return': Cake,
  'what-is-full-moon-meaning': Moon,
  'what-is-new-moon-meaning': MoonStar,
  'what-is-eclipse-meaning': Eclipse,
  'what-is-cusp-astrology': Shuffle,
};

/** Brand line icon for a dictionary term (replaces the colorful emoji). Color comes from the parent (currentColor). */
export const TermIcon: React.FC<{ slug: string; className?: string }> = ({ slug, className = 'h-6 w-6' }) => {
  const Icon = ICONS[slug] || Sparkles;
  return <Icon className={className} strokeWidth={2.2} />;
};
