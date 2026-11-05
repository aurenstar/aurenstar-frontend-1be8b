// Cloudflare Pages Function -> POST /api/admin-comments   (owner only)
//   { password, action: 'list' }                         -> every comment (pending, approved, hidden) + e-mail counts
//   { password, action: 'set', id, status }              -> status = 'approved' | 'hidden' | 'pending'
//   { password, action: 'report' }                       -> CSV of the comments + links to the monthly archive files
//   { password, action: 'emails' }                       -> two CSVs: tshirts list and newsletter list
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
    const res = await fetch(`${base}/rest/v1/site_comments?id=eq.${id}`, { method: 'PATCH', headers: { ...headers, Prefer: 'return=minimal' }, body: JSON.stringify({ status, moderated_by: 'owner', moderation_note: null, moderated_at: new Date().toISOString() }) });
    return res.ok ? json({ ok: true }) : json({ ok: false, reason: 'database' }, 502);
  }

  if (b.action === 'emails') {
    // One CSV per list; only people who did not unsubscribe.
    const cols = ['email', 'country', 'region', 'lang', 'sign', 'source', 'created_at', 'consent_at'];
    const cell = (v: unknown) => { const s = v === null || v === undefined ? '' : String(v); return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
    const build = async (list: string): Promise<{ csv: string; count: number } | null> => {
      const r = await fetch(`${base}/rest/v1/email_list?select=${cols.join(',')}&list=eq.${list}&unsubscribed_at=is.null&order=created_at.asc&limit=50000`, { headers });
      if (!r.ok) return null;
      const rows = (await r.json()) as Record<string, unknown>[];
      return { csv: '﻿' + [cols.join(','), ...rows.map((x) => cols.map((c) => cell(x[c])).join(','))].join('\n') + '\n', count: rows.length };
    };
    const [tshirts, newsletter] = await Promise.all([build('tshirts'), build('newsletter')]);
    if (!tshirts || !newsletter) return json({ ok: false, reason: 'database' }, 502);
    return json({ ok: true, tshirts, newsletter });
  }

  if (b.action === 'report') {
    // 1) comments still in the database as CSV text, 2) monthly archive files (private) with a 1-hour download link.
    const cols = ['id', 'created_at', 'country', 'lang', 'stars', 'sign', 'status', 'moderated_by', 'moderation_note', 'name', 'message'];
    const cell = (v: unknown) => { const s = v === null || v === undefined ? '' : String(v); return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
    const r = await fetch(`${base}/rest/v1/site_comments?select=${cols.join(',')}&status=in.(approved,pending)&order=created_at.desc&limit=5000`, { headers });
    if (!r.ok) return json({ ok: false, reason: 'database' }, 502);
    const rows = (await r.json()) as Record<string, unknown>[];
    const csv = '﻿' + [cols.join(','), ...rows.map((x) => cols.map((c) => cell(x[c])).join(','))].join('\n') + '\n';
    const files: { name: string; url: string }[] = [];
    try {
      const l = await fetch(`${base}/storage/v1/object/list/feedback-archive`, { method: 'POST', headers, body: JSON.stringify({ prefix: 'comments', limit: 200, sortBy: { column: 'name', order: 'desc' } }) });
      const list = l.ok ? ((await l.json()) as { name: string }[]) : [];
      for (const f of list.filter((x) => x.name.endsWith('.csv'))) {
        const s = await fetch(`${base}/storage/v1/object/sign/feedback-archive/comments/${encodeURIComponent(f.name)}`, { method: 'POST', headers, body: JSON.stringify({ expiresIn: 3600 }) });
        if (!s.ok) continue;
        const { signedURL } = (await s.json()) as { signedURL: string };
        files.push({ name: f.name, url: `${base}/storage/v1${signedURL}` });
      }
    } catch { /* archive list is optional */ }
    return json({ ok: true, csv, count: rows.length, files });
  }

  const count = async (list: string): Promise<number> => {
    try {
      const r = await fetch(`${base}/rest/v1/email_list?select=id&list=eq.${list}&unsubscribed_at=is.null`, { method: 'HEAD', headers: { ...headers, Prefer: 'count=exact' } });
      return Number((r.headers.get('content-range') || '').split('/')[1]) || 0;
    } catch { return 0; }
  };
  const [res, tshirts, newsletter] = await Promise.all([
    fetch(`${base}/rest/v1/site_comments?select=id,name,message,stars,sign,lang,country,status,moderated_by,moderation_note,created_at&order=created_at.desc&limit=300`, { headers }),
    count('tshirts'),
    count('newsletter'),
  ]);
  if (!res.ok) return json({ ok: false, reason: 'database' }, 502);
  return json({ ok: true, comments: await res.json(), emails: { tshirts, newsletter } });
};
