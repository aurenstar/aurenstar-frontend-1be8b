/**
 * The same 20 core astrology ideas, as people write them in each of the 24 extra languages of the site.
 * Used to ask Google how many people search each name (n8n monthly flow) and to pick the most searched name per language.
 * Order of ideas (same in every language):
 *  0 natal chart | 1 zodiac signs | 2 rising sign | 3 moon sign | 4 sun sign | 5 astrological houses | 6 mercury retrograde
 *  7 saturn return | 8 north node | 9 midheaven | 10 synastry | 11 transits | 12 aspects | 13 conjunction | 14 full moon astrology
 *  15 new moon astrology | 16 solar eclipse astrology | 17 chiron astrology | 18 black moon lilith | 19 stellium
 * Several names for one idea are separated by "|" (the most searched one wins).
 */
import world from '../../data/world-glossary.json';
export const IDEAS = ['natal chart', 'zodiac signs', 'rising sign', 'moon sign', 'sun sign', 'astrological houses', 'mercury retrograde', 'saturn return', 'north node', 'midheaven', 'synastry', 'transits', 'aspects', 'conjunction', 'full moon astrology', 'new moon astrology', 'solar eclipse astrology', 'chiron astrology', 'black moon lilith', 'stellium'] as const;

/** The names live in data/world-glossary.json (the monthly n8n flow reads the same file). Google Ads language ids + the names per language. */
export const LANGUAGE_IDS: Record<string, number> = world.ids;
export const WORLD_GLOSSARY: Record<string, string[]> = world.glossary;
