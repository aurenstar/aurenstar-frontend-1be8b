/**
 * Texts of the last screen of a story ("the hook"): a small pink label, a headline and one concrete promise of the article.
 * Only pt, es and en have the per-sign promise; other languages keep the headline the story already has.
 */
export const END_KICKER: Record<string, string> = { pt: 'Tem mais', es: 'Hay más', en: "There's more" };
export const END_HEADLINE: Record<string, (name: string) => string> = {
  pt: (n) => `Isso é só o começo de ${n}.`,
  es: (n) => `Esto es solo el comienzo de ${n}.`,
  en: (n) => `That's only the start of ${n}.`,
};
export const END_PROMISE: Record<string, (topic: string) => string> = {
  pt: (t) => `No artigo completo: ${t}.`,
  es: (t) => `En el artículo completo: ${t}.`,
  en: (t) => `In the full article: ${t}.`,
};
type Hook = [name: string, topic: string];
export const SIGN_HOOKS: Record<string, Record<string, Hook>> = {
  pt: {
    aries: ['Áries', 'o que está por trás da coragem e da pressa de Áries'], touro: ['Touro', 'o que há por trás da força e da teimosia de Touro'],
    gemeos: ['Gêmeos', 'o lado inquieto de Gêmeos que mais confunde'], cancer: ['Câncer', 'como a sensibilidade de Câncer aparece na carreira e na vida'],
    leao: ['Leão', 'o que realmente move a lealdade e o orgulho de Leão'], virgem: ['Virgem', 'o segredo que só Virgem entende'],
    libra: ['Libra', 'a explicação para o dilema de Libra'], escorpiao: ['Escorpião', 'por que Escorpião é tão enigmático'],
    sagitario: ['Sagitário', 'a liberdade com propósito de Sagitário'], capricornio: ['Capricórnio', 'por que Capricórnio é tão confiável'],
    aquario: ['Aquário', 'como Aquário une emoção e lógica'], peixes: ['Peixes', 'o lado forte de Peixes, muito além do sonho'],
  },
  es: {
    aries: ['Aries', 'lo que hay detrás del impulso y la franqueza de Aries'], touro: ['Tauro', 'qué hay detrás de la firmeza de Tauro'],
    gemeos: ['Géminis', 'qué hay detrás de Géminis'], cancer: ['Cáncer', 'por qué Cáncer siente tan profundo'],
    leao: ['Leo', 'qué mueve realmente a Leo'], virgem: ['Virgo', 'la contradicción de Virgo, explicada'],
    libra: ['Libra', 'el misterio de Libra, explicado'], escorpiao: ['Escorpio', 'qué oculta realmente Escorpio'],
    sagitario: ['Sagitario', 'la contradicción que encanta de Sagitario'], capricornio: ['Capricornio', 'por qué Capricornio es tan confiable'],
    aquario: ['Acuario', 'por qué Acuario piensa tan diferente'], peixes: ['Piscis', 'cómo Piscis va más allá del estereotipo'],
  },
  en: {
    aries: ['Aries', 'what drives Aries to start first'], touro: ['Taurus', 'what keeps Taurus so steady'],
    gemeos: ['Gemini', "what's behind Gemini's way of communicating"], cancer: ['Cancer', 'how Cancer makes everyone feel welcome'],
    leao: ['Leo', 'what really drives Leo to lead'], virgem: ['Virgo', 'why Virgo refines everything'],
    libra: ['Libra', 'how Libra brings people together'], escorpiao: ['Scorpio', 'what Scorpio investigates below the surface'],
    sagitario: ['Sagittarius', 'what pushes Sagittarius to always expand'], capricornio: ['Capricorn', 'what makes Capricorn build so patiently'],
    aquario: ['Aquarius', 'why Aquarius thinks so differently'], peixes: ['Pisces', 'what makes Pisces so inspiring'],
  },
};
