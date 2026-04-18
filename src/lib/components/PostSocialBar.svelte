<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';

	let {
		postId,
		likeCount,
		commentCount,
		viewerHasLiked,
		viewer
	} = $props<{
		postId: string;
		likeCount: number;
		commentCount: number;
		viewerHasLiked: boolean;
		viewer: { id: string } | null;
	}>();

	let pending = $state(false);

	const loginHref = resolve('/login');

	async function toggleLike() {
		if (!viewer || pending) return;
		pending = true;
		const next = !viewerHasLiked;
		try {
			const res = await fetch(resolve(`/api/social/posts/${postId}/like`), {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ liked: next })
			});
			if (!res.ok) return;
			await invalidateAll();
		} finally {
			pending = false;
		}
	}
</script>

<div class="flex flex-wrap items-center gap-6 border-t border-slate-200/80 pt-6" aria-label="Reactions">
	<div class="flex items-center gap-2">
		{#if viewer}
			<button
				type="button"
				class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/90 bg-white text-lg transition hover:bg-rose-50 disabled:opacity-60"
				disabled={pending}
				onclick={toggleLike}
				aria-pressed={viewerHasLiked}
				aria-label={viewerHasLiked ? 'Unlike' : 'Love'}
			>
				{viewerHasLiked ? '❤️' : '🤍'}
			</button>
		{:else}
			<a
				href={loginHref}
				class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/90 bg-white text-lg hover:bg-slate-50"
				aria-label="Sign in to love"
			>
				🤍
			</a>
		{/if}
		<span class="theme-text-secondary text-sm">
			<span class="font-medium text-slate-800">{likeCount}</span>
			{likeCount === 1 ? ' love' : ' loves'}
		</span>
	</div>
	<p class="theme-text-secondary text-sm">
		<span class="font-medium text-slate-800">{commentCount}</span>
		{commentCount === 1 ? ' comment' : ' comments'}
	</p>
</div>
