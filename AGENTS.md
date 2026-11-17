## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Publishing

Production (https://ben-chen.com, Cloudflare Worker `personal-blog`) is published **locally**, not from CI:

```sh
git pull        # pick up CMS commits and the CI font-subset write-back first
pnpm run deploy # pnpm build -> cf-wrangler build -> cf deploy --prebuilt (token from .env.local)
```

Always write `pnpm run deploy`: bare `pnpm deploy` is pnpm's built-in workspace-deploy command and does not run the package script.

- GitHub Actions (`.github/workflows/ci.yml`) only runs a build check on push/PR; it **does not deploy**.
  The repo secret `CLOUDFLARE_API_TOKEN` is no longer used and can be deleted.
- Pushing to `main` (including a Sveltia CMS "Publish" at `/admin`) does not change the live site; run `pnpm run deploy`.
- Dry run: `pnpm build && pnpm cf:output && node --env-file=.env.local ./node_modules/cf/bin/cf deploy --prebuilt --dry-run`.
- Do not use `cf build` (static Astro has no Build Output); `wrangler.jsonc` is kept only for rollback.
- Full guide: `PRD/2026-08-09-publishing-guide.md`.

## Content Taxonomy & Tagging Rules

When writing, editing, or translating any post (`src/content/posts/`) or note (`src/content/notes/`), always follow these rules (also packaged in `.claude/skills/blog-taxonomy/SKILL.md`):

1. **Collection (`posts` vs `notes`)**:
   - `posts`: Technical deep dives, engineering guides, research, and career/practical articles.
   - `notes`: Series notes (e.g., *Programming Thinking*) and personal/cultural essays.
2. **Required `category` (pick exactly one from `src/consts.ts` -> `CATEGORIES`)**:
   - `ai-engineering`: AI engineering, coding agents, LLMs, prompt engineering, and AI search/GEO.
   - `software-design`: Software architecture, design principles, and programming thinking.
   - `practice-career`: Practical tech setups, hardware/self-hosting, and IT career topics.
   - `culture-notes`: Cultural, social, and personal reflections.
3. **Tags (`tags` in frontmatter)**:
   - Use lowercase hyphenated keys (`kebab-case`), typically 2–4 per article, matching bilingual pairs (`zh` and `en` must use identical `category` and `tags`).
   - Prefer existing tags defined in `TAG_LABELS` inside `src/lib/tags.ts`:
     `ai`, `agents`, `software-engineering`, `programming-thinking`, `design-principles`, `typescript`, `architecture`, `testing`, `llm`, `seo`, `self-hosting`, `hardware`, `career`, `canberra`, `culture`, `society`.
   - Avoid creating single-use fragmented tags (`TAG_PAGE_MIN_POSTS = 3` requires ≥ 3 posts per locale to generate a tag page).
   - If a new tag is genuinely needed, **you must add its `en` and `zh` display names to `TAG_LABELS` in `src/lib/tags.ts`** before committing.
4. **Pre-publish verification**: Run `heading-font.mjs`, `og-fonts.mjs`, `astro build`, `verify-build.mjs`, and `pagefind` before deploying.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
