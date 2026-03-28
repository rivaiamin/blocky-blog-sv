# blocky-blog-sv

A **block-based blog** built with **SvelteKit** and **Editor.js**. Posts are stored as JSON blocks in PostgreSQL (Drizzle ORM). Posts that contain **divider** blocks can be read as an **Instagram-style stories/slideshow** with autoplay, progress UI, and Animate.css transitions.

Full product requirements for the stories experience are in [`PRD.md`](./PRD.md). Slide boundaries use `type === "divider"` in `posts.blocks[]`; there is no separate schema for slides.

## Features

- **Editor**: paragraph, header, list, quote, **image** (authenticated upload to `static/uploads/editor` with server-side optimization via **sharp**), **divider** (slide breaks + horizontal rule in article view), bubble text, **GIF** (Klipy API when `KLIPY_API_KEY` is set).
- **Reading**: normal article rendering, or **stories mode** when splitting by dividers yields **more than one** non-empty slide (see PRD for edge cases, controls, reduced motion, and acceptance criteria).
- **Auth**: Better Auth (sign-in, sessions, protected edit routes).

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

Editor.js, stories UI, image pipeline, and extra tools were added afterward.
