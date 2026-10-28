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

interface DetailCard {
  icon: React.ElementType;
  label: string;
  title: string;
  intro: string;
  points: string[];
  sections?: { heading: string; body: string }[];
  example?: string;
  tool: ToolRoute;
  toolLabel: string;
}

type LanguageContent = {
  back: string;
  eyebrow: string;
  cta: string;
  cards: Record<string, DetailCard>;
};

const CONTENT: Record<'en' | 'pt' | 'es', LanguageContent> = {
  en: {
    back: 'Back to Aurenstar',
    eyebrow: 'ABOUT AURENSTAR',
    cta: 'Open this tool',
    cards: {
      platform: { icon: Sparkles, label: 'PLATFORM', title: 'What Aurenstar actually offers', intro: 'Aurenstar brings astrology into one calm, practical space. Each area has a clear purpose, so you can choose the kind of help you need without getting lost in complicated terms.', points: ['Discover your sun sign from your birth date with Aurenstar Zodiac Calculator.', 'Generate an Aurenstar Daily reading to begin the day with a focused reflection.', 'Explore Aureneffect for a reading connected to the moment you are experiencing now.', 'Use the blog and Aurenstar Dictionary to learn more at your own pace.'], sections: [{ heading: 'One place, different moments', body: 'Some days you want a short message to begin the morning. On other days you may want to understand a feeling, learn a new word, or simply discover your sign. Aurenstar gathers these possibilities in one organized space so you do not have to search for the right starting point.' }, { heading: 'What each tool is for', body: 'The Zodiac Calculator identifies your sun sign from your birth date. Aurenstar Daily offers a message for the day. Aureneffect looks at the feeling of the moment. The dictionary and blog give context, explanations, and calm reading when you want to learn more.' }, { heading: 'What you can expect', body: 'Every result is written as an invitation to reflect. It can help you notice a pattern, name a feeling, or choose a small intention, but it does not take away your freedom to decide what is best for your life.' }], example: 'Imagine that you are starting a busy morning. You can discover your sign first, read the daily message, and keep one sentence that helps you face the day with more focus.', tool: 'discover-sign' as ToolRoute, toolLabel: 'Aurenstar Zodiac Calculator' },
      method: { icon: Compass, label: 'HOW IT WORKS', title: 'A clear path from sign to insight', intro: 'The experience starts with information you can understand and ends with an idea you can apply. Nothing asks you to accept a fixed answer: the reading is a starting point for your own perspective.', points: ['Begin with your sign or birth date, depending on the tool you want to use.', 'Read the explanation before choosing which part speaks to your situation.', 'Use the daily reading as a moment to pause, notice, and set an intention.', 'Return to the dictionary or blog whenever you want more context.'], sections: [{ heading: 'Start with a simple question', body: 'You do not need to know astrology before using Aurenstar. Start by asking what you are looking for: a message for today, an explanation of your sign, or a way to understand the feeling you are carrying right now.' }, { heading: 'Read slowly and choose what fits', body: 'A reading is not a test and there is no answer you have to accept. Read the text calmly, notice the sentence that feels familiar, and leave aside anything that does not describe your experience.' }, { heading: 'Turn insight into a small action', body: 'The most useful part is often practical. A message can inspire you to pause before answering, finish one pending task, ask for help, or protect a little time for yourself.' }], example: 'If the reading talks about needing more calm, you might turn that idea into a ten-minute pause without your phone. The action is yours; astrology only helps you notice the possibility.', tool: 'daily-message' as ToolRoute, toolLabel: 'Try Aurenstar Daily' },
      mission: { icon: Sun, label: 'OUR MISSION', title: 'Astrology with clarity and responsibility', intro: 'Aurenstar exists to make astrology feel useful and welcoming without promising certainty. The goal is to support reflection, not to decide someone’s life for them.', points: ['Use plain language instead of unnecessary jargon or dramatic promises.', 'Separate symbolic reflection from facts and important personal decisions.', 'Offer gentle prompts that can be connected to real routines and feelings.', 'Be transparent about what each tool does and leave the final choice with you.'], sections: [{ heading: 'Why Aurenstar exists', body: 'Many people are curious about astrology but give up when the explanation feels distant or full of difficult words. Aurenstar was created to make the first step lighter, more human, and easier to understand.' }, { heading: 'Reflection, not a fixed destiny', body: 'Astrology can offer symbols and questions for self-knowledge. It cannot replace medical, financial, legal, or psychological guidance, and it should never be used to remove your responsibility for important choices.' }, { heading: 'Care in every experience', body: 'We prefer a calm message to an alarming prediction. We explain what each tool does, avoid promises that sound absolute, and leave room for different stories, cultures, and ways of seeing life.' }], example: 'When a text suggests a period of change, the useful question is not “what will definitely happen?”. It is “what would I like to prepare, learn, or care for while things change?”.', tool: 'blog' as ToolRoute, toolLabel: 'Read the blog' },
      'daily-guidance': { icon: Moon, label: 'SIMPLE LANGUAGE', title: 'Astrology without the jargon', intro: 'Astrology can feel distant when it is explained with too many unfamiliar words. Aurenstar translates each idea into clear language, keeping the meaning while making it easier to follow.', points: ['Start with the direct explanation before exploring deeper details.', 'Use the examples as invitations to reflect, never as labels that define you.', 'Look up an unfamiliar expression in Aurenstar Dictionary.', 'Choose the part that helps you and leave aside what does not fit your experience.'], sections: [{ heading: 'What simple language means', body: 'Speaking simply does not mean making the subject shallow. It means explaining one idea at a time, choosing familiar words, and showing how the idea can appear in everyday life.' }, { heading: 'How an explanation is built', body: 'We begin with the meaning, then show why it matters, and finally connect it with a situation that people may recognize. If a word is still unfamiliar, the Aurenstar Dictionary gives it its own clear page.' }, { heading: 'You are allowed to disagree', body: 'A text about your sign is not a label or a rule. Your experiences, choices, relationships, and history are always more complex than one symbol. Keep what helps you think and ignore what does not fit.' }], example: 'Instead of saying “this transit creates emotional instability”, a simple explanation might say: “Today you may feel more sensitive. Take a breath before reacting and give yourself time to understand what happened.”', tool: 'aureneffect' as ToolRoute, toolLabel: 'Explore Aureneffect' },
    },
  },
  pt: {
    back: 'Voltar para a Aurenstar', eyebrow: 'SOBRE A AURENSTAR', cta: 'Abrir esta ferramenta',
    cards: {
      platform: { icon: Sparkles, label: 'PLATAFORMA', title: 'O que a Aurenstar oferece de verdade', intro: 'A Aurenstar reúne a astrologia em um espaço calmo e prático. Cada área tem uma função clara para você escolher o tipo de orientação que combina com o que precisa.', points: ['Descubra seu signo solar pela data de nascimento com o Aurenstar Zodiac Calculator.', 'Gere uma leitura do Aurenstar Daily para começar o dia com uma reflexão objetiva.', 'Use o Aureneffect para olhar com mais atenção para o momento que você está vivendo.', 'Aprofunde o assunto no blog e consulte o Aurenstar Dictionary no seu ritmo.'], sections: [{ heading: 'Um lugar para momentos diferentes', body: 'Em alguns dias você quer uma mensagem curta para começar a manhã. Em outros, quer entender um sentimento, aprender uma palavra nova ou simplesmente descobrir seu signo. A Aurenstar reúne essas possibilidades em um só lugar, com uma entrada clara para cada necessidade.' }, { heading: 'Para que serve cada ferramenta', body: 'A calculadora mostra seu signo solar pela data de nascimento. O Aurenstar Daily traz uma mensagem para o dia. O Aureneffect ajuda a olhar para o momento que você está vivendo. O dicionário e o blog explicam os temas com calma, contexto e exemplos.' }, { heading: 'O que você pode esperar', body: 'Cada resultado é um convite à reflexão. Ele pode ajudar você a perceber um padrão, dar nome a um sentimento ou escolher uma pequena intenção, mas não tira sua liberdade de decidir o que é melhor para a sua vida.' }], example: 'Imagine uma manhã corrida: você descobre seu signo, lê a mensagem do dia e escolhe uma frase para levar consigo. A experiência termina em uma ideia simples que pode caber na sua rotina.', tool: 'discover-sign' as ToolRoute, toolLabel: 'Aurenstar Zodiac Calculator' },
      method: { icon: Compass, label: 'COMO FUNCIONA', title: 'Do signo à orientação, sem complicação', intro: 'A experiência começa com uma informação que você entende e termina com uma ideia que pode aplicar. A leitura não impõe uma resposta: ela abre espaço para você perceber o que faz sentido.', points: ['Comece pelo seu signo ou pela data de nascimento, conforme a ferramenta escolhida.', 'Leia a explicação antes de decidir qual parte conversa com a sua situação.', 'Use a leitura diária para pausar, observar e escolher uma pequena intenção.', 'Volte ao dicionário ou ao blog quando quiser mais contexto.'], sections: [{ heading: 'Comece por uma pergunta simples', body: 'Você não precisa conhecer astrologia para usar a Aurenstar. Pense no que procura: uma mensagem para hoje, uma explicação sobre seu signo ou um jeito de entender melhor o sentimento que está carregando.' }, { heading: 'Leia devagar e escolha o que combina', body: 'A leitura não é uma prova e você não precisa aceitar tudo. Leia com calma, perceba a frase que parece familiar e deixe de lado qualquer parte que não descreva sua experiência.' }, { heading: 'Transforme a ideia em uma ação pequena', body: 'A parte mais útil costuma ser prática. Uma mensagem pode inspirar você a respirar antes de responder, terminar uma tarefa, pedir ajuda ou proteger alguns minutos para si.' }], example: 'Se a leitura fala sobre buscar mais calma, você pode transformar isso em dez minutos sem o celular. A ação é sua; a astrologia apenas ajuda a enxergar uma possibilidade.', tool: 'daily-message' as ToolRoute, toolLabel: 'Testar Aurenstar Daily' },
      mission: { icon: Sun, label: 'NOSSA MISSÃO', title: 'Astrologia com clareza e responsabilidade', intro: 'A Aurenstar quer tornar a astrologia acolhedora sem prometer certezas. O objetivo é apoiar a reflexão, não decidir a vida de ninguém.', points: ['Usar linguagem simples em vez de jargões ou promessas exageradas.', 'Separar reflexão simbólica de fatos e decisões pessoais importantes.', 'Oferecer sugestões gentis que possam se conectar com a rotina e os sentimentos.', 'Explicar com honestidade o que cada ferramenta faz e deixar a escolha com você.'], sections: [{ heading: 'Por que a Aurenstar existe', body: 'Muita gente tem curiosidade sobre astrologia, mas desiste quando a explicação parece distante ou cheia de palavras difíceis. A Aurenstar foi criada para tornar esse primeiro passo mais leve, humano e fácil de acompanhar.' }, { heading: 'Reflexão, não destino fixo', body: 'A astrologia pode oferecer símbolos e perguntas para o autoconhecimento. Ela não substitui orientação médica, financeira, jurídica ou psicológica e nunca deve retirar de você a responsabilidade por escolhas importantes.' }, { heading: 'Cuidado em cada experiência', body: 'Preferimos uma mensagem calma a uma previsão assustadora. Explicamos o que cada ferramenta faz, evitamos promessas absolutas e respeitamos histórias, culturas e formas diferentes de enxergar a vida.' }], example: 'Quando um texto fala sobre uma fase de mudanças, a pergunta útil não é “o que vai acontecer com certeza?”. É “como eu gostaria de me preparar, aprender ou me cuidar enquanto as coisas mudam?”.', tool: 'blog' as ToolRoute, toolLabel: 'Ler o blog' },
      'daily-guidance': { icon: Moon, label: 'LINGUAGEM SIMPLES', title: 'Astrologia sem complicação', intro: 'A astrologia pode parecer distante quando usa palavras desconhecidas. A Aurenstar traduz cada ideia para uma linguagem clara, preservando o significado e facilitando a compreensão.', points: ['Comece pela explicação direta antes de explorar detalhes mais profundos.', 'Veja os exemplos como convites à reflexão, nunca como rótulos sobre você.', 'Consulte o Aurenstar Dictionary quando encontrar uma expressão nova.', 'Fique com o que ajudar e deixe de lado o que não combinar com sua experiência.'], sections: [{ heading: 'O que significa falar de forma simples', body: 'Falar de forma simples não é deixar o assunto superficial. É explicar uma ideia por vez, escolher palavras conhecidas e mostrar como ela pode aparecer na vida cotidiana.' }, { heading: 'Como uma explicação é construída', body: 'Começamos pelo significado, mostramos por que ele importa e depois ligamos o tema a uma situação que as pessoas reconhecem. Quando uma palavra continua desconhecida, o Aurenstar Dictionary oferece uma página própria para ela.' }, { heading: 'Você pode discordar', body: 'Um texto sobre seu signo não é um rótulo nem uma regra. Suas experiências, escolhas, relações e história são mais complexas do que qualquer símbolo. Guarde o que ajudar e ignore o que não fizer sentido.' }], example: 'Em vez de dizer “este trânsito causa instabilidade emocional”, uma explicação simples diria: “Hoje você pode ficar mais sensível. Respire antes de reagir e dê tempo para entender o que aconteceu.”', tool: 'aureneffect' as ToolRoute, toolLabel: 'Explorar Aureneffect' },
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
      <div className="mx-auto max-w-4xl">
        <button type="button" onClick={onBackToHome} className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-[#2878D0] hover:text-[#17366F]">
          <ArrowLeft className="h-4 w-4" /> {t.back}
        </button>
        <div className="rounded-3xl border border-[#D9E8F8] bg-white p-6 shadow-[0_12px_35px_rgba(23,54,111,0.08)] sm:p-10 lg:p-14">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E4F1FF] text-[#2878D0]"><Icon className="h-6 w-6" /></div>
          <p className="mb-3 text-xs font-extrabold tracking-[0.2em] text-[#2878D0]">{t.eyebrow} · {data.label}</p>
          <h1 className="text-3xl font-extrabold leading-tight text-[#172B4D] sm:text-4xl">{data.title}</h1>
          <p className="mt-5 text-base leading-relaxed text-[#647DA5] sm:text-lg">{data.intro}</p>
          <ul className="mt-7 space-y-4 border-t border-[#D9E8F8] pt-7">
            {data.points.map((point) => <li key={point} className="flex gap-3 text-sm leading-relaxed text-[#172B4D] sm:text-base"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#F51B83]" />{point}</li>)}
          </ul>
          {data.sections && (
            <div className="mt-10 space-y-8 border-t border-[#D9E8F8] pt-9">
              {data.sections.map((item, index) => (
                <article key={item.heading} className="rounded-2xl border border-[#D9E8F8] bg-[#F7FBFF] p-5 sm:p-7">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FCE5F1] text-sm font-extrabold text-[#F51B83]">{index + 1}</span>
                    <h2 className="text-lg font-extrabold text-[#17366F] sm:text-xl">{item.heading}</h2>
                  </div>
                  <p className="text-sm leading-7 text-[#5E78A4] sm:text-base">{item.body}</p>
                </article>
              ))}
            </div>
          )}
          {data.example && (
            <div className="mt-8 rounded-2xl border border-[#F7B5D2] bg-[#FFF5FA] p-5 sm:p-7">
              <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#F51B83]">Exemplo simples</p>
              <p className="text-sm leading-7 text-[#17366F] sm:text-base">{data.example}</p>
            </div>
          )}
          <button type="button" onClick={() => onNavigateToTool(data.tool)} className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#2878D0] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#17366F]">
            {data.toolLabel} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

