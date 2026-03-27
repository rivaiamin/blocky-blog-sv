<script lang="ts">
	import type { PostBlock } from '$lib/types/blocks';
	import { htmlDecode } from '$lib/utils/htmlDecode';
	let { block }: { block: PostBlock } = $props();
</script>

{#if block.type === 'heading'}
	{@const level = Number((block.content as { level?: number }).level) || 2}
	{@const text = String((block.content as { text?: string }).text ?? '')}
	{#if level === 1}
		<h1 class="mb-4 text-3xl font-bold">{text}</h1>
	{:else if level === 2}
		<h2 class="mb-4 text-2xl font-bold">{text}</h2>
	{:else}
		<h3 class="mb-4 text-xl font-bold">{text}</h3>
	{/if}
{:else if block.type === 'paragraph'}
	<p class="mb-4 leading-relaxed text-slate-800">
		{htmlDecode(String((block.content as { text?: string }).text ?? ''))}
	</p>
{:else if block.type === 'quote'}
	<blockquote
		class="my-6 border-l-4 border-slate-300 pl-6 text-lg italic text-slate-700"
		style:border-color="var(--color-primary)"
	>
		<p class="mb-2">{ htmlDecode(String((block.content as { text?: string }).text ?? ''))}</p>
		{#if (block.content as { author?: string }).author}
			<cite class="text-sm not-italic text-slate-500">
				— {String((block.content as { author?: string }).author)}</cite
			>
		{/if}
	</blockquote>
{:else if block.type === 'list'}
	{@const ordered = Boolean((block.content as { ordered?: boolean }).ordered)}
	{@const items = (block.content as { items?: string[] }).items ?? []}
	{#if ordered}
		<ol class="mb-4 list-inside list-decimal space-y-1">
			{#each items as item, index (index)}
				<li class="text-slate-800">{item}</li>
			{/each}
		</ol>
	{:else}
		<ul class="mb-4 list-inside list-disc space-y-1">
			{#each items as item, index (index)}
				<li class="text-slate-800">{item}</li>
			{/each}
		</ul>
	{/if}
{:else if block.type === 'image'}
	{@const c = block.content as { url?: string; title?: string; caption?: string }}
	<figure class="my-8">
		{#if c.url}
			<div
				class="overflow-hidden rounded-xl border border-slate-200/80 bg-slate-50/80 shadow-sm"
			>
				<img
					src={c.url}
					alt={c.title || c.caption || 'Image'}
					class="max-h-112 w-full object-contain"
				/>
			</div>
		{/if}
		{#if c.title || c.caption}
			<figcaption class="mt-3 space-y-1">
				{#if c.title}
					<div class="font-semibold text-slate-900">{c.title}</div>
				{/if}
				{#if c.caption}
					<div class="text-sm text-slate-500">{c.caption}</div>
				{/if}
			</figcaption>
		{/if}
	</figure>
{:else if block.type === 'divider'}
	<div class="my-8 flex justify-center">
		<div class="h-px w-24 bg-slate-300"></div>
	</div>
{:else if block.type === 'bubbleText'}
	{@const c = block.content as {
		text?: string;
		arrowSide?: 'bottom' | 'top' | 'left' | 'right';
		arrowPosition?: 'left' | 'center' | 'right';
		lineStyle?: 'solid' | 'dashed' | 'dotted';
		shape?: 'square' | 'round' | 'circle';
		animation?: 'none' | 'pop' | 'float';
	}}
	{@const lineClass = c.lineStyle === 'dashed'
		? 'bubble-text-dashed'
		: c.lineStyle === 'dotted'
			? 'bubble-text-dotted'
			: 'bubble-text-solid'}
	{@const shapeClass = c.shape === 'circle' ? 'circle' : c.shape === 'square' ? '' : 'round'}
	{@const sideClass = c.arrowSide === 'top' ? 't' : c.arrowSide === 'left' ? 'l' : c.arrowSide === 'right' ? 'r' : ''}
	{@const arrowPosClass = c.arrowSide === 'left' || c.arrowSide === 'right'
		? ''
		: c.arrowPosition === 'right'
			? 'bubble-right'
			: c.arrowPosition === 'center'
				? 'bubble-center'
				: 'bubble-left'}
	{@const animationClass = c.animation === 'pop' ? 'pop' : c.animation === 'float' ? 'float' : ''}
	<div class="my-6">
		<div class={`speech-bubble ${shapeClass} ${sideClass} ${arrowPosClass} ${lineClass} ${animationClass}`}>
			<div class="speech-bubble__content">
				{htmlDecode(String(c.text ?? ''))}
			</div>
		</div>
	</div>
{/if}
