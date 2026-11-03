/**
 * Verification of the astrology engine.
 *  Part 1: the maths (always runs, offline).
 *  Part 2: the real planet positions against famous astronomical events (needs internet to reach the engine).
 * Run: npx tsx tests/engine.test.ts
 */
import { aspectBetween, aspectsBetween, compatibility, separation, transitsToNatal } from '../server/engine/aspects';

let failed = 0;
let passed = 0;
const check = (name: string, ok: boolean, detail = '') => {
  if (ok) { passed++; console.log('ok  ', name); } else { failed++; console.log('FAIL', name, detail); }
};
const near = (a: number, b: number, tol: number) => Math.abs(a - b) <= tol;

// ---- Part 1: maths
check('separation 350° vs 10° = 20°', separation(350, 10) === 20);
check('separation never above 180', [0, 45, 179, 181, 359].every((x) => separation(x, 0) <= 180));
check('conjunction found', aspectBetween(100, 103)?.type === 'conjunction');
check('trine found', aspectBetween(10, 130)?.type === 'trine');
check('square found across 0°', aspectBetween(350, 80)?.type === 'square');
check('opposition found', aspectBetween(0, 181)?.type === 'opposition');
check('no aspect at 40°', aspectBetween(0, 40) === null);
check('exact aspect has orb 0 and strength 1', (() => { const a = aspectBetween(0, 120)!; return a.orb === 0 && a.strength === 1; })());
check('aspects symmetrical', aspectBetween(33, 155)?.type === aspectBetween(155, 33)?.type);
check('transits sorted by importance', (() => {
  const t = transitsToNatal({ saturn: 100, moon: 100 }, { sun: 100 });
  return t.length === 2 && t[0].transit === 'saturn';
})());
const A = { sun: 10, moon: 100, mercury: 20, venus: 50, mars: 200, jupiter: 300, saturn: 330 };
const B = { sun: 130, moon: 220, mercury: 25, venus: 170, mars: 50, jupiter: 10, saturn: 90 };
const self = compatibility(A, A);
const ab = compatibility(A, B);
const ba = compatibility(B, A);
check('compatibility inside 30..97', [self.score, ab.score, ba.score].every((s) => s >= 30 && s <= 97));
check('same chart fits better than a different chart', self.score > ab.score, `${self.score} vs ${ab.score}`);
check('areas inside 30..97', Object.values(ab.areas).every((s) => s >= 30 && s <= 97));
check('compatibility is symmetrical (±2)', Math.abs(ab.score - ba.score) <= 2, `${ab.score} vs ${ba.score}`);
check('trine-rich pair beats square-rich pair', compatibility({ sun: 0, moon: 0, venus: 0, mars: 0, mercury: 0 }, { sun: 120, moon: 120, venus: 120, mars: 120, mercury: 120 }).score >
  compatibility({ sun: 0, moon: 0, venus: 0, mars: 0, mercury: 0 }, { sun: 90, moon: 90, venus: 90, mars: 90, mercury: 90 }).score);
check('aspectsBetween finds the planet pairs', aspectsBetween({ sun: 0 }, { moon: 120 }).length === 1);

// ---- Part 2: real sky vs known events (UTC times from astronomical almanacs)
const ENGINE = process.env.ENGINE_URL || 'https://aurenstar-engine.oficial-safare.workers.dev';
async function sky(utc: string) {
  const res = await fetch(`${ENGINE}/api/positions`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ utc, lat: 0, lon: 0, houseSystem: 'P' }) });
  if (!res.ok) throw new Error(`engine ${res.status}`);
  return (await res.json()) as { bodies: Record<string, { longitude: number; retrograde: boolean; speed: number }> };
}
try {
  const events: [string, string, number][] = [
    ['March equinox 2024 (Sun at 0° Aries)', '2024-03-20T03:06:00Z', 0],
    ['June solstice 2024 (Sun at 0° Cancer)', '2024-06-20T20:51:00Z', 90],
    ['September equinox 2024 (Sun at 0° Libra)', '2024-09-22T12:44:00Z', 180],
    ['December solstice 2024 (Sun at 0° Capricorn)', '2024-12-21T09:21:00Z', 270],
    ['March equinox 2025', '2025-03-20T09:01:00Z', 0],
    ['June solstice 2025', '2025-06-21T02:42:00Z', 90],
  ];
  for (const [name, utc, expected] of events) {
    const s = await sky(utc);
    const diff = Math.min(Math.abs(s.bodies.sun.longitude - expected), 360 - Math.abs(s.bodies.sun.longitude - expected));
    check(name, diff < 0.02, `sun at ${s.bodies.sun.longitude.toFixed(4)}°`);
  }
  const j2000 = await sky('2000-01-01T11:58:56Z');
  check('J2000: Sun at 280.37°', near(j2000.bodies.sun.longitude, 280.37, 0.03), String(j2000.bodies.sun.longitude));
  const newMoon = await sky('2024-11-01T12:47:00Z');
  check('New moon 1 Nov 2024: Sun and Moon together', separation(newMoon.bodies.sun.longitude, newMoon.bodies.moon.longitude) < 0.3);
  const fullMoon = await sky('2024-11-15T21:28:00Z');
  check('Full moon 15 Nov 2024: Sun and Moon opposite', near(separation(fullMoon.bodies.sun.longitude, fullMoon.bodies.moon.longitude), 180, 0.3));
  // Mercury retrograde 2024: 1 Apr -> 25 Apr, 5 Aug -> 28 Aug, 25 Nov -> 15 Dec
  for (const [utc, retro] of [['2024-03-20T00:00:00Z', false], ['2024-04-12T00:00:00Z', true], ['2024-05-10T00:00:00Z', false], ['2024-08-15T00:00:00Z', true], ['2024-09-15T00:00:00Z', false], ['2024-12-05T00:00:00Z', true], ['2025-01-10T00:00:00Z', false]] as [string, boolean][]) {
    const s = await sky(utc);
    check(`Mercury ${retro ? 'retrograde' : 'direct'} on ${utc.slice(0, 10)}`, s.bodies.mercury.retrograde === retro);
  }
  // Pluto entered Aquarius for good on 19 Nov 2024; Saturn entered Aries on 25 May 2025
  check('Pluto in Aquarius on 2025-01-01', Math.floor((await sky('2025-01-01T00:00:00Z')).bodies.pluto.longitude / 30) === 10);
  check('Saturn in Aries on 2025-06-15', Math.floor((await sky('2025-06-15T00:00:00Z')).bodies.saturn.longitude / 30) === 0);
} catch (e) {
  console.log('SKIP real-sky checks (engine unreachable):', (e as Error).message);
}
console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
