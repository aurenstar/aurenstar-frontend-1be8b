/**
 * Which article to recommend under a tool result, for a given star sign.
 * Anonymous counters per (sign, article): shown, clicked, journey (clicked AND kept reading).
 * Rules: first every article of the sign is tested fairly (until each was shown MIN_SHOWN times);
 * after that the best "score" wins, with a small share of random picks so new or improved articles still get a chance.
 */
import { BLOG_ARTICLES } from '../../src/data/blogArticles';
import { SIGNS_DATA } from '../../src/data/signsData';
import type { UsageEnv } from './usage';

export interface RecoRow { article_id: string; shown: number; clicked: number; journey: number }

const MIN_SHOWN = 60;
const EXPLORE = 0.15;

const DEFAULT_URL = 'https://bnetpqdpeufookvvsnaj.supabase.co';
const DEFAULT_KEY = 'sb_publishable_n_gHt5IxrtmAxybHE6i9ug_aMJ4ozeY';

/** ids of every blog article about this sign (sign found by its name in the English title), in list order. */
export function articlesOfSign(sign: string): string[] {
  const info = SIGNS_DATA[sign];
  if (!info) return [];
  const re = new RegExp(`\\b${info.name.en.toLowerCase()}\\b`);
  return BLOG_ARTICLES.filter((a) => re.test((a.title.en || a.title.pt).toLowerCase())).map((a) => a.id);
}

/** Score: a click counts 1, a click followed by real reading counts 3 (1 + 2), divided by how many times it was shown. */
export const score = (r: RecoRow) => (r.shown > 0 ? (r.clicked + 2 * r.journey) / r.shown : 0);

export function pick(candidates: string[], rows: RecoRow[], rand: () => number = Math.random): string | null {
  if (!candidates.length) return null;
  if (candidates.length === 1) return candidates[0];
  const by = new Map(rows.map((r) => [r.article_id, r]));
  const get = (id: string): RecoRow => by.get(id) || { article_id: id, shown: 0, clicked: 0, journey: 0 };
  const rnd = (list: string[]) => list[Math.floor(rand() * list.length)];
  const least = Math.min(...candidates.map((id) => get(id).shown));
  if (least < MIN_SHOWN) return rnd(candidates.filter((id) => get(id).shown === least));
  if (rand() < EXPLORE) return rnd(candidates);
  const best = Math.max(...candidates.map((id) => score(get(id))));
  return rnd(candidates.filter((id) => score(get(id)) === best));
}

async function rpc<T>(env: UsageEnv, fn: string, body: Record<string, unknown>): Promise<T | null> {
  try {
    const base = (env.SUPABASE_URL || DEFAULT_URL).replace(/\/$/, '');
    const key = env.SUPABASE_ANON_KEY || DEFAULT_KEY;
    const res = await fetch(`${base}/rest/v1/rpc/${fn}`, {
      method: 'POST',
      headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    const text = await res.text();
    return text ? (JSON.parse(text) as T) : (null as T | null);
  } catch {
    return null;
  }
}

export const getStats = async (env: UsageEnv, sign: string) => (await rpc<RecoRow[]>(env, 'reco_get', { p_sign: sign })) || [];
export const bump = (env: UsageEnv, sign: string, article: string, kind: 'shown' | 'click' | 'journey') =>
  rpc(env, 'reco_bump', { p_sign: sign, p_article: article, p_kind: kind });
