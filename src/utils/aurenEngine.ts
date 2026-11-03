import { buildSignals, factsFromTriad, type SkyFacts } from './readingSignals';
/**
 * Aurenstar Engine & Astronomical Core (Aureneffect)
 * 
 * Camada 01: Cálculos Astronômicos de Precisão (Sol, Lua, Ascendente e Lua de Hoje)
 * Camada 02: Banco de Gatilhos Psicológicos de Rotina da Aurenstar
 * Camada 03: Interpretador Comportamental (Prompt estruturado para Gemini e Fallback lapidado)
 */

export interface CelestialPosition {
  sign: string;
  signKey: string;
  degree: number;
  minute: number;
  element: 'Fogo' | 'Terra' | 'Ar' | 'Água';
  symbol: string;
  keyword: string;
}

export interface AstronomicalTriad {
  sun: CelestialPosition;
  moon: CelestialPosition;
  ascendant: CelestialPosition;
  todayMoon: CelestialPosition & { phase: string; phaseEmoji: string };
  julianDate: number;
  calculatedAt: string;
}

export interface RoutineTriggerData {
  primaryCause: string;
  hiddenTrigger: string;
  practicalActions: Array<{
    title: string;
    description: string;
    iconType: string;
  }>;
  emotionalEnergy: number; // 0 a 100
  dominantVibe: string;
  mindfulAdvice: string;
}

export interface AurenEffectResult {
  userName: string;
  birthCity: string;
  birthDateFormatted: string;
  birthTimeFormatted: string;
  astronomy: AstronomicalTriad;
  routineTrigger: RoutineTriggerData;
  question1Answer: string; // Por que estou me sentindo ou agindo assim hoje?
  question2Answer: string; // O que eu posso fazer com isso agora?
  practicalSteps: Array<{
    stepNumber: number;
    title: string;
    action: string;
  }>;
  affirmation: string;
  transparencyNote: string;
  /** Short headline that matches the message. */
  headline?: string;
  generatedByAI: boolean;
}

const ZODIAC_SIGNS = [
  { key: 'aries', name: 'Áries', symbol: '♈', element: 'Fogo' as const, keyword: 'Iniciativa e Coragem' },
  { key: 'touro', name: 'Touro', symbol: '♉', element: 'Terra' as const, keyword: 'Estabilidade e Calma' },
  { key: 'gemeos', name: 'Gêmeos', symbol: '♊', element: 'Ar' as const, keyword: 'Curiosidade e Comunicação' },
  { key: 'cancer', name: 'Câncer', symbol: '♋', element: 'Água' as const, keyword: 'Acolhimento e Emoção' },
  { key: 'leao', name: 'Leão', symbol: '♌', element: 'Fogo' as const, keyword: 'Brilho e Autoestima' },
  { key: 'virgem', name: 'Virgem', symbol: '♍', element: 'Terra' as const, keyword: 'Organização e Detalhes' },
  { key: 'libra', name: 'Libra', symbol: '♎', element: 'Ar' as const, keyword: 'Harmonia e Equilíbrio' },
  { key: 'escorpiao', name: 'Escorpião', symbol: '♏', element: 'Água' as const, keyword: 'Profundidade e Foco' },
  { key: 'sagitario', name: 'Sagitário', symbol: '♐', element: 'Fogo' as const, keyword: 'Otimismo e Liberdade' },
  { key: 'capricornio', name: 'Capricórnio', symbol: '♑', element: 'Terra' as const, keyword: 'Constância e Realização' },
  { key: 'aquario', name: 'Aquário', symbol: '♒', element: 'Ar' as const, keyword: 'Originalidade e Espaço' },
  { key: 'peixes', name: 'Peixes', symbol: '♓', element: 'Água' as const, keyword: 'Sensibilidade e Empatia' },
];

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

function toDegrees(rad: number): number {
  return (rad * 180) / Math.PI;
}

function normalizeAngle(deg: number): number {
  let angle = deg % 360;
  if (angle < 0) angle += 360;
  return angle;
}

function getJulianDate(year: number, month: number, day: number, hourFraction: number): number {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + B - 1524.5;
  return jd + hourFraction / 24;
}

function getSunLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  const L0 = normalizeAngle(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
  const M = normalizeAngle(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
  const e = 0.016708634 - 0.000042037 * T - 0.0000001267 * T * T;
  const Mrad = toRadians(M);
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad) +
    0.000289 * Math.sin(3 * Mrad);
  const trueLong = normalizeAngle(L0 + C);
  return trueLong;
}

function getMoonLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  const Lp = normalizeAngle(218.3164477 + 481267.88123421 * T);
  const D = normalizeAngle(297.8501921 + 445267.1114034 * T);
  const M = normalizeAngle(357.5291092 + 35999.0502909 * T);
  const Mp = normalizeAngle(134.9633964 + 477198.8675055 * T);
  const F = normalizeAngle(93.272095 + 483202.0175233 * T);

  const D_r = toRadians(D);
  const M_r = toRadians(M);
  const Mp_r = toRadians(Mp);
  const F_r = toRadians(F);

  // Principais perturbações lunares (algoritmo astronômico padrão Meeus/Brown)
  const periodicCorrection =
    6.288774 * Math.sin(Mp_r) +
    1.274027 * Math.sin(2 * D_r - Mp_r) +
    0.658314 * Math.sin(2 * D_r) +
    0.213618 * Math.sin(2 * Mp_r) -
    0.185116 * Math.sin(M_r) -
    0.114332 * Math.sin(2 * F_r) +
    0.058793 * Math.sin(2 * D_r - 2 * Mp_r) +
    0.057066 * Math.sin(2 * D_r - M_r - Mp_r) +
    0.05332 * Math.sin(2 * D_r + Mp_r) +
    0.0461 * Math.sin(2 * D_r - M_r);

  return normalizeAngle(Lp + periodicCorrection);
}

function getAscendantLongitude(jd: number, lat: number, lon: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  // Tempo Sideral Médio em Greenwich em 0h UT
  const theta0 = normalizeAngle(280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T);
  // Tempo Sideral Local
  const lst = normalizeAngle(theta0 + lon);
  const ramc = toRadians(lst);
  const eps = toRadians(23.4392911 - 0.0130042 * T);
  const phi = toRadians(lat);

  const y = -Math.cos(ramc);
  const x = Math.sin(ramc) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps);
  let asc = toDegrees(Math.atan2(y, x));
  asc = normalizeAngle(asc);
  return asc;
}

export function formatCelestialPos(longitude: number): CelestialPosition {
  const signIndex = Math.floor(longitude / 30);
  const clampedIndex = Math.max(0, Math.min(11, signIndex));
  const signInfo = ZODIAC_SIGNS[clampedIndex];
  const rem = longitude % 30;
  const degree = Math.floor(rem);
  const minute = Math.floor((rem - degree) * 60);

  return {
    sign: signInfo.name,
    signKey: signInfo.key,
    degree,
    minute,
    element: signInfo.element,
    symbol: signInfo.symbol,
    keyword: signInfo.keyword,
  };
}

export function getMoonPhaseName(sunLong: number, moonLong: number): { name: string; emoji: string } {
  const diff = normalizeAngle(moonLong - sunLong);
  if (diff < 45 || diff >= 315) return { name: 'Lua Nova', emoji: '🌑' };
  if (diff < 135) return { name: 'Lua Crescente', emoji: '🌓' };
  if (diff < 225) return { name: 'Lua Cheia', emoji: '🌕' };
  return { name: 'Lua Minguante', emoji: '🌗' };
}

// Cidades de referência rápida com latitude/longitude e fuso horário
export const REFERENCE_CITIES: Record<string, { lat: number; lon: number; tz: number; label: string }> = {
  'sao-paulo': { lat: -23.5505, lon: -46.6333, tz: -3, label: 'São Paulo, SP' },
  'rio-de-janeiro': { lat: -22.9068, lon: -43.1729, tz: -3, label: 'Rio de Janeiro, RJ' },
  'belo-horizonte': { lat: -19.9245, lon: -43.9352, tz: -3, label: 'Belo Horizonte, MG' },
  'brasilia': { lat: -15.7975, lon: -47.8919, tz: -3, label: 'Brasília, DF' },
  'salvador': { lat: -12.9777, lon: -38.5016, tz: -3, label: 'Salvador, BA' },
  'curitiba': { lat: -25.429, lon: -49.2671, tz: -3, label: 'Curitiba, PR' },
  'porto-alegre': { lat: -30.0346, lon: -51.2177, tz: -3, label: 'Porto Alegre, RS' },
  'recife': { lat: -8.0476, lon: -34.877, tz: -3, label: 'Recife, PE' },
  'fortaleza': { lat: -3.7319, lon: -38.5267, tz: -3, label: 'Fortaleza, CE' },
  'manaus': { lat: -3.119, lon: -60.0217, tz: -4, label: 'Manaus, AM' },
  'lisboa': { lat: 38.7223, lon: -9.1393, tz: 0, label: 'Lisboa, Portugal' },
  'porto': { lat: 41.1579, lon: -8.6291, tz: 0, label: 'Porto, Portugal' },
};

/**
 * Camada 01: Extração dos Dados Celestes
 */
export function calculateAstrologicalTriad(
  year: number,
  month: number,
  day: number,
  hours: number,
  minutes: number,
  cityKey: string | { lat: number; lon: number; tz?: number } = 'sao-paulo'
): AstronomicalTriad {
  // Approximate fallback only (used when the precise calculation service is unavailable).
  const city =
    typeof cityKey === 'string'
      ? REFERENCE_CITIES[cityKey] || REFERENCE_CITIES['sao-paulo']
      : { lat: cityKey.lat, lon: cityKey.lon, tz: cityKey.tz ?? Math.round(cityKey.lon / 15) };
  const tzOffset = city.tz;

  // Converte horário local para fração de hora em UT
  const utHours = hours + minutes / 60 - tzOffset;
  const jd = getJulianDate(year, month, day, utHours);

  const sunLong = getSunLongitude(jd);
  const moonLong = getMoonLongitude(jd);
  const ascLong = getAscendantLongitude(jd, city.lat, city.lon);

  // Agora calcula o céu de hoje em tempo real
  const now = new Date();
  const nowJd = getJulianDate(
    now.getUTCFullYear(),
    now.getUTCMonth() + 1,
    now.getUTCDate(),
    now.getUTCHours() + now.getUTCMinutes() / 60
  );
  const todaySunLong = getSunLongitude(nowJd);
  const todayMoonLong = getMoonLongitude(nowJd);
  const phaseInfo = getMoonPhaseName(todaySunLong, todayMoonLong);
  const todayMoonPos = formatCelestialPos(todayMoonLong);

  return {
    sun: formatCelestialPos(sunLong),
    moon: formatCelestialPos(moonLong),
    ascendant: formatCelestialPos(ascLong),
    todayMoon: {
      ...todayMoonPos,
      phase: phaseInfo.name,
      phaseEmoji: phaseInfo.emoji,
    },
    julianDate: jd,
    calculatedAt: now.toISOString(),
  };
}

/**
 * Builds the triad from REAL positions (Swiss Ephemeris, via /api/chart). Longitudes in degrees 0-360.
 */
export function buildTriadFromLongitudes(input: {
  sun: number;
  moon: number;
  ascendant: number;
  todaySun: number;
  todayMoon: number;
  julianDate: number;
}): AstronomicalTriad {
  const phase = getMoonPhaseName(input.todaySun, input.todayMoon);
  return {
    sun: formatCelestialPos(input.sun),
    moon: formatCelestialPos(input.moon),
    ascendant: formatCelestialPos(input.ascendant),
    todayMoon: { ...formatCelestialPos(input.todayMoon), phase: phase.name, phaseEmoji: phase.emoji },
    julianDate: input.julianDate,
    calculatedAt: new Date().toISOString(),
  };
}

/**
 * Camada 02: Aurenstar Engine / Tabela de Gatilhos Psicológicos de Rotina
 */
export type ReadingLang = 'pt' | 'en' | 'es';

type TriggerText = {
  cause: string;
  trigger: string;
  more: string;
  tipsIntro: string;
  affirmation: string;
  action1: { title: string; desc: string };
  action2: { title: string; desc: string };
  action3: { title: string; desc: string };
  vibe: string;
  advice: string;
  baseEnergy: number;
};

// Simple, everyday words only. No astrology jargon in the reading itself.
const ROUTINE_TRIGGERS: Record<ReadingLang, Record<string, TriggerText>> = {
  en: {
    Fogo: {
      cause: 'You may feel full of energy and in a hurry to get things done.',
      trigger: 'Everything around you may seem too slow, and waiting can feel hard today.',
      more: 'When we are in a rush, it is easy to start many things and finish none, or to answer people more sharply than we mean to. That does not make you impatient or rude. It is just a lot of energy looking for somewhere to go.',
      tipsIntro: 'To use this energy well without wearing yourself out, try these 3 simple ideas:',
      affirmation: 'Today I use my energy with calm, one step at a time.',
      action1: { title: 'Pick just one thing to finish', desc: 'With so much rush, it is easy to start ten things. Choose the most important one and finish it before lunch.' },
      action2: { title: 'Give your energy somewhere to go', desc: 'Take a 10-minute walk or stretch. Moving your body lets the rush out in a good way.' },
      action3: { title: 'Count to five before you reply', desc: 'When we are in a hurry, messages come out sharp. A short pause makes you sound kinder.' },
      vibe: 'Lots of energy that needs a little calm',
      advice: 'Going slowly is not wasting time. It is building things that last.',
      baseEnergy: 92,
    },
    Terra: {
      cause: 'You may want things to be calm, safe and in their place today.',
      trigger: 'A last-minute change or a surprise message can upset you more than usual.',
      more: 'When we need things to be steady, small changes feel bigger than they are. That is not you being difficult. It is you wanting to feel safe and in control of your day.',
      tipsIntro: 'To bring back the feeling of order and calm, try these 3 simple ideas:',
      affirmation: 'Today I let things be, and I trust that everything finds its place.',
      action1: { title: 'Tidy one small space', desc: 'A clear desk or table makes the mind feel clearer too. Five minutes is enough.' },
      action2: { title: 'Take a quiet break', desc: 'Sit down with a tea or a glass of water and leave your phone aside for a while. You deserve a calm moment.' },
      action3: { title: 'Let plans change a little', desc: 'If something does not go as planned, take a deep breath. Most changes are smaller than they first look.' },
      vibe: 'A steady day that needs a bit of flexibility',
      advice: 'Your strength is patience. Give things time to fall into place.',
      baseEnergy: 86,
    },
    Ar: {
      cause: 'Your mind may be very busy today, with many thoughts and ideas at the same time.',
      trigger: 'Too many open tabs, notifications and conversations can leave your head feeling full.',
      more: 'When the mind is racing, it is hard to rest, to focus or even to decide what to do first. That does not mean something is wrong with you. Your head just got too much input at once.',
      tipsIntro: 'To quiet the noise in your head, try these 3 simple ideas:',
      affirmation: 'Today I let my mind slow down and I choose what really matters.',
      action1: { title: 'Stay away from screens for 20 minutes', desc: 'Put your phone away while you eat or rest. Less input gives your head room to breathe.' },
      action2: { title: 'Write your thoughts on paper', desc: 'Getting thoughts out of your head makes it easier to see what really matters and what can wait.' },
      action3: { title: 'Have a light chat', desc: 'Talk about something happy with someone you like, instead of going over your to-do list again.' },
      vibe: 'A curious mind that needs some rest',
      advice: 'Not every thought needs to become action today. Enjoy some quiet when you can.',
      baseEnergy: 89,
    },
    Água: {
      cause: 'You may feel everything a little deeper today, especially what other people feel.',
      trigger: 'Heavy conversations or a tired body can make you carry other people’s problems.',
      more: 'When we feel so much, it is easy to get tired without knowing why, or to take on worries that are not ours. That is not weakness. It means you care. It only needs to be balanced with care for yourself.',
      tipsIntro: 'To protect your peace and feel lighter, try these 3 simple ideas:',
      affirmation: 'Today I take care of my heart as gently as I take care of others.',
      action1: { title: 'Keep a little space for yourself', desc: 'Remind yourself: what belongs to others is theirs. You can listen without carrying everything.' },
      action2: { title: 'Take a warm shower', desc: 'Warm water and comfy clothes help your body let go of the tension of the day.' },
      action3: { title: 'Say a kind “no” if you feel tired', desc: 'Resting is not selfish. It is how you get your strength back to be there for others.' },
      vibe: 'A gentle heart that needs care',
      advice: 'You are generous with others. Be just as gentle with yourself today.',
      baseEnergy: 84,
    },
  },
  pt: {
    Fogo: {
      cause: 'Você pode estar com muita energia e com pressa para resolver tudo.',
      trigger: 'Tudo ao redor pode parecer devagar demais, e esperar pode ser difícil hoje.',
      more: 'Quando estamos apressados, é fácil começar várias coisas sem terminar nenhuma, ou responder as pessoas de um jeito mais seco do que gostaríamos. Isso não quer dizer que você é impaciente ou grosso. É só muita energia procurando um lugar para sair.',
      tipsIntro: 'Para usar essa energia sem se cansar, experimente estas 3 ideias simples:',
      affirmation: 'Hoje eu uso minha energia com calma, um passo de cada vez.',
      action1: { title: 'Escolha só uma coisa para terminar', desc: 'Com tanta pressa, é fácil começar dez coisas. Escolha a mais importante e termine antes do almoço.' },
      action2: { title: 'Dê um destino para essa energia', desc: 'Faça uma caminhada ou um alongamento de 10 minutos. Mexer o corpo ajuda a soltar a pressa do jeito certo.' },
      action3: { title: 'Conte até cinco antes de responder', desc: 'Quando estamos com pressa, as mensagens saem secas. Uma pausa curta faz você soar mais gentil.' },
      vibe: 'Muita energia que precisa de um pouco de calma',
      advice: 'Ir devagar não é perder tempo. É construir coisas que duram.',
      baseEnergy: 92,
    },
    Terra: {
      cause: 'Você pode querer que tudo esteja calmo, seguro e no seu lugar hoje.',
      trigger: 'Uma mudança de última hora ou uma mensagem inesperada pode incomodar mais do que o normal.',
      more: 'Quando precisamos de firmeza, qualquer mudança pequena parece maior do que é. Isso não é você sendo difícil. É você querendo se sentir seguro e no controle do seu dia.',
      tipsIntro: 'Para trazer de volta a sensação de ordem e calma, experimente estas 3 ideias simples:',
      affirmation: 'Hoje eu deixo as coisas fluírem e confio que tudo encontra o seu lugar.',
      action1: { title: 'Arrume um cantinho pequeno', desc: 'Uma mesa organizada deixa a cabeça mais clara também. Cinco minutos já bastam.' },
      action2: { title: 'Faça uma pausa tranquila', desc: 'Sente com um chá ou um copo de água e deixe o celular de lado por um tempinho. Você merece um momento de calma.' },
      action3: { title: 'Deixe os planos mudarem um pouco', desc: 'Se algo não sair como o planejado, respire fundo. A maioria das mudanças é menor do que parece.' },
      vibe: 'Um dia firme que pede um pouco de jogo de cintura',
      advice: 'Sua força é a paciência. Dê tempo para as coisas se ajeitarem.',
      baseEnergy: 86,
    },
    Ar: {
      cause: 'Sua mente pode estar muito agitada hoje, com muitos pensamentos e ideias ao mesmo tempo.',
      trigger: 'Muitas abas abertas, notificações e conversas podem deixar a cabeça cheia.',
      more: 'Quando a mente corre demais, fica difícil descansar, se concentrar ou até decidir o que fazer primeiro. Isso não quer dizer que tem algo errado com você. A sua cabeça só recebeu informação demais de uma vez.',
      tipsIntro: 'Para baixar o barulho na sua cabeça, experimente estas 3 ideias simples:',
      affirmation: 'Hoje eu deixo minha mente desacelerar e escolho o que realmente importa.',
      action1: { title: 'Fique 20 minutos longe das telas', desc: 'Deixe o celular de lado enquanto come ou descansa. Menos informação dá espaço para a cabeça respirar.' },
      action2: { title: 'Escreva seus pensamentos no papel', desc: 'Tirar os pensamentos da cabeça ajuda a ver o que realmente importa e o que pode esperar.' },
      action3: { title: 'Bata um papo leve', desc: 'Converse sobre algo alegre com alguém que você gosta, em vez de repassar a lista de tarefas outra vez.' },
      vibe: 'Uma mente curiosa que precisa descansar',
      advice: 'Nem todo pensamento precisa virar ação hoje. Aproveite o silêncio quando puder.',
      baseEnergy: 89,
    },
    Água: {
      cause: 'Você pode sentir tudo um pouco mais forte hoje, principalmente o que os outros sentem.',
      trigger: 'Conversas pesadas ou o corpo cansado podem fazer você carregar os problemas dos outros.',
      more: 'Quando sentimos muito, é fácil ficar cansado sem saber o motivo, ou assumir preocupações que não são nossas. Isso não é fraqueza. Mostra que você se importa. Só precisa equilibrar isso com cuidado por você também.',
      tipsIntro: 'Para proteger a sua paz e se sentir mais leve, experimente estas 3 ideias simples:',
      affirmation: 'Hoje eu cuido do meu coração com a mesma gentileza com que cuido dos outros.',
      action1: { title: 'Guarde um espacinho para você', desc: 'Lembre-se: o que é do outro é dele. Você pode ouvir sem carregar tudo nas costas.' },
      action2: { title: 'Tome um banho morno', desc: 'Água morna e roupa confortável ajudam o corpo a soltar a tensão do dia.' },
      action3: { title: 'Diga um “não” carinhoso se sentir cansaço', desc: 'Descansar não é egoísmo. É assim que você recupera a força para estar presente para os outros.' },
      vibe: 'Um coração sensível que pede carinho',
      advice: 'Você é generoso com os outros. Seja igualmente gentil com você hoje.',
      baseEnergy: 84,
    },
  },
  es: {
    Fogo: {
      cause: 'Puedes sentirte con mucha energía y con prisa por resolverlo todo.',
      trigger: 'Todo a tu alrededor puede parecer demasiado lento, y esperar puede costar hoy.',
      more: 'Cuando tenemos prisa, es fácil empezar muchas cosas sin terminar ninguna, o responder a los demás de forma más seca de lo que queremos. Eso no significa que seas impaciente. Es solo mucha energía buscando por dónde salir.',
      tipsIntro: 'Para usar esa energía sin agotarte, prueba estas 3 ideas simples:',
      affirmation: 'Hoy uso mi energía con calma, un paso a la vez.',
      action1: { title: 'Elige solo una cosa para terminar', desc: 'Con tanta prisa es fácil empezar diez cosas. Elige la más importante y termínala antes del almuerzo.' },
      action2: { title: 'Dale un destino a esa energía', desc: 'Camina o estírate 10 minutos. Mover el cuerpo ayuda a soltar la prisa de buena manera.' },
      action3: { title: 'Cuenta hasta cinco antes de responder', desc: 'Cuando tenemos prisa, los mensajes salen secos. Una pausa corta te hace sonar más amable.' },
      vibe: 'Mucha energía que necesita un poco de calma',
      advice: 'Ir despacio no es perder tiempo. Es construir cosas que duran.',
      baseEnergy: 92,
    },
    Terra: {
      cause: 'Puede que hoy quieras que todo esté tranquilo, seguro y en su lugar.',
      trigger: 'Un cambio de último momento o un mensaje inesperado puede molestarte más de lo normal.',
      more: 'Cuando necesitamos estabilidad, cualquier cambio pequeño parece más grande de lo que es. Eso no es ser difícil. Es querer sentirte seguro y con control de tu día.',
      tipsIntro: 'Para recuperar la sensación de orden y calma, prueba estas 3 ideas simples:',
      affirmation: 'Hoy dejo que las cosas fluyan y confío en que todo encuentra su lugar.',
      action1: { title: 'Ordena un rinconcito', desc: 'Un escritorio ordenado también aclara la mente. Cinco minutos bastan.' },
      action2: { title: 'Haz una pausa tranquila', desc: 'Siéntate con un té o un vaso de agua y deja el teléfono a un lado un rato. Mereces un momento de calma.' },
      action3: { title: 'Deja que los planes cambien un poco', desc: 'Si algo no sale como lo planeaste, respira hondo. La mayoría de los cambios es más pequeña de lo que parece.' },
      vibe: 'Un día firme que pide un poco de flexibilidad',
      advice: 'Tu fuerza es la paciencia. Dale tiempo a las cosas para acomodarse.',
      baseEnergy: 86,
    },
    Ar: {
      cause: 'Tu mente puede estar muy agitada hoy, con muchos pensamientos e ideas a la vez.',
      trigger: 'Demasiadas pestañas abiertas, notificaciones y conversaciones pueden dejarte la cabeza llena.',
      more: 'Cuando la mente corre demasiado, cuesta descansar, concentrarse o incluso decidir qué hacer primero. Eso no significa que algo ande mal contigo. Tu cabeza solo recibió demasiada información de golpe.',
      tipsIntro: 'Para bajar el ruido en tu cabeza, prueba estas 3 ideas simples:',
      affirmation: 'Hoy dejo que mi mente se calme y elijo lo que de verdad importa.',
      action1: { title: 'Aléjate 20 minutos de las pantallas', desc: 'Deja el teléfono a un lado mientras comes o descansas. Menos información le da espacio a tu cabeza para respirar.' },
      action2: { title: 'Escribe tus pensamientos en papel', desc: 'Sacar los pensamientos de la cabeza ayuda a ver lo que de verdad importa y lo que puede esperar.' },
      action3: { title: 'Ten una charla ligera', desc: 'Habla de algo alegre con alguien que quieres, en vez de repasar otra vez tu lista de tareas.' },
      vibe: 'Una mente curiosa que necesita descansar',
      advice: 'No todo pensamiento tiene que convertirse en acción hoy. Disfruta el silencio cuando puedas.',
      baseEnergy: 89,
    },
    Água: {
      cause: 'Puedes sentirlo todo un poco más fuerte hoy, sobre todo lo que sienten los demás.',
      trigger: 'Las conversaciones pesadas o el cuerpo cansado pueden hacer que cargues los problemas de otros.',
      more: 'Cuando sentimos mucho, es fácil cansarse sin saber por qué, o asumir preocupaciones que no son nuestras. Eso no es debilidad. Muestra que te importa. Solo hay que equilibrarlo cuidándote también a ti.',
      tipsIntro: 'Para proteger tu paz y sentirte más ligero, prueba estas 3 ideas simples:',
      affirmation: 'Hoy cuido mi corazón con la misma amabilidad con la que cuido a los demás.',
      action1: { title: 'Guarda un espacio para ti', desc: 'Recuerda: lo que es de los demás es de ellos. Puedes escuchar sin cargar con todo.' },
      action2: { title: 'Date una ducha tibia', desc: 'El agua tibia y la ropa cómoda ayudan al cuerpo a soltar la tensión del día.' },
      action3: { title: 'Di un “no” amable si sientes cansancio', desc: 'Descansar no es egoísmo. Así recuperas la fuerza para estar presente para los demás.' },
      vibe: 'Un corazón sensible que pide cariño',
      advice: 'Eres generoso con los demás. Sé igual de amable contigo hoy.',
      baseEnergy: 84,
    },
  },
};

// Extra tip sets for strong feelings that go beyond the Moon's element (heavy day, short fuse, need for affection).
const EXTRA_TRIGGERS: Record<ReadingLang, Record<string, TriggerText>> = {
  en: {
    Pesado: {
      cause: 'You may feel heavy, tired or alone today.',
      trigger: 'Feeling that you have to carry everything can make small tasks feel huge.',
      more: '',
      tipsIntro: 'To feel a little lighter, try these 3 simple ideas:',
      affirmation: 'Today I am allowed to rest, and I do not have to carry everything alone.',
      action1: { title: 'Lower the bar for today', desc: 'Do only what really has to be done today. The rest can wait, and that is okay.' },
      action2: { title: 'Tell one person how you feel', desc: 'Pick someone you trust and say it in one sentence. You do not have to explain everything.' },
      action3: { title: 'Do one small kind thing for yourself', desc: 'A warm drink, a song you love or ten minutes outside can soften a heavy day.' },
      vibe: 'A heavy day that needs gentleness',
      advice: 'Being tired does not mean you are failing. It means you have been carrying a lot.',
      baseEnergy: 70,
    },
    Irrita: {
      cause: 'Your patience may be very short today.',
      trigger: 'Small things, like a slow reply or a noisy place, may set you off more than usual.',
      more: '',
      tipsIntro: 'To stay calm when everything irritates you, try these 3 simple ideas:',
      affirmation: 'Today I pause before I react, and I choose my words.',
      action1: { title: 'Step away for two minutes', desc: 'Before you answer, leave the room or look out of a window and breathe slowly. The first reaction passes quickly.' },
      action2: { title: 'Let your body burn it off', desc: 'A fast walk or a few flights of stairs gives that tension somewhere to go.' },
      action3: { title: 'Say what bothers you later, in one calm sentence', desc: 'When you are less heated it is easier to be heard, and you will not regret what you said.' },
      vibe: 'Strong energy that needs a pause',
      advice: 'You can feel angry and still choose kind words.',
      baseEnergy: 90,
    },
    Afeto: {
      cause: 'You may need more affection and attention than usual today.',
      trigger: 'Small things from people you love can hurt more than they should.',
      more: '',
      tipsIntro: 'To feel closer and more at ease, try these 3 simple ideas:',
      affirmation: 'Today I ask for what I need, with kindness.',
      action1: { title: 'Ask for what you need in one simple sentence', desc: 'Instead of waiting for others to guess, say "I could use a hug today" or "Can we talk later?".' },
      action2: { title: 'Send a kind message to someone you love', desc: 'A short message of care often brings the same kindness back to you.' },
      action3: { title: 'Do not read hidden meanings', desc: 'If something someone said hurt you, ask what they meant before deciding what it was.' },
      vibe: 'A tender heart that wants closeness',
      advice: 'Needing affection is human. Asking for it is a strength.',
      baseEnergy: 82,
    },
  },
  pt: {
    Pesado: {
      cause: 'Você pode estar se sentindo pesado, cansado ou sozinho hoje.',
      trigger: 'A sensação de que você tem que carregar tudo pode fazer tarefas pequenas parecerem enormes.',
      more: '',
      tipsIntro: 'Para se sentir um pouco mais leve, experimente estas 3 ideias simples:',
      affirmation: 'Hoje eu posso descansar, e não preciso carregar tudo sozinho.',
      action1: { title: 'Baixe a régua por hoje', desc: 'Faça só o que realmente precisa ser feito hoje. O resto pode esperar, e tudo bem.' },
      action2: { title: 'Conte a uma pessoa como você está', desc: 'Escolha alguém de confiança e diga em uma frase. Você não precisa explicar tudo.' },
      action3: { title: 'Faça uma coisinha boa por você', desc: 'Uma bebida quente, uma música que você ama ou dez minutos ao ar livre amaciam um dia pesado.' },
      vibe: 'Um dia pesado que pede gentileza',
      advice: 'Estar cansado não quer dizer que você está falhando. Quer dizer que você vem carregando muita coisa.',
      baseEnergy: 70,
    },
    Irrita: {
      cause: 'Sua paciência pode estar bem curta hoje.',
      trigger: 'Coisas pequenas, como uma resposta demorada ou um lugar barulhento, podem tirar você do sério mais que o normal.',
      more: '',
      tipsIntro: 'Para manter a calma quando tudo irrita, experimente estas 3 ideias simples:',
      affirmation: 'Hoje eu respiro antes de reagir e escolho as minhas palavras.',
      action1: { title: 'Afaste-se por dois minutos', desc: 'Antes de responder, saia da sala ou olhe pela janela e respire devagar. A primeira reação passa rápido.' },
      action2: { title: 'Deixe o corpo queimar essa tensão', desc: 'Uma caminhada rápida ou alguns lances de escada dão um destino para essa tensão.' },
      action3: { title: 'Diga o que incomoda depois, em uma frase calma', desc: 'Com a cabeça mais fria é mais fácil ser ouvido, e você não se arrepende do que disse.' },
      vibe: 'Energia forte que pede uma pausa',
      advice: 'Você pode sentir raiva e ainda assim escolher palavras gentis.',
      baseEnergy: 90,
    },
    Afeto: {
      cause: 'Você pode precisar de mais carinho e atenção que o normal hoje.',
      trigger: 'Pequenas coisas de quem você ama podem machucar mais do que deveriam.',
      more: '',
      tipsIntro: 'Para se sentir mais perto e mais tranquilo, experimente estas 3 ideias simples:',
      affirmation: 'Hoje eu peço o que preciso, com gentileza.',
      action1: { title: 'Peça o que precisa em uma frase simples', desc: 'Em vez de esperar que adivinhem, diga "hoje eu queria um abraço" ou "podemos conversar mais tarde?".' },
      action2: { title: 'Mande uma mensagem carinhosa para alguém que você ama', desc: 'Uma mensagem curta de cuidado costuma trazer o mesmo carinho de volta para você.' },
      action3: { title: 'Não procure segundas intenções', desc: 'Se algo que alguém disse machucou, pergunte o que a pessoa quis dizer antes de decidir o que foi.' },
      vibe: 'Um coração terno que quer proximidade',
      advice: 'Precisar de carinho é humano. Pedir é uma força.',
      baseEnergy: 82,
    },
  },
  es: {
    Pesado: {
      cause: 'Puedes sentirte pesado, cansado o solo hoy.',
      trigger: 'La sensación de tener que cargar con todo puede hacer que las tareas pequeñas parezcan enormes.',
      more: '',
      tipsIntro: 'Para sentirte un poco más ligero, prueba estas 3 ideas simples:',
      affirmation: 'Hoy puedo descansar, y no tengo que cargar con todo yo solo.',
      action1: { title: 'Baja la vara por hoy', desc: 'Haz solo lo que de verdad hay que hacer hoy. Lo demás puede esperar, y está bien.' },
      action2: { title: 'Cuéntale a una persona cómo estás', desc: 'Elige a alguien de confianza y dilo en una frase. No tienes que explicarlo todo.' },
      action3: { title: 'Haz una cosita buena por ti', desc: 'Una bebida caliente, una canción que amas o diez minutos al aire libre suavizan un día pesado.' },
      vibe: 'Un día pesado que pide amabilidad',
      advice: 'Estar cansado no significa que estés fallando. Significa que has cargado mucho.',
      baseEnergy: 70,
    },
    Irrita: {
      cause: 'Tu paciencia puede estar muy corta hoy.',
      trigger: 'Cosas pequeñas, como una respuesta lenta o un lugar ruidoso, pueden sacarte de quicio más de lo normal.',
      more: '',
      tipsIntro: 'Para mantener la calma cuando todo irrita, prueba estas 3 ideas simples:',
      affirmation: 'Hoy respiro antes de reaccionar y elijo mis palabras.',
      action1: { title: 'Aléjate dos minutos', desc: 'Antes de responder, sal de la habitación o mira por la ventana y respira despacio. La primera reacción pasa rápido.' },
      action2: { title: 'Deja que el cuerpo queme esa tensión', desc: 'Una caminata rápida o unas escaleras le dan a esa tensión un lugar a dónde ir.' },
      action3: { title: 'Di lo que te molesta después, en una frase tranquila', desc: 'Con la cabeza más fría es más fácil que te escuchen, y no te arrepentirás de lo que dijiste.' },
      vibe: 'Energía fuerte que pide una pausa',
      advice: 'Puedes sentir rabia y aun así elegir palabras amables.',
      baseEnergy: 90,
    },
    Afeto: {
      cause: 'Puedes necesitar más cariño y atención de lo normal hoy.',
      trigger: 'Pequeñas cosas de quienes quieres pueden doler más de lo debido.',
      more: '',
      tipsIntro: 'Para sentirte más cerca y más tranquilo, prueba estas 3 ideas simples:',
      affirmation: 'Hoy pido lo que necesito, con amabilidad.',
      action1: { title: 'Pide lo que necesitas en una frase simple', desc: 'En vez de esperar a que adivinen, di "hoy me vendría bien un abrazo" o "¿podemos hablar más tarde?".' },
      action2: { title: 'Manda un mensaje cariñoso a alguien que quieres', desc: 'Un mensaje corto de cariño suele traer el mismo cariño de vuelta.' },
      action3: { title: 'No busques segundas intenciones', desc: 'Si algo que dijeron te dolió, pregunta qué quisieron decir antes de decidir lo que fue.' },
      vibe: 'Un corazón tierno que quiere cercanía',
      advice: 'Necesitar cariño es humano. Pedirlo es una fortaleza.',
      baseEnergy: 82,
    },
  },
};

function triggerSet(lang: ReadingLang, key: string): TriggerText {
  const l = ROUTINE_TRIGGERS[lang] ? lang : 'en';
  return EXTRA_TRIGGERS[l][key] || ROUTINE_TRIGGERS[l][key] || ROUTINE_TRIGGERS[l].Ar;
}

const SIGN_NAMES: Record<ReadingLang, Record<string, string>> = {
  pt: {},
  en: { aries: 'Aries', touro: 'Taurus', gemeos: 'Gemini', cancer: 'Cancer', leao: 'Leo', virgem: 'Virgo', libra: 'Libra', escorpiao: 'Scorpio', sagitario: 'Sagittarius', capricornio: 'Capricorn', aquario: 'Aquarius', peixes: 'Pisces' },
  es: { aries: 'Aries', touro: 'Tauro', gemeos: 'Géminis', cancer: 'Cáncer', leao: 'Leo', virgem: 'Virgo', libra: 'Libra', escorpiao: 'Escorpio', sagitario: 'Sagitario', capricornio: 'Capricornio', aquario: 'Acuario', peixes: 'Piscis' },
};

const PHASE_NAMES: Record<ReadingLang, Record<string, string>> = {
  pt: {},
  en: { 'Lua Nova': 'New Moon', 'Lua Crescente': 'Growing Moon', 'Lua Cheia': 'Full Moon', 'Lua Minguante': 'Fading Moon' },
  es: { 'Lua Nova': 'Luna Nueva', 'Lua Crescente': 'Luna Creciente', 'Lua Cheia': 'Luna Llena', 'Lua Minguante': 'Luna Menguante' },
};

export function signNameIn(sign: CelestialPosition, lang: ReadingLang): string {
  return SIGN_NAMES[lang][sign.signKey] || sign.sign;
}

export function phaseNameIn(phase: string, lang: ReadingLang): string {
  return PHASE_NAMES[lang][phase] || phase;
}

/**
 * Camada 02: Consulta estruturada de Gatilhos da Rotina
 */
export function queryAurenstarEngine(triad: AstronomicalTriad, lang: ReadingLang = 'en', need?: string | null): RoutineTriggerData {
  const config = triggerSet(lang, need || triad.todayMoon.element);

  return {
    primaryCause: config.cause,
    hiddenTrigger: config.trigger,
    practicalActions: [
      { title: config.action1.title, description: config.action1.desc, iconType: 'check' },
      { title: config.action2.title, description: config.action2.desc, iconType: 'heart' },
      { title: config.action3.title, description: config.action3.desc, iconType: 'sparkles' },
    ],
    emotionalEnergy: config.baseEnergy,
    dominantVibe: config.vibe,
    mindfulAdvice: config.advice,
  };
}


const READING_COPY: Record<ReadingLang, {
  fallbackName: string;
  intro: (name: string) => string;
  q2: string;
  affirmation: string;
  note: string;
}> = {
  en: {
    fallbackName: 'Friend',
    intro: (n) => `${n},`,
    q2: 'Here are 3 easy things you can do today. Each one takes only a few minutes:',
    affirmation: 'Today I choose calm over rush, I take care of my routine and I trust my own pace.',
    note: 'This reading is a gentle idea from Aurenstar, based on the sky on your birthday and today. It is here to help you reflect, not to predict anything.',
  },
  pt: {
    fallbackName: 'Amigo(a)',
    intro: (n) => `${n},`,
    q2: 'Aqui vão 3 coisas fáceis para fazer hoje. Cada uma leva só alguns minutinhos:',
    affirmation: 'Hoje eu escolho a calma no lugar da pressa, cuido da minha rotina e confio no meu ritmo.',
    note: 'Esta leitura é uma ideia gentil da Aurenstar, baseada no céu do dia em que você nasceu e no de hoje. Ela serve para você refletir, não para prever nada.',
  },
  es: {
    fallbackName: 'Amigo(a)',
    intro: (n) => `${n},`,
    q2: 'Aquí tienes 3 cosas fáciles para hacer hoy. Cada una toma solo unos minutos:',
    affirmation: 'Hoy elijo la calma en lugar de la prisa, cuido mi rutina y confío en mi ritmo.',
    note: 'Esta lectura es una idea amable de Aurenstar, basada en el cielo del día en que naciste y el de hoy. Sirve para reflexionar, no para predecir nada.',
  },
};

/**
 * Camada 03: Interpretador (texto simples, sem jargão) — usado quando a IA não está disponível
 */
export function generateLocalAurenEffectReading(
  userName: string,
  birthDateFormatted: string,
  birthTimeFormatted: string,
  birthCity: string,
  triad: AstronomicalTriad,
  trigger: RoutineTriggerData,
  lang: ReadingLang = 'en',
  facts?: SkyFacts
): AurenEffectResult {
  const copy = READING_COPY[lang] || READING_COPY.en;
  const name = (userName?.trim().split(/\s+/)[0]) || copy.fallbackName;

  const signals = buildSignals(facts || factsFromTriad(triad), lang, triad.todayMoon.phase);
  const text = triggerSet(lang, signals.need || triad.todayMoon.element);
  const lc = (t: string) => t.charAt(0).toLowerCase() + t.slice(1);
  // Paragraph 1: what today feels like + the strongest thing happening inside. Paragraph 2: the deeper need + the next one.
  const lead = signals.aspects[0]?.text;
  const p1 = lead
    ? `${copy.intro(name)} ${lc(lead)} ${signals.todayMoon}`
    : `${copy.intro(name)} ${lc(signals.todayMoon)}`;
  const p2 = [signals.natalMoon, signals.aspects[1]?.text || signals.phase, signals.mercuryRetro].filter(Boolean).join(' ');
  const question1Answer = `${p1}\n\n${p2}`;

  const practicalSteps = trigger.practicalActions.map((a, i) => ({
    stepNumber: i + 1,
    title: a.title,
    action: a.description,
  }));

  return {
    userName: name,
    birthCity,
    birthDateFormatted,
    birthTimeFormatted,
    astronomy: triad,
    routineTrigger: trigger,
    question1Answer,
    question2Answer: text.tipsIntro,
    practicalSteps,
    affirmation: text.affirmation,
    transparencyNote: copy.note,
    headline: signals.title,
    generatedByAI: false,
  };
}
