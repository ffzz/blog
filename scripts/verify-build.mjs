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

import { SITE_ORIGIN } from '../src/site-origin.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');

// 所有 .html 而不只是 index.html —— 404.html 直接躺在 dist 根下，
// 只收 index.html 会把它整个漏掉，而它恰恰是最容易出死链的一页
// （静态托管只有一份 404，它要同时服务两种语言）。
async function* walk(dir) {
  if (!existsSync(dir)) return;
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.name.endsWith('.html')) yield p;
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

/*
 * security.txt 的有效期守卫。
 *
 * RFC 9116 要求 Expires 必填且不超过一年。过期后这个文件在规范意义上
 * 就失效了，但没有任何东西会报错 —— 跟上面那个"幽灵文章"是同一类静默
 * 失败，所以用同一个办法处理：让它在构建期显式炸掉。
 *
 * 顺带确认文件真的进了产物：它在 public/.well-known/ 这个点开头的目录里，
 * 万一哪天构建工具的复制行为变了（点目录被跳过是很常见的默认行为），
 * 线上就是个 404，而没人会注意到。
 */
const SECURITY_TXT = join(DIST, '.well-known', 'security.txt');
const RENEW_WINDOW_DAYS = 30;

if (!existsSync(SECURITY_TXT)) {
  console.error(
    '\n✗ dist/.well-known/security.txt 不存在。\n' +
      '源文件在 public/.well-known/security.txt —— 如果它还在，' +
      '说明构建时没有把点开头的目录复制进产物。\n',
  );
  process.exit(1);
}

const expiresLine = (await readFile(SECURITY_TXT, 'utf8'))
  .split('\n')
  .find((l) => l.toLowerCase().startsWith('expires:'));
const expiresAt = expiresLine && new Date(expiresLine.slice('expires:'.length).trim());

if (!expiresAt || Number.isNaN(expiresAt.valueOf())) {
  console.error('\n✗ security.txt 里缺少可解析的 Expires 字段（RFC 9116 要求必填）。\n');
  process.exit(1);
}

const daysLeft = Math.floor((expiresAt - Date.now()) / 86_400_000);
if (daysLeft < RENEW_WINDOW_DAYS) {
  console.error(
    `\n✗ security.txt ${daysLeft < 0 ? `已过期 ${-daysLeft} 天` : `还有 ${daysLeft} 天过期`}。\n` +
      '去 public/.well-known/security.txt 把 Expires 往后推一年即可，没有别的步骤。\n',
  );
  process.exit(1);
}

console.log(`✓ security.txt 有效，${daysLeft} 天后过期。`);

/*
 * 站内死链守卫。
 *
 * 2026-08-18 GSC 报告里的 "Not found (404)" 追到源头是 /zh/404/：静态托管
 * 只有一份 404.html，它却拿着 alternates=['en','zh'] 渲染，于是 hreflang 和
 * 语言切换器都指向了一个根本不存在的页面。LangSwitch 里明明写了"目标语言不
 * 存在就渲染禁用文本"的防御 —— 防御是对的，调用方没传对。这类 bug 在 review
 * 里几乎看不见，但在构建产物上是完全静态可判定的。
 *
 * 不查的话，代价是等 Googlebot 抓到、再等一周报告出来才知道。所以和上面两段
 * 一样：让它在构建期显式炸掉。
 */
const IGNORED_HREF = /^(#|mailto:|tel:|data:|javascript:)/;

/** 一个站内路径在 dist 里可能对应的文件。命中任意一个就算存在。 */
function candidates(pathname) {
  const clean = pathname.replace(/^\/+/, '').replace(/\/+$/, '');
  if (clean === '') return [join(DIST, 'index.html')];
  // 有扩展名的按原样找（/rss.xml、/llms.txt）；没有的既可能是目录页
  // （/about/ → about/index.html）也可能是平铺文件（/404/ → 404.html）,
  // 因为 Cloudflare 的 auto-trailing-slash 两种都能服务。
  if (/\.[a-z0-9]+$/i.test(clean)) return [join(DIST, clean)];
  return [join(DIST, clean, 'index.html'), join(DIST, `${clean}.html`)];
}

const HREF = /(?:href|src)="([^"]*)"/g;
const deadLinks = [];

for await (const file of walk(DIST)) {
  const html = await readFile(file, 'utf8');
  const seen = new Set();
  for (const [, raw] of html.matchAll(HREF)) {
    // 内联脚本里的模板串（搜索结果用的 href="${t.url}"）不是真链接。
    if (!raw || raw.includes('${') || IGNORED_HREF.test(raw)) continue;

    let pathname;
    if (raw.startsWith('/')) {
      pathname = raw;
    } else if (raw.startsWith(SITE_ORIGIN)) {
      pathname = raw.slice(SITE_ORIGIN.length) || '/';
    } else {
      continue; // 站外链接不归这里管
    }
    pathname = pathname.split(/[?#]/)[0];
    if (seen.has(pathname)) continue;
    seen.add(pathname);

    if (!candidates(pathname).some(existsSync)) {
      deadLinks.push({ file: file.replace(`${DIST}/`, ''), href: raw });
    }
  }
}

if (deadLinks.length > 0) {
  console.error(
    `\n✗ 发现 ${deadLinks.length} 条指向不存在页面的站内链接：\n` +
      deadLinks.map(({ file, href }) => `  - ${file} → ${href}`).join('\n') +
      '\n\n每一条都会变成 Googlebot 抓到的一个 404，白白吃掉抓取预算。\n' +
      '常见原因：给 BaseLayout 传了默认的 alternates（两种语言全集），' +
      '但该页面实际只有一种语言版本 —— 显式传 alternates={[...]} 即可。\n',
  );
  process.exit(1);
}

console.log('✓ 站内链接全部指向存在的页面。');
