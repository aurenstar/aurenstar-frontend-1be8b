import { cardImage } from '../utils/cardImage';
import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Download, Sparkles, Check, Smartphone } from 'lucide-react';
import { downloadStoryCard, downloadVerticalStoryCard, type StoryCardData } from '../utils/generateStoryCard';
import { useLanguage } from '../context/LanguageContext';
import { FeedbackButtons } from '../components/FeedbackButtons';
import { DESCRIBE_ME_RESULT_KEY } from './DescribeMePage';
import { themeTitle } from '../utils/unfilteredThemes';
import { useTranslated } from '../utils/useTranslated';
import { BLOG_ARTICLES } from '../data/blogArticles';

const POST_BY_SIGN: Record<string, string> = { aries: 'wp-1338', taurus: 'wp-1296', gemini: 'wp-442', cancer: 'wp-1319', leo: 'wp-653', virgo: 'wp-654', libra: 'wp-655', scorpio: 'wp-656', sagittarius: 'wp-657', capricorn: 'wp-1377', aquarius: 'wp-658', pisces: 'wp-659' };

interface DescribeMeResult { name: string; sign: string; birthDate: string; birthTime?: string; birthCity?: string; description: string; createdAt: string; tagline?: string; themeKey?: string; lang?: 'en' | 'pt' | 'es'; bigThree?: { sun: { name: string; symbol: string }; moon: { name: string; symbol: string }; rising: { name: string; symbol: string } | null }; }
interface DescribeMeResultPageProps { onBackToForm: () => void; onBackToHome: () => void; onNavigateToBlog: () => void; onOpenArticle?: (articleId: string) => void; }

const AVATAR = '/aurenstar-avatar.webp';

const TITLES: Record<string, string> = {
  aries: 'Aries and the courage to begin again', taurus: 'Taurus and the art of moving at your own pace', gemini: 'Gemini and the creative brilliance of reinventing yourself', cancer: 'Cancer and the quiet strength of feeling deeply', leo: 'Leo and the generous power of being fully yourself', virgo: 'Virgo and the intelligence of noticing what matters', libra: 'Libra and the beauty of finding your own balance', scorpio: 'Scorpio and the courage to look beneath the surface', sagittarius: 'Sagittarius and the freedom to keep discovering', capricorn: 'Capricorn and the patience behind every achievement', aquarius: 'Aquarius and the original way you see the world', pisces: 'Pisces and the imagination that makes life feel wider',
};

const formatTime = (iso: string, language: string) => new Intl.DateTimeFormat(language === 'pt' ? 'pt-BR' : language === 'es' ? 'es-ES' : 'en-US', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(iso));

export const DescribeMeResultPage: React.FC<DescribeMeResultPageProps> = ({ onBackToForm, onBackToHome, onNavigateToBlog, onOpenArticle }) => {
  const { language } = useLanguage();
  const [stored, setStored] = useState<DescribeMeResult | null>(null);
  const [busy, setBusy] = useState<'card' | 'story' | 'share' | null>(null);
  const lang = language || 'en';
  const { value: result } = useTranslated<DescribeMeResult>(
    stored,
    stored?.lang,
    lang as 'pt' | 'en' | 'es',
    (r) => [r.description, r.bigThree?.sun.name || '', r.bigThree?.moon.name || '', r.bigThree?.rising?.name || ''],
    (r, t) => ({ ...r, description: t[0] || r.description, bigThree: r.bigThree ? { sun: { ...r.bigThree.sun, name: t[1] || r.bigThree.sun.name }, moon: { ...r.bigThree.moon, name: t[2] || r.bigThree.moon.name }, rising: r.bigThree.rising ? { ...r.bigThree.rising, name: t[3] || r.bigThree.rising.name } : null } : r.bigThree }),
  );

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DESCRIBE_ME_RESULT_KEY);
      if (raw) setStored(JSON.parse(raw) as DescribeMeResult);
    } catch { setStored(null); }
  }, []);

  const post = result ? BLOG_ARTICLES.find((a) => a.id === POST_BY_SIGN[result.sign]) : undefined;
  const recommendLabel = lang === 'pt' ? 'Um post especial para você' : lang === 'es' ? 'Un post especial para ti' : 'A special post for you';
  const cardTitle = result ? themeTitle(result.bigThree?.sun.name || result.sign, result.themeKey, lang as 'en' | 'pt' | 'es') : '';
  const downloadLabel = lang === 'pt' ? 'Baixar card' : lang === 'es' ? 'Descargar card' : 'Download card';
  const storyLabel = 'Story 9:16';
  const backLabel = lang === 'pt' ? 'Criar outra descrição' : lang === 'es' ? 'Crear otra descripción' : 'Create another description';

  const cardData = (): StoryCardData => ({
    userName: result?.name || 'aurenstar', signName: result?.bigThree?.sun.name || result?.sign || '', signSymbol: result?.bigThree?.sun.symbol || '', signTheme: '',
    title: cardTitle, affirmation: '', message: result?.description || '', advice: '', lang: lang as 'pt' | 'en' | 'es',
  });
  const run = async (kind: 'card' | 'story' | 'share', fn: () => Promise<unknown>) => { if (busy) return; setBusy(kind); try { await fn(); } catch { /* user cancelled or canvas unavailable */ } finally { setBusy(null); } };
  const download = () => run('card', () => downloadStoryCard(cardData()));
  const downloadStory = () => run('story', () => downloadVerticalStoryCard(cardData()));

  if (!result) return <section className="min-h-[70vh] bg-[#C9E5FF] px-4 py-32 text-center"><Sparkles className="mx-auto h-8 w-8 text-[#3982C8]" /><h1 className="mt-4 text-2xl font-extrabold text-[#172B4D]">{lang === 'pt' ? 'Crie sua descrição primeiro' : 'Create your description first'}</h1><button type="button" onClick={onBackToForm} className="mt-6 rounded-full bg-[#3982C8] px-5 py-3 text-sm font-bold text-white">{backLabel}</button></section>;

  return <section className="min-h-[78vh] bg-[#C9E5FF] px-4 py-28 sm:px-6 sm:py-32">
    <div className="mx-auto max-w-4xl">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-3"><button type="button" onClick={onBackToForm} className="inline-flex items-center gap-2 text-sm font-semibold text-[#3982C8] hover:text-[#17366F]"><ArrowLeft className="h-4 w-4 shrink-0" /> {backLabel}</button><button type="button" onClick={onBackToHome} className="text-sm font-semibold text-[#647DA5] hover:text-[#17366F]">Aurenstar Home</button></div>
      <div className="rounded-[2rem] border border-[#D9E8F8] bg-white p-6 shadow-[0_14px_40px_rgba(23,54,111,0.1)] sm:p-10">
        <div className="mb-7 flex items-center justify-between"><div className="flex items-center gap-4"><img decoding="async" src={AVATAR} alt="Aurenstar" className="h-16 w-16 rounded-full" /><div><div className="flex items-center gap-1.5 text-xl font-extrabold text-[#172B4D]"><span translate="no" className="notranslate">Aurenstar</span> <span aria-label={language === 'en' ? 'Verified' : 'Verificado'} title={language === 'en' ? 'Verified profile' : 'Perfil verificado'} className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#3982C8] text-white"><Check className="h-3 w-3" strokeWidth={3} /></span></div><p className="text-sm text-[#647DA5]">@aurenstar · aurenstar.com</p></div></div><span className="text-2xl font-bold tracking-widest text-[#647DA5]">•••</span></div>
                <p className="max-w-3xl text-lg font-extrabold leading-tight text-[#3982C8] sm:text-xl">{cardTitle}</p>
        <p className="mt-5 max-w-3xl whitespace-pre-line text-xl leading-relaxed text-[#17366F] sm:text-2xl">{result.description}</p>
        <p className="mt-10 text-sm text-[#647DA5]">{formatTime(result.createdAt, lang)} · aurenstar.com</p>
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-2"><button type="button" onClick={download} disabled={!!busy} className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#E73578] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#D0306C] transition-colors disabled:opacity-60 sm:px-5 sm:text-sm"><Download className="h-4 w-4 shrink-0" />{downloadLabel}</button><button type="button" onClick={downloadStory} disabled={!!busy} className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#E73578] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#D0306C] transition-colors disabled:opacity-60 sm:px-5 sm:text-sm"><Smartphone className="h-4 w-4 shrink-0" />{storyLabel}</button></div>
      <FeedbackButtons tool="describe_me" sign={result.sign} padded={false} />
    </div>
  </section>;
};

