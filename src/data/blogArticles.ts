// Official Aurenstar brand avatar SVG
// Shared Aurenstar profile avatar used across blog cards and author rows
export const AURENSTAR_AVATAR = '/aurenstar-avatar.webp';

export interface BlogAuthor {
  name: string;
  role?: string;
  avatar: string;
  dateTime: {
    pt: string;
    en: string;
    es: string;
  };
  date: {
    pt: string;
    en: string;
    es: string;
  };
}

export interface BlogArticleContent {
  id: string;
  category: {
    pt: string;
    en: string;
    es: string;
  };
  categoryColor: string;
  readTime: {
    pt: string;
    en: string;
    es: string;
  };
  date: {
    pt: string;
    en: string;
    es: string;
  };
  author: BlogAuthor;
  image: string;
  imageCaption: {
    pt: string;
    en: string;
    es: string;
  };
  title: {
    pt: string;
    en: string;
    es: string;
  };
  subtitle: {
    pt: string;
    en: string;
    es: string;
  };
  quote: {
    pt: string;
    en: string;
    es: string;
  };
  sections: {
    heading: {
      pt: string;
      en: string;
      es: string;
    };
    paragraphs: {
      pt: string;
      en: string;
      es: string;
    }[];
  }[];
  keyTakeaways: {
    pt: string[];
    en: string[];
    es: string[];
  };
  zodiacSigns?: string[];
}

export const BLOG_ARTICLES: BlogArticleContent[] = [
  {
    id: 'post-1',
    category: {
      pt: 'ASTROLOGIA',
      en: 'ASTROLOGY',
      es: 'ASTROLOGÍA',
    },
    categoryColor: 'bg-[#56C5DC] text-white',
    readTime: {
      pt: '4 min de leitura',
      en: '4 min read',
      es: '4 min de lectura',
    },
    date: {
      pt: '04 Out 2026',
      en: 'Oct 04, 2026',
      es: '04 Oct 2026',
    },
    author: {
      name: 'Aurenstar',
      role: 'Insights',
      avatar: AURENSTAR_AVATAR,
      dateTime: {
        pt: '04 Out 2026 às 16:45',
        en: 'Oct 04, 2026 • 4:45 PM',
        es: '04 Oct 2026 a las 16:45',
      },
      date: {
        pt: '04 Out 2026',
        en: 'Oct 04, 2026',
        es: '04 Oct 2026',
      },
    },
    image:
      '/assets/img/1506703719100-a0f3a48c0f-1200.webp',
    imageCaption: {
      pt: 'As constelações revelam tendências suaves para o seu dia a dia.',
      en: 'Constellations softly guide your daily steps with clarity.',
      es: 'Las constelaciones guían con suavidad tus pasos cada día.',
    },
    title: {
      pt: 'O Poder dos Signos Solares: Como a sua Constelação Guia o seu Dia',
      en: 'The Power of Sun Signs: How Your Constellation Guides Your Day',
      es: 'El Poder de los Signos Solares: Cómo tu Constelación Guía tu Día',
    },
    subtitle: {
      pt: 'Entenda de forma simples como a posição do Sol no seu nascimento influencia suas decisões e traz clareza para a sua rotina.',
      en: 'Understand how the Sun position at birth naturally influences your decisions and brings gentle focus to your routine.',
      es: 'Comprende de forma sencilla cómo la posición del Sol influye en tus decisiones y aporta claridad a tu rutina.',
    },
    quote: {
      pt: 'Olhar para as estrelas não é prever o destino, mas encontrar calma e direção para o presente.',
      en: 'Looking at the stars is not about predicting fate, but finding calm and direction in the present.',
      es: 'Mirar a las estrellas no es predecir el destino, sino encontrar calma e dirección en el presente.',
    },
    sections: [
      {
        heading: {
          pt: 'O que representa o seu Signo Solar?',
          en: 'What does your Sun Sign represent?',
          es: '¿Qué representa tu Signo Solar?',
        },
        paragraphs: [
          {
            pt: 'O signo solar é o centro da sua personalidade. Ele mostra a sua essência mais pura, a forma como você recarrega as suas energias e como costuma agir diante dos desafios.',
            en: 'Your sun sign is the core of your personality. It reflects your purest essence, the way you recharge your energy, and how you naturally face daily challenges.',
            es: 'El signo solar es el centro de tu personalidad. Muestra tu esencia más pura, cómo recargas tus energías y cómo afrontas los desafíos.',
          },
          {
            pt: 'Muitas pessoas pensam que a astrologia é complicada, cheia de termos difíceis. Na verdade, ela é como um mapa simples que nos lembra dos nossos maiores talentos e qualidades.',
            en: 'Many people think astrology is complicated and filled with jargon. In reality, it works like a friendly map reminding us of our greatest talents and natural gifts.',
            es: 'Muchas personas piensan que la astrología es complicada. En realidad, funciona como un mapa amable que nos recuerda nuestros mayores talentos.',
          },
        ],
      },
      {
        heading: {
          pt: 'Como usar essa sabedoria na prática',
          en: 'How to use this wisdom practically',
          es: 'Cómo usar esta sabiduría en la práctica',
        },
        paragraphs: [
          {
            pt: 'Ao ler a mensagem do seu signo todas as manhãs, você ganha um momento de pausa antes do ritmo corrido do dia. Essa pequena reflexão ajuda a manter a paciência e tomar decisões com o coração tranquilo.',
            en: 'Taking a moment to read your daily sign message each morning gives you a peaceful pause before a busy day begins. It helps you stay patient and make choices with a calm heart.',
            es: 'Al leer el mensaje de tu signo cada mañana, ganas un momento de pausa antes del ritmo del día. Esta reflexión ayuda a mantener la paciencia y tomar decisiones con serenidad.',
          },
          {
            pt: 'Cada signo tem pontos fortes: signos de Fogo trazem coragem, os de Terra trazem firmeza, os de Ar trazem boas ideias e os de Água trazem sensibilidade e carinho.',
            en: 'Every sign has unique strengths: Fire signs bring courage, Earth brings stability, Air brings fresh ideas, and Water signs offer empathy and heartfelt care.',
            es: 'Cada signo tiene fortalezas: el Fuego aporta valentía, la Tierra firmeza, el Aire nuevas ideas y el Agua sensibilidad y cariño.',
          },
        ],
      },
    ],
    keyTakeaways: {
      pt: [
        'O Sol representa a sua força interior e vitalidade.',
        'Ler o conselho do dia ajuda a começar a manhã com foco positivo.',
        'Respeite o seu próprio ritmo e use suas qualidades a seu favor.',
      ],
      en: [
        'The Sun represents your inner strength and vitality.',
        'Reading daily guidance helps you start the morning with positive focus.',
        'Honor your own pace and use your natural talents to thrive.',
      ],
      es: [
        'El Sol representa tu fuerza interior y vitalidad.',
        'Leer el consejo del día ayuda a comenzar la mañana con enfoque positivo.',
        'Respeta tu propio ritmo y usa tus cualidades a tu favor.',
      ],
    },
  },
  {
    id: 'post-2',
    category: {
      pt: 'FASES DA LUA',
      en: 'MOON PHASES',
      es: 'FASES LUNARES',
    },
    categoryColor: 'bg-[#382B7D] text-white',
    readTime: {
      pt: '3 min de leitura',
      en: '3 min read',
      es: '3 min de lectura',
    },
    date: {
      pt: '04 Out 2026',
      en: 'Oct 04, 2026',
      es: '04 Oct 2026',
    },
    author: {
      name: 'Aurenstar',
      role: 'Insights',
      avatar: AURENSTAR_AVATAR,
      dateTime: {
        pt: '04 Out 2026 às 14:20',
        en: 'Oct 04, 2026 • 2:20 PM',
        es: '04 Oct 2026 a las 14:20',
      },
      date: {
        pt: '04 Out 2026',
        en: 'Oct 04, 2026',
        es: '04 Oct 2026',
      },
    },
    image:
      '/assets/img/1532693322450-2cb5c51106-1200.webp',
    imageCaption: {
      pt: 'A luz suave da Lua nos convida ao descanso e à renovação de ideias.',
      en: 'The soft glow of the Moon invites rest and mindful renewal.',
      es: 'La luz suave de la Luna invita al descanso y a la renovación.',
    },
    title: {
      pt: 'Lua Cheia e Nova: Entenda o Impacto dos Ciclos Lunares nas Emoções',
      en: 'Full Moon & New Moon: Understanding Lunar Cycles and Calm',
      es: 'Luna Llena y Nueva: Comprende el Impacto de los Ciclos Lunares',
    },
    subtitle: {
      pt: 'Descubra como a passagem das fases da Lua afeta nossa energia física e emocional, e como tirar o melhor proveito de cada período.',
      en: 'Discover how moon phases naturally touch our energy, and how to make the most of each comforting period.',
      es: 'Descubre cómo las fases lunares tocan nuestra energía y cómo aprovechar lo mejor de cada período con paz.',
    },
    quote: {
      pt: 'Assim como a Lua cresce e míngua no céu, nós também precisamos de momentos para brilhar e momentos para descansar.',
      en: 'Just as the Moon waxes and wanes, we too need times to shine and times to gently rest.',
      es: 'Así como la Luna crece y mengua, nosotros también necesitamos tiempos para brillar y tiempos para descansar.',
    },
    sections: [
      {
        heading: {
          pt: 'A Lua Nova: Tempo de Plantar Sementes',
          en: 'The New Moon: Time to Plant Seeds',
          es: 'La Luna Nueva: Tiempo de Sembrar',
        },
        paragraphs: [
          {
            pt: 'A Lua Nova é o recomeço. O céu fica mais escuro, convidando ao silêncio e ao planejamento. É a melhor fase para pensar no que você deseja iniciar: um novo hábito, um projeto pessoal ou simplesmente deixar para trás preocupações antigas.',
            en: 'The New Moon is a fresh start. The sky turns quieter, inviting stillness and new intentions. It is the perfect moment to start a gentle habit or release old worries.',
            es: 'La Luna Nueva es un nuevo comienzo. El cielo se torna silencioso, invitando a la reflexión. Es el momento perfecto para iniciar un buen hábito o soltar preocupaciones.',
          },
        ],
      },
      {
        heading: {
          pt: 'A Lua Cheia: Iluminação e Gratidão',
          en: 'The Full Moon: Illumination & Gratitude',
          es: 'La Luna Llena: Iluminación y Gratitud',
        },
        paragraphs: [
          {
            pt: 'Na Lua Cheia, tudo parece mais intenso. As emoções ficam à flor da pele, as noites são mais claras e a nossa sensibilidade aumenta. É um momento propício para celebrar pequenas conquistas e agradecer pelo caminho percorrido.',
            en: 'During the Full Moon, emotions become richer and brighter. Nights feel luminous and intuition sharpens. It is a wonderful time to celebrate small milestones and offer gratitude.',
            es: 'En Luna Llena, las emociones se sienten con mayor intensidad y la intuición florece. Es momento de celebrar pequeños logros y agradecer.',
          },
        ],
      },
    ],
    keyTakeaways: {
      pt: [
        'A Lua Nova é ideal para novos começos e planos.',
        'A Lua Cheia traz brilho e celebração das suas conquistas.',
        'Reconhecer esses ciclos traz paz e autocompreensão.',
      ],
      en: [
        'The New Moon is ideal for fresh goals and intentions.',
        'The Full Moon brings radiance and celebration of your growth.',
        'Embracing lunar rhythms deepens inner peace.',
      ],
      es: [
        'La Luna Nueva es ideal para comenzar metas y proyectos.',
        'La Luna Llena aporta luminosidad y celebración de tus logros.',
        'Sintonizar con los ciclos lunares genera paz y equilibrio.',
      ],
    },
  },
  {
    id: 'post-3',
    category: {
      pt: 'BEM-ESTAR',
      en: 'WELLNESS',
      es: 'BIENESTAR',
    },
    categoryColor: 'bg-[#B319A6] text-white',
    readTime: {
      pt: '5 min de leitura',
      en: '5 min read',
      es: '5 min de lectura',
    },
    date: {
      pt: '03 Out 2026',
      en: 'Oct 03, 2026',
      es: '03 Oct 2026',
    },
    author: {
      name: 'Aurenstar',
      role: 'Insights',
      avatar: AURENSTAR_AVATAR,
      dateTime: {
        pt: '03 Out 2026 às 18:30',
        en: 'Oct 03, 2026 • 6:30 PM',
        es: '03 Oct 2026 a las 18:30',
      },
      date: {
        pt: '03 Out 2026',
        en: 'Oct 03, 2026',
        es: '03 Oct 2026',
      },
    },
    image:
      '/assets/img/1506744038136-46273834b3-1200.webp',
    imageCaption: {
      pt: 'A calma matinal cria raízes profundas de tranquilidade para o seu dia.',
      en: 'Early morning calm sets deep roots of tranquility for your hours ahead.',
      es: 'La calma matutina echa raíces profundas para una jornada serena.',
    },
    title: {
      pt: 'Rituais Matinais de Serenidade: Conectando Mente, Corpo e Cosmos',
      en: 'Morning Calm Rituals: Connecting Mind, Spirit, and Cosmos',
      es: 'Rituales Matutinos de Calma: Conectando Mente, Cuerpo y Cosmos',
    },
    subtitle: {
      pt: 'Práticas simples de cinco minutos que transformam as primeiras horas do dia e trazem bem-estar duradouro.',
      en: 'Simple five-minute practices that uplift your early morning hours and bring lasting peacefulness.',
      es: 'Prácticas simples de cinco minutos que transforman las primeras horas del día y aportan bienestar.',
    },
    quote: {
      pt: 'A maneira como você acorda define o tom de todas as suas próximas horas.',
      en: 'The way you begin your morning gently sets the tone for your entire day.',
      es: 'La forma en que comienzas tu mañana marca el tono de todo tu día.',
    },
    sections: [
      {
        heading: {
          pt: 'Respire antes de pegar no celular',
          en: 'Breathe before reaching for your phone',
          es: 'Respira antes de mirar el teléfono',
        },
        paragraphs: [
          {
            pt: 'Muitas vezes acordamos e já olhamos mensagens ou notícias, trazendo pressa imediata. Experimente dedicar os primeiros três minutos apenas para respirar fundo, tomar um copo de água e sentir a luz do dia entrando pela janela.',
            en: 'Often we wake up and immediately check messages or news, inviting rush into our mind. Instead, try spending your first three minutes breathing deeply, drinking fresh water, and welcoming the morning light.',
            es: 'A menudo despertamos y revisamos el teléfono de inmediato. Intenta dedicar tus primeiros tres minutos a respirar profundamente, beber agua y sentir la luz del día.',
          },
        ],
      },
      {
        heading: {
          pt: 'Escolha uma palavra guia para o dia',
          en: 'Pick an intention word for today',
          es: 'Elige una palabra guía para tu jornada',
        },
        paragraphs: [
          {
            pt: 'Depois de ler a sua frase astrológica diária na Aurenstar, escolha uma palavra especial para acompanhar você: pode ser "paciência", "alegria", "coragem" ou "gratidão". Sempre que sentir pressa ou estresse, lembre-se dessa palavra.',
            en: 'After reading your daily advice on Aurenstar, choose one special word to guide your steps: it could be "patience", "joy", "courage", or "calm". Whenever you feel rushed, gently bring this word to mind.',
            es: 'Luego de leer tu consejo en Aurenstar, elige una palabra guía: puede ser "paciencia", "alegría", "coraje" o "gratitud". Recordarla te devolverá la calma.',
          },
        ],
      },
    ],
    keyTakeaways: {
      pt: [
        'Dedique os primeiros minutos do dia à sua própria paz.',
        'Beba água e sinta a luz natural da manhã.',
        'Tenha uma intenção positiva em mente ao sair de casa.',
      ],
      en: [
        'Dedicate your first morning minutes to your own inner peace.',
        'Hydrate and welcome the natural morning light.',
        'Hold a gentle positive intention as you step into your day.',
      ],
      es: [
        'Dedica los primeros minutos del día a tu propia calma.',
        'Bebe agua y siente la luz natural del amanecer.',
        'Mantén una intención positiva a lo largo del día.',
      ],
    },
  },
  {
    id: 'post-4',
    category: {
      pt: 'GUIA DOS SIGNOS',
      en: 'ZODIAC GUIDE',
      es: 'GUÍA ZODIACAL',
    },
    categoryColor: 'bg-[#E98852] text-white',
    readTime: {
      pt: '6 min de leitura',
      en: '6 min read',
      es: '6 min de lectura',
    },
    date: {
      pt: '02 Out 2026',
      en: 'Oct 02, 2026',
      es: '02 Oct 2026',
    },
    author: {
      name: 'Aurenstar',
      role: 'Insights',
      avatar: AURENSTAR_AVATAR,
      dateTime: {
        pt: '02 Out 2026 às 11:15',
        en: 'Oct 02, 2026 • 11:15 AM',
        es: '02 Oct 2026 a las 11:15',
      },
      date: {
        pt: '02 Out 2026',
        en: 'Oct 02, 2026',
        es: '02 Out 2026',
      },
    },
    image:
      '/assets/img/1518709268805-4e9042af9f-1200.webp',
    imageCaption: {
      pt: 'A harmonia entre os elementos ensina que cada um de nós é único e valioso.',
      en: 'Harmony between the elements shows how uniquely valuable each of us is.',
      es: 'La armonía entre los elementos muestra cuán valioso y único es cada ser.',
    },
    title: {
      pt: 'Compatibilidade Astrológica: O Significado de Fogo, Terra, Ar e Água',
      en: 'Zodiac Compatibility: The Meaning of Fire, Earth, Air, and Water',
      es: 'Compatibilidad Astrológica: El Significado de Fuego, Tierra, Aire y Agua',
    },
    subtitle: {
      pt: 'Descubra como os quatro elementos da natureza interagem e facilitam a convivência com amigos, família e no amor.',
      en: 'Discover how nature four elements interact to bring harmony and understanding into your daily relationships.',
      es: 'Descubre cómo los cuatro elementos interactúan y facilitan la convivencia con tus seres queridos e en el amor.',
    },
    quote: {
      pt: 'Não somos iguais, e é justamente na diferença que encontramos equilíbrio e amizade verdadeira.',
      en: 'We are not identical, and it is in our differences that we discover true balance and friendship.',
      es: 'No somos iguales, y es en la diferencia donde encontramos equilibrio y verdadera amistad.',
    },
    sections: [
      {
        heading: {
          pt: 'Os Quatro Pilares da Astrologia',
          en: 'The Four Pillars of the Zodiac',
          es: 'Los Cuatro Pilares del Zodíaco',
        },
        paragraphs: [
          {
            pt: '• Fogo (Áries, Leão, Sagitário): Entusiasmo, energia vibrante e vontade de viver com paixão.',
            en: '• Fire (Aries, Leo, Sagittarius): Natural enthusiasm, vibrant spirit, and passion for life.',
            es: '• Fuego (Aries, Leo, Sagitario): Entusiasmo natural, espíritu vibrante y pasión.',
          },
          {
            pt: '• Terra (Touro, Virgem, Capricórnio): Praticidade, segurança, pés no chão e muito carinho demonstrado em atitudes.',
            en: '• Earth (Taurus, Virgo, Capricorn): Grounded practical sense, reliability, and heartfelt loyalty.',
            es: '• Tierra (Tauro, Virgo, Capricornio): Practicidad, lealtad y seguridad en cada paso.',
          },
          {
            pt: '• Ar (Gêmeos, Libra, Aquário): Diálogo, curiosidade, leveza e facilidade para fazer novos amigos.',
            en: '• Air (Gemini, Libra, Aquarius): Meaningful conversation, open-minded curiosity, and easygoing charm.',
            es: '• Aire (Géminis, Libra, Acuario): Buena conversación, curiosidad abierta y ligereza.',
          },
          {
            pt: '• Água (Câncer, Escorpião, Peixes): Intuição aguçada, empatia sincera e capacidade de acolher quem precisa.',
            en: '• Water (Cancer, Scorpio, Pisces): Deep empathy, loving intuition, and a caring protective presence.',
            es: '• Agua (Cáncer, Escorpio, Piscis): Empatía sincera, intuición cálida y amor protector.',
          },
        ],
      },
      {
        heading: {
          pt: 'Como viver em harmonia com todos os signos',
          en: 'Living in harmony with every sign',
          es: 'Viviendo en armonía con cada signo',
        },
        paragraphs: [
          {
            pt: 'Quando você compreende o elemento de quem convive com você, fica muito mais fácil entender os motivos do outro. Em vez de criticar, você passa a admirar o jeito de cada pessoa, cultivando amizades mais felizes e duradouras.',
            en: 'When you understand the element of those around you, understanding their reactions becomes effortless. Instead of frustration, you develop mutual appreciation and lasting harmony.',
            es: 'Al entender el elemento de quienes te rodean, comprender sus reacciones es mucho más fácil. Se cultiva aprecio mutuo y relaciones duraderas.',
          },
        ],
      },
    ],
    keyTakeaways: {
      pt: [
        'Cada elemento traz um dom único para o mundo.',
        'O equilíbrio nasce da união entre diferentes personalidades.',
        'Compreensão mútua é o segredo para laços verdadeiros.',
      ],
      en: [
        'Each element brings an irreplaceable gift to the world.',
        'Balance is born from combining different personalities.',
        'Mutual understanding is the true foundation of lasting bonds.',
      ],
      es: [
        'Cada elemento aporta un don único e irreemplazable.',
        'El equilibrio nace de unir distintas personalidades.',
        'La comprensión mutua es la base de las relaciones verdaderas.',
      ],
    },
  },
  {
    id: 'post-5',
    category: {
      pt: 'BEM-ESTAR',
      en: 'WELLNESS',
      es: 'BIENESTAR',
    },
    categoryColor: 'bg-[#10B981] text-white',
    readTime: {
      pt: '4 min de leitura',
      en: '4 min read',
      es: '4 min de lectura',
    },
    date: {
      pt: '01 Out 2026',
      en: 'Oct 01, 2026',
      es: '01 Oct 2026',
    },
    author: {
      name: 'Aurenstar',
      role: 'Insights',
      avatar: AURENSTAR_AVATAR,
      dateTime: {
        pt: '01 Out 2026 às 09:40',
        en: 'Oct 01, 2026 • 9:40 AM',
        es: '01 Oct 2026 a las 09:40',
      },
      date: {
        pt: '01 Out 2026',
        en: 'Oct 01, 2026',
        es: '01 Out 2026',
      },
    },
    image:
      '/assets/img/1517841905240-472988babd-1200.webp',
    imageCaption: {
      pt: 'Pequenos momentos de silêncio restauram a serenidade interior.',
      en: 'Small quiet moments restore your inner serenity.',
      es: 'Pequeños momentos de silencio restauran la serenidad interior.',
    },
    title: {
      pt: 'Como Criar um Cantinho de Paz em Casa: Dicas Simples e Aconchegantes',
      en: 'How to Create a Peaceful Corner at Home: Simple & Cozy Tips',
      es: 'Cómo Crear un Rincón de Paz en Casa: Consejos Fáciles y Acogedores',
    },
    subtitle: {
      pt: 'Transforme um pequeno espaço do seu quarto ou sala no seu refúgio diário para descansar, ler e recarregar suas energias.',
      en: 'Transform a small corner of your room into a cozy retreat to read, rest, and renew your energy.',
      es: 'Convierte un rincón de tu hogar en un refugio para leer, meditar y renovar tus energías.',
    },
    quote: {
      pt: 'Ter um espaço de silêncio em casa é um abraço diário que você dá em si mesmo.',
      en: 'Having a quiet space at home is like giving yourself a warm, comforting hug every day.',
      es: 'Tener un espacio de calma en casa es como darte un abrazo diario a ti mismo.',
    },
    sections: [
      {
        heading: {
          pt: 'Escolha um lugar com luz natural',
          en: 'Pick a spot with soft natural light',
          es: 'Elige un rincón con luz natural',
        },
        paragraphs: [
          {
            pt: 'Você não precisa de um cômodo inteiro: basta uma poltrona confortável ou uma almofada perto de uma janela. Adicionar uma planta pequena e uma manta macia já traz sensação imediata de aconchego.',
            en: 'You do not need an entire room: a comfortable chair or cushion near a window is enough. Adding a small plant and a soft blanket instantly creates a welcoming haven.',
            es: 'No necesitas una habitación entera: basta un sillón cómodo o un cojín cerca de una ventana. Una plantita y una manta suave crean una sensación acogedora.',
          },
        ],
      },
      {
        heading: {
          pt: 'Reserve dez minutos só para você',
          en: 'Dedicate ten minutes just for you',
          es: 'Dedica diez minutos solo para ti',
        },
        paragraphs: [
          {
            pt: 'Use esse cantinho especial para tomar um chá quente, ler uma mensagem do seu signo na Aurenstar ou simplesmente fechar os olhos e descansar dos barulhos da cidade.',
            en: 'Use this quiet spot to enjoy warm tea, read your daily horoscope on Aurenstar, or gently close your eyes and rest from the bustling city sounds.',
            es: 'Usa este espacio para tomar un té caliente, leer tu mensaje diario en Aurenstar o simplemente cerrar los ojos y descansar.',
          },
        ],
      },
    ],
    keyTakeaways: {
      pt: [
        'Um pequeno cantinho aconchegante renova seu humor.',
        'Luz natural e plantas trazem paz imediata.',
        'Dez minutos de silêncio fazem toda a diferença.',
      ],
      en: [
        'A cozy quiet nook renews your mood and focus.',
        'Natural light and plants bring instant calm.',
        'Ten minutes of peace make a wonderful difference.',
      ],
      es: [
        'Un rincón acogedor renueva tu ánimo y bienestar.',
        'La luz natural y las plantas brindan calma inmediata.',
        'Diez minutos de silencio transforman tu día.',
      ],
    },
  },
  {
    id: 'post-6',
    category: {
      pt: 'HORÓSCOPO',
      en: 'HOROSCOPE',
      es: 'HORÓSCOPO',
    },
    categoryColor: 'bg-[#2878D0] text-white',
    readTime: {
      pt: '3 min de leitura',
      en: '3 min read',
      es: '3 min de lectura',
    },
    date: {
      pt: '28 Set 2026',
      en: 'Sep 28, 2026',
      es: '28 Sep 2026',
    },
    author: {
      name: 'Aurenstar',
      role: 'Insights',
      avatar: AURENSTAR_AVATAR,
      dateTime: {
        pt: '28 Set 2026 às 15:20',
        en: 'Sep 28, 2026 • 3:20 PM',
        es: '28 Sep 2026 a las 15:20',
      },
      date: {
        pt: '28 Set 2026',
        en: 'Sep 28, 2026',
        es: '28 Sep 2026',
      },
    },
    image:
      '/assets/img/1534447677768-be436bb094-1200.webp',
    imageCaption: {
      pt: 'O céu noturno nos ensina que a beleza brilha mesmo nas noites escuras.',
      en: 'The starry sky reminds us that gentle light shines even in the darkest night.',
      es: 'El cielo nocturno nos enseña que la belleza brilha aun en la noche oscura.',
    },
    title: {
      pt: 'Signos e Gratidão: Como Apreciar as Pequenas Vitórias do Cotidiano',
      en: 'Zodiac & Gratitude: Appreciating Daily Small Victories',
      es: 'Signos y Gratitud: Cómo Apreciar las Pequeñas Victorias Diarias',
    },
    subtitle: {
      pt: 'Aprenda a reconhecer o lado bom de cada momento e atrair sentimentos positivos para a sua caminhada.',
      en: 'Learn to recognize the good in every quiet moment and invite positive energy into your journey.',
      es: 'Aprende a reconocer lo bueno en cada momento y atraer energía positiva a tu camino.',
    },
    quote: {
      pt: 'A gratidão transforma o que temos em suficiente, e a vida em um presente diário.',
      en: 'Gratitude turns what we have into enough, and life into a cherished daily gift.',
      es: 'La gratitud transforma lo que tenemos en suficiente y la vida en un regalo diario.',
    },
    sections: [
      {
        heading: {
          pt: 'O poder de agradecer antes de dormir',
          en: 'The power of gratitude before sleep',
          es: 'El poder de agradecer antes de dormir',
        },
        paragraphs: [
          {
            pt: 'No final do dia, antes de fechar os olhos, lembre-se de três coisas boas que aconteceram: um sorriso recebido, uma refeição saborosa ou um momento de descanso. Esse simples hábito acalma a mente e proporciona noites de sono muito mais tranquilas.',
            en: 'At the end of your day, recall three simple good moments: a kind smile, a tasty warm meal, or a peaceful rest. This gentle practice quiets the mind and ensures deep, restful sleep.',
            es: 'Al terminar el día, recuerda tres momentos buenos: una sonrisa, una comida deliciosa o un descanso. Esta práctica calma la mente y mejora tu descanso.',
          },
        ],
      },
    ],
    keyTakeaways: {
      pt: [
        'Agradecer acalma o coração e alivia a ansiedade.',
        'Pequenas vitórias diárias constroem uma vida feliz.',
        'Termine suas noites com pensamentos positivos e serenos.',
      ],
      en: [
        'Gratitude soothes the heart and reduces stress.',
        'Small daily triumphs build a joyful and peaceful life.',
        'End your evenings with gentle and positive reflections.',
      ],
      es: [
        'Agradecer calma el corazón y reduce el estrés.',
        'Las pequeñas victorias diarias construyen una vida feliz.',
        'Termina tus noches con pensamientos positivos e serenos.',
      ],
    },
  },
  {
    id: 'post-gemeos',
    category: {
      pt: 'GÊMEOS',
      en: 'GEMINI',
      es: 'GÉMINIS',
    },
    categoryColor: 'bg-[#F51B83] text-white',
    readTime: {
      pt: '4 min de leitura',
      en: '4 min read',
      es: '4 min de lectura',
    },
    date: {
      pt: '04 Out 2026',
      en: 'Oct 04, 2026',
      es: '04 Oct 2026',
    },
    author: {
      name: 'Aurenstar',
      role: 'Insights',
      avatar: AURENSTAR_AVATAR,
      dateTime: {
        pt: '04 Out 2026 às 17:10',
        en: 'Oct 04, 2026 • 5:10 PM',
        es: '04 Oct 2026 a las 17:10',
      },
      date: {
        pt: '04 Out 2026',
        en: 'Oct 04, 2026',
        es: '04 Oct 2026',
      },
    },
    image:
      '/assets/img/1519671482749-fd09be7cce-1200.webp',
    imageCaption: {
      pt: 'A liberdade dos geminianos nasce da curiosidade constante e da busca por aprender.',
      en: 'Gemini love for personal freedom is born from curiosity and constant growth.',
      es: 'La libertad de los geminianos nace de su curiosidad constante y amor por aprender.',
    },
    title: {
      pt: 'Por que os geminianos priorizam sua liberdade?',
      en: 'Why do Geminis prioritize their personal freedom?',
      es: '¿Por qué los geminianos priorizan su libertad?',
    },
    subtitle: {
      pt: 'Entenda por que a liberdade é tão importante na vida dos geminianos.',
      en: 'Understand why personal freedom is so essential in the lives of Geminis.',
      es: 'Entiende por qué la libertad es tan esencial en la vida de los geminianos.',
    },
    quote: {
      pt: 'Para um geminiano, ser livre não é fugir de compromissos, mas ter espaço para aprender, dialogar e respirar.',
      en: 'For a Gemini, freedom is not avoiding commitment, but having room to breathe, learn, and share.',
      es: 'Para un geminiano, ser libre no es huir, sino tener espacio para aprender, dialogar y respirar.',
    },
    sections: [
      {
        heading: {
          pt: 'A essência do Elemento Ar e da curiosidade',
          en: 'The essence of the Air Element and curiosity',
          es: 'La esencia del Elemento Aire y la curiosidad',
        },
        paragraphs: [
          {
            pt: 'Regidos pelo elemento Ar e pelo planeta Mercúrio, os geminianos possuem uma mente viva e sempre em movimento. Eles sentem uma necessidade natural de explorar novas ideias, conhecer pessoas diferentes e experimentar caminhos inéditos.',
            en: 'Governed by the Air element and Mercury, Geminis possess active and vibrant minds. They naturally cherish exploring new ideas, meeting diverse people, and discovering fresh paths.',
            es: 'Regidos por el Aire y Mercurio, los geminianos tienen una mente inquieta y creativa. Sienten la necesidad natural de explorar nuevas ideas y conocer personas.',
          },
          {
            pt: 'Quando colocados em situações monótonas ou sob regras rígidas demais, eles sentem sua energia criativa diminuir. A liberdade, portanto, não é vaidade: é o ar fresco que mantém acesa sua alegria de viver.',
            en: 'When placed in monotonous routines or rigid boundaries, their creative energy fades. Freedom is not a whim for them: it is the fresh air keeping their joy of life shining.',
            es: 'En situaciones monótonas o rígidas, su vitalidad decae. La libertad no es un capricho: es el aire fresco que mantiene viva su alegría.',
          },
        ],
      },
      {
        heading: {
          pt: 'Espaço para crescer e amar com leveza',
          en: 'Room to grow and love with ease',
          es: 'Espacio para crecer y convivir con ligereza',
        },
        paragraphs: [
          {
            pt: 'Nos relacionamentos e amizades, quem compreende e respeita a autonomia de Gêmeos ganha um companheiro leal, divertido e sempre pronto para ouvir. Para eles, o amor mais bonito é aquele que soma e permite que ambos continuem crescendo juntos.',
            en: 'In relationships, those who honor Gemini autonomy receive an affectionate, loyal, and inspiring partner. For Geminis, genuine love is about walking together while letting each other grow.',
            es: 'En sus relaciones, quienes comprenden la autonomía de Géminis ganan un amigo leal, alegre y atento. El amor verdadero para ellos suma y permite crecer juntos.',
          },
        ],
      },
    ],
    keyTakeaways: {
      pt: [
        'A liberdade estimula a imaginação e inteligência de Gêmeos.',
        'Respeitar seu espaço fortalece laços sinceros e duradouros.',
        'Conversas francas e leves são a melhor forma de se conectar.',
      ],
      en: [
        'Freedom nurtures Gemini creativity and communication.',
        'Respecting their personal space builds deep, lasting trust.',
        'Honest, open-hearted conversations are the best bridge.',
      ],
      es: [
        'La libertad estimula la creatividad y mente de Géminis.',
        'Respetar su espacio fortalece vínculos sinceros.',
        'El diálogo sincero y liviano es el mejor puente para conectar.',
      ],
    },
    zodiacSigns: ['gemeos', 'ar', 'todos'],
  },
  {
    id: 'post-aries',
    category: {
      pt: 'ÁRIES',
      en: 'ARIES',
      es: 'ARIES',
    },
    categoryColor: 'bg-[#EC874F] text-white',
    readTime: {
      pt: '4 min de leitura',
      en: '4 min read',
      es: '4 min de lectura',
    },
    date: {
      pt: '04 Out 2026',
      en: 'Oct 04, 2026',
      es: '04 Oct 2026',
    },
    author: {
      name: 'Aurenstar',
      role: 'Insights',
      avatar: AURENSTAR_AVATAR,
      dateTime: {
        pt: '04 Out 2026 às 16:00',
        en: 'Oct 04, 2026 • 4:00 PM',
        es: '04 Oct 2026 a las 16:00',
      },
      date: {
        pt: '04 Out 2026',
        en: 'Oct 04, 2026',
        es: '04 Oct 2026',
      },
    },
    image:
      '/assets/img/1507525428034-b723cf961d-1200.webp',
    imageCaption: {
      pt: 'A coragem de Áries abre portas para novas conquistas todos os dias.',
      en: 'Aries bravery naturally opens doors to fresh achievements.',
      es: 'La valentía de Aries abre puertas a nuevos logros cada día.',
    },
    title: {
      pt: 'Áries: Como canalizar sua coragem para começar novos projetos',
      en: 'Aries: Channeling your natural courage into new beginnings',
      es: 'Aries: Cómo canalizar tu valentía para iniciar nuevos proyectos',
    },
    subtitle: {
      pt: 'Descubra como o primeiro signo do zodíaco usa sua determinação para vencer o desânimo e agir com sabedoria.',
      en: 'Discover how the first zodiac sign uses pure focus to overcome doubt and take joyful action.',
      es: 'Descubre cómo el primer signo zodiacal usa su fuerza para vencer las dudas y actuar con paz.',
    },
    quote: {
      pt: 'Dar o primeiro passo exige coragem, e Áries nasceu exatamente para mostrar que tudo é possível.',
      en: 'Taking the first step takes courage, and Aries is here to show that all goals are possible.',
      es: 'Dar el primer paso exige valor, y Aries nació para demostrar que todo es posible.',
    },
    sections: [
      {
        heading: {
          pt: 'A força do Fogo interior',
          en: 'The strength of your inner Fire',
          es: 'La fuerza de tu Fuego interior',
        },
        paragraphs: [
          {
            pt: 'Os arianos têm uma faísca única de entusiasmo. Quando decidem fazer algo, colocam o coração por inteiro. Aprender a respirar fundo antes de agir transforma essa energia em vitórias sólidas.',
            en: 'Aries natives possess an authentic spark of passion. When they choose a path, they commit fully. Taking deep breaths before acting turns this fire into solid triumphs.',
            es: 'Los arianos tienen una chispa única. Cuando eligen una meta, se entregan de corazón. Respirar profundo antes de actuar transforma su energía en victorias.',
          },
        ],
      },
    ],
    keyTakeaways: {
      pt: [
        'Sua iniciativa inspira as pessoas ao seu redor.',
        'Respire fundo para manter o foco constante.',
        'Celebre cada pequeno começo.',
      ],
      en: [
        'Your initiative uplifts those around you.',
        'Breathe deeply to maintain clear focus.',
        'Celebrate every small beginning.',
      ],
      es: [
        'Tu iniciativa inspira a los demás.',
        'Respira profundo para mantener el enfoque.',
        'Celebra cada pequeño comienzo.',
      ],
    },
    zodiacSigns: ['aries', 'fogo', 'todos'],
  },
  {
    id: 'post-touro',
    category: {
      pt: 'TOURO',
      en: 'TAURUS',
      es: 'TAURO',
    },
    categoryColor: 'bg-[#B89456] text-white',
    readTime: {
      pt: '4 min de leitura',
      en: '4 min read',
      es: '4 min de lectura',
    },
    date: {
      pt: '04 Out 2026',
      en: 'Oct 04, 2026',
      es: '04 Oct 2026',
    },
    author: {
      name: 'Aurenstar',
      role: 'Insights',
      avatar: AURENSTAR_AVATAR,
      dateTime: {
        pt: '04 Out 2026 às 15:00',
        en: 'Oct 04, 2026 • 3:00 PM',
        es: '04 Oct 2026 a las 15:00',
      },
      date: {
        pt: '04 Out 2026',
        en: 'Oct 04, 2026',
        es: '04 Oct 2026',
      },
    },
    image:
      '/assets/img/1470240731273-7821a6eeb6-1200.webp',
    imageCaption: {
      pt: 'Touro encontra na calma da natureza seu maior porto seguro.',
      en: 'Taurus finds its greatest haven in peaceful nature.',
      es: 'Tauro encuentra en la calma de la naturaleza su mayor bienestar.',
    },
    title: {
      pt: 'Touro: O valor da paciência e da estabilidade no seu dia a dia',
      en: 'Taurus: The comforting power of patience and stability',
      es: 'Tauro: El valor de la paciencia y la calma en tu día a día',
    },
    subtitle: {
      pt: 'Aprenda com Touro como desacelerar, saborear o presente e construir uma rotina cheia de paz.',
      en: 'Learn from Taurus how to slow down, savor the present moment, and build cozy peace.',
      es: 'Aprende de Tauro cómo desacelerar, saborear el presente y construir serenidad.',
    },
    quote: {
      pt: 'As coisas mais belas da vida precisam de tempo para florescer.',
      en: 'The most beautiful gifts in life simply need time to blossom.',
      es: 'Las cosas más bellas de la vida necesitan tiempo para florecer.',
    },
    sections: [
      {
        heading: {
          pt: 'A sabedoria do Elemento Terra',
          en: 'The wisdom of the Earth Element',
          es: 'La sabiduría del Elemento Tierra',
        },
        paragraphs: [
          {
            pt: 'Touro nos ensina que a pressa não traz felicidade. O verdadeiro bem-estar vem de pés firmes no chão, um lar acolhedor e momentos de descanso com quem amamos.',
            en: 'Taurus reminds us that rushing does not lead to joy. True well-being comes from steady steps, a cozy warm home, and sweet quiet moments with loved ones.',
            es: 'Tauro enseña que la prisa no genera felicidad. El bienestar nace de pasos firmes, un hogar acogedor y descanso reparador.',
          },
        ],
      },
    ],
    keyTakeaways: {
      pt: [
        'Respeite o seu próprio ritmo sem comparações.',
        'Desfrute dos prazeres simples da rotina.',
        'Sua lealdade é um presente precioso.',
      ],
      en: [
        'Honor your own pace without comparing.',
        'Savor simple daily comforts.',
        'Your loyalty is a cherished gift.',
      ],
      es: [
        'Respeta tu ritmo sin compararte.',
        'Disfruta de los placeres sencillos.',
        'Tu lealtad es un regalo valioso.',
      ],
    },
    zodiacSigns: ['touro', 'terra', 'todos'],
  },
  {
    id: 'post-cancer',
    category: {
      pt: 'CÂNCER',
      en: 'CANCER',
      es: 'CÁNCER',
    },
    categoryColor: 'bg-[#583980] text-white',
    readTime: {
      pt: '5 min de leitura',
      en: '5 min read',
      es: '5 min de lectura',
    },
    date: {
      pt: '04 Out 2026',
      en: 'Oct 04, 2026',
      es: '04 Oct 2026',
    },
    author: {
      name: 'Aurenstar',
      role: 'Insights',
      avatar: AURENSTAR_AVATAR,
      dateTime: {
        pt: '04 Out 2026 às 14:00',
        en: 'Oct 04, 2026 • 2:00 PM',
        es: '04 Oct 2026 a las 14:00',
      },
      date: {
        pt: '04 Out 2026',
        en: 'Oct 04, 2026',
        es: '04 Oct 2026',
      },
    },
    image:
      '/assets/img/1518495973542-4542c06a58-1200.webp',
    imageCaption: {
      pt: 'O abraço acolhedor de Câncer traz proteção e ternura.',
      en: 'The caring warmth of Cancer brings safety and peace.',
      es: 'El cariño de Cáncer aporta refugio y serenidad.',
    },
    title: {
      pt: 'Câncer: O dom da sensibilidade e como cuidar do seu bem-estar',
      en: 'Cancer: The gift of empathy and gentle self-care',
      es: 'Cáncer: El don de la sensibilidad y el autocuidado cariñoso',
    },
    subtitle: {
      pt: 'Compreenda a força da sua intuição e aprenda a recarregar as energias com carinho e proteção.',
      en: 'Embrace your deep intuition and learn comforting ways to recharge your heart and spirit.',
      es: 'Comprende la fuerza de tu intuición y aprende a recargar energías con amor y paz.',
    },
    quote: {
      pt: 'Cuidar de você com a mesma ternura que você cuida dos outros é seu maior ato de amor.',
      en: 'Caring for yourself with the same warmth you give others is your highest act of love.',
      es: 'Cuidarte con la misma ternura que cuidas a los demás es tu mayor acto de amor.',
    },
    sections: [
      {
        heading: {
          pt: 'O poder curativo da Água e da Lua',
          en: 'The healing power of Water and the Moon',
          es: 'El poder sanador del Agua y la Luna',
        },
        paragraphs: [
          {
            pt: 'Regidos pela Lua, os cancerianos sentem tudo profundamente. Ter momentos de recolhimento em casa e cultivar conversas com pessoas de confiança ajuda a manter seu coração em paz.',
            en: 'Guided by the Moon, Cancer natives feel life deeply. Creating gentle retreats at home and sharing honest talks with trusted friends brings serene balance.',
            es: 'Regidos por la Luna, los cancerianos sienten todo con gran profundidad. El descanso en el hogar y el afecto sincero renuevan su corazón.',
          },
        ],
      },
    ],
    keyTakeaways: {
      pt: [
        'Sua sensibilidade é uma força, não uma fraqueza.',
        'Reserve tempo para descansar em casa.',
        'Ouça a sua intuição amorosa.',
      ],
      en: [
        'Your tenderness is a strength, never a weakness.',
        'Make room to rest comfortably at home.',
        'Listen softly to your intuitive heart.',
      ],
      es: [
        'Tu sensibilidad es una virtud hermosa.',
        'Date tiempo para descansar en tu hogar.',
        'Escucha siempre tu intuición bondadosa.',
      ],
    },
    zodiacSigns: ['cancer', 'agua', 'todos'],
  },
  {
    id: 'post-leao',
    category: {
      pt: 'LEÃO',
      en: 'LEO',
      es: 'LEÓN',
    },
    categoryColor: 'bg-[#B66096] text-white',
    readTime: {
      pt: '4 min de leitura',
      en: '4 min read',
      es: '4 min de lectura',
    },
    date: {
      pt: '04 Out 2026',
      en: 'Oct 04, 2026',
      es: '04 Oct 2026',
    },
    author: {
      name: 'Aurenstar',
      role: 'Insights',
      avatar: AURENSTAR_AVATAR,
      dateTime: {
        pt: '04 Out 2026 às 13:00',
        en: 'Oct 04, 2026 • 1:00 PM',
        es: '04 Out 2026 a las 13:00',
      },
      date: {
        pt: '04 Out 2026',
        en: 'Oct 04, 2026',
        es: '04 Oct 2026',
      },
    },
    image:
      '/assets/img/1506744038136-46273834b3-1200.webp',
    imageCaption: {
      pt: 'O Sol ilumina o caminho e espalha calor por onde passa.',
      en: 'The Sun illuminates the path and spreads warmth everywhere.',
      es: 'El Sol ilumina el sendero y comparte alegría.',
    },
    title: {
      pt: 'Leão: Brilhando com generosidade e iluminando quem está ao seu redor',
      en: 'Leo: Radiating warmth, generosity, and joyful leadership',
      es: 'Leo: Brillando con generosidad y alegría para quienes te rodean',
    },
    subtitle: {
      pt: 'Como o signo regido pelo Sol usa seu coração nobre para incentivar amigos e familiares.',
      en: 'How the Sun-ruled sign uses its kind, noble heart to inspire friends and family.',
      es: 'Cómo el signo regido por el Sol usa su noble corazón para inspirar a todos.',
    },
    quote: {
      pt: 'A verdadeira luz do Sol não ofusca ninguém: ela aquece e faz tudo florescer.',
      en: 'True solar radiance never blinds anyone: it gently warms and helps everyone grow.',
      es: 'La verdadera luz del Sol no ciega: abriga y ayuda a florecer.',
    },
    sections: [
      {
        heading: {
          pt: 'Um coração nobre e acolhedor',
          en: 'A noble and caring heart',
          es: 'Un corazón noble y generoso',
        },
        paragraphs: [
          {
            pt: 'Os leoninos têm o dom de animar qualquer ambiente. Quando expressam sua gratidão e dividem seus sucessos, sua luz brilha ainda mais forte.',
            en: 'Leo natives possess an innate ability to lift any room. When they share victories with humble warmth, their radiant light shines twice as bright.',
            es: 'Los leoninos tienen el don de alegrar cualquier lugar. Al compartir sus éxitos con generosidad, su luz se vuelve imparable.',
          },
        ],
      },
    ],
    keyTakeaways: {
      pt: [
        'Seu otimismo transforma o dia das pessoas.',
        'Liderar com bondade atrai respeito verdadeiro.',
        'Reconheça o valor de quem caminha com você.',
      ],
      en: [
        'Your joy uplifts someone every single day.',
        'Leading with kindness earns sincere respect.',
        'Cherish those walking beside you.',
      ],
      es: [
        'Tu alegría transforma el día de los demás.',
        'Liderar con bondad genera aprecio sincero.',
        'Valora a quienes caminan a tu lado.',
      ],
    },
    zodiacSigns: ['leao', 'fogo', 'todos'],
  },
  {
    id: 'post-virgem',
    category: {
      pt: 'VIRGEM',
      en: 'VIRGO',
      es: 'VIRGO',
    },
    categoryColor: 'bg-[#4A4363] text-white',
    readTime: {
      pt: '4 min de leitura',
      en: '4 min read',
      es: '4 min de lectura',
    },
    date: {
      pt: '04 Out 2026',
      en: 'Oct 04, 2026',
      es: '04 Oct 2026',
    },
    author: {
      name: 'Aurenstar',
      role: 'Insights',
      avatar: AURENSTAR_AVATAR,
      dateTime: {
        pt: '04 Out 2026 às 12:00',
        en: 'Oct 04, 2026 • 12:00 PM',
        es: '04 Out 2026 a las 12:00',
      },
      date: {
        pt: '04 Out 2026',
        en: 'Oct 04, 2026',
        es: '04 Oct 2026',
      },
    },
    image:
      '/assets/img/1499750310107-5fef28a666-1200.webp',
    imageCaption: {
      pt: 'A simplicidade e os pequenos detalhes trazem ordem e serenidade.',
      en: 'Simplicity and mindful details bring calm and clarity.',
      es: 'La sencillez y los pequeños detalles aportan orden y paz.',
    },
    title: {
      pt: 'Virgem: Organização simples e como silenciar a autocobrança',
      en: 'Virgo: Gentle organization and quieting inner perfectionism',
      es: 'Virgo: Organización serena y cómo apagar la autoexigencia',
    },
    subtitle: {
      pt: 'Dicas práticas para quem gosta de tudo no lugar viver com mais leveza e menos preocupação.',
      en: 'Helpful habits for detail-lovers to live with more peaceful ease and lighter shoulders.',
      es: 'Consejos prácticos para vivir con más calma y menos preocupaciones cotidianas.',
    },
    quote: {
      pt: 'Feito com carinho e presença vale muito mais do que perfeito.',
      en: 'Done with presence and care is infinitely better than harsh perfection.',
      es: 'Hacer las cosas con amor y presencia vale más que la perfección.',
    },
    sections: [
      {
        heading: {
          pt: 'A beleza dos pequenos passos',
          en: 'The beauty of small steps',
          es: 'La belleza de los pasos simples',
        },
        paragraphs: [
          {
            pt: 'Virginianos têm um olhar atento para ajudar e melhorar o mundo. Lembre-se de ser tão compreensivo consigo mesmo quanto você é quando apoia um bom amigo.',
            en: 'Virgo natives naturally look for ways to help and uplift. Remember to treat yourself with the very same gentleness you offer to a dear friend.',
            es: 'Los virginianos tienen un gran deseo de ayudar. Recuerda ser tan amable contigo mismo como lo eres con un buen amigo.',
          },
        ],
      },
    ],
    keyTakeaways: {
      pt: [
        'A perfeição não existe: a harmonia sim.',
        'Celebre suas tarefas concluídas sem autocobrança.',
        'Faça pausas conscientes durante o dia.',
      ],
      en: [
        'Perfection is unnecessary; peaceful harmony is true bliss.',
        'Celebrate completed tasks without harsh self-critique.',
        'Take mindful breath pauses during your day.',
      ],
      es: [
        'La perfección no es necesaria; la armonía sí.',
        'Celebra tus avances sin exigencias duras.',
        'Haz pausas conscientes a lo largo del día.',
      ],
    },
    zodiacSigns: ['virgem', 'terra', 'todos'],
  },
  {
    id: 'post-libra',
    category: {
      pt: 'LIBRA',
      en: 'LIBRA',
      es: 'LIBRA',
    },
    categoryColor: 'bg-[#7154F3] text-white',
    readTime: {
      pt: '4 min de leitura',
      en: '4 min read',
      es: '4 min de lectura',
    },
    date: {
      pt: '04 Out 2026',
      en: 'Oct 04, 2026',
      es: '04 Oct 2026',
    },
    author: {
      name: 'Aurenstar',
      role: 'Insights',
      avatar: AURENSTAR_AVATAR,
      dateTime: {
        pt: '04 Out 2026 às 11:00',
        en: 'Oct 04, 2026 • 11:00 AM',
        es: '04 Out 2026 a las 11:00',
      },
      date: {
        pt: '04 Out 2026',
        en: 'Oct 04, 2026',
        es: '04 Oct 2026',
      },
    },
    image:
      '/assets/img/1507525428034-b723cf961d-1200.webp',
    imageCaption: {
      pt: 'O equilíbrio nasce da paz que cultivamos dentro de nós.',
      en: 'Balance is born from the gentle peace we cultivate inside.',
      es: 'El equilibrio nace de la serenidad que cuidamos dentro.',
    },
    title: {
      pt: 'Libra: O segredo para tomar decisões com tranquilidade e harmonia',
      en: 'Libra: The secret to peaceful decision-making and inner balance',
      es: 'Libra: El secreto para tomar decisiones con calma y armonía',
    },
    subtitle: {
      pt: 'Como encontrar equilíbrio entre a mente e o coração para viver sem a angústia da indecisão.',
      en: 'How to harmonize heart and mind so you make choices without stress or second-guessing.',
      es: 'Cómo armonizar mente y corazón para elegir caminos sin dudas ni angustia.',
    },
    quote: {
      pt: 'A harmonia não é a ausência de escolhas, mas a confiança de que você fez o seu melhor.',
      en: 'Harmony is not avoiding choices, but trusting that your intentions are gentle and pure.',
      es: 'La armonía no es evitar decidir, sino confiar en que diste lo mejor de ti.',
    },
    sections: [
      {
        heading: {
          pt: 'A arte de confiar no coração',
          en: 'The art of trusting your heart',
          es: 'El arte de confiar en el corazón',
        },
        paragraphs: [
          {
            pt: 'Regidos por Vênus, os librianos amam a gentileza, a beleza e os relacionamentos pacíficos. Ao tomar decisões, silenciar os ruídos externos e ouvir seu coração traz clareza imediata.',
            en: 'Guided by Venus, Libra souls adore kindness, beauty, and peaceful connections. Silencing outside opinions helps your intuitive wisdom shine through.',
            es: 'Regidos por Venus, los librianos aman la bondad y la armonía. Escuchar la propia voz interior antes de decidir aporta claridad inmediata.',
          },
        ],
      },
    ],
    keyTakeaways: {
      pt: [
        'Confie no seu primeiro sentimento de paz.',
        'Buscar agradar a si mesmo é essencial para o equilíbrio.',
        'Sua gentileza desarma conflitos com facilidade.',
      ],
      en: [
        'Trust your initial feeling of gentle peace.',
        'Honoring your own needs creates true balance.',
        'Your kindness naturally dissolves tension.',
      ],
      es: [
        'Confía en tu primer sentimiento de serenidad.',
        'Cuidar de ti mismo es clave para el equilibrio.',
        'Tu amabilidad desarma tensiones con facilidad.',
      ],
    },
    zodiacSigns: ['libra', 'ar', 'todos'],
  },
  {
    id: 'post-escorpiao',
    category: {
      pt: 'ESCORPIÃO',
      en: 'SCORPIO',
      es: 'ESCORPIO',
    },
    categoryColor: 'bg-[#17366F] text-white',
    readTime: {
      pt: '5 min de leitura',
      en: '5 min read',
      es: '5 min de lectura',
    },
    date: {
      pt: '04 Out 2026',
      en: 'Oct 04, 2026',
      es: '04 Oct 2026',
    },
    author: {
      name: 'Aurenstar',
      role: 'Insights',
      avatar: AURENSTAR_AVATAR,
      dateTime: {
        pt: '04 Out 2026 às 10:00',
        en: 'Oct 04, 2026 • 10:00 AM',
        es: '04 Out 2026 a las 10:00',
      },
      date: {
        pt: '04 Out 2026',
        en: 'Oct 04, 2026',
        es: '04 Oct 2026',
      },
    },
    image:
      '/assets/img/1518709268805-4e9042af9f-1200.webp',
    imageCaption: {
      pt: 'A força da transformação pessoal renova qualquer caminho.',
      en: 'The strength of personal rebirth renews any life journey.',
      es: 'La fuerza de la transformación renueva cualquier sendero.',
    },
    title: {
      pt: 'Escorpião: A força da renovação e como confiar no fluxo da vida',
      en: 'Scorpio: The power of renewal and learning to trust life flow',
      es: 'Escorpio: La fuerza de la renovación y cómo confiar en la vida',
    },
    subtitle: {
      pt: 'Entenda como deixar para trás mágoas antigas para liberar toda a sua força de renascimento.',
      en: 'Discover how releasing old burdens unchains your deepest strength and inner serenity.',
      es: 'Aprende a soltar cargas pasadas para despertar tu mayor capacidad de renacer.',
    },
    quote: {
      pt: 'Soltar o passado não é perder, mas abrir as mãos para receber tudo de bom que está por vir.',
      en: 'Letting go of the past is not a loss; it is opening your hands to welcome blessings ahead.',
      es: 'Soltar el pasado no es perder, sino abrir las manos para recibir bendiciones.',
    },
    sections: [
      {
        heading: {
          pt: 'Profundidade e lealdade verdadeira',
          en: 'Emotional depth and sincere loyalty',
          es: 'Profundidad emocional y lealtad sincera',
        },
        paragraphs: [
          {
            pt: 'Escorpianos amam com lealdade inabalável. Quando aprendem a perdoar e confiar, descobrem uma paz serena e uma proteção espiritual invejável.',
            en: 'Scorpio souls love with unbreakable loyalty. When they embrace forgiveness and trust, they uncover deep peace and resilient spirit.',
            es: 'Los escorpianos aman con lealtad profunda. Cuando perdonan y confían, descubren una paz serena y una fuerza inquebrantable.',
          },
        ],
      },
    ],
    keyTakeaways: {
      pt: [
        'Sua intuição profunda nunca falha.',
        'Pratique o desapego para renovar suas energias.',
        'Sua lealdade é um dos maiores tesouros do zodíaco.',
      ],
      en: [
        'Your deep intuition is remarkably accurate.',
        'Practice gentle letting-go to refresh your spirit.',
        'Your loyalty is a true treasure.',
      ],
      es: [
        'Tu intuición profunda es acertada.',
        'Practica el desapego para renovarte.',
        'Tu lealtad es un tesoro valioso.',
      ],
    },
    zodiacSigns: ['escorpiao', 'agua', 'todos'],
  },
  {
    id: 'post-sagitario',
    category: {
      pt: 'SAGITÁRIO',
      en: 'SAGITTARIUS',
      es: 'SAGITARIO',
    },
    categoryColor: 'bg-[#EC874F] text-white',
    readTime: {
      pt: '4 min de leitura',
      en: '4 min read',
      es: '4 min de lectura',
    },
    date: {
      pt: '04 Out 2026',
      en: 'Oct 04, 2026',
      es: '04 Oct 2026',
    },
    author: {
      name: 'Aurenstar',
      role: 'Insights',
      avatar: AURENSTAR_AVATAR,
      dateTime: {
        pt: '04 Out 2026 às 09:00',
        en: 'Oct 04, 2026 • 9:00 AM',
        es: '04 Out 2026 a las 09:00',
      },
      date: {
        pt: '04 Out 2026',
        en: 'Oct 04, 2026',
        es: '04 Oct 2026',
      },
    },
    image:
      '/assets/img/1506703719100-a0f3a48c0f-1200.webp',
    imageCaption: {
      pt: 'O horizonte aberto convida Sagitário a sonhar e explorar.',
      en: 'The wide horizon invites Sagittarius to dream and explore.',
      es: 'El horizonte abierto invita a Sagitario a soñar y viajar.',
    },
    title: {
      pt: 'Sagitário: Otimismo contagiante e a busca por novos horizontes',
      en: 'Sagittarius: Contagious optimism and embracing life adventures',
      es: 'Sagitario: Optimismo alegre y la búsqueda de nuevos horizontes',
    },
    subtitle: {
      pt: 'Como manter sua alegria de viver e seu entusiasmo mesmo diante das rotinas do cotidiano.',
      en: 'How to keep your sense of wonder and joyful spirit alive throughout everyday routines.',
      es: 'Cómo mantener tu alegría y espíritu aventurero en cada jornada.',
    },
    quote: {
      pt: 'Viver é uma viagem maravilhosa, e a alegria é a melhor bagagem que podemos carregar.',
      en: 'Living is a splendid journey, and gratitude is the finest luggage we can carry.',
      es: 'Vivir es un viaje hermoso y la alegría es el mejor equipaje.',
    },
    sections: [
      {
        heading: {
          pt: 'O dom da esperança inabalável',
          en: 'The gift of uplifting hope',
          es: 'El don de la esperanza alegre',
        },
        paragraphs: [
          {
            pt: 'Regidos por Júpiter, os sagitarianos têm a capacidade mágica de ver o lado positivo de qualquer desafio. Manter o contato com a natureza e aprender coisas novas renova seu ânimo.',
            en: 'Guided by Jupiter, Sagittarius natives naturally notice the silver lining in every challenge. Spending time outside and learning fresh wisdom restores their joyful energy.',
            es: 'Regidos por Júpiter, los sagitarianos ven el lado positivo en cada desafío. Aprender cosas nuevas y estar en la naturaleza renueva su vitalidad.',
          },
        ],
      },
    ],
    keyTakeaways: {
      pt: [
        'Seu bom humor é um remédio para todos.',
        'Explore novos caminhos sem medo.',
        'Confie que o universo conspira a seu favor.',
      ],
      en: [
        'Your good humor heals those around you.',
        'Explore new paths with confidence.',
        'Trust that the universe is working with you.',
      ],
      es: [
        'Tu buen humor es un regalo para los demás.',
        'Explora nuevos caminos sin temores.',
        'Confía en que la vida siempre te cuida.',
      ],
    },
    zodiacSigns: ['sagitario', 'fogo', 'todos'],
  },
  {
    id: 'post-capricornio',
    category: {
      pt: 'CAPRICÓRNIO',
      en: 'CAPRICORN',
      es: 'CAPRICORNIO',
    },
    categoryColor: 'bg-[#382B7D] text-white',
    readTime: {
      pt: '4 min de leitura',
      en: '4 min read',
      es: '4 min de lectura',
    },
    date: {
      pt: '04 Out 2026',
      en: 'Oct 04, 2026',
      es: '04 Oct 2026',
    },
    author: {
      name: 'Aurenstar',
      role: 'Insights',
      avatar: AURENSTAR_AVATAR,
      dateTime: {
        pt: '04 Out 2026 às 08:00',
        en: 'Oct 04, 2026 • 8:00 AM',
        es: '04 Out 2026 a las 08:00',
      },
      date: {
        pt: '04 Out 2026',
        en: 'Oct 04, 2026',
        es: '04 Oct 2026',
      },
    },
    image:
      '/assets/img/1517841905240-472988babd-1200.webp',
    imageCaption: {
      pt: 'Passo a passo, Capricórnio alcança o topo da montanha com calma.',
      en: 'Step by step, Capricorn ascends the summit with serene dignity.',
      es: 'Paso a paso, Capricornio alcanza la cima con paciencia y calma.',
    },
    title: {
      pt: 'Capricórnio: Construindo conquistas sólidas com paciência e serenidade',
      en: 'Capricorn: Building steady achievements with calm determination',
      es: 'Capricornio: Construyendo metas sólidas con paciencia y serenidad',
    },
    subtitle: {
      pt: 'Como transformar sua disciplina em paz mental e aprender a desfrutar do caminho percorrido.',
      en: 'How to channel your dedicated focus into inner peace and cherish every step along the way.',
      es: 'Cómo convertir la disciplina en paz mental y disfrutar del camino con tranquilidad.',
    },
    quote: {
      pt: 'A montanha mais alta é conquistada com passos firmes, respirando o ar puro de cada degrau.',
      en: 'The highest peak is reached with patient, steady steps, savoring the clear air of each level.',
      es: 'La montaña más alta se escala con pasos firmes, disfrutando de cada descanso.',
    },
    sections: [
      {
        heading: {
          pt: 'A firmeza e a sabedoria do tempo',
          en: 'Steadfastness and the gift of time',
          es: 'La firmeza y la sabiduría del tiempo',
        },
        paragraphs: [
          {
            pt: 'Capricórnio entende o valor do trabalho bem feito. Celebrar as pequenas vitórias e reservar momentos de descanso sem culpa é o segredo para manter sua energia renovada.',
            en: 'Capricorns understand the worth of honest, steady effort. Celebrating small wins and enjoying guilt-free rest is the key to lasting joy.',
            es: 'Capricornio conoce el valor del esfuerzo constante. Celebrar pequeños logros y descansar sin culpas renueva su fuerza.',
          },
        ],
      },
    ],
    keyTakeaways: {
      pt: [
        'Você é mais forte do que imagina.',
        'O descanso faz parte do seu sucesso.',
        'Confie na solidez dos seus passos.',
      ],
      en: [
        'You are stronger and wiser than you think.',
        'Rest is an essential part of your success.',
        'Trust in the steady foundation you build.',
      ],
      es: [
        'Eres más fuerte y sabio de lo que crees.',
        'El descanso es parte de tu bienestar.',
        'Confía en la solidez de tus pasos.',
      ],
    },
    zodiacSigns: ['capricornio', 'terra', 'todos'],
  },
  {
    id: 'post-aquario',
    category: {
      pt: 'AQUÁRIO',
      en: 'AQUARIUS',
      es: 'ACUARIO',
    },
    categoryColor: 'bg-[#56C5DC] text-white',
    readTime: {
      pt: '4 min de leitura',
      en: '4 min read',
      es: '4 min de lectura',
    },
    date: {
      pt: '04 Out 2026',
      en: 'Oct 04, 2026',
      es: '04 Oct 2026',
    },
    author: {
      name: 'Aurenstar',
      role: 'Insights',
      avatar: AURENSTAR_AVATAR,
      dateTime: {
        pt: '04 Out 2026 às 07:30',
        en: 'Oct 04, 2026 • 7:30 AM',
        es: '04 Out 2026 a las 07:30',
      },
      date: {
        pt: '04 Out 2026',
        en: 'Oct 04, 2026',
        es: '04 Oct 2026',
      },
    },
    image:
      '/assets/img/1506744038136-46273834b3-1200.webp',
    imageCaption: {
      pt: 'Ideias inovadoras trazem esperança e renovação para o coletivo.',
      en: 'Inventive ideas bring joyful hope and fresh winds to everyone.',
      es: 'Las ideas innovadoras traen esperanza y bienestar.',
    },
    title: {
      pt: 'Aquário: Criatividade sem limites e o desejo de fazer o bem',
      en: 'Aquarius: Limitless creativity and the heartfelt desire to help',
      es: 'Acuario: Creatividad sin límites y el deseo sincero de hacer el bien',
    },
    subtitle: {
      pt: 'Descubra como a mente visionária de Aquário encontra calma ao se conectar com causas inspiradoras.',
      en: 'Learn how the visionary mind of Aquarius discovers true peace by connecting to uplifting causes.',
      es: 'Descubre cómo la mente creativa de Acuario halla calma conectando con causas hermosas.',
    },
    quote: {
      pt: 'Ser diferente é o maior presente que você pode oferecer ao mundo.',
      en: 'Being authentically unique is the greatest gift you can share with the world.',
      es: 'Ser auténtico es el regalo más hermoso que puedes ofrecer al mundo.',
    },
    sections: [
      {
        heading: {
          pt: 'A liberdade de pensar além',
          en: 'The freedom to envision tomorrow',
          es: 'La libertad de soñar el mañana',
        },
        paragraphs: [
          {
            pt: 'Os aquarianos têm uma visão adiantada do futuro. Eles sonham com um mundo mais justo, amigável e acolhedor para todos. Expressar sua arte e conversar com amigos renova sua mente.',
            en: 'Aquarius natives hold a forward-looking vision. They dream of a kind, supportive, and open-hearted world. Creative outlets and sincere friendships rejuvenate their mind.',
            es: 'Los acuarianos tienen una mirada esperanzadora hacia el futuro. Crear y compartir charlas sinceras con amigos renueva su mente.',
          },
        ],
      },
    ],
    keyTakeaways: {
      pt: [
        'Sua autenticidade é inspiradora.',
        'Cultive amizades que respeitem suas ideias.',
        'Acredite no poder das suas boas intenções.',
      ],
      en: [
        'Your originality naturally inspires others.',
        'Cherish friendships that embrace your true self.',
        'Trust in the good ripples of your kind actions.',
      ],
      es: [
        'Tu autenticidad inspira a los demás.',
        'Valora las amistades que te aceptan como eres.',
        'Confía en tus buenas intenciones.',
      ],
    },
    zodiacSigns: ['aquario', 'ar', 'todos'],
  },
  {
    id: 'post-peixes',
    category: {
      pt: 'PEIXES',
      en: 'PISCES',
      es: 'PISCIS',
    },
    categoryColor: 'bg-[#B319A6] text-white',
    readTime: {
      pt: '5 min de leitura',
      en: '5 min read',
      es: '5 min de lectura',
    },
    date: {
      pt: '04 Out 2026',
      en: 'Oct 04, 2026',
      es: '04 Oct 2026',
    },
    author: {
      name: 'Aurenstar',
      role: 'Insights',
      avatar: AURENSTAR_AVATAR,
      dateTime: {
        pt: '04 Out 2026 às 07:00',
        en: 'Oct 04, 2026 • 7:00 AM',
        es: '04 Out 2026 a las 07:00',
      },
      date: {
        pt: '04 Out 2026',
        en: 'Oct 04, 2026',
        es: '04 Oct 2026',
      },
    },
    image:
      '/assets/img/1534447677768-be436bb094-1200.webp',
    imageCaption: {
      pt: 'A água mística de Peixes conecta o coração com a paz do universo.',
      en: 'The mystical waters of Pisces link the heart with cosmic peace.',
      es: 'Las aguas tranquilas de Piscis conectan el corazón con la paz.',
    },
    title: {
      pt: 'Peixes: Intuição, sensibilidade e a magia de sonhar acordado',
      en: 'Pisces: Intuition, gentle empathy, and the magic of dreaming',
      es: 'Piscis: Intuición, ternura y la magia de soñar despierto',
    },
    subtitle: {
      pt: 'Como proteger sua energia amorosa e usar sua imaginação para trazer beleza à vida.',
      en: 'How to protect your gentle heart and use your imagination to invite everyday beauty.',
      es: 'Cómo cuidar tu energía amorosa y usar tu imaginación para llenar de luz la vida.',
    },
    quote: {
      pt: 'A bondade é a linguagem que os astros sussurram para quem sabe escutar.',
      en: 'Kindness is the gentle language the stars whisper to open hearts.',
      es: 'La bondad es el idioma que las estrellas susurran a quienes saben escuchar.',
    },
    sections: [
      {
        heading: {
          pt: 'O oceano de empatia pisciana',
          en: 'The deep ocean of Pisces empathy',
          es: 'El océano de empatía pisciana',
        },
        paragraphs: [
          {
            pt: 'Piscianos têm um coração generoso e uma capacidade única de compreender as dores alheias. Momentos de silêncio, música suave e conexão espiritual protegem seu bem-estar.',
            en: 'Pisces natives hold generous hearts and deep understanding. Peaceful music, quiet reflections, and spiritual grounding protect their sweet serenity.',
            es: 'Los piscianos tienen un corazón bondadoso. Momentos de calma, música suave y reflexión cuidan su bienestar.',
          },
        ],
      },
    ],
    keyTakeaways: {
      pt: [
        'Sua empatia é uma bênção para quem te cerca.',
        'Proteja seus momentos de descanso e silêncio.',
        'A imaginação é a chave para a sua paz.',
      ],
      en: [
        'Your empathy is a blessing to everyone around you.',
        'Safeguard your moments of stillness.',
        'Your imagination is your doorway to peace.',
      ],
      es: [
        'Tu empatía es una bendición hermosa.',
        'Cuida tus momentos de silencio y descanso.',
        'Tu imaginación es tu puente hacia la paz.',
      ],
    },
    zodiacSigns: ['peixes', 'agua', 'todos'],
  },
];
