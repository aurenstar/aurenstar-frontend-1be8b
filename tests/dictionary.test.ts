import { validateTerm, slugify } from '../scripts/dictionary/checks';
import { conceptKey, toQuestion, categoryFor, foreignToQuestion, plannerPriority } from '../scripts/dictionary/demand';
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
// --- real-demand finder ---
{
  const t = (name: string, ok: boolean) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}`); if (!ok) failed++; };
  t('same idea gets the same key', conceptKey('What is a stellium in astrology?') === conceptKey('what is a stellium'));
  t('different idea gets a different key', conceptKey('what is a stellium in gemini') !== conceptKey('what is a stellium'));
  t('question is cleaned', toQuestion('what is a stellium in astrology') === 'What is a stellium in astrology?');
  t('meaning form becomes a question', toQuestion('chiron meaning astrology') === 'What does Chiron mean in astrology?');
  t('plural meaning grammar', toQuestion('zodiac signs meaning') === 'What are zodiac signs in astrology?' || toQuestion('zodiac signs meaning') === 'What do zodiac signs mean in astrology?');
  t('short term becomes a question', toQuestion('yod astrology') === 'What is a yod in astrology?');
  t('planet in sign', toQuestion('venus in leo') === 'What does Venus in Leo mean?');
  t('personal searches are skipped', toQuestion('what is my birth chart') === null);
  t('dangling word skipped', toQuestion('chiron and meaning') === null);
  t('portuguese becomes the english question', foreignToQuestion('o que significa mercúrio retrógrado') === 'What is mercury retrograde in astrology?');
  t('spanish planet in sign', foreignToQuestion('luna en escorpio') === 'What does the Moon in Scorpio mean?');
  t('unknown foreign word is skipped, never guessed', foreignToQuestion('o que significa blablabla') === null);
  t('less ad competition ranks higher', plannerPriority(1000, 0, null) > plannerPriority(1000, 100, null));
  t('page-2 positions get a push', plannerPriority(1000, 50, 12) > plannerPriority(1000, 50, null));
  t('tools and predictions are blocked', toQuestion('what is my horoscope today') === null && toQuestion('will i get rich astrology') === null);
  t('not astrology is blocked', toQuestion('what is a good pizza recipe') === null);
  t('category guess', categoryFor('What is a full moon in astrology?') === 'Phases & Movements');
}

process.exit(failed ? 1 : 0);
