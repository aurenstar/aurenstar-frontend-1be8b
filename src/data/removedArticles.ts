/**
 * Placeholder articles that were written in the code and have been removed (the real articles come from WordPress).
 * Their old addresses stay alive as permanent redirects, so Google and old links land on the right article.
 * `replacement` is the WordPress article id that now covers the same subject; null = send to the blog list.
 */
export const REMOVED_ARTICLES: { id: string; slug: string; replacement: string | null }[] = [
  { id: 'post-1', slug: 'the-power-of-sun-signs-how-your-constellation-guides-your-day', replacement: null },
  { id: 'post-2', slug: 'full-moon-and-new-moon-understanding-lunar-cycles-and-calm', replacement: null },
  { id: 'post-3', slug: 'morning-calm-rituals-connecting-mind-spirit-and-cosmos', replacement: null },
  { id: 'post-4', slug: 'zodiac-compatibility-the-meaning-of-fire-earth-air-and-water', replacement: 'wp-1256' },
  { id: 'post-5', slug: 'how-to-create-a-peaceful-corner-at-home-simple-and-cozy-tips', replacement: null },
  { id: 'post-6', slug: 'zodiac-and-gratitude-appreciating-daily-small-victories', replacement: null },
  { id: 'post-gemeos', slug: 'why-do-geminis-prioritize-their-personal-freedom', replacement: 'wp-442' },
  { id: 'post-aries', slug: 'aries-channeling-your-natural-courage-into-new-beginnings', replacement: 'wp-1338' },
  { id: 'post-touro', slug: 'taurus-the-comforting-power-of-patience-and-stability', replacement: 'wp-1296' },
  { id: 'post-cancer', slug: 'cancer-the-gift-of-empathy-and-gentle-self-care', replacement: 'wp-1319' },
  { id: 'post-leao', slug: 'leo-radiating-warmth-generosity-and-joyful-leadership', replacement: 'wp-653' },
  { id: 'post-virgem', slug: 'virgo-gentle-organization-and-quieting-inner-perfectionism', replacement: 'wp-654' },
  { id: 'post-libra', slug: 'libra-the-secret-to-peaceful-decision-making-and-inner-balance', replacement: 'wp-655' },
  { id: 'post-escorpiao', slug: 'scorpio-the-power-of-renewal-and-learning-to-trust-life-flow', replacement: 'wp-656' },
  { id: 'post-sagitario', slug: 'sagittarius-contagious-optimism-and-embracing-life-adventures', replacement: 'wp-657' },
  { id: 'post-capricornio', slug: 'capricorn-building-steady-achievements-with-calm-determination', replacement: 'wp-1377' },
  { id: 'post-aquario', slug: 'aquarius-limitless-creativity-and-the-heartfelt-desire-to-help', replacement: 'wp-658' },
  { id: 'post-peixes', slug: 'pisces-intuition-gentle-empathy-and-the-magic-of-dreaming', replacement: 'wp-659' },
];
