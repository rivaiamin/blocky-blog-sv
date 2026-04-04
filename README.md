# blocky-blog-sv

A **multi-tenant, block-based blog** built with **SvelteKit** and **Editor.js**. Each author has a public **`/{username}`** space: their own **site settings** (theme, hero, name), **published posts** on their home page, and a **dashboard** to manage drafts and posts. Data lives in **PostgreSQL** (Drizzle ORM). Posts that contain **divider** blocks can be read as an **Instagram-style stories/slideshow** with autoplay, progress UI, and Animate.css transitions.

- **Product requirements**: [`PRD.md`](./PRD.md) — multi-tenant routing and author isolation, plus the stories/slideshow PRD. Slide boundaries use `type === "divider"` in `posts.blocks[]`; there is no separate schema for slides.

## Features

- **Multi-tenant URLs**: `/{username}/` (public home), `/{username}/dashboard`, `/{username}/settings`, `/{username}/post/{slug}`, `/{username}/edit/{id}`. Root **`/`** is a neutral **author directory** (not themed per tenant).
- **Editor**: paragraph, header, list, quote, **image** (authenticated upload to `static/uploads/editor` with server-side optimization via **sharp**), **divider** (slide breaks + horizontal rule in article view), bubble text, **GIF** (Klipy API when `KLIPY_API_KEY` is set).
- **Reading**: normal article rendering, or **stories mode** when splitting by dividers yields **more than one** non-empty slide (see PRD for edge cases, controls, reduced motion, and acceptance criteria).
- **Auth**: Better Auth (email/password, sessions). Optional **username** at signup; **`/setup-username`** if an account has no handle yet. Legacy paths **`/dashboard`**, **`/settings`**, **`/edit/{id}`** redirect into the signed-in user’s tenant; **`/post/{slug}`** without an author prefix is no longer used (use `/{username}/post/{slug}`).

## Tech stack

- Svelte 5, SvelteKit, TypeScript, Tailwind CSS
- Drizzle ORM + PostgreSQL
- better-auth
- @editorjs/\*, animate.css, sharp

## Setup

1. **Install** (this repo uses [pnpm](https://pnpm.io/)):

   ```sh
   pnpm install
   ```

2. **Environment**: copy `.env.example` to `.env` and set:
   - `DATABASE_URL` — PostgreSQL connection string
   - `BETTER_AUTH_SECRET` — see [Better Auth installation](https://www.better-auth.com/docs/installation)
   - `ORIGIN` — your app origin where required for auth
   - `KLIPY_API_KEY` — optional, for the GIF tool in the editor

3. **Database**:

   ```sh
   pnpm db:push
   ```

   **Upgrading from an older DB** (single global `site_settings` with `setting_key`): Drizzle may warn about adding **`user_id`** and dropping **`setting_key`**. That is expected: each author now owns one settings row keyed by **`user_id`**, not by `setting_key`. Before accepting data-loss prompts, either:
   - run a **manual migration** (add nullable `user_id`, `UPDATE` the existing row to set `user_id` to your user’s id, then enforce NOT NULL / unique and drop `setting_key`), or
   - accept reset of `site_settings` if you don’t need the old row.

   Post **slugs** are **unique per author** (not globally); `pnpm db:push` may adjust constraints accordingly.

## Developing

```sh
pnpm dev
```

Open the URL Vite prints (use `--open` if your setup supports it).

## Scripts

| Command                                                     | Purpose                            |
| ----------------------------------------------------------- | ---------------------------------- |
| `pnpm dev`                                                  | Dev server                         |
| `pnpm build`                                                | Production build                   |
| `pnpm preview`                                              | Preview production build           |
| `pnpm check`                                                | `svelte-check` + sync              |
| `pnpm lint` / `pnpm format`                                 | Prettier + ESLint                  |
| `pnpm test`                                                 | Unit (Vitest) + E2E (Playwright)   |
| `pnpm test:unit`                                            | Vitest only                        |
| `pnpm test:e2e`                                             | Playwright only                    |
| `pnpm db:push` / `db:generate` / `db:migrate` / `db:studio` | Drizzle                            |
| `pnpm auth:schema`                                          | Regenerate Better Auth schema file |

## Deployment

The project uses [`@sveltejs/adapter-vercel`](https://svelte.dev/docs/kit/adapters). Configure production `DATABASE_URL`, `BETTER_AUTH_SECRET`, `ORIGIN`, and any other secrets your host expects. Ensure uploaded editor images are persisted (e.g. use a writable filesystem or replace local uploads with object storage for serverless).

---

## Scaffolding reference

This app was created with [`sv`](https://github.com/sveltejs/cli). To recreate a similar stack:

```sh
pnpm dlx sv@0.12.8 create --template minimal --types ts --add prettier eslint vitest="usages:unit,component" playwright tailwindcss="plugins:typography" sveltekit-adapter="adapter:vercel" devtools-json drizzle="database:postgresql+postgresql:postgres.js+docker:no" better-auth="demo:password" mcp="ide:cursor+setup:remote" --install pnpm blocky-blog-sv
```

Editor.js, stories UI, multi-tenant routing, image pipeline, and extra tools were added afterward.
