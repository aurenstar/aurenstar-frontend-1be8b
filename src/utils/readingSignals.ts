// Turns the REAL sky (birth chart + today's sky, from Swiss Ephemeris) into plain-language feelings.
// Nothing in the texts below names planets, signs or any astrology word: the reader only sees feelings.
import type { AstronomicalTriad } from './aurenEngine';

export type SignalLang = 'pt' | 'en' | 'es';
export type NeedKey = 'Fogo' | 'Terra' | 'Ar' | 'Água' | 'Pesado' | 'Irrita' | 'Afeto';

/** Ecliptic longitudes in degrees (0-360). Optional ones are skipped when missing. */
export interface SkyFacts {
  natal: { sun: number; moon: number; mercury?: number; venus?: number; mars?: number; saturn?: number };
  today: { moon: number; sun: number; mercuryRetro?: boolean };
}

type Target = 'sun' | 'moon' | 'venus' | 'mars' | 'mercury' | 'saturn';

const SIGN_KEYS = ['aries', 'touro', 'gemeos', 'cancer', 'leao', 'virgem', 'libra', 'escorpiao', 'sagitario', 'capricornio', 'aquario', 'peixes'];

const norm = (d: number) => ((d % 360) + 360) % 360;
const signIndex = (lon: number) => Math.floor(norm(lon) / 30) % 12;

export function factsFromTriad(triad: AstronomicalTriad): SkyFacts {
  const lon = (p: { signKey: string; degree: number; minute: number }) =>
    Math.max(0, SIGN_KEYS.indexOf(p.signKey)) * 30 + p.degree + p.minute / 60;
  return {
    natal: { sun: lon(triad.sun), moon: lon(triad.moon) },
    today: { moon: lon(triad.todayMoon), sun: lon(triad.todayMoon) },
  };
}

// ---------------------------------------------------------------- texts (by sign, Aries..Pisces)
const NATAL_MOON: Record<SignalLang, string[]> = {
  en: [
    'Deep down, part of you is tired of waiting and wants to act, decide and move. When something holds you back, the frustration shows up fast, and it passes just as fast.',
    'Deep down, part of you is craving comfort, calm and something you can count on. Being rushed, or having things change suddenly, can leave you quietly on edge.',
    'Deep down, your feelings come out best when you put them into words. If you keep everything in your head, it can feel like a loop you cannot stop.',
    'Deep down, you long to feel safe, held and needed by the people close to you. A cold tone or a small criticism can hurt more than anyone realises, and you may want to hide for a while.',
    'Deep down, part of you wants what you give to be seen and appreciated. Being ignored or taken for granted stings, even when you pretend it does not.',
    'Deep down, you feel better when things are in order and useful. You may be worrying about small details, and being too hard on yourself for things nobody else even noticed.',
    'Deep down, you want peace around you and you hate conflict. You may be holding back what you really think so everyone stays comfortable, and it is tiring.',
    'Deep down, you feel things very strongly, but you show only a little. You may be keeping something inside, waiting to feel safe enough to say it.',
    'Deep down, you need room, freedom and hope. Feeling trapped or controlled makes you restless, and you may be dreaming of a way out or something new.',
    'Deep down, you feel responsible for a lot, and you rarely let anyone see that it is hard. Part of you is tired of being the strong one.',
    'Deep down, you need space to feel things your own way. When people get too close or ask too much, you pull back, and then you may feel a little lonely.',
    'Deep down, you soak up the feelings of everyone around you, and sometimes you cannot tell which ones are yours. Part of you just wants quiet, rest and a small escape.',
  ],
  pt: [
    'No fundo, uma parte de você está cansada de esperar e quer agir, decidir e se mexer. Quando algo te segura, a frustração aparece rápido, e passa rápido também.',
    'No fundo, uma parte de você está pedindo conforto, calma e algo em que possa confiar. Quando te apressam, ou quando as coisas mudam de repente, você pode ficar com uma inquietação silenciosa.',
    'No fundo, seus sentimentos saem melhor quando você os coloca em palavras. Se guarda tudo na cabeça, pode parecer um ciclo que não para.',
    'No fundo, você deseja sentir segurança, acolhimento e ser importante para quem está perto. Um tom frio ou uma crítica pequena pode machucar mais do que ninguém imagina, e você pode querer se esconder um pouco.',
    'No fundo, uma parte de você quer que o que você oferece seja visto e valorizado. Ser ignorado ou tratado como obrigação dói, mesmo que você finja que não.',
    'No fundo, você se sente melhor quando as coisas estão em ordem e têm utilidade. Pode estar se preocupando com pequenos detalhes e sendo exigente demais consigo por coisas que ninguém mais percebeu.',
    'No fundo, você quer paz ao redor e detesta conflito. Pode estar segurando o que realmente pensa para deixar todo mundo confortável, e isso cansa.',
    'No fundo, você sente tudo com muita força, mas mostra só um pouco. Pode estar guardando algo por dentro, esperando sentir segurança para falar.',
    'No fundo, você precisa de espaço, liberdade e esperança. Sentir que te prendem ou te controlam deixa você inquieto, e pode estar sonhando com uma saída ou algo novo.',
    'No fundo, você se sente responsável por muita coisa e raramente deixa alguém ver que está difícil. Uma parte de você está cansada de ser quem aguenta tudo.',
    'No fundo, você precisa de espaço para sentir do seu jeito. Quando as pessoas chegam perto demais ou pedem demais, você se afasta, e depois pode sentir um pouco de solidão.',
    'No fundo, você absorve os sentimentos de todo mundo ao redor, e às vezes não sabe quais são seus. Uma parte de você só quer silêncio, descanso e uma pequena fuga.',
  ],
  es: [
    'En el fondo, una parte de ti está cansada de esperar y quiere actuar, decidir y moverse. Cuando algo te frena, la frustración aparece rápido, y se va igual de rápido.',
    'En el fondo, una parte de ti pide comodidad, calma y algo en lo que poder confiar. Cuando te apuran, o cuando las cosas cambian de golpe, puedes quedarte con una inquietud silenciosa.',
    'En el fondo, tus sentimientos salen mejor cuando los pones en palabras. Si lo guardas todo en la cabeza, puede sentirse como un círculo que no para.',
    'En el fondo, deseas sentir seguridad, cobijo y ser importante para quienes tienes cerca. Un tono frío o una crítica pequeña puede doler más de lo que nadie imagina, y puede que quieras esconderte un rato.',
    'En el fondo, una parte de ti quiere que lo que das sea visto y valorado. Que te ignoren o te den por sentado duele, aunque finjas que no.',
    'En el fondo, te sientes mejor cuando las cosas están en orden y sirven de algo. Quizás te preocupas por pequeños detalles y te exiges demasiado por cosas que nadie más notó.',
    'En el fondo, quieres paz a tu alrededor y odias el conflicto. Quizás te callas lo que piensas para que todos estén cómodos, y eso cansa.',
    'En el fondo, sientes todo con mucha fuerza, pero muestras poco. Quizás guardas algo por dentro, esperando sentir la seguridad de decirlo.',
    'En el fondo, necesitas espacio, libertad y esperanza. Sentir que te atrapan o te controlan te inquieta, y quizás sueñas con una salida o algo nuevo.',
    'En el fondo, sientes la responsabilidad de muchas cosas y casi nunca dejas que alguien vea que te cuesta. Una parte de ti está cansada de ser quien siempre aguanta.',
    'En el fondo, necesitas espacio para sentir a tu manera. Cuando la gente se acerca demasiado o pide demasiado, te alejas, y luego puedes sentir un poco de soledad.',
    'En el fondo, absorbes los sentimientos de todos a tu alrededor, y a veces no sabes cuáles son tuyos. Una parte de ti solo quiere silencio, descanso y una pequeña escapada.',
  ],
};

const TODAY_MOON: Record<SignalLang, string[]> = {
  en: [
    'Today your patience may be short and you may feel like moving fast, starting something, or just getting things done.',
    'Today you may want to slow down, get comfortable and avoid anything that feels like pressure.',
    'Today your mind may jump from one thing to another, and you may feel like talking, checking your phone or changing plans.',
    'Today you may feel more sensitive than usual, with a strong wish to stay close to home and to people you trust.',
    'Today you may feel a strong wish to be noticed, to enjoy yourself and to hear that you matter.',
    'Today you may notice every small thing out of place, and feel an urge to fix, organise and be useful.',
    'Today you may care a lot about peace, kindness and how people treat each other, and find it hard to choose a side.',
    'Today your feelings may run deeper than usual, and you may notice things behind people’s words.',
    'Today you may feel restless and hopeful, wanting a change, a trip or just something different from your routine.',
    'Today you may feel serious and focused, with a strong sense of duty and little patience for distractions.',
    'Today you may feel a bit apart from others and want to do things your own way, in your own time.',
    'Today you may feel dreamy and tender, soaking up other people’s moods, and finding it hard to focus on practical things.',
  ],
  pt: [
    'Hoje sua paciência pode estar curta e você pode ter vontade de se mexer rápido, começar algo ou só resolver as coisas.',
    'Hoje você pode querer ir mais devagar, ficar confortável e evitar qualquer coisa que pareça pressão.',
    'Hoje sua mente pode pular de um assunto para outro, e você pode ter vontade de conversar, olhar o celular ou mudar os planos.',
    'Hoje você pode estar mais sensível que o normal, com muita vontade de ficar perto de casa e de quem você confia.',
    'Hoje você pode sentir muita vontade de receber atenção, de se divertir e de ouvir que é importante.',
    'Hoje você pode reparar em cada coisinha fora do lugar e sentir vontade de arrumar, organizar e ajudar.',
    'Hoje você pode se importar muito com paz, gentileza e com o jeito que as pessoas se tratam, e achar difícil escolher um lado.',
    'Hoje seus sentimentos podem estar mais profundos que o normal, e você pode perceber coisas por trás das palavras das pessoas.',
    'Hoje você pode sentir inquietação e esperança, querendo uma mudança, uma viagem ou algo diferente da rotina.',
    'Hoje você pode estar com a cabeça séria e focada, com forte senso de dever e pouca paciência para distrações.',
    'Hoje você pode se sentir um pouco à parte dos outros e querer fazer as coisas do seu jeito, no seu tempo.',
    'Hoje você pode estar com a cabeça nas nuvens e o coração sensível, absorvendo o humor dos outros e com dificuldade de focar no que é prático.',
  ],
  es: [
    'Hoy tu paciencia puede ser corta y puede que tengas ganas de moverte rápido, empezar algo o simplemente resolver cosas.',
    'Hoy puede que quieras ir más despacio, estar a gusto y evitar cualquier cosa que parezca presión.',
    'Hoy tu mente puede saltar de un tema a otro, y puede que tengas ganas de hablar, mirar el teléfono o cambiar planes.',
    'Hoy puedes estar más sensible de lo normal, con muchas ganas de estar cerca de casa y de la gente en quien confías.',
    'Hoy puedes sentir muchas ganas de recibir atención, de divertirte y de oír que eres importante.',
    'Hoy puedes notar cada cosita fuera de lugar y sentir ganas de arreglar, ordenar y ayudar.',
    'Hoy puede importarte mucho la paz, la amabilidad y cómo se tratan las personas, y costarte elegir un lado.',
    'Hoy tus sentimientos pueden ser más profundos de lo normal, y puedes notar cosas detrás de las palabras de la gente.',
    'Hoy puedes sentir inquietud y esperanza, con ganas de un cambio, un viaje o algo distinto a tu rutina.',
    'Hoy puedes tener la cabeza seria y enfocada, con mucho sentido del deber y poca paciencia para las distracciones.',
    'Hoy puedes sentirte un poco aparte de los demás y querer hacer las cosas a tu manera, a tu ritmo.',
    'Hoy puedes tener la cabeza en las nubes y el corazón sensible, absorbiendo el ánimo de otros y costándote enfocarte en lo práctico.',
  ],
};

const ASPECT: Record<SignalLang, Record<Target, { tense: string; easy: string }>> = {
  en: {
    sun: {
      tense: 'Part of you wants to do what is expected of you, while another part only wants to feel what it feels, and that can pull you in two directions.',
      easy: 'What you want and what you feel are on the same side today, so it is a good day to trust your gut.',
    },
    moon: {
      tense: 'Old feelings may come back up for no clear reason, and you may get teary or touchy more easily.',
      easy: 'You may feel comfortable with your own feelings today, and understand more clearly what is going on inside you.',
    },
    venus: {
      tense: 'You may need more affection than usual, and small things from people you love can hurt more than they should.',
      easy: 'Affection comes easier today, and a kind message to someone you love could make you both feel better.',
    },
    mars: {
      tense: 'Your fuse may be short, and small things can irritate you, so you could say something sharper than you mean to.',
      easy: 'You have good energy today to act on what you feel and to say what you need with courage.',
    },
    mercury: {
      tense: 'Your thoughts and your feelings may be arguing, so you may overthink, or say words that do not match what you really feel.',
      easy: 'Words come easier today, and talking or writing about what you feel can bring real relief.',
    },
    saturn: {
      tense: 'You may feel heavy, tired or alone, as if you have to carry everything and nobody sees it.',
      easy: 'There is a steady calm today, and you can handle your responsibilities without losing your peace.',
    },
  },
  pt: {
    sun: {
      tense: 'Uma parte de você quer fazer o que esperam de você, enquanto outra só quer sentir o que sente, e isso pode puxar você para dois lados.',
      easy: 'O que você quer e o que você sente estão do mesmo lado hoje, então é um bom dia para confiar na sua intuição.',
    },
    moon: {
      tense: 'Sentimentos antigos podem voltar sem motivo claro, e você pode ficar com vontade de chorar ou sensível com mais facilidade.',
      easy: 'Você pode se sentir confortável com os próprios sentimentos hoje e entender com mais clareza o que se passa por dentro.',
    },
    venus: {
      tense: 'Você pode precisar de mais carinho que o normal, e pequenas coisas de quem você ama podem machucar mais do que deveriam.',
      easy: 'O carinho flui mais fácil hoje, e uma mensagem gentil para alguém que você ama pode fazer bem para os dois.',
    },
    mars: {
      tense: 'Seu pavio pode estar curto, e coisas pequenas podem irritar, então você pode dizer algo mais seco do que queria.',
      easy: 'Você tem boa energia hoje para agir no que sente e dizer o que precisa com coragem.',
    },
    mercury: {
      tense: 'Seus pensamentos e seus sentimentos podem estar brigando, então você pode pensar demais ou dizer palavras que não combinam com o que sente de verdade.',
      easy: 'As palavras vêm mais fácil hoje, e falar ou escrever sobre o que você sente pode trazer alívio de verdade.',
    },
    saturn: {
      tense: 'Você pode sentir peso, cansaço ou solidão, como se tivesse que carregar tudo e ninguém visse.',
      easy: 'Há uma calma firme hoje, e você consegue cuidar das suas responsabilidades sem perder a paz.',
    },
  },
  es: {
    sun: {
      tense: 'Una parte de ti quiere hacer lo que se espera de ti, mientras otra solo quiere sentir lo que siente, y eso puede tirar de ti en dos direcciones.',
      easy: 'Lo que quieres y lo que sientes van del mismo lado hoy, así que es un buen día para confiar en tu intuición.',
    },
    moon: {
      tense: 'Sentimientos antiguos pueden volver sin motivo claro, y puede que te den ganas de llorar o te sientas sensible con más facilidad.',
      easy: 'Hoy puedes sentirte a gusto con tus propios sentimientos y entender con más claridad lo que pasa por dentro.',
    },
    venus: {
      tense: 'Puedes necesitar más cariño de lo normal, y pequeñas cosas de quienes quieres pueden doler más de lo debido.',
      easy: 'El cariño fluye más fácil hoy, y un mensaje amable a alguien que quieres puede hacerles bien a los dos.',
    },
    mars: {
      tense: 'Tu mecha puede estar corta, y cosas pequeñas pueden irritarte, así que podrías decir algo más seco de lo que querías.',
      easy: 'Tienes buena energía hoy para actuar según lo que sientes y decir lo que necesitas con valentía.',
    },
    mercury: {
      tense: 'Tus pensamientos y tus sentimientos pueden estar discutiendo, así que puedes darle demasiadas vueltas o decir palabras que no coinciden con lo que sientes de verdad.',
      easy: 'Las palabras salen más fácil hoy, y hablar o escribir sobre lo que sientes puede darte un alivio real.',
    },
    saturn: {
      tense: 'Puedes sentir peso, cansancio o soledad, como si tuvieras que cargar con todo y nadie lo viera.',
      easy: 'Hay una calma firme hoy, y puedes ocuparte de tus responsabilidades sin perder la paz.',
    },
  },
};

const PHASE: Record<SignalLang, Record<string, string>> = {
  en: {
    'Lua Nova': 'It is a quiet, inward moment, good for starting again in small ways.',
    'Lua Crescente': 'Your motivation is slowly building, so small steps feel possible.',
    'Lua Cheia': 'Everything feels louder than usual, so your emotions may be at their peak, and that is normal.',
    'Lua Minguante': 'You may feel like letting go of things, finishing what is open, and resting more.',
  },
  pt: {
    'Lua Nova': 'É um momento quieto e voltado para dentro, bom para recomeçar em coisas pequenas.',
    'Lua Crescente': 'Sua motivação vai crescendo aos poucos, então passos pequenos parecem possíveis.',
    'Lua Cheia': 'Tudo parece mais alto que o normal, então as emoções podem estar no máximo, e isso é normal.',
    'Lua Minguante': 'Você pode sentir vontade de soltar coisas, terminar o que está aberto e descansar mais.',
  },
  es: {
    'Lua Nova': 'Es un momento tranquilo y hacia adentro, bueno para empezar de nuevo en cosas pequeñas.',
    'Lua Crescente': 'Tu motivación va creciendo poco a poco, así que los pasos pequeños parecen posibles.',
    'Lua Cheia': 'Todo suena más fuerte de lo normal, así que tus emociones pueden estar al máximo, y eso es normal.',
    'Lua Minguante': 'Puedes sentir ganas de soltar cosas, terminar lo que está abierto y descansar más.',
  },
};

const MERCURY_RETRO: Record<SignalLang, string> = {
  en: 'Messages and plans may get mixed up these days, so double-check things and do not take misunderstandings personally.',
  pt: 'Mensagens e planos podem se misturar nesses dias, então confira as coisas duas vezes e não leve mal-entendidos para o lado pessoal.',
  es: 'Los mensajes y los planes pueden enredarse estos días, así que revisa las cosas dos veces y no tomes los malentendidos como algo personal.',
};

// ---------------------------------------------------------------- the maths
const ASPECTS: { angle: number; orb: number; tense: boolean }[] = [
  { angle: 0, orb: 7, tense: true },
  { angle: 60, orb: 4, tense: false },
  { angle: 90, orb: 6, tense: true },
  { angle: 120, orb: 6, tense: false },
  { angle: 180, orb: 7, tense: true },
];

function angleBetween(a: number, b: number): number {
  const d = Math.abs(norm(a) - norm(b));
  return d > 180 ? 360 - d : d;
}

const TENSE_NEED: Record<Target, NeedKey> = {
  sun: 'Ar', moon: 'Água', venus: 'Afeto', mars: 'Irrita', mercury: 'Ar', saturn: 'Pesado',
};
// When the strongest feeling is a gentle one, the tips support it instead of calming it down.
const EASY_NEED: Partial<Record<Target, NeedKey>> = {
  moon: 'Água', venus: 'Afeto', mercury: 'Ar', mars: 'Fogo', saturn: 'Terra',
};

export interface Signals {
  natalMoon: string;
  todayMoon: string;
  aspects: { target: Target; tense: boolean; orb: number; text: string }[];
  phase: string;
  mercuryRetro: string | null;
  /** Which set of tips fits the strongest feeling of the day (falls back to the Moon's element). */
  need: NeedKey | null;
}

export function buildSignals(facts: SkyFacts, lang: SignalLang, phaseName: string): Signals {
  const L: SignalLang = (['pt', 'en', 'es'] as const).includes(lang) ? lang : 'en';
  const found: Signals['aspects'] = [];
  const targets: [Target, number | undefined][] = [
    ['sun', facts.natal.sun], ['moon', facts.natal.moon], ['venus', facts.natal.venus],
    ['mars', facts.natal.mars], ['mercury', facts.natal.mercury], ['saturn', facts.natal.saturn],
  ];
  for (const [target, lon] of targets) {
    if (lon === undefined) continue;
    const diff = angleBetween(facts.today.moon, lon);
    for (const a of ASPECTS) {
      const orb = Math.abs(diff - a.angle);
      if (orb <= a.orb) {
        const t = ASPECT[L][target];
        found.push({ target, tense: a.tense, orb, text: a.tense ? t.tense : t.easy });
        break;
      }
    }
  }
  // tightest aspects first (they are the strongest today); tense ones win ties because they are felt more
  found.sort((x, y) => x.orb - y.orb || Number(y.tense) - Number(x.tense));
  const aspects = found.slice(0, 2);
  const lead = aspects[0];
  return {
    natalMoon: NATAL_MOON[L][signIndex(facts.natal.moon)],
    todayMoon: TODAY_MOON[L][signIndex(facts.today.moon)],
    aspects,
    phase: PHASE[L][phaseName] || '',
    mercuryRetro: facts.today.mercuryRetro ? MERCURY_RETRO[L] : null,
    need: lead ? (lead.tense ? TENSE_NEED[lead.target] : EASY_NEED[lead.target]) ?? null : null,
  };
}
