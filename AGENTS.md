## Project configuration

- **Language**: TypeScript
- **Package Manager**: pnpm
- **Add-ons**: prettier, eslint, vitest, playwright, tailwindcss, sveltekit-adapter, devtools-json, drizzle, better-auth, mcp

---

## Product & architecture (read before large changes)

- **Requirements**: [`PRD.md`](./PRD.md) — multi-tenant routes, auth, data model, stories/slideshow behavior.
- **Setup & DB notes**: [`README.md`](./README.md).

**Multi-tenant routing**

- Public and author UIs live under **`src/routes/[username]/`** (home, `dashboard`, `settings`, `post/[slug]`, `edit/[id]`).
- **`/`** is a neutral landing / author directory (no per-tenant theme from DB).
- **`/setup-username`**: required when a signed-in user has no `username`.
- Legacy redirects: `src/routes/dashboard`, `settings`, `edit/[id]` → tenant-prefixed URLs; `post/[slug]` without author is deprecated (404).

**Server code to touch for domain logic**

- **Users / tenants**: [`src/lib/server/users.service.ts`](src/lib/server/users.service.ts), [`src/lib/server/username.ts`](src/lib/server/username.ts) (reserved names, validation).
- **Per-author site theme & hero**: [`src/lib/server/site-settings.service.ts`](src/lib/server/site-settings.service.ts) — scoped by `userId`, not a global singleton.
- **Posts**: [`src/lib/server/posts.service.ts`](src/lib/server/posts.service.ts) — slugs unique **per author**; public reads often need **username + slug**.
- **Schema**: [`src/lib/server/db/schema.ts`](src/lib/server/db/schema.ts), [`src/lib/server/db/auth.schema.ts`](src/lib/server/db/auth.schema.ts); **auth config**: [`src/lib/server/auth.ts`](src/lib/server/auth.ts) (`user.additionalFields`, etc.).
- **Session user shape**: [`src/app.d.ts`](src/app.d.ts) — `username` on `Locals['user']` when present.

**UI conventions**

- Use **`resolve()` from `$app/paths`** for in-app `href` and `goto()` where ESLint enforces it (`svelte/no-navigation-without-resolve`).
- Tenant chrome: [`src/routes/[username]/+layout.svelte`](src/routes/[username]/+layout.svelte); neutral shell when **not** under `[username]`: [`src/routes/+layout.svelte`](src/routes/+layout.svelte).

---

## Svelte MCP server

You can use the Svelte MCP server for Svelte 5 and SvelteKit documentation and checks.

### 1. list-sections

Use this **first** to discover documentation sections (titles, `use_cases`, paths). For Svelte or SvelteKit questions, start here to find relevant sections.

### 2. get-documentation

Fetches full docs for one or more sections. After `list-sections`, pull **all** sections that match the task (using `use_cases` as a guide).

### 3. svelte-autofixer

Analyzes Svelte code and returns fixes/suggestions. **Use it when writing or editing `.svelte` files** (and re-run until clean when iterating).

### 4. playground-link

Generates a Svelte Playground link. **Only** after the user confirms they want it; **never** for code that was already written into this repo.
