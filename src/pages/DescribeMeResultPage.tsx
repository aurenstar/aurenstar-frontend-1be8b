import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Copy, Download, Share2, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { DESCRIBE_ME_RESULT_KEY } from './DescribeMePage';

interface DescribeMeResult { name: string; sign: string; birthDate: string; birthTime?: string; birthCity?: string; description: string; createdAt: string; }
interface DescribeMeResultPageProps { onBackToForm: () => void; onBackToHome: () => void; onNavigateToBlog: () => void; }

const AVATAR = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g" x1="0%25" y1="0%25" x2="100%25" y2="100%25"><stop offset="0%25" stop-color="%232878D0"/><stop offset="50%25" stop-color="%2317366F"/><stop offset="100%25" stop-color="%23F51B83"/></linearGradient></defs><circle cx="50" cy="50" r="50" fill="url(%23g)"/><path d="M50 18 L55 42 L79 42 L60 56 L67 80 L50 66 L33 80 L40 56 L21 42 L45 42 Z" fill="%23ffffff"/></svg>`;

const TITLES: Record<string, string> = {
  aries: 'Aries and the courage to begin again', taurus: 'Taurus and the art of moving at your own pace', gemini: 'Gemini and the creative brilliance of reinventing yourself', cancer: 'Cancer and the quiet strength of feeling deeply', leo: 'Leo and the generous power of being fully yourself', virgo: 'Virgo and the intelligence of noticing what matters', libra: 'Libra and the beauty of finding your own balance', scorpio: 'Scorpio and the courage to look beneath the surface', sagittarius: 'Sagittarius and the freedom to keep discovering', capricorn: 'Capricorn and the patience behind every achievement', aquarius: 'Aquarius and the original way you see the world', pisces: 'Pisces and the imagination that makes life feel wider',
};

const formatTime = (iso: string, language: string) => new Intl.DateTimeFormat(language === 'pt' ? 'pt-BR' : language === 'es' ? 'es-ES' : 'en-US', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short', year: '2-digit' }).format(new Date(iso));

export const DescribeMeResultPage: React.FC<DescribeMeResultPageProps> = ({ onBackToForm, onBackToHome, onNavigateToBlog }) => {
  const { language } = useLanguage();
  const [result, setResult] = useState<DescribeMeResult | null>(null);
  const [copied, setCopied] = useState(false);
  const lang = language || 'en';

  useEffect(() => {
    try {
      const stored = localStorage.getItem(DESCRIBE_ME_RESULT_KEY);
      if (stored) setResult(JSON.parse(stored) as DescribeMeResult);
    } catch { setResult(null); }
  }, []);

  const title = useMemo(() => result ? (TITLES[result.sign] || `Aurenstar and the style of ${result.sign}`) : '', [result]);
  const copyLabel = lang === 'pt' ? 'Copiar texto' : lang === 'es' ? 'Copiar texto' : 'Copy text';
  const copiedLabel = lang === 'pt' ? 'Copiado' : lang === 'es' ? 'Copiado' : 'Copied';
  const shareLabel = lang === 'pt' ? 'Compartilhar' : lang === 'es' ? 'Compartir' : 'Share';
  const downloadLabel = lang === 'pt' ? 'Baixar card' : lang === 'es' ? 'Descargar card' : 'Download card';
  const backLabel = lang === 'pt' ? 'Criar outra descrição' : lang === 'es' ? 'Crear otra descripción' : 'Create another description';

  const copyText = async () => { if (!result) return; try { await navigator.clipboard.writeText(`${title}\n\n${result.description}`); setCopied(true); setTimeout(() => setCopied(false), 2200); } catch { /* clipboard unavailable */ } };
  const share = async () => { if (!result) return; if (navigator.share) await navigator.share({ title, text: result.description, url: window.location.href }); else await copyText(); };
  const download = () => { if (!result) return; const blob = new Blob([`${title}\n\n${result.description}\n\nAurenstar · aurenstar.com`], { type: 'text/plain;charset=utf-8' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'aurenstar-unfiltered.txt'; link.click(); URL.revokeObjectURL(url); };

  if (!result) return <section className="min-h-[70vh] bg-[#C9E5FF] px-4 py-32 text-center"><Sparkles className="mx-auto h-8 w-8 text-[#2878D0]" /><h1 className="mt-4 text-2xl font-extrabold text-[#172B4D]">{lang === 'pt' ? 'Crie sua descrição primeiro' : 'Create your description first'}</h1><button type="button" onClick={onBackToForm} className="mt-6 rounded-full bg-[#2878D0] px-5 py-3 text-sm font-bold text-white">{backLabel}</button></section>;

  return <section className="min-h-[78vh] bg-[#C9E5FF] px-4 py-28 sm:px-6 sm:py-32">
    <div className="mx-auto max-w-4xl">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-3"><button type="button" onClick={onBackToForm} className="inline-flex items-center gap-2 text-sm font-semibold text-[#2878D0] hover:text-[#17366F]"><ArrowLeft className="h-4 w-4" /> {backLabel}</button><button type="button" onClick={onBackToHome} className="text-sm font-semibold text-[#647DA5] hover:text-[#17366F]">Aurenstar Home</button></div>
      <div className="rounded-[2rem] border border-[#D9E8F8] bg-white p-6 shadow-[0_14px_40px_rgba(23,54,111,0.1)] sm:p-10">
        <div className="mb-7 flex items-center justify-between"><div className="flex items-center gap-4"><img src={AVATAR} alt="Aurenstar" className="h-16 w-16 rounded-full" /><div><div className="flex items-center gap-1.5 text-xl font-extrabold text-[#172B4D]">Aurenstar <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#2878D0] text-xs text-white">✓</span></div><p className="text-sm text-[#647DA5]">@aurenstar · aurenstar.com</p></div></div><span className="text-2xl font-bold tracking-widest text-[#647DA5]">•••</span></div>
        <p className="max-w-3xl text-3xl font-extrabold leading-tight text-[#2878D0] sm:text-4xl">{title}</p>
        <p className="mt-8 max-w-3xl whitespace-pre-line text-xl leading-relaxed text-[#17366F] sm:text-2xl">{result.description}</p>
        <p className="mt-10 text-sm text-[#647DA5]">{formatTime(result.createdAt, lang)} · aurenstar.com</p>
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-2"><button type="button" onClick={copyText} className="inline-flex items-center gap-2 rounded-full border border-[#D9E8F8] bg-white px-4 py-2.5 text-sm font-semibold text-[#172B4D] hover:border-[#2878D0]"><Copy className="h-4 w-4 text-[#2878D0]" />{copied ? copiedLabel : copyLabel}</button><button type="button" onClick={share} className="inline-flex items-center gap-2 rounded-full border border-[#D9E8F8] bg-white px-4 py-2.5 text-sm font-semibold text-[#172B4D] hover:border-[#2878D0]"><Share2 className="h-4 w-4 text-[#2878D0]" />{shareLabel}</button><button type="button" onClick={download} className="inline-flex items-center gap-2 rounded-full border border-[#D9E8F8] bg-white px-4 py-2.5 text-sm font-semibold text-[#172B4D] hover:border-[#2878D0]"><Download className="h-4 w-4 text-[#2878D0]" />{downloadLabel}</button><button type="button" onClick={onNavigateToBlog} className="inline-flex items-center gap-2 rounded-full border border-[#D9E8F8] bg-white px-4 py-2.5 text-sm font-semibold text-[#172B4D] hover:border-[#2878D0]">Blog</button></div>
    </div>
  </section>;
};

