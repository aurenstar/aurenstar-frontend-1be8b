import { validateTerm, slugify } from '../scripts/dictionary/checks';
import { ASTROLOGY_DICTIONARY_TERMS } from '../src/data/astrologyDictionaryData';

let failed = 0;
const ok = (name: string, cond: boolean) => { if (!cond) { failed++; console.log('FAIL', name); } else console.log('ok  ', name); };

const good: any = {
  id: 'what-is-a-transit', slug: 'what-is-a-transit', termo: 'Transit', tituloSEO: 'What Is a Transit in Astrology? Simple Guide',
  perguntaGoogle: 'What is a transit in astrology?', categoria: 'Phases & Movements', icone: '🚀',
  resumoUmaLinha: 'A transit is a planet moving through the sky today.',
  explicacaoEducativa: 'Learn what a transit is and how people use it to reflect on their days.',
  chamadaCuriosa: 'The sky keeps moving',
  oQueSignifica: 'A transit is a planet passing a spot in the sky. Think of a train passing a station. The station stays still. The train keeps moving. People watch the train to know what time it is.',
  oQueSignificaNaAstrologia: 'In astrology, a transit is when a planet today meets a spot in your birth chart. Astrologers say it can bring a theme to the front. It is a tool for reflection, not a promise.',
  exemploFicticio: 'Carlos reads that Mercury is crossing his work area this week. He decides to double check his emails. He feels calmer and finishes early.',
  dicaRapida: 'Use it as a question for yourself, not a rule.',
  miniJogo: { pergunta: 'What is a transit like?', opcoes: [{ texto: 'A train passing a station', correta: true, explicacao: 'Yes!' }, { texto: 'A fixed rule', correta: false, explicacao: 'No.' }] },
  faq: [{ pergunta: 'Is it science?', resposta: 'No, it is symbolic.' }, { pergunta: 'Must I believe?', resposta: 'No.' }],
};
const none: any[] = [];
ok('good term passes', validateTerm(good, none).length === 0);
ok('duplicate slug blocked', validateTerm(good, [{ id: 'x', slug: 'what-is-a-transit' }]).length > 0);
ok('AI mention blocked', validateTerm({ ...good, dicaRapida: 'This was written by an AI tool for you.' }, none).length > 0);
ok('medical claim blocked', validateTerm({ ...good, dicaRapida: 'This will cure your anxiety, guaranteed.' }, none).length > 0);
ok('two correct answers blocked', validateTerm({ ...good, miniJogo: { pergunta: 'q', opcoes: [{ texto: 'a', correta: true, explicacao: 'x' }, { texto: 'b', correta: true, explicacao: 'y' }] } }, none).length > 0);
ok('too short blocked', validateTerm({ ...good, oQueSignifica: 'Short.' }, none).length > 0);
ok('missing faq blocked', validateTerm({ ...good, faq: [] }, none).length > 0);
ok('bad category blocked', validateTerm({ ...good, categoria: 'Other' as any }, none).length > 0);
ok('slugify', slugify('What is a Saturn return?') === 'what-is-a-saturn-return');
const slugs = ASTROLOGY_DICTIONARY_TERMS.map((t) => t.slug);
ok('no duplicate slugs on site', new Set(slugs).size === slugs.length);
process.exit(failed ? 1 : 0);
