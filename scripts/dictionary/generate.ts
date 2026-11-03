/**
 * Writes new dictionary terms automatically, checks them, and saves the ones that pass.
 *   npm run dictionary:generate -- --max 5        (needs OPENAI_API_KEY in the environment)
 *   npm run dictionary:generate -- --dry          (offline test with a canned answer; writes nothing)
 * Reads data/dictionary-queue.json (the list of questions to answer), writes src/data/dictionaryGenerated.json.
 * Safe pace: --max terms per run, and a term that fails the checks 3 times is parked in data/dictionary-failures.json.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ASTROLOGY_DICTIONARY_TERMS, type DictionaryTerm } from '../../src/data/astrologyDictionaryData';
import { validateTerm, slugify, CATEGORIES } from './checks';
import { ruleBasedTopics, type Seed } from './topics';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const QUEUE = path.join(root, 'data/dictionary-queue.json');
const FAILS = path.join(root, 'data/dictionary-failures.json');
const OUT = path.join(root, 'src/data/dictionaryGenerated.json');


const arg = (name: string) => {
  const i = process.argv.indexOf(`--${name}`);
  return i < 0 ? undefined : process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : 'true';
};
const MAX = Math.max(0, Math.min(20, Number(arg('max') ?? 5)));
const DRY = process.argv.includes('--dry');
const KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.OPENAI_MODEL || 'gpt-6.1-terra';

// Counts what the model really used, so the log shows the real cost of each run (prices in US$ per 1M tokens, from OpenAI's pricing page).
const PRICE_IN = Number(process.env.PRICE_IN ?? 1);
const PRICE_OUT = Number(process.env.PRICE_OUT ?? 5);
let tokensIn = 0;
let tokensOut = 0;
const realFetch = globalThis.fetch;
globalThis.fetch = (async (...args: Parameters<typeof fetch>) => {
  const res = await realFetch(...args);
  if (String(args[0]).includes('api.openai.com')) {
    try { const u = ((await res.clone().json()) as any)?.usage; tokensIn += u?.prompt_tokens || 0; tokensOut += u?.completion_tokens || 0; } catch { /* no usage info */ }
  }
  return res;
}) as typeof fetch;

const readJson = <T,>(file: string, fallback: T): T => {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')) as T; } catch { return fallback; }
};

function prompt(seed: Seed, related: { id: string; termo: string }[], problems: string[]): string {
  return `Write one entry for a friendly astrology dictionary read by a general US audience.
Topic: "${seed.term}". The question people type in Google: "${seed.question}". Category: "${seed.category}".

STYLE RULES
- English, very simple everyday words and SHORT sentences (about 15 words). A 12-year-old must understand it.
- Warm and calm. Say "in astrology, this is linked to..." instead of stating predictions as facts. No promises, no medical, legal or money advice, no fear.
- The "fictional example" uses invented people (like Maria or Carlos) in a small everyday scene.
- Never mention AI, software, or how the text was written.

Return ONLY valid JSON with exactly these keys:
{
 "termo": "short display name",
 "tituloSEO": "page title, 35-65 characters, includes the question or the term",
 "perguntaGoogle": "${seed.question}",
 "resumoUmaLinha": "one line, 40-150 characters",
 "explicacaoEducativa": "1-2 sentences, 60-200 characters, starts with 'Learn'",
 "chamadaCuriosa": "short curious hook, under 70 characters",
 "oQueSignifica": "plain meaning in 2-4 short sentences, with a simple everyday comparison (200-600 characters)",
 "oQueSignificaNaAstrologia": "what it means in astrology, 2-4 short sentences (200-700 characters)",
 "exemploFicticio": "fictional example, 2-3 sentences (120-450 characters)",
 "dicaRapida": "one practical tip, under 150 characters",
 "miniJogo": { "pergunta": "a small everyday-situation question", "opcoes": [ {"texto":"...","correta":true,"explicacao":"..."}, {"texto":"...","correta":false,"explicacao":"..."} ] },
 "faq": [ {"pergunta":"...","resposta":"..."}, {"pergunta":"...","resposta":"..."} ],
 "termosRelacionados": [ up to 3 ids chosen ONLY from: ${related.map((r) => r.id).slice(0, 40).join(', ')} ]
}
Exactly ONE option of miniJogo is correct (correta: true).${problems.length ? `\n\nYOUR PREVIOUS ANSWER FAILED THESE CHECKS, FIX THEM: ${problems.join('; ')}` : ''}`;
}

async function askModel(seed: Seed, related: { id: string; termo: string }[], problems: string[]): Promise<any> {
  if (DRY) {
    return {
      termo: seed.term, tituloSEO: `${seed.question.replace(/\?$/, '')}? A Simple Explanation`, perguntaGoogle: seed.question,
      resumoUmaLinha: `A simple explanation of ${seed.term.toLowerCase()} in astrology.`,
      explicacaoEducativa: `Learn what ${seed.term.toLowerCase()} means and how people use it to think about daily life.`,
      chamadaCuriosa: `Learn what ${seed.term.toLowerCase()} means`,
      oQueSignifica: `${seed.term} is an idea people use to describe a part of life. Think of it like a map. It does not tell you what to do. It helps you notice patterns in your own days and feelings.`,
      oQueSignificaNaAstrologia: `In astrology, ${seed.term.toLowerCase()} is linked to a certain area of life. Astrologers look at it to talk about habits and moods. It is a tool for reflection, not a promise about the future.`,
      exemploFicticio: `Maria reads about ${seed.term.toLowerCase()} on a quiet Sunday. She smiles because it reminds her of how she acts with her friends. She writes a small note about it in her journal.`,
      dicaRapida: 'Use it as a gentle question for yourself, not as a rule.',
      miniJogo: { pergunta: 'A friend says astrology can tell your whole future. What is a healthy way to see it?', opcoes: [
        { texto: 'As a tool to reflect on yourself', correta: true, explicacao: 'Yes! It works best as a way to think about your feelings and habits.' },
        { texto: 'As a rule you must obey', correta: false, explicacao: 'Not quite. It is a gentle guide, not an order.' } ] },
      faq: [ { pergunta: `Is ${seed.term.toLowerCase()} scientific?`, resposta: 'No. It is a symbolic tradition that many people enjoy for reflection.' }, { pergunta: 'Do I need to believe in it?', resposta: 'No. You can enjoy it as a fun way to think about yourself.' } ],
      termosRelacionados: related.slice(0, 2).map((r) => r.id),
    };
  }
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}` },
    body: JSON.stringify({ model: MODEL, response_format: { type: 'json_object' }, messages: [{ role: 'user', content: prompt(seed, related, problems) }] }),
  });
  if (!res.ok) throw new Error(`model error ${res.status}`);
  const json: any = await res.json();
  return JSON.parse(String(json?.choices?.[0]?.message?.content || '{}').replace(/^```json\s*|```$/g, ''));
}

const TR_KEYS = ['termo', 'perguntaGoogle', 'resumoUmaLinha', 'chamadaCuriosa', 'oQueSignifica', 'oQueSignificaNaAstrologia', 'exemploFicticio'] as const;
const LANGS = { pt: 'Brazilian Portuguese (simple everyday words, warm tone, "voce" style)', es: 'neutral Latin American Spanish (simple everyday words, warm tone)' } as const;

/** Translates the visible texts of a term into Portuguese and Spanish. Returns null if a check fails. */
async function translateTerm(term: DictionaryTerm): Promise<DictionaryTerm['traducoes'] | null> {
  const out: Record<string, Record<string, string>> = {};
  for (const [code, label] of Object.entries(LANGS)) {
    const source: Record<string, any> = Object.fromEntries(TR_KEYS.map((k) => [k, (term as any)[k]]));
    source.faq = term.faq || [];
    let tr: any;
    if (DRY) tr = { ...Object.fromEntries(TR_KEYS.map((k) => [k, `[${code}] ${source[k]}`])), faq: (term.faq || []).map((f) => ({ pergunta: `[${code}] ${f.pergunta}`, resposta: `[${code}] ${f.resposta}` })) };
    else {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}` },
        body: JSON.stringify({ model: MODEL, response_format: { type: 'json_object' }, messages: [{ role: 'user', content: `Translate these astrology dictionary texts into ${label}. Keep the meaning, the short sentences and the fictional names (Maria, Carlos). Keep astrology terms people really use in that language. Never mention AI. Return ONLY JSON with exactly the same keys; faq stays a list of {pergunta, resposta} with the same number of items.\n\n${JSON.stringify(source)}` }] }),
      });
      if (!res.ok) return null;
      tr = JSON.parse(String(((await res.json()) as any)?.choices?.[0]?.message?.content || '{}'));
    }
    for (const k of TR_KEYS) {
      if (typeof tr[k] !== 'string' || tr[k].trim().length < 3) return null;
      if (/\b(AI|IA)\b|artificial|chatgpt|openai/i.test(tr[k])) return null;
    }
    const faqOk = Array.isArray(tr.faq) && tr.faq.length === (term.faq || []).length && tr.faq.every((f: any) => f?.pergunta?.trim() && f?.resposta?.trim() && !/\b(AI|IA)\b|artificial|chatgpt|openai/i.test(`${f.pergunta} ${f.resposta}`));
    if (!faqOk) return null;
    out[code] = { ...Object.fromEntries(TR_KEYS.map((k) => [k, String(tr[k]).trim()])), faq: tr.faq.map((f: any) => ({ pergunta: String(f.pergunta).trim(), resposta: String(f.resposta).trim() })) };
  }
  return out as DictionaryTerm['traducoes'];
}

/** When the list runs low, ask the model for fresh questions people type in Google (never repeats). */
async function suggestQuestions(known: Set<string>): Promise<Seed[]> {
  if (DRY || !KEY) return [];
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}` },
    body: JSON.stringify({ model: MODEL, response_format: { type: 'json_object' }, messages: [{ role: 'user', content: `List 40 different questions that people in the United States type into Google about astrology, zodiac signs, birth charts, moon phases, planets, houses, aspects, compatibility basics, and common astrology words. Each must be a short beginner question about ONE concept (like "What is a stellium in astrology?"). Avoid questions about predicting the future, health, money or specific people. Return ONLY JSON: {"items":[{"term":"short name","question":"the question?","category":"Planets & Bodies | Chart Concepts | Signs & Elements | Phases & Movements","icon":"one emoji"}]}. Do NOT repeat any of these: ${[...known].slice(-150).join(' | ')}` }] }),
  });
  if (!res.ok) return [];
  const items: Seed[] = JSON.parse(String(((await res.json()) as any)?.choices?.[0]?.message?.content || '{}')).items || [];
  return items.filter((i) => i?.term && /\?$/.test(i.question || '') && (CATEGORIES as readonly string[]).includes(i.category) && i.question.length <= 90 && !known.has(slugify(i.question.replace(/\?$/, ''))));
}

async function main() {
  if (!DRY && !KEY) {
    console.log('dictionary: OPENAI_API_KEY is not set, nothing to do (add it as a GitHub secret to turn this on).');
    return;
  }
  let queue = readJson<Seed[]>(QUEUE, []);
  const generated = readJson<DictionaryTerm[]>(OUT, []);
  const fails = readJson<Record<string, { count: number; last: string }>>(FAILS, {});
  const all = [...ASTROLOGY_DICTIONARY_TERMS.filter((t) => !generated.some((g) => g.id === t.id)), ...generated];
  const doneSlugs = new Set(all.map((t) => t.slug));

  // Terms written before translations existed (or whose translation failed) get them now.
  let translated = 0;
  for (const g of generated.filter((t) => !t.traducoes?.pt?.faq || !t.traducoes?.es?.faq).slice(0, 25)) {
    try { const tr = await translateTerm(g); if (tr) { g.traducoes = tr; translated++; console.log(`  ~ translated ${g.slug}`); } } catch { /* try again next run */ }
  }

  const isPending = (s: Seed) => !doneSlugs.has(slugify(s.question.replace(/\?$/, ''))) && !all.some((t) => t.perguntaGoogle === s.question) && (fails[s.question]?.count ?? 0) < 3;
  // 1) hand-made queue, 2) rule-based combinations, 3) fresh suggestions from the model (saved to the queue file)
  let pool = [...queue, ...ruleBasedTopics()];
  if (MAX > 0 && pool.filter(isPending).length < MAX * 2) {
    const fresh = await suggestQuestions(new Set([...doneSlugs, ...pool.map((q) => slugify(q.question.replace(/\?$/, '')))]));
    if (fresh.length) { queue = [...queue, ...fresh]; pool = [...queue, ...ruleBasedTopics()]; if (!DRY) fs.writeFileSync(QUEUE, JSON.stringify(queue, null, 1) + '\n'); console.log(`dictionary: ${fresh.length} new questions suggested`); }
  }
  const seen = new Set<string>();
  const todo = MAX === 0 ? [] : pool.filter((q) => { const k = slugify(q.question.replace(/\?$/, '')); if (seen.has(k)) return false; seen.add(k); return isPending(q); }).slice(0, MAX);
  console.log(`dictionary: ${todo.length} to write (queue ${queue.length}, published ${all.length})`);

  let added = 0;
  for (const seed of todo) {
    let problems: string[] = [];
    let ok = false;
    for (let attempt = 1; attempt <= 2 && !ok; attempt++) {
      try {
        const raw = await askModel(seed, all.map((t) => ({ id: t.id, termo: t.termo })), problems);
        const slug = slugify(seed.question.replace(/\?$/, ''));
        const known = new Set(all.map((t) => t.id));
        const term: DictionaryTerm = {
          ...raw,
          id: slug,
          slug,
          categoria: seed.category,
          icone: seed.icon || '✨',
          perguntaGoogle: seed.question,
          termosRelacionados: (raw.termosRelacionados || []).filter((r: string) => known.has(r)).slice(0, 3),
          ferramentaRelacionada: { nome: "Read Today's Daily Message", rota: 'daily-message' },
        };
        problems = validateTerm(term, all.map((t) => ({ id: t.id, slug: t.slug })));
        if (!problems.length) {
          try { term.traducoes = (await translateTerm(term)) || undefined; } catch { /* translated on the next run */ }
          generated.push(term);
          all.push(term);
          added++;
          ok = true;
          console.log(`  + ${term.slug}`);
        }
      } catch (e) {
        problems = [`error: ${(e as Error).message}`];
      }
    }
    if (!ok) {
      fails[seed.question] = { count: (fails[seed.question]?.count ?? 0) + 1, last: problems.join('; ').slice(0, 300) };
      console.log(`  - skipped "${seed.question}": ${problems.join('; ')}`);
    }
  }
  if (!DRY) {
    fs.writeFileSync(OUT, JSON.stringify(generated, null, 2) + '\n');
    fs.writeFileSync(FAILS, JSON.stringify(fails, null, 2) + '\n');
  }
  if (tokensIn || tokensOut) console.log(`dictionary: model ${MODEL} used ${tokensIn} in + ${tokensOut} out tokens = about US$ ${((tokensIn * PRICE_IN + tokensOut * PRICE_OUT) / 1e6).toFixed(4)}${added ? ` (US$ ${((tokensIn * PRICE_IN + tokensOut * PRICE_OUT) / 1e6 / added).toFixed(4)} per new term)` : ''}`);
  console.log(`dictionary: ${added} new term(s), ${translated} translated later${DRY ? ' (dry run, nothing saved)' : ''}`);
}

main().catch((e) => { console.error('dictionary failed:', e.message); process.exit(1); });
