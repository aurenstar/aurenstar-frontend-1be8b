/**
 * Blocks "temporary" e-mail addresses (the throw-away inboxes people use to avoid giving a real one).
 * Used by every form that asks for an e-mail. It also catches obvious typos.
 */

// Well-known throw-away providers (domain and every sub-domain of it).
const DISPOSABLE = `
mailinator.com mailinator.net mailinator2.com guerrillamail.com guerrillamail.net guerrillamail.org guerrillamail.biz guerrillamail.de
guerrillamailblock.com sharklasers.com grr.la spam4.me pokemail.net 10minutemail.com 10minutemail.net 10minutemail.org 10minemail.com
20minutemail.com 20minutemail.it 30minutemail.com temp-mail.org temp-mail.io temp-mail.ru tempmail.com tempmail.net tempmail.org
tempmail.dev tempmail.email tempmail.plus tempmailo.com tempmailer.com tempmailaddress.com tempinbox.com tempr.email temporary-mail.net
throwawaymail.com throwam.com trashmail.com trashmail.net trashmail.org trashmail.de trashmail.io trash-mail.com trash-mail.de trashmail.me
yopmail.com yopmail.net yopmail.fr cool.fr.nf jetable.fr.nf nospam.ze.tc nomail.xl.cx mega.zik.dj speed.1s.fr courriel.fr.nf moncourrier.fr.nf
monemail.fr.nf monmail.fr.nf getnada.com nada.email nada.ltd fakeinbox.com fakemail.net fakemailgenerator.com fake-mail.net dispostable.com
discard.email discardmail.com discardmail.de maildrop.cc mailnesia.com mailcatch.com mailforspam.com mailnull.com mailsac.com mailtothis.com
mytemp.email mytrashmail.com mt2014.com mt2015.com meltmail.com moakt.com moakt.cc moakt.ws tmpmail.org tmpmail.net tmpeml.com tmails.net
emailondeck.com email-fake.com emailfake.com emailtemporanea.com emailtemporanea.net emailtemporar.ro emailtemporario.com.br
emailsensei.com emailthe.net einrot.com einrot.de sofort-mail.de wegwerfmail.de wegwerfmail.net wegwerfmail.org wegwerfadresse.de
einmalmail.de eintagsmail.de spambox.us spambog.com spambog.de spambog.ru spamex.com spamfree24.org spamgourmet.com spamherelots.com
spamhereplease.com spamhole.com spamify.com spaml.com spammotel.com spamslicer.com spamspot.com spamthis.co.uk spamtroll.net
getairmail.com airmail.cc anonbox.net anonymbox.com binkmail.com bobmail.info bofthew.com bugmenot.com burnermail.io byom.de
chammy.info chogmail.com choicemail1.com clrmail.com cuvox.de dayrep.com deadaddress.com despam.it devnullmail.com dingbone.com
disposableaddress.com disposableemailaddresses.com disposableinbox.com dodgeit.com dodgit.com dontreg.com dontsendmespam.de
drdrb.com dump-email.info dumpmail.de dumpyemail.com e4ward.com easytrashmail.com emailias.com emailigo.de emailmiser.com
emailwarden.com emailx.at.hm enterto.com ephemail.net etranquil.com etranquil.net etranquil.org evopo.com explodemail.com
fastacura.com fastchevy.com fastchrysler.com fastkawasaki.com fastmazda.com fastmitsubishi.com fastnissan.com fastsubaru.com
fastsuzuki.com fasttoyota.com fastyamaha.com filzmail.com fixmail.tk flyspam.com fr33mail.info frapmail.com front14.org
gishpuppy.com great-host.in greensloth.com gsrv.co.uk guerillamail.com h8s.org haltospam.com hatespam.org herp.in hidemail.de
hochsitze.com hotpop.com hulapla.de ieh-mail.de imails.info inboxalias.com inboxclean.com inboxclean.org incognitomail.com
incognitomail.net incognitomail.org instant-mail.de ipoo.org irish2me.com jetable.com jetable.net jetable.org jnxjn.com
junk1e.com kasmail.com kaspop.com keepmymail.com killmail.com killmail.net klassmaster.com klzlk.com kulturbetrieb.info
kurzepost.de lackmail.net lifebyfood.com link2mail.net litedrop.com lol.ovpn.to lookugly.com lortemail.dk lr78.com
maileater.com mailexpire.com mailfa.tk mailfreeonline.com mailguard.me mailimate.com mailin8r.com mailinater.com mailismagic.com
mailme.lv mailme24.com mailmetrash.com mailmoat.com mailms.com mailnator.com mailscrap.com mailshell.com mailsiphon.com
mailslite.com mailtemp.info mailtome.de mailtrash.net mailtv.net mailzilla.com mbx.cc messagebeamer.de mierdamail.com
mintemail.com moncourrier.fr mothere.com mt2009.com mx0.wwwnew.eu mypartyclip.de myphantomemail.com mysamp.de
nepwk.com nervmich.net nervtmich.net netmails.com netmails.net neverbox.com no-spam.ws nobulk.com noclickemail.com
nogmailspam.info nomail2me.com nospam4.us nospamfor.us nospamthanks.info notmailinator.com nowmymail.com objectmail.com
obobbo.com odnorazovoe.ru oneoffemail.com onewaymail.com online.ms oopi.org ordinaryamerican.net otherinbox.com
owlpic.com pancakemail.com pjjkp.com plexolan.de politikerclub.de poofy.org pookmail.com privacy.net proxymail.eu
prtnx.com putthisinyourspamdatabase.com quickinbox.com rcpt.at reallymymail.com recode.me recursor.net regbypass.com
rejectmail.com rmqkr.net rppkn.com rtrtr.com s0ny.net safe-mail.net safersignup.de safetymail.info sandelf.de
saynotospams.com selfdestructingmail.com sendspamhere.com shiftmail.com shitmail.me shitware.nl shortmail.net
sibmail.com skeefmail.com slaskpost.se slopsbox.com smellfear.com snakemail.com sneakemail.com snkmail.com sogetthis.com
soodonims.com spoofmail.de squizzy.de ssoia.com startkeys.com stinkefinger.net stop-my-spam.cf streetwisemail.com
supergreatmail.com supermailer.jp superrito.com suremail.info tafmail.com tagyourself.com talkinator.com tapchicuoihoi.com
teewars.org teleworm.com teleworm.us temp.emeraldwebmail.com tempail.com tempe-mail.com tempemail.biz tempemail.com
tempemail.net tempinbox.co.uk tempmail.eu tempmail2.com tempomail.fr temporarily.de temporaryemail.net temporaryemail.us
temporaryforwarding.com temporaryinbox.com temporarymailaddress.com thanksnospam.info thankyou2010.com thisisnotmyrealemail.com
throam.com throwawayemailaddress.com tilien.com tittbit.in tizi.com tmailinator.com toiea.com tradermail.info trash2009.com
trash2010.com trash2011.com trashdevil.com trashemail.de trashymail.com trashymail.net trbvm.com turual.com twinmail.de
tyldd.com uggsrock.com umail.net upliftnow.com uplipht.com uroid.com us.af venompen.com veryrealemail.com viditag.com
viralplays.com vpn.st vsimcard.com vubby.com wasteland.rfc822.org webemail.me weg-werf-email.de wegwerf-emails.de
wh4f.org whyspam.me willhackforfood.biz willselfdestruct.com winemaven.info wronghead.com wuzup.net wuzupmail.net
www.e4ward.com www.gishpuppy.com www.mailinator.com wwwnew.eu xagloo.com xemaps.com xents.com xmaily.com xoxy.net
yapped.net yeah.net yep.it yogamaven.com yuurok.com zehnminutenmail.de zippymail.info zoaxe.com zoemail.org
1secmail.com 1secmail.net 1secmail.org kzccv.com qiott.com wuuvo.com icznn.com ezztt.com vjuum.com laafd.com txcct.com
cevipsa.com tmpbox.net tmpmail.io mohmal.com emailnax.com luxusmail.org inboxbear.com mail-temp.com mail.tm
lyricspad.net mailpoof.com mailpoof.net mail7.io harakirimail.com fexbox.org fexbox.ru fexpost.com rover.info
guerrillamail.info inbox.testmail.app testmail.app yomail.info sharedmailbox.org dropmail.me emltmp.com
10mail.org 10mail.com anonaddy.me duck.com.invalid gmailnator.com gmailnator.net emailnator.com tempmailin.com
cs.email-temp.com tempmailgen.com disbox.net disbox.org crazymailing.com instaddr.ch spambox.xyz mailbox.in.ua
getnada.cc inboxkitten.com nwytg.net vomoto.com nezid.com
`
  .split(/\s+/)
  .filter(Boolean);

const DISPOSABLE_SET = new Set(DISPOSABLE.map((d) => d.toLowerCase()));

// Words that almost only appear in throw-away services.
const SUSPECT_WORDS = /(^|[.\-_])(tempmail|temp-mail|tmpmail|trashmail|throwaway|throw-away|disposable|10minute|20minute|minutemail|guerrilla|mailinator|yopmail|fakeinbox|fakemail|spambox|spamgourmet|maildrop|burner|getnada|sharklasers|tempinbox|mohmal|dropmail)/i;

// Common typos of big providers -> the real one.
const TYPOS: Record<string, string> = {
  'gmial.com': 'gmail.com', 'gmai.com': 'gmail.com', 'gamil.com': 'gmail.com', 'gmail.con': 'gmail.com', 'gmail.co': 'gmail.com',
  'gmaill.com': 'gmail.com', 'gnail.com': 'gmail.com', 'hotmial.com': 'hotmail.com', 'hotmal.com': 'hotmail.com',
  'hotmail.con': 'hotmail.com', 'outlok.com': 'outlook.com', 'outlook.con': 'outlook.com', 'yaho.com': 'yahoo.com',
  'yahoo.con': 'yahoo.com', 'uol.com': 'uol.com.br', 'bol.com': 'bol.com.br', 'icloud.con': 'icloud.com',
};

export type EmailProblem = 'invalid' | 'temporary' | 'typo' | null;

export function emailDomain(email: string): string {
  const at = email.trim().toLowerCase().lastIndexOf('@');
  return at < 0 ? '' : email.trim().toLowerCase().slice(at + 1);
}

export function isDisposableEmail(email: string): boolean {
  const domain = emailDomain(email);
  if (!domain) return false;
  const parts = domain.split('.');
  for (let i = 0; i < parts.length - 1; i++) {
    if (DISPOSABLE_SET.has(parts.slice(i).join('.'))) return true;
  }
  return SUSPECT_WORDS.test(domain);
}

export function checkEmail(email: string): { problem: EmailProblem; suggestion?: string } {
  const value = email.trim();
  if (!value) return { problem: null };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return { problem: 'invalid' };
  const domain = emailDomain(value);
  if (TYPOS[domain]) return { problem: 'typo', suggestion: value.slice(0, value.lastIndexOf('@') + 1) + TYPOS[domain] };
  if (isDisposableEmail(value)) return { problem: 'temporary' };
  return { problem: null };
}

const MESSAGES = {
  pt: {
    invalid: 'Esse e-mail parece incompleto. Confira e tente de novo.',
    temporary: 'E-mails temporários não são aceitos. Use seu e-mail de verdade, assim você realmente recebe nossas mensagens.',
    typo: (s: string) => `Será que você quis escrever ${s}? Corrija o e-mail para continuar.`,
  },
  en: {
    invalid: 'This email looks incomplete. Please check it and try again.',
    temporary: 'Temporary emails are not accepted. Please use your real email so you actually receive our messages.',
    typo: (s: string) => `Did you mean ${s}? Please fix the email to continue.`,
  },
  es: {
    invalid: 'Este correo parece incompleto. Revísalo e inténtalo de nuevo.',
    temporary: 'No se aceptan correos temporales. Usa tu correo real para recibir nuestros mensajes.',
    typo: (s: string) => `¿Quisiste escribir ${s}? Corrige el correo para continuar.`,
  },
} as const;

/** Text to show next to the field ('' when the e-mail is fine). */
export function emailMessage(email: string, language: string): string {
  const { problem, suggestion } = checkEmail(email);
  if (!problem) return '';
  const m = MESSAGES[(language === 'pt' || language === 'es' ? language : 'en') as 'pt' | 'en' | 'es'];
  if (problem === 'typo') return m.typo(suggestion || '');
  return m[problem];
}
