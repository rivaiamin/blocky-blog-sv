# Product requirements

This file holds product requirements for major product areas. The **multi-tenant** section describes how authors and public URLs work; the **stories** section describes the Instagram-style reader experience.

---

## PRD: Multi-tenant author sites (UGC)

### 1) Summary

The app is a **user-generated content** blog platform: each registered user can have a **public handle (username)** and their own **site settings**, **public home page**, **posts**, and **dashboard**. Public URLs are namespaced by username. The **root `/`** is a neutral landing page that lists authors; it does **not** use any tenant’s theme.

### 2) Goals

- **Per-author isolation**: settings, published listing, and post URLs scoped to that author.
- **Predictable URLs**: `/{username}/` (public home), `/{username}/dashboard`, `/{username}/settings`, `/{username}/post/{slug}`, `/{username}/edit/{id}`.
- **Registration & identity**: email/password via Better Auth; **username** optional at signup or set later via **choose username** flow.
- **Security**: dashboard, settings, and edit are only usable by the tenant owner (`403` if the signed-in user does not match `/{username}`).

### 3) Non-goals (current scope)

- Subdomains (e.g. `{username}.example.com`) — path-based tenants only.
- Teams, organizations, or shared blogs.
- Public profile fields beyond what site settings and posts already expose.

### 4) Users & use cases

- **Visitor**: open `/`, pick an author, read published posts at `/{username}/post/{slug}`.
- **Author**: sign in, set username if missing, manage posts and front-page theme under their prefix.

### 5) Routing & UX

| Route                     | Who                    | Purpose                                                     |
| ------------------------- | ---------------------- | ----------------------------------------------------------- |
| `/`                       | Anyone                 | Directory / welcome; neutral chrome                         |
| `/login`, `/logout`       | Anyone                 | Auth                                                        |
| `/setup-username`         | Signed-in, no username | Claim handle; then redirect to `/{username}/dashboard`      |
| `/{username}/`            | Anyone                 | Tenant home (hero + that author’s **published** posts only) |
| `/{username}/dashboard`   | Owner                  | CRUD posts for that author                                  |
| `/{username}/settings`    | Owner                  | Tenant **site** settings (name, hero, theme)                |
| `/{username}/post/{slug}` | Anyone                 | Published post (404 if wrong author or unpublished)         |
| `/{username}/edit/{id}`   | Owner                  | Editor (draft access per existing rules)                    |

**Legacy redirects** (bookmark compatibility): `/dashboard`, `/settings`, `/edit/{id}` redirect into the signed-in user’s `/{username}/…` or `/setup-username`. Old `/post/{slug}` without an author segment returns **404** with a short message (slug is only unique per author).

**Reserved usernames** must not collide with static routes (`login`, `api`, `dashboard`, etc.); implementation lives in server-side validation.

### 6) Data model (high level)

- **`user.username`**: nullable, unique when set; normalized (e.g. lowercase) for URLs and lookups.
- **`site_settings`**: **one row per user** via `user_id` (replaces the former singleton `setting_key` / `default` row pattern).
- **`posts`**: still keyed by `author_id`; **slug unique per author** (composite uniqueness), not globally — so two authors can both have a post slug `hello`.

### 7) Functional requirements (acceptance)

- **AC-M1**: Unknown or reserved `username` under `/{username}/…` yields **404**.
- **AC-M2**: Tenant home shows only that author’s **published** posts.
- **AC-M3**: Non-owner cannot open dashboard/settings/edit for another `username` (**403**).
- **AC-M4**: User without username is guided to `/setup-username` before using tenant management URLs.
- **AC-M5**: Root `/` does not load tenant theme from the database; tenant chrome uses that author’s `site_settings`.

### 8) Database migration note

Upgrades from the **single global** `site_settings` row (`setting_key`) must **attach that row to a `user_id`** before dropping `setting_key`. See README **Database** section.

---

## PRD: Post Stories / Slideshow (Instagram-style)

### 1) Summary

Turn a standard blog post into an auto-playing **stories/slideshow** experience. Post content is split into **slides** using existing **divider** blocks. Slides play automatically with a progress indicator, support pause-on-hold, and use default Animate.css transitions (with reduced-motion support).

### 2) Goals

- **Slide-based post consumption** similar to Instagram Stories.
- **Zero-migration** content model using existing `divider` blocks as slide separators.
- **Autoplay** with intuitive controls (prev/next, pause).
- **Default animations** per slide + per block using Animate.css.
- **Accessibility**: respect `prefers-reduced-motion`.

### 3) Non-goals (v1)

- Author-defined per-slide duration.
- Audio, video, stickers, reactions, analytics.
- Full-screen modal/overlay viewer (current is embedded in page layout).
- Server-side rendering changes or **stories-specific** schema changes (stories are derived from `posts.blocks[]`).

### 4) Users & Use cases

- **Reader**: consume a post quickly as a sequence of slides.
- **Author**: create slides by inserting **Divider** blocks in the editor.

### 5) UX Requirements

#### 5.1 Slide splitting

- A post is split into slides by `divider` blocks.
- `divider` is **not shown** as content inside a slide.
- Edge cases:
  - leading divider: ignored
  - multiple dividers: no empty slides
  - split produces only one slide (e.g. no dividers, or only leading/trailing dividers with a single content run): render as normal article (non-stories)
  - no divider: render as normal article (non-stories)

#### 5.2 Stories playback

- **Autoplay**: 5 seconds per slide by default.
- **Progress UI**: segmented top bar, one segment per slide.
- **Navigation**
  - Tap/click **left third**: previous slide
  - Tap/click **right third**: next slide
  - Tap/click **middle third**: toggle pause/play (optional but included)
- **Pause behavior**: **press/hold (pointer down) pauses**, release resumes.
- **Keyboard**
  - `ArrowLeft` / `ArrowRight`: prev/next
  - `Space`: pause/play toggle
  - `Escape`: exit stories view (navigate to that post’s **tenant home**: `/{username}`)

#### 5.3 Animations (default)

- **Slide enter**: Animate.css `fadeInRight`
- **Block enter**: Animate.css `fadeInUp` with stagger delay (e.g., 80ms increments)

#### 5.4 Reduced motion

If `prefers-reduced-motion: reduce`:

- Disable autoplay
- Disable animations
- Ensure content is still fully readable and navigable manually

### 6) Content Model / Data

- Use existing post schema: `posts.blocks[]`.
- Slide breaks are determined by blocks where `type === "divider"`.
- Stored in PostgreSQL; no separate “slides” table.

### 7) Functional Requirements (Acceptance Criteria)

- **AC1**: A post whose blocks split into **more than one slide** (at least one `divider` between non-empty content groups) renders in stories mode. A single-slide split stays in the normal article view even if a `divider` block exists (e.g. trailing divider after one section).
- **AC2**: Slides advance automatically every **5 seconds** when not paused.
- **AC3**: Holding pointer down pauses; releasing resumes.
- **AC4**: Left/right zones navigate prev/next; progress bar updates correctly.
- **AC5**: Slide transition and per-block animations apply by default.
- **AC6**: With reduced motion enabled, autoplay and animations are disabled.
- **AC7**: Posts that do not enter stories mode (including posts with no dividers, and posts where splitting yields only one slide) render exactly as the current article view.

### 8) Dependencies

- **animate.css** (runtime CSS dependency)

### 9) Open questions / Future enhancements

- Loop playback vs stop at last slide (currently stops/pauses at end).
- Add “Preview stories” from editor (planned as optional QoL).
- Per-slide duration, per-slide background, and richer media blocks.
