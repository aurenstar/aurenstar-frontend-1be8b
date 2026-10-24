import React from 'react';
import { BookOpen, CalendarDays, Compass, Sparkles, UserRound } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ScrollReveal } from './ScrollReveal';

type ToolKey = 'daily-message' | 'aureneffect' | 'discover-sign' | 'dicionario' | 'describe-me';

interface ToolExplainerSectionProps {
  onNavigate: (tool: ToolKey) => void;
}

export const ToolExplainerSection: React.FC<ToolExplainerSectionProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const lang = language || 'en';
  const copy = {
    en: { title: 'HOW AURENSTAR CAN HELP YOU', subtitle: 'Each space has a simple purpose and practical way to support your day.', cards: [
      ['Aurenstar Daily', 'Start your day with a personal message based on your sign. It connects the tone of the day with a calm, practical idea. For example, it may invite you to pause before answering an important message, protect your energy, or give one priority your full attention.', 'daily-message', CalendarDays],
      ['Aureneffect', 'A reading for the moment you are living right now. If you feel restless, tired, or full of ideas, it turns that feeling into a gentle reflection and one small suggestion you can actually try, such as taking a pause or finishing one open task.', 'aureneffect', Sparkles],
      ['Aurenstar Zodiac Calculator', 'Find your sun sign using your birth date and understand the first idea associated with it. For example, entering June 2 shows Gemini and introduces its curiosity, communication, and love of learning in friendly language.', 'discover-sign', Compass],
      ['Aurenstar Dictionary', 'A clear place to understand astrology words without complicated explanations. Look up “rising sign”, for example, and see what it means through a simple fictional story instead of a list of difficult definitions.', 'dicionario', BookOpen],
      ['Aurenstar Unfiltered', 'Create a fun description of your personality using your name, sign, birthday, time, and birthplace. The result brings those details together in a warm, playful profile made especially for you and ready to share.', 'describe-me', UserRound],
    ] as const },
    pt: { title: 'COMO A AURENSTAR PODE AJUDAR VOCÊ', subtitle: 'Cada espaço tem um propósito simples e uma forma prática de acompanhar o seu dia.', cards: [
      ['Aurenstar Daily', 'Comece o dia com uma mensagem feita para você a partir do seu signo. Ela relaciona o clima do dia com uma ideia prática. Por exemplo, pode sugerir que você respire antes de responder alguém, proteja sua energia ou escolha uma prioridade para se concentrar.', 'daily-message', CalendarDays],
      ['Aureneffect', 'Uma leitura para o momento que você está vivendo agora. Se estiver inquieto, cansado ou cheio de ideias, recebe uma reflexão acolhedora e uma sugestão possível de colocar em prática, como fazer uma pausa ou terminar uma tarefa pendente.', 'aureneffect', Sparkles],
      ['Aurenstar Zodiac Calculator', 'Descubra seu signo solar usando a data do seu nascimento e entenda a primeira ideia ligada a ele. Ao informar 2 de junho, por exemplo, você descobre Gêmeos e conhece sua curiosidade e facilidade de comunicação.', 'discover-sign', Compass],
      ['Aurenstar Dictionary', 'Um espaço para entender palavras da astrologia sem explicações complicadas. Ao procurar “ascendente”, você vê o significado em uma história fictícia simples, em vez de encontrar uma lista difícil de decorar.', 'dicionario', BookOpen],
      ['Aurenstar Unfiltered', 'Crie uma descrição divertida da sua personalidade usando nome, signo, data, horário e cidade de nascimento. O resultado reúne esses detalhes em um perfil acolhedor, feito especialmente para você e pronto para compartilhar.', 'describe-me', UserRound],
    ] as const },
    es: { title: 'CÓMO AURENSTAR PUEDE AYUDARTE', subtitle: 'Cada espacio tiene un propósito sencillo y una forma práctica de acompañar tu día.', cards: [
      ['Aurenstar Daily', 'Empieza el día con un mensaje pensado para ti según tu signo. Relaciona el tono del día con una idea práctica: puede invitarte a respirar antes de responder, cuidar tu energía o concentrarte en una prioridad.', 'daily-message', CalendarDays],
      ['Aureneffect', 'Una lectura para el momento que estás viviendo ahora. Si te sientes inquieto, cansado o lleno de ideas, recibes una reflexión cercana y una sugerencia posible, como hacer una pausa o terminar algo pendiente.', 'aureneffect', Sparkles],
      ['Aurenstar Zodiac Calculator', 'Descubre tu signo solar con tu fecha de nacimiento y conoce la primera idea relacionada con él. Al indicar el 2 de junio descubres Géminis y su curiosidad y facilidad para comunicarse.', 'discover-sign', Compass],
      ['Aurenstar Dictionary', 'Un lugar para entender palabras de astrología sin explicaciones complicadas. Puedes buscar “ascendente” y conocer su significado a través de una historia ficticia fácil de entender.', 'dicionario', BookOpen],
      ['Aurenstar Unfiltered', 'Crea una descripción divertida de tu personalidad con tu nombre, signo, fecha, hora y ciudad de nacimiento. El resultado reúne esos detalles en un perfil cercano, creado especialmente para ti y listo para compartir.', 'describe-me', UserRound],
    ] as const },
  }[lang];

  return (
    <section className="relative w-full overflow-hidden border-b border-[#D9E8F8] bg-[#C9E5FF] py-14 sm:py-20">
      <div className="pointer-events-none absolute left-1/2 top-16 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-[#FFFFFF]/35 blur-3xl" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollReveal distance={18} duration={700}>
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="font-extrabold text-sm sm:text-base tracking-[0.2em] uppercase text-[#172B4D]">{copy.title}</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#647DA5]">{copy.subtitle}</p>
            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-[#2878D0] via-[#17366F] to-[#F51B83]" />
          </div>
        </ScrollReveal>
        <div className="relative grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {copy.cards.map(([title, description, route, Icon], index) => (
            <ScrollReveal key={title} delay={index * 45} distance={14} duration={650}>
              <button type="button" onClick={() => onNavigate(route)} className="group relative block h-full w-full overflow-hidden rounded-3xl border border-white/90 bg-white p-6 text-left shadow-[0_10px_30px_rgba(23,54,111,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-[#2878D0]/50 hover:shadow-[0_18px_38px_rgba(23,54,111,0.16)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2878D0] sm:p-7">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#2878D0] via-[#7C5CC4] to-[#F51B83] opacity-70 transition-opacity group-hover:opacity-100" />
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#E4F1FF] to-[#F2E7FF] text-[#2878D0] shadow-inner transition-transform duration-300 group-hover:scale-105 group-hover:text-[#7C3FA0]"><Icon className="h-5 w-5" /></span>
                  <span className="text-[10px] font-extrabold tracking-[0.18em] text-[#A1B6D5]">0{index + 1}</span>
                </div>
                <h3 className="mt-4 text-[15px] font-extrabold leading-snug text-[#172B4D]">{title}</h3>
                <p className="mt-3 text-sm leading-[1.7] text-[#647DA5]">{description}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-[#2878D0] transition-colors group-hover:text-[#F51B83]">{lang === 'pt' ? 'Saiba mais' : lang === 'es' ? 'Saber más' : 'Learn more'} <span aria-hidden="true">→</span></span>
              </button>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

