// Cloudflare Pages Function -> GET /api/tshirt-spots
// Everyone on the t-shirt list gets the launch coupon (no cap). This tells the page how many people have joined, so the counter only goes up.
// Only a number is returned; nothing personal.
import { countSubscribers, type UsageEnv } from '../../server/engine/usage';

export const onRequestGet = async ({ env }: { env: UsageEnv }): Promise<Response> => {
  const taken = await countSubscribers(env);
  const body = { taken };
  return new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=600' },
  });
};
