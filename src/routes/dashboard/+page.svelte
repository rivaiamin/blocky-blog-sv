<script lang="ts">
	let { data } = $props();
</script>

<div class="mx-auto max-w-4xl">
	<div class="mb-8 flex items-center justify-between">
		<h1 class="theme-text-primary text-3xl font-bold">Dashboard</h1>
	</div>

	<div
		class="theme-card mb-8 border border-slate-200/80 bg-white/90 p-6 backdrop-blur-sm"
	>
		<h2 class="mb-4 text-lg font-semibold text-slate-900">Create New Post</h2>
		<form method="POST" action="?/create" class="flex gap-3">
			<input
				type="text"
				name="title"
				placeholder="Post title..."
				class="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30"
			/>
			<button
				type="submit"
				class="theme-btn theme-bg-primary rounded-xl px-6 py-2.5 text-white disabled:cursor-not-allowed disabled:opacity-50"
				>Create</button
			>
		</form>
	</div>

	<div class="theme-card overflow-hidden border border-slate-200/80 bg-white/90 backdrop-blur-sm">
		<div class="border-b border-slate-200/80 p-6">
			<h2 class="text-lg font-semibold text-slate-900">Your Posts</h2>
		</div>

		{#if data.posts.length === 0}
			<div class="p-6 text-center text-slate-500">No posts yet. Create your first post above!</div>
		{:else}
			<div class="divide-y divide-slate-200/80">
				{#each data.posts as post (post.id)}
					<div class="p-6 transition-colors hover:bg-slate-50/60">
						<div class="flex items-center justify-between">
							<div class="flex-1">
								<h3 class="mb-1 font-semibold text-slate-900">{post.title}</h3>
								<div class="flex items-center gap-4 text-sm text-slate-500">
									<span>{post.createdAt.toLocaleDateString()}</span>
									<span
										class="rounded-full px-2.5 py-1 text-xs font-medium {post.published
											? 'bg-emerald-100 text-emerald-800'
											: 'bg-amber-100 text-amber-800'}"
									>
										{post.published ? 'Published' : 'Draft'}
									</span>
								</div>
							</div>
							<div class="flex gap-2">
								<a
									href="/edit/{post.id}"
									class="theme-text-primary rounded-lg px-4 py-2 text-sm font-medium hover:bg-slate-100"
									>Edit</a
								>
								<form method="POST" action="?/delete">
									<input type="hidden" name="id" value={post.id} />
									<button
										type="submit"
										class="rounded-lg px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
										onclick={(e) => !confirm('Delete this post?') && e.preventDefault()}
										>Delete</button
									>
								</form>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
