import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Sparkles,
  User,
  Calendar,
  Clock,
  ChevronDown,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import {
  saveDailyReading,
  hasGeneratedToday,
  getSavedDailyReading,
  calculateZodiacSign,
} from '../utils/dailyReadingStorage';

interface DailyMessagePageProps {
  onBackToHome: () => void;
  onNavigateToBlog: () => void;
  onOpenArticle: (id: string) => void;
  onNavigateToResult: () => void;
}

export { calculateZodiacSign };

const MONTHS = [
  { value: 1, days: 31, pt: 'Janeiro', en: 'January', es: 'Enero' },
  { value: 2, days: 29, pt: 'Fevereiro', en: 'February', es: 'Febrero' },
  { value: 3, days: 31, pt: 'Março', en: 'March', es: 'Marzo' },
  { value: 4, days: 30, pt: 'Abril', en: 'April', es: 'Abril' },
  { value: 5, days: 31, pt: 'Maio', en: 'May', es: 'Mayo' },
  { value: 6, days: 30, pt: 'Junho', en: 'June', es: 'Junio' },
  { value: 7, days: 31, pt: 'Julho', en: 'July', es: 'Julio' },
  { value: 8, days: 31, pt: 'Agosto', en: 'August', es: 'Agosto' },
  { value: 9, days: 30, pt: 'Setembro', en: 'September', es: 'Septiembre' },
  { value: 10, days: 31, pt: 'Outubro', en: 'October', es: 'Octubre' },
  { value: 11, days: 30, pt: 'Novembro', en: 'November', es: 'Noviembre' },
  { value: 12, days: 31, pt: 'Dezembro', en: 'December', es: 'Diciembre' },
];

const TIME_PERIODS = [
  {
    id: 'manha',
    icon: '🌅',
    pt: 'Manhã (06h às 12h)',
    en: 'Morning (6am - 12pm)',
    es: 'Mañana (06h a 12h)',
  },
  {
    id: 'tarde',
    icon: '☀️',
    pt: 'Tarde (12h às 18h)',
    en: 'Afternoon (12pm - 6pm)',
    es: 'Tarde (12h a 18h)',
  },
  {
    id: 'noite',
    icon: '🌙',
    pt: 'Noite (18h às 00h)',
    en: 'Evening (6pm - 12am)',
    es: 'Noche (18h a 00h)',
  },
  {
    id: 'madrugada',
    icon: '✨',
    pt: 'Madrugada (00h às 06h)',
    en: 'Night (12am - 6am)',
    es: 'Madrugada (00h a 06h)',
  },
];

export const DailyMessagePage: React.FC<DailyMessagePageProps> = ({
  onBackToHome,
  onNavigateToBlog,
  onNavigateToResult,
}) => {
  const { language } = useLanguage();
  const lang = (language || 'pt') as 'pt' | 'en' | 'es';

  // User form states
  const [userName, setUserName] = useState('Andriel');
  const [birthDay, setBirthDay] = useState(15);
  const [birthMonth, setBirthMonth] = useState(6); // Junho -> Gêmeos
  const [birthYear, setBirthYear] = useState(2000);
  const [birthTimePeriod, setBirthTimePeriod] = useState('tarde');

  // Computed sign
  const [userSign, setUserSign] = useState('gemeos');
  const [alreadyGeneratedToday, setAlreadyGeneratedToday] = useState(false);

  // Load saved profile or prior reading
  useEffect(() => {
    try {
      const generated = hasGeneratedToday();
      setAlreadyGeneratedToday(generated);

      const savedReading = getSavedDailyReading();
      if (savedReading) {
        if (savedReading.userName) setUserName(savedReading.userName);
        if (savedReading.birthDay) setBirthDay(savedReading.birthDay);
        if (savedReading.birthMonth) setBirthMonth(savedReading.birthMonth);
        if (savedReading.birthYear) setBirthYear(savedReading.birthYear);
        if (savedReading.birthTimePeriod) setBirthTimePeriod(savedReading.birthTimePeriod);
        if (savedReading.signKey) setUserSign(savedReading.signKey);
      } else {
        const savedProfile = JSON.parse(
          localStorage.getItem('aurenstar_reader_profile') || 'null'
        );
        if (savedProfile) {
          if (savedProfile.name) setUserName(savedProfile.name);
          if (savedProfile.day) setBirthDay(Number(savedProfile.day));
          if (savedProfile.month) setBirthMonth(Number(savedProfile.month));
          if (savedProfile.year) setBirthYear(Number(savedProfile.year));
          if (savedProfile.timePeriod) setBirthTimePeriod(savedProfile.timePeriod);
          if (savedProfile.sign) {
            setUserSign(savedProfile.sign);
          } else if (savedProfile.day && savedProfile.month) {
            setUserSign(calculateZodiacSign(Number(savedProfile.day), Number(savedProfile.month)));
          }
        } else {
          setUserSign(calculateZodiacSign(15, 6)); // Gêmeos
        }
      }
    } catch {
      // Fallback
    }
  }, []);

  const handleDateChange = (newDay: number, newMonth: number) => {
    setBirthDay(newDay);
    setBirthMonth(newMonth);
    const computed = calculateZodiacSign(newDay, newMonth);
    setUserSign(computed);
  };

  const zodiacSigns = [
    { key: 'aries', name: { pt: 'Áries', en: 'Aries', es: 'Aries' }, symbol: '♈' },
    { key: 'touro', name: { pt: 'Touro', en: 'Taurus', es: 'Tauro' }, symbol: '♉' },
    { key: 'gemeos', name: { pt: 'Gêmeos', en: 'Gemini', es: 'Géminis' }, symbol: '♊' },
    { key: 'cancer', name: { pt: 'Câncer', en: 'Cancer', es: 'Cáncer' }, symbol: '♋' },
    { key: 'leao', name: { pt: 'Leão', en: 'Leo', es: 'Leo' }, symbol: '♌' },
    { key: 'virgem', name: { pt: 'Virgem', en: 'Virgo', es: 'Virgo' }, symbol: '♍' },
    { key: 'libra', name: { pt: 'Libra', en: 'Libra', es: 'Libra' }, symbol: '♎' },
    { key: 'escorpiao', name: { pt: 'Escorpião', en: 'Scorpio', es: 'Escorpio' }, symbol: '♏' },
    { key: 'sagitario', name: { pt: 'Sagitário', en: 'Sagittarius', es: 'Sagitario' }, symbol: '♐' },
    { key: 'capricornio', name: { pt: 'Capricórnio', en: 'Capricorn', es: 'Capricornio' }, symbol: '♑' },
    { key: 'aquario', name: { pt: 'Aquário', en: 'Aquarius', es: 'Acuario' }, symbol: '♒' },
    { key: 'peixes', name: { pt: 'Peixes', en: 'Pisces', es: 'Piscis' }, symbol: '♓' },
  ];

  const activeSignObj =
    zodiacSigns.find((s) => s.key === userSign) || zodiacSigns[2]; // Gêmeos fallback

  // Tailored messages database per sign
  const signReadings: Record<
    string,
    {
      theme: { pt: string; en: string; es: string };
      affirmations: { pt: string; en: string; es: string };
      messages: { pt: string; en: string; es: string };
      advices: { pt: string; en: string; es: string };
      articleId: string;
    }
  > = {
    gemeos: {
      theme: {
        pt: 'Curiosidade e Leveza Mental',
        en: 'Curiosity & Mental Ease',
        es: 'Curiosidad y Mente Serena',
      },
      affirmations: {
        pt: 'Minha curiosidade me guia para coisas boas e minha mente encontra paz hoje.',
        en: 'My curiosity guides me toward beauty and my mind finds gentle stillness today.',
        es: 'Mi curiosidad me guía hacia cosas buenas y mi mente encuentra paz hoy.',
      },
      messages: {
        pt: 'Para você de Gêmeos, a mente é um universo brilhante e cheio de ideias. Hoje, escolha uma ideia especial para focar com carinho em vez de tentar resolver tudo de uma vez. Sua capacidade de conversar, alegrar as pessoas e enxergar vários lados de uma questão é um verdadeiro dom. Respeite sua liberdade e desfrute do seu dia com leveza.',
        en: 'For you, Gemini, your mind is a lively cosmos of sparkling ideas. Today, pick one meaningful priority to nurture instead of rushing through many. Your gift for communication brings uplifting light to everyone. Honor your freedom and enjoy today with gentle ease.',
        es: 'Para ti de Géminis, tu mente es un cielo brillante de ideas. Hoy, elige una prioridad para cuidar con cariño en vez de apurarte. Tu facilidad para conectar alegra el día de todos. Respeta tu libertad y disfruta tu día con calma.',
      },
      advices: {
        pt: 'Faça uma pausa de 5 minutos sem celular para respirar fundo e relaxar a mente.',
        en: 'Take a quiet 5-minute screen-free pause to breathe deeply and rest your thoughts.',
        es: 'Toma una pausa de 5 minutos sin pantallas para respirar hondo y relajar tu mente.',
      },
      articleId: 'post-gemeos',
    },
    aries: {
      theme: {
        pt: 'Coragem e Energia Serena',
        en: 'Courage & Serene Energy',
        es: 'Valor y Energía Serena',
      },
      affirmations: {
        pt: 'Eu tenho coragem para começar e paciência para colher o melhor.',
        en: 'I hold courage to begin and patience to harvest the finest results.',
        es: 'Tengo valor para comenzar y paciencia para cosechar lo mejor.',
      },
      messages: {
        pt: 'Áries tem a centelha viva da ação. Hoje, use sua determinação para dar o primeiro passo em algo que você vinha adiando. Lembre-se de respirar fundo antes de agir: a força com calma é o seu maior superpoder.',
        en: 'Aries carries the spark of action. Today, use your determination to take the first step on something you postponed. Steady breathing transforms fire into lasting victory.',
        es: 'Aries tiene la chispa de la acción. Hoy, usa tu impulso para dar el primer paso en lo que habías postergado. Respira profundo: la fuerza serena es invencible.',
      },
      advices: {
        pt: 'Faça uma caminhada agradável ou um alongamento leve para canalizar sua energia.',
        en: 'Take a pleasant walk or gentle stretch to balance your physical energy.',
        es: 'Haz una caminata agradable para equilibrar tu energía.',
      },
      articleId: 'post-aries',
    },
    touro: {
      theme: {
        pt: 'Paciência e Conforto',
        en: 'Patience & Steady Comfort',
        es: 'Paciencia y Armonía',
      },
      affirmations: {
        pt: 'Eu respeito meu próprio ritmo e encontro segurança na simplicidade.',
        en: 'I honor my own peaceful rhythm and find safety in everyday simplicity.',
        es: 'Respeto mi propio ritmo y encuentro seguridad en la sencillez.',
      },
      messages: {
        pt: 'Touro ensina o valor de ter os pés no chão. Hoje, desfrute dos prazeres simples: um café gostoso, uma conversa carinhosa e a tranquilidade de saber que tudo tem seu tempo certo para florescer.',
        en: 'Taurus teaches us the bliss of grounding our feet. Today, savor quiet pleasures: a warm drink, a sincere hug, and the assurance that everything blossoms in due time.',
        es: 'Tauro nos enseña el valor de la estabilidad. Hoy, saborea los momentos simples: una taza caliente, el afecto sincero y la calma de saber que todo tiene su tiempo.',
      },
      advices: {
        pt: 'Alimente-se sem pressa, prestando atenção em cada sabor com calma.',
        en: 'Enjoy your meals slowly, paying mindful attention to every flavor.',
        es: 'Come sin prisas, saboreando cada bocado con gratitud.',
      },
      articleId: 'post-touro',
    },
    cancer: {
      theme: {
        pt: 'Acolhimento e Amor Próprio',
        en: 'Warm Care & Self-Love',
        es: 'Cariño y Amor Propio',
      },
      affirmations: {
        pt: 'Meu coração é um lugar seguro e minha sensibilidade é um dom precioso.',
        en: 'My heart is a peaceful sanctuary and my sensitivity is a beloved gift.',
        es: 'Mi corazón es un refugio seguro y mi ternura es un don hermoso.',
      },
      messages: {
        pt: 'Para você de Câncer, o afeto transforma o mundo. Hoje, cuide do seu espaço e dos seus sentimentos com o mesmo amor que você dedica a quem ama. Sua intuição é sábia e aponta sempre o melhor caminho.',
        en: 'For you, Cancer, loving warmth moves the world. Today, nurture your space and emotions with the same care you offer others. Your heart senses the right answers.',
        es: 'Para ti de Cáncer, el afecto lo transforma todo. Hoy, cuida tu hogar y tus emociones con el mismo amor que brindas a los demás.',
      },
      advices: {
        pt: 'Tome um banho relaxante e reserve um tempinho tranquilo para descansar em casa.',
        en: 'Take a soothing warm shower and reserve quiet time at home tonight.',
        es: 'Date un baño reconfortante y descansa en la tranquilidad de tu hogar.',
      },
      articleId: 'post-cancer',
    },
    leao: {
      theme: {
        pt: 'Generosidade e Luz Própria',
        en: 'Generosity & Sunny Radiance',
        es: 'Generosidad y Luz Propia',
      },
      affirmations: {
        pt: 'Eu compartilho minha luz com bondade e alegro quem está por perto.',
        en: 'I share my radiant light with humble generosity and uplift those around me.',
        es: 'Comparto mi luz con nobleza e inspiro a quienes me rodean.',
      },
      messages: {
        pt: 'Leão tem um coração caloroso e nobre. Hoje, use seu sorriso sincero para alegrar alguém que esteja desanimado. Quando você reconhece o valor das pessoas à sua volta, sua própria luz brilha em dobro.',
        en: 'Leo shines with genuine warmth. Today, use your cheerful heart to brighten someone day. When you honor those beside you, your light multiplies twice over.',
        es: 'Leo brilla con calidez noble. Hoy, usa tu entusiasmo para animar a alguien. Quando valoras a quienes te acompañan, tu luz se multiplica.',
      },
      advices: {
        pt: 'Faça um elogio verdadeiro e afetuoso para uma pessoa amiga hoje.',
        en: 'Give a sincere, heartfelt compliment to someone in your daily circle.',
        es: 'Haz un cumplido sincero a alguien de tu entorno hoy.',
      },
      articleId: 'post-leao',
    },
    virgem: {
      theme: {
        pt: 'Equilíbrio e Autocuidado',
        en: 'Balance & Simple Harmony',
        es: 'Equilibrio y Autocuidado',
      },
      affirmations: {
        pt: 'Feito com carinho e presença vale muito mais do que a perfeição.',
        en: 'Done with loving presence is infinitely more valuable than harsh perfection.',
        es: 'Hacer las cosas con presencia y amor vale más que la perfección.',
      },
      messages: {
        pt: 'Virgem tem o olhar atento para o que pode ser melhorado. Hoje, lembre-se de ser tão compreensivo consigo mesmo quanto você é ao ajudar os outros. Celebre cada pequena tarefa concluída sem cobranças.',
        en: 'Virgo holds a keen eye for helpful order. Today, remember to offer yourself the very same patience you grant a dear friend. Celebrate completed steps without critique.',
        es: 'Virgo sabe ordenar y ayudar. Hoy, recuerda ser tan comprensivo contigo mismo como lo eres con los demás. Celebra tus logros sin exigencias.',
      },
      advices: {
        pt: 'Arrume um cantinho do seu quarto ou mesa e sinta a sensação de paz.',
        en: 'Tidy one small corner of your desk or room and take a deep breath of relief.',
        es: 'Ordena un rincón de tu espacio y respira con tranquilidad.',
      },
      articleId: 'post-virgem',
    },
    libra: {
      theme: {
        pt: 'Paz Interior e Harmonia',
        en: 'Inner Peace & Harmony',
        es: 'Paz Interior y Armonía',
      },
      affirmations: {
        pt: 'Eu confio no meu coração e encontro paz em todas as minhas decisões.',
        en: 'I trust my heartfelt intuition and find gentle peace in my choices.',
        es: 'Confío en mi corazón y encuentro serenidad en mis decisiones.',
      },
      messages: {
        pt: 'Libra ama a gentileza e os ambientes pacíficos. Hoje, ao tomar uma decisão, feche os olhos e ouça o que traz calma interior. A harmonia verdadeira nasce quando você confia em quem você é.',
        en: 'Libra adores kindness and peaceful atmospheres. Today, when deciding, close your eyes and listen to what brings quiet stillness. True balance begins within.',
        es: 'Libra busca la amabilidad y la belleza. Hoy, al decidir algo, escucha lo que te trae calma interior. La armonía nace de confiar en ti.',
      },
      advices: {
        pt: 'Coloque uma música tranquila que você adora e relaxe por alguns minutos.',
        en: 'Play soft, comforting music you love and relax your mind for 5 minutes.',
        es: 'Escucha música suave y relaja tus pensamientos durante 5 minutos.',
      },
      articleId: 'post-libra',
    },
    escorpiao: {
      theme: {
        pt: 'Renovação e Força Interior',
        en: 'Transformation & Inner Power',
        es: 'Renovación y Fuerza Interior',
      },
      affirmations: {
        pt: 'Eu deixo ir o passado e recebo tudo de bom que a vida tem para mim.',
        en: 'I let go of past burdens and welcome all the goodness today offers me.',
        es: 'Suelto cargas pasadas y recibo con alegría lo que la vida me ofrece hoy.',
      },
      messages: {
        pt: 'Escorpião tem a incrível capacidade de recomeçar com ainda mais sabedoria. Hoje, pratique o desapego de mágoas passadas. Quando você abre as mãos, a vida coloca coisas novas e felizes no seu caminho.',
        en: 'Scorpio holds unmatched power to renew itself after any trial. Today, practice letting go of old resentments. An open hand is ready to receive fresh blessings.',
        es: 'Escorpio tiene la fuerza de renacer ante cualquier dificultad. Hoy, perdona y suelta el pasado para recibir bendiciones nuevas.',
      },
      advices: {
        pt: 'Escreva um pensamento que te incomoda em um papel e jogue fora como alívio.',
        en: 'Write down an annoying thought on paper and toss it as a peaceful release.',
        es: 'Anota un pensamiento que te pese y bótalo como símbolo de desapego.',
      },
      articleId: 'post-escorpiao',
    },
    sagitario: {
      theme: {
        pt: 'Otimismo e Liberdade',
        en: 'Optimism & Joyful Freedom',
        es: 'Optimismo y Libertad',
      },
      affirmations: {
        pt: 'Minha esperança é forte e eu celebro cada momento com alegria.',
        en: 'My hope is unshakable and I celebrate the journey of life with joy.',
        es: 'Mi esperanza es firme y disfruto cada momento de la vida con alegría.',
      },
      messages: {
        pt: 'Sagitário tem o dom de ver o lado positivo de tudo. Hoje, encare sua rotina com curiosidade e bom humor. Seu sorriso contagia as pessoas e torna o ambiente mais leve para todo mundo.',
        en: 'Sagittarius holds the gift of noticing the bright side everywhere. Today, view daily routines as a delightful micro-adventure. Your cheerfulness is healing.',
        es: 'Sagitario ve el lado luminoso de las cosas. Hoy, toma tu rutina como una linda aventura. Tu optimismo alegra el día de todos.',
      },
      advices: {
        pt: 'Olhe para o céu por alguns instantes e respire o ar fresco com gratidão.',
        en: 'Gaze at the open sky for a few quiet moments and breathe fresh air with thanks.',
        es: 'Mira al cielo unos instantes y respira hondo con gratitud.',
      },
      articleId: 'post-sagitario',
    },
    capricornio: {
      theme: {
        pt: 'Firmeza e Conquistas Serenas',
        en: 'Steadfastness & Calm Triumph',
        es: 'Firmeza y Logros Serenos',
      },
      affirmations: {
        pt: 'Eu caminho com calma para meus objetivos e valorizo meu descanso.',
        en: 'I build my goals with steady steps and enjoy peaceful rest without guilt.',
        es: 'Construyo mis metas paso a paso y disfruto de mi descanso sin culpas.',
      },
      messages: {
        pt: 'Capricórnio sabe que as grandes vitórias são construídas passo a passo. Hoje, reconheça o quanto você já caminhou. Descansar a mente não é perder tempo: é renovar as forças para seguir em frente.',
        en: 'Capricorn understands that tall mountains are climbed step by step. Today, acknowledge how far you have already come. Resting recharges your greatest triumphs.',
        es: 'Capricornio sabe que la cumbre se alcanza con paciencia. Hoy, valora todo lo que has avanzado. Descansar renueva tus energías.',
      },
      advices: {
        pt: 'Faça uma pausa de 10 minutos sem pensar em tarefas ou cobranças.',
        en: 'Take a guilt-free 10-minute break with zero thoughts of work or chores.',
        es: 'Haz una pausa de 10 minutos sin pensar en obligaciones.',
      },
      articleId: 'post-capricornio',
    },
    aquario: {
      theme: {
        pt: 'Autenticidade e Criatividade',
        en: 'Originality & Creative Spirit',
        es: 'Originalidad y Creatividad',
      },
      affirmations: {
        pt: 'Ser quem eu sou com naturalidade é meu maior presente para o mundo.',
        en: 'Being authentically who I am is my greatest gift to the world.',
        es: 'Ser auténtico es mi mayor regalo para el mundo.',
      },
      messages: {
        pt: 'Aquário pensa no bem de todos e tem ideias criativas. Hoje, confie nas suas intuições diferentes. Quando você compartilha seus pontos de vista com gentileza, você inspira as pessoas ao seu redor.',
        en: 'Aquarius carries innovative vision and care for others. Today, trust your creative insights. Sharing your perspective with gentle kindness inspires everyone.',
        es: 'Acuario tiene ideas brillantes y buen corazón. Hoy, confía en tu originalidad. Compartir tus ideas con amabilidad inspira a los demás.',
      },
      advices: {
        pt: 'Anote uma ideia diferente que surgiu na sua cabeça hoje.',
        en: 'Jot down an inventive idea that crossed your mind today.',
        es: 'Anota una idea creativa que te haya surgido hoy.',
      },
      articleId: 'post-aquario',
    },
    peixes: {
      theme: {
        pt: 'Empatia e Paz Interior',
        en: 'Empathy & Cosmic Stillness',
        es: 'Empatía y Paz Interior',
      },
      affirmations: {
        pt: 'Minha intuição é sábia e meu coração está protegido em paz.',
        en: 'My intuition is wise and my heart is safely shielded in quiet peace.',
        es: 'Mi intuición es acertada y mi corazón descansa en paz.',
      },
      messages: {
        pt: 'Peixes sente a vida com carinho e delicadeza. Hoje, cuide da sua paz tirando alguns momentos de silêncio. A sua bondade e compreensão são um presente para quem convive com você.',
        en: 'Pisces senses the gentle currents of life. Today, safeguard your emotional energy with quiet pauses. Your sweet kindness is a blessing to all.',
        es: 'Piscis siente la vida con gran profundidad. Hoy, cuida tu paz con momentos de calma. Tu generosidad es un tesoro para quienes te rodean.',
      },
      advices: {
        pt: 'Beba uma água ou chá quentinho e tire alguns minutos para sonhar com calma.',
        en: 'Sip a warm tea and enjoy a few minutes of serene, gentle daydreaming.',
        es: 'Toma una infusión tibia y date unos minutos para soñar con calma.',
      },
      articleId: 'post-peixes',
    },
  };

  const activeReading = signReadings[userSign] || signReadings.gemeos;

  const currentMonthDays =
    MONTHS.find((m) => m.value === birthMonth)?.days || 31;
  const daysArray = Array.from({ length: currentMonthDays }, (_, i) => i + 1);
  const yearsArray = Array.from({ length: 90 }, (_, i) => 2026 - i);

  // Form Submission -> Save reading and open dedicated new page!
  const handleSubmitAndOpenPage = (e: React.FormEvent) => {
    e.preventDefault();

    // Regra: 1 geração por dia! Se já gerou hoje, abre diretamente a leitura atual
    if (alreadyGeneratedToday) {
      onNavigateToResult();
      return;
    }

    const finalSign = calculateZodiacSign(birthDay, birthMonth);
    const readingContent = signReadings[finalSign] || signReadings.gemeos;
    const finalSignObj = zodiacSigns.find((s) => s.key === finalSign) || zodiacSigns[2];

    saveDailyReading({
      userName: userName.trim() || 'Andriel',
      signKey: finalSign,
      signName: finalSignObj.name[lang] || finalSignObj.name.pt,
      signSymbol: finalSignObj.symbol,
      signTheme: readingContent.theme[lang] || readingContent.theme.pt,
      birthDay,
      birthMonth,
      birthYear,
      birthTimePeriod,
      affirmation: readingContent.affirmations[lang] || readingContent.affirmations.pt,
      message: readingContent.messages[lang] || readingContent.messages.pt,
      advice: readingContent.advices[lang] || readingContent.advices.pt,
      articleId: readingContent.articleId,
    });

    // Navigate to dedicated new page (pageview strategy)
    onNavigateToResult();
  };

  const texts = {
    pt: {
      tag: 'Leitura Personalizada',
      title: 'Leitura Cósmica Diária',
      subtitle:
        'Coloque seu nome, sua data de nascimento e horário aproximado para receber sua mensagem de hoje.',
      backHome: 'Voltar ao Início',
      exploreBlog: 'Ver Artigos do Blog',
      alreadyGeneratedAlert: 'Sua leitura de hoje já está pronta! ✨',
      alreadyGeneratedSub:
        'Limite diário de 1 mensagem por dia. Você pode ver sua leitura e gerar seu card para os Stories a qualquer momento.',
      viewTodayBtn: 'Ver Minha Leitura de Hoje ✨',
      formTitle: 'Seus Dados para a Leitura',
      formSubtitle: 'Preencha abaixo para abrir sua leitura do dia:',
      nameLabel: 'Seu Nome ou Apelido:',
      namePlaceholder: 'Digite seu nome (ex: Andriel)',
      birthDateLabel: 'Data de Nascimento:',
      dayLabel: 'Dia',
      monthLabel: 'Mês',
      yearLabel: 'Ano',
      timeLabel: 'Hora Aproximada de Nascimento:',
      computedSignLabel: 'Signo identificado:',
      generateBtn: 'Gerar Minha Leitura Diária ✨',
      generateBtnSub: 'Abre uma nova página com sua leitura e o card para Stories',
    },
    en: {
      tag: 'Personalized Reading',
      title: 'Daily Cosmic Reading',
      subtitle:
        'Enter your name, birth date, and approximate time to receive your personalized message today.',
      backHome: 'Back to Home',
      exploreBlog: 'Explore Blog Posts',
      alreadyGeneratedAlert: 'Your reading for today is already prepared! ✨',
      alreadyGeneratedSub:
        'Daily limit of 1 message per day. You can view your reading and download your Story card anytime.',
      viewTodayBtn: 'View Today’s Reading ✨',
      formTitle: 'Your Details for the Reading',
      formSubtitle: 'Fill in below to open your daily reading:',
      nameLabel: 'Your Name or Nickname:',
      namePlaceholder: 'Type your name (e.g., Andriel)',
      birthDateLabel: 'Date of Birth:',
      dayLabel: 'Day',
      monthLabel: 'Month',
      yearLabel: 'Year',
      timeLabel: 'Approximate Birth Time:',
      computedSignLabel: 'Detected Sun Sign:',
      generateBtn: 'Generate My Daily Reading ✨',
      generateBtnSub: 'Opens a dedicated new page with your reading & Story card',
    },
    es: {
      tag: 'Lectura Personalizada',
      title: 'Lectura Cósmica Diaria',
      subtitle:
        'Ingresa tu nombre, fecha de nacimiento y hora aproximada para recibir tu mensaje de hoy.',
      backHome: 'Volver al Inicio',
      exploreBlog: 'Ver Artículos del Blog',
      alreadyGeneratedAlert: '¡Tu lectura de hoy ya está lista! ✨',
      alreadyGeneratedSub:
        'Límite diario de 1 mensaje al día. Puedes ver tu lectura y descargar tu card para Stories cuando quieras.',
      viewTodayBtn: 'Ver Mi Lectura de Hoy ✨',
      formTitle: 'Tus Datos para la Lectura',
      formSubtitle: 'Completa los campos para abrir tu lectura del día:',
      nameLabel: 'Tu Nombre o Apodo:',
      namePlaceholder: 'Escribe tu nombre (ej: Andriel)',
      birthDateLabel: 'Fecha de Nacimiento:',
      dayLabel: 'Día',
      monthLabel: 'Mes',
      yearLabel: 'Año',
      timeLabel: 'Hora Aproximada de Nacimiento:',
      computedSignLabel: 'Signo identificado:',
      generateBtn: 'Generar Mi Lectura Diaria ✨',
      generateBtnSub: 'Abre una nueva página con tu lectura y el card para Stories',
    },
  };

  const t = texts[lang] || texts.pt;
  const signDisplayName = activeSignObj.name[lang] || activeSignObj.name.pt;

  return (
    <div className="w-full bg-[#C9E5FF] min-h-screen pt-24 sm:pt-28 pb-20 select-none animate-fadeIn text-[#172B4D] relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[550px] h-[300px] bg-[#E4F1FF]/80 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Navigation Breadcrumbs */}
        <div className="flex items-center justify-between mb-6 pb-2">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 hover:bg-white text-xs sm:text-sm font-bold text-[#647DA5] hover:text-[#172B4D] border border-[#D9E8F8] shadow-2xs transition-all cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-[#2878D0]" />
            <span>{t.backHome}</span>
          </button>

          <button
            type="button"
            onClick={onNavigateToBlog}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E4F1FF] hover:bg-[#FFE0EF] text-xs sm:text-sm font-bold text-[#2878D0] border border-[#D9E8F8] transition-all cursor-pointer"
          >
            <span>{t.exploreBlog}</span>
            <span>→</span>
          </button>
        </div>

        {/* Page Top Heading */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#D9E8F8] text-[#2878D0] text-xs font-extrabold uppercase tracking-wider mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#F51B83]" />
            <span>{t.tag}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172B4D] tracking-tight mb-2.5 leading-tight">
            {t.title}
          </h1>

          <p className="text-sm text-[#647DA5] leading-relaxed max-w-md mx-auto font-medium">
            {t.subtitle}
          </p>
        </div>

        {/* =========================================================================
            USER INPUT FORM (Nome, Data de Nascimento, Hora Aproximada)
            ========================================================================= */}
        <div className="bg-[#FFFFFF] rounded-3xl border border-[#D9E8F8] shadow-md hover:shadow-lg p-6 sm:p-9 mb-8 transition-all relative overflow-hidden">
          {/* Subtle top decorative border */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#2878D0]" />

          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#D9E8F8]">
            <div className="w-10 h-10 rounded-2xl bg-[#E4F1FF] text-[#2878D0] flex items-center justify-center font-bold shadow-2xs">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#172B4D]">
                {t.formTitle}
              </h2>
              <p className="text-xs text-[#647DA5]">
                {t.formSubtitle}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmitAndOpenPage} className="space-y-6">
            {/* 1. Nome */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#172B4D] mb-2 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#2878D0]" />
                <span>{t.nameLabel}</span>
              </label>
              <input
                type="text"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder={t.namePlaceholder}
                className="w-full bg-[#E4F1FF]/30 border border-[#D9E8F8] rounded-2xl px-4 py-3 text-sm text-[#172B4D] font-semibold outline-none focus:border-[#2878D0] focus:bg-white focus:ring-2 focus:ring-[#2878D0]/15 transition-all shadow-2xs"
              />
            </div>

            {/* 2. Data de Nascimento */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#172B4D] mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#2878D0]" />
                <span>{t.birthDateLabel}</span>
              </label>

              <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                {/* Dia */}
                <div>
                  <span className="block text-[11px] font-bold text-[#647DA5] mb-1">
                    {t.dayLabel}
                  </span>
                  <div className="relative">
                    <select
                      value={birthDay}
                      onChange={(e) =>
                        handleDateChange(Number(e.target.value), birthMonth)
                      }
                      className="w-full appearance-none bg-[#E4F1FF]/30 border border-[#D9E8F8] rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-[#172B4D] outline-none focus:border-[#2878D0] focus:bg-white cursor-pointer pr-8"
                    >
                      {daysArray.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-[#647DA5] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Mês */}
                <div>
                  <span className="block text-[11px] font-bold text-[#647DA5] mb-1">
                    {t.monthLabel}
                  </span>
                  <div className="relative">
                    <select
                      value={birthMonth}
                      onChange={(e) =>
                        handleDateChange(birthDay, Number(e.target.value))
                      }
                      className="w-full appearance-none bg-[#E4F1FF]/30 border border-[#D9E8F8] rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-[#172B4D] outline-none focus:border-[#2878D0] focus:bg-white cursor-pointer pr-8"
                    >
                      {MONTHS.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m[lang] || m.pt}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-[#647DA5] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Ano */}
                <div>
                  <span className="block text-[11px] font-bold text-[#647DA5] mb-1">
                    {t.yearLabel}
                  </span>
                  <div className="relative">
                    <select
                      value={birthYear}
                      onChange={(e) => setBirthYear(Number(e.target.value))}
                      className="w-full appearance-none bg-[#E4F1FF]/30 border border-[#D9E8F8] rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-[#172B4D] outline-none focus:border-[#2878D0] focus:bg-white cursor-pointer pr-8"
                    >
                      {yearsArray.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-[#647DA5] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

            </div>

            {/* 3. Hora Aproximada de Nascimento */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#172B4D] mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#2878D0]" />
                <span>{t.timeLabel}</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {TIME_PERIODS.map((period) => {
                  const isSelected = birthTimePeriod === period.id;
                  return (
                    <button
                      key={period.id}
                      type="button"
                      onClick={() => setBirthTimePeriod(period.id)}
                      className={`p-3 rounded-2xl text-xs font-bold transition-all cursor-pointer border text-center flex flex-col items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#2878D0] text-white border-[#2878D0] shadow-sm scale-[1.02]'
                          : 'bg-[#E4F1FF]/30 border-[#D9E8F8] text-[#172B4D] hover:border-[#2878D0] hover:bg-white'
                      }`}
                    >
                      <span className="text-lg">{period.icon}</span>
                      <span className="leading-tight">{period[lang] || period.pt}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Botão de Abrir Nova Página com Regra de 1 Leitura por Dia */}
            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-2xl bg-[#2878D0] hover:bg-[#17366F] text-white font-extrabold text-sm sm:text-base shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2.5 group active:scale-[0.99]"
              >
                <Sparkles className="w-4 h-4 transition-transform group-hover:rotate-12" />
                <span>
                  {alreadyGeneratedToday
                    ? 'Ver Minha Leitura de Hoje ✨'
                    : 'Gerar Minha Leitura Diária ✨'}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

