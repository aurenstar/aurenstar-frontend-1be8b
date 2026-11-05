// Themes of the "Aurenstar Unfiltered" portrait. Each portrait is about ONE area of life and its card title is "<Sign> <label>:"
// (e.g. "Gemini in Love:"). The browser rotates through the themes so a person never gets the same one twice in a row.
export type ThemeKey = 'love' | 'career' | 'friends' | 'home' | 'routine' | 'fun' | 'fights' | 'dreams' | 'first' | 'secret' | 'online' | 'stress' | 'trips' | 'quirks';

export const UNFILTERED_THEMES: { key: ThemeKey; label: { en: string; pt: string; es: string }; brief: string }[] = [
  { key: 'love', label: { en: 'in Love', pt: 'no Amor', es: 'en el Amor' }, brief: 'LOVE and flirting: how they fall in love, flirt, text a crush, act in a relationship, make up after a fight' },
  { key: 'career', label: { en: 'at Work', pt: 'no Trabalho', es: 'en el Trabajo' }, brief: 'CAREER and work or study: how they behave with bosses and colleagues, deadlines, ambition, ideas, procrastination' },
  { key: 'friends', label: { en: 'as a Friend', pt: 'na Amizade', es: 'en la Amistad' }, brief: 'FRIENDSHIP: what kind of friend they are, how they plan hangouts, keep in touch, cancel plans, give advice' },
  { key: 'home', label: { en: 'at Home', pt: 'em Casa', es: 'en Casa' }, brief: 'FAMILY and home: how they act with family, in their room or house, chores, mess or order, comfort habits' },
  { key: 'routine', label: { en: 'Every Day', pt: 'no Dia a Dia', es: 'en el Día a Día' }, brief: 'DAILY ROUTINE: how they wake up, get ready, eat, move around the city, handle a normal Tuesday' },
  { key: 'fun', label: { en: 'on a Night Out', pt: 'no Rolê', es: 'de Fiesta' }, brief: 'FUN and going out: how they party, dance, pick the place, spend weekends, make spontaneous plans' },
  { key: 'fights', label: { en: 'in a Fight', pt: 'na Treta', es: 'en una Pelea' }, brief: 'FIGHTS and hurt feelings: how they argue, get jealous or hurt, apologise, hold grudges, cry or hide emotions' },
  { key: 'dreams', label: { en: 'with Big Dreams', pt: 'nos Sonhos', es: 'con Grandes Sueños' }, brief: 'DREAMS and AMBITION: what they want from life, how they chase goals, start projects, give up and restart, fears they hide' },
  { key: 'first', label: { en: 'at First Sight', pt: 'à Primeira Vista', es: 'a Primera Vista' }, brief: 'FIRST IMPRESSION: how people see them in a room, with strangers, in a group, versus who they really are' },
  { key: 'secret', label: { en: 'Behind the Mask', pt: 'por Trás da Máscara', es: 'Detrás de la Máscara' }, brief: 'THE HIDDEN SIDE: what they never say out loud, what they need to feel safe, what makes them secretly proud or insecure' },
  { key: 'online', label: { en: 'Online', pt: 'na Internet', es: 'en Internet' }, brief: 'PHONE and INTERNET: how they text, scroll, post, reply late, use social networks, stalk or avoid people' },
  { key: 'stress', label: { en: 'Under Pressure', pt: 'sob Pressão', es: 'bajo Presión' }, brief: 'STRESS: what they do when everything goes wrong, how they get overwhelmed, how they recharge, what calms them' },
  { key: 'trips', label: { en: 'on a Trip', pt: 'em Viagem', es: 'de Viaje' }, brief: 'TRAVEL: how they plan or do not plan a trip, pack, get lost, talk to locals, spend the day and handle surprises' },
  { key: 'quirks', label: { en: 'and Their Quirks', pt: 'e suas Manias', es: 'y sus Manías' }, brief: 'QUIRKS: weird little habits, obsessions, rituals, things they always lose or always do, secret talents' },
];

export function themeByKey(key: unknown) {
  return UNFILTERED_THEMES.find((t) => t.key === key);
}

export function themeTitle(signName: string, key: unknown, lang: 'en' | 'pt' | 'es'): string {
  const t = themeByKey(key);
  return t ? `${signName} ${t.label[lang]}:` : `${signName}:`;
}

const STORE = 'aurenstar_unfiltered_themes_v1';

/** Picks a theme this person has not seen recently (rotates through all of them before any repeats). */
export function pickNextTheme(): ThemeKey {
  let used: string[] = [];
  try { const raw = JSON.parse(localStorage.getItem(STORE) || '[]'); if (Array.isArray(raw)) used = raw; } catch { /* no storage */ }
  let pool = UNFILTERED_THEMES.filter((t) => !used.includes(t.key));
  if (!pool.length) pool = UNFILTERED_THEMES.filter((t) => t.key !== used[used.length - 1]);
  return pool[Math.floor(Math.random() * pool.length)].key;
}

export function rememberTheme(key: unknown): void {
  if (!themeByKey(key)) return;
  try {
    let used: string[] = [];
    const raw = JSON.parse(localStorage.getItem(STORE) || '[]'); if (Array.isArray(raw)) used = raw;
    used = used.filter((k) => k !== key);
    if (used.length >= UNFILTERED_THEMES.length - 1) used = [];
    used.push(key as string);
    localStorage.setItem(STORE, JSON.stringify(used));
  } catch { /* no storage */ }
}
