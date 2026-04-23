<script lang="ts">
	import { resolve } from '$app/paths';

	let { data } = $props();

	function scrollToAuthors(event: MouseEvent) {
		event.preventDefault();
		document.getElementById('authors')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}
</script>

<div class="space-y-16">
	<section class="grid items-center gap-10 lg:grid-cols-2">
		<div class="max-w-2xl">
			<p
				class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-semibold tracking-wide text-slate-600"
			>
				<span class="h-2 w-2 rounded-full bg-[var(--color-primary)]" aria-hidden="true"></span>
				Multi-tenant blogs, one URL per author
			</p>

			<h1 class="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
				Own your blog, <span class="text-[var(--color-primary)]">keep it simple</span>, publish fast.
			</h1>
			<p class="mt-4 text-lg leading-relaxed text-slate-600">
				Pilakon hosts independent, per-author sites with their own posts and settings. No noisy feeds, no
				algorithm — just clean pages, a straightforward editor, and a stable home under <code>/username</code>.
			</p>

			<div class="mt-7 flex flex-wrap gap-3">
				<a
					href={resolve('/')}
					onclick={scrollToAuthors}
					class="inline-flex items-center justify-center rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/50 focus-visible:ring-offset-2"
					>Browse authors</a
				>

				{#if data.user}
					{@const un = data.user.username}
					{#if un}
						<a
							href={resolve(`/${un}/dashboard`)}
							class="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-white"
							>Go to dashboard</a
						>
					{:else}
						<a
							href={resolve('/setup-username')}
							class="inline-flex items-center justify-center rounded-xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm font-semibold text-amber-900 shadow-sm transition hover:bg-amber-100/70"
							>Choose your username</a
						>
					{/if}
				{:else}
					<a
						href={resolve('/login')}
						class="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-white"
						>Create your blog</a
					>
				{/if}
			</div>

			<dl class="mt-10 grid gap-6 sm:grid-cols-3">
				<div class="rounded-2xl border border-slate-200/70 bg-white/70 p-4">
					<dt class="text-xs font-semibold tracking-wide text-slate-500 uppercase">Per-author URL</dt>
					<dd class="mt-1 text-sm font-semibold text-[var(--color-primary)]">`/username`</dd>
					<dd class="mt-1 text-sm text-slate-600">Each author gets their own space.</dd>
				</div>
				<div class="rounded-2xl border border-slate-200/70 bg-white/70 p-4">
					<dt class="text-xs font-semibold tracking-wide text-slate-500 uppercase">Scoped content</dt>
					<dd class="mt-1 text-sm font-semibold text-[var(--color-primary)]">Slugs per tenant</dd>
					<dd class="mt-1 text-sm text-slate-600">No cross-author collisions.</dd>
				</div>
				<div class="rounded-2xl border border-slate-200/70 bg-white/70 p-4">
					<dt class="text-xs font-semibold tracking-wide text-slate-500 uppercase">Fast workflow</dt>
					<dd class="mt-1 text-sm font-semibold text-[var(--color-primary)]">Write → publish</dd>
					<dd class="mt-1 text-sm text-slate-600">A focused editor for real posts.</dd>
				</div>
			</dl>
		</div>

		<div class="relative">
			<div
				class="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] bg-[radial-gradient(closest-side,rgba(124,58,237,0.18),rgba(124,58,237,0))]"
			></div>

			<div class="overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70 shadow-sm">
				<div class="relative border-b border-slate-200/70 bg-white/60 p-6">
					<p class="text-xs font-semibold tracking-wide text-slate-500 uppercase">A calmer way to publish</p>
					<p class="mt-2 text-sm text-slate-600">
						Independent sites with shared infrastructure — simple for authors, clean for readers.
					</p>

					<!-- Header illustration (inline SVG) -->
					<svg
						class="mt-6 h-44 w-full"
						viewBox="0 0 820 240"
						fill="none"
						role="img"
						aria-label="Illustration of independent blogs and connections"
						preserveAspectRatio="xMidYMid meet"
					>
						<defs>
							<linearGradient id="bb-grad" x1="0" y1="0" x2="820" y2="240" gradientUnits="userSpaceOnUse">
								<stop stop-color="var(--color-primary)" stop-opacity="0.35" />
								<stop offset="1" stop-color="var(--color-primary)" stop-opacity="0.05" />
							</linearGradient>
							<filter id="bb-soft" x="-50%" y="-50%" width="200%" height="200%">
								<feGaussianBlur stdDeviation="10" />
							</filter>
						</defs>

						<path
							d="M40 160C120 40 250 40 330 160C410 280 540 280 620 160C700 40 780 40 800 120"
							stroke="var(--color-primary)"
							stroke-opacity="0.35"
							stroke-width="6"
							stroke-linecap="round"
						/>

						<circle cx="140" cy="128" r="44" fill="url(#bb-grad)" />
						<circle cx="140" cy="128" r="14" fill="var(--color-primary)" fill-opacity="0.35" />

						<circle cx="410" cy="98" r="56" fill="url(#bb-grad)" />
						<circle cx="410" cy="98" r="18" fill="var(--color-primary)" fill-opacity="0.35" />

						<circle cx="680" cy="150" r="44" fill="url(#bb-grad)" />
						<circle cx="680" cy="150" r="14" fill="var(--color-primary)" fill-opacity="0.35" />

						<g filter="url(#bb-soft)">
							<circle cx="250" cy="50" r="28" fill="var(--color-primary)" fill-opacity="0.18" />
							<circle cx="560" cy="55" r="36" fill="var(--color-primary)" fill-opacity="0.14" />
							<circle cx="760" cy="200" r="42" fill="var(--color-primary)" fill-opacity="0.12" />
						</g>

						<g stroke="var(--color-primary)" stroke-opacity="0.25">
							<rect x="88" y="78" width="104" height="78" rx="16" />
							<rect x="340" y="44" width="140" height="96" rx="18" />
							<rect x="628" y="104" width="104" height="78" rx="16" />
						</g>
						<g fill="var(--color-primary)" fill-opacity="0.22">
							<rect x="104" y="94" width="72" height="10" rx="5" />
							<rect x="104" y="114" width="56" height="10" rx="5" />
							<rect x="104" y="134" width="64" height="10" rx="5" />

							<rect x="364" y="66" width="92" height="12" rx="6" />
							<rect x="364" y="90" width="112" height="12" rx="6" />
							<rect x="364" y="114" width="76" height="12" rx="6" />

							<rect x="644" y="120" width="72" height="10" rx="5" />
							<rect x="644" y="140" width="56" height="10" rx="5" />
							<rect x="644" y="160" width="64" height="10" rx="5" />
						</g>
					</svg>
				</div>

				<div class="p-6">
					<div class="rounded-2xl border border-slate-200 bg-white p-5">
						<p class="text-xs font-semibold tracking-wide text-slate-500 uppercase">What you get</p>
						<ul class="mt-4 space-y-3 text-sm text-slate-700">
							<li class="flex gap-3">
								<span class="mt-1 h-2 w-2 shrink-0 rounded-full bg-[var(--color-primary)]" aria-hidden="true"></span>
								<span><span class="font-semibold text-slate-900">Tenant dashboards</span> for writing and managing posts.</span>
							</li>
							<li class="flex gap-3">
								<span class="mt-1 h-2 w-2 shrink-0 rounded-full bg-[var(--color-primary)]" aria-hidden="true"></span>
								<span><span class="font-semibold text-slate-900">Public pages</span> that load fast and stay readable.</span>
							</li>
							<li class="flex gap-3">
								<span class="mt-1 h-2 w-2 shrink-0 rounded-full bg-[var(--color-primary)]" aria-hidden="true"></span>
								<span><span class="font-semibold text-slate-900">Settings per author</span> (not a global template).</span>
							</li>
							<li class="flex gap-3">
								<span class="mt-1 h-2 w-2 shrink-0 rounded-full bg-[var(--color-primary)]" aria-hidden="true"></span>
								<span><span class="font-semibold text-slate-900">Clean URLs</span> for posts under each author.</span>
							</li>
						</ul>
					</div>

					<div class="mt-4 rounded-2xl border border-slate-200/70 bg-slate-50 p-5">
						<p class="text-sm font-semibold text-slate-900">Why Pilakon?</p>
						<p class="mt-2 text-sm leading-relaxed text-slate-600">
							It’s designed for many independent sites in one app. Each author’s content and settings are isolated by
							default, making it easy to host multiple blogs without turning everything into a single “platform feed”.
						</p>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="rounded-3xl border border-slate-200/70 bg-white/60 p-8">
		<div class="max-w-3xl">
			<h2 class="text-2xl font-bold tracking-tight text-slate-900">
				Features built for <span class="text-[var(--color-primary)]">independent</span> writing
			</h2>
			<p class="mt-3 text-slate-600">
				A small set of strong defaults that keep publishing friction low and ownership high.
			</p>
		</div>

		<div class="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
			<div
				class="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-[var(--color-primary)]/40"
			>
				<div
					class="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
				>
					<svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round" />
						<path d="M7 6v12" stroke-linecap="round" stroke-opacity="0.55" />
						<path d="M17 6v12" stroke-linecap="round" stroke-opacity="0.55" />
					</svg>
				</div>
				<p class="text-sm font-semibold text-slate-900">Multi-tenant by design</p>
				<p class="mt-2 text-sm text-slate-600">Every author gets their own route space and UI chrome.</p>
			</div>
			<div
				class="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-[var(--color-primary)]/40"
			>
				<div
					class="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
				>
					<svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
						<path
							d="M12 4l7 4v8l-7 4-7-4V8l7-4z"
							stroke-linejoin="round"
							stroke-linecap="round"
						/>
						<path d="M12 12v8" stroke-linecap="round" stroke-opacity="0.55" />
					</svg>
				</div>
				<p class="text-sm font-semibold text-slate-900">Author-first sharing</p>
				<p class="mt-2 text-sm text-slate-600">Share a blog as a site, not a profile inside a feed.</p>
			</div>
			<div
				class="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-[var(--color-primary)]/40"
			>
				<div
					class="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
				>
					<svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M6 4h12v16H6z" stroke-linejoin="round" />
						<path d="M9 8h6M9 12h6M9 16h4" stroke-linecap="round" />
					</svg>
				</div>
				<p class="text-sm font-semibold text-slate-900">Readable defaults</p>
				<p class="mt-2 text-sm text-slate-600">Typographic choices that keep posts comfortable to read.</p>
			</div>
			<div
				class="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-[var(--color-primary)]/40"
			>
				<div
					class="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
				>
					<svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M8 6h10M8 10h10M8 14h6" stroke-linecap="round" />
						<path d="M6 6v12" stroke-linecap="round" stroke-opacity="0.55" />
						<path
							d="M16 18l5-5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<path d="M18.5 10.5l2.5 2.5" stroke-linecap="round" stroke-opacity="0.55" />
					</svg>
				</div>
				<p class="text-sm font-semibold text-slate-900">Simple editing flow</p>
				<p class="mt-2 text-sm text-slate-600">Create drafts, publish updates, and manage posts quickly.</p>
			</div>
			<div
				class="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-[var(--color-primary)]/40"
			>
				<div
					class="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
				>
					<svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
						<path
							d="M6 18l4-4 3 3 5-6"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<path d="M4 6h16v12H4z" stroke-linejoin="round" />
						<path d="M8 10a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0z" fill="currentColor" fill-opacity="0.18" stroke="none" />
					</svg>
				</div>
				<p class="text-sm font-semibold text-slate-900">Images supported</p>
				<p class="mt-2 text-sm text-slate-600">Upload and embed media for richer posts.</p>
			</div>
			<div
				class="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-[var(--color-primary)]/40"
			>
				<div
					class="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
				>
					<svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
						<path
							d="M12 3l8 4.5v9L12 21 4 16.5v-9L12 3z"
							stroke-linejoin="round"
						/>
						<path d="M12 7v10" stroke-linecap="round" />
						<path d="M8.5 10.5h7" stroke-linecap="round" stroke-opacity="0.55" />
					</svg>
				</div>
				<p class="text-sm font-semibold text-slate-900">Clear sign-in path</p>
				<p class="mt-2 text-sm text-slate-600">Pick a username once, then everything lives under it.</p>
			</div>
		</div>
	</section>

	<section id="authors" class="scroll-mt-24">
		<div class="mb-6 flex items-end justify-between gap-4">
			<div>
				<h2 class="text-2xl font-bold tracking-tight text-slate-900">
					Browse <span class="text-[var(--color-primary)]">authors</span>
				</h2>
				<p class="mt-2 text-slate-600">Explore public blogs hosted here.</p>
			</div>
		</div>

		{#if data.authors.length === 0}
			<div class="rounded-3xl border border-slate-200/70 bg-white/70 p-8">
				<p class="text-slate-700">
					No public blogs yet.
					{#if data.user}
						<strong class="font-semibold">Create the first one from your dashboard.</strong>
					{:else}
						<a href={resolve('/login')} class="font-semibold text-[var(--color-primary)] hover:opacity-80"
							>Sign in</a
						>
						to create one.
					{/if}
				</p>
			</div>
		{:else}
			<ul class="grid gap-4 md:grid-cols-2">
				{#each data.authors as a (a.username)}
					<li>
						<a
							href={resolve(`/${a.username}`)}
							class="group block rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm transition hover:border-[var(--color-primary)]/40 hover:bg-white"
						>
							<div class="flex items-start justify-between gap-4">
								<div>
									<p class="text-lg font-semibold text-slate-900 group-hover:opacity-90">{a.webName}</p>
									<p class="mt-1 text-sm text-slate-500">/{a.username} · {a.name}</p>
								</div>
								<span
									class="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600"
									>View</span
								>
							</div>
						</a>
					</li>
				{/each}
			</ul>
		{/if}
	</section>

	<section class="rounded-3xl border border-slate-200/70 bg-white/70 p-8">
		<div class="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
			<div class="max-w-2xl">
				<h2 class="text-2xl font-bold tracking-tight text-slate-900">Ready to publish under your own name?</h2>
				<p class="mt-2 text-slate-600">
					Choose a username once and your blog lives at a clean, shareable URL.
				</p>
			</div>
			<div class="flex flex-wrap gap-3">
				{#if data.user}
					{@const un = data.user.username}
					{#if un}
						<a
							href={resolve(`/${un}/dashboard`)}
							class="inline-flex items-center justify-center rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/50 focus-visible:ring-offset-2"
							>Open dashboard</a
						>
					{:else}
						<a
							href={resolve('/setup-username')}
							class="inline-flex items-center justify-center rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/50 focus-visible:ring-offset-2"
							>Choose username</a
						>
					{/if}
				{:else}
					<a
						href={resolve('/login')}
						class="inline-flex items-center justify-center rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/50 focus-visible:ring-offset-2"
						>Get started</a
					>
				{/if}
				<a
					href={resolve('/')}
					onclick={scrollToAuthors}
					class="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-white"
					>Explore blogs</a
				>
			</div>
		</div>
	</section>

	<footer class="border-t border-slate-200/70 py-10 text-sm text-slate-600">
		<div class="flex flex-col justify-between gap-6 md:flex-row md:items-center">
			<div class="space-y-1">
				<p class="font-semibold text-slate-900">Pilakon</p>
				<p>Independent blogs hosted with per-author spaces.</p>
			</div>
			<nav class="flex flex-wrap gap-x-6 gap-y-2">
				<a class="hover:text-slate-900" href={resolve('/')}>Home</a>
				<a class="hover:text-slate-900" href={resolve('/')} onclick={scrollToAuthors}>Authors</a>
				{#if data.user}
					{@const un = data.user.username}
					{#if un}
						<a class="hover:text-slate-900" href={resolve(`/${un}/dashboard`)}>Dashboard</a>
					{:else}
						<a class="hover:text-slate-900" href={resolve('/setup-username')}>Choose username</a>
					{/if}
				{:else}
					<a class="hover:text-slate-900" href={resolve('/login')}>Sign in</a>
				{/if}
			</nav>
		</div>
		<p class="mt-8 text-xs text-slate-500">© {new Date().getFullYear()} Pilakon. All rights reserved.</p>
	</footer>
</div>
