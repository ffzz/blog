# 博客发布与修改指南 · 2026-08-09

> 站点已上线：**https://ben-chen.com**（评论、邮件订阅暂未开启，见文末）。
> 这份文档写给日常写文章、改站点信息、重新发布用，不涉及代码架构——架构决策看
> [PRD](2026-08-04-blog-kami-prd.md)，上线前还差什么看
> [launch-checklist](2026-08-06-launch-checklist.md)。

---

## 1. 现在是什么状态

- 站点是**纯静态**部署在 Cloudflare Workers 上，域名 `ben-chen.com` 已经绑定好。
- 站内评论、邮件订阅**都还没开**——代码都在，只是没接外部账号（Resend、GitHub Discussions）。
  不影响正常写文章和发布。
- 内容后台（Sveltia CMS，`/admin`）**还没配好**，因为它需要一个真实的 GitHub 仓库。现在唯一的
  发布方式是本地改 Markdown 文件 + 命令行部署，见下面第 3 节。
- `src/content/posts/{en,zh}/hello-kami.md` 是**占位文章**（标题 "Typography as Constraint" /
  「排版即约束」），写了自己的第一篇真文章之后记得删掉它。

---

## 2. 写一篇新文章

### 2.1 文件放在哪

技术文章放 `src/content/posts/`，随笔放 `src/content/notes/`。每种下面再按语言分：

```
src/content/posts/en/my-post-slug.md     # 英文版
src/content/posts/zh/my-post-slug.md     # 中文版
```

**规则**：文件是否存在决定这篇文章有没有对应语言版本——不强制中英各写一份。只写中文，就只建
`zh/` 下那一个文件，网站会自动只在中文页面显示它，`en` 那边的语言切换器会显示"没有这个语言版本"
而不是 404。

**slug（文件名）用英文小写连字符**，比如 `rag-chunking.md`——它会变成 URL 的一部分
（`/posts/rag-chunking/`），发布后不要改文件名，改了等于换了个新地址，之前分享出去的链接全部失效。

### 2.2 文件开头要写什么（frontmatter）

```markdown
---
title: 文章标题
description: 一句话摘要，必填——这句话会直接变成搜索结果里显示的描述，别空着。
pubDate: 2026-08-09
tags: ['ai', 'engineering']
draft: false
---

正文从这里开始，用 Markdown 写。
```

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `title` | 是 | 标题 |
| `description` | 是 | 搜索结果摘要，也是分享卡片的描述，认真写 |
| `pubDate` | 是 | 发布日期，`YYYY-MM-DD` |
| `updatedDate` | 否 | 之后大改内容才需要填，标注"更新于" |
| `tags` | 否 | 全小写连字符，如 `vector-search`，2–4 个比较合适 |
| `heroImage` | 否 | 配图路径 |
| `draft` | 否 | 设成 `true` 的文章本地预览能看到，但**不会出现在正式发布的站点上**——写一半想先保存就用这个 |

标签少于 3 篇文章时不会单独生成标签页（避免大量"薄内容"页面拖累 SEO），这是设计好的行为，
不用管。

### 2.3 正文里的 Markdown 有点特殊

这个博客的排版风格移植自 Kami 设计系统，`**加粗**` 和 `*斜体*` 被重新定义过：

- `**这样写**` → 变成强调色（不是加粗）
- `*这样写*` → 中文页面变成着重号「·」，英文页面变成真斜体
- `` `这样写` `` → 代码样式

正常按 Markdown 语法写就行，不用刻意做什么，只是显示效果跟别的博客不一样。

---

## 3. 本地预览

```bash
cd /Volumes/U-disk/Projects/blog
npm run dev
```

打开终端里提示的地址（一般是 `http://localhost:4321`），改文件保存后浏览器会自动刷新。写完
草稿在这里看是否满意，满意了再发布。

`Ctrl+C` 停止。

---

## 4. 发布上线

写完文章、改完站点信息之后，两条命令：

```bash
cd /Volumes/U-disk/Projects/blog
npm run build      # 本地构建，检查有没有错误
npm run deploy      # 发布到 Cloudflare
```

`npm run build` 如果报错，**不要跳过直接部署**——常见原因见第 7 节。`npm run build` 通过之后
`npm run deploy` 一般不会再出问题，几秒到几十秒就能跑完，跑完会打印类似这样的一行确认发布成功：

```
Uploaded personal-blog (...)
Deployed personal-blog triggers (...)
  https://personal-blog.cfangzheng.workers.dev
```

`ben-chen.com` 已经绑定到这个 Workers 项目，发布后几秒内 `https://ben-chen.com` 就是最新内容，
不需要额外操作。

### 关于 git

项目目前没有连接 GitHub 远程仓库，`npm run deploy` 直接从你电脑上的文件发布，跟 git 没有关系。
但强烈建议正常用 `git commit` 记录每次改动——这是免费的版本历史和备份，哪天改坏了可以随时退回去：

```bash
git add -A
git commit -m "发布：xxx 文章"
```

---

## 5. 改站点基本信息

### 5.1 站名、简介、作者信息

`src/consts.ts` 里的 `SITE` 和 `AUTHOR`：

```ts
export const SITE: Record<Locale, SiteIdentity> = {
  en: { name: "Ben's Blog", tagline: '...', intro: '...' },
  zh: { name: 'Ben 的博客', tagline: '...', intro: '...' },
};

export const AUTHOR: Author = {
  name: 'Ben',
  email: 'hello@ben-chen.com',
  sameAs: [],   // 想加 GitHub/X/LinkedIn 链接，往这个数组里加字符串
};
```

`tagline` 会同时出现在首页大标题、搜索结果摘要、RSS 描述里，改的时候留意别写太长。`sameAs`
留空数组时 about 页不会显示"其他链接"那一行，加了链接才会自动出现，不用改模板。

### 5.2 About 页正文

`src/content/pages/en/about.md` 和 `src/content/pages/zh/about.md`，跟写文章一样是 Markdown
文件，直接改正文即可，两个语言各自独立，不用互译。

### 5.3 隐私政策页

`src/content/pages/{en,zh}/privacy.md`——这页描述的是站点实际的数据处理行为（订阅表单收集什么、
第三方服务有哪些）。**只有引入新的数据收集行为时才需要改这页**（比如以后真的开了邮件订阅或评论），
平时不用管。

改完任何一处，都是走第 4 节的两条命令重新发布。

---

## 6. 密钥和环境变量放在哪

项目里有两个不进 git 的文件，作用不一样，别搞混：

| 文件 | 谁用 | 放什么 |
| --- | --- | --- |
| `.env.local` | 你电脑上跑 `npm run deploy` / `npm run whoami` 时，`wrangler` 命令行工具自己要用 | `CLOUDFLARE_API_TOKEN`、`CLOUDFLARE_ACCOUNT_ID`——发布权限本身 |
| `.dev.vars` | 以后真的启用邮件订阅功能时，本地测试 Worker 用 | `RESEND_API_KEY`、`TOKEN_SIGNING_SECRET`——现在这两个是假值，因为功能还没开 |

这两个文件都已经在 `.gitignore` 里，不会被提交、不会出现在 GitHub 上（即使以后接了 GitHub 仓库
也一样）。**不要把里面的内容贴到聊天记录、文档、或任何会被分享出去的地方。**

---

## 7. 常见问题排查

**`npm run build` 报字体缺字**

```
Error: 字体子集缺少 N 个字符：...
```

新写的标题（文章标题、站名等）用了还没打进字体子集的汉字。运行一次 `npm run fonts` 重新生成，
再 `npm run build`。这是设计好的守卫，不是 bug——目的是保证每次发布字体文件都尽量小。

**`npm run build` 报"空壳文章"或渲染失败**

Markdown 里可能有语法错误（比如没闭合的代码块）。看报错信息里具体是哪个文件，本地 `npm run dev`
打开那篇文章看渲染是否正常。

**`npm run deploy` 报鉴权失败**

`.env.local` 里的 `CLOUDFLARE_API_TOKEN` 可能过期了（Cloudflare 的 token 可以设置有效期）。跑
`npm run whoami` 确认，如果报错就去 Cloudflare Dashboard → My Profile → API Tokens 重新生成一个，
换掉 `.env.local` 里的值。

**改完内容，网站上没变化**

先确认真的跑过 `npm run build && npm run deploy` 且没有报错——只改文件不重新部署，线上内容不会
自动更新。其次浏览器可能缓存了旧页面，强制刷新（Cmd+Shift+R）试试。

**域名打不开**

正常情况下发布后几秒内 `https://ben-chen.com` 就能访问。如果打不开，去 Cloudflare Dashboard →
你的账号 → Workers & Pages → `personal-blog` → Settings → Domains & Routes，确认 `ben-chen.com`
状态是 Active。

---

## 8. 以后想开评论或邮件订阅

这两个功能的代码已经写好了，只是没接外部账号，不是要重新开发。具体步骤（需要注册 Resend 账号、
开 GitHub Discussions 等）按 [launch-checklist.md](2026-08-06-launch-checklist.md) 的 B3/C1–C4
一步步做，做完把 `src/consts.ts` 里的 `EMAIL_SUBSCRIBE_ENABLED` 改成 `true`、`GISCUS` 填上真实
配置，重新发布即可生效。

---

## 9. 命令速查

```bash
cd /Volumes/U-disk/Projects/blog

npm run dev          # 本地预览，改文件自动刷新
npm run build         # 本地构建校验（发布前必过）
npm run deploy         # 发布到 https://ben-chen.com
npm run whoami         # 确认 Cloudflare 登录状态
npm run fonts          # 标题用了新汉字时重新生成字体子集
```
