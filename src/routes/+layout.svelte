<script lang="ts">
	import './layout.css';
	import 'animate.css';
	import favicon from '$lib/assets/favicon.svg';
	import { resolve } from '$app/paths';
	let { data, children } = $props();

	const bg = $derived(data.site?.background ?? '#f9fafb');
	const useGradient = $derived(!data.site || bg === '#f9fafb');
	const themeStyle = $derived(
		[
			useGradient
				? 'background:linear-gradient(135deg, #f5f3ff 0%, #ede9fe 22%, #fafafa 55%, #ffffff 100%)'
				: `background:${bg}`,
			data.site?.fontFamily ? `font-family:${data.site.fontFamily}` : '',
			`--color-primary:${data.site?.colorScheme?.primary ?? '#2563eb'}`,
			`--color-secondary:${data.site?.colorScheme?.secondary ?? '#64748b'}`
		].join(';')
	);

	const webName = $derived(data.site?.webName ?? 'Personal Blog');
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen" style={themeStyle}>
	<header class="sticky top-0 z-50 backdrop-blur-md">
		<div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
			<div class="flex items-center gap-8">
				<a
					href={resolve('/')}
					class="theme-text-primary text-xl font-bold transition-all hover:opacity-80">{webName}</a
				>
				{#if data.user}
					<nav class="flex items-center gap-1">
						<a
							href={resolve('/dashboard')}
							class="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100/80 hover:text-slate-900"
							>Dashboard</a
						>
						<a
							href={resolve('/settings')}
							class="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100/80 hover:text-slate-900"
							>Settings</a
						>
					</nav>
				{/if}
			</div>
			<div class="flex items-center gap-4">
				{#if data.user}
					<form method="POST" action="/logout">
						<button type="submit" class="text-sm font-medium text-slate-600 hover:text-slate-900"
							>Sign out</button
						>
					</form>
				{:else}
					<a href={resolve('/login')} class="theme-text-primary font-semibold hover:opacity-80"
						>Sign in</a
					>
				{/if}
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-6xl px-4 py-8">
		{@render children()}
	</main>
</div>
