<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';

	let { data } = $props();

	const u = $derived(page.params.username!);
</script>

<div class="mx-auto max-w-4xl">
	<div class="mb-8 flex items-center justify-between">
		<h1 class="theme-text-primary text-3xl font-bold">Dashboard</h1>
	</div>

	<div class="theme-card mb-8 border border-slate-200/80 bg-white/90 p-6 backdrop-blur-sm">
		<h2 class="mb-4 text-lg font-semibold text-slate-900">Create New Post</h2>
		<form method="POST" action="?/create" class="flex gap-3">
			<div
				class="flex w-full max-w-full items-stretch overflow-hidden rounded-xl border border-slate-300 bg-white"
			>
				<input
					type="text"
					name="title"
					placeholder="Post title..."
					class="flex-1 bg-transparent px-4 py-2.5 outline-none focus:border-none focus:ring-0"
					style="min-width:0;"
				/>
				<button
					aria-label="Create"
					type="submit"
					class="theme-btn theme-bg-primary rounded-none rounded-r-xl px-6 py-2.5 text-white disabled:cursor-not-allowed disabled:opacity-50"
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
						class="lucide lucide-plus"><path d="M12 5v14" /><path d="M5 12h14" /></svg
					>
				</button>
			</div>
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
									aria-label="Edit"
									href={resolve(`/${u}/edit/${post.id}`)}
									class="theme-text-primary rounded-lg py-2 text-sm font-medium hover:bg-slate-100"
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
										class="lucide lucide-edit"
										><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path
											d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 10.5-10.5z"
										/></svg
									>
								</a>
								<form method="POST" action="?/delete">
									<input type="hidden" name="id" value={post.id} />
									<button
										aria-label="Delete"
										type="submit"
										class="rounded-lg py-2 pl-2 text-sm font-medium text-red-600 hover:bg-red-50"
										onclick={(e) => !confirm('Delete this post?') && e.preventDefault()}
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
											class="lucide lucide-trash-2"
											><path d="M3 6h18" /><path
												d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
											/><path d="M10 11v6" /><path d="M14 11v6" /></svg
										>
									</button>
								</form>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
