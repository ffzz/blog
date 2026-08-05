# PRD · 个人博客「纸」

> 中英双语 · SEO 优先 · Kami 设计语言 · 近乎全免费部署
> 版本 v1.0 · 2026-08-04 · 状态：P0 / P1 已实施

---

## 1. Context

### 为什么做

需要一个自己完全掌控的长期写作阵地。托管平台（公众号、Substack、Hashnode）的问题是域名权重归平台、SEO 受限、迁移成本高、排版受制于平台模板。

### 三个硬约束

| 约束 | 具体含义 |
| --- | --- |
| **SEO 优先** | 能被 Google 收录并在 2026 年的 AI 搜索（ChatGPT / Perplexity / AI Overview）中被引用。Core Web Vitals 不能为视觉效果让路 |
| **写作方便** | 本地 Markdown + Git 为主，同时要有网页后台随时能发 |
| **尽量免费** | 除域名外零经常性支出 |

### 设计语言

视觉参考 **[tw93/Kami](https://github.com/tw93/Kami)**（MIT 协议）—— 一套 AI 文档设计系统。它本身是为**印刷品/PDF** 设计的约束系统，本项目将其**移植到屏幕**，并补齐它没有定义的博客构件。

Kami 的核心一句话：**暖羊皮纸画布、单一油墨蓝强调、衬线承载层级、拒绝冷灰与硬投影。**

### 预期成果

自有域名下的静态双语博客。`git push` 或后台点击均可发布。Lighthouse SEO / Performance 接近满分。视觉上一眼能认出是「纸」而非又一个 Tailwind 模板站。

---

## 2. 非目标（Non-goals）

明确不做，避免范围蔓延：

- 不做多作者 / 投稿 / 权限系统
- 不做付费墙、会员、打赏
- 不做 CMS 的可视化拖拽编辑（Sveltia 是表单式 Markdown 编辑器，不是 Notion）
- 不做移动 App
- 不做 ICP 备案与国内 CDN（见 §11 已知限制）
- 不做数学公式渲染（KaTeX 已评估并明确排除）
- 不追求 Kami 的 PDF 导出能力

---

## 3. 设计语言规范（Kami 屏幕移植版）

这一节是本项目的核心差异化，实现时必须逐条对照。

### 3.1 继承自 Kami 的铁律

| # | 铁律 | 本项目落地方式 |
| --- | --- | --- |
| 1 | 底色羊皮纸 `#f5f4ed`，**永不纯白** | 浅色模式页面背景；暗色模式对应 `#141413` 暖黑 |
| 2 | 唯一强调色油墨蓝 `#1B365D`，**≤5% 版面** | 链接、着重号、标题左竖线、标签。暗色模式提亮为 `#2D5A8A` |
| 3 | 所有灰色**暖调**（R≈G>B），禁冷灰 | **暗色模式同样适用** —— 不得使用 `#1a1a1a` 类中性黑 |
| 4 | 中文：衬线标题 + 无衬线正文；英文：全衬线 | 见 §3.3 字体策略 |
| 5 | 衬线字重锁 500，**不加粗** | 见 §3.4 强调策略 |
| 6 | 行距：标题 1.1–1.3 / 密排 1.4–1.45 / 阅读 1.5–1.55 | 屏幕适配：中文阅读正文放宽至 **1.75**（Kami 的 1.55 是印刷值，屏幕上中文长文偏紧） |
| 7 | 字距：中文正文 0.02em，英文 0，小标签 +0.5–1px | 直接沿用 |
| 8 | 标签底色实色 hex，禁 rgba | 沿用（Kami 的原因是 WeasyPrint bug；本项目保留是为了视觉一致性） |
| 9 | 层次靠 ring / whisper shadow，**禁硬投影** | 卡片靠填充色浮起，不画闭合边框；加重用 `border-left: 2px solid var(--brand)` |
| 10 | 禁斜体 | 中文禁（伪斜体丑）；**英文保留 Charter 真斜体**（Kami 自己的 landing page 也破例） |

### 3.2 色板 Token

```css
/* 浅色 */
--parchment:  #f5f4ed;  /* 页面底 */
--ivory:      #faf9f5;  /* 卡片 / 代码块底 */
--warm-sand:  #e8e6dc;  /* 交互面 */
--brand:      #1B365D;  /* 唯一强调色 */
--brand-tint: #EEF2F7;  /* 最浅填充 */
--tag-bg:     #E4ECF5;  /* 标签底 */
--near-black: #141413;  /* 正文 */
--dark-warm:  #3d3d3a;  /* 次级 */
--olive:      #504e49;  /* 描述 / 图注 */
--stone:      #6b6a64;  /* 元信息 / 日期 */
--border:     #e8e6dc;
--border-soft:#e5e3d8;
--warm-brown: #8b4513;  /* Kami 唯一批准的第二色，本项目用于代码字符串 */

/* 暗色 —— 全部保持暖调 */
--parchment:  #141413;
--ivory:      #30302e;
--brand:      #2D5A8A;
--near-black: #f5f4ed;
--dark-warm:  #b8b5ab;
--stone:      #8a8880;
```

文字四级到底：near-black > dark-warm > olive > stone。**不设第五级。**

### 3.3 字体策略（决定性约束：不能拖垮 LCP）

| 语言 | 标题 | 正文 |
| --- | --- | --- |
| 中文 | 思源宋体 SC，**子集化自托管** | 系统无衬线栈（PingFang SC / Microsoft YaHei / Noto Sans SC） |
| 英文 | Charter（Bitstream Charter，开源，~100KB 自托管） | 同左 |
| 代码 | — | JetBrains Mono（子集化，仅 ASCII + 常用符号） |

**为什么中文正文不用衬线**：Kami 铁律 4 原文就是「中文：衬线标题 + 无衬线正文」。这既符合规范，又让正文字体成本归零。

**为什么不用仓耳今楷 02**（Kami 的中文指定字体）：① 不在仓耳的 22 款免费商用清单内，官方标注仅供个人学习参考；② 中文字库切分为 webfont 部署到服务器供下载，在多数中文字库协议中属于「嵌入/分发」，需单独授权。**授权风险不可接受。**

**标题字体预算硬上限：单页新增字体请求 ≤ 80KB。** 实现方式：构建期扫描所有标题实际用到的字符，生成最小子集。

> **实施更新（P0）**：英文衬线最终未自托管，走系统栈（macOS 有 Charter、Windows 有 Georgia）。详见 §16。

### 3.4 强调策略（Markdown 语法映射）

Kami 不许加粗、不许斜体，但 Markdown 的 `**` 和 `*` 必须有归宿：

| Markdown | 中文渲染 | 英文渲染 |
| --- | --- | --- |
| `**强调**` | 油墨蓝文字，**字重不变** | 同左 |
| `*着重*` | `text-emphasis: filled dot var(--brand)` 着重号 | Charter 真斜体 |
| `` `代码` `` | JetBrains Mono + `--brand-tint` 底 | 同左 |

中文着重号是印刷传统的正统强调方式，CSS 原生支持。这是本站最具辨识度的排版特征。

### 3.5 代码块

Kami 原规范是「单色」，技术博客不可接受。本项目自写一份 Shiki 主题，**全部色值落在 Kami 调色板内**：

| Token | 色值 | 来源 |
| --- | --- | --- |
| 关键字 / 控制流 | `#1B365D` | brand |
| 字符串 / 数字 | `#8b4513` | Kami 唯一批准的第二色 |
| 注释 | `#6b6a64` | stone |
| 类型 / 类名 | `#504e49` | olive |
| 函数名 | `#3d3d3a` | dark-warm |
| 其余 | `#141413` | near-black |

底色 `--ivory`，左侧 `2px solid var(--brand)` 竖线，**无闭合边框**（Kami 的卡片规则：填充色即浮起，闭合边框 + 圆角会渲染成双环）。暗色模式需一套对应映射。

### 3.6 动效

Kami 无动效规范（印刷系统）。本项目定义为**极克制**：

- 页面切换：Astro 原生 View Transitions
- 链接下划线：`transition: 150ms`
- **无入场动画、无 stagger、无视差** —— 与 CLS 目标直接冲突
- 全部动效包裹 `@media (prefers-reduced-motion: reduce)`

> **实施更新（P0）**：页面切换最终未用 Astro `<ClientRouter />`，改用原生 CSS `@view-transition`。详见 §16。

---

## 4. 信息架构

### 4.1 内容分型

技术为主 + 随笔混写，**URL 路径分离**，让 Google 看到主题聚类：

| 类型 | 路径 | 说明 |
| --- | --- | --- |
| 技术文章 | `/posts/[slug]` | 主力内容，承担 SEO 流量 |
| 随笔 | `/notes/[slug]` | 建立个人连接，不承担关键词任务 |

### 4.2 页面清单

| 路径 | 说明 |
| --- | --- |
| `/` | 一句身份 + 混合文章列表（技术与随笔带类型标记） |
| `/posts/[slug]` · `/notes/[slug]` | 文章详情 |
| `/archive` | 按年份倒序的全量清单，一页看完 |
| `/tags/[tag]` | 标签聚合（**见下方薄内容护栏**） |
| `/about` | 个人介绍 + 联系方式，承载 `Person` 结构化数据 |
| `/privacy` | 隐私政策（邮件订阅收集邮箱触发的合规要求） |
| `/subscribe/confirm` | 邮件双重确认落地页 |
| `/404` | |
| `/rss.xml` | 每 locale 一个 |
| `/llms.txt` · `/llms-full.txt` | AI 爬虫索引 |
| `/robots.txt` · `/sitemap-index.xml` | |
| `/admin` | Sveltia CMS 后台（`noindex`） |

**路由层面**每个页面都有 `/zh/` 前缀镜像（英文为默认 locale 走根路径）。但**具体某篇文章是否存在中文版，取决于文件是否存在**（见 §6）。

**薄内容护栏**：标签下少于 **3 篇**文章时不生成独立页面，该标签仅在文章底部作纯文本展示。防止 Google 判定站点存在大量薄内容页。

### 4.3 URL 规则

- 英文默认 locale，无前缀：`/posts/rag-chunking/`
- 中文加前缀：`/zh/posts/rag-chunking/`
- **slug 一律用英文**（中文 URL 会被百分号编码，不利分享与外链）
- `x-default` 指向英文
- 上线后 URL 结构冻结

---

## 5. 内容模型

### 5.1 目录结构

```
src/content/
├── posts/
│   ├── en/rag-chunking.md
│   └── zh/rag-chunking.md      # 同名 slug = 互为翻译
└── notes/
    └── zh/on-writing.md         # 只有中文，就只有中文
```

**文件系统即真相。** 不设 `translationKey` 字段 —— 某语言目录下存在同名文件即视为该语言版本存在，否则不存在。

### 5.2 Frontmatter Schema

```ts
{
  title: string
  description: string          // 必填，直接作 meta description
  pubDate: Date
  updatedDate?: Date           // JSON-LD dateModified
  tags: string[]
  heroImage?: string
  draft: boolean               // 默认 false
}
```

`description` 强制必填 —— 缺失 meta description 是最常见的 SEO 失分点。

### 5.3 标签规范

- 全小写，连字符分词：`vector-search`、`prompt-engineering`
- 技术标签与随笔标签**不混用**
- 每篇 2–4 个，超过 4 个视为标签滥用
- 标签的显示名（中英文）集中在一张映射表中维护，不散落在 frontmatter

---

## 6. 双语策略

**不强制一一对应。** 中英文各写各的，配对靠同名 slug。

这意味着 `@astrojs/sitemap` 的 `i18n` 选项**不能直接使用**（它假设每个 locale 下页面都存在，会向 Google 上报不存在的 URL）。需自写三处：

| 处 | 要求 |
| --- | --- |
| **hreflang**（`<head>`） | 只输出实际存在的 locale，**必须包含自引用**（漏掉自引用 Google 会忽略整组标签） |
| **sitemap** | 用 `serialize` 钩子按实际存在情况输出 `xhtml:link` alternate |
| **RSS** | 每 locale 一个 feed，只含该 locale 实际存在的文章，不做 fallback |

核心是一个工具函数 `getAvailableLocales(collection, slug): Locale[]`，上述三处共用。

**语言切换器**：目标语言不存在时**禁用并给出说明**，绝不能跳到 404。

---

## 7. SEO 规范

### 7.1 每页必备

- `<link rel="canonical">` 绝对 URL
- hreflang 组（含自引用 + `x-default`）
- OG / Twitter Card
- JSON-LD：文章页 `BlogPosting`（含 `inLanguage` / `datePublished` / `dateModified` / `author`）+ `BreadcrumbList`；`/about` 页 `Person`

### 7.2 AI 搜索可见性

2026 年 AI 引用正在成为主要发现渠道，这部分不是可选项：

- `/llms.txt` 索引 + `/llms-full.txt` 全文，从 Content Collections 自动生成，零维护
- `robots.txt` **显式允许** `GPTBot` / `ClaudeBot` / `PerplexityBot` / `Google-Extended`
- RSS 全文输出（不做摘要截断）

### 7.3 OG 图

构建期用 `astro-og-canvas` 自动生成，配色与字体使用 Kami token —— 分享卡片必须与站点同一视觉语言。

### 7.4 性能预算（硬指标）

| 指标 | 目标 |
| --- | --- |
| Lighthouse SEO | 100 |
| Lighthouse Performance | ≥ 95 |
| LCP | < 1.5s |
| CLS | < 0.05 |
| 单页新增字体 | ≤ 80KB |
| 单页 JS | ≤ 30KB（Pagefind 按需懒加载不计入） |

### 7.5 上线后收录

1. Google Search Console 提交 sitemap
2. Bing Webmaster Tools（其索引直接供给 ChatGPT 搜索）
3. 百度站长平台
4. Rich Results Test 验证 JSON-LD；hreflang 检查工具验证语言标签

---

## 8. 功能规格

### 8.1 阅读组件

| 组件 | 规格 |
| --- | --- |
| **目录 TOC** | 桌面端左侧浮动 + 当前位置高亮；移动端降级为顶部可折叠块 |
| **脚注 / 边注** | ≥1280px 时显示在右侧边栏；窄屏降级为底部脚注。**锚点跳转必须处理吸顶导航的滚动偏移**（`scroll-margin-top`），否则跳过去标题被遮挡 |
| **Mermaid** | 构建期渲染为 SVG，不上运行时。需自写 Kami 主题（默认主题是彩色的，直接破铁律 2）。**SVG 内的颜色必须引用 CSS 变量而非硬编码 hex**，否则暗色模式下无法切换 |

### 8.2 评论 — Giscus

基于 GitHub Discussions，零后端。主题需自定义以匹配 Kami 配色（Giscus 支持自定义 CSS URL）。

**已知风险**（已与你确认并接受）：读者需 GitHub 账号，对中文非技术读者是硬门槛；新博客通常零评论，空评论区反而显冷清。

### 8.3 站内搜索 — Pagefind

构建期生成索引，纯静态零后端，对中文分词有专门支持。索引脚本挂在 `astro build` 之后。UI 需重写以匹配 Kami 视觉（默认 UI 是通用蓝）。

### 8.4 邮件订阅 — Resend + Cloudflare Worker

**为什么不用 Buttondown**：免费层仅 100 订阅者；Resend 免费层给到 1,000 联系人，且邮件完全在自有域名下，无第三方品牌。

**流程**：

1. 订阅表单 POST → Cloudflare Worker `/api/subscribe`
2. Worker 用密钥签名生成确认 token（**无需数据库**，token 自带过期时间）
3. 通过 Resend 发送确认邮件
4. 用户点击确认链接 → `/subscribe/confirm` → Worker 验签 → 调用 Resend Audiences API 加入联系人
5. 退订：直接用 Resend Audiences 内置的 `{{{RESEND_UNSUBSCRIBE_URL}}}`
6. 发送：新文章发布后手动触发 Broadcast

**必须实现的防护**：Turnstile 或速率限制（防表单被刷爆日配额）、邮箱格式校验、token 一次性使用。

**已知限制**：Resend 免费层每天 100 封。各方资料对「Broadcast 是否计入该配额」说法不一。**触发条件**：订阅者超过 80 人时，实测一次并按结果决定分批发送或升级。

### 8.5 访问统计 — Cloudflare Web Analytics

免费、无 cookie、无需 GDPR 横幅、一行脚本。

### 8.6 内容后台 — Sveltia CMS

- `public/admin/index.html`：一个 script 标签，零 npm 依赖
- `public/admin/config.yml`：collections 字段需与 Content Collections schema **逐字段对齐**
- 认证：GitHub Personal Access Token（仅需 `repo` scope），浏览器登录时输入，**绝不进仓库**
- i18n：`structure: multiple_folders`，locales `[en, zh]`
- 页面需 `noindex`

---

## 9. 技术架构

### 9.1 选型

| 层 | 选择 | 理由 |
| --- | --- | --- |
| 框架 | **Astro 6**（静态输出） | 默认零 JS，Core Web Vitals 天然占优；原生 i18n；Content Collections 类型安全 |
| 部署 | **Cloudflare Workers**（static assets） | Cloudflare 已将 Pages 转入维护模式，官方推荐新项目直接用 Workers。免费层无限带宽、静态请求免费、**允许商业用途** |
| CMS | **Sveltia CMS** | Git-based，单一数据源；i18n 是一等公民（Keystatic 明确不支持本地化） |
| 代码高亮 | Shiki（Astro 内置）+ 自写 Kami 主题 | |
| 邮件 | Resend + Worker | |
| 域名 | Cloudflare Registrar | 按成本价，无溢价无首年陷阱 |

**为什么不是 Vercel**：Hobby 免费层禁止商业用途，且超出 100GB 流量后站点暂停到下月；Cloudflare 超额继续服务。

> **实施更新（P0）**：Astro 版本实为 7.1.6。详见 §16。

### 9.2 目录结构

```
blog/
├── astro.config.mjs
├── wrangler.jsonc
├── worker/subscribe.ts            # 邮件订阅 Worker
├── src/
│   ├── consts.ts                  # ← 站点身份常量（需要你写）
│   ├── content.config.ts
│   ├── styles/
│   │   ├── tokens.css             # Kami 色板 / 字号 / 间距，明暗两套
│   │   └── prose.css              # Markdown 正文排版
│   ├── lib/
│   │   ├── i18n.ts                # getAvailableLocales 等
│   │   └── shiki-kami-theme.ts
│   ├── components/
│   │   ├── BaseHead.astro         # canonical + hreflang + OG + JSON-LD
│   │   ├── TableOfContents.astro
│   │   ├── Sidenote.astro
│   │   ├── LangSwitch.astro
│   │   └── ThemeToggle.astro
│   ├── layouts/
│   └── pages/
│       ├── (英文默认，根路径)
│       └── zh/  (中文镜像)
└── public/
    ├── fonts/                     # Charter + 思源宋体子集 + JetBrains Mono 子集
    ├── robots.txt
    └── admin/                     # Sveltia CMS
```

### 9.3 部署

- Cloudflare Dashboard → Workers → Connect to Git
- Build 命令：`npm run build && npx pagefind --site dist`
- 绑定自定义域名（域名在 Cloudflare Registrar 则零配置）
- 此后 `git push` 自动部署
- Worker 密钥（`RESEND_API_KEY`、`TOKEN_SIGNING_SECRET`）用 Wrangler secrets，**绝不进仓库**

---

## 10. 需要你决定的开放项

| # | 项 | 状态 |
| --- | --- | --- |
| 1 | **域名** | 未定，PRD 中统一写作 `{{SITE_ORIGIN}}`。开发不阻塞，上线前必须定。**上线后不可更改**（会丢权重） |
| 2 | **`src/consts.ts` 站点身份** | 需要你写，见下 |
| 3 | 仓库路径 | 默认 `/Volumes/U-disk/Projects/blog`，与当前 RAG 项目完全隔离 |

### 关于 `src/consts.ts`

我会创建文件、写好类型定义和注释，留 TODO。**这 10 行左右的常量定义了整站的 SEO 门面** —— 站名、中英双语 tagline、作者身份、默认描述。这些是搜索结果里读者第一眼看到的文字，也是 JSON-LD `Person` 实体的内容。我可以填占位符，但它们是你的自我表达和定位，我写出来的一定是通用的空话。

要考虑的权衡：

- **站点名**走品牌型（好记但无关键词）还是关键词型（SEO 直接但显功利）
- **双语 tagline** 直译还是各自本地化（中英读者表达习惯差异很大，直译往往两边都不讨好）
- **`Person` 实体的 `sameAs`** 链到 GitHub / X / LinkedIn 会显著增强 Google 对你的实体识别，但也是一次公开的身份聚合 —— 这是隐私与 SEO 的真实取舍

---

## 11. 已知限制

### 国内访问速度：没有免费解法

Cloudflare 在中国大陆访问不稳定（TTFB 约 1–3s，偶发不通）。**任何免费海外方案在国内都一样。** 真正的国内加速需要 ICP 备案 + 国内 CDN，既不免费也不快。

**策略**：先上线，接受国内一般速度。等 Search Console 显示确实有可观国内流量，再考虑备案 + 国内 CDN 做二次分发。不为还没有读者的博客提前备案。

### 邮件送达率

Resend 对 Gmail / Outlook 送达正常。**国内邮箱（QQ / 163）的送达率是未知数**，需上线后实测。

### Sveltia CMS 仍在 beta

单分支写入，per-post 分支的 Editorial Workflow 仍在计划中。单人博客场景影响可忽略。

---

## 12. 验收标准

### 构建期

```bash
npm run build
npm run preview
```

### 逐项验证（用浏览器实际跑，不靠推断）

| # | 项 | 判据 |
| --- | --- | --- |
| 1 | hreflang | 任选一篇单语随笔，`<head>` 中**不得**出现指向不存在语言的 alternate；双语文章必须含自引用 |
| 2 | sitemap | `/sitemap-index.xml` 可达；随机抽查 5 条 URL 全部返回 200，无 404 |
| 3 | RSS | `/rss.xml` 只含英文、`/zh/rss.xml` 只含中文，无 fallback 串味 |
| 4 | JSON-LD | Rich Results Test 通过，`BlogPosting` 与 `Person` 均被识别 |
| 5 | 语言切换器 | 单语文章上处于禁用态且有说明，**点击不产生 404** |
| 6 | 边注锚点 | 点击脚注跳转后，目标标题**不被吸顶导航遮挡** |
| 7 | 暗色模式 | 所有灰色仍为暖调（R≥G>B），无中性黑；代码块、Mermaid、Giscus 三处均正确切换 |
| 8 | 强调渲染 | 中文 `*文字*` 显示着重号而非伪斜体；`**文字**` 为油墨蓝且**字重未变** |
| 9 | 性能 | Lighthouse SEO=100，Performance≥95，CLS<0.05 |
| 10 | 字体预算 | DevTools Network 面板确认单页字体请求 ≤80KB |
| 11 | 邮件订阅 | 完整走一遍：订阅 → 收确认信 → 点确认 → 出现在 Resend Audiences → 点退订 → 移除 |
| 12 | 薄内容护栏 | 构造一个只有 2 篇文章的标签，确认**未生成**独立页面 |
| 13 | CMS | `/admin` 能加载、能看到 en/zh 双栏、能提交并触发部署 |
| 14 | 无障碍 | 键盘可完整导航；`prefers-reduced-motion` 下动效消失 |

---

## 13. 分期交付

| 阶段 | 内容 | 完成即可上线 |
| --- | --- | --- |
| **P0 · 骨架** | Astro + i18n 路由 + Content Collections + Kami tokens（明暗两套）+ 字体子集 + 首页 / 文章页 / about / 404 | ✅ 已完成 |
| **P1 · SEO 闭环** | 自写 hreflang / sitemap / RSS + JSON-LD + OG 图 + llms.txt + robots.txt + 归档页 + 标签页（含护栏） | ✅ 已完成，建议在此上线 |
| **P2 · 阅读体验** | 代码块 Kami 主题 + TOC + 边注 + Mermaid + 暗色切换 + View Transitions | |
| **P3 · 站点功能** | Sveltia CMS + Cloudflare Web Analytics + Pagefind + Giscus | |
| **P4 · 邮件** | Resend Worker + double opt-in + 隐私政策页 | |

**建议 P1 完成即上线并提交 Search Console** —— 搜索引擎信任度需要时间累积，越早开始越好，P2–P4 可以在有流量的情况下迭代。

---

## 14. 成本

| 项 | 费用 |
| --- | --- |
| 域名（Cloudflare Registrar，.com） | **~$10 / 年** |
| Cloudflare Workers 托管 | $0（无限带宽、静态请求免费） |
| Resend（≤1,000 联系人） | $0 |
| Giscus / Pagefind / Sveltia CMS / CF Analytics | $0 |
| **合计** | **~$10 / 年** |

---

## 15. 后续触发条件

不做，但记录触发条件，避免以后重新论证：

| 项 | 触发条件 |
| --- | --- |
| ICP 备案 + 国内 CDN | Search Console 显示国内流量占比 >20% |
| Resend 升级或分批发送 | 订阅者 >80 人 |
| 邮件迁移至自托管（Listmonk + SES） | 订阅者 >1,000 人 |
| 文章分页 | 单页文章数 >40 篇 |
| 系列 / 专栏功能 | 出现 ≥3 篇的成体系连载 |
| 图片 CDN / 响应式图片 | 出现大量高分辨率配图，且 LCP 退化到 >2s |

---

## 16. 实施记录 · P0（2026-08-04 完成）

仓库：`/Volumes/U-disk/Projects/blog`。8 个页面构建通过，产物 100KB。

### 相对 PRD 的偏离（均为实测后的改进，非妥协）

| # | PRD 原定 | 实际 | 原因 |
| --- | --- | --- | --- |
| 1 | Astro 6 | **Astro 7.1.6** | 当前版本。i18n 与 Content Collections API 无变化 |
| 2 | remark/rehype 插件做强调映射 | **纯 CSS，零插件** | Astro 7 默认 Markdown 管线换成 Sätteri，remark/rehype 需额外装包并切回 unified。而强调重映射本就是 CSS 能做的：`strong{font-weight:inherit;color:var(--brand)}` + `em{text-emphasis:dot}`，中英差异用 `:lang()` 分流 |
| 3 | Astro `<ClientRouter />` 做页面切换 | **原生 CSS `@view-transition`** | ClientRouter 是约 9KB 运行时 JS。原生跨文档 view transition 零 JS，不支持的浏览器自动退化 |
| 4 | 自托管 Charter（约 100KB） | **不自托管，走系统栈** | macOS 自带 Charter，Windows 有 Georgia，均为正经衬线。省下 100KB 与一套构建步骤 |
| 5 | 思源宋体子集「构建期扫描生成」 | **手动生成 + 构建期覆盖校验** | 子集经 Google Fonts `text=` 参数服务端生成后**提交进仓库**，构建只做覆盖校验。避免 CI 联网、避免 Python fontTools（Cloudflare Workers Builds 只跑 Node）、避免 86MB 的 @fontsource 依赖 |
| 6 | — | **新增 `pages` collection** | `/about` 与 P4 的 `/privacy` 是作者撰写的内容，做成 collection 后接入 CMS 时可在后台编辑，否则它们会是全站唯一改不了的页面 |

### 实测数据

| 项 | 结果 |
| --- | --- |
| hreflang（单语随笔） | 仅 `zh-CN` 自引用，**无**指向不存在英文版的 alternate，**无** x-default ✓ |
| hreflang（双语文章） | `en-US` + `zh-CN` + `x-default`，含自引用 ✓ |
| 语言切换器（单语页） | 渲染为禁用 `<span>` 而非会 404 的 `<a>` ✓ |
| `**粗体**` | `font-weight: 400`（继承正文，非 bolder），色 `var(--brand)` ✓ |
| `*斜体*` 中文 | `font-style: normal`，`text-emphasis: dot under`，色 `var(--brand)` ✓ |
| `*斜体*` 英文 | `font-style: italic`，Charter 真斜体，无着重号 ✓ |
| 暖调审计 | 9/9 token 满足 R≥G>B，明暗两模式**零违规** ✓ |
| 字体预算 | 中文页 6.0KB / 80KB；**英文页 0KB**（unicode-range 使其完全不下载）✓ |
| JS 预算 | 0.3KB / 30KB ✓ |
| 行距 / 字距 | 29.75px ÷ 17px = 1.75；0.34px = 0.02em ✓ |

### 已验证的守卫

`npm run build` 前置 `fonts:check`。注入含罕见字（饕餮纹鼎彝）的标题后构建**确实失败**并列出 5 个缺字，移除后恢复 —— 守卫本身经过测试，不是摆设。

### P0 遗留

- `/rss.xml` 的 `<link>` 与页脚链接已存在但目标文件在 P1 才生成，当前会 404
- `src/consts.ts`、`src/content/pages/{en,zh}/about.md` 是 TODO 占位符，等你填
- `src/site-origin.mjs` 仍是 `https://example.com`

---

## 17. 实施记录 · P1（2026-08-05 完成）

10 个页面 + 8 张 OG 图，全部由构建脚本自动生成。新增依赖：`@astrojs/rss`、`markdown-it` + `sanitize-html`（RSS 全文渲染）、`astro-og-canvas` + `wawoff2`（OG 图）。

### 新增能力

- `/archive`：按年份倒序的全量列表
- `/tags/[tag]`：标签聚合页，**薄内容护栏**（少于 3 篇不生成页面）已用探针文件双向验证（2 篇不生成、满 3 篇生成）
- `/sitemap-index.xml`：自写，尊重「不强制一一对应」——只为实际存在的语言输出 alternate
- `/rss.xml` · `/zh/rss.xml`：全文输出，`markdown-it` 渲染正文为 HTML
- JSON-LD：文章页 `BlogPosting` + `BreadcrumbList`，`/about` 页 `Person`，首页 `WebSite`
- OG 图：构建期用 `astro-og-canvas` 渲染，配色（羊皮纸底、油墨蓝左侧竖线）与字体（中文子集 + PT Serif 拉丁）对齐 Kami token
- `/llms.txt` · `/llms-full.txt`：从 Content Collections 自动生成，零维护
- `/robots.txt`：显式允许 GPTBot / ClaudeBot / PerplexityBot / Google-Extended，禁止 `/admin`

### 实测发现并修复的问题

这些都是构建通过、看起来能跑，但实际输出有缺陷的情况 —— 全部通过读取真实产物（HTML / XML / PNG 像素）而非只看构建日志发现：

| # | 问题 | 发现方式 | 修复 |
| --- | --- | --- | --- |
| 1 | `BreadcrumbList` 第二级指向 `/posts`，站内根本没有这个索引页 | 代码审查 | 改指向真实存在的 `/archive` |
| 2 | 中文页面的 RSS `<link>` 标签之前误指向英文 `rss.xml` | 抓 HTML 比对 | 按 locale 分流 |
| 3 | OG 图 URL 变成 `.png.png` 双后缀 | 读构建日志 | 端点文件名去掉多余的 `.png`（库自己会拼） |
| 4 | OG 图字体家族名猜成 `Noto Serif SC Subset`，实际内嵌名是 `Noto Serif SC Medium` | 直接用 CanvasKit 探测真实值，不猜 | 按探测结果改 `families` |
| 5 | **中文句号「。」等 CJK 标点在 OG 图里渲染成豆腐块** | 读取生成的 PNG 像素，肉眼发现 | 字符收集范围扩到 CJK 标点区（U+3000–303F）与全角区（U+FF00–FFEF），此前只收了汉字本身 |
| 6 | `llms.txt` 标题和摘要之间的空行被 `filter(Boolean)` 意外吞掉 | 读取生成的 txt 文件 | 分离「块级过滤」与「块内空行」，只丢弃真正空的块 |
| 7 | `llms.txt` 里 `rss.xml` / `llms-full.txt` 的链接带了错误的尾斜杠（`rss.xml/`），会 404 | 逐条请求验证链接可达性 | 新增 `absoluteFileUrl()`，与页面路由用的 `absoluteUrl()`（会加尾斜杠）分开 |
| 8 | **暗色模式油墨蓝对暗色羊皮纸只有 2.58:1 对比度，不过 WCAG AA** | Lighthouse accessibility 评分从 100 掉到 95，读取具体 audit 定位 | 同色相提亮到 `#5b8fc7`；随后发现同一色值对标签背景 `--tag-bg` 只有 3.82:1，再提亮到 `#75a3d6`（对 parchment 6.99:1，对 tag-bg 4.92:1，两处都过） |

第 8 项是 Kami 自己定义的暗色规范（Ink Light `#2D5A8A`）里带出来的缺陷，不是这次移植引入的——只是移植到网页语境、用真实工具测过对比度后才暴露出来。

### 实测数据

| 项 | 结果 |
| --- | --- |
| sitemap | 9 条 URL，全部真实存在；单语随笔无虚假 alternate ✓ |
| RSS | `rss.xml` 1 篇（仅英文）、`zh/rss.xml` 2 篇（仅中文），全文 HTML 正确转义 ✓ |
| JSON-LD | `BlogPosting` / `BreadcrumbList` / `Person` / `WebSite` 均结构正确，链接全部可达 ✓ |
| OG 图 | 8 张全部生成，人工读取像素确认无豆腐块、配色符合 Kami token ✓ |
| llms.txt | 全部链接逐条 HTTP 验证可达，无 404 ✓ |
| Lighthouse（首页） | performance 100 / seo 100 / accessibility 100，LCP 0.9s，CLS 0 |
| Lighthouse（中文文章页） | performance 100 / seo 100 / accessibility 100，LCP 1.1s，CLS 0 |
| Lighthouse（归档页 / 单语随笔页） | 同上全 100 |

四个代表性页面型（首页、归档页、双语文章、单语随笔）跑完 Lighthouse 全部三项满分，覆盖了 P0+P1 的主要渲染路径。

### P1 遗留

- 代码高亮仍是纯色（P2 范围，Kami 主题的 Shiki 配色）
- `consts.ts`、`about.md`、`site-origin.mjs` 仍是 P0 就存在的 TODO 占位符，不影响 P1 功能正确性，但影响所有 JSON-LD/OG 图/llms.txt 里显示的实际文案
- 邮件订阅、CMS、评论、站内搜索均为 P3/P4 范围，未开始
