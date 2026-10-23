import React, { useState } from 'react';
import { X, Check, Copy, Share2, Sparkles, Download, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { StoryCardData, downloadStoryCard, shareStoryCardImage } from '../utils/generateStoryCard';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url?: string;
  image?: string;
  category?: string;
  storyCardData?: StoryCardData;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  title,
  url,
  image,
  category,
  storyCardData,
}) => {
  const { language } = useLanguage();
  const lang = (language || 'pt') as 'pt' | 'en' | 'es';

  const [copied, setCopied] = useState(false);
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);

  if (!isOpen) return null;

  const currentUrl =
    url || (typeof window !== 'undefined' ? window.location.href : 'https://aurenstar.com');

  const shareText = `✨ ${title} - Aurenstar (aurenstar.com)`;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownloadStoryImage = async () => {
    if (!storyCardData) return;
    setIsGeneratingCard(true);
    try {
      await downloadStoryCard(storyCardData);
    } catch {
      // Fallback
    } finally {
      setIsGeneratingCard(false);
    }
  };

  const handleNativeShare = async () => {
    if (storyCardData) {
      setIsGeneratingCard(true);
      try {
        const shared = await shareStoryCardImage(storyCardData);
        if (shared) return;
      } catch {
        // Fallback
      } finally {
        setIsGeneratingCard(false);
      }
    }

    if (navigator.share) {
      navigator
        .share({
          title,
          text: shareText,
          url: currentUrl,
        })
        .catch(() => {});
    }
  };

  const texts = {
    pt: {
      modalTitle: 'Compartilhar Leitura',
      modalSubtitle: 'Escolha onde você deseja compartilhar ou baixe o card para postar:',
      downloadCard: 'Baixar Imagem para Stories / Status',
      downloading: 'Gerando Card Cósmico...',
      storyTip: 'Perfeito para postar no Instagram Stories ou WhatsApp Status!',
      copyLink: 'Copiar Link',
      linkCopied: 'Link Copiado com Sucesso! ✨',
      nativeShare: 'Compartilhar direto no celular',
      close: 'Fechar',
      networks: {
        whatsapp: 'WhatsApp',
        facebook: 'Facebook',
        twitter: 'X (Twitter)',
        telegram: 'Telegram',
      },
    },
    en: {
      modalTitle: 'Share Reading',
      modalSubtitle: 'Choose where to share or download the card to post:',
      downloadCard: 'Download Image for Stories / Status',
      downloading: 'Creating Cosmic Card...',
      storyTip: 'Perfect to post on Instagram Stories or WhatsApp Status!',
      copyLink: 'Copy Link',
      linkCopied: 'Link Copied Successfully! ✨',
      nativeShare: 'Share directly from phone',
      close: 'Close',
      networks: {
        whatsapp: 'WhatsApp',
        facebook: 'Facebook',
        twitter: 'X (Twitter)',
        telegram: 'Telegram',
      },
    },
    es: {
      modalTitle: 'Compartir Lectura',
      modalSubtitle: 'Elige dónde compartir o descarga el card para publicar:',
      downloadCard: 'Descargar Imagen para Stories / Status',
      downloading: 'Generando Card Cósmico...',
      storyTip: '¡Ideal para publicar en Instagram Stories o WhatsApp Status!',
      copyLink: 'Copiar Enlace',
      linkCopied: '¡Enlace Copiado con Éxito! ✨',
      nativeShare: 'Compartir directo en el móvil',
      close: 'Cerrar',
      networks: {
        whatsapp: 'WhatsApp',
        facebook: 'Facebook',
        twitter: 'X (Twitter)',
        telegram: 'Telegram',
      },
    },
  };

  const t = texts[lang] || texts.pt;

  const socialNetworks = [
    {
      name: t.networks.whatsapp,
      color: 'bg-[#25D366] hover:bg-[#20bd5a] text-white',
      badgeColor: 'bg-[#25D366]/10 text-[#128C7E]',
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(
        `${shareText}\n${currentUrl}`
      )}`,
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      ),
    },
    {
      name: t.networks.facebook,
      color: 'bg-[#1877F2] hover:bg-[#166fe5] text-white',
      badgeColor: 'bg-[#1877F2]/10 text-[#1877F2]',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        currentUrl
      )}`,
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z" />
        </svg>
      ),
    },
    {
      name: t.networks.twitter,
      color: 'bg-[#0F1419] hover:bg-[#000000] text-white',
      badgeColor: 'bg-[#0F1419]/10 text-[#0F1419]',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        shareText
      )}&url=${encodeURIComponent(currentUrl)}`,
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: t.networks.telegram,
      color: 'bg-[#229ED9] hover:bg-[#1f8fc4] text-white',
      badgeColor: 'bg-[#229ED9]/10 text-[#229ED9]',
      href: `https://t.me/share/url?url=${encodeURIComponent(
        currentUrl
      )}&text=${encodeURIComponent(shareText)}`,
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.832.942z" />
        </svg>
      ),
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#FFFFFF] rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#D9E8F8] relative animate-scaleUp text-[#172B4D] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#647DA5] hover:text-[#172B4D] hover:bg-[#E4F1FF] transition-colors cursor-pointer"
          aria-label={t.close}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-4 pr-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E4F1FF] text-[#2878D0] text-xs font-bold uppercase tracking-wider mb-2 border border-[#D9E8F8]">
            <Share2 className="w-3.5 h-3.5" />
            <span>{t.modalTitle}</span>
          </div>
          <h3 className="text-xl font-extrabold text-[#172B4D] leading-tight">
            {title}
          </h3>
          <p className="text-xs text-[#647DA5] mt-1">{t.modalSubtitle}</p>
        </div>

        {/* =========================================================================
            VIRAL STORY CARD GENERATOR BUTTON (Divulgação Grátis Aurenstar)
            ========================================================================= */}
        {storyCardData && (
          <div className="mb-5 p-4 rounded-2xl bg-gradient-to-br from-[#17366F] via-[#2878D0] to-[#17366F] text-white shadow-md border border-[#2878D0]/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">📸</span>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#C9E5FF]">
                Story Instagram & WhatsApp
              </span>
            </div>
            <p className="text-xs text-[#E4F1FF] mb-3 leading-relaxed">
              {t.storyTip}
            </p>
            <button
              type="button"
              disabled={isGeneratingCard}
              onClick={handleDownloadStoryImage}
              className="w-full py-3 px-4 rounded-xl bg-[#F51B83] hover:bg-[#2878D0] text-white text-xs sm:text-sm font-extrabold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              <Download className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
              <span>{isGeneratingCard ? t.downloading : t.downloadCard}</span>
            </button>
          </div>
        )}

        {/* Article Preview if standard article */}
        {image && !storyCardData && (
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#E4F1FF] border border-[#D9E8F8] mb-5">
            <img
              src={image}
              alt={title}
              className="w-14 h-14 rounded-xl object-cover shrink-0 shadow-2xs"
            />
            <div className="min-w-0 flex-1">
              {category && (
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2878D0]">
                  {category}
                </span>
              )}
              <p className="text-xs font-bold text-[#172B4D] truncate leading-snug">
                {title}
              </p>
              <span className="text-[10px] text-[#647DA5] truncate block mt-0.5">
                aurenstar.com
              </span>
            </div>
          </div>
        )}

        {/* Social Networks Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4">
          {socialNetworks.map((net) => (
            <a
              key={net.name}
              href={net.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2.5 px-3.5 py-3 rounded-2xl font-bold text-xs sm:text-sm shadow-xs transition-all hover:scale-102 active:scale-98 cursor-pointer ${net.color}`}
            >
              <span className="shrink-0">{net.icon}</span>
              <span className="truncate">{net.name}</span>
            </a>
          ))}
        </div>

        {/* Copy Link Button */}
        <button
          type="button"
          onClick={handleCopyLink}
          className={`w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm border transition-all cursor-pointer shadow-xs ${
            copied
              ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
              : 'bg-[#FFFFFF] hover:bg-[#E4F1FF] border-[#D9E8F8] text-[#172B4D]'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
              <span>{t.linkCopied}</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-[#2878D0]" />
              <span>{t.copyLink}</span>
            </>
          )}
        </button>

        {/* Native Device Share Sheet */}
        {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
          <button
            type="button"
            onClick={handleNativeShare}
            className="w-full mt-2.5 text-center text-xs font-bold text-[#2878D0] hover:text-[#17366F] py-1 cursor-pointer transition-colors"
          >
            {t.nativeShare} →
          </button>
        )}
      </div>
    </div>
  );
};

