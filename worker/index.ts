import type { Env } from './env';
import { checkRateLimit, isTokenConsumed, markTokenConsumed } from './kv';
import { addContact, ResendError, sendConfirmationEmail } from './resend';
import { signToken, TokenError, verifyToken } from './token';

/**
 * 只有 /api/* 会走到这里（见 wrangler.jsonc 的 run_worker_first），
 * 其余请求 Cloudflare 直接从静态资源里响应，根本不会调用这个 Worker。
 */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/subscribe' && request.method === 'POST') {
      return handleSubscribe(request, env, url.origin);
    }
    if (url.pathname === '/api/confirm' && request.method === 'GET') {
      return handleConfirm(request, env, url);
    }

    // /api/* 下没有别的动态路由；不匹配的一律交还静态资源
    // （比如 /api/subscribe 被 GET 请求，或者压根不存在的 /api/xxx）。
    return env.ASSETS.fetch(request);
  },
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_LOCALES = new Set(['en', 'zh']);

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function handleSubscribe(request: Request, env: Env, origin: string): Promise<Response> {
  let payload: { email?: unknown; locale?: unknown };
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: 'invalid_json' }, 400);
  }

  const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : '';
  const locale = typeof payload.locale === 'string' ? payload.locale : '';

  if (!EMAIL_RE.test(email)) {
    return jsonResponse({ error: 'invalid_email' }, 400);
  }
  if (!ALLOWED_LOCALES.has(locale)) {
    return jsonResponse({ error: 'invalid_locale' }, 400);
  }

  // Cloudflare 在边缘注入这个头，比信任任何客户端可伪造的头都可靠。
  const ip = request.headers.get('cf-connecting-ip') ?? 'unknown';
  const allowed = await checkRateLimit(env.SUBSCRIBE_KV, ip);
  if (!allowed) {
    return jsonResponse({ error: 'rate_limited' }, 429);
  }

  const token = await signToken(email, locale as 'en' | 'zh', env.TOKEN_SIGNING_SECRET);
  const confirmUrl = `${origin}/api/confirm?token=${encodeURIComponent(token)}`;

  try {
    await sendConfirmationEmail(env, email, confirmUrl, locale as 'en' | 'zh');
  } catch (err) {
    // Resend 失败的原始信息只进 Worker 日志（Cloudflare Dashboard 能看到），
    // 绝不透给客户端 —— 避免把服务商报错细节、账号状态泄漏给外部请求方。
    console.error('sendConfirmationEmail failed', err instanceof ResendError ? err.message : err);
    return jsonResponse({ error: 'send_failed' }, 502);
  }

  return jsonResponse({ ok: true });
}

async function handleConfirm(request: Request, env: Env, url: URL): Promise<Response> {
  const token = url.searchParams.get('token') ?? '';

  let payload;
  try {
    payload = await verifyToken(token, env.TOKEN_SIGNING_SECRET);
  } catch (err) {
    const reason = err instanceof TokenError && err.message === 'Token expired' ? 'expired' : 'invalid';
    return redirectToConfirmPage(url.origin, 'en', reason);
    // locale 未知（token 解不出来），落到默认语言页面，
    // 那边的文案两种语言都通用地说得清"链接失效"。
  }

  const alreadyConsumed = await isTokenConsumed(env.SUBSCRIBE_KV, token);
  if (!alreadyConsumed) {
    try {
      await addContact(env, payload.email);
    } catch (err) {
      console.error('addContact failed', err instanceof ResendError ? err.message : err);
      return redirectToConfirmPage(url.origin, payload.locale, 'failed');
      // 故意不在这里标记 token 已消费：addContact 失败时链接必须还能重试。
      // 标记发生在下面，只有 addContact 真正成功之后 —— 否则一次 Resend
      // 抖动就会永久废掉这个 token，用户再点同一个链接会被 alreadyConsumed
      // 分支误判成功，而实际上从未真正订阅上。
    }

    const ttl = payload.exp - Math.floor(Date.now() / 1000);
    await markTokenConsumed(env.SUBSCRIBE_KV, token, ttl);
  }
  // 已消费过的 token（即上面 addContact 真正成功过一次）直接当成功处理——
  // 用户点了第二次确认链接，不该在界面上看到一个"出错了"，这是幂等操作，
  // 不是重复提交攻击。

  return redirectToConfirmPage(url.origin, payload.locale, 'ok');
}

function redirectToConfirmPage(
  origin: string,
  locale: 'en' | 'zh',
  status: 'ok' | 'expired' | 'invalid' | 'failed',
): Response {
  const prefix = locale === 'zh' ? '/zh' : '';
  const location = `${origin}${prefix}/subscribe/confirm/?status=${status}`;
  return Response.redirect(location, 302);
}
