import React, { useState } from 'react';
import { subscribeEmail } from '../utils/subscribe';
import { TshirtCapture } from '../components/TshirtCapture';
import { NEWSLETTER_CONSENT } from '../data/subscribeConsent';
import {
  Mail,
  Send,
  Check,
  Sparkles,
  ArrowLeft,
  Heart,
  Star,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { CoverArt } from '../components/CoverArt';
import { emailMessage } from '../utils/emailGuard';

interface NewsletterPageProps {
  onBackToHome: () => void;
  onNavigateToBlog: () => void;
}

export const NewsletterPage: React.FC<NewsletterPageProps> = ({
  onBackToHome,
  onNavigateToBlog,
}) => {
  const { language } = useLanguage();
  const lang = (language || 'pt') as 'pt' | 'en' | 'es';

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [zodiacSign, setZodiacSign] = useState('gemeos');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const zodiacSigns = [
    { value: 'aries', symbol: '♈', label: { pt: 'Áries (21 mar - 19 abr)', en: 'Aries (Mar 21 - Apr 19)', es: 'Aries (21 mar - 19 abr)' } },
    { value: 'touro', symbol: '♉', label: { pt: 'Touro (20 abr - 20 mai)', en: 'Taurus (Apr 20 - May 20)', es: 'Tauro (20 abr - 20 may)' } },
    { value: 'gemeos', symbol: '♊', label: { pt: 'Gêmeos (21 mai - 20 jun)', en: 'Gemini (May 21 - Jun 20)', es: 'Géminis (21 may - 20 jun)' } },
    { value: 'cancer', symbol: '♋', label: { pt: 'Câncer (21 jun - 22 jul)', en: 'Cancer (Jun 21 - Jul 22)', es: 'Cáncer (21 jun - 22 jul)' } },
    { value: 'leao', symbol: '♌', label: { pt: 'Leão (23 jul - 22 ago)', en: 'Leo (Jul 23 - Aug 22)', es: 'Leo (23 jul - 22 ago)' } },
    { value: 'virgem', symbol: '♍', label: { pt: 'Virgem (23 ago - 22 set)', en: 'Virgo (Aug 23 - Sep 22)', es: 'Virgo (23 ago - 22 sep)' } },
    { value: 'libra', symbol: '♎', label: { pt: 'Libra (23 set - 22 out)', en: 'Libra (Sep 23 - Oct 22)', es: 'Libra (23 sep - 22 oct)' } },
    { value: 'escorpiao', symbol: '♏', label: { pt: 'Escorpião (23 out - 21 nov)', en: 'Scorpio (Oct 23 - Nov 21)', es: 'Escorpio (23 oct - 21 nov)' } },
    { value: 'sagitario', symbol: '♐', label: { pt: 'Sagitário (22 nov - 21 dez)', en: 'Sagittarius (Nov 22 - Dec 21)', es: 'Sagitario (22 nov - 21 dic)' } },
    { value: 'capricornio', symbol: '♑', label: { pt: 'Capricórnio (22 dez - 19 jan)', en: 'Capricorn (Dec 22 - Jan 19)', es: 'Capricornio (22 dic - 19 ene)' } },
    { value: 'aquario', symbol: '♒', label: { pt: 'Aquário (20 jan - 18 fev)', en: 'Aquarius (Jan 20 - Feb 18)', es: 'Acuario (20 ene - 18 feb)' } },
    { value: 'peixes', symbol: '♓', label: { pt: 'Peixes (19 fev - 20 mar)', en: 'Pisces (Feb 19 - Mar 20)', es: 'Piscis (19 feb - 20 mar)' } },
  ];

  const selectedSignObj = zodiacSigns.find((s) => s.value === zodiacSign) || zodiacSigns[2];

  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState(false);
  const [subError, setSubError] = useState(false);
  const consentLang = (language === 'pt' || language === 'es' ? language : 'en') as 'pt' | 'en' | 'es';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending || !consent || !email.trim() || !zodiacSign || emailMessage(email, language)) return;
    setSending(true);
    setSubError(false);
    const ok = await subscribeEmail({ email, sign: zodiacSign, lang: consentLang, source: 'newsletter_page', list: 'newsletter' });
    setSending(false);
    if (!ok) { setSubError(true); return; }
    setIsSubscribed(true);
  };

  const texts = {
    pt: {
      tag: 'Newsletter da Aurenstar',
      title: 'Receba a Newsletter da Aurenstar',
      subtitle:
        'Novos artigos, dicas de astrologia e novidades da Aurenstar direto no seu e-mail. Escolha o seu signo e digite seu e-mail.',
      backHome: 'Voltar ao Início',
      exploreBlog: 'Ver Artigos do Blog',
      formTitle: 'Assine a Newsletter',
      formSubtitle: 'Leva menos de 1 minuto. Você pode sair quando quiser.',
      nameLabel: 'Seu Nome',
      namePlaceholder: 'Como você gosta de ser chamado?',
      emailLabel: 'Seu Melhor E-mail',
      emailPlaceholder: 'seu.email@exemplo.com',
      signLabel: 'Escolha o Seu Signo',
      submitCta: 'Quero Receber a Newsletter',
      privacyNotice: 'Sem spam: só novidades e conteúdos da Aurenstar. Você sai da lista quando quiser.',
      successTitle: 'Você está na newsletter!',
      successDesc: (userName: string, signName: string, userEmail: string) =>
        `Que bom, ${userName || 'amigo(a)'}! Enviaremos as novidades da Aurenstar para ${userEmail} (${signName}).`,
      successSub: 'Fique de olho na sua caixa de entrada.',
      readSignPostsNow: 'Ver Artigos do Meu Signo Agora',
      anotherEmail: 'Cadastrar outro e-mail',
      benefitsTitle: 'Por que assinar?',
      benefit1Title: 'Artigos Novos Primeiro',
      benefit1Desc: 'Você recebe os novos artigos e conteúdos assim que saírem.',
      benefit2Title: 'Conteúdo do Seu Signo',
      benefit2Desc: 'Usamos o signo que você escolheu para destacar o que combina com você.',
      benefit3Title: 'Sem Spam',
      benefit3Desc: 'Só novidades da Aurenstar. Você sai da lista quando quiser.',
    },
    en: {
      tag: 'Aurenstar Newsletter',
      title: 'Get the Aurenstar Newsletter',
      subtitle:
        'New articles, astrology tips and Aurenstar news straight to your inbox. Choose your sign and enter your email.',
      backHome: 'Back to Home',
      exploreBlog: 'Explore Blog Posts',
      formTitle: 'Subscribe to the Newsletter',
      formSubtitle: 'Takes less than a minute. Leave anytime.',
      nameLabel: 'Your Name',
      namePlaceholder: 'What should we call you?',
      emailLabel: 'Your Best Email',
      emailPlaceholder: 'your.email@example.com',
      signLabel: 'Choose Your Zodiac Sign',
      submitCta: 'Send Me the Newsletter',
      privacyNotice: 'No spam: only Aurenstar news and content. Leave the list anytime.',
      successTitle: 'You are on the newsletter!',
      successDesc: (userName: string, signName: string, userEmail: string) =>
        `Wonderful, ${userName || 'friend'}! We will send Aurenstar news to ${userEmail} (${signName}).`,
      successSub: 'Keep an eye on your inbox.',
      readSignPostsNow: 'Read Posts for My Sign Now',
      anotherEmail: 'Add another email',
      benefitsTitle: 'Why subscribe?',
      benefit1Title: 'New Articles First',
      benefit1Desc: 'You get new articles and content as soon as they are out.',
      benefit2Title: 'Content for Your Sign',
      benefit2Desc: 'We use the sign you chose to highlight what fits you.',
      benefit3Title: 'No Spam',
      benefit3Desc: 'Only Aurenstar news. Leave the list anytime.',
    },
    es: {
      tag: 'Newsletter de Aurenstar',
      title: 'Recibe la Newsletter de Aurenstar',
      subtitle:
        'Nuevos artículos, consejos de astrología y novedades de Aurenstar en tu correo. Elige tu signo y escribe tu correo.',
      backHome: 'Volver al Inicio',
      exploreBlog: 'Ver Artículos del Blog',
      formTitle: 'Suscríbete a la Newsletter',
      formSubtitle: 'Toma menos de 1 minuto. Sales cuando quieras.',
      nameLabel: 'Tu Nombre',
      namePlaceholder: '¿Cómo te gusta que te llamen?',
      emailLabel: 'Tu Mejor Correo',
      emailPlaceholder: 'tu.correo@ejemplo.com',
      signLabel: 'Elige Tu Signo Zodiacal',
      submitCta: 'Quiero Recibir la Newsletter',
      privacyNotice: 'Sin spam: solo novedades y contenidos de Aurenstar. Sales de la lista cuando quieras.',
      successTitle: '¡Estás en la newsletter!',
      successDesc: (userName: string, signName: string, userEmail: string) =>
        `¡Qué alegría, ${userName || 'amigo(a)'}! Enviaremos las novedades de Aurenstar a ${userEmail} (${signName}).`,
      successSub: 'Revisa tu bandeja de entrada.',
      readSignPostsNow: 'Ver Artículos de Mi Signo Ahora',
      anotherEmail: 'Añadir otro correo',
      benefitsTitle: '¿Por qué suscribirte?',
      benefit1Title: 'Artículos Nuevos Primero',
      benefit1Desc: 'Recibes los nuevos artículos y contenidos en cuanto salen.',
      benefit2Title: 'Contenido de Tu Signo',
      benefit2Desc: 'Usamos el signo que elegiste para destacar lo que va contigo.',
      benefit3Title: 'Sin Spam',
      benefit3Desc: 'Solo novedades de Aurenstar. Sales de la lista cuando quieras.',
    },
  };

  const t = texts[lang] || texts.pt;

  return (
    <div className="w-full bg-[#C9E5FF] min-h-screen pt-24 sm:pt-28 pb-20 select-none animate-fadeIn text-[#172B4D]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Navigation Breadcrumb / Return */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#D9E8F8]">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#647DA5] hover:text-[#172B4D] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>{t.backHome}</span>
          </button>

          <button
            type="button"
            onClick={onNavigateToBlog}
            className="text-xs sm:text-sm font-bold text-[#3982C8] hover:text-[#17366F] transition-colors cursor-pointer"
          >
            {t.exploreBlog} →
          </button>
        </div>

        {/* Cover-style header */}
        <div className="relative mb-10 overflow-hidden rounded-[2rem] bg-[#3982C8] p-6 text-white shadow-[0_14px_40px_rgba(23,54,111,0.18)] sm:p-10">
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 overflow-hidden sm:inset-y-0 sm:left-auto sm:right-0 sm:h-auto sm:w-1/2"><CoverArt tone="blue" /></div>
          <div className="relative max-w-xl pb-12 sm:pb-0 sm:pr-24">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{t.tag}</span>
            </div>
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">{t.title}</h1>
            <span aria-hidden className="mt-4 block h-1 w-12 rounded-full bg-[#E73578]" />
            <p className="mt-4 text-sm leading-relaxed text-white/90 sm:text-base">{t.subtitle}</p>
          </div>
        </div>

        {/* =========================================================================
            MAIN SUBSCRIPTION CARD (Clean, Simple, Focused)
            ========================================================================= */}
        <div className="bg-[#FFFFFF] rounded-3xl border border-[#D9E8F8] shadow-sm p-6 sm:p-10 mb-14">
          {isSubscribed ? (
            /* Success Feedback */
            <div className="text-center py-6 sm:py-8 space-y-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-xs ring-4 ring-emerald-50">
                <Check className="w-8 h-8 stroke-[2.5]" />
              </div>

              <h2 className="text-2xl font-extrabold text-[#172B4D]">
                {t.successTitle}
              </h2>

              <p className="text-xs sm:text-sm text-[#647DA5] max-w-lg mx-auto leading-relaxed">
                {t.successDesc(
                  name,
                  `${selectedSignObj.label[lang] || selectedSignObj.label.pt}`,
                  email
                )}
              </p>

              <div className="p-4 rounded-2xl bg-[#E4F1FF]/50 border border-[#D9E8F8] max-w-md mx-auto text-xs text-[#3982C8] font-semibold text-center">
                <span>{t.successSub}</span>
              </div>

              <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={onNavigateToBlog}
                  className="px-6 py-2.5 rounded-full bg-[#3982C8] hover:bg-[#E73578] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  {t.readSignPostsNow}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubscribed(false);
                    setEmail('');
                    setName('');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#E4F1FF] hover:bg-[#D9E8F8] text-[#17366F] text-xs font-bold transition-all cursor-pointer"
                >
                  {t.anotherEmail}
                </button>
              </div>
            </div>
          ) : (
            /* Simple 3-Field Subscription Form: Sign, Name, Email */
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-b border-[#D9E8F8] pb-4">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#172B4D] mb-1">
                  {t.formTitle}
                </h2>
                <p className="text-xs sm:text-sm text-[#647DA5]">
                  {t.formSubtitle}
                </p>
              </div>

              {/* Step 1: Zodiac Sign Selection */}
              <div>
                <label className="block text-xs font-bold text-[#172B4D] mb-2">
                  {t.signLabel} <span className="text-[#E73578]">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {zodiacSigns.map((s) => {
                    const isSelected = zodiacSign === s.value;
                    return (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => setZodiacSign(s.value)}
                        className={`flex items-center justify-center p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border text-center ${
                          isSelected
                            ? 'bg-[#E73578] text-white border-[#E73578] shadow-2xs scale-102'
                            : 'bg-[#E4F1FF] border-[#D9E8F8] text-[#3982C8] hover:border-[#E73578] hover:bg-[#E73578] hover:text-white'
                        }`}
                      >
                        <span className="truncate">
                          {(s.label[lang] || s.label.pt).split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2 & 3: Name and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-[#172B4D] mb-1.5">
                    {t.nameLabel}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.namePlaceholder}
                    className="w-full bg-white border border-[#D9E8F8] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#172B4D] placeholder-[#647DA5]/60 outline-none focus:ring-2 focus:ring-[#3982C8]/30 focus:border-[#3982C8] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#172B4D] mb-1.5">
                    {t.emailLabel} <span className="text-[#E73578]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      e.target.setCustomValidity(emailMessage(e.target.value, language));
                    }}
                    placeholder={t.emailPlaceholder}
                    className="w-full bg-white border border-[#D9E8F8] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#172B4D] placeholder-[#647DA5]/60 outline-none focus:ring-2 focus:ring-[#3982C8]/30 focus:border-[#3982C8] transition-all"
                  />
                </div>
              </div>

              <label className="flex cursor-pointer items-start gap-2.5 text-xs leading-snug text-[#172B4D]">
                <input type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#E73578]" />
                <span>{NEWSLETTER_CONSENT[consentLang]}</span>
              </label>
              {subError && (
                <p className="text-xs font-semibold text-[#E73578]">
                  {consentLang === 'pt' ? 'Não deu certo agora. Tente de novo em instantes.' : consentLang === 'es' ? 'No funcionó ahora. Inténtalo de nuevo en un momento.' : 'That did not work just now. Please try again in a moment.'}
                </p>
              )}

              {/* Submit CTA Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#E73578] hover:bg-[#D0306C] text-white text-sm font-bold shadow-lg shadow-[#E73578]/25 transition-all hover:scale-101 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{t.submitCta}</span>
                </button>
                <p className="text-center text-[11px] text-[#647DA5] mt-3">
                  {t.privacyNotice}
                </p>
              </div>
            </form>
          )}
        </div>

        {/* =========================================================================
            3 BENEFITS PILLARS (Clean, Simple Words)
            ========================================================================= */}
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#172B4D] text-center mb-8">
            {t.benefitsTitle}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="relative overflow-hidden rounded-2xl p-6 text-white shadow-md transition-transform hover:-translate-y-1" style={{ background: '#3982C8' }}>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 overflow-hidden opacity-60"><CoverArt tone="blue" variant={0} /></div>
              <div className="relative">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white" style={{ color: '#3982C8' }}>
                  <Star className="h-5 w-5" />
                </div>
                <h3 className="mb-1 text-base font-extrabold">{t.benefit1Title}</h3>
                <p className="mb-8 text-xs leading-relaxed text-white/90 sm:text-sm">{t.benefit1Desc}</p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl p-6 text-white shadow-md transition-transform hover:-translate-y-1" style={{ background: '#E73578' }}>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 overflow-hidden opacity-60"><CoverArt tone="pink" variant={1} /></div>
              <div className="relative">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white" style={{ color: '#E73578' }}>
                  <Heart className="h-5 w-5" />
                </div>
                <h3 className="mb-1 text-base font-extrabold">{t.benefit2Title}</h3>
                <p className="mb-8 text-xs leading-relaxed text-white/90 sm:text-sm">{t.benefit2Desc}</p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl p-6 text-white shadow-md transition-transform hover:-translate-y-1" style={{ background: '#3982C8' }}>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 overflow-hidden opacity-60"><CoverArt tone="blue" variant={2} /></div>
              <div className="relative">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white" style={{ color: '#3982C8' }}>
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="mb-1 text-base font-extrabold">{t.benefit3Title}</h3>
                <p className="mb-8 text-xs leading-relaxed text-white/90 sm:text-sm">{t.benefit3Desc}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Separate from the newsletter: the t-shirt coupon list */}
        <div className="mt-12"><TshirtCapture source="newsletter_page" /></div>
      </div>
    </div>
  );
};
