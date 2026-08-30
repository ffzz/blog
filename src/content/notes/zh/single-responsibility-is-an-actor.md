---
title: 单一职责：职责不是一件事，是一个会来提要求的人
description: 单一职责常被讲成「一个类只做一件事」，这句话没法用来判断任何代码。Martin 2014 年把话说明白了：这条原则是关于人的。把退款服务里混在一起的四类需求拆开之后，会发现它只是内聚与耦合的另一种说法。
pubDate: 2026-08-21
tags: ['programming-thinking', 'design-principles', 'typescript']
---

> 《编程思想》系列第 4/10 篇。这一季的立论在[序章](/zh/notes/programming-taste-in-the-agent-era)。

财务提了个改动：退款金额一律向下取整到分，不用四舍五入。改动本身只有三行，改完上线当天，客服后台的退款金额显示多了两位小数，审计日志里那笔记录的金额格式也跟着变了。

那三行代码没写错，问题出在它们待的地方：

```ts
class RefundService {
  async submit(req: RefundRequest): Promise<RefundResult> {
    const amount = this.computeAmount(req)
    await this.ledger.record(req.orderId, amount)
    await this.audit.log(req, amount)
    await this.notify.refunded(req.userId, amount)

    return {
      amount,
      status: 'done',
      display: `已退 ¥${(amount / 100).toFixed(2)}`,
    }
  }
}
```

一个 `submit`，四类人会分别来找它。

## 一个方法里住着四拨人

把这个方法的每一行按「谁会来要求改它」分开看：

| 这行在做的事 | 谁会来提要求 | 什么时候来提 |
|---|---|---|
| `computeAmount` | 财务 | 舍入规则、优惠分摊、币种换算变了 |
| `audit.log` | 合规 | 留存字段变了，或者监管要求加一条 |
| `notify.refunded` | 运营 | 文案、推送渠道、触达时机调整 |
| `display` 那一行 | 客服 | 后台表格换了列，或者要加个字段 |

这四拨人互不通气，也不会同时提要求。财务调整舍入规则的那天，合规没有变需求，客服也没有。但三行改动同时影响了后两者的输出。

Martin 用过一个比喻：把车送进修车厂修电动车窗，取车时窗户好了，车却打不着火。你大概不会再回去。

## Martin 2014 年补上的那句话

单一职责最初的说法是「一个模块应该有且只有一个修改的理由」。理由这个词太空，于是有人问：修 bug 算不算一个理由？重构算不算？

2014 年 5 月，Martin 在博客上专门写一篇来回答这个问题，答案是一句加粗的话：**这条原则是关于人的**[1]。

他举的例子是一个 `Employee` 类，`calculatePay` 归 CFO 管，`reportHours` 归 COO 管，`save` 归 CTO 管。三个方法住在一个类里，意味着 CTO 要求改数据库写法的时候，有可能让 COO 要的那份报表坏掉。COO 不会关心你的 `save` 方法写了什么，他只会得出一个结论：以后别再动那个类了。

那篇文章里还有一句更好用的表述：

> 把因为同一个理由而变的东西放在一起，把因为不同理由而变的东西分开。

## 这句话听完有点耳熟

Martin 自己接着写：想一下就会发现，这只是内聚和耦合的另一种说法。

前两篇做的事和这里是同一件。第 2 篇判「这些元素会不会一起改」，第 3 篇判「一条连接改动时波及多远」，这一篇问的是同一个问题的另一面：会来提这个要求的人是谁。理由来自人，人按自己的节奏提要求，所以按人切开就顺带得到了内聚和耦合。

这也解释了为什么这条原则没法靠看代码长度来判断。一个四百行的类可能只服务于一拨人，一个二十行的类可能同时被三拨人惦记。

## 名字可能是借来的

同一篇博文里还有个细节。Martin 写下这些想法是在 1990 年代末，他原话是：

> 我有种模糊的感觉，这个名字是我从 Bertrand Meyer 那里顺来的，但我一直没能确认。

提出者自己说不清命名的来路，这跟序章里查到的情况是一致的：七条原则出自六拨互不相干的人，被摆在一起是后人整理的结果。SOLID 这个缩写也是 Michael Feathers 在大约 2004 年拼出来的，比原则本身晚了十几年[1]。

## 按人切开之后

还是那个退��服务，拆完之后每个文件只回答一拨人的问题：

```ts
// finance/refund-amount.ts
export function computeRefundAmount(order: Order, items: RefundItem[]): Money

// compliance/refund-audit.ts
export async function recordAuditTrail(entry: AuditEntry): Promise<void>

// notification/refund-notifier.ts
export async function notifyRefundIssued(user: User, amount: Money): Promise<void>

// support/refund-view.ts
export function renderRefundSummary(refund: Refund): RefundSummary
```

`submit` 变成一段编排，自己不再持有任何一拨人的规则：

```ts
async function submitRefund(req: RefundRequest): Promise<RefundResult> {
  const amount = computeRefundAmount(req.order, req.items)

  await ledger.record(req.orderId, amount)
  await recordAuditTrail({ orderId: req.orderId, amount, actor: req.operator })
  await notifyRefundIssued(req.user, amount)

  return { amount, status: 'done' }
}
```

现在财务改舍入规则，动的是 `computeRefundAmount` 那一个文件。合规要加留存字段，动的是 `recordAuditTrail`。客服后台的样子由 `renderRefundSummary` 决定，它甚至不在提交流程里。

## 「只做一件事」这个说法错在哪

常见的版本是「一个类只做一件事」。这句话听着清楚，落到代码上没法用：什么叫一件事？

照它拆到极致，会得到这样的东西：

```ts
class RefundAmountFetcher   { /* 取原始金额 */ }
class RefundAmountRounder   { /* 取整 */ }
class RefundAmountValidator { /* 校验不超上限 */ }
```

三个类，三个方法，看起来很干净。但提要求的人只有财务一个，他改一次舍入规则，现在要打开三个文件，还要确认它们之间那层调用没有漏掉校验。

这就是第 2 篇说过的「拆分也会破坏内聚」：把「总是一起变的东西」拆散，位置反而往下走。判据不是数方法，是数人。

## 什么时候算两个人

剩下的难题是：两拨人到底算一拨还是两拨。

财务内部就有分叉。会计关心这笔退款记在哪个科目，税务关心发票和申报口径。这两件事今天可能在同一次改动里一起变，也可能下季度只有税务口径调整。判断的办法是问一句：如果其中一边调整，另一边会不会在同一天跟着改？会，就是一拨人；不会，就是两拨。

同一个人在不同角色下也算两拨人。Martin 举的 CFO 和 COO 有时候是同一个人，但会计口径和运营报表不会因此就变成一回事。

这个判断会错，也只能靠判断。序章引过那项研究：163 名学生给同一批模块标注内聚等级，结果分歧很大。单一职责的判定属于同一类东西，它是判断量表，不是测量仪器。

## 我改了什么判断

我以前用「这个类是不是只做一件事」来审代码，审出来的结论经常自己都不信：一个服务类里十几个方法，说它只做一件事显然勉强，说它违反原则又觉得哪里不对。

换成「会来提要求的有几拨人」之后，判断变得能用。上面那个 `RefundService` 里四拨人，拆成四个文件；`RefundAmountFetcher` 那一组虽然有三个类，但只有财务一拨人，合起来更合理。

同一段代码给出两个相反的结论，跟第 2 篇遇到的情况一样，只不过这次换了个问法。

下一篇讲开闭原则，用它来看「猜对的那条扩展轴」到底是什么意思。

## 参考资料

1. [Robert C. Martin, "The Single Responsibility Principle", Clean Coder Blog, 2014-05-08](https://blog.cleancoder.com/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html) —— 文中 Employee 与 CFO/COO/CTO 的例子、「这条原则是关于人的」原句，以及关于 Bertrand Meyer 的那段自述都出自这里。同一篇还提到他是在 1990 年代末整合 Constantine 的耦合与内聚概念时提出这条原则的。
2. [D. L. Parnas, "On the Criteria To Be Used in Decomposing Systems into Modules", Communications of the ACM 15(12), 1972, 1053–1058](https://dl.acm.org/doi/10.1145/361598.361623) —— 第 2 篇用过；Martin 那篇博文也是从这篇讲起的。
3. [SOLID — 缩写的来历](https://en.wikipedia.org/wiki/SOLID)
