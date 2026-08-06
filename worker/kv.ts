/**
 * 限流与 token 消费记录，用 Cloudflare KV。
 *
 * ponytail: 限流计数器是"读出当前值再写回"，不是原子操作。Workers 的
 * 并发模型下，同一 IP 的两个并发请求可能都读到同一个计数值、都写回
 * +1，导致限流上限被多算过去一两次。个人博客的订阅表单不是高并发
 * 攻击面，这个误差可以接受；真要做到精确计数得上 Durable Objects，
 * 那是给这个场景过度设计。如果以后真的被刷了，再升级。
 */

const RATE_LIMIT_MAX = 5; // 每小时每 IP 最多 5 次订阅尝试
const RATE_LIMIT_WINDOW_SECONDS = 60 * 60;

// Cloudflare KV 的 expirationTtl 下限是 60 秒，小于这个值会报错。
const KV_MIN_TTL_SECONDS = 60;

export async function checkRateLimit(kv: KVNamespace, ip: string): Promise<boolean> {
  const key = `ratelimit:${ip}`;
  const current = Number((await kv.get(key)) ?? '0');
  if (current >= RATE_LIMIT_MAX) return false;
  await kv.put(key, String(current + 1), { expirationTtl: RATE_LIMIT_WINDOW_SECONDS });
  return true;
}

export async function isTokenConsumed(kv: KVNamespace, token: string): Promise<boolean> {
  return (await kv.get(`consumed:${token}`)) !== null;
}

/** ttlSeconds 传 token 距过期还剩多少秒 —— 消费记录没必要活得比 token 本身还久。 */
export async function markTokenConsumed(kv: KVNamespace, token: string, ttlSeconds: number): Promise<void> {
  await kv.put(`consumed:${token}`, '1', {
    expirationTtl: Math.max(KV_MIN_TTL_SECONDS, ttlSeconds),
  });
}
