# 上线前任务清单 · 2026-08-06

> 配套文档：[PRD](2026-08-04-blog-kami-prd.md)（§10 开放项、§11 已知限制、§12 验收标准、§16–21 各阶段实施记录是本清单的依据）。
> 本文档只记录**从当前状态到能上线**还差什么，不重复 PRD 里已经写清楚的设计决策。
>
> **2026-08-09 更新：站点已上线（`https://ben-chen.com`）。** 首次部署选择的是纯静态架构——
> Worker（邮件订阅相关的 KV/Resend）没有一起部署，`wrangler.jsonc` 目前只有 `assets` 字段。
> 下面 A/B1 已完成的项目标了 ✅；C/D2 里跟 Worker 相关的部分要等真正决定开邮件订阅时才需要做，
> 目前不是"待办"而是"暂缓"。日常发布流程见新增的
> [publishing-guide.md](2026-08-09-publishing-guide.md)。
>
> **2026-08-10 更新：B2 / B3 / E4 完成。** 仓库推上 GitHub 并转为 public（Giscus 的硬性前提），
> 随之打通评论、Sveltia CMS 后台、以及 GitHub Actions 自动部署。发布主路径从本地
> `npm run deploy` 变为 `git push`。剩余待办只有 C 组（邮件订阅相关，仍暂缓）、F 组验收、
> G 组 SEO 提交，以及 B4（访问统计）。
>
> **2026-08-12 更新：B4 完成，并处置了一次 Cloudflare 安全扫描。** 访问统计已启用（走手动 snippet
> 嵌入，不是边缘自动注入，两条路径只能选一条，见 B4）。安全扫描的 6 条发现修 3 拒 3，
> 全部理由与回归测试留档在新增的 I 组。

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
| A1 | 填 `src/consts.ts` 的站点身份 | ✅ | 已填：站名 "Ben's Blog" / "Ben 的博客"，作者 Ben，邮箱 hello@ben-chen.com |
| A2 | 写 `/about` 正文（en + zh） | ✅ | 已写真实内容 |
| A3 | 删除或替换示例文章 `hello-kami` | 🟡 | **仍是占位文章**——首次上线选择保留它代替空首页，不是遗漏。写了真文章之后记得删，见 publishing-guide.md §1 |
| A4 | （可选）决定初始标签体系 | 🟢 | 不强制，写文章时顺手定即可；只需记得 PRD §5.3 的规范（全小写连字符，技术/随笔标签不混用） |

---

## B. 站点身份与外部依赖决定 [你] / [一起]

| # | 任务 | 优先级 | 说明 |
| --- | --- | --- | --- |
| B1 | 定域名并接入 Cloudflare | ✅ | `ben-chen.com`，DNS 已在 Cloudflare，Custom Domain 已绑定到 Workers 项目 `personal-blog` |
| B2 | 创建 GitHub 仓库并推送代码 | ✅ | `https://github.com/ffzz/blog`。2026-08-10 因 Giscus 强制要求公开仓库而**转为 public**（转前逐 commit 核查过历史无密钥） |
| B3 | 决定是否上线即启用评论（Giscus） | ✅ | 2026-08-10 开启。Discussions 已开，giscus app 已装，`consts.ts` 的 `GISCUS` 填的是 `ffzz/blog` + Announcements 分类（该分类只有维护者能开新话题，避免变成开放发帖入口） |
| B4 | 决定是否上线即启用访问统计 | ✅ | 2026-08-12 启用。Dashboard 选 **Enable with JS Snippet installation**（手动嵌入），token 填进 `CF_ANALYTICS_TOKEN`。**注意另外三个 Enable 选项是边缘自动注入**——Cloudflare 直接改写响应 HTML 插 beacon，那种模式下再填这个常量会变成两个 beacon 同时上报、浏览量翻倍。两条路径只能选一条，改 Dashboard 时要同步 `consts.ts` |

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
| E1 | `src/site-origin.mjs` 里的 `SITE_ORIGIN` 换成真实域名 | ✅ | `https://ben-chen.com` |
| E2 | 首次部署：`wrangler deploy` | ✅ | 实际走的是纯静态路径，跳过了 C1/C3——`wrangler.jsonc` 精简为只有 `assets`，没有 Worker。以后要开邮件订阅时再把 `main`/`kv_namespaces`/`vars`/`run_worker_first` 加回来 |
| E3 | 绑定自定义域名到 Workers 项目 | ✅ | 用 Cloudflare API（`PUT /accounts/:id/workers/domains`）直接绑的，没走 Dashboard 点击——domain 的 zone 已经在同一个 Cloudflare 账号下，API token 权限够用，比图形界面更快 |
| E4 | （可选）配置"push 即部署"的 CI | ✅ | 2026-08-10 落地 `.github/workflows/deploy.yml`：push `main` → `npm run fonts`（有变动则回写提交）→ `npm run build` → `wrangler-action` 部署。选 GitHub Actions 而非 Cloudflare 的 Connect to Git，是因为需要一个**有网络**的构建环境来重跑字体子集——CMS 在浏览器里发文时作者没机会补字，而 `fonts:check` 缺字即失败。附带收益：干净 checkout 消除了 `node_modules/.astro` 缓存导致的幽灵页面（本地部署曾把已删除的 `/zh/notes/only-chinese/` 一直发上线） |

---

## F. 上线前最终验收 [一起]

PRD §12 的 14 项验收标准之前都用**假数据/本地环境**验证过一轮（构建通过、浏览器实测、`wrangler dev` 本地跑通）。域名和外部账号就绪后，**必须用真实环境重新跑一遍**，尤其是这几项之前测不了的：

| # | 项 | 之前测过什么 | 上线前还要测什么 |
| --- | --- | --- | --- |
| F1 | 邮件订阅完整闭环 | Worker 逻辑用假 Resend key 跑通了校验/限流/token 语义 | 真实点一次：订阅 → 真的收到确认邮件 → 点确认 → 在 Resend 后台看到联系人 → 点退订 → 确认被移除 |
| F2 | Sveltia CMS 真实读写 | `/admin` 能加载、SRI 校验通过；`config.yml` 的 `repo` 已填 `ffzz/blog` | 真实登录（GitHub PAT）→ 编辑一篇文章 → 提交 → 确认触发了部署。**注意 PAT 默认 90 天过期**，登录失败优先怀疑这个 |
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

## I. 安全扫描处置 · 2026-08-12

Cloudflare Security Insights 对 `ben-chen.com` 的扫描（2026-08-09）报了 6 条。逐条核对线上实际状态后
**修 3 条、拒 3 条**。留档的目的很实际：下次扫描还会报同样的 3 条，不用重新判断一次，
也避免以后有人「顺手修一下」把 AI 爬虫封了。

| 条目 | 严重度 | 实测 | 处置 |
| --- | --- | --- | --- |
| Always Use HTTPS 未开 | Moderate → **实际更高** | 当时 `curl -I http://ben-chen.com/` 返回 **200 而非 301** | ✅ **2026-08-18 已开**（Dashboard → SSL/TLS → Edge Certificates）。仓库里修不了：`_headers` 只能设响应头不能做协议跳转，`_redirects` 按路径匹配、表达不了「若为 http 则跳 https」。事后看这远不止是安全问题 —— 它让全站每个页面在 Google 眼里多出一个 `http://` 副本，独占了 GSC 里 13 个未索引 URL 中的 8 个，见 §J |
| 无 HSTS | Moderate | 实测当时**一个安全响应头都没有**（连 `nosniff` 都没有） | ✅ `public/_headers` 加全局块，顺手一次补齐五个头 |
| security.txt 未配置 | Low | `/.well-known/security.txt` → 404 | ✅ 新增 `public/.well-known/security.txt`（RFC 9116），并在 `scripts/verify-build.mjs` 加过期守卫 |
| Block AI bots 未开 | Moderate | GPTBot / ClaudeBot / OAI-SearchBot / PerplexityBot 当前全部 200 | ❌ **拒绝**，见下 |
| AI Labyrinth 未开 | Low | 同上 | ❌ **拒绝**，见下 |
| Bot Fight Mode 未开 | Moderate | — | ❌ **拒绝**，见下 |

**为什么拒绝这三条**

前两条与 §7.2 直接冲突。`src/pages/robots.txt.ts` 逐个点名允许 GPTBot / ClaudeBot / PerplexityBot /
Google-Extended，配套 `/llms.txt`、`/llms-full.txt` 和 RSS 全文输出，PRD 写的是「2026 年 AI 引用正在
成为主要发现渠道，这部分不是可选项」。开 Block AI bots 等于在 WAF 层把这些爬虫全部 403，
而 **WAF 优先级高于 robots.txt** —— 是它覆盖你，不是你覆盖它。AI Labyrinth 更矛盾：它的机制是给
AI 爬虫喂生成的垃圾页面，等于一边发邀请函一边在门口挖坑。站点的主打文章正好是《AI 搜索凭什么引用你》。

Bot Fight Mode 是另一类问题：官方文档明确写了它**不支持按路径例外、不能用 WAF 规则绕过**、
可能误伤 API 流量、且强制开启 JavaScript Detections。而纯静态站跑在 Cloudflare 免费层
（带宽无限、静态请求免费），bot 流量本来就不产生成本 —— 它要防的风险在这个架构下不存在，
代价却是可能挡住 RSS 阅读器、监控和搜索引擎爬虫。

**回归测试**（改动 Cloudflare 安全设置后应该跑一遍，五条必须全是 200）：

```bash
for ua in GPTBot ClaudeBot OAI-SearchBot PerplexityBot Googlebot; do
  echo "$(curl -sS -o /dev/null -w '%{http_code}' -A "$ua" https://ben-chen.com/)  <- $ua"
done
```

**暂不做 CSP**：Pagefind 用 WASM、Giscus 注入跨域 iframe 和脚本、Sveltia CMS 从 CDN 加载并直连
GitHub API、Astro 产出内联样式、Mermaid 是内联 SVG。严到有意义的 CSP 需要逐项放行并反复实测，
配错了会**静默**打断站内搜索或评论区。而本站的 XSS 面基本只有「作者自己写的 Markdown」，
依赖里也已经有 `sanitize-html`。要做就单独做一次并带完整实测，不混进安全扫描的收尾里。

**HSTS 不加 preload**：撤销要等浏览器发行周期、数月起步，且锁死所有子域名必须 HTTPS。
不值得为一次扫描报告承担这种几乎不可逆的承诺。

---

## J. GSC 索引覆盖处置 · 2026-08-18

Search Console 的 Coverage 导出（`docs/SEO/ben-chen.com-Coverage-2026-08-18/`）：**28 个已知 URL，
只有 15 个被索引**。属性类型是 **Domain property**，所以 `http://` 和 `https://` 分别计数 ——
这是下面第一行成立的前提。

**逐桶的示例 URL 后来在 GSC 界面上拉到了，下表已是实证，不是推断。**
四个 CSV 导出只有分桶计数，害我先猜错了两条，教训见文末。

| GSC 分桶 | 数量 | 实际是什么 | 处置 |
| --- | --- | --- | --- |
| Alternative page with proper canonical tag | 7 | **7 个全是 `http://` URL**（`http://ben-chen.com/`、`/about/`、`/privacy/`、`/zh/`、`/zh/archive/`、`/zh/privacy/`、`/zh/posts/how-ai-search-picks-sources/`），canonical 都指向 https 正版 | ✅ 已开 Always Use HTTPS，实测全部 301 |
| Not found (404) | 2 | `/zh/notes/only-chinese/`、`/zh/posts/hello-kami/` —— commit `00fa060` 删掉的示例内容（§E4 注释里提过它们曾被误发上线） | ✅ **无需修复**，404 就是正确答案。sitemap 已不含它们，Google 会自行淘汰 |
| Crawled – currently not indexed | 2 | `/rss.xml`、`/zh/rss.xml` | ✅ **无需修复**，RSS feed 本来就不该进网页索引，Google 抓它是为了发现内容 |
| Discovered – currently not indexed | 2 | `/posts/how-ai-search-picks-sources/`、`/zh/posts/prompt-engineering-in-agent-era/`，两篇真文章，**Last crawled = N/A（从未被抓过）** | ✅ 文章页加「上一篇 / 下一篇」增加抓取路径；根子上靠 http 副本消失后腾出的抓取额度 |

**所以 13 个未索引里只有 2 个是真问题。** 另外 11 个：8 个是 `http://` 垃圾副本（含那个 404），
2 个是 RSS，1 个是已删内容 —— 全部是本来就该长这样，或者一个 Dashboard 开关能清掉的。

**因果链有硬证据，不是推断**：Googlebot 在 8–13 Aug 之间把抓取额度花在了 7 个 `http://` 副本上
（每个都有真实抓取时间戳），而那两篇 https 正版文章的 Last crawled 是 **N/A**。
一个 9 天大、外链约等于零的站，抓取配额就这么点，被副本吃掉就没了。

**踩过的坑**

- **`/404` 返回 200**，构成软 404；canonical 还指向 `/404/`，而那个 URL 自己 307 跳回 `/404`。
  加 `noindex` 后两个问题一并作废。（这一页当时还没被 Google 抓到，属于提前堵住。）
- **`noindex` 必须配 `follow`，不能配 `nofollow`。** 两件事是独立的：「别收录这页」不等于
  「别顺着这页往下爬」。`BaseHead.astro` 已从 `nofollow` 改成 `follow`。
- **`LangSwitch` 里"目标语言不存在就渲染禁用文本"的防御是对的，是调用方没传对** ——
  `404.astro` 吃了 `BaseLayout` 的默认 `alternates=[...LOCALES]`，链出了不存在的 `/zh/404/`。
  Google 还没抓到它，属于提前修。`scripts/verify-build.mjs` 加了第三段检查兜住这类回归：
  扫描构建产物里所有站内链接，指向不存在的页面就构建失败。

**两条猜错的归因，和为什么会猜错**

先按分桶计数推断，猜 "Crawled – not indexed" 是 `/archive/` + `/zh/archive/`（归档页正文只有
267 字符、和首页 100% 重合，数量也正好对上 2），据此给归档页加了 noindex 并移出 sitemap。
拉到真实 URL 后发现是两个 **RSS feed**，而归档页**一直在被正常收录** —— 那个改动等于主动
deindex 一个健康页面，是净负面，已回滚。同理 "Not found" 猜的 `/zh/404/` 也不是真凶。

教训不是"别推断"，是**推断和证据必须在文档里区分开，且拿到证据后要回头改判**。
`HOME_RECENT_POSTS` 保留（首页截断本身是标准做法，文章多了必然要做），但不再据它决定
归档页收不收录 —— 重复是真的，Google 并没有因此惩罚谁，为一个没被报告的问题动手是投机。

**下次看报告时第一步**：GSC → 索引 → 页面 → 点开每个未索引原因 → 右侧「示例」拿 URL。
在拿到 URL 之前不要动代码。

---

## K. Cloudflare Diagnostics 处置 · 2026-08-18

Cloudflare 的 AI Agent Diagnostics 面板（Beta）Quick Wins 报 3/5，缺两项。

| 条目 | 处置 |
| --- | --- |
| Content Signals | ✅ `src/pages/robots.txt.ts` 加 `Content-Signal: search=yes, ai-input=yes, ai-train=yes`，五组 user-agent 规则各一份，附三行中文注释解释三个信号。语法按 Cloudflare 官方博客核对：放在 `User-agent:` 之后、`Allow:` 之前 |
| Markdown Negotiation | ❌ **拒绝**。它要按 `Accept: text/markdown` 做内容协商，而 `wrangler.jsonc` 是纯 assets 部署、没有 `main`，静态资源层做不了协商 —— 要为这一项引入一个 Worker，让每个请求都过一遍 JS。而它想解决的「给 AI 干净的纯文本」，站点已经用 `/llms.txt` + `/llms-full.txt` + RSS 全文覆盖了 |

**为什么三项 Content Signal 全填 yes**：`Allow` 管「能不能抓」，`Content-Signal` 管「抓到之后
能拿来干什么」，是两件事。既然 §7.2 已经逐个点名放行 GPTBot / Google-Extended，实际立场就是
全部允许，含糊其辞没有意义。规范里省略某项明确表示「不表态」—— 对爬虫等于什么都没说。

**Security Overview 面板报的三条（Bot Fight Mode / AI Labyrinth / security.txt）是 8 月 9 日的
陈旧扫描数据**，三条在 §I 都已处置：前两条明确拒绝并留了理由，security.txt 早已上线且
`verify-build.mjs` 有过期守卫。下次看到不要重新判断一遍。

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
