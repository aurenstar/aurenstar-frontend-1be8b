import type { PickedCity } from '../components/CityAutocomplete';

/**
 * One profile for all tools: fill the form once and every other tool opens already filled.
 * Lives only in this browser (localStorage); nothing is sent anywhere by this file.
 */
export interface SharedProfile {
  name?: string;
  day?: number;
  month?: number;
  year?: number;
  time?: string;
  place?: PickedCity | null;
}

const KEY = 'aurenstar_shared_profile_v1';

export function loadSharedProfile(): SharedProfile {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '{}');
    if (!raw || typeof raw !== 'object') return {};
    const p: SharedProfile = {};
    if (typeof raw.name === 'string' && raw.name.trim()) p.name = raw.name;
    if (Number(raw.day) >= 1 && Number(raw.day) <= 31) p.day = Number(raw.day);
    if (Number(raw.month) >= 1 && Number(raw.month) <= 12) p.month = Number(raw.month);
    if (Number(raw.year) >= 1900 && Number(raw.year) <= 2100) p.year = Number(raw.year);
    if (typeof raw.time === 'string' && /^\d{2}:\d{2}$/.test(raw.time)) p.time = raw.time;
    if (raw.place?.geonameid && raw.place?.label) p.place = raw.place as PickedCity;
    return p;
  } catch {
    return {};
  }
}

/** Merges into what is already saved; empty values never erase what the person typed in another tool. */
export function saveSharedProfile(patch: SharedProfile): void {
  try {
    const next: SharedProfile = { ...loadSharedProfile() };
    if (patch.name?.trim()) next.name = patch.name.trim();
    if (patch.day) next.day = patch.day;
    if (patch.month) next.month = patch.month;
    if (patch.year) next.year = patch.year;
    if (patch.time) next.time = patch.time;
    if (patch.place?.geonameid) next.place = patch.place;
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // storage blocked: the tools still work, they just do not remember
  }
}

/** Forgets the shared profile and the per-tool copies of the form data. */
export function clearSharedProfile(): void {
  try {
    [KEY, 'aurenstar_reader_profile', 'aurenstar_effect_profile', 'aurenstar_daily_reading_record'].forEach((k) => localStorage.removeItem(k));
  } catch {
    // ignore
  }
}

/** 'HH:MM' -> the period buttons used by the daily message ('exato' when it is not one of the presets). */
export function timePeriodFor(time: string): 'manha' | 'tarde' | 'noite' | 'madrugada' | 'exato' {
  const presets: Record<string, 'manha' | 'tarde' | 'noite' | 'madrugada'> = { '09:00': 'manha', '14:30': 'tarde', '20:00': 'noite', '03:30': 'madrugada' };
  return presets[time] || 'exato';
}
