// Cloudflare Pages Function -> GET /api/tshirt-spots
// The first 50 people on the t-shirt list get a launch coupon. This tells the page how many spots are really left.
// Only a number is returned; nothing personal.
import { countSubscribers, type UsageEnv } from '../../server/engine/usage';

const COUPON_SPOTS = 50;

export const onRequestGet = async ({ env }: { env: UsageEnv }): Promise<Response> => {
  const taken = await countSubscribers(env);
  const body = taken === null ? { limit: COUPON_SPOTS, left: null } : { limit: COUPON_SPOTS, taken, left: Math.max(0, COUPON_SPOTS - taken) };
  return new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=30' },
  });
};
