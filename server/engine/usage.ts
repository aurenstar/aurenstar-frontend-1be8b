/**
 * Server-side limits for the AI reading tools, so the rules cannot be skipped with a private window or another device:
 *  - the same person (same name + birth data) gets the SAME reading again during the window (Aurendaily: until midnight in
 *    Washington; Aureneffect: 4 hours), which also saves AI cost;
 *  - one network address (IP) can only create a limited number of different readings per window.
 * Stored in 3 small database functions (usage_get / usage_put / usage_hit). If the database is unreachable the tools keep
 * working (fail open). Optional secret USAGE_SECRET makes the stored keys impossible to guess.
 */
import type { GeoEnv } from './geo';

export interface UsageEnv extends GeoEnv {
  USAGE_SECRET?: string;
}

const DEFAULT_URL = 'https://bnetpqdpeufookvvsnaj.supabase.co';
const DEFAULT_KEY = 'sb_publishable_n_gHt5IxrtmAxybHE6i9ug_aMJ4ozeY';

async function call<T>(env: UsageEnv, fn: string, body: Record<string, unknown>): Promise<T | null> {
  try {
    const base = (env.SUPABASE_URL || DEFAULT_URL).replace(/\/$/, '');
    const key = env.SUPABASE_ANON_KEY || DEFAULT_KEY;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    try {
      const res = await fetch(`${base}/rest/v1/rpc/${fn}`, {
        method: 'POST',
        headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      if (!res.ok) return null;
      return (await res.json()) as T;
    } finally {
      clearTimeout(timer);
    }
  } catch {
    return null;
  }
}

export async function usageKey(env: UsageEnv, parts: Array<string | number | undefined | null>): Promise<string> {
  const text = [env.USAGE_SECRET || '', ...parts.map((p) => String(p ?? '').trim().toLowerCase())].join('|');
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function getCachedReading<T>(env: UsageEnv, key: string, maxAgeSeconds: number): Promise<T | null> {
  return call<T>(env, 'usage_get', { p_key: key, p_max_age_seconds: maxAgeSeconds });
}

export async function saveReading(env: UsageEnv, key: string, payload: unknown): Promise<void> {
  await call(env, 'usage_put', { p_key: key, p_payload: payload });
}

/** Counts one new reading for this key inside the window and returns how many were made (0 if unknown). */
export async function countHit(env: UsageEnv, key: string, windowSeconds: number): Promise<number> {
  return (await call<number>(env, 'usage_hit', { p_key: key, p_window_seconds: windowSeconds })) ?? 0;
}

/** Date (YYYY-MM-DD) in Washington, D.C. */
export function washingtonDate(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}

/** Anonymous thumbs up/down (tool, rating, sign, language only). */
export async function recordFeedback(env: UsageEnv, tool: string, rating: number, sign: string, lang: string): Promise<void> {
  await call(env, 'feedback_add', { p_tool: tool, p_rating: rating, p_sign: sign, p_lang: lang });
}
