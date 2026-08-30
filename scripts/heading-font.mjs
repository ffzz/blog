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
 * 做法：扫出这些文本里出现过的中文字符，从 Google Fonts 取字体，再用
 * subset-font（harfbuzz 的 WASM 版）在本地裁成精确子集，落到 public/fonts/ 并提交。
 * 全程 Node，不需要 fonttools，也不需要 86MB 的 @fontsource 依赖。
 *
 * 为什么不直接用 Google Fonts 的 `text=` 参数做服务端子集：2026-08-30 实测，
 * 那个端点已经失效。请求 50 字、150 字、523 字各三次，成功时返回的都是同一个
 * 6,247,900 字节的完整字体，失败时是 504。也就是说它要么把整包字体给你，
 * 要么不给 —— 靠它做子集，等于把 6 MB 推上线（PRD §7.4 的预算是 80 KB）。
 * 现在 gstatic 的返回值只被当作源字体，裁剪一定在本地发生。
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
import subsetFont from 'subset-font';

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

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 带重试的 fetch。
 *
 * fonts.gstatic.com 的字体端点 2026-08-30 起频繁返回 504，而重试通常就能拿到 ——
 * 连续三次部署都是首跑 504、重跑即过。把重试收进脚本，本地和 CI 都受益。
 * 只重试 5xx 与网络错误；4xx 是请求本身的问题，重试没有意义。
 */
async function fetchWithRetry(url, label, retries = 4) {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA } });
      if (res.ok) return res;
      lastError = new Error(`${label} 请求失败：HTTP ${res.status} ${res.statusText}`);
      if (res.status < 500) throw lastError;
    } catch (e) {
      lastError = e;
      // 4xx 已经在上一步 throw，这里再拦一次是为了不把它当成可重试的错误
      if (/HTTP [45]\d\d/.test(e.message) && !/HTTP 5\d\d/.test(e.message)) throw e;
    }
    if (attempt < retries) {
      console.warn(`  ${label} 第 ${attempt} 次失败（${lastError.message}），4 秒后重试`);
      await sleep(4000);
    }
  }
  throw lastError;
}

/**
 * 裁剪结果的校验。
 *
 * 用每字字节数而不是总大小当判据：字集随文章增长，总大小本来就会涨，
 * 而一次正常的裁剪稳定在 200 字节/字以内（523 字实测 89 KB，175 字节/字）。
 * 整包字体是 6.2 MB、11,946 字节/字，差两个数量级，阈值取 1000 留足余量。
 */
function validateSubset(bytes, charCount) {
  if (bytes.length === 0) {
    throw new Error('裁剪结果为空，源字体可能不是有效字体。');
  }
  const perChar = bytes.length / charCount;
  if (perChar > 1000) {
    throw new Error(
      `本地裁剪没有生效：${charCount} 字生成了 ${(bytes.length / 1024).toFixed(1)} KB` +
        `（每字 ${Math.round(perChar)} 字节，正常应在 200 字节以内）。\n` +
        '这通常是拿到了整包字体。不要提交，先查 subset-font 这一步。',
    );
  }
}

async function generate(chars) {
  if (chars.length === 0) {
    console.log('没有中文标题字符，跳过子集生成。');
    return;
  }

  const url =
    `https://fonts.googleapis.com/css2?family=${FAMILY}:wght@${WEIGHT}` +
    `&text=${encodeURIComponent(chars.join(''))}`;

  const css = await fetchWithRetry(url, 'Google Fonts CSS');
  const cssText = await css.text();
  const fontUrl = cssText.match(/url\((https:\/\/fonts\.gstatic\.com[^)]+)\)/)?.[1];
  if (!fontUrl) throw new Error(`未能从返回的 CSS 中解析出 woff2 地址：\n${cssText.slice(0, 400)}`);

  const source = await fetchWithRetry(fontUrl, '字体下载');
  const sourceBytes = Buffer.from(await source.arrayBuffer());

  // 源字体可能是精确子集，也可能是整包（见文件头注释）。两种情况都在本地再裁一次，
  // 结果只取决于这里的字符表，不取决于 Google Fonts 那天返回了什么。
  const subset = await subsetFont(sourceBytes, chars.join(''), { targetFormat: 'woff2' });
  const bytes = Buffer.from(subset);
  validateSubset(bytes, chars.length);
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
