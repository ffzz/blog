import { LOCALES, SITE, type Locale } from '../consts';
import { getAllPostsByLocale, postPath } from './i18n';
import { getPageableTags, tagLabel } from './tags';
import { t } from './ui';

export interface OGPageInput {
  /** 匹配 ogImagePath() 的 key，不含前导斜杠、不含 .png。 */
  key: string;
  locale: Locale;
  title: string;
  description: string;
}

/**
 * 需要生成 OG 图的全部页面。key 的构造规则必须与 lib/og.ts 的
 * ogImagePath() 完全一致 —— 两处约定分裂就会导致页面链接到不存在的图。
 */
export async function collectOGPages(): Promise<OGPageInput[]> {
  const pages: OGPageInput[] = [];

  for (const locale of LOCALES) {
    const site = SITE[locale];
    pages.push({ key: `${locale}/home`, locale, title: site.name, description: site.tagline });
    pages.push({
      key: `${locale}/about`,
      locale,
      title: t(locale, 'navAbout'),
      description: site.tagline,
    });
    pages.push({
      key: `${locale}/archive`,
      locale,
      title: t(locale, 'navArchive'),
      description: site.tagline,
    });

    const entries = await getAllPostsByLocale(locale);
    for (const { entry, collection, slug } of entries) {
      pages.push({
        key: `${locale}/${postPath(collection, slug)}`,
        locale,
        title: entry.data.title,
        description: entry.data.description,
      });
    }

    const tags = await getPageableTags(locale);
    for (const tag of tags) {
      pages.push({
        key: `${locale}/tags/${tag.tag}`,
        locale,
        title: tagLabel(tag.tag, locale),
        description: site.tagline,
      });
    }
  }

  return pages;
}
