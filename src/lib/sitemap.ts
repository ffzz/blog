import { LOCALES, type Locale } from '../consts';
import { absoluteUrl, getAllPostsByLocale, postPath, type LocalizedEntry } from './i18n';
import { getPageableTags } from './tags';

/** 一条 sitemap URL 及其在其他语言下的对应地址（用于 xhtml:link alternate）。 */
export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  /** 语言 → 绝对 URL。只含实际存在的语言版本 —— 不足的一侧直接缺该 key。 */
  alternates: Partial<Record<Locale, string>>;
}

// subscribe/confirm 故意不在这里：它是订阅流程的中间跳转页，不是内容，
// 见 BaseHead 的 noindex 处理。
const STATIC_PATHS = ['', 'about', 'archive', 'privacy'];

/**
 * 汇总全站 sitemap 条目。
 *
 * 不用 @astrojs/sitemap 的 i18n 选项 —— 它假设每个 locale 下页面都存在，
 * 会向 Google 上报不存在的 URL。这里按内容实际存在的语言版本
 * （文章看文件系统、标签页看薄内容护栏）逐条计算 alternate 集合。PRD §6。
 */
export async function collectSitemapUrls(): Promise<SitemapUrl[]> {
  const urls: SitemapUrl[] = [];

  // 固定页面：P0 已强制两种语言都必须存在（pages collection 缺一个就构建失败）。
  for (const path of STATIC_PATHS) {
    const alternates = Object.fromEntries(LOCALES.map((l) => [l, absoluteUrl(l, path)])) as Record<
      Locale,
      string
    >;
    for (const locale of LOCALES) {
      urls.push({ loc: alternates[locale], alternates });
    }
  }

  // 文章与随笔：按 slug 分组，一次算出该 slug 实际存在的语言版本，
  // 避免对 en/zh 两条 URL 各自重新判断一遍。
  const byLocale = new Map<Locale, LocalizedEntry[]>();
  for (const locale of LOCALES) byLocale.set(locale, await getAllPostsByLocale(locale));

  const seen = new Set<string>(); // `${collection}/${slug}`，防止双语文章被算两遍
  for (const locale of LOCALES) {
    for (const item of byLocale.get(locale)!) {
      const key = postPath(item.collection, item.slug);
      if (seen.has(key)) continue;
      seen.add(key);

      const alternates: Partial<Record<Locale, string>> = {};
      for (const l of LOCALES) {
        const exists = byLocale.get(l)!.some((e) => e.collection === item.collection && e.slug === item.slug);
        if (exists) alternates[l] = absoluteUrl(l, key);
      }

      for (const l of LOCALES) {
        if (!alternates[l]) continue;
        const localizedEntry = byLocale.get(l)!.find((e) => e.collection === item.collection && e.slug === item.slug)!;
        urls.push({
          loc: alternates[l]!,
          lastmod: (localizedEntry.entry.data.updatedDate ?? localizedEntry.entry.data.pubDate)
            .toISOString()
            .slice(0, 10),
          alternates,
        });
      }
    }
  }

  // 标签页：只收薄内容护栏放行的。同一 tag key 在两种语言各自独立判断达标与否。
  const pageableByLocale = new Map<Locale, Set<string>>();
  for (const locale of LOCALES) {
    pageableByLocale.set(locale, new Set((await getPageableTags(locale)).map((t) => t.tag)));
  }
  const allTags = new Set([...pageableByLocale.values()].flatMap((s) => [...s]));
  for (const tag of allTags) {
    const alternates: Partial<Record<Locale, string>> = {};
    for (const l of LOCALES) {
      if (pageableByLocale.get(l)!.has(tag)) alternates[l] = absoluteUrl(l, `tags/${tag}`);
    }
    for (const l of LOCALES) {
      if (alternates[l]) urls.push({ loc: alternates[l]!, alternates });
    }
  }

  return urls;
}
