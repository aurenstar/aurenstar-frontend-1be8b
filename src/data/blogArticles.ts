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
  /** ids of other articles the author picked as "keep reading" (real links on the page) */
  related?: string[];
}


// Articles written in WordPress (kept up to date by `npm run sync:wordpress`).
import wordpressArticles from './wordpressArticles.generated.json';
import { withHandTitle } from './articleTitles';

/** The articles written in WordPress (newest first). */
export const BLOG_ARTICLES: BlogArticleContent[] = (wordpressArticles as unknown as BlogArticleContent[]).map(withHandTitle);

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
