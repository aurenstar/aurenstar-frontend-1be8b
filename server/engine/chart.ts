import swissWasm from './aurenstar.wasm';
import { BODY_NAMES, SIGNS, SwissEngine, ephemerisFilesForJd, type BodyName } from './swiss';
import { julianDayUt, localToUtc } from './time';
import { getCity, type City, type GeoEnv } from './geo';

export interface ChartEnv extends GeoEnv {
  ASSETS: { fetch(input: Request | string | URL): Promise<Response> };
}

export interface ChartRequest {
  date: string; // YYYY-MM-DD
  time?: string | null; // HH:MM (24h), local time at the birth place
  geonameid?: number | null;
}

let engine: SwissEngine | undefined;
const getEngine = () => (engine ??= new SwissEngine(swissWasm));

async function ensureFiles(env: ChartEnv, origin: string, jd: number) {
  const eng = getEngine();
  for (const name of ephemerisFilesForJd(jd)) {
    if (eng.hasFile(name)) continue;
    const res = await env.ASSETS.fetch(new URL(`/ephe/${name}`, origin));
    if (!res.ok) throw new Error(`Ephemeris file ${name} unavailable (${res.status})`);
    eng.addFile(name, new Uint8Array(await res.arrayBuffer()));
  }
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

  await ensureFiles(env, origin, jd);
  const eng = getEngine();
  const chart = eng.calculate(jd, lat, lon, 80);

  // Does the Sun change sign during that local day? (matters when the birth time is unknown)
  let sunSignChangesThatDay: null | { before: string; after: string } = null;
  if (!timeKnown) {
    const start = localToUtc(y, mo, d, 0, 0, tz);
    const end = localToUtc(y, mo, d, 23, 59, tz);
    await ensureFiles(env, origin, julianDayUt(start.utcMs));
    const s = eng.calculate(julianDayUt(start.utcMs), lat, lon).bodies.sun.sign;
    const e = eng.calculate(julianDayUt(end.utcMs), lat, lon).bodies.sun.sign;
    if (s !== e) sunSignChangesThatDay = { before: s, after: e };
  }

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
