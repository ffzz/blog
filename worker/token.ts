/**
 * 无数据库的签名 token：HMAC-SHA256，payload + 签名都编码进 token 字符串本身。
 * 用 Workers 运行时原生的 Web Crypto API，不引入 JWT 库 —— payload 只有
 * 三个字段，没必要为此带一整套 JWT 的 header/alg 协商机制。
 *
 * "一次性使用"不是靠 token 格式本身保证的（这里的签名只证明"没被篡改
 * 且没过期"），而是靠 worker/kv.ts 记录已消费的 token —— 这也是当初
 * "无需数据库"里为什么还需要 KV 的原因，见 wrangler.jsonc 里的注释。
 */

export interface TokenPayload {
  email: string;
  locale: 'en' | 'zh';
  /** 过期时间，unix 秒。 */
  exp: number;
}

const TOKEN_TTL_SECONDS = 24 * 60 * 60; // 24 小时，PRD §8.4

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

// payload 只有 email + locale + exp，编码后远小于几百字节 ——
// 展开成 charCode 数组这种简单写法不会撞 String.fromCharCode 的参数上限。
function toBase64Url(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof ArrayBuffer ? new Uint8Array(bytes) : bytes;
  const binary = String.fromCharCode(...arr);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/');
  const withPadding = padded.padEnd(padded.length + ((4 - (padded.length % 4)) % 4), '=');
  const binary = atob(withPadding);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

export async function signToken(email: string, locale: 'en' | 'zh', secret: string): Promise<string> {
  const payload: TokenPayload = {
    email,
    locale,
    exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
  };
  const body = toBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const key = await hmacKey(secret);
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body));
  return `${body}.${toBase64Url(signature)}`;
}

export class TokenError extends Error {}

export async function verifyToken(token: string, secret: string): Promise<TokenPayload> {
  const [body, signature] = token.split('.');
  if (!body || !signature) throw new TokenError('Malformed token');

  const key = await hmacKey(secret);
  const valid = await crypto.subtle.verify(
    'HMAC',
    key,
    fromBase64Url(signature),
    new TextEncoder().encode(body),
  );
  if (!valid) throw new TokenError('Invalid signature');

  let payload: TokenPayload;
  try {
    payload = JSON.parse(new TextDecoder().decode(fromBase64Url(body)));
  } catch {
    throw new TokenError('Malformed payload');
  }

  if (typeof payload.exp !== 'number' || payload.exp < Math.floor(Date.now() / 1000)) {
    throw new TokenError('Token expired');
  }
  return payload;
}
