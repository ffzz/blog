---
title: 高内聚：内聚的 6 个等级和误判
description: 内聚常被定义成「模块内部元素的相似程度」。这个判据在最明显的违例上够用——把互不相干的方法扔进一个工具类，谁都看得出问题。它在生产代码里常常失效：按渠道分支的 handler 名字高度相似，却落在 1974 年那份等级表的偏低位置。
pubDate: 2026-08-20
tags: ['programming-thinking', 'design-principles', 'typescript']
---

> 《编程思想》系列第 2/10 篇。这一季的立论在[序章](/zh/notes/programming-taste-in-the-agent-era/)。
>
> AI 能替我们写的代码越来越多，程序员自己攒下的经验和底层判断因此更值钱。这个系列是我把这些上了年纪的原则重新翻出来，一条条查它们的出处、边界和失效场景的记录。温故而知新。

这一篇讲内聚：一个模块内部的几个元素，凭什么该放在一起。先从一段谁都能看出问题的代码说起。

## 一眼假的工具类

```ts
class RefundUtils {
  static formatCurrency(amount: number, currency: string): string { /* 给页面显示用 */ }

  static parseWebhookSignature(payload: string, secret: string): boolean { /* 校验支付渠道回调 */ }

  static logAuditEvent(event: string, actor: string): void { /* 写审计日志 */ }
}
```

三个方法之间没有任何关系。格式化金额服务的是展示层，校验签名服务的是渠道适配层，写审计日志服务的是合规。它们凑在一起，唯一的理由是「写代码的时候不知道放哪，就近扔进了这个类」。

三件不相关的事被塞进同一个文件。改一处不会影响另外两处，这正是问题所在：谁想用格式化金额，都得连带背上签名校验和审计日志的依赖。

怎么修其实很直接：把每个方法放回它真正服务的地方。`formatCurrency` 挪进展示层的格式化模块，`parseWebhookSignature` 挪进对应渠道的适配器，`logAuditEvent` 挪进审计模块。挪完之后，`RefundUtils` 这个名字本身也该消失，它只是「没想清楚放哪」的借口。

到这里可以把定义收进来：内聚量的是模块内部的元素有多相关。相关程度高，模块存在的理由就单一，读起来省力，无关的改动也不太会波及它。

这种代码在真实项目里比想象中少见，因为它太容易被发现。真正容易蒙混过关的违例，长得不一样。

## 内聚的六档从哪来

内聚和耦合出自 Stevens、Myers、Constantine 1974 年发在 IBM Systems Journal 上的《Structured Design》[1]。概念比文章更早，Constantine 1960 年代中期就在用了。

那篇文章给出六档内聚，从低到高：

| 档 | 名称 | 放在一起的理由 |
|---|---|---|
| 1 | 偶然 coincidental | 没有理由 |
| 2 | 逻辑 logical | 属于同一类操作，靠一个参数选分支 |
| 3 | 时间 temporal | 在同一个时刻执行 |
| 4 | 通信 communicational | 操作同一份数据 |
| 5 | 顺序 sequential | 前一步的输出是后一步的输入 |
| 6 | 功能 functional | 共同完成一件事 |

`RefundUtils` 落在第一档，没有理由。

今天教材上常见七档。第七档「过程内聚」是 Yourdon 和 Constantine 后来在书里补的，Myers 另外还加过两档，各版本并不一致。档位数目不用记，排序逻辑值得看：这张表排的是「这些元素被放在一起的理由有多强」，从毫无理由，到「共同完成一件事、少一个就完不成」。

## 逻辑内聚是生产代码最容易踩的坑

```ts
type RefundChannel = 'card' | 'wallet' | 'transfer' | 'credit'

class RefundHandler {
  async handle(channel: RefundChannel, req: RefundRequest): Promise<RefundResult> {
    switch (channel) {
      case 'card':     return this.handleCard(req)
      case 'wallet':   return this.handleWallet(req)
      case 'transfer': return this.handleTransfer(req)
      case 'credit':   return this.handleCredit(req)
    }
  }

  private async handleCard(req: RefundRequest)     { /* 调卡组织接口，异步回调才知道结果 */ }

  private async handleWallet(req: RefundRequest)   { /* 改一行余额，同步返回 */ }

  private async handleTransfer(req: RefundRequest) { /* 生成付款指令，等人工审批 */ }

  private async handleCredit(req: RefundRequest)   { /* 发一张券，不产生资金流动 */ }
}
```

和 `RefundUtils` 不一样，这个类不会被随手写出来，也不会被随手挪走。四个方法名字高度相似、都在处理退款，看上去正是「该放在一起」的样子。

按 1974 年那张表判，它是逻辑内聚，第二档：四个方法属于同一类操作，由一个参数决定走哪个分支。理由写在注释里：卡走异步回调，钱包同步改余额，线下转账要等人工审批，积分补偿不产生资金流动。四条路径的失败模式、耗时量级、幂等怎么做、能不能重试，没有一条是一样的，它们共享的东西只有「退款」这个名词。

改动的时候能看出代价。风控要求线下转账在审批前加一道额度校验，`handleTransfer` 要改，`handle` 的签名要多带一个审批上下文，另外三个本来互不相干的分支跟着被牵动。

顺着等级表往上走，做法是让每条路径各自成为一个模块，各自带着自己的超时、重试和幂等策略，调用方按渠道拿到对应的那一个。这样每个模块内部是第六档，加一道额度校验只动线下转账那一个文件。这个做法有它自己的代价，代价出现在需要给所有渠道同时加一个新操作的时候。第五篇讲开闭原则时会回到这段代码，到时候会看到，往哪个方向拆都要付钱。

`RefundUtils` 一眼假；这个类一眼真。两者相差五个等级，读代码的直觉却给出相反的信号。

## 时间内聚：更温和的妥协

```ts
async function initRefundContext() {
  await loadChannelConfig()
  await connectLedgerDb()
  warmUpFxRateCache()
  registerMetrics()
}
```

这四件事唯一的共同点是启动时都要做，落在第三档。

这一档比第二档温和，很多项目里它是合理的取舍。初始化顺序本身就是一种约束，写在一处反而看得见。要不要拆，看的是有没有人需要单独跑其中一件：测试想在不连数据库的情况下预热汇率缓存，这个函数就挡路了；没有这种需求，它可以一直这么放着。

## 拆分也会破坏内聚

```ts
// money.ts
export function add(a: Money, b: Money): Money {
  return { amount: a.amount + b.amount, currency: a.currency }
}

// currency-guard.ts
export function assertSameCurrency(a: Money, b: Money): void {
  if (a.currency !== b.currency) throw new CurrencyMismatchError(a, b)
}
```

两个模块，各自的职责都很清楚，调用方只要记得先 assert 再 add 就行。

这两件事没办法分开变。币种规则一改（比如允许按牌价换算之后再相加），`add` 的实现要跟着改；`add` 换成支持小数精度的实现，校验的时机也要跟着挪。它们共同完成的是同一件事：安全地把两笔钱加起来，落在第六档。拆开之后，最高的一档变成了两个各自清楚但配合脆弱的模块，序章立的第四条不变量（币种一致）也从类型系统里掉了出去，变成一条要靠人记住的调用顺序。

合起来写：

```ts
export function add(a: Money, b: Money): Money {
  if (a.currency !== b.currency) throw new CurrencyMismatchError(a, b)
  return { amount: a.amount + b.amount, currency: a.currency }
}
```

等级表的顶端是「共同完成一件事」，把共同完成的事拆散，位置会往下走。所以「更多的文件、更小的函数」并不是无条件成立的目标，只有拆完仍然让「总是一起变的东西」待在一起，拆分才算数。

## 模块边界：沿最可能变化的决策划

前面都是拿写好的代码去评级。更难的情况是代码还没写：手上一个新需求，边界画在哪。

这个问题在 Constantine 那篇之前两年就被回答过。Parnas 1972 年发在 CACM 上的《On the Criteria To Be Used in Decomposing Systems into Modules》[2] 给的判据是：先列出这个系统里最难、最可能变化的设计决策，然后让每个模块包住一个这样的决策，对外不暴露。

他还给了一条明确的反面建议：不要按数据流划分模块。按处理步骤切是多数人的第一反应，这正是他论证要避开的做法。

退款系统里最可能变的决策是每个渠道怎么确认钱到账了——卡靠异步回调，钱包同步返回，线下转账靠人工确认，积分不涉及到账。这四件事各自独立地变：卡组织换接口，审批流程改层级，积分规则调整，互不相干。边界沿渠道切。

「校验、扣款、记账、通知」这四步是数据流。沿它们切，四个渠道的校验逻辑会一起散进校验模块，扣款逻辑一起散进扣款模块，改一个渠道要动四个文件。这正是 Parnas 那条反面建议指的情况。

Parnas 自己写明了代价：按他这种方式拆出来的模块，在当年「一个模块等于一个或几个子程序」的实现假设下，多数情况会更慢。今天这个代价小了很多，但没有消失，多一层边界就是多一次调用和一次数据转换。

这条判据和前面用来评级的判据落在同一个地方，方向相反：一个用来审已经写好的代码，一个用来划还没写的边界。两个都问的是同一件事：什么东西会一起变。

## 等级表衡量理由，不是相似度

序章引过一项研究：163 名学生给同一个中等规模 Fortran 程序里的模块标注内聚和耦合等级，结果分歧很大[3]。这不是学生的问题：等级表描述的是「放在一起的理由」，理由取决于这段代码在什么系统里、谁在维护、接下来要往哪个方向长。

我原本以为内聚是个连续的程度，越高越好，中间没有台阶。查过 1974 年的原文之后改成：它是六个有序的档；`RefundHandler` 那种按渠道分支的写法，名字相似度拉满，落的却是偏低的位置。

我原本用「元素是否相似」审 `RefundHandler`，判定它内聚很高；换成「这些元素是否总是一起改」再审一次，结论反了过来。同一段代码给出两个结论，这让我对「靠读名字判断内聚」这件事谨慎了一些。

下一篇讲耦合，用的是同一个退款系统。

## 参考资料

1. [W. P. Stevens, G. J. Myers, L. L. Constantine, "Structured Design", IBM Systems Journal 13(2), 1974, 115–139](https://dl.acm.org/doi/10.1147/sj.132.0115)
2. [D. L. Parnas, "On the Criteria To Be Used in Decomposing Systems into Modules", Communications of the ACM 15(12), 1972, 1053–1058](https://dl.acm.org/doi/10.1145/361598.361623)（[全文 PDF](https://wstomv.win.tue.nl/edu/2ip30/references/criteria_for_modularization.pdf)）
3. [Difficulties using cohesion and coupling as quality indicators, Software Quality Journal](https://link.springer.com/article/10.1007/BF00590439)
