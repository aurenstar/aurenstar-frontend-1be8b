import React from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Compass, Moon, Sparkles, Sun } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

type ToolRoute = 'blog' | 'daily-message' | 'aureneffect' | 'discover-sign' | 'dicionario';

interface AboutDetailPageProps {
  section: string;
  onBackToHome: () => void;
  onNavigateToBlog: () => void;
  onNavigateToTool: (tool: ToolRoute) => void;
}

const CONTENT = {
  en: {
    back: 'Back to Aurenstar',
    eyebrow: 'ABOUT AURENSTAR',
    cta: 'Open this tool',
    cards: {
      platform: { icon: Sparkles, label: 'PLATFORM', title: 'What Aurenstar actually offers', intro: 'Aurenstar is a focused astrology front end for simple, useful daily guidance. The current experience brings the main tools together in one place:', points: ['Discover your sun sign from your birth date with Aurenstar Zodiac Calculator.', 'Generate an Aurenstar Daily reading written around your sign.', 'Explore Aureneffect for a more reflective reading.', 'Read practical astrology articles and look up terms in Aurenstar Dictionary.'], tool: 'discover-sign' as ToolRoute, toolLabel: 'Aurenstar Zodiac Calculator' },
      method: { icon: Compass, label: 'HOW IT WORKS', title: 'A clear path from sign to insight', intro: 'The site starts with information you can understand and use. Choose a sign, read the context, and decide what is relevant to your day.', points: ['Start with Aurenstar Zodiac Calculator using your birth date.', 'Use Aurenstar Daily as a short reflection, not a fixed prediction.', 'Compare a concept with Aurenstar Dictionary when a term is unfamiliar.', 'Use the blog to go deeper into a topic with examples and context.'], tool: 'daily-message' as ToolRoute, toolLabel: 'Try Aurenstar Daily' },
      mission: { icon: Sun, label: 'OUR MISSION', title: 'Astrology with clarity and responsibility', intro: 'Aurenstar is designed to make astrology welcoming without pretending it can replace professional advice or determine your choices.', points: ['Use plain language instead of unnecessary jargon.', 'Separate symbolic reflection from facts and important decisions.', 'Give readers practical prompts they can apply to routines and self-reflection.', 'Keep the experience calm, accessible, and honest about what each tool does.'], tool: 'blog' as ToolRoute, toolLabel: 'Read the blog' },
      'daily-guidance': { icon: Moon, label: 'DAILY GUIDANCE', title: 'How to use the daily tools', intro: 'The tools are short starting points for attention and reflection. They work best when you bring your own context to the reading.', points: ['Read the message once at the start of your day.', 'Choose one sentence that matches a real situation you are facing.', 'Turn it into a small, concrete intention for the day.', 'Return to the blog or dictionary when you want more background.'], tool: 'aureneffect' as ToolRoute, toolLabel: 'Explore Auren Effect' },
    },
  },
  pt: {
    back: 'Voltar para a Aurenstar', eyebrow: 'SOBRE A AURENSTAR', cta: 'Abrir esta ferramenta',
    cards: {
      platform: { icon: Sparkles, label: 'PLATAFORMA', title: 'O que a Aurenstar oferece de verdade', intro: 'A Aurenstar é uma experiência de astrologia focada em orientações diárias simples e úteis. Hoje, o site reúne:', points: ['Aurenstar Zodiac Calculator para descobrir o signo solar pela data de nascimento.', 'Aurenstar Daily com uma mensagem escrita para o seu signo.', 'Aureneffect para uma leitura mais reflexiva do momento.', 'Artigos práticos e Aurenstar Dictionary para consultar termos astrológicos.'], tool: 'discover-sign' as ToolRoute, toolLabel: 'Aurenstar Zodiac Calculator' },
      method: { icon: Compass, label: 'COMO FUNCIONA', title: 'Do signo à orientação, sem complicação', intro: 'O site começa com informações que você consegue entender e usar. Escolha um signo, leia o contexto e veja o que faz sentido para o seu dia.', points: ['Comece pelo Aurenstar Zodiac Calculator usando sua data de nascimento.', 'Use o Aurenstar Daily como reflexão, não como previsão definitiva.', 'Consulte o Aurenstar Dictionary quando encontrar um termo desconhecido.', 'Leia o blog para aprofundar um tema com exemplos e contexto.'], tool: 'daily-message' as ToolRoute, toolLabel: 'Testar Aurenstar Daily' },
      mission: { icon: Sun, label: 'NOSSA MISSÃO', title: 'Astrologia com clareza e responsabilidade', intro: 'A Aurenstar quer tornar a astrologia acolhedora sem afirmar que ela substitui orientação profissional ou decide o caminho de alguém.', points: ['Usar linguagem simples em vez de jargões desnecessários.', 'Separar reflexão simbólica de fatos e decisões importantes.', 'Oferecer perguntas práticas para a rotina e o autoconhecimento.', 'Ser honesta sobre o que cada ferramenta faz hoje.'], tool: 'blog' as ToolRoute, toolLabel: 'Ler o blog' },
      'daily-guidance': { icon: Moon, label: 'ORIENTAÇÃO DIÁRIA', title: 'Como aproveitar as ferramentas', intro: 'As ferramentas são pontos de partida curtos para atenção e reflexão. Elas funcionam melhor quando você acrescenta seu próprio contexto à leitura.', points: ['Leia a mensagem no começo do dia.', 'Escolha uma frase que converse com uma situação real.', 'Transforme a ideia em uma intenção pequena e concreta.', 'Volte ao blog ou ao dicionário quando quiser contexto.'], tool: 'aureneffect' as ToolRoute, toolLabel: 'Explorar o Auren Effect' },
    },
  },
  es: {
    back: 'Volver a Aurenstar', eyebrow: 'SOBRE AURENSTAR', cta: 'Abrir esta herramienta',
    cards: {
      platform: { icon: Sparkles, label: 'PLATAFORMA', title: 'Lo que Aurenstar ofrece hoy', intro: 'Aurenstar reúne herramientas de astrología simples y útiles para la orientación diaria:', points: ['Descubrir tu signo solar por tu fecha de nacimiento.', 'Recibir un mensaje diario para tu signo.', 'Explorar Auren Effect para una lectura reflexiva.', 'Leer artículos y consultar el diccionario astrológico.'], tool: 'discover-sign' as ToolRoute, toolLabel: 'Descubrir mi signo' },
      method: { icon: Compass, label: 'CÓMO FUNCIONA', title: 'Del signo a una idea clara', intro: 'Elige un signo, lee el contexto y decide qué puede ayudarte hoy.', points: ['Empieza con tu fecha de nacimiento o con tu signo.', 'Usa la lectura como reflexión, no como predicción fija.', 'Consulta el diccionario cuando no conozcas un término.', 'Lee el blog para profundizar con ejemplos.'], tool: 'daily-message' as ToolRoute, toolLabel: 'Probar mensaje diario' },
      mission: { icon: Sun, label: 'NUESTRA MISIÓN', title: 'Astrología clara y responsable', intro: 'Queremos acercar la astrología sin decir que reemplaza consejos profesionales ni que decide tus elecciones.', points: ['Usar lenguaje sencillo.', 'Separar reflexión simbólica de hechos importantes.', 'Proponer ideas prácticas para tu rutina.', 'Explicar con honestidad lo que hace cada herramienta.'], tool: 'blog' as ToolRoute, toolLabel: 'Leer el blog' },
      'daily-guidance': { icon: Moon, label: 'GUÍA DIARIA', title: 'Cómo usar las herramientas', intro: 'Son puntos de partida breves para reflexionar y prestar atención a tu día.', points: ['Lee el mensaje al comenzar el día.', 'Elige una frase que conecte con una situación real.', 'Conviértela en una intención concreta.', 'Vuelve al blog o al diccionario para obtener contexto.'], tool: 'aureneffect' as ToolRoute, toolLabel: 'Explorar Auren Effect' },
    },
  },
};

export const AboutDetailPage: React.FC<AboutDetailPageProps> = ({ section, onBackToHome, onNavigateToTool }) => {
  const { language } = useLanguage();
  const t = CONTENT[(language || 'en') as keyof typeof CONTENT] || CONTENT.en;
  const data = t.cards[section as keyof typeof t.cards] || t.cards.platform;
  const Icon = data.icon;

  return (
    <section className="min-h-[75vh] bg-[#C9E5FF] px-4 py-28 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <button type="button" onClick={onBackToHome} className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-[#2878D0] hover:text-[#17366F]">
          <ArrowLeft className="h-4 w-4" /> {t.back}
        </button>
        <div className="rounded-3xl border border-[#D9E8F8] bg-white p-6 shadow-[0_12px_35px_rgba(23,54,111,0.08)] sm:p-10">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E4F1FF] text-[#2878D0]"><Icon className="h-6 w-6" /></div>
          <p className="mb-3 text-xs font-extrabold tracking-[0.2em] text-[#2878D0]">{t.eyebrow} · {data.label}</p>
          <h1 className="text-3xl font-extrabold leading-tight text-[#172B4D] sm:text-4xl">{data.title}</h1>
          <p className="mt-5 text-base leading-relaxed text-[#647DA5] sm:text-lg">{data.intro}</p>
          <ul className="mt-7 space-y-4 border-t border-[#D9E8F8] pt-7">
            {data.points.map((point) => <li key={point} className="flex gap-3 text-sm leading-relaxed text-[#172B4D] sm:text-base"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#F51B83]" />{point}</li>)}
          </ul>
          <button type="button" onClick={() => onNavigateToTool(data.tool)} className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#2878D0] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#17366F]">
            {data.toolLabel} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

