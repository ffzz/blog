---
title: AI 搜索凭什么引用你：GEO 的机制、证据和误解
description: GEO 和 AEO 的建议满天飞，但很少有人区分「被检索到」和「被引用」。这篇笔记把生成式搜索拆成六道闸门，逐条核对各家大厂的官方披露、学术论文的原始数据，以及那些流传甚广却站不住脚的说法。
pubDate: 2026-08-10
tags: ['ai', 'geo', 'seo']
---

这半年关于 GEO（Generative Engine Optimization）和 AEO（Answer Engine Optimization）的文章多到看不过来，麻烦的是它们互相矛盾。

有人说要写 llms.txt，有人说那玩意儿根本没人读。有人说结构化数据是 AI 时代的入场券，有人说加了等于没加。有人说 AI 引用的内容 83% 不在搜索前十名，所以传统 SEO 已死；也有人拿出数据说重合度高达 90%，SEO 一切照旧。

这些说法不可能同时成立。

我把能找到的一手资料翻了一遍：各家大厂的官方文档、KDD 和 EMNLP 上的论文原文、几家研究机构的原始报告。大部分争论其实源自同一个混淆，就是把「被 AI 找到」和「被 AI 引用」当成了同一件事。

这两件事发生在不同的环节，由不同的因素决定。分不清它们，就会出现「我按照建议优化了内容，但一次都没被引用过」，也会出现「我什么都没做，却经常被引用」。

## 生成式引擎是一条流水线

当你问 ChatGPT 或者 Google 一个问题，系统并没有在某个「AI 索引」里给网页打分排序，然后挑出第一名。

Google 官方文档里给出的机制是这样的：AI Overviews 和 AI Mode 用的是 RAG（retrieval-augmented generation，官方也叫 grounding），定义为「依靠我们的核心搜索排名系统来检索相关的、最新的网页」。同时可能触发 query fan-out，官方定义是「一组并发生成的相关查询」。你问「草坪除草怎么弄」，系统可能同时去搜除草剂、无化学除草方法，以及如何预防杂草。[1][2]

OpenAI 那边的描述也类似：ChatGPT 在使用第三方搜索服务时，「通常会把你的查询重写成一个或多个更有针对性的查询」再发出去。[5]

也就是说，从你的网页到 AI 回答里的一个角标，中间要过六道闸门：

| 闸门 | 发生了什么 | 卡在这里的原因 |
| --- | --- | --- |
| 一、可抓取 | 各家的爬虫能不能拿到你的页面 | robots.txt 配置错了，或屏蔽了不该屏蔽的 bot |
| 二、可索引 | 页面进没进那个被检索的索引 | 常规的可索引性问题 |
| 三、被检索 | 某个子查询把你的页面捞了出来 | 内容和**子查询**不相关 |
| 四、进上下文 | 重排之后，你的片段挤进模型的上下文窗口 | 片段级相关性不够，被别人挤掉 |
| 五、被采用 | 模型写答案时真的用了你这段 | 内容不够具体、不好用、不可信 |
| 六、被归因 | 生成的引用角标指向了你 | 引擎的归因实现本身就不可靠 |

这个「管线视角」不是我编的。2026 年一篇把 GEO 形式化的论文明确指出，引用失败可能发生在 retrieval、fetching、parsing、attribution、generation 任意一环，因此应当把引用当作一条流水线来研究，而不是一次排名事件。[12]

有了这六道闸门，前面那些互相矛盾的说法就有了各自的位置。

### 那个「83% 不在前十」的悖论

Google 说得很清楚：它的生成式 AI 功能「植根于我们的核心搜索排名和质量系统」。[2] 但一堆研究测出来，AI 引用的链接大部分不在自然结果前十。Ahrefs 用 15,000 条长尾查询做的测试里，只有 12% 的 AI 引用链接排在 Google 前十，其中 ChatGPT、Gemini、Copilot 各自约 8%，Perplexity 高一些，接近 29%。[16]

两边都没说谎。fan-out 意味着你排的是子查询的名次，而用户输入的那句话只是起点。

一个页面可能对用户输入的原话排在第 80 名，却对系统自动派生出来的某个子问题排在第 2 名。它被引用，是因为它赢了那个你根本看不见的子查询。研究测的是「AI 引用的链接在原查询里排第几」，Google 说的是「检索走的是同一套排名系统」，两句话根本不在同一个查询上。

盯着一个关键词做优化，收益之所以越来越低，也是这个原因：你在优化一个 AI 可能压根没搜的词。

### 被抓取不等于被引用

第六道闸门比大多数人想的更脆弱。

Cloudflare 跟踪一个叫 crawl-to-refer 的比率：某家 AI 的爬虫每抓多少个页面，才给网站带回一个访问。在 2025 年 6 月 19 日到 26 日那一周的数据里，Anthropic 是 70,900:1，也就是每抓将近七万一千个页面才带回一次访问；同期 Mistral 是 0.1:1，带回的访问比抓取还多十倍。[18]

差距主要来自商业模式，训练用的抓取本来就不产生引用。Cloudflare 自己提醒了一个反方向的偏差：Claude 原生 App 带来的访问不带 Referer 头，其他原生 App 估计也一样，所以这些比率「可能被高估了，但高估多少不清楚」。这类比率是特定时间窗的快照，换一周就会变，不适合拿来当稳定指标，能说明的是量级差异。

归因层本身也不可靠。哥伦比亚大学 Tow Center 在 2025 年 3 月测了八个 AI 搜索产品、1600 次查询，方法是给出一段文章原文，让它说出标题、日期、出版方和 URL。整体错误率超过 60%；表现最好的 Perplexity 也错了 37%，Grok-3 错到约 94%。它们还会编造链接、引用转载版本而不是原始出处。[19]

顺带一提，很多文章会把这项研究的错误率写成 76.5%。这个数字本身是真的，但出自另一份报告：Tow Center 2024 年 11 月单独测 ChatGPT Search 的那次，从 20 家出版方取了 200 条引文，其中 153 条的回答部分或完全错误，153/200 正好是 76.5%。[21] 常见的失误是把这个只针对 ChatGPT 的数字，安在 2025 年 3 月那份八个引擎、1600 次查询的研究头上。两份研究的对象和样本都不一样。

数字对、出处错，是 GEO 话题里最常见的一类失真，后面会专门说。

## 各家大厂到底披露过什么

所有厂商的披露都集中在「通道层」：哪个爬虫、怎么屏蔽、去哪看数据。至于为什么选了 A 不选 B，也就是「排序层」，没有任何一家公开过。

| 厂商 | 爬虫分工 | 公布 IP 段 | 官方优化指引 | 官方数据报告 |
| --- | --- | --- | --- | --- |
| Google | Googlebot、Google-Extended | 是 | 有，而且非常详细 | Search Console 生成式 AI 报告 |
| OpenAI | GPTBot、OAI-SearchBot、ChatGPT-User、OAI-AdsBot | 是（四个 JSON 端点） | 无 | 无 |
| Anthropic | ClaudeBot、Claude-SearchBot、Claude-User | 是 | 无 | 无 |
| Microsoft | Bingbot | 是 | 部分（sitemap / IndexNow） | Bing Webmaster Tools 的 AI Performance |
| Perplexity | PerplexityBot、Perplexity-User | 是 | 帮助中心级别 | 无 |

### Google：唯一给了正面指引的

Google 有两份文档值得逐字读：一份讲 AI 功能和网站的关系[1]，一份是专门的生成式 AI 优化指南[2]。后者信息量最大，也最少被引用。

硬性前提只有一条：「要有资格出现在 AI Overviews 或 AI Mode 的支持链接里，页面必须被索引、且有资格带着 snippet 出现在 Google 搜索里。」然后紧跟一句：「没有额外要求，也不需要其他特殊优化。」[1]

2026 年 6 月 3 日，Search Console 上线了生成式 AI 性能报告，第一次把 AI Overviews、AI Mode 和 Discover 里的曝光单独拆出来看。[3] 报告给的维度是曝光量、页面、国家、设备和时间（可以细到小时），**没有点击、CTR 和查询词**。Google 说明了这是拆分展示而非新增数据，这部分曝光此前一直计入总的性能报告，同时表示会「随时间增加更多指标」。目前只向一部分网站开放。

同一天 Google 还宣布测试一个新开关，让网站自己决定要不要出现在生成式 AI 功能里、要不要为它们提供 grounding。[25] 官方明确说「这个开关不会被用作这些生成式 AI 功能之外的搜索排名信号」，但选择退出的站点「不会从我们的生成式 AI 功能获得流量或曝光」。它先向英国的一部分网站所有者开放，Google 提到这与英国 CMA 等监管机构的沟通有关。这个开关和 Google-Extended 是两件事：后者管的是训练。

### OpenAI：分得很清楚，但只到通道为止

OpenAI 把爬虫拆成了四个，各自用途不同：[4]

- **GPTBot**：训练基础模型。屏蔽它表示「网站内容不应被用于训练」
- **OAI-SearchBot**：为 ChatGPT 搜索建索引。官方明说「被 OAI-SearchBot 排除的站点不会出现在 ChatGPT 搜索的回答里」
- **ChatGPT-User**：用户在对话里触发的实时抓取。官方注明「robots.txt 规则可能不适用于」用户主动发起的动作
- **OAI-AdsBot**：广告落地页的安全校验，不用于训练

其中最要紧的一句是「每一项设置都独立于其他项」。屏蔽 GPTBot 不会同时屏蔽 OAI-SearchBot，反过来也一样。

至于为什么选这个来源而不是那个，OpenAI 从来没公布过权重。唯一的例外是购物场景，那里公开了排序因素：与查询的相关性、库存、价格、评分和评价质量、商家是否为主要销售方、是否支持 Instant Checkout。你在网上看到的那些「ChatGPT 排名因素清单」，都是别人从引用样本里逆向推测的，不是官方确认的。

### Anthropic：三个爬虫，全部遵守 robots.txt

Anthropic 的支持文档同样列了三个爬虫：ClaudeBot（训练）、Claude-User（用户触发的抓取）、Claude-SearchBot（为搜索建索引），并逐个说明屏蔽后会发生什么。[6]

有个细节我想单独拎出来：三个爬虫全部遵守 robots.txt，包括用户触发的那个 Claude-User。这一点比 OpenAI 和 Perplexity 更严格，那两家都注明用户主动发起的抓取可能不完全遵循 robots.txt。文档原话是「Anthropic 使用不同的机器人，以实现网站所有者的透明度和选择权」。IP 段也是公布的，可以用来验证流量真伪。

这里我要更正一下自己：核查之前我看到的二手资料说 Anthropic 不公布 IP 段，但官方文档里写着「如果爬虫的源 IP 在这份列表上，说明它确实来自 Anthropic」。二手信息在这个话题里真的不能信。

### Microsoft：唯一直接给引用数据的

2026 年 2 月 10 日，Bing Webmaster Tools 上线了 AI Performance 报告，展示内容在 Microsoft Copilot、Bing 的 AI 摘要以及部分合作集成里被引用的情况：被引用了多少次、引用了哪些 URL、随时间怎么变化。微软自己把它定位成「迈向 GEO 工具的早期一步」。[7] 3 月又扩展成可以把 grounding 查询映射到具体被引用的页面。

这是目前唯一一个由厂商直接告诉你「你被 AI 引用了多少次」的产品。有验证过的站点就能用，不用排队。

内容侧的官方建议只有两条：保持准确和更新；用 sitemap 加 IndexNow 维持新鲜度，其中 `lastmod` 用 ISO 8601 格式带时间戳，是关键的新鲜度信号，而 `changefreq` 和 `priority` 会被忽略。[8] 微软同时明确表示，没有任何工具能保证内容何时以何种方式出现在 AI 结果里。

### Perplexity：披露最薄的一家

只有帮助中心级别的爬虫说明：PerplexityBot 用于让站点出现在搜索结果里，Perplexity-User 是用户触发的抓取，公布 IP 段供 WAF 白名单使用。

一个常见误解是 Perplexity 有一个自建的全网索引。从它公开的爬虫说明和外部观察来看，更像是自建抓取加第三方搜索 API 的混合，但 Perplexity 没有正式披露过索引构成，这一条只能算外部推断。

## 学界到底验证过什么

### 那篇被当成圣经的论文，和它真正说的话

绝大多数 GEO 文章的源头，是 2024 年 KDD 上的 GEO: Generative Engine Optimization。[9] 它测了九种优化手段，我把论文 Table 1 的原始数据抄在这里（基线为 19.3）：

| 方法 | Position-Adjusted Word Count | Subjective Impression |
| --- | --- | --- |
| 不做优化（基线） | 19.3 | 19.3 |
| Keyword Stuffing（堆关键词） | 17.7 | 20.2 |
| Unique Words（生僻词） | 20.5 | 20.4 |
| Authoritative（权威语气） | 21.3 | 22.9 |
| Easy-to-Understand（简化表达） | 22.0 | 20.5 |
| Technical Terms（术语） | 22.7 | 21.4 |
| Cite Sources（标注来源） | 24.6 | 21.9 |
| Fluency Optimization（改善流畅度） | 24.7 | 21.9 |
| Statistics Addition（加统计数据） | 25.2 | 23.7 |
| Quotation Addition（加引文） | 27.2 | 24.7 |

最好的方法比基线高 41%（词数指标）和 28%（主观印象指标）。加引文、加统计数据、标注来源、改善流畅度都有效。

堆关键词是唯一一个低于不优化的，17.7 对 19.3，做了还不如不做。论文在 Perplexity.ai 这个真实引擎上复现时，这个结论同样成立：堆关键词比基线差约 10%。

论文还给了分领域的结论：法律政务类问题吃统计数据，辩论和历史类吃权威语气和引文，事实类问题吃来源标注。组合起来效果最好的是「改善流畅度 + 加统计数据」，比任何单一策略高 5.5% 以上。

### 但有三个限制，几乎没人提

第一，论文里的「生成式引擎」是模拟的。它的流程是拿 Google 搜索的前五条结果，喂给 GPT-3.5-turbo 生成带引用的回答。这不是真实的 ChatGPT，也不是 AI Overviews。论文初稿是 2023 年 11 月，属于 GPT-3.5 时代。

第二，主观印象分是 GPT-3.5 自己用 G-Eval 打的，LLM 既当选手又当裁判。

第三，整个实验的前提是「你已经在前五条检索结果里」。

论文优化的是第五道闸门：你已经被检索到、已经进了上下文，怎么让模型更愿意用你这一段。它完全没有触及第一到第三道闸门，也就是绝大多数人真正卡住的地方。

这不是我的解读。2026 年一篇沿着这条线做的论文在限制章节里写得明明白白：它的评测用固定的五个候选页面加一个待优化页面，「假设该页面已被接纳，不建模上游的检索和排序」，因此优化的是「条件于已被检索的引用概率」，而非端到端的检索加生成。[14]

把第五道闸门的结论当成整条链路的答案来卖，是目前 GEO 内容里最普遍的错误。

### 均衡器效应是零和的

论文 Table 2 经常被引用为「小站的翻身机会」：排名第五的网站用了 Cite Sources 之后，可见度涨了 115.1%。

但完整的表格是这样的，注意这是所有来源同时做优化时的结果：

| 方法 | 第 1 名 | 第 2 名 | 第 3 名 | 第 4 名 | 第 5 名 |
| --- | --- | --- | --- | --- | --- |
| Cite Sources | −30.3% | +2.5% | +20.4% | +15.5% | +115.1% |
| Quotation Addition | −22.9% | −7.0% | +3.5% | +25.1% | +99.7% |
| Statistics Addition | −20.6% | −3.9% | +8.1% | +10.0% | +97.9% |

第五名涨的那 115%，很大程度上是从第一名掉的那 30% 里来的。这是可见度的重新分配，总量并没有增加。

推论并不乐观：当所有人都开始做 GEO，收益会回归。这一点我几乎没在任何一篇 GEO 推广文里见过。

### 2026 年的后续研究，方向是往回收的

- 一篇批判性综述系统梳理了 GEO 相关工作的方法论问题，主张把「可见度」当作一个向量而非单一名次来处理，并对基准设定的因果推断提出质疑[11]
- 另一篇把 GEO 拆成 citation selection（有没有被选中）和 citation absorption（被用得多深）两个阶段，附了可复现性检查清单，并指出一些反直觉的结果，直接挑战「引用次数越多越好」这类浅层启发式[12]
- 还有一篇指出既有评测大多是非竞争性设定，而真实场景是少数几个引用位的竞争，一个页面必须赢过其他候选，而不是自己「足够好」[13]

方向很一致：越研究越发现，早期那些干净的结论有很强的前提条件。而且这几篇多数还是 preprint，量级结论都该按未定论看待。

### 对抗性的那条路：能走通，但不该走

EMNLP 2024 有一篇论文证明，往页面里注入对抗性文本可以操纵会话式搜索引擎的来源排序，把低排名的产品顶上去，而且攻击能迁移到 Perplexity.ai 这样的真实产品上。作者的框架是把它当作安全问题来研究，指出会话式搜索是黑盒，没有可解释的排序机制，因此特别脆弱。[10]

技术上可行，不代表它是一种可用的策略。这属于各家 spam 政策直接打击的范围，而且一旦被发现，声誉代价远大于短期收益。

## 为什么各家数字互相打架

「AI 引用有多少来自自然结果前十名」这个问题，不同机构给出的答案是 12%、17%、32%、38%、48%、54%、90%，差了七倍多。

在你相信任何一个之前，先看这四个原因：

一、rank window 不同。前 10、前 20、前 100 是三个完全不同的问题。同一家机构报出的「54%」和「17%」，可能一个是前 100 的重合度，一个是前 10 的。

二、分母不同。「所有引用里有多少条排进了前 10」和「有多少个 AI 回答里至少包含一条排前 10 的链接」，是两个数，后者天然高得多。seoClarity 分析了 36.2 万条美国桌面查询，同一份数据里两个口径同时成立：按引用算，与前 10 的重合率是 32%；按 AI 回答算，有 90% 的回答里至少含一条排进前 10 的链接，扩到前 20 是 94%，而当 AI 只引用一个来源时是 89%。[17]

同一份研究，32% 和 90% 都是真的。挑哪个数字讲故事，取决于你想证明什么。

三、测量方法在变。Ahrefs 自己说明过，他们的解析方法有改进，能识别到更多引用，所以观察到的「下降」里有一部分是测得更全，而不是 Google 行为变了。[16]

四、确实存在真实趋势。方向不假，倍数存疑。

这个方法论问题比结论本身更值得记住。看到 GEO 相关的数字，先问三件事：样本是什么、分母是什么、rank window 是多少。问不出来的，就当没看到。

## 流行的错误认识

下面每一条我都尽量配上官方原话或者实验数据。

**一、llms.txt 是 AI 时代的 robots.txt。**

Google 的官方文档写得很直接：「你不需要创建新的机器可读文件、AI 文本文件、标记或 Markdown 来出现在 Google 搜索里。」以及：「这么做既不会损害也不会提升你在 Google 搜索里的可见度或排名，因为 Google 搜索会忽略它们。」[2]

Google 的 John Mueller 更早就说过「目前没有任何 AI 系统使用 llms.txt」，还补了一句「看服务器日志就一目了然」，并把它类比成早已被弃用的 keywords meta 标签：「这是网站所有者自己声称的网站内容，为什么不直接看网站？」Gary Illyes 也表示 Google 不支持也没有计划支持。[20]

不过 Google 只能代表 Google。要判断其他引擎读不读，得看服务器日志，而这方面的大样本数据结论相当一致：

| 研究 | 样本 | 结果 |
| --- | --- | --- |
| Ahrefs（2026 年 5 月）[22] | 137,210 个域名 | 28% 的站点放了 llms.txt，其中 **97% 当月零请求** |
| OtterlyAI（90 天）[23] | 62,100 次 AI bot 请求 | 只有 84 次访问 llms.txt，占 0.1% |
| SE Ranking[24] | 约 30 万域名 | 采用率 10.13%，未观察到对 AI 引用的影响 |

Ahrefs 那份里有个细节最能说明问题：**没有任何 AI bot 去请求不存在的 llms.txt。它们根本不会主动找这个文件。**去请求不存在的 llms.txt 的 404 里，98% 来自人（同行在查竞品）。

在被访问到的那 3% 里，检索类爬虫（也就是决定你会不会被引用的那一类）只占 1.1% 的请求，agent 类占 10.5%，训练类占 5.3%，其中 Claude-Code 单独一个的抓取量就超过了任何一个检索爬虫。

所以这里要分清两件事。llms.txt 对**编码 agent** 确实有用，Anthropic、Stripe、Cloudflare、Vercel 都把它当成 agent 的路由层在维护，这个用途有日志数据支持。但它对**搜索可见度**没有观察到效果，因为负责搜索引用的那类爬虫基本不读它。

如果你的读者主要是拿 Claude Code 或 Cursor 来读你文档的开发者，写 llms.txt 是合理的。如果你的目标是让 ChatGPT 在回答里引用你，目前没有证据支持它。

**二、加 schema.org 结构化数据能提升 AI 可见度。**

官方原话：「生成式 AI 搜索不要求结构化数据，也没有什么特殊的 schema.org 标记需要你添加。」[2]

注意别矫枉过正。结构化数据对富媒体摘要等传统场景仍然有用，Google 也建议保持结构化数据和可见文本一致。它只是不构成 AI 可见度的额外杠杆。

**三、要把内容切成小块喂给 AI。**

官方原话：「没有要求把你的内容拆成小碎片给 AI 用。」[2]

**四、要为 AI 写一种特殊文体，或者存在一个理想字数。**

官方两句话：「你不需要专门为生成式 AI 搜索用某种特定方式写作。」以及「不存在理想的页面长度。」[2]

**五、GEO 是取代 SEO 的新学科。**

检索走的是同一套核心排名系统、同一个索引。Google 明确说生成式 AI 功能「植根于核心搜索排名和质量系统」，因此常规 SEO 实践依然相关。[2] 真正变化的是第三到第六道闸门的规则，第一、二道闸门一点没变，而后者恰恰是最多人卡住的地方。

**六、堆关键词、堆 FAQ 能提高被引概率。**

GEO 论文实测：堆关键词 17.7，不优化 19.3。做了比不做还差，在模拟引擎和 Perplexity 上都成立。[9]

**七、藏白字、写隐藏 prompt 能操纵 AI。**

技术上确实可行，EMNLP 2024 那篇论文证明了。[10] 但那是安全研究的结论，不能直接当成优化方法用。它属于 spam 政策打击范围，且有明确的声誉风险。

**八、屏蔽 GPTBot 既能保护内容，又不影响可见度。**

OpenAI 明说「每一项设置都独立于其他项」，Anthropic 也是三个爬虫各自独立。[4][6] 屏错对象的后果很直接：屏了 OAI-SearchBot，你就不会出现在 ChatGPT 搜索的回答里。想拒绝训练但保留搜索可见度，就得精确到具体的 user-agent。

**九、某某 GEO 工具能看到内部指标。**

官方原话：「要警惕那些承诺排名成功、或声称使用 Google『内部』指标的第三方工具。没有任何第三方工具能访问我们的内部排名或 AI 系统。」[2]

**十、被抓取就等于被看见。**

crawl-to-refer 比率说明了差距有多大：Anthropic 那一周抓了将近七万一千个页面才带回一次访问。[18] 而且训练类抓取无论如何都不会变成引用。日志里一堆 AI 爬虫，和你在 AI 回答里出现，是两件独立的事。

**十一、针对 fan-out 的子查询批量做页面。**

Google 明说：为每一个可能的查询变体单独造内容、主要目的是操纵排名或生成式 AI 回答的，违反 scaled content abuse 垃圾内容政策，而且「页面数量多并不会让网站更优质或更相关」。[2]

**十二、多刷第三方提及就能提升 AI 可见度。**

这条稍微微妙，放到下一节说。

## 有证据支持的动作

我按证据强度分成三级。这个分级本身比清单更有用，因为大部分 GEO 文章的毛病在于把三级混在一起，说得同样确定。

### A 级：厂商官方明示

- 按爬虫分别配置 robots.txt。分清训练、搜索、用户触发三类用途，别用一条规则一刀切。想拒绝训练但保留 AI 搜索可见度，就精确写 user-agent
- 保证页面可索引、可带 snippet。这是 Google 明说的、进入 AI Overviews 和 AI Mode 的唯一硬性前提[1]
- 用官方报告看真实数据。Search Console 的生成式 AI 报告[3]和 Bing Webmaster Tools 的 AI Performance[7]，这是目前仅有的两个一手数据源
- 用 sitemap 加 IndexNow 维持新鲜度，`lastmod` 写 ISO 8601 带时间戳[8]
- 保持结构化数据和可见文本一致。注意这句是「保持一致」，不是「加了能提升 AI 可见度」

### B 级：有实验支持，但有明确边界

这一级全部来自 GEO 论文，请始终记得它优化的是第五道闸门，前提是你已经被检索到了。

- 加具体的统计数据、可核查的引文、来源标注。论文里最强的三项，最好的达到基线的 +41%[9]
- 改善行文流畅度和可读性，+15% 到 30%
- 按领域挑策略。法律政务类吃统计数据，辩论历史类吃权威语气和引文，事实类吃来源标注
- 争取真实的第三方提及。Ahrefs 研究了 75,000 个品牌（DR>40），无链接的品牌网络提及与 AI Overviews 提及的 Spearman 相关系数约 0.664，而外链（引用域）只有 0.218；后续扩展研究里 YouTube 提及最高，约 0.737[15]

最后这条要连着它的两个限制一起读。其一，Ahrefs 自己强调相关不等于因果，大品牌天然既有更多提及也有更多 AI 可见度，真正起作用的可能是品牌本身强，提及只是伴随现象。其二，Google 明确写了「不要去追求网络上不真实的『提及』」[2]。所以能推出的结论是做出值得被报道的东西，而不是去买提及。

### C 级：合理，但没有被验证

段落开头先给答案再展开、一个小标题对应一个论点、把结论写成可独立成立的句子。

这些做法符合分块检索的直觉：如果检索是按片段进行的，那么一个自足的片段确实更可能被单独取用。但没有厂商确认过，也没有我能找到的严格对照实验。而且 Google 已经说了不需要为 AI 特别写作。

我自己会这么写，理由是它对人类读者也更好，跟 AI 无关。这个区别值得说清楚。

还有一条我原本想放进 A 级、后来自己降下来的：**把要被引用的正文做服务端渲染。**理由是 LLM 侧的抓取器普遍不能可靠执行客户端 JS。这个说法在从业者中流传很广，我也认为它多半成立，但翻遍五家的文档，没有一家写明自己渲不渲染 JS。既然拿不出厂商原话，它就只能待在 C 级——这篇文章要是自己都做不到这点，前面那些话就白说了。

## 边界在哪

把这些资料翻完，我的结论比开始时保守得多。

目前真正能被证据支持的只有两件事：进不了索引，后面所有讨论都没有意义；内容的具体性和可核查性，包括真实的数据、真实的引文、清楚的来源，在有限的实验条件下确实提升了被引用的概率。

剩下的大部分，要么是把第五道闸门的结论当成了整条链路的答案，要么是相关性被当成了因果，要么是数字在传播中失了真。

还有一层：GEO 论文自己的 Table 2 说明这是零和的。当所有人都用同一套手法，收益回到原点。到那时候还能剩下的差异，只有内容本身值不值得被引用，也就是你有没有别人没有的一手数据，有没有真的把一件事讲清楚。

这听起来像句正确的废话，但它是这批资料里唯一一个不依赖任何厂商算法、也不会在下一次模型更新后失效的结论。

---

*这篇文章是我根据公开资料整理的笔记。AI 搜索的机制变化很快，文中引用的官方文档、报告和论文都标注了来源和时间，请以各厂商当时有效的官方文档为准。文中标注为「未验证」的部分就是字面意思：我没有找到支持它的证据，也没有找到反对它的证据。*

## 参考资料

1. [Google Search Central — AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)
2. [Google Search Central — Google's guide to optimizing for generative AI features on Google Search](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
3. [Google Search Central Blog — Introducing Search Generative AI performance reports in Search Console](https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports)
4. [OpenAI — Bots（爬虫文档）](https://developers.openai.com/api/docs/bots)
5. [OpenAI Help Center — ChatGPT Search](https://help.openai.com/en/articles/9237897-chatgpt-search)
6. [Anthropic Support — Does Anthropic crawl data from the web, and how can site owners block the crawler?](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)
7. [Bing Webmaster Blog — Introducing AI Performance in Bing Webmaster Tools](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview)
8. [Bing Webmaster Blog — Keeping Content Discoverable with Sitemaps in AI Powered Search](https://blogs.bing.com/webmaster/July-2025/Keeping-Content-Discoverable-with-Sitemaps-in-AI-Powered-Search)
9. [Aggarwal et al. — GEO: Generative Engine Optimization (KDD 2024)](https://arxiv.org/abs/2311.09735)
10. [Pfrommer et al. — Ranking Manipulation for Conversational Search Engines (EMNLP 2024)](https://aclanthology.org/2024.emnlp-main.534/)
11. [A Critical Survey of Generative Engine Optimization](https://arxiv.org/pdf/2607.14035)
12. [From Citation Selection to Citation Absorption: A Measurement Framework for Generative Engine Optimization Across AI Search Platforms](https://arxiv.org/pdf/2604.25707)
13. [What Gets Cited: Competitive GEO in AI Answer Engines](https://arxiv.org/html/2605.25517)
14. [Think Before Writing: Feature-Level Multi-Objective Optimization for Generative Citation Visibility](https://arxiv.org/pdf/2604.19113)
15. [Ahrefs — An Analysis of AI Overview Brand Visibility Factors (75K Brands Studied)](https://ahrefs.com/blog/ai-overview-brand-correlation/)
16. [Ahrefs — How Much Do AI Citations Overlap With Google's Top 10?](https://ahrefs.com/blog/ai-search-overlap/)
17. [seoClarity — The Overlap Between AI Overviews and Organic Rankings](https://www.seoclarity.net/research/aio-rankings-overlap)
18. [Cloudflare Blog — The crawl before the fall of referrals](https://blog.cloudflare.com/ai-search-crawl-refer-ratio-on-radar/)
19. [Jaźwińska & Chandrasekar, Tow Center — AI Search Has a Citation Problem (CJR, 2025-03-06)](https://www.cjr.org/tow_center/we-compared-eight-ai-search-engines-theyre-all-bad-at-citing-news.php)
20. [Search Engine Journal — Google Says LLMs.txt Is Purely Speculative For Now](https://www.searchenginejournal.com/google-says-llms-txt-is-purely-speculative-for-now/577576/)
21. [Jaźwińska & Chandrasekar, Tow Center — How ChatGPT Search (Mis)represents Publisher Content (CJR, 2024-11)](https://www.cjr.org/tow_center/how-chatgpt-misrepresents-publisher-content.php)
22. [Ahrefs — We Analyzed 137K Sites: 97% of llms.txt Files Never Get Read](https://ahrefs.com/blog/llmstxt-study/)
23. [OtterlyAI — llms.txt and AI Visibility: Results from OtterlyAI's GEO Study](https://otterly.ai/blog/the-llms-txt-experiment/)
24. [SE Ranking — LLMs.txt: Why Brands Rely On It and Why It Doesn't Work](https://seranking.com/blog/llms-txt/)
25. [Google — New opportunities, control and insights for website owners](https://blog.google/products-and-platforms/products/search/new-controls-website-owners/)
