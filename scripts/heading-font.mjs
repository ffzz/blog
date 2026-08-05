#!/usr/bin/env node
/*
 * 中文标题字体的精确子集化。
 *
 * 全站唯一自托管的字体。正文走系统无衬线（Kami 铁律 4），
 * 英文衬线走系统栈（macOS 有 Charter，Windows 有 Georgia），
 * 只有中文标题需要 webfont —— 而标题的字符集是有限且可枚举的。
 *
 * 字符来源覆盖标题（H1–H4、frontmatter title）与 description ——
 * 后者也要收，因为 P1-5 的 OG 图渲染会把 description 画成图里的可见文字，
 * 用同一份子集，不必再为构建期渲染单独维护第二份字体资产。
 *
 * 做法：扫出这些文本里出现过的中文字符，交给 Google Fonts 的
 * `text=` 参数做服务端精确子集，把结果 woff2 落到 public/fonts/ 并提交。
 * 这样构建期不需要 fonttools、不需要 86MB 的 @fontsource 依赖、
 * 也不需要联网 —— Cloudflare Workers Builds 只跑 Node。
 *
 *   npm run fonts          重新生成子集（内容有新标题/描述字时手动跑）
 *   npm run fonts:check    校验已提交的子集是否覆盖当前全部用字
 *
 * check 模式挂在 build 之前。缺字直接失败而不是让页面渲染出豆腐块。
 */

import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT = join(ROOT, 'src/content');
const OUT_DIR = join(ROOT, 'public/fonts');
const WOFF2 = join(OUT_DIR, 'noto-serif-sc-subset.woff2');
const MANIFEST = join(OUT_DIR, 'noto-serif-sc-subset.json');

/** 单页新增字体预算。PRD §7.4。超了不是错误，但必须显式知道。 */
const BUDGET_BYTES = 80 * 1024;

const FAMILY = 'Noto+Serif+SC';
const WEIGHT = 500; // 铁律 5：衬线字重锁 500

// Google Fonts 只对现代浏览器 UA 返回 woff2。
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

/**
 * 需要子集覆盖的 CJK 区段。拉丁字母由系统字体（浏览器）或 PT Serif（OG 图）
 * 覆盖，不进子集。
 *
 * CJK 标点（U+3000–303F，含中文句号「。」顿号「、」引号「「」」等）必须
 * 收进来 —— 浏览器里漏了这些字符可以无缝 fallback 到系统宋体，但 OG 图
 * 由 CanvasKit 离线渲染，没有系统字体兜底，漏字直接是豆腐块。
 * 全角符号（U+FF00–FFEF）同理收进来，避免中文正文里常见的全角标点重演同样的坑。
 */
const isCJK = (cp) =>
  (cp >= 0x4e00 && cp <= 0x9fff) || // 基本汉字
  (cp >= 0x3400 && cp <= 0x4dbf) || // 扩展 A
  (cp >= 0xf900 && cp <= 0xfaff) || // 兼容汉字
  (cp >= 0x3000 && cp <= 0x303f) || // CJK 标点符号
  (cp >= 0xff00 && cp <= 0xffef); // 全角字符与符号

async function* walk(dir) {
  if (!existsSync(dir)) return;
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (/\.mdx?$/.test(e.name)) yield p;
  }
}

/**
 * 收集所有需要这个子集覆盖的文本：
 *   frontmatter 的 title/description、Markdown 的 h1–h4、
 *   以及 consts.ts 里的站名与 tagline。
 * 正文不收 —— 正文在页面上是无衬线，且体量会让子集失控。
 */
async function collectSubsetText() {
  const parts = [];

  for await (const file of walk(CONTENT)) {
    const raw = await readFile(file, 'utf8');
    const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (fm) {
      for (const field of ['title', 'description']) {
        const m = fm[1].match(new RegExp(`^${field}:\\s*(.+)$`, 'm'));
        if (m) parts.push(m[1].replace(/^['"]|['"]$/g, ''));
      }
    }
    const body = fm ? raw.slice(fm[0].length) : raw;
    for (const m of body.matchAll(/^#{1,4}\s+(.+)$/gm)) parts.push(m[1]);
  }

  // 站名与 tagline 也用衬线（Header 的 brand、首页 h1、OG 图默认文案）。
  const consts = await readFile(join(ROOT, 'src/consts.ts'), 'utf8');
  for (const m of consts.matchAll(/^\s*(?:name|tagline):\s*'([^']*)'/gm)) parts.push(m[1]);

  const chars = new Set();
  for (const cp of [...parts.join('')]) {
    if (isCJK(cp.codePointAt(0))) chars.add(cp);
  }
  return [...chars].sort();
}

const readManifest = async () =>
  existsSync(MANIFEST) ? JSON.parse(await readFile(MANIFEST, 'utf8')) : null;

async function generate(chars) {
  if (chars.length === 0) {
    console.log('没有中文标题字符，跳过子集生成。');
    return;
  }

  const url =
    `https://fonts.googleapis.com/css2?family=${FAMILY}:wght@${WEIGHT}` +
    `&text=${encodeURIComponent(chars.join(''))}`;

  const css = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!css.ok) throw new Error(`Google Fonts CSS 请求失败：${css.status} ${css.statusText}`);

  const cssText = await css.text();
  const fontUrl = cssText.match(/url\((https:\/\/fonts\.gstatic\.com[^)]+)\)/)?.[1];
  if (!fontUrl) throw new Error(`未能从返回的 CSS 中解析出 woff2 地址：\n${cssText.slice(0, 400)}`);

  const font = await fetch(fontUrl, { headers: { 'User-Agent': UA } });
  if (!font.ok) throw new Error(`woff2 下载失败：${font.status} ${font.statusText}`);

  const bytes = Buffer.from(await font.arrayBuffer());
  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(WOFF2, bytes);
  await writeFile(
    MANIFEST,
    `${JSON.stringify({ family: 'Noto Serif SC', weight: WEIGHT, chars: chars.join(''), bytes: bytes.length }, null, 2)}\n`,
  );

  const kb = (bytes.length / 1024).toFixed(1);
  console.log(`已生成 ${chars.length} 字子集 → public/fonts/noto-serif-sc-subset.woff2（${kb} KB）`);

  if (bytes.length > BUDGET_BYTES) {
    console.warn(
      `\n⚠ 超出 ${BUDGET_BYTES / 1024} KB 的单页字体预算（PRD §7.4）。\n` +
        `  文章变多后标题字集会持续增长，这是预期内的。可选处理：\n` +
        `  1) 提高预算 —— 字体只在首次访问下载，之后全站缓存命中；\n` +
        `  2) 按 unicode-range 分包 —— 每页只拉用到的分包，但削弱缓存复用；\n` +
        `  3) 放弃中文标题 webfont，回退系统宋体（macOS/Windows 均有，Android 无）。`,
    );
  }
}

async function check(chars) {
  const manifest = await readManifest();
  if (!manifest) {
    throw new Error('缺少 public/fonts/noto-serif-sc-subset.json。先运行 `npm run fonts`。');
  }
  const covered = new Set([...manifest.chars]);
  const missing = chars.filter((c) => !covered.has(c));
  if (missing.length > 0) {
    throw new Error(
      `字体子集缺少 ${missing.length} 个字符：${missing.join('')}\n` +
        '这些字在标题或 OG 图里会渲染成豆腐块。运行 `npm run fonts` 重新生成并提交。',
    );
  }
  console.log(`字体子集覆盖完整（${chars.length} 字，标题 + OG 图用）。`);
}

const chars = await collectSubsetText();
await (process.argv.includes('--check') ? check(chars) : generate(chars));
