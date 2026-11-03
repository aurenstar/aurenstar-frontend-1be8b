// Shared by the Aureneffect and Aurendaily endpoints: real Swiss Ephemeris sky (birth chart + today's Moon).
import type { PreciseSky } from '../api';
import { buildTriadFromLongitudes } from '../../src/utils/aurenEngine';
import type { SkyFacts } from '../../src/utils/readingSignals';
import { computeChart, type ChartEnv } from './chart';

export async function preciseSky(body: any, env: ChartEnv, origin: string): Promise<PreciseSky | null> {
  const geonameid = Number(body?.geonameid);
  if (!geonameid || typeof body?.birthDate !== 'string') return null;
  try {
    const birth = await computeChart({ date: body.birthDate, time: body.birthTime || null, geonameid }, env, origin);
    if (!birth.angles || !birth.place) return null;
    // "Today's sky" = the Moon right now (UTC clock, no place needed)
    const now = new Date();
    const today = await computeChart(
      { date: now.toISOString().slice(0, 10), time: now.toISOString().slice(11, 16) },
      env,
      origin,
    );
    const place = birth.place;
    const cityName = [place.name, place.region, place.country].filter(Boolean).join(', ');
    const facts: SkyFacts = {
      natal: {
        sun: birth.sun.longitude,
        moon: birth.moon.longitude,
        mercury: birth.planets.mercury.longitude,
        venus: birth.planets.venus.longitude,
        mars: birth.planets.mars.longitude,
        saturn: birth.planets.saturn.longitude,
      },
      today: { moon: today.moon.longitude, sun: today.sun.longitude, mercuryRetro: today.planets.mercury.retrograde },
    };
    return {
      cityName,
      facts,
      triad: buildTriadFromLongitudes({
        sun: birth.sun.longitude,
        moon: birth.moon.longitude,
        ascendant: birth.angles.ascendant.longitude,
        todaySun: today.sun.longitude,
        todayMoon: today.moon.longitude,
        julianDate: birth.time.julianDayUt,
      }),
    };
  } catch (error) {
    console.error('precise sky unavailable, using approximate fallback', error);
    return null;
  }
}
