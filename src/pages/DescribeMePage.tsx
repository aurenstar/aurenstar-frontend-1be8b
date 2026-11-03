import React, { useState } from 'react';
import { ArrowLeft, Sparkles, MapPin, RefreshCw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { CityAutocomplete, type PickedCity } from '../components/CityAutocomplete';
import { calculateZodiacSign } from '../utils/dailyReadingStorage';

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
  const [birthPlace, setBirthPlace] = useState<PickedCity | null>(null);
  const [cityError, setCityError] = useState(false);
  const [timeUnknown, setTimeUnknown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('12:00');

  const copy = {
    pt: { cityPlaceholder: 'Digite sua cidade (ex: São Paulo)', cityNoResults: 'Nenhuma cidade encontrada. Tente outro nome.', cityRequired: 'Escolha sua cidade na lista de sugestões.', timeUnknown: 'Não sei a hora exata', calculating: 'Calculando seu mapa...', limited: 'Muitas descrições foram criadas por esta conexão hoje. Tente novamente amanhã.', tag: 'AURENSTAR UNFILTERED', title: 'Aurenstar Unfiltered', subtitle: 'Crie uma descrição astrológica divertida, pessoal e feita para compartilhar.', name: 'Nome', sign: 'Signo solar', date: 'Data de nascimento', time: 'Horário de nascimento', city: 'Cidade de nascimento', generate: 'Criar minha descrição', required: 'required', back: 'Voltar ao início', note: 'Prévia do front end: os cálculos de Swiss Ephemeris, fuso e localização serão conectados na próxima etapa.', copy: 'Copiar descrição', copied: 'Descrição copiada', share: 'Compartilhar', download: 'Salvar card', blog: 'Conhecer o blog' },
    en: { cityPlaceholder: 'Type your city (e.g., Munich)', cityNoResults: 'No city found. Try another spelling.', cityRequired: 'Please pick your city from the suggestions.', timeUnknown: 'I do not know the exact time', calculating: 'Calculating your chart...', limited: 'Too many descriptions were created from this connection today. Try again tomorrow.', tag: 'AURENSTAR UNFILTERED', title: 'Aurenstar Unfiltered', subtitle: 'Create a personal, playful astrology description made to be shared.', name: 'Name', sign: 'Sun sign', date: 'Birth date', time: 'Birth time', city: 'Birth city', generate: 'Create my description', required: 'required', back: 'Back to home', note: 'Front-end preview: Swiss Ephemeris, time zone, and location calculations will be connected next.', copy: 'Copy description', copied: 'Description copied', share: 'Share', download: 'Save card', blog: 'Explore the blog' },
    es: { cityPlaceholder: 'Escribe tu ciudad (ej.: Madrid)', cityNoResults: 'No se encontró la ciudad. Prueba otro nombre.', cityRequired: 'Elige tu ciudad en la lista de sugerencias.', timeUnknown: 'No sé la hora exacta', calculating: 'Calculando tu carta...', limited: 'Se crearon demasiadas descripciones desde esta conexión hoy. Inténtalo mañana.', tag: 'AURENSTAR UNFILTERED', title: 'Aurenstar Unfiltered', subtitle: 'Crea una descripción astrológica personal, divertida y fácil de compartir.', name: 'Nombre', sign: 'Signo solar', date: 'Fecha de nacimiento', time: 'Hora de nacimiento', city: 'Ciudad de nacimiento', generate: 'Crear mi descripción', required: 'required', back: 'Volver al inicio', note: 'Vista previa del front end: Swiss Ephemeris, zona horaria y ubicación se conectarán después.', copy: 'Copiar descripción', copied: 'Descripción copiada', share: 'Compartir', download: 'Guardar card', blog: 'Conocer el blog' },
  }[lang];

  // Ready-made description (used only if the calculation or the AI is not available).
  const PT_TO_EN: Record<string, SignKey> = { aries: 'aries', touro: 'taurus', gemeos: 'gemini', cancer: 'cancer', leao: 'leo', virgem: 'virgo', libra: 'libra', escorpiao: 'scorpio', sagitario: 'sagittarius', capricornio: 'capricorn', aquario: 'aquarius', peixes: 'pisces' };
  const buildFallback = (sign: SignKey) => {
    const signName = SIGN_NAMES[sign][lang];
    const trait = SIGN_TRAITS[sign][lang];
    return lang === 'pt' ? `Uma pessoa de ${signName} que ${trait}.` : lang === 'es' ? `Una persona de ${signName} que ${trait}.` : `A ${signName} who ${trait}.`;
  };

  const handleGenerate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !birthDate) return;
    if (!birthPlace) {
      setCityError(true);
      return;
    }
    setIsLoading(true);
    setLimitReached(false);
    const [y, m, d] = birthDate.split('-').map((n) => parseInt(n, 10));
    const sign = PT_TO_EN[calculateZodiacSign(d || 1, m || 1)] || 'gemini';
    let payload: Record<string, unknown> = { description: buildFallback(sign) };

    // Real birth chart (Swiss Ephemeris + IANA time zone + GeoNames city), written by AI; falls back to the ready-made text.
    try {
      const res = await fetch('/api/unfiltered', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          birthDate,
          birthTime: timeUnknown ? '12:00' : birthTime || '12:00',
          timeKnown: !timeUnknown,
          geonameid: birthPlace.geonameid,
          birthCity: birthPlace.label,
          lang,
        }),
      });
      const json = await res.json();
      if (json?.limited) {
        setLimitReached(true);
        setIsLoading(false);
        return;
      }
      if (json?.success && json.data) payload = { ...json.data };
    } catch {
      // keep the ready-made description
    }
    void y;
    try {
      localStorage.setItem(
        DESCRIBE_ME_RESULT_KEY,
        JSON.stringify({ name: name.trim(), sign, birthDate, birthTime: timeUnknown ? '' : birthTime, birthCity: birthPlace.label, ...payload, createdAt: new Date().toISOString() }),
      );
    } catch {
      /* local storage may be unavailable */
    }
    setIsLoading(false);
    onNavigateToResult();
  };

  return <section className="min-h-[78vh] bg-[#C9E5FF] px-4 py-28 sm:px-6 sm:py-32">
    <div className="mx-auto max-w-3xl">
      <button type="button" onClick={onBackToHome} className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#2878D0] hover:text-[#17366F]"><ArrowLeft className="h-4 w-4" /> {copy.back}</button>
      <div className="relative overflow-hidden rounded-3xl border border-[#D9E8F8] bg-white p-6 shadow-[0_12px_35px_rgba(23,54,111,0.08)] sm:p-10">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-[#2878D0]" />
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E4F1FF] text-[#2878D0]"><Sparkles className="h-5 w-5" /></div>
          <p className="text-xs font-extrabold tracking-[0.18em] text-[#2878D0]">{copy.tag}</p>
          <h1 className="mt-3 text-3xl font-extrabold text-[#172B4D]">{copy.title}</h1>
          <p className="mt-3 text-sm leading-relaxed text-[#647DA5]">{copy.subtitle}</p>
          <form onSubmit={handleGenerate} className="mt-7 space-y-4">
            <label className="block text-xs font-bold text-[#172B4D]">{copy.name}<input required value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5 w-full rounded-xl border border-[#D9E8F8] px-3 py-2.5 text-sm outline-none focus:border-[#2878D0]" placeholder="Andriel" /></label>
            <div>
              <label className="block text-xs font-bold text-[#172B4D]"><span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-[#F51B83]" />{copy.city}</span></label>
              <div className="mt-1.5">
                <CityAutocomplete
                  value={birthPlace}
                  onChange={(city) => { setBirthPlace(city); if (city) setCityError(false); }}
                  placeholder={copy.cityPlaceholder}
                  noResultsText={copy.cityNoResults}
                  className="w-full rounded-xl border border-[#D9E8F8] px-3 py-2.5 text-sm outline-none focus:border-[#2878D0]"
                />
              </div>
              {cityError && <p className="mt-1.5 text-[11px] font-semibold text-[#F51B83]">{copy.cityRequired}</p>}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-xs font-bold text-[#172B4D]">{copy.date}<input required type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="mt-1.5 w-full rounded-xl border border-[#D9E8F8] px-3 py-2.5 text-sm outline-none focus:border-[#2878D0]" /></label>
              <label className="block text-xs font-bold text-[#172B4D]">{copy.time}<input type="time" disabled={timeUnknown} value={birthTime} onChange={(e) => setBirthTime(e.target.value)} className="mt-1.5 w-full rounded-xl border border-[#D9E8F8] px-3 py-2.5 text-sm outline-none focus:border-[#2878D0] disabled:opacity-40" /></label>
            </div>
            <label className="flex items-center gap-2 text-xs font-medium text-[#647DA5]"><input type="checkbox" checked={timeUnknown} onChange={(e) => setTimeUnknown(e.target.checked)} className="h-4 w-4 accent-[#2878D0]" />{copy.timeUnknown}</label>
            {limitReached && <p className="text-[11px] font-semibold text-[#F51B83]">{copy.limited}</p>}
            <button type="submit" disabled={isLoading} className="w-full rounded-full bg-[#2878D0] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#17366F] disabled:opacity-60">{isLoading ? <RefreshCw className="mr-2 inline h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 inline h-4 w-4" />}{isLoading ? copy.calculating : copy.generate}</button>
          </form>
        </div>
    </div>
  </section>;
};

