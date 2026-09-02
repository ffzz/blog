// @ts-check
import { fileURLToPath } from 'node:url';
import react from '@astrojs/react';
import { unified } from '@astrojs/markdown-remark';
import { defineConfig } from 'astro/config';

import { rehypeMermaid } from './src/lib/mermaid-rehype.ts';
import { SITE_ORIGIN } from './src/site-origin.mjs';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  vite: {
    resolve: {
      alias: {
        '@designcodeio/threeui/style.css': fileURLToPath(new URL('./src/shaders/threeui.css', import.meta.url)),
        '@designcodeio/threeui': fileURLToPath(new URL('./src/shaders/sylva-living-world/SylvaLivingWorldScene.tsx', import.meta.url)),
      },
    },
    build: {
      chunkSizeWarningLimit: 1000,
    },
  },

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
    // P0 时留在 Astro 7 默认的 Sätteri 管线，因为强调映射靠纯 CSS
    // 就够了（见 src/styles/prose.css），不需要 remark/rehype。
    // P2 加 Mermaid 时突破了这条：把代码块渲染成 SVG 是真正的 AST
    // 变换，CSS 做不到，这次切回 unified() 是必要的，不是重新引入
    // 上次刻意避开的复杂度。
    processor: unified({ rehypePlugins: [rehypeMermaid] }),
    shikiConfig: {
      // css-variables 主题把每个 token 类型渲染成 --astro-code-* 变量，
      // 而不是把颜色硬编码进 HTML —— 直接对齐 src/styles/tokens.css
      // 里已经存在的明暗两套 Kami token，暗色模式不需要第二套配色。
      theme: 'css-variables',
      wrap: true,
    },
    syntaxHighlight: {
      type: 'shiki',
      excludeLangs: ['mermaid'], // Mermaid 构建期渲染为 SVG，不走 Shiki
    },
  },
});
