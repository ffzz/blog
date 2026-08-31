import type { Locale } from '../consts';

/**
 * 界面文案。内容走 Markdown，这里只放 chrome 部分的字符串。
 *
 * 中英各写各的，不做机械直译 —— 两种语言的界面表达习惯差异很大。
 */
const strings = {
  en: {
    skipToContent: 'Skip to content',
    navAbout: 'About',
    navResume: 'Resume',
    navPosts: 'Writing',
    navNotes: 'Notes',
    navArchive: 'Archive',
    themeToggle: 'Switch colour theme',
    langSwitch: 'Switch language',
    langUnavailable: 'Not available in this language',
    recent: 'Recent',
    viewAll: 'All writing →',
    siblingNav: 'More writing',
    olderPost: 'Older',
    newerPost: 'Newer',
    readMore: 'Read',
    updatedOn: 'Updated',
    tagged: 'Tagged',
    notFoundTitle: 'Nothing here',
    notFoundBody: 'This page does not exist, or it moved. The writing is still where you left it.',
    backHome: 'Back to the front page',
    kindPost: 'Writing',
    kindNote: 'Note',
    archiveTitle: 'Archive',
    archiveDescription: 'Every post and note, oldest to newest within each year.',
    tagPageDescription: 'Posts and notes tagged',
    emptyTag: 'Nothing tagged with this yet.',
    tocLabel: 'On this page',
    searchOpen: 'Search',
    searchPlaceholder: 'Search writing and notes…',
    searchNoResults: 'No results.',
    searchClose: 'Close search',
    subscribeLabel: 'Get new posts by email',
    subscribePlaceholder: 'you@example.com',
    subscribeButton: 'Subscribe',
    privacyLabel: 'Privacy',
    confirmInvalidTitle: 'That link is not valid',
    confirmInvalidBody: 'This confirmation link is malformed or already used up. Subscribe again if you still want in.',
  },
  zh: {
    skipToContent: '跳到正文',
    navAbout: '关于',
    navResume: '简历',
    navPosts: '文章',
    navNotes: '随笔',
    navArchive: '归档',
    themeToggle: '切换明暗',
    langSwitch: '切换语言',
    langUnavailable: '这篇没有对应的语言版本',
    recent: '最近',
    viewAll: '全部文章 →',
    siblingNav: '相邻文章',
    olderPost: '更早的一篇',
    newerPost: '更新的一篇',
    readMore: '阅读',
    updatedOn: '更新于',
    tagged: '标签',
    notFoundTitle: '这里什么也没有',
    notFoundBody: '页面不存在，或者已经搬家了。文章还在原处。',
    backHome: '回到首页',
    kindPost: '文章',
    kindNote: '随笔',
    archiveTitle: '归档',
    archiveDescription: '全部文章与随笔，按年份倒序。',
    tagPageDescription: '标签为',
    emptyTag: '这个标签下还没有内容。',
    tocLabel: '目录',
    searchOpen: '搜索',
    searchPlaceholder: '搜索文章与随笔…',
    searchNoResults: '没有找到结果。',
    searchClose: '关闭搜索',
    subscribeLabel: '订阅更新，新文章发邮件通知你',
    subscribePlaceholder: 'you@example.com',
    subscribeButton: '订阅',
    privacyLabel: '隐私政策',
    confirmOkTitle: '订阅成功',
    confirmOkBody: '以后新文章会发到你的邮箱。任意一封邮件底部都能退订。',
    confirmExpiredTitle: '链接已过期',
    confirmExpiredBody: '确认链接 24 小时内有效，重新订阅一次即可拿到新链接。',
    confirmInvalidTitle: '链接无效',
    confirmInvalidBody: '这个确认链接格式不对，或者已经用过了。如果还想订阅，请重新提交一次。',
    confirmFailedTitle: '出了点问题',
    confirmFailedBody: '订阅没能处理完成，请稍后再试一次。',
  },
} as const satisfies Record<Locale, Record<string, string>>;

export type UIKey = keyof (typeof strings)['en'];

export const t = (locale: Locale, key: UIKey): string => strings[locale][key];

/** 日期格式。中文用「2026年3月4日」，英文用「4 March 2026」。 */
export function formatDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

/** <time datetime> 用的机读格式。 */
export const isoDate = (date: Date): string => date.toISOString().slice(0, 10);
