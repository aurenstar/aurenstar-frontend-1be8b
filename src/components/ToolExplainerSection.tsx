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
    <section className="relative w-full overflow-hidden border-b border-[#D9E8F8] bg-gradient-to-br from-[#C9E5FF] via-[#DDEBFF] to-[#F4E8F5] py-12 sm:py-16">
      <div className="pointer-events-none absolute -left-24 top-16 h-56 w-56 rounded-full bg-[#2878D0]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-[#F51B83]/10 blur-3xl" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollReveal distance={18} duration={700}>
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="font-extrabold text-sm sm:text-base tracking-[0.2em] uppercase text-[#172B4D]">{copy.title}</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#647DA5]">{copy.subtitle}</p>
            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-[#2878D0] via-[#17366F] to-[#F51B83]" />
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {copy.cards.map(([title, description, Icon], index) => (
            <ScrollReveal key={title} delay={index * 45} distance={14} duration={650}>
              <article className="group relative h-full overflow-hidden rounded-3xl border border-white/80 bg-white/90 p-5 shadow-[0_10px_30px_rgba(23,54,111,0.08)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#2878D0]/40 hover:bg-white hover:shadow-[0_18px_38px_rgba(23,54,111,0.16)] sm:p-6">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#2878D0] via-[#7C5CC4] to-[#F51B83] opacity-70 transition-opacity group-hover:opacity-100" />
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#E4F1FF] to-[#F2E7FF] text-[#2878D0] shadow-inner transition-transform duration-300 group-hover:scale-105 group-hover:text-[#7C3FA0]"><Icon className="h-5 w-5" /></span>
                  <span className="text-[10px] font-extrabold tracking-[0.18em] text-[#A1B6D5]">0{index + 1}</span>
                </div>
                <h3 className="mt-4 text-[15px] font-extrabold leading-snug text-[#172B4D]">{title}</h3>
                <p className="mt-2.5 text-[13px] leading-[1.65] text-[#647DA5]">{description}</p>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

