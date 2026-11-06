import React, { useEffect, useState } from 'react';
import SendingLabel from './SendingLabel';
import { Check, Lock, Mail, Shirt } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { emailMessage } from '../utils/emailGuard';
import { getCouponSpots, isOnNewsletterList, isOnTshirtList, subscribeEmail, type SubscribeSource } from '../utils/subscribe';
import { NEWSLETTER_CONSENT, TSHIRT_CONSENT } from '../data/subscribeConsent';
import { trackEvent } from '../utils/analytics';

const TEXT = {
  pt: {
    title: 'Gostou? Receba mais, direto no seu e-mail',
    sub: 'Escolha o que você quer receber (um só e-mail para os dois).',
    news: 'Newsletter', newsSub: 'Novos artigos e novidades',
    shirt: 'Cupom das camisetas', shirtSub: (n: number | null) => (n === null || n < 10 ? 'Desconto no lançamento para quem entrar' : `Desconto no lançamento · ${n} pessoas já entraram`),
    placeholder: 'Digite o seu melhor e-mail', cta: 'Quero receber', sending: 'Enviando…',
    pick: 'Marque pelo menos uma opção para continuar.',
    trust: 'Sem spam. Você sai da lista quando quiser.',
    thanks: 'Pronto! Anotamos o seu e-mail 🎉', thanksNews: 'Você vai receber as novidades da Aurenstar.', thanksShirt: 'O cupom chega por e-mail no lançamento das camisetas.',
    error: 'Não deu certo agora. Tente de novo em instantes.',
  },
  en: {
    title: 'Enjoyed this? Get more, straight to your inbox',
    sub: 'Pick what you want to receive (one e-mail for both).',
    news: 'Newsletter', newsSub: 'New articles and news',
    shirt: 'T-shirt coupon', shirtSub: (n: number | null) => (n === null || n < 10 ? 'Launch discount for everyone who joins' : `Launch discount · ${n} people have joined`),
    placeholder: 'Enter your best email', cta: 'Sign me up', sending: 'Sending…',
    pick: 'Tick at least one option to continue.',
    trust: 'No spam. Leave the list anytime.',
    thanks: 'Done! We saved your e-mail 🎉', thanksNews: 'You will receive Aurenstar news.', thanksShirt: 'The coupon arrives by e-mail when the t-shirts launch.',
    error: 'That did not work just now. Please try again in a moment.',
  },
  es: {
    title: '¿Te gustó? Recibe más, directo en tu correo',
    sub: 'Elige lo que quieres recibir (un solo correo para ambos).',
    news: 'Newsletter', newsSub: 'Nuevos artículos y novedades',
    shirt: 'Cupón de camisetas', shirtSub: (n: number | null) => (n === null || n < 10 ? 'Descuento en el lanzamiento para quien entre' : `Descuento en el lanzamiento · ${n} personas ya entraron`),
    placeholder: 'Escribe tu mejor correo', cta: 'Quiero recibirlo', sending: 'Enviando…',
    pick: 'Marca al menos una opción para continuar.',
    trust: 'Sin spam. Sales de la lista cuando quieras.',
    thanks: '¡Listo! Guardamos tu correo 🎉', thanksNews: 'Recibirás las novedades de Aurenstar.', thanksShirt: 'El cupón llega por correo cuando se lancen las camisetas.',
    error: 'No funcionó ahora. Inténtalo de nuevo en un momento.',
  },
} as const;

/**
 * One sign-up card for the end of an article: one e-mail, two separate tick boxes (newsletter and t-shirt coupon).
 * Each box keeps its own consent sentence and its own list. Options the person already joined are not shown again.
 */
export const EmailCaptureCard: React.FC<{ source: SubscribeSource; sign?: string }> = ({ source, sign }) => {
  const { language } = useLanguage();
  const lang = (language === 'pt' || language === 'es' ? language : 'en') as 'pt' | 'en' | 'es';
  const t = TEXT[lang];
  const [email, setEmail] = useState('');
  const [wantNews, setWantNews] = useState(false);
  const [wantShirt, setWantShirt] = useState(false);
  const [hasNews, setHasNews] = useState(() => isOnNewsletterList());
  const [hasShirt, setHasShirt] = useState(() => isOnTshirtList());
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [joined, setJoined] = useState<{ news: boolean; shirt: boolean }>({ news: false, shirt: false });
  const [people, setPeople] = useState<number | null>(null);
  useEffect(() => { if (!hasShirt) getCouponSpots().then((s) => setPeople(s.taken)); }, [hasShirt]);
  useEffect(() => {
    const h = () => setHasShirt(true);
    window.addEventListener('aurenstar-tshirt-joined', h);
    return () => window.removeEventListener('aurenstar-tshirt-joined', h);
  }, []);

  if (state !== 'done' && hasNews && hasShirt) return null;

  const box = 'rounded-3xl border border-[#D9E8F8] bg-white shadow-[0_10px_30px_rgba(57,130,200,0.12)]';
  if (state === 'done') {
    return (
      <div className={`${box} w-full p-7 text-center`}>
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#E73578] text-white"><Check className="h-6 w-6" strokeWidth={3} /></span>
        <p className="mt-3 text-lg font-extrabold text-[#172B4D]">{t.thanks}</p>
        <p className="mt-1 text-sm text-[#647DA5]">{[joined.news && t.thanksNews, joined.shirt && t.thanksShirt].filter(Boolean).join(' ')}</p>
      </div>
    );
  }

  const nothingTicked = !((!hasNews && wantNews) || (!hasShirt && wantShirt));
  const onEmail = (e: React.ChangeEvent<HTMLInputElement>) => { setEmail(e.target.value); e.target.setCustomValidity(emailMessage(e.target.value, lang)); };
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === 'sending' || nothingTicked || !email.trim() || emailMessage(email, lang)) return;
    setState('sending');
    const doNews = !hasNews && wantNews;
    const doShirt = !hasShirt && wantShirt;
    const okNews = doNews ? await subscribeEmail({ email, sign, lang, source, list: 'newsletter' }) : true;
    const okShirt = doShirt ? await subscribeEmail({ email, sign, lang, source, list: 'tshirts' }) : true;
    if (okNews && okShirt) {
      if (doNews) trackEvent('newsletter_signup', { source });
      if (doShirt) { trackEvent('tshirt_signup', { source }); window.setTimeout(() => window.dispatchEvent(new Event('aurenstar-tshirt-joined')), 0); }
      setJoined({ news: doNews, shirt: doShirt });
      setState('done');
    } else {
      // one of them may have worked: do not offer it again
      if (okNews && doNews) setHasNews(true);
      setState('error');
    }
  };

  const tile = (on: boolean) => `flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-3.5 transition-colors ${on ? 'border-[#E73578] bg-[#FDE8F0]/60' : 'border-[#D9E8F8] bg-[#F4F9FF] hover:border-[#3982C8]/50'}`;
  const field = 'min-w-0 flex-1 rounded-full border-2 border-[#D9E8F8] bg-[#F4F9FF] px-5 py-3.5 text-sm font-semibold text-[#172B4D] outline-none placeholder:font-normal placeholder:text-[#647DA5] focus:border-[#E73578] focus:bg-white';
  const cta = 'shrink-0 cursor-pointer rounded-full bg-[#E73578] px-7 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#E73578]/25 transition-all hover:scale-[1.03] hover:bg-[#D0306C] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100';
  const options = [
    !hasNews && { key: 'news', on: wantNews, set: setWantNews, icon: <Mail className="h-5 w-5" />, title: t.news, sub: t.newsSub, consent: NEWSLETTER_CONSENT[lang] },
    !hasShirt && { key: 'shirt', on: wantShirt, set: setWantShirt, icon: <Shirt className="h-5 w-5" />, title: t.shirt, sub: t.shirtSub(people), consent: TSHIRT_CONSENT[lang] },
  ].filter(Boolean) as { key: string; on: boolean; set: (v: boolean) => void; icon: React.ReactNode; title: string; sub: string; consent: string }[];

  return (
    <form onSubmit={submit} className={`${box} w-full p-5 sm:p-7`}>
      <h3 className="text-xl font-extrabold leading-tight text-[#172B4D] sm:text-2xl">{t.title}</h3>
      <p className="mt-1 text-sm text-[#647DA5]">{t.sub}</p>
      <div className={`mt-4 grid gap-3 ${options.length > 1 ? 'sm:grid-cols-2' : ''}`}>
        {options.map((o) => (
          <label key={o.key} className={tile(o.on)}>
            <input type="checkbox" checked={o.on} onChange={(e) => o.set(e.target.checked)} className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-[#E73578]" />
            <span className="min-w-0">
              <span className="flex items-center gap-2 text-sm font-extrabold text-[#172B4D]"><span className="text-[#E73578]">{o.icon}</span>{o.title}</span>
              <span className="mt-0.5 block text-xs font-semibold text-[#E73578]">{o.sub}</span>
              <span className="mt-1.5 block text-[11px] leading-snug text-[#647DA5]">{o.consent}</span>
            </span>
          </label>
        ))}
      </div>
      <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
        <input type="email" required value={email} onChange={onEmail} placeholder={t.placeholder} className={field} />
        <button type="submit" disabled={state === 'sending' || nothingTicked} className={cta}>{state === 'sending' ? <SendingLabel lang={lang} /> : `${t.cta} →`}</button>
      </div>
      {nothingTicked && email.trim() !== '' && <p className="mt-2 text-xs font-semibold text-[#647DA5]">{t.pick}</p>}
      <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-snug text-[#647DA5]"><Lock className="mt-0.5 h-3 w-3 shrink-0" />{t.trust}</p>
      {state === 'error' && <p className="mt-3 rounded-lg bg-[#FDE8F0] px-3 py-2 text-xs font-bold text-[#E73578]">{t.error}</p>}
    </form>
  );
};
