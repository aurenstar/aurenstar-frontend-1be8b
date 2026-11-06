// Cloudflare Pages Function -> /old-blog/<anything>
// Cloudflare sends every address of the old blog (blog.aurenstar.com/2026/10/19/pisces-personality/) here.
// We find the article by its old WordPress name and send the visitor (and Google) to the same article on the new site
// with a permanent redirect. Unknown old addresses go to the blog list.
// The name -> new address list (old-blog-map.json) is written at every build by scripts/prerender.ts.

interface Context {
  request: Request;
  env: { ASSETS: { fetch: (r: Request) => Promise<Response> } };
  params: { path?: string | string[] };
}

export const onRequest = async ({ request, env, params }: Context): Promise<Response> => {
  const url = new URL(request.url);
  const parts = (Array.isArray(params.path) ? params.path : String(params.path || '').split('/')).filter(Boolean);
  const oldName = decodeURIComponent(parts[parts.length - 1] || '').toLowerCase();

  let target = '/blog';
  if (oldName && /^[a-z0-9-]+$/.test(oldName)) {
    try {
      const res = await env.ASSETS.fetch(new Request(new URL('/old-blog-map.json', url).toString()));
      if (res.ok) {
        const map = (await res.json()) as Record<string, string>;
        if (Object.prototype.hasOwnProperty.call(map, oldName)) target = `/blog/${map[oldName]}`;
      }
    } catch {
      // map not readable: the blog list is a safe place to land
    }
  }
  return new Response(null, { status: 301, headers: { Location: `https://aurenstar.com${target}`, 'Cache-Control': 'public, max-age=3600' } });
};
