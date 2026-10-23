export interface SignInfo {
  key: string;
  symbol: string;
  name: { pt: string; en: string; es: string };
  period: { pt: string; en: string; es: string };
  element: { pt: string; en: string; es: string };
  elementColor: string;
  essence: { pt: string; en: string; es: string };
  advice: { pt: string; en: string; es: string };
  articleId: string;
}

export const SIGNS_DATA: Record<string, SignInfo> = {
  aries: {
    key: 'aries',
    symbol: '♈',
    name: { pt: 'Áries', en: 'Aries', es: 'Aries' },
    period: { pt: '21 de Março a 19 de Abril', en: 'March 21 - April 19', es: '21 de Marzo a 19 de Abril' },
    element: { pt: 'Fogo', en: 'Fire', es: 'Fuego' },
    elementColor: 'bg-[#EC874F] text-white',
    essence: {
      pt: 'Pioneiro, corajoso e cheio de energia. Quando decide começar algo, coloca todo o coração e inspira quem está por perto.',
      en: 'Brave, spirited, and authentic. When setting a goal, you commit whole-heartedly and uplift others.',
      es: 'Valiente, alegre y lleno de entusiasmo. Inspiras a quienes te rodean con tu iniciativa sincera.',
    },
    advice: {
      pt: 'Respire fundo antes de agir com pressa e comemore cada pequena vitória com calma.',
      en: 'Take deep breaths before quick choices and celebrate your small steps peacefully.',
      es: 'Respira profundo antes de decidir y disfruta de tus logros con calma.',
    },
    articleId: 'post-aries',
  },
  touro: {
    key: 'touro',
    symbol: '♉',
    name: { pt: 'Touro', en: 'Taurus', es: 'Tauro' },
    period: { pt: '20 de Abril a 20 de Maio', en: 'April 20 - May 20', es: '20 de Abril a 20 de Mayo' },
    element: { pt: 'Terra', en: 'Earth', es: 'Tierra' },
    elementColor: 'bg-[#B89456] text-white',
    essence: {
      pt: 'Paciente, leal e acolhedor. Gosta de conforto, paz e valoriza amizades sinceras que duram a vida toda.',
      en: 'Patient, dependable, and warm. You love quiet comfort, good company, and sincere lasting bonds.',
      es: 'Paciente, leal y cariñoso. Valoras los placeres sencillos, el hogar y los lazos duraderos.',
    },
    advice: {
      pt: 'Mantenha o seu próprio ritmo: as coisas mais especiais levam tempo para crescer.',
      en: 'Honor your steady pace: the finest things in life need time to blossom.',
      es: 'Respeta tu ritmo natural: las cosas más hermosas florecen con paciencia.',
    },
    articleId: 'post-touro',
  },
  gemeos: {
    key: 'gemeos',
    symbol: '♊',
    name: { pt: 'Gêmeos', en: 'Gemini', es: 'Géminis' },
    period: { pt: '21 de Maio a 20 de Junho', en: 'May 21 - June 20', es: '21 de Mayo a 20 de Junio' },
    element: { pt: 'Ar', en: 'Air', es: 'Aire' },
    elementColor: 'bg-[#7154F3] text-white',
    essence: {
      pt: 'Curioso, comunicativo e inteligente. Aprende rápido, adora boas conversas e tem o dom de se reinventar a cada dia.',
      en: 'Curious, cheerful, and free. You love open conversations, learning fresh ideas, and playful variety.',
      es: 'Curioso, comunicativo y libre. Amas aprender, conversar y disfrutar de la libertad.',
    },
    advice: {
      pt: 'Dê uma pausa no dia para descansar a mente e renovar sua energia e criatividade.',
      en: 'Take quiet breath breaks every day to recharge your vibrant imagination.',
      es: 'Regálate pausas de silencio a diario para renovar tu mente creativa.',
    },
    articleId: 'post-gemeos',
  },
  cancer: {
    key: 'cancer',
    symbol: '♋',
    name: { pt: 'Câncer', en: 'Cancer', es: 'Cáncer' },
    period: { pt: '21 de Junho a 22 de Julho', en: 'June 21 - July 22', es: '21 de Junio a 22 de Julio' },
    element: { pt: 'Água', en: 'Water', es: 'Agua' },
    elementColor: 'bg-[#583980] text-white',
    essence: {
      pt: 'Sensível, carinhoso e protetor. Tem uma intuição forte, cuida com amor de quem ama e valoriza a família e o lar.',
      en: 'Gentle, intuitive, and protective. You hold deep empathy and find great peace in loving havens.',
      es: 'Sensible, cariñoso y protector. Tienes gran intuición y encuentras paz en tu hogar.',
    },
    advice: {
      pt: 'Lembre-se de cuidar de você com o mesmo carinho que você dedica aos outros.',
      en: 'Remember to nurture yourself with the exact same warmth you offer to others.',
      es: 'Cuida de ti mismo con la misma ternura que entregas a quienes amas.',
    },
    articleId: 'post-cancer',
  },
  leao: {
    key: 'leao',
    symbol: '♌',
    name: { pt: 'Leão', en: 'Leo', es: 'Leo' },
    period: { pt: '23 de Julho a 22 de Agosto', en: 'July 23 - August 22', es: '23 de Julio a 22 de Agosto' },
    element: { pt: 'Fogo', en: 'Fire', es: 'Fuego' },
    elementColor: 'bg-[#B66096] text-white',
    essence: {
      pt: 'Generoso, alegre e confiante. Tem um brilho natural, coração acolhedor e alegra qualquer lugar por onde passa.',
      en: 'Generous, radiant, and big-hearted. You naturally light up rooms and love uplifting others.',
      es: 'Generoso, alegre y noble. Tienes un brillo natural y te encanta apoyar a los demás.',
    },
    advice: {
      pt: 'O seu verdadeiro brilho fica ainda mais bonito quando você ajuda outras pessoas a brilharem também.',
      en: 'Your true light shines brightest when you lead with gentle humility.',
      es: 'Tu luz es más hermosa cuando compartes tus éxitos con humildad.',
    },
    articleId: 'post-leao',
  },
  virgem: {
    key: 'virgem',
    symbol: '♍',
    name: { pt: 'Virgem', en: 'Virgo', es: 'Virgo' },
    period: { pt: '23 de Agosto a 22 de Setembro', en: 'August 23 - September 22', es: '23 de Agosto a 22 de Septiembre' },
    element: { pt: 'Terra', en: 'Earth', es: 'Tierra' },
    elementColor: 'bg-[#4A4363] text-white',
    essence: {
      pt: 'Organizado, prestativo e carinhoso. Repara nos detalhes com facilidade e gosta de deixar tudo simples e no lugar.',
      en: 'Thoughtful, helpful, and organized. You love bringing calm order and taking care of details.',
      es: 'Organizado, bondadoso y observador. Disfrutas hacer las cosas bien y ayudar con el corazón.',
    },
    advice: {
      pt: 'Não se cobre tanta perfeição: o que é feito com carinho já é mais que suficiente.',
      en: 'Release the pressure for perfection: done with kindness is truly enough.',
      es: 'No te exijas perfección: hacer las cosas con amor vale mucho más.',
    },
    articleId: 'post-virgem',
  },
  libra: {
    key: 'libra',
    symbol: '♎',
    name: { pt: 'Libra', en: 'Libra', es: 'Libra' },
    period: { pt: '23 de Setembro a 22 de Outubro', en: 'September 23 - October 22', es: '23 de Septiembre a 22 de Octubre' },
    element: { pt: 'Ar', en: 'Air', es: 'Aire' },
    elementColor: 'bg-[#7154F3] text-white',
    essence: {
      pt: 'Gentil, equilibrado e amigo da paz. Gosta de ambientes leves, evita brigas e sabe ouvir todo mundo.',
      en: 'Kind, peaceful, and balanced. You adore calm beauty and naturally resolve tensions.',
      es: 'Amable, pacífico y armónico. Buscas el equilibrio y desarmas tensiones con cariño.',
    },
    advice: {
      pt: 'Ao fazer uma escolha, confie no que traz leveza e tranquilidade para o seu coração.',
      en: 'When choosing a path, trust the first feeling of inner peace in your heart.',
      es: 'Al tomar decisiones, confía en el primer sentimiento de calma en tu corazón.',
    },
    articleId: 'post-libra',
  },
  escorpiao: {
    key: 'escorpiao',
    symbol: '♏',
    name: { pt: 'Escorpião', en: 'Scorpio', es: 'Escorpio' },
    period: { pt: '23 de Outubro a 21 de Novembro', en: 'October 23 - November 21', es: '23 de Octubre a 21 de Noviembre' },
    element: { pt: 'Água', en: 'Water', es: 'Agua' },
    elementColor: 'bg-[#17366F] text-white',
    essence: {
      pt: 'Leal, corajoso e profundo. Percebe a verdade nas pessoas, ama com sinceridade e tem muita força para vencer desafios.',
      en: 'Loyal, deep, and resilient. You sense sincerity intuitively and overcome any storm.',
      es: 'Profundo, leal y fuerte. Reconoces la sinceridad al instante y renaces ante cualquier reto.',
    },
    advice: {
      pt: 'Deixe o passado no lugar dele para abrir espaço para momentos novos e felizes.',
      en: 'Practice letting go of old hurts to make welcoming room for fresh blessings.',
      es: 'Suelta cargas pasadas para recibir todo lo bueno que viene a tu vida.',
    },
    articleId: 'post-escorpiao',
  },
  sagitario: {
    key: 'sagitario',
    symbol: '♐',
    name: { pt: 'Sagitário', en: 'Sagittarius', es: 'Sagitario' },
    period: { pt: '22 de Novembro a 21 de Dezembro', en: 'November 22 - December 21', es: '22 de Noviembre a 21 de Diciembre' },
    element: { pt: 'Fogo', en: 'Fire', es: 'Fuego' },
    elementColor: 'bg-[#EC874F] text-white',
    essence: {
      pt: 'Alegre, livre e bem-humorado. Adora aprender, sonha alto e contagia os outros com sua energia positiva.',
      en: 'Optimistic, open-hearted, and joyful. You love exploration and spread laughter naturally.',
      es: 'Optimista, alegre y sincero. Amas viajar, soñar en grande y compartir sonrisas.',
    },
    advice: {
      pt: 'Acredite no que vem pela frente, aproveitando com gratidão as coisas boas do dia de hoje.',
      en: 'Keep your hope for tomorrow, while savoring the beauty of today.',
      es: 'Confía en el futuro mientras disfrutas de cada bendición de hoy.',
    },
    articleId: 'post-sagitario',
  },
  capricornio: {
    key: 'capricornio',
    symbol: '♑',
    name: { pt: 'Capricórnio', en: 'Capricorn', es: 'Capricornio' },
    period: { pt: '22 de Dezembro a 19 de Janeiro', en: 'December 22 - January 19', es: '22 de Diciembre a 19 de Enero' },
    element: { pt: 'Terra', en: 'Earth', es: 'Tierra' },
    elementColor: 'bg-[#382B7D] text-white',
    essence: {
      pt: 'Dedicado, responsável e seguro. Realiza seus objetivos com calma e sabe valorizar tudo o que constrói.',
      en: 'Steady, responsible, and dedicated. You build lasting foundations step by step.',
      es: 'Perseverante, responsable y sabio. Construyes tus metas con calma y pasos seguros.',
    },
    advice: {
      pt: 'Descansar também faz parte do seu caminho: tire momentos de calma sem peso na consciência.',
      en: 'Rest is part of genuine success: allow yourself guilt-free downtime.',
      es: 'El descanso también es parte del éxito: date tiempo para relajarte sin culpas.',
    },
    articleId: 'post-capricornio',
  },
  aquario: {
    key: 'aquario',
    symbol: '♒',
    name: { pt: 'Aquário', en: 'Aquarius', es: 'Acuario' },
    period: { pt: '20 de Janeiro a 18 de Fevereiro', en: 'January 20 - February 18', es: '20 de Enero a 18 de Febrero' },
    element: { pt: 'Ar', en: 'Air', es: 'Aire' },
    elementColor: 'bg-[#56C5DC] text-white',
    essence: {
      pt: 'Criativo, autêntico e companheiro. Gosta de ideias novas, valoriza os amigos e torce para que todos vivam bem.',
      en: 'Inventive, genuine, and kind. You look ahead and dream of a supportive, fair world.',
      es: 'Creativo, auténtico y noble. Tienes ideas originales y sueñas con un mundo mejor.',
    },
    advice: {
      pt: 'Seu jeito único é a sua maior beleza: continue sendo você mesmo com orgulho e leveza.',
      en: 'Your unique spirit is your greatest gift: stay true to your values.',
      es: 'Tu originalidad es un regalo: sigue siendo tú mismo con orgullo.',
    },
    articleId: 'post-aquario',
  },
  peixes: {
    key: 'peixes',
    symbol: '♓',
    name: { pt: 'Peixes', en: 'Pisces', es: 'Piscis' },
    period: { pt: '19 de Fevereiro a 20 de Março', en: 'February 19 - March 20', es: '19 de Febrero a 20 de Marzo' },
    element: { pt: 'Água', en: 'Water', es: 'Agua' },
    elementColor: 'bg-[#B319A6] text-white',
    essence: {
      pt: 'Carinhoso, sonhador e bondoso. Tem um coração acolhedor, imaginação fértil e sabe escutar com atenção.',
      en: 'Compassionate, imaginative, and gentle. You hold deep intuition and quiet sweetness.',
      es: 'Sensible, generoso e intuitivo. Tienes un corazón compasivo y sabes escuchar.',
    },
    advice: {
      pt: 'Tire pequenos momentos de silêncio e música agradável para renovar sua paz interior.',
      en: 'Cherish peaceful music and quiet stillness to protect your gentle heart.',
      es: 'Cuida tus momentos de silencio y música suave para proteger tu paz.',
    },
    articleId: 'post-peixes',
  },
};

export const calculateSign = (day: number, month: number): string => {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'touro';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'gemeos';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'leao';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'virgem';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'escorpiao';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'sagitario';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'capricornio';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'aquario';
  return 'peixes';
};

export const LAST_DISCOVERED_SIGN_KEY = 'aurenstar_discovered_sign';
