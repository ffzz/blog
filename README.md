# Astro Starter Kit: Minimal

```sh
npm create astro@latest -- --template minimal
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `pnpm install`            | Installs dependencies                            |
| `pnpm dev`                 | Starts local dev server at `localhost:4321`      |
| `pnpm build`               | Build your production site to `./dist/`          |
| `pnpm preview`             | Preview your build locally, before deploying     |
| `pnpm fonts`               | Regenerate the Chinese heading font subset       |
| `pnpm deploy`              | Build and publish to Cloudflare (local only)     |
| `pnpm astro ...`         | Run CLI commands like `astro add`, `astro check` |
| `pnpm astro --help`       | Get help using the Astro CLI                     |

## 📦 Publishing

Production (https://ben-chen.com, Cloudflare Worker `personal-blog`) is published **locally**, not from CI:

```sh
git pull        # pick up CMS commits and the CI font-subset write-back first
pnpm deploy     # pnpm build -> cf-wrangler build -> cf deploy --prebuilt (token from .env.local)
```

- GitHub Actions (`.github/workflows/ci.yml`) only runs a build check on push/PR; it **does not deploy**.
  The repo secret `CLOUDFLARE_API_TOKEN` is no longer used and can be deleted.
- Pushing to `main` (including a Sveltia CMS "Publish" at `/admin`) does not change the live site; run `pnpm deploy`.
- Dry run: `pnpm build && pnpm cf:output && node --env-file=.env.local ./node_modules/cf/bin/cf deploy --prebuilt --dry-run`.
- Do not use `cf build` (static Astro has no Build Output); `wrangler.jsonc` is kept only for rollback.
- Full guide: `PRD/2026-08-09-publishing-guide.md`.

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
