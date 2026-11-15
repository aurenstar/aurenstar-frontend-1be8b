/**
 * Glossary shared by every translation request, so the same word always comes out the same way
 * ("Mercury retrograde" must not be written three different ways on three pages).
 */

/** Names that are never translated. */
export const BRAND_TERMS = ['Aurenstar', 'Aurendaily', 'Aureneffect', 'Auren Effect', 'Aurenstar Unfiltered', 'Aurenstar Dictionary', 'Swiss Ephemeris'];

/** Fixed wording for Brazilian Portuguese and Spanish, the two hand-checked languages. */
const FIXED: Record<string, Record<string, string>> = {
  pt: {
    'Mercury retrograde': 'Mercúrio retrógrado', 'Sun sign': 'signo solar', 'Moon sign': 'signo lunar', 'Rising sign': 'signo ascendente',
    Ascendant: 'Ascendente', 'birth chart': 'mapa astral', 'natal chart': 'mapa astral', horoscope: 'horóscopo', transit: 'trânsito',
    compatibility: 'compatibilidade', 'new moon': 'lua nova', 'full moon': 'lua cheia', 'Midheaven': 'Meio do Céu',
  },
  es: {
    'Mercury retrograde': 'Mercurio retrógrado', 'Sun sign': 'signo solar', 'Moon sign': 'signo lunar', 'Rising sign': 'signo ascendente',
    Ascendant: 'Ascendente', 'birth chart': 'carta natal', 'natal chart': 'carta natal', horoscope: 'horóscopo', transit: 'tránsito',
    compatibility: 'compatibilidad', 'new moon': 'luna nueva', 'full moon': 'luna llena', 'Midheaven': 'Medio Cielo',
  },
};

import worldNames from '../../data/world-names.json';

/** Most searched names in the other languages (data/world-names.json, refreshed by the dictionary robot). */
const WORLD: Record<string, Record<string, string>> = (worldNames as { names?: Record<string, Record<string, string>> }).names || {};

/** Text added to every translation prompt. */
export function glossaryRules(lang: string, languageName: string): string {
  const fixed = FIXED[lang] || (WORLD[lang] && Object.keys(WORLD[lang]).length ? WORLD[lang] : undefined);
  const table = fixed ? ` Always use exactly these words: ${Object.entries(fixed).map(([k, v]) => `"${k}" = "${v}"`).join('; ')}.` : '';
  return (
    `GLOSSARY: never translate these names: ${BRAND_TERMS.join(', ')}.` +
    ` For astrology words (planets, zodiac signs, houses, aspects, "retrograde", "Sun sign", "Moon sign", "Rising sign", "birth chart", "transit") use the standard term astrologers use in ${languageName}, and write each term the SAME way every time.` +
    table
  );
}

/** True when every brand name that appears in the original is still in the translation. */
export function brandsKept(original: string, translated: string): boolean {
  return BRAND_TERMS.every((b) => !original.includes(b) || translated.includes(b));
}
