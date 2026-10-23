import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import {
  calculateAstrologicalTriad,
  queryAurenstarEngine,
  generateLocalAurenEffectReading,
  REFERENCE_CITIES,
} from './src/utils/aurenEngine';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize shared Gemini instance
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
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
app.post('/api/zodiac', async (req, res) => {
  const { sign, element, focus, date } = req.body;
  const signName = sign || 'Aries';
  const profile = ZODIAC_PROFILES[signName] || ZODIAC_PROFILES.Aries;

  try {
    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
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

    return res.json({ success: true, data });
  } catch (err: any) {
    // Graceful fallback without breaking the user experience
    return res.json({
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
});

app.post('/api/aureneffect', async (req, res) => {
  try {
    const { name, birthDate, birthTime, birthCity } = req.body || {};
    const userName = (name || 'Andriel').trim();
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
    const triad = calculateAstrologicalTriad(year, month, day, hours, minutes, cityKey);

    // Camada 02: Aurenstar Engine / Gatilhos Psicológicos de Rotina
    const trigger = queryAurenstarEngine(triad);

    const birthDateFormatted = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
    const birthTimeFormatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    const cityName = REFERENCE_CITIES[cityKey]?.label || birthCity || 'São Paulo, SP';

    // Fallback estruturado de alta fidelidade
    const fallbackResult = generateLocalAurenEffectReading(
      userName,
      birthDateFormatted,
      birthTimeFormatted,
      cityName,
      triad,
      trigger
    );

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({ success: true, data: fallbackResult });
    }

    // Camada 03: Comunicação por IA - Google Gemini (Lapidação em linguagem ultra-humana)
    const prompt = `Você é o interpretador de Astrologia Comportamental moderna da plataforma Aurenstar para a ferramenta "Aureneffect" (Efeito Auren).

DADOS BRUTOS (Camada 01 - Fatos Astronômicos Matemáticos):
- Nome do Usuário: "${userName}"
- Data de Nascimento: ${birthDateFormatted} às ${birthTimeFormatted} em ${cityName}
- Sol Natal: ${triad.sun.sign} (${triad.sun.element}, foco: ${triad.sun.keyword})
- Lua Natal: ${triad.moon.sign} (${triad.moon.element}, foco: ${triad.moon.keyword})
- Ascendente Natal: ${triad.ascendant.sign} (${triad.ascendant.element}, foco: ${triad.ascendant.keyword})
- Lua no Céu de Hoje: ${triad.todayMoon.sign} (${triad.todayMoon.phase})

REGRAS INTERPRETATIVAS BRUTAS (Camada 02 - Aurenstar Engine):
- Causa principal de rotina: "${trigger.primaryCause}"
- Gatilho oculto de comportamento: "${trigger.hiddenTrigger}"
- Vibe dominante: "${trigger.dominantVibe}"
- Sugestão prática 1: "${trigger.practicalActions[0].title}: ${trigger.practicalActions[0].description}"
- Sugestão prática 2: "${trigger.practicalActions[1].title}: ${trigger.practicalActions[1].description}"
- Sugestão prática 3: "${trigger.practicalActions[2].title}: ${trigger.practicalActions[2].description}"

DIRETRIZES TÉCNICAS E DE SEGURANÇA OBRIGATÓRIAS:
1. ZERO JARGÕES TÉCNICOS: É terminantemente PROIBIDO usar termos herméticos como "quadratura", "oposição", "graus", "trânsito da casa 8", "conjunção". Traduza tudo em sensações cotidianas, rotina real e palavras simples e acolhedoras que qualquer pessoa entende sem esforço.
2. HIPÓTESE VERSUS FATO CIENTÍFICO: Os dados do nascimento e da órbita da Lua são fatos astronômicos matemáticos. A correlação com o humor do dia é tratada como a HIPÓTESE reflexiva, psicológica e terapêutica da Aurenstar para o bem-estar diário.
3. ESTRUTURAÇÃO DO OUTPUT: Responda diretamente e com muito acolhimento a duas perguntas práticas:
   - Pergunta 1: "Por que estou me sentindo ou agindo assim hoje?" (Causa e Gatilho Oculto explicados com empatia e leveza)
   - Pergunta 2: "O que eu posso fazer com isso agora?" (Plano de Ação Comportamental com 3 passos práticos de rotina)

Retorne ESTRITAMENTE um objeto JSON válido no formato:
{
  "question1Answer": "Explicação acolhedora e compreensiva de 2 a 3 parágrafos curtos explicando em palavras simples o porquê da sensação ou comportamento de hoje",
  "question2Answer": "Introdução carinhosa de 1 parágrafo apresentando as atitudes práticas do dia",
  "practicalSteps": [
    {
      "stepNumber": 1,
      "title": "Título simples do passo 1",
      "action": "Ação prática e descomplicada de rotina que leva menos de 5 minutos"
    },
    {
      "stepNumber": 2,
      "title": "Título simples do passo 2",
      "action": "Ação prática e descomplicada de rotina"
    },
    {
      "stepNumber": 3,
      "title": "Título simples do passo 3",
      "action": "Ação prática e descomplicada de rotina"
    }
  ],
  "affirmation": "Uma afirmação positiva, leve e memorável para o usuário mentalizar hoje",
  "transparencyNote": "Nota curta e ética reforçando que as órbitas dos astros são fatos astronômicos calculados matematicamente, e a correlação diária é a hipótese comportamental da Aurenstar para o seu bem-estar."
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

    return res.json({ success: true, data: finalResult });
  } catch (err) {
    console.error('Error in /api/aureneffect:', err);
    const triad = calculateAstrologicalTriad(2000, 6, 15, 14, 30, 'sao-paulo');
    const trigger = queryAurenstarEngine(triad);
    const fallback = generateLocalAurenEffectReading(
      req.body?.name || 'Andriel',
      '15/06/2000',
      '14:30',
      'São Paulo, SP',
      triad,
      trigger
    );
    return res.json({ success: true, data: fallback });
  }
});

// Setup Vite in Dev or serve static in Prod
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
