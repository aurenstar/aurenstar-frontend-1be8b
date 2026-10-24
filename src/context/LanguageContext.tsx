import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'pt' | 'es';

export interface Translations {
  nav: {
    home: string;
    blog: string;
    privacy: string;
    terms: string;
    about: string;
    contact: string;
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
      newsletterTitle: 'Newsletter',
      newsletterDesc: 'Get tips, daily updates, and uplifting reflections sent directly to you.',
      emailPlaceholder: 'Email address',
      subscribeBtn: 'Subscribe →',
      subscribeSuccess: 'Thank you for subscribing!',
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
      companyTitle: 'Company',
      home: 'Início',
      aboutUs: 'Sobre nós',
      pricing: 'Planos',
      blog: 'Blog',
      blogDetails: 'Detalhes do Blog',
      privacyPolicy: 'Política de Privacidade',
      termsOfService: 'Termos de Serviço',
      productTitle: 'Product',
      features: 'Recursos',
      careers: 'Vagas',
      howItWorks: 'Como funciona',
      contact: 'Contato',
      dailyMessage: 'Aurendaily',
      aurenEffect: 'Aureneffect',
      discoverYourSign: 'Sign Calculator',
      newsletterTitle: 'Newsletter',
      newsletterDesc: 'Receba dicas diárias, novidades e conselhos positivos no seu e-mail.',
      emailPlaceholder: 'Seu endereço de e-mail',
      subscribeBtn: 'Inscrever →',
      subscribeSuccess: 'Inscrição realizada com sucesso!',
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
      companyTitle: 'Company',
      home: 'Inicio',
      aboutUs: 'Sobre nosotros',
      pricing: 'Precios',
      blog: 'Blog',
      blogDetails: 'Detalles del Blog',
      privacyPolicy: 'Política de Privacidad',
      termsOfService: 'Términos de Servicio',
      productTitle: 'Product',
      features: 'Funciones',
      careers: 'Empleo',
      howItWorks: 'Cómo funciona',
      contact: 'Contacto',
      dailyMessage: 'Aurendaily',
      aurenEffect: 'Aureneffect',
      discoverYourSign: 'Sign Calculator',
      newsletterTitle: 'Newsletter',
      newsletterDesc: 'Recibe consejos diarios, novedades y reflexiones inspiradoras en tu correo.',
      emailPlaceholder: 'Correo electrónico',
      subscribeBtn: 'Suscribirse →',
      subscribeSuccess: '¡Gracias por suscribirte!',
    },
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const value = {
    language,
    setLanguage,
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

