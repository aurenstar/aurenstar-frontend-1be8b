import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Headphones, Pause, Square } from 'lucide-react';

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
  const t0 = useRef(0);
  const pausedAt = useRef<number | null>(null);
  const pausedFor = useRef(0);
  const cps = useRef(15); // characters per second at 1x (learned while reading)
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
    // Group words into short phrases (about 4 words, or up to punctuation) so the highlight
    // moves calmly instead of jumping word by word.
    const chunks: { s: number; e: number }[] = [];
    let cs = -1, cn = 0;
    words.forEach((w, i) => {
      if (cs < 0) { cs = w.s; cn = 0; }
      cn += 1;
      const endsPhrase = /[,;:.!?…—-]$/.test(sent.text.slice(w.s, w.e));
      if (cn >= 4 || endsPhrase || (w.e - cs) >= 34 || i === words.length - 1) {
        chunks.push({ s: cs, e: w.e }); cs = -1;
      }
    });
    let lastChunk = -1;
    const showWord = (s: number) => {
      const ci = chunks.findIndex((c) => s >= c.s && s < c.e + 1);
      if (ci < 0 || ci === lastChunk) return;
      lastChunk = ci;
      onWordChange({ id: seg.id, start: sent.offset + chunks[ci].s, end: sent.offset + chunks[ci].e });
    };

    u.onstart = () => {
      if (words.length) showWord(words[0].s);
      // Estimate the reading position over time (used until the voice reports real word events).
      // Speed is learned from the previous sentences, so it keeps getting closer to the real voice.
      t0.current = performance.now(); pausedFor.current = 0; pausedAt.current = null;
      const len = sent.text.length;
      timer.current = window.setInterval(() => {
        if (token.current !== my || gotBoundary || pausedAt.current !== null) return;
        const elapsed = (performance.now() - t0.current - pausedFor.current) / 1000;
        const pos = Math.min(len, (elapsed + 0.25) * cps.current * rateRef.current); // small lead so the highlight is never behind
        const w = words.find((x) => pos < x.e + 1) || words[words.length - 1];
        if (w) showWord(w.s);
      }, 40);
    };
    u.onboundary = (ev: SpeechSynthesisEvent) => {
      if (token.current !== my) return;
      if (ev.name && ev.name !== 'word') return;
      gotBoundary = true; clearTimer();
      const w = words.find((x) => ev.charIndex >= x.s && ev.charIndex < x.e) || words.find((x) => x.s >= ev.charIndex);
      if (w) showWord(w.s);
    };
    u.onend = () => {
      if (token.current !== my) return;
      if (!gotBoundary) {
        const sec = (performance.now() - t0.current - pausedFor.current) / 1000;
        if (sec > 0.3 && sent.text.length > 12) cps.current = sent.text.length / sec / rateRef.current;
      }
      clearTimer(); speak(si, sentIdx + 1);
    };
    u.onerror = () => { if (token.current === my) stop(); };
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
    setStatus('playing');
  }, [lang, onActiveChange, onWordChange, stop]);

  const toggle = () => {
    if (status === 'idle') speak(0, 0);
    else if (status === 'playing') { window.speechSynthesis.pause(); pausedAt.current = performance.now(); setStatus('paused'); }
    else { window.speechSynthesis.resume(); if (pausedAt.current !== null) { pausedFor.current += performance.now() - pausedAt.current; pausedAt.current = null; } setStatus('playing'); }
  };

  const restartHere = () => { if (status !== 'idle') speak(pos.current.seg, pos.current.sent); };
  const changeRate = (r: number) => { setRate(r); rateRef.current = r; restartHere(); };
  const changeVoice = (name: string) => {
    cps.current = 15;
    setVoiceName(name); voiceRef.current = name;
    try { localStorage.setItem(VOICE_KEY + lang, name); } catch { /* ignore */ }
    restartHere();
  };

  useEffect(() => () => { token.current += 1; clearTimer(); try { window.speechSynthesis.cancel(); } catch { /* ignore */ } }, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (status !== 'idle') stop(); }, [lang, segments]);

  if (!supported) return null;
  const playing = status === 'playing';

  const cycleRate = () => changeRate(SPEEDS[(SPEEDS.indexOf(rate) + 1) % SPEEDS.length]);

  return (
    <div className="my-5 inline-flex max-w-full flex-wrap items-center gap-1.5 rounded-full bg-[#2878D0] p-1.5 pr-2.5 text-white shadow-sm">
      <button
        type="button"
        onClick={toggle}
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#F51B83] px-4 py-2 text-xs font-bold text-white transition-all hover:bg-[#D9166F] active:scale-95"
      >
        {playing ? <Pause className="h-3.5 w-3.5" /> : <Headphones className="h-3.5 w-3.5" />}
        <span>{status === 'idle' ? c.title : playing ? c.pause : c.resume}</span>
      </button>

      {playing && (
        <span aria-hidden className="flex h-4 items-end gap-[2px] px-1">
          {[0, 1, 2, 3].map((n) => (
            <span key={n} className="w-[3px] origin-bottom rounded-full bg-white" style={{ height: '100%', animation: `listenBars 0.9s ease-in-out ${n * 0.15}s infinite` }} />
          ))}
        </span>
      )}

      {status !== 'idle' && (
        <button type="button" onClick={stop} aria-label={c.stop} title={c.stop} className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/15 transition-colors hover:bg-white hover:text-[#2878D0]">
          <Square className="h-3 w-3" />
        </button>
      )}

      <button type="button" onClick={cycleRate} aria-label={c.speed} title={c.speed} className="h-8 min-w-[2.6rem] cursor-pointer rounded-full bg-white/15 px-2.5 text-[11px] font-bold transition-colors hover:bg-white hover:text-[#2878D0]">
        {rate}x
      </button>

      {voices.length > 1 && (
        <select
          value={voiceName}
          onChange={(e) => changeVoice(e.target.value)}
          aria-label={c.voice}
          title={c.voice}
          className="h-8 max-w-[130px] cursor-pointer truncate rounded-full bg-white/15 px-2.5 text-[11px] font-bold text-white outline-none hover:bg-white/25 [&>option]:text-[#172B4D]"
        >
          {voices.map((v) => <option key={v.name} value={v.name}>{v.name.replace(/^(Microsoft|Google)\s+/i, '')}</option>)}
        </select>
      )}
    </div>
  );
};
