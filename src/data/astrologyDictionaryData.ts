export interface TermFaqItem {
  pergunta: string; // question
  resposta: string; // answer
}

export interface TermMiniJogo {
  pergunta: string;
  opcoes: {
    texto: string;
    correta: boolean;
    explicacao: string;
  }[];
}

// Field names stay as they are (they are code names); every visible text below is in English.
export interface DictionaryTerm {
  id: string;
  slug: string;
  termo: string; // term
  tituloSEO: string; // page title for search engines
  perguntaGoogle: string; // the question people type in Google
  categoria: 'Planets & Bodies' | 'Chart Concepts' | 'Signs & Elements' | 'Phases & Movements';
  icone: string;
  resumoUmaLinha: string;
  explicacaoEducativa: string;
  chamadaCuriosa: string;
  ganchoCuriosidade?: string;
  oQueSignifica: string; // what it means
  oQueSignificaNaAstrologia: string; // what it means in astrology
  exemploFicticio: string; // fictional example
  dicaRapida: string; // quick tip
  miniJogo: TermMiniJogo;
  faq?: TermFaqItem[];
  termosRelacionados?: string[]; // ids
  ferramentaRelacionada?: {
    nome: string;
    rota: 'daily-message' | 'aureneffect' | 'discover-sign';
  };
}

export const ASTROLOGY_DICTIONARY_TERMS: DictionaryTerm[] = [
  {
    id: 'mercurio-retrogrado',
    slug: 'what-is-mercury-retrograde',
    termo: 'Mercury Retrograde',
    perguntaGoogle: 'What is Mercury retrograde?',
    tituloSEO: 'What Is Mercury Retrograde? A Simple Astrology Meaning',
    categoria: 'Planets & Bodies',
    icone: '🪐',
    resumoUmaLinha: 'When the planet of communication seems to move backward in the sky.',
    explicacaoEducativa: 'Learn why Mercury retrograde is so feared and how it really affects everyday conversations and delays.',
    chamadaCuriosa: 'Learn why Mercury retrograde is so feared',
    oQueSignifica:
      'It is when the planet Mercury seems to move backward in the sky. In truth, it never really goes backward; it is just an optical illusion from here on Earth, like when you are in a fast car and the car in the next lane seems to roll in reverse.',
    oQueSignificaNaAstrologia:
      'In astrology, Mercury rules conversations, messages, travel and electronic devices. When it is retrograde, this period is linked to small mix-ups, misread messages, delays and the need to calmly review what we have already done.',
    exemploFicticio:
      'Imagine Maria agrees to meet a friend at the mall, but they each understand a different time and miss each other. Maria jokes: "Of course, Mercury retrograde messing up my plans again!"',
    dicaRapida: 'Read your messages twice before sending and confirm times calmly.',
    miniJogo: {
      pergunta: 'Your phone glitched, or someone misunderstood your text message today. What is the best way to react?',
      opcoes: [
        {
          texto: 'Take a deep breath, explain kindly and be patient ✨',
          correta: true,
          explicacao: 'Perfect! During Mercury retrograde, patience and a calm conversation clear up any misunderstanding easily!',
        },
        {
          texto: 'Get angry and send 20 voice messages shouting',
          correta: false,
          explicacao: 'Easy now! That only creates more confusion. Take a deep breath and talk it through gently.',
        },
      ],
    },
    faq: [
      {
        pergunta: 'Is Mercury retrograde dangerous?',
        resposta: 'No! It is simply a time that asks for more calm, patience and attention to details.',
      },
      {
        pergunta: 'How long does Mercury retrograde last?',
        resposta: 'It lasts about 3 weeks and happens about 3 to 4 times a year.',
      },
    ],
    termosRelacionados: ['signo-ascendente', 'mapa-astral', 'lua-cheia'],
    ferramentaRelacionada: {
      nome: "Read Today's Daily Message",
      rota: 'daily-message',
    },
  },
  {
    id: 'signo-ascendente',
    slug: 'what-is-rising-sign',
    termo: 'Rising Sign (Ascendant)',
    perguntaGoogle: 'What is a rising sign?',
    tituloSEO: 'What Is a Rising Sign? Your First-Impression Sign Explained',
    categoria: 'Chart Concepts',
    icone: '🌅',
    resumoUmaLinha: 'The sign that was rising on the horizon when you were born: your front door.',
    explicacaoEducativa: 'Learn why your rising sign shapes the first impression people get of you before you even say a word.',
    chamadaCuriosa: 'Learn why the Rising Sign is the first thing people notice about you',
    oQueSignifica:
      'It is the sign that was rising on the eastern horizon at the exact minute you were born. That is why you need your birth time to find your rising sign accurately.',
    oQueSignificaNaAstrologia:
      'The rising sign is like your "front door" or the first impression you give the world. It is how you speak, how you start new things and how people see you before they know you deeply.',
    exemploFicticio:
      'Lucas is a Pisces (very sensitive and calm inside), but has an Aries Rising. When he walks into a meeting, he speaks up, takes the lead and seems bossy. People are surprised when they find out how sweet he really is.',
    dicaRapida: 'Your Rising Sign is the outfit you wear to introduce yourself to the world.',
    miniJogo: {
      pergunta: 'When you arrive at a party or an interview for the first time, what do people feel right away?',
      opcoes: [
        {
          texto: 'The energy of your Rising Sign (your style and first impression)',
          correta: true,
          explicacao: 'That is right! The Rising Sign is the front door of your personality to the world.',
        },
        {
          texto: 'The brand of sneakers you left at home',
          correta: false,
          explicacao: 'Nobody can guess that! What shows up right away is your way of expressing yourself and your presence.',
        },
      ],
    },
    faq: [
      {
        pergunta: 'Is the Rising Sign stronger than the Sun sign?',
        resposta: 'The Sun is who you are deep in your heart; the Rising Sign is how people see you at first glance.',
      },
    ],
    termosRelacionados: ['signo-solar', 'signo-lunar', 'casas-astrologicas'],
    ferramentaRelacionada: {
      nome: 'Calculate in Aureneffect',
      rota: 'aureneffect',
    },
  },
  {
    id: 'signo-solar',
    slug: 'what-is-sun-sign',
    termo: 'Sun Sign (Your Main Sign)',
    perguntaGoogle: 'What is a sun sign?',
    tituloSEO: 'What Is a Sun Sign? Your Core Essence and Life Force',
    categoria: 'Signs & Elements',
    icone: '☀️',
    resumoUmaLinha: 'Where the Sun was when you were born: your energy battery.',
    explicacaoEducativa: 'Learn why your sun sign is the most famous of all and what it reveals about your true source of energy and brightness.',
    chamadaCuriosa: "Learn why your sun sign doesn't tell the whole story about you",
    oQueSignifica:
      'It is the position of the Sun in the sky on your birthday. It is the sign everyone tells you when they ask: "What\'s your sign?"',
    oQueSignificaNaAstrologia:
      'It represents your heart, your basic essence, your energy and what makes you want to wake up happy every day.',
    exemploFicticio:
      'When Julia says she is a Leo, she means her Sun Sign: she loves celebrating birthdays and spreads good humor and joy wherever she goes.',
    dicaRapida: 'The Sun is the battery of your heart and your most authentic life force.',
    miniJogo: {
      pergunta: 'When someone asks "What\'s your sign?", which position are they talking about?',
      opcoes: [
        {
          texto: 'The Sun Sign (where the Sun was on the day you were born)',
          correta: true,
          explicacao: 'Right on! The sun sign is the best known of all and represents the battery of light in your heart.',
        },
        {
          texto: "The horoscope in the newspaper from two weeks ago",
          correta: false,
          explicacao: 'No! Your sun sign comes from your birth date and never changes throughout your life.',
        },
      ],
    },
    faq: [
      {
        pergunta: 'Why is not everyone with the same sign alike?',
        resposta: 'Because each person has a unique combination of Moon, Rising Sign and other planets in their birth chart.',
      },
    ],
    termosRelacionados: ['signo-lunar', 'signo-ascendente', 'elementos-astrologicos'],
    ferramentaRelacionada: {
      nome: 'Find My Sign',
      rota: 'discover-sign',
    },
  },
  {
    id: 'signo-lunar',
    slug: 'what-is-moon-sign',
    termo: 'Moon Sign',
    perguntaGoogle: 'What is a moon sign?',
    tituloSEO: 'What Does the Moon Mean in Your Birth Chart? Your Inner Feelings',
    categoria: 'Planets & Bodies',
    icone: '🌙',
    resumoUmaLinha: 'The sign of your deepest emotions and of what brings you comfort.',
    explicacaoEducativa: 'Learn why your Moon looks after your secret feelings and what you need to feel safe and at peace.',
    chamadaCuriosa: 'Learn why the Moon rules your mood and your tears',
    oQueSignifica:
      'It is the sign where the Moon was at the exact moment you took your first breath in the world.',
    oQueSignificaNaAstrologia:
      'While the Sun takes care of what you do in the daytime for everyone to see, the Moon takes care of what you feel inside: your private emotions, your fears and how you like to be comforted.',
    exemploFicticio:
      'Peter is a Capricorn (very focused and serious at work), but has his Moon in Cancer. At home, he watches cartoons while eating popcorn and gets emotional easily over family stories.',
    dicaRapida: 'The Moon represents your inner child and your safe harbor.',
    miniJogo: {
      pergunta: 'You had a tiring day and just want to stay quiet in your corner and be comforted. Which body in the sky is speaking loudest?',
      opcoes: [
        {
          texto: 'The Moon (it looks after your private emotions and your coziness)',
          correta: true,
          explicacao: 'Exactly! The Moon is your safe little corner where you feel welcome, rested and at peace.',
        },
        {
          texto: 'The Monday morning alarm clock',
          correta: false,
          explicacao: 'The alarm clock only wants you to hurry! What truly looks after your rest is the energy of the Moon.',
        },
      ],
    },
    faq: [
      {
        pergunta: 'How do I find out my Moon sign?',
        resposta: 'Just enter your birth date, time and city in our free Aureneffect calculator.',
      },
    ],
    termosRelacionados: ['signo-solar', 'lua-cheia', 'lua-nova'],
    ferramentaRelacionada: {
      nome: 'Calculate Your Moon in Aureneffect',
      rota: 'aureneffect',
    },
  },
  {
    id: 'mapa-astral',
    slug: 'what-is-birth-chart',
    termo: 'Birth Chart (Natal Chart)',
    perguntaGoogle: 'What is a birth chart?',
    tituloSEO: 'What Is a Birth Chart? The Complete Guide, Made Simple',
    categoria: 'Chart Concepts',
    icone: '🧭',
    resumoUmaLinha: 'A photograph of the sky taken at the exact second you were born.',
    explicacaoEducativa: 'Learn why the birth chart is seen as a one-of-a-kind photograph of the sky that works like your personal manual of talents.',
    chamadaCuriosa: 'Learn why your Birth Chart is like your fingerprint in the sky',
    oQueSignifica:
      'It is a panoramic photo of the sky at the exact moment and city where you were born, showing where each planet and constellation was.',
    oQueSignificaNaAstrologia:
      'It is your personal manual. It shows your natural talents, where you find success most easily and which areas you need to nurture with more care.',
    exemploFicticio:
      'Carla had her birth chart done and understood why she loves teaching so much, yet needs quiet moments every day to recharge.',
    dicaRapida: 'Nobody in the world has a birth chart exactly like yours.',
    miniJogo: {
      pergunta: 'What is the Birth Chart for in real life?',
      opcoes: [
        {
          texto: 'As a map of talents so you can know yourself better and make good choices',
          correta: true,
          explicacao: 'Well done! It is like an instruction manual for your natural gifts and your essence.',
        },
        {
          texto: 'To guess next week\'s lottery numbers',
          correta: false,
          explicacao: 'Astrology is about self-knowledge and everyday life, not about guessing the lottery!',
        },
      ],
    },
    faq: [
      {
        pergunta: 'Does the birth chart predict the future?',
        resposta: 'No! It is like a navigation map that shows who you are so you can make the best choices.',
      },
    ],
    termosRelacionados: ['casas-astrologicas', 'signo-ascendente', 'retorno-de-saturno'],
    ferramentaRelacionada: {
      nome: 'Try Aureneffect',
      rota: 'aureneffect',
    },
  },
  {
    id: 'retorno-de-saturno',
    slug: 'what-is-saturn-return',
    termo: 'Saturn Return',
    perguntaGoogle: 'What is the Saturn return?',
    tituloSEO: 'What Is the Saturn Return at 29? Understand It Without Fear',
    categoria: 'Phases & Movements',
    icone: '🪐',
    resumoUmaLinha: 'The "graduation" into adult life that happens around ages 28 to 30.',
    explicacaoEducativa: 'Learn why the Saturn return around age 29 is so memorable and how it truly transforms your adult life.',
    chamadaCuriosa: 'Learn why turning 29 can turn your life upside down',
    oQueSignifica:
      'The planet Saturn takes almost 30 years to make a full trip around the Sun. When it returns to the same place it was when you were born, we have the Saturn Return.',
    oQueSignificaNaAstrologia:
      'It is the moment when life asks you: "Are you happy with the path you chose?" It is a time when we take on real responsibilities, change careers or leave behind what no longer makes sense.',
    exemploFicticio:
      'At 29, Rodrigo quit a job he could not stand anymore and finally opened his artisan bakery, taking the lead on his own dream.',
    dicaRapida: 'The Saturn Return is not a punishment; it is life helping you build solid things.',
    miniJogo: {
      pergunta: 'You are close to 29 or 30 and feel like changing direction and growing up. What is the best attitude?',
      opcoes: [
        {
          texto: 'Take the reins of your life and build plans that truly last',
          correta: true,
          explicacao: 'Exactly! Saturn rewards those who have the courage to mature and make choices with the heart.',
        },
        {
          texto: 'Panic and think everything is over',
          correta: false,
          explicacao: 'There is no reason to be scared! It is one of the most beautiful phases of growth and achievement.',
        },
      ],
    },
    faq: [
      {
        pergunta: 'Does the Saturn Return happen more than once?',
        resposta: 'Yes, around age 29 and again around age 58.',
      },
    ],
    termosRelacionados: ['mapa-astral', 'casas-astrologicas', 'revolucao-solar'],
    ferramentaRelacionada: {
      nome: 'Read the Daily Message',
      rota: 'daily-message',
    },
  },
  {
    id: 'casas-astrologicas',
    slug: 'what-are-astrological-houses',
    termo: 'Astrological Houses',
    perguntaGoogle: 'What are the 12 astrological houses?',
    tituloSEO: 'What Are the Astrological Houses? The Pizza of Your 12 Life Areas',
    categoria: 'Chart Concepts',
    icone: '🏠',
    resumoUmaLinha: 'The 12 sections of the chart that each stand for a subject of your life.',
    explicacaoEducativa: 'Learn why the birth chart is divided into 12 houses and how each one looks after an area like love, money and work.',
    chamadaCuriosa: 'Learn how astrology divides your life into 12 secret areas',
    oQueSignifica:
      'Imagine the birth chart is a round pizza sliced into 12 equal pieces. Each piece of the sky is called a "house".',
    oQueSignificaNaAstrologia:
      'Each house looks after a theme: the 1st House is about you, the 2nd about money, the 4th about your home and family, the 7th about love and partnerships, and the 10th about your career.',
    exemploFicticio:
      'If you have several planets gathered in the 4th House, your home is the most sacred place in your life and you love having loved ones over.',
    dicaRapida: 'Signs show HOW you feel; houses show WHERE things happen.',
    miniJogo: {
      pergunta: 'If the birth chart were a real house, what would the 12 astrological houses be?',
      opcoes: [
        {
          texto: 'The rooms of the house: the love bedroom, the family kitchen, the work office',
          correta: true,
          explicacao: 'Nice! Each house looks after an important corner of your routine and your life.',
        },
        {
          texto: 'Twelve broken bricks on the sidewalk',
          correta: false,
          explicacao: 'They are divisions with deep meaning for each of your dreams!',
        },
      ],
    },
    faq: [
      {
        pergunta: 'Does everyone have all 12 houses?',
        resposta: 'Yes! We all have all 12 houses in our chart, even the ones with no planets in them.',
      },
    ],
    termosRelacionados: ['signo-ascendente', 'mapa-astral', 'venus-no-mapa'],
    ferramentaRelacionada: {
      nome: 'Try Aureneffect',
      rota: 'aureneffect',
    },
  },
  {
    id: 'venus-no-mapa',
    slug: 'what-does-venus-mean',
    termo: 'Venus (The Planet of Love)',
    perguntaGoogle: 'What does Venus mean in astrology?',
    tituloSEO: 'What Does Venus Mean in Astrology? Your Style of Love and Attraction',
    categoria: 'Planets & Bodies',
    icone: '💖',
    resumoUmaLinha: 'The planet of love, beauty, pleasures and how you relate to others.',
    explicacaoEducativa: 'Learn why Venus is so famous in love and how it shows the kind of care and affection that truly wins you over.',
    chamadaCuriosa: 'Learn why Venus defines who you love and who attracts you',
    oQueSignifica:
      'It is the bright planet we see early in the evening or at dawn, popularly known as the Morning Star or the Evening Star.',
    oQueSignificaNaAstrologia:
      'Venus shows your way of loving, what you find beautiful, what gives you pleasure and how you like to be treated by the people you love.',
    exemploFicticio:
      'Beatrice has Venus in Taurus. For her, good affection is a carefully made dinner at home with a delicious dessert.',
    dicaRapida: 'Venus reveals your favorite love language.',
    miniJogo: {
      pergunta: 'If you want to know which kind of affection makes your heart beat faster, which planet teaches you that?',
      opcoes: [
        {
          texto: 'The planet Venus (the master of love, affection and pleasures)',
          correta: true,
          explicacao: 'Spot on! Venus is the cupid of astrology and shows how you like to be loved and cared for.',
        },
        {
          texto: "The bank's interest calculator",
          correta: false,
          explicacao: 'The bank only cares about bills! The one who cares about your loving heart is Venus.',
        },
      ],
    },
    faq: [
      {
        pergunta: 'Does Venus only look after romantic relationships?',
        resposta: 'It also speaks about friendships, money, beauty and the things you value.',
      },
    ],
    termosRelacionados: ['marte-no-mapa', 'sinastria-amorosa', 'signo-solar'],
    ferramentaRelacionada: {
      nome: 'Find My Sign',
      rota: 'discover-sign',
    },
  },
  {
    id: 'marte-no-mapa',
    slug: 'what-does-mars-mean',
    termo: 'Mars (The Planet of Action)',
    perguntaGoogle: 'What does Mars mean in astrology?',
    tituloSEO: 'What Does Mars Mean in Astrology? Your Courage and Drive',
    categoria: 'Planets & Bodies',
    icone: '🔥',
    resumoUmaLinha: 'Your willpower, courage and ability to start new things.',
    explicacaoEducativa: 'Learn why Mars is the planet of action and how it gives you courage and willpower to start new things.',
    chamadaCuriosa: 'Learn why Mars is the accelerator that gives you courage to act',
    oQueSignifica:
      'It is the famous red planet, our neighbor in the solar system.',
    oQueSignificaNaAstrologia:
      'Mars is your accelerator! It shows how you fight for what you want, your courage, how you react under pressure and your physical energy.',
    exemploFicticio:
      'When the alarm goes off for your workout and you jump out of bed full of energy, that is the energy of Mars speaking loud.',
    dicaRapida: 'Mars is the spark that turns plans into real action.',
    miniJogo: {
      pergunta: 'When you need courage to say "enough" or to start a new project, which energy are you activating?',
      opcoes: [
        {
          texto: 'The strength of Mars (the accelerator that sets your plans in motion)',
          correta: true,
          explicacao: 'Exactly! Mars is the spark of courage that takes any dream off the paper and makes it happen.',
        },
        {
          texto: "The alarm clock's snooze mode",
          correta: false,
          explicacao: 'Snooze wants rest! Mars wants action and victory!',
        },
      ],
    },
    faq: [
      {
        pergunta: 'Does Mars mean aggression?',
        resposta: 'Not necessarily. When balanced, it stands for initiative and healthy courage.',
      },
    ],
    termosRelacionados: ['venus-no-mapa', 'signo-solar', 'elementos-astrologicos'],
    ferramentaRelacionada: {
      nome: 'Try Aureneffect',
      rota: 'aureneffect',
    },
  },
  {
    id: 'elementos-astrologicos',
    slug: 'what-are-astrology-elements',
    termo: 'The 4 Elements (Fire, Earth, Air and Water)',
    perguntaGoogle: 'What are the 4 elements in astrology?',
    tituloSEO: 'The 4 Elements in Astrology: Fire, Earth, Air and Water Explained',
    categoria: 'Signs & Elements',
    icone: '🌿',
    resumoUmaLinha: 'The 4 energies of nature that divide the 12 zodiac signs.',
    explicacaoEducativa: 'Learn why the 4 elements (Fire, Earth, Air and Water) define your temperament and how to balance each one in your routine.',
    chamadaCuriosa: 'Learn which of the 4 elements rules your way of being',
    oQueSignifica:
      'They are the four basic forces that make up the Earth and that divide the 12 signs into 4 groups of 3 signs each.',
    oQueSignificaNaAstrologia:
      'Fire brings enthusiasm and action. Earth brings grounding and security. Air brings ideas and communication. Water brings feelings and affection.',
    exemploFicticio:
      'In a group project: the Fire person comes up with the exciting idea, the Earth person builds the budget spreadsheet, the Air person writes the presentation and the Water person looks after the team mood.',
    dicaRapida: 'Having a bit of each element in your life is the recipe for balance.',
    miniJogo: {
      pergunta: 'Which element in astrology is known for being the most down-to-earth, organized and practical?',
      opcoes: [
        {
          texto: 'Earth (Taurus, Virgo and Capricorn)',
          correta: true,
          explicacao: 'Perfect! The Earth element loves security, organization, being grounded and real results.',
        },
        {
          texto: 'Air (Gemini, Libra and Aquarius)',
          correta: false,
          explicacao: 'The Air element loves ideas flying free and good conversations, but Earth is the one that organizes everything!',
        },
      ],
    },
    faq: [
      {
        pergunta: 'Which signs belong to each element?',
        resposta: 'Fire (Aries, Leo, Sagittarius), Earth (Taurus, Virgo, Capricorn), Air (Gemini, Libra, Aquarius) and Water (Cancer, Scorpio, Pisces).',
      },
    ],
    termosRelacionados: ['signo-solar', 'signo-ascendente', 'cuspide'],
    ferramentaRelacionada: {
      nome: 'Find My Sign',
      rota: 'discover-sign',
    },
  },
  {
    id: 'sinastria-amorosa',
    slug: 'what-is-synastry',
    termo: 'Synastry (Sign Compatibility)',
    perguntaGoogle: 'What is synastry in astrology?',
    tituloSEO: 'What Is Synastry? How Signs Match in Love and Friendship',
    categoria: 'Chart Concepts',
    icone: '💞',
    resumoUmaLinha: "Comparing two birth charts to understand a couple's connection.",
    explicacaoEducativa: 'Learn why some people click so easily and how synastry explains the connection and chemistry of a couple.',
    chamadaCuriosa: 'Find out if your sign really matches your crush or if a fight is coming',
    oQueSignifica:
      'It is the study of placing two people\'s birth charts side by side to see how they connect.',
    oQueSignificaNaAstrologia:
      'It shows where the couple has chemistry and easy conversation, and where they need a little more patience and empathy.',
    exemploFicticio:
      'Paula and Thiago did a synastry and laughed to see that they understand each other with just a look, but need to plan weekend outings ahead of time.',
    dicaRapida: 'No sign is incompatible when there is respect and love.',
    miniJogo: {
      pergunta: 'What does Synastry teach us about two people who like each other?',
      opcoes: [
        {
          texto: 'Where the couple has natural harmony and where they need more conversation and care',
          correta: true,
          explicacao: 'Beautiful! Synastry is a tool of love and empathy to live in harmony.',
        },
        {
          texto: 'Who should pay the restaurant bill',
          correta: false,
          explicacao: 'The restaurant bill is better settled with kindness and good humor on the spot!',
        },
      ],
    },
    faq: [
      {
        pergunta: 'Is synastry only for dating?',
        resposta: 'It works for dating, marriage, friendships and even business partners.',
      },
    ],
    termosRelacionados: ['venus-no-mapa', 'mapa-astral', 'signo-lunar'],
    ferramentaRelacionada: {
      nome: 'Read the Daily Message',
      rota: 'daily-message',
    },
  },
  {
    id: 'revolucao-solar',
    slug: 'what-is-solar-return',
    termo: 'Solar Return (Your Personal New Year)',
    perguntaGoogle: 'What is a solar return?',
    tituloSEO: 'What Is a Solar Return? Your Birthday Birth Chart',
    categoria: 'Phases & Movements',
    icone: '🎂',
    resumoUmaLinha: 'The yearly chart calculated on the exact day of your birthday.',
    explicacaoEducativa: 'Learn why your birthday is your personal New Year and what the Solar Return shows for your next 12 months.',
    chamadaCuriosa: 'Learn why your luck starts over from zero on your birthday',
    oQueSignifica:
      'Every year, on your birthday, the Sun returns to exactly the same degree where it was when you were born.',
    oQueSignificaNaAstrologia:
      'It is the chart of the energies of your new year of life! It shows the central themes that will mark the next 12 months of your journey.',
    exemploFicticio:
      'In the year she turned 25, Vanessa\'s Solar Return pointed to a strong focus on studies, and she won a graduate school scholarship.',
    dicaRapida: 'Your birthday is the most powerful moment of renewal in your year.',
    miniJogo: {
      pergunta: 'When does your cosmic energy reset and you start a brand-new year?',
      opcoes: [
        {
          texto: 'On your birthday (your true private New Year)',
          correta: true,
          explicacao: 'Congratulations! Your birthday is the magical moment to blow out the candles and renew every wish.',
        },
        {
          texto: 'On the Tuesday after a long weekend, right after lunch',
          correta: false,
          explicacao: 'No! Your personal cycle starts over on the day you were born.',
        },
      ],
    },
    faq: [
      {
        pergunta: 'Does the Solar Return change my sign?',
        resposta: 'No, your natal sign never changes; it only shows that year\'s focuses and novelties.',
      },
    ],
    termosRelacionados: ['signo-solar', 'retorno-de-saturno', 'mapa-astral'],
    ferramentaRelacionada: {
      nome: 'Try Aureneffect',
      rota: 'aureneffect',
    },
  },
  {
    id: 'lua-cheia',
    slug: 'what-is-full-moon-meaning',
    termo: 'Full Moon',
    perguntaGoogle: 'What does the full moon mean in astrology?',
    tituloSEO: 'Full Moon in Astrology: The Peak of Emotions and Celebration',
    categoria: 'Phases & Movements',
    icone: '🌕',
    resumoUmaLinha: 'The phase of harvest, vibrant emotions and celebrating achievements.',
    explicacaoEducativa: 'Learn why the Full Moon stirs our emotions so much and why we feel more sensitive and ready to celebrate.',
    chamadaCuriosa: 'Learn why people get so restless and sleepless on a Full Moon',
    oQueSignifica:
      'It is the phase when the Moon is fully lit by the Sun, shining round and silver in the night sky.',
    oQueSignificaNaAstrologia:
      'It represents the peak of the month\'s energy! Emotions become more intense and we feel like celebrating what we have harvested.',
    exemploFicticio:
      'On a Full Moon night, Camila notices she is full of ideas, dreams a lot and feels like gathering her friends.',
    dicaRapida: 'On the Full Moon, be thankful for all the good that happened this month.',
    miniJogo: {
      pergunta: 'On a Full Moon night, how do our emotions and energy usually feel?',
      opcoes: [
        {
          texto: 'More intense, vibrant and full of desire to talk or celebrate',
          correta: true,
          explicacao: 'That is it! The Full Moon lights everything up with a lot of intensity and celebration.',
        },
        {
          texto: 'Completely off, like a computer with no battery',
          correta: false,
          explicacao: 'Quite the opposite! The Full Moon overflows with energy and light in our night.',
        },
      ],
    },
    faq: [
      {
        pergunta: 'Does the Full Moon disturb sleep?',
        resposta: 'Since there is more natural light and energy in the air, many people feel their mind is more active.',
      },
    ],
    termosRelacionados: ['lua-nova', 'signo-lunar', 'eclipse-astrologico'],
    ferramentaRelacionada: {
      nome: "See Today's Moon",
      rota: 'daily-message',
    },
  },
  {
    id: 'lua-nova',
    slug: 'what-is-new-moon-meaning',
    termo: 'New Moon',
    perguntaGoogle: 'What does the new moon mean in astrology?',
    tituloSEO: 'New Moon in Astrology: The Best Time to Start Your Dreams',
    categoria: 'Phases & Movements',
    icone: '🌑',
    resumoUmaLinha: 'The start of a cycle: the right time to plant new plans.',
    explicacaoEducativa: 'Learn why the New Moon is the perfect phase to plant new goals and calmly restart your dreams from scratch.',
    chamadaCuriosa: 'Learn why the New Moon is the best night of the month to restart your plans',
    oQueSignifica:
      'It is when the Moon is lined up between the Earth and the Sun, becoming invisible in the night sky.',
    oQueSignificaNaAstrologia:
      'It is the phase for planting seeds and starting over. It is the perfect moment to write down goals and begin projects.',
    exemploFicticio:
      'On the first night of the New Moon, Bruno calmly writes his professional goals for the next 30 days in his notebook.',
    dicaRapida: 'The New Moon is the best day to take the first step.',
    miniJogo: {
      pergunta: 'When the sky is dark on a New Moon night, what is the most beautiful thing you can do?',
      opcoes: [
        {
          texto: 'Write new wishes in your notebook and plant good ideas for the month',
          correta: true,
          explicacao: 'Excellent! The New Moon is like fertile ground waiting for your best seeds.',
        },
        {
          texto: 'Give up on everything and think the month is lost',
          correta: false,
          explicacao: 'Not at all! It is a time of fresh starts, hope and new chances.',
        },
      ],
    },
    faq: [
      {
        pergunta: 'How many days does the Moon cycle last?',
        resposta: 'It lasts about 29.5 days, going through New, Waxing, Full and Waning.',
      },
    ],
    termosRelacionados: ['lua-cheia', 'signo-lunar', 'eclipse-astrologico'],
    ferramentaRelacionada: {
      nome: 'Daily Message',
      rota: 'daily-message',
    },
  },
  {
    id: 'eclipse-astrologico',
    slug: 'what-is-eclipse-meaning',
    termo: 'Eclipse',
    perguntaGoogle: 'What does an eclipse mean in astrology?',
    tituloSEO: 'What Does an Eclipse Mean in Astrology? Change and New Paths',
    categoria: 'Phases & Movements',
    icone: '🌘',
    resumoUmaLinha: 'The speeding up of important changes and the closing of old cycles.',
    explicacaoEducativa: 'Learn why eclipses bring such fast changes and work as life accelerators to help you turn the page.',
    chamadaCuriosa: 'Learn why eclipses bring twists that change your destiny',
    oQueSignifica:
      'It is when the Earth or the Moon passes in front of the light of the Sun, casting a temporary shadow.',
    oQueSignificaNaAstrologia:
      'Eclipses work like a life accelerator button, bringing necessary turns of the page.',
    exemploFicticio:
      'During eclipse week, Mariana finally found the courage to move to a house near the beach, something she had dreamed of for years.',
    dicaRapida: 'On eclipse days, rest and avoid heated arguments.',
    miniJogo: {
      pergunta: 'When an eclipse happens in the sky, what does it usually speed up in our lives?',
      opcoes: [
        {
          texto: 'Necessary changes that make room for better stories',
          correta: true,
          explicacao: 'Well done! The eclipse gives us a gentle push to turn the page with courage.',
        },
        {
          texto: 'How fast the water boils for instant ramen',
          correta: false,
          explicacao: 'The stove stays exactly the same! The eclipse stirs up our life paths.',
        },
      ],
    },
    faq: [
      {
        pergunta: 'How many eclipses happen per year?',
        resposta: 'Usually between 4 and 6 eclipses (solar and lunar) happen each year.',
      },
    ],
    termosRelacionados: ['lua-cheia', 'lua-nova', 'retorno-de-saturno'],
    ferramentaRelacionada: {
      nome: 'Try Aureneffect',
      rota: 'aureneffect',
    },
  },
  {
    id: 'cuspide',
    slug: 'what-is-cusp-astrology',
    termo: 'Cusp (Sign Transition)',
    perguntaGoogle: 'What does it mean to be born on the cusp?',
    tituloSEO: 'What Is a Cusp in Astrology? Born on the Day Signs Change',
    categoria: 'Signs & Elements',
    icone: '🔄',
    resumoUmaLinha: 'Being born right on the day the Sun moves from one sign to the next.',
    explicacaoEducativa: 'Learn why being born on the day a sign changes gives you a special charm and how you inherit the neighbor sign\'s energy.',
    chamadaCuriosa: 'Learn why people born at a sign change feel they have two sides',
    oQueSignifica:
      'It is the invisible border that separates one sign from the neighboring sign in the sky.',
    oQueSignificaNaAstrologia:
      'People born on the first or last day of a sign feel a little of the influence of the neighboring sign.',
    exemploFicticio:
      'Ryan was born at the turn from Taurus to Gemini: he loves cooking in peace at home (Taurus), but also loves spending hours chatting by text (Gemini).',
    dicaRapida: 'You have one official sun sign, but you may carry the charm of the neighbor.',
    miniJogo: {
      pergunta: 'What special thing do people born right on the day a sign is changing get?',
      opcoes: [
        {
          texto: 'The charm and special flavor of the neighboring sign',
          correta: true,
          explicacao: 'Right on! You have your official sign and still get a magical pinch of the neighbor.',
        },
        {
          texto: 'They have no sign at all, forever',
          correta: false,
          explicacao: 'Everyone has their own single official sun sign in the chart!',
        },
      ],
    },
    faq: [
      {
        pergunta: 'Can a person have two sun signs?',
        resposta: 'No. Depending on the exact minute of birth, the Sun was already in one specific sign.',
      },
    ],
    termosRelacionados: ['signo-solar', 'elementos-astrologicos', 'signo-ascendente'],
    ferramentaRelacionada: {
      nome: 'Find My Sign',
      rota: 'discover-sign',
    },
  },
];

export const getDictionaryTermBySlug = (slug: string): DictionaryTerm | undefined => {
  const cleanSlug = slug.toLowerCase().trim();
  return ASTROLOGY_DICTIONARY_TERMS.find(
    (t) =>
      t.slug.toLowerCase() === cleanSlug ||
      t.id.toLowerCase() === cleanSlug ||
      cleanSlug.includes(t.slug.toLowerCase()) ||
      t.slug.toLowerCase().includes(cleanSlug)
  );
};
