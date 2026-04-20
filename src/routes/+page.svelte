<script lang="ts">
	import { resolve } from '$app/paths';

	let { data } = $props();

	const authorsHref = `${resolve('/')}#authors`;
</script>

<div class="space-y-16">
	<section class="grid items-center gap-10 lg:grid-cols-2">
		<div class="max-w-2xl">
			<p
				class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-semibold tracking-wide text-slate-600"
			>
				<span class="h-2 w-2 rounded-full bg-[--color-primary]" aria-hidden="true"></span>
				Multi-tenant blogs, one URL per author
			</p>

			<h1 class="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
				Own your blog, keep it simple, publish fast.
			</h1>
			<p class="mt-4 text-lg leading-relaxed text-slate-600">
				Blocky Blog hosts independent, per-author sites with their own posts and settings. No noisy feeds, no
				algorithm — just clean pages, a straightforward editor, and a stable home under <code>/username</code>.
			</p>

			<div class="mt-7 flex flex-wrap gap-3">
				<a
					href={authorsHref}
					class="inline-flex items-center justify-center rounded-xl bg-[--color-primary] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
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
					<dd class="mt-1 text-sm font-semibold text-slate-900">`/username`</dd>
					<dd class="mt-1 text-sm text-slate-600">Each author gets their own space.</dd>
				</div>
				<div class="rounded-2xl border border-slate-200/70 bg-white/70 p-4">
					<dt class="text-xs font-semibold tracking-wide text-slate-500 uppercase">Scoped content</dt>
					<dd class="mt-1 text-sm font-semibold text-slate-900">Slugs per tenant</dd>
					<dd class="mt-1 text-sm text-slate-600">No cross-author collisions.</dd>
				</div>
				<div class="rounded-2xl border border-slate-200/70 bg-white/70 p-4">
					<dt class="text-xs font-semibold tracking-wide text-slate-500 uppercase">Fast workflow</dt>
					<dd class="mt-1 text-sm font-semibold text-slate-900">Write → publish</dd>
					<dd class="mt-1 text-sm text-slate-600">A focused editor for real posts.</dd>
				</div>
			</dl>
		</div>

		<div class="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm">
			<div class="rounded-2xl border border-slate-200 bg-white p-5">
				<p class="text-xs font-semibold tracking-wide text-slate-500 uppercase">What you get</p>
				<ul class="mt-4 space-y-3 text-sm text-slate-700">
					<li class="flex gap-3">
						<span class="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-500" aria-hidden="true"></span>
						<span><span class="font-semibold text-slate-900">Tenant dashboards</span> for writing and managing posts.</span>
					</li>
					<li class="flex gap-3">
						<span class="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-500" aria-hidden="true"></span>
						<span><span class="font-semibold text-slate-900">Public pages</span> that load fast and stay readable.</span>
					</li>
					<li class="flex gap-3">
						<span class="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-500" aria-hidden="true"></span>
						<span><span class="font-semibold text-slate-900">Settings per author</span> (not a global template).</span>
					</li>
					<li class="flex gap-3">
						<span class="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-500" aria-hidden="true"></span>
						<span><span class="font-semibold text-slate-900">Clean URLs</span> for posts under each author.</span>
					</li>
				</ul>
			</div>

			<div class="mt-4 rounded-2xl border border-slate-200/70 bg-slate-50 p-5">
				<p class="text-sm font-semibold text-slate-900">Why Blocky Blog?</p>
				<p class="mt-2 text-sm leading-relaxed text-slate-600">
					It’s designed for many independent sites in one app. Each author’s content and settings are isolated by
					default, making it easy to host multiple blogs without turning everything into a single “platform feed”.
				</p>
			</div>
		</div>
	</section>

	<section class="rounded-3xl border border-slate-200/70 bg-white/60 p-8">
		<div class="max-w-3xl">
			<h2 class="text-2xl font-bold tracking-tight text-slate-900">Features built for independent writing</h2>
			<p class="mt-3 text-slate-600">
				A small set of strong defaults that keep publishing friction low and ownership high.
			</p>
		</div>

		<div class="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
			<div class="rounded-2xl border border-slate-200 bg-white p-5">
				<p class="text-sm font-semibold text-slate-900">Multi-tenant by design</p>
				<p class="mt-2 text-sm text-slate-600">Every author gets their own route space and UI chrome.</p>
			</div>
			<div class="rounded-2xl border border-slate-200 bg-white p-5">
				<p class="text-sm font-semibold text-slate-900">Author-first sharing</p>
				<p class="mt-2 text-sm text-slate-600">Share a blog as a site, not a profile inside a feed.</p>
			</div>
			<div class="rounded-2xl border border-slate-200 bg-white p-5">
				<p class="text-sm font-semibold text-slate-900">Readable defaults</p>
				<p class="mt-2 text-sm text-slate-600">Typographic choices that keep posts comfortable to read.</p>
			</div>
			<div class="rounded-2xl border border-slate-200 bg-white p-5">
				<p class="text-sm font-semibold text-slate-900">Simple editing flow</p>
				<p class="mt-2 text-sm text-slate-600">Create drafts, publish updates, and manage posts quickly.</p>
			</div>
			<div class="rounded-2xl border border-slate-200 bg-white p-5">
				<p class="text-sm font-semibold text-slate-900">Images supported</p>
				<p class="mt-2 text-sm text-slate-600">Upload and embed media for richer posts.</p>
			</div>
			<div class="rounded-2xl border border-slate-200 bg-white p-5">
				<p class="text-sm font-semibold text-slate-900">Clear sign-in path</p>
				<p class="mt-2 text-sm text-slate-600">Pick a username once, then everything lives under it.</p>
			</div>
		</div>
	</section>

	<section id="authors" class="scroll-mt-24">
		<div class="mb-6 flex items-end justify-between gap-4">
			<div>
				<h2 class="text-2xl font-bold tracking-tight text-slate-900">Browse authors</h2>
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
						<a href={resolve('/login')} class="font-semibold text-[--color-primary] hover:opacity-80"
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
							class="group block rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm transition hover:border-slate-300 hover:bg-white"
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
							class="inline-flex items-center justify-center rounded-xl bg-[--color-primary] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
							>Open dashboard</a
						>
					{:else}
						<a
							href={resolve('/setup-username')}
							class="inline-flex items-center justify-center rounded-xl bg-[--color-primary] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
							>Choose username</a
						>
					{/if}
				{:else}
					<a
						href={resolve('/login')}
						class="inline-flex items-center justify-center rounded-xl bg-[--color-primary] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
						>Get started</a
					>
				{/if}
				<a
					href={authorsHref}
					class="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-white"
					>Explore blogs</a
				>
			</div>
		</div>
	</section>

	<footer class="border-t border-slate-200/70 py-10 text-sm text-slate-600">
		<div class="flex flex-col justify-between gap-6 md:flex-row md:items-center">
			<div class="space-y-1">
				<p class="font-semibold text-slate-900">Blocky Blog</p>
				<p>Independent blogs hosted with per-author spaces.</p>
			</div>
			<nav class="flex flex-wrap gap-x-6 gap-y-2">
				<a class="hover:text-slate-900" href={resolve('/')}>Home</a>
				<a class="hover:text-slate-900" href={authorsHref}>Authors</a>
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
		<p class="mt-8 text-xs text-slate-500">© {new Date().getFullYear()} Blocky Blog. All rights reserved.</p>
	</footer>
</div>
