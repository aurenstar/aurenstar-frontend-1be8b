/**
 * Plain-words story for the Compatibility page: a short text about the two people, a title for the pair and one tip.
 * Everything is built from the result the engine already returns (signs and the four area scores), so it needs no extra request.
 * Kind and symbolic: never a promise about the future.
 */
import { signName, type Lang } from './astroText';

type L3 = Record<Lang, string>;
type Element = 'fire' | 'earth' | 'air' | 'water';

const ELEMENT: Record<string, Element> = {
  Aries: 'fire', Leo: 'fire', Sagittarius: 'fire',
  Taurus: 'earth', Virgo: 'earth', Capricorn: 'earth',
  Gemini: 'air', Libra: 'air', Aquarius: 'air',
  Cancer: 'water', Scorpio: 'water', Pisces: 'water',
};
export const SIGN_SYMBOL: Record<string, string> = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋', Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏', Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓',
};

const ELEMENT_NAME: Record<Element, L3> = {
  fire: { en: 'Fire', pt: 'Fogo', es: 'Fuego' },
  earth: { en: 'Earth', pt: 'Terra', es: 'Tierra' },
  air: { en: 'Air', pt: 'Ar', es: 'Aire' },
  water: { en: 'Water', pt: 'Água', es: 'Agua' },
};

/** What two Sun signs of the same element have in common. */
const SAME: Record<Element, L3> = {
  fire: { en: 'You both move fast, love action and like honesty.', pt: 'Vocês dois agem rápido, gostam de ação e valorizam a sinceridade.', es: 'Los dos actúan rápido, aman la acción y valoran la sinceridad.' },
  earth: { en: 'You both like calm, practical things and loyalty.', pt: 'Vocês dois gostam de coisas calmas e práticas e valorizam a lealdade.', es: 'Los dos aman lo calmado y lo práctico, y valoran la lealtad.' },
  air: { en: 'You both love talking, ideas and freedom.', pt: 'Vocês dois adoram conversar, ter ideias e ter liberdade.', es: 'Los dos aman conversar, tener ideas y la libertad.' },
  water: { en: 'You both feel things deeply and care for each other.', pt: 'Vocês dois sentem as coisas com profundidade e cuidam um do outro.', es: 'Los dos sienten con profundidad y se cuidan.' },
};
/** Two different elements: the usual "friends" pairs and the "learn to meet halfway" pairs. */
const MIX: Record<string, L3> = {
  'air|fire': { en: 'Air feeds Fire: ideas give energy to action.', pt: 'O Ar alimenta o Fogo: ideias dão energia para a ação.', es: 'El Aire alimenta al Fuego: las ideas dan energía a la acción.' },
  'earth|water': { en: 'Water nourishes Earth: care helps plans grow.', pt: 'A Água nutre a Terra: o cuidado faz os planos crescerem.', es: 'El Agua nutre a la Tierra: el cuidado hace crecer los planes.' },
  'earth|fire': { en: 'Fire wants to run and Earth wants to plan: learn to meet halfway.', pt: 'O Fogo quer correr e a Terra quer planejar: aprendam a se encontrar no meio.', es: 'El Fuego quiere correr y la Tierra quiere planear: aprendan a encontrarse a medio camino.' },
  'air|water': { en: 'Air thinks and Water feels: talk about feelings gently.', pt: 'O Ar pensa e a Água sente: conversem sobre os sentimentos com delicadeza.', es: 'El Aire piensa y el Agua siente: hablen de los sentimientos con delicadeza.' },
  'fire|water': { en: 'Fire is quick and Water is sensitive: go gently with each other.', pt: 'O Fogo é rápido e a Água é sensível: tratem um ao outro com delicadeza.', es: 'El Fuego es rápido y el Agua es sensible: trátense con delicadeza.' },
  'air|earth': { en: 'Earth likes certainty and Air likes change: give each other room.', pt: 'A Terra gosta de segurança e o Ar gosta de mudança: deem espaço um ao outro.', es: 'La Tierra ama la seguridad y el Aire el cambio: denle espacio al otro.' },
};
const MOON: Record<'same' | 'friend' | 'mix', L3> = {
  same: { en: 'Your Moons share an element, so you feel things in a similar way.', pt: 'As Luas de vocês são do mesmo elemento, então vocês sentem as coisas de jeito parecido.', es: 'Sus Lunas son del mismo elemento, así que sienten de forma parecida.' },
  friend: { en: 'Your Moons get along, so your feelings tend to support each other.', pt: 'As Luas de vocês se dão bem, então os sentimentos de vocês tendem a se apoiar.', es: 'Sus Lunas se llevan bien, así que sus sentimientos tienden a apoyarse.' },
  mix: { en: 'Your Moons are different, so it helps to say out loud how you feel.', pt: 'As Luas de vocês são diferentes, então ajuda dizer em voz alta como vocês se sentem.', es: 'Sus Lunas son distintas, así que ayuda decir en voz alta cómo se sienten.' },
};
const FRIENDS = new Set(['air|fire', 'earth|water']);
const pairKey = (a: Element, b: Element) => [a, b].sort().join('|');

/** Title of the pair, from the area where they score best. */
const TITLE: Record<string, L3> = {
  love: { en: 'The spark pair', pt: 'A dupla da faísca', es: 'La pareja de la chispa' },
  mind: { en: 'The easy-talk pair', pt: 'A dupla da conversa leve', es: 'La pareja de la charla fácil' },
  emotions: { en: 'The soft-hearts pair', pt: 'A dupla do coração tranquilo', es: 'La pareja del corazón tranquilo' },
  energy: { en: 'The go-getters pair', pt: 'A dupla que faz acontecer', es: 'La pareja que hace que las cosas pasen' },
  grow: { en: 'The pair that grows by learning', pt: 'A dupla que cresce aprendendo', es: 'La pareja que crece aprendiendo' },
};
/** One small tip, from the area where they score lowest. */
const TIP: Record<string, L3> = {
  love: { en: 'This week, plan one small thing just for the two of you, even a walk.', pt: 'Nesta semana, planejem uma coisa pequena só para os dois, nem que seja uma caminhada.', es: 'Esta semana, planeen algo pequeño solo para los dos, aunque sea un paseo.' },
  mind: { en: 'This week, take 10 minutes to talk about something important, phones away.', pt: 'Nesta semana, tirem 10 minutos para conversar sobre algo importante, sem celular.', es: 'Esta semana, tómense 10 minutos para hablar de algo importante, sin celular.' },
  emotions: { en: 'This week, ask “how are you, really?” once, and just listen without trying to fix.', pt: 'Nesta semana, perguntem uma vez “como você está, de verdade?” e só escutem, sem tentar resolver.', es: 'Esta semana, pregunten una vez “¿cómo estás, de verdad?” y solo escuchen, sin tratar de arreglar.' },
  energy: { en: 'This week, pick one activity you both enjoy and do it together, even a short one.', pt: 'Nesta semana, escolham uma atividade que os dois gostem e façam juntos, mesmo que seja curta.', es: 'Esta semana, elijan una actividad que disfruten los dos y háganla juntos, aunque sea corta.' },
};

export interface CompatStory { title: string; summary: string[]; tip: string }

export function compatStory(
  r: { score: number; areas: Record<string, number>; signs: { a: { sun: string; moon: string }; b: { sun: string; moon: string } } },
  nameA: string,
  nameB: string,
  l: Lang,
): CompatStory {
  const sunA = ELEMENT[r.signs.a.sun], sunB = ELEMENT[r.signs.b.sun];
  const moonA = ELEMENT[r.signs.a.moon], moonB = ELEMENT[r.signs.b.moon];
  const names = (a: string, b: string, sa: string, sb: string) => ({
    en: `${a} is ${sa} and ${b} is ${sb}`,
    pt: `${a} é de ${sa} e ${b} é de ${sb}`,
    es: `${a} es ${sa} y ${b} es ${sb}`,
  })[l];

  const sa = signName(r.signs.a.sun, l), sb = signName(r.signs.b.sun, l);
  let sunLine: string;
  if (sunA && sunB && sunA === sunB) {
    const el = ELEMENT_NAME[sunA][l];
    sunLine = `${names(nameA, nameB, sa, sb)}: ${{ en: `two ${el} signs.`, pt: `dois signos de ${el}.`, es: `dos signos de ${el}.` }[l]} ${SAME[sunA][l]}`;
  } else if (sunA && sunB) {
    sunLine = `${names(nameA, nameB, sa, sb)}: ${ELEMENT_NAME[sunA][l]} + ${ELEMENT_NAME[sunB][l]}. ${MIX[pairKey(sunA, sunB)][l]}`;
  } else {
    sunLine = names(nameA, nameB, sa, sb) + '.';
  }
  const moonKind: 'same' | 'friend' | 'mix' = !moonA || !moonB ? 'mix' : moonA === moonB ? 'same' : FRIENDS.has(pairKey(moonA, moonB)) ? 'friend' : 'mix';

  const entries = Object.entries(r.areas).sort((x, y) => y[1] - x[1]);
  const best = entries[0]?.[0] ?? 'love';
  const worst = entries[entries.length - 1]?.[0] ?? 'mind';
  return {
    title: (r.score < 58 ? TITLE.grow : TITLE[best] || TITLE.love)[l],
    summary: [sunLine, MOON[moonKind][l]],
    tip: (TIP[worst] || TIP.mind)[l],
  };
}
