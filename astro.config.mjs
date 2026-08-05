// @ts-check
import { defineConfig } from 'astro/config';

import { SITE_ORIGIN } from './src/site-origin.mjs';

// https://astro.build/config
export default defineConfig({
  // canonical / sitemap / OG 图全部从这里派生。上线前替换 src/site-origin.mjs。
  site: SITE_ORIGIN,

  i18n: {
    locales: ['en', 'zh'],
    defaultLocale: 'en',
    routing: {
      // 英文走根路径 /posts/x/，中文走 /zh/posts/x/。
      // x-default 指向英文。上线后此结构冻结 —— 改动会丢失已积累的搜索权重。
      prefixDefaultLocale: false,
    },
  },

  markdown: {
    // 留在 Astro 7 默认的 Sätteri 管线（GFM + SmartyPants）。
    // Markdown 的 **粗体** / *斜体* 重映射是纯 CSS（见 src/styles/prose.css），
    // 不需要 remark/rehype 插件，因此不引入 @astrojs/markdown-remark。
    syntaxHighlight: false, // 代码高亮的 Kami 主题在 P2 接入
  },
});
