<script lang="ts">
	import { enhance } from '$app/forms';
	import EditorJs from '$lib/components/EditorJs.svelte';
	import PostCoverHero from '$lib/components/PostCoverHero.svelte';
	import type { PostBlock } from '$lib/types/blocks';
	import { resolve } from '$app/paths';

	let { data, form } = $props();

	const dashboardUrl = resolve('/dashboard');
	const editorImageApiUrl = resolve('/api/editor-image');

	let title = $state('');
	let excerpt = $state('');
	let coverImage = $state('');
	let coverTextScrim = $state(false);
	let coverFileInput: HTMLInputElement | undefined = $state();
	let uploadingCover = $state(false);
	let uploadCoverError = $state('');
	let blocks = $state<PostBlock[]>([]);
	let editorRef: { getBlocksForSubmit: () => Promise<PostBlock[]> } | undefined = $state();

	async function onCoverFileSelected(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		input.value = '';
		if (!file) return;
		uploadingCover = true;
		uploadCoverError = '';
		try {
			const body = new FormData();
			body.append('image', file, file.name);
			const res = await fetch(editorImageApiUrl, {
				method: 'POST',
				body,
				credentials: 'include'
			});
			if (!res.ok) {
				uploadCoverError =
					res.status === 413 ? 'Image too large (max ~12 MB before processing).' : 'Upload failed.';
				return;
			}
			const data = (await res.json()) as { success?: number; file?: { url?: string } };
			if (data.success !== 1 || !data.file?.url) {
				uploadCoverError = 'Upload failed.';
				return;
			}
			coverImage = data.file.url;
		} catch {
			uploadCoverError = 'Upload failed.';
		} finally {
			uploadingCover = false;
		}
	}

	$effect(() => {
		title = data.post.title;
		excerpt = data.post.excerpt ?? '';
		coverImage = data.post.coverImage ?? '';
		coverTextScrim = data.post.options?.coverTextScrim ?? false;
		blocks = [...(data.post.blocks ?? [])] as PostBlock[];
	});
</script>

<div class="mx-auto max-w-4xl">
	<div class="mb-8 flex items-center justify-between">
		<a href={dashboardUrl} class="text-slate-600 transition-colors hover:text-slate-900"
			>← Dashboard</a
		>
	</div>

	<form
		method="POST"
		action="?/save"
		use:enhance={async ({ formData }) => {
			const latest = editorRef ? await editorRef.getBlocksForSubmit() : blocks;
			blocks = latest;
			formData.set('blocks', JSON.stringify(latest));
		}}
		class="space-y-6"
	>
		<div>
			<label for="title" class="mb-2 block text-sm font-medium text-slate-700">Title</label>
			<input
				type="text"
				name="title"
				bind:value={title}
				class="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-[--color-primary] focus:ring-2 focus:ring-[--color-primary]/30"
			/>
		</div>

		<div>
			<label for="excerpt" class="mb-2 block text-sm font-medium text-slate-700">Excerpt</label>
			<textarea
				name="excerpt"
				bind:value={excerpt}
				rows="2"
				class="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-[--color-primary] focus:ring-2 focus:ring-[--color-primary]/30"
			></textarea>
		</div>

		<div>
			<label for="coverImage" class="mb-2 block text-sm font-medium text-slate-700"
				>Cover image</label
			>
			<p class="mb-2 text-sm text-slate-500">Paste a URL or upload a file (same pipeline as in-editor images).</p>
			<div class="flex flex-col gap-2 sm:flex-row sm:items-stretch">
				<input
					type="text"
					id="coverImage"
					name="coverImage"
					bind:value={coverImage}
					placeholder="https://… or /uploads/editor/…"
					class="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-[--color-primary] focus:ring-2 focus:ring-[--color-primary]/30"
				/>
				<input
					bind:this={coverFileInput}
					type="file"
					accept="image/*"
					class="sr-only"
					aria-label="Upload cover image"
					onchange={onCoverFileSelected}
				/>
				<button
					type="button"
					disabled={uploadingCover}
					class="theme-btn shrink-0 rounded-xl border border-slate-300 bg-white px-4 py-2.5 font-medium text-slate-800 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
					onclick={() => coverFileInput?.click()}
				>
					{uploadingCover ? 'Uploading…' : 'Upload file'}
				</button>
			</div>
			{#if uploadCoverError}
				<p class="mt-2 text-sm text-red-600" role="alert">{uploadCoverError}</p>
			{/if}
			<label class="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3">
				<input
					type="checkbox"
					name="coverTextScrim"
					value="on"
					bind:checked={coverTextScrim}
					class="mt-1 rounded border-slate-300"
				/>
				<span>
					<span class="block text-sm font-medium text-slate-800">Dark text panel</span>
					<span class="block text-sm text-slate-500"
						>Puts a dark translucent block behind the title and excerpt so they stay readable on busy
						images.</span
					>
				</span>
			</label>

			{#if coverImage.trim() || title.trim()}
				<div class="mt-4">
					<p class="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Preview (16:9)</p>
					<PostCoverHero
						coverUrl={coverImage.trim() || null}
						title={title.trim() || 'Title'}
						excerpt={excerpt.trim() || null}
						textScrim={coverTextScrim}
						variant="card"
					/>
				</div>
			{/if}
		</div>

		<div>
			<p class="mb-2 text-sm font-medium text-slate-700">Content</p>
			<EditorJs bind:this={editorRef} initialBlocks={blocks} onChange={(b) => (blocks = b)} />
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
			<p class="text-sm text-emerald-600" role="status" aria-live="polite">Saved.</p>
		{/if}
	</form>
</div>
