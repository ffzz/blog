import type { Locale } from '../consts';

/**
 * OG 图的站内路径约定。BaseHead（og:image / twitter:image）、
 * JSON-LD（image）、以及 P1-5 实际生成该图片的端点三处共用，
 * 避免路径规则各写各的最终对不上。
 */
export const ogImagePath = (locale: Locale, path: string): string =>
  `/og/${locale}/${path || 'home'}.png`;
