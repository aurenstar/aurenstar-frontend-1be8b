import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Headphones, Pause, Play, Square } from 'lucide-react';

export interface ListenSegment { id: string; text: string }
export interface ListenWord { id: string; start: number; end: number }

interface Props {
  segments: ListenSegment[];
  lang: 'pt' | 'en' | 'es';
  onActiveChange: (id: string | null) => void;
  onWordChange: (w: ListenWord | null) => void;
}

const COPY = {
  pt: { title: 'Ouvir este artigo', sub: 'Cada palavra fica rosa enquanto a voz lê.', play: 'Ouvir', pause: 'Pausar', resume: 'Continuar', stop: 'Parar', speed: 'Velocidade', voice: 'Voz' },
  en: { title: 'Listen to this article', sub: 'Each word turns pink as the voice reads it.', play: 'Listen', pause: 'Pause', resume: 'Resume', stop: 'Stop', speed: 'Speed', voice: 'Voice' },
  es: { title: 'Escuchar este artículo', sub: 'Cada palabra se vuelve rosa mientras la voz lee.', play: 'Escuchar', pause: 'Pausar', resume: 'Continuar', stop: 'Detener', speed: 'Velocidad', voice: 'Voz' },
};
const LOCALE = { pt: 'pt-BR', en: 'en-US', es: 'es-ES' } as const;
const SPEEDS = [1, 1.25, 1.5];
const VOICE_KEY = 'aurenstar_listen_voice_';

// Higher score = sounds more natural (neural / online voices first)
function voiceScore(v: SpeechSynthesisVoice, lang: 'pt' | 'en' | 'es') {
  const n = v.name.toLowerCase();
  let s = 0;
  if (v.lang === LOCALE[lang]) s += 5;
  if (/natural|neural|online/.test(n)) s += 20;
  if (/google/.test(n)) s += 10;
  if (/premium|enhanced|siri/.test(n)) s += 12;
  if (/microsoft/.test(n)) s += 4;
  if (!v.localService) s += 2;
  if (/espeak|compact/.test(n)) s -= 20;
  return s;
}

function splitSentences(text: string) {
  const out: { text: string; offset: number }[] = [];
  const re = /[^.!?…]+[.!?…]*\s*/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) out.push({ text: m[0], offset: m.index });
  return out.length ? out : [{ text, offset: 0 }];
}

export const ArticleListenBar: React.FC<Props> = ({ segments, lang, onActiveChange, onWordChange }) => {
  const [supported, setSupported] = useState(false);
  const [status, setStatus] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [rate, setRate] = useState(1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceName, setVoiceName] = useState('');
  const token = useRef(0);
  const pos = useRef({ seg: 0, sent: 0 });
  const rateRef = useRef(1);
  const voiceRef = useRef('');
  const timer = useRef<number | null>(null);
  const segs = useRef(segments);
  segs.current = segments;
  const c = COPY[lang];

  useEffect(() => { setSupported(typeof window !== 'undefined' && 'speechSynthesis' in window); }, []);

  // Load available voices for this language, best first
  useEffect(() => {
    if (!supported) return;
    const load = () => {
      const list = window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith(lang));
      list.sort((a, b) => voiceScore(b, lang) - voiceScore(a, lang));
      setVoices(list);
      let saved = '';
      try { saved = localStorage.getItem(VOICE_KEY + lang) || ''; } catch { /* ignore */ }
      const pick = list.find((v) => v.name === saved) || list[0];
      const name = pick ? pick.name : '';
      setVoiceName(name); voiceRef.current = name;
    };
    load();
    window.speechSynthesis.addEventListener?.('voiceschanged', load);
    return () => window.speechSynthesis.removeEventListener?.('voiceschanged', load);
  }, [supported, lang]);

  const clearTimer = () => { if (timer.current) { window.clearInterval(timer.current); timer.current = null; } };

  const stop = useCallback(() => {
    token.current += 1;
    clearTimer();
    try { window.speechSynthesis.cancel(); } catch { /* ignore */ }
    setStatus('idle');
    onActiveChange(null);
    onWordChange(null);
  }, [onActiveChange, onWordChange]);

  const speak = useCallback((si: number, sentIdx: number) => {
    const list = segs.current;
    if (si >= list.length) { stop(); return; }
    const seg = list[si];
    const sentences = splitSentences(seg.text);
    if (sentIdx >= sentences.length) { speak(si + 1, 0); return; }
    const my = ++token.current;
    clearTimer();
    pos.current = { seg: si, sent: sentIdx };
    const sent = sentences[sentIdx];
    onActiveChange(seg.id);
    if (sentIdx === 0) {
      const el = document.querySelector(`[data-seg="${seg.id}"]`);
      if (el) (el as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    const u = new SpeechSynthesisUtterance(sent.text);
    u.lang = LOCALE[lang];
    const v = window.speechSynthesis.getVoices().find((x) => x.name === voiceRef.current);
    if (v) { u.voice = v; u.lang = v.lang; }
    u.rate = rateRef.current;

    // word ranges inside this sentence
    const words: { s: number; e: number }[] = [];
    const wre = /\S+/g; let m: RegExpExecArray | null;
    while ((m = wre.exec(sent.text))) words.push({ s: m.index, e: m.index + m[0].length });
    let gotBoundary = false;
    const showWord = (s: number, e: number) => onWordChange({ id: seg.id, start: sent.offset + s, end: sent.offset + e });

    u.onstart = () => {
      if (words.length) showWord(words[0].s, words[0].e);
      // Fallback for voices that don't report word boundaries: estimate timing
      window.setTimeout(() => {
        if (token.current !== my || gotBoundary) return;
        let i = 0;
        const step = () => {
          if (token.current !== my || i >= words.length) { clearTimer(); return; }
          showWord(words[i].s, words[i].e); i += 1;
        };
        const per = Math.max(170, (60000 / (160 * rateRef.current)));
        step();
        timer.current = window.setInterval(step, per);
      }, 900);
    };
    u.onboundary = (ev: SpeechSynthesisEvent) => {
      if (token.current !== my) return;
      if (ev.name && ev.name !== 'word') return;
      gotBoundary = true; clearTimer();
      const w = words.find((x) => ev.charIndex >= x.s && ev.charIndex < x.e) || words.find((x) => x.s >= ev.charIndex);
      if (w) showWord(w.s, w.e);
    };
    u.onend = () => { if (token.current === my) { clearTimer(); speak(si, sentIdx + 1); } };
    u.onerror = () => { if (token.current === my) stop(); };
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
    setStatus('playing');
  }, [lang, onActiveChange, onWordChange, stop]);

  const toggle = () => {
    if (status === 'idle') speak(0, 0);
    else if (status === 'playing') { window.speechSynthesis.pause(); setStatus('paused'); }
    else { window.speechSynthesis.resume(); setStatus('playing'); }
  };

  const restartHere = () => { if (status !== 'idle') speak(pos.current.seg, pos.current.sent); };
  const changeRate = (r: number) => { setRate(r); rateRef.current = r; restartHere(); };
  const changeVoice = (name: string) => {
    setVoiceName(name); voiceRef.current = name;
    try { localStorage.setItem(VOICE_KEY + lang, name); } catch { /* ignore */ }
    restartHere();
  };

  useEffect(() => () => { token.current += 1; clearTimer(); try { window.speechSynthesis.cancel(); } catch { /* ignore */ } }, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (status !== 'idle') stop(); }, [lang, segments]);

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

      <div className="flex flex-wrap items-center gap-2">
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
        {voices.length > 1 && (
          <select
            value={voiceName}
            onChange={(e) => changeVoice(e.target.value)}
            aria-label={c.voice}
            title={c.voice}
            className="max-w-[170px] cursor-pointer truncate rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-bold text-white outline-none hover:bg-white/25 [&>option]:text-[#172B4D]"
          >
            {voices.map((v) => <option key={v.name} value={v.name}>{v.name.replace(/^(Microsoft|Google)\s+/i, '')}</option>)}
          </select>
        )}
      </div>
    </div>
  );
};
