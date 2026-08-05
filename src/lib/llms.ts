import { AUTHOR, LOCALES, SITE, type Locale } from '../consts';
import {
  absoluteFileUrl,
  absoluteUrl,
  getAllPostsByLocale,
  postPath,
  postAbsoluteUrl,
  type LocalizedEntry,
} from './i18n';

/**
 * llms.txt（索引）与 llms-full.txt（全文）的共用数据源。PRD §7.2：
 * 从 Content Collections 自动生成，零维护 —— 新文章一发布，两份文件
 * 下次构建自动包含，不需要手动维护列表。
 */

interface FlatEntry extends LocalizedEntry {}

async function allEntries(): Promise<FlatEntry[]> {
  const perLocale = await Promise.all(LOCALES.map((l) => getAllPostsByLocale(l)));
  return perLocale
    .flat()
    .sort((a, b) => b.entry.data.pubDate.valueOf() - a.entry.data.pubDate.valueOf());
}

const localeMark = (locale: Locale) => (locale === 'zh' ? '中文' : 'EN');

function section(title: string, entries: FlatEntry[]): string {
  if (entries.length === 0) return '';
  const lines = entries.map(({ entry, collection, slug, locale }) => {
    const url = postAbsoluteUrl(locale, collection, slug);
    return `- [${entry.data.title}](${url}) (${localeMark(locale)}): ${entry.data.description}`;
  });
  return `## ${title}\n\n${lines.join('\n')}`;
}

/** llms.txt：spec 定义的索引格式 —— 标题、一句摘要、分节链接列表。 */
export async function buildLlmsTxt(): Promise<string> {
  const entries = await allEntries();
  const posts = entries.filter((e) => e.collection === 'posts');
  const notes = entries.filter((e) => e.collection === 'notes');

  // 每个数组元素是一个完整的块（标题、摘要、每个 section），
  // 块之间用空行分隔。filter(Boolean) 只丢弃 section() 在无内容时
  // 返回的空字符串块 —— 不能对拆到字符串级别的 '' 空行做同样的处理，
  // 那样会把块内故意留的空行也吞掉。
  const blocks = [
    `# ${SITE.en.name} · ${SITE.zh.name}\n\n> ${SITE.en.tagline} — ${SITE.zh.tagline}`,
    section('Writing', posts),
    section('Notes', notes),
    [
      '## More',
      '',
      `- [About](${absoluteUrl('en', 'about')})`,
      `- [关于](${absoluteUrl('zh', 'about')})`,
      `- [Full text (llms-full.txt)](${absoluteFileUrl('llms-full.txt')})`,
      `- [RSS (EN)](${absoluteFileUrl('rss.xml')})`,
      `- [RSS (中文)](${absoluteFileUrl('zh/rss.xml')})`,
    ].join('\n'),
  ];

  return blocks.filter(Boolean).join('\n\n');
}

/** llms-full.txt：每篇文章的完整 Markdown 正文，按发布时间倒序拼接。 */
export async function buildLlmsFullTxt(): Promise<string> {
  const entries = await allEntries();

  const header = [
    `# ${SITE.en.name} · ${SITE.zh.name} — full text`,
    '',
    `> ${SITE.en.tagline} — ${SITE.zh.tagline}`,
    `> By ${AUTHOR.name}. Generated at build time from every published post and note.`,
    '',
  ].join('\n');

  const body = entries
    .map(({ entry, collection, slug, locale }) => {
      const url = postAbsoluteUrl(locale, collection, slug);
      return [
        '---',
        '',
        `## ${entry.data.title}`,
        '',
        `- URL: ${url}`,
        `- Language: ${localeMark(locale)}`,
        `- Published: ${entry.data.pubDate.toISOString().slice(0, 10)}`,
        `- Path: ${postPath(collection, slug)}`,
        '',
        entry.body ?? '',
      ].join('\n');
    })
    .join('\n\n');

  return `${header}\n${body}\n`;
}
