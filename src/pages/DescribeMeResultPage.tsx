import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Copy, Download, Share2, Sparkles, Check, Smartphone } from 'lucide-react';
import { downloadStoryCard, downloadVerticalStoryCard, shareStoryCardImage, type StoryCardData } from '../utils/generateStoryCard';
import { useLanguage } from '../context/LanguageContext';
import { DESCRIBE_ME_RESULT_KEY } from './DescribeMePage';

interface DescribeMeResult { name: string; sign: string; birthDate: string; birthTime?: string; birthCity?: string; description: string; createdAt: string; tagline?: string; bigThree?: { sun: { name: string; symbol: string }; moon: { name: string; symbol: string }; rising: { name: string; symbol: string } | null }; }
interface DescribeMeResultPageProps { onBackToForm: () => void; onBackToHome: () => void; onNavigateToBlog: () => void; }

const AVATAR = '/aurenstar-avatar.png';

const TITLES: Record<string, string> = {
  aries: 'Aries and the courage to begin again', taurus: 'Taurus and the art of moving at your own pace', gemini: 'Gemini and the creative brilliance of reinventing yourself', cancer: 'Cancer and the quiet strength of feeling deeply', leo: 'Leo and the generous power of being fully yourself', virgo: 'Virgo and the intelligence of noticing what matters', libra: 'Libra and the beauty of finding your own balance', scorpio: 'Scorpio and the courage to look beneath the surface', sagittarius: 'Sagittarius and the freedom to keep discovering', capricorn: 'Capricorn and the patience behind every achievement', aquarius: 'Aquarius and the original way you see the world', pisces: 'Pisces and the imagination that makes life feel wider',
};

const formatTime = (iso: string, language: string) => new Intl.DateTimeFormat(language === 'pt' ? 'pt-BR' : language === 'es' ? 'es-ES' : 'en-US', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short', year: '2-digit' }).format(new Date(iso));

export const DescribeMeResultPage: React.FC<DescribeMeResultPageProps> = ({ onBackToForm, onBackToHome, onNavigateToBlog }) => {
  const { language } = useLanguage();
  const [result, setResult] = useState<DescribeMeResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState<'card' | 'story' | 'share' | null>(null);
  const lang = language || 'en';

  useEffect(() => {
    try {
      const stored = localStorage.getItem(DESCRIBE_ME_RESULT_KEY);
      if (stored) setResult(JSON.parse(stored) as DescribeMeResult);
    } catch { setResult(null); }
  }, []);

  const title = useMemo(() => result ? (result.tagline || TITLES[result.sign] || `Aurenstar and the style of ${result.sign}`) : '', [result]);
  const copyLabel = lang === 'pt' ? 'Copiar texto' : lang === 'es' ? 'Copiar texto' : 'Copy text';
  const copiedLabel = lang === 'pt' ? 'Copiado' : lang === 'es' ? 'Copiado' : 'Copied';
  const shareLabel = lang === 'pt' ? 'Compartilhar' : lang === 'es' ? 'Compartir' : 'Share';
  const downloadLabel = lang === 'pt' ? 'Baixar card' : lang === 'es' ? 'Descargar card' : 'Download card';
  const storyLabel = 'Story 9:16';
  const backLabel = lang === 'pt' ? 'Criar outra descrição' : lang === 'es' ? 'Crear otra descripción' : 'Create another description';

  const copyText = async () => { if (!result) return; try { await navigator.clipboard.writeText(`${title}\n\n${result.description}`); setCopied(true); setTimeout(() => setCopied(false), 2200); } catch { /* clipboard unavailable */ } };
  const chips = (): string[] => {
    const b = result?.bigThree; if (!b) return [];
    const sun = lang === 'en' ? 'Sun' : 'Sol'; const moon = lang === 'es' ? 'Luna' : lang === 'en' ? 'Moon' : 'Lua'; const rise = lang === 'en' ? 'Rising' : 'Ascendente';
    return [`${b.sun.symbol} ${sun}: ${b.sun.name}`, `${b.moon.symbol} ${moon}: ${b.moon.name}`, ...(b.rising ? [`${b.rising.symbol} ${rise}: ${b.rising.name}`] : [])];
  };
  const cardData = (): StoryCardData => ({
    userName: result?.name || 'aurenstar', signName: result?.bigThree?.sun.name || result?.sign || '', signSymbol: result?.bigThree?.sun.symbol || '', signTheme: title,
    title, affirmation: title, message: result?.description || '', advice: '', chips: chips(), lang: lang as 'pt' | 'en' | 'es',
  });
  const run = async (kind: 'card' | 'story' | 'share', fn: () => Promise<unknown>) => { if (busy) return; setBusy(kind); try { await fn(); } catch { /* user cancelled or canvas unavailable */ } finally { setBusy(null); } };
  const share = () => run('share', () => shareStoryCardImage(cardData()));
  const download = () => run('card', () => downloadStoryCard(cardData()));
  const downloadStory = () => run('story', () => downloadVerticalStoryCard(cardData()));

  if (!result) return <section className="min-h-[70vh] bg-[#C9E5FF] px-4 py-32 text-center"><Sparkles className="mx-auto h-8 w-8 text-[#2878D0]" /><h1 className="mt-4 text-2xl font-extrabold text-[#172B4D]">{lang === 'pt' ? 'Crie sua descrição primeiro' : 'Create your description first'}</h1><button type="button" onClick={onBackToForm} className="mt-6 rounded-full bg-[#2878D0] px-5 py-3 text-sm font-bold text-white">{backLabel}</button></section>;

  return <section className="min-h-[78vh] bg-[#C9E5FF] px-4 py-28 sm:px-6 sm:py-32">
    <div className="mx-auto max-w-4xl">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-3"><button type="button" onClick={onBackToForm} className="inline-flex items-center gap-2 text-sm font-semibold text-[#2878D0] hover:text-[#17366F]"><ArrowLeft className="h-4 w-4" /> {backLabel}</button><button type="button" onClick={onBackToHome} className="text-sm font-semibold text-[#647DA5] hover:text-[#17366F]">Aurenstar Home</button></div>
      <div className="rounded-[2rem] border border-[#D9E8F8] bg-white p-6 shadow-[0_14px_40px_rgba(23,54,111,0.1)] sm:p-10">
        <div className="mb-7 flex items-center justify-between"><div className="flex items-center gap-4"><img src={AVATAR} alt="Aurenstar" className="h-16 w-16 rounded-full" /><div><div className="flex items-center gap-1.5 text-xl font-extrabold text-[#172B4D]"><span translate="no" className="notranslate">Aurenstar</span> <span aria-label="Verificado" title="Perfil verificado" className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#2878D0] text-white"><Check className="h-3 w-3" strokeWidth={3} /></span></div><p className="text-sm text-[#647DA5]">@aurenstar · aurenstar.com</p></div></div><span className="text-2xl font-bold tracking-widest text-[#647DA5]">•••</span></div>
        <p className="max-w-3xl text-2xl font-extrabold leading-tight text-[#2878D0] sm:text-3xl">{title}</p>
        {result.bigThree && (
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              { label: lang === 'pt' ? 'Sol' : lang === 'es' ? 'Sol' : 'Sun', v: result.bigThree.sun },
              { label: lang === 'pt' ? 'Lua' : lang === 'es' ? 'Luna' : 'Moon', v: result.bigThree.moon },
              ...(result.bigThree.rising ? [{ label: lang === 'pt' ? 'Ascendente' : lang === 'es' ? 'Ascendente' : 'Rising', v: result.bigThree.rising }] : []),
            ].map((c) => (
              <span key={c.label} className="inline-flex items-center gap-1.5 rounded-full border border-[#D9E8F8] bg-[#E4F1FF] px-3 py-1 text-xs font-bold text-[#2878D0] sm:text-sm">
                <span>{c.v.symbol}</span>{c.label}: {c.v.name}
              </span>
            ))}
          </div>
        )}
        <p className="mt-6 max-w-3xl whitespace-pre-line text-lg leading-relaxed text-[#17366F] sm:text-xl">{result.description}</p>
        <p className="mt-10 text-sm text-[#647DA5]">{formatTime(result.createdAt, lang)} · aurenstar.com</p>
      </div>
      <div className="mt-4 flex flex-nowrap justify-center gap-1.5 sm:gap-2"><button type="button" onClick={copyText} className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[#D9E8F8] bg-[#E4F1FF] px-3 py-2 text-xs font-semibold text-[#2878D0] hover:bg-[#F51B83] hover:border-[#F51B83] hover:text-white transition-colors disabled:opacity-60 sm:px-4 sm:text-sm"><Copy className="h-4 w-4" />{copied ? copiedLabel : copyLabel}</button><button type="button" onClick={share} disabled={!!busy} className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[#D9E8F8] bg-[#E4F1FF] px-3 py-2 text-xs font-semibold text-[#2878D0] hover:bg-[#F51B83] hover:border-[#F51B83] hover:text-white transition-colors disabled:opacity-60 sm:px-4 sm:text-sm"><Share2 className="h-4 w-4" />{shareLabel}</button><button type="button" onClick={download} disabled={!!busy} className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[#D9E8F8] bg-[#E4F1FF] px-3 py-2 text-xs font-semibold text-[#2878D0] hover:bg-[#F51B83] hover:border-[#F51B83] hover:text-white transition-colors disabled:opacity-60 sm:px-4 sm:text-sm"><Download className="h-4 w-4" />{downloadLabel}</button><button type="button" onClick={downloadStory} disabled={!!busy} className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[#D9E8F8] bg-[#E4F1FF] px-3 py-2 text-xs font-semibold text-[#2878D0] hover:bg-[#F51B83] hover:border-[#F51B83] hover:text-white transition-colors disabled:opacity-60 sm:px-4 sm:text-sm"><Smartphone className="h-4 w-4" />{storyLabel}</button><button type="button" onClick={onNavigateToBlog} className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[#D9E8F8] bg-[#E4F1FF] px-3 py-2 text-xs font-semibold text-[#2878D0] hover:bg-[#F51B83] hover:border-[#F51B83] hover:text-white transition-colors disabled:opacity-60 sm:px-4 sm:text-sm">Blog</button></div>
    </div>
  </section>;
};

