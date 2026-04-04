<script lang="ts">
	import './layout.css';
	import 'animate.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';

	let { data, children } = $props();

	const isTenant = $derived(Boolean(page.params.username));

	const neutralStyle = $derived(
		[
			'background:linear-gradient(135deg, #f5f3ff 0%, #ede9fe 22%, #fafafa 55%, #ffffff 100%)',
			'font-family:Inter Variable, ui-sans-serif, system-ui, sans-serif',
			'--color-primary:#2563eb',
			'--color-secondary:#64748b'
		].join(';')
	);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if isTenant}
	{@render children()}
{:else}
	<div class="min-h-screen" style={neutralStyle}>
		<header class="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
			<div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
				<a
					href={resolve('/')}
					class="text-xl font-bold text-slate-900 transition-opacity hover:opacity-80"
					>Blocky Blog</a
				>
				<div class="flex items-center gap-4">
					{#if data.user}
						{@const un = data.user.username}
						{#if un}
							<a
								href={resolve(`/${un}/dashboard`)}
								class="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100/80 hover:text-slate-900"
								>Dashboard</a
							>
						{:else}
							<a
								href={resolve('/setup-username')}
								class="rounded-lg px-3 py-2 text-sm font-medium text-amber-800 transition-colors hover:bg-amber-50"
								>Choose username</a
							>
						{/if}
						<form method="POST" action="/logout">
							<button
								type="submit"
								class="text-sm font-medium text-slate-600 hover:text-slate-900"
								aria-label="Sign out">Sign out</button
							>
						</form>
					{:else}
						<a
							href={resolve('/login')}
							class="font-semibold text-[--color-primary] hover:opacity-80">Sign in</a
						>
					{/if}
				</div>
			</div>
		</header>

		<main class="mx-auto max-w-6xl px-4 py-8">
			{@render children()}
		</main>
	</div>
{/if}
