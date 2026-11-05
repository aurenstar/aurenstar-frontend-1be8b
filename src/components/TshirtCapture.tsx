import React, { useEffect, useState } from 'react';
import { Check, Lock, Shirt, Ticket } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { emailMessage } from '../utils/emailGuard';
import { getCouponSpots, isOnTshirtList, subscribeEmail, type SubscribeSource } from '../utils/subscribe';
import { TSHIRT_CONSENT } from '../data/subscribeConsent';
import { trackEvent } from '../utils/analytics';

const TEXT = {
  pt: {
    miniTitle: 'Cupom de desconto para quem entrar na lista', miniSub: 'Camisetas Aurenstar', leftShort: (n: number) => `${n} já entraram`,
    badge: 'Cupom de lançamento',
    title: 'Garanta o seu cupom de desconto',
    body: 'Quem entra na lista ganha um cupom exclusivo no lançamento das camisetas da Aurenstar. Quanto mais cedo, melhor: avisamos você primeiro.',
    joined: (n: number) => (n === 1 ? '1 pessoa já entrou' : `${n} pessoas já entraram`),
    placeholder: 'Digite o seu melhor e-mail',
    cta: 'Quero o meu cupom',
    sending: 'Enviando…',
    trust: 'Sem spam: só avisamos do lançamento. Você sai da lista quando quiser.',
    rule: 'O cupom é enviado por e-mail no lançamento, para todas as pessoas da lista.',
    thanks: 'Pronto! Sua vaga está garantida 🎉',
    thanksSub: 'O cupom chega por e-mail quando as camisetas forem lançadas.',
    error: 'Não deu certo agora. Tente de novo em instantes.',
  },
  en: {
    miniTitle: 'Discount coupon for everyone who joins the list', miniSub: 'Aurenstar t-shirts', leftShort: (n: number) => `${n} joined`,
    badge: 'Launch coupon',
    title: 'Claim your discount coupon',
    body: 'Everyone on the list gets an exclusive coupon when the Aurenstar t-shirts launch. The earlier you join, the sooner we tell you.',
    joined: (n: number) => (n === 1 ? '1 person has joined' : `${n} people have joined`),
    placeholder: 'Enter your best email',
    cta: 'Get my coupon',
    sending: 'Sending…',
    trust: 'No spam: we only write about the launch. Leave the list anytime.',
    rule: 'The coupon is sent by email at launch, to everyone on the list.',
    thanks: 'Done! Your spot is secured 🎉',
    thanksSub: 'The coupon arrives by email when the t-shirts launch.',
    error: 'That did not work just now. Please try again in a moment.',
  },
  es: {
    miniTitle: 'Cupón de descuento para quien entre en la lista', miniSub: 'Camisetas Aurenstar', leftShort: (n: number) => `${n} ya entraron`,
    badge: 'Cupón de lanzamiento',
    title: 'Asegura tu cupón de descuento',
    body: 'Quien entra en la lista recibe un cupón exclusivo en el lanzamiento de las camisetas de Aurenstar. Cuanto antes, mejor: te avisamos primero.',
    joined: (n: number) => (n === 1 ? '1 persona ya entró' : `${n} personas ya entraron`),
    placeholder: 'Escribe tu mejor correo',
    cta: 'Quiero mi cupón',
    sending: 'Enviando…',
    trust: 'Sin spam: solo avisamos del lanzamiento. Sales de la lista cuando quieras.',
    rule: 'El cupón se envía por correo en el lanzamiento, a todas las personas de la lista.',
    thanks: '¡Listo! Tu lugar está asegurado 🎉',
    thanksSub: 'El cupón llega por correo cuando se lancen las camisetas.',
    error: 'No funcionó ahora. Inténtalo de nuevo en un momento.',
  },
} as const;

/** Sign-up card for the t-shirt waiting list with the launch coupon for the first people. Hidden for people already on the list. */
export const TshirtCapture: React.FC<{ source: SubscribeSource; sign?: string; variant?: 'card' | 'mini'; flush?: boolean }> = ({ source, sign, variant = 'card', flush = false }) => {
  const { language } = useLanguage();
  const lang = (language === 'pt' || language === 'es' ? language : 'en') as 'pt' | 'en' | 'es';
  const t = TEXT[lang];
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [already, setAlready] = useState(() => isOnTshirtList());
  const [taken, setTaken] = useState<number | null>(null);
  useEffect(() => { if (!already) getCouponSpots().then((r) => setTaken(r.taken)); }, [already]);
  // when the person joins through one card, the other cards on the page disappear
  useEffect(() => {
    const h = () => setAlready(true);
    window.addEventListener('aurenstar-tshirt-joined', h);
    return () => window.removeEventListener('aurenstar-tshirt-joined', h);
  }, []);

  if (already && state !== 'done') return null;


  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === 'sending' || !consent || !email.trim() || emailMessage(email, lang)) return;
    setState('sending');
    const ok = await subscribeEmail({ email, sign, lang, source });
    if (ok) { trackEvent('tshirt_signup', { source }); window.setTimeout(() => window.dispatchEvent(new Event('aurenstar-tshirt-joined')), 0); }
    setState(ok ? 'done' : 'error');
  };

  const field = 'min-w-0 flex-1 rounded-full border-2 border-[#D9E8F8] bg-[#F4F9FF] px-5 py-3.5 text-sm font-semibold text-[#172B4D] outline-none placeholder:font-normal placeholder:text-[#647DA5] focus:border-[#E73578] focus:bg-white';
  const cta = 'shrink-0 cursor-pointer rounded-full bg-[#E73578] px-7 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#E73578]/25 transition-all hover:scale-[1.03] hover:bg-[#D0306C] active:scale-95 disabled:opacity-60';
  const box = 'rounded-3xl border border-[#D9E8F8] bg-white shadow-[0_10px_30px_rgba(57,130,200,0.12)]';
  const onEmail = (e: React.ChangeEvent<HTMLInputElement>) => { setEmail(e.target.value); e.target.setCustomValidity(emailMessage(e.target.value, lang)); };
  const ctaLabel = state === 'sending' ? t.sending : `${t.cta} →`;
  const consentRow = (
    <label className="flex cursor-pointer items-start gap-2.5 text-xs leading-snug text-[#17366F]">
      <input type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#E73578]" />
      <span>{TSHIRT_CONSENT[lang]}</span>
    </label>
  );
  const wrap = variant === 'mini' ? (flush ? 'w-full' : 'mx-auto w-[calc(100%-2rem)] max-w-3xl') : (flush ? 'w-full' : 'mx-auto my-8 w-full max-w-3xl');

  if (state === 'done') {
    return (
      <div className={`${wrap} ${box} p-7 text-center`}>
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#E73578] text-white"><Check className="h-6 w-6" strokeWidth={3} /></span>
        <p className="mt-3 text-lg font-extrabold text-[#172B4D]">{t.thanks}</p>
        <p className="mt-1 text-sm text-[#647DA5]">{t.thanksSub}</p>
      </div>
    );
  }

  if (variant === 'mini') {
    return (
      <form onSubmit={submit} className={`${wrap} ${box} p-4 sm:p-5`}>
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex items-center gap-3 md:max-w-[17rem]">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FDE8F0] text-[#E73578]"><Shirt className="h-5 w-5" /></span>
            <div>
              <p className="text-sm font-extrabold leading-snug text-[#172B4D]">{t.miniTitle}</p>
              <p className="text-xs font-semibold text-[#E73578]">{t.miniSub}{taken !== null && taken >= 10 ? ` · ${t.leftShort(taken)}` : ''}</p>
            </div>
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row">
            <input type="email" required value={email} onChange={onEmail} placeholder={t.placeholder} className={field} />
            <button type="submit" disabled={state === 'sending'} className={cta}>{ctaLabel}</button>
          </div>
        </div>
        <div className="mt-3">{consentRow}</div>
        {state === 'error' && <p className="mt-2 rounded-lg bg-[#FDE8F0] px-3 py-2 text-xs font-bold text-[#E73578]">{t.error}</p>}
      </form>
    );
  }

  return (
    <div className={`${wrap} ${box} overflow-hidden`}>
      <div className="h-1.5 w-full bg-gradient-to-r from-[#3982C8] to-[#E73578]" />
      <form onSubmit={submit} className="p-6 sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FDE8F0] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#E73578]"><Ticket className="h-3.5 w-3.5" /> {t.badge}</span>
          <Shirt className="h-6 w-6 text-[#3982C8]" aria-hidden />
        </div>
        <h3 className="mt-4 text-2xl font-extrabold leading-tight text-[#172B4D] sm:text-3xl">{t.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-[#647DA5]">{t.body}</p>

        {taken !== null && taken >= 10 && (
          <div className="mt-5 flex items-center gap-3 rounded-2xl bg-[#F4F9FF] p-4">
            <span className="text-4xl font-extrabold leading-none tabular-nums text-[#172B4D]">{taken}</span>
            <span className="text-sm font-semibold text-[#17366F]">🔥 {t.joined(taken)}</span>
          </div>
        )}

        <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
          <input type="email" required value={email} onChange={onEmail} placeholder={t.placeholder} className={field} />
          <button type="submit" disabled={state === 'sending'} className={cta}>{ctaLabel}</button>
        </div>
        <div className="mt-4">{consentRow}</div>
        <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-snug text-[#647DA5]"><Lock className="mt-0.5 h-3 w-3 shrink-0" />{t.trust}</p>
        <p className="mt-1 text-[11px] leading-snug text-[#647DA5]">{t.rule}</p>
        {state === 'error' && <p className="mt-3 rounded-lg bg-[#FDE8F0] px-3 py-2 text-xs font-bold text-[#E73578]">{t.error}</p>}
      </form>
    </div>
  );
};
