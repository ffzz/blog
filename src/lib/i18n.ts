import { getCollection, type CollectionEntry } from 'astro:content';
import { getRelativeLocaleUrl, getAbsoluteLocaleUrl } from 'astro:i18n';

import {
  COLLECTIONS,
  DEFAULT_LOCALE,
  LOCALES,
  SITE_ORIGIN,
  type CollectionName,
  type Locale,
} from '../consts';

export type PostEntry = CollectionEntry<'posts'> | CollectionEntry<'notes'>;

/** 带解析后语言与 slug 的条目。整个站点内部只传这个形状，不再重复解析 id。 */
export interface LocalizedEntry {
  entry: PostEntry;
  collection: CollectionName;
  locale: Locale;
  /** 去掉语言段后的 slug，中英文版本共用同一个值 —— 这就是配对依据。 */
  slug: string;
}

const isLocale = (value: string): value is Locale =>
  (LOCALES as readonly string[]).includes(value);

/**
 * glob loader 的 id 形如 `zh/foo` 或 `zh/2026/foo`：
 * 第一段是语言，其余是 slug。首段不是已知语言则视为非法条目。
 */
function parseEntryId(id: string): { locale: Locale; slug: string } | null {
  const [head, ...rest] = id.split('/');
  if (!head || rest.length === 0 || !isLocale(head)) return null;
  return { locale: head, slug: rest.join('/') };
}

/** 草稿在开发时可见、构建时排除 —— 便于本地预览未完成的文章。 */
const isPublished = ({ data }: PostEntry) => import.meta.env.DEV || !data.draft;

let indexPromise: Promise<LocalizedEntry[]> | null = null;

/**
 * 一次性读取两个 collection 并解析出语言与 slug。
 * 构建期每个页面都会问翻译情况，这里做单次缓存避免重复解析。
 */
function loadIndex(): Promise<LocalizedEntry[]> {
  indexPromise ??= (async () => {
    const all = await Promise.all(
      COLLECTIONS.map(async (collection) => {
        const entries = (await getCollection(collection)) as PostEntry[];
        return entries.filter(isPublished).flatMap<LocalizedEntry>((entry) => {
          const parsed = parseEntryId(entry.id);
          if (!parsed) {
            // 放错目录的文件会静默消失，这里显式报错而不是让它悄悄不见。
            throw new Error(
              `内容文件 ${collection}/${entry.id} 不在合法的语言目录下。` +
                `期望路径形如 src/content/${collection}/<${LOCALES.join('|')}>/<slug>.md`,
            );
          }
          return [{ entry, collection, ...parsed }];
        });
      }),
    );
    return all.flat();
  })();
  return indexPromise;
}

/** 某个 collection 下某语言的全部文章，按发布时间倒序。 */
export async function getPostsByLocale(
  collection: CollectionName,
  locale: Locale,
): Promise<LocalizedEntry[]> {
  const index = await loadIndex();
  return index
    .filter((it) => it.collection === collection && it.locale === locale)
    .sort((a, b) => b.entry.data.pubDate.valueOf() - a.entry.data.pubDate.valueOf());
}

/** 某语言下所有 collection 的文章，按发布时间倒序。首页与归档页用。 */
export async function getAllPostsByLocale(locale: Locale): Promise<LocalizedEntry[]> {
  const index = await loadIndex();
  return index
    .filter((it) => it.locale === locale)
    .sort((a, b) => b.entry.data.pubDate.valueOf() - a.entry.data.pubDate.valueOf());
}

/**
 * 这篇文章实际存在哪些语言版本。
 *
 * hreflang、sitemap 的 alternate、语言切换器三处共用此函数 ——
 * 这是「不强制一一对应」策略成立的前提：只有真实存在的语言才会被上报，
 * 否则会向 Google 提交 404 URL。PRD §6。
 *
 * 返回值按 LOCALES 顺序稳定排列，且必然包含调用方自己的语言（自引用），
 * 漏掉自引用会导致 Google 忽略整组 hreflang 标签。
 */
export async function getAvailableLocales(
  collection: CollectionName,
  slug: string,
): Promise<Locale[]> {
  const index = await loadIndex();
  const present = new Set(
    index
      .filter((it) => it.collection === collection && it.slug === slug)
      .map((it) => it.locale),
  );
  return LOCALES.filter((locale) => present.has(locale));
}

/**
 * getStaticPaths 的共用实现。四条文章路由（posts/notes × en/zh）
 * 除了这两个常量之外完全一致，逻辑收在这里而不是抄四遍。
 */
export async function postRoutes(collection: CollectionName, locale: Locale) {
  const entries = await getPostsByLocale(collection, locale);
  return entries.map((it) => ({
    params: { slug: it.slug },
    props: { entry: it.entry, slug: it.slug, collection: it.collection, locale: it.locale },
  }));
}

/** 文章在站内的路径（不含语言前缀），如 `posts/rag-chunking`。 */
export const postPath = (collection: CollectionName, slug: string) => `${collection}/${slug}`;

/** 文章的站内相对 URL，如 `/posts/x/` 或 `/zh/posts/x/`。 */
export const postUrl = (locale: Locale, collection: CollectionName, slug: string) =>
  getRelativeLocaleUrl(locale, postPath(collection, slug));

/** 文章的绝对 URL。canonical、hreflang、sitemap、OG 用。 */
export const postAbsoluteUrl = (locale: Locale, collection: CollectionName, slug: string) =>
  getAbsoluteLocaleUrl(locale, postPath(collection, slug));

/** 任意站内路径的相对 URL，如 localeUrl('zh', 'about') → `/zh/about/`。 */
export const localeUrl = (locale: Locale, path = '') => getRelativeLocaleUrl(locale, path);

/** 任意站内路径的绝对 URL。sitemap 与 OG 图用 —— 两者都需要完整域名。 */
export const absoluteUrl = (locale: Locale, path = '') => getAbsoluteLocaleUrl(locale, path);

/**
 * 文件端点（.xml / .txt / .png）的绝对 URL —— 不走 getAbsoluteLocaleUrl。
 * 那个函数是为页面路由设计的，永远加尾斜杠（/about/），但文件路径加了
 * 尾斜杠就是错的 URL（/rss.xml/ 会 404）。这里只做纯拼接，locale 前缀
 * 需要调用方自己拼进 path（如 `zh/rss.xml`）。
 */
export const absoluteFileUrl = (path: string) => new URL(path, SITE_ORIGIN).href;

export { DEFAULT_LOCALE, LOCALES };
export type { Locale, CollectionName };
