<script lang="ts">
	import { resolve } from '$app/paths';

	let { data, children } = $props();

	const u = $derived(data.tenantUser.username!);
	const bg = $derived(data.site.background ?? '#f9fafb');
	const useGradient = $derived(bg === '#f9fafb');
	const themeStyle = $derived(
		[
			useGradient
				? 'background:linear-gradient(135deg, #f5f3ff 0%, #ede9fe 22%, #fafafa 55%, #ffffff 100%)'
				: `background:${bg}`,
			data.site.fontFamily ? `font-family:${data.site.fontFamily}` : '',
			`--color-primary:${data.site.colorScheme?.primary ?? '#2563eb'}`,
			`--color-secondary:${data.site.colorScheme?.secondary ?? '#64748b'}`
		].join(';')
	);
	const webName = $derived(data.site.webName ?? 'Blog');
	const isOwner = $derived(Boolean(data.user && data.user.id === data.tenantUser.id));
</script>

<div class="min-h-screen" style={themeStyle}>
	<header class="sticky top-0 z-50 backdrop-blur-md">
		<div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
			<div class="flex items-center gap-8">
				<a
					href={resolve(`/${u}`)}
					class="theme-text-primary text-xl font-bold transition-all hover:opacity-80">{webName}</a
				>
			</div>
			<div class="flex items-center gap-4">
				{#if data.user && isOwner}
					<nav class="flex items-center gap-1">
						<a
							aria-label="Posts"
							href={resolve(`/${u}/dashboard`)}
							class="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100/80 hover:text-slate-900"
						>
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="lucide lucide-list"
								><path d="M8 6h13" /><path d="M8 12h13" /><path d="M8 18h13" /><path
									d="M3 6h.01"
								/><path d="M3 12h.01" /><path d="M3 18h.01" /></svg
							>
						</a>
						<a
							aria-label="Settings"
							href={resolve(`/${u}/settings`)}
							class="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100/80 hover:text-slate-900"
						>
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="lucide lucide-settings"
								><circle cx="12" cy="12" r="3" /><path
									d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 5 15.4a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6V4.5A1.65 1.65 0 0 0 10.5 3h3A1.65 1.65 0 0 0 15 4.5v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.09.2.13.43.13.66s-.05.46-.13.66z"
								/></svg
							>
						</a>
					</nav>
				{/if}
				{#if data.user}
					<form method="POST" action="/logout">
						<button
							type="submit"
							aria-label="Sign out"
							class="text-sm font-medium text-slate-600 hover:text-slate-900"
						>
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="lucide lucide-log-out"
								><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path
									d="M16 17l5-5-5-5"
								/><path d="M21 12H9" /></svg
							>
						</button>
					</form>
				{:else}
					<a
						href={resolve('/login')}
						aria-label="Sign in"
						class="theme-text-primary font-semibold hover:opacity-80"
					>
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="lucide lucide-log-in"
							><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><path
								d="M10 17l5-5-5-5"
							/><path d="M19 12H5" /></svg
						>
					</a>
				{/if}
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-6xl px-4 py-8">
		{@render children()}
	</main>
</div>
