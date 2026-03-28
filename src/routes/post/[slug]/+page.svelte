<script lang="ts">
	import { goto } from '$app/navigation';
	import BlockContent from '$lib/components/BlockContent.svelte';
	import PostCoverHero from '$lib/components/PostCoverHero.svelte';
	import PostStoriesView from '$lib/components/PostStoriesView.svelte';
	import { splitBlocksIntoSlides } from '$lib/slides';
	import type { PostBlock } from '$lib/types/blocks';
	import { resolve } from '$app/paths';

	let { data } = $props();

	const blocks = $derived((data.post.blocks ?? []) as PostBlock[]);
	const slides = $derived(splitBlocksIntoSlides(blocks));
	const isStories = $derived(slides.length > 1);

	const dashboardUrl = resolve('/dashboard');
</script>

<div
	class="fixed inset-0 z-60 mx-auto flex max-w-3xl flex-col overflow-hidden bg-white"
>
	<!-- <button
		type="button"
		class="theme-text-primary mb-8 inline-flex items-center gap-1 font-medium transition-opacity hover:opacity-80"
		onclick={() => goto(dashboardUrl)}
	>
		← Back to blog
	</button> -->

	{#if isStories}
		<div class="flex min-h-0 flex-1 flex-col px-4 py-4">
			<PostStoriesView
				post={{
					title: data.post.title,
					excerpt: data.post.excerpt,
					coverImage: data.post.coverImage,
					options: data.post.options,
					createdAt: data.post.createdAt,
					blocks: blocks as PostBlock[]
				}}
				onExit={() => goto(dashboardUrl)}
			/>
		</div>
	{:else}
		<div class="min-h-0 flex-1 overflow-y-auto px-4 py-8">
			<article class="theme-card overflow-hidden border border-slate-200/80 bg-white/90 backdrop-blur-sm">
				<PostCoverHero
					variant="banner"
					coverUrl={data.post.coverImage}
					title={data.post.title}
					excerpt={data.post.excerpt}
					meta={`Published on ${data.post.createdAt.toLocaleDateString()}`}
					textScrim={data.post.options?.coverTextScrim ?? false}
				/>

				<div class="prose prose-lg max-w-none p-8 lg:p-10">
					{#each blocks as block (block.id)}
						<BlockContent {block} />
					{/each}
				</div>
			</article>
		</div>
	{/if}
</div>
