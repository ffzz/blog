---
title: 在堪培拉找 IT 工作，Security Clearance 到底是什么
description: 堪培拉的 IT 招聘广告里藏着另一套筛选体系。这篇笔记整理了 Security Clearance 的等级划分、申请流程、调查范围和长期义务，资料来自澳大利亚政府公开文件。
pubDate: 2026-08-09
tags: ['career', 'security-clearance', 'canberra']
---

在堪培拉找 IT 工作，有件事特别磨人：每看到一个岗位，都得先把那一长串招聘广告从头读到尾，确认它到底要不要 security clearance。

写法还五花八门——Baseline、NV1、NV2、PV、TS-PA，缩写一个接一个：

> Australian citizenship required.
>
> Must be eligible to obtain and maintain a security clearance.
>
> Active NV1 clearance required.

有时候读着读着人就兴奋起来，技术栈对得上，年限也对得上，职责描述几乎像是照着自己的简历写的，结果拉到最下面，小字里一句 must hold a Baseline clearance，戏立刻就散了。

没有澳大利亚公民身份，在堪培拉找 IT 工作确实难，能投的岗位一下子少掉一大块。

这套制度到底怎么运作、门槛卡在哪一环，网上的说法零零散散，还有不少互相矛盾。我把官方文件翻了一遍，整理成这篇笔记分享出来。

## Security Clearance 是一段可以被收回的信任关系

很多人第一次听说 security clearance，会把它想象成无犯罪证明的升级版，或者一张可以像 AWS 认证一样自己报名考的证书。两种理解都不准确。

Clearance 更接近政府在某个时间点对一个人作出的判断：这个人是否适合被赋予接触政府机密信息、系统或资源的信任。官方文件把它定义为一种 assurance——基于当次审查完成的确认，而不是一劳永逸的通行证。持证人、雇主、审查机构三方都要持续对这份信任负责，等级也是由岗位实际接触的内容决定，跟职级或资历没有必然关系。

同样是 Software Engineer，在普通商业 SaaS 公司可能完全不需要 clearance；给政府写处理 PROTECTED 数据的系统，可能要 Baseline；进入 SECRET 环境，要 NV1；再往上，是国防和情报系统的 NV2、PV。哪怕手上已经握着 NV2，也不代表可以随意翻看所有 TOP SECRET 文件——政府始终按 need-to-know 原则放行，只有工作确实需要的部分才能碰，职级高、clearance 高或者纯粹好奇，都不算理由。[1]

## 五个等级，一个正在被替换的顶层

| 等级 | 通常允许持续访问的最高分类 |
| --- | --- |
| 无 clearance | 未分类信息，仅标记 OFFICIAL 或 OFFICIAL:SENSITIVE 不会自动触发审查要求 |
| Baseline | PROTECTED |
| Negative Vetting Level 1（NV1） | SECRET，特定情况下可临时接触 TOP SECRET |
| Negative Vetting Level 2（NV2） | TOP SECRET |
| Positive Vetting（PV） | TOP SECRET，含获授权的 caveated resources |
| TOP SECRET–Privileged Access（TS-PA） | TOP SECRET 及获授权的 caveated resources，正逐步替代 PV，由 ASIO 内设的 TS-PA Vetting Authority 管理 |

"Negative Vetting"这个名字容易让人误会成"审查不合格"，其实只是历史上沿用下来的等级名称。另外有个容易被忽略的细节：某些岗位即便不直接处理密级信息，也可能因为本身属于 position of trust 而要求 clearance，不能只看系统里数据标了什么密级就判断这份工作要不要审查。[1][6]

## 有 PR 为什么还不够

申请澳大利亚政府 security clearance，普通资格要求同时满足两条：是澳大利亚公民；拥有可以核查的背景，也就是 checkable background。所有 clearance 都必须由政府机构或获得授权的企业担保，个人既不能为自己担保，也没法自己掏钱向 AGSVA 买一个 NV1。[1][2]

PR 给的是在澳大利亚长期居住和工作的权利，通常替代不了 clearance 要求的公民身份。确实存在针对非公民的 citizenship waiver，但它从来不是常规求职路径。机构通常只有在存在 exceptional business need 时才会考虑：这个人对完成关键任务是必要的，岗位没法重新设计以避开涉密内容，没有合适的澳大利亚公民能顶上，申请人的国籍关系跟岗位不存在明显的利益冲突，或者申请人是 PR 且正在积极申请入籍。就算机构批了 waiver，也不保证 clearance 一定通过——waiver 通常跟具体岗位和机构绑定，有期限、要复核，换一份工作基本要重新论证。2025 年的 PSPF 更新还明确禁止把多个资格豁免叠加使用。[3]

所以对大多数 PR 求职者来说，更现实的判断是：在正式成为公民之前，别把 citizenship waiver 当成职业规划的主路径，它是给机构关键需求开的例外，不是为普通候选人准备的通道。

## 一个先有鸡还是先有蛋的问题

个人没法提前申请 clearance。只有当某个政府机构或合资格企业已经打算把你安排到确实需要 clearance 的岗位时，申请才能启动。正常顺序是先投岗位、被选中或拿到 conditional offer、雇主担保，然后才开始 clearance assessment，而不是反过来先考出一张 clearance 再到处找工作。

2026 年版 PSPF 甚至专门写明：政府机构按 merit principle 招聘时，不该只因候选人当下没有 clearance 就把人筛掉——只要对方愿意并且有能力在正式入职前通过审查，就不该在被选中之前先要求持证。这也是为什么 APS 的招聘广告经常写"must be able to obtain and maintain"而不是要求已经持有。

但政府 contractor 和咨询公司的招聘现实往往更直接，广告直接写"active NV1 required"。常见的原因是项目已经启动，客户要人马上进 secure environment，公司没时间等几个月，也不想承担候选人审查失败、项目延期的风险。堪培拉其实并存着两个招聘市场：政府直招更倾向先按 merit 选人再发起审查，contractor 市场则更像是在买一种"可以立刻部署"的能力，active clearance 是这份能力的一部分。持有 active NV1 的开发者能立刻进客户环境，在 contractor 市场也因此往往更容易拿到面试。[7]

## 申请由雇主发起

真正的申请流程一般由雇主发起。机构担保你之前，通常会先完成自己的 pre-employment screening——clearance 只负责判断你是否适合持有政府安全许可，不替代学历核实、工作经历核实或岗位适任性审查。像 Home Affairs 这样的部门，还会在 AGSVA clearance 之外单独要求 Employment Suitability Screening，意味着一个人可能通过了 AGSVA 的审查，却依然不满足某个机构自己的适任标准。[8]

机构决定担保后，大致流程是：Security Officer 在 myClearance 里发起申请，你收到邮件和短信，在系统里填资料、传文件，AGSVA 先检查材料是否齐全，再展开身份、背景、警方、旅行、财务、referee、数字足迹等调查，按等级安排安全面谈、财务审查或心理评估，vetting analyst 分析后交给授权 delegate 定夺，最后你和 sponsor 一起收到结果。

申请人通常有 20 个工作日填完 myClearance，AGSVA 的目标是在收到材料后 10 个工作日内确认完整性，只有材料齐全，正式的 assessment 计时才开始。材料缺失、referee 拖延、海外经历难以核实，都会拉长时间。如果某份文件确实拿不到，AGSVA 可能允许用 Statutory Declaration 补充，但这不等于所有查不到的经历都能靠一份声明糊弄过去——核心始终是能不能从独立、可靠的来源验证你的身份和经历。[1]

## 他们到底会查什么

听到"背景调查"，大多数人第一反应是犯罪记录。犯罪记录确实是其中一部分，但 vetting 的范围比普通的 National Police Check 宽得多：身份、出生证明、姓名变更、居住地址、工作教育经历、护照与海外旅行、犯罪诉讼记录、药物使用、组织成员身份和网络账号、家庭成员和伴侣、经常联系的海外人士、收入房产贷款和商业利益、公开的数字足迹、健康和心理状况，以及 referee 提供的信息。

需要覆盖多长的历史，取决于等级：Baseline 通常查过去 5 年的地址、工作、教育和旅行；NV1 和 NV2 通常是 10 年；PV 要求从 16 岁开始或者过去 10 年，取更长的那一段。Referee 的要求也逐级加码——Baseline 一般要一名 professional referee，覆盖最近 3 个月；NV1、NV2 在此基础上再加一名能评价过去 10 年的 personal referee；PV 则要一名 professional referee 加四名 personal referee，合计覆盖从 16 岁起或过去 10 年里更长的一段。Referee 一般有 15 个工作日提交报告，PV 的 referee 可能还要接受电话、视频或当面访谈。[1]

所以申请这件事该有的心理预期是：让一个独立的审查机构重建并核实你过去若干年的人生轨迹。传一份护照和无犯罪证明，离这个要求还差得远。

## 对移民来说，难的不是海外背景，是海外背景能不能被核实

对成年后才移居澳大利亚的人来说，教育、工作、居住和社会关系大半发生在海外。一个很自然的担心是：父母住在海外、经常跟原籍国的亲友联系、在海外读过书工作过，会不会就注定拿不到 clearance？

现行标准没有"出生在海外就自动失败"这条规则。真正被评估的是这段背景能不能从独立可靠的来源查证，是否存在解释不通的空白，是否存在可能跟澳大利亚国家利益冲突的忠诚、义务或利益关系，是否可能因为家庭、债务、资产而受到胁迫，以及申请人是否诚实、主动、完整地披露相关情况。PSPF 把 checkable background 定义为审查机构能够完成所需检查、并通过独立可靠来源验证身份和背景的状态——海外经历造成的信息缺口会降低审查信心，但不等于安全问题本身。雇主记录、学校记录、官方文件，以及真正了解当时情况的 referee，都能帮忙补上这块拼图。

这意味着提前整理会很有用：海外出生证明和户籍类文件、成绩单和毕业证明、过去雇主的合同或工资单、历年地址、旧护照和出入境记录、能覆盖海外阶段的可靠 referee、外文的结婚离婚或姓名变更文件，以及符合要求的 NAATI 英文翻译——AGSVA 明确要求非英文的出生证明、婚姻文件通常需要 NAATI translation。[1]

海外亲属和外国联系本身也不是自动的拒绝理由。2026 年的 Personnel Security Adjudicative Standard 采用的是 whole-person assessment：外国联系是否构成风险，要看关系性质、所在国家、对方身份、联系频率、是否可能制造利益冲突或胁迫，以及申请人是否主动报告。联系只是偶尔和日常性质、申请人在澳大利亚有长期而深厚的联系、双重国籍只是源于父母出生婚姻或旅行便利，这些都属于会降低风险的情况。真正该做的是把关系、频率、背景和现实影响讲清楚，不隐瞒，不淡化，不去猜调查人员想听什么。刻意切断正常的家庭关系，或者把背景修饰得"更澳大利亚"，都是白费力气。

## 有债务、看过心理医生，不等于不合格

审查标准评估七个主要风险领域：外部忠诚与关联、个人关系与行为、财务状况、酒精和药物使用、犯罪历史、安全态度及违规、情绪和心理健康。最终关注的品格是 honesty、trustworthiness、maturity、tolerance、resilience 和 loyalty，单一的不利信息不必然导致拒绝——审查人员还会看行为的严重程度、发生背景、频率、距今多久、当时年龄、是否已经改正，以及重演的可能性。[4]

房贷、车贷、信用卡这些正常商业贷款不会因为"有债务"三个字自动判定不合格。财务审查真正在意的是无能力或无意愿偿还债务、长期不履行财务义务、持续超支、来源不明的财富、逃税诈骗等非法财务行为、失控的赌博，以及财务状况是否让人容易被利诱或胁迫。如果困难来自失业、疾病、离婚或生意下滑，而申请人主动处理债务、制定还款计划、表现出负责任的态度，这些都算 mitigating factors。

心理健康也是同理。2026 年标准明确写道，不能仅仅因为一个人寻求 mental health counselling 就作负面推断，真正要评估的是某种状况是否实质影响判断力、可靠性或可信度，以及申请人是否遵守专业治疗建议。病情得到治疗、稳定受控、申请人主动求助，反而可能降低相关风险。"看过心理医生"和"不适合持有 clearance"之间画不了等号，倒是刻意隐瞒医疗情况，通常会制造一个全新的诚信问题。

隐瞒本身，往往比问题本身更危险。标准明确指出，拒绝配合审查、拒绝提供完整坦率真实的答案，通常会导致 clearance 被拒绝、撤销或申请终止，故意隐瞒也会被单独视为对诚信和判断力的质疑。面对一段不确定要不要申报的经历，比较稳妥的做法是问 Security Officer，而不是自己判断"应该查不到"。[4]

## 时间和钱：为什么一份 active clearance 这么值钱

截至这篇文章写的时候，AGSVA 公布的服务目标和实际表现大致是这样（工作日）：

| 等级 | 服务目标 | 公布的实际表现 |
| --- | --- | --- |
| Baseline | 20 天 | 约 26 天 |
| NV1 | 70 天 | 约 81 天 |
| NV2 | 100 天 | 约 103 天 |
| PV | 180 天 | 约 212 天 |

这些是总体数据，不是对某个申请人的保证——复杂背景、海外核查、材料缺失、referee 延迟，都可能让实际时间更长。计时从材料被确认完整那天开始，不包含申请人最初填写材料的 20 个工作日和完整性检查所需的时间。费用由 sponsoring entity 承担，不是申请人自己出钱；clearance 平时的维持没有额外费用，但重新审查、升级和 revalidation 会产生费用。[5][9]

从雇主的角度看，一个已经持有 active NV1 的候选人价值很直白：不用从零支付和组织初次审查，不用等几个月，项目启动时间更可预测，候选人最终拿不到 clearance 的风险更低，也能更快向政府客户部署人员开始计费。这就是为什么 active clearance 在 contractor 市场上有实打实的商业价值——但它不等于自动带来高薪，只是缩小了合资格候选人的范围，增加了进入某些项目的概率，最终薪资仍然取决于技术能力、岗位稀缺性、合同模式和市场供需。

## 拿到之后，不是一劳永逸

Clearance 有几种状态：active（有有效 sponsor，持有人和 sponsor 都在履行维护义务）、inactive（还在 revalidation period 内但暂时没有 sponsor）、expired（超过了 revalidation period）、ceased（因拒绝、撤销或不再符合资格等正式原因终止）。已经过期的 clearance，新雇主通常不能直接"接手"，得重新发起 initial assessment。

换工作时，新雇主必须在 myClearance 里注册 sponsorship interest；一个人可以在有真实业务需要时同时挂多个 sponsor，但每家机构都要正式登记。没有 sponsor 的 clearance 会变成 inactive，也可能被取消。所以 clearance 更准确的理解，是一项可以在符合条件时由新机构继续担保的政府安全资格——它从来不是完全属于个人、可以永久携带的私人财产。离开岗位后，你对原机构系统、办公区域和资料的访问会被撤销，就算 clearance 状态还能恢复，也不代表你还有权碰之前的项目。

持有期间还有持续的报告义务：姓名身份国籍变化、婚姻或重要关系变化、搬家或同住人员变化、频繁或可疑的外国联系、海外亲属、国际旅行、新增大额债务或意外获得大额资金、换工作、与海外个人或机构的外部商业活动、健康状况的重大变化、警方介入或纪律处分、非法药物或酒精问题、security incident，以及身份证件因网络攻击被替换。买房、结婚、出国当然不需要谁来审批，要做的只是按规则及时报告，交由 security team 判断是否需要进一步处理。政治立场也一样——单纯改变投票偏好不需要报告，但如果信念变化演变成主动支持或参与某项政治事业，就可能属于应报告事项。传统 AGSVA clearance 的常规复核周期目前是 Baseline 15 年、NV1 10 年、NV2 和 PV 5 到 7 年，出现具体风险时 AGSVA 也可以随时启动 review for cause。[1]

还有一条越来越硬性的规定：不要把 clearance 等级写在 LinkedIn 上。AGSVA 明确要求持证人不得在 LinkedIn 或其他社交媒体公开具体的 clearance level，就算是雇主、猎头或第三方替你发布，你也有责任要求删除，未处理的公开披露可能构成 reportable security incident。2025 年 10 月生效的 PSPF Direction 003-2025 进一步要求政府机构管理人员在网上披露涉密访问权限的风险，包括公开或暗示"本人持有 security clearance"这一事实本身。所以在公开简历、个人网站或社交媒体上，比较稳妥的做法是完全不提 Baseline、NV1、NV2、PV 或 TS-PA，也不暗示自己能访问哪类系统，真正需要提供信息的场合，走机构批准的渠道直接告诉 recruiter 或 Security Officer 就够了。[6][10]

## 值不值得，看你想要什么样的生活

对准备长期留在堪培拉、愿意进入政府或国防生态的人来说，clearance 打开的是一整片原本进不去的就业市场——政府部门、国防、国家安全、边境执法，以及为这些机构服务的咨询和 defence industry 岗位，都会明显增多。已经持证的人，contractor 市场上那些"immediate start"的机会也会随之打开。这份稀缺性本身就是一道职业壁垒：技术能力可以靠培训和项目经验提升，active clearance 却需要真实岗位、机构担保、时间和持续维护，对有紧急项目需求的公司来说很值钱——不过这更像一种部署上的优势，不是技术水平的认证。一些岗位还会给额外补贴，比如 ASIO 在 2026 年一则 TS-PA Vetting Authority 的招聘里，就给出了维持 TS-PA 的 7.5% allowance，只是那个岗位同时明确不提供 work-from-home。

代价也是真实的。第一是门槛本身——不是公民，这条路基本走不通，成为公民之后还得先找到愿意担保的岗位，对刚进入劳动力市场的新移民来说，这是个明显不对等的起点。第二是隐私，vetting 涉及的很多信息平时不会主动告诉雇主：家庭关系、海外联系、财务状况、药物使用、心理健康、旅行记录、网络账号，这些受 Privacy Act 保护，但申请过程本身仍然侵入性很强。第三是工作方式受限——处理涉密资源的工作通常不能在普通家庭网络或公共空间完成，等级越高、系统越敏感，完全 remote 的可能性往往越低，这对喜欢 remote work、经常旅行或想在不同国家生活的人尤其麻烦。第四是公开作品受限，很多工作没法写进 portfolio，连项目性质都不能细说，加上 clearance 本身也不能公开展示，在政府生态之外的市场上会更难证明自己做过什么。第五是技术路径依赖，部分项目确实用得上前沿的 cloud、data 和分布式系统，但也有项目困在 legacy systems、采购周期和严格 change control 里，长年在封闭环境维护特定系统又没法对外展示成果，技术能力容易慢慢跟全球产品公司和 startup 市场脱节。第六是职业惯性——拿到 active clearance 后最容易拿到的下一份工作往往还是 security-cleared role，几年下来人脉、履历和薪资预期都可能高度绑定 Canberra government market，这不一定是坏事，但最好是主动选的，而不是不知不觉被路径锁定。

## 一条比较现实的路径

还没拿到公民身份的阶段，找"代办 clearance"的课程或服务基本是浪费钱——个人没法自我担保，把 clearance 包装成能买到的职业证书的说法，都绕开了核心的 sponsor 问题。这个阶段能做的是：在不需要 clearance 的公司积累真实澳洲经验，提升技术能力和英文沟通，保存完整的工作、教育、地址和旅行记录，维持稳定且解释得清的财务状况，跟过去的主管和长期朋友保持联系，为将来的 referee 留条线，再按自己的情况规划公民身份申请。

拿到公民身份之后，优先投写着"Australian citizenship required, must be eligible to obtain and maintain a security clearance"的岗位，通常比死盯"active NV1 required"划算——前一种更可能愿意为合适但还没有 clearance 的候选人发起申请。政府直招、graduate program，以及有能力先把新人安排到 unclassified work 的大机构，都比要求立刻上项目的小 contractor 更适合当入口。

材料可以在收到申请邀请之前就准备好：过去 5 到 10 年的地址时间线、每段工作和教育经历、海外旅行记录、护照、出生公民婚姻和姓名变更文件、海外文件的 NAATI 翻译、能覆盖相应时期的 referee、海外亲属信息、财务状况，以及任何需要解释的问题。填申请时把目标定成"完整、一致、可验证"，而不是"让自己看起来毫无问题"——后者恰恰是审查最警觉的东西。拿到 clearance 之后，弄清楚当前 sponsor 是谁、clearance 处于什么状态、哪些变化需要报告，然后记得：clearance level 不要出现在 LinkedIn、个人网站或任何公开简历上。

把这些资料翻完，我的感觉是：security clearance 既不是有些人说的那种翻不过去的墙，也不是拿到公民身份就自动到手的东西。它是一套规则明确、代价也明确的制度。先把规则弄清楚，再决定要不要走进去，比看到一行"NV1 required"就直接划走，重要得多。

---

*这篇文章是我根据澳大利亚政府公开资料整理的笔记，讨论的是一般性规则，不是专业建议，也不构成对任何个案结果的保证。具体岗位、审查、报告和信息披露要求，请以 sponsoring entity、Security Officer、相关 Authorised Vetting Agency 以及当时有效的 PSPF 为准。*

## 参考资料

1. [AGSVA Security Clearance Applicant Guide Book](https://www.agsva.gov.au/sites/default/files/2025-05/AGSVASecurityClearanceApplicantGuideBookMar2025.pdf)
2. [Overview of AGSVA Security Clearances](https://support.ausclear.au/articles/overview-of-agsva-security-clearances)
3. [PSPF Policy 12 — Eligibility and suitability of personnel](https://www.protectivesecurity.gov.au/sites/default/files/pspf-persec-12-eligibility-suitability-personnel.pdf)
4. [PSPF Publications Library](https://www.protectivesecurity.gov.au/publications-library)
5. [AGSVA — Key performance indicators](https://www.agsva.gov.au/about/key-performance-indicators)
6. [AGSVA — Social media compliance](https://www.agsva.gov.au/clearance-holders/responsibilities/social-media-compliance)
7. [ASD — How to apply](https://www.asd.gov.au/careers/how-to-apply)
8. [Department of Home Affairs — Employment Suitability Screening](https://www.homeaffairs.gov.au/about-us/careers/vacancies/employment-suitability-clearance)
9. [AGSVA Service Level Charter](https://www.agsva.gov.au/sites/default/files/2024-01/2023-24-AGSVA-Service-Level-Charter-Signed-ASV.pdf)
10. [PSPF Direction 003-2025 — Online Disclosure of Security Clearance and National Security Information](https://www.protectivesecurity.gov.au/publications-library/direction-003-2025-online-disclosure-security-clearance-and-national-security-information)
