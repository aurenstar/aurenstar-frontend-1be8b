/**
 * Local birth time -> UTC using the IANA time zone database built into the JavaScript runtime (ICU).
 * That database includes historical changes (daylight-saving periods, zone changes), so a
 * 1990 São Paulo birth gets the offset that was really in force that day.
 */
const formatters = new Map<string, Intl.DateTimeFormat>();

function formatterFor(timeZone: string) {
  let f = formatters.get(timeZone);
  if (!f) {
    f = new Intl.DateTimeFormat('en-US', {
      timeZone, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric', era: 'short',
    });
    formatters.set(timeZone, f);
  }
  return f;
}

/** Offset (minutes, positive = ahead of UTC) of `timeZone` at the instant `utcMs`. */
export function zoneOffsetMinutes(utcMs: number, timeZone: string): number {
  const parts = formatterFor(timeZone).formatToParts(new Date(utcMs));
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  let year = get('year');
  if (parts.find((p) => p.type === 'era')?.value === 'BC') year = 1 - year;
  const asUtc = Date.UTC(year, get('month') - 1, get('day'), get('hour'), get('minute'), get('second'));
  return Math.round((asUtc - Math.floor(utcMs / 1000) * 1000) / 60000 * 100) / 100;
}

export interface LocalToUtc {
  utcMs: number;
  offsetMinutes: number;
  /** 'gap' = that clock time never existed (clocks jumped forward); 'overlap' = it happened twice. */
  note: 'ok' | 'gap' | 'overlap';
}

export function localToUtc(
  y: number, mo: number, d: number, h: number, mi: number, timeZone: string
): LocalToUtc {
  const localAsUtc = Date.UTC(y, mo - 1, d, h, mi, 0);
  // candidate offsets just before and after (covers any transition within a day)
  const offBefore = zoneOffsetMinutes(localAsUtc - 24 * 3600000, timeZone);
  const offAfter = zoneOffsetMinutes(localAsUtc + 24 * 3600000, timeZone);
  const candidates = Array.from(new Set([offBefore, offAfter])).filter(
    (off) => zoneOffsetMinutes(localAsUtc - off * 60000, timeZone) === off
  );
  if (candidates.length === 1) {
    return { utcMs: localAsUtc - candidates[0] * 60000, offsetMinutes: candidates[0], note: 'ok' };
  }
  if (candidates.length === 2) {
    // overlap: use the first occurrence (the earlier instant = larger offset)
    const off = Math.max(...candidates);
    return { utcMs: localAsUtc - off * 60000, offsetMinutes: off, note: 'overlap' };
  }
  // gap: the clock time does not exist; move it forward by the jump
  const off = offBefore;
  return { utcMs: localAsUtc - off * 60000, offsetMinutes: off, note: 'gap' };
}

export const julianDayUt = (utcMs: number) => utcMs / 86400000 + 2440587.5;
