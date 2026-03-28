<script lang="ts">
	import { onMount } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import { splitBlocksIntoSlides } from '$lib/slides';
	import type { PostOptions } from '$lib/types/post-options';
	import type { PostBlock } from '$lib/types/blocks';
	import { cn } from '$lib/utils/cn';
	import BlockContent from './BlockContent.svelte';
	import PostCoverHero from './PostCoverHero.svelte';

	type StorySlide =
		| { kind: 'cover' }
		| { kind: 'content'; blocks: PostBlock[] };

	type PostLike = {
		title: string;
		excerpt?: string | null;
		coverImage?: string | null;
		options?: PostOptions | null;
		createdAt: Date;
		blocks?: PostBlock[] | null;
	};

	let {
		post,
		onExit,
		secondsPerSlide = 5
	}: {
		post: PostLike;
		onExit: () => void;
		secondsPerSlide?: number;
	} = $props();

	let reducedMotion = $state(false);
	let activeIndex = $state(0);
	/** 1 = forward (next / scroll down), -1 = backward (previous / scroll up) */
	let slideTransitionDir = $state<1 | -1>(1);
	let paused = $state(false);
	let progress = $state(0);

	let rafId: number | null = null;
	let lastTs: number | null = null;
	let elapsed = 0;

	const contentSlides = $derived(splitBlocksIntoSlides(post.blocks ?? null));

	/** Cover is always slide 1; following slides are block groups (divider-separated). */
	const storySlides = $derived.by((): StorySlide[] => {
		const out: StorySlide[] = [{ kind: 'cover' }];
		for (const blocks of contentSlides) {
			out.push({ kind: 'content', blocks });
		}
		return out;
	});

	const coverSrc = $derived(post.coverImage?.trim() ?? '');

	const slideMeta = $derived(
		storySlides.length > 1
			? `${post.createdAt.toLocaleDateString()} · Slide ${activeIndex + 1} of ${storySlides.length}`
			: post.createdAt.toLocaleDateString()
	);

	const activeStory = $derived(storySlides[activeIndex]);
	const isCoverSlide = $derived(activeStory?.kind === 'cover');
	const activeBlocks = $derived(activeStory?.kind === 'content' ? activeStory.blocks : []);

	const durationMs = $derived(Math.max(1, secondsPerSlide * 1000));

	function goTo(nextIndex: number) {
		const prev = activeIndex;
		const clamped = Math.max(0, Math.min(storySlides.length - 1, nextIndex));
		if (clamped !== prev) {
			slideTransitionDir = clamped > prev ? 1 : -1;
		}
		activeIndex = clamped;
		elapsed = 0;
		progress = 0;
		lastTs = null;
	}

	function goNext() {
		if (activeIndex >= storySlides.length - 1) return;
		goTo(activeIndex + 1);
	}

	function goPrev() {
		if (activeIndex <= 0) return;
		goTo(activeIndex - 1);
	}

	function tick(ts: number) {
		if (storySlides.length === 0) {
			rafId = requestAnimationFrame(tick);
			return;
		}
		const ai = activeIndex;
		if (!reducedMotion && !paused) {
			const last = lastTs ?? ts;
			const delta = ts - last;
			lastTs = ts;
			elapsed += delta;
			const nextProgress = Math.min(1, elapsed / durationMs);
			progress = nextProgress;
			if (nextProgress >= 1) {
				if (ai < storySlides.length - 1) {
					goTo(ai + 1);
				} else {
					paused = true;
				}
			}
		} else {
			lastTs = ts;
		}
		rafId = requestAnimationFrame(tick);
	}

	function onKeyDown(e: KeyboardEvent) {
		if (e.key === 'ArrowRight') goNext();
		if (e.key === 'ArrowLeft') goPrev();
		if (e.key === 'Escape') onExit();
		if (e.key === ' ') {
			e.preventDefault();
			paused = !paused;
		}
	}

	onMount(() => {
		const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
		reducedMotion = mql.matches;
		const onChange = () => {
			reducedMotion = mql.matches;
		};
		mql.addEventListener('change', onChange);
		window.addEventListener('keydown', onKeyDown);
		rafId = requestAnimationFrame(tick);
		return () => {
			mql.removeEventListener('change', onChange);
			window.removeEventListener('keydown', onKeyDown);
			if (rafId != null) cancelAnimationFrame(rafId);
		};
	});

	/** Vertical travel for “scroll” transitions (px). Forward: out moves up, in from below. */
	const slideFlyY = 56;
	const slideInDuration = $derived(reducedMotion ? 0 : 420);
	const slideOutDuration = $derived(reducedMotion ? 0 : 360);
	const slideFlyEasing = cubicOut;
	const slideFlyInY = $derived(slideTransitionDir * slideFlyY);
	const slideFlyOutY = $derived(-slideTransitionDir * slideFlyY);

	const blockAnimClass = $derived(reducedMotion ? '' : 'animate__animated animate__slideInUp');
</script>

<div class="relative flex h-full min-h-0 w-full flex-col">
	<div class="absolute top-0 right-0 z-30 p-3">
		<button
			type="button"
			class="rounded-lg border border-white/40 bg-black/50 px-3 py-2 text-sm font-medium text-white shadow backdrop-blur-sm transition-colors hover:bg-black/65"
			onclick={onExit}>Close</button
		>
	</div>

	<div class="mb-3 flex shrink-0 gap-1">
		{#each storySlides as segment, i (i)}
			<div
				class="h-1 flex-1 overflow-hidden rounded-full bg-slate-200"
				aria-hidden="true"
				data-segment={segment.kind}
			>
				<div
					class="h-full bg-slate-900/70"
					style={`width: ${Math.round(
						(i < activeIndex ? 1 : i > activeIndex ? 0 : reducedMotion ? 1 : progress) * 100
					)}%`}
				></div>
			</div>
		{/each}
	</div>

	<div
		class="theme-card relative flex min-h-0 flex-1 flex-col overflow-hidden border border-slate-200/80 bg-white/90 backdrop-blur-sm"
		role="presentation"
		onpointerdown={() => (paused = true)}
		onpointerup={() => (paused = false)}
		onpointercancel={() => (paused = false)}
		onpointerleave={() => (paused = false)}
	>
		<div class="absolute inset-0 z-20 grid grid-cols-3">
			<button
				type="button"
				class="h-full w-full cursor-pointer"
				aria-label="Previous slide"
				onclick={(e) => {
					e.stopPropagation();
					goPrev();
				}}
			></button>
			<button
				type="button"
				class="h-full w-full cursor-pointer"
				aria-label={paused ? 'Play' : 'Pause'}
				onclick={(e) => {
					e.stopPropagation();
					paused = !paused;
				}}
			></button>
			<button
				type="button"
				class="h-full w-full cursor-pointer"
				aria-label="Next slide"
				onclick={(e) => {
					e.stopPropagation();
					goNext();
				}}
			></button>
		</div>

		<!-- 1×1 grid so in/out fly transitions overlap; flex-col would split height between two slides -->
		<div
			class={cn(
				'relative z-10 grid min-h-0 flex-1 grid-cols-1 grid-rows-1 overflow-hidden',
				isCoverSlide ? 'p-0' : 'p-8 lg:p-10'
			)}
		>
			{#key activeIndex}
				<div
					class={cn(
						'col-start-1 row-start-1 flex h-full min-h-0 min-w-0 flex-col',
						!isCoverSlide && 'overflow-y-auto'
					)}
					in:fly={{
						y: slideFlyInY,
						duration: slideInDuration,
						easing: slideFlyEasing
					}}
					out:fly={{
						y: slideFlyOutY,
						duration: slideOutDuration,
						easing: slideFlyEasing
					}}
				>
					{#if isCoverSlide}
						<PostCoverHero
							embedded
							variant="banner"
							coverUrl={coverSrc || null}
							title={post.title}
							excerpt={post.excerpt}
							meta={slideMeta}
							textScrim={post.options?.coverTextScrim ?? false}
						/>
					{:else}
						<div class="prose prose-lg max-w-none">
							{#each activeBlocks as block, i (block.id)}
								<div
									class={blockAnimClass}
									style={reducedMotion
										? ''
										: `animation-delay:${i * 80}ms;animation-fill-mode:both`}
								>
									{#if block.type !== 'divider'}
										<BlockContent {block} />
									{/if}
								</div>
							{/each}
						</div>
					{/if}
				</div>
			{/key}
		</div>

		<div
			class={cn(
				'absolute right-0 left-0 z-30 flex items-center justify-center gap-2 text-xs text-slate-600',
				isCoverSlide ? 'top-2' : 'bottom-3'
			)}
		>
			{#if !reducedMotion}
				<div class="rounded-full border border-slate-200 bg-white/80 px-3 py-1 shadow-sm">
					{paused ? 'Paused' : 'Playing'} · Hold to pause
				</div>
			{:else}
				<div class="rounded-full border border-slate-200 bg-white/80 px-3 py-1 shadow-sm">
					Reduced motion enabled
				</div>
			{/if}
		</div>
	</div>

	{#if contentSlides.length === 0}
		<p class="mt-4 text-center text-slate-600">No content blocks yet.</p>
	{/if}
</div>
