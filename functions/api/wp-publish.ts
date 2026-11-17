// Cloudflare Pages Function -> POST /api/wp-publish
// WordPress calls this the moment a post is published/updated/unpublished. It only does one thing:
// asks GitHub to run the "WordPress sync" job now (instead of waiting for the next 6-hour round).
// Two secrets are needed, both set by the owner in Cloudflare Pages > Settings > Variables (never in code):
//   WP_WEBHOOK_SECRET      shared password between WordPress and this function
//   GITHUB_DISPATCH_TOKEN  GitHub token that may ONLY start workflows on this one repository
// Without them it answers "not configured" and does nothing.

const REPO = 'aurenstar/aurenstar-frontend-1be8b';
// posts and stories are synced by two separate jobs: start both
const WORKFLOWS = ['wordpress-sync.yml', 'wordpress-stories-sync.yml'];
const BRANCH = 'main';

type Env = { WP_WEBHOOK_SECRET?: string; GITHUB_DISPATCH_TOKEN?: string };

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' },
  });

function sameSecret(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }): Promise<Response> => {
  if (!env.WP_WEBHOOK_SECRET || !env.GITHUB_DISPATCH_TOKEN) return json(503, { ok: false, error: 'not_configured' });

  const given = request.headers.get('X-Aurenstar-Secret') || '';
  if (!sameSecret(given, env.WP_WEBHOOK_SECRET)) return json(401, { ok: false, error: 'unauthorized' });

  for (const wf of WORKFLOWS) {
    const res = await fetch(`https://api.github.com/repos/${REPO}/actions/workflows/${wf}/dispatches`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.GITHUB_DISPATCH_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'aurenstar-wp-publish',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ref: BRANCH }),
    });
    if (res.status !== 204) return json(502, { ok: false, error: 'github_refused', workflow: wf, status: res.status });
  }
  return json(200, { ok: true, started: true });
};

// Anything but POST: harmless answer (also keeps crawlers away).
export const onRequest = async (): Promise<Response> => json(405, { ok: false, error: 'method_not_allowed' });
