/**
 * City lookup (GeoNames data stored in Supabase: 236k cities, 765k alternative names, IANA zone per city).
 * Uses the two read-only database functions city_search and city_for_chart, which only return public
 * GeoNames data and cap results (max 20, min 2 letters). Values can be overridden with environment
 * variables SUPABASE_URL / SUPABASE_ANON_KEY (the key below is the project's public "publishable" key).
 */
export interface GeoEnv {
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
}

const DEFAULT_URL = 'https://bnetpqdpeufookvvsnaj.supabase.co';
const DEFAULT_KEY = 'sb_publishable_n_gHt5IxrtmAxybHE6i9ug_aMJ4ozeY';

export interface City {
  geonameid: number;
  name: string;
  admin1: string | null;
  country_code: string;
  country_name?: string;
  latitude: number;
  longitude: number;
  population?: number;
  timezone: string;
}

async function rpc<T>(env: GeoEnv, fn: string, body: Record<string, unknown>): Promise<T> {
  const base = (env.SUPABASE_URL || DEFAULT_URL).replace(/\/$/, '');
  const key = env.SUPABASE_ANON_KEY || DEFAULT_KEY;
  const res = await fetch(`${base}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`City service error (${res.status})`);
  return (await res.json()) as T;
}

export async function searchCities(env: GeoEnv, q: string, limit = 8): Promise<City[]> {
  const rows = await rpc<City[]>(env, 'city_search', { q, lim: Math.min(Math.max(limit, 1), 12) });
  return rows.map((r) => ({
    geonameid: r.geonameid, name: r.name, admin1: r.admin1, country_code: r.country_code,
    country_name: r.country_name, latitude: r.latitude, longitude: r.longitude,
    population: r.population, timezone: r.timezone,
  }));
}

export async function getCity(env: GeoEnv, geonameid: number): Promise<City | null> {
  const rows = await rpc<City[]>(env, 'city_for_chart', { p_geonameid: geonameid });
  return rows[0] ?? null;
}
