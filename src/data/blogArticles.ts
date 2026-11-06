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

const HAND_WRITTEN_ARTICLES: BlogArticleContent[] = [
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
];

// Articles written in WordPress (kept up to date by `npm run sync:wordpress`).
import wordpressArticles from './wordpressArticles.generated.json';
import { withHandTitle } from './articleTitles';

/** The WordPress articles (newest first), then the one placeholder still kept (Capricorn, until a real article exists). */
export const BLOG_ARTICLES: BlogArticleContent[] = [
  ...(wordpressArticles as unknown as BlogArticleContent[]).map(withHandTitle),
  ...HAND_WRITTEN_ARTICLES,
];

/**
 * In the browser the WordPress articles arrive without their long text (see lightArticles in vite.config.ts).
 * Article pages call this first; it loads the full text once and fills it into the same objects.
 */
let fullArticlesPromise: Promise<void> | null = null;
export const ensureFullArticles = (): Promise<void> => {
  if (!fullArticlesPromise) {
    fullArticlesPromise = import('./wordpressArticlesFull').then(({ default: full }) => {
      const byId = new Map((full as unknown as BlogArticleContent[]).map((a) => [a.id, a]));
      for (const article of BLOG_ARTICLES) {
        const f = byId.get(article.id);
        if (f && article.sections.length === 0) {
          article.sections = f.sections;
          article.keyTakeaways = f.keyTakeaways;
        }
      }
    });
  }
  return fullArticlesPromise;
};
