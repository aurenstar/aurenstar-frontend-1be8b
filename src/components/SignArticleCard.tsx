import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { BLOG_ARTICLES } from '../data/blogArticles';
import { SIGNS_DATA } from '../data/signsData';
import { getArticleSlugById } from '../utils/articleSlug';
import { isPlainLeftClick } from '../utils/links';
import { trackEvent } from '../utils/analytics';

const TEXT = {
  pt: { kicker: 'Um signo para cada pessoa', cta: (n: string) => `Ler tudo sobre ${n}` },
  en: { kicker: 'A sign for every person', cta: (n: string) => `Read everything about ${n}` },
  es: { kicker: 'Un signo para cada persona', cta: (n: string) => `Leer todo sobre ${n}` },
} as const;

const plain = (v: string) => v.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

/** Under a tool result: the blog article about the person's own sign, so the result leads into the blog. */
export const SignArticleCard: React.FC<{ sign?: string; tool: string }> = ({ sign, tool }) => {
  const { language } = useLanguage();
  const lang = (language === 'pt' || language === 'es' ? language : 'en') as 'pt' | 'en' | 'es';
  if (!sign) return null;
  const key = plain(sign);
  const info = Object.values(SIGNS_DATA).find((x) => x.key === key || plain(x.name.pt) === key || plain(x.name.en) === key || plain(x.name.es) === key);
  const article = info && BLOG_ARTICLES.find((a) => a.id === info.articleId);
  if (!info || !article) return null;
  const t = TEXT[lang];
  const name = info.name[lang];
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
    <a href={url} onClick={open} className="group mx-auto my-8 block w-[calc(100%-2rem)] max-w-xl overflow-hidden rounded-3xl border border-[#D9E8F8] bg-white shadow-[0_10px_30px_rgba(57,130,200,0.12)] transition-all hover:-translate-y-0.5 hover:border-[#3982C8]/40">
      <div className="relative aspect-video w-full overflow-hidden bg-[#E4F1FF]">
        <img src={article.image} alt={article.title[lang] || article.title.pt} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-extrabold text-[#17366F] shadow-sm"><span className="text-base leading-none text-[#E73578]">{info.symbol}</span>{name}</span>
      </div>
      <div className="p-5 sm:p-6">
        <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#E73578]">{t.kicker}</p>
        <h3 className="mt-1.5 text-lg font-extrabold leading-snug text-[#172B4D] transition-colors group-hover:text-[#3982C8] sm:text-xl">{article.title[lang] || article.title.pt}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-[#647DA5]">{article.subtitle[lang] || article.subtitle.pt}</p>
        <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#E73578] px-5 py-2.5 text-sm font-extrabold text-white transition-colors group-hover:bg-[#D0306C]">{t.cta(name)}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
      </div>
    </a>
  );
};
