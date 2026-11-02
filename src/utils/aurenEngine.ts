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
const ROUTINE_TRIGGERS: Record<string, {
  cause: string;
  trigger: string;
  action1: { title: string; desc: string };
  action2: { title: string; desc: string };
  action3: { title: string; desc: string };
  vibe: string;
  advice: string;
  baseEnergy: number;
}> = {
  Fogo: {
    cause: 'Uma inquietação positiva por começar coisas novas ou resolver tudo de uma vez.',
    trigger: 'A sensação de que o tempo está passando rápido demais ou que as pessoas ao redor estão em um ritmo mais lento.',
    action1: { title: 'Escolha uma única prioridade hoje', desc: 'Em vez de tentar abraçar dez coisas, termine uma pendência importante antes do almoço.' },
    action2: { title: 'Movimente seu corpo por 10 minutos', desc: 'Uma caminhada leve ou alongamento ajuda a descarregar a pressa acumulada nos ombros.' },
    action3: { title: 'Respire antes de responder mensagens', desc: 'Espere alguns segundos antes de digitar para falar com mais tranquilidade e carinho.' },
    vibe: 'Entusiasmo ativo que pede foco consciente',
    advice: 'Lembre-se: ter calma não significa perder tempo; significa construir com firmeza.',
    baseEnergy: 92,
  },
  Terra: {
    cause: 'Uma forte busca por segurança prática, organização da rotina e estabilidade emocional.',
    trigger: 'Imprevistos no trabalho, mensagens de última hora ou pequenas mudanças de planos que tiram você da zona de conforto.',
    action1: { title: 'Organize seu ambiente imediato', desc: 'Arrumar a mesa ou seu quarto por 5 minutos traz alívio mental imediato.' },
    action2: { title: 'Faça uma pausa para um chá ou água fresca', desc: 'Sente-se confortavelmente sem olhar para o celular e saboreie o momento.' },
    action3: { title: 'Aceite que imprevistos acontecem', desc: 'Se algo sair do roteiro hoje, adapte-se com flexibilidade e gentileza consigo mesmo.' },
    vibe: 'Constância serena que precisa de flexibilidade',
    advice: 'A sua força está na paciência. Dê tempo para que as coisas se ajeitem naturalmente.',
    baseEnergy: 86,
  },
  Ar: {
    cause: 'Uma mente acelerada com excesso de pensamentos, ideias e estímulos digitais ao mesmo tempo.',
    trigger: 'Muitas abas abertas, notificações no celular ou conversas que deixam você com a sensação de cabeça cheia.',
    action1: { title: 'Desconecte-se de telas por 20 minutos', desc: 'Afaste o telefone na hora da refeição para permitir que seu cérebro descanse.' },
    action2: { title: 'Anote suas preocupações em um papel', desc: 'Tirar o que está na sua cabeça e colocar no papel ajuda a clarear as prioridades.' },
    action3: { title: 'Tenha uma conversa leve e descontraída', desc: 'Fale de coisas alegres com alguém querido em vez de ruminar tarefas pendentes.' },
    vibe: 'Curiosidade vibrante que pede descanso mental',
    advice: 'Nem todo pensamento precisa virar uma ação hoje. Escolha o silêncio quando puder.',
    baseEnergy: 89,
  },
  Água: {
    cause: 'Uma sensibilidade profunda aos sentimentos dos outros e uma necessidade de acolhimento interior.',
    trigger: 'Ambientes com conversas pesadas, cansaço acumulado ou a sensação de que você está absorvendo os problemas de todo mundo.',
    action1: { title: 'Crie uma pequena bolha de proteção emocional', desc: 'Lembre-se carinhosamente: o que é do outro pertence a ele, cuide da sua paz.' },
    action2: { title: 'Tome um banho relaxante e vista roupas confortáveis', desc: 'A água morna ajuda a lavar as tensões e renovar a sensação de bem-estar.' },
    action3: { title: 'Diga um “não” carinhoso se sentir cansaço', desc: 'Proteger o seu descanso não é egoísmo, é respeito com a sua saúde.' },
    vibe: 'Empatia doce que pede proteção e carinho',
    advice: 'O seu coração é generoso. Lembre-se de reservar a mesma ternura para você mesmo hoje.',
    baseEnergy: 84,
  },
};

/**
 * Consulta estruturada de Gatilhos da Rotina (Camada 02)
 */
export function queryAurenstarEngine(triad: AstronomicalTriad): RoutineTriggerData {
  // A vibração do dia conecta o Elemento da Lua no Céu de Hoje com o Elemento do Sol/Lua da pessoa
  const todayElement = triad.todayMoon.element;
  const config = ROUTINE_TRIGGERS[todayElement] || ROUTINE_TRIGGERS.Ar;

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

/**
 * Camada 03: Interpretador Comportamental (Fallback Lapidado com Palavras Simples)
 */
export function generateLocalAurenEffectReading(
  userName: string,
  birthDateFormatted: string,
  birthTimeFormatted: string,
  birthCity: string,
  triad: AstronomicalTriad,
  trigger: RoutineTriggerData
): AurenEffectResult {
  const name = userName?.trim() || 'Viajante das Estrelas';
  const sun = triad.sun;
  const moon = triad.moon;
  const asc = triad.ascendant;
  const todayMoon = triad.todayMoon;

  const question1Answer = `${name}, hoje a sua essência natural de ${sun.sign} está dialogando diretamente com a energia da ${todayMoon.phase} em ${todayMoon.sign}. ${trigger.primaryCause} ${trigger.hiddenTrigger}`;

  const question2Answer = `Para transformar esse momento em paz e produtividade suave, o seu Efeito Auren sugere 3 passos fáceis e descomplicados para colocar em prática ainda hoje:`;

  const practicalSteps = [
    {
      stepNumber: 1,
      title: trigger.practicalActions[0].title,
      action: trigger.practicalActions[0].description,
    },
    {
      stepNumber: 2,
      title: trigger.practicalActions[1].title,
      action: trigger.practicalActions[1].description,
    },
    {
      stepNumber: 3,
      title: trigger.practicalActions[2].title,
      action: trigger.practicalActions[2].description,
    },
  ];

  const affirmation = `Hoje eu escolho a calma sobre a pressa, cuido com carinho da minha rotina e confio no meu próprio tempo.`;

  const transparencyNote = `Transparência Aurenstar: As posições astronômicas de Sol em ${sun.sign}, Lua em ${moon.sign}, Ascendente em ${asc.sign} e a Lua de hoje em ${todayMoon.sign} são calculadas com exatidão matemática a partir de fórmulas astronômicas. A correlação com seu humor e rotina é tratada como a hipótese comportamental e reflexiva da Aurenstar para enriquecer o seu bem-estar, sem pretensão científica estrita.`;

  return {
    userName: name,
    birthCity,
    birthDateFormatted,
    birthTimeFormatted,
    astronomy: triad,
    routineTrigger: trigger,
    question1Answer,
    question2Answer,
    practicalSteps,
    affirmation,
    transparencyNote,
    generatedByAI: false,
  };
}
