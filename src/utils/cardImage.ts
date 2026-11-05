import { CARD_IMAGES } from '../data/cardImages';

/** Small copy of an article picture for blog cards (full picture still used inside the article). */
export const cardImage = (src: string): string =>
  CARD_IMAGES.has(src) ? src.replace(/\.webp$/, '-card.webp') : src;
