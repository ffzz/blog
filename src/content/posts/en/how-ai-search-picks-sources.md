---
title: How AI Search Picks Its Sources
description: Most GEO advice never separates getting found from getting cited. Here are the six gates a page passes before it lands in an AI answer, what the big AI companies have actually published, what the research really found, and which popular tips fall apart when you check them.
pubDate: 2026-08-10
tags: ['ai', 'geo', 'seo']
---

There has been a flood of writing about GEO (Generative Engine Optimization) and AEO (Answer Engine Optimization) over the past six months. The awkward part is that it contradicts itself.

Write an llms.txt, one post says. Nobody reads that file, says the next. Structured data is your ticket into AI search. Structured data does nothing. Eighty-three percent of AI citations come from pages outside the top ten, so classic SEO is finished. The overlap is actually 90 percent, so nothing has changed.

These claims cannot all be true at once.

So I went through the primary sources: official docs from each AI company, the actual papers from KDD and EMNLP, the original reports from a few research shops. Most of the disagreement traces back to one mix-up, which is treating "the AI found my page" and "the AI cited my page" as the same event.

They happen at different points in the process, and different things decide them. Blur the two and you get both of the stories people keep reporting: "I followed all the advice and never got cited once," and "I did nothing at all and get cited constantly."

## A generative engine is a pipeline

When you ask ChatGPT or Google something, no system sits there scoring pages in an "AI index" and picking a winner.

Google's own documentation describes the mechanism. AI Overviews and AI Mode run on RAG (retrieval-augmented generation, which Google also calls grounding), defined as "relying on our core Search ranking systems to retrieve relevant, up-to-date web pages." A query may also trigger fan-out, which Google defines as "a set of concurrent, related queries generated" by the system. Ask about killing lawn weeds and it may search herbicides, chemical-free removal, and prevention all at once.[1][2]

OpenAI describes something similar. When ChatGPT search uses third-party search providers, it "typically rewrites your query into one or more targeted queries" before sending them off.[5]

So between your page and a footnote in an AI answer sit six gates:

| Gate | What happens | Why pages fail here |
| --- | --- | --- |
| 1. Crawlable | Whether each company's bot can fetch your page | A robots.txt mistake, or blocking a bot you meant to allow |
| 2. Indexed | Whether the page is in the index being searched | Ordinary indexing problems |
| 3. Retrieved | Some sub-query pulls your page into the candidate set | Your content does not match the **sub-query** |
| 4. In context | After reranking, your chunk makes it into the model's context window | Another page's chunk fits the sub-query better |
| 5. Used | The model actually draws on your text when writing | Too vague, too hard to use, too thin on evidence |
| 6. Attributed | The footnote it generates points at you | Attribution itself is unreliable |

I did not invent this framing. A 2026 paper that formalizes GEO states that citation failures "can occur across retrieval, fetching, parsing, attribution, and generation," and argues that citation outcomes should be studied as a pipeline rather than as a single ranking event.[12]

With those six gates in hand, the contradictory claims each land somewhere specific.

### The "83 percent aren't in the top ten" paradox

Google says its generative AI features are "rooted in our core Search ranking and quality systems."[2] Yet study after study finds that most AI citations sit outside the organic top ten. Ahrefs ran 15,000 long-tail queries and found only 12 percent of AI-cited URLs ranked in Google's top ten. ChatGPT, Gemini, and Copilot each came in around 8 percent; Perplexity was higher at roughly 29 percent.[16]

Both sides are telling the truth. Fan-out means the ranking that matters belongs to a sub-query, and the sentence the user typed is only the starting point.

A page can sit at position 80 for what the user actually typed while sitting at position 2 for some sub-question the system generated on its own. It gets cited because it won a query you never saw. The studies measure where AI-cited links rank for the original query. Google is describing which ranking system does the retrieval. The two statements are about different queries.

This is also why optimizing around a single keyword keeps paying less: you may be polishing a phrase the AI never searched.

### Getting crawled is not the same as getting cited

Gate six is shakier than most people assume.

Cloudflare tracks a number it calls the crawl-to-refer ratio: how many pages an AI company's bots fetch for every visitor it sends back. In the week of 19–26 June 2025, Anthropic sat at 70,900:1, meaning close to 71,000 page requests for a single referral. Mistral sat at 0.1:1 in the same window, sending ten times more referrals than crawl requests.[18]

The gap comes mostly from business model, since crawling for training was never going to produce a citation. Cloudflare flags a bias running the other way: traffic referred by Claude's native app carries no Referer header, and they believe the same holds for other native apps, so these ratios "may overstate the respective ratios, but it is unclear by how much." Treat any single number here as a snapshot of one week rather than a stable metric. What it shows is the order of magnitude.

Attribution is shaky too. In March 2025, Columbia's Tow Center tested eight AI search products across 1,600 queries by pasting an excerpt from an article and asking for the headline, date, publisher, and URL. The tools got it wrong more than 60 percent of the time. Perplexity, the best performer, still missed on 37 percent. Grok-3 was wrong about 94 percent of the time. They also invented links and cited syndicated copies instead of the original.[19]

One aside worth having. Plenty of write-ups give this study's error rate as 76.5 percent. That number is real, and it comes from a different report: the Tow Center's November 2024 test of ChatGPT Search alone, which took 200 quotes from 20 publishers and got partially or entirely wrong answers on 153 of them. 153 out of 200 is 76.5 percent.[21] The usual slip is attaching a ChatGPT-only figure to the March 2025 study of eight engines. Different subject, different sample.

Right number, wrong source is the most common way GEO figures go bad. More on that later.

## What the AI companies have actually published

Every disclosure so far covers what I would call the plumbing: which bot does what, how to block it, where to see your data. Nobody has published anything about ranking, meaning why a system picked source A over source B.

| Company | Bots | Publishes IP ranges | Official guidance | Official reporting |
| --- | --- | --- | --- | --- |
| Google | Googlebot, Google-Extended | Yes | Yes, and it is detailed | Search Console generative AI reports |
| OpenAI | GPTBot, OAI-SearchBot, ChatGPT-User, OAI-AdsBot | Yes (four JSON endpoints) | None | None |
| Anthropic | ClaudeBot, Claude-SearchBot, Claude-User | Yes | None | None |
| Microsoft | Bingbot | Yes | Partial (sitemaps, IndexNow) | Bing Webmaster Tools AI Performance |
| Perplexity | PerplexityBot, Perplexity-User | Yes | Help-centre level | None |

### Google, the only one offering real guidance

Two Google documents are worth reading word for word: one on AI features and your site[1], one specifically on optimizing for generative AI features[2]. The second carries the most information and gets quoted the least.

There is exactly one hard requirement: "To be eligible to be shown as a supporting link in AI Overviews or AI Mode, a page must be indexed and eligible to be shown in Google Search with a snippet." Right after it comes this: "There are no additional requirements to appear in AI Overviews or AI Mode, nor other special optimizations necessary."[1]

On 3 June 2026, Search Console launched generative AI performance reports, splitting out impressions from AI Overviews, AI Mode, and Discover for the first time.[3] You get impressions, pages, countries, devices, and dates down to the hour. You do **not** get clicks, CTR, or query terms. Google notes this data was already counted in the overall performance report and says it plans to add "additional metrics over time." Only a subset of sites has access so far.

The same day, Google announced a control letting site owners decide whether to appear in and help ground its generative AI features.[25] The company states the control "will not be used as a ranking signal for search results outside of these generative AI Search features," while sites that opt out "will not receive traffic or impressions from our generative AI features." It went first to a subset of UK site owners, and Google connects this to its work with regulators including the UK's Competition and Markets Authority. This control and Google-Extended do separate jobs, since Google-Extended governs training.

### OpenAI, clear about plumbing and silent past it

OpenAI splits its crawlers four ways:[4]

- **GPTBot** trains the foundation models. Blocking it signals that your content "should not be used in training"
- **OAI-SearchBot** indexes for ChatGPT search. OpenAI states plainly that "sites that are opted out of OAI-SearchBot will not be shown in ChatGPT search answers"
- **ChatGPT-User** fetches pages when a user triggers it mid-conversation. OpenAI notes that "robots.txt rules may not apply" to user-initiated actions
- **OAI-AdsBot** checks ad landing pages for safety and is not used for training

The line that matters most: "Each setting is independent of the others." Blocking GPTBot leaves OAI-SearchBot untouched, and the reverse holds too.

On why one source gets picked over another, OpenAI has published no weighting at all. Shopping is the lone exception, where the ranking factors are public: relevance to the query, availability, price, star ratings and review quality, whether the merchant is the primary seller, and whether Instant Checkout is enabled. Every "ChatGPT ranking factors" list you have read elsewhere was reverse-engineered from citation samples, with no confirmation from OpenAI.

### Anthropic, three bots that all honour robots.txt

Anthropic's support doc lists three crawlers: ClaudeBot for training, Claude-User for fetches a user triggers, and Claude-SearchBot for search indexing, each with a note on what breaks if you block it.[6]

One detail deserves its own line. All three honour robots.txt, including the user-triggered Claude-User. That is stricter than OpenAI and Perplexity, both of which warn that user-initiated fetches may not follow robots.txt. The doc puts it this way: "Anthropic uses different robots to enable website owner transparency and choice." IP ranges are published as well, so you can verify traffic is genuine.

A correction on my own part. Before checking, I had read secondhand claims that Anthropic publishes no IP ranges. The official doc says the opposite: "If a crawler has a source IP address on this list, it indicates that the crawler is coming from Anthropic." Secondhand information on this topic is worth very little.

### Microsoft, the only one handing you citation counts

On 10 February 2026, Bing Webmaster Tools launched an AI Performance report showing how your content gets cited across Microsoft Copilot, AI summaries in Bing, and some partner integrations: how many citations, which URLs, and how it moves over time. Microsoft frames it as "an early step toward Generative Engine Optimization (GEO) tooling in Bing Webmaster Tools."[7] In March it expanded to map grounding queries to the specific pages being cited.

This is the only product where a vendor tells you directly how often AI cited you. Any verified site can use it, with no waitlist.

The content advice runs to two items: keep things accurate and current, and use sitemaps plus IndexNow for freshness, where `lastmod` should use ISO 8601 with a timestamp as a key freshness signal while `changefreq` and `priority` are ignored.[8] Microsoft also says outright that "no tool can guarantee when or how your content will appear in AI-generated results."

### Perplexity, the thinnest disclosure

Help-centre notes and little else: PerplexityBot surfaces and links your site in results, Perplexity-User handles user-triggered fetches, and IP ranges are published for WAF allowlists.

People often assume Perplexity runs its own full web index. Based on its public crawler notes and outside observation, it looks more like a mix of its own crawling and third-party search APIs, though Perplexity has never formally described how its index is built, so treat this one as outside inference.

## What the research has actually shown

### The paper everyone quotes, and what it really says

Nearly every GEO article traces back to *GEO: Generative Engine Optimization* from KDD 2024.[9] It tested nine tactics. Here is Table 1 straight from the paper, with a baseline of 19.3:

| Method | Position-Adjusted Word Count | Subjective Impression |
| --- | --- | --- |
| No optimization (baseline) | 19.3 | 19.3 |
| Keyword Stuffing | 17.7 | 20.2 |
| Unique Words | 20.5 | 20.4 |
| Authoritative | 21.3 | 22.9 |
| Easy-to-Understand | 22.0 | 20.5 |
| Technical Terms | 22.7 | 21.4 |
| Cite Sources | 24.6 | 21.9 |
| Fluency Optimization | 24.7 | 21.9 |
| Statistics Addition | 25.2 | 23.7 |
| Quotation Addition | 27.2 | 24.7 |

The best method beat the baseline by 41 percent on word count and 28 percent on subjective impression. Adding quotations, statistics, and source citations all worked, as did cleaning up how the text reads.

Keyword stuffing was the only tactic that scored below doing nothing: 17.7 against 19.3. The paper reproduced this on Perplexity.ai as a live engine, where keyword stuffing came in about 10 percent worse than baseline.

The paper also breaks results down by topic. Law and government questions respond to statistics. Debate and history respond to an authoritative voice and quotations. Factual questions respond to source citations. The strongest pairing was fluency plus statistics, beating any single tactic by more than 5.5 percent.

### Three limits almost nobody mentions

First, the "generative engine" in the paper is simulated. The setup takes the top five Google results and feeds them to GPT-3.5-turbo to write an answer with citations. That is neither ChatGPT nor AI Overviews. The first version went up in November 2023, squarely in the GPT-3.5 era.

Second, the subjective impression score was graded by GPT-3.5 itself using G-Eval, so the LLM played both contestant and judge.

Third, the whole experiment assumes you are already in the top five retrieved results.

The paper works on gate five: you have been retrieved, you are in the context window, and the question is how to make the model lean on your passage. It never touches gates one through three, which is where most people are actually stuck.

That reading is not mine alone. A 2026 paper building on this line spells it out in its limitations: its evaluation uses a fixed candidate set of five retrieved pages plus one page under the author's control, and "we assume that the advertiser page has already been admitted into the candidate set, and therefore do not model upstream retrieval or ranking mechanisms." It describes itself as "optimizing citation likelihood conditional on retrieval, rather than addressing end-to-end retrieval and generation."[14]

Selling gate-five findings as an answer for the whole pipeline is the most common error in GEO writing today.

### The equalizer effect is zero-sum

Table 2 gets quoted constantly as proof that small sites can leapfrog: a site ranked fifth gained 115.1 percent visibility after adding source citations.

Here is the full table. Note that these are the results when every source optimizes at the same time:

| Method | Rank 1 | Rank 2 | Rank 3 | Rank 4 | Rank 5 |
| --- | --- | --- | --- | --- | --- |
| Cite Sources | −30.3% | +2.5% | +20.4% | +15.5% | +115.1% |
| Quotation Addition | −22.9% | −7.0% | +3.5% | +25.1% | +99.7% |
| Statistics Addition | −20.6% | −3.9% | +8.1% | +10.0% | +97.9% |

Much of that 115 percent gain at rank five comes out of the 30 percent drop at rank one. Visibility gets redistributed, and the total does not grow.

The implication is bleak: once everyone runs the same playbook, the advantage decays. I have yet to see this mentioned in a single GEO pitch.

### The 2026 follow-ups walk the claims back

- A critical survey works through the methodology problems across GEO research, argues visibility should be treated as a vector rather than a single rank, and questions the causal claims the benchmark setup can support[11]
- Another splits GEO into citation selection (did you get picked) and citation absorption (how deeply the answer leaned on you), adds a reproducibility checklist, and reports counter-intuitive results that undercut shallow heuristics like maximizing citation count[12]
- A third points out that most evaluations are non-competitive, while real answer engines cite a handful of sources, so a page has to beat the other candidates instead of merely being good enough[13]

The direction is consistent: the more carefully people look, the more conditions get attached to those early clean results. Most of these are still preprints, so treat the magnitudes as unsettled.

### The adversarial route works and is still a bad idea

An EMNLP 2024 paper showed that injecting adversarial text into a page can manipulate which sources a conversational search engine ranks, pushing low-ranked products up, with attacks that transfer to live products like Perplexity.ai. The authors frame this as a security problem, noting that conversational search is a black box with no interpretable ranking mechanism, which is what makes it fragile.[10]

Technically possible does not make it a usable strategy. It sits squarely inside what every spam policy targets, and the reputational cost of getting caught dwarfs any short-term gain.

## Why the numbers disagree with each other

Ask how many AI citations come from the organic top ten and you will get 12, 17, 32, 38, 48, 54, and 90 percent, a spread of more than seven times.

Four reasons, worth knowing before you trust any of them.

**The rank window differs.** Top 10, top 20, and top 100 are three different questions. When one firm reports both 54 percent and 17 percent, one figure is usually top-100 overlap and the other top-10.

**The denominator differs.** "What share of citations rank in the top ten" and "what share of AI answers contain at least one top-ten link" are separate numbers, and the second runs much higher. seoClarity analysed 362,000 US desktop queries, and both readings hold in the same dataset: counted by citation, top-ten overlap is 32 percent; counted by answer, 90 percent of AI Overviews contain at least one top-ten link, 94 percent for the top 20, and 89 percent when only a single source is cited.[17]

Same study, and 32 percent and 90 percent are both true. Which one you quote depends on what you want to prove.

**Measurement keeps changing.** Ahrefs has said its parsing improved and now catches more citations, so part of the "decline" people observe is better measurement rather than a change in Google's behaviour.[16]

**Some of the movement is real.** The direction holds up. The multiples do not.

The methodology lesson outlasts any of the findings. When you meet a GEO statistic, ask three things: what was the sample, what was the denominator, what was the rank window. If you cannot answer them, treat the number as noise.

## Popular beliefs that fall apart

Each of these comes with an official quote or experimental data where I could find one.

**1. llms.txt is the robots.txt of the AI era.**

Google's documentation is blunt: "You don't need to create new machine readable files, AI text files, markup, or Markdown to appear in Google Search." And: "Doing so will neither harm nor help your site's visibility or rankings in Google Search, as Google Search ignores them."[2]

John Mueller had already said "no AI system currently uses llms.txt," adding that "it's super-obvious if you look at your server logs," and compared the file to the long-abandoned keywords meta tag: this is what a site owner claims their site is about, so why not check the site directly? Gary Illyes has said Google does not support it and has no plans to.[20]

Google only speaks for Google, though. To know whether other engines read the file, you look at server logs, and the large-sample data lines up:

| Study | Sample | Result |
| --- | --- | --- |
| Ahrefs (May 2026)[22] | 137,210 domains | 28% publish an llms.txt, and **97% of those got zero requests that month** |
| OtterlyAI (90 days)[23] | 62,100 AI bot requests | 84 hit llms.txt, or 0.1% |
| SE Ranking[24] | ~300,000 domains | 10.13% adoption, no observed effect on AI citations |

The most telling detail sits in the Ahrefs data: **no AI bot requested an llms.txt that did not exist. They never go looking for the file.** Of the 404s for missing llms.txt files, 98 percent came from humans, mostly SEOs checking competitors.

Among the 3 percent of files that did get fetched, retrieval bots (the ones deciding whether you get cited) accounted for just 1.1 percent of requests, agents for 10.5 percent, and training crawlers for 5.3 percent. Claude-Code on its own outfetched every individual retrieval bot.

So there are two separate questions here. llms.txt genuinely helps **coding agents**, and Anthropic, Stripe, Cloudflare, and Vercel all maintain one as a routing layer for exactly that, with log data to back it up. For **search visibility** it shows no measured effect, because the crawlers that drive search citations barely touch it.

If your readers are developers pointing Claude Code or Cursor at your docs, writing an llms.txt makes sense. If your goal is getting quoted by ChatGPT, no evidence supports it today.

**2. Adding schema.org structured data lifts AI visibility.**

Google's words: "Structured data isn't required for generative AI search, and there's no special schema.org markup you need to add."[2]

Do not overcorrect. Structured data still earns rich results and other classic placements, and Google recommends keeping it consistent with your visible text. It simply gives you no extra leverage in AI search.

**3. You should chop content into small pieces for the AI.**

Google's words: "There's no requirement to break your content into tiny pieces for AI."[2]

**4. AI search needs a special writing style, or a magic word count.**

Two more from Google: "You don't need to write in a specific way just for generative AI search," and "There's no ideal page length."[2]

**5. GEO is a new discipline replacing SEO.**

Retrieval runs through the same core ranking systems and the same index. Google says its generative AI features are "rooted in our core Search ranking and quality systems," which is why ordinary SEO practice still applies.[2] Gates three through six changed. Gates one and two did not, and that is where most sites get stuck.

**6. Keyword stuffing and stacked FAQs raise your odds of being cited.**

The GEO paper measured it: keyword stuffing scored 17.7 against a 19.3 baseline. Worse than doing nothing, on both the simulated engine and Perplexity.[9]

**7. Hidden white text and buried prompts can steer the model.**

Technically true, as that EMNLP 2024 paper demonstrated.[10] It is a security finding rather than an optimization method. It falls under spam enforcement and carries a real reputational risk.

**8. Blocking GPTBot protects your content without costing visibility.**

OpenAI says "each setting is independent of the others," and Anthropic's three crawlers work the same way.[4][6] Block the wrong one and the consequence is immediate: shut out OAI-SearchBot and you disappear from ChatGPT search answers. Refusing training while keeping search visibility means naming the specific user-agents.

**9. Some GEO tool can see internal metrics.**

Google's words: "Be wary of third-party tools that promise ranking success or claim to use 'internal' Google metrics. No third-party tool has access to our internal ranking or AI systems."[2]

**10. Getting crawled means getting seen.**

The crawl-to-refer ratios show the size of the gap, with Anthropic fetching nearly 71,000 pages that week per referral sent back.[18] Training crawls were never going to become citations anyway. A log full of AI bots and a citation in an AI answer are independent events.

**11. Mass-producing pages aimed at fan-out sub-queries.**

Google states that creating separate content for every possible query variation, primarily to manipulate rankings or generative AI responses, violates its scaled content abuse spam policy, and that "a high quantity of pages doesn't make a site higher quality or more relevant."[2]

**12. Racking up third-party mentions lifts AI visibility.**

This one has some nuance, so it gets the next section.

## What the evidence actually supports

I have sorted these by how strong the evidence is. The sorting matters more than the list, because the usual failure in GEO writing is presenting all three tiers with equal confidence.

### Tier A: stated by the vendors themselves

- Configure robots.txt per bot. Separate training, search, and user-triggered fetching instead of applying one blanket rule. To refuse training while keeping AI search visibility, name the user-agents precisely
- Keep pages indexable and snippet-eligible. Google calls this the only hard requirement for AI Overviews and AI Mode[1]
- Read the official reports. Search Console's generative AI reports[3] and Bing Webmaster Tools AI Performance[7] are the only two first-party data sources that exist
- Use sitemaps plus IndexNow for freshness, with `lastmod` in ISO 8601 including a timestamp[8]
- Keep structured data consistent with visible text. That phrasing is deliberate, since consistency is the recommendation and "add schema to boost AI visibility" is not

### Tier B: experimental support, with clear boundaries

Everything here comes from the GEO paper, so keep remembering that it optimizes gate five and assumes you have already been retrieved.

- Add concrete statistics, checkable quotations, and source citations. The three strongest tactics in the paper, topping out at 41 percent over baseline[9]
- Improve how the writing reads, worth 15 to 30 percent
- Pick tactics by topic. Law and government respond to statistics, debate and history to an authoritative voice and quotations, factual questions to source citations
- Earn genuine third-party mentions. Ahrefs studied 75,000 brands with DR above 40 and found unlinked brand web mentions correlate with AI Overview mentions at a Spearman coefficient around 0.664, against 0.218 for backlinks (referring domains). A follow-up put YouTube mentions highest at about 0.737[15]

Read that last one together with its two caveats. Ahrefs stresses that correlation is not causation: big brands naturally accumulate both mentions and AI visibility, so the real driver may be brand strength with mentions riding along. And Google explicitly warns against pursuing "inauthentic 'mentions' across the web."[2] What survives is an argument for making things worth covering, and none at all for buying mentions.

### Tier C: reasonable, and unverified

Answer at the top of a section then expand, one claim per heading, conclusions written so they stand on their own.

These fit the intuition behind chunk-level retrieval: if retrieval works on passages, a self-contained passage plausibly travels better. No vendor has confirmed it, and I found no controlled experiment. Google has said you do not need to write any particular way for AI.

I write like this anyway, because it serves human readers. That reason has nothing to do with AI, and the distinction is worth keeping straight.

One more that I had drafted into Tier A before demoting it myself: **server-render the text you want cited**, on the theory that LLM-side fetchers do not reliably run client-side JavaScript. The claim circulates widely and I suspect it is mostly right, but across all five companies' documentation, none states whether it renders JavaScript. With no vendor language to point at, it belongs in Tier C. An article making this argument does not get to exempt itself.

## Where the edges are

Having read through all of it, I hold a narrower position than when I started.

Two things have real evidence behind them. Miss the index and nothing else matters. And concrete, checkable content, meaning real data, real quotations, clear sourcing, did raise the odds of being cited under the experimental conditions that have been tested.

Most of the rest is gate-five findings dressed up as whole-pipeline answers, correlations read as causes, or numbers that got mangled in transit.

There is one more layer. The GEO paper's own Table 2 shows the game is zero-sum. Once everyone runs the same tactics, the gains wash out, and what remains is whether the content deserves the citation: whether you have data nobody else has, whether you actually explained the thing.

That sounds like a platitude. It is also the only conclusion in this pile of material that does not depend on any vendor's algorithm and will not expire with the next model update.

---

*This is a set of notes assembled from public sources. AI search changes quickly. Every official document, report, and paper I relied on is listed below with its date, and the vendors' current documentation should win any disagreement. Where I marked something unverified, I mean it literally: I found no evidence for it and none against it.*

## References

1. [Google Search Central — AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)
2. [Google Search Central — Google's guide to optimizing for generative AI features on Google Search](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
3. [Google Search Central Blog — Introducing Search Generative AI performance reports in Search Console](https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports)
4. [OpenAI — Bots](https://developers.openai.com/api/docs/bots)
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
