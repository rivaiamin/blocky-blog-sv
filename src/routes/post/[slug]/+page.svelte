<script lang="ts">
	import { goto } from '$app/navigation';
	import BlockContent from '$lib/components/BlockContent.svelte';
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

<div class="mx-auto max-w-3xl">
	<button
		type="button"
		class="theme-text-primary mb-8 inline-flex items-center gap-1 font-medium transition-opacity hover:opacity-80"
		onclick={() => goto(dashboardUrl)}
	>
		← Back to blog
	</button>

	{#if isStories}
		<PostStoriesView
			post={{
				title: data.post.title,
				excerpt: data.post.excerpt,
				createdAt: data.post.createdAt,
				blocks: blocks as PostBlock[]
			}}
			onExit={() => goto(dashboardUrl)}
		/>
	{:else}
		<article class="theme-card border border-slate-200/80 bg-white/90 p-8 backdrop-blur-sm lg:p-10">
			<header class="mb-8">
				<h1 class="theme-text-primary mb-4 text-4xl font-bold">{data.post.title}</h1>
				{#if data.post.excerpt}
					<p class="mb-4 text-xl text-slate-600">{data.post.excerpt}</p>
				{/if}
				<div class="theme-text-secondary text-sm">
					Published on {data.post.createdAt.toLocaleDateString()}
				</div>
			</header>

			<div class="prose prose-lg max-w-none">
				{#each blocks as block (block.id)}
					<BlockContent {block} />
				{/each}
			</div>
		</article>
	{/if}
</div>
