import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Calendar, Sparkles, Compass, Smile, Moon, BookOpen, ShieldCheck, Wrench, FileText, Clock, ClipboardList, Telescope, PenLine, Send } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SOCIAL_LINKS } from '../data/socialLinks';
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
  aboutHeadline: string; stepWord: string; tabs: [string, string, string, string]; metas: string[]; free: string; count: string;
  postsTitle: string; postsLead: string; seeBlog: string;
  contactTitle: string; contactText: string; contactBtn: string; newsletterBtn: string;
}> = {
  pt: {
    back: 'Voltar ao Início',
    handle: '@aurenstar · aurenstar.com',
    bio: 'Astrologia clara, acolhedora e útil. Para você se conhecer melhor, sem complicação. ✨',
    verified: 'Perfil verificado',
    stats: ['ferramentas', 'artigos', 'termos no dicionário', 'idiomas'],
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
      { title: 'Escrevemos em palavras simples', text: 'Com as posições do céu em mãos, montamos um texto curto e pessoal, em palavras simples. O site lembra o que você já recebeu para nunca repetir.' },
      { title: 'Você compartilha o que sentiu', text: 'Cada resultado vira um card pronto para postar nos Stories e no feed.' },
    ],
    creditsLink: 'Ver as ferramentas e os créditos',
    valuesTitle: 'Nosso jeito de fazer',
    values: [
      { title: 'Linguagem simples', text: 'Palavras simples, do jeito que a gente fala. Se uma criança de 12 anos não entende, a gente reescreve.' },
      { title: 'Reflexão, não destino', text: 'A astrologia aqui é um espelho para pensar, nunca uma ordem sobre o que você deve fazer.' },
      { title: 'Cuidado com você', text: 'Preferimos uma mensagem calma a uma previsão assustadora.' },
    ],
    noteTitle: 'Um aviso honesto',
    note: 'A astrologia é uma forma de reflexão e entretenimento. Nossos textos não substituem orientação médica, psicológica, jurídica ou financeira.',
    aboutHeadline: 'Astrologia clara, acolhedora e útil.', stepWord: 'Passo', tabs: ['Ferramentas', 'Sobre', 'Como funciona', 'Blog'], metas: ['1 por dia', 'a cada 4 horas', 'na hora', 'para os Stories', '16 termos'], free: 'Grátis', count: 'ferramentas',
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
    stats: ['tools', 'articles', 'dictionary terms', 'languages'],
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
      { title: 'We write in simple words', text: 'With the positions of the sky in hand, we put together a short, personal text in simple words. The site remembers what you already received so it never repeats.' },
      { title: 'You share how you feel', text: 'Every result becomes a card ready to post on Stories and your feed.' },
    ],
    creditsLink: 'See the tools and credits',
    valuesTitle: 'Our way of doing things',
    values: [
      { title: 'Simple language', text: 'Simple words, the way people actually talk. If a 12-year-old cannot understand it, we rewrite it.' },
      { title: 'Reflection, not destiny', text: 'Astrology here is a mirror to think with, never an order about what you must do.' },
      { title: 'Care for you', text: 'We prefer a calm message over a scary prediction.' },
    ],
    noteTitle: 'An honest note',
    note: 'Astrology is a form of reflection and entertainment. Our texts do not replace medical, psychological, legal or financial advice.',
    aboutHeadline: 'Astrology made clear, gentle and useful.', stepWord: 'Step', tabs: ['Tools', 'About', 'How it works', 'Blog'], metas: ['1 per day', 'every 4 hours', 'instant', 'for Stories', '16 terms'], free: 'Free', count: 'tools',
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
    stats: ['herramientas', 'artículos', 'términos en el diccionario', 'idiomas'],
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
      { title: 'Escribimos en palabras simples', text: 'Con las posiciones del cielo, armamos un texto corto y personal, en palabras simples. El sitio recuerda lo que ya recibiste para no repetirse.' },
      { title: 'Compartes lo que sientes', text: 'Cada resultado se convierte en una tarjeta lista para publicar en Stories y en tu feed.' },
    ],
    creditsLink: 'Ver las herramientas y los créditos',
    valuesTitle: 'Nuestra forma de hacer las cosas',
    values: [
      { title: 'Lenguaje simple', text: 'Palabras simples, como se habla de verdad. Si un niño de 12 años no lo entiende, lo reescribimos.' },
      { title: 'Reflexión, no destino', text: 'La astrología aquí es un espejo para pensar, nunca una orden sobre lo que debes hacer.' },
      { title: 'Cuidado contigo', text: 'Preferimos un mensaje tranquilo a una predicción que asusta.' },
    ],
    noteTitle: 'Un aviso honesto',
    note: 'La astrología es una forma de reflexión y entretenimiento. Nuestros textos no sustituyen el consejo médico, psicológico, legal o financiero.',
    aboutHeadline: 'Astrología clara, cercana y útil.', stepWord: 'Paso', tabs: ['Herramientas', 'Sobre', 'Cómo funciona', 'Blog'], metas: ['1 por día', 'cada 4 horas', 'al instante', 'para Stories', '16 términos'], free: 'Gratis', count: 'herramientas',
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

const TOOL_COLORS: Record<string, string> = {
  'daily-message': '#2878D0',
  aureneffect: '#F51B83',
  'discover-sign': '#2878D0',
  'describe-me': '#F51B83',
  dicionario: '#2878D0',
};


const STEP_ICONS = [ClipboardList, Telescope, PenLine, Send];
const STEP_COLORS = ['#2878D0', '#F51B83', '#2878D0', '#F51B83'];

const SOCIAL_PATHS: Record<string, string> = {
  facebook: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z',
  pinterest: 'M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.357-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z',
  youtube: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  tiktok: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
};

const SocialIcon: React.FC<{ name: string }> = ({ name }) =>
  name === 'instagram' ? (
    <svg className="h-[18px] w-[18px] fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ) : (
    <svg className="h-[18px] w-[18px] fill-current" viewBox="0 0 24 24" aria-hidden><path d={SOCIAL_PATHS[name]} /></svg>
  );

const VALUE_GRADIENTS = [
  'linear-gradient(180deg, #6D4ED9 0%, #9B86EE 55%, #CFC3F8 100%)',
  'linear-gradient(180deg, #E5499A 0%, #F58CC0 55%, #FFC2DF 100%)',
  'linear-gradient(180deg, #5B8FDB 0%, #8FB4EA 55%, #CFE0F7 100%)',
];
const VALUE_IMAGES = ['/assets/about/about-language.svg', '/assets/about/about-mission.svg', '/assets/about/about-platform.svg'];

type Tab = 'tools' | 'about' | 'how' | 'blog';

export const AboutProfilePage: React.FC<AboutProfilePageProps> = ({ onNavigate, onOpenArticle }) => {
  const { language } = useLanguage();
  const lang = (language || 'en') as Lang;
  const c = COPY[lang];
  const [tab, setTab] = useState<Tab>('tools');
  const posts = BLOG_ARTICLES.slice(0, 6);
  const tabKeys: Tab[] = ['tools', 'about', 'how', 'blog'];
  const stats = [
    { icon: Wrench, value: String(c.tools.length), label: c.stats[0] },
    { icon: FileText, value: String(BLOG_ARTICLES.length), label: c.stats[1] },
    { icon: BookOpen, value: String(ASTROLOGY_DICTIONARY_TERMS.length), label: c.stats[2] },
  ];

  return (
    <section className="min-h-[78vh] bg-[#C9E5FF] px-4 pb-20 pt-24 sm:px-6 sm:pt-28">
      <div className="mx-auto max-w-4xl">
        <button type="button" onClick={() => onNavigate('home')} className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#2878D0] hover:text-[#17366F]">
          <ArrowLeft className="h-4 w-4" /> {c.back}
        </button>

        <div className="rounded-[2rem] border border-[#D9E8F8] bg-white p-3 shadow-[0_14px_40px_rgba(23,54,111,0.1)] sm:p-5">
          {/* Cover + avatar */}
          <div className="relative">
            <div className="relative h-40 overflow-hidden rounded-2xl bg-[#2878D0] sm:h-56" aria-hidden>
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 800 224" preserveAspectRatio="xMidYMid slice" fill="none">
                <ellipse cx="640" cy="112" rx="300" ry="86" transform="rotate(-18 640 112)" stroke="#fff" strokeOpacity="0.28" strokeWidth="14" />
                <ellipse cx="640" cy="112" rx="220" ry="58" transform="rotate(-18 640 112)" stroke="#F51B83" strokeOpacity="0.9" strokeWidth="8" />
                <circle cx="90" cy="40" r="90" fill="#fff" fillOpacity="0.08" />
                <circle cx="330" cy="215" r="70" fill="#fff" fillOpacity="0.08" />
                <path d="M520 50 l7 18 18 7 -18 7 -7 18 -7 -18 -18 -7 18 -7z" fill="#fff" />
                <path d="M730 150 l5 13 13 5 -13 5 -5 13 -5 -13 -13 -5 13 -5z" fill="#F51B83" />
                <path d="M250 70 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4z" fill="#fff" fillOpacity="0.8" />
                <circle cx="420" cy="40" r="3" fill="#fff" fillOpacity="0.7" />
                <circle cx="180" cy="150" r="2.5" fill="#fff" fillOpacity="0.6" />
                <circle cx="470" cy="170" r="3" fill="#fff" fillOpacity="0.6" />
                <circle cx="780" cy="40" r="3" fill="#fff" fillOpacity="0.7" />
              </svg>
            </div>
            <img src={AVATAR} alt="Aurenstar" className="absolute -bottom-9 left-4 h-20 w-20 rounded-2xl border-4 border-white bg-white object-cover shadow-md sm:left-6 sm:h-24 sm:w-24" />
          </div>

          {/* Name + stats */}
          <div className="mt-11 flex flex-col gap-4 px-2 sm:mt-12 sm:flex-row sm:items-center sm:justify-between sm:px-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-2xl font-extrabold text-[#172B4D]">
                <span translate="no" className="notranslate">Aurenstar</span>
                <span aria-label={c.verified} title={c.verified} className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#2878D0] text-white"><Check className="h-3.5 w-3.5" strokeWidth={3} /></span>
              </div>
              <p className="text-sm text-[#647DA5]">{c.handle}</p>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-[#17366F]">{c.bio}</p>
              <div className="mt-3 flex items-center gap-2">
                {SOCIAL_LINKS.map((n) => (
                  <a key={n.key} href={n.url} target="_blank" rel="noopener noreferrer" aria-label={n.label} title={n.label} className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D9E8F8] bg-[#F4F9FF] text-[#647DA5] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#2878D0] hover:bg-[#2878D0] hover:text-white hover:shadow-md">
                    <SocialIcon name={n.key} />
                  </a>
                ))}
              </div>
            </div>
            <div className="grid shrink-0 grid-cols-3 gap-2.5 sm:gap-3">
              {stats.map(({ icon: Icon, value, label }, i) => {
                const color = i % 2 === 0 ? '#2878D0' : '#F51B83';
                return (
                  <div key={label} className="group flex min-w-[6.5rem] flex-col items-center rounded-2xl border border-[#D9E8F8] bg-white px-3 py-3 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(23,54,111,0.14)] sm:min-w-[7.5rem] sm:px-4">
                    <span className="mb-1.5 flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-sm transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110" style={{ background: color }}>
                      <Icon className="h-[18px] w-[18px]" />
                    </span>
                    <span className="text-2xl font-extrabold leading-none text-[#172B4D]">{value}</span>
                    <span className="mt-1 text-[11px] font-semibold leading-tight text-[#647DA5]">{label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tabs */}
          <div role="tablist" className="mt-5 flex gap-1 overflow-x-auto rounded-2xl bg-[#F4F9FF] p-1.5">
            {tabKeys.map((k, i) => (
              <button
                key={k}
                role="tab"
                aria-selected={tab === k}
                type="button"
                onClick={() => setTab(k)}
                className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold transition-all ${tab === k ? 'bg-white text-[#172B4D] shadow-sm' : 'text-[#647DA5] hover:text-[#172B4D]'}`}
              >
                {c.tabs[i]}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="mt-4">
            {tab === 'tools' && (
              <div className="grid gap-4 sm:grid-cols-2">
                {c.tools.map((tool, i) => {
                  const Icon = TOOL_ICONS[tool.key] || Sparkles;
                  const color = TOOL_COLORS[tool.key] || '#2878D0';
                  return (
                    <button key={tool.key} type="button" onClick={() => onNavigate(tool.key)} className={`group flex flex-col overflow-hidden rounded-2xl border border-[#D9E8F8] bg-white p-3 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(23,54,111,0.14)] ${i === c.tools.length - 1 && c.tools.length % 2 === 1 ? 'sm:col-span-2 sm:flex-row sm:gap-4' : ''}`}>
                      <span className={`relative flex h-36 items-center justify-center overflow-hidden rounded-xl ${i === c.tools.length - 1 && c.tools.length % 2 === 1 ? 'sm:h-auto sm:w-64 sm:shrink-0' : ''}`} style={{ background: color }}>
                        <span aria-hidden className="absolute -left-8 -top-8 h-28 w-28 rounded-full bg-white/10" />
                        <span aria-hidden className="absolute -bottom-10 -right-6 h-32 w-32 rounded-full bg-white/10" />
                        <Icon className="relative h-14 w-14 text-white transition-transform duration-300 group-hover:scale-110" />
                        <span className="absolute right-2.5 top-2.5 rounded-md bg-white px-2 py-0.5 text-[10px] font-extrabold" style={{ color }}>{c.free}</span>
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col sm:justify-center">
                      <span className="mt-3 flex items-baseline justify-between gap-2 px-1 sm:mt-0">
                        <span className="text-base font-extrabold text-[#172B4D]">{tool.name}</span>
                        <span className="text-[11px] font-semibold text-[#647DA5]">0{i + 1}</span>
                      </span>
                      <span className="mt-1 px-1 text-sm leading-relaxed text-[#647DA5]">{tool.text}</span>
                      <span className="mt-3 flex items-center justify-between border-t border-[#EDF3FB] px-1 pt-3 text-xs font-semibold text-[#647DA5]">
                        <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {c.metas[i]}</span>
                        <span className="inline-flex items-center gap-1 font-bold transition-all group-hover:gap-2" style={{ color }}>{c.open} <ArrowRight className="h-3.5 w-3.5" /></span>
                      </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {tab === 'about' && (
              <div className="space-y-5 px-1 pb-2 pt-3 sm:px-2">
                <div className="max-w-2xl">
                  <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[#2878D0]">{c.aboutTitle}</p>
                  <h2 className="mt-3 text-3xl font-extrabold leading-[1.1] text-[#172B4D] sm:text-4xl">{c.aboutHeadline}</h2>
                  <div className="mt-4 space-y-3">{c.about.map((p) => <p key={p} className="text-base leading-8 text-[#5575A4]">{p}</p>)}</div>
                </div>
                <div className="border-l-2 border-[#F51B83] pl-4">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#2878D0]">{c.valuesTitle}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {c.values.map((v, i) => (
                    <div key={v.title} className="group relative flex min-h-[230px] flex-col overflow-hidden rounded-[18px] p-4 shadow-[0_14px_30px_rgba(23,54,111,0.16)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(23,54,111,0.24)]" style={{ backgroundImage: VALUE_GRADIENTS[i] }}>
                      <span aria-hidden className="pointer-events-none absolute -left-10 -top-16 h-44 w-64 rotate-[-12deg] rounded-full bg-white/20 blur-2xl" />
                      <span className="relative text-[11px] font-extrabold uppercase tracking-[0.16em] text-white/80">0{i + 1}</span>
                      <span className="relative mt-1 block text-lg font-bold leading-tight text-white">{v.title}</span>
                      <span className="relative mt-1.5 block text-[13px] leading-5 text-white/90">{v.text}</span>
                      <span className="relative mt-auto flex items-center justify-center pt-3">
                        <img src={VALUE_IMAGES[i]} alt="" width={400} height={220} loading="lazy" style={{ width: 120, maxWidth: 120 }} className="transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-2" />
                      </span>
                    </div>
                  ))}
                </div>
                <div className="rounded-[18px] border border-[#F7B5D2] bg-[#FFF5FA] p-4 sm:p-5">
                  <p className="mb-1 text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#F51B83]">{c.noteTitle}</p>
                  <p className="text-sm leading-relaxed text-[#17366F]">{c.note}</p>
                </div>
              </div>
            )}

            {tab === 'how' && (
              <div>
                <p className="mb-3 px-1 text-sm text-[#647DA5] sm:text-base">{c.howLead}</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {c.steps.map((step, i) => {
                    const Icon = STEP_ICONS[i];
                    const color = STEP_COLORS[i];
                    return (
                      <div key={step.title} className="group relative overflow-hidden rounded-2xl border border-[#D9E8F8] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(23,54,111,0.14)]">
                        <span aria-hidden className="pointer-events-none absolute -right-2 -top-6 select-none text-[7rem] font-black leading-none opacity-[0.07]" style={{ color }}>{i + 1}</span>
                        <span className="relative mb-4 flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-md transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110" style={{ background: color }}>
                          <Icon className="h-6 w-6" />
                        </span>
                        <p className="relative mb-1 text-[11px] font-extrabold uppercase tracking-wider" style={{ color }}>{c.stepWord} {i + 1}</p>
                        <h3 className="relative text-lg font-extrabold leading-snug text-[#172B4D]">{step.title}</h3>
                        <p className="relative mt-1.5 text-sm leading-relaxed text-[#5E78A4]">{step.text}</p>
                        <span aria-hidden className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" style={{ background: color }} />
                      </div>
                    );
                  })}
                </div>
                <button type="button" onClick={() => onNavigate('credits')} className="mt-4 inline-flex items-center gap-2 px-1 text-sm font-bold text-[#2878D0] hover:text-[#17366F]">
                  <ShieldCheck className="h-4 w-4" /> {c.creditsLink} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {tab === 'blog' && (
              <div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {posts.map((post) => (
                    <button key={post.id} type="button" onClick={() => onOpenArticle(post.id)} className="group flex flex-col overflow-hidden rounded-2xl border border-[#D9E8F8] bg-white p-3 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(23,54,111,0.14)]">
                      <span className="relative block h-36 overflow-hidden rounded-xl bg-slate-100">
                        <img src={post.image} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <span className="absolute right-2.5 top-2.5 rounded-md bg-[#F51B83] px-2 py-0.5 text-[10px] font-extrabold text-white">{post.category[lang] || post.category.pt}</span>
                      </span>
                      <span className="mt-3 line-clamp-2 px-1 text-base font-extrabold leading-snug text-[#172B4D] group-hover:text-[#2878D0]">{post.title[lang] || post.title.pt}</span>
                      <span className="mt-1 line-clamp-2 px-1 text-sm leading-relaxed text-[#647DA5]">{post.subtitle[lang] || post.subtitle.pt}</span>
                    </button>
                  ))}
                </div>
                <button type="button" onClick={() => onNavigate('blog')} className="mt-4 inline-flex items-center gap-2 px-1 text-sm font-bold text-[#2878D0] hover:text-[#17366F]">
                  {c.seeBlog} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
