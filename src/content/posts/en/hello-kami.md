---
title: Typography as Constraint
description: This blog's visual system is ported from Kami — a constraint system built for print. These are the trade-offs the port forced.
pubDate: 2026-08-04
tags: ['design', 'typography']
---

This is a **sample post** for checking that the typographic rules actually apply. Delete it once the real first post exists.

Kami's philosophy compresses into one sentence: *warm parchment canvas, ink-blue accent, serif carries hierarchy, avoid cool grays and hard shadows*.

## Two shapes of emphasis

The line above is wrapped in `*`. On English pages it renders as *real Charter italic* — Kami bans italic in print templates, but broke that rule itself for its screen-only landing page, and a blog is screen-only.

Text wrapped in `**` becomes ink blue with **no change in weight**. This is Kami's most distinctive rule: when something needs more presence, reach for colour, size, or a left rule — never bold.

### Code

Inline code looks like `getAvailableLocales()`. The syntax highlighting theme lands in P2:

```python
async def embed(chunks: list[str]) -> Vectors:
    resp = await client.embeddings(model="bge-m3", input=chunks)
    return Vectors.from_raw(resp.data, dim=1024)
```

> Blockquotes lift off the page through fill colour, with no closed border — the single left rule carries the weight.

## Lists and tables

- Never pure white as page background
- Every gray carries a yellow-brown undertone
- The accent covers no more than 5% of the surface

| Role | Hex |
| --- | --- |
| Parchment | `#f5f4ed` |
| Ink blue | `#1B365D` |
| Warm brown | `#8b4513` |

The one deliberate deviation is the type scale. Kami's ladder is in print points, which puts body text at 13px on screen — a density that only works on paper.[^1]

[^1]: The ratios are preserved; the whole ladder is recomputed against a 17px body.
