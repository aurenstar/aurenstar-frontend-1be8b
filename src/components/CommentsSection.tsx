import React, { useEffect, useState } from 'react';
import { Check, Globe, Heart, MessageCircle, ShieldCheck, Star, UserRound } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { trackEvent } from '../utils/analytics';

interface PublicComment { id: number; name: string; message: string; stars: number | null; sign: string; country?: string | null; original?: string; translated?: boolean }

/** Example comments, only shown on the address ?demo=comentarios (never saved, never shown to other visitors). */
const DEMO: { id: number; name: string; country: string; stars: number; text: Record<'orig' | 'pt' | 'en' | 'es', string> }[] = [
  { id: -1, name: 'Mariana', country: 'BR', stars: 5, text: { orig: 'Amei a minha leitura de hoje, parecia que falava de mim!', pt: 'Amei a minha leitura de hoje, parecia que falava de mim!', en: 'I loved my reading today, it felt like it was about me!', es: '¡Me encantó mi lectura de hoy, parecía que hablaba de mí!' } },
  { id: -2, name: 'Emma', country: 'US', stars: 5, text: { orig: 'Simple words and very warm. I check it every morning now.', pt: 'Palavras simples e muito acolhedoras. Agora olho todas as manhãs.', en: 'Simple words and very warm. I check it every morning now.', es: 'Palabras sencillas y muy cálidas. Ahora lo miro cada mañana.' } },
  { id: -3, name: 'Carlos', country: 'ES', stars: 4, text: { orig: 'Muy buena la herramienta de Aureneffect, me sorprendió.', pt: 'A ferramenta Aureneffect é muito boa, me surpreendeu.', en: 'The Aureneffect tool is really good, it surprised me.', es: 'Muy buena la herramienta de Aureneffect, me sorprendió.' } },
  { id: -4, name: 'Yuki', country: 'JP', stars: 5, text: { orig: '毎日の星のメッセージがやさしくて、とても気に入っています。', pt: 'As mensagens diárias das estrelas são gentis, eu gosto muito.', en: 'The daily star messages are gentle and I like them a lot.', es: 'Los mensajes diarios de las estrellas son amables y me gustan mucho.' } },
  { id: -5, name: 'Lena', country: 'DE', stars: 5, text: { orig: 'Endlich Astrologie, die man wirklich versteht. Danke!', pt: 'Finalmente astrologia que dá para entender de verdade. Obrigada!', en: 'Finally astrology you can really understand. Thank you!', es: 'Por fin astrología que se entiende de verdad. ¡Gracias!' } },
];

const TEXT = {
  pt: {
    chipTranslate: 'Traduzido para o seu idioma',
    translated: 'Traduzido · ver original', seeTranslation: 'Ver tradução', demoNote: 'Modo demonstração: comentários de exemplo, só você vê.',
    badge: 'Comunidade', title: 'O que estão dizendo', sub: 'Conte como foi a sua experiência. Seu comentário ajuda a melhorar a Aurenstar.',
    name: 'Seu primeiro nome (opcional)', message: 'Escreva o seu comentário…', rate: 'Sua nota', send: 'Enviar comentário', sending: 'Enviando…',
    thanks: 'Obrigado! 💙 Seu comentário foi enviado e aparece aqui assim que for revisado.', error: 'Não deu certo agora. Tente de novo em instantes.',
    links: 'Por segurança, não é possível enviar links ou e-mails no comentário.', limit: 'Você já enviou comentários demais hoje. Volte amanhã!',
    empty: 'Ainda não há comentários. Seja a primeira pessoa a comentar! ✨', anon: 'Visitante', ideas: 'O que você pode contar:', idea: ['Qual ferramenta você usou?', 'A leitura combinou com você?', 'O que podemos melhorar?'], emptyTitle: 'Seja a primeira pessoa a comentar', perks: ['Revisamos antes de publicar', 'Só o primeiro nome aparece', 'Ajuda a melhorar a Aurenstar'], ratings: ['', 'Pode melhorar', 'Mais ou menos', 'Bom', 'Muito bom', 'Amei!'], avg: 'média', count: (n: number) => (n === 1 ? '1 comentário' : `${n} comentários`), note: 'Não peça nem coloque dados pessoais. Os comentários são revisados antes de aparecer.',
  },
  en: {
    chipTranslate: 'Translated to your language',
    translated: 'Translated · see original', seeTranslation: 'See translation', demoNote: 'Demo mode: example comments, only you can see them.',
    badge: 'Community', title: 'What people are saying', sub: 'Tell us how it went. Your comment helps make Aurenstar better.',
    name: 'Your first name (optional)', message: 'Write your comment…', rate: 'Your rating', send: 'Send comment', sending: 'Sending…',
    thanks: 'Thank you! 💙 Your comment was sent and will appear here once reviewed.', error: 'That did not work just now. Please try again in a moment.',
    links: 'For safety, links and emails cannot be sent in a comment.', limit: 'You have sent too many comments today. Come back tomorrow!',
    empty: 'No comments yet. Be the first to comment! ✨', anon: 'Visitor', ideas: 'What you could share:', idea: ['Which tool did you use?', 'Did the reading fit you?', 'What can we improve?'], emptyTitle: 'Be the first to comment', perks: ['We review before publishing', 'Only your first name shows', 'Helps improve Aurenstar'], ratings: ['', 'Could be better', 'So-so', 'Good', 'Very good', 'Loved it!'], avg: 'average', count: (n: number) => (n === 1 ? '1 comment' : `${n} comments`), note: 'Do not share personal details. Comments are reviewed before they appear.',
  },
  es: {
    chipTranslate: 'Traducido a tu idioma',
    translated: 'Traducido · ver original', seeTranslation: 'Ver traducción', demoNote: 'Modo demostración: comentarios de ejemplo, solo tú los ves.',
    badge: 'Comunidad', title: 'Lo que dicen', sub: 'Cuéntanos cómo te fue. Tu comentario ayuda a mejorar Aurenstar.',
    name: 'Tu primer nombre (opcional)', message: 'Escribe tu comentario…', rate: 'Tu nota', send: 'Enviar comentario', sending: 'Enviando…',
    thanks: '¡Gracias! 💙 Tu comentario fue enviado y aparecerá aquí cuando sea revisado.', error: 'No funcionó ahora. Inténtalo de nuevo en un momento.',
    links: 'Por seguridad, no se pueden enviar enlaces ni correos en el comentario.', limit: 'Has enviado demasiados comentarios hoy. ¡Vuelve mañana!',
    empty: 'Aún no hay comentarios. ¡Sé la primera persona en comentar! ✨', anon: 'Visitante', ideas: 'Lo que puedes contar:', idea: ['¿Qué herramienta usaste?', '¿La lectura te encajó?', '¿Qué podemos mejorar?'], emptyTitle: 'Sé la primera persona en comentar', perks: ['Revisamos antes de publicar', 'Solo aparece tu primer nombre', 'Ayuda a mejorar Aurenstar'], ratings: ['', 'Puede mejorar', 'Más o menos', 'Bueno', 'Muy bueno', '¡Me encantó!'], avg: 'promedio', count: (n: number) => (n === 1 ? '1 comentario' : `${n} comentarios`), note: 'No compartas datos personales. Los comentarios se revisan antes de aparecer.',
  },
} as const;

export const CommentsSection: React.FC = () => {
  const { language } = useLanguage();
  const lang = (language === 'pt' || language === 'es' ? language : 'en') as 'pt' | 'en' | 'es';
  const t = TEXT[lang];
  const [list, setList] = useState<PublicComment[] | null>(null);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [stars, setStars] = useState(0);
  const [website, setWebsite] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle');
  const [err, setErr] = useState('');

  const { visitorLanguage } = useLanguage();
  const readLang = visitorLanguage || lang;
  const demo = typeof location !== 'undefined' && new URLSearchParams(location.search).get('demo') === 'comentarios';
  const [showOriginal, setShowOriginal] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (demo) {
      const k = (['pt', 'en', 'es'] as const).includes(readLang as any) ? (readLang as 'pt' | 'en' | 'es') : 'en';
      const origLang = { BR: 'pt', US: 'en', ES: 'es', JP: 'ja', DE: 'de' } as Record<string, string>;
      setList(DEMO.map((d) => {
        const changed = origLang[d.country] !== k;
        return { id: d.id, name: d.name, stars: d.stars, sign: '', country: d.country, message: changed ? d.text[k] : d.text.orig, ...(changed ? { original: d.text.orig, translated: true } : {}) };
      }));
      return;
    }
    fetch(`/api/comments?lang=${encodeURIComponent(readLang)}`).then((r) => (r.ok ? r.json() : { comments: [] })).then((d) => setList(d.comments || [])).catch(() => setList([]));
  }, [readLang, demo]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === 'sending' || message.trim().length < 5) return;
    setState('sending'); setErr('');
    try {
      const res = await fetch('/api/comments', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message, stars, lang, website }),
      });
      const d = await res.json().catch(() => ({}));
      if (res.ok && d.ok) { setState('done'); setMessage(''); trackEvent('comment_sent'); return; }
      setErr(d.reason === 'links' ? t.links : d.reason === 'limit' ? t.limit : t.error);
    } catch { setErr(t.error); }
    setState('idle');
  };

  const rated = (list || []).filter((c) => c.stars);
  const avg = rated.length ? rated.reduce((a, c) => a + (c.stars || 0), 0) / rated.length : 0;

  const renderCard = (c: PublicComment, key: string) => {
    const hasFlag = !!c.country && /^[A-Za-z]{2}$/.test(c.country);
    return (
      <article key={key} className="rounded-xl border border-[#D9E8F8] bg-[#F4F9FF] p-3">
        <div className="flex items-center gap-2.5">
          {hasFlag ? (
            <img src={`/flags/${c.country!.toLowerCase()}.svg`} alt={c.country!.toUpperCase()} title={c.country!.toUpperCase()} width={36} height={36} loading="lazy" className="h-9 w-9 shrink-0 rounded-full border-2 border-white object-cover shadow-[0_0_0_1px_#D9E8F8]" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          ) : (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#3982C8] text-sm font-extrabold text-white">{(c.name || t.anon).charAt(0).toUpperCase()}</span>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-extrabold leading-tight text-[#172B4D]">{c.name || t.anon}</p>
            {c.stars ? <span className="mt-0.5 flex" aria-label={`${c.stars}/5`}>{[1, 2, 3, 4, 5].map((n) => <Star key={n} className={`h-3 w-3 ${n <= c.stars! ? 'fill-[#E73578] text-[#E73578]' : 'text-[#D9E8F8]'}`} />)}</span> : null}
          </div>
        </div>
        <p data-no-translate className="mt-2 whitespace-pre-line break-words text-[13px] leading-snug text-[#172B4D]">{c.translated && showOriginal[String(c.id)] ? c.original : c.message}</p>
        {c.translated && (
          <button type="button" onClick={() => setShowOriginal((o) => ({ ...o, [String(c.id)]: !o[String(c.id)] }))} style={{ fontSize: 10.5, lineHeight: 1.4 }} className="mt-1 font-bold text-[#647DA5] hover:text-[#3982C8]">
            🌐 {showOriginal[String(c.id)] ? t.seeTranslation : t.translated}
          </button>
        )}
      </article>
    );
  };

  return (
    <section id="comentarios" className="w-full bg-[#C9E5FF] px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#3982C8]"><MessageCircle className="h-3.5 w-3.5" />{t.badge}</span>
          <h2 className="mt-3 text-3xl font-extrabold text-[#172B4D] sm:text-4xl">{t.title}</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#647DA5]">{t.sub}</p>
        </div>

        <div className="mt-8 grid items-stretch gap-6 lg:grid-cols-[1.1fr_1fr] lg:gap-8">
          <div className="flex flex-col rounded-[2rem] border border-[#D9E8F8] bg-white p-5 shadow-[0_10px_30px_rgba(57,130,200,0.10)] sm:p-6">
            {list !== null && list.length === 0 ? (
              <div className="flex flex-1 flex-col justify-center gap-6 py-4 text-center">
                <div>
                  <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E4F1FF] text-[#3982C8]"><MessageCircle className="h-8 w-8" /></span>
                  <p className="mt-4 text-xl font-extrabold text-[#172B4D]">{t.emptyTitle}</p>
                </div>
                <ul className="grid gap-2.5 border-t border-[#D9E8F8] pt-5 text-left">
                  {[ShieldCheck, UserRound, Heart].map((Icon, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-xs font-semibold text-[#647DA5]"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E4F1FF] text-[#3982C8]"><Icon className="h-3.5 w-3.5" /></span>{t.perks[i]}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <>
                {list !== null && (
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-[#D9E8F8] pb-4">
                    {rated.length > 0 && (
                      <div className="flex items-center gap-3">
                        <span className="text-4xl font-extrabold leading-none text-[#172B4D]">{avg.toFixed(1)}</span>
                        <div>
                          <span className="flex">{[1, 2, 3, 4, 5].map((n) => <Star key={n} className={`h-4 w-4 ${n <= Math.round(avg) ? 'fill-[#E73578] text-[#E73578]' : 'text-[#D9E8F8]'}`} />)}</span>
                          <p className="mt-0.5 text-xs font-bold text-[#647DA5]">{t.count(list.length)}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 sm:ml-auto">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E4F1FF] px-3 py-1 text-[11px] font-bold text-[#3982C8]"><ShieldCheck className="h-3.5 w-3.5" />{t.perks[0]}</span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E4F1FF] px-3 py-1 text-[11px] font-bold text-[#3982C8]"><Globe className="h-3.5 w-3.5" />{t.chipTranslate}</span>
                    </div>
                  </div>
                )}
                {demo && <p className="mt-3 rounded-xl bg-[#FDE8F0] px-3 py-2 text-center text-xs font-bold text-[#E73578]">{t.demoNote}</p>}
                {list !== null && list.length > 0 && (
                  list.length >= 3 ? (
                    <div className="comments-ticker relative mt-4 h-[340px] flex-none overflow-hidden lg:h-auto lg:min-h-[340px] lg:flex-1" style={{ maskImage: 'linear-gradient(to bottom, transparent, #000 7%, #000 93%, transparent)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, #000 7%, #000 93%, transparent)' }}>
                      <div className="comments-ticker-track absolute inset-x-0 top-0 grid" style={{ ['--dur' as string]: `${Math.max(1, Math.ceil(5 / list.length)) * list.length * 6}s` } as React.CSSProperties}>
                        {[0, 1].map((copy) => (
                          <div key={copy} className="grid content-start gap-2.5 pb-2.5" aria-hidden={copy === 1 ? true : undefined}>
                            {Array.from({ length: Math.max(1, Math.ceil(5 / list.length)) }).flatMap((_, rep) => list.map((c) => renderCard(c, `${copy}-${rep}-${c.id}`)))}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 grid gap-2.5">{list.map((c) => renderCard(c, String(c.id)))}</div>
                  )
                )}
              </>
            )}
          </div>

          {state === 'done' ? (
            <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E73578] text-white"><Check className="h-7 w-7" strokeWidth={3} /></span>
              <p className="mt-4 text-sm font-bold leading-relaxed text-[#17366F]">{t.thanks}</p>
            </div>
          ) : (
            <form onSubmit={submit} className="flex flex-col rounded-3xl border border-[#D9E8F8] bg-white p-5 shadow-[0_10px_30px_rgba(57,130,200,0.10)] sm:p-6">
              <input value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />
              <p className="text-xs font-extrabold uppercase tracking-wider text-[#647DA5]">{t.rate}</p>
              <div className="mt-1.5 flex items-center gap-1" role="radiogroup" aria-label={t.rate}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onClick={() => setStars(n === stars ? 0 : n)} aria-label={`${n}`} className="cursor-pointer p-0.5 transition-transform hover:scale-110">
                    <Star className={`h-8 w-8 transition-colors ${n <= stars ? 'fill-[#E73578] text-[#E73578]' : 'text-[#B5D6F5]'}`} />
                  </button>
                ))}
                {stars > 0 && <span className="ml-2 text-sm font-extrabold text-[#E73578]">{t.ratings[stars]}</span>}
              </div>
              <input value={name} maxLength={40} onChange={(e) => setName(e.target.value)} placeholder={t.name} className="mt-4 w-full rounded-xl border border-[#D9E8F8] bg-[#F4F9FF] px-4 py-3 text-sm text-[#172B4D] outline-none focus:border-[#3982C8]" />
              <textarea required minLength={5} maxLength={600} rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder={t.message} className="mt-3 min-h-[7rem] w-full flex-1 resize-none rounded-xl border border-[#D9E8F8] bg-[#F4F9FF] px-4 py-3 text-sm text-[#172B4D] outline-none focus:border-[#3982C8]" />
              <p className="mt-1 text-right text-[11px] text-[#647DA5]">{message.length}/600</p>
              {err && <p className="mt-1 text-xs font-bold text-[#E73578]">{err}</p>}
              <button type="submit" disabled={state === 'sending'} className="mt-2 w-full cursor-pointer rounded-full bg-[#E73578] px-6 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#E73578]/25 transition-all hover:bg-[#D0306C] active:scale-[0.98] disabled:opacity-60">{state === 'sending' ? t.sending : t.send}</button>
              <p className="mt-3 text-[11px] leading-snug text-[#647DA5]">{t.note}</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
