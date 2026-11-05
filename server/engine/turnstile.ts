/**
 * Bot protection (Cloudflare Turnstile, free and invisible for real people).
 * Switched on only when BOTH keys exist, so nothing changes until the owner adds them:
 *   - build variable VITE_TURNSTILE_SITE_KEY (public key, Cloudflare Pages > Variables)
 *   - secret TURNSTILE_SECRET (secret key, Cloudflare Pages > Variables and Secrets)
 * Without the secret every request is accepted, exactly as before.
 */
export interface TurnstileEnv {
  TURNSTILE_SECRET?: string;
}

export async function humanCheck(request: Request, env: TurnstileEnv): Promise<boolean> {
  const secret = env.TURNSTILE_SECRET;
  if (!secret) return true; // protection not configured yet
  const token = request.headers.get('x-turnstile') || '';
  if (!token) return false;
  try {
    const form = new FormData();
    form.append('secret', secret);
    form.append('response', token);
    const ip = request.headers.get('CF-Connecting-IP');
    if (ip) form.append('remoteip', ip);
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
    const data: any = await res.json();
    return data?.success === true;
  } catch {
    return true; // Cloudflare check unreachable: do not lock real visitors out
  }
}

export const humanCheckFailed = () =>
  new Response(JSON.stringify({ success: false, reason: 'human-check' }), {
    status: 403,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
