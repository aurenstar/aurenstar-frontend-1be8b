import React, { useState } from 'react';
import {
  Mail,
  Send,
  Copy,
  Check,
  Sparkles,
  ArrowLeft,
  Clock,
  Heart,
  MessageSquare,
  Building,
  ExternalLink,
  Laptop,
  PenTool,
  X,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ContactPageProps {
  onBackToHome: () => void;
  onNavigateToBlog: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  onBackToHome,
  onNavigateToBlog,
}) => {
  const { language } = useLanguage();
  const lang = (language || 'pt') as 'pt' | 'en' | 'es';

  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'parceria',
    message: '',
  });

  const BUSINESS_EMAIL = 'aurenstarbusiness@gmail.com';
  const GMAIL_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${BUSINESS_EMAIL}&su=Contato%20Aurenstar&body=Ol%C3%A1%20equipe%20Aurenstar,%0A%0A`;
  const MAILTO_URL = `mailto:${BUSINESS_EMAIL}?subject=Contato%20Aurenstar`;

  const handleCopyEmail = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(BUSINESS_EMAIL);
      setCopied(true);
      setNotification(
        lang === 'pt'
          ? 'E-mail aurenstarbusiness@gmail.com copiado com sucesso!'
          : lang === 'es'
          ? '¡Correo aurenstarbusiness@gmail.com copiado con éxito!'
          : 'Email aurenstarbusiness@gmail.com copied successfully!'
      );
      setTimeout(() => {
        setCopied(false);
        setNotification(null);
      }, 3500);
    }
  };

  const handleScrollToForm = () => {
    setShowOptionsModal(false);
    const formElement = document.getElementById('formulario-contato');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
      // Focus on the first input
      setTimeout(() => {
        const input = document.getElementById('input-nome');
        input?.focus();
      }, 500);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  const texts = {
    pt: {
      tag: 'Canais de Contato',
      title: 'Fale com a Aurenstar',
      subtitle:
        'Queremos muito ouvir você! Seja para conversar sobre parcerias, tirar dúvidas ou mandar uma mensagem de carinho, nossa equipe está de braços abertos.',
      emailCardTitle: 'Nosso E-mail Oficial',
      emailCardSubtitle: 'Para parcerias, imprensa ou dúvidas gerais:',
      copyBtn: 'Copiar E-mail',
      copiedBtn: 'E-mail Copiado!',
      sendEmailCta: 'Enviar E-mail Agora',
      openGmailBtn: 'Abrir no Gmail',
      openAppBtn: 'Abrir no App',
      moreOptionsBtn: 'Outras Formas',
      formTitle: 'Envie uma mensagem direta',
      formSubtitle: 'Preencha os campos abaixo e responderemos rapidinho.',
      nameLabel: 'Seu Nome',
      namePlaceholder: 'Como gostaria de ser chamado?',
      emailLabel: 'Seu E-mail',
      emailPlaceholder: 'exemplo@email.com',
      subjectLabel: 'Assunto',
      subjects: {
        parceria: 'Parcerias e Negócios',
        duvida: 'Dúvidas sobre o Horóscopo',
        elogio: 'Elogio ou Sugestão',
        outro: 'Outro assunto',
      },
      messageLabel: 'Sua Mensagem',
      messagePlaceholder: 'Escreva aqui o que você gostaria de nos dizer...',
      submitCta: 'Enviar Mensagem',
      successTitle: 'Mensagem enviada com carinho!',
      successDesc:
        'Obrigado pelo contato! Recebemos sua mensagem e retornaremos em até 24 horas no seu e-mail.',
      sendAnother: 'Enviar outra mensagem',
      backHome: 'Voltar ao Início',
      exploreBlog: 'Ver Artigos do Blog',
      card1Title: 'Resposta Rápida',
      card1Desc: 'Respondemos seu e-mail em até 24 horas úteis com toda dedicação.',
      card2Title: 'Parcerias e Ideias',
      card2Desc: 'Adoramos novos projetos e colaborações que tragam valor e paz.',
      card3Title: 'Atendimento com Carinho',
      card3Desc: 'Conversa acolhedora, humana e com palavras fáceis de entender.',
      modalTitle: 'Como você deseja enviar sua mensagem?',
      modalSubtitle: 'Escolha a opção que for mais confortável para você:',
      optGmailTitle: 'Abrir no Gmail',
      optGmailDesc: 'Abre diretamente no seu navegador pronto para enviar.',
      optAppTitle: 'Abrir no seu Aplicativo de E-mail',
      optAppDesc: 'Usa o Outlook, Apple Mail ou o app padrão do seu celular/computador.',
      optFormTitle: 'Escrever pelo Formulário desta Página',
      optFormDesc: 'Envie sua mensagem agora mesmo sem sair do site.',
      optCopyTitle: 'Copiar o Endereço de E-mail',
      optCopyDesc: 'Copia aurenstarbusiness@gmail.com para você colar onde quiser.',
      close: 'Fechar',
    },
    en: {
      tag: 'Contact Channels',
      title: 'Get in Touch with Aurenstar',
      subtitle:
        'We would love to hear from you! Whether to discuss partnerships, ask questions, or send warm feedback, our team is always here for you.',
      emailCardTitle: 'Our Official Email',
      emailCardSubtitle: 'For partnerships, press, or general questions:',
      copyBtn: 'Copy Email',
      copiedBtn: 'Email Copied!',
      sendEmailCta: 'Send Email Now',
      openGmailBtn: 'Open in Gmail',
      openAppBtn: 'Open in App',
      moreOptionsBtn: 'Other Ways',
      formTitle: 'Send a Direct Message',
      formSubtitle: 'Fill in the fields below and we will get back to you shortly.',
      nameLabel: 'Your Name',
      namePlaceholder: 'What is your name?',
      emailLabel: 'Your Email',
      emailPlaceholder: 'example@email.com',
      subjectLabel: 'Subject',
      subjects: {
        parceria: 'Partnerships & Business',
        duvida: 'Questions about Horoscope',
        elogio: 'Praise or Feedback',
        outro: 'Other topic',
      },
      messageLabel: 'Your Message',
      messagePlaceholder: 'Write here what you would like to share with us...',
      submitCta: 'Send Message',
      successTitle: 'Message sent with warmth!',
      successDesc:
        'Thank you for reaching out! We received your note and will reply within 24 hours to your email.',
      sendAnother: 'Send another message',
      backHome: 'Back to Home',
      exploreBlog: 'Explore Blog Posts',
      card1Title: 'Fast Response',
      card1Desc: 'We answer your email within 24 business hours with genuine care.',
      card2Title: 'Partnerships & Ideas',
      card2Desc: 'We welcome collaborations and ideas that bring positive peace.',
      card3Title: 'Friendly Support',
      card3Desc: 'Warm, human conversation in simple and clear words.',
      modalTitle: 'How would you like to reach us?',
      modalSubtitle: 'Choose the most convenient option for you:',
      optGmailTitle: 'Open in Gmail',
      optGmailDesc: 'Opens directly in your browser ready to compose.',
      optAppTitle: 'Open in your Mail App',
      optAppDesc: 'Uses Outlook, Apple Mail or your device default mail app.',
      optFormTitle: 'Fill the on-page form',
      optFormDesc: 'Send your message right here without leaving the page.',
      optCopyTitle: 'Copy Email Address',
      optCopyDesc: 'Copies aurenstarbusiness@gmail.com to your clipboard.',
      close: 'Close',
    },
    es: {
      tag: 'Canales de Contacto',
      title: 'Comunícate con Aurenstar',
      subtitle:
        '¡Nos encantará escucharte! Ya sea para hablar de colaboraciones, resolver dudas o enviar un saludo, nuestro equipo siempre te atenderá con cariño.',
      emailCardTitle: 'Nuestro Correo Oficial',
      emailCardSubtitle: 'Para alianzas, prensa o consultas generales:',
      copyBtn: 'Copiar Correo',
      copiedBtn: '¡Correo Copiado!',
      sendEmailCta: 'Enviar Correo Ahora',
      openGmailBtn: 'Abrir en Gmail',
      openAppBtn: 'Abrir en App',
      moreOptionsBtn: 'Otras Formas',
      formTitle: 'Envía un mensaje directo',
      formSubtitle: 'Completa los campos a continuación y te responderemos pronto.',
      nameLabel: 'Tu Nombre',
      namePlaceholder: '¿Cómo te gustaría que te llamemos?',
      emailLabel: 'Tu Correo Electrónico',
      emailPlaceholder: 'ejemplo@correo.com',
      subjectLabel: 'Asunto',
      subjects: {
        parceria: 'Alianzas y Negocios',
        duvida: 'Dudas sobre el Horóscopo',
        elogio: 'Elogio o Sugerencia',
        outro: 'Otro tema',
      },
      messageLabel: 'Tu Mensaje',
      messagePlaceholder: 'Escribe aquí lo que deseas decirnos...',
      submitCta: 'Enviar Mensaje',
      successTitle: '¡Mensaje enviado con cariño!',
      successDesc:
        '¡Gracias por contactarnos! Recibimos tu mensaje y te responderemos en 24 horas a tu correo.',
      sendAnother: 'Enviar otro mensaje',
      backHome: 'Volver al Inicio',
      exploreBlog: 'Ver Artículos del Blog',
      card1Title: 'Respuesta Rápida',
      card1Desc: 'Respondemos tu correo en un plazo de 24 horas con total dedicación.',
      card2Title: 'Alianzas e Ideas',
      card2Desc: 'Nos encantan nuevos proyectos y colaboraciones que aporten paz.',
      card3Title: 'Atención Cálida',
      card3Desc: 'Conversación humana, cercana y con palabras fáciles de entender.',
      modalTitle: '¿Cómo prefieres enviar tu mensaje?',
      modalSubtitle: 'Elige la opción más cómoda para ti:',
      optGmailTitle: 'Abrir en Gmail',
      optGmailDesc: 'Abre directamente en tu navegador listo para redactar.',
      optAppTitle: 'Abrir en tu Aplicación de Correo',
      optAppDesc: 'Usa Outlook, Apple Mail o la aplicación de tu dispositivo.',
      optFormTitle: 'Escribir por el Formulario de la Página',
      optFormDesc: 'Envía tu mensaje aquí mismo sin salir del sitio.',
      optCopyTitle: 'Copiar Dirección de Correo',
      optCopyDesc: 'Copia aurenstarbusiness@gmail.com para pegarlo donde desees.',
      close: 'Cerrar',
    },
  };

  const t = texts[lang] || texts.pt;

  return (
    <div className="w-full bg-[#C9E5FF] min-h-screen text-[#172B4D] pt-24 sm:pt-28 pb-24 animate-fadeIn select-none">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Navigation Link */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#D9E8F8] bg-white/80 hover:bg-white text-xs font-bold text-[#172B4D] transition-all cursor-pointer shadow-xs group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>{t.backHome}</span>
          </button>

          <button
            onClick={onNavigateToBlog}
            className="text-xs font-semibold text-[#2878D0] hover:text-[#17366F] transition-colors cursor-pointer"
          >
            {t.exploreBlog} →
          </button>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2878D0]/10 border border-[#2878D0]/20 text-[#2878D0] text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.tag}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#172B4D] tracking-tight leading-tight mb-4">
            {t.title}
          </h1>

          <p className="text-sm sm:text-base text-[#647DA5] leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Global Notification Banner if email was copied or clicked */}
        {notification && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center justify-between animate-fadeIn shadow-xs">
            <div className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{notification}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* =========================================================================
            FEATURED EMAIL CTA CARD (Highlights aurenstarbusiness@gmail.com)
            ========================================================================= */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#17366F] via-[#2878D0] to-[#17366F] p-8 sm:p-10 text-white shadow-xl mb-12 border border-white/10">
          {/* Subtle celestial background stars glow */}
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#2878D0]/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-[#F51B83]/25 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-widest text-[#FFE0EF] mb-2">
                <Mail className="w-4 h-4" />
                <span>{t.emailCardTitle}</span>
              </div>

              <p className="text-xs sm:text-sm text-white/80 mb-3">
                {t.emailCardSubtitle}
              </p>

              {/* The Business Email Display */}
              <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 select-all">
                <span className="font-mono text-base sm:text-lg font-bold text-white tracking-wide">
                  {BUSINESS_EMAIL}
                </span>
              </div>
            </div>

            {/* CTAs: 100% Functional Buttons (Opens Gmail, Copies Email, Opens Options) */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
              {/* Primary Button: Direct Gmail Compose (Opens new tab with To & Subject pre-filled) */}
              <a
                href={GMAIL_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  handleCopyEmail();
                }}
                title="Abrir no Gmail (Web)"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#2878D0] via-[#17366F] to-[#F51B83] hover:brightness-110 text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#2878D0]/30 transition-all hover:scale-102 cursor-pointer text-center"
              >
                <Send className="w-4 h-4" />
                <span>{t.sendEmailCta}</span>
              </a>

              {/* Copy Email Button */}
              <button
                type="button"
                onClick={handleCopyEmail}
                title="Copiar endereço de e-mail"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs sm:text-sm font-bold backdrop-blur-md transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300">{t.copiedBtn}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-white/80" />
                    <span>{t.copyBtn}</span>
                  </>
                )}
              </button>

              {/* More Ways / Options Button */}
              <button
                type="button"
                onClick={() => setShowOptionsModal(true)}
                title="Outras formas de envio"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white/90 text-xs sm:text-sm font-medium transition-all cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.moreOptionsBtn}</span>
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            OPTIONS MODAL: HOW DO YOU PREFER TO SEND?
            ========================================================================= */}
        {showOptionsModal && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          >
            <div className="bg-[#FFFFFF] rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-[#D9E8F8] relative animate-scaleUp">
              {/* Close Button */}
              <button
                onClick={() => setShowOptionsModal(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#E4F1FF] hover:bg-[#D9E8F8] flex items-center justify-center text-[#647DA5] hover:text-[#172B4D] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 text-xs font-bold text-[#2878D0] uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Aurenstar Contato</span>
              </div>

              <h2 className="text-xl font-extrabold text-[#172B4D] mb-1.5">
                {t.modalTitle}
              </h2>
              <p className="text-xs text-[#647DA5] mb-5">
                {t.modalSubtitle}
              </p>

              {/* Options List */}
              <div className="space-y-3">
                {/* 1. Gmail Web */}
                <a
                  href={GMAIL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowOptionsModal(false)}
                  className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl border border-[#D9E8F8] hover:border-[#2878D0] hover:bg-[#E4F1FF]/50 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col text-left min-w-0 flex-1">
                    <span className="text-xs sm:text-sm font-bold text-[#172B4D] group-hover:text-[#2878D0] flex items-center gap-1.5">
                      <span>{t.optGmailTitle}</span>
                      <ExternalLink className="w-3 h-3 text-[#647DA5]" />
                    </span>
                    <span className="text-[11px] text-[#647DA5] line-clamp-1">
                      {t.optGmailDesc}
                    </span>
                  </div>
                </a>

                {/* 2. Mail Client App */}
                <a
                  href={MAILTO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowOptionsModal(false)}
                  className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl border border-[#D9E8F8] hover:border-[#2878D0] hover:bg-[#E4F1FF]/50 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#E4F1FF] text-[#2878D0] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col text-left min-w-0 flex-1">
                    <span className="text-xs sm:text-sm font-bold text-[#172B4D] group-hover:text-[#2878D0] flex items-center gap-1.5">
                      <span>{t.optAppTitle}</span>
                      <ExternalLink className="w-3 h-3 text-[#647DA5]" />
                    </span>
                    <span className="text-[11px] text-[#647DA5] line-clamp-1">
                      {t.optAppDesc}
                    </span>
                  </div>
                </a>

                {/* 3. On-page Form */}
                <button
                  type="button"
                  onClick={handleScrollToForm}
                  className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl border border-[#D9E8F8] hover:border-[#2878D0] hover:bg-[#E4F1FF]/50 transition-all cursor-pointer group text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#E4F1FF] text-[#2878D0] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <PenTool className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col text-left min-w-0 flex-1">
                    <span className="text-xs sm:text-sm font-bold text-[#172B4D] group-hover:text-[#2878D0]">
                      {t.optFormTitle}
                    </span>
                    <span className="text-[11px] text-[#647DA5] line-clamp-1">
                      {t.optFormDesc}
                    </span>
                  </div>
                </button>

                {/* 4. Copy Email */}
                <button
                  type="button"
                  onClick={() => {
                    handleCopyEmail();
                    setShowOptionsModal(false);
                  }}
                  className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl border border-[#D9E8F8] hover:border-[#2878D0] hover:bg-[#E4F1FF]/50 transition-all cursor-pointer group text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Copy className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col text-left min-w-0 flex-1">
                    <span className="text-xs sm:text-sm font-bold text-[#172B4D] group-hover:text-[#2878D0]">
                      {t.optCopyTitle}
                    </span>
                    <span className="text-[11px] text-[#647DA5] font-mono line-clamp-1">
                      {BUSINESS_EMAIL}
                    </span>
                  </div>
                </button>
              </div>

              {/* Close button */}
              <div className="mt-5 pt-4 border-t border-[#D9E8F8] flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowOptionsModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#E4F1FF] hover:bg-[#D9E8F8] text-xs font-bold text-[#17366F] cursor-pointer transition-colors"
                >
                  {t.close}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            GRID: 3 HIGHLIGHT PILLARS & DIRECT MESSAGE FORM
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Left Column: 3 Friendly Pillars */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#D9E8F8] shadow-2xs hover:shadow-xs transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-[#2878D0]/10 text-[#2878D0] flex items-center justify-center mb-3">
                <Clock className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-[#172B4D] mb-1">
                {t.card1Title}
              </h2>
              <p className="text-xs sm:text-sm text-[#647DA5] leading-relaxed">
                {t.card1Desc}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#D9E8F8] shadow-2xs hover:shadow-xs transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-[#E4F1FF] text-[#2878D0] flex items-center justify-center mb-3">
                <Building className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-[#172B4D] mb-1">
                {t.card2Title}
              </h2>
              <p className="text-xs sm:text-sm text-[#647DA5] leading-relaxed">
                {t.card2Desc}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#D9E8F8] shadow-2xs hover:shadow-xs transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-[#FFE0EF] text-[#F51B83] flex items-center justify-center mb-3">
                <Heart className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-[#172B4D] mb-1">
                {t.card3Title}
              </h2>
              <p className="text-xs sm:text-sm text-[#647DA5] leading-relaxed">
                {t.card3Desc}
              </p>
            </div>
          </div>

          {/* Right Column: Clean Simple Contact Form */}
          <div
            id="formulario-contato"
            className="lg:col-span-7 bg-[#FFFFFF] border border-[#D9E8F8] rounded-3xl p-6 sm:p-8 shadow-sm scroll-mt-28"
          >
            {submitted ? (
              <div className="text-center py-12 px-4 animate-fadeIn">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-xs">
                  <Check className="w-7 h-7" />
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#172B4D] mb-2">
                  {t.successTitle}
                </h3>
                <p className="text-xs sm:text-sm text-[#647DA5] max-w-md mx-auto mb-6 leading-relaxed">
                  {t.successDesc}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: '',
                      email: '',
                      subject: 'parceria',
                      message: '',
                    });
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#2878D0] hover:bg-[#17366F] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  {t.sendAnother}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <h2 className="text-xl font-extrabold text-[#172B4D] mb-1">
                    {t.formTitle}
                  </h2>
                  <p className="text-xs text-[#647DA5] mb-5">
                    {t.formSubtitle}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="input-nome"
                      className="block text-xs font-bold text-[#172B4D] mb-1.5"
                    >
                      {t.nameLabel}
                    </label>
                    <input
                      id="input-nome"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder={t.namePlaceholder}
                      className="w-full bg-white border border-[#D9E8F8] rounded-xl px-3.5 py-2.5 text-xs text-[#172B4D] placeholder-[#647DA5]/60 outline-none focus:ring-2 focus:ring-[#2878D0]/30 focus:border-[#2878D0] transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="input-email"
                      className="block text-xs font-bold text-[#172B4D] mb-1.5"
                    >
                      {t.emailLabel}
                    </label>
                    <input
                      id="input-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder={t.emailPlaceholder}
                      className="w-full bg-white border border-[#D9E8F8] rounded-xl px-3.5 py-2.5 text-xs text-[#172B4D] placeholder-[#647DA5]/60 outline-none focus:ring-2 focus:ring-[#2878D0]/30 focus:border-[#2878D0] transition-all"
                    />
                  </div>
                </div>

                {/* Subject Selector */}
                <div>
                  <label
                    htmlFor="select-assunto"
                    className="block text-xs font-bold text-[#172B4D] mb-1.5"
                  >
                    {t.subjectLabel}
                  </label>
                  <select
                    id="select-assunto"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className="w-full bg-white border border-[#D9E8F8] rounded-xl px-3.5 py-2.5 text-xs text-[#172B4D] outline-none focus:ring-2 focus:ring-[#2878D0]/30 focus:border-[#2878D0] transition-all cursor-pointer"
                  >
                    <option value="parceria">{t.subjects.parceria}</option>
                    <option value="duvida">{t.subjects.duvida}</option>
                    <option value="elogio">{t.subjects.elogio}</option>
                    <option value="outro">{t.subjects.outro}</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="textarea-mensagem"
                    className="block text-xs font-bold text-[#172B4D] mb-1.5"
                  >
                    {t.messageLabel}
                  </label>
                  <textarea
                    id="textarea-mensagem"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder={t.messagePlaceholder}
                    className="w-full bg-white border border-[#D9E8F8] rounded-xl px-3.5 py-2.5 text-xs text-[#172B4D] placeholder-[#647DA5]/60 outline-none focus:ring-2 focus:ring-[#2878D0]/30 focus:border-[#2878D0] transition-all resize-none"
                  />
                </div>

                {/* Submit Button with CTA */}
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#2878D0] hover:bg-[#17366F] text-white text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-101 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{t.submitCta}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
