import { getUrlLang, stripLangPrefix, isSiteUrlLanguage, withLangPrefix } from '../utils/urlLang';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Language = 'en' | 'pt' | 'es';

export interface Translations {
  nav: {
    home: string;
    blog: string;
    privacy: string;
    terms: string;
    about: string;
    contact: string;
    dictionary: string;
    newsletter: string;
  };
  hero: {
    title: string;
    subtitle: string;
    dailyMessage: string;
    aurenEffect: string;
    discoverSign: string;
    describeMe: string;
  };
  modal: {
    title: string;
    subtitle: string;
    pickAnother: string;
    luckyColor: string;
    luckyNumber: string;
    element: string;
    close: string;
  };
  footer: {
    description: string;
    companyTitle: string;
    home: string;
    aboutUs: string;
    pricing: string;
    blog: string;
    blogDetails: string;
    privacyPolicy: string;
    termsOfService: string;
    productTitle: string;
    features: string;
    careers: string;
    howItWorks: string;
    contact: string;
    dailyMessage: string;
    aurenEffect: string;
    discoverYourSign: string;
    newsletterTitle: string;
    contactLabel: string;
    sourceCode: string;
    toolsCredits: string;
    dictionaryLabel: string;
    unfilteredLabel: string;
    newsletterDesc: string;
    emailPlaceholder: string;
    subscribeBtn: string;
    subscribeSuccess: string;
  };
}

const translations: Record<Language, Translations> = {
  en: {
    nav: {
      home: 'HOME',
      blog: 'BLOG',
      privacy: 'PRIVACY POLICY',
      terms: 'TERMS OF SERVICE',
      about: 'ABOUT US',
      contact: 'CONTACT',
      dictionary: 'DICTIONARY',
      newsletter: 'T-SHIRTS',
    },
    hero: {
      title: 'Your Daily Zodiac Guidance',
      subtitle: 'Receive gentle, inspiring insights, lucky colors, and warm daily advice tailored to your star sign in simple, clear words.',
      dailyMessage: 'AURENDAILY',
      aurenEffect: 'AURENEFFECT',
      discoverSign: 'SIGN CALCULATOR',
      describeMe: 'AURENSTAR UNFILTERED',
    },
    modal: {
      title: 'Zodiac Message of the Day',
      subtitle: 'Select your star sign to receive today’s positive message',
      pickAnother: 'Choose another sign',
      luckyColor: 'Lucky Color',
      luckyNumber: 'Lucky Number',
      element: 'Element',
      close: 'Close',
    },
    footer: {
      description: 'Zodiac guidance and daily star sign reflections designed to help you start each day with calm, positive energy.',
      companyTitle: 'Company',
      home: 'Home',
      aboutUs: 'About us',
      pricing: 'Pricing',
      blog: 'Blog',
      blogDetails: 'Blog Details',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      productTitle: 'Product',
      features: 'Features',
      careers: 'Careers',
      howItWorks: 'How it works',
      contact: 'Contact',
      dailyMessage: 'Aurendaily',
      aurenEffect: 'Aureneffect',
      discoverYourSign: 'Sign Calculator',
      newsletterTitle: 'Aurenstar T-shirts',
      contactLabel: 'Contact',
      sourceCode: 'Source code',
      toolsCredits: 'Tools & Credits',
      dictionaryLabel: 'Aurenstar Dictionary',
      unfilteredLabel: 'Aurenstar Unfiltered',
      newsletterDesc: 'Join the t-shirt list: the first 50 sign-ups get a launch discount coupon.',
      emailPlaceholder: 'Email address',
      subscribeBtn: 'Join the list →',
      subscribeSuccess: 'Done! You are on the list.',
    },
  },
  pt: {
    nav: {
      home: 'INÍCIO',
      blog: 'BLOG',
      privacy: 'POLÍTICA DE PRIVACIDADE',
      terms: 'TERMOS DE SERVIÇO',
      about: 'SOBRE NÓS',
      contact: 'CONTATO',
      dictionary: 'DICIONÁRIO',
      newsletter: 'CAMISETAS',
    },
    hero: {
      title: 'Sua Orientação Astrológica Diária',
      subtitle: 'Receba conselhos gentis, inspiradores e fáceis de entender para o seu signo todos os dias com palavras simples.',
      dailyMessage: 'AURENDAILY',
      aurenEffect: 'AURENEFFECT',
      discoverSign: 'SIGN CALCULATOR',
      describeMe: 'AURENSTAR UNFILTERED',
    },
    modal: {
      title: 'Mensagem do Signo do Dia',
      subtitle: 'Escolha seu signo para receber sua mensagem positiva de hoje',
      pickAnother: 'Escolher outro signo',
      luckyColor: 'Cor do Dia',
      luckyNumber: 'Número da Sorte',
      element: 'Elemento',
      close: 'Fechar',
    },
    footer: {
      description: 'Orientações astrológicas e mensagens diárias simples para você começar cada manhã com paz, ânimo e harmonia.',
      companyTitle: 'Empresa',
      home: 'Início',
      aboutUs: 'Sobre nós',
      pricing: 'Planos',
      blog: 'Blog',
      blogDetails: 'Detalhes do Blog',
      privacyPolicy: 'Política de Privacidade',
      termsOfService: 'Termos de Serviço',
      productTitle: 'Produto',
      features: 'Recursos',
      careers: 'Vagas',
      howItWorks: 'Como funciona',
      contact: 'Contato',
      dailyMessage: 'Aurendaily',
      aurenEffect: 'Aureneffect',
      discoverYourSign: 'Calculadora de Signo',
      newsletterTitle: 'Camisetas Aurenstar',
      contactLabel: 'Contato',
      sourceCode: 'Código aberto',
      toolsCredits: 'Ferramentas e Créditos',
      dictionaryLabel: 'Dicionário Aurenstar',
      unfilteredLabel: 'Aurenstar Sem Filtro',
      newsletterDesc: 'Entre na lista das camisetas: as 50 primeiras inscrições ganham um cupom de desconto no lançamento.',
      emailPlaceholder: 'Seu endereço de e-mail',
      subscribeBtn: 'Entrar na lista →',
      subscribeSuccess: 'Pronto! Você está na lista.',
    },
  },
  es: {
    nav: {
      home: 'INICIO',
      blog: 'BLOG',
      privacy: 'POLÍTICA DE PRIVACIDAD',
      terms: 'TÉRMINOS DE SERVICIO',
      about: 'SOBRE NOSOTROS',
      contact: 'CONTACTO',
      dictionary: 'DICCIONARIO',
      newsletter: 'CAMISETAS',
    },
    hero: {
      title: 'Tu Guía Astrológica Diaria',
      subtitle: 'Recibe consejos amables, inspiradores e fáciles de entender para tu signo todos os días com palavras sencillas.',
      dailyMessage: 'AURENDAILY',
      aurenEffect: 'AURENEFFECT',
      discoverSign: 'SIGN CALCULATOR',
      describeMe: 'AURENSTAR UNFILTERED',
    },
    modal: {
      title: 'Mensaje del Signo del Día',
      subtitle: 'Elige tu signo para recibir tu mensaje positivo de hoy',
      pickAnother: 'Elegir otro signo',
      luckyColor: 'Color del Día',
      luckyNumber: 'Número de la Suerte',
      element: 'Elemento',
      close: 'Cerrar',
    },
    footer: {
      description: 'Orientación astrológica y mensajes reconfortantes para empezar cada día con energía positiva y tranquilidad.',
      companyTitle: 'Empresa',
      home: 'Inicio',
      aboutUs: 'Sobre nosotros',
      pricing: 'Precios',
      blog: 'Blog',
      blogDetails: 'Detalles del Blog',
      privacyPolicy: 'Política de Privacidad',
      termsOfService: 'Términos de Servicio',
      productTitle: 'Producto',
      features: 'Funciones',
      careers: 'Empleo',
      howItWorks: 'Cómo funciona',
      contact: 'Contacto',
      dailyMessage: 'Aurendaily',
      aurenEffect: 'Aureneffect',
      discoverYourSign: 'Calculadora de Signo',
      newsletterTitle: 'Camisetas Aurenstar',
      contactLabel: 'Contacto',
      sourceCode: 'Código abierto',
      toolsCredits: 'Herramientas y Créditos',
      dictionaryLabel: 'Diccionario Aurenstar',
      unfilteredLabel: 'Aurenstar Sin Filtro',
      newsletterDesc: 'Entra en la lista de camisetas: las primeras 50 inscripciones reciben un cupón de descuento en el lanzamiento.',
      emailPlaceholder: 'Correo electrónico',
      subscribeBtn: 'Entrar en la lista →',
      subscribeSuccess: '¡Listo! Estás en la lista.',
    },
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  /** true once the person picked a language themselves (then we never override it from the country) */
  languageChosen: boolean;
  /** language of the visitor's country when the site has no menus in it (e.g. 'nl', 'ja'); '' otherwise */
  visitorLanguage: string;
  t: Translations;
}

const CHOICE_KEY = 'aurenstar_lang_choice';
const readChoice = (): Language | null => {
  try {
    const v = localStorage.getItem(CHOICE_KEY);
    return v === 'en' || v === 'pt' || v === 'es' ? v : null;
  } catch {
    return null;
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Opened on a language address (/nl/...): that language rules the whole visit.
  const urlLang = getUrlLang();
  const siteUrlLang = isSiteUrlLanguage(urlLang) ? (urlLang as Language) : null; // /pt or /es: hand-written texts
  const [choice, setChoice] = useState<Language | null>(urlLang ? null : readChoice);
  const [language, setLang] = useState<Language>(siteUrlLang || choice || 'en');
  const [visitorLanguage, setVisitorLanguage] = useState(siteUrlLang ? '' : urlLang);

  // First visit: pick the site language that fits the visitor's country (English when unknown). Silent on any failure.
  useEffect(() => {
    if (choice || urlLang) return;
    let cancelled = false;
    fetch('/api/visitor')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (cancelled || !d) return;
        if (d.uiLanguage === 'pt' || d.uiLanguage === 'es' || d.uiLanguage === 'en') setLang(d.uiLanguage);
        if (d.known && d.language && !['en', 'pt', 'es'].includes(d.language)) setVisitorLanguage(d.language);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [choice]);

  const setLanguage = (lang: Language) => {
    try {
      localStorage.setItem(CHOICE_KEY, lang);
    } catch {
      // private mode: the choice just lasts for this visit
    }
    if (urlLang) {
      // On a language address the language is the address: go to the same page in the chosen language.
      const rest = stripLangPrefix(window.location.pathname);
      const target = lang === 'en' ? rest : withLangPrefix(rest, lang);
      if (target !== window.location.pathname) window.location.assign(target + window.location.search + window.location.hash);
      return;
    }
    setChoice(lang);
    setLang(lang);
  };

  const value = {
    language,
    setLanguage,
    languageChosen: choice !== null || siteUrlLang !== null, // /pt, /es: the hand-written article, no country adaptation
    visitorLanguage: siteUrlLang ? '' : urlLang || (choice ? '' : visitorLanguage),
    t: translations[language],
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

