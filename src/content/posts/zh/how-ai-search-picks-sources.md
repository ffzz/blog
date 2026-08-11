---
title: AI 搜索凭什么引用你：GEO 的机制、证据和误解
description: GEO 和 AEO 的建议很多，其中对「被检索到」和「被引用」的区分并不总是清楚。这篇笔记把生成式搜索拆成六个环节，逐条核对各家厂商的官方披露、学术论文的原始数据，以及一些流传较广的说法。
pubDate: 2026-08-10
tags: ['ai', 'geo', 'seo']
---

这半年关于 GEO（Generative Engine Optimization）和 AEO（Answer Engine Optimization）的文章很多，其中一些结论互相矛盾。

一些文章建议写 llms.txt，另一些文章认为 AI 搜索很少读取它。结构化数据也有类似争议。关于 AI 引用与自然搜索结果的重合度，有研究给出 83% 的引用不在搜索前十名，也有研究给出 90% 的重合度。

这些数字使用的样本、分母和查询口径并不相同。

我核对了一批一手资料：各家厂商的官方文档、KDD 和 EMNLP 上的论文原文，以及几家研究机构的原始报告。不少争论都涉及同一个概念混淆：把「被 AI 找到」和「被 AI 引用」当成同一件事。

这两件事发生在不同的环节，影响因素也不同。把它们混在一起，可能会遇到「按照建议优化了内容，但一次都没被引用过」，也可能看到「没有专门优化，却经常被引用」。

## 生成式引擎是一条流水线

公开文档描述的是一套包含查询改写、检索、重排和生成的流程。

Google 官方文档里给出的机制是这样的：AI Overviews 和 AI Mode 用的是 RAG（retrieval-augmented generation，官方也叫 grounding），定义为「依靠我们的核心搜索排名系统来检索相关的、最新的网页」。同时可能触发 query fan-out，官方定义是「一组并发生成的相关查询」。你问「草坪除草怎么弄」，系统可能同时去搜除草剂、无化学除草方法，以及如何预防杂草。[1][2]

OpenAI 那边的描述也类似：ChatGPT 在使用第三方搜索服务时，「通常会把你的查询重写成一个或多个更有针对性的查询」再发出去。[5]

从网页到 AI 回答里的引用角标，可以概括为六个环节：

| 环节 | 发生了什么 | 可能受限的原因 |
| --- | --- | --- |
| 一、可抓取 | 各家的爬虫能不能拿到你的页面 | robots.txt 配置错了，或屏蔽了不该屏蔽的 bot |
| 二、可索引 | 页面进没进那个被检索的索引 | 常规的可索引性问题 |
| 三、被检索 | 某个子查询把你的页面捞了出来 | 内容和**子查询**不相关 |
| 四、进上下文 | 重排之后，你的片段挤进模型的上下文窗口 | 片段级相关性不够，被别人挤掉 |
| 五、被采用 | 模型写答案时使用了这段内容 | 具体性、可用性或可信度不足 |
| 六、被归因 | 生成的引用角标指向了你 | 引擎的归因实现可能出错 |

2026 年一篇把 GEO 形式化的论文指出，引用失败可能发生在 retrieval、fetching、parsing、attribution、generation 任意一环，因此可以把引用作为一条流水线来研究，而非单次排名事件。[12]

这个框架可以帮助区分前面几类看似矛盾的说法。

### 「83% 不在前十」的统计口径

Google 表示，它的生成式 AI 功能「植根于我们的核心搜索排名和质量系统」。[2] 多项研究则发现，许多 AI 引用链接不在自然结果前十。Ahrefs 用 15,000 条长尾查询做的测试里，只有 12% 的 AI 引用链接排在 Google 前十，其中 ChatGPT、Gemini、Copilot 各自约 8%，Perplexity 高一些，接近 29%。[16]

两类结论可以同时出现。fan-out 会派生出多个子查询，用户输入的原句只是查询起点。

一个页面可能对用户输入的原话排在第 80 名，却对系统自动派生出来的某个子问题排在第 2 名。它可能因为这个用户不可见的子查询进入引用候选。研究测的是「AI 引用的链接在原查询里排第几」，Google 说的是「检索走的是同一套排名系统」，两句话对应的查询可能不同。

因此，只围绕一个关键词优化，可能无法覆盖系统实际派生出的子查询。

### 抓取与引用是两个环节

第六个环节仍有较大不确定性。

Cloudflare 跟踪一个叫 crawl-to-refer 的比率：某家 AI 的爬虫每抓多少个页面，才给网站带回一个访问。在 2025 年 6 月 19 日到 26 日那一周的数据里，Anthropic 是 70,900:1，也就是每抓将近七万一千个页面才带回一次访问；同期 Mistral 是 0.1:1，带回的访问比抓取还多十倍。[18]

训练用的抓取不会产生引用，这是比率差异的一个来源。Cloudflare 也提醒了一个反方向的偏差：Claude 原生 App 带来的访问不带 Referer 头，其他原生 App 可能也一样，所以这些比率「可能被高估了，但高估多少不清楚」。这类比率是特定时间窗的快照，换一个时间段可能得到不同结果，适合用来观察量级差异，不适合作为稳定指标。

哥伦比亚大学 Tow Center 在 2025 年 3 月测试了八个 AI 搜索产品和 1600 次查询。测试方法是给出一段文章原文，让产品说出标题、日期、出版方和 URL。整体错误率超过 60%；Perplexity 的错误率为 37%，Grok-3 约为 94%。测试中还出现了编造链接、引用转载版本而非原始出处的情况。[19]

一些文章把这项研究的错误率写成 76.5%，但这个数字出自另一份报告：Tow Center 2024 年 11 月单独测试 ChatGPT Search 时，从 20 家出版方取了 200 条引文，其中 153 条的回答部分或完全错误，153/200 为 76.5%。[21] 把这个只针对 ChatGPT 的数字用于 2025 年 3 月那份八个引擎、1600 次查询的研究，会混淆两份研究的对象和样本。

混淆这两份研究，会造成数字与出处错配。后文还会讨论类似的口径问题。

## 各家厂商披露过什么

在本文核对的官方资料中，厂商披露主要集中在「通道层」：使用哪些爬虫、如何屏蔽、在哪里查看数据。关于为什么选择来源 A 而没有选择来源 B，也就是「排序层」，这些资料没有给出具体权重。

| 厂商 | 爬虫分工 | 公布 IP 段 | 官方优化指引 | 官方数据报告 |
| --- | --- | --- | --- | --- |
| Google | Googlebot、Google-Extended | 是 | 有，而且非常详细 | Search Console 生成式 AI 报告 |
| OpenAI | GPTBot、OAI-SearchBot、ChatGPT-User、OAI-AdsBot | 是（四个 JSON 端点） | 无 | 无 |
| Anthropic | ClaudeBot、Claude-SearchBot、Claude-User | 是 | 无 | 无 |
| Microsoft | Bingbot | 是 | 部分（sitemap / IndexNow） | Bing Webmaster Tools 的 AI Performance |
| Perplexity | PerplexityBot、Perplexity-User | 是 | 帮助中心级别 | 无 |

### Google：官方优化指引

Google 有两份相关文档：一份介绍 AI 功能和网站的关系[1]，一份是生成式 AI 优化指南[2]。

Google 给出的资格前提是：「要有资格出现在 AI Overviews 或 AI Mode 的支持链接里，页面必须被索引、且有资格带着 snippet 出现在 Google 搜索里。」文档接着写道：「没有额外要求，也不需要其他特殊优化。」[1]

2026 年 6 月 3 日，Search Console 上线了生成式 AI 性能报告，第一次把 AI Overviews、AI Mode 和 Discover 里的曝光单独拆出来看。[3] 报告给的维度是曝光量、页面、国家、设备和时间（可以细到小时），**没有点击、CTR 和查询词**。Google 说明了这是拆分展示而非新增数据，这部分曝光此前一直计入总的性能报告，同时表示会「随时间增加更多指标」。目前只向一部分网站开放。

同一天 Google 还宣布测试一个新开关，让网站自己决定要不要出现在生成式 AI 功能里、要不要为它们提供 grounding。[25] Google 表示「这个开关不会被用作这些生成式 AI 功能之外的搜索排名信号」，但选择退出的站点「不会从我们的生成式 AI 功能获得流量或曝光」。它先向英国的一部分网站所有者开放，Google 提到这与英国 CMA 等监管机构的沟通有关。这个开关和 Google-Extended 是两件事：后者管的是训练。

### OpenAI：不同用途的爬虫

OpenAI 把爬虫拆成了四个，各自用途不同：[4]

- **GPTBot**：训练基础模型。屏蔽它表示「网站内容不应被用于训练」
- **OAI-SearchBot**：为 ChatGPT 搜索建索引。官方文档写道「被 OAI-SearchBot 排除的站点不会出现在 ChatGPT 搜索的回答里」
- **ChatGPT-User**：用户在对话里触发的实时抓取。官方注明「robots.txt 规则可能不适用于」用户主动发起的动作
- **OAI-AdsBot**：广告落地页的安全校验，不用于训练

这四项设置彼此独立。屏蔽 GPTBot 不会同时屏蔽 OAI-SearchBot，反过来也一样。

OpenAI 的公开资料没有给出一般搜索场景的来源权重。购物场景公开了一组排序因素：与查询的相关性、库存、价格、评分和评价质量、商家是否为主要销售方、是否支持 Instant Checkout。网上的一些「ChatGPT 排名因素清单」来自对引用样本的逆向分析，属于外部推测，未获官方确认。

### Anthropic：三个爬虫，全部遵守 robots.txt

Anthropic 的支持文档同样列了三个爬虫：ClaudeBot（训练）、Claude-User（用户触发的抓取）、Claude-SearchBot（为搜索建索引），并逐个说明屏蔽后会发生什么。[6]

三个爬虫都遵守 robots.txt，包括用户触发的 Claude-User。OpenAI 和 Perplexity 则注明，用户主动发起的抓取可能不完全遵循 robots.txt。Anthropic 的文档写道：「Anthropic 使用不同的机器人，以实现网站所有者的透明度和选择权。」IP 段也已公布，可以用来验证流量来源。

这次核对也纠正了我之前看到的一条二手信息。那条信息称 Anthropic 不公布 IP 段，但官方文档写着：「如果爬虫的源 IP 在这份列表上，说明它确实来自 Anthropic。」这个例子说明，涉及厂商能力和配置时，二手资料需要回到官方文档核对。

### Microsoft：引用数据报告

2026 年 2 月 10 日，Bing Webmaster Tools 上线了 AI Performance 报告，展示内容在 Microsoft Copilot、Bing 的 AI 摘要以及部分合作集成里被引用的情况：被引用了多少次、引用了哪些 URL、随时间怎么变化。微软自己把它定位成「迈向 GEO 工具的早期一步」。[7] 3 月又扩展成可以把 grounding 查询映射到具体被引用的页面。

截至本文核查时，Bing AI Performance 是本文找到的、由厂商直接提供引用次数的产品。有验证过的站点就能使用，不用排队。

本文引用的微软文档给出两项内容建议：保持准确和更新；用 sitemap 加 IndexNow 维持新鲜度，其中 `lastmod` 用 ISO 8601 格式带时间戳，是关键的新鲜度信号，而 `changefreq` 和 `priority` 会被忽略。[8] 微软同时表示，没有任何工具能保证内容何时以何种方式出现在 AI 结果里。

### Perplexity：公开的爬虫资料

目前可查的官方资料主要是帮助中心里的爬虫说明：PerplexityBot 用于让站点出现在搜索结果里，Perplexity-User 是用户触发的抓取，公布 IP 段供 WAF 白名单使用。

关于 Perplexity 是否拥有自建的全网索引，公开资料没有给出完整说明。从爬虫文档和外部观察来看，它可能采用自建抓取加第三方搜索 API 的混合方式。Perplexity 尚未正式披露索引构成，因此这里只能记录为外部推断。

## 学界验证过什么

### KDD 2024 GEO 论文的结果与范围

许多 GEO 文章会引用 2024 年 KDD 上的 GEO: Generative Engine Optimization。[9] 它测试了九种优化手段，下面是论文 Table 1 的原始数据（基线为 19.3）：

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

按这两个指标，Quotation Addition 分别比基线高 41%（词数指标）和 28%（主观印象指标）。在该实验中，加引文、加统计数据、标注来源和改善流畅度的指标均高于基线。

Keyword Stuffing 的词数指标低于基线，为 17.7 对 19.3。论文在 Perplexity.ai 上复现时，堆关键词的结果也比基线低约 10%。

论文还报告了分领域结果：统计数据在法律政务类问题中表现较好，权威语气和引文在辩论与历史类问题中表现较好，来源标注在事实类问题中表现较好。「改善流畅度 + 加统计数据」这一组合比任何单一策略高 5.5% 以上。

### 三个实验限制

第一，论文里的「生成式引擎」是模拟的。它的流程是拿 Google 搜索的前五条结果，喂给 GPT-3.5-turbo 生成带引用的回答。这不是真实的 ChatGPT，也不是 AI Overviews。论文初稿是 2023 年 11 月，属于 GPT-3.5 时代。

第二，主观印象分是 GPT-3.5 自己用 G-Eval 打的，LLM 既当选手又当裁判。

第三，整个实验的前提是「你已经在前五条检索结果里」。

论文优化的是第五个环节：页面已经被检索并进入上下文之后，如何提高模型采用这段内容的概率。它没有覆盖第一到第三个环节，也就是抓取、索引和检索。

2026 年一篇相关论文也在限制章节中界定了这一范围：它的评测使用固定的五个候选页面加一个待优化页面，「假设该页面已被接纳，不建模上游的检索和排序」，因此优化的是「条件于已被检索的引用概率」，而非端到端的检索加生成。[14]

因此，这类实验结论适用于内容已被检索后的环节，不足以概括完整链路。

### 可见度在不同来源之间重新分配

论文 Table 2 常被用来说明低排名来源可能获得更大增幅：排名第五的网站使用 Cite Sources 之后，可见度增加了 115.1%。

下面是所有来源同时做优化时的完整结果：

| 方法 | 第 1 名 | 第 2 名 | 第 3 名 | 第 4 名 | 第 5 名 |
| --- | --- | --- | --- | --- | --- |
| Cite Sources | −30.3% | +2.5% | +20.4% | +15.5% | +115.1% |
| Quotation Addition | −22.9% | −7.0% | +3.5% | +25.1% | +99.7% |
| Statistics Addition | −20.6% | −3.9% | +8.1% | +10.0% | +97.9% |

在这组结果中，第五名增加 115.1% 的同时，第一名下降了 30.3%。论文呈现的是不同来源之间的可见度重新分配。

这提示了一项限制：当多个页面同时采用类似策略时，单个页面的相对增幅可能缩小。讨论单页收益时，需要把竞争条件一并考虑。

### 2026 年的后续研究

- 一篇批判性综述系统梳理了 GEO 相关工作的方法论问题，主张把「可见度」当作一个向量而非单一名次来处理，并对基准设定的因果推断提出质疑[11]
- 另一篇把 GEO 拆成 citation selection（有没有被选中）和 citation absorption（被用得多深）两个阶段，附了可复现性检查清单，并用一些反直觉的结果对「引用次数越多越好」这类启发式提出质疑[12]
- 还有一篇指出既有评测大多是非竞争性设定，而真实场景存在少数几个引用位之间的竞争，页面需要与其他候选一起比较，单独达到「足够好」并不能保证被引用[13]

这些研究都在补充早期结论的适用条件。不过其中多数仍是 preprint，涉及效果量级的结论仍有待更多验证。

### 对抗性方法及其风险

EMNLP 2024 的一篇论文显示，向页面注入对抗性文本可以影响会话式搜索引擎的来源排序，提高低排名产品的位置，而且攻击能迁移到 Perplexity.ai 这样的真实产品上。作者把它作为安全问题研究，并指出会话式搜索的黑盒性质和缺少可解释排序机制带来了脆弱性。[10]

这类方法可能违反厂商的 spam 政策，也会带来声誉风险。论文的研究目的在于揭示安全问题，不宜将实验结果直接视为优化建议。

## 为什么各家数字差异很大

「AI 引用有多少来自自然结果前十名」这个问题，不同机构给出的答案是 12%、17%、32%、38%、48%、54%、90%，差了七倍多。

这些差异可以从四个方面理解：

一、rank window 不同。前 10、前 20、前 100 对应不同的统计范围。同一家机构报出的「54%」和「17%」，可能一个是前 100 的重合度，一个是前 10 的。

二、分母不同。「所有引用里有多少条排进了前 10」和「有多少个 AI 回答里至少包含一条排前 10 的链接」，是两个数，后者通常更高。seoClarity 分析了 36.2 万条美国桌面查询，同一份数据里两个口径同时成立：按引用算，与前 10 的重合率是 32%；按 AI 回答算，有 90% 的回答里至少含一条排进前 10 的链接，扩到前 20 是 94%，而当 AI 只引用一个来源时是 89%。[17]

同一份研究里，32% 和 90% 对应不同的分母。引用这些数字时需要同时说明计算口径。

三、测量方法在变。Ahrefs 自己说明过，他们的解析方法有改进，能识别到更多引用，所以观察到的「下降」里有一部分是测得更全，而不是 Google 行为变了。[16]

四、真实变化和测量变化可能同时存在。趋势方向通常比具体倍数更容易判断。

阅读 GEO 相关数字时，可以核对三项信息：样本、分母和 rank window。缺少这些信息时，单独引用数字容易产生误导。

## 常见说法与现有证据

下面每一条我都尽量配上官方原话或者实验数据。

**一、llms.txt 是 AI 时代的 robots.txt。**

Google 的官方文档写道：「你不需要创建新的机器可读文件、AI 文本文件、标记或 Markdown 来出现在 Google 搜索里。」以及：「这么做既不会损害也不会提升你在 Google 搜索里的可见度或排名，因为 Google 搜索会忽略它们。」[2]

Google 的 John Mueller 更早就说过「目前没有任何 AI 系统使用 llms.txt」，还补了一句「看服务器日志就一目了然」，并把它类比成早已被弃用的 keywords meta 标签：「这是网站所有者自己声称的网站内容，为什么不直接看网站？」Gary Illyes 也表示 Google 不支持也没有计划支持。[20]

不过 Google 只能代表 Google。要判断其他引擎读不读，得看服务器日志，而这方面的大样本数据结论相当一致：

| 研究 | 样本 | 结果 |
| --- | --- | --- |
| Ahrefs（2026 年 5 月）[22] | 137,210 个域名 | 28% 的站点放了 llms.txt，其中 **97% 当月零请求** |
| OtterlyAI（90 天）[23] | 62,100 次 AI bot 请求 | 只有 84 次访问 llms.txt，占 0.1% |
| SE Ranking[24] | 约 30 万域名 | 采用率 10.13%，未观察到对 AI 引用的影响 |

在 Ahrefs 的样本中，**没有 AI bot 请求不存在的 llms.txt。**请求不存在的 llms.txt 而产生的 404 中，98% 来自人（同行在查竞品）。这表示样本中的 AI bot 没有主动查找该文件。

在被访问到的那 3% 里，检索类爬虫（与搜索引用相关的爬虫）占 1.1% 的请求，agent 类占 10.5%，训练类占 5.3%，其中 Claude-Code 的抓取量超过了任何一个检索爬虫。

这些数据对应两类用途。Anthropic、Stripe、Cloudflare、Vercel 都把 llms.txt 作为**编码 agent** 的路由层维护，日志数据也记录了这类访问。对于**搜索可见度**，现有研究没有观察到提升，检索类爬虫在相关请求中所占比例很低。

如果读者主要使用 Claude Code 或 Cursor 阅读文档，llms.txt 可以提供路由信息。对于提高 ChatGPT 回答中的引用率，目前还缺少支持证据。

**二、加 schema.org 结构化数据能提升 AI 可见度。**

Google 文档写道：「生成式 AI 搜索不要求结构化数据，也没有什么特殊的 schema.org 标记需要你添加。」[2]

结构化数据对富媒体摘要等传统场景仍然有用，Google 也建议保持结构化数据和可见文本一致。现有文档没有把它列为提升 AI 可见度的额外手段。

**三、要把内容切成小块喂给 AI。**

Google 文档写道：「没有要求把你的内容拆成小碎片给 AI 用。」[2]

**四、要为 AI 写一种特殊文体，或者存在一个理想字数。**

Google 文档写道：「你不需要专门为生成式 AI 搜索用某种特定方式写作。」以及「不存在理想的页面长度。」[2]

**五、GEO 是取代 SEO 的新学科。**

检索使用核心搜索排名系统和同一个索引。Google 表示生成式 AI 功能「植根于核心搜索排名和质量系统」，因此常规 SEO 实践依然相关。[2] 第三到第六个环节增加了新的变量，第一、二个环节仍然沿用抓取和索引的基本前提。

**六、堆关键词、堆 FAQ 能提高被引概率。**

GEO 论文的实验中，堆关键词的指标为 17.7，低于不优化的 19.3；在模拟引擎和 Perplexity 上都观察到这一结果。[9]

**七、藏白字、写隐藏 prompt 能操纵 AI。**

EMNLP 2024 的论文在实验中验证了这种操纵方式。[10] 论文将其作为安全问题研究。将它用于实际优化可能违反 spam 政策，也会带来声誉风险。

**八、屏蔽 GPTBot 既能保护内容，又不影响可见度。**

OpenAI 的文档写道「每一项设置都独立于其他项」，Anthropic 的三个爬虫也各自独立。[4][6] 屏蔽 OAI-SearchBot 后，站点不会出现在 ChatGPT 搜索的回答里。拒绝训练并保留搜索可见度，需要分别配置具体的 user-agent。

**九、某某 GEO 工具能看到内部指标。**

Google 文档写道：「要警惕那些承诺排名成功、或声称使用 Google『内部』指标的第三方工具。没有任何第三方工具能访问我们的内部排名或 AI 系统。」[2]

**十、被抓取就等于被看见。**

在 Cloudflare 的时间窗内，Anthropic 的 crawl-to-refer 比率为约七万一千次抓取对应一次访问。[18] 训练类抓取也不会直接产生引用。因此，日志中的 AI 爬虫数量和内容出现在 AI 回答中的次数属于不同指标。

**十一、针对 fan-out 的子查询批量做页面。**

Google 文档写道，为每一个可能的查询变体单独创建内容、主要目的是操纵排名或生成式 AI 回答的，违反 scaled content abuse 垃圾内容政策；文档还表示「页面数量多并不会让网站更优质或更相关」。[2]

**十二、多刷第三方提及就能提升 AI 可见度。**

相关证据和限制见下一节。

## 有证据支持的动作

我按证据强度分成三级，用来区分官方说明、有限实验和尚未验证的推测。

### A 级：厂商官方说明

- 按爬虫分别配置 robots.txt，区分训练、搜索和用户触发三类用途。拒绝训练并保留 AI 搜索可见度时，需要分别设置 user-agent
- 保证页面可索引、可带 snippet。这是 Google 文档列出的 AI Overviews 和 AI Mode 支持链接资格前提[1]
- 用官方报告查看数据。本文核查到的一手数据源包括 Search Console 的生成式 AI 报告[3]和 Bing Webmaster Tools 的 AI Performance[7]
- 用 sitemap 加 IndexNow 维持新鲜度，`lastmod` 写 ISO 8601 带时间戳[8]
- 保持结构化数据和可见文本一致。Google 的要求是内容一致性，没有将其描述为 AI 可见度提升因素

### B 级：有实验支持，但有明确边界

这一级来自 GEO 论文，适用前提是页面已经被检索并进入上下文，对应第五个环节。

- 加具体的统计数据、可核查的引文和来源标注。在论文的词数指标中，这三项高于基线，最高增幅为 41%[9]
- 改善行文流畅度和可读性，+15% 到 30%
- 论文观察到不同领域的结果有差异：统计数据在法律政务类表现较好，权威语气和引文在辩论历史类表现较好，来源标注在事实类表现较好
- 争取真实的第三方提及。Ahrefs 研究了 75,000 个品牌（DR>40），无链接的品牌网络提及与 AI Overviews 提及的 Spearman 相关系数约 0.664，而外链（引用域）只有 0.218；后续扩展研究里 YouTube 提及最高，约 0.737[15]

最后这条有两个限制。其一，Ahrefs 强调相关不等于因果：大品牌通常同时拥有更多提及和更高的 AI 可见度，品牌规模可能是共同影响因素。其二，Google 写道「不要去追求网络上不真实的『提及』」[2]。这组证据支持关注自然产生的第三方报道，但无法证明增加提及本身会带来更高的 AI 可见度。

### C 级：推测，尚未验证

段落开头先给答案再展开、一个小标题对应一个论点、把结论写成可独立成立的句子。

这些做法符合分块检索的直觉：如果检索按片段进行，一个自足的片段可能更容易被单独取用。不过，没有厂商确认过这一点，我也没有找到严格的对照实验。Google 还表示不需要为 AI 使用特殊的写作方式。

我自己会采用这种写法，因为我认为它也方便人类读者理解。这个选择来自写作偏好，不属于已验证的 AI 优化方法。

还有一条我原本考虑放进 A 级，核对资料后改放到 C 级：**把要被引用的正文做服务端渲染。**常见理由是 LLM 侧的抓取器可能无法可靠执行客户端 JS。这个说法在从业者中流传较广，但我核对的五家厂商文档都没有说明是否渲染 JS。缺少厂商说明和对照实验时，服务端渲染只能作为有待验证的建议。

## 目前的证据边界

把这些资料翻完，我的结论比开始时保守得多。

目前证据较直接支持两点：进入索引是参与后续检索和引用的前提；在有限的实验条件下，具体且可核查的内容，包括真实的数据、引文和清楚的来源，能提高被引用的概率。

其他许多说法混合了不同环节的结论、相关关系和因果关系，部分数字在传播中也脱离了原有口径。

GEO 论文的 Table 2 还显示，可见度会在不同来源之间重新分配。当多个页面采用相似方法时，单个页面的相对收益可能缩小。内容是否具有可引用价值，例如是否提供独有的一手数据、是否把问题解释清楚，仍会影响竞争结果。

这个结论很朴素，但它较少依赖某一家厂商当前的算法，也更可能在模型更新后继续适用。

---

*这篇文章是我根据公开资料整理的笔记。AI 搜索的机制变化很快，文中引用的官方文档、报告和论文都标注了来源和时间，请以各厂商当时有效的官方文档为准。文中标注为「未验证」的部分表示：我没有找到支持它的证据，也没有找到反对它的证据。*

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
