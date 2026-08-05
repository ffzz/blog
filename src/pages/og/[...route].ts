import { OGImageRoute } from 'astro-og-canvas';

import { collectOGPages } from '../../lib/og-pages';

const items = await collectOGPages();
const pages = Object.fromEntries(items.map((p) => [p.key, p]));

/**
 * OG 分享卡片，构建期生成。配色与排版对齐 Kami token（PRD §7.3）：
 * 羊皮纸底、油墨蓝左侧竖线、衬线标题。
 *
 * 文件名不带 `.png` —— OGImageRoute 自己会把每个 key 拼成
 * `/og/<key>.png`，文件名里再带一次会拼出 `.png.png`。
 *
 * 字体用 ttf 而非站内实际使用的 woff2 —— CanvasKit（这个库的渲染后端）
 * 只吃原始 sfnt 数据，不解 woff2 压缩容器。两者字形一致，
 * 只是容器格式不同，见 scripts/og-fonts.mjs。
 */
export const { getStaticPaths, GET } = await OGImageRoute({
  pages,
  getImageOptions: (_path, page) => ({
    title: page.title,
    description: page.description,
    bgGradient: [[245, 244, 237]], // --parchment
    border: { color: [27, 54, 93], width: 8, side: 'inline-start' }, // --brand，铁律 9 的左侧竖线搬到 OG 图上
    padding: 72,
    font: {
      title: {
        color: [20, 20, 19], // --text-1
        size: 56,
        lineHeight: 1.25,
        weight: 'Medium', // 铁律 5：衬线字重锁 500
        // 实际内嵌的字体家族名，用 CanvasKit.FontMgr 直接探测得出
        // （不等于我们在 tokens.css 里给浏览器用的 @font-face 别名）。
        families: ['Noto Serif SC Medium', 'PT Serif'],
      },
      description: {
        color: [80, 78, 73], // --text-3
        size: 30,
        lineHeight: 1.5,
        weight: 'Normal',
        families: ['Noto Serif SC Medium', 'PT Serif'],
      },
    },
    fonts: ['./public/fonts/og/noto-serif-sc-subset.ttf', './public/fonts/og/pt-serif-latin.ttf'],
  }),
});
