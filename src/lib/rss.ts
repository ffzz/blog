import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';

import { SITE, type Locale } from '../consts';
import { getAllPostsByLocale, postUrl } from './i18n';

const parser = new MarkdownIt();

/**
 * 一个 locale 的完整 RSS feed。只含该 locale 实际存在的文章，
 * 不对缺失语言做任何 fallback —— 混进另一语言的内容比 feed 短更糟。PRD §6 / §7.2。
 *
 * 全文输出（PRD §7.2）：AI 摘要与聚合器需要完整正文才能准确引用，
 * 只给摘要等于把内容切碎。Markdown body 走官方推荐的
 * markdown-it + sanitize-html 组合渲染 —— astro:content 的 render()
 * 返回的是 Astro 组件，RSS 端点需要的是原始 HTML 字符串，两者不通用。
 */
export async function localeFeed(locale: Locale, context: APIContext) {
  const entries = await getAllPostsByLocale(locale);
  return rss({
    title: SITE[locale].name,
    description: SITE[locale].tagline,
    site: context.site!,
    items: entries.map(({ entry, collection, slug }) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.pubDate,
      link: postUrl(locale, collection, slug),
      content: sanitizeHtml(parser.render(entry.body ?? ''), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
      }),
    })),
    customData: `<language>${locale === 'zh' ? 'zh-cn' : 'en-us'}</language>`,
  });
}
