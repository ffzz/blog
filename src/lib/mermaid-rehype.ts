import { fromHtmlIsomorphic } from 'hast-util-from-html-isomorphic';
import { renderMermaidSVG } from 'beautiful-mermaid';
import { visit } from 'unist-util-visit';
import type { Root, Element } from 'hast';

/**
 * 构建期把 ```mermaid 代码块渲染成 SVG。PRD §8.1：不上运行时，
 * 颜色引用 CSS 变量而非硬编码 hex，暗色模式因此不需要重新渲染。
 *
 * 用 beautiful-mermaid 而不是官方 mermaid-cli / rehype-mermaid ——
 * 那两个都要在构建期起一个无头浏览器（Puppeteer/Playwright）跑 Mermaid.js
 * 的真实 DOM 依赖，Cloudflare Workers Builds 没有预装 Chromium，
 * 现下载一个几百 MB 的二进制既慢又脆弱。beautiful-mermaid 是纯 JS 重新
 * 实现，零 DOM 依赖，构建产物里也不会带一个浏览器二进制。
 *
 * 代价：不是 Mermaid.js 本体，图表类型支持是有限集合，已实测：
 *   支持：flowchart/graph、sequenceDiagram、stateDiagram-v2、classDiagram、erDiagram
 *   不支持：pie、gantt（明确报错 "Invalid mermaid header"，不是静默乱码）
 * 用到已验证清单之外的类型前，先用 scripts/ 外的一次性脚本调用
 * renderMermaidSVG() 探一下，不要假设支持。
 *
 * 重要：下面的 throw 本身不保证会让 `astro build` 以非零状态退出 ——
 * 实测发现 Astro 的渲染似乎是按页容错的，一个页面渲染期抛错不会让整个
 * 构建命令失败，只会让*那一页*的 <Content /> 输出变成空壳，构建日志
 * 照样打印"成功"。真正兜底失败的是 scripts/verify-build.mjs
 * （检查产物里有没有空的 .prose 容器），已经接在 `npm run build` 里，
 * 这里的 throw 只负责把原始错误信息打印出来，方便定位。
 */

const KAMI_MERMAID_THEME = {
  bg: 'var(--mermaid-bg)',
  fg: 'var(--mermaid-fg)',
  line: 'var(--mermaid-line)',
  accent: 'var(--mermaid-accent)',
  muted: 'var(--mermaid-muted)',
  surface: 'var(--mermaid-surface)',
  border: 'var(--mermaid-border)',
  transparent: true,
} as const;

/**
 * beautiful-mermaid 在生成的 <style> 里塞了一行拉 Google Fonts "Inter" 的
 * @import —— 这是运行时对访客浏览器的外部网络请求，且字体也不是本站在用
 * 的那套。库本身没有关闭它的选项（font 参数只是换字体名字，import 照样发），
 * 只能在拿到 SVG 字符串后自己删掉这一行。删掉后 text{} 规则里的字体名
 * 找不到对应 @font-face，会自然 fallback 到 system-ui —— 和站内其余
 * UI 文案用的系统字体栈是一路的，不算劣化。
 *
 * 防御性检查删的是"结果"而不是"有没有匹配到"：库以后升级了可能干脆不再
 * 生成这行 import，那时正则天然匹配不到东西，这不是错误。真正的风险是
 * 库换了 @import 的写法（引号、空白、字体名）导致正则失效但 import 还在——
 * 所以删完之后直接看输出里还有没有 googleapis.com 字样，有就说明正则
 * 该更新了。
 */
function stripGoogleFontsImport(svg: string): string {
  const cleaned = svg.replace(/@import\s+url\(['"]https:\/\/fonts\.googleapis\.com[^)]*\)\s*;?/g, '');
  if (cleaned.includes('fonts.googleapis.com')) {
    throw new Error(
      'beautiful-mermaid 输出的 SVG 里仍残留 fonts.googleapis.com —— 说明它换了 @import 的写法，' +
        '这里的正则匹配不上了。更新 src/lib/mermaid-rehype.ts 的 stripGoogleFontsImport，' +
        '否则会把一个运行时外部字体请求泄漏到生产环境。',
    );
  }
  return cleaned;
}

const isMermaidCodeBlock = (node: Element): boolean => {
  if (node.tagName !== 'pre') return false;
  const code = node.children.find((c): c is Element => c.type === 'element' && c.tagName === 'code');
  const className = code?.properties?.className;
  return Array.isArray(className) && className.some((c) => c === 'language-mermaid');
};

const extractText = (node: Element): string =>
  node.children
    .flatMap((c) => (c.type === 'element' ? c.children : [c]))
    .map((c) => (c.type === 'text' ? c.value : ''))
    .join('');

export function rehypeMermaid() {
  return (tree: Root) => {
    visit(tree, 'element', (node, index, parent) => {
      if (!parent || index === undefined || !isMermaidCodeBlock(node)) return;

      const source = extractText(node);
      let svg: string;
      try {
        svg = stripGoogleFontsImport(renderMermaidSVG(source, KAMI_MERMAID_THEME));
      } catch (err) {
        // 构建期失败要出现在构建日志里，而不是让读者在页面上看到一个空块。
        throw new Error(
          `Mermaid 图表渲染失败（beautiful-mermaid）。原始定义：\n${source}\n\n原始错误：${err instanceof Error ? err.message : err}`,
        );
      }

      const fragment = fromHtmlIsomorphic(svg, { fragment: true });
      const figure: Element = {
        type: 'element',
        tagName: 'figure',
        properties: { className: ['mermaid'] },
        children: fragment.children as Element['children'],
      };
      parent.children[index] = figure;
    });
  };
}
