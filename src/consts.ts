import { SITE_ORIGIN } from './site-origin.mjs';

export { SITE_ORIGIN };

export const LOCALES = ['en', 'zh'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

/** BCP 47 语言标签。用于 <html lang>、hreflang、JSON-LD 的 inLanguage。 */
export const LANG_TAG: Record<Locale, string> = {
  en: 'en-US',
  zh: 'zh-CN',
};

/** 语言切换器里的自称（用目标语言本身书写，不翻译）。 */
export const LOCALE_NAME: Record<Locale, string> = {
  en: 'English',
  zh: '中文',
};

// ─────────────────────────────────────────────────────────────
// 站点身份
//
// 这几行是整站的 SEO 门面：搜索结果里读者第一眼看到的文字，
// 也是 JSON-LD `Person` 实体的内容。填占位符也能跑，但那样
// 写出来的一定是通用的空话 —— 这部分留给你。
//
// 三个值得想清楚的取舍：
//
// 1) name —— 品牌型 vs 关键词型
//    "Ben's Notes" 好记、有人格，但搜索引擎读不出主题。
//    "Ben 的 AI 工程笔记" 关键词直给，但显得功利。
//    小站早期通常关键词型收益更大，站稳后再改品牌型；反过来很难。
//
// 2) tagline —— 直译 vs 各自本地化
//    中英读者的表达习惯差异很大。中文习惯含蓄、意象化；
//    英文习惯直陈价值。直译往往两边都不讨好。
//    建议两边各写各的，表达同一个意思而非同一句话。
//
// 3) sameAs —— 隐私与 SEO 的真实取舍
//    链到 GitHub / X / LinkedIn 会显著增强 Google 对你这个"实体"的识别，
//    是 E-E-A-T 里最直接的一项。代价是这构成一次公开的身份聚合 ——
//    任何人都能顺着这几条链把你的技术身份、社交身份、职业身份串起来。
//    可以只放你本来就公开关联的那几个。留空数组也完全能跑。
// ─────────────────────────────────────────────────────────────

export interface SiteIdentity {
  /** 站点名。出现在 <title> 后缀、OG siteName、JSON-LD publisher。 */
  name: string;
  /** 一句话说清你是谁、写什么。首页顶部与 meta description 兜底都用它。 */
  tagline: string;
  /** 首页的自我介绍，2–3 行。比 tagline 长，可以有人味。 */
  intro: string;
}

export const SITE: Record<Locale, SiteIdentity> = {
  en: {
    name: "Ben's Blog",
    tagline: 'A programmer & lifelong learner  — writing about tech, culture, and life.',
    intro:
      "I'm Ben — I live in Canberra, Australia, and spend my days building products with AI. " +
      'This is where I write about what I’m working on, plus culture, life, and whatever ' +
      "hobbies I'm into at the moment. Thanks for stopping by.",
  },
  zh: {
    name: 'Ben 的博客',
    tagline: '程序员与终身学习者，用 AI 做产品，记录技术、文化与生活。',
    intro:
      '我是 Ben，住在澳洲堪培拉，喜欢技术，目前主要在用 AI 建一些产品。这个博客记录我的技术、' +
      '文化和生活，还有一些平时的嗜好。谢谢你对这个博客感兴趣。',
  },
};

export interface Author {
  /** 真名或长期使用的笔名。JSON-LD Person.name。 */
  name: string;
  /** 联系邮箱。会公开在 /about 页。 */
  email: string;
  /** 社交/代码主页链接。JSON-LD Person.sameAs。见上方取舍 3。 */
  sameAs: string[];
}

export const AUTHOR: Author = {
  name: 'Ben',
  email: 'hello@ben-chen.com',
  sameAs: [],
};

// ─────────────────────────────────────────────────────────────
// 第三方服务凭据
//
// 空字符串 = 未配置，对应组件会静默跳过注入（不产生指向不存在
// 端点的失败请求）。这些都需要真实域名 / 真实 GitHub 仓库之后
// 才能生成，跟"站点身份"那类内容性 TODO 不是一回事。
// ─────────────────────────────────────────────────────────────

/**
 * Cloudflare Web Analytics 的站点 token。PRD §8.5：免费、无 cookie、
 * 不需要 GDPR 横幅。token 本来就写在客户端 script 标签上，公开可见是设计如此，
 * 不是密钥。
 *
 * ⚠️ 这个值只有在 Dashboard 选了 **Enable with JS Snippet installation** 时才该填。
 * 另外三个 Enable 选项走的是边缘自动注入 —— Cloudflare 在响应经过代理时直接改写
 * HTML 插入 beacon，那种情况下这里再填一遍，页面上就会有两个 beacon 同时上报，
 * 浏览量凭空翻倍，而且后台看不出任何异常，只会让你对着虚高的数字做判断。
 * 2026-08-12 启用时确认过 Dashboard 是手动 snippet 模式。
 * 改 Dashboard 那个单选框时记得回来同步这里。
 */
export const CF_ANALYTICS_TOKEN = 'e14d088b3dbd450293977dc7f3dca9bd';

/**
 * Giscus 评论所需的 GitHub Discussions 绑定信息。PRD §8.2。
 * 获取方式：仓库 Settings 打开 Discussions → 用 https://giscus.app
 * 官方配置向导选目标仓库和分类 → 向导会生成这四个值。
 */
export interface GiscusConfig {
  repo: `${string}/${string}`;
  repoId: string;
  category: string;
  categoryId: string;
}

/**
 * 分类选 Announcements 而不是 General：Announcements 只有仓库维护者能开新话题，
 * giscus app 以维护者身份代建，读者只能在已有话题下回复。General 允许任何人开
 * 新话题，等于把一个开放的发帖入口挂在博客旁边。
 *
 * repoId / categoryId 是 GitHub 的 GraphQL node ID，不是密钥——giscus 本来就把
 * 它们写在客户端 script 标签上，公开可见是设计如此。取值方式：
 *   gh api graphql -f query='{repository(owner:"ffzz",name:"blog"){id
 *     discussionCategories(first:20){nodes{id name}}}}'
 */
export const GISCUS: GiscusConfig | null = {
  repo: 'ffzz/blog',
  repoId: 'R_kgDOTyxIPg',
  category: 'Announcements',
  categoryId: 'DIC_kwDOTyxIPs4DDC1E',
};

/**
 * 邮件订阅（Footer 里的 <Subscribe> 表单）总开关。PRD §8.4。
 *
 * 跟上面两个不同：Resend 的凭据是 Worker 端密钥（`wrangler secret put`），
 * 不是能放进这份客户端可见配置的公开 token，所以没法用"空值 = 未配置"
 * 的方式自动判断。这里显式留一个开关，人工确认 wrangler.jsonc 的
 * KV namespace、RESEND_FROM_EMAIL、RESEND_SEGMENT_ID 和两个 Worker
 * 密钥都填好了之后再翻成 true —— 翻早了的后果是表单能提交，但
 * Worker 调 Resend 必定失败，读者看到的是一个"看起来能用、实际会出错"
 * 的表单，比干脆不显示更糟。
 */
export const EMAIL_SUBSCRIBE_ENABLED = false;

// ─────────────────────────────────────────────────────────────
// 以下为实现约束，PRD 已定，无需改动
// ─────────────────────────────────────────────────────────────

/** 标签下少于此数量的文章时不生成独立页面，避免 Google 判定薄内容。PRD §4.2。 */
export const TAG_PAGE_MIN_POSTS = 3;

/**
 * 首页最多列这么多篇，余下的交给归档页。
 *
 * 这也是归档页开始有独立价值的那个点 —— 在此之前两个页面列的是同一批链接。
 * 曾经据此给归档页加过 noindex，2026-08-18 的 GSC 数据推翻了那个判断：
 * 归档页本来就在被正常收录，主动 deindex 只会白白少一个已索引页面。
 * 重复本身是真的，但 Google 并没有因此惩罚谁，所以只保留截断，不做护栏。
 */
export const HOME_RECENT_POSTS = 5;

/** 内容分型。技术文章承担 SEO 流量，随笔建立个人连接。PRD §4.1。 */
export const COLLECTIONS = ['posts', 'notes'] as const;
export type CollectionName = (typeof COLLECTIONS)[number];
