import { validateTerm, slugify } from '../scripts/dictionary/checks';
import { conceptKey, toQuestion, categoryFor, foreignToQuestion, plannerPriority } from '../scripts/dictionary/demand';
import { chooseNames, applyNames, applyNamesToTerm } from '../scripts/dictionary/names';
import { verdictFor, boostFor } from '../scripts/dictionary/report';
import { chooseWorldNames, worldTotals } from '../scripts/dictionary/worldNames';
import { mergeEntry } from '../scripts/dictionary/buildWorldGlossary';
import { LANGUAGE_IDS } from '../scripts/dictionary/worldGlossary';
import { toolForTerm } from '../src/data/dictionaryLinks';
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
  t('bare gemini is the AI, not the sign', toQuestion('gemini') === null);
  t('gemini with astrology is the sign', toQuestion('gemini astrology') === 'What does Gemini mean in astrology?');
  t('bare cancer is skipped', toQuestion('cancer') === null);
  t('bare mars is skipped', toQuestion('mars') === null);
  t('foreign bare sign is skipped', foreignToQuestion('gemeos') === null);
  t('foreign sign with meaning works', foreignToQuestion('gêmeos significado') === 'What does Gemini mean in astrology?');
  t('tools and predictions are blocked', toQuestion('what is my horoscope today') === null && toQuestion('will i get rich astrology') === null);
  t('not astrology is blocked', toQuestion('what is a good pizza recipe') === null);
  t('category guess', categoryFor('What is a full moon in astrology?') === 'Phases & Movements');
}


// ---- names by real search volume ----
const fakeVol = { pt: new Map([['mapa astral', 201000], ['mapa natal', 4400], ['nodo norte', 2900]]), es: new Map([['carta astral', 550000], ['carta natal', 550000]]) } as any;
const ch = chooseNames(fakeVol);
ok('pt: most searched name wins', ch.find((c) => c.group === 'natal chart' && c.lang === 'pt')?.name === 'mapa astral');
ok('es: tie keeps the first listed', ch.find((c) => c.group === 'natal chart' && c.lang === 'es')?.name === 'carta astral');
ok('swap keeps capital letters', applyNames('O Mapa Natal mostra, e um mapa natal e unico.', 'pt', ch).text === 'O Mapa Astral mostra, e um mapa astral e unico.');
ok('plural is swapped', applyNames('Os mapas natais.', 'pt', ch).text === 'Os mapas astrais.');
ok('equal numbers leave the text alone', applyNames('Tu carta natal.', 'es', ch).text === 'Tu carta natal.');
ok('known mistake is always fixed', applyNames('O Nódulo Norte.', 'pt', ch).text === 'O Nodo Norte.');
ok('inside another word is untouched', applyNames('mapa natalino', 'pt', ch).text === 'mapa natalino');
ok('term texts fixed in place', (() => { const t: any = { traducoes: { pt: { termo: 'Mapa Natal', faq: [{ pergunta: 'O que e um mapa natal?', resposta: 'x' }] } } }; applyNamesToTerm(t, ch); return t.traducoes.pt.termo === 'Mapa Astral' && t.traducoes.pt.faq[0].pergunta.includes('mapa astral'); })());
ok('tool: signs', toolForTerm('Fire Sign', 'fire-sign').rota === 'discover-sign');
ok('tool: sky', toolForTerm('Mercury Retrograde').rota === 'transits');
ok('tool: pair', toolForTerm('Composite Chart').rota === 'compatibility');
ok('tool: chart', toolForTerm('Natal Chart').rota === 'describe-me');

ok('report: clicks mean working', verdictFor(5, 1, 30) === 'funcionando');
ok('report: top 10 with views means working', verdictFor(12, 0, 6) === 'funcionando');
ok('report: positions 11-20 are almost', verdictFor(8, 0, 14) === 'quase');
ok('report: seen but low', verdictFor(2, 0, 70) === 'aparecendo');
ok('report: nothing yet', verdictFor(0, 0, null) === 'sem-dados');
ok('boost needs enough data', boostFor(10, 2, 2, 100) === 1 && boostFor(10, 2, 5, 10) === 1);
ok('boost is capped 0.8..1.3', boostFor(100, 2, 5, 500) === 1.3 && boostFor(0.1, 2, 5, 500) === 0.8);

const wv = new Map([['de|radix', 90500], ['de|geburtshoroskop', 3600], ['it|tema natale', 33100], ['it|carta natale', 6600], ['fr|thème natal', 2400]].map(([k, v]) => [String(k).normalize('NFD').replace(/[\u0300-\u036f]/g, ''), v as number]));
const wn = chooseWorldNames(wv);
ok('world: ambiguous name never wins', wn.find((c) => c.lang === 'de' && c.idea === 'natal chart')?.name === 'Geburtshoroskop');
ok('world: decisive winner (2x) is picked', wn.find((c) => c.lang === 'it' && c.idea === 'natal chart')?.name === 'tema natale');
ok('world: tiny numbers are not trusted', !wn.some((c) => c.volume < 500));
ok('world: totals add languages', (worldTotals(wv).get('natal chart') || 0) >= 33100);

ok('glossary: hand-written name is kept', mergeEntry('Sternzeichen', 'Tierkreis') === 'Sternzeichen');
ok('glossary: missing name is filled (max 2)', mergeEntry('', ' a | b | c ') === 'a|b');
ok('glossary: nothing to fill stays empty', mergeEntry(undefined, undefined) === '');

// Google Ads language ids (official table): Lithuanian 1029 (1026 is Icelandic), Persian 1064, Norwegian 1013, Malay 1102
ok('language ids: lt/fa/no/ms are the official ones', LANGUAGE_IDS.lt === 1029 && LANGUAGE_IDS.fa === 1064 && LANGUAGE_IDS.no === 1013 && LANGUAGE_IDS.ms === 1102);

process.exit(failed ? 1 : 0);
