// Cloudflare Pages Function -> GET /api/cities?q=sao pa   (city autocomplete, GeoNames data)
import { searchCities, type GeoEnv } from '../../server/engine/geo';

export const onRequestGet = async ({ request, env }: { request: Request; env: GeoEnv }) => {
  const url = new URL(request.url);
  const q = (url.searchParams.get('q') || '').trim().slice(0, 60);
  const headers = { 'Content-Type': 'application/json; charset=utf-8' };
  if (q.length < 2) return new Response('[]', { headers: { ...headers, 'Cache-Control': 'public, max-age=3600' } });

  // Same search typed again is answered from Cloudflare's cache (no database call).
  const cache = (caches as unknown as { default: Cache }).default;
  const cacheKey = new Request(`${url.origin}/api/cities?q=${encodeURIComponent(q.toLowerCase())}`);
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  try {
    const cities = await searchCities(env, q, 8);
    const res = new Response(JSON.stringify(cities), { headers: { ...headers, 'Cache-Control': 'public, max-age=86400' } });
    await cache.put(cacheKey, res.clone());
    return res;
  } catch (error) {
    console.error('cities error', error);
    return new Response(JSON.stringify({ error: 'City search is temporarily unavailable.' }), { status: 502, headers });
  }
};
