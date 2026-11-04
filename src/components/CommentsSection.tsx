import React, { useEffect, useState } from 'react';
import { Check, MessageCircle, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { trackEvent } from '../utils/analytics';

interface PublicComment { id: number; name: string; message: string; stars: number | null; sign: string }

const TEXT = {
  pt: {
    badge: 'Comunidade', title: 'O que estão dizendo', sub: 'Conte como foi a sua experiência. Seu comentário ajuda a melhorar a Aurenstar.',
    name: 'Seu primeiro nome (opcional)', message: 'Escreva o seu comentário…', rate: 'Sua nota', send: 'Enviar comentário', sending: 'Enviando…',
    thanks: 'Obrigado! 💙 Seu comentário foi enviado e aparece aqui assim que for revisado.', error: 'Não deu certo agora. Tente de novo em instantes.',
    links: 'Por segurança, não é possível enviar links ou e-mails no comentário.', limit: 'Você já enviou comentários demais hoje. Volte amanhã!',
    empty: 'Ainda não há comentários. Seja a primeira pessoa a comentar! ✨', anon: 'Visitante', ideas: 'O que você pode contar:', idea: ['Qual ferramenta você usou?', 'A leitura combinou com você?', 'O que podemos melhorar?'], emptyTitle: 'Seja a primeira pessoa a comentar', ratings: ['', 'Pode melhorar', 'Mais ou menos', 'Bom', 'Muito bom', 'Amei!'], avg: 'média', count: (n: number) => (n === 1 ? '1 comentário' : `${n} comentários`), note: 'Não peça nem coloque dados pessoais. Os comentários são revisados antes de aparecer.',
  },
  en: {
    badge: 'Community', title: 'What people are saying', sub: 'Tell us how it went. Your comment helps make Aurenstar better.',
    name: 'Your first name (optional)', message: 'Write your comment…', rate: 'Your rating', send: 'Send comment', sending: 'Sending…',
    thanks: 'Thank you! 💙 Your comment was sent and will appear here once reviewed.', error: 'That did not work just now. Please try again in a moment.',
    links: 'For safety, links and emails cannot be sent in a comment.', limit: 'You have sent too many comments today. Come back tomorrow!',
    empty: 'No comments yet. Be the first to comment! ✨', anon: 'Visitor', ideas: 'What you could share:', idea: ['Which tool did you use?', 'Did the reading fit you?', 'What can we improve?'], emptyTitle: 'Be the first to comment', ratings: ['', 'Could be better', 'So-so', 'Good', 'Very good', 'Loved it!'], avg: 'average', count: (n: number) => (n === 1 ? '1 comment' : `${n} comments`), note: 'Do not share personal details. Comments are reviewed before they appear.',
  },
  es: {
    badge: 'Comunidad', title: 'Lo que dicen', sub: 'Cuéntanos cómo te fue. Tu comentario ayuda a mejorar Aurenstar.',
    name: 'Tu primer nombre (opcional)', message: 'Escribe tu comentario…', rate: 'Tu nota', send: 'Enviar comentario', sending: 'Enviando…',
    thanks: '¡Gracias! 💙 Tu comentario fue enviado y aparecerá aquí cuando sea revisado.', error: 'No funcionó ahora. Inténtalo de nuevo en un momento.',
    links: 'Por seguridad, no se pueden enviar enlaces ni correos en el comentario.', limit: 'Has enviado demasiados comentarios hoy. ¡Vuelve mañana!',
    empty: 'Aún no hay comentarios. ¡Sé la primera persona en comentar! ✨', anon: 'Visitante', ideas: 'Lo que puedes contar:', idea: ['¿Qué herramienta usaste?', '¿La lectura te encajó?', '¿Qué podemos mejorar?'], emptyTitle: 'Sé la primera persona en comentar', ratings: ['', 'Puede mejorar', 'Más o menos', 'Bueno', 'Muy bueno', '¡Me encantó!'], avg: 'promedio', count: (n: number) => (n === 1 ? '1 comentario' : `${n} comentarios`), note: 'No compartas datos personales. Los comentarios se revisan antes de aparecer.',
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

  useEffect(() => {
    fetch('/api/comments').then((r) => (r.ok ? r.json() : { comments: [] })).then((d) => setList(d.comments || [])).catch(() => setList([]));
  }, []);

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

  return (
    <section id="comentarios" className="w-full bg-[#C9E5FF] px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#3982C8]"><MessageCircle className="h-3.5 w-3.5" />{t.badge}</span>
          <h2 className="mt-3 text-3xl font-extrabold text-[#172B4D] sm:text-4xl">{t.title}</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#647DA5]">{t.sub}</p>
        </div>

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-2">
          <div className="grid gap-3">
            {list !== null && list.length === 0 && (
              <div className="rounded-3xl border border-[#D9E8F8] bg-white p-6 text-center shadow-sm sm:p-8">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E4F1FF] text-[#3982C8]"><MessageCircle className="h-7 w-7" /></span>
                <p className="mt-4 text-lg font-extrabold text-[#172B4D]">{t.emptyTitle}</p>
                <p className="mt-1 text-sm text-[#647DA5]">{t.ideas}</p>
                <ul className="mx-auto mt-3 grid max-w-xs gap-2 text-left">
                  {t.idea.map((x) => (
                    <li key={x} className="flex items-center gap-2 rounded-xl bg-[#F4F9FF] px-3 py-2 text-sm font-semibold text-[#17366F]"><Star className="h-4 w-4 shrink-0 fill-[#E73578] text-[#E73578]" />{x}</li>
                  ))}
                </ul>
              </div>
            )}
            {list !== null && list.length > 0 && (
              <div className="flex items-center justify-between rounded-2xl bg-white/70 px-4 py-3">
                <p className="text-sm font-extrabold text-[#17366F]">{t.count(list.length)}</p>
                {rated.length > 0 && (
                  <p className="flex items-center gap-1.5 text-sm font-extrabold text-[#17366F]"><Star className="h-4 w-4 fill-[#E73578] text-[#E73578]" />{avg.toFixed(1)} <span className="text-xs font-semibold text-[#647DA5]">{t.avg}</span></p>
                )}
              </div>
            )}
            {list?.map((c) => (
              <article key={c.id} className="rounded-2xl border border-[#D9E8F8] bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#3982C8] to-[#E73578] text-sm font-extrabold text-white">{(c.name || t.anon).charAt(0).toUpperCase()}</span>
                  <p className="min-w-0 flex-1 truncate text-sm font-extrabold text-[#172B4D]">{c.name || t.anon}</p>
                  {c.stars ? <span className="flex" aria-label={`${c.stars}/5`}>{[1, 2, 3, 4, 5].map((n) => <Star key={n} className={`h-4 w-4 ${n <= c.stars! ? 'fill-[#E73578] text-[#E73578]' : 'text-[#D9E8F8]'}`} />)}</span> : null}
                </div>
                <p className="mt-2.5 whitespace-pre-line break-words text-sm leading-relaxed text-[#172B4D]">{c.message}</p>
              </article>
            ))}
          </div>

          {state === 'done' ? (
            <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E73578] text-white"><Check className="h-7 w-7" strokeWidth={3} /></span>
              <p className="mt-4 text-sm font-bold leading-relaxed text-[#17366F]">{t.thanks}</p>
            </div>
          ) : (
            <form onSubmit={submit} className="rounded-3xl border border-[#D9E8F8] bg-white p-5 shadow-sm sm:p-6">
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
              <textarea required minLength={5} maxLength={600} rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder={t.message} className="mt-3 w-full resize-none rounded-xl border border-[#D9E8F8] bg-[#F4F9FF] px-4 py-3 text-sm text-[#172B4D] outline-none focus:border-[#3982C8]" />
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
