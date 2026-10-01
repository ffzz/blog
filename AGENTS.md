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

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
