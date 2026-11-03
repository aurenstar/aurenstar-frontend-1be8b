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
      action1: { title: 'Pick just one thing to finish', desc: 'Choose the most important task and finish it before lunch. The rest can wait.' },
      action2: { title: 'Move a little', desc: 'Take a 10-minute walk or stretch. It helps let go of the rush.' },
      action3: { title: 'Pause before you reply', desc: 'Count to five before answering a message. You will sound kinder.' },
      vibe: 'Lots of energy that needs a little calm',
      advice: 'Going slowly is not wasting time. It is building things that last.',
      baseEnergy: 92,
    },
    Terra: {
      cause: 'You may want things to be calm, safe and in their place today.',
      trigger: 'A last-minute change or a surprise message can upset you more than usual.',
      action1: { title: 'Tidy one small space', desc: 'Clean your desk or your bedside table for 5 minutes. It clears your mind too.' },
      action2: { title: 'Take a quiet break', desc: 'Sit down with a tea or a glass of water, and leave your phone aside for a while.' },
      action3: { title: 'Let plans change', desc: 'If something does not go as planned, take a deep breath and be kind to yourself.' },
      vibe: 'A steady day that needs a bit of flexibility',
      advice: 'Your strength is patience. Give things time to fall into place.',
      baseEnergy: 86,
    },
    Ar: {
      cause: 'Your mind may be busy today, with many thoughts and ideas at the same time.',
      trigger: 'Too many open tabs, notifications and conversations can leave your head feeling full.',
      action1: { title: 'Stay away from screens for 20 minutes', desc: 'Put your phone away while you eat, and let your mind rest.' },
      action2: { title: 'Write your worries on paper', desc: 'Getting thoughts out of your head makes it easier to see what really matters.' },
      action3: { title: 'Have a light chat', desc: 'Talk about something happy with someone you like, instead of going over your to-do list.' },
      vibe: 'A curious mind that needs some rest',
      advice: 'Not every thought needs to become action today. Enjoy some quiet when you can.',
      baseEnergy: 89,
    },
    Água: {
      cause: 'You may feel everything a little deeper today, especially what other people feel.',
      trigger: 'Heavy conversations or a tired body can make you carry other people’s problems.',
      action1: { title: 'Keep a little space for yourself', desc: 'Remind yourself: what belongs to others is theirs. Take care of your own peace.' },
      action2: { title: 'Take a warm shower', desc: 'Warm water and comfy clothes help you relax and feel better.' },
      action3: { title: 'Say a kind “no” if you are tired', desc: 'Resting is not selfish. It is taking care of yourself.' },
      vibe: 'A gentle heart that needs care',
      advice: 'You are generous with others. Be just as gentle with yourself today.',
      baseEnergy: 84,
    },
  },
  pt: {
    Fogo: {
      cause: 'Você pode estar com muita energia e com pressa para resolver tudo.',
      trigger: 'Tudo ao redor pode parecer devagar demais, e esperar pode ser difícil hoje.',
      action1: { title: 'Escolha só uma coisa para terminar', desc: 'Pegue a tarefa mais importante e termine antes do almoço. O resto pode esperar.' },
      action2: { title: 'Mexa o corpo um pouquinho', desc: 'Faça uma caminhada ou um alongamento de 10 minutos. Ajuda a soltar a pressa.' },
      action3: { title: 'Espere um pouco antes de responder', desc: 'Conte até cinco antes de responder uma mensagem. Você vai soar mais gentil.' },
      vibe: 'Muita energia que precisa de um pouco de calma',
      advice: 'Ir devagar não é perder tempo. É construir coisas que duram.',
      baseEnergy: 92,
    },
    Terra: {
      cause: 'Você pode querer que tudo esteja calmo, seguro e no seu lugar hoje.',
      trigger: 'Uma mudança de última hora ou uma mensagem inesperada pode incomodar mais do que o normal.',
      action1: { title: 'Arrume um cantinho pequeno', desc: 'Organize sua mesa ou seu criado-mudo por 5 minutos. Isso clareia a mente também.' },
      action2: { title: 'Faça uma pausa tranquila', desc: 'Sente com um chá ou um copo de água e deixe o celular de lado por um tempinho.' },
      action3: { title: 'Deixe os planos mudarem', desc: 'Se algo não sair como o planejado, respire fundo e seja gentil com você.' },
      vibe: 'Um dia firme que pede um pouco de jogo de cintura',
      advice: 'Sua força é a paciência. Dê tempo para as coisas se ajeitarem.',
      baseEnergy: 86,
    },
    Ar: {
      cause: 'Sua mente pode estar agitada hoje, com muitos pensamentos e ideias ao mesmo tempo.',
      trigger: 'Muitas abas abertas, notificações e conversas podem deixar a cabeça cheia.',
      action1: { title: 'Fique 20 minutos longe das telas', desc: 'Deixe o celular de lado enquanto come e deixe a mente descansar.' },
      action2: { title: 'Escreva suas preocupações no papel', desc: 'Tirar os pensamentos da cabeça ajuda a ver o que realmente importa.' },
      action3: { title: 'Bata um papo leve', desc: 'Converse sobre algo alegre com alguém que você gosta, em vez de repassar a lista de tarefas.' },
      vibe: 'Uma mente curiosa que precisa descansar',
      advice: 'Nem todo pensamento precisa virar ação hoje. Aproveite o silêncio quando puder.',
      baseEnergy: 89,
    },
    Água: {
      cause: 'Você pode sentir tudo um pouco mais forte hoje, principalmente o que os outros sentem.',
      trigger: 'Conversas pesadas ou o corpo cansado podem fazer você carregar os problemas dos outros.',
      action1: { title: 'Guarde um espacinho para você', desc: 'Lembre-se: o que é do outro é dele. Cuide da sua paz.' },
      action2: { title: 'Tome um banho morno', desc: 'Água morna e roupa confortável ajudam a relaxar e se sentir melhor.' },
      action3: { title: 'Diga um “não” carinhoso se sentir cansaço', desc: 'Descansar não é egoísmo. É cuidar de você.' },
      vibe: 'Um coração sensível que pede carinho',
      advice: 'Você é generoso com os outros. Seja igualmente gentil com você hoje.',
      baseEnergy: 84,
    },
  },
  es: {
    Fogo: {
      cause: 'Puedes sentirte con mucha energía y con prisa por resolverlo todo.',
      trigger: 'Todo a tu alrededor puede parecer demasiado lento, y esperar puede costar hoy.',
      action1: { title: 'Elige solo una cosa para terminar', desc: 'Toma la tarea más importante y termínala antes del almuerzo. Lo demás puede esperar.' },
      action2: { title: 'Mueve un poquito el cuerpo', desc: 'Camina o estírate 10 minutos. Ayuda a soltar la prisa.' },
      action3: { title: 'Espera un momento antes de responder', desc: 'Cuenta hasta cinco antes de contestar un mensaje. Sonarás más amable.' },
      vibe: 'Mucha energía que necesita un poco de calma',
      advice: 'Ir despacio no es perder tiempo. Es construir cosas que duran.',
      baseEnergy: 92,
    },
    Terra: {
      cause: 'Puede que hoy quieras que todo esté tranquilo, seguro y en su lugar.',
      trigger: 'Un cambio de último momento o un mensaje inesperado puede molestarte más de lo normal.',
      action1: { title: 'Ordena un rinconcito', desc: 'Organiza tu escritorio o tu mesita de noche por 5 minutos. También aclara la mente.' },
      action2: { title: 'Haz una pausa tranquila', desc: 'Siéntate con un té o un vaso de agua y deja el teléfono a un lado un rato.' },
      action3: { title: 'Deja que los planes cambien', desc: 'Si algo no sale como lo planeaste, respira hondo y sé amable contigo.' },
      vibe: 'Un día firme que pide un poco de flexibilidad',
      advice: 'Tu fuerza es la paciencia. Dale tiempo a las cosas para acomodarse.',
      baseEnergy: 86,
    },
    Ar: {
      cause: 'Tu mente puede estar agitada hoy, con muchos pensamientos e ideas a la vez.',
      trigger: 'Demasiadas pestañas abiertas, notificaciones y conversaciones pueden dejarte la cabeza llena.',
      action1: { title: 'Aléjate 20 minutos de las pantallas', desc: 'Deja el teléfono a un lado mientras comes y deja descansar a tu mente.' },
      action2: { title: 'Escribe tus preocupaciones en papel', desc: 'Sacar los pensamientos de la cabeza ayuda a ver lo que de verdad importa.' },
      action3: { title: 'Ten una charla ligera', desc: 'Habla de algo alegre con alguien que quieres, en vez de repasar tu lista de tareas.' },
      vibe: 'Una mente curiosa que necesita descansar',
      advice: 'No todo pensamiento tiene que convertirse en acción hoy. Disfruta el silencio cuando puedas.',
      baseEnergy: 89,
    },
    Água: {
      cause: 'Puedes sentirlo todo un poco más fuerte hoy, sobre todo lo que sienten los demás.',
      trigger: 'Las conversaciones pesadas o el cuerpo cansado pueden hacer que cargues los problemas de otros.',
      action1: { title: 'Guarda un espacio para ti', desc: 'Recuerda: lo que es de los demás es de ellos. Cuida tu paz.' },
      action2: { title: 'Date una ducha tibia', desc: 'El agua tibia y la ropa cómoda ayudan a relajarte y sentirte mejor.' },
      action3: { title: 'Di un “no” amable si sientes cansancio', desc: 'Descansar no es egoísmo. Es cuidarte.' },
      vibe: 'Un corazón sensible que pide cariño',
      advice: 'Eres generoso con los demás. Sé igual de amable contigo hoy.',
      baseEnergy: 84,
    },
  },
};

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
export function queryAurenstarEngine(triad: AstronomicalTriad, lang: ReadingLang = 'en'): RoutineTriggerData {
  const table = ROUTINE_TRIGGERS[lang] || ROUTINE_TRIGGERS.en;
  const config = table[triad.todayMoon.element] || table.Ar;

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
  lang: ReadingLang = 'en'
): AurenEffectResult {
  const copy = READING_COPY[lang] || READING_COPY.en;
  const name = (userName?.trim().split(/\s+/)[0]) || copy.fallbackName;

  const question1Answer = `${copy.intro(name)} ${trigger.primaryCause.charAt(0).toLowerCase()}${trigger.primaryCause.slice(1)} ${trigger.hiddenTrigger}`;

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
    question2Answer: copy.q2,
    practicalSteps,
    affirmation: copy.affirmation,
    transparencyNote: copy.note,
    generatedByAI: false,
  };
}
