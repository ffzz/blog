# PRD · 个人博客「纸」

> 中英双语 · SEO 优先 · Kami 设计语言 · 近乎全免费部署
> 版本 v1.0 · 2026-08-04 · 状态：P0 / P1 / P2 / P3 已实施，P4（邮件）未开始

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
| **P2 · 阅读体验** | 代码块 Kami 主题 + TOC + 边注 + Mermaid + 暗色切换 + View Transitions | ✅ 已完成（暗色切换 / View Transitions 实为 P0 就已实现，见 §18） |
| **P3 · 站点功能** | Sveltia CMS + Cloudflare Web Analytics + Pagefind + Giscus | ✅ 已完成 |
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

---

## 18. 实施记录 · P2（2026-08-05 完成）

### 范围澄清

PRD 原定 P2 包含「暗色切换 + View Transitions」，但两者在 P0 就已经实现（`ThemeToggle.astro`、`base.css` 的原生 `@view-transition`），本轮实际交付的是代码块 Kami 主题、TOC、边注、Mermaid 四项。

### 架构级决策

**文章页新增三栏布局**（`BaseLayout` 的 `width="article"` 变体）：≥1280px 时 `<main>` 展开成 `TOC(220px) / 正文(34rem) / 边注(280px)` 的 CSS Grid，Header/Footer 单独用 `.bar` 容器保持阅读宽度不受影响；<1280px 时 `<main>` 回退成普通块级流，三个区块按 DOM 顺序自然堆叠（TOC 折叠块 → 正文 → 边注/脚注），不需要额外的响应式判断逻辑。这个设计在两个视口都做了 computed-style 级别的验证。

**代码高亮改用 Shiki `css-variables` 主题**，而不是自己维护一份配色表。所有 token 颜色（`--astro-code-token-keyword` 等）直接转发到已有的 Kami CSS 变量，暗色模式零成本继承——变量名不是猜的，是从 `@shikijs/core` 源码里实测出的完整列表（`background`/`foreground`/`token-{changed,comment,constant,deleted,function,inserted,keyword,link,parameter,punctuation,string,string-expression}`），Astro 把默认的 `--shiki-` 前缀换成了 `--astro-code-`。

**Mermaid 用 `beautiful-mermaid` 而非官方 mermaid-cli / rehype-mermaid**。官方方案都要在构建期起一个无头浏览器（Puppeteer/Playwright）驱动真实 Mermaid.js 的 DOM 依赖，Cloudflare Workers Builds 没有预装 Chromium，临时下载几百 MB 二进制既慢又违反 P0 定下的"构建期不依赖重型二进制"原则。`beautiful-mermaid` 是纯 JS 重新实现，零 DOM 依赖，且原生支持把颜色写成 `var(--xxx)` 而非硬编码 hex——直接命中 PRD §8.1 的要求。代价：不是 Mermaid.js 本体，只验证过 flowchart，其他图表类型见下方「待处理」。

**为了接入 Mermaid，从 Sätteri 切回了 `unified()` 管线**（P0 曾特意避开这一步）。区别在于：P0 的强调映射是纯 CSS 能做的事，不需要 AST 变换；Mermaid 代码块转 SVG是真正的 AST 级替换（找到 `pre > code.language-mermaid`，换成渲染后的 SVG 节点），CSS 做不到，这次引入 `@astrojs/markdown-remark` + 自写 rehype 插件（`src/lib/mermaid-rehype.ts`）是必要的，不是重新引入上次刻意避开的复杂度。

**边注选择「整体侧栏」而非逐条 Tufte 式对齐**。真正让每条脚注精确对齐到正文引用点旁边，需要持续的位置同步 JS（量每个引用的滚动位置、处理多条注释重叠）。这里改用更简单也更稳的方案：GFM 脚注区块整体作为第三栏的常驻列表出现（跟左侧 TOC 是同一种模式），用一次性 DOM 搬移实现（`Sidenotes.astro` 把 `.prose [data-footnotes]` 整体挪进 `<aside>`），不需要滚动监听。窄屏下天然回退到文末列表（原有行为不变）。这是一个记录在案的范围简化，见下方「待处理」。

### 实测发现并修复的问题

| # | 问题 | 发现方式 | 修复 |
| --- | --- | --- | --- |
| 1 | TOC 混入了 GFM 脚注自动生成的 `<h2 id="footnote-label" class="sr-only">` —— 点击会跳到一个被 sr-only 裁剪成 1px、视觉位置不确定的元素 | 代码审查 headings 数据 | 按 `slug === 'footnote-label'` 显式排除 |
| 2 | 脚注搬进 `<aside>` 后，`prose.css` 里 `.prose .footnotes` 的祖先选择器选不中了（脚注已经不是 `.prose` 的后代） | 代码审查（先于运行时发现） | 选择器去掉 `.prose` 祖先限定，改为纯 `.footnotes` |
| 3 | `beautiful-mermaid` 生成的 SVG 内嵌了一行拉取 Google Fonts "Inter" 的 `@import` —— 运行时对访客浏览器的外部网络请求，且字体也不是站内在用的那套 | 读实际 SVG 输出 | 正则剥离该行；剥离后 fallback 到 `system-ui`，与站内其余 UI 文案同源，不算劣化 |

### 实测数据

| 项 | 结果 |
| --- | --- |
| 代码高亮（明/暗） | `getComputedStyle` 精确验证：浅色 `keyword=#1b365d`/`str=#8b4513`；暗色 `keyword=#75a3d6`/`str=#c8813f`/`bg=#1e1e1c`，与 token 定义逐位匹配 ✓ |
| TOC 响应式 | ≥1280px 渲染为左侧常驻 `<nav>`；<1280px 渲染为 `<details>` 折叠块；两种视口截图/DOM 均验证 ✓ |
| 边注响应式 | ≥1280px：`main` 变 `display:grid`，脚注 `position:sticky`、无边框；<1280px：`main` 回退 `display:block`，脚注恢复文末分隔线样式，且确实排在 `<article>` 之后 ✓ |
| Mermaid（明/暗） | SVG 内 `--fg`/figure 背景色/左侧竖线色，明暗两态均与 Kami token 精确匹配；中英文样例内容均通过构建 ✓ |
| 字体预算 | 84 字符 / 16.0KB（远低于 80KB 预算），Mermaid 图表内中文文字走系统无衬线字体，不占用这个子集 |
| Lighthouse（含 P2 全部新功能的文章页，中英各一） | performance 100 / seo 100 / accessibility 100，LCP 0.9–1.1s，CLS 0 —— 三栏布局、一次性 DOM 搬移均未引入布局抖动 |
| 全站回归 | sitemap 9 条 URL 重新逐条 HTTP 验证，P1 阶段的路由体系未被 P2 改动破坏 |

### 已知环境限制（非代码缺陷）

TOC 的滚动高亮依赖 `IntersectionObserver`。这次验证时发现本地这套浏览器自动化工具（Claude Browser 面板）在本次 session 内对程序化滚动（`window.scrollTo`、`scrollIntoView`）和 `IntersectionObserver` 回调的支持不稳定——连"观察 `document.body`（保证首次立即触发）"这种最简单的场景都没能收到回调，判断是工具环境的限制，不是页面代码的问题。`rootMargin` 计算、`Map` 构建、DOM 选择器全部经过代码审查确认无误，但**未能在此环境完成真实的滚动触发验证**。

### P2 遗留 / 待处理（均已在 2026-08-05 处理，见 §19）

| # | 项 | 说明 |
| --- | --- | --- |
| 1 | TOC 滚动高亮未做真实滚动验证 | ✅ 已处理：二次尝试真实滚动验证失败（环境限制），改用人工构造 entries 直接验证回调逻辑，通过 |
| 2 | 边注是「整体侧栏」而非逐条对齐正文引用点 | ✅ 已复核：决策维持不变，见 §19 |
| 3 | `beautiful-mermaid` 只实测过 flowchart | ✅ 已验证：支持 flowchart/sequence/state/class/er；不支持 pie/gantt（见 §19，且顺带堵住了一个更严重的问题） |
| 4 | 剥离 Google Fonts `@import` 靠正则匹配字符串 | ✅ 已处理：加了防御性检查，正则失效时构建期显式报错 |
| 5 | Mermaid SVG 内的中文文字用系统无衬线字体，与标题衬线不同源 | 非缺陷，不需要处理，维持原样 |

---

## 19. 开放问题处理记录（2026-08-05）

### 意外发现：Astro 会静默吞掉渲染期错误

验证 OQ-3（Mermaid 图表类型清单）时，用一个 `beautiful-mermaid` 不支持的图表类型（`pie`）触发了 `mermaid-rehype.ts` 里的 `throw`，结果发现 **`npm run build` 依然以 exit code 0 收尾，构建日志打印"成功"**。实际检查产物才发现：那一篇文章的 `<div class="prose">` 完全是空的——标题、日期都在，正文整个消失，是一篇静默生成的"幽灵文章"。

推测是 Astro 的渲染管线按页容错（可能与 `deferRender` 一类机制有关）：一个页面渲染期抛错不会让整个构建命令失败，只会让那一页的内容变成空壳。这不是 Mermaid 专属的问题，是任何在渲染期可能抛错的 Markdown 内容都会触发的通用风险。

**修复**：新增 `scripts/verify-build.mjs`，接在 `astro build` 之后跑，扫描所有文章/随笔页面的产物 HTML，检查是否存在空的 `.prose` 容器，发现即以非零 exit code 失败并打印文件清单。已实测验证：注入坏图表 → 构建真实失败（exit=1）→ 移除后恢复（exit=0，校验通过）。这条防线和 P0 的字体覆盖检查、P1 的薄内容护栏是同一个原则——缺陷必须显式失败，不能静默放过。

### OQ-1：Mermaid 图表类型清单

直接调用 `renderMermaidSVG()` 测试了 7 种类型：

| 类型 | 结果 |
| --- | --- |
| flowchart / graph | ✓ 支持 |
| sequenceDiagram | ✓ 支持 |
| stateDiagram-v2 | ✓ 支持 |
| classDiagram | ✓ 支持 |
| erDiagram | ✓ 支持 |
| pie | ✗ 不支持，报错 `Invalid mermaid header` |
| gantt | ✗ 不支持，报错 `Invalid mermaid header` |

不支持的类型报错清晰、可捕获，不是静默乱码或崩溃——配合上面新增的 `verify-build.mjs`，作者写错图表类型时构建会明确失败并指出原始错误。

### OQ-2：TOC 滚动高亮

二次尝试真实滚动验证：换了全新的浏览器标签页、用真实鼠标滚轮（而非 JS），`computer` 的 `scroll` action 依然导致渲染面板卡死超时——同样的失败模式在 P2 和这次复核里各出现过，可以确认是这次开发环境里浏览器自动化工具的限制，不是页面代码的问题。

转而验证业务逻辑本身：直接把组件里那段 `IntersectionObserver` 回调抽出来，喂人工构造的 `entries` 数组（模拟"当前小节进入视口"），确认 `Map` 查找、`data-active` 状态赋值、CSS 高亮选择器全部正确工作（`code` 小节标记为 active 后颜色变成 `#75a3d6`，即当前主题的 brand 色）。`IntersectionObserver` 本身是高度标准化的 Web API，没有理由怀疑它在真实浏览器里不触发——业务逻辑已验证正确，缺的只是端到端的真实滚动演示，建议上线前用真实浏览器手动滚一次确认。

### OQ-3：`@import` 剥离防御性检查

原来的实现只是无条件做正则替换，如果 `beautiful-mermaid` 未来改了 `@import` 的写法，正则会静默失效而不会有任何提示。改为**检查删除后的结果**而非"这次有没有匹配到"——因为库版本升级后完全可能不再生成这行 import，那种情况下没匹配到是正常的，不该报错；真正的风险是删除后输出里仍残留 `fonts.googleapis.com` 字样，那才说明正则该更新了。用独立脚本验证了两种场景（正常格式能正确删除、格式变化时能正确报错）。

### OQ-4：边注设计复核

复核结论：维持「整体侧栏」，不改成逐条 Tufte 式对齐。理由不变（真正的位置同步需要 `ResizeObserver` + 持续重算 + 处理多条注释重叠，是一个有状态、易出错的系统），且发现 GFM 脚注默认已经生成了「↩」返回链接（点击从脚注跳回正文引用点），双向导航已经免费具备，进一步缩小了两种方案在可用性上的差距。

---

## 20. 实施记录 · P3（2026-08-05 完成）

四项站点功能全部完成：Sveltia CMS、Cloudflare Web Analytics、Pagefind 站内搜索、Giscus 评论。三项依赖真实外部账号（GitHub 仓库、Cloudflare 站点）的功能，在 `consts.ts` / `public/admin/config.yml` 里留了明确标注的 TODO 占位符，代码路径本身用临时假值完整测试过，详见下文。

### 架构决策

**第三方服务凭据集中放在 `consts.ts` 的独立区块**，跟"站点身份"类内容性 TODO 分开——空字符串 / `null` 表示未配置，对应组件（`Analytics.astro`、`Giscus.astro`）读到空值就静默跳过渲染，不产生指向不存在端点的失败请求。这个"未配置就不渲染"的模式贯穿三个组件，逐一测试过正反两条路径。

**Sveltia CMS 不用官方推荐的字段级 i18n**（同一篇文章在一个 entry 编辑器里切 tab 编辑多语言），改用六个按语言拆开的独立 collection（`posts_en`/`posts_zh`/`notes_en`/`notes_zh`/`pages_en`/`pages_zh`）。官方模式假设强制配对，跟本站"文件系统即真相，不强制配对"的架构（PRD §6）矛盾——用独立 collection 直接映射语言目录，编辑英文文章不会被要求同时填中文版。

**`public/admin/index.html` 的 CDN 脚本锁定版本号并加 SRI**，偏离官方文档建议的不带版本号写法。官方推荐不锁版本是为了免维护、自动跟新版本，但这样没法配 SRI，等于无条件信任 CDN 上"当下"的内容。后台管理入口是认证凭据经过的地方，对供应链完整性认真一点是合理取舍——代价是需要手动升级版本号并重算 hash。反过来，**Cloudflare Web Analytics 的 `beacon.min.js` 没有加 SRI**：它不是版本化分发的开源库，是 Cloudflare 自己持续维护的探针端点，加 SRI 会导致对方任何一次脚本更新都让分析静默失效——两处看似不一致的决定，实际是同一个原则（信任边界该锁在哪一层）应用到两个不同场景的结果。

**Pagefind 用 `data-pagefind-body` 全站自动排除非文章页面**，只在 `<article>` 上打一个标记，首页/about/archive/tags/admin 全部自动不参与索引，不需要额外配置排除列表。语言分离也不需要自己写：Pagefind 按每页 `<html lang>` 自动分索引，浏览器端默认只搜当前语言。

**Giscus 用两份静态 CSS 文件（浅色/暗色）+ postMessage 实现跟随站内明暗切换**，而不是像代码高亮和 Mermaid 那样直接用 CSS 变量转发。原因是 giscus 评论区是独立 iframe，跨 frame 没法用 CSS 变量共享父页面状态，只能用 giscus 官方支持的 `postMessage({giscus:{setConfig:{theme}}}, 'https://giscus.app')` 协议主动通知。`ThemeToggle.astro` 切换时新增派发一个 `kami:theme-change` 自定义事件，`Giscus.astro` 监听它——两个组件互不知道对方存在，只通过事件解耦。

### 实测发现并修复的问题

这一阶段问题密度明显集中在 Pagefind 搜索 UI（P3-3），因为它是本项目第一次真正需要"运行时动态加载一个构建期才生成、源码里完全不存在的外部模块"，撞上了 Vite 打包器一个不太为人知的边界行为：

| # | 问题 | 影响 | 修复 |
| --- | --- | --- | --- |
| 1 | **`ReferenceError: __VITE_PRELOAD__ is not defined`**，动态 import `/pagefind/pagefind.js` 在生产构建后直接崩溃 | 搜索功能完全不可用，且失败发生在 promise 链里，控制台报错但页面看起来"正常" | 根因：Vite 只要在 AST 里看到 `import()` 表达式就无条件套一层 `__vitePreload()` 预加载包装，跟参数是字面量还是变量无关；`@vite-ignore` 只影响是否报警告，不影响这层包装是否插入。目标模块构建期不存在，包装用到的依赖清单常量就没被定义。**两种常见规避写法都试过且都不行**：`@vite-ignore` 注释、路径存进变量。唯一有效的是 `new Function('path','return import(path)')`——函数体是纯字符串，Vite/Rollup 的 AST 遍历完全看不到里面的 `import()`，这层包装因此根本不会被插入 |
| 2 | **CSS scoped 选择器对 JS 动态插入的内容完全失效**，`<mark>` 高亮显示成浏览器默认的黄底黑字，标题/摘要样式全部没生效 | 搜索结果可用但视觉完全没对齐 Kami | Astro 的 scoped CSS 只处理模板渲染的元素（编译期加 `data-astro-cid-*` 属性），搜索结果列表是脚本用 `innerHTML` 运行时注入的，不会带这个属性。把命中动态内容的选择器全部改成 `:global()` |
| 3 | 加载失败后 `pagefindPromise ??= ...` 把失败的 promise 永久缓存住 | 网络抖动等原因导致首次加载失败后，用户重新点击搜索按钮也永远拿不到结果 | 加 `.catch` 在失败时把缓存清空，允许下次调用重新尝试 |
| 4 | **`.search-dialog { display: flex }` 覆盖了 `<dialog>` 未打开时浏览器默认的 `display: none`** | 搜索框在页面刚加载、根本没点开的情况下就直接显示在页面中间，挤压 Header 布局；Lighthouse 在移动端视口报触摸目标尺寸不足，accessibility 从 100 掉到 96 | 把 `display: flex` 限定到 `.search-dialog[open]`，未打开时交还浏览器默认行为 |

这四个问题全部是先用 `computed style` / DOM 结构 / Lighthouse 具体 audit 定位到真实现象，再逐层排查到根因，不是靠猜测或者社区文章直接照搬解决的——尤其是第 1 个，两种"公认有效"的社区方案（`@vite-ignore`、变量间接引用）在这个具体场景下都被实测证伪，最终方案是通过读编译产物的实际输出反推出来的。

### 实测数据

| 项 | 结果 |
| --- | --- |
| Sveltia CMS | `/admin/` 加载成功，SRI 校验通过，`config.yml` 被正确解析（登录界面正确显示 repo 占位符），三种登录方式齐全，含 PRD 要求的 PAT 认证 |
| Pagefind 索引 | `Ignoring pages without this tag` 确认只索引 3 篇文章（11 个 HTML 里排除了 8 个非文章页面）；`Discovered 2 languages: zh-cn, en-us` |
| 搜索端到端 | 输入 "Kami" → 正确返回结果 → 标题/摘要/`<mark>` 高亮全部对齐 Kami 配色（明暗两态用 computed style 精确验证，`markColor` 暗色下 = `#75a3d6` 与 `--brand` 完全一致）|
| CF Analytics | token 为空时 0 处 `cloudflareinsights` 引用；填入假 token 后正确注入 `data-cf-beacon` |
| Giscus | `GISCUS=null` 时无任何 HTML 结构泄漏（唯一残留是 Astro 编译期提取的、永远不会命中任何元素的空 CSS 规则，属框架预期行为）；填入假配置后 script 属性、`data-theme` 初始 URL、`postMessage` 协议（目标 origin、消息体格式）全部验证正确 |
| 全站回归 | sitemap 9 条 URL、`/admin/`、`/pagefind/pagefind.js`、两份 giscus 主题 CSS 全部 HTTP 200 |
| Lighthouse（四页面：首页/归档/双语文章） | performance 100 / seo 100 / accessibility 100，LCP 0.8–1.1s，CLS 0 |

### P3 遗留

- Sveltia CMS 的真实读写（拉取仓库内容、提交更改）需要用户填好 `config.yml` 里的 `repo: TODO/TODO` 之后才能测试
- Cloudflare Web Analytics 需要域名接入 Cloudflare 后才能生成真实 token
- Giscus 需要真实 GitHub 仓库开启 Discussions、走 giscus.app 官方向导拿到四个绑定值
- P4（邮件订阅：Resend Worker + double opt-in + 隐私政策页）未开始

---

## 21. 实施记录 · P4（2026-08-05 完成）

邮件订阅闭环全部完成：Cloudflare Worker（`/api/subscribe` + `/api/confirm`）、前端订阅表单、四态确认落地页、隐私政策页。依赖真实 Resend 账号的部分（API key、Segment、发信地址）留了明确标注的 TODO，Worker 的路由/校验/限流/签名/幂等逻辑全部用 `wrangler dev` 加真实 HTTP 请求跑过，不是只做了类型检查。

### 架构决策

**单一 Cloudflare Workers 项目，用 `run_worker_first: ["/api/*"]` 做选择性动态路由**，而不是维护两个独立 Cloudflare 部署（静态站点 + 一个订阅专用 Worker）。除 `/api/*` 外的每一次请求 Cloudflare 直接从 `dist/` 返回静态资源，Worker 脚本完全不会被调用——这跟 PRD §9.1 原定的"Workers static assets"部署方式是同一套基础设施，只是把 §8.4 原本设想的独立订阅 Worker 折进同一个项目，避免维护两份 wrangler 配置和两个部署流水线。

**Worker 侧确认端点 `/api/confirm`（动态）与展示页 `/subscribe/confirm/`（静态）故意分开**，不是同一个路径。Worker 验证 token 后 302 跳转到静态页并带 `?status=ok|expired|invalid|failed`，静态页只管展示文案，不碰任何密钥或校验逻辑。混用一个路径会导致 `run_worker_first` 要么把这个纯展示页也纳入 Worker 接管（无意义的额外调用），要么产生路由匹配的歧义。

**PRD §8.4 写的"Resend Audiences API"已过期**：查官方文档确认 Resend 已把 Audiences 改名 Segments（[迁移指南](https://resend.com/docs/dashboard/segments/migrating-from-audiences-to-segments)），当前接口是 `POST /contacts` 带 `segments: [{id}]`，不是文档写的 audience-nested 端点。`wrangler.jsonc` 里的变量相应命名为 `RESEND_SEGMENT_ID`。`addContact()` 没有对"联系人已存在"做特殊分支——官方错误文档没记录这个端点会返回冲突码，没有证据支持的分支不编，统一按 `res.ok` 处理，按 email 幂等 upsert 对待（工程假设，未接入真实账号前无法用真实数据验证，见下方遗留）。

**无数据库，用 HMAC 签名 token + Cloudflare KV 兜底"一次性使用"**，PRD §8.4 原文写"无需数据库"，但"token 一次性使用"这条验收标准（PRD §12 第 11 项）光靠签名验证做不到——签名只能证明"没被篡改、没过期"，证明不了"没被用过"。KV 存的是`consumed:<token>` 这一条一次性标记，TTL 对齐 token 剩余有效期，不是通用数据存储，跟"无数据库"的架构决策不矛盾。

**限流用 KV 计数器，接受非原子的读-写竞态**（`worker/kv.ts` 里的 `ponytail:` 注释已写明）：同一 IP 并发请求可能都读到同一计数值、都写回 +1，导致上限被多算一两次。个人博客的订阅表单不是高并发攻击面，用 Durable Objects 换绝对精确计数是过度设计，真被刷了再升级。

### 实测发现并修复的问题

| # | 问题 | 影响 | 修复 |
| --- | --- | --- | --- |
| 1 | **静态页读不到 URL query 参数**：`SubscribeConfirm.astro` 最初直接在组件顶层用 `Astro.url.searchParams.get('status')`，构建期渲染时这里从来没有真实请求——`astro build` 预渲染整个页面，`?status=ok` 是浏览器真实访问时才有的东西 | 无论 Worker 跳转带什么 `status` 值，四个页面渲染出来的文案永远是同一份（构建时的默认值），完全测不出订阅成功/失败的区别；浏览器实测时四种状态全部显示成同一个文案，才发现问题 | 服务端渲染只给一份安全兜底文案（无 JS 时的降级），真正的状态判断挪进 `<script>`，用 `new URLSearchParams(location.search)` 在客户端读，参照页面加载时替换标题/正文/`<title>` |
| 2 | **`Subscribe.astro` 首版用 `form.dataset.xxxLabel` 在 Astro 模板和客户端 `<script>` 之间传文案**，但模板里从没真正写过这些 `data-*` 属性 | 提交表单后状态提示区永远是空白（属性读取结果是 `undefined`），无论成功还是失败都看不到任何反馈 | 在写完但还没构建测试之前，自查代码时发现这个"属性从没被写过"的问题——改成脚本内联一份双语 `LABELS` 字典，用 `document.documentElement.lang` 选语言，不再跨 script 边界传值 |
| 3 | **`/api/confirm` 里 `markTokenConsumed` 在调用 `addContact` 之前执行**，而不是之后 | Resend 请求失败（真实场景：网络抖动、账号临时故障）时用户看到 `status=failed`，但 token 已经被标记消费；用户重新点同一个确认链接（很自然的"再试一次"操作），代码会把"已消费"误判成幂等成功，回传 `status=ok`——但 `addContact` 从来没有真正成功过，用户以为订阅上了，实际没有，且链接已经报废、没法再重试。这是 `wrangler dev` 真实跑通整个确认流程时，用自签 token 连续请求两次才发现的，光看代码或只做类型检查看不出来 | 把 `markTokenConsumed` 挪到 `addContact` 成功之后再执行；`addContact` 失败时不标记消费，token 在有效期内可以重复重试。用同一枚新签的 token 连续两次请求验证：改前第二次错误地返回 `ok`，改后第二次仍然如实返回 `failed` |

第 3 个问题是这一阶段唯一的真实逻辑 bug（不是配置或环境问题），且只有真的用 `wrangler dev` 起服务、用相同密钥签发测试 token、连续发两次请求才能复现——静态分析和类型检查都看不出"标记时机"这种跨请求的状态错误。

### 实测数据

| 项 | 结果 |
| --- | --- |
| Worker 类型检查 | `worker/tsconfig.json` 隔离于 Astro 主 `tsconfig.json`（DOM 类型 vs `@cloudflare/workers-types`），`tsc --project worker/tsconfig.json` 全量通过 |
| 构建回归 | 14 个页面（新增 `/subscribe/confirm/`、`/zh/subscribe/confirm/`、`/privacy/`、`/zh/privacy/`），`verify-build.mjs` 校验无空壳文章 |
| 订阅表单（浏览器，明暗两态） | 表单渲染、Kami 配色（羊皮纸/油墨蓝/warm-brown 错误色）明暗两态均正确；提交后 `/api/subscribe` 404（预览环境无 Worker，符合预期）时错误分支正确显示文案，无未捕获异常 |
| 确认落地页四态 × 双语 | `status=ok/expired/invalid/failed` 及缺省值（兜底为 invalid）在 en/zh 下文案、`<title>` 均正确切换，浏览器控制台无报错 |
| `wrangler dev` 静态直通 | `GET /` 200（走 `env.ASSETS`，未触发 Worker 动态逻辑之外的路径） |
| `wrangler dev` 请求校验 | 非法 JSON / 非法邮箱 / 非法 locale 均返回对应 400 错误码；合法请求因假 Resend key 返回 502 `send_failed`，原始 Resend 错误（`API key is invalid`）只进 Worker 日志、不回传给客户端 |
| `wrangler dev` 限流 | 同一 IP 连续 5 次请求放行，第 6 次返回 429 `rate_limited` |
| `wrangler dev` token 校验 | 缺失 token / 格式错误 token → `status=invalid`；用自签脚本构造的过期 token → `status=expired`；有效 token 因假 Resend key 在 `addContact` 处失败 → `status=failed`，且修复后重试仍如实返回 `failed`（不会误报 `ok`） |

### P4 遗留

- 真实 Resend 账号（API key、Segment ID、发信地址）、真实 Cloudflare KV namespace ID 均为 `wrangler.jsonc` / `worker/env.d.ts` 里标注的 TODO，需要域名与 Resend 账号就绪后才能拿到；本阶段所有 Worker 逻辑测试均用本地假值完成
- `addContact()` 对"联系人已存在"按幂等 upsert 处理是未经真实 Resend 账号验证的工程假设（官方文档未记录冲突码），接入真实账号后应实测一次重复订阅同一邮箱的行为，确认假设成立
- 国内邮箱（QQ / 163）送达率仍是 PRD §11 提到的未知数，需真实发信后验证
- Turnstile 未接入——PRD §8.4 提到"Turnstile 或速率限制"二选一，本阶段选了限流（KV 计数器），已实现；如果上线后仍被滥用，Turnstile 是备选加固手段
