import React, { useEffect, useState } from 'react';
import { Check, Lock, Shirt, Ticket } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { emailMessage } from '../utils/emailGuard';
import { getCouponSpots, isOnTshirtList, subscribeEmail, type SubscribeSource } from '../utils/subscribe';
import { TSHIRT_CONSENT } from '../data/subscribeConsent';
import { trackEvent } from '../utils/analytics';

const TEXT = {
  pt: {
    badge: 'Cupom de lançamento',
    title: 'Garanta o seu cupom de desconto',
    body: (n: number) => `As ${n} primeiras pessoas da lista ganham um cupom exclusivo no lançamento das camisetas da Aurenstar.`,
    bodyFull: 'As vagas do cupom acabaram, mas você ainda pode entrar na lista e ser avisado(a) do lançamento.',
    spotsLabel: 'vagas restantes',
    of: (n: number) => `de ${n}`,
    last: 'Últimas vagas!',
    half: 'Mais da metade já foi!',
    joined: (n: number) => (n === 1 ? '1 pessoa já entrou' : `${n} pessoas já entraram`),
    placeholder: 'Digite o seu melhor e-mail',
    cta: 'Quero o meu cupom',
    ctaFull: 'Entrar na lista',
    sending: 'Enviando…',
    trust: 'Sem spam: só avisamos do lançamento. Você sai da lista quando quiser.',
    rule: (n: number) => `O cupom é enviado por e-mail no lançamento, para as ${n} primeiras inscrições.`,
    thanks: 'Pronto! Sua vaga está garantida 🎉',
    thanksSub: 'O cupom chega por e-mail quando as camisetas forem lançadas.',
    thanksFull: 'Pronto! Você está na lista 💙',
    thanksFullSub: 'Avisaremos por e-mail quando as camisetas forem lançadas.',
    error: 'Não deu certo agora. Tente de novo em instantes.',
  },
  en: {
    badge: 'Launch coupon',
    title: 'Claim your discount coupon',
    body: (n: number) => `The first ${n} people on the list get an exclusive coupon when the Aurenstar t-shirts launch.`,
    bodyFull: 'The coupon spots are gone, but you can still join the list and hear about the launch.',
    spotsLabel: 'spots left',
    of: (n: number) => `of ${n}`,
    last: 'Last spots!',
    half: 'More than half are gone!',
    joined: (n: number) => (n === 1 ? '1 person has joined' : `${n} people have joined`),
    placeholder: 'Enter your best email',
    cta: 'Get my coupon',
    ctaFull: 'Join the list',
    sending: 'Sending…',
    trust: 'No spam: we only write about the launch. Leave the list anytime.',
    rule: (n: number) => `The coupon is sent by email at launch, to the first ${n} sign-ups.`,
    thanks: 'Done! Your spot is secured 🎉',
    thanksSub: 'The coupon arrives by email when the t-shirts launch.',
    thanksFull: 'Done! You are on the list 💙',
    thanksFullSub: 'We will email you when the t-shirts launch.',
    error: 'That did not work just now. Please try again in a moment.',
  },
  es: {
    badge: 'Cupón de lanzamiento',
    title: 'Asegura tu cupón de descuento',
    body: (n: number) => `Las primeras ${n} personas de la lista reciben un cupón exclusivo en el lanzamiento de las camisetas de Aurenstar.`,
    bodyFull: 'Los lugares del cupón se agotaron, pero aún puedes entrar en la lista y saber del lanzamiento.',
    spotsLabel: 'lugares restantes',
    of: (n: number) => `de ${n}`,
    last: '¡Últimos lugares!',
    half: '¡Ya se fue más de la mitad!',
    joined: (n: number) => (n === 1 ? '1 persona ya entró' : `${n} personas ya entraron`),
    placeholder: 'Escribe tu mejor correo',
    cta: 'Quiero mi cupón',
    ctaFull: 'Entrar en la lista',
    sending: 'Enviando…',
    trust: 'Sin spam: solo avisamos del lanzamiento. Sales de la lista cuando quieras.',
    rule: (n: number) => `El cupón se envía por correo en el lanzamiento, a las primeras ${n} inscripciones.`,
    thanks: '¡Listo! Tu lugar está asegurado 🎉',
    thanksSub: 'El cupón llega por correo cuando se lancen las camisetas.',
    thanksFull: '¡Listo! Estás en la lista 💙',
    thanksFullSub: 'Te avisaremos por correo cuando se lancen las camisetas.',
    error: 'No funcionó ahora. Inténtalo de nuevo en un momento.',
  },
} as const;

/** Sign-up card for the t-shirt waiting list with the launch coupon for the first people. Hidden for people already on the list. */
export const TshirtCapture: React.FC<{ source: SubscribeSource; sign?: string }> = ({ source, sign }) => {
  const { language } = useLanguage();
  const lang = (language === 'pt' || language === 'es' ? language : 'en') as 'pt' | 'en' | 'es';
  const t = TEXT[lang];
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [already] = useState(() => isOnTshirtList());
  const [spots, setSpots] = useState<{ limit: number; left: number | null } | null>(null);
  const [gotCoupon, setGotCoupon] = useState(true);
  useEffect(() => { if (!already) getCouponSpots().then(setSpots); }, [already]);

  if (already) return null;

  const limit = spots?.limit ?? 100;
  const left = spots?.left ?? null;
  const full = left === 0;
  const taken = left === null ? 0 : limit - left;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === 'sending' || !consent || !email.trim() || emailMessage(email, lang)) return;
    setState('sending');
    setGotCoupon(!full);
    const ok = await subscribeEmail({ email, sign, lang, source });
    if (ok) trackEvent('tshirt_signup', { source });
    setState(ok ? 'done' : 'error');
  };

  if (state === 'done') {
    return (
      <div className="mx-auto my-8 w-[calc(100%-2rem)] max-w-xl overflow-hidden rounded-3xl bg-gradient-to-br from-[#17366F] to-[#3982C8] p-7 text-center text-white shadow-xl sm:w-full">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#3982C8]"><Check className="h-6 w-6" strokeWidth={3} /></span>
        <p className="mt-3 text-lg font-extrabold">{gotCoupon ? t.thanks : t.thanksFull}</p>
        <p className="mt-1 text-sm text-white/85">{gotCoupon ? t.thanksSub : t.thanksFullSub}</p>
      </div>
    );
  }

  return (
    <div className="relative mx-auto my-8 w-[calc(100%-2rem)] max-w-xl overflow-hidden rounded-3xl bg-gradient-to-br from-[#17366F] via-[#2B62A6] to-[#3982C8] text-white shadow-xl sm:w-full">
      <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#E73578]/30 blur-2xl" />
      <form onSubmit={submit} className="relative p-6 sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E73578] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider">
            <Ticket className="h-3.5 w-3.5" /> {t.badge}
          </span>
          <Shirt className="h-6 w-6 text-white/70" aria-hidden />
        </div>

        <h3 className="mt-4 text-2xl font-extrabold leading-tight sm:text-3xl">{t.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/85">{full ? t.bodyFull : t.body(limit)}</p>

        {left !== null && !full && (
          <div className="mt-5 rounded-2xl bg-white/10 p-4">
            <div className="flex items-end justify-between gap-3">
              <div className="flex items-end gap-2">
                <span className="text-4xl font-extrabold leading-none tabular-nums">{left}</span>
                <span className="pb-0.5 text-xs font-semibold text-white/85">{t.spotsLabel} {t.of(limit)}</span>
              </div>
              {left <= Math.ceil(limit * 0.2) ? (
                <span className="animate-pulse rounded-full bg-[#E73578] px-3 py-1 text-[11px] font-extrabold">{t.last}</span>
              ) : taken >= limit / 2 ? (
                <span className="rounded-full bg-white/20 px-3 py-1 text-[11px] font-extrabold">{t.half}</span>
              ) : null}
            </div>
            <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-white/20">
              <div className="h-full rounded-full bg-gradient-to-r from-[#E73578] to-[#FF8FB5] transition-all duration-700" style={{ width: `${Math.max(3, Math.round((taken / limit) * 100))}%` }} />
            </div>
            {taken >= 10 && <p className="mt-2 text-xs font-semibold text-white/85">🔥 {t.joined(taken)}</p>}
          </div>
        )}

        <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => { setEmail(e.target.value); e.target.setCustomValidity(emailMessage(e.target.value, lang)); }}
            placeholder={t.placeholder}
            className="min-w-0 flex-1 rounded-full border-2 border-transparent bg-white px-5 py-3.5 text-sm font-semibold text-[#172B4D] outline-none placeholder:font-normal placeholder:text-[#647DA5] focus:border-[#E73578]"
          />
          <button
            type="submit"
            disabled={state === 'sending'}
            className="shrink-0 cursor-pointer rounded-full bg-[#E73578] px-7 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#E73578]/30 transition-all hover:scale-[1.03] hover:bg-[#D0306C] active:scale-95 disabled:opacity-60"
          >
            {state === 'sending' ? t.sending : full ? t.ctaFull : `${t.cta} →`}
          </button>
        </div>

        <label className="mt-4 flex cursor-pointer items-start gap-2.5 text-xs leading-snug text-white/90">
          <input type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#E73578]" />
          <span>{TSHIRT_CONSENT[lang]}</span>
        </label>

        <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-snug text-white/70"><Lock className="mt-0.5 h-3 w-3 shrink-0" />{t.trust}</p>
        {!full && <p className="mt-1 text-[11px] leading-snug text-white/70">{t.rule(limit)}</p>}
        {state === 'error' && <p className="mt-3 rounded-lg bg-white px-3 py-2 text-xs font-bold text-[#E73578]">{t.error}</p>}
      </form>
    </div>
  );
};
