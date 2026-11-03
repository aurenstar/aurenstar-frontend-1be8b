import React from 'react';
import { ArrowLeft, ArrowRight, Check, Calendar, Sparkles, Compass, Smile, Moon, BookOpen, ShieldCheck, Mail, MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { BLOG_ARTICLES } from '../data/blogArticles';
import { ASTROLOGY_DICTIONARY_TERMS } from '../data/astrologyDictionaryData';

type Lang = 'pt' | 'en' | 'es';
type Target = 'daily-message' | 'aureneffect' | 'discover-sign' | 'describe-me' | 'dicionario' | 'credits' | 'contact' | 'newsletter' | 'blog' | 'home';

interface AboutProfilePageProps {
  onNavigate: (page: Target) => void;
  onOpenArticle: (articleId: string) => void;
}

const AVATAR = '/aurenstar-avatar.png';

const COPY: Record<Lang, {
  back: string; handle: string; bio: string; verified: string;
  stats: [string, string, string, string];
  aboutTitle: string; about: string[];
  toolsTitle: string; toolsLead: string; open: string;
  tools: { key: Target; name: string; text: string }[];
  howTitle: string; howLead: string; steps: { title: string; text: string }[]; creditsLink: string;
  valuesTitle: string; values: { title: string; text: string }[];
  noteTitle: string; note: string;
  postsTitle: string; postsLead: string; seeBlog: string;
  contactTitle: string; contactText: string; contactBtn: string; newsletterBtn: string;
}> = {
  pt: {
    back: 'Voltar ao Início',
    handle: '@aurenstar · aurenstar.com',
    bio: 'Astrologia clara, acolhedora e útil. Para você se conhecer melhor, sem complicação. ✨',
    verified: 'Perfil verificado',
    stats: ['ferramentas', 'signos', 'termos no dicionário', 'idiomas'],
    aboutTitle: 'Sobre a Aurenstar',
    about: [
      'A Aurenstar transforma a astrologia em reflexões simples para a vida real. Em vez de previsões assustadoras ou palavras difíceis, você recebe textos curtos, diretos e carinhosos, escritos para o seu momento.',
      'Aqui você descobre seu signo, lê uma mensagem para o seu dia, entende como está se sentindo agora e cria um retrato divertido de quem você é, para mostrar aos amigos. Tudo grátis e em português, inglês e espanhol.',
    ],
    toolsTitle: 'O que a Aurenstar faz',
    toolsLead: 'Cinco ferramentas, cada uma para um momento diferente.',
    open: 'Abrir',
    tools: [
      { key: 'daily-message', name: 'Aurendaily', text: 'Uma mensagem para o seu dia, com base no seu mapa. Uma por pessoa, por dia.' },
      { key: 'aureneffect', name: 'Aureneffect', text: 'Entenda como você está se sentindo agora e receba dicas simples que funcionam.' },
      { key: 'discover-sign', name: 'Calculadora de Signo', text: 'Coloque sua data de nascimento e descubra seu signo e seu jeito de ser.' },
      { key: 'describe-me', name: 'Aurenstar Sem Filtro', text: 'Um retrato divertido de você, feito para compartilhar nos Stories.' },
      { key: 'dicionario', name: 'Dicionário Aurenstar', text: 'Os termos da astrologia explicados sem palavras difíceis, com exemplos do dia a dia.' },
    ],
    howTitle: 'Como funciona',
    howLead: 'Por trás de cada texto tem um cálculo de verdade, não um palpite.',
    steps: [
      { title: 'Você informa o básico', text: 'Nome, data, hora e cidade de nascimento. Só o necessário para montar o seu céu.' },
      { title: 'Calculamos o seu céu', text: 'Usamos a Swiss Ephemeris, a mesma base científica usada por astrólogos no mundo todo, com o fuso horário real da sua cidade e do seu ano de nascimento.' },
      { title: 'A IA escreve em palavras simples', text: 'Com as posições do céu em mãos, a IA escreve um texto curto, pessoal e sem jargões. O site lembra o que você já recebeu para não repetir.' },
      { title: 'Você compartilha o que sentiu', text: 'Cada resultado vira um card pronto para postar nos Stories e no feed.' },
    ],
    creditsLink: 'Ver as ferramentas e os créditos',
    valuesTitle: 'Nosso jeito de fazer',
    values: [
      { title: 'Linguagem simples', text: 'Sem jargões. Se uma criança de 12 anos não entende, a gente reescreve.' },
      { title: 'Reflexão, não destino', text: 'A astrologia aqui é um espelho para pensar, nunca uma ordem sobre o que você deve fazer.' },
      { title: 'Cuidado com você', text: 'Preferimos uma mensagem calma a uma previsão assustadora.' },
    ],
    noteTitle: 'Um aviso honesto',
    note: 'A astrologia é uma forma de reflexão e entretenimento. Nossos textos não substituem orientação médica, psicológica, jurídica ou financeira.',
    postsTitle: 'Do blog',
    postsLead: 'Leituras para quem gosta de entender o signo com calma.',
    seeBlog: 'Ver todos os posts',
    contactTitle: 'Vamos conversar?',
    contactText: 'Parcerias, ideias ou dúvidas: respondemos em até 24 horas úteis.',
    contactBtn: 'Falar com a Aurenstar',
    newsletterBtn: 'Receber posts do meu signo',
  },
  en: {
    back: 'Back to Home',
    handle: '@aurenstar · aurenstar.com',
    bio: 'Astrology made clear, gentle and useful. To help you know yourself better, without the complicated words. ✨',
    verified: 'Verified profile',
    stats: ['tools', 'signs', 'dictionary terms', 'languages'],
    aboutTitle: 'About Aurenstar',
    about: [
      'Aurenstar turns astrology into simple reflections for real life. Instead of scary predictions or hard words, you get short, direct and kind texts written for your moment.',
      'Here you can find your sign, read a message for your day, understand how you feel right now and create a fun portrait of who you are to show your friends. All free, in English, Portuguese and Spanish.',
    ],
    toolsTitle: 'What Aurenstar does',
    toolsLead: 'Five tools, each one for a different moment.',
    open: 'Open',
    tools: [
      { key: 'daily-message', name: 'Aurendaily', text: 'A message for your day, based on your chart. One per person, per day.' },
      { key: 'aureneffect', name: 'Aureneffect', text: 'Understand how you feel right now and get simple tips that really work.' },
      { key: 'discover-sign', name: 'Sign Calculator', text: 'Enter your birth date and discover your sign and your way of being.' },
      { key: 'describe-me', name: 'Aurenstar Unfiltered', text: 'A fun portrait of you, made to be shared on your Stories.' },
      { key: 'dicionario', name: 'Aurenstar Dictionary', text: 'Astrology terms explained without difficult words, with everyday examples.' },
    ],
    howTitle: 'How it works',
    howLead: 'Behind every text there is a real calculation, not a guess.',
    steps: [
      { title: 'You share the basics', text: 'Name, date, time and city of birth. Only what is needed to build your sky.' },
      { title: 'We calculate your sky', text: 'We use the Swiss Ephemeris, the same scientific base astrologers use worldwide, with the real time zone of your city and birth year.' },
      { title: 'AI writes in simple words', text: 'With the positions of the sky in hand, AI writes a short, personal text without jargon. The site remembers what you already received so it never repeats.' },
      { title: 'You share how you feel', text: 'Every result becomes a card ready to post on Stories and your feed.' },
    ],
    creditsLink: 'See the tools and credits',
    valuesTitle: 'Our way of doing things',
    values: [
      { title: 'Simple language', text: 'No jargon. If a 12-year-old cannot understand it, we rewrite it.' },
      { title: 'Reflection, not destiny', text: 'Astrology here is a mirror to think with, never an order about what you must do.' },
      { title: 'Care for you', text: 'We prefer a calm message over a scary prediction.' },
    ],
    noteTitle: 'An honest note',
    note: 'Astrology is a form of reflection and entertainment. Our texts do not replace medical, psychological, legal or financial advice.',
    postsTitle: 'From the blog',
    postsLead: 'Reads for people who like to understand their sign calmly.',
    seeBlog: 'See all posts',
    contactTitle: 'Shall we talk?',
    contactText: 'Partnerships, ideas or questions: we reply within 24 business hours.',
    contactBtn: 'Talk to Aurenstar',
    newsletterBtn: 'Get posts for my sign',
  },
  es: {
    back: 'Volver al Inicio',
    handle: '@aurenstar · aurenstar.com',
    bio: 'Astrología clara, cercana y útil. Para que te conozcas mejor, sin complicaciones. ✨',
    verified: 'Perfil verificado',
    stats: ['herramientas', 'signos', 'términos en el diccionario', 'idiomas'],
    aboutTitle: 'Sobre Aurenstar',
    about: [
      'Aurenstar convierte la astrología en reflexiones sencillas para la vida real. En lugar de predicciones que asustan o palabras difíciles, recibes textos cortos, directos y cariñosos, escritos para tu momento.',
      'Aquí descubres tu signo, lees un mensaje para tu día, entiendes cómo te sientes ahora y creas un retrato divertido de quién eres para mostrárselo a tus amigos. Todo gratis, en español, inglés y portugués.',
    ],
    toolsTitle: 'Qué hace Aurenstar',
    toolsLead: 'Cinco herramientas, cada una para un momento distinto.',
    open: 'Abrir',
    tools: [
      { key: 'daily-message', name: 'Aurendaily', text: 'Un mensaje para tu día, basado en tu carta. Uno por persona, por día.' },
      { key: 'aureneffect', name: 'Aureneffect', text: 'Entiende cómo te sientes ahora y recibe consejos sencillos que funcionan.' },
      { key: 'discover-sign', name: 'Calculadora de Signo', text: 'Escribe tu fecha de nacimiento y descubre tu signo y tu forma de ser.' },
      { key: 'describe-me', name: 'Aurenstar Sin Filtro', text: 'Un retrato divertido de ti, hecho para compartir en tus Stories.' },
      { key: 'dicionario', name: 'Diccionario Aurenstar', text: 'Los términos de la astrología explicados sin palabras difíciles, con ejemplos del día a día.' },
    ],
    howTitle: 'Cómo funciona',
    howLead: 'Detrás de cada texto hay un cálculo real, no una suposición.',
    steps: [
      { title: 'Compartes lo básico', text: 'Nombre, fecha, hora y ciudad de nacimiento. Solo lo necesario para armar tu cielo.' },
      { title: 'Calculamos tu cielo', text: 'Usamos la Swiss Ephemeris, la misma base científica que usan los astrólogos de todo el mundo, con la zona horaria real de tu ciudad y de tu año de nacimiento.' },
      { title: 'La IA escribe en palabras simples', text: 'Con las posiciones del cielo, la IA escribe un texto corto, personal y sin tecnicismos. El sitio recuerda lo que ya recibiste para no repetirse.' },
      { title: 'Compartes lo que sientes', text: 'Cada resultado se convierte en una tarjeta lista para publicar en Stories y en tu feed.' },
    ],
    creditsLink: 'Ver las herramientas y los créditos',
    valuesTitle: 'Nuestra forma de hacer las cosas',
    values: [
      { title: 'Lenguaje simple', text: 'Sin jerga. Si un niño de 12 años no lo entiende, lo reescribimos.' },
      { title: 'Reflexión, no destino', text: 'La astrología aquí es un espejo para pensar, nunca una orden sobre lo que debes hacer.' },
      { title: 'Cuidado contigo', text: 'Preferimos un mensaje tranquilo a una predicción que asusta.' },
    ],
    noteTitle: 'Un aviso honesto',
    note: 'La astrología es una forma de reflexión y entretenimiento. Nuestros textos no sustituyen el consejo médico, psicológico, legal o financiero.',
    postsTitle: 'Del blog',
    postsLead: 'Lecturas para quienes disfrutan entender su signo con calma.',
    seeBlog: 'Ver todos los posts',
    contactTitle: '¿Hablamos?',
    contactText: 'Alianzas, ideas o dudas: respondemos en hasta 24 horas hábiles.',
    contactBtn: 'Hablar con Aurenstar',
    newsletterBtn: 'Recibir posts de mi signo',
  },
};

const TOOL_ICONS: Record<string, React.ElementType> = {
  'daily-message': Calendar,
  aureneffect: Sparkles,
  'discover-sign': Compass,
  'describe-me': Smile,
  dicionario: BookOpen,
};

const TOOL_COLORS: Record<string, [string, string]> = {
  'daily-message': ['#2878D0', '#6D9BE6'],
  aureneffect: ['#F51B83', '#FF7AB8'],
  'discover-sign': ['#7C4DFF', '#B39DFF'],
  'describe-me': ['#FF8A3D', '#FFC371'],
  dicionario: ['#12A594', '#5FD3C3'],
};

export const AboutProfilePage: React.FC<AboutProfilePageProps> = ({ onNavigate, onOpenArticle }) => {
  const { language } = useLanguage();
  const lang = (language || 'en') as Lang;
  const c = COPY[lang];
  const posts = BLOG_ARTICLES.slice(0, 3);
  const statValues = [String(c.tools.length), '12', String(ASTROLOGY_DICTIONARY_TERMS.length), '3'];

  return (
    <section className="min-h-[78vh] bg-[#C9E5FF] px-4 pb-20 pt-24 sm:px-6 sm:pt-28">
      <div className="mx-auto max-w-3xl">
        <button type="button" onClick={() => onNavigate('home')} className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#2878D0] hover:text-[#17366F]">
          <ArrowLeft className="h-4 w-4" /> {c.back}
        </button>

        {/* Profile header */}
        <div className="overflow-hidden rounded-[2rem] border border-[#D9E8F8] bg-white shadow-[0_14px_40px_rgba(23,54,111,0.1)]">
          <div className="h-32 sm:h-44" style={{ background: 'linear-gradient(120deg, #2878D0 0%, #6D9BE6 45%, #F58CC0 100%)' }} aria-hidden />
          <div className="px-5 pb-7 sm:px-9">
            <div className="-mt-12 flex items-end justify-between sm:-mt-14">
              <img src={AVATAR} alt="Aurenstar" className="h-24 w-24 rounded-full border-4 border-white bg-white object-cover shadow-md sm:h-28 sm:w-28" />
              <button type="button" onClick={() => onNavigate('newsletter')} className="mb-1 rounded-full bg-[#F51B83] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#D9166F] sm:text-sm">
                {c.newsletterBtn}
              </button>
            </div>
            <div className="mt-3 flex items-center gap-2 text-2xl font-extrabold text-[#172B4D] sm:text-3xl">
              <span translate="no" className="notranslate">Aurenstar</span>
              <span aria-label={c.verified} title={c.verified} className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#2878D0] text-white"><Check className="h-3.5 w-3.5" strokeWidth={3} /></span>
            </div>
            <p className="text-sm text-[#647DA5]">{c.handle}</p>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#17366F] sm:text-lg">{c.bio}</p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {statValues.map((value, i) => (
                <div key={c.stats[i]} className="rounded-2xl border border-[#D9E8F8] bg-[#F4F9FF] px-3 py-3 text-center">
                  <div className="text-2xl font-extrabold text-[#2878D0]">{value}</div>
                  <div className="text-[11px] font-semibold leading-tight text-[#647DA5]">{c.stats[i]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* About */}
        <Card title={c.aboutTitle}>
          {c.about.map((p) => <p key={p} className="text-base leading-relaxed text-[#17366F]">{p}</p>)}
        </Card>

        {/* Tools */}
        <style>{`
          @keyframes aboutRise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes aboutFloat { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-4px) rotate(-4deg); } }
          @media (prefers-reduced-motion: reduce) { .about-tool, .about-ico { animation: none !important; } }
        `}</style>
        <Card title={c.toolsTitle} lead={c.toolsLead}>
          <div className="grid gap-3 sm:grid-cols-2">
            {c.tools.map((tool, i) => {
              const Icon = TOOL_ICONS[tool.key] || Sparkles;
              const [from, to] = TOOL_COLORS[tool.key] || ['#2878D0', '#6D9BE6'];
              const last = i === c.tools.length - 1 && c.tools.length % 2 === 1;
              return (
                <button
                  key={tool.key}
                  type="button"
                  onClick={() => onNavigate(tool.key)}
                  style={{ animation: `aboutRise 0.5s ease-out ${i * 90}ms both`, ['--c1' as string]: from, ['--c2' as string]: to }}
                  className={`about-tool group relative flex w-full flex-col overflow-hidden rounded-3xl border border-[#D9E8F8] bg-white p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-transparent hover:shadow-[0_18px_40px_rgba(23,54,111,0.18)] focus:outline-none focus:ring-2 focus:ring-[#2878D0]/40 ${last ? 'sm:col-span-2' : ''}`}
                >
                  <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-1.5" style={{ background: `linear-gradient(90deg, ${from}, ${to})` }} />
                  <span aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-30" style={{ background: `linear-gradient(135deg, ${from}, ${to})` }} />
                  <span className="relative flex items-start justify-between gap-3">
                    <span className="about-ico flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" style={{ background: `linear-gradient(135deg, ${from}, ${to})`, animation: `aboutFloat 4s ease-in-out ${i * 400}ms infinite` }}>
                      <Icon className="h-7 w-7" />
                    </span>
                    <span className="rounded-full bg-[#F4F9FF] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#2878D0]">{String(i + 1).padStart(2, '0')}</span>
                  </span>
                  <span className="relative mt-4 block text-lg font-extrabold text-[#172B4D]">{tool.name}</span>
                  <span className="relative mt-1 block flex-1 text-sm leading-relaxed text-[#647DA5]">{tool.text}</span>
                  <span className="relative mt-4 inline-flex items-center gap-1.5 self-start rounded-full px-4 py-2 text-xs font-bold text-white shadow-sm transition-all duration-300 group-hover:gap-3 group-hover:shadow-md" style={{ background: `linear-gradient(90deg, ${from}, ${to})` }}>
                    {c.open} <ArrowRight className="h-4 w-4" />
                  </span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* How it works */}
        <Card title={c.howTitle} lead={c.howLead}>
          <ol className="space-y-4">
            {c.steps.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FCE5F1] text-sm font-extrabold text-[#F51B83]">{i + 1}</span>
                <div>
                  <h3 className="text-base font-extrabold text-[#17366F]">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-[#5E78A4] sm:text-base">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <button type="button" onClick={() => onNavigate('credits')} className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-[#2878D0] hover:text-[#17366F]">
            <ShieldCheck className="h-4 w-4" /> {c.creditsLink} <ArrowRight className="h-4 w-4" />
          </button>
        </Card>

        {/* Values */}
        <Card title={c.valuesTitle}>
          <div className="grid gap-3 sm:grid-cols-3">
            {c.values.map((v) => (
              <div key={v.title} className="rounded-2xl border border-[#D9E8F8] bg-[#F9FCFF] p-4">
                <Moon className="mb-2 h-5 w-5 text-[#F51B83]" />
                <h3 className="text-sm font-extrabold text-[#17366F]">{v.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[#5E78A4]">{v.text}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-[#F7B5D2] bg-[#FFF5FA] p-4">
            <p className="mb-1 text-xs font-extrabold uppercase tracking-wider text-[#F51B83]">{c.noteTitle}</p>
            <p className="text-sm leading-relaxed text-[#17366F]">{c.note}</p>
          </div>
        </Card>

        {/* Posts */}
        <Card title={c.postsTitle} lead={c.postsLead}>
          <div className="grid gap-3">
            {posts.map((post) => (
              <button key={post.id} type="button" onClick={() => onOpenArticle(post.id)} className="group flex w-full items-center gap-4 rounded-2xl border border-[#D9E8F8] bg-white p-3 text-left transition-all hover:border-[#2878D0]/40 hover:shadow-md">
                <img src={post.image} alt="" loading="lazy" className="h-20 w-28 shrink-0 rounded-xl object-cover sm:h-24 sm:w-36" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#2878D0]">{post.category[lang] || post.category.pt}</span>
                  <span className="line-clamp-2 block text-sm font-bold leading-snug text-[#172B4D] group-hover:text-[#2878D0] sm:text-base">{post.title[lang] || post.title.pt}</span>
                </span>
                <ArrowRight className="h-5 w-5 shrink-0 text-[#2878D0]" />
              </button>
            ))}
          </div>
          <button type="button" onClick={() => onNavigate('blog')} className="inline-flex items-center gap-2 text-sm font-bold text-[#2878D0] hover:text-[#17366F]">
            {c.seeBlog} <ArrowRight className="h-4 w-4" />
          </button>
        </Card>

        {/* Contact */}
        <div className="mt-6 rounded-[2rem] bg-[#2878D0] p-7 text-center text-white shadow-[0_14px_40px_rgba(23,54,111,0.15)] sm:p-9">
          <h2 className="text-2xl font-extrabold">{c.contactTitle}</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-white/90 sm:text-base">{c.contactText}</p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <button type="button" onClick={() => onNavigate('contact')} className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#2878D0] transition-colors hover:bg-[#FCE5F1] hover:text-[#F51B83]"><MessageCircle className="h-4 w-4" /> {c.contactBtn}</button>
            <button type="button" onClick={() => onNavigate('newsletter')} className="inline-flex items-center gap-2 rounded-full bg-[#F51B83] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#D9166F]"><Mail className="h-4 w-4" /> {c.newsletterBtn}</button>
          </div>
        </div>
      </div>
    </section>
  );
};

const Card: React.FC<{ title: string; lead?: string; children: React.ReactNode }> = ({ title, lead, children }) => (
  <div className="mt-6 space-y-4 rounded-[2rem] border border-[#D9E8F8] bg-white p-6 shadow-[0_14px_40px_rgba(23,54,111,0.08)] sm:p-9">
    <div>
      <h2 className="text-xl font-extrabold text-[#172B4D] sm:text-2xl">{title}</h2>
      {lead && <p className="mt-1 text-sm text-[#647DA5] sm:text-base">{lead}</p>}
    </div>
    {children}
  </div>
);
