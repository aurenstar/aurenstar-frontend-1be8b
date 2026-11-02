import { julianDayUt, localToUtc } from './time';
import { getCity, type City, type GeoEnv } from './geo';

export interface ChartEnv extends GeoEnv {
  /** Address of the public "aurenstar-engine" service (Swiss Ephemeris). */
  ENGINE_URL?: string;
  /** Optional shared key, if the engine was set up to require one. */
  ENGINE_KEY?: string;
}

// The planets are computed by a separate open-source program (Swiss Ephemeris, AGPL):
// https://github.com/aurenstar/aurenstar-engine . This site only sends it a UTC time and coordinates.
const BODY_NAMES = [
  'sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto',
  'meanNode', 'trueNode', 'lilith', 'chiron', 'ceres',
] as const;
type BodyName = (typeof BODY_NAMES)[number];
const SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'] as const;

interface EngineBody { longitude: number; sign: (typeof SIGNS)[number]; retrograde: boolean }
interface EngineChart {
  bodies: Record<BodyName, EngineBody>;
  houses: { cusps: number[]; ascendant: number; midheaven: number };
  status: number;
}

const DEFAULT_ENGINE_URL = 'https://aurenstar-engine.oficial-safare.workers.dev';

async function askEngine(env: ChartEnv, utcMs: number, lat: number, lon: number): Promise<EngineChart> {
  const base = (env.ENGINE_URL || DEFAULT_ENGINE_URL).replace(/\/$/, '');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (env.ENGINE_KEY) headers['x-engine-key'] = env.ENGINE_KEY;
  const res = await fetch(`${base}/api/positions`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ utc: new Date(utcMs).toISOString(), lat, lon, houseSystem: 'P' }),
  });
  if (!res.ok) throw new Error(`Engine error (${res.status})`);
  return (await res.json()) as EngineChart;
}

export interface ChartRequest {
  date: string; // YYYY-MM-DD
  time?: string | null; // HH:MM (24h), local time at the birth place
  geonameid?: number | null;
}

const point = (lon: number) => {
  const l = ((lon % 360) + 360) % 360;
  return { longitude: +l.toFixed(4), sign: SIGNS[Math.floor(l / 30)], degree: +(l % 30).toFixed(2) };
};

export class ChartInputError extends Error {}

export async function computeChart(req: ChartRequest, env: ChartEnv, origin: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(req.date ?? '');
  if (!m) throw new ChartInputError('date must be YYYY-MM-DD');
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  if (y < 1300 || y > 2390 || mo < 1 || mo > 12 || d < 1 || d > 31) throw new ChartInputError('date out of supported range (1300-2390)');
  const probe = new Date(Date.UTC(y, mo - 1, d));
  if (probe.getUTCMonth() !== mo - 1 || probe.getUTCDate() !== d) throw new ChartInputError('invalid calendar date');

  let hour: number | null = null;
  let minute = 0;
  if (req.time) {
    const t = /^(\d{1,2}):(\d{2})$/.exec(req.time);
    if (!t || Number(t[1]) > 23 || Number(t[2]) > 59) throw new ChartInputError('time must be HH:MM (24h)');
    hour = Number(t[1]);
    minute = Number(t[2]);
  }

  let city: City | null = null;
  if (req.geonameid) {
    city = await getCity(env, Number(req.geonameid));
    if (!city) throw new ChartInputError('unknown city');
  }
  const timeKnown = hour !== null;
  const placeKnown = city !== null;
  const tz = city?.timezone ?? 'UTC';

  // Without a time we use local noon; the sign-change check below covers the rest of the day.
  const conv = localToUtc(y, mo, d, hour ?? 12, minute, tz);
  const jd = julianDayUt(conv.utcMs);
  const lat = city?.latitude ?? 0;
  const lon = city?.longitude ?? 0;

  const chartPromise = askEngine(env, conv.utcMs, lat, lon);

  // Does the Sun change sign during that local day? (matters when the birth time is unknown)
  let sunSignChangesThatDay: null | { before: string; after: string } = null;
  if (!timeKnown) {
    const start = localToUtc(y, mo, d, 0, 0, tz);
    const end = localToUtc(y, mo, d, 23, 59, tz);
    const [first, last] = await Promise.all([askEngine(env, start.utcMs, lat, lon), askEngine(env, end.utcMs, lat, lon)]);
    const s = first.bodies.sun.sign;
    const e = last.bodies.sun.sign;
    if (s !== e) sunSignChangesThatDay = { before: s, after: e };
  }

  const chart = await chartPromise;
  const bodies = {} as Record<BodyName, ReturnType<typeof point> & { retrograde: boolean }>;
  for (const name of BODY_NAMES) bodies[name] = { ...point(chart.bodies[name].longitude), retrograde: chart.bodies[name].retrograde };

  return {
    input: { date: req.date, time: req.time ?? null },
    place: city && {
      geonameid: city.geonameid, name: city.name, region: city.admin1 && !/^\d+$/.test(city.admin1) ? city.admin1 : null, country: city.country_code,
      latitude: city.latitude, longitude: city.longitude, timezone: city.timezone,
    },
    time: {
      utc: new Date(conv.utcMs).toISOString(),
      utcOffsetMinutes: conv.offsetMinutes,
      localTimeIssue: conv.note, // 'ok' | 'gap' | 'overlap' (daylight-saving edge cases)
      julianDayUt: +jd.toFixed(6),
    },
    accuracy: {
      timeKnown,
      placeKnown,
      ascendantAvailable: timeKnown && placeKnown,
      // below ~1 minute of arc for planets; Moon moves ~13° a day, so without a time it is approximate
      moonApproximate: !timeKnown,
      ephemerisStatus: chart.status,
      sunSignChangesThatDay,
    },
    sun: bodies.sun,
    moon: bodies.moon,
    planets: bodies,
    angles:
      timeKnown && placeKnown
        ? { ascendant: point(chart.houses.ascendant), midheaven: point(chart.houses.midheaven), houseSystem: 'Placidus', cusps: chart.houses.cusps.map((c) => point(c)) }
        : null,
  };
}
