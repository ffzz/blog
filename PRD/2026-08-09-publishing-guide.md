# 博客发布与修改指南 · 2026-08-09（2026-10-01 更新）

> 站点已上线：**https://ben-chen.com**。评论已开启；邮件订阅仍未开启（见文末）。
> 这份文档写给日常写文章、改站点信息、发布用，不涉及代码架构——架构决策看
> [PRD](2026-08-04-blog-kami-prd.md)，上线前还差什么看
> [launch-checklist](2026-08-06-launch-checklist.md)。
>
> **2026-10-01 更新（以本节为准）**：**发布改回本地 `pnpm run deploy`，GitHub Actions 不再部署。**
> `git push` 只会触发 `.github/workflows/ci.yml`——它只做构建校验（和 push 到 main 时的字体子集回写），
> **不会上线**。GitHub 仓库里的 `CLOUDFLARE_API_TOKEN` secret 不再被任何 workflow 使用，
> 可以去 https://github.com/ffzz/blog/settings/secrets/actions 删掉。第 2、5、6、9、10、12 节已同步，
> 下文凡是写"自动上线"的旧说法都已改掉；第 6 节浏览器后台的影响尤其要看。
>
> 2026-08-10 的更新：仓库接上了 GitHub（`ffzz/blog`，已公开），打通了浏览器后台和评论
> （当时还有 push 自动部署，现已撤销，见上）。

---

## 1. 现在是什么状态

- 站点是**纯静态**部署在 Cloudflare Workers 上，域名 `ben-chen.com` 已经绑定好。
- 代码仓库是 **https://github.com/ffzz/blog**，**公开仓库**。公开是 Giscus 评论的硬性前提
  （giscus 要求仓库公开，否则读者看不到评论）。密钥都在 `.gitignore` 里，没有进过仓库。
- **上线靠在本地跑 `pnpm run deploy`**；`git push` 只做版本管理和 CI 构建校验，**不会**上线。见第 5 节。
- **评论已开启**（Giscus + GitHub Discussions）。见第 7 节。
- **浏览器后台已接通**：https://ben-chen.com/admin/ 可以直接写文章、发布。见第 6 节。
- **邮件订阅仍未开启**——代码都在，只是没接 Resend 账号。见第 11 节。
- 占位文章 `hello-kami` 已经删掉了，现在站上是真文章
  `security-clearance-canberra-it-jobs`（中英各一篇）。

---

## 2. 两条发布路径

写文章有两条路，**都通向同一个终点**：`main` 分支上的一次 commit，再由你在本地 `pnpm run deploy` 上线。

| | 路径 A：浏览器后台 | 路径 B：本地 Markdown |
| --- | --- | --- |
| 在哪写 | https://ben-chen.com/admin/ | 你电脑上的编辑器 |
| 适合 | 手机上、别人电脑上、只想改个错字 | 长文、要本地预览、要插图排版 |
| 怎么发布 | 点 Publish（只提交到 `main`，**不会上线**） | `git push`（同样不会上线） |
| 之后 | 回到本地 `git pull`，再 `pnpm run deploy` | `pnpm run deploy` |
| 详见 | 第 6 节 | 第 3–5 节 |

**两条路不要同时用。** 后台点 Publish 是直接往 `main` 提交，你本地那份就落后了；下次本地
`git push` 会被拒绝（non-fast-forward）。规矩很简单：**动手写之前先 `git pull`**。

> 为什么后台不走"提交 PR 等审核"这条更稳妥的路？因为 Sveltia CMS 的 editorial workflow
> （草稿分支 + PR）官方还没实现，文档写明要等 1.0 版本。现在它只能直接写单一分支。
> 想"先存不发"，用文章里的 `draft` 开关，不要指望后台有草稿分支。

---

## 3. 写一篇新文章（本地）

### 3.1 文件放在哪

技术文章放 `src/content/posts/`，随笔放 `src/content/notes/`。每种下面再按语言分：

```
src/content/posts/en/my-post-slug.md     # 英文版
src/content/posts/zh/my-post-slug.md     # 中文版
```

**规则**：文件是否存在决定这篇文章有没有对应语言版本——不强制中英各写一份。只写中文，就只建
`zh/` 下那一个文件，网站会自动只在中文页面显示它，`en` 那边的语言切换器会显示"没有这个语言版本"
而不是 404。

**slug（文件名）用英文小写连字符**，比如 `rag-chunking.md`——它会变成 URL 的一部分
（`/posts/rag-chunking/`），发布后不要改文件名，改了等于换了个新地址，之前分享出去的链接全部失效，
**而且那篇文章下面的评论也会一起失联**（评论按 URL 路径匹配，见第 7 节）。

### 3.2 文件开头要写什么（frontmatter）

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

### 3.3 正文里的 Markdown 有点特殊

这个博客的排版风格移植自 Kami 设计系统，`**加粗**` 和 `*斜体*` 被重新定义过：

- `**这样写**` → 变成强调色（不是加粗）
- `*这样写*` → 中文页面变成着重号「·」，英文页面变成真斜体
- `` `这样写` `` → 代码样式

正常按 Markdown 语法写就行，不用刻意做什么，只是显示效果跟别的博客不一样。

---

## 4. 本地预览

```bash
cd /Volumes/U-disk/Projects/blog
pnpm dev
```

打开终端里提示的地址（一般是 `http://localhost:4321`），改文件保存后浏览器会自动刷新。写完
草稿在这里看是否满意，满意了再发布。

`Ctrl+C` 停止。

---

## 5. 发布上线

### 5.1 正常发布：本地 `pnpm run deploy`

```bash
cd /Volumes/U-disk/Projects/blog
git pull                       # 先拉：后台发的文章、CI 回写的字体子集都在远端，见 5.3
git add <改动的文件>
git commit -m "发布：xxx 文章"
git push                       # 只是存档 + 触发 CI 构建校验，不会上线
pnpm run deploy                    # ★ 真正上线：pnpm build → cf-wrangler build → cf deploy --prebuilt
```

`pnpm run deploy`（`package.json` 里的 `deploy` 脚本）依次做三件事：`pnpm build`（含字体缺字检查、
产物校验、pagefind 索引）→ `cf-wrangler build`（把 `./dist` 打成 `.cloudflare/output/v0/`）→
`node --env-file=.env.local ./node_modules/cf/bin/cf deploy --prebuilt`。凭据来自本地 `.env.local`
（`CLOUDFLARE_API_TOKEN`，不进 git，见第 9 节）。

上线前想先看会发布什么：`pnpm build && pnpm cf:output && node --env-file=.env.local ./node_modules/cf/bin/cf deploy --prebuilt --dry-run`
（只读取并列出静态资源，不上传）。部署成功后 `https://ben-chen.com` 立即是最新内容。

**push 之后 GitHub Actions 会跑什么**：只有 `.github/workflows/ci.yml`——装依赖、（push 到 main 时）
补字体子集并回写、`pnpm build`。绿勾说明"构建能过"，**不代表已上线**。红叉说明 main 上的内容现在
构建不过（比如后台发的文章有问题），本地 `pnpm run deploy` 也会同样失败，先修再发。

### 5.2 本地发布的前提：先拉、先清缓存

Astro 把文章索引缓存在 `node_modules/.astro/data-store.json` 里，而**删掉一篇文章的源文件
并不会清掉这个缓存里的条目**。结果是本地构建会把已经删掉的文章重新生成出来，`pnpm run deploy`
再原样发上线。

这不是理论问题：2026-08 之前本地部署时，`https://ben-chen.com/zh/notes/only-chinese/` 一直是
能打开的，还进了 sitemap——那是一篇早就删掉的测试随笔。（后来用 GitHub Actions 干净 checkout
部署规避了这件事；现在改回本地发布，就要自己注意。）`pnpm build` 里的 `verify-build.mjs` 会
检查这类"幽灵页面"，但**删过文章的话，部署前仍建议先清一次缓存**：

```bash
rm -rf node_modules/.astro dist && pnpm run deploy
```

### 5.3 CI 仍会自动往你的仓库提交东西（字体子集）

站点的中文标题用的是一份**精确子集化**的字体——只打包文章标题里真正出现过的那些汉字，
所以字体文件才只有 30 多 KB。代价是：写了带新汉字的标题，就得重新生成这份子集。

在后台（路径 A）写文章时你没机会跑这个命令，所以 push 到 `main` 时 CI 会替你跑 `pnpm fonts`，
并把更新后的字体文件自动提交回 `main`，提交者显示为 `github-actions[bot]`，信息是
`chore: 同步中文标题字体子集`。

对你的影响：**本地开始写、以及 `pnpm run deploy` 之前先 `git pull`**，否则会撞上 non-fast-forward，
或者拿着缺字的子集去构建。如果 CI 还没来得及回写，本地 `pnpm build` 报缺字，就自己跑一次
`pnpm fonts`（需要联网）再构建，`public/fonts/` 的改动记得提交。

> 这个机制不是假想需求。接 CI 的当天就发现 `main` 的最新 commit 已经构建不过了——
> 之前把站点简介改成"程序员与**终身学习**者"，引入了「终身学习」四个新汉字，但没重新生成子集。

---

## 6. 在浏览器后台写（Sveltia CMS）

打开 **https://ben-chen.com/admin/**。

### 6.1 登录

点 **"Sign In with Token"**，粘贴一个 GitHub Personal Access Token。生成方式：

https://github.com/settings/tokens/new?scopes=repo —— 勾选 `repo` 权限即可，别的都不用勾。

Token 只存在你这台设备的浏览器 localStorage 里，不会进仓库，也不会发给任何第三方。

> **⚠️ PAT 默认 90 天过期。** 到期后后台会登录失败，重新按上面的链接生成一个新的、再粘一次即可。
> 这不是故障。想彻底免掉这件事，得另外部署一个 OAuth 服务（当初权衡后选了"少维护一个服务"）。

### 6.2 六个栏目分别对应什么

| 后台栏目 | 对应目录 |
| --- | --- |
| Posts (EN) | `src/content/posts/en/` |
| Posts (中文) | `src/content/posts/zh/` |
| Notes (EN) | `src/content/notes/en/` |
| Notes (中文) | `src/content/notes/zh/` |
| Pages (EN) | `/about`、`/privacy` 英文版 |
| Pages (中文) | `/about`、`/privacy` 中文版 |

中英是**分开的两个栏目**，不是同一篇文章切 tab。这是刻意的：编辑英文文章时不会被要求同时填中文版，
只写一种语言完全正常。

### 6.3 注意事项

- **Slug 字段决定文件名和 URL**，规则跟第 3.1 节完全一样，发布后不要改。
- 点 **Publish** = 直接提交到 `main`，中间没有复核环节。**自 2026-10-01 起这一步不会再自动上线**
  （CI 不再部署）：提交成功后，要回到电脑上 `git pull` 再 `pnpm run deploy`，文章才会出现在
  https://ben-chen.com。想先存不发就把 **Draft** 打开（`draft: true` 的文章不会出现在正式站点上）。
- 插图会传到 `public/images/`，正文里引用路径是 `/images/xxx.png`。

---

## 7. 评论

评论用的是 **Giscus**：读者的评论以 **GitHub Discussions** 的形式存在 `ffzz/blog` 仓库里，
分类是 **Announcements**。零后端、零数据库、不花钱。

几件值得知道的事：

- **读者需要 GitHub 账号才能评论。** 这对中文非技术读者是硬门槛，是当初就明知并接受的取舍。
- **评论按 URL 路径匹配文章**（`data-mapping: pathname`）。所以**改了文章 slug，老评论就找不回来了**
  ——这是第 3.1 节强调"发布后不要改文件名"的第二个理由。
- **中英文版本各自独立**：`/posts/foo/` 和 `/zh/posts/foo/` 是两个路径，评论区也是两个，互不相通。
- **删评论去 GitHub**：https://github.com/ffzz/blog/discussions，在那边删掉，站上就没了。
  垃圾评论也是这么处理。
- 评论区会跟着站点的明暗模式自动切换配色，不用管。
- 分类选 Announcements 是有意的——这个分类只有仓库维护者能开新话题，读者只能在已有话题下回复，
  不会变成一个开放的发帖入口。

---

## 8. 改站点基本信息

### 8.1 站名、简介、作者信息

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

### 8.2 About 页正文

`src/content/pages/en/about.md` 和 `src/content/pages/zh/about.md`，跟写文章一样是 Markdown
文件，直接改正文即可，两个语言各自独立，不用互译。也可以在后台的 Pages 栏目里改。

### 8.3 隐私政策页

`src/content/pages/{en,zh}/privacy.md`——这页描述的是站点实际的数据处理行为。**只有引入新的
数据收集行为时才需要改这页**（比如以后真的开了邮件订阅），平时不用管。评论那段在开评论时
已经同步过了。

改完任何一处，都是走第 5 节 `git push` 重新发布。

---

## 9. 密钥和环境变量放在哪

| 位置 | 谁用 | 放什么 |
| --- | --- | --- |
| `.env.local`（本地，不进 git） | 你电脑上跑 `pnpm run deploy` / `pnpm whoami` 时，`cf` 命令行工具（`cf auth whoami`、`cf deploy --prebuilt`）自己要用 | `CLOUDFLARE_API_TOKEN`、`CLOUDFLARE_ACCOUNT_ID` |
| `.dev.vars`（本地，不进 git） | 以后真的启用邮件订阅功能时，本地测试 Worker 用 | `RESEND_API_KEY`、`TOKEN_SIGNING_SECRET`——现在是假值，因为功能还没开 |

**GitHub 仓库里不再需要任何 Cloudflare 凭据。** 之前 GitHub Actions 自动部署用的 repo secret
`CLOUDFLARE_API_TOKEN`（https://github.com/ffzz/blog/settings/secrets/actions）现在没有任何 workflow
读取它，建议在那里删掉（删除后 GitHub 无法找回，需要时重新创建即可）。顺便可以在 Cloudflare
Dashboard → My Profile → API Tokens 里确认：只保留本地 `.env.local` 用的那个窄权限 token，
旧的 CI 用 token 可以一并吊销。

**Cloudflare 的 token 有有效期，过期后只需要换 `.env.local` 这一处。**

`.env.local` 和 `.dev.vars` 都在 `.gitignore` 里，不会被提交。**仓库现在是公开的，更加不要把
里面的内容贴到聊天记录、issue、文档、或任何会被分享出去的地方。**

---

## 10. 常见问题排查

**push 之后网站没变**

正常：push（以及后台 Publish）不会上线。回本地 `git pull` 再 `pnpm run deploy`（第 5.1 节）。

**GitHub Actions 是红叉**

去 https://github.com/ffzz/blog/actions 点开最新那次，看哪一步是红的。或者：

```bash
gh run view --log-failed
```

红叉意味着 main 现在**构建不过**（不是"没上线"——本来就不会自动上线）。本地 `pnpm build` 复现并修掉，
否则 `pnpm run deploy` 也会失败。

**Actions 报字体缺字**

push 到 main 时 CI 会先补子集，正常不该出现。如果真报了，多半是拉 Google Fonts 时网络抖动，
点 Actions 页面的 **Re-run jobs** 重跑一次就行；在 PR 上缺字是预期的红叉（PR 不回写字体），本地
`pnpm fonts` 后提交 `public/fonts/` 即可。

**本地 `pnpm build` 报字体缺字**

```
Error: 字体子集缺少 N 个字符：...
```

你在本地写了带新汉字的标题，或者后台发的文章带了新汉字而 CI 还没回写。先 `git pull`；仍缺就跑
一次 `pnpm fonts` 重新生成（要联网），提交 `public/fonts/`，再构建。

**后台 `/admin` 登录失败**

大概率是 GitHub PAT 过期了（默认 90 天）。按 6.1 的链接重新生成一个，重新粘贴。

**后台点了 Publish，网站上没有这篇文章**

正常：后台只提交到 `main`，不再自动上线（第 6.3 节）。回本地 `git pull` 后 `pnpm run deploy`。

**评论区文字发白、几乎看不清**

`public/_headers` 里给两个 `giscus-theme-*.css` 加的 `Access-Control-Allow-Origin: *` 被删了或失效了。
giscus 是用 `<link ... crossorigin="anonymous">` 从它自己的 iframe 里加载这两个文件的，少了这个响应头，
浏览器会把文件拉下来、却**一条样式规则都不应用**，于是主题变量全空、退回默认色。

这个故障非常安静：不报 404、console 没有错误、`link.sheet` 也不是 null。判断方法：

```bash
curl -sI https://ben-chen.com/giscus-theme-light.css | grep -i access-control
```

没输出就是这个问题。以后新增自定义主题文件，记得在 `public/_headers` 里一并加上。

**文章页看不到评论区**

按可能性从高到低查三件事：① giscus GitHub App 是否还装在 `ffzz/blog` 上
（https://github.com/settings/installations）；② 仓库是不是被改回私有了（giscus 强制要求公开）；
③ 仓库的 Discussions 是不是被关了。三者缺一评论区就不出现。

**`git push` 被拒绝，提示 non-fast-forward**

CI 自动提交过字体子集，或者你在后台发过文章，远端比你本地新。`git pull` 再推。

**删掉的文章还在线上**

见 5.2。`rm -rf node_modules/.astro dist` 之后重新 `pnpm run deploy`。

**`pnpm run deploy` 报鉴权失败**

`.env.local` 里的 `CLOUDFLARE_API_TOKEN` 过期了。跑 `pnpm whoami` 确认，去
Cloudflare Dashboard → My Profile → API Tokens 重新生成，只需要更新 `.env.local`（第 9 节）。

**改完内容，浏览器上没变化**

先确认你已经跑过 `pnpm run deploy` 且成功了（push 不会上线）。是的话再强制刷新（Cmd+Shift+R）排除浏览器缓存。

**域名打不开**

去 Cloudflare Dashboard → Workers & Pages → `personal-blog` → Settings → Domains & Routes，
确认 `ben-chen.com` 状态是 Active。

---

## 11. 以后想开邮件订阅

代码已经写好了，只是没接 Resend 账号，不是要重新开发。步骤按
[launch-checklist.md](2026-08-06-launch-checklist.md) 的 C1–C4 做（注册 Resend、验证发信域名、
建 KV namespace、设 Worker 密钥），做完把 `src/consts.ts` 里的 `EMAIL_SUBSCRIBE_ENABLED`
改成 `true`，push 即可生效。

注意这一项会让站点从"纯静态"变成"静态 + 一个 Worker"，`wrangler.jsonc` 要把 `main` /
`kv_namespaces` / `vars` / `run_worker_first` 几块加回来，届时也要更新隐私政策页。

---

## 12. 命令速查

```bash
cd /Volumes/U-disk/Projects/blog

git pull               # 写之前、部署之前先拉（后台发的文章、CI 回写的字体都在远端）
pnpm dev               # 本地预览，改文件自动刷新
git push               # 存档 + 触发 CI 构建校验（不会上线）
pnpm run deploy            # ★ 发布：本地构建并上线（凭据来自 .env.local）
gh run watch           # 看 CI 构建校验进度
gh run view --log-failed   # CI 红叉时看是哪一步炸了

pnpm build             # 本地构建校验（deploy 会自动先跑）
pnpm fonts             # 标题用了新汉字时重新生成字体子集
pnpm whoami            # 确认 Cloudflare 登录状态
```

常用链接：

- 站点 https://ben-chen.com
- 后台 https://ben-chen.com/admin/
- CI 构建校验记录（不是部署记录）https://github.com/ffzz/blog/actions
- 评论管理 https://github.com/ffzz/blog/discussions
