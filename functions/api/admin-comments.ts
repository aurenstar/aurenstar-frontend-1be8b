// Cloudflare Pages Function -> POST /api/admin-comments   (owner only)
//   { password, action: 'list' }                         -> every comment (pending, approved, hidden) + e-mail counts
//   { password, action: 'set', id, status }              -> status = 'approved' | 'hidden' | 'pending'
// Protected by two secrets that the owner adds in Cloudflare (never in the code):
//   ADMIN_PASSWORD       the password typed on the /admin page
//   SUPABASE_SERVICE_KEY the database "secret key" (lets the server read comments that are still pending)
import { countHit, usageKey, type UsageEnv } from '../../server/engine/usage';

interface AdminEnv extends UsageEnv {
  ADMIN_PASSWORD?: string;
  SUPABASE_SERVICE_KEY?: string;
}

const DEFAULT_URL = 'https://bnetpqdpeufookvvsnaj.supabase.co';
const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });

async function sha(text: string): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)));
}
/** Compares two texts without leaking, by timing, how many letters matched. */
async function same(a: string, b: string): Promise<boolean> {
  const [x, y] = await Promise.all([sha(a), sha(b)]);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}

export const onRequestPost = async ({ request, env }: { request: Request; env: AdminEnv }): Promise<Response> => {
  const password = (env.ADMIN_PASSWORD || '').trim();
  const serviceKey = (env.SUPABASE_SERVICE_KEY || '').trim();
  if (!password || !serviceKey) return json({ ok: false, reason: 'not_configured', missing: [!password && 'ADMIN_PASSWORD', !serviceKey && 'SUPABASE_SERVICE_KEY'].filter(Boolean) }, 503);

  let b: Record<string, unknown> = {};
  try { b = (await request.json()) as Record<string, unknown>; } catch { return json({ ok: false }, 400); }

  // At most 120 tries per hour per network address (stops people guessing the password).
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const hour = new Date().toISOString().slice(0, 13);
  if ((await countHit(env, await usageKey(env, ['admin-ip', hour, ip]), 3600)) > 120) return json({ ok: false, reason: 'limit' }, 429);
  if (!(await same(String(b.password || ''), password))) return json({ ok: false, reason: 'password' }, 401);

  const base = (env.SUPABASE_URL || DEFAULT_URL).replace(/\/$/, '');
  const headers = { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, 'Content-Type': 'application/json' };

  if (b.action === 'set') {
    const id = Number(b.id);
    const status = String(b.status);
    if (!Number.isInteger(id) || id < 1 || !['approved', 'hidden', 'pending'].includes(status)) return json({ ok: false }, 400);
    const res = await fetch(`${base}/rest/v1/site_comments?id=eq.${id}`, { method: 'PATCH', headers: { ...headers, Prefer: 'return=minimal' }, body: JSON.stringify({ status }) });
    return res.ok ? json({ ok: true }) : json({ ok: false, reason: 'database' }, 502);
  }

  const count = async (list: string): Promise<number> => {
    try {
      const r = await fetch(`${base}/rest/v1/email_list?select=id&list=eq.${list}&unsubscribed_at=is.null`, { method: 'HEAD', headers: { ...headers, Prefer: 'count=exact' } });
      return Number((r.headers.get('content-range') || '').split('/')[1]) || 0;
    } catch { return 0; }
  };
  const [res, tshirts, newsletter] = await Promise.all([
    fetch(`${base}/rest/v1/site_comments?select=id,name,message,stars,sign,lang,status,created_at&order=created_at.desc&limit=300`, { headers }),
    count('tshirts'),
    count('newsletter'),
  ]);
  if (!res.ok) return json({ ok: false, reason: 'database' }, 502);
  return json({ ok: true, comments: await res.json(), emails: { tshirts, newsletter } });
};
