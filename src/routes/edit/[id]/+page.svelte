<script lang="ts">
	import { enhance } from '$app/forms';
	import EditorJs from '$lib/components/EditorJs.svelte';
	import type { PostBlock } from '$lib/types/blocks';

	let { data, form } = $props();

	let title = $state('');
	let excerpt = $state('');
	let blocks = $state<PostBlock[]>([]);

	$effect(() => {
		title = data.post.title;
		excerpt = data.post.excerpt ?? '';
		blocks = [...(data.post.blocks ?? [])] as PostBlock[];
	});
</script>

<div class="mx-auto max-w-4xl">
	<div class="mb-8 flex items-center justify-between">
		<a href="/dashboard" class="text-slate-600 transition-colors hover:text-slate-900">← Dashboard</a>
	</div>

	<form
		method="POST"
		action="?/save"
		use:enhance={() => {
			return async ({ formData }) => {
				formData.set('blocks', JSON.stringify(blocks));
			};
		}}
		class="space-y-6"
	>
		<div>
			<label class="mb-2 block text-sm font-medium text-slate-700">Title</label>
			<input
				type="text"
				name="title"
				bind:value={title}
				class="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30"
			/>
		</div>

		<div>
			<label class="mb-2 block text-sm font-medium text-slate-700">Excerpt</label>
			<textarea
				name="excerpt"
				bind:value={excerpt}
				rows="2"
				class="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30"
			></textarea>
		</div>

		<div>
			<p class="mb-2 text-sm font-medium text-slate-700">Content</p>
			<EditorJs initialBlocks={blocks} onChange={(b) => (blocks = b)} />
		</div>

		<div class="flex flex-wrap gap-3">
			<button
				type="submit"
				name="intent"
				value="draft"
				class="theme-btn rounded-xl border border-slate-300 bg-white px-6 py-2.5 font-medium text-slate-800 hover:bg-slate-50"
				>Save draft</button
			>
			<button
				type="submit"
				name="intent"
				value="publish"
				class="theme-btn theme-bg-primary rounded-xl px-6 py-2.5 font-medium text-white"
				>Publish</button
			>
		</div>

		{#if form?.success}
			<p class="text-sm text-emerald-600">Saved.</p>
		{/if}
	</form>
</div>
