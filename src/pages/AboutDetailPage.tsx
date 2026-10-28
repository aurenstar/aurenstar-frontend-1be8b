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
      platform: { icon: Sparkles, label: 'PLATFORM', title: 'What Aurenstar actually offers', intro: 'Aurenstar is a welcoming space that turns astrology into clear, useful reflections for real life. Each area has a different role, but they all invite you to pause and choose your next step with more intention.', points: ['Discover your sun sign with Aurenstar Zodiac Calculator using your birth date.', 'Receive an Aurenstar Daily message written around your sign and the tone of your day.', 'Explore Aureneffect for a reading focused on the moment you are living now.', 'Read practical articles and use Aurenstar Dictionary whenever a term needs a simpler explanation.'], tool: 'discover-sign' as ToolRoute, toolLabel: 'Aurenstar Zodiac Calculator' },
      method: { icon: Compass, label: 'HOW IT WORKS', title: 'A clear path from sign to insight', intro: 'Everything begins with information you can understand. Choose the experience that fits, read the explanation, and keep only what helps you in the situation you are living.', points: ['Start with Aurenstar Zodiac Calculator to identify your sun sign.', 'Use Aurenstar Daily for a short reflection about the tone of your day.', 'Open Aureneffect when you want to explore what you are feeling right now.', 'Use the dictionary and blog to add context before making your own meaning.'], tool: 'daily-message' as ToolRoute, toolLabel: 'Try Aurenstar Daily' },
      mission: { icon: Sun, label: 'OUR MISSION', title: 'Astrology with clarity and responsibility', intro: 'Aurenstar makes astrology welcoming without promising certainty. The goal is to offer a calm space for reflection while respecting your choices, your context, and the support you may need in real life.', points: ['Use plain language instead of unnecessary jargon.', 'Separate symbolic reflection from facts and important decisions.', 'Offer practical prompts that can support routines and self-knowledge.', 'Be transparent about what each tool can offer and what it cannot decide for you.'], tool: 'blog' as ToolRoute, toolLabel: 'Read the blog' },
      'daily-guidance': { icon: Moon, label: 'SIMPLE LANGUAGE', title: 'Astrology without the jargon', intro: 'Astrology can feel distant when it is filled with complicated words. Aurenstar translates the ideas into direct explanations, familiar examples, and questions that help you decide what resonates.', points: ['Start with the main idea before learning any new term.', 'Use the dictionary to understand words such as sign, moon, or ascendant.', 'Read examples as invitations to reflect, never as labels that define you.', 'Keep the explanation that helps and leave aside anything that does not fit your life.'], tool: 'dicionario' as ToolRoute, toolLabel: 'Open Aurenstar Dictionary' },
    },
  },
  pt: {
    back: 'Voltar para a Aurenstar', eyebrow: 'SOBRE A AURENSTAR', cta: 'Abrir esta ferramenta',
    cards: {
      platform: { icon: Sparkles, label: 'PLATAFORMA', title: 'O que a Aurenstar oferece de verdade', intro: 'A Aurenstar reúne ferramentas e conteúdos para transformar a astrologia em uma forma simples de observar o seu momento. Cada área tem uma finalidade própria, mas todas foram pensadas para ajudar você a compreender melhor o que está vivendo.', points: ['O Aurenstar Zodiac Calculator identifica seu signo solar a partir da data de nascimento e explica o ponto de partida da leitura.', 'O Aurenstar Daily apresenta uma orientação curta para o dia, conectando o seu signo a uma reflexão prática.', 'O Aureneffect olha para o momento da consulta e organiza uma mensagem sobre aquilo que pode estar mexendo com você agora.', 'O blog e o Aurenstar Dictionary ampliam o contexto, explicando ideias e termos com calma, sem transformar a leitura em uma regra para a sua vida.'], tool: 'discover-sign' as ToolRoute, toolLabel: 'Abrir Aurenstar Zodiac Calculator' },
      method: { icon: Compass, label: 'COMO FUNCIONA', title: 'Do signo à orientação, sem complicação', intro: 'Você não precisa conhecer astrologia antes de começar. Primeiro, escolha a experiência que combina com a sua dúvida; depois, leia a explicação e observe como ela conversa com a sua realidade. A ferramenta oferece um ponto de vista, enquanto a decisão continua sendo sua.', points: ['Se ainda não sabe o seu signo, use a calculadora com a data de nascimento para começar pelo básico.', 'Para uma visão do dia, abra o Aurenstar Daily e leia a mensagem com calma, procurando uma ideia que possa ser útil na sua rotina.', 'Quando quiser entender o que está sentindo no momento, use o Aureneffect como uma leitura de presença e reflexão.', 'Se aparecer uma palavra difícil, consulte o Aurenstar Dictionary ou um artigo do blog antes de tirar conclusões.'], tool: 'daily-message' as ToolRoute, toolLabel: 'Testar Aurenstar Daily' },
      mission: { icon: Sun, label: 'NOSSA MISSÃO', title: 'Astrologia com clareza e responsabilidade', intro: 'A missão da Aurenstar é aproximar a astrologia da vida real com acolhimento, honestidade e espaço para pensamento próprio. As leituras não prometem certezas nem substituem profissionais: elas ajudam você a olhar para uma situação por outro ângulo.', points: ['Explicar cada ideia com palavras simples, deixando claro o que ela significa e o que ela não significa.', 'Tratar os símbolos como possibilidades de reflexão, nunca como rótulos fixos ou ordens sobre o que você deve fazer.', 'Criar perguntas e sugestões pequenas que possam apoiar sua rotina, seu autoconhecimento e suas conversas.', 'Atualizar as ferramentas com transparência para que você saiba como cada experiência funciona antes de usá-la.'], tool: 'blog' as ToolRoute, toolLabel: 'Ler o blog' },
      'daily-guidance': { icon: Moon, label: 'LINGUAGEM SIMPLES', title: 'Astrologia sem complicação', intro: 'A astrologia fica mais fácil quando é explicada com palavras diretas, exemplos próximos e contexto. Nesta página, você aprende como ler uma ideia astrológica sem precisar decorar termos ou aceitar uma definição pronta.', points: ['Comece pela ideia principal: entenda o tema antes de se preocupar com o nome técnico.', 'Use o Aurenstar Dictionary para consultar palavras como signo, Lua, ascendente e outros conceitos no seu próprio ritmo.', 'Compare a explicação com a sua experiência, lembrando que uma leitura sugere possibilidades e não define quem você é.', 'Leve para a rotina apenas o que ajudar. Se algo não combinar com o seu momento, você pode simplesmente deixar de lado e continuar explorando.'], tool: 'dicionario' as ToolRoute, toolLabel: 'Abrir Aurenstar Dictionary' },
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
        <div className="rounded-3xl border border-[#D9E8F8] border-t-4 border-t-[#F51B83] bg-white p-6 shadow-[0_12px_35px_rgba(23,54,111,0.08)] sm:p-10">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF0F7] text-[#F51B83]"><Icon className="h-6 w-6" /></div>
          <p className="mb-3 text-xs font-extrabold tracking-[0.2em] text-[#F51B83]">{t.eyebrow} · {data.label}</p>
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

