import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ScrollReveal } from './ScrollReveal';

interface FaqItem {
  question: {
    pt: string;
    en: string;
    es: string;
  };
  answer: {
    pt: string;
    en: string;
    es: string;
  };
}

const FAQS: FaqItem[] = [
  {
    question: { pt: 'É de graça?', en: 'Is it free?', es: '¿Es gratis?' },
    answer: { pt: 'Sim. Todas as ferramentas e os artigos são gratuitos. O site é mantido com anúncios.', en: 'Yes. All the tools and articles are free. The site is supported by ads.', es: 'Sí. Todas las herramientas y los artículos son gratis. El sitio se mantiene con anuncios.' },
  },
  {
    question: { pt: 'As leituras usam o céu de verdade?', en: 'Do the readings use the real sky?', es: '¿Las lecturas usan el cielo real?' },
    answer: { pt: 'Sim. Calculamos as posições reais dos astros com a sua data, hora e cidade de nascimento e depois explicamos o resultado em palavras simples.', en: 'Yes. We calculate the real positions of the planets from your birth date, time and city, then explain the result in simple words.', es: 'Sí. Calculamos las posiciones reales de los astros con tu fecha, hora y ciudad de nacimiento y luego explicamos el resultado con palabras sencillas.' },
  },
  {
    question: { pt: 'Preciso saber a hora exata em que nasci?', en: 'Do I need to know my exact birth time?', es: '¿Necesito saber la hora exacta en que nací?' },
    answer: { pt: 'Não é obrigatório, mas ajuda. Sem a hora exata, algumas partes do mapa, como o ascendente, ficam menos precisas. Se você tiver a certidão de nascimento, use a hora que está nela.', en: 'It is not required, but it helps. Without the exact time, some parts of the chart, like the rising sign, are less precise. If you have your birth certificate, use the time on it.', es: 'No es obligatorio, pero ayuda. Sin la hora exacta, algunas partes de la carta, como el ascendente, son menos precisas. Si tienes tu certificado de nacimiento, usa la hora que aparece en él.' },
  },
  {
    question: { pt: 'O que vocês fazem com os meus dados?', en: 'What do you do with my details?', es: '¿Qué hacen con mis datos?' },
    answer: { pt: 'Usamos o seu nome, a data, a hora e a cidade só para criar o seu resultado. Eles ficam guardados no seu aparelho para você não precisar digitar de novo, e você apaga tudo no link “Esquecer meus dados”, no rodapé. Não vendemos os seus dados. Veja a Política de Privacidade.', en: 'We use your name, date, time and city only to create your result. They are kept on your own device so you do not have to type them again, and you can erase everything with the “Forget my details” link in the footer. We do not sell your data. See the Privacy Policy.', es: 'Usamos tu nombre, fecha, hora y ciudad solo para crear tu resultado. Se guardan en tu propio dispositivo para que no tengas que escribirlos otra vez, y puedes borrarlo todo con el enlace “Olvidar mis datos” del pie de página. No vendemos tus datos. Consulta la Política de Privacidad.' },
  },
  {
    question: { pt: 'Por que a leitura não muda se eu pedir de novo?', en: 'Why does my reading not change if I ask again?', es: '¿Por qué mi lectura no cambia si la pido otra vez?' },
    answer: { pt: 'Cada leitura vale por um tempo: a Mensagem do dia muda a cada 24 horas e outras ferramentas, a cada poucas horas. Se você pedir de novo antes disso, mostramos a que você já recebeu, para o texto não ficar repetido nem confuso.', en: 'Each reading lasts for a while: the daily message changes every 24 hours and other tools every few hours. If you ask again before that, we show the one you already got, so the text is not repeated or confusing.', es: 'Cada lectura dura un tiempo: el mensaje diario cambia cada 24 horas y otras herramientas, cada pocas horas. Si la pides otra vez antes, te mostramos la que ya recibiste, para que el texto no se repita ni confunda.' },
  },
  {
    question: { pt: 'Vocês vão lançar camisetas?', en: 'Are you launching t-shirts?', es: '¿Van a lanzar camisetas?' },
    answer: { pt: 'Sim, estão a caminho. As 50 primeiras pessoas da lista ganham um cupom de desconto no lançamento. Basta entrar na lista pela caixinha que aparece nas páginas do site. Só avisamos do lançamento.', en: 'Yes, they are on the way. The first 50 people on the list get a launch discount coupon. Just join the list with the sign-up box that appears on the site\'s pages. We only write about the launch.', es: 'Sí, están en camino. Las primeras 50 personas de la lista reciben un cupón de descuento en el lanzamiento. Solo tienes que entrar en la lista con el cuadro que aparece en las páginas del sitio. Solo avisamos del lanzamiento.' },
  },
  {
    question: { pt: 'Em quais idiomas o site funciona?', en: 'Which languages does the site work in?', es: '¿En qué idiomas funciona el sitio?' },
    answer: { pt: 'Em português, inglês e espanhol. O site também pode ser traduzido para outros idiomas.', en: 'In Portuguese, English and Spanish. The site can also be translated into other languages.', es: 'En portugués, inglés y español. El sitio también se puede traducir a otros idiomas.' },
  },
  {
    question: { pt: 'Astrologia é previsão do futuro?', en: 'Is astrology a prediction of the future?', es: '¿La astrología es una predicción del futuro?' },
    answer: { pt: 'Não. Nosso conteúdo é para reflexão e autoconhecimento. Ele não garante resultados e não substitui orientação médica, financeira ou jurídica.', en: 'No. Our content is for reflection and self-knowledge. It does not guarantee results and does not replace medical, financial or legal advice.', es: 'No. Nuestro contenido es para reflexión y autoconocimiento. No garantiza resultados ni sustituye el consejo médico, financiero o legal.' },
  },
  {
    question: { pt: 'Como falo com vocês?', en: 'How do I contact you?', es: '¿Cómo hablo con ustedes?' },
    answer: { pt: 'Pela página de Contato, no menu do site. Respondemos por e-mail.', en: 'Through the Contact page in the site menu. We reply by email.', es: 'Por la página de Contacto, en el menú del sitio. Respondemos por correo.' },
  },
];

export const FaqSection: React.FC = () => {
  const { language } = useLanguage();
  const lang = (language || 'pt') as 'pt' | 'en' | 'es';
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const titles = {
    pt: {
      badge: 'PERGUNTAS FREQUENTES',
      heading: 'Perguntas Comuns sobre a Aurenstar',
      subheading:
        'Respostas simples para as dúvidas mais comuns.',
    },
    en: {
      badge: 'FREQUENT QUESTIONS',
      heading: 'Common Questions about Aurenstar',
      subheading:
        'Simple answers to the most common questions.',
    },
    es: {
      badge: 'PREGUNTAS FRECUENTES',
      heading: 'Preguntas Frecuentes sobre Aurenstar',
      subheading:
        'Respuestas sencillas a las dudas más comunes.',
    },
  };

  const t = titles[lang] || titles.pt;

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="w-full bg-[#C9E5FF] py-14 sm:py-16 select-none">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header com fade-in e slide-up */}
        <ScrollReveal delay={0} distance={20} duration={750}>
          <div className="text-center mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E4F1FF] border border-[#3982C8]/30 text-[#3982C8] text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-3">
              <HelpCircle className="w-3.5 h-3.5 text-[#3982C8]" />
              <span>{t.badge}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172B4D] tracking-tight mb-3">
              {t.heading}
            </h2>
            <p className="text-xs sm:text-sm text-[#647DA5] max-w-xl mx-auto leading-relaxed font-medium">
              {t.subheading}
            </p>
          </div>
        </ScrollReveal>

        {/* Accordion List com animação de fade-in e slide-up escalonado */}
        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <ScrollReveal
                key={`faq-${index}`}
                delay={index * 60}
                distance={20}
                duration={700}
              >
                <div
                  className={`bg-[#FFFFFF] border rounded-2xl overflow-hidden transition-all duration-200 shadow-2xs ${
                    isOpen
                      ? 'border-[#3982C8] shadow-sm'
                      : 'border-[#D9E8F8] hover:border-[#3982C8]/40'
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4 text-left cursor-pointer focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 transition-colors ${
                          isOpen ? 'bg-[#3982C8]' : 'bg-[#D9E8F8]'
                        }`}
                      />
                      <span className="font-bold text-xs sm:text-sm text-[#172B4D]">
                        {faq.question[lang] || faq.question.pt}
                      </span>
                    </div>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen
                          ? 'bg-[#E4F1FF] text-[#3982C8] rotate-180'
                          : 'bg-[#E4F1FF] text-[#647DA5]'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-[#647DA5] leading-relaxed border-t border-[#D9E8F8] animate-fadeIn">
                      <p>{faq.answer[lang] || faq.answer.pt}</p>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
