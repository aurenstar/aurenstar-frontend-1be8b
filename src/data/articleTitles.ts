/**
 * Hand-written titles for the WordPress articles, in English, Portuguese and Spanish (short, clear, made to be clicked in Google).
 * They win over the WordPress title and over the robot's translation. The article address does not change.
 * [id, English, Portuguese, Spanish]
 */
export const ARTICLE_TITLES: Record<string, { en: string; pt: string; es: string }> = Object.fromEntries(
  ([
    ['wp-659', 'Pisces Personality: The Depth Behind the Dreamy Side', 'Personalidade de Peixes: a profundidade por trás do lado sonhador', 'Personalidad de Piscis: la profundidad detrás del lado soñador'],
    ['wp-658', 'Aquarius Personality: Why This Sign Thinks Differently', 'Personalidade de Aquário: por que este signo pensa diferente', 'Personalidad de Acuario: por qué este signo piensa distinto'],
    ['wp-657', 'Sagittarius Personality: Why This Sign Needs Room to Grow', 'Personalidade de Sagitário: por que este signo precisa de espaço', 'Personalidad de Sagitario: por qué este signo necesita espacio'],
    ['wp-656', 'Scorpio Personality: What This Sign Reveals Only Over Time', 'Personalidade de Escorpião: o que este signo revela só com o tempo', 'Personalidad de Escorpio: lo que este signo revela solo con el tiempo'],
    ['wp-655', 'Libra Personality: Why This Sign Sees Every Side', 'Personalidade de Libra: por que este signo vê todos os lados', 'Personalidad de Libra: por qué este signo ve todos los lados'],
    ['wp-654', 'Virgo Personality: Why This Sign Notices What Others Miss', 'Personalidade de Virgem: por que este signo nota o que os outros não veem', 'Personalidad de Virgo: por qué este signo nota lo que otros no ven'],
    ['wp-653', 'Leo Personality: What’s Behind Leo’s Strong Presence?', 'Personalidade de Leão: o que está por trás da presença marcante', 'Personalidad de Leo: qué hay detrás de su presencia marcada'],
    ['wp-462', 'Gemini in Bed: What Creates Chemistry for Gemini', 'Gêmeos na cama: o que cria química para este signo', 'Géminis en la cama: qué crea química en este signo'],
    ['wp-461', 'Why Gemini Pulls Away Emotionally (And What It Can Mean)', 'Por que Gêmeos se afasta emocionalmente? O que a distância pode significar', '¿Por qué Géminis se aleja emocionalmente? Lo que puede significar la distancia'],
    ['wp-460', 'How Gemini Acts in Relationships: The Signals That Matter', 'Como Gêmeos age nos relacionamentos: os sinais que importam', 'Cómo actúa Géminis en las relaciones: las señales que importan'],
    ['wp-446', 'What Gemini Is Like as a Friend: The Side People Miss', 'Como Gêmeos é como amigo: o lado que quase ninguém vê', 'Cómo es Géminis como amigo: el lado que casi nadie ve'],
    ['wp-445', 'Gemini Career Personality: How This Sign Thrives at Work', 'Gêmeos no trabalho: o que faz este signo brilhar na carreira', 'Géminis en el trabajo: qué hace brillar a este signo en su carrera'],
    ['wp-443', 'Gemini Red Flags: Behaviors People Often Misread', 'Sinais de alerta de Gêmeos: comportamentos mal interpretados', 'Señales de alerta de Géminis: comportamientos mal interpretados'],
    ['wp-442', 'Gemini Personality Traits: A Complete Guide', 'Personalidade de Gêmeos: guia completo das características', 'Personalidad de Géminis: guía completa de sus características'],
    ['wp-429', 'How Gemini Acts When Falling in Love: Signs People Miss', 'Como Gêmeos age quando se apaixona: os sinais que passam despercebidos', 'Cómo actúa Géminis cuando se enamora: las señales que pasan desapercibidas'],
    ['wp-413', 'Why Gemini Needs Freedom (And What That Means for You)', 'Por que Gêmeos valoriza tanto a liberdade?', '¿Por qué Géminis valora tanto la libertad?'],
    ['wp-156', 'What Is Gemini Really Like? A Closer Look', 'Como Gêmeos realmente é? Um olhar mais de perto', '¿Cómo es Géminis en realidad? Una mirada más cercana'],
    ['wp-1338', 'Aries Traits: Key Personality Patterns Explained', 'Características de Áries: padrões de personalidade explicados', 'Rasgos de Aries: patrones de personalidad explicados'],
    ['wp-1319', 'Cancer Zodiac Traits: Personality Insights Explained', 'Características de Câncer: a personalidade do signo explicada', 'Rasgos de Cáncer: la personalidad del signo explicada'],
    ['wp-1314', 'Leo Personality: Key Traits and What Drives This Sign', 'Personalidade de Leão: características e o que move este signo', 'Personalidad de Leo: rasgos y lo que mueve a este signo'],
    ['wp-1296', 'Taurus Traits: What Shapes This Steadfast Sign', 'Características de Touro: o que molda esta personalidade firme', 'Rasgos de Tauro: lo que da forma a esta personalidad firme'],
    ['wp-1291', 'Pisces Traits and Relationships: A Simple Guide', 'Personalidade de Peixes: características e relacionamentos', 'Personalidad de Piscis: rasgos y relaciones'],
    ['wp-1281', 'Astrology Chart: Your Cosmic Blueprint Explained', 'Mapa astral: seu mapa cósmico explicado de forma simples', 'Carta astral: tu mapa cósmico explicado de forma simple'],
    ['wp-1277', 'Zodiac Sign Dates: When Each Sign Begins and Ends', 'Datas dos signos: quando cada signo começa e termina', 'Fechas de los signos: cuándo empieza y termina cada uno'],
    ['wp-1259', 'Zodiac Signs by Month: What Your Birth Month Says', 'Signos por mês: o que o seu mês de nascimento revela', 'Signos por mes: lo que revela tu mes de nacimiento'],
    ['wp-1256', 'Zodiac Compatibility: What Works and What Challenges', 'Compatibilidade dos signos: o que funciona e o que desafia', 'Compatibilidad de los signos: qué funciona y qué desafía'],
    ['wp-1242', 'Scorpio Personality Traits Explained', 'Características de Escorpião: a personalidade explicada', 'Rasgos de Escorpio: la personalidad explicada'],
    ['wp-1233', 'Gemini Traits: A Simple Guide to the Star Sign', 'Características de Gêmeos: guia simples do signo', 'Rasgos de Géminis: guía simple del signo'],
    ['wp-1230', 'Gemini Characteristics: What Makes This Sign Unique', 'Características de Gêmeos: o que torna este signo único', 'Rasgos de Géminis: qué hace único a este signo'],
  ] as const).map(([id, en, pt, es]) => [id, { en, pt, es }]),
);

/** Puts the hand-written title (and the matching picture caption) on an article, whatever else was done to its text. */
export function withHandTitle<T extends { id: string; title: Record<'en' | 'pt' | 'es', string>; imageCaption: Record<'en' | 'pt' | 'es', string> }>(a: T): T {
  const t = ARTICLE_TITLES[a.id];
  return t ? { ...a, title: { ...a.title, ...t }, imageCaption: { ...a.imageCaption, ...t } } : a;
}
