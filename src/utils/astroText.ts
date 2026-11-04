/** Plain-words sentences for the compatibility and sky-today pages (English / Portuguese / Spanish). */
export type Lang = 'en' | 'pt' | 'es';
type L3 = Record<Lang, string>;

const PLANET: Record<string, L3> = {
  sun: { en: 'Sun', pt: 'Sol', es: 'Sol' },
  moon: { en: 'Moon', pt: 'Lua', es: 'Luna' },
  mercury: { en: 'Mercury', pt: 'Mercúrio', es: 'Mercurio' },
  venus: { en: 'Venus', pt: 'Vênus', es: 'Venus' },
  mars: { en: 'Mars', pt: 'Marte', es: 'Marte' },
  jupiter: { en: 'Jupiter', pt: 'Júpiter', es: 'Júpiter' },
  saturn: { en: 'Saturn', pt: 'Saturno', es: 'Saturno' },
  uranus: { en: 'Uranus', pt: 'Urano', es: 'Urano' },
  neptune: { en: 'Neptune', pt: 'Netuno', es: 'Neptuno' },
  pluto: { en: 'Pluto', pt: 'Plutão', es: 'Plutón' },
};
export const planetName = (p: string, l: Lang) => PLANET[p]?.[l] ?? p;

/** What each planet is about, in everyday words. */
const THEME: Record<string, L3> = {
  sun: { en: 'your energy and who you are', pt: 'sua energia e quem você é', es: 'tu energía y quién eres' },
  moon: { en: 'your feelings and mood', pt: 'seus sentimentos e humor', es: 'tus sentimientos y ánimo' },
  mercury: { en: 'how you think and talk', pt: 'como você pensa e conversa', es: 'cómo piensas y hablas' },
  venus: { en: 'love, taste and money', pt: 'amor, gostos e dinheiro', es: 'amor, gustos y dinero' },
  mars: { en: 'your drive and courage', pt: 'sua disposição e coragem', es: 'tu impulso y valentía' },
  jupiter: { en: 'luck and growth', pt: 'sorte e crescimento', es: 'suerte y crecimiento' },
  saturn: { en: 'discipline and responsibility', pt: 'disciplina e responsabilidade', es: 'disciplina y responsabilidad' },
  uranus: { en: 'surprises and change', pt: 'surpresas e mudanças', es: 'sorpresas y cambios' },
  neptune: { en: 'dreams and intuition', pt: 'sonhos e intuição', es: 'sueños e intuición' },
  pluto: { en: 'deep transformation', pt: 'transformação profunda', es: 'transformación profunda' },
};
export const themeOf = (p: string, l: Lang) => THEME[p]?.[l] ?? '';

/** Pairs of planets between two people: what that meeting is about. */
const PAIR: Record<string, L3> = {
  'sun|moon': { en: 'how you complete each other', pt: 'como vocês se completam', es: 'cómo se complementan' },
  'sun|sun': { en: 'who you are and what you want from life', pt: 'quem vocês são e o que querem da vida', es: 'quiénes son y qué quieren de la vida' },
  'moon|moon': { en: 'how you feel and care for each other', pt: 'como vocês sentem e cuidam um do outro', es: 'cómo sienten y se cuidan' },
  'venus|mars': { en: 'attraction and chemistry', pt: 'atração e química', es: 'atracción y química' },
  'venus|venus': { en: 'what you enjoy and how you show love', pt: 'o que vocês gostam e como demonstram amor', es: 'lo que disfrutan y cómo muestran amor' },
  'mars|mars': { en: 'how you act, decide and argue', pt: 'como vocês agem, decidem e discutem', es: 'cómo actúan, deciden y discuten' },
  'mercury|mercury': { en: 'how you talk and understand each other', pt: 'como vocês conversam e se entendem', es: 'cómo conversan y se entienden' },
  'sun|venus': { en: 'admiration and warmth', pt: 'admiração e carinho', es: 'admiración y cariño' },
  'moon|venus': { en: 'tenderness and comfort', pt: 'ternura e acolhimento', es: 'ternura y consuelo' },
  'sun|mercury': { en: 'being heard and understood', pt: 'serem ouvidos e compreendidos', es: 'ser escuchados y comprendidos' },
  'moon|mercury': { en: 'talking about feelings', pt: 'conversar sobre sentimentos', es: 'hablar de los sentimientos' },
  'sun|mars': { en: 'motivating each other and your energy together', pt: 'a motivação e a energia de vocês juntos', es: 'la motivación y la energía de ustedes juntos' },
  'moon|mars': { en: 'how you react to each other emotionally', pt: 'como vocês reagem emocionalmente um ao outro', es: 'cómo reaccionan emocionalmente el uno al otro' },
  'venus|mercury': { en: 'sweet words and flirting', pt: 'palavras doces e flerte', es: 'palabras dulces y coqueteo' },
  'saturn|sun': { en: 'commitment and seriousness', pt: 'compromisso e seriedade', es: 'compromiso y seriedad' },
  'saturn|moon': { en: 'emotional security', pt: 'segurança emocional', es: 'seguridad emocional' },
  'saturn|venus': { en: 'loyalty and long-term love', pt: 'lealdade e amor duradouro', es: 'lealtad y amor duradero' },
};
function pairTheme(a: string, b: string, l: Lang): string {
  const known = (PAIR[`${a}|${b}`] || PAIR[`${b}|${a}`])?.[l];
  if (known) return known;
  // unlisted pair: name the two planets and the theme of the slower one (e.g. "Sun + Jupiter (luck and growth)")
  const slow = ['sun', 'moon'].includes(b) ? a : b;
  return `${planetName(a, l)} + ${planetName(b, l)} (${themeOf(slow, l)})`;
}

const AREA: Record<string, L3> = {
  love: { en: 'Love', pt: 'Amor', es: 'Amor' },
  mind: { en: 'Talking & thinking', pt: 'Conversa e ideias', es: 'Conversación e ideas' },
  emotions: { en: 'Feelings', pt: 'Sentimentos', es: 'Sentimientos' },
  energy: { en: 'Energy & action', pt: 'Energia e ação', es: 'Energía y acción' },
};
export const areaName = (a: string, l: Lang) => AREA[a]?.[l] ?? a;

export function compatVerdict(score: number, l: Lang): string {
  const v: [number, L3][] = [
    [85, { en: 'A very natural match', pt: 'Uma combinação muito natural', es: 'Una combinación muy natural' }],
    [72, { en: 'A warm, easy match', pt: 'Uma combinação leve e acolhedora', es: 'Una combinación cálida y fácil' }],
    [58, { en: 'A match with spark and learning', pt: 'Uma combinação com faísca e aprendizado', es: 'Una combinación con chispa y aprendizaje' }],
    [0, { en: 'A match that asks for patience', pt: 'Uma combinação que pede paciência', es: 'Una combinación que pide paciencia' }],
  ];
  return v.find(([min]) => score >= min)![1][l];
}

const STRONG_END: L3[] = [
  { en: 'a natural strength between you.', pt: 'um ponto forte natural entre vocês.', es: 'una fortaleza natural entre ustedes.' },
  { en: 'this tends to come easily to you two.', pt: 'isso costuma vir fácil para vocês dois.', es: 'esto suele venir fácil para ustedes dos.' },
  { en: 'a gift you share.', pt: 'um presente que vocês compartilham.', es: 'un regalo que comparten.' },
];
const CARE_END: L3[] = [
  { en: 'worth a little extra care, so go gently.', pt: 'merece um pouco mais de cuidado, então vão com calma.', es: 'merece un poco más de cuidado, así que vayan con calma.' },
  { en: 'a place where patience helps a lot.', pt: 'um ponto em que a paciência ajuda muito.', es: 'un punto donde la paciencia ayuda mucho.' },
  { en: 'a chance to learn from each other.', pt: 'uma chance de aprenderem um com o outro.', es: 'una oportunidad de aprender el uno del otro.' },
];
export function strongLine(a: string, b: string, l: Lang, i = 0): string {
  return `${cap(pairTheme(a, b, l))} — ${STRONG_END[i % STRONG_END.length][l]}`;
}
export function careLine(a: string, b: string, l: Lang, i = 0): string {
  return `${cap(pairTheme(a, b, l))} — ${CARE_END[i % CARE_END.length][l]}`;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Sky-today: what a planet meeting a part of your birth chart feels like. */
export function transitLine(transit: string, natal: string, type: string, l: Lang): string {
  const tense = type === 'square' || type === 'opposition' || type === 'quincunx';
  const strong = type === 'conjunction';
  const tp = planetName(transit, l);
  const nt = themeOf(natal, l);
  const tt = themeOf(transit, l);
  const mood = tense
    ? { en: 'a bit of tension: go slowly and be patient', pt: 'um pouco de tensão: vá devagar e tenha paciência', es: 'algo de tensión: ve despacio y ten paciencia' }
    : strong
    ? { en: 'a strong, focused moment', pt: 'um momento forte e de foco', es: 'un momento fuerte y de enfoque' }
    : { en: 'things flow in your favor', pt: 'as coisas fluem a seu favor', es: 'las cosas fluyen a tu favor' };
  return {
    en: `${tp} (${tt}) touches ${nt}: ${mood.en}.`,
    pt: `${tp} (${tt}) toca ${nt}: ${mood.pt}.`,
    es: `${tp} (${tt}) toca ${nt}: ${mood.es}.`,
  }[l];
}

export function retrogradeLine(p: string, l: Lang): string {
  const n = planetName(p, l);
  const t = themeOf(p, l);
  return {
    en: `${n} seems to move backward: take extra care with ${t}.`,
    pt: `${n} parece andar para trás: tenha cuidado extra com ${t}.`,
    es: `${n} parece ir hacia atrás: ten un cuidado extra con ${t}.`,
  }[l];
}

const SIGN: Record<string, L3> = {
  Aries: { en: 'Aries', pt: 'Áries', es: 'Aries' }, Taurus: { en: 'Taurus', pt: 'Touro', es: 'Tauro' }, Gemini: { en: 'Gemini', pt: 'Gêmeos', es: 'Géminis' },
  Cancer: { en: 'Cancer', pt: 'Câncer', es: 'Cáncer' }, Leo: { en: 'Leo', pt: 'Leão', es: 'Leo' }, Virgo: { en: 'Virgo', pt: 'Virgem', es: 'Virgo' },
  Libra: { en: 'Libra', pt: 'Libra', es: 'Libra' }, Scorpio: { en: 'Scorpio', pt: 'Escorpião', es: 'Escorpio' }, Sagittarius: { en: 'Sagittarius', pt: 'Sagitário', es: 'Sagitario' },
  Capricorn: { en: 'Capricorn', pt: 'Capricórnio', es: 'Capricornio' }, Aquarius: { en: 'Aquarius', pt: 'Aquário', es: 'Acuario' }, Pisces: { en: 'Pisces', pt: 'Peixes', es: 'Piscis' },
};
export const signName = (s: string, l: Lang) => SIGN[s]?.[l] ?? s;
