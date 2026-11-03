export function calculateZodiacSign(day: number, month: number): string {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'touro';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'gemeos';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'leao';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'virgem';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'escorpiao';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'sagitario';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'capricornio';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'aquario';
  return 'peixes';
}

export interface DailyReadingRecord {
  userName: string;
  signKey: string;
  signName: string;
  signSymbol: string;
  signTheme: string;
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  birthTimePeriod: string;
  birthTime?: string;
  birthPlace?: { geonameid: number; label: string } | null;
  affirmation: string;
  /** Short first-person post for the share card. */
  shareText?: string;
  message: string;
  advice: string;
  articleId: string;
  generatedDate: string; // YYYY-MM-DD
  /** Language the reading was written in (so it can be translated if the site language changes). */
  lang?: 'pt' | 'en' | 'es';
}

/** The "day" of Aurendaily starts at midnight in Washington, D.C. (America/New_York), for everyone in the world. */
export function getTodayDateString(): string {
  try {
    // en-CA formats as YYYY-MM-DD
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

/** Local clock time (HH:mm) when the next Aurendaily day starts, i.e. the next midnight in Washington. */
export function nextDailyResetLocalTime(): string {
  const todayNY = getTodayDateString();
  const start = Date.now();
  for (let m = 1; m <= 25 * 60; m += 1) {
    const t = new Date(start + m * 60000);
    const ny = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(t);
    if (ny !== todayNY) return t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return '';
}

const STORAGE_KEY = 'aurenstar_daily_reading_record';

export function saveDailyReading(data: Omit<DailyReadingRecord, 'generatedDate'>): DailyReadingRecord {
  const today = getTodayDateString();
  const record: DailyReadingRecord = {
    ...data,
    generatedDate: today,
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    localStorage.setItem('aurenstar_reader_profile', JSON.stringify({
      name: data.userName,
      day: data.birthDay,
      month: data.birthMonth,
      year: data.birthYear,
      timePeriod: data.birthTimePeriod,
      birthTime: data.birthTime,
      birthPlace: data.birthPlace,
      sign: data.signKey,
    }));
  } catch {
    // Ignore localStorage errors
  }
  return record;
}

export function getSavedDailyReading(): DailyReadingRecord | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function hasGeneratedToday(): boolean {
  const saved = getSavedDailyReading();
  if (!saved) return false;
  return saved.generatedDate === getTodayDateString();
}
