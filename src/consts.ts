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
    name: 'TODO',
    tagline: 'TODO',
    intro: 'TODO',
  },
  zh: {
    name: 'TODO',
    tagline: 'TODO',
    intro: 'TODO',
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
  name: 'TODO',
  email: 'TODO',
  sameAs: [],
};

// ─────────────────────────────────────────────────────────────
// 以下为实现约束，PRD 已定，无需改动
// ─────────────────────────────────────────────────────────────

/** 标签下少于此数量的文章时不生成独立页面，避免 Google 判定薄内容。PRD §4.2。 */
export const TAG_PAGE_MIN_POSTS = 3;

/** 内容分型。技术文章承担 SEO 流量，随笔建立个人连接。PRD §4.1。 */
export const COLLECTIONS = ['posts', 'notes'] as const;
export type CollectionName = (typeof COLLECTIONS)[number];
