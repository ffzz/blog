import type { APIRoute } from 'astro';

/**
 * PRD §7.2：显式允许 AI 搜索爬虫，因为 2026 年 AI 引用正在成为主要发现渠道，
 * 不是可选项。默认的 `User-agent: *` 已经隐含允许它们，这里逐个点名
 * 是为了消除歧义 —— 有的爬虫只信任写着自己名字的规则，且这也是一份
 * 明确的、可审查的意图声明，而不是依赖通配符的隐含行为。
 */
const AI_CRAWLERS = ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended'];

/**
 * Content Signals（contentsignals.org，Cloudflare 2025-09 提出）。
 *
 * 它和上面的 Allow 管的是两件不同的事：Allow 管「能不能抓」，Content-Signal
 * 管「抓到之后能拿来干什么」。三项都是 yes —— 这跟 §7.2 已经做的事一致，
 * 与其含糊其辞，不如把实际立场写清楚。省略某项在规范里明确表示「不表态」，
 * 既不算同意也不算拒绝，那对爬虫来说等于什么都没说。
 *
 * 目前它没有强制力，是一份行业倡议，但成本是零，且是一份可被引用的公开声明。
 */
const CONTENT_SIGNAL = 'Content-Signal: search=yes, ai-input=yes, ai-train=yes';

/** 一组 user-agent 规则。Content-Signal 按规范放在 User-agent 之后、Allow 之前。 */
const rules = (agent: string) => [
  `User-agent: ${agent}`,
  CONTENT_SIGNAL,
  'Allow: /',
  'Disallow: /admin',
  '',
];

export const GET: APIRoute = ({ site }) => {
  const lines = [
    '# search    = 建立搜索索引并展示搜索结果',
    '# ai-input  = 作为 AI 生成回答的输入（检索增强、实时引用）',
    '# ai-train  = 训练或微调 AI 模型',
    '# 详见 https://contentsignals.org',
    '',
    ...rules('*'),
    ...AI_CRAWLERS.flatMap(rules),
    `Sitemap: ${new URL('sitemap-index.xml', site).href}`,
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
