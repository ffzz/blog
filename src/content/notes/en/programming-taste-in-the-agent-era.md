---
title: 'Seven Design Principles Are Not a Pyramid'
description: "The seven principles of object-oriented design are usually drawn as a pyramid, each layer holding up the next. Check where each one came from and the picture falls apart: six unrelated groups of people, twenty-two years apart, and at least two of them give opposite advice about the same code. This is the opening note of the Programming Thinking series."
pubDate: 2026-08-19
tags: ['programming-thinking', 'design-principles', 'ai']
---

These are my notes on the seven principles of object-oriented design.

They started with a question I could not answer properly. Agents write code faster than I do now, and most of the time I cannot fault what they produce, so are thirty-year-old principles still worth the hours? Yes, though not for the reason you would expect. The seven give contradictory advice about the same piece of code, and which one to follow depends on guessing which way that code will grow. That guess cannot be outsourced yet.

This opening note sets out where each of the seven came from. Having checked, I am not going to reproduce the diagram that stacks them into a pyramid.

## Where they came from

The usual drawing looks like this: high cohesion and low coupling at the bottom, the seven principles in the middle, design patterns above them, object-oriented development on top. Each layer holds up the next, and the whole thing reads like a system someone derived.

Checked one at a time, here is where they actually come from:

| Concept | Who | Year | Source |
|---|---|---|---|
| Cohesion and coupling | Stevens, Myers, Constantine | 1974 | "Structured Design", IBM Systems Journal 13(2) [1] |
| Liskov substitution (LSP) | Barbara Liskov | 1987 | OOPSLA keynote, "Data Abstraction and Hierarchy" [2] |
| Law of Demeter (LoD) | Ian Holland | 1987 | Northeastern University, the Demeter project [3] |
| Open-closed (OCP) | Bertrand Meyer | 1988 | "Object-Oriented Software Construction" [4] |
| Composite reuse (CRP) | the Gang of Four | 1994 | "Design Patterns" |
| Dependency inversion (DIP) | Robert C. Martin | 1996 | C++ Report |
| Interface segregation (ISP) | Robert C. Martin | 1996 | C++ Report |
| Single responsibility (SRP) | Robert C. Martin | 1990s | C++ Report, collected in "Design Principles and Design Patterns" (2000) [5] |

Six groups of people, with twenty-two years between the first and the last. In 1974 those three were arguing about how to cut a Fortran program into modules. In 1987 Liskov was on an OOPSLA stage talking about type theory. In 1996 Martin hit a specific problem while consulting for a client. None of them knew about the others' problems, and none was adding a brick to a shared system.

The acronym SOLID came later still. Martin wrote the five principles through the 1990s, and turning their initials into a word was Michael Feathers's doing around 2004, more than a decade after the principles themselves. The "seven principles" table in Chinese textbooks adds two more on top of SOLID, and the Law of Demeter and composite reuse were never part of SOLID to begin with: one comes from Northeastern University in 1987, the other from the Gang of Four in 1994.

Nobody assembled these seven. Someone later arranged them.

## The cohesion and coupling levels were subjective from the start

The 1974 paper gives six kinds of cohesion: coincidental, logical, temporal, communicational, sequential, functional. Textbooks today usually list seven, because procedural cohesion was added later by Yourdon and Constantine, and Myers proposed two more besides. No version is settled.

Someone tried measuring it. A study in the Software Quality Journal asked 163 students to label the cohesion and coupling levels of modules in the same mid-sized Fortran program, and they disagreed at length [6]. The same code, read by different people, lands on different levels.

That does not make the levels useless. It means this was always a judgement scale rather than a measuring instrument.

## The open-closed principle means two different things

The most quoted line of the seven is **open for extension, closed for modification**. It carries Meyer's name and the year 1988.

What Meyer said in 1988 was this: a class can be compiled into a library and used by other classes, and in that sense it is closed; at the same time any new class can take it as a parent and derive new behaviour, and in that sense it is open. The mechanism was **implementation inheritance**: ship the class in a library, let other people extend it by subclassing. That was a pointed answer for the time. Add a field or a function to a library back then and every program depending on it had to be rebuilt.

Martin restated it in the 1990s: depend on an abstract interface, put the implementation behind it, extend by swapping in a new implementation polymorphically. Martin says he was paraphrasing Meyer, but their answers to "how do you achieve it" differ. One says inherit from a concrete class, the other says depend on an abstract interface [4].

I had filed the open-closed principle under "program to an interface" and assumed it was Meyer's. Reading the 1988 wording, what gets taught today is the 1990s rewrite, still wearing the older name and date.

The distinction is not pedantry. In Meyer's version the extension point is the inheritance hierarchy. In Martin's it is the interface. When each one breaks, and what the breakage looks like, are different questions. Notes five and ten take them up.

## The Law of Demeter is named after a project

One small thing while we are here. The Law of Demeter was not proposed by a Mr Demeter.

Ian Holland proposed it at Northeastern University in the autumn of 1987, while working on the Demeter project. The group named the rule after the project, and the project was named after the Greek goddess of agriculture, on the idea that software should grow like a crop, a little at a time [3].

On the page Karl Lieberherr kept at Northeastern for over twenty years, the law is one sentence long: talk only to your friends.

## Two principles, one piece of code, opposite answers

The clearest evidence that these seven are not one system is that they collide.

Interface segregation says a client should not depend on interfaces it does not use, and interfaces should be split finely. Cut that way, the three uses of a refund ledger become three interfaces:

```ts
interface RefundLookup   { findByOrder(orderId: string): Promise<Refund[]> }
interface RefundTimeline { stagesOf(refundId: string): Promise<Stage[]> }
interface RefundReversal { reverse(refundId: string, reason: string): Promise<void> }

class ReversalFlow {
  constructor(
    private lookup: RefundLookup,
    private timeline: RefundTimeline,
    private reversal: RefundReversal,
  ) {}
}
```

The Law of Demeter says an object should know as little as possible about others. By that measure the `ReversalFlow` above knows three types, which is two too many. Narrow it to one:

```ts
class ReversalFlow {
  constructor(private ledger: RefundLedger) {}
}
```

Now `ReversalFlow` knows one type and Demeter is satisfied. But `RefundLedger` has to offer lookup, timeline, and reversal, which makes it a fat interface, and interface segregation is not satisfied.

Neither principle was misapplied. They point in opposite directions. One more narrow interface means one more type, and one fewer type means the interface has to widen. There is no right answer here, only a trade-off: an interface is an abstract type while a forwarding method is concrete code, and the former usually costs less than the latter. That trade-off is mine, though, not a result the principles computed.

## The pyramid

I used to think the seven built on each other, with high cohesion and low coupling underneath and design patterns on top, each layer entailing the next. Having checked the sources, that structure does not hold: six unrelated groups, each solving their own problem, twenty-two years apart, giving opposite advice about the same code.

The pyramid is a story drawn later, to make them teachable.

Closer to the truth: the seven are seven questions to ask. Who will come to me when this code changes (single responsibility)? Which way will it grow (open-closed)? If this subclass replaces its parent, do the old assertions still hold (Liskov)? No question outranks the others, because which one matters most depends on where the code sits.

An agent can implement any one of the seven faster than I can. What it cannot answer is which one to listen to this time.

## The example this series uses

The code in the nine notes after this one all grows from the same place: a refund and reconciliation subsystem. I picked it because its constraints are hard. In a soft domain, Liskov substitution can only be taught as a grammar exercise.

Four invariants, which will keep coming back:

1. Total refunds never exceed what the original order actually paid
2. Idempotent: resubmitting the same refund does not move money twice
3. States move one way. A settled refund cannot be rolled back, only offset by a new reverse entry
4. One currency. Amounts in different currencies cannot be added

Refunds run through four channels (back to the original card, wallet balance, bank transfer, credit compensation) and four kinds of client (support console, finance reconciliation, risk interception, read-only merchant view). The structure carries two extension axes that work against each other: adding a channel, and adding an operation. Note five uses it to show why the open-closed principle can only be open along one of them.

## The series

- Opening · Seven Design Principles Are Not a Pyramid
- Cohesion · [The test is "must change together", not "looks related"](/notes/what-belongs-in-one-module)
- Coupling · [Three Couplings You Cannot See, and a Dependency That Moved House](/notes/three-invisible-couplings)
- Single responsibility · A responsibility is not a task, it is a person who will come asking
- Open-closed · You can only be open along the axis you guessed right
- Liskov substitution · A matching signature does not mean it can be swapped in
- Dependency inversion · What inverts is who owns the interface
- Interface segregation · An interface is a slice taken from the client's point of view
- Law of Demeter · The middleman's dilemma
- Composite reuse · Inheritance publishes your invariants

One note per principle, published as they are written.

## References

1. [W. P. Stevens, G. J. Myers, L. L. Constantine, "Structured Design", IBM Systems Journal 13(2), 1974, 115–139](https://dl.acm.org/doi/10.1147/sj.132.0115)
2. [Barbara Liskov, "Keynote address — Data Abstraction and Hierarchy", OOPSLA '87 Addendum, published in ACM SIGPLAN Notices 23(5), 1988, 17–34](https://www.cs.tufts.edu/~nr/cs257/archive/barbara-liskov/data-abstraction-and-hierarchy.pdf)
3. [Karl Lieberherr, "Law of Demeter: Principle of Least Knowledge", Northeastern University](https://www.khoury.northeastern.edu/home/lieber/LoD.html)
4. [Open–closed principle — a comparison of the two formulations](https://en.wikipedia.org/wiki/Open%E2%80%93closed_principle)
5. [SOLID — the origin of the acronym](https://en.wikipedia.org/wiki/SOLID)
6. [Difficulties using cohesion and coupling as quality indicators, Software Quality Journal](https://link.springer.com/article/10.1007/BF00590439)

On reference 5: the SOLID acronym is attributed to Michael Feathers, but every source I could find is second-hand citing other second-hand sources, with no confirmation from Feathers or Martin himself. Treat it as the common view rather than an established fact.
