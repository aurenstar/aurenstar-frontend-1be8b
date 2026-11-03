/**
 * Country (from the visitor's network address) -> main language to read in.
 * Used to show the article in the visitor's own language and with local references.
 * Format: "COUNTRY:language" (ISO country code : ISO language code). Anything not listed falls back to English.
 */
const TABLE = `
AF:fa AL:sq DZ:ar AD:ca AO:pt AG:en AR:es AM:hy AU:en AT:de AZ:az BS:en BH:ar BD:bn BB:en BY:ru BE:nl BZ:en BJ:fr BT:dz
BO:es BA:bs BW:en BR:pt BN:ms BG:bg BF:fr BI:fr CV:pt KH:km CM:fr CA:en CF:fr TD:fr CL:es CN:zh CO:es KM:ar CG:fr CD:fr
CR:es CI:fr HR:hr CU:es CY:el CZ:cs DK:da DJ:fr DM:en DO:es EC:es EG:ar SV:es GQ:es ER:ti EE:et SZ:en ET:am FJ:en FI:fi
FR:fr GA:fr GM:en GE:ka DE:de GH:en GR:el GD:en GT:es GN:fr GW:pt GY:en HT:fr HN:es HK:zh HU:hu IS:is IN:en ID:id IR:fa
IQ:ar IE:en IL:he IT:it JM:en JP:ja JO:ar KZ:ru KE:en KI:en KW:ar KG:ru LA:lo LV:lv LB:ar LS:en LR:en LY:ar LI:de LT:lt
LU:fr MO:zh MG:fr MW:en MY:ms MV:dv ML:fr MT:en MH:en MR:ar MU:en MX:es FM:en MD:ro MC:fr MN:mn ME:sr MA:ar MZ:pt MM:my
NA:en NR:en NP:ne NL:nl NZ:en NI:es NE:fr NG:en MK:mk NO:no OM:ar PK:ur PW:en PS:ar PA:es PG:en PY:es PE:es PH:en PL:pl
PT:pt PR:es QA:ar RO:ro RU:ru RW:en KN:en LC:en VC:en WS:en SM:it ST:pt SA:ar SN:fr RS:sr SC:en SL:en SG:en SK:sk SI:sl
SB:en SO:so ZA:en KR:ko SS:en ES:es LK:si SD:ar SR:nl SE:sv CH:de SY:ar TW:zh TJ:tg TZ:sw TH:th TL:pt TG:fr TO:en TT:en
TN:ar TR:tr TM:tk TV:en UG:en UA:uk AE:ar GB:en US:en UY:es UZ:uz VU:en VA:it VE:es VN:vi YE:ar ZM:en ZW:en XK:sq
`;

export const COUNTRY_LANGUAGE: Record<string, string> = Object.fromEntries(
  TABLE.split(/\s+/)
    .filter(Boolean)
    .map((pair) => pair.split(':') as [string, string]),
);

/**
 * Countries where more than one language is really spoken: the visitor's browser language decides among these
 * (a Swiss visitor whose browser is in French reads French). Everywhere else the country's main language is used,
 * so a Brazilian with an English browser still gets Portuguese.
 */
const EXTRA = `
US:en,es CH:de,fr,it BE:nl,fr,de LU:fr,de,lb CA:en,fr ES:es,ca,gl,eu IN:en,hi,bn,ta,te,mr,gu,kn,ml,pa,ur ZA:en,af,zu SG:en,zh,ms,ta
FI:fi,sv MA:ar,fr DZ:ar,fr TN:ar,fr LB:ar,fr,en EG:ar,en AE:ar,en JO:ar,en IL:he,ar,en PK:ur,en,pa PH:en,tl NG:en,yo,ha,ig
KE:en,sw TZ:sw,en UG:en,sw CM:fr,en MY:ms,en,zh,ta HK:zh,en MO:zh,pt UA:uk,ru KZ:ru,kk KG:ky,ru BY:ru,be MD:ro,ru
EE:et,ru LV:lv,ru LT:lt,ru ME:sr,bs,sq RS:sr,hu MK:mk,sq BA:bs,hr,sr HR:hr,sr AT:de,hr LI:de CY:el,tr GE:ka,ru AM:hy,ru AZ:az,ru
`;
const COUNTRY_LANGUAGES: Record<string, string[]> = Object.fromEntries(
  EXTRA.split(/\s+/)
    .filter(Boolean)
    .map((pair) => {
      const [c, langs] = pair.split(':');
      return [c, langs.split(',')] as [string, string[]];
    }),
);

/** Browser languages in the order the visitor prefers them ("pt-BR,pt;q=0.9,en;q=0.8" -> ["pt","en"]). */
export function browserLanguages(request: Request): string[] {
  const header = request.headers.get('Accept-Language') || '';
  return header
    .split(',')
    .map((part) => {
      const [tag, q] = part.trim().split(';q=');
      return { lang: tag.split('-')[0].toLowerCase(), q: q ? parseFloat(q) : 1 };
    })
    .filter((x) => /^[a-z]{2,3}$/.test(x.lang) && x.q > 0)
    .sort((a, b) => b.q - a.q)
    .map((x) => x.lang);
}

export { URL_LANGUAGES, URL_LANG_COUNTRY, isUrlLanguage, isTranslatedLanguage } from '../../src/utils/urlLang';

/** Languages written right-to-left (the page must flip direction). */
export const RTL_LANGUAGES = new Set(['ar', 'he', 'fa', 'ur', 'dv']);

/** Languages the site menus already exist in. */
export const SITE_LANGUAGES = ['en', 'pt', 'es'] as const;

export interface VisitorLocale {
  country: string; // ISO country code, "US" when unknown
  language: string; // ISO language code to read the article in
  known: boolean; // false when the country could not be detected (safe fallback: English / United States)
}

/** Country code from Cloudflare (a header it adds to every request). Never taken from the URL, so nobody can ask for any country. */
export function visitorLocale(request: Request): VisitorLocale {
  const raw = String(((request as any).cf?.country as string) || request.headers.get('CF-IPCountry') || '').toUpperCase();
  const country = /^[A-Z]{2}$/.test(raw) && raw !== 'XX' && raw !== 'T1' ? raw : '';
  if (!country) return { country: 'US', language: 'en', known: false };
  const main = COUNTRY_LANGUAGE[country] || 'en';
  // The browser language wins only when it is one of the languages really spoken in that country.
  const spoken = COUNTRY_LANGUAGES[country];
  const fromBrowser = spoken ? browserLanguages(request).find((l) => spoken.includes(l)) : undefined;
  return { country, language: fromBrowser || main, known: true };
}

/** English names ("Brazil", "Brazilian Portuguese"-style language names) for the instructions. */
export function countryName(code: string): string {
  try {
    return new Intl.DisplayNames(['en'], { type: 'region' }).of(code) || code;
  } catch {
    return code;
  }
}
export function languageName(code: string): string {
  try {
    return new Intl.DisplayNames(['en'], { type: 'language' }).of(code) || code;
  } catch {
    return code;
  }
}
