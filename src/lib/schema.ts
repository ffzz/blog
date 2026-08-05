import { AUTHOR, LANG_TAG, SITE, SITE_ORIGIN, type Locale } from '../consts';
import { absoluteUrl } from './i18n';

/** OG 图路径（如 `/og/en/posts/x.png`）转绝对 URL。JSON-LD 的 image 字段用。 */
const absoluteAsset = (path: string) => new URL(path, SITE_ORIGIN).href;

/**
 * JSON-LD 构造函数。PRD §7.1：文章页 BlogPosting + BreadcrumbList；
 * /about 页 Person。这里只建最小必要字段集 —— 多余字段不会加分，
 * 缺失必要字段（inLanguage/datePublished/author）会。
 */

const personRef = () => ({
  '@type': 'Person' as const,
  name: AUTHOR.name,
  url: absoluteUrl('en', 'about'),
  ...(AUTHOR.sameAs.length > 0 ? { sameAs: AUTHOR.sameAs } : {}),
});

export interface BlogPostingInput {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  pubDate: Date;
  updatedDate?: Date;
  image?: string;
}

export function blogPosting(input: BlogPostingInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: input.title,
    description: input.description,
    inLanguage: LANG_TAG[input.locale],
    datePublished: input.pubDate.toISOString(),
    dateModified: (input.updatedDate ?? input.pubDate).toISOString(),
    url: absoluteUrl(input.locale, input.path),
    mainEntityOfPage: absoluteUrl(input.locale, input.path),
    author: personRef(),
    publisher: personRef(),
    ...(input.image ? { image: absoluteAsset(input.image) } : {}),
  };
}

export function breadcrumbList(locale: Locale, sectionLabel: string, title: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: SITE[locale].name, item: absoluteUrl(locale, '') },
      {
        '@type': 'ListItem',
        position: 2,
        name: sectionLabel,
        // 站内没有 /posts 或 /notes 的索引页 —— 指到那里会是一个不存在的 URL。
        // /archive 是唯一真实存在的"全部文章"列表页，两个 collection 共用它。
        item: absoluteUrl(locale, 'archive'),
      },
      { '@type': 'ListItem', position: 3, name: title, item: absoluteUrl(locale, path) },
    ],
  };
}

export function personPage(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: AUTHOR.name,
    email: `mailto:${AUTHOR.email}`,
    url: absoluteUrl(locale, 'about'),
    ...(AUTHOR.sameAs.length > 0 ? { sameAs: AUTHOR.sameAs } : {}),
  };
}

export function website(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE[locale].name,
    description: SITE[locale].tagline,
    url: absoluteUrl(locale, ''),
    inLanguage: LANG_TAG[locale],
    publisher: personRef(),
  };
}
