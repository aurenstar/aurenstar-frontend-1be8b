/** The exact sentence the visitor agrees to when ticking the box. Stored with the address as proof of consent. */
export const TSHIRT_CONSENT: Record<'pt' | 'en' | 'es', string> = {
  pt: 'Quero ser avisado(a) por e-mail quando as camisetas da Aurenstar forem lançadas. Só isso, sem spam.',
  en: 'I want to be told by e-mail when Aurenstar t-shirts launch. Only that, no spam.',
  es: 'Quiero que me avisen por correo cuando se lancen las camisetas de Aurenstar. Solo eso, sin spam.',
};

/** Newsletter: news and new articles from Aurenstar (a separate list from the t-shirts). */
export const NEWSLETTER_CONSENT: Record<'pt' | 'en' | 'es', string> = {
  pt: 'Quero receber por e-mail as novidades da Aurenstar (novos artigos e conteúdos). Sem spam, saio quando quiser.',
  en: 'I want to receive Aurenstar news by e-mail (new articles and content). No spam, I can leave anytime.',
  es: 'Quiero recibir por correo las novedades de Aurenstar (nuevos artículos y contenidos). Sin spam, salgo cuando quiera.',
};
