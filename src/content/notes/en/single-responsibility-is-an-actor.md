---
title: 'Single Responsibility: A Responsibility Is Not a Task, It Is Someone Who Will Ask'
description: "Single responsibility is usually taught as \"a class should do one thing\", a sentence that cannot be used to judge any code. In 2014 Martin said it plainly: this principle is about people. Split the four groups of requirements living inside one refund service, and what you get is another way of stating cohesion and coupling."
pubDate: 2026-08-21
tags: ['programming-thinking', 'design-principles', 'typescript']
---

> The fourth of ten notes in the Programming Thinking series. The case the series is built on is in the [opening essay](/notes/programming-taste-in-the-agent-era/).
>
> AI can write more of our code every month, which makes the judgement we have built up worth more, not less. This series is me taking these ageing principles back off the shelf, checking where each one came from, where it holds, and where it breaks. Reviewing the old to understand the new.

Finance asked for a change: round refund amounts down to the cent instead of half-up. The change itself was three lines. On the day it shipped, the support console started showing two extra decimal places, and the amount format in the audit log changed with it.

Those three lines were not wrong. The problem was where they lived:

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

One `submit`, four groups of people who can each come knocking.

## Four groups living in one method

Read each line by who would ask for it to change:

| What the line does | Who asks | When they ask |
|---|---|---|
| `computeAmount` | Finance | Rounding rules, discount splits, or currency conversion change |
| `audit.log` | Compliance | The retained fields change, or a regulator adds one |
| `notify.refunded` | Operations | Wording, channel, or timing moves |
| the `display` line | Support | The console table gains a column, or needs a new field |

These four groups do not coordinate, and they do not ask at the same time. On the day finance changed the rounding rule, compliance had asked for nothing and neither had support. Three lines still changed what both of them see.

Martin has an analogy for this. You take your car to a mechanic to fix a broken electric window. He calls the next day to say it is done. When you pick it up the window works, and the car will not start. You are not going back to that mechanic.

## What Martin added in 2014

The original wording says a module should have one, and only one, reason to change. "Reason" is a thin word, so people asked questions: does fixing a bug count as a reason? Does a refactoring?

In May 2014 Martin wrote a post to answer exactly that, and the answer is one sentence in bold: **this principle is about people** [1].

His example is an `Employee` class, where `calculatePay` belongs to the CFO, `reportHours` to the COO, and `save` to the CTO. Three methods in one class means that when the CTO asks for a change in how data is stored, the report the COO relies on can break. The COO does not care what your `save` method looks like. He reaches one conclusion: never touch that class again.

The post also carries a phrasing that is easier to use:

> Gather together the things that change for the same reasons. Separate those things that change for different reasons.

## That sentence sounds familiar

Martin says so himself in the next paragraph: think about it and you will see this is just another way to define cohesion and coupling.

The previous two notes did the same job from another angle. Note 2 asked whether elements change together, note 3 asked how far a change travels, and this one asks the other side of the same question: who is going to ask for it. Reasons come from people, people ask on their own schedules, so cutting along people hands you cohesion and coupling at the same time.

It also explains why the principle cannot be judged by the size of a class. Four hundred lines might serve one group. Twenty lines might have three groups watching them.

## The name might be borrowed

One more detail from that post. Martin wrote these ideas up in the late 1990s, and his own words are:

> I have this vague feeling that I stole the name of this principle from Bertrand Meyer, but I have not been able to confirm that.

The person who proposed it cannot say where the name came from, which fits what the opening essay turned up: seven principles from six unrelated groups of people, arranged into one list by someone later. The SOLID acronym is the same story, put together by Michael Feathers around 2004, more than a decade after the principles themselves [1].

## Cut along people

The same refund service, after the split. Each file answers to one group:

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

`submit` becomes orchestration and holds no group's rules:

```ts
async function submitRefund(req: RefundRequest): Promise<RefundResult> {
  const amount = computeRefundAmount(req.order, req.items)

  await ledger.record(req.orderId, amount)
  await recordAuditTrail({ orderId: req.orderId, amount, actor: req.operator })
  await notifyRefundIssued(req.user, amount)

  return { amount, status: 'done' }
}
```

Change the rounding rule for finance now touches `computeRefundAmount` and nothing else. Adding a retained field for compliance touches `recordAuditTrail`. What the support console looks like is decided by `renderRefundSummary`, which is not even in the submission path.

## Where "does one thing" goes wrong

The common version is that a class should do one thing. It sounds clear, and it cannot be applied to code, because what counts as one thing?

Taken to its limit it produces this:

```ts
class RefundAmountFetcher   { /* reads the raw amount */ }
class RefundAmountRounder   { /* rounds it */ }
class RefundAmountValidator { /* checks it against the cap */ }
```

Three classes, three methods, everything tidy. One group asks for all of it, and that group is finance. Change the rounding rule once and you now open three files, and you have to confirm the calls between them still run the validation.

That is what note 2 called splitting that breaks cohesion: take apart the things that always change together and you move down the scale. The test is not the number of methods. It is the number of people.

## When two groups are really two

The difficulty left over is deciding whether two groups are one or two.

Finance splits internally. Accounting cares which ledger account a refund lands in, tax cares about invoices and filing. Today those two may change in the same edit; next quarter only the tax side may move. The way to decide is one question: if one side adjusts, does the other follow on the same day? If yes, one group. If not, two.

The same person in two roles counts as two groups. The CFO and the COO in Martin's example are sometimes one human being, and accounting rules and operational reports do not become the same concern because of that.

This judgement can be wrong, and judgement is all there is. The opening essay cites a study in which 163 students labelled cohesion levels for modules in the same program and disagreed at length. Single responsibility belongs to the same family: a judgement scale, not a measuring instrument.

## What I changed my mind about

I used to review a class by asking whether it does one thing, and I often did not believe my own answers. A service class with a dozen methods: saying it does one thing is a stretch, and saying it violates the principle feels wrong too.

Asking how many groups of people will come asking made the question usable. Four groups in that `RefundService`, so four files. Three classes in the `RefundAmountFetcher` set with only finance asking for them, so they belong together.

One piece of code, two opposite answers depending on the question, which is what happened in note 2 with a different question.

The next note covers the open-closed principle and what it means to have guessed the right axis.

## References

1. [Robert C. Martin, "The Single Responsibility Principle", Clean Coder Blog, 2014-05-08](https://blog.cleancoder.com/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html). The `Employee` class with the CFO, COO, and CTO, the sentence "this principle is about people", and the aside about Bertrand Meyer are all from here. The same post says he arrived at the principle in the late 1990s while consolidating Constantine's ideas about coupling and cohesion.
2. [D. L. Parnas, "On the Criteria To Be Used in Decomposing Systems into Modules", Communications of the ACM 15(12), 1972, 1053–1058](https://dl.acm.org/doi/10.1145/361598.361623). Used in note 2; Martin's post opens with it as well.
3. [SOLID — the origin of the acronym](https://en.wikipedia.org/wiki/SOLID)
