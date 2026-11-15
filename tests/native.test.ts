import { activeWave } from '../scripts/native/plan';
import { statsFor, verdictOf } from '../scripts/native/care';
import { checkArticle, renderNativeArticle, renderNativeHub, articlePath, type NativeArticle } from '../server/engine/nativeArticle';

let failed = 0;
const ok = (name: string, cond: boolean) => { if (!cond) { failed++; console.log('FAIL', name); } else console.log('ok  ', name); };

const para = 'Der Aszendent zeigt, wie andere dich beim ersten Eindruck sehen und welche Rolle du im Alltag gern spielst, und das ist für viele Menschen ein schöner Anlass zum Nachdenken über sich selbst und die eigenen Gewohnheiten.';
const base = (over: Partial<NativeArticle> = {}): NativeArticle => ({
  lang: 'de', keyword: 'aszendent berechnen', volume: 135000, slug: 'aszendent-berechnen', date: '2026-11-15',
  title: 'Aszendent berechnen: so findest du dein Aufstiegszeichen', description: 'Wie du deinen Aszendenten berechnen kannst, was er bedeutet und welche Angaben du dafür wirklich brauchst, einfach erklärt.',
  intro: `Du willst deinen Aszendent berechnen? ${para} ${para}`,
  sections: [1, 2, 3, 4, 5].map((i) => ({ h2: i === 1 ? 'Aszendent berechnen Schritt für Schritt' : `Abschnitt ${i}`, paragraphs: [para, para, para, para] })),
  faq: [1, 2, 3, 4].map((i) => ({ q: `Frage ${i} zum Aszendent berechnen?`, a: `${para}` })),
  ui: { home: 'Start', tools: 'Kostenlose Astrologie-Tools', articles: 'Artikel', faq: 'Häufige Fragen', more: 'Weiterlesen' }, ...over,
});
const long = (a: NativeArticle) => ({ ...a, sections: [...a.sections, ...a.sections.map((s) => ({ ...s, h2: s.h2 + ' b' }))] });

ok('native: a good German article passes', checkArticle(long(base())).length === 0);
ok('native: too short is rejected', checkArticle(base({ sections: base().sections.slice(0, 4).map((s) => ({ ...s, paragraphs: ['Kurz.'] })) })).some((m) => m.startsWith('too short')));
ok('native: English text in a German article is rejected', checkArticle(long(base({ intro: 'the and of is are with that this for your you '.repeat(40) }))).length > 0);
ok('native: missing search words are rejected', checkArticle(long(base({ keyword: 'mondknoten bedeutung' }))).some((m) => m.includes('search words')));
ok('native: ordinary words "ai" (Italian) and "ia" (Indonesian) are not AI mentions', !checkArticle(long(base({ intro: base().intro + ' ai segni ia berkata' }))).includes('mentions AI'));
ok('native: AI words are rejected', checkArticle(long(base({ intro: base().intro + ' As an AI I wrote this.' }))).includes('mentions AI'));
ok('native: Arabic written in Latin letters is rejected', checkArticle(long(base({ lang: 'ar' }))).includes('text is not mostly in the language script'));
ok('native: fewer than 3 questions is rejected', checkArticle(long(base({ faq: base().faq.slice(0, 2) }))).length > 0);

const html = renderNativeArticle(base(), [base(), base({ slug: 'other', title: 'Anderer Artikel' })]);
ok('native page: own canonical, language and self hreflang', html.includes('<link rel="canonical" href="https://aurenstar.com/de/blog/aszendent-berechnen" />') && html.includes('<html lang="de">') && html.includes('hreflang="de"'));
ok('native page: text is in the HTML and has article + FAQ data', html.includes('Aszendent berechnen Schritt für Schritt') && html.includes('"@type":"FAQPage"') && html.includes('"@type":"Article"'));
ok('native page: links to the other article of the language, not itself', html.includes('href="/de/blog/other"') && !html.includes('<li><a href="/de/blog/aszendent-berechnen"'));
ok('native page: Arabic is right to left', renderNativeArticle(base({ lang: 'ar' })).includes('dir="rtl"'));
ok('native page: text is escaped', !renderNativeArticle(base({ title: 'A <script>x</script> & B' })).includes('<script>x</script>'));
ok('native hub: lists the articles', renderNativeHub('de', [base()]).includes(articlePath('de', 'aszendent-berechnen')));

const P = { waves: [{ from: '2026-11-14', name: 'a', langs: ['de'], perLang: 3, maxPerDay: 10 }, { from: '2026-11-22', name: 'b', langs: ['ko'], perLang: 5, maxPerDay: 15 }] };
ok('plan: before the first wave nothing is open', activeWave(P, '2026-11-01').langs.length === 0);
ok('plan: first wave opens its languages', activeWave(P, '2026-11-15').langs.join() === 'de' && activeWave(P, '2026-11-15').maxPerDay === 10);
ok('plan: later wave adds languages and raises the limits', activeWave(P, '2026-11-22').langs.join() === 'de,ko' && activeWave(P, '2026-11-30').perLang === 5);
ok('plan: paused is passed on', activeWave({ ...P, paused: true }, '2026-11-15').paused);
const rows = [{ query: 'Aszendent berechnen kostenlos', clicks: 2, impressions: 80, position: 7 }, { query: 'aszendent berechnen', clicks: 0, impressions: 40, position: 12 }, { query: 'mond', clicks: 9, impressions: 9, position: 1 }];
ok('care: stats add the searches that contain the words', JSON.stringify(statsFor('aszendent berechnen', rows)) === JSON.stringify({ impressions: 120, clicks: 2, position: 7 }));
ok('care: young article is "novo"', verdictOf({ impressions: 0, clicks: 0, position: null }, 10) === 'novo');
ok('care: seen a lot but not clicked', verdictOf({ impressions: 400, clicks: 1, position: 14 }, 40) === 'aparece-sem-clique');
ok('care: page 1 is working', verdictOf({ impressions: 60, clicks: 0, position: 6 }, 40) === 'funcionando');
ok('care: nothing after 120 days is "sem-sinal", before that still waiting', verdictOf({ impressions: 0, clicks: 0, position: null }, 121) === 'sem-sinal' && verdictOf({ impressions: 0, clicks: 0, position: null }, 100) === 'aparecendo');
const linked = renderNativeArticle(base({ tool: 'daily-message', term: 'rising-sign', ui: { ...base().ui, dictionary: 'Wörterbuch' } }));
ok('native page: links to the chosen tool and dictionary term', linked.includes('class="cta" href="/de/daily-message"') && linked.includes('href="/de/dicionario/rising-sign"'));
ok('native page: retired article is noindex', renderNativeArticle(base({ retired: true })).includes('content="noindex,follow"'));

process.exit(failed ? 1 : 0);
