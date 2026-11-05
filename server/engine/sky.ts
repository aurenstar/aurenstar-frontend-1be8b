// Shared by the Aureneffect and Aurendaily endpoints: real Swiss Ephemeris sky (birth chart + today's Moon).
import type { PreciseSky, DailyAstro } from '../api';
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
    const TODAY = ['moon', 'sun', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'] as const;
    const astro: DailyAstro = {
      natal: {
        sun: birth.sun.longitude,
        moon: birth.moon.longitude,
        ascendant: birth.angles.ascendant.longitude,
        mercury: birth.planets.mercury.longitude,
        venus: birth.planets.venus.longitude,
        mars: birth.planets.mars.longitude,
      },
      today: {
        moon: today.moon.longitude,
        sun: today.sun.longitude,
        mercury: today.planets.mercury.longitude,
        venus: today.planets.venus.longitude,
        mars: today.planets.mars.longitude,
        jupiter: today.planets.jupiter.longitude,
        saturn: today.planets.saturn.longitude,
      },
      retrograde: {
        mercury: today.planets.mercury.retrograde,
        venus: today.planets.venus.retrograde,
        mars: today.planets.mars.retrograde,
        jupiter: today.planets.jupiter.retrograde,
        saturn: today.planets.saturn.retrograde,
      },
      aspects: [],
    };
    const ASPECTS = [
      { type: 'conjunction', angle: 0 }, { type: 'sextile', angle: 60 }, { type: 'square', angle: 90 },
      { type: 'trine', angle: 120 }, { type: 'opposition', angle: 180 },
    ];
    for (const t of TODAY) {
      for (const [n, nl] of Object.entries(astro.natal)) {
        const diff = Math.abs(((astro.today[t] - nl + 540) % 360) - 180);
        const sep = 180 - diff; // 0..180 angular separation
        for (const a of ASPECTS) {
          const orb = Math.abs(sep - a.angle);
          if (orb <= (t === 'moon' ? 4 : 3)) astro.aspects.push({ transit: t, natal: n, type: a.type, orb: Math.round(orb * 10) / 10 });
        }
      }
    }
    astro.aspects.sort((x, y) => x.orb - y.orb);
    astro.aspects = astro.aspects.slice(0, 6);
    return {
      astro,
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
