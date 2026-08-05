import type { APIRoute } from 'astro';

import { LANG_TAG } from '../consts';
import { collectSitemapUrls } from '../lib/sitemap';

// URL 里理论上不会出现 & 等字符（slug 是我们自己约束的英文短横线），
// 但输出到 XML 前转义一次是零成本的防御，不依赖这个假设。
const escapeXml = (s: string) => s.replace(/&/g, '&amp;');

/**
 * 单文件 sitemap，路径命名为 sitemap-index.xml 是为了匹配 PRD 里约定的地址，
 * 而非真正的多文件索引 —— 站点规模远用不到分片，等文章数量真的触发
 * 25,000 URL/50MB 的单文件上限时再拆，不提前建那层间接。
 */
export const GET: APIRoute = async () => {
  const urls = await collectSitemapUrls();

  const body = urls
    .map((u) => {
      const alternateLinks = Object.entries(u.alternates)
        .map(
          ([locale, href]) =>
            `<xhtml:link rel="alternate" hreflang="${LANG_TAG[locale as keyof typeof LANG_TAG]}" href="${escapeXml(href)}"/>`,
        )
        .join('');
      const lastmod = u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : '';
      return `<url><loc>${escapeXml(u.loc)}</loc>${lastmod}${alternateLinks}</url>`;
    })
    .join('');

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ' +
    'xmlns:xhtml="http://www.w3.org/1999/xhtml">' +
    body +
    '</urlset>';

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
