# 上线前任务清单 · 2026-08-06

> 配套文档：[PRD](2026-08-04-blog-kami-prd.md)（§10 开放项、§11 已知限制、§12 验收标准、§16–21 各阶段实施记录是本清单的依据）。
> 本文档只记录**从当前状态到能上线**还差什么，不重复 PRD 里已经写清楚的设计决策。

## 图例

- **🔴 阻塞上线**：不做完站点要么打不开、要么明显是半成品，不能公开
- **🟡 建议上线前做**：不做也能上线，但会留下用户能看到的坑（死链接、空后台）
- **🟢 上线后再补也行**：PRD 已经把它设计成"未配置就静默跳过"，不影响其他功能
- **[你]**：只有你能做的决定或需要你账号权限的操作
- **[我]**：我可以直接执行的开发/配置改动
- **[一起]**：需要你先做决定或提供信息，我再落地

---

## A. 内容 — 只有你能写 [你]

| # | 任务 | 优先级 | 说明 |
| --- | --- | --- | --- |
| A1 | 填 `src/consts.ts` 的站点身份 | 🔴 | `SITE.en/zh`（name/tagline/intro）、`AUTHOR`（name/email/sameAs）。这是全站 SEO 门面和 JSON-LD `Person` 实体的内容，PRD §10 已经列出三个需要你权衡的取舍（品牌型 vs 关键词型站名、tagline 直译 vs 本地化、sameAs 的隐私代价），我写不出来 |
| A2 | 写 `/about` 正文（en + zh） | 🔴 | 当前是 `TODO: write this.` 占位符。这页承载 `Person` JSON-LD，对 Google 识别你是谁很重要，三五段真实内容就够 |
| A3 | 删除或替换示例文章 `hello-kami` | 🔴 | `src/content/posts/{en,zh}/hello-kami.md` 正文第一行写着"删除它一旦有了真正的第一篇文章"。上线前至少要有 1 篇真实内容，否则整站首页是空的或只有一篇自我指涉的示例文 |
| A4 | （可选）决定初始标签体系 | 🟢 | 不强制，写文章时顺手定即可；只需记得 PRD §5.3 的规范（全小写连字符，技术/随笔标签不混用） |

---

## B. 站点身份与外部依赖决定 [你] / [一起]

| # | 任务 | 优先级 | 说明 |
| --- | --- | --- | --- |
| B1 | 定域名并接入 Cloudflare | 🔴 | PRD §10：**上线后不可更改**（会丢权重），必须先定。Cloudflare Registrar 购买或把现有域名的 DNS 转到 Cloudflare 均可 |
| B2 | 创建 GitHub 仓库并推送代码 | 🔴 | 当前只有本地一个初始 commit，没有 remote。Sveltia CMS（后台）、Giscus（评论，如果启用）、以及"push 即部署"的 CI 方式都需要一个真实远程仓库 |
| B3 | 决定是否上线即启用评论（Giscus） | 🟡 | 需要仓库开 Discussions + 走 giscus.app 向导拿四个绑定值填 `consts.ts` 的 `GISCUS`。新博客零评论区反而显冷清（PRD §8.2 已记录这个权衡）——可以选择先不开，攒几篇文章、有读者后再开 |
| B4 | 决定是否上线即启用访问统计 | 🟢 | 需要域名先接入 Cloudflare（B1 完成后才能做），Dashboard 里加站点拿 beacon token 填 `CF_ANALYTICS_TOKEN`。不开不影响任何其他功能 |

---

## C. 外部账号与密钥 [你操作，我可协助跑命令]

| # | 任务 | 优先级 | 说明 |
| --- | --- | --- | --- |
| C1 | 创建真实 Cloudflare KV namespace | 🔴 | `wrangler kv namespace create SUBSCRIBE_KV`，把返回的 id 填进 `wrangler.jsonc` 替换 `TODO_RUN_WRANGLER_KV_NAMESPACE_CREATE`。需要你先 `wrangler login` 授权 |
| C2 | 注册 Resend 账号 + 验证发信域名 | 🔴（若上线即开订阅）| 域名验证（DNS 记录）依赖 B1 先完成。拿到后：API key、发信地址填 `RESEND_FROM_EMAIL`、创建一个 Segment 拿 `RESEND_SEGMENT_ID` |
| C3 | 设置 Worker 密钥 | 🔴（若上线即开订阅）| `wrangler secret put RESEND_API_KEY`、`wrangler secret put TOKEN_SIGNING_SECRET`（后者随便生成一串够长的随机字符串即可，不需要记住，只用于签名校验）。**绝不进仓库**，PRD 已定 |
| C4 | 决定订阅功能是否随首次上线一起开 | 🟡 | 见下方"D 组"——已经默认按①（先隐藏）落地：`EMAIL_SUBSCRIBE_ENABLED` 开关目前是 `false`，Footer 不会渲染订阅表单，等 C1–C3 都配好了、把这个开关翻成 `true` 即可 |

---

## D. 开发遗留 [我] — ✅ 已全部完成（2026-08-06）

上一轮验收时发现的缺口，加上本轮又发现的两处 SEO 细节，全部已修复并跑过 `npm run build` + 浏览器验证：

| # | 任务 | 状态 | 说明 |
| --- | --- | --- | --- |
| D1 | Sveltia CMS 后台漏了 `/privacy` 页面 | ✅ | `public/admin/config.yml` 的 `pages_en`/`pages_zh` 补上了 `privacy` 条目，照抄 `about` 的字段结构。浏览器验证 `/admin/` 仍能正常解析配置、无新增报错 |
| D2 | 订阅表单在外部账号未就绪时的降级处理 | ✅ | 新增 `consts.ts` 里的 `EMAIL_SUBSCRIBE_ENABLED`（默认 `false`），`Footer.astro` 据此判断是否渲染 `<Subscribe>`。跟 `CF_ANALYTICS_TOKEN`/`GISCUS` 是同一套"未配置就不渲染"模式，只是这个开关要人工翻转（Resend 密钥是 Worker 端密钥，没法像 token 那样用"是否为空"自动判断）。构建产物已确认 Footer 不再包含订阅表单的任何标记 |
| D3 | `wrangler.jsonc` 的 `compatibility_date` 换成上线前的真实日期 | 保留待办，见 E 组 | 这个要在部署当天做，不是现在——提前改等于白改，故意不动 |
| D4（新发现） | sitemap 漏了 `/privacy` | ✅ | `src/lib/sitemap.ts` 的 `STATIC_PATHS` 加完隐私政策页那次忘了同步这个列表，跟 `about` 同级内容却没进 sitemap。已修复，构建产物确认 `sitemap-index.xml` 现在含 `/privacy/` 和 `/zh/privacy/` 两条 |
| D5（新发现） | 订阅确认跳转页 `/subscribe/confirm` 没有 `noindex` | ✅ | 这页是订阅流程的中间态展示页，不是内容，不该被搜索引擎收录（尤其构建期渲染的默认文案是"链接无效"，被当正常内容收录了更奇怪）。给 `BaseHead`/`BaseLayout` 加了 `noindex` prop，`SubscribeConfirm.astro` 传 `noindex`。构建产物确认该页面带 `<meta name="robots" content="noindex, nofollow">`，其余页面不受影响 |

---

## E. 部署上线 [一起]

| # | 任务 | 优先级 | 依赖 |
| --- | --- | --- | --- |
| E1 | `src/site-origin.mjs` 里的 `SITE_ORIGIN` 换成真实域名 | 🔴 | 依赖 B1 定好域名 |
| E2 | 首次部署：`wrangler deploy` | 🔴 | 依赖 C1（KV 已建）、C3（密钥已设，如果订阅功能一起上线的话）；否则会部署成功但订阅功能报错 |
| E3 | 绑定自定义域名到 Workers 项目 | 🔴 | Cloudflare Dashboard → Workers 项目 → Custom Domains，依赖 B1 |
| E4 | （可选）配置"push 即部署"的 CI | 🟢 | Cloudflare Dashboard → Workers → Connect to Git，依赖 B2 仓库已推送。不配也可以每次手动 `wrangler deploy` |

---

## F. 上线前最终验收 [一起]

PRD §12 的 14 项验收标准之前都用**假数据/本地环境**验证过一轮（构建通过、浏览器实测、`wrangler dev` 本地跑通）。域名和外部账号就绪后，**必须用真实环境重新跑一遍**，尤其是这几项之前测不了的：

| # | 项 | 之前测过什么 | 上线前还要测什么 |
| --- | --- | --- | --- |
| F1 | 邮件订阅完整闭环 | Worker 逻辑用假 Resend key 跑通了校验/限流/token 语义 | 真实点一次：订阅 → 真的收到确认邮件 → 点确认 → 在 Resend 后台看到联系人 → 点退订 → 确认被移除 |
| F2 | Sveltia CMS 真实读写 | `/admin` 能加载、SRI 校验通过 | 真实登录（GitHub PAT）→ 编辑一篇文章 → 提交 → 确认触发了部署 |
| F3 | JSON-LD Rich Results Test | 结构本地生成正确 | 拿真实域名的 URL 到 Google [Rich Results Test](https://search.google.com/test/rich-results) 跑一次 |
| F4 | hreflang 检查工具 | 逻辑上验证了 alternate 只含实际存在的语言 | 用真实域名跑一次第三方 hreflang 检查工具，交叉确认 |
| F5 | Lighthouse 全站 | 之前测过程中用的是占位内容 | 填完真实内容（consts.ts、about、首篇文章）之后**重新跑一次**，字体子集可能因为新增汉字而变大，需要确认仍在预算内 |
| F6 | Search Console / 站长平台的域名归属验证 | — | 依赖 B1、E3 |

其余 8 项（sitemap、RSS、语言切换器、边注锚点、暗色模式、强调渲染、薄内容护栏、无障碍）逻辑不依赖外部账号，本地已验证过，上线后按 PRD §12 抽查一次确认生产环境和本地行为一致即可，不需要重新设计测试。

---

## G. 上线后 SEO 提交 [你]

PRD §7.5 已列出，搬过来方便一起勾：

- [ ] Google Search Console 提交 sitemap
- [ ] Bing Webmaster Tools 提交（其索引供给 ChatGPT 搜索）
- [ ] 百度站长平台提交
- [ ] Rich Results Test 复验（见 F3）

---

## H. 已知限制 — 接受，不阻塞上线

PRD §11 已经明确记录过，重复列在这里只是提醒"上线时不要被这几点绊住"：

- **国内访问速度**：Cloudflare 免费层在国内不稳定，没有免费解法。策略是先上线接受现状，等 Search Console 显示国内流量确实可观（PRD §15 定的触发条件是 >20%）再考虑 ICP 备案 + 国内 CDN
- **国内邮箱送达率**（QQ / 163）未知，上线后用 F1 的真实测试顺便看一眼，不要专门为这个再拖上线时间
- **Sveltia CMS 仍是 beta**，单分支写入，单人博客场景影响可忽略

---

## 建议执行顺序

任务之间有硬依赖，不是想到哪做到哪。按下面的顺序推进，同一行内的任务可以并行：

> D 组已全部完成，不再占执行顺序里的位置。

1. **B1 定域名并接入 Cloudflare** —— 这是几乎所有后续步骤的前提，最先做
2. **B2 建 GitHub 仓库并推送** + **A1/A2/A3 写内容**（可以和 B2 并行，互不依赖）
3. **C1 建真实 KV namespace**（依赖 wrangler login，不依赖域名，可以提前做）
4. **决定 C4**：订阅功能是否随首发一起上线（默认已按"先不开"落地，`EMAIL_SUBSCRIBE_ENABLED=false`）
   - 想"一起上线" → 做 C2（Resend 账号+域名验证，依赖 B1）、C3（设密钥），完成后把 `EMAIL_SUBSCRIBE_ENABLED` 翻成 `true`
   - 维持"先不开" → 直接跳到步骤 5，C2/C3 留到后续版本
5. **E1 换真实域名** → **E2 首次部署** → **E3 绑定自定义域名**
6. **D3 把 compatibility_date 换成部署当天日期**（跟 E2 一起做，避免部署后再改）
7. **F 组全部验收项**，域名和账号都就绪后集中跑一遍
8. **G 组 SEO 提交**，确认能正常访问后立刻做，越早提交索引越早开始
9. B3（评论）、B4（访问统计）、E4（CI 自动部署）可以在首次上线之后随时补，不影响上线本身
