#!/usr/bin/env node
/*
 * 把浏览器用的 woff2 字体转成 OG 图生成用的 ttf。
 *
 * astro-og-canvas 底层是 CanvasKit（Skia），它的 FontMgr.FromData 吃的是
 * 原始 sfnt 数据，不解 woff2 压缩容器 —— 库自己的文档也写着
 * "TTF recommended"。所以浏览器给 woff2、构建期渲染 OG 图给 ttf，
 * 两者字形完全一致，只是容器格式不同，用 wawoff2 本地解压，不改字符集。
 *
 * 中文子集：直接复用 public/fonts/noto-serif-sc-subset.woff2 ——
 * heading-font.mjs 已经把它扩展到覆盖标题 *和* description 文本
 * （OG 图会把两者都画成可见文字），单一字符来源，不必为 OG 再维护一份。
 *
 * 英文衬线：public/fonts/og/pt-serif-latin.woff2 是一次性拉取的 Google
 * Fonts "latin" 分包（完整拉丁字母表，不是逐字符子集 —— 拉丁字母表本来
 * 就小，没必要像中文那样抠）。拉丁字母表不会变，这个文件只需生成一次、
 * 提交进仓库，不必每次 build 重新拉取（Cloudflare Workers Builds 无
 * 网络依赖的原则和 heading-font.mjs 一致）。
 *
 * 只有中文 woff2 会随内容变化，所以只有它需要在每次 `npm run fonts` 后
 * 重新跑这个脚本；拉丁部分是静态资产，通常不必重跑。
 *
 *   npm run og:fonts
 */

import { compress, decompress } from 'wawoff2';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

void compress; // 只用到 decompress，占位说明未用到的导出不是遗漏

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const FONTS_DIR = join(ROOT, 'public/fonts');
const OG_DIR = join(FONTS_DIR, 'og');

const jobs = [
  { src: join(FONTS_DIR, 'noto-serif-sc-subset.woff2'), out: join(OG_DIR, 'noto-serif-sc-subset.ttf') },
  { src: join(OG_DIR, 'pt-serif-latin.woff2'), out: join(OG_DIR, 'pt-serif-latin.ttf') },
];

await mkdir(OG_DIR, { recursive: true });

for (const { src, out } of jobs) {
  if (!existsSync(src)) {
    throw new Error(`缺少源文件 ${src}。中文子集先跑 \`npm run fonts\`；拉丁字体需手动一次性获取（见脚本头注释）。`);
  }
  const woff2 = await readFile(src);
  const ttf = await decompress(woff2);
  await writeFile(out, ttf);
  console.log(`${src.split('/').pop()} → ${out.split('/').pop()}（${(ttf.length / 1024).toFixed(1)} KB）`);
}
