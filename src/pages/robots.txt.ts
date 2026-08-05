import type { APIRoute } from 'astro';

/**
 * PRD §7.2：显式允许 AI 搜索爬虫，因为 2026 年 AI 引用正在成为主要发现渠道，
 * 不是可选项。默认的 `User-agent: *` 已经隐含允许它们，这里逐个点名
 * 是为了消除歧义 —— 有的爬虫只信任写着自己名字的规则，且这也是一份
 * 明确的、可审查的意图声明，而不是依赖通配符的隐含行为。
 */
const AI_CRAWLERS = ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended'];

export const GET: APIRoute = ({ site }) => {
  const lines = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    '',
    ...AI_CRAWLERS.flatMap((agent) => [`User-agent: ${agent}`, 'Allow: /', 'Disallow: /admin', '']),
    `Sitemap: ${new URL('sitemap-index.xml', site).href}`,
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
