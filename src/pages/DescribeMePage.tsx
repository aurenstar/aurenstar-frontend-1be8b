import React, { useMemo, useState } from 'react';
import { ArrowLeft, Copy, Download, Share2, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

type SignKey = 'aries' | 'taurus' | 'gemini' | 'cancer' | 'leo' | 'virgo' | 'libra' | 'scorpio' | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';

const SIGN_NAMES: Record<SignKey, { pt: string; en: string; es: string }> = {
  aries: { pt: 'Áries', en: 'Aries', es: 'Aries' }, taurus: { pt: 'Touro', en: 'Taurus', es: 'Tauro' },
  gemini: { pt: 'Gêmeos', en: 'Gemini', es: 'Géminis' }, cancer: { pt: 'Câncer', en: 'Cancer', es: 'Cáncer' },
  leo: { pt: 'Leão', en: 'Leo', es: 'Leo' }, virgo: { pt: 'Virgem', en: 'Virgo', es: 'Virgo' },
  libra: { pt: 'Libra', en: 'Libra', es: 'Libra' }, scorpio: { pt: 'Escorpião', en: 'Scorpio', es: 'Escorpio' },
  sagittarius: { pt: 'Sagitário', en: 'Sagittarius', es: 'Sagitario' }, capricorn: { pt: 'Capricórnio', en: 'Capricorn', es: 'Capricornio' },
  aquarius: { pt: 'Aquário', en: 'Aquarius', es: 'Acuario' }, pisces: { pt: 'Peixes', en: 'Pisces', es: 'Piscis' },
};

const SIGN_TRAITS: Record<SignKey, { pt: string; en: string; es: string }> = {
  aries: { pt: 'entra em cena com coragem, pressa e uma ideia que já parece urgente', en: 'enters the room with courage, speed, and an idea that already feels urgent', es: 'entra en escena con coraje, prisa y una idea que ya parece urgente' },
  taurus: { pt: 'sabe aproveitar o que é bom, mas não abre mão do próprio ritmo', en: 'knows how to enjoy good things without giving up a personal rhythm', es: 'sabe disfrutar lo bueno sin renunciar a su propio ritmo' },
  gemini: { pt: 'consegue começar cinco assuntos e ainda encontrar uma pergunta interessante no caminho', en: 'can start five conversations and still find an interesting question along the way', es: 'puede empezar cinco conversaciones y encontrar otra pregunta interesante en el camino' },
  cancer: { pt: 'percebe mudanças de humor antes mesmo de alguém dizer que está tudo bem', en: 'notices changes in mood before anyone says that everything is fine', es: 'percibe los cambios de humor antes de que alguien diga que todo está bien' },
  leo: { pt: 'transforma presença em calor e gosta de deixar uma marca generosa por onde passa', en: 'turns presence into warmth and likes to leave a generous mark wherever they go', es: 'convierte su presencia en calidez y deja una marca generosa donde va' },
  virgo: { pt: 'enxerga o detalhe que ninguém viu e tenta melhorar o plano antes de começar', en: 'spots the detail nobody noticed and improves the plan before starting', es: 've el detalle que nadie notó y mejora el plan antes de empezar' },
  libra: { pt: 'procura beleza, equilíbrio e uma forma diplomática de dizer o que realmente pensa', en: 'looks for beauty, balance, and a diplomatic way to say what they really think', es: 'busca belleza, equilibrio y una forma diplomática de decir lo que piensa' },
  scorpio: { pt: 'faz perguntas profundas e raramente se satisfaz com a primeira resposta', en: 'asks deep questions and rarely settles for the first answer', es: 'hace preguntas profundas y rara vez se conforma con la primera respuesta' },
  sagittarius: { pt: 'precisa de espaço para explorar, rir e transformar uma conversa em uma aventura', en: 'needs room to explore, laugh, and turn a conversation into an adventure', es: 'necesita espacio para explorar, reír y convertir una conversación en aventura' },
  capricorn: { pt: 'parece ter um plano até quando está improvisando e leva seus objetivos a sério', en: 'seems to have a plan even while improvising and takes goals seriously', es: 'parece tener un plan incluso improvisando y se toma sus metas en serio' },
  aquarius: { pt: 'pensa diferente, questiona o óbvio e costuma chegar antes nas ideias', en: 'thinks differently, questions the obvious, and often arrives early to new ideas', es: 'piensa diferente, cuestiona lo obvio y suele adelantarse a las ideas' },
  pisces: { pt: 'capta o clima emocional do ambiente e transforma sensibilidade em imaginação', en: 'reads the emotional atmosphere and turns sensitivity into imagination', es: 'capta el ambiente emocional y convierte la sensibilidad en imaginación' },
};

interface DescribeMePageProps { onBackToHome: () => void; onNavigateToBlog: () => void; onNavigateToResult: () => void; }

export const DESCRIBE_ME_RESULT_KEY = 'aurenstar_describe_me_result';

export const DescribeMePage: React.FC<DescribeMePageProps> = ({ onBackToHome, onNavigateToBlog, onNavigateToResult }) => {
  const { language } = useLanguage();
  const lang = (language || 'en') as 'pt' | 'en' | 'es';
  const [name, setName] = useState('');
  const [sign, setSign] = useState<SignKey>('gemini');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthCity, setBirthCity] = useState('');
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = {
    pt: { tag: 'DESCRIÇÃO ASTROLÓGICA', title: 'Descreva-me', subtitle: 'Crie uma descrição astrológica divertida, pessoal e feita para compartilhar.', name: 'Nome', sign: 'Signo solar', date: 'Data de nascimento', time: 'Horário de nascimento', city: 'Cidade de nascimento', generate: 'Criar minha descrição', required: 'Preencha nome, signo e data para continuar.', back: 'Voltar ao início', note: 'Prévia do front end: os cálculos de Swiss Ephemeris, fuso e localização serão conectados na próxima etapa.', copy: 'Copiar descrição', copied: 'Descrição copiada', share: 'Compartilhar', download: 'Salvar card', blog: 'Conhecer o blog' },
    en: { tag: 'ASTROLOGY DESCRIPTION', title: 'Describe Me', subtitle: 'Create a personal, playful astrology description made to be shared.', name: 'Name', sign: 'Sun sign', date: 'Birth date', time: 'Birth time', city: 'Birth city', generate: 'Create my description', required: 'Add a name, sign, and birth date to continue.', back: 'Back to home', note: 'Front-end preview: Swiss Ephemeris, time zone, and location calculations will be connected next.', copy: 'Copy description', copied: 'Description copied', share: 'Share', download: 'Save card', blog: 'Explore the blog' },
    es: { tag: 'DESCRIPCIÓN ASTROLÓGICA', title: 'Descríbeme', subtitle: 'Crea una descripción astrológica personal, divertida y fácil de compartir.', name: 'Nombre', sign: 'Signo solar', date: 'Fecha de nacimiento', time: 'Hora de nacimiento', city: 'Ciudad de nacimiento', generate: 'Crear mi descripción', required: 'Añade nombre, signo y fecha para continuar.', back: 'Volver al inicio', note: 'Vista previa del front end: Swiss Ephemeris, zona horaria y ubicación se conectarán después.', copy: 'Copiar descripción', copied: 'Descripción copiada', share: 'Compartir', download: 'Guardar card', blog: 'Conocer el blog' },
  }[lang];

  const signName = SIGN_NAMES[sign][lang];
  const description = useMemo(() => {
    const person = name.trim() || (lang === 'pt' ? 'Esta pessoa' : lang === 'es' ? 'Esta persona' : 'This person');
    const trait = SIGN_TRAITS[sign][lang];
    if (lang === 'pt') return `${person} é de ${signName}: ${trait}. Parece espontânea, mas existe muita percepção por trás de cada escolha — e quando algo desperta sua curiosidade, fica difícil não querer saber mais.`;
    if (lang === 'es') return `${person} es ${signName}: ${trait}. Parece espontánea, pero hay mucha percepción detrás de cada elección — y cuando algo despierta su curiosidad, es difícil no querer saber más.`;
    return `${person} is a ${signName}: ${trait}. They may look spontaneous, but there is plenty of perception behind every choice — and once curiosity is sparked, it is hard not to keep asking questions.`;
  }, [lang, name, sign, signName]);

  const handleGenerate = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !birthDate) return;
    try {
      localStorage.setItem(DESCRIBE_ME_RESULT_KEY, JSON.stringify({ name: name.trim(), sign, birthDate, birthTime, birthCity: birthCity.trim(), description, createdAt: new Date().toISOString() }));
    } catch { /* local storage may be unavailable */ }
    setGenerated(true);
    onNavigateToResult();
  };
  const handleCopy = async () => { try { await navigator.clipboard.writeText(description); setCopied(true); setTimeout(() => setCopied(false), 2200); } catch { /* clipboard may be unavailable */ } };
  const handleDownload = () => { const blob = new Blob([description], { type: 'text/plain;charset=utf-8' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'aurenstar-descricao.txt'; link.click(); URL.revokeObjectURL(url); };
  const handleShare = async () => { if (navigator.share) await navigator.share({ title: `Aurenstar — ${signName}`, text: description, url: window.location.href }); else await handleCopy(); };

  return <section className="min-h-[78vh] bg-[#C9E5FF] px-4 py-28 sm:px-6 sm:py-32">
    <div className="mx-auto max-w-5xl">
      <button type="button" onClick={onBackToHome} className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#2878D0] hover:text-[#17366F]"><ArrowLeft className="h-4 w-4" /> {copy.back}</button>
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border border-[#D9E8F8] bg-white p-6 shadow-[0_12px_35px_rgba(23,54,111,0.08)] sm:p-8">
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E4F1FF] text-[#2878D0]"><Sparkles className="h-5 w-5" /></div>
          <p className="text-xs font-extrabold tracking-[0.18em] text-[#2878D0]">{copy.tag}</p>
          <h1 className="mt-3 text-3xl font-extrabold text-[#172B4D]">{copy.title}</h1>
          <p className="mt-3 text-sm leading-relaxed text-[#647DA5]">{copy.subtitle}</p>
          <form onSubmit={handleGenerate} className="mt-7 space-y-4">
            <label className="block text-xs font-bold text-[#172B4D]">{copy.name}<input required value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5 w-full rounded-xl border border-[#D9E8F8] px-3 py-2.5 text-sm outline-none focus:border-[#2878D0]" placeholder="Andriel" /></label>
            <label className="block text-xs font-bold text-[#172B4D]">{copy.sign}<select value={sign} onChange={(e) => setSign(e.target.value as SignKey)} className="mt-1.5 w-full rounded-xl border border-[#D9E8F8] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#2878D0]">{(Object.keys(SIGN_NAMES) as SignKey[]).map((key) => <option key={key} value={key}>{SIGN_NAMES[key][lang]}</option>)}</select></label>
            <div className="grid gap-3 sm:grid-cols-2"><label className="block text-xs font-bold text-[#172B4D]">{copy.date}<input required type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="mt-1.5 w-full rounded-xl border border-[#D9E8F8] px-3 py-2.5 text-sm outline-none focus:border-[#2878D0]" /></label><label className="block text-xs font-bold text-[#172B4D]">{copy.time}<input type="time" value={birthTime} onChange={(e) => setBirthTime(e.target.value)} className="mt-1.5 w-full rounded-xl border border-[#D9E8F8] px-3 py-2.5 text-sm outline-none focus:border-[#2878D0]" /></label></div>
            <label className="block text-xs font-bold text-[#172B4D]">{copy.city}<input value={birthCity} onChange={(e) => setBirthCity(e.target.value)} className="mt-1.5 w-full rounded-xl border border-[#D9E8F8] px-3 py-2.5 text-sm outline-none focus:border-[#2878D0]" placeholder="New York" /></label>
            <button type="submit" className="w-full rounded-full bg-[#2878D0] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#17366F]"><Sparkles className="mr-2 inline h-4 w-4" />{copy.generate}</button>
            <p className="text-[11px] leading-relaxed text-[#647DA5]">{copy.note}</p>
          </form>
        </div>
        <div className="flex flex-col rounded-3xl border border-[#D9E8F8] bg-[#E4F1FF] p-4 shadow-[0_12px_35px_rgba(23,54,111,0.06)] sm:p-6">
          <div className="flex min-h-[330px] flex-1 flex-col justify-between rounded-2xl bg-gradient-to-br from-[#17366F] via-[#2878D0] to-[#F51B83] p-6 text-white sm:p-8">
            <div><p className="text-xs font-extrabold tracking-[0.18em] text-[#C9E5FF]">AURENSTAR · {signName.toUpperCase()}</p><h2 className="mt-5 text-2xl font-extrabold leading-tight sm:text-3xl">{generated ? (name || signName) : (lang === 'pt' ? 'Sua descrição aparecerá aqui' : lang === 'es' ? 'Tu descripción aparecerá aquí' : 'Your description will appear here')}</h2><p className="mt-5 text-base leading-relaxed text-white/90">{generated ? description : (lang === 'pt' ? 'Preencha os dados ao lado para criar uma descrição pessoal e compartilhável.' : lang === 'es' ? 'Completa los datos para crear una descripción personal y compartible.' : 'Fill in the details to create a personal, shareable description.')}</p></div>
            <div className="mt-8 flex items-center justify-between border-t border-white/25 pt-4 text-xs text-white/75"><span>{generated ? signName : 'Aurenstar'}</span><span>aurenstar.com</span></div>
          </div>
          {generated && <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4"><button type="button" onClick={handleCopy} className="rounded-xl bg-white px-3 py-2 text-xs font-bold text-[#172B4D]"> <Copy className="mr-1 inline h-3.5 w-3.5" />{copied ? copy.copied : copy.copy}</button><button type="button" onClick={handleShare} className="rounded-xl bg-white px-3 py-2 text-xs font-bold text-[#172B4D]"><Share2 className="mr-1 inline h-3.5 w-3.5" />{copy.share}</button><button type="button" onClick={handleDownload} className="rounded-xl bg-white px-3 py-2 text-xs font-bold text-[#172B4D]"><Download className="mr-1 inline h-3.5 w-3.5" />{copy.download}</button><button type="button" onClick={onNavigateToBlog} className="rounded-xl bg-white px-3 py-2 text-xs font-bold text-[#172B4D]">{copy.blog}</button></div>}
        </div>
      </div>
    </div>
  </section>;
};

