import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Share2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ShareModal } from './ShareModal';
import type { BlogArticleContent } from '../data/blogArticles';
import { getArticleSlugById } from '../utils/articleSlug';

const LABEL = { en: 'Share article', pt: 'Compartilhar artigo', es: 'Compartir artículo' } as const;

/** Share icon next to a blog card title. Opens the site's share window for that article. */
export const ShareArticleButton: React.FC<{ article: BlogArticleContent }> = ({ article }) => {
  const { language } = useLanguage();
  const lang = (language || 'en') as 'pt' | 'en' | 'es';
  const [open, setOpen] = useState(false);
  const label = LABEL[lang] || LABEL.en;

  const stop = (event: React.SyntheticEvent) => event.stopPropagation();

  return (
    <span className="relative shrink-0">
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation(); // do not open the article
          event.preventDefault();
          setOpen(true);
        }}
        onKeyDown={stop}
        aria-label={label}
        title={label}
        aria-haspopup="dialog"
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[#172B4D] transition-colors hover:bg-[#E4F1FF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3982C8]"
      >
        <Share2 className="h-[22px] w-[22px]" strokeWidth={2} />
      </button>
      {open &&
        typeof document !== 'undefined' &&
        // Rendered on <body> so the card's hover animation cannot shift the window, and wrapped so
        // clicks inside it never reach the card (which would open the article).
        createPortal(
          <div onClick={stop} onKeyDown={stop}>
            <ShareModal
              isOpen
              onClose={() => setOpen(false)}
              title={article.title[lang] || article.title.pt}
              url={`${window.location.origin}/blog/${getArticleSlugById(article.id)}`}
              image={article.image}
              category={article.category[lang] || article.category.pt}
            />
          </div>,
          document.body
        )}
    </span>
  );
};
