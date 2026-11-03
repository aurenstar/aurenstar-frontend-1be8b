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
  message: string;
  advice: string;
  articleId: string;
  generatedDate: string; // YYYY-MM-DD
}

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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
