// Remembers the last messages this person received (only in their own browser) so the AI never repeats itself.
const KEY = 'aurenstar_recent_messages_v1';
const MAX = 6;

type Tool = 'effect' | 'daily' | 'unfiltered';

function readAll(): Record<Tool, string[]> {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '{}');
    return { effect: Array.isArray(raw.effect) ? raw.effect : [], daily: Array.isArray(raw.daily) ? raw.daily : [], unfiltered: Array.isArray(raw.unfiltered) ? raw.unfiltered : [] };
  } catch {
    return { effect: [], daily: [], unfiltered: [] };
  }
}

export function getRecentMessages(tool: Tool): string[] {
  return readAll()[tool];
}

export function rememberMessage(tool: Tool, text: string): void {
  try {
    const all = readAll();
    const clean = text.replace(/\s+/g, ' ').trim().slice(0, 170);
    if (!clean) return;
    all[tool] = [clean, ...all[tool].filter((t) => t !== clean)].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    // storage unavailable: the AI simply has no history
  }
}
