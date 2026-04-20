<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import type { CommentWithAuthor } from '$lib/types/social';

	let { postId, comments, viewer } = $props<{
		postId: string;
		comments: CommentWithAuthor[];
		viewer: { id: string; name: string } | null;
	}>();

	let draft = $state('');
	let pending = $state(false);
	let errorMsg = $state<string | null>(null);

	const loginHref = resolve('/login');

	async function submitComment() {
		if (!viewer || pending) return;
		const body = draft.trim();
		if (!body) {
			errorMsg = 'Write something first';
			return;
		}
		errorMsg = null;
		pending = true;
		try {
			const res = await fetch(resolve(`/api/social/posts/${postId}/comments`), {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ body })
			});
			if (!res.ok) {
				const t = await res.text();
				errorMsg = t || 'Could not post comment';
				return;
			}
			draft = '';
			await invalidateAll();
		} finally {
			pending = false;
		}
	}
</script>

<div class="mt-8 border-t border-slate-200/80 pt-6" aria-label="Comments">
	<h2 class="theme-text-primary mb-4 text-lg font-semibold">Comments</h2>

	{#if viewer}
		<div class="mb-8">
			<label class="block">
				<span class="theme-text-secondary mb-1 block text-sm">Add a comment</span>
				<textarea
					bind:value={draft}
					rows="3"
					class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/25"
					placeholder="Share your thoughts…"
				></textarea>
			</label>
			{#if errorMsg}
				<p class="mt-2 text-sm text-red-600">{errorMsg}</p>
			{/if}
			<button
				type="button"
				class="theme-btn theme-bg-primary mt-3 inline-flex min-h-10 items-center justify-center rounded-full px-5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:opacity-60"
				disabled={pending}
				onclick={submitComment}
			>
				Post comment
			</button>
		</div>
	{:else}
		<p class="theme-text-secondary mb-8 text-sm">
			<a href={loginHref} class="font-medium text-[var(--color-primary)] underline hover:opacity-90"
				>Sign in</a
			>
			to join the conversation.
		</p>
	{/if}

	<ul class="space-y-6">
		{#each comments as c (c.id)}
			<li class="flex gap-3">
				<div
					class="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-sm font-semibold text-slate-600"
				>
					{#if c.author.image}
						<img
							src={c.author.image}
							alt=""
							class="h-full w-full object-cover"
						/>
					{:else}
						{c.author.name.slice(0, 1).toUpperCase()}
					{/if}
				</div>
				<div class="min-w-0 flex-1">
					<div class="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
						{#if c.author.username}
							<a
								href={resolve(`/${c.author.username}`)}
								class="font-semibold text-slate-900 hover:underline"
							>
								{c.author.name}
							</a>
						{:else}
							<span class="font-semibold text-slate-900">{c.author.name}</span>
						{/if}
						<time
							class="theme-text-secondary text-xs"
							datetime={new Date(c.createdAt).toISOString()}
						>
							{new Date(c.createdAt).toLocaleString()}
						</time>
					</div>
					<p class="theme-text-secondary mt-1 whitespace-pre-wrap text-sm leading-relaxed">
						{c.body}
					</p>
				</div>
			</li>
		{:else}
			<li class="theme-text-secondary text-sm">No comments yet. Be the first to say something.</li>
		{/each}
	</ul>
</div>
