<script lang="ts">
	import './layout.css';
	import 'animate.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';

	let { data, children } = $props();

	const isTenant = $derived(Boolean(page.params.username));
	const path = $derived(page.url.pathname);

	const neutralStyle = $derived(
		[
			'background:linear-gradient(135deg, #f5f3ff 0%, #ede9fe 22%, #fafafa 55%, #ffffff 100%)',
			'font-family:Inter Variable, ui-sans-serif, system-ui, sans-serif',
			'--color-primary:#2563eb',
			'--color-secondary:#64748b'
		].join(';')
	);

	function isActiveTab(href: string) {
		if (href === '/') return path === '/';
		return path === href || path.startsWith(`${href}/`);
	}
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
					>Pilakon</a
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
							class="font-semibold text-(--color-primary) hover:opacity-80">Sign in</a
						>
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
							isActiveTab('/')
								? 'text-(--color-primary)'
								: 'text-slate-600 hover:text-slate-900'
						].join(' ')}
						aria-current={isActiveTab('/') ? 'page' : undefined}
					>
						<svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-6v-7H10v7H4a1 1 0 0 1-1-1v-10.5Z" />
						</svg>
						<span>Explore</span>
					</a>

					<a
						href={resolve('/dashboard')}
						class={[
							'flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-xs font-semibold transition',
							isActiveTab('/dashboard')
								? 'text-(--color-primary)'
								: 'text-slate-600 hover:text-slate-900'
						].join(' ')}
						aria-current={isActiveTab('/dashboard') ? 'page' : undefined}
					>
						<svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
							<path
								d="M8 7h8M8 11h5M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
							/>
						</svg>
						<span>Editor</span>
					</a>

					{#if data.user?.username}
						<a
							href={resolve(`/${data.user.username}` as `/${string}`)}
							class={[
								'flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-xs font-semibold transition',
								isActiveTab(`/${data.user.username}`)
									? 'text-(--color-primary)'
									: 'text-slate-600 hover:text-slate-900'
							].join(' ')}
							aria-current={isActiveTab(`/${data.user.username}`) ? 'page' : undefined}
						>
							<svg
								viewBox="0 0 24 24"
								class="h-5 w-5"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
							>
								<path d="M20 21a8 8 0 1 0-16 0" />
								<path d="M12 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" />
							</svg>
							<span>Profile</span>
						</a>
					{:else}
						<a
							href={resolve('/setup-username')}
							class={[
								'flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-xs font-semibold transition',
								isActiveTab('/setup-username')
									? 'text-(--color-primary)'
									: 'text-slate-600 hover:text-slate-900'
							].join(' ')}
							aria-current={isActiveTab('/setup-username') ? 'page' : undefined}
						>
							<svg
								viewBox="0 0 24 24"
								class="h-5 w-5"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
							>
								<path d="M20 21a8 8 0 1 0-16 0" />
								<path d="M12 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" />
							</svg>
							<span>Profile</span>
						</a>
					{/if}

					<a
						href={resolve('/settings')}
						class={[
							'flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-xs font-semibold transition',
							isActiveTab('/settings')
								? 'text-(--color-primary)'
								: 'text-slate-600 hover:text-slate-900'
						].join(' ')}
						aria-current={isActiveTab('/settings') ? 'page' : undefined}
					>
						<svg
							viewBox="0 0 24 24"
							class="h-5 w-5"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
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
{/if}
