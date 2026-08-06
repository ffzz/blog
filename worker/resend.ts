import type { Env } from './env';

const RESEND_API = 'https://api.resend.com';

const CONFIRM_EMAIL_COPY = {
  en: {
    subject: 'Confirm your subscription',
    body: (confirmUrl: string) =>
      `<p>Click to confirm your subscription:</p><p><a href="${confirmUrl}">${confirmUrl}</a></p>` +
      `<p>This link expires in 24 hours. If you didn't request this, you can safely ignore this email.</p>`,
  },
  zh: {
    subject: '确认订阅',
    body: (confirmUrl: string) =>
      `<p>点击确认订阅：</p><p><a href="${confirmUrl}">${confirmUrl}</a></p>` +
      `<p>这个链接 24 小时内有效。如果不是你本人操作，忽略这封邮件即可。</p>`,
  },
} as const;

export class ResendError extends Error {}

export async function sendConfirmationEmail(
  env: Env,
  to: string,
  confirmUrl: string,
  locale: 'en' | 'zh',
): Promise<void> {
  const copy = CONFIRM_EMAIL_COPY[locale];
  const res = await fetch(`${RESEND_API}/emails`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.RESEND_FROM_EMAIL,
      to: [to],
      subject: copy.subject,
      html: copy.body(confirmUrl),
    }),
  });

  if (!res.ok) {
    throw new ResendError(`发送确认邮件失败：${res.status} ${await res.text()}`);
  }
}

/**
 * 创建联系人并加入 Segment（Resend 已把 Audiences 改名为 Segments，
 * 见 https://resend.com/docs/dashboard/segments/migrating-from-audiences-to-segments）。
 *
 * POST /contacts 官方文档没有记录"邮箱已存在"会返回什么错误码 ——
 * 没有证据支持它会报冲突，按 email 幂等 upsert 处理更合理（也更常见）。
 * 不去猜一个未经证实的状态码分支，统一按 res.ok 判断。
 */
export async function addContact(env: Env, email: string): Promise<void> {
  const res = await fetch(`${RESEND_API}/contacts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      unsubscribed: false,
      segments: [{ id: env.RESEND_SEGMENT_ID }],
    }),
  });

  if (!res.ok) {
    throw new ResendError(`加入联系人失败：${res.status} ${await res.text()}`);
  }
}
