import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { BLOG_ARTICLES } from '../data/blogArticles';
import { SIGNS_DATA } from '../data/signsData';
import { getArticleSlugById } from '../utils/articleSlug';
import { isPlainLeftClick } from '../utils/links';
import { trackEvent } from '../utils/analytics';

const plain = (v: string) => v.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

/** Under a tool result: the blog article about the person's own sign, so the result leads into the blog. */
export const SignArticleCard: React.FC<{ sign?: string; tool: string; flush?: boolean }> = ({ sign, tool, flush = false }) => {
  const { language } = useLanguage();
  const lang = (language === 'pt' || language === 'es' ? language : 'en') as 'pt' | 'en' | 'es';
  if (!sign) return null;
  const key = plain(sign);
  const info = Object.values(SIGNS_DATA).find((x) => x.key === key || plain(x.name.pt) === key || plain(x.name.en) === key || plain(x.name.es) === key);
  const article = info && BLOG_ARTICLES.find((a) => a.id === info.articleId);
  if (!info || !article) return null;
  const url = `/blog/${getArticleSlugById(article.id)}`;
  const open = (e: React.MouseEvent) => {
    trackEvent('sign_article_click', { tool, sign: info.key });
    if (!isPlainLeftClick(e)) return;
    e.preventDefault();
    window.history.pushState({ page: 'article', id: article.id }, '', url);
    window.dispatchEvent(new PopStateEvent('popstate', { state: { page: 'article', id: article.id } }));
    window.scrollTo({ top: 0 });
  };

  return (
    <section className={flush ? 'w-full' : 'mx-auto my-8 w-full max-w-3xl'}>
      <a href={url} onClick={open} className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-[#D9E8F8] bg-white p-3 shadow-sm transition-all duration-300 hover:border-[#3982C8]/40 hover:shadow-md sm:p-4">
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-24 sm:w-36 sm:rounded-2xl">
          <img src={article.image} alt={article.title[lang] || article.title.pt} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </div>
        <div className="min-w-0 flex-1 pr-1">
          <span className="mb-1 block text-[10px] font-extrabold uppercase tracking-wider text-[#3982C8] sm:text-xs">{article.category[lang] || article.category.pt}</span>
          <h4 className="mb-1 line-clamp-2 text-xs font-bold leading-snug text-[#172B4D] transition-colors group-hover:text-[#3982C8] sm:text-base">{article.title[lang] || article.title.pt}</h4>
          <p className="line-clamp-2 text-[11px] font-normal leading-relaxed text-[#647DA5] sm:text-xs">{article.subtitle[lang] || article.subtitle.pt}</p>
        </div>
        <div className="shrink-0 pr-1 text-[#17366F] transition-all duration-300 group-hover:translate-x-1.5 group-hover:text-[#3982C8]"><ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" /></div>
      </a>
    </section>
  );
};
