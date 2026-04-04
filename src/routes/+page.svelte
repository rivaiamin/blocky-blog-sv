<script lang="ts">
	import { resolve } from '$app/paths';

	let { data } = $props();
</script>

<div class="mx-auto max-w-3xl text-center">
	<h1 class="mb-4 text-4xl font-bold text-slate-900">Welcome</h1>
	<p class="mb-12 text-lg text-slate-600">
		Browse independent blogs hosted here. Each author has their own space and settings.
	</p>

	{#if data.authors.length === 0}
		<p class="text-slate-500">No public blogs yet. Sign in to create one.</p>
	{:else}
		<h2 class="mb-6 text-left text-sm font-semibold tracking-wide text-slate-500 uppercase">
			Authors
		</h2>
		<ul class="space-y-3 text-left">
			{#each data.authors as a (a.username)}
				<li>
					<a
						href={resolve(`/${a.username}`)}
						class="block rounded-xl border border-slate-200 bg-white/90 px-5 py-4 shadow-sm transition-colors hover:border-slate-300 hover:bg-white"
					>
						<span class="font-semibold text-slate-900">{a.webName}</span>
						<span class="mt-1 block text-sm text-slate-500">/{a.username} · {a.name}</span>
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</div>
