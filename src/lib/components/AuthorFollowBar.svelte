<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';

	let {
		followingUserId,
		followerCount,
		viewerFollows,
		viewer,
		isOwner
	} = $props<{
		followingUserId: string;
		followerCount: number;
		viewerFollows: boolean;
		viewer: { id: string } | null;
		isOwner: boolean;
	}>();

	let pending = $state(false);

	const loginHref = resolve('/login');

	async function toggleFollow() {
		if (!viewer || isOwner || pending) return;
		pending = true;
		const next = !viewerFollows;
		try {
			const res = await fetch(resolve('/api/social/follow'), {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ followingUserId, following: next })
			});
			if (!res.ok) return;
			await invalidateAll();
		} finally {
			pending = false;
		}
	}
</script>

<div
	class="mb-10 flex flex-wrap items-center justify-center gap-3 border-b border-slate-200/80 pb-8"
	aria-label="Follow author"
>
	<p class="theme-text-secondary text-sm">
		<span class="font-semibold text-slate-800">{followerCount}</span>
		{followerCount === 1 ? ' follower' : ' followers'}
	</p>
	{#if isOwner}
		<span class="theme-text-secondary text-sm">This is your site</span>
	{:else if !viewer}
		<a
			href={loginHref}
			class="theme-btn theme-bg-primary inline-flex min-h-10 items-center justify-center rounded-full px-5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
		>
			Sign in to follow
		</a>
	{:else}
		<button
			type="button"
			class="theme-btn theme-bg-secondary inline-flex min-h-10 items-center justify-center rounded-full px-5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:opacity-60"
			disabled={pending}
			onclick={toggleFollow}
		>
			{viewerFollows ? 'Following' : 'Follow'}
		</button>
	{/if}
</div>
