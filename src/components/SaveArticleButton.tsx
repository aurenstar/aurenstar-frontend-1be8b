import React, { useEffect, useRef, useState } from 'react';
import { Bookmark } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getSavedArticles, subscribeSavedArticles, toggleSavedArticle } from '../utils/savedArticles';

const TEXT = {
  en: { save: 'Save article', saved: 'Remove from collection', added: 'Added to collection', removed: 'Removed from collection' },
  pt: { save: 'Salvar artigo', saved: 'Remover da coleção', added: 'Adicionado à coleção', removed: 'Removido da coleção' },
  es: { save: 'Guardar artículo', saved: 'Quitar de la colección', added: 'Añadido a la colección', removed: 'Eliminado de la colección' },
} as const;

/** Bookmark next to a blog card title. Click saves/removes the article and shows a small confirmation. */
export const SaveArticleButton: React.FC<{ articleId: string }> = ({ articleId }) => {
  const { language } = useLanguage();
  const t = TEXT[(language || 'en') as keyof typeof TEXT] || TEXT.en;
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const sync = () => setSaved(getSavedArticles().includes(articleId));
    sync();
    const unsubscribe = subscribeSavedArticles(sync);
    return () => {
      unsubscribe();
      window.clearTimeout(timer.current);
    };
  }, [articleId]);

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // do not open the article
    event.preventDefault();
    const nowSaved = toggleSavedArticle(articleId);
    setSaved(nowSaved);
    setMessage(nowSaved ? t.added : t.removed);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMessage(null), 2200);
  };

  return (
    <span className="relative shrink-0">
      <button
        type="button"
        onClick={handleClick}
        onKeyDown={(event) => event.stopPropagation()}
        aria-pressed={saved}
        aria-label={saved ? t.saved : t.save}
        title={saved ? t.saved : t.save}
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[#172B4D] transition-colors hover:bg-[#E4F1FF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2878D0]"
      >
        <Bookmark className="h-6 w-6" strokeWidth={2} fill={saved ? 'currentColor' : 'none'} />
      </button>
      {message && (
        <span
          role="status"
          className="pointer-events-none absolute right-0 top-full z-30 mt-2 whitespace-nowrap rounded-lg bg-[#172B4D] px-3.5 py-2 text-xs font-semibold text-white shadow-lg"
        >
          <span aria-hidden="true" className="absolute -top-1 right-3.5 h-2.5 w-2.5 rotate-45 bg-[#172B4D]" />
          {message}
        </span>
      )}
    </span>
  );
};
