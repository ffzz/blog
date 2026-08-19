import type { Locale } from '../consts';
import { getAllPostsByLocale, localeUrl, type LocalizedEntry } from './i18n';
import { LOCALES, TAG_PAGE_MIN_POSTS } from '../consts';

/**
 * 标签显示名映射表。PRD §5.3：显示名集中维护，不散落在 frontmatter ——
 * frontmatter 里的 tag 永远是全小写连字符 key（如 `vector-search`），
 * 这里给它配中英文展示文案。
 *
 * 缺失映射不是构建错误：新标签先跑起来（回退成 key 本身），
 * 找个时间批量补全，不阻塞发文。
 */
const TAG_LABELS: Record<string, Record<Locale, string>> = {
  design: { en: 'Design', zh: '设计' },
  typography: { en: 'Typography', zh: '排版' },
  meta: { en: 'Meta', zh: '元话题' },
};

export function tagLabel(tag: string, locale: Locale): string {
  return TAG_LABELS[tag]?.[locale] ?? tag;
}

export interface TagCount {
  tag: string;
  label: string;
  count: number;
  entries: LocalizedEntry[];
}

/** 某语言下每个标签聚合到的文章，按数量倒序。 */
async function tagIndex(locale: Locale): Promise<TagCount[]> {
  const entries = await getAllPostsByLocale(locale);
  const byTag = new Map<string, LocalizedEntry[]>();

  for (const item of entries) {
    for (const tag of item.entry.data.tags) {
      const list = byTag.get(tag) ?? [];
      list.push(item);
      byTag.set(tag, list);
    }
  }

  return [...byTag.entries()]
    .map(([tag, list]) => ({ tag, label: tagLabel(tag, locale), count: list.length, entries: list }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/**
 * 薄内容护栏（PRD §4.2）：少于 TAG_PAGE_MIN_POSTS 篇的标签不生成独立页面。
 * Google 判定薄内容页是全站质量分的拖累，宁可标签在文章底部只做纯文本。
 */
export async function getPageableTags(locale: Locale): Promise<TagCount[]> {
  return (await tagIndex(locale)).filter((t) => t.count >= TAG_PAGE_MIN_POSTS);
}

/** 未达标签页门槛的标签也要能展示 —— 文章底部纯文本用，不链接。 */
export async function getAllTags(locale: Locale): Promise<TagCount[]> {
  return tagIndex(locale);
}

/**
 * 标签页门槛在每种语言下独立生效，所以同一个标签常常只在一侧成页
 * （中文写了三篇、英文只有两篇，中文侧成页而英文侧没有）。
 * alternates 必须按实际成页的语言给，否则 hreflang 和语言切换都会指向 404。
 */
export async function pageableLocalesForTag(tag: string): Promise<Locale[]> {
  const perLocale = await Promise.all(
    LOCALES.map(async (locale) =>
      (await getPageableTags(locale)).some((t) => t.tag === tag) ? locale : null,
    ),
  );
  return perLocale.filter((locale): locale is Locale => locale !== null);
}

export async function tagRoutes(locale: Locale) {
  const tags = await getPageableTags(locale);
  return tags.map((t) => ({ params: { tag: t.tag }, props: { ...t, locale } }));
}

export const tagUrl = (locale: Locale, tag: string) => localeUrl(locale, `tags/${tag}`);
