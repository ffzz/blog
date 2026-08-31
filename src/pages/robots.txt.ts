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

/**
 * 简历相关的路径。只对上面那几个训练型爬虫 Disallow，不对 `*`。
 *
 * 为什么要分开处理，而不是一条 `Disallow` 了事：
 *
 * Disallow 拦的是**抓取**，不是收录。对 Google 这类索引型爬虫用 Disallow，
 * 它就永远读不到页面里的 `<meta name="robots" content="noindex">` ——
 * 一旦别处有链接指过来，它照样可以凭锚文本收录一个没有摘要的条目，
 * 结果比什么都不做更糟。所以简历页走的是「允许抓取 + 声明 noindex」
 * （见 Resume.astro 传给 BaseLayout 的 noindex），PDF 走 HTTP 响应头
 * `X-Robots-Tag`（见 public/_headers，PDF 里写不了 meta 标签）。
 * 这两条声明都以爬虫能抓到为前提，所以这里**不能**对 `*` 加 Disallow。
 *
 * 训练型爬虫是另一回事：它们不建索引，noindex 对它们没有意义，
 * robots.txt 是唯一能表达意图的地方。这是对本文件「显式允许 AI 爬虫」
 * 那个立场的一处局部例外 —— 博客文章仍然欢迎抓取和引用，但简历带真名、
 * 联系方式等身份信息，不希望进入训练或检索语料。
 */
const RESUME_PATHS = ['/resume', '/zh/resume', '/Fangzheng-Ben-Chen-Resume.pdf'];

/** 一组 user-agent 规则。Content-Signal 按规范放在 User-agent 之后、Allow 之前。 */
const rules = (agent: string, extraDisallow: string[] = []) => [
  `User-agent: ${agent}`,
  CONTENT_SIGNAL,
  'Allow: /',
  'Disallow: /admin',
  ...extraDisallow.map((path) => `Disallow: ${path}`),
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
    // 显式写成箭头函数：flatMap 会把 index 当第二个实参传进去，
    // 直接 `flatMap(rules)` 会让 extraDisallow 收到 0、1、2 这样的数字。
    ...AI_CRAWLERS.flatMap((agent) => rules(agent, RESUME_PATHS)),
    `Sitemap: ${new URL('sitemap-index.xml', site).href}`,
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
