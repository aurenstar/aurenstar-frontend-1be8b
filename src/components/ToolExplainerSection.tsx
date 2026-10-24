import React from 'react';
import { BookOpen, CalendarDays, Compass, Sparkles, UserRound } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ScrollReveal } from './ScrollReveal';

export const ToolExplainerSection: React.FC = () => {
  const { language } = useLanguage();
  const lang = language || 'en';
  const copy = {
    en: { title: 'HOW AURENSTAR CAN HELP YOU', subtitle: 'Each space has a simple purpose and practical way to support your day.', cards: [
      ['Aurenstar Daily', 'Start your day with a personal message based on your sign. For example, it may invite you to slow down before answering an important message or to give one priority your full attention.', CalendarDays],
      ['Aureneffect', 'A reading for the moment you are living right now. If you feel restless, tired, or full of ideas, it offers a gentle reflection and a small suggestion that fits that feeling.', Sparkles],
      ['Aurenstar Zodiac Calculator', 'Find your sun sign using your birth date. For example, entering June 2 shows Gemini and gives you a friendly introduction to the qualities often connected with that sign.', Compass],
      ['Aurenstar Dictionary', 'A clear place to understand astrology words without complicated explanations. You can look up “rising sign” and see what it means through a simple fictional example.', BookOpen],
      ['Aurenstar Unfiltered', 'Create a fun description of your personality using your name, sign, birthday, time, and birthplace. The result is written like a shareable profile made especially for you.', UserRound],
    ] as const },
    pt: { title: 'COMO A AURENSTAR PODE AJUDAR VOCÊ', subtitle: 'Cada espaço tem um propósito simples e uma forma prática de acompanhar o seu dia.', cards: [
      ['Aurenstar Daily', 'Comece o dia com uma mensagem feita para você a partir do seu signo. Por exemplo, ela pode sugerir que você respire antes de responder uma mensagem importante ou escolha uma prioridade para se concentrar.', CalendarDays],
      ['Aureneffect', 'Uma leitura para o momento que você está vivendo agora. Se você estiver inquieto, cansado ou cheio de ideias, recebe uma reflexão acolhedora e uma sugestão pequena que combina com esse sentimento.', Sparkles],
      ['Aurenstar Zodiac Calculator', 'Descubra seu signo solar usando a data do seu nascimento. Por exemplo, ao informar 2 de junho, você descobre Gêmeos e recebe uma apresentação simples das características associadas ao signo.', Compass],
      ['Aurenstar Dictionary', 'Um espaço para entender palavras da astrologia sem explicações complicadas. Você pode procurar “ascendente” e ver o significado acompanhado de um exemplo fictício e fácil de imaginar.', BookOpen],
      ['Aurenstar Unfiltered', 'Crie uma descrição divertida da sua personalidade usando nome, signo, data, horário e cidade de nascimento. O resultado parece um perfil feito especialmente para você e pronto para compartilhar.', UserRound],
    ] as const },
    es: { title: 'CÓMO AURENSTAR PUEDE AYUDARTE', subtitle: 'Cada espacio tiene un propósito sencillo y una forma práctica de acompañar tu día.', cards: [
      ['Aurenstar Daily', 'Empieza el día con un mensaje pensado para ti según tu signo. Por ejemplo, puede invitarte a respirar antes de responder un mensaje importante o a concentrarte en una sola prioridad.', CalendarDays],
      ['Aureneffect', 'Una lectura para el momento que estás viviendo ahora. Si te sientes inquieto, cansado o lleno de ideas, recibes una reflexión cercana y una sugerencia pequeña para ese estado de ánimo.', Sparkles],
      ['Aurenstar Zodiac Calculator', 'Descubre tu signo solar con tu fecha de nacimiento. Por ejemplo, al indicar el 2 de junio descubres Géminis y recibes una introducción sencilla a sus características.', Compass],
      ['Aurenstar Dictionary', 'Un lugar para entender palabras de astrología sin explicaciones complicadas. Puedes buscar “ascendente” y ver su significado con un ejemplo ficticio fácil de entender.', BookOpen],
      ['Aurenstar Unfiltered', 'Crea una descripción divertida de tu personalidad con tu nombre, signo, fecha, hora y ciudad de nacimiento. El resultado parece un perfil creado especialmente para ti y listo para compartir.', UserRound],
    ] as const },
  }[lang];

  return (
    <section className="w-full bg-[#C9E5FF] py-10 sm:py-12 border-b border-[#D9E8F8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollReveal distance={18} duration={700}>
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="font-extrabold text-sm sm:text-base tracking-[0.2em] uppercase text-[#172B4D]">{copy.title}</h2>
            <p className="mt-2 text-sm text-[#647DA5]">{copy.subtitle}</p>
            <div className="w-12 h-1 bg-gradient-to-r from-[#2878D0] via-[#17366F] to-[#F51B83] rounded-full mx-auto mt-2.5" />
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {copy.cards.map(([title, description, Icon], index) => (
            <ScrollReveal key={title} delay={index * 45} distance={14} duration={650}>
              <article className="h-full rounded-2xl bg-white border border-[#D9E8F8] p-4 sm:p-5 shadow-xs">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#E4F1FF] text-[#2878D0]"><Icon className="h-5 w-5" /></span>
                <h3 className="mt-3 text-sm font-extrabold leading-snug text-[#172B4D]">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-[#647DA5]">{description}</p>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

