<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	let { data, children } = $props();

	const u = $derived(data.tenantUser.username!);
	const path = $derived(page.url.pathname);
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

	function isActiveTab(href: string) {
		if (href === '/') return path === '/';
		return path === href || path.startsWith(`${href}/`);
	}
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

	<main
		class={[
			'mx-auto max-w-6xl px-4 py-8 sm:pb-8',
			data.user ? 'pb-24' : 'pb-8'
		].join(' ')}
	>
		{@render children()}
	</main>

	{#if data.user}
		<nav
			class="sm:hidden fixed inset-x-0 bottom-0 z-50 border-t border-slate-200/80 bg-white/85 backdrop-blur-md"
			aria-label="Bottom navigation"
		>
			<div class="mx-auto grid max-w-6xl grid-cols-4 px-2 pb-[calc(env(safe-area-inset-bottom)+0.25rem)] pt-2">
				<a
					href={resolve('/')}
					class={[
						'flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-xs font-semibold transition',
						isActiveTab('/') ? 'text-(--color-primary)' : 'text-slate-600 hover:text-slate-900'
					].join(' ')}
					aria-current={isActiveTab('/') ? 'page' : undefined}
				>
					<svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-6v-7H10v7H4a1 1 0 0 1-1-1v-10.5Z" />
					</svg>
					<span>Explore</span>
				</a>

				<a
					href={resolve(`/${u}/dashboard`)}
					class={[
						'flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-xs font-semibold transition',
						isActiveTab(`/${u}/dashboard`)
							? 'text-(--color-primary)'
							: 'text-slate-600 hover:text-slate-900'
					].join(' ')}
					aria-current={isActiveTab(`/${u}/dashboard`) ? 'page' : undefined}
				>
					<svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
						<path
							d="M8 7h8M8 11h5M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
						/>
					</svg>
					<span>Editor</span>
				</a>

				<a
					href={resolve(`/${u}` as `/${string}`)}
					class={[
						'flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-xs font-semibold transition',
						isActiveTab(`/${u}`)
							? 'text-(--color-primary)'
							: 'text-slate-600 hover:text-slate-900'
					].join(' ')}
					aria-current={isActiveTab(`/${u}`) ? 'page' : undefined}
				>
					<svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M20 21a8 8 0 1 0-16 0" />
						<path d="M12 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" />
					</svg>
					<span>Profile</span>
				</a>

				<a
					href={resolve(`/${u}/settings`)}
					class={[
						'flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-xs font-semibold transition',
						isActiveTab(`/${u}/settings`)
							? 'text-(--color-primary)'
							: 'text-slate-600 hover:text-slate-900'
					].join(' ')}
					aria-current={isActiveTab(`/${u}/settings`) ? 'page' : undefined}
				>
					<svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
						<path
							d="M19.4 15a7.9 7.9 0 0 0 .1-1 7.9 7.9 0 0 0-.1-1l2-1.5-2-3.5-2.4 1a8 8 0 0 0-1.7-1l-.4-2.6H11l-.4 2.6a8 8 0 0 0-1.7 1l-2.4-1-2 3.5 2 1.5a7.9 7.9 0 0 0-.1 1 7.9 7.9 0 0 0 .1 1l-2 1.5 2 3.5 2.4-1a8 8 0 0 0 1.7 1l.4 2.6h4l.4-2.6a8 8 0 0 0 1.7-1l2.4 1 2-3.5-2-1.5Z"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
					<span>Settings</span>
				</a>
			</div>
		</nav>
	{/if}
</div>
