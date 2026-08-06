#!/usr/bin/env node
/*
 * 构建后校验：确认没有文章渲染成了空壳。
 *
 * 真实发现的问题：给一篇文章塞一个 beautiful-mermaid 不支持的图表类型
 * （如 pie/gantt），mermaid-rehype.ts 会 throw，但 `astro build` 依然
 * 以 exit code 0 收尾，且日志显示"构建成功"—— Astro 的渲染似乎是
 * per-page 容错的（推测与 deferRender 一类的按页渲染机制有关），
 * 一个页面渲染期抛错不会让整个构建命令失败，只会让*那一个页面*的
 * `<Content />` 输出变成空的。结果是一篇标题、日期都在、正文完全
 * 空白的"幽灵文章"，CI 端不会有任何信号。
 *
 * 这里不追查 Astro 内部为什么这样设计，直接在构建产物上加一道
 * 独立的事后检查：扫描所有文章/随笔页面的 HTML，.prose 容器不能是空的。
 * 和 P0 的字体覆盖检查、P1 的薄内容护栏是同一个原则 —— 缺陷必须
 * 显式失败，不能静默放过。
 *
 *   npm run build   已把这一步接在 astro build 之后
 */

import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');

async function* walk(dir) {
  if (!existsSync(dir)) return;
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.name === 'index.html') yield p;
  }
}

// 只检查会含 .prose 的文章/随笔页面 —— 其他页面类型没有这个容器，检查了也没意义。
const isArticlePage = (path) => /\/(posts|notes)\//.test(path);

const EMPTY_PROSE = /<div class="prose"[^>]*><\/div>/;

const problems = [];
for await (const file of walk(DIST)) {
  if (!isArticlePage(file)) continue;
  const html = await readFile(file, 'utf8');
  if (EMPTY_PROSE.test(html)) {
    problems.push(file.replace(`${DIST}/`, ''));
  }
}

if (problems.length > 0) {
  console.error(
    `\n✗ ${problems.length} 篇文章正文为空（渲染期可能抛错但被 Astro 静默吞掉了）：\n` +
      problems.map((p) => `  - ${p}`).join('\n') +
      '\n\n常见原因：Mermaid 图表用了 beautiful-mermaid 不支持的类型（如 pie/gantt），' +
      '或 Markdown 里有其他会在渲染期抛错的内容。\n' +
      '本地跑 `npm run dev` 打开对应文章页，终端会打印真正的原始错误。\n',
  );
  process.exit(1);
}

console.log(`✓ 构建产物校验通过，没有空壳文章。`);
