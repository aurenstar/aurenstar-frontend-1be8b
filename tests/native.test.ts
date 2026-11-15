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

process.exit(failed ? 1 : 0);
