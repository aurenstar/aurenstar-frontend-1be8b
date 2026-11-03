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
export interface PreciseSky {
  triad: AstronomicalTriad;
  facts?: SkyFacts;
  cityName: string;
}

export async function handleAurenEffect(body: any, apiKey?: string, precise?: PreciseSky | null) {
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

    const ai = getGeminiClient(apiKey);
    if (!ai) {
      return ({ success: true, data: fallbackResult });
    }

    // Camada 03: Comunicação por IA - Google Gemini (Lapidação em linguagem ultra-humana)
    const languageName = { en: 'English', pt: 'Brazilian Portuguese', es: 'Spanish' }[lang];
    const prompt = `You write the daily "Aureneffect" message for Aurenstar, a friendly astrology site.
Write EVERYTHING in ${languageName}.

THE PERSON:
- First name: "${userName}" (use only this first name)

WHAT IS REALLY GOING ON INSIDE THEM TODAY (already in plain words; these come from their real birth sky and today's sky, so they are personal to this person):
- Today's mood: "${signals.todayMoon}"
${signals.aspects.map((a) => `- Strongest feeling today: "${a.text}"`).join('\n')}
- A deeper need behind it: "${signals.natalMoon}"
${signals.mercuryRetro ? `- Also: "${signals.mercuryRetro}"\n` : ''}- Phase of the month: "${signals.phase}"

EASY ACTIONS THAT FIT THIS FEELING (rewrite them in your own words, keep them practical):
- "${trigger.practicalActions[0].title}: ${trigger.practicalActions[0].description}"
- "${trigger.practicalActions[1].title}: ${trigger.practicalActions[1].description}"
- "${trigger.practicalActions[2].title}: ${trigger.practicalActions[2].description}"

HOW TO WRITE (very important):
1. Start the message with the person's first name. Describe ONLY what they may be feeling right now today. NEVER describe who they are or their personality (no "you are a ... person"). Make the reader think \"wow, how does this site know what I am feeling?\": be specific, name the small real-life moments (a message left unanswered, a tired evening, a sharp reply, a heavy morning), and speak straight to what is in their head. Talk like a kind friend. Use short sentences and everyday words a 12-year-old understands.
2. NEVER mention planets, the Moon, the Sun, zodiac signs, houses, elements or any astrology word. Never say things like "the Moon is in Leo". The reader must NOT see any astrology term, only plain feelings and daily life.
3. Talk about real daily life: work, phone, family, rest, mood. Give no predictions and no orders; offer gentle ideas.
4. Be warm and positive. Never scare the person.

Return ONLY a valid JSON object:
{
  "question1Answer": "2 short paragraphs answering 'Why do I feel or act this way today?' in simple words",
  "question2Answer": "1 short, friendly sentence introducing the 3 easy things to do today",
  "practicalSteps": [
    { "stepNumber": 1, "title": "Simple title", "action": "Easy action that takes under 5 minutes" },
    { "stepNumber": 2, "title": "Simple title", "action": "Easy action" },
    { "stepNumber": 3, "title": "Simple title", "action": "Easy action" }
  ],
  "affirmation": "One short, positive sentence the person can repeat today",
  "transparencyNote": "One short, honest sentence saying this is a gentle idea from Aurenstar to help reflect, not a prediction"
}`;

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
    let parsedData: any = {};
    try {
      parsedData = JSON.parse(text);
    } catch {
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(cleaned);
    }

    const finalResult = {
      userName,
      birthCity: cityName,
      birthDateFormatted,
      birthTimeFormatted,
      astronomy: triad,
      routineTrigger: trigger,
      question1Answer: parsedData.question1Answer || fallbackResult.question1Answer,
      question2Answer: parsedData.question2Answer || fallbackResult.question2Answer,
      practicalSteps: Array.isArray(parsedData.practicalSteps) && parsedData.practicalSteps.length >= 3
        ? parsedData.practicalSteps
        : fallbackResult.practicalSteps,
      affirmation: parsedData.affirmation || fallbackResult.affirmation,
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
