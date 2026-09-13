---
title: "AI Model Provider Research: Quality, Price, Privacy, and Latency"
description: The same model can cost ten times more on one platform than another, yet three 2026 audit papers found that price predicts nothing about whether you're getting the real model. This note checks pricing pages, privacy policies, data-center disclosures, and the papers themselves across eight providers, then orders the elimination by how reversible a mistake is.
pubDate: 2026-09-12
tags: ['ai', 'llm-api', 'engineering']
---

Same Llama 3.3 70B. OpenRouter and DeepInfra charge $0.10 per million input tokens; Together charges $1.04. Ten times. DeepSeek V4-Flash costs $0.06 on DeepInfra, while DeepSeek's own off-peak price is $0.22 — nearly a quarter of the source price.[1][2]

That gap reads like a simple choice: find the cheapest one, everything else is savings.

I went through eight providers' pricing pages, privacy policies, and data-center disclosures, plus three 2026 audit papers, and the order that came out runs the other way. Price should be the last thing you check. The reason isn't "cheap means bad" folk wisdom — it's a regression result from the CISPA paper: across the shadow APIs they audited, price ratio had no predictive power over accuracy degradation.[18] Paying more buys nothing toward "the model is at least real."

Every price and policy term in this piece is a snapshot from September 9, 2026. This market can move in three days; check the provider's own site before acting on any number here. The eight covered are OpenRouter, B.AI, EasyRouter, SiliconFlow, Novita, DeepInfra, Groq, and Together.

## The Tenfold Gap Comes From Platform Positioning, Not the Model

Pull the gap apart first. Is it the model, or something else.

| Model | Cheapest | Most expensive | Multiple |
| --- | --- | --- | --- |
| DeepSeek V4-Flash | DeepInfra $0.06 | SiliconFlow peak $0.42 | 7x |
| Llama 3.3 70B | OpenRouter / DeepInfra $0.10 | Together $1.04 | 10x |
| Qwen3 32B class | OpenRouter / DeepInfra $0.08 | Groq $0.29 | 3.6x |

USD per million input tokens, 2026-09-09 snapshot.[1] These three rows are the widest gaps pulled from an eighteen-row table; the full table is in the section on price, further down.

### Closed Flagships Have No Arbitrage

GPT-5.x, Claude, and Gemini are only sold by two of the eight — OpenRouter and B.AI — and they charge the same: Claude Opus 5 is $5.00 / $25.00 on both, GPT-5.4 is $2.50 / $15.00 on both, straight pass-through pricing.[1] The other six don't carry them at all.

So on the closed-flagship side, the question "how much does the same model vary across platforms" has exactly one comparable pair, and the answer for that pair is zero.

### The Whole Gap Sits in Open-Weight Models

Every multiple shows up on the open-weight side taken as a whole. Each platform there is running a different business, and the price reflects the business:

DeepInfra and OpenRouter sit at the cheap end — one is a dedicated inference cloud for open models, the other aggregates providers and surfaces the cheapest endpoint. Groq's Llama 3.3 costs six times more than the cheap end, because what it sells is LPU-hardware latency, and speed is the pricing story. Together's Llama 3.3 is the most expensive on the market; its customers are enterprises moving to open weights, and the price carries dedicated deployment and compliance overhead. SiliconFlow prices in yuan close to the official rate, no markup and no subsidy, plus an off-peak discount. B.AI charges official rate one-to-one on mainstream models, and the discounts come from promotions — on the snapshot date, GLM-5.3-Flash, Tencent Hunyuan Hy3, and Xiaomi MiMo-V2.5 were all free, and DeepSeek V4-Flash was half price.[1]

The gap comes almost entirely from what the platform is, not from the model. The same weights running on a cheap inference cloud and on dedicated hardware carry very different cost structures.

That's as far as the price data goes on its own. It doesn't answer the other question: is the cheap end selling the same thing.

## Price Has No Predictive Power Over Whether the Model Is Real

Three papers audited this market systematically in 2026, and they each measured a different kind of failure.

CISPA's *Real Money, Fake Models* audited model identity. The researchers identified 17 "shadow APIs" — third-party services that claim to reproduce an official model's output at a lower price — cited across 187 peer-reviewed papers. 45.83% of their fingerprinting tests failed identity verification: whatever ran on the backend wasn't the model it claimed to be. Peak performance deviation hit 47.21%.[18]

One concrete number: on MedQA medical QA, Gemini-2.5-flash scored 83.82% through the official API and about 37% averaged across the shadow APIs tested. Legal-reasoning benchmarks showed a similar gap — three tested services scored 53.06%, 52.36%, and 54.64% agreement against the same model.[18]

The paper also priced out the downstream cost. Of the 187 papers citing shadow APIs, assuming a conservative 30% need to be rerun, at $50–$500 in API cost plus roughly 40 researcher-hours per paper, that's $115,000 to $140,000 in direct cost — and 5,966 papers cite those 187, which could be silently contaminated too.[18] A model running unverified on someone else's backend carries its cost down the citation chain.

The line that matters most for this piece sits in the paper's Appendix G. The researchers ran a regression checking whether price ratio predicts accuracy drop, and found no predictive power at all.[18][30] An expensive shadow API is no more likely to hand you the real model than a cheap one.

That result kills a specific strategy outright: sort by price, then pick the priciest one you can afford. Price isn't a proxy for quality in this market — it isn't even weakly correlated with it.

One note on evidence strength while I'm here. A line circulating in Chinese coverage claims a shadow API's profit margin roughly equals the compliance cost it skips. I couldn't find that phrasing in the CISPA paper itself — the closest is "these sellers simultaneously violate service agreements and regulatory requirements."[18] That line is likely a media paraphrase, and this piece treats it as unverified.

### The Three Papers Measured Three Different Kinds of Failure

The three papers cover three different questions, and citing them interchangeably introduces errors.

| Paper | Institution | Measures | Headline number |
| --- | --- | --- | --- |
| Real Money, Fake Models | CISPA | Whether model identity is consistent | 45.83% of fingerprint tests failed [18] |
| Your Agent Is Mine | UC Irvine | Whether the intermediary behaves maliciously | 9 of 428 relays injected malicious code [19] |
| GateScope | UMass Boston + ASU | Whether billing and context are honest | One gateway overbilled by 62.8% [20] |

I originally filed this set of numbers under CISPA. Going back to the papers, "428 relays" turned out to belong to a separate UC Irvine paper; the CISPA number is the 45.83% fingerprint-failure figure. The two get cited together often enough in Chinese coverage that the attribution slips.[19]

### The Ordering Principle: Irreversibility Times Invisibility

The six checks are ordered by two properties: can a wrong choice be undone, and would you ever find out it was wrong. Importance isn't something you can rank cleanly; these two are.

| Check | Can a mistake be undone | Would you know you got it wrong | Position |
| --- | --- | --- | --- |
| Where data can go | No — once sent, it's out | No — no notification mechanism | 1 |
| How many hops in the path | You can switch providers; you can't recall a sent request | No — plaintext relay leaves no trace | 2 |
| Whether it's the model it claims to be | Yes, you can switch | Only if you actively run a fingerprint test | 3 |
| Whether billing and context are honest | Yes, but you don't get the money back | Requires a dedicated test | 4 |
| Latency and region | Yes | Yes — day one | 5 |
| Price | Yes | Yes — it's on the pricing page | 6 |

The more irreversible and the less observable a mistake is, the earlier it goes. Price lands last because it's the only one of the six that's fully transparent and reversible same-day. Comparing price first, then everything else, gets this backwards.

The next six sections follow this order.

## Check One: Data You Send Can't Be Recalled

Once a request is sent, who can retain it, train on it, or hand it to someone else. This goes first because a prompt you've sent can't be recalled, and nothing will ever tell you what happened to it.

I read all eight privacy policies line by line for this. The gap here is bigger than the gap in the price table — price differs by multiples; policy differs by whether the protection exists at all.

| Platform | Trains on data | Prompt retention | Data location | What to watch |
| --- | --- | --- | --- | --- |
| Together | Opt-in required, no training by default | Zero Data Retention option available | Cross-border transfer needs consent | ZDR only applies going forward |
| OpenRouter | Platform itself doesn't train | No fixed retention on text I/O | Depends on chosen provider | Can't stop upstream provider training |
| Groq | Customer data governed by the DPA | Same, outside the public policy | Cross-border via SCC / DPF | Prompt terms live in the DPA, not the public policy |
| SiliconFlow | Explicitly denies training | Destroyed immediately after inference | Within mainland China | Requires real-name verification; I/O passes content review |
| Novita | States no use in training | Account 7yr / communications 3yr / technical 2yr | Cross-border, covered by SCC and DPF | Analytics sharing may count as a "sale" under CCPA |
| DeepInfra | No storage or training without consent | Removed 30 days after account closure | Possibly in the US | Policy is generic, template-like text |
| B.AI | No training clause | Unspecified | Undisclosed | Policy admits it will collect, log, and store input |
| EasyRouter | No policy | No policy | No policy | No privacy policy and no user agreement |

Sourced from each platform's public privacy policy, pulled 2026-09-09.[6][8][9][11][12][13][15][16]

### The Three With the Most Detailed Policies

Together is the only one of the eight offering Zero Data Retention, and it doesn't train by default — training requires explicit opt-in.[16] The tradeoff is written into the policy: ZDR only runs forward, and once it's on, the platform itself can no longer access, export, or delete data from before.

OpenRouter's structure is worth calling out on its own. The platform itself doesn't train, GDPR, SCC, and CCPA terms are all present, and it tags providers that claim not to train.[6] But it's an aggregator — inputs and outputs end up with whichever upstream provider was selected, and that provider can retain and use the data, including for training. The platform-level promise and the upstream-level behavior are two different things, and OpenRouter's own policy names the seam between them.

SiliconFlow takes a different route: explicit denial of use in pretraining or fine-tuning, destruction immediately after inference and unrecoverable, data stored within mainland China, under the PIPL framework rather than GDPR.[11] The tradeoff is real-name verification and a content-safety review pipeline on both input and output.

### The Two Thinnest Policies

B.AI's privacy policy has no GDPR clause, no retention period, no training clause, and doesn't disclose data location. At the same time the policy itself admits it will "collect, log, and store" user input, using it in anonymized form to improve its infrastructure and API network.[8] Fewer clauses doesn't mean lower risk — here it means no written constraint at all.

What's left in the EasyRouter row is thinner than I expected going in. There's no privacy policy on the site, no user agreement, and no public constraint on collection, retention, training, or sharing.[9] The other thing turned up along the way: the official domain itself can't be confirmed — easyrouter.ai doesn't resolve, and the only live site, easyrouter.tech, was registered on 2026-07-07, two months after the platform's claimed launch, with no pricing page on it and no trace of the "15% off, zero platform fee" language that media coverage attributes to it.

### This Table Reads Policy Text, Not an Audit

The boundary here has to be explicit: everything in the table above comes from reading each platform's public policy language, not a third-party audit.

"Policy doesn't mention SOC2" means that phrase doesn't appear in the policy text — it doesn't mean the platform lacks the certification. DeepInfra's policy claims SOC2 and ISO27001 compliance, but the policy text is generic and template-like, closely resembling Novita's wording, and this piece hasn't independently verified either certification.[13] Novita's SOC2 claim appears only as a footer badge, never in the policy body.[12] OpenRouter's and Together's policies don't mention it at all.

In other words, this check filters out candidates whose written commitments are visibly thin. It can't confirm that a candidate with a thorough written commitment delivers on it in practice.

### Resale Risk Is an Industry-Level Claim

Industry coverage claims some relay platforms collect and resell prompt data.[30] That's an industry-level claim, not established fact about any one platform, and this piece found no case-specific evidence against either B.AI or EasyRouter.

The mechanism holds regardless: a relay sits between the user and the upstream model, and the request passes through it in plaintext, which means it inherently has the capability to collect, retain, and resell prompts. Without a policy constraint, that capability is unbounded. B.AI admits to collecting and storing input; EasyRouter has no policy at all — both fall into that zone.

Two framework-level facts sit on the compliance side. Serving unregistered overseas models to users in mainland China doesn't satisfy the registration and security-assessment requirements under China's Interim Measures for the Management of Generative AI Services.[25] And transmitting mainland users' personal information overseas and retaining it, once the cumulative count passes 100,000 people, can trigger the filing obligation under the Measures for Security Assessment of Cross-Border Data Transfers.[26] Both constraints bind the platform rather than the individual developer, and together they decide whether a relay path can keep existing.

## Check Two: Hop Count Decides Whether Anything Else Can Be Verified

Between sending a request and it reaching the model, how many nodes can read and write the plaintext. This check comes before model authenticity because hop count decides whether the later checks can even be verified — the longer the chain, the more any single compromised node poisons everything downstream, and there's no way from the outside to tell whether a response was tampered with.

The UC Irvine paper's method was direct: researchers bought 28 paid relays off Taobao, Xianyu, and Shopify storefronts, collected 400 free ones from public communities, and tested all 428.[19]

Nine were actively injecting malicious code. Seventeen triggered theft of AWS honeypot credentials the researchers had planted. One drained ETH straight out of a private-key wallet the researchers held.

Two of them ran adaptive evasion: the first 50 requests came back clean, and injection activated only on the 51st.[19] That detail carries a specific lesson — a handful of smoke tests coming back clean isn't evidence of anything.

The researchers also ran a contamination experiment. One deliberately leaked OpenAI key generated 100 million tokens of GPT-5.4 traffic and at least seven Codex sessions; a weakly configured honeypot generated 2 billion billed tokens, 99 sets of credentials, 440 Codex sessions, 401 of which were already running in autonomous mode.[19]

### Hop Count Isn't Published — Estimate It From Proxy Signals

Platforms don't publish this number. What you can check instead is a handful of proxy signals:

Whether the gateway is self-built. One of the relays CISPA audited was built on the open-source project NewAPI, and its model marketplace directly labels some models "Unknown sources."[18][31] NewAPI and OneAPI, two open-source gateways, are what a large share of relays build on top of — the de facto infrastructure of this market — and OneAPI alone has over 30,000 GitHub stars.[32] Whether a platform builds its own gateway is a real dividing line for authenticity and compliance.

Whether the data-center location is public, and whether there's an ICP filing or a traceable corporate entity behind it. B.AI's relay architecture has been confirmed by media reporting — user requests get forwarded through B.AI to an overseas account on the official upstream API and back, and B.AI's own materials warn of unstable entry points requiring users to switch between them.[29] EasyRouter's architecture has never been disclosed.

### The 428 Sample Isn't These Eight

The boundary needs to be exact. Those 428 came from Taobao, Xianyu, and public communities — not the eight covered here. This section's conclusion is "multi-hop is a structural risk," not "nine of these eight are injecting code."

Among the eight, SiliconFlow, Novita, DeepInfra, Groq, and Together run their own compute or connect directly upstream, and don't fall into the category these studies audited. OpenRouter is an aggregator that routes to legitimate providers' own endpoints. B.AI and EasyRouter operate as relay/resale platforms, inheriting this category's structural problems — but this piece found no case-specific evidence against either.

## Check Three: Model Substitution Won't Reveal Itself

Hop count estimated, next comes whether it can be verified at all. This check's defining trait is that it's detectable but never self-reports — if you don't actively test for it, you'll never know.

CISPA's paper gives three method families.[18]

Fingerprinting: compare reproducible behavioral fingerprints between the official endpoint and the candidate — this is the direct measurement behind that 45.83% failure rate. Behavioral benchmarking: run standardized benchmarks like MedQA, LegalBench, and GPQA side by side — note that a higher price doesn't mean higher accuracy. Metadata analysis: check the operating entity, ICP filing, corporate registration, and whether the service is built on an open-source gateway like NewAPI or OneAPI — a model tagged "Unknown sources" is a red flag.

Later papers pushed the cost down further. IRIS relies only on returned text, prompting an endpoint to generate random numbers or strings as a fingerprint, and can detect both "replace every time" and "proportionally dilute the route" patterns.[34] IMMACULATE audits a small number of requests cryptographically, catching model substitution, quantization abuse, and token overbilling.[21]

### The Smallest Test You Can Run Yourself

You don't need to reproduce the paper. Fix a set of standardized questions, hit the official API and the candidate platform with the same ones, compare the answers, and log token counts on both sides.

The token-count part is easy to skip. CISPA's Table 11 shows shadow-API token-count standard deviation diverging from the official baseline by 0.36x to over 2.3x.[18] An answer that looks about right paired with a token distribution that's off by that much is a signal on its own.

I haven't run this test myself — what's above is the paper's method plus the version I think is cheapest to execute. So the claim strength stops here: it shows verification is feasible, not what any specific provider would score if tested.

### The Direct Evidence on These Eight

As of the snapshot date, none of the eight carry a verified model-substitution accusation. That sentence has to stay precise — it can't slide into an implication.

The five direct-inference platforms have no substitution evidence; their risk sits elsewhere — the sustainability of selling tokens at a loss, and dependence on the open-model ecosystem. OpenRouter's position is a bit more specific: CISPA's own model selection used OpenRouter's November 2025 token-usage leaderboard, which means the field treats it as a trusted reference point rather than a suspect.[18]

B.AI and EasyRouter operate as relay/resale platforms, and neither has been named in a substitution accusation. The 36Kr piece that covers this space is about "celebrities entering the business," not an accusation of model swapping.[30] What they inherit is the verification difficulty of the whole category, not an individual case.

## Check Four: Billing Errors and Context Loss Don't Throw Errors

A real model doesn't guarantee a real bill.

GateScope ran black-box measurement on 10 real commercial gateways, checking four issues: model downgrading, silent truncation, billing inaccuracy, and latency instability.[20] One anonymous gateway showed a 62.8% billing deviation — calculated from the public list price against the gateway's own reported token count, the actual bill ran that much higher, while the reported usage looked entirely normal. Another gateway showed 7.6%.

Silent truncation is a separate category. In a 25-turn conversation test, some gateways couldn't recall information set in turn 10 by the time they reached turn 24 — meaning they quietly drop earlier context once history crosses some hidden threshold.[20][30]

Context shrinkage is harder to notice than billing overcharges. The model keeps answering, the tone stays normal, it's just forgotten something set twenty turns back. In long conversations and agent workflows, this kind of degradation gets misread as the model simply not being capable enough.

### This Bias Pays Off Because Billing Relies on Self-Reported Counts

The IMMACULATE paper files token overbilling as its own category of structural economic-motive bias in black-box LLM APIs, and offers an audit framework built on verifiable computation.[21] The logic is plain: billing is based on the token count the gateway itself reports, and the caller has no independent count to check it against.

Two more operations sit on the same structure — industry reporting mentions both but this piece found no named, evidenced case for either: quietly switching the backend to a cheaper version at a model refresh without lowering the price, and queuing, rate-limiting, or degrading free and low-tier users.[30] GateScope did measure significant latency-stability variance across platforms; this kind of multi-tenant throttling is widespread but unobservable from outside.[20]

### This Sits Ahead of Latency Because It Won't Surface on Its Own

The reason matches check three: it takes a purpose-built test to catch. The billing page doesn't flag it, the response is a perfectly normal string of text, and losing context doesn't throw an error.

Latency is the opposite. Slow shows up on day one, and switching away costs nothing more than changing a base URL.

## Check Five: Latency and Region

Performance only comes up here, because performance problems announce themselves — run it for a day and slow versus fast is obvious, and switching away is cheap.

| Platform | Type | Verifiable data center | Regional routing | Official latency data |
| --- | --- | --- | --- | --- |
| OpenRouter | Aggregating router | Spread globally by provider | EU / US, enterprise only | No absolute numbers; latency-sort parameters offered |
| Groq | First-party LPU inference | GCP US | None | Per-model tokens/s table published |
| Together | Open-model inference cloud | North America; EU enterprise-dedicated only | None | None |
| SiliconFlow | Inference cloud + gateway | Beijing entity, domestic ICP filing | No public PoPs | Claims up to 70% latency reduction, no absolute number |
| DeepInfra | Inference cloud | Subprocessors AWS + GCP, US | None | None |
| Novita | Inference cloud | Undisclosed | None | Claims 200ms, no methodology |
| B.AI | Crypto-native relay | Undisclosed | None | None |
| EasyRouter | Relay | Undisclosed | None | Claims 12ms P99 first-token, no methodology |

2026-09-09 snapshot.[3][4][9][11][12][13][14][17]

### Regional Routing Is Basically a Non-Answer

The only one of the eight offering regional routing is OpenRouter, and it only covers EU and US, only on Business and Enterprise plans, and it exists for data-residency compliance — implemented fail-closed, meaning it would rather fail a request than route it outside the region.[4] Default routing isn't geography-based either; it's spread across providers.

The other seven either run a single data center or don't disclose one at all. Groq confirms its data lives on GCP in the US, with a single API entry point.[14][15] Together's serverless tier is North America only, with EU limited to enterprise dedicated or VPC plans — serverless offers no region choice.[17] B.AI, EasyRouter, DeepInfra, and Novita disclose no data-center location at all.

"Route me to something near my region" was an item I pulled out on its own when I was drafting the research outline. Having gone through all eight, this is the cleanest conclusion of the bunch: users in Asia-Pacific currently have no option at all. The only regional routing that exists was built for compliance, not for speed, and it isn't in Asia-Pacific either way.

### Latency Numbers That Hold Up

Groq's per-model throughput numbers are the most quantifiable set on the market: Llama 3.3 70B at 280 tokens/s, GPT OSS 20B at 1000, Qwen3.6-27B at 500.[14] Named model, actual number, retestable.

OpenRouter doesn't publish absolute figures, but offers `sort=latency` and `preferred_max_latency` parameters, routing based on a five-minute window's p50 through p99.[3] What it hands you is a filtering mechanism — you pick your own latency ceiling and it picks the endpoint.

### Latency Numbers That Don't

EasyRouter's "12ms P99 first-token latency" and "99.99% SLA," Novita's "200ms latency," and SiliconFlow's "up to 70% latency reduction, 3–5x throughput" — none of the three come with a methodology or an absolute baseline.[9][12][11] A claim like "70% reduction" can't be checked without knowing the denominator; this piece treats it as unverified.

### Reasoning-Model Latency Is Dominated by Thinking Time

There's another category of number that gets misused easily. Artificial Analysis's model-level medians are aggregated across every provider, mixing fast and slow hosts together, and can't be used for direct platform-to-platform comparison.[22]

A few figures for scale: DeepSeek V4-Flash runs about 125.7 tokens/s with a first-token time around 0.92 seconds; Llama 3.3 70B is about 87.4 tokens/s at 1.64 seconds; Claude Opus 4.7's first-token time is 18.5 seconds, and GPT-5.5's is 52.4 seconds.[22] Those last two look absurd because they're reasoning models — first-token latency there is dominated by thinking time, on a different footing than non-reasoning models.

Within that same aggregated dataset, Llama 3.3 70B's 87.4 tokens/s and Groq's official 280 tokens/s differ by more than threefold — the first is a cross-provider median, the second is a single-hardware measurement. The two numbers don't conflict; they're answering different questions.

One last point ties back to check two: multi-hop routing is itself a structural latency risk. B.AI's relay architecture is confirmed, and its own materials warn of unstable entry points requiring switching. This piece found no third-party latency measurement and no quantifiable user-complaint evidence for it — community search is limited by anti-scraping restrictions, and I'm not inventing a conclusion here.

## Check Six: Price Comes Last

Once the first five checks have filtered the field, comparing prices means something.

Input price, USD per million tokens:

| Model | OpenRouter | B.AI | SiliconFlow | Novita | DeepInfra | Groq | Together |
| --- | --- | --- | --- | --- | --- | --- | --- |
| GPT-5.4 | 2.50 | 2.50 | — | — | — | — | — |
| GPT-5.6 Terra | 2.00 | 2.00 | — | — | — | — | — |
| Claude Opus 5 | 5.00 | 5.00 | — | — | — | — | — |
| Claude Sonnet 5 | 2.00 | 2.00 | — | — | — | — | — |
| Gemini 2.5 Pro | 1.25 | switched to 3.x | — | — | — | — | — |
| DeepSeek V4-Flash | 0.065 | 0.22 | 0.21 | 0.14 | 0.06 | — | 0.14 |
| DeepSeek V4-Pro | 0.58 | 0.66 | 1.67 | 1.32 | 1.30 | — | 1.32 |
| DeepSeek V3.2 | 0.269 | 0.29 | 0.56 | 0.269 | 0.26 | — | — |
| DeepSeek R1-0528 | 0.50 | — | — | 0.70 | 0.50 | — | — |
| Llama 3.3 70B | 0.10 | — | — | 0.135 | 0.10 | 0.59 | 1.04 |
| Qwen3 235B class | 0.09 | 2.00 | 0.17 | 0.60 | 0.09 | — | 0.20 |
| Qwen3 32B class | 0.08 | — | 0.08 | 0.30 | 0.08 | 0.29 | — |
| GLM-5.3 | 1.40 | 1.40 | 1.11 | 1.40 | — | — | 1.40 |
| GLM-5.3-Flash | 0.075 | free | — | 0.15 | — | — | 0.15 |
| Kimi K3 | 3.00 | 3.00 | — | 3.00 | 2.85 | — | 3.00 |
| Kimi K2.6 | 0.95 | 0.95 | 0.90 | 0.80 | 0.75 | — | — |
| MiniMax M3 | — | 0.30 | 0.29 | 0.30 | — | enterprise | 0.30 |
| Tencent Hunyuan Hy3 | 0.132 | free | A13B only | 0.14 | — | — | — |

Output price, same units:

| Model | OpenRouter | B.AI | SiliconFlow | Novita | DeepInfra | Groq | Together |
| --- | --- | --- | --- | --- | --- | --- | --- |
| GPT-5.4 | 15.00 | 15.00 | — | — | — | — | — |
| GPT-5.6 Terra | 12.00 | 12.00 | — | — | — | — | — |
| Claude Opus 5 | 25.00 | 25.00 | — | — | — | — | — |
| Claude Sonnet 5 | 10.00 | 10.00 | — | — | — | — | — |
| Gemini 2.5 Pro | 10.00 | — | — | — | — | — | — |
| DeepSeek V4-Flash | 0.18 | 0.66 | 0.63 | 0.28 | 0.18 | — | 0.28 |
| DeepSeek V4-Pro | 1.74 | 1.98 | 3.33 | 3.96 | 2.60 | — | 3.96 |
| DeepSeek V3.2 | 0.40 | 0.44 | 0.83 | 0.40 | 0.38 | — | — |
| DeepSeek R1-0528 | 2.15 | — | — | 2.50 | 2.15 | — | — |
| Llama 3.3 70B | 0.32 | — | — | 0.40 | 0.32 | 0.79 | 1.04 |
| Qwen3 235B class | 0.55 | 6.00 | 1.00 | 3.60 | 0.55 | — | 0.60 |
| Qwen3 32B class | 0.28 | — | 0.67 | 2.40 | 0.28 | 0.59 | — |
| GLM-5.3 | 4.40 | 4.40 | 3.89 | 4.40 | — | — | 4.40 |
| GLM-5.3-Flash | 0.25 | free | — | 0.50 | — | — | 0.50 |
| Kimi K3 | 15.00 | 15.00 | — | 15.00 | 14.25 | — | 15.00 |
| Kimi K2.6 | 4.00 | 4.00 | 3.75 | 3.40 | 3.50 | — | — |
| MiniMax M3 | — | 1.20 | 1.17 | 1.20 | — | enterprise | 1.20 |
| Tencent Hunyuan Hy3 | 0.528 | free | — | 0.58 | — | — | — |

2026-09-09 snapshot; SiliconFlow converted at a 7.2 exchange rate; EasyRouter has no public price sheet and is dropped from the table.[1] The B.AI column shows list price — on the snapshot date it also ran promotions: DeepSeek V4-Flash at half price, GLM-5.3 at 10% off. SiliconFlow's DeepSeek figures are the off-peak rate; peak doubles it.

### Three Things to Watch When Reading These Two Tables

Three easy places to trip.

A single cell can hide multiple version numbers. DeepSeek V4-Flash has two versions on OpenRouter, 0423 and 0731, priced at $0.0886 and $0.065 respectively for input — the table uses 0731; DeepInfra's $0.06 is also 0731.[1] Cross-platform comparison has to align versions first, or you're comparing two different models.

Time windows need aligning too. DeepSeek's own pricing splits peak and off-peak; SiliconFlow follows the same split with off-peak at half price; B.AI quotes Idle and Busy tiers instead. Both tables here use the off-peak or standard tier — multiply back up for peak hours yourself.

Similar model names don't mean the same weights. In the Qwen3 235B row, OpenRouter and DeepInfra list 235B-A22B-2507; SiliconFlow and Novita list Qwen3.5-397B; B.AI lists Qwen3.8-Max. Their prices aren't directly divisible against each other.

### Billing Structure Matters More Than the Sticker Price

There's another layer beneath unit price, and often it matters more:

OpenRouter doesn't mark up inference itself, but charges on top-ups — 5.5% on credit card, 5% on crypto, plus 5% on BYOK usage above $25k a month.[5] DeepInfra runs service tiers: Priority at 1.5x, Flex at 0.8x. SiliconFlow prices by time window. Groq and Novita both offer 50% off in batch mode. B.AI runs a credit system plus subscriptions — Pro at $200 a month, Max at $2,000.[7]

Once fees and service tiers are factored in, the platform with the lowest sticker price isn't necessarily the one you end up paying least to.

### Subsidized Prices Won't Last

Some of the cheapest cells in that table aren't a cost advantage — they're a subsidy.

SiliconFlow's 2025 revenue was 55.33 million yuan, gross margin was -24%, net loss was 345 million yuan, cost of sales ran 124% of revenue, with compute costs accounting for 86.9% of it — mostly leased, not owned.[27] It filed for a Hong Kong IPO on 2026-06-30. Selling tokens at a loss is written into its own prospectus.

B.AI's free and discounted pricing is a time-limited promotion; the company self-reports average daily throughput of 1.33 trillion tokens.[7] Running free resale at that volume means a real upstream bill someone is covering.

Today's price isn't next year's price. If production traffic is already routed to a subsidized provider, the migration cost of a future price change or shutdown needs to be priced in ahead of time.

By this section my read has gone more conservative than it started: half the brightest cells in that table exist because someone else is footing the bill, and that arrangement has an expiration date.

## Eight Platforms: Positioning and Weak Points

Six checks down, here's what each of the eight looks like.

A note on evidence strength for this section first: the funding, valuation, and user-count figures below come from third-party reporting and platform self-reports, the figures don't always agree across sources, and this piece hasn't pulled primary documents for each one. They're useful for judging scale, not for precise comparison.

OpenRouter is the largest aggregator globally — 400-plus models, 8 million users and roughly 100 trillion tokens a month by its own account, acquired by Stripe in August 2026 for somewhere around $7–8 billion depending on the source.[28] Its weak point is that latency and privacy both ultimately depend on the upstream provider.

DeepInfra specializes in open-model inference and runs the cheapest open-model prices on the market; it raised a $107M Series B in May 2026 with Nvidia participating. Its weak point is that data may land in the US, and its privacy policy reads as template text.

Together is the Neocloud for open models, closing an $800M Series C at an $8.3B valuation in July 2026, led by Aramco Ventures. It has the most flexible privacy setup of the eight. Its weak point is that Llama 3.3 is the most expensive on the market, with no speed advantage to compensate.

SiliconFlow is China's largest independent token supplier, 10.28 million registered users, 170-plus models, domestically compliant, directly reachable from mainland China.[27] Its weak point is a negative gross margin.

Groq sells speed through its LPU hardware, and its published throughput data is the most transparent on the market. Its weak point is a small model catalog, a 2026 restructuring after Nvidia poached much of its core team, and a down-round that halved its valuation in August.

Novita is GPU cloud plus model API, with a third-party ARR estimate around $1.1 million — the smallest of the eight by a wide margin, and no public funding round on record. Prices are reasonable; transparency is limited.

B.AI is Justin Sun and TRON's crypto-native aggregator, launched April 2026, with 2.3 million-plus users by its own account. Model coverage is broad, crypto payment is supported, and promotions run hard. Its weak point is the thinnest privacy terms of the eight, sitting in the gap created by Anthropic's restrictions on sales to unsupported regions.[23][24][29]

EasyRouter is a project from Fu Sheng and Cheetah Mobile, claiming 50-plus models and 200-plus teams in use.[9] Right now the slogan outruns the substance — domain ownership, pricing page, and the discounts it's credited with in coverage are all unconfirmed, and there's a separate allegation of NewAPI code copying and AGPLv3 violation, but the primary text is no longer accessible, so this piece treats it as unverified.[31]

### Scale Is a Migration-Cost Estimate, Not a Moral Score

Factoring funding and margin into the assessment isn't a moral judgment — it's estimating migration cost.

A platform burning cash on subsidies might change its price or shut down after your traffic has already moved there. The cost of that isn't the price difference — it's the engineering time to switch providers. Ownership changes shift the risk the same way. The controversy that surfaced after Stripe acquired OpenRouter was whether routing decisions stay neutral under new ownership — a different question entirely from whether the model gets swapped.[28]

The industry backdrop explains where this money is coming from. China's daily token-call volume went from roughly 100 billion in early 2024 to about 140 trillion in March 2026 — more than a thousandfold increase in two-plus years.[33] Over the same stretch, the gateway layer itself has been getting acquired and attacked: Portkey was acquired by Palo Alto Networks and folded into its AI security product line, while LiteLLM suffered a dependency-package attack in March 2026 that hit over 46,000 development environments.[30]

### A Scorecard and Its Limits

The scoring rubric goes before the table. What follows is a weighted result across five dimensions, each scored 1 to 10: price 25%, model coverage and authenticity 25%, latency and routing 15%, privacy and compliance 20%, ecosystem and trust 15%. This is my own subjective weighting of the snapshot data, not a third-party rating — a different set of weights produces a different ranking.

| Rank | Platform | Price | Models/Authenticity | Latency/Routing | Privacy/Compliance | Ecosystem/Trust | Total |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | OpenRouter | 8.5 | 10 | 7.0 | 8.5 | 9.5 | 8.8 |
| 2 | DeepInfra | 9.0 | 8.0 | 6.0 | 7.5 | 7.5 | 7.8 |
| 3 | Together | 6.5 | 8.5 | 6.0 | 9.0 | 8.5 | 7.7 |
| 4 | SiliconFlow | 7.5 | 8.5 | 6.5 | 7.5 | 7.5 | 7.6 |
| 5 | Groq | 5.0 | 7.0 | 9.5 | 8.0 | 6.5 | 7.0 |
| 6 | Novita | 7.0 | 7.5 | 5.5 | 7.0 | 5.5 | 6.7 |
| 7 | B.AI | 8.0 | 7.5 | 5.0 | 3.5 | 5.5 | 6.2 |
| 8 | EasyRouter | 6.0 | 5.5 | 5.0 | 2.0 | 4.0 | 4.6 |

The bottom three share one thing: key information is opaque — data-center location, pricing page, privacy policy, funding — the specific gap differs but there's always one. In a category built on black boxes, opacity itself should cost points. That's an explicit rule I applied while scoring, and it's fair to drop it and recompute if you don't agree with it.

### The Scorecard and the Elimination Order Answer Different Things

Price carries the highest weight in that table, 25%, while the whole piece argues price should come last. Those two don't contradict each other — they're answers to different questions.

The weighted score ranks overall experience: given every dimension clears some bar, which one is the better deal all in. The elimination order ranks decision sequence: what to check first, and what to check last, so a mistake doesn't land somewhere irreversible. A platform can score high on the weighted table and still deserve elimination at check one for a specific use case — if data can't leave the country, OpenRouter's 8.8 doesn't help you.

## Scenario Fit, and Four Conditions That Change the Order

Put the six checks into concrete scenarios first.

| Need | Pick | Why |
| --- | --- | --- |
| Broad aggregation, widest model coverage | OpenRouter | 400+ models, transparent pricing; its check-one weakness sits upstream, not on the platform |
| Cheapest possible open models | DeepInfra | DeepSeek V4-Flash runs about a quarter of the official price |
| Speed first | Groq | Hardest published per-model throughput data, but a small catalog and data in the US |
| Direct access from mainland China, compliance first | SiliconFlow | Domestic storage, denies training, registered entity; comes with real-name and content review |
| Privacy most sensitive | Together | Only one offering ZDR with no training by default |
| Crypto payment, borderless access | B.AI, cautiously | The only crypto-native aggregator, but weakest at check one — not for sensitive data |
| Anything else | Hold off on EasyRouter | Pricing page, privacy policy, and domain ownership are all unconfirmed |

This order breaks down under four conditions.

Price is a snapshot and can shift in three days; policy terms move too. Every number in this piece carries the 2026-09-09 date — once that window passes, it needs rechecking.

Compliance conditions can shift. If upstream restrictions on resale and unsupported regions tighten, relay paths can fail without warning — Anthropic's commercial terms already state that resale requires approval and that users may not help a third party evade that restriction.[23][24] This kind of failure doesn't come with a grace period.

Ownership can change. An acquisition can shift a platform's incentive structure with every technical metric staying exactly the same — what needs re-judging is whether it still has a reason to stay neutral.

Finally, this order is built for individuals and small teams. Enterprise procurement runs its own DPA, audit, and vendor-assessment process, where checks one and two turn into contract clauses instead of something you read off a privacy policy.

Having gone through all eight, the one thing I'm most sure of is the least conclusion-shaped: of these six checks, price is the only one you can get wrong and fix again the same day. And that's exactly why it's the easiest one to compare — and the easiest one to check first.

---

*This is a snapshot note I put together from public sources, current as of September 9, 2026. Prices, policy terms, and platform status change fast — check each provider's own site before acting on anything here. The compliance points in this piece reflect my reading of public regulatory text and aren't legal advice. Anything marked unverified means I couldn't find a checkable primary source for it, not that the claim is false.*

## References

1. [DeepSeek — Official API Pricing](https://api-docs.deepseek.com/quick_start/pricing)
2. [OpenRouter Models API (full pricing JSON)](https://openrouter.ai/api/v1/models)
3. [OpenRouter — Provider Routing](https://openrouter.ai/docs/features/provider-routing)
4. [OpenRouter — In-Region Routing](https://openrouter.ai/docs/guides/features/in-region-routing)
5. [OpenRouter — FAQ](https://openrouter.ai/docs/faq)
6. [OpenRouter — Privacy Policy](https://openrouter.ai/privacy)
7. [B.AI — Pricing and Usage](https://docs.b.ai/llmservice/pricing-and-usage/)
8. [B.AI — Privacy Policy](https://b.ai/privacy)
9. [EasyRouter (easyrouter.tech, domain ownership unconfirmed)](https://easyrouter.tech)
10. [ComputeUnion — EasyRouter platform profile](https://www.computeunion.net/platform/easyrouter)
11. [SiliconFlow — User Guide](https://docs.siliconflow.cn/cn/userguide/introduction)
12. [Novita AI — Docs](https://docs.novita.ai)
13. [DeepInfra — Docs](https://docs.deepinfra.com)
14. [Groq — Models (per-model tokens/s)](https://console.groq.com/docs/models)
15. [Groq — Your Data](https://console.groq.com/docs/your-data)
16. [Together AI — Privacy and Security](https://docs.together.ai/docs/privacy-and-security)
17. [Together AI — Serverless Overview](https://docs.together.ai/docs/serverless/overview)
18. [Real Money, Fake Models: Deceptive Model Claims in Shadow APIs (CISPA, arXiv:2603.01919)](https://arxiv.org/abs/2603.01919)
19. [Your Agent Is Mine: Measuring Malicious Intermediary Attacks on the LLM Supply Chain (UC Irvine, arXiv:2604.08407)](https://arxiv.org/abs/2604.08407)
20. [Behavioral Consistency and Transparency Analysis on LLM API Gateways (GateScope, arXiv:2604.21083)](https://arxiv.org/abs/2604.21083)
21. [IMMACULATE (arXiv:2602.22700)](https://arxiv.org/abs/2602.22700)
22. [Artificial Analysis — Models](https://artificialanalysis.ai/models)
23. [Anthropic — Commercial Terms of Service](https://www.anthropic.com/legal/commercial-terms)
24. [Anthropic — Updating restrictions of sales to unsupported regions](https://www.anthropic.com/news/updating-restrictions-of-sales-to-unsupported-regions)
25. [Interim Measures for the Management of Generative Artificial Intelligence Services (CAC)](https://www.cac.gov.cn/2023-07/13/c_1690898327029107.htm)
26. [Measures for Security Assessment of Cross-Border Data Transfers (CAC)](https://www.cac.gov.cn/2022-07/07/c_1658811536396503.htm)
27. [KrASIA — Surging users, widening losses, and leased compute behind SiliconFlow's IPO filing](https://kr-asia.com/surging-users-widening-losses-and-leased-compute-behind-siliconflows-ipo-filing)
28. [TechCrunch — OpenRouter more than doubles valuation to $1.3B in a year](https://techcrunch.com/2026/05/26/openrouter-more-than-doubles-valuation-to-1-3b-in-a-year/)
29. [The Crypto Times — Justin Sun's B.AI Draws Attention Amid Anthropic's Crackdown](https://www.cryptotimes.io/2026/07/03/justin-suns-b-ai-anthropics-china-claude-ban-crypto-loophole/)
30. [36Kr / APPSO — Trump and Justin Sun Are Both AI Scalpers Now: How Deep Does This Profitable Business Go?](https://36kr.com/p/3804052084563717)
31. [NewAPI (QuantumNous/new-api, AGPLv3)](https://github.com/QuantumNous/new-api)
32. [One API (songquanpeng/one-api)](https://github.com/songquanpeng/one-api)
33. [IT Home — CAICT: China's daily token-call volume reaches 140 trillion](https://www.ithome.com/0/978/450.htm)
34. [IRIS — Budget Black-Box Model Identity Auditing (arXiv:2607.20860)](https://arxiv.org/abs/2607.20860)
