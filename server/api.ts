/**
 * Shared API logic for /api/zodiac and /api/aureneffect.
 *
 * Used by BOTH:
 *  - server.ts            (Express, local dev / `npm start`)
 *  - functions/api/*.ts   (Cloudflare Pages Functions, production)
 * so the behaviour is identical in both places. The code below was moved out of
 * server.ts unchanged; only the Express req/res plumbing was removed.
 */
import { buildSignals, factsFromTriad, type SkyFacts } from '../src/utils/readingSignals';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import {
  calculateAstrologicalTriad,
  type AstronomicalTriad,
  queryAurenstarEngine,
  generateLocalAurenEffectReading,
  type ReadingLang,
  REFERENCE_CITIES,
  signNameIn,
  formatCelestialPos,
} from '../src/utils/aurenEngine';

// Initialize shared Gemini instance
function getGeminiClient(apiKey?: string) {
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback Zodiac dictionary with rich, personalized guidance for all 12 signs
const ZODIAC_PROFILES: Record<string, {
  color: string;
  lucky: string;
  match: string;
  message: string;
  thinking: string;
  advices: { title: string; desc: string }[];
  affirmation: string;
}> = {
  Aries: {
    color: 'Sunny Gold ☀️',
    lucky: '7',
    match: 'Leo ♌',
    message: 'Your fiery passion shines bright today! Channel your bold energy into one meaningful goal and watch doors open effortlessly.',
    thinking: 'Tuned into Aries energetic spark today: focus on clear direction, physical vitality, and smiling with colleagues.',
    advices: [
      { title: 'Take immediate action on one task', desc: 'Starting is the hardest part; once you begin, momentum will carry you through.' },
      { title: 'Drink an extra glass of water', desc: 'Keep your body hydrated to match your high natural drive and focus.' },
      { title: 'Share a kind word of encouragement', desc: 'Your natural leadership lifts up everyone around you today.' },
    ],
    affirmation: 'I channel my passion into positive actions and inspire those around me.',
  },
  Taurus: {
    color: 'Forest Emerald 🌿',
    lucky: '6',
    match: 'Virgo ♍',
    message: 'Patience and steady dedication are your greatest superpowers today. Trust in the seeds you have already planted.',
    thinking: 'Reflecting on Taurus earthly calm: stability, sensory delight, and appreciating comfort in simple routines.',
    advices: [
      { title: 'Enjoy a peaceful warm drink', desc: 'Take 5 quiet minutes to savor your tea or coffee without checking your phone.' },
      { title: 'Stick to your reliable plan', desc: 'Avoid rushing into sudden changes; your steady rhythm is your best advantage.' },
      { title: 'Tidy up your immediate workspace', desc: 'A clean, cozy space brings immediate mental clarity.' },
    ],
    affirmation: 'I am grounded, patient, and open to the beauty of every present moment.',
  },
  Gemini: {
    color: 'Sky Cyan 🪽',
    lucky: '5',
    match: 'Libra ♎',
    message: 'Curiosity is calling! A joyful conversation or creative thought will spark fresh inspiration before the day ends.',
    thinking: 'Observing Gemini playful intellect: active communication, quick learning, and lighthearted connections.',
    advices: [
      { title: 'Reach out to an old friend', desc: 'A quick text or warm greeting will bring a wave of shared laughter.' },
      { title: 'Write down your best idea', desc: 'Capture fleeting inspirations on paper before they float away.' },
      { title: 'Take a short breath of fresh air', desc: 'Step outdoors to refresh your active mind between activities.' },
    ],
    affirmation: 'My mind is clear, vibrant, and eager to discover wonderful new insights.',
  },
  Cancer: {
    color: 'Silver Pearl 🌙',
    lucky: '2',
    match: 'Pisces ♓',
    message: 'Your intuition and caring warmth are at an all-time high. Trust what your heart whispers over what logic tries to overcomplicate.',
    thinking: 'Listening to Cancer gentle waters: emotional harmony, deep empathy, and honoring personal comfort.',
    advices: [
      { title: 'Honor your natural intuition', desc: 'If something feels right in your heart, follow that quiet hunch.' },
      { title: 'Create a cozy sanctuary at home', desc: 'Dim bright lights or play soothing ambient music this evening.' },
      { title: 'Express heartfelt gratitude', desc: 'Tell someone close to you how much you truly appreciate their presence.' },
    ],
    affirmation: 'I am safe, loved, and guided by my compassionate heart.',
  },
  Leo: {
    color: 'Radiant Amber 🦁',
    lucky: '1',
    match: 'Aries ♈',
    message: 'Step forward and share your warmth! Your natural charisma brings confidence and happiness to everyone in your circle today.',
    thinking: 'Connecting with Leo solar warmth: generosity, creative expression, and authentic self-respect.',
    advices: [
      { title: 'Celebrate a personal win', desc: 'Acknowledge how much you have grown and give yourself credit for recent efforts.' },
      { title: 'Brighten someone’s morning', desc: 'Offer a genuine, heartfelt compliment to someone who least expects it.' },
      { title: 'Stand tall with gentle pride', desc: 'Good posture and an open smile reflect your inner strength.' },
    ],
    affirmation: 'I radiate warmth, kindness, and joyful confidence wherever I go.',
  },
  Virgo: {
    color: 'Sage Mint 🌱',
    lucky: '8',
    match: 'Taurus ♉',
    message: 'Order and attention to detail bring deep satisfaction today. Remember to be as gentle with yourself as you are helpful to others.',
    thinking: 'Analyzing Virgo mindful precision: helpful service, sensible routines, and releasing unnecessary perfectionism.',
    advices: [
      { title: 'Check off your top priority first', desc: 'Complete the one essential task early so you can relax the rest of the day.' },
      { title: 'Release the need for perfection', desc: 'Done with love and good intention is far better than flawless.' },
      { title: 'Stretch your shoulders and neck', desc: 'Release physical tension with a few gentle, deep breathing cycles.' },
    ],
    affirmation: 'I celebrate progress over perfection and trust my capable hands.',
  },
  Libra: {
    color: 'Rose Quartz 🌸',
    lucky: '11',
    match: 'Gemini ♊',
    message: 'Harmony and balance surround you. Where there has been conflict or confusion, peaceful understanding is ready to blossom.',
    thinking: 'Harmonizing Libra social grace: mutual fairness, beautiful surroundings, and peaceful resolution.',
    advices: [
      { title: 'Seek the middle ground', desc: 'Look for win-win solutions that make both sides feel heard and respected.' },
      { title: 'Surround yourself with beauty', desc: 'Place fresh flowers or a favorite piece of art where you can see it.' },
      { title: 'Make a decision without second-guessing', desc: 'Trust your first balanced judgment and move forward calmly.' },
    ],
    affirmation: 'I create harmony, peace, and beautiful balance in all my relationships.',
  },
  Scorpio: {
    color: 'Deep Amethyst 🔮',
    lucky: '9',
    match: 'Cancer ♋',
    message: 'Your laser-focused depth cuts through noise today. Focus your energy on what truly matters and let trivial drama fade away.',
    thinking: 'Reflecting on Scorpio deep resilience: inner strength, focused concentration, and emotional renewal.',
    advices: [
      { title: 'Guard your personal peace', desc: 'Politely step away from petty gossip or unnecessary distractions.' },
      { title: 'Focus on one meaningful transformation', desc: 'Choose one habit you want to improve and commit to it wholeheartedly.' },
      { title: 'Take quiet time for introspection', desc: 'Journaling your private thoughts will reveal powerful personal clarity.' },
    ],
    affirmation: 'I am strong, perceptive, and in total harmony with my inner power.',
  },
  Sagittarius: {
    color: 'Sunset Tangerine 🍊',
    lucky: '3',
    match: 'Aquarius ♒',
    message: 'Optimism is your compass! An open-minded outlook will turn an ordinary moment into a memorable, joyful discovery.',
    thinking: 'Expanding Sagittarius joyful horizons: philosophical optimism, freedom of spirit, and boundless laughter.',
    advices: [
      { title: 'Learn one curious new fact', desc: 'Read a short article about a topic or culture you have never explored.' },
      { title: 'Laugh from your belly today', desc: 'Share a funny story or watch a lighthearted video to uplift your spirits.' },
      { title: 'Take a new path on your walk', desc: 'A change of scenery invites fresh perspectives into your mind.' },
    ],
    affirmation: 'Life is an exciting adventure and I welcome every opportunity to learn.',
  },
  Capricorn: {
    color: 'Classic Navy ⚓',
    lucky: '10',
    match: 'Virgo ♍',
    message: 'Your disciplined foundation is building something truly lasting. Keep moving with quiet confidence; success is on the horizon.',
    thinking: 'Reviewing Capricorn mountain resolve: long-term mastery, grounded accountability, and steady perseverance.',
    advices: [
      { title: 'Map out your next milestone', desc: 'Break down a big ambition into three manageable, bite-sized tasks.' },
      { title: 'Acknowledge your resilience', desc: 'Remember all the past obstacles you have successfully overcome.' },
      { title: 'Allow yourself time to truly rest', desc: 'Rest is not a reward for work; it is essential fuel for your greatness.' },
    ],
    affirmation: 'I climb steadily toward my dreams with quiet wisdom and solid determination.',
  },
  Aquarius: {
    color: 'Electric Turquoise ⚡',
    lucky: '4',
    match: 'Sagittarius ♐',
    message: 'Your unique perspective is your gift to the world. Do not be afraid to think outside the box and suggest a fresh, creative idea.',
    thinking: 'Exploring Aquarius visionary spirit: innovative thinking, humanitarian kindness, and authentic freedom.',
    advices: [
      { title: 'Propose an inventive solution', desc: 'Share the creative idea you have been keeping to yourself.' },
      { title: 'Connect with a supportive community', desc: 'Engage with people who share your vision for a better, kinder world.' },
      { title: 'Embrace your authentic quirks', desc: 'Being yourself is the most magnetic thing you can do today.' },
    ],
    affirmation: 'I honor my individuality and share my unique light freely with the world.',
  },
  Pisces: {
    color: 'Ocean Teal 🌊',
    lucky: '12',
    match: 'Scorpio ♏',
    message: 'Gentle waves of creative imagination and empathy bless your day. Allow your artistic side and kind spirit to guide you.',
    thinking: 'Flowing with Pisces ocean empathy: creative dreams, boundless compassion, and peaceful reflection.',
    advices: [
      { title: 'Express your creative imagination', desc: 'Doodle, write, play music, or simply day-dream for a few peaceful minutes.' },
      { title: 'Set gentle energetic boundaries', desc: 'Remember that you can care deeply without absorbing other people’s stress.' },
      { title: 'Connect with water or nature', desc: 'A warm bath or a walk near trees will deeply restore your spirit.' },
    ],
    affirmation: 'I flow gently through life with boundless love, peace, and creative joy.',
  },
};

// API route for Daily Zodiac Message & Star Sign Guidance
export async function handleZodiac(body: any, apiKey?: string) {
  const { sign, element, focus, date } = body || {};
  const signName = sign || 'Aries';
  const profile = ZODIAC_PROFILES[signName] || ZODIAC_PROFILES.Aries;

  try {
    const ai = getGeminiClient(apiKey);
    if (!ai) {
      return ({
        success: true,
        data: {
          sign: signName,
          dailyMessage: profile.message,
          thinkingProcess: profile.thinking,
          energyLevel: 94,
          luckyNumber: profile.lucky,
          luckyColor: profile.color,
          bestMatch: profile.match,
          threeSimpleAdvices: profile.advices,
          affirmation: profile.affirmation,
        },
      });
    }

    const prompt = `You are a warm, wise, uplifting astrological guide.
The user is asking for their Daily Zodiac Message & Star Sign Guidance:
- Sign: "${signName}"
- Element: "${element || 'Fire'}"
- Focus of the day: "${focus || 'General Guidance'}"
- Date: "${date || 'Today'}"

CRITICAL RULES:
- Use plain, simple, warm words that anyone can easily understand! ZERO heavy technical terms, confusing jargon, or scary predictions. Keep it pleasant, clear, uplifting, and comforting.
- Deliver genuine encouragement, actionable gentle advice, and positivity.

Return STRICTLY a JSON object with this structure:
{
  "sign": "${signName}",
  "dailyMessage": "A warm, inspiring 2-3 sentence daily reading in clear, simple words",
  "thinkingProcess": "Explain in simple, gentle words how you reflected deeply on this star sign's mood, nature, and energy today",
  "energyLevel": (number between 85 and 98),
  "luckyNumber": "a number from 1 to 99",
  "luckyColor": "a vibrant, joyful color name with emoji",
  "bestMatch": "a compatible star sign name with emoji",
  "threeSimpleAdvices": [
    { "title": "Simple advice 1", "desc": "Easy practical explanation" },
    { "title": "Simple advice 2", "desc": "Easy practical explanation" },
    { "title": "Simple advice 3", "desc": "Easy practical explanation" }
  ],
  "affirmation": "A short, beautiful positive affirmation"
}`;

    // Using gemini-3.8-flash for high responsiveness and free tier availability
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.LOW,
        },
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.trim() || '{}';
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      data = JSON.parse(cleaned);
    }

    return ({ success: true, data });
  } catch (err: any) {
    // Graceful fallback without breaking the user experience
    return ({
      success: true,
      data: {
        sign: signName,
        dailyMessage: profile.message,
        thinkingProcess: profile.thinking,
        energyLevel: 93,
        luckyNumber: profile.lucky,
        luckyColor: profile.color,
        bestMatch: profile.match,
        threeSimpleAdvices: profile.advices,
        affirmation: profile.affirmation,
      },
    });
  }
}

/** Real positions computed by the Swiss Ephemeris engine (only available on Cloudflare). */
export interface DailyAstro {
  natal: Record<'sun' | 'moon' | 'ascendant' | 'mercury' | 'venus' | 'mars', number>;
  today: Record<'moon' | 'sun' | 'mercury' | 'venus' | 'mars' | 'jupiter' | 'saturn', number>;
  retrograde: Record<'mercury' | 'venus' | 'mars' | 'jupiter' | 'saturn', boolean>;
  aspects: Array<{ transit: string; natal: string; type: string; orb: number }>;
}

export interface PreciseSky {
  astro?: DailyAstro;
  triad: AstronomicalTriad;
  facts?: SkyFacts;
  cityName: string;
}


/** Random creative direction + earlier messages, so two readings never feel the same. */
function varietyBlock(body: any, kind: 'effect' | 'daily' | 'unfiltered'): string {
  const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
  const recent: string[] = Array.isArray(body?.recent)
    ? body.recent.filter((x: unknown) => typeof x === 'string').slice(0, 6).map((x: string) => x.slice(0, 170))
    : [];
  const openings = [
    'open with a short, surprising observation about their day (then the first name)',
    'open with the first name followed by a vivid small scene from daily life',
    'open with the first name and a gentle question',
    'open with the first name and a bold, kind statement',
    'open with a tiny contrast ("on the outside... on the inside...") after the first name',
  ];
  const images = ['weather and skies', 'music and rhythm', 'a road trip', 'cooking and kitchen smells', 'a garden', 'the sea and waves', 'light and shadows', 'a messy desk or a tidy room', 'a phone screen and notifications', 'a crowded bus or a quiet street'];
  const banned = kind === 'unfiltered'
    ? '"você é uma pessoa de coração enorme", "por fora forte, por dentro sensível", "mente inquieta", "alma antiga"'
    : kind === 'daily'
    ? '"a tendência é que conversas e amizades fluam", "mande a um amigo", "Vamos conversar", "momento bom para conversar", "tende a favorecer encontros"'
    : '"mande uma mensagem a alguém", "peça companhia", "escreva por 3 minutos", "respire por 4 segundos", "tem cinco minutos para conversar"';
  return `
VARIETY (the MOST important rule of the whole site: two readings must NEVER feel the same):
- Style for THIS reading: ${pick(openings)}. For the feeling of the text, borrow ONE light image from: ${pick(images)} (use it only if it sounds natural, in at most ONE short phrase; never turn it into an invented event, place or object in the person's day, and never force it).
- Do NOT use these overused ideas or phrases: ${banned}.
- Choose concrete, specific details of daily life instead of generic ones, but only realistic ones. Write natural, fluent, native-sounding text with plain punctuation only: no markdown, no asterisks, no bold, no emojis, no odd or invented expressions.${recent.length ? `\n- This person already received the messages below. Do NOT repeat their ideas, structure, opening or tips; say something clearly different:\n${recent.map((r) => `  * "${r}"`).join('\n')}` : ''}
`;
}

export interface OpenAiConfig { key?: string; model?: string }

export async function handleAurenEffect(body: any, apiKey?: string, precise?: PreciseSky | null, openai?: OpenAiConfig) {
  try {
    const { name, birthDate, birthTime, birthCity } = body || {};
    const lang: ReadingLang = ['pt', 'en', 'es'].includes(body?.lang) ? body.lang : 'en';
    const userName = String(name || 'Andriel').trim().split(/\s+/)[0];
    const cityKey = (birthCity || 'sao-paulo').toLowerCase().replace(/\s+/g, '-');

    // Parse date (YYYY-MM-DD)
    let year = 2000;
    let month = 6;
    let day = 15;
    if (birthDate && typeof birthDate === 'string') {
      const parts = birthDate.split('-');
      if (parts.length === 3) {
        year = parseInt(parts[0], 10) || 2000;
        month = parseInt(parts[1], 10) || 6;
        day = parseInt(parts[2], 10) || 15;
      }
    }

    // Parse time (HH:mm)
    let hours = 14;
    let minutes = 30;
    if (birthTime && typeof birthTime === 'string') {
      const timeParts = birthTime.split(':');
      if (timeParts.length >= 2) {
        hours = parseInt(timeParts[0], 10) || 12;
        minutes = parseInt(timeParts[1], 10) || 0;
      }
    }

    // Camada 01: Dados Brutos Astronômicos (Sol, Lua, Ascendente e Lua no Céu de Hoje)
    const triad = precise?.triad ?? calculateAstrologicalTriad(year, month, day, hours, minutes, cityKey);

    // Camada 02: Aurenstar Engine / Gatilhos Psicológicos de Rotina
    const facts = precise?.facts ?? factsFromTriad(triad);
    const signals = buildSignals(facts, lang, triad.todayMoon.phase);
    const trigger = queryAurenstarEngine(triad, lang, signals.need);

    const birthDateFormatted = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
    const birthTimeFormatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    const cityName = precise?.cityName || REFERENCE_CITIES[cityKey]?.label || (typeof birthCity === 'string' ? birthCity : '') || 'São Paulo, SP';

    // Fallback estruturado de alta fidelidade
    const fallbackResult = generateLocalAurenEffectReading(
      userName,
      birthDateFormatted,
      birthTimeFormatted,
      cityName,
      triad,
      trigger,
      lang,
      facts
    );

    const ai = openai?.key ? null : getGeminiClient(apiKey);
    if (!ai && !openai?.key) {
      return ({ success: true, data: fallbackResult });
    }

    // Camada 03: Comunicação por IA - Google Gemini (Lapidação em linguagem ultra-humana)
    const languageName = { en: 'English', pt: 'Brazilian Portuguese', es: 'Spanish' }[lang];
    const TIP_KINDS = ['a small body action (water, food, stretch, a short walk, fresh air, a shower)', 'a limit set kindly with exact words (asking for time, saying no softly, asking for space)', 'a message to send to a specific kind of person with exact words', 'a small phone or screen habit with a time limit', 'choosing and doing only ONE task first, with a start time', 'a pleasant small treat or break that restores energy (music, tea, sun, a favourite song)', 'a way to ask for exactly the help or attention they need, with exact words', 'a way to give a hard conversation a better moment (after a meal, after a rest, by message first)', 'a tiny home or desk reset of only 5 minutes that clears the head'];
    const sunSignName = signNameIn(triad.sun, lang);
    const tipKinds = [...TIP_KINDS].sort(() => Math.random() - 0.5).slice(0, 3);
    const prompt = `You write the daily "Aureneffect" message for Aurenstar, a friendly astrology site.
Write EVERYTHING in ${languageName}.

THE PERSON:
- First name: "${userName}" (use only this first name)

WHAT IS REALLY GOING ON INSIDE THEM TODAY (already in plain words; these come from their real birth sky and today's sky, so they are personal to this person):
- STRONGEST feeling today (start the message with this one, and make the headline about it): "${signals.aspects[0]?.text || signals.todayMoon}"
- Today's mood: "${signals.todayMoon}"
${signals.aspects.slice(1).map((a) => `- Another feeling today: "${a.text}"`).join('\n')}
- A deeper need behind it: "${signals.natalMoon}"
${signals.mercuryRetro ? `- Also: "${signals.mercuryRetro}"\n` : ''}- Phase of the month: "${signals.phase}"

IDEAS OF TIPS FOR THIS FEELING (only inspiration; replace them with better, more specific tips that really work):
- "${trigger.practicalActions[0].title}: ${trigger.practicalActions[0].description}"
- "${trigger.practicalActions[1].title}: ${trigger.practicalActions[1].description}"
- "${trigger.practicalActions[2].title}: ${trigger.practicalActions[2].description}"

HOW TO WRITE (very important):
1. Start the message with the person's first name. Describe ONLY what they may be feeling right now today. NEVER describe who they are or their personality (no "you are a ... person"). Make the reader think \"wow, how does this site know what I am feeling?\": be specific, name the small real-life moments (a message left unanswered, a tired evening, a sharp reply, a heavy morning), and speak straight to what is in their head. Talk like a kind friend. Use short sentences and everyday words a 12-year-old understands.
2. NEVER mention planets, the Moon, the Sun, zodiac signs, houses, elements or any astrology word. Never say things like "the Moon is in Leo". The reader must NOT see any astrology term, only plain feelings and daily life.
3. Talk about real daily life: work, phone, family, rest, mood. Give no predictions and no orders; offer gentle ideas.
4. Be warm and positive. Never scare the person.
5. THE TIPS MUST BE BUILT FROM YOUR OWN MESSAGE. Write question1Answer first. Then each of the 3 tips must answer one specific situation or feeling that you named in that message (for example: if you said a message may stay unanswered, tip 1 is exactly what to do about waiting for a reply; if you said the person feels tired and heavy, tip 2 is about lightening the day; if you said sharp words can hurt, tip 3 is what to do in the first minute after hearing them). A reader must see the clear link between a sentence of the message and each tip. Do not give generic tips that could fit anyone. Vary the kind of tip across body, mind, phone, people and routine, and do not always use breathing or writing; pick what truly fits THIS person's feelings today.
6. VARIETY AND FOCUS. Tip 1 must be about the STRONGEST feeling and tip 2 about the deeper need; tip 3 may be about another feeling. The side note about messages, plans or misunderstandings is minor: mention it in at most one short sentence of the message, and NEVER make a tip about confirming plans, schedules or clarifying messages unless that is the strongest feeling. Never reuse the same tip idea for different people. For this reading use these three kinds of action as the starting point, in this order: ${tipKinds.join('; ')}.
7. EACH TIP MUST MAKE THE READER THINK "this can really work, I will do it right now". Write each tip like a smart friend who solved this exact problem before: (a) say exactly WHAT to do in a real moment of their day, (b) give the exact words to say or send when people are involved (a natural sentence, not a fill-in-the-blank), (c) say how long or how many times, and (d) end with one short reason why it helps, in plain words ("because ..."). Prefer real-life actions people can do in under 10 minutes: send a specific message, set a limit kindly ("Can I answer you in 1 hour? I want to reply properly"), put the phone on silent for 30 minutes, eat or drink something, walk around the block, tidy only one corner, choose the ONE task that matters most and do it first, leave a hard conversation for after a meal or a rest, ask for exactly the help they need. FORBIDDEN: vague or empty tips ("take a moment", "breathe and relax", "be kind to yourself", "reflect on your feelings"), fill-in-the-blank exercises, "write on paper" exercises, and anything that sounds like therapy homework. Each action is 2 sentences at most (about 35 words) and is easy to understand at first read.
${varietyBlock(body, 'effect')}
Return ONLY a valid JSON object:
{
  "headline": "A very short headline (2 to 5 words) that says exactly the main feeling of your message. No astrology words, no name, no punctuation at the end.",
  "question1Answer": "2 short paragraphs answering 'Why do I feel or act this way today?' in simple words",
  "question2Answer": "1 short, friendly sentence introducing the 3 easy things to do today",
  "practicalSteps": [
    { "stepNumber": 1, "title": "Simple title that names the situation from your message", "action": "What to do + exact words or time + a short because-reason" },
    { "stepNumber": 2, "title": "Simple title", "action": "A specific action with exact numbers or words" },
    { "stepNumber": 3, "title": "Simple title", "action": "A specific action with exact numbers or words" }
  ],
    "shareText": "A post for Instagram or WhatsApp status, written in FIRST PERSON as if the person themselves is showing the world how they feel today as someone of the sign ${sunSignName}. Do NOT write the sign name in the text (the card title already shows it), but let the feeling fit the typical way people of that sign feel and react, mixed with today's feelings above (still no planets, Moon or other astrology words). 2 or 3 short sentences, maximum 240 characters, with real small moments, emotional, honest, relatable and easy to identify with, so friends think 'that is me too'. No person name, no planets or Moon, no advice, no hashtags, no emojis. Same language as the message.",
  "affirmation": "One short, positive sentence the person can repeat today",
  "transparencyNote": "One short, honest sentence saying this is a gentle idea from Aurenstar to help reflect, not a prediction"
}`;

    let text = '{}';
    try {
      if (openai?.key) {
        // ChatGPT (OpenAI) path: a fresh, personal text for every reading.
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 25000);
        try {
          const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${openai.key}` },
            signal: controller.signal,
            body: JSON.stringify({
              model: openai.model || 'gpt-6.1-terra',
              response_format: { type: 'json_object' },
              messages: [{ role: 'user', content: prompt }],
            }),
          });
          if (!res.ok) { const eb: any = await res.json().catch(() => ({})); throw new Error(`OpenAI error ${res.status}: ${eb?.error?.code || ''} ${String(eb?.error?.message || '').slice(0, 140)}`); }
          const json: any = await res.json();
          text = json?.choices?.[0]?.message?.content?.trim() || '{}';
        } finally {
          clearTimeout(timer);
        }
      } else if (ai) {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            thinkingConfig: {
              thinkingLevel: ThinkingLevel.LOW,
            },
            responseMimeType: 'application/json',
          },
        });
        text = response.text?.trim() || '{}';
      }
    } catch (aiError) {
      // The AI is optional: if it is slow, out of credit or down, the ready-made reading is shown.
      console.error('AI unavailable for Aureneffect, using the ready-made reading', aiError);
      return ({ success: true, data: fallbackResult });
    }

    let parsedData: any = {};
    try {
      parsedData = JSON.parse(text);
    } catch {
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      try {
        parsedData = JSON.parse(cleaned);
      } catch {
        return ({ success: true, data: fallbackResult });
      }
    }

    const finalResult = {
      userName,
      birthCity: cityName,
      birthDateFormatted,
      birthTimeFormatted,
      astronomy: triad,
      routineTrigger: trigger,
      question1Answer: parsedData.question1Answer || fallbackResult.question1Answer,
      headline: (typeof parsedData.headline === 'string' && parsedData.headline.trim().length > 0 && parsedData.headline.length <= 60) ? parsedData.headline.trim() : signals.title,
      question2Answer: parsedData.question2Answer || fallbackResult.question2Answer,
      practicalSteps: Array.isArray(parsedData.practicalSteps) && parsedData.practicalSteps.length >= 3
        ? parsedData.practicalSteps
        : fallbackResult.practicalSteps,
      affirmation: parsedData.affirmation || fallbackResult.affirmation,
      shareTitle: fallbackResult.shareTitle,
      shareText: parsedData.shareText || fallbackResult.shareText,
      transparencyNote: parsedData.transparencyNote || fallbackResult.transparencyNote,
      generatedByAI: true,
    };

    return ({ success: true, data: finalResult });
  } catch (err) {
    console.error('Error in /api/aureneffect:', err);
    const triad = calculateAstrologicalTriad(2000, 6, 15, 14, 30, 'sao-paulo');
    const errLang: ReadingLang = ['pt', 'en', 'es'].includes(body?.lang) ? body.lang : 'en';
    const trigger = queryAurenstarEngine(triad, errLang);
    const fallback = generateLocalAurenEffectReading(
      body?.name || 'Andriel',
      '15/06/2000',
      '14:30',
      'São Paulo, SP',
      triad,
      trigger,
      errLang
    );
    return ({ success: true, data: fallback });
  }
}


/**
 * Aurendaily: the daily message for the person's sun sign, written from the real sky (birth chart + today's Moon).
 * Returns { success: false } when no AI key is set or the AI fails, so the page can show its ready-made reading.
 */
export async function handleAurenDaily(body: any, precise: PreciseSky | null, openai?: OpenAiConfig) {
  try {
    if (!openai?.key || !precise) return { success: false };
    const lang: ReadingLang = ['pt', 'en', 'es'].includes(body?.lang) ? body.lang : 'en';
    const userName = String(body?.name || '').trim().split(/\s+/)[0] || '';
    const signName = signNameIn(precise.triad.sun, lang);
    const languageName = { en: 'English', pt: 'Brazilian Portuguese', es: 'Spanish' }[lang];

    const astro = precise.astro;
    if (!astro) return { success: false };
    const signOf = (lon: number) => signNameIn(formatCelestialPos(lon), lang);
    const NAMES: Record<ReadingLang, Record<string, string>> = {
      pt: { sun: 'Sol', moon: 'Lua', ascendant: 'Ascendente', mercury: 'Mercúrio', venus: 'Vênus', mars: 'Marte', jupiter: 'Júpiter', saturn: 'Saturno', conjunction: 'conjunção', sextile: 'sextil', square: 'quadratura', trine: 'trígono', opposition: 'oposição' },
      en: { sun: 'Sun', moon: 'Moon', ascendant: 'Rising sign', mercury: 'Mercury', venus: 'Venus', mars: 'Mars', jupiter: 'Jupiter', saturn: 'Saturn', conjunction: 'conjunction', sextile: 'sextile', square: 'square', trine: 'trine', opposition: 'opposition' },
      es: { sun: 'Sol', moon: 'Luna', ascendant: 'Ascendente', mercury: 'Mercurio', venus: 'Venus', mars: 'Marte', jupiter: 'Júpiter', saturn: 'Saturno', conjunction: 'conjunción', sextile: 'sextil', square: 'cuadratura', trine: 'trígono', opposition: 'oposición' },
    };
    const N = NAMES[lang];
    const retroList = (Object.entries(astro.retrograde) as Array<[string, boolean]>).filter(([, r]) => r).map(([k]) => N[k]);
    // Make the "day" paragraph different for each person: pick the life area and the best moment from THEIR chart.
    const AREA_BY_TRANSIT: Record<string, string> = { moon: 'home, family and inner comfort', sun: 'confidence and personal goals', mercury: 'talks, messages and decisions', venus: 'love, friendships and small pleasures', mars: 'energy, motivation and standing up for yourself', jupiter: 'opportunities, learning and good luck', saturn: 'duties, work and patience' };
    const AREA_BY_NATAL: Record<string, string> = { sun: 'how they see themselves', moon: 'feelings and family', ascendant: 'how other people see them', mercury: 'the way they think and talk', venus: 'love and affection', mars: 'drive and courage' };
    const DAILY_ADVICE = ['a body or movement action (walk, stretch, water, sunlight, a proper meal)', 'a small tidy-up or organising action of 5 minutes', 'a way to protect your energy (silence the phone, say no kindly, take a pause before answering)', 'one single priority task to do first, with a start time', 'something pleasant just for you (music, a favourite snack, ten quiet minutes)', 'a short message to a specific person, with exact words', 'a money or planning mini-step (check one bill, write one number)', 'a creative or curious mini-action (note one idea, learn one new thing for 10 minutes)', 'a rest action (go to bed 30 minutes earlier, no screens before sleep)'];
    const lead = astro.aspects.length ? astro.aspects[Math.floor(Math.random() * Math.min(3, astro.aspects.length))] : undefined;
    const easy = lead ? ['trine', 'sextile', 'conjunction'].includes(lead.type) : true;
    const dayArea = lead ? `${AREA_BY_TRANSIT[lead.transit]} (touching ${AREA_BY_NATAL[lead.natal]})` : 'rest and simple routine';
    const seed = [...`${body?.birthDate}${body?.birthTime}${userName}`].reduce((n, c) => (n * 31 + c.charCodeAt(0)) >>> 0, 7);
    const bestMoment = ['early morning', 'late morning', 'lunch time', 'mid afternoon', 'late afternoon', 'early evening', 'night'][Math.floor(Math.random() * 7)];
    const prompt = `You write the "Aurendaily" for Aurenstar, a friendly astrology site: the DAILY FORECAST for one person, about how their DAY will be, based on their birth chart and the sky today.
Write EVERYTHING in ${languageName}.

THE PERSON (birth chart): first name "${userName}".
- Sun in ${signOf(astro.natal.sun)}
- Moon in ${signOf(astro.natal.moon)}
- Rising sign (Ascendant) in ${signOf(astro.natal.ascendant)}
- Mercury in ${signOf(astro.natal.mercury)}, Venus in ${signOf(astro.natal.venus)}, Mars in ${signOf(astro.natal.mars)}

THE SKY TODAY:
- Moon in ${signOf(astro.today.moon)}, Sun in ${signOf(astro.today.sun)}, Mercury in ${signOf(astro.today.mercury)}, Venus in ${signOf(astro.today.venus)}, Mars in ${signOf(astro.today.mars)}, Jupiter in ${signOf(astro.today.jupiter)}, Saturn in ${signOf(astro.today.saturn)}
${retroList.length ? `- Retrograde now: ${retroList.join(', ')}\n` : ''}- Today's planets touching the person's chart (strongest first):
${astro.aspects.length ? astro.aspects.map((a) => `  * ${N[a.transit]} today ${['trine', 'sextile'].includes(a.type) ? 'flows easily with' : a.type === 'conjunction' ? 'blends strongly with' : 'creates friction with'} their ${N[a.natal]}`).join('\n') : '  * (no strong contact today, a quiet day)'}
- Moon phase: "${precise.triad.todayMoon.phase}"

THE FOCUS OF THIS PERSON'S DAY (the "day" paragraph MUST be about this, in plain words):
- Main area of life: ${dayArea}
- ${easy ? 'It flows easily: say what is favoured.' : 'It asks for patience: say what to take slowly.'}
- Best moment to act or talk: ${bestMoment}

WHAT THIS IS: Aurendaily is NOT about how the person feels right now (another tool does that). It tells how the DAY AHEAD tends to go for this person and what can help them, using astrology. The reader may or may not believe in astrology, so write as a tendency ("hoje a tendência é...", "é um dia bom para...") and never as a certain prediction.

HOW TO WRITE (VERY IMPORTANT, keep it SHORT and SIMPLE):
1. Total message: maximum 480 characters, in exactly 3 tiny paragraphs. Short sentences, everyday words a 12-year-old understands. NEVER use technical astrology words: no aspects (trine, square, conjunction, opposition, sextile), no houses, no "retrograde", no degrees. You may name AT MOST ONE sign or planet in the whole message (for example "com a Lua em Leão hoje"), and only if you say right away what it means in daily life. Most of the message should have no astrology word at all.
2. Paragraph "day": start with the first name. How the day tends to go, in which area of life it flows best (love and friends, work and tasks, money, family, talks and messages, energy and body, rest) and the best moment of the day given above. Do not start with the time of day. One or two sentences.
3. Paragraph "you": the self-knowledge part. Built from the combination of Sun, Moon and Rising sign (do NOT name them), describe how this person is with specific, recognisable habits and inner contradictions (what they show outside versus what they feel inside, how they react when hurt, what they secretly need). It must make them think "wow, this site really knows me". One or two sentences.
4. Paragraph "care": one gentle thing to be careful about today, kindly said. One sentence.
5. The reader may or may not believe in astrology, so write as a tendency ("a tendência é...", "é um bom dia para..."). Warm, positive, honest. No fear, no health, death, money-loss or pregnancy predictions, no orders.
6. The advice is ONE concrete action of this kind: ${DAILY_ADVICE[Math.floor(Math.random() * DAILY_ADVICE.length)]}. It must help THIS day: exact what, when, and the exact words if other people are involved, ending with a short "because ...". Maximum 30 words.
${varietyBlock(body, 'daily')}
Return ONLY valid JSON:
{
  "theme": "3 to 5 words naming the theme of the day",
  "paragraphDay": "paragraph 1, max 170 characters",
  "paragraphYou": "paragraph 2, max 200 characters",
  "paragraphCare": "paragraph 3, max 110 characters",
  "advice": "One concrete action, max 30 words, with a short because-reason",
  "affirmation": "One short first-person positive sentence",
  "shareText": "A post the person would proudly show on Instagram or WhatsApp status, in FIRST PERSON, about how their day ahead will go and who they are, so friends think 'that is me too'. 2 or 3 short sentences, maximum 240 characters, specific and a little surprising. Do NOT write the sign name, no person name, no advice, no hashtags, no emojis."
}`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 25000);
    let text = '{}';
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${openai.key}` },
        signal: controller.signal,
        body: JSON.stringify({
          model: openai.model || 'gpt-6.1-terra',
          response_format: { type: 'json_object' },
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      if (!res.ok) throw new Error(`OpenAI error ${res.status}`);
      const json: any = await res.json();
      text = json?.choices?.[0]?.message?.content?.trim() || '{}';
    } finally {
      clearTimeout(timer);
    }
    const parsed = JSON.parse(text.replace(/^```json\s*|```$/g, ''));
    const message = [parsed.paragraphDay, parsed.paragraphYou, parsed.paragraphCare].filter(Boolean).map(String).join('\n\n') || String(parsed.message || '');
    if (!message || !parsed.advice) return { success: false };
    return {
      success: true,
      data: {
        signKey: precise.triad.sun.signKey,
        signName,
        signSymbol: precise.triad.sun.symbol,
        theme: String(parsed.theme || ''),
        message,
        advice: String(parsed.advice),
        affirmation: String(parsed.affirmation || ''),
        shareText: String(parsed.shareText || ''),
        cityName: precise.cityName,
        generatedByAI: true,
      },
    };
  } catch (err) {
    console.error('Aurendaily AI unavailable, the page will use its ready-made reading', err);
    return { success: false };
  }
}


/**
 * Aurenstar Unfiltered: a candid, funny, shareable description of the person, written from the real birth chart
 * (Sun, Moon and Rising sign). Returns { success: false } when there is no AI key or the AI fails, so the page shows
 * its ready-made description.
 */
export async function handleUnfiltered(body: any, precise: PreciseSky | null, openai?: OpenAiConfig) {
  try {
    if (!openai?.key || !precise?.astro) return { success: false };
    const lang: ReadingLang = ['pt', 'en', 'es'].includes(body?.lang) ? body.lang : 'en';
    const userName = String(body?.name || '').trim().split(/\s+/)[0] || '';
    const timeKnown = body?.timeKnown !== false;
    const astro = precise.astro;
    const pos = (lon: number) => formatCelestialPos(lon);
    const sun = pos(astro.natal.sun);
    const moon = pos(astro.natal.moon);
    const rising = pos(astro.natal.ascendant);
    const nm = (p: ReturnType<typeof formatCelestialPos>) => signNameIn(p, lang);
    const languageName = { en: 'English', pt: 'Brazilian Portuguese', es: 'Spanish' }[lang];
    const mercury = pos(astro.natal.mercury);
    const venus = pos(astro.natal.venus);
    const mars = pos(astro.natal.mars);

    const prompt = `You write "Aurenstar Unfiltered" for Aurenstar, a friendly astrology site: a candid, funny and kind description of ONE person, made to be shared with friends, based on their birth chart.
Write EVERYTHING in ${languageName}.

THE PERSON: first name "${userName}".
- Sun in ${nm(sun)}
- Moon in ${nm(moon)}${timeKnown ? `\n- Rising sign in ${nm(rising)}` : '\n- (Birth time unknown: do not talk about the rising sign, and treat the Moon as approximate)'}
- Mercury in ${nm(mercury)} (how they think and talk), Venus in ${nm(venus)} (how they love), Mars in ${nm(mars)} (how they fight and push)

HOW TO WRITE (keep it SHORT and SIMPLE):
1. Everyday words a 12-year-old understands. No technical astrology words in the text (no aspects, houses, degrees, retrograde). Do NOT name signs or planets inside the paragraphs (the card already shows the Sun, Moon and Rising signs).
2. Write about the person in the third person using the first name ("${userName} é do tipo que..."). Warm, a little cheeky, never mean, never scary, nothing about health, money or death.
3. Exactly 3 tiny paragraphs:
   (1) "Outside": how people see them at first (blend Sun and Rising sign). 1 or 2 sentences.
   (2) "Inside": what they really feel and secretly need (Moon, Venus), with very specific, recognisable habits. It must make them think "wow, this site really knows me". 1 or 2 sentences.
   (3) "Unfiltered": one honest, funny truth about how they love, fight or procrastinate (Mercury, Venus, Mars), the kind of thing friends say laughing. 1 sentence.
4. Total at most 520 characters. Very specific details of real life, no clichés.
${varietyBlock(body, 'unfiltered')}
Return ONLY valid JSON:
{
  "tagline": "A punchy title of 4 to 8 words that sums the person up, no sign names",
  "paragraphOutside": "paragraph 1, max 170 characters",
  "paragraphInside": "paragraph 2, max 220 characters",
  "paragraphUnfiltered": "paragraph 3, max 130 characters"
}`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 25000);
    let text = '{}';
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${openai.key}` },
        signal: controller.signal,
        body: JSON.stringify({
          model: openai.model || 'gpt-6.1-terra',
          response_format: { type: 'json_object' },
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      if (!res.ok) throw new Error(`OpenAI error ${res.status}`);
      const json: any = await res.json();
      text = json?.choices?.[0]?.message?.content?.trim() || '{}';
    } finally {
      clearTimeout(timer);
    }
    const parsed = JSON.parse(text.replace(/^```json\s*|```$/g, ''));
    const description = [parsed.paragraphOutside, parsed.paragraphInside, parsed.paragraphUnfiltered].filter(Boolean).map(String).join('\n\n');
    if (!description) return { success: false };
    return {
      success: true,
      data: {
        tagline: String(parsed.tagline || ''),
        description,
        bigThree: {
          sun: { name: nm(sun), symbol: sun.symbol },
          moon: { name: nm(moon), symbol: moon.symbol },
          rising: timeKnown ? { name: nm(rising), symbol: rising.symbol } : null,
        },
        generatedByAI: true,
      },
    };
  } catch (err) {
    console.error('Unfiltered AI unavailable, the page will use its ready-made description', err);
    return { success: false };
  }
}
