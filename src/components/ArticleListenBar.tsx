import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Headphones, Pause, Play, Square } from 'lucide-react';

export interface ListenSegment { id: string; text: string }

interface Props {
  segments: ListenSegment[];
  lang: 'pt' | 'en' | 'es';
  onActiveChange: (id: string | null) => void;
}

const COPY = {
  pt: { title: 'Ouvir este artigo', sub: 'A voz lê o texto e um círculo rosa mostra onde ela está.', play: 'Ouvir', pause: 'Pausar', resume: 'Continuar', stop: 'Parar', speed: 'Velocidade' },
  en: { title: 'Listen to this article', sub: 'A voice reads the text and a pink outline shows where it is.', play: 'Listen', pause: 'Pause', resume: 'Resume', stop: 'Stop', speed: 'Speed' },
  es: { title: 'Escuchar este artículo', sub: 'Una voz lee el texto y un círculo rosa muestra dónde va.', play: 'Escuchar', pause: 'Pausar', resume: 'Continuar', stop: 'Detener', speed: 'Velocidad' },
};
const LOCALE = { pt: 'pt-BR', en: 'en-US', es: 'es-ES' } as const;
const SPEEDS = [1, 1.25, 1.5];

export const ArticleListenBar: React.FC<Props> = ({ segments, lang, onActiveChange }) => {
  const [supported, setSupported] = useState(false);
  const [status, setStatus] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [rate, setRate] = useState(1);
  const token = useRef(0);
  const index = useRef(0);
  const rateRef = useRef(1);
  const segs = useRef(segments);
  segs.current = segments;
  const c = COPY[lang];

  useEffect(() => { setSupported(typeof window !== 'undefined' && 'speechSynthesis' in window); }, []);

  const pickVoice = useCallback(() => {
    const voices = window.speechSynthesis.getVoices();
    const loc = LOCALE[lang];
    return voices.find((v) => v.lang === loc) || voices.find((v) => v.lang.toLowerCase().startsWith(lang)) || null;
  }, [lang]);

  const stop = useCallback(() => {
    token.current += 1;
    try { window.speechSynthesis.cancel(); } catch { /* ignore */ }
    setStatus('idle');
    onActiveChange(null);
  }, [onActiveChange]);

  const speak = useCallback((i: number) => {
    const list = segs.current;
    if (i >= list.length) { stop(); return; }
    const my = ++token.current;
    index.current = i;
    const seg = list[i];
    onActiveChange(seg.id);
    const el = document.querySelector(`[data-seg="${seg.id}"]`);
    if (el) (el as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
    const u = new SpeechSynthesisUtterance(seg.text);
    u.lang = LOCALE[lang];
    const v = pickVoice();
    if (v) u.voice = v;
    u.rate = rateRef.current;
    u.onend = () => { if (token.current === my) speak(i + 1); };
    u.onerror = () => { if (token.current === my) stop(); };
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
    setStatus('playing');
  }, [lang, onActiveChange, pickVoice, stop]);

  const toggle = () => {
    if (status === 'idle') speak(0);
    else if (status === 'playing') { window.speechSynthesis.pause(); setStatus('paused'); }
    else { window.speechSynthesis.resume(); setStatus('playing'); }
  };

  const changeRate = (r: number) => {
    setRate(r); rateRef.current = r;
    if (status !== 'idle') speak(index.current);
  };

  // Stop when leaving the page or switching language/article
  useEffect(() => () => { token.current += 1; try { window.speechSynthesis.cancel(); } catch { /* ignore */ } }, []);
  useEffect(() => { if (status !== 'idle') stop(); /* eslint-disable-next-line */ }, [lang, segments]);

  if (!supported) return null;
  const playing = status === 'playing';

  return (
    <div className="relative my-6 flex flex-wrap items-center gap-4 overflow-hidden rounded-2xl bg-[#2878D0] p-4 text-white shadow-md sm:p-5">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#2878D0]"><Headphones className="h-5 w-5" /></span>
        <div className="min-w-0">
          <p className="text-sm font-extrabold sm:text-base">{c.title}</p>
          <p className="text-[11px] text-white/85 sm:text-xs">{c.sub}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {playing && (
          <span aria-hidden className="mr-1 flex h-6 items-end gap-[3px]">
            {[0, 1, 2, 3].map((n) => (
              <span key={n} className="w-1 origin-bottom rounded-full bg-[#F51B83]" style={{ height: '100%', animation: `listenBars 0.9s ease-in-out ${n * 0.15}s infinite` }} />
            ))}
          </span>
        )}
        <button type="button" onClick={toggle} className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#F51B83] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#D9166F] active:scale-95 sm:text-sm">
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          <span>{status === 'idle' ? c.play : playing ? c.pause : c.resume}</span>
        </button>
        {status !== 'idle' && (
          <button type="button" onClick={stop} aria-label={c.stop} title={c.stop} className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white hover:text-[#2878D0]">
            <Square className="h-4 w-4" />
          </button>
        )}
        <div className="ml-1 flex items-center gap-1" aria-label={c.speed}>
          {SPEEDS.map((r) => (
            <button key={r} type="button" onClick={() => changeRate(r)} className={`cursor-pointer rounded-full px-2.5 py-1 text-[11px] font-bold transition-colors ${rate === r ? 'bg-white text-[#2878D0]' : 'bg-white/15 text-white hover:bg-white/30'}`}>{r}x</button>
          ))}
        </div>
      </div>
    </div>
  );
};
