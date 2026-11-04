import React, { useEffect, useState } from 'react';
import { Shirt } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { emailMessage } from '../utils/emailGuard';
import { getCouponSpots, isOnTshirtList, subscribeEmail, type SubscribeSource } from '../utils/subscribe';
import { TSHIRT_CONSENT } from '../data/subscribeConsent';
import { trackEvent } from '../utils/analytics';

const TEXT = {
  pt: { title: 'Cupom de lançamento para as 50 primeiras pessoas 👕', body: 'Entre na lista das camisetas da Aurenstar: as 50 primeiras inscrições ganham um cupom de desconto no lançamento.', left: (n: number) => (n === 1 ? 'Resta só 1 vaga!' : `Restam só ${n} vagas!`), full: 'As 50 vagas do cupom acabaram, mas você ainda pode entrar para ser avisado(a) do lançamento.', rule: 'O cupom é enviado por e-mail no lançamento, para as 50 primeiras inscrições.', placeholder: 'Seu melhor e-mail', btn: 'Entrar na lista', thanks: 'Pronto! Você está na lista. 💙', error: 'Não deu certo agora. Tente de novo em instantes.' },
  en: { title: 'Launch coupon for the first 50 people 👕', body: 'Join the Aurenstar t-shirt list: the first 50 sign-ups get a launch discount coupon.', left: (n: number) => (n === 1 ? 'Only 1 spot left!' : `Only ${n} spots left!`), full: 'All 50 coupon spots are gone, but you can still join to hear about the launch.', rule: 'The coupon is sent by email at launch, to the first 50 sign-ups.', placeholder: 'Your best email', btn: 'Join the list', thanks: 'Done! You are on the list. 💙', error: 'That did not work just now. Please try again in a moment.' },
  es: { title: 'Cupón de lanzamiento para las primeras 50 personas 👕', body: 'Entra en la lista de camisetas de Aurenstar: las primeras 50 inscripciones reciben un cupón de descuento en el lanzamiento.', left: (n: number) => (n === 1 ? '¡Solo queda 1 lugar!' : `¡Solo quedan ${n} lugares!`), full: 'Los 50 lugares del cupón se agotaron, pero aún puedes entrar para saber del lanzamiento.', rule: 'El cupón se envía por correo en el lanzamiento, a las primeras 50 inscripciones.', placeholder: 'Tu mejor correo', btn: 'Entrar en la lista', thanks: '¡Listo! Estás en la lista. 💙', error: 'No funcionó ahora. Inténtalo de nuevo en un momento.' },
} as const;

/** Small sign-up card for the t-shirt waiting list. Hidden for people who are already on the list. */
export const TshirtCapture: React.FC<{ source: SubscribeSource; sign?: string }> = ({ source, sign }) => {
  const { language } = useLanguage();
  const lang = (language === 'pt' || language === 'es' ? language : 'en') as 'pt' | 'en' | 'es';
  const t = TEXT[lang];
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>(() => (isOnTshirtList() ? 'done' : 'idle'));
  const [already] = useState(() => isOnTshirtList());
  const [spots, setSpots] = useState<{ limit: number; left: number | null } | null>(null);
  useEffect(() => { if (!already) getCouponSpots().then(setSpots); }, [already]);

  if (already) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === 'sending' || !consent || !email.trim() || emailMessage(email, lang)) return;
    setState('sending');
    const ok = await subscribeEmail({ email, sign, lang, source });
    if (ok) trackEvent('tshirt_signup', { source });
    setState(ok ? 'done' : 'error');
  };

  return (
    <div className="mx-auto my-8 w-[calc(100%-2rem)] max-w-md rounded-2xl border border-[#D9E8F8] bg-[#E4F1FF] p-5 shadow-sm sm:w-full">
      {state === 'done' ? (
        <p className="text-center text-sm font-bold text-[#17366F]">{t.thanks}</p>
      ) : (
        <form onSubmit={submit}>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#E73578]"><Shirt className="h-5 w-5" /></span>
            <div className="min-w-0">
              <p className="text-sm font-extrabold text-[#172B4D]">{t.title}</p>
              <p className="text-xs text-[#647DA5]">{spots?.left === 0 ? t.full : t.body}</p>
              {spots?.left != null && spots.left > 0 && (
                <>
                  <p className="mt-1.5 text-xs font-extrabold text-[#E73578]">{t.left(spots.left)}</p>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white"><div className="h-full rounded-full bg-[#E73578]" style={{ width: `${Math.round(((spots.limit - spots.left) / spots.limit) * 100)}%` }} /></div>
                </>
              )}
            </div>
          </div>
          <div className="mt-3 flex items-center rounded-full border border-[#D9E8F8] bg-white p-1 focus-within:border-[#3982C8]">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => { setEmail(e.target.value); e.target.setCustomValidity(emailMessage(e.target.value, lang)); }}
              placeholder={t.placeholder}
              className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-[#172B4D] outline-none placeholder:text-[#647DA5]"
            />
            <button type="submit" disabled={state === 'sending'} className="shrink-0 cursor-pointer rounded-full bg-[#E73578] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#D0306C] disabled:opacity-60">{t.btn}</button>
          </div>
          <label className="mt-3 flex cursor-pointer items-start gap-2 text-[11px] leading-snug text-[#647DA5]">
            <input type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-3.5 w-3.5 shrink-0 cursor-pointer accent-[#E73578]" />
            <span>{TSHIRT_CONSENT[lang]}</span>
          </label>
          <p className="mt-2 text-[11px] leading-snug text-[#647DA5]">{t.rule}</p>
          {state === 'error' && <p className="mt-2 text-xs font-semibold text-[#E73578]">{t.error}</p>}
        </form>
      )}
    </div>
  );
};
