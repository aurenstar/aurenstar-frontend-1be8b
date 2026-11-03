import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Check,
  Download,
  Link2,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { AURENSTAR_AVATAR } from '../data/blogArticles';
import { AurenEffectResult } from '../utils/aurenEngine';
import { StoryCardData, downloadStoryCard, downloadVerticalStoryCard } from '../utils/generateStoryCard';

interface AurenEffectResultPageProps {
  onBackToForm: () => void;
  onBackToHome: () => void;
  onNavigateToBlog: () => void;
}

const LAST_RESULT_KEY = 'aurenstar_effect_last_result_v6';

export const AurenEffectResultPage: React.FC<AurenEffectResultPageProps> = ({
  onBackToForm,
  onNavigateToBlog,
}) => {
  const { language } = useLanguage();
  const lang = (language || 'pt') as 'pt' | 'en' | 'es';

  // Carrega resultado salvo
  const [result] = useState<AurenEffectResult | null>(() => {
    try {
      const saved = localStorage.getItem(LAST_RESULT_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return null;
  });

  const [isGeneratingCard, setIsGeneratingCard] = useState(false);
  const [cardSuccess, setCardSuccess] = useState(false);
  const [isGeneratingVerticalStory, setIsGeneratingVerticalStory] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Títulos inspiradores e diretos de cada signo
  const INTRIGUING_TITLES: Record<
    string,
    { pt: string; en: string; es: string }
  > = {
    aries: {
      pt: 'Áries e sua coragem viva de dar o primeiro passo',
      en: 'Aries and the living courage to take the first step',
      es: 'Aries y la valentía serena de dar el primer paso',
    },
    touro: {
      pt: 'Touro e a tranquilidade de valorizar seu próprio ritmo',
      en: 'Taurus and the quiet bliss of honoring your own pace',
      es: 'Tauro y la tranquilidad de respetar tu propio ritmo',
    },
    gemeos: {
      pt: 'Gêmeos e sua criatividade e inteligência de se reinventar',
      en: 'Gemini and the creative brilliance of reinventing yourself',
      es: 'Géminis y su creatividad e inteligencia para reinventarse',
    },
    cancer: {
      pt: 'Câncer e o poder do afeto de transformar o seu dia',
      en: 'Cancer and the gentle warmth that brightens your day',
      es: 'Cáncer y el cariño profundo que transforma tu día',
    },
    leao: {
      pt: 'Leão e a força do seu brilho para iluminar quem está por perto',
      en: 'Leo and the uplifting radiant energy that inspires others',
      es: 'Leo y la calidez de brillar e inspirar a los demás',
    },
    virgem: {
      pt: 'Virgem e a sabedoria de cuidar dos detalhes com leveza',
      en: 'Virgo and the quiet wisdom of enjoying details with ease',
      es: 'Virgo y la sabiduría de cuidar los detalhes com calma',
    },
    libra: {
      pt: 'Libra e a harmonia de escolher a sua paz de espírito',
      en: 'Libra and the heartfelt grace of choosing peace of mind',
      es: 'Libra y la serenidad de elegir tu propia paz interior',
    },
    escorpiao: {
      pt: 'Escorpião e a força silenciosa de se transformar por dentro',
      en: 'Scorpio and the inner power of quiet transformation',
      es: 'Escorpio y la fuerza silenciosa de renovarte por dentro',
    },
    sagitario: {
      pt: 'Sagitário e o entusiasmo de enxergar o lado bom da vida',
      en: 'Sagittarius and the joyful wonder of discovering good things',
      es: 'Sagitario y el entusiasmo de disfrutar lo bueno de la vida',
    },
    capricornio: {
      pt: 'Capricórnio e a determinação de construir vitórias com paciência',
      en: 'Capricorn and the patient determination that builds success',
      es: 'Capricornio y la constancia de avanzar paso a paso',
    },
    aquario: {
      pt: 'Aquário e as ideias originais para renovar a sua rotina',
      en: 'Aquarius and the inventive ideas to refresh your daily rhythm',
      es: 'Acuario y las ideas originales que renuevan tu rutina',
    },
    peixes: {
      pt: 'Peixes e a sensibilidade de ouvir a sua intuição com calma',
      en: 'Pisces and the delicate beauty of trusting your intuition',
      es: 'Piscis y la sensibilidad de escuchar tu intuición con paz',
    },
  };

  const normalizeSignKey = (name?: string) => {
    if (!name) return 'gemeos';
    const clean = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
    if (clean.includes('arie')) return 'aries';
    if (clean.includes('tour')) return 'touro';
    if (clean.includes('geme')) return 'gemeos';
    if (clean.includes('canc')) return 'cancer';
    if (clean.includes('lea') || clean.includes('leo')) return 'leao';
    if (clean.includes('virg')) return 'virgem';
    if (clean.includes('libr')) return 'libra';
    if (clean.includes('escor')) return 'escorpiao';
    if (clean.includes('sagi')) return 'sagitario';
    if (clean.includes('capri')) return 'capricornio';
    if (clean.includes('aqua')) return 'aquario';
    if (clean.includes('peix') || clean.includes('pisc')) return 'peixes';
    return 'gemeos';
  };

  const displayName = result?.userName || 'Andriel';
  const signDisplayName = result?.astronomy?.sun?.sign || 'Gêmeos';
  const signSymbol = result?.astronomy?.sun?.symbol || '♊';
  const signKey = normalizeSignKey(result?.astronomy?.sun?.sign);

  const curiousTitle =
    INTRIGUING_TITLES[signKey]?.[lang] ||
    (result?.affirmation || INTRIGUING_TITLES.gemeos.pt);

  const signTheme =
    result?.routineTrigger?.dominantVibe ||
    (lang === 'pt' ? 'Curiosidade e Leveza Mental' : lang === 'es' ? 'Curiosidad y Calma Mental' : 'Curiosity and Mental Ease');

  const practicalAdvice =
    result?.question2Answer ||
    (result?.practicalSteps && result?.practicalSteps[0]?.action) ||
    (lang === 'pt'
      ? 'Faça uma pausa de 5 minutos sem celular para respirar fundo e relaxar a mente.'
      : lang === 'es'
      ? 'Haz una pausa de 5 minutos sin celular para respirar profundo y relajar la mente.'
      : 'Take a 5-minute break without your phone to breathe deeply and quiet your mind.');

  const handleDownloadCard = async () => {
    if (!result) return;
    setIsGeneratingCard(true);
    try {
      const storyData: StoryCardData = {
        userName: displayName,
        signName: signDisplayName,
        signSymbol: signSymbol,
        signTheme: signTheme,
        title: curiousTitle,
        affirmation: result.affirmation || '',
        message: result.question1Answer,
        advice: practicalAdvice,
      };
      await downloadStoryCard(storyData);
      setCardSuccess(true);
      setTimeout(() => setCardSuccess(false), 3000);
    } catch (err) {
      console.error('Erro ao gerar card:', err);
    } finally {
      setIsGeneratingCard(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      const url = typeof window !== 'undefined' ? window.location.href : '';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = url;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (err) {
      console.error('Erro ao copiar link:', err);
    }
  };

  if (!result) {
    return (
      <div className="w-full bg-[#C9E5FF] min-h-screen pt-28 pb-20 select-none animate-fadeIn text-[#172B4D] relative overflow-hidden">
        {/* Ambient background decoration */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#E4F1FF]/80 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center py-16 bg-[#FFFFFF] rounded-3xl border border-[#D9E8F8] shadow-md relative z-10">
          <div className="text-4xl mb-3">✨</div>
          <h2 className="text-2xl font-black text-[#172B4D] mb-2">
            Nenhum Efeito Auren gerado ainda
          </h2>
          <p className="text-sm text-[#647DA5] mb-6">
            Preencha seus dados simples para gerar sua mensagem e conselho de hoje!
          </p>
          <button
            type="button"
            onClick={onBackToForm}
            className="px-6 py-3.5 rounded-2xl bg-[#2878D0] text-white font-extrabold text-sm hover:bg-[#17366F] transition-all cursor-pointer shadow-sm"
          >
            Preencher Dados Agora
          </button>
        </div>
      </div>
    );
  }

  const originUrl = typeof window !== 'undefined' ? window.location.origin : 'https://aurenstar.com';
  const whatsappText = encodeURIComponent(
    `✨ *Leitura do Efeito Auren de ${displayName}* (${signDisplayName}):\n\n"${curiousTitle}"\n\n"${result.question1Answer}"\n\nDescubra a sua também em: ${originUrl}`
  );
  const whatsappUrl = `https://api.whatsapp.com/send?text=${whatsappText}`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `✨ Efeito Auren de ${displayName} no @aurenstar: "${curiousTitle}"`
  )}&url=${encodeURIComponent(originUrl)}`;

  const handleDownloadVerticalStory = async () => {
    setIsGeneratingVerticalStory(true);
    try {
      const verticalData: StoryCardData = {
        userName: result?.userName || 'Andriel',
        signName: result?.astronomy?.sun?.sign || '',
        signSymbol: result?.astronomy?.sun?.symbol || '✦',
        signTheme: result?.routineTrigger?.dominantVibe || '',
        title: result?.routineTrigger?.primaryCause || '',
        affirmation: result?.affirmation || '',
        message: result?.question1Answer || '',
        advice: result?.practicalSteps?.[0] ? `${result.practicalSteps[0].title}. ${result.practicalSteps[0].action}` : result?.question2Answer || '',
        lang,
      };
      await downloadVerticalStoryCard(verticalData);
    } finally {
      setIsGeneratingVerticalStory(false);
    }
  };

  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(originUrl)}`;

  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const monthName = monthNames[now.getMonth()];
  const yearShort = String(now.getFullYear()).slice(-2);
  const currentTimeStr = `${hours}:${minutes} · ${day} ${monthName} ${yearShort}`;

  const texts = {
    pt: {
      backHome: 'Voltar ao Início',
      exploreBlog: 'Ver Artigos do Blog',
      readingTitle: `Efeito Auren de ${displayName}`,
      cardTitle: 'Tema da Mensagem',
      adviceTitle: 'Dica Prática do Dia',
      adviceSub: '• Para a sua rotina hoje',
      readyToPost: 'PRONTO PARA POSTAR',
      cardMessageTitle: 'Card da Mensagem',
      statusPill: 'Stories & Status',
      downloadBtn: 'Baixar Card',
      copyLinkBtn: 'Copiar Link',
      linkCopied: 'Link copiado!',
      accessBlog: 'Acessar o Blog',
      recalculateLink: '← Deseja alterar seus dados ou calcular novamente? Clique aqui',
    },
    en: {
      backHome: 'Back to Home',
      exploreBlog: 'Explore Blog Posts',
      readingTitle: `Auren Effect for ${displayName}`,
      cardTitle: 'Message Theme',
      adviceTitle: 'Practical Daily Tip',
      adviceSub: '• For your daily routine',
      readyToPost: 'READY TO SHARE',
      cardMessageTitle: 'Story Card',
      statusPill: 'Stories & Status',
      downloadBtn: 'Download Card',
      copyLinkBtn: 'Copy Link',
      linkCopied: 'Link copied!',
      accessBlog: 'Explore Blog Posts',
      recalculateLink: '← Wish to update your details or calculate again? Click here',
    },
    es: {
      backHome: 'Volver al Inicio',
      exploreBlog: 'Ver Artículos del Blog',
      readingTitle: `Efecto Auren de ${displayName}`,
      cardTitle: 'Tema del Mensaje',
      adviceTitle: 'Consejo Práctico del Día',
      adviceSub: '• Para tu rutina hoy',
      readyToPost: 'LISTO PARA COMPARTIR',
      cardMessageTitle: 'Card del Mensaje',
      statusPill: 'Stories & Status',
      downloadBtn: 'Descargar Card',
      copyLinkBtn: 'Copiar Enlace',
      linkCopied: '¡Enlace copiado!',
      accessBlog: 'Ir al Blog',
      recalculateLink: '← ¿Deseas modificar tus datos o calcular de nuevo? Haz clic aquí',
    },
  };

  const t = texts[lang] || texts.pt;

  return (
    <div className="w-full bg-[#C9E5FF] min-h-screen pt-24 sm:pt-28 pb-24 select-none animate-fadeIn text-[#172B4D] relative overflow-hidden">
      {/* Ambient background decoration */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#E4F1FF]/80 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Navigation Breadcrumbs Bar */}
        <div className="flex items-center justify-between mb-6 pb-2">
          <button
            type="button"
            onClick={onBackToForm}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E4F1FF] hover:bg-[#F51B83] text-xs sm:text-sm font-bold text-[#2878D0] hover:text-white border border-[#D9E8F8] hover:border-[#F51B83] shadow-2xs transition-all cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-[#2878D0]" />
            <span>Fazer Novo Cálculo</span>
          </button>

          <button
            type="button"
            onClick={onNavigateToBlog}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E4F1FF] hover:bg-[#F51B83] text-xs sm:text-sm font-bold text-[#2878D0] hover:text-white border border-[#D9E8F8] hover:border-[#F51B83] transition-all cursor-pointer"
          >
            <span>{t.exploreBlog}</span>
            <span>→</span>
          </button>
        </div>

        {/* =========================================================================
            CARD 1: PRINCIPAL COSMIC READING CARD (Identical to image_0f678e61.png)
            ========================================================================= */}
        <div className="bg-[#FFFFFF] rounded-3xl border border-[#D9E8F8] shadow-md hover:shadow-lg transition-all p-6 sm:p-10 mb-8 relative overflow-hidden">
          {/* Subtle top glow bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#2878D0]" />

          {/* Header da Leitura: Título e Signo em Destaque */}
          <div className="text-center pb-6 mb-6 border-b border-[#D9E8F8]">
            {/* Glyph Orb */}
            <div className="w-14 h-14 mx-auto mb-3.5 rounded-2xl bg-[#2878D0] text-white flex items-center justify-center text-2xl font-black shadow-md shadow-[#2878D0]/25">
              {signSymbol}
            </div>

            {/* Título Principal */}
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#172B4D] tracking-tight mb-2 leading-tight">
              {t.readingTitle}
            </h1>

          </div>

          {/* Caixa de Destaque com Título da Mensagem */}
          <div className="my-6 p-6 sm:p-7 rounded-2xl bg-[#F7FBFF] border border-[#D9E8F8] text-center space-y-3 shadow-2xs relative">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E4F1FF] text-[#2878D0] text-[11px] font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-[#F51B83]" />
              <span>{t.cardTitle}</span>
            </div>

            <h2 className="text-lg sm:text-2xl font-black text-[#172B4D] leading-snug tracking-tight max-w-xl mx-auto">
              {curiousTitle}
            </h2>
          </div>

          {/* Texto da Mensagem Diária (Linguagem Simples e Agradável) */}
          <div className="mb-5 bg-[#FFFFFF] rounded-2xl p-4 sm:p-6 border border-[#D9E8F8] shadow-2xs">
            <p className="text-base sm:text-lg text-[#172B4D] leading-relaxed font-normal whitespace-pre-line">
              {result.question1Answer}
            </p>
          </div>

          {/* Dica Prática para Você Hoje */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#E4F1FF]/40 border border-[#D9E8F8] space-y-2.5 transition-all">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#2878D0] bg-[#E4F1FF] px-2.5 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3 text-[#F51B83]" />
                <span>{t.adviceTitle}</span>
              </span>
              <span className="text-xs text-[#647DA5]">
                {t.adviceSub}
              </span>
            </div>
            <p className="text-sm sm:text-base text-[#172B4D] font-semibold leading-relaxed">
              {practicalAdvice}
            </p>
            {result?.practicalSteps && result.practicalSteps.length > 0 && (
              <ol className="mt-4 space-y-3">
                {result.practicalSteps.map((step) => (
                  <li key={step.stepNumber} className="flex gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#2878D0] text-xs font-bold text-white">
                      {step.stepNumber}
                    </span>
                    <span className="text-sm sm:text-[15px] leading-relaxed text-[#172B4D]">
                      <strong className="font-bold">{step.title}.</strong> {step.action}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>

        {/* =========================================================================
            CARD 2: CARD DE COMPARTILHAMENTO (Identical to image_e63d7ad9.png)
            ========================================================================= */}
        <div className="rounded-2xl bg-[#FFFFFF] border border-[#D9E8F8] p-5 sm:p-6 shadow-xs space-y-4 transition-all mb-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#2878D0]">
                {t.readyToPost}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#172B4D] mt-0.5">
                {t.cardMessageTitle}
              </h2>
            </div>
            <span className="text-[10px] font-semibold text-[#2878D0] bg-[#E4F1FF] px-2.5 py-1 rounded-full border border-[#D9E8F8]">
              {t.statusPill}
            </span>
          </div>

          {/* Pré-visualização do Card */}
          <div className="rounded-[28px] border border-[#D9E8F8] bg-[#FFFFFF] p-6 sm:p-8 shadow-xs text-left transition-all">
            {/* Topo do Card: Avatar, Nome com Selo e Três Pontinhos */}
            <div className="flex items-start justify-between mb-4 sm:mb-5">
              <div className="flex items-center gap-3.5">
                <img src={AURENSTAR_AVATAR} alt="Aurenstar" className="w-12 h-12 rounded-full object-cover shrink-0 border border-[#D9E8F8] bg-white shadow-xs" />
                <div>
                  <div className="flex items-center gap-1.5 leading-tight">
                    <span className="font-bold text-base sm:text-[17px] text-[#172B4D]">
                      Aurenstar
                    </span>
                    <span aria-label="Verificado" title="Perfil verificado" className="w-4 h-4 rounded-full bg-[#2878D0] text-white flex items-center justify-center shrink-0">
                      <Check className="h-2.5 w-2.5" strokeWidth={3} />
                    </span>
                  </div>
                  <span className="text-xs sm:text-[13px] text-[#647DA5] block leading-tight mt-0.5">
                    @aurenstar · aurenstar.com
                  </span>
                </div>
              </div>
              <span className="text-xl text-[#647DA5] font-bold tracking-widest cursor-default select-none">
                ···
              </span>
            </div>

            {/* Título da Mensagem em Azul Destacado */}
            {curiousTitle && (
              <h3 className="text-[#2878D0] font-bold text-base sm:text-[18px] leading-snug mb-2.5">
                {curiousTitle}
              </h3>
            )}

            {/* Mensagem Principal do Dia */}
            <p className="text-xs sm:text-[15px] text-[#172B4D] leading-relaxed whitespace-pre-line mb-3 sm:mb-3.5">
              {result.question1Answer}
            </p>

            {/* Rodapé: Horário, Data e Link */}
            <div className="text-xs sm:text-[13px] text-[#647DA5]">
              <span>{currentTimeStr} · aurenstar.com</span>
            </div>
          </div>

          {/* Botões de Ação do Card: Estilo Cápsula/Pill Minimalista */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap items-center justify-center gap-2 pt-2 border-t border-[#D9E8F8]">
            {/* Baixar Card */}
            <button
              type="button"
              onClick={handleDownloadCard}
              disabled={isGeneratingCard}
              className="w-full lg:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full bg-[#2878D0] hover:bg-[#17366F] text-white font-medium text-xs border border-[#2878D0] transition-all cursor-pointer disabled:opacity-50 shadow-2xs hover:shadow-xs active:scale-95"
              title="Baixar imagem em PNG"
            >
              <Download className="w-3.5 h-3.5 shrink-0" />
              <span>
                {isGeneratingCard
                  ? 'Gerando...'
                  : cardSuccess
                  ? 'Baixado! ✨'
                  : t.downloadBtn}
              </span>
            </button>

            {/* Baixar Story 9:16 */}
            <button
              type="button"
              onClick={handleDownloadVerticalStory}
              disabled={isGeneratingVerticalStory}
              className="w-full lg:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full bg-[#F51B83] hover:bg-[#D91670] text-white font-medium text-xs border border-[#F51B83] transition-all cursor-pointer disabled:opacity-50 shadow-2xs hover:shadow-xs active:scale-95"
              title="Baixar formato vertical 9:16 para Stories"
            >
              <Download className="w-3.5 h-3.5 shrink-0" />
              <span>{isGeneratingVerticalStory ? 'Gerando...' : 'Baixar Story 9:16'}</span>
            </button>

            {/* Copiar Link */}
            <button
              type="button"
              onClick={handleCopyLink}
              className={`w-full lg:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full border font-medium text-xs transition-all cursor-pointer shadow-2xs active:scale-95 ${
                copiedLink
                  ? 'bg-[#E4F1FF] text-[#2878D0] border-[#2878D0]'
                  : 'bg-white hover:bg-[#E4F1FF] border-[#D9E8F8] hover:border-[#2878D0] text-[#172B4D]'
              }`}
              title="Copiar link da página"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#2878D0] shrink-0" />
                  <span>{t.linkCopied}</span>
                </>
              ) : (
                <>
                  <Link2 className="w-3.5 h-3.5 text-[#2878D0] shrink-0" />
                  <span>{t.copyLinkBtn}</span>
                </>
              )}
            </button>

            {/* WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full lg:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full border border-[#D9E8F8] bg-[#E4F1FF] hover:bg-[#F51B83] text-[#2878D0] hover:text-white hover:border-[#F51B83] font-medium text-xs transition-all cursor-pointer shadow-2xs active:scale-95"
              title="Compartilhar no WhatsApp"
            >
              <svg className="w-3.5 h-3.5 fill-current shrink-0 text-[#25D366]" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              <span>WhatsApp</span>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full lg:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full border border-[#D9E8F8] bg-white hover:bg-[#E4F1FF] text-[#172B4D] hover:text-[#E1306C] hover:border-[#2878D0] font-medium text-xs transition-all cursor-pointer shadow-2xs active:scale-95"
              title="Abrir o Instagram"
            >
              <svg className="w-3.5 h-3.5 fill-current shrink-0 text-[#E1306C]" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.162c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              <span>Instagram</span>
            </a>

            {/* Facebook */}
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full lg:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full border border-[#D9E8F8] bg-[#E4F1FF] hover:bg-[#F51B83] text-[#2878D0] hover:text-white hover:border-[#F51B83] font-medium text-xs transition-all cursor-pointer shadow-2xs active:scale-95"
              title="Compartilhar no Facebook"
            >
              <svg className="w-3.5 h-3.5 fill-current shrink-0 text-[#1877F2]" viewBox="0 0 24 24">
                <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z" />
              </svg>
              <span>Facebook</span>
            </a>

            {/* X */}
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full lg:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full border border-[#D9E8F8] bg-white hover:bg-[#E4F1FF] text-[#172B4D] hover:text-[#0F1419] hover:border-[#2878D0] font-medium text-xs transition-all cursor-pointer shadow-2xs active:scale-95"
              title="Postar no X"
            >
              <svg className="w-3.5 h-3.5 fill-current shrink-0 text-[#0F1419]" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>X</span>
            </a>
          </div>
        </div>

        {/* Botão Azul: Acessar Blog (Identical to image_e63d7ad9.png) */}
        {onNavigateToBlog && (
          <div className="flex justify-center pt-1 pb-4">
            <button
              type="button"
              onClick={onNavigateToBlog}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#2878D0] hover:bg-[#17366F] text-white font-semibold text-xs sm:text-sm tracking-wide transition-all cursor-pointer shadow-xs hover:shadow-sm active:scale-95"
            >
              <span>{t.accessBlog}</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        )}

        {/* Botão de Rodapé para Atualizar ou Voltar ao Formulário */}
        <div className="text-center pt-2 pb-6">
          <button
            type="button"
            onClick={onBackToForm}
            className="text-xs sm:text-sm font-bold text-[#647DA5] hover:text-[#2878D0] transition-colors cursor-pointer"
          >
            {t.recalculateLink}
          </button>
        </div>

        {/* Transparência Ética Minimalista */}
        {result.transparencyNote && (
          <div className="pt-2 text-center">
            <p className="text-[11px] text-[#647DA5] leading-relaxed max-w-xl mx-auto flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2878D0] shrink-0" />
              <span>{result.transparencyNote}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

