// The twelve signs: plain facts handed to the writer in every language (the writer never invents them), plus the Web Story key and theme.
export interface SignFacts { key: string; en: string; dates: string; element: 'fire' | 'earth' | 'air' | 'water'; mode: 'cardinal' | 'fixed' | 'mutable'; ruler: string }
export const SIGN_FACTS: SignFacts[] = [
  { key: 'aries', en: 'Aries', dates: 'around 21 March to 19 April', element: 'fire', mode: 'cardinal', ruler: 'Mars' },
  { key: 'touro', en: 'Taurus', dates: 'around 20 April to 20 May', element: 'earth', mode: 'fixed', ruler: 'Venus' },
  { key: 'gemeos', en: 'Gemini', dates: 'around 21 May to 20 June', element: 'air', mode: 'mutable', ruler: 'Mercury' },
  { key: 'cancer', en: 'Cancer', dates: 'around 21 June to 22 July', element: 'water', mode: 'cardinal', ruler: 'the Moon' },
  { key: 'leao', en: 'Leo', dates: 'around 23 July to 22 August', element: 'fire', mode: 'fixed', ruler: 'the Sun' },
  { key: 'virgem', en: 'Virgo', dates: 'around 23 August to 22 September', element: 'earth', mode: 'mutable', ruler: 'Mercury' },
  { key: 'libra', en: 'Libra', dates: 'around 23 September to 22 October', element: 'air', mode: 'cardinal', ruler: 'Venus' },
  { key: 'escorpiao', en: 'Scorpio', dates: 'around 23 October to 21 November', element: 'water', mode: 'fixed', ruler: 'Pluto (and Mars in classical astrology)' },
  { key: 'sagitario', en: 'Sagittarius', dates: 'around 22 November to 21 December', element: 'fire', mode: 'mutable', ruler: 'Jupiter' },
  { key: 'capricornio', en: 'Capricorn', dates: 'around 22 December to 19 January', element: 'earth', mode: 'cardinal', ruler: 'Saturn' },
  { key: 'aquario', en: 'Aquarius', dates: 'around 20 January to 18 February', element: 'air', mode: 'fixed', ruler: 'Uranus (and Saturn in classical astrology)' },
  { key: 'peixes', en: 'Pisces', dates: 'around 19 February to 20 March', element: 'water', mode: 'mutable', ruler: 'Neptune (and Jupiter in classical astrology)' },
];
export const LANG_NAME: Record<string, string> = {
  de: 'German', fr: 'French', ar: 'Modern Standard Arabic', ru: 'Russian', tr: 'Turkish', hi: 'Hindi', it: 'Italian', vi: 'Vietnamese', ja: 'Japanese', id: 'Indonesian',
  ko: 'Korean', zh: 'Simplified Chinese', tw: 'Traditional Chinese', pl: 'Polish', nl: 'Dutch', th: 'Thai', uk: 'Ukrainian', ro: 'Romanian', cs: 'Czech', el: 'Greek',
  he: 'Hebrew', fa: 'Persian', bn: 'Bengali', ms: 'Malay', tl: 'Filipino', sv: 'Swedish', da: 'Danish', no: 'Norwegian', fi: 'Finnish', hu: 'Hungarian', bg: 'Bulgarian',
  sk: 'Slovak', hr: 'Croatian', sr: 'Serbian (Latin script)', ca: 'Catalan', lt: 'Lithuanian', lv: 'Latvian', sl: 'Slovenian', et: 'Estonian', ta: 'Tamil', te: 'Telugu',
  mr: 'Marathi', ur: 'Urdu', es: 'Spanish',
};
/** Languages written in a non-Latin script: their text must really be in that script. */
export const NON_LATIN = new Set(['ar', 'ru', 'hi', 'ja', 'ko', 'zh', 'tw', 'th', 'uk', 'el', 'he', 'fa', 'bn', 'ta', 'te', 'mr', 'ur', 'bg']);
