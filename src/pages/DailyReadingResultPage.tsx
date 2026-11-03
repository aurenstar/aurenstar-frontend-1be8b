import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Share2,
  Copy,
  Check,
  Download,
  BookOpen,
  Clock,
  Heart,
  Star,
  ShieldCheck,
  MessageCircle,
  Repeat2,
  Bookmark,
  Calendar,
  Compass,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ShareModal } from '../components/ShareModal';
import { getSavedDailyReading, DailyReadingRecord } from '../utils/dailyReadingStorage';
import { downloadStoryCard, downloadVerticalStoryCard, StoryCardData } from '../utils/generateStoryCard';
import { AURENSTAR_AVATAR } from '../data/blogArticles';

interface DailyReadingResultPageProps {
  onBackToHome: () => void;
  onNavigateToBlog: () => void;
  onOpenArticle: (id: string) => void;
  onNavigateToForm: () => void;
}

export const DailyReadingResultPage: React.FC<DailyReadingResultPageProps> = ({
  onBackToHome,
  onNavigateToBlog,
  onOpenArticle,
  onNavigateToForm,
}) => {
  const { language } = useLanguage();
  const lang = (language || 'pt') as 'pt' | 'en' | 'es';

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [cardSuccess, setCardSuccess] = useState(false);
  const [isGeneratingVerticalStory, setIsGeneratingVerticalStory] = useState(false);

  // Retrieve today's saved reading or fallback
  const savedReading: DailyReadingRecord = getSavedDailyReading() || {
    userName: 'Andriel',
    signKey: 'gemeos',
    signName: 'Gêmeos',
    signSymbol: '♊',
    signTheme: 'Comunicação e Criatividade',
    birthDay: 15,
    birthMonth: 6,
    birthYear: 2000,
    birthTimePeriod: 'tarde',
    affirmation: 'Minha mente está cheia de boas ideias e meu coração está em paz.',
    message:
      'Gêmeos tem uma mente ágil e curiosa que adora aprender coisas novas. Hoje, uma conversa simples ou uma ideia diferente pode abrir portas no seu dia. Confie no seu bom humor e na sua capacidade de fazer amigos por onde passa.',
    advice: 'Mande uma mensagem carinhosa para uma pessoa que você não fala faz tempo.',
    articleId: 'post-gemeos',
    generatedDate: new Date().toISOString().split('T')[0],
  };

  const displayName = savedReading.userName || 'Andriel';
  const signDisplayName = savedReading.signName || 'Gêmeos';

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
      es: 'Virgo y la sabiduría de cuidar los detalles con calma',
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

  const curiousTitle =
    INTRIGUING_TITLES[savedReading.signKey || 'gemeos']?.[lang] ||
    INTRIGUING_TITLES.gemeos.pt;

  // What the person shows to others: the sign + a short first-person post about their day.
  const cardTitle = signDisplayName;
  const cardText = savedReading.shareText || savedReading.affirmation || savedReading.message;

  const storyData: StoryCardData = {
    userName: displayName,
    signName: signDisplayName,
    signSymbol: savedReading.signSymbol || '♊',
    signTheme: savedReading.signTheme,
    title: cardTitle,
    affirmation: savedReading.affirmation,
    message: cardText,
    advice: savedReading.advice,
    lang,
  };

  const handleDownloadStory = async () => {
    setIsGeneratingStory(true);
    try {
      await downloadStoryCard(storyData);
      setCardSuccess(true);
      setTimeout(() => setCardSuccess(false), 2500);
    } catch {
      // Error handling
    } finally {
      setIsGeneratingStory(false);
    }
  };

  const handleDownloadVerticalStory = async () => {
    setIsGeneratingVerticalStory(true);
    try {
      await downloadVerticalStoryCard(storyData);
    } finally {
      setIsGeneratingVerticalStory(false);
    }
  };

  const originUrl = typeof window !== 'undefined' ? window.location.origin : 'https://aurenstar.com';
  const shareText = `✨ ${cardTitle}:\n${cardText.slice(0, 240)}\n\nVeja a sua leitura diária gratuita em: ${originUrl}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(originUrl)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;

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
      badgeDailyLimit: 'Leitura Cósmica de Hoje • 1 Leitura por Dia',
      badgeStatus: 'Mensagem Ativa',
      readingTitle: 'Mensagem Diária Aurenstar',
      adviceTitle: 'Dica Prática para Você Hoje',
      downloadStoryBtn: 'Baixar Imagem para Stories & Status',
      downloading: 'Gerando Imagem em Alta Resolução...',
      shareSocialBtn: 'Compartilhar nas Redes Sociais',
      copyLinkBtn: 'Copiar Link da Leitura',
      linkCopied: 'Link Copiado com Sucesso! ✨',
      readSignArticle: `Ler Artigo Completo sobre ${signDisplayName}`,
      previewSectionTitle: 'Card Oficial para Stories & Redes Sociais',
      previewSectionSub:
        'Card automático com perfil da Aurenstar (@aurenstar) e o endereço oficial aurenstar.com pronto para você postar e divulgar!',
      timeString: '11:08',
      dateString: '05 Out 2026',
    },
    en: {
      backHome: 'Back to Home',
      exploreBlog: 'Explore Blog Posts',
      badgeDailyLimit: 'Today’s Cosmic Reading • 1 Reading per Day',
      badgeStatus: 'Active Reading',
      readingTitle: 'Aurenstar Daily Message',
      adviceTitle: 'Practical Tip for You Today',
      downloadStoryBtn: 'Download Image for Stories & Status',
      downloading: 'Generating High-Res Image...',
      shareSocialBtn: 'Share on Social Media',
      copyLinkBtn: 'Copy Reading Link',
      linkCopied: 'Link Copied Successfully! ✨',
      readSignArticle: `Read Full Article about ${signDisplayName}`,
      previewSectionTitle: 'Official Post Card for Stories & Socials',
      previewSectionSub:
        'Automatically generated card with @aurenstar profile and official link ready to share!',
      timeString: '11:08 AM',
      dateString: 'Oct 05, 2026',
    },
    es: {
      backHome: 'Volver al Inicio',
      exploreBlog: 'Ver Artículos del Blog',
      badgeDailyLimit: 'Lectura Cósmica de Hoy • 1 Lectura al Día',
      badgeStatus: 'Lectura Activa',
      readingTitle: 'Mensaje Diario Aurenstar',
      adviceTitle: 'Consejo Práctico para Ti Hoy',
      downloadStoryBtn: 'Descargar Imagen para Stories y Estado',
      downloading: 'Generando Imagen...',
      shareSocialBtn: 'Compartir en Redes Sociales',
      copyLinkBtn: 'Copiar Enlace de la Lectura',
      linkCopied: '¡Enlace Copiado con Éxito! ✨',
      readSignArticle: `Leer Artículo Completo sobre ${signDisplayName}`,
      previewSectionTitle: 'Card Oficial para Stories y Redes',
      previewSectionSub:
        '¡Card generado automáticamente con el perfil de Aurenstar (@aurenstar) y el enlace oficial!',
      timeString: '11:08',
      dateString: '05 Oct 2026',
    },
  };

  const t = texts[lang] || texts.pt;

  return (
    <div className="w-full bg-[#C9E5FF] min-h-screen pt-24 sm:pt-28 pb-20 select-none animate-fadeIn text-[#172B4D] relative overflow-hidden">
      {/* Ambient background decoration */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#E4F1FF]/80 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Navigation Breadcrumbs Bar */}
        <div className="flex items-center justify-between mb-6 pb-2">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E4F1FF] hover:bg-[#F51B83] text-xs sm:text-sm font-bold text-[#2878D0] hover:text-white border border-[#D9E8F8] hover:border-[#F51B83] shadow-2xs transition-all cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-[#2878D0]" />
            <span>{t.backHome}</span>
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
            CARD 1: PRINCIPAL COSMIC READING CARD (Layout Elegante e Acolhedor)
            ========================================================================= */}
        <div className="bg-[#FFFFFF] rounded-3xl border border-[#D9E8F8] shadow-md hover:shadow-lg transition-all p-6 sm:p-10 mb-8 relative overflow-hidden">
          {/* Subtle top glow bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#2878D0]" />

          {/* Caixa de Destaque com Título da Mensagem */}
          <div className="my-6 p-6 sm:p-7 rounded-2xl bg-[#F7FBFF] border border-[#D9E8F8] text-center space-y-3 shadow-2xs relative">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E4F1FF] text-[#2878D0] text-[11px] font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-[#F51B83]" />
              <span>Tema da Mensagem</span>
            </div>

            <h2 className="text-lg sm:text-2xl font-black text-[#172B4D] leading-snug tracking-tight max-w-xl mx-auto">
              {curiousTitle}
            </h2>
          </div>

          {/* Texto da Mensagem Diária (Linguagem Simples e Agradável) */}
          <div className="mb-5 bg-[#FFFFFF] rounded-2xl p-4 sm:p-6 border border-[#D9E8F8] shadow-2xs">
            <p className="text-base sm:text-lg text-[#172B4D] leading-relaxed font-normal">
              <span className="whitespace-pre-line">{savedReading.message}</span>
            </p>
          </div>

          {/* Dica Prática para Você Hoje */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#E4F1FF]/40 border border-[#D9E8F8] space-y-2.5 transition-all">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#2878D0] bg-[#E4F1FF] px-2.5 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3 text-[#F51B83]" />
                <span>Dica Prática do Dia</span>
              </span>
              <span className="text-xs text-[#647DA5]">
                • Para a sua rotina hoje
              </span>
            </div>
            <p className="text-sm sm:text-base text-[#172B4D] font-semibold leading-relaxed">
              {savedReading.advice}
            </p>
          </div>
        </div>

        {/* =========================================================================
            CARD DE COMPARTILHAMENTO
            ========================================================================= */}
        <div className="rounded-2xl bg-[#FFFFFF] border border-[#D9E8F8] p-5 sm:p-6 shadow-xs space-y-4 transition-all mb-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#2878D0]">
                PRONTO PARA POSTAR
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#172B4D] mt-0.5">
                Card da Mensagem
              </h2>
            </div>
            <span className="text-[10px] font-semibold text-[#2878D0] bg-[#E4F1FF] px-2.5 py-1 rounded-full border border-[#D9E8F8]">
              Stories & Status
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
                    <span translate="no" className="notranslate font-bold text-base sm:text-[17px] text-[#172B4D]">
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

            {/* Título da Mensagem em Azul Orkut Destacado */}
            <h3 className="text-[#2878D0] font-bold text-base sm:text-[18px] leading-snug mb-2.5">
              {cardTitle}:
            </h3>

            {/* Texto para mostrar aos outros (primeira pessoa) */}
            <p className="text-[15px] sm:text-[19px] text-[#172B4D] leading-relaxed whitespace-pre-line mb-3 sm:mb-3.5">
              {cardText}
            </p>

            {/* Rodapé: Horário, Data e Link */}
            <div className="text-xs sm:text-[13px] text-[#647DA5]">
              <span>{currentTimeStr} · aurenstar.com</span>
            </div>
          </div>

          {/* Botões de Ação do Card: Estilo Cápsula/Pill Minimalista */}
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-1.5 pt-2 border-t border-[#D9E8F8]">
            {/* Baixar Card */}
            <button
              type="button"
              onClick={handleDownloadStory}
              disabled={isGeneratingStory}
              className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-full bg-[#2878D0] hover:bg-[#17366F] text-white font-medium text-[11px] border border-[#2878D0] transition-all cursor-pointer disabled:opacity-50 shadow-2xs hover:shadow-xs active:scale-95"
              title="Baixar imagem em PNG"
            >
              <Download className="w-3 h-3 shrink-0" />
              <span>
                {isGeneratingStory
                  ? 'Gerando...'
                  : cardSuccess
                  ? 'Baixado! ✨'
                  : 'Baixar Card'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleDownloadVerticalStory}
              disabled={isGeneratingVerticalStory}
              className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-full bg-[#F51B83] hover:bg-[#D91670] text-white font-medium text-[11px] border border-[#F51B83] transition-all cursor-pointer disabled:opacity-50 shadow-2xs hover:shadow-xs active:scale-95"
              title="Baixar formato vertical 9:16 para Stories"
            >
              <Download className="w-3 h-3 shrink-0" />
              <span>{isGeneratingVerticalStory ? 'Gerando...' : 'Baixar Story 9:16'}</span>
            </button>

            {/* WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-full border border-[#D9E8F8] bg-[#E4F1FF] hover:bg-[#F51B83] text-[#2878D0] hover:text-white hover:border-[#F51B83] font-medium text-[11px] transition-all cursor-pointer shadow-2xs active:scale-95"
              title="Compartilhar no WhatsApp"
            >
              <svg className="w-3 h-3 fill-current shrink-0 text-[#25D366]" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              <span>WhatsApp</span>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-full border border-[#D9E8F8] bg-[#E4F1FF] hover:bg-[#F51B83] text-[#2878D0] hover:text-white hover:border-[#F51B83] font-medium text-[11px] transition-all cursor-pointer shadow-2xs active:scale-95"
              title="Abrir o Instagram"
            >
              <svg className="w-3 h-3 fill-current shrink-0 text-[#E1306C]" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.162c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              <span>Instagram</span>
            </a>

            {/* Facebook */}
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-full border border-[#D9E8F8] bg-[#E4F1FF] hover:bg-[#F51B83] text-[#2878D0] hover:text-white hover:border-[#F51B83] font-medium text-[11px] transition-all cursor-pointer shadow-2xs active:scale-95"
              title="Compartilhar no Facebook"
            >
              <svg className="w-3 h-3 fill-current shrink-0 text-[#1877F2]" viewBox="0 0 24 24">
                <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z" />
              </svg>
              <span>Facebook</span>
            </a>

            {/* X */}
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-full border border-[#D9E8F8] bg-[#E4F1FF] hover:bg-[#F51B83] text-[#2878D0] hover:text-white hover:border-[#F51B83] font-medium text-[11px] transition-all cursor-pointer shadow-2xs active:scale-95"
              title="Postar no X"
            >
              <svg className="w-3 h-3 fill-current shrink-0 text-[#0F1419]" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>X</span>
            </a>
          </div>
        </div>

        {/* Botão Azul: Acessar Blog */}
        {onNavigateToBlog && (
          <div className="flex justify-center pt-1 pb-4">
            <button
              type="button"
              onClick={onNavigateToBlog}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#2878D0] hover:bg-[#17366F] text-white font-semibold text-xs sm:text-sm tracking-wide transition-all cursor-pointer shadow-xs hover:shadow-sm active:scale-95"
            >
              <span>Acessar o Blog</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        )}

        {/* Botão de Rodapé para Atualizar ou Voltar ao Formulário */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onNavigateToForm}
            className="text-xs sm:text-sm font-bold text-[#647DA5] hover:text-[#2878D0] transition-colors cursor-pointer"
          >
            ← Deseja alterar seus dados ou calcular novamente? Clique aqui
          </button>
        </div>
      </div>

      {/* Share Modal with Card Generator */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={`Leitura diária de ${displayName} • ${signDisplayName}`}
        category={savedReading.signTheme}
        storyCardData={storyData}
      />
    </div>
  );
};

