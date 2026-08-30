---
title: 'Coupling: Three You Cannot See, and a Dependency That Moved House'
description: "Coupling often gets reduced to counting imports. That holds up on the textbook violations and fails on production code. Replace a direct call with an event bus and two imports disappear, but the dependency has not gone anywhere. It has moved out of the compiler's sight."
pubDate: 2026-08-20
tags: ['programming-thinking', 'design-principles', 'typescript']
---

> The third of ten notes in the Programming Thinking series. The case the series is built on is in the [opening essay](/notes/programming-taste-in-the-agent-era/).
>
> AI can write more of our code every month, which makes the judgement we have built up worth more, not less. This series is me taking these ageing principles back off the shelf, checking where each one came from, where it holds, and where it breaks. Reviewing the old to understand the new.

I used to keep a cheap rule in my head: the more a module imports, the more coupled it is. Swap a direct call for an event and two imports disappear, the constructor gets shorter, and the result looks a lot like decoupling.

Set that code against the 1974 coupling scale and the verdict flips. The direct call sat in the loosest band. After the switch, both ends start depending on the event name, the payload shape, the order of execution, and the failure semantics, and a few of those have left the type system entirely.

The previous note asked whether the elements inside a module belong together. This one asks about the space between modules: once import counts stop being reliable, where else can you see how tightly two modules are tied?

## Coupling hidden in a parameter

Start with the kind you can see: a parameter that tells the other side which internal branch to take.

```ts
async function submitRefund(req: RefundRequest, dryRun: boolean): Promise<RefundResult>

// at the call site
await submitRefund(req, true)
```

That `true` leaks two facts: `submitRefund` has more than one path inside it, and `dryRun` skips some of the steps. A reader has to know that internal arrangement before they can say what this call does. One parameter is carrying the refund data and an instruction about execution at the same time.

The return value adds a second problem. When `dryRun` is true, nothing was submitted, so what belongs in `RefundResult.status`, and does the amount mean an estimate or a result? One type carries two meanings, and the caller has to read the boolean a second time to work out which one it is.

Split the two paths and the function name and the return type each say what they mean:

```ts
async function previewRefund(req: RefundRequest): Promise<RefundPreview>

async function submitRefund(req: RefundRequest): Promise<RefundResult>
```

That is a reasonable place to pin the definition: coupling measures how much two modules have to know about each other. The more they know, the tighter they are tied, and the more likely a change in one pulls at the other. `dryRun` stands out because the caller is forced to know how `submitRefund` is arranged inside.

One distinction is worth drawing, between a control parameter and plain configuration. `formatAmount(m, { showCurrency: true })` also takes a boolean, but it describes what the output should look like instead of asking the caller to pick a business process. The two sides still share the meaning of the argument, which is ordinary data coupling. `dryRun` exposes the callee's control flow on top of that, which is what drops it into control coupling.

## Where the six levels come from

The term control coupling comes out of "Structured Design" by Stevens, Myers, and Constantine, published in the IBM Systems Journal in 1974 [1], the same work that produced the cohesion levels in the previous note. The coupling scale in common use runs tightest to loosest:

| Level | Name | What connects the two modules |
|---|---|---|
| 1 | Content | One module reads or writes the other's internals |
| 2 | Common | They share a piece of global data |
| 3 | External | Both depend on a format or protocol outside either of them |
| 4 | Control | One passes a flag that decides the other's branch |
| 5 | Stamp | A whole structure is passed, and a few fields are used |
| 6 | Data | Only the data the other side needs is passed |

The `dryRun` example lands at level 4. Split into two operations, each request carries only what it needs, and the connection moves toward level 6.

The table has been tidied up since. On its lineage, what I could verify is second-hand: the 1974 paper had a level called hybrid coupling that later disappeared from textbooks, and external and stamp were added afterwards. I could not get hold of the paper itself, so treat that history as reported rather than checked. The six-level table is still useful. What is worth keeping is the ordering: how much two modules have to know about each other, or about some third party, to work together at all.

## In production code, coupling lives outside the imports

The couplings above sit in function signatures where the compiler and the IDE can both see them. The harder parts of production code show up at runtime, in shared state, or behind a layer that looks neutral. When imports drop away, those connections do not go with them.

### An event bus moves coupling from compile time to run time

```ts
class RefundService {
  constructor(
    private ledger: RefundLedger,
    private notifier: Notifier,
  ) {}

  async settle(refundId: string) {
    await this.ledger.markSettled(refundId)
    await this.notifier.refundSettled(refundId)
  }
}
```

`RefundService` knows two types by name. Move it onto an event bus:

```ts
class RefundService {
  constructor(private bus: EventBus) {}

  async settle(refundId: string) {
    await this.bus.emit('refund.settled', { refundId })
  }
}
```

Now it knows `EventBus` and nothing else. Two imports gone, constructor shorter. The ledger entry still has to happen, just inside a handler subscribed to `refund.settled`.

The compiler sees the `emit` and can check the types `EventBus` exposes. If the event name is only a string, it cannot enumerate the subscribers from it, and it knows nothing about the order they run in or how their failures propagate. An IDE can find every occurrence of the string, though it cannot prove those hits are the whole business flow.

Checked against the scale, the first version passed nothing but a `refundId` between `RefundService` and `RefundLedger`, which is data coupling at level 6. In the second version, publisher and subscriber both depend on the event name and the payload shape, which is external coupling at level 3. For this one business connection, a dependency the compiler could enumerate has turned into a runtime convention that has to be tracked some other way.

Event buses still have their place: across processes, across teams, or where the subscriber genuinely should not be known to the publisher. There is a blunt way to test how strong the business dependency is. Temporarily remove the subscriber and see whether the main flow still holds up. Lose the analytics or audit subscriber and you are down one data source, which is usually fine to handle asynchronously. Lose the ledger and the books are wrong, so that link needs stronger delivery and failure guarantees. This test only ranks business dependency. Deployment boundaries, throughput, and availability across processes are separate trade-offs.

### Shared mutable state: no import needed to affect each other

```ts
// shared-cache.ts
export const refundCache = new Map<string, Refund>()
```

The reconciliation job writes to it, risk reads from it. Both modules may well import `shared-cache.ts` without either referencing the other. A text search lists everyone who touches this `Map` and says nothing about which reads have to happen after which writes.

Say risk reads a refund as `Submitted` and starts to clear it. Before the clearance finishes, the reconciliation job flips the same refund to `Failed`. The `Map` did not hand back a stale value; the trouble is that reading the state and acting on it are two separate moments. Risk carries on with a decision that has already expired.

This kind of connection is common coupling at level 2, one notch looser than reading and writing the other module's internals directly. What makes it hard to find is equally specific: tools can locate the shared object, but not who owns the writes, what order things must happen in, or which sequences need to be atomic.

What risk needs is the ability to query. Give it a read-only interface, with the implementation living outside the shared state. The dependency becomes findable again, and risk never gets a write handle. Who gets to define that interface is the subject of notes 7 and 8.

## Why a middle layer is not decoupling

Several forms calling several data-layer methods directly gives you a mesh. Put a controller in the middle and the graph becomes a star. The shape is clearer, but if the controller fills up with switches that branch by caller, the same amount of knowledge is now concentrated in one place.

Change a data-layer method and the controller changes. A form grows one more case and the controller gains a branch. `Form1` and `Form3`, which had never heard of each other, now take turns editing the same file. The amount of code you have to open and verify has not gone down. The dependency moved.

To tell whether the layer is a real boundary, try changing the implementation behind it. If callers are unaffected and the interface still describes the same thing in stable business words, the layer absorbed the change. If every change means adding another caller branch to the switch, the layer is a clearing house for details. That test comes back in note 7, on dependency inversion.

## Direction: toward the stable side, and no cycles

Once the connections are visible, they need a direction. I keep three rules here. They cover a narrow range, but each one can be checked directly.

Start with cycles. A depends on B, B depends on C, C depends on A, and the three modules now behave like one module when it comes to change: touch one and all three need verifying again. Cycles are one of the few structural problems a tool can find for you. Both `madge` and `dependency-cruiser` do it.

Then direction. Dependencies should point toward the more stable side, where stable means depended on by many and depending on few, and therefore expensive to change. `Money` can be depended on by all four channels; it should not know about any specific channel. Wire it the other way and adding a channel means editing `Money`, where two of the four invariants listed in the [opening essay](/notes/programming-taste-in-the-agent-era/) also live.

Last, visibility. The connections in this note can be reordered by how much a tool helps you when the convention changes:

| Connection | What happens when the convention changes |
|---|---|
| Constructor parameter | The compiler errors, and the error sites are close to a list of every caller |
| Typed event contract | Name and payload mismatches error out, though subscriber order and failure propagation still need checking at runtime |
| Global mutable object | Search finds the users, but who writes, in what order, and relative to which reads still has to be reconstructed by hand |
| Event name as a string | The string can be found, and it is hard to prove the hits cover the full meaning |

The later rows all have uses. What they share is the cost of moving part of "who depends on whom" out of the compiler and into tests, docs, runtime checks, or someone's memory. Every one of those you fail to build is one more thing a maintainer has to remember.

These three rules govern the shape, direction, and visibility of a dependency. They cannot tell you whether the dependency should exist. That goes back to the previous note: will these two modules change together because of the same change?

## Counting imports as a coupling metric, wrong twice

I used to treat "add an intermediate layer" as the standard answer to coupling. Writing up the controller example and checking it by blast radius changed that: mesh to star only reshaped the graph. The center still held the same branches, and not one file fewer had to be open at the same time.

I also treated direct-call-to-event as a coupling reduction, on the evidence of fewer imports. Checked line by line against the scale, `RefundService` and `RefundLedger` had been passing only the data the other side needed. After the switch both ends share a string, a payload, and a runtime convention. The change may still be worth making at some deployment boundaries, but "fewer imports, therefore lower coupling" does not hold.

Both mistakes came from the same convenient proxy. Import counts measure symbols in a source file. The coupling table asks how much you have to know to understand and change a connection. Put an event bus, shared state, or a middle layer in front of them and the two give different answers.

These days, when I look at a dependency, I start by assuming its convention changes. Can the compiler list everything that breaks? Whatever has to be filled in by search, docs, and memory is the part of that connection the imports never showed.

The next note is on single responsibility, back on the cohesion side.

## References

1. [W. P. Stevens, G. J. Myers, L. Constantine, "Structured Design", IBM Systems Journal 13(2), 1974, 115–139](https://dl.acm.org/doi/10.1147/sj.132.0115)
