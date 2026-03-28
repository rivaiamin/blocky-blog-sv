<script lang="ts">
	import { onMount } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import { splitBlocksIntoSlides } from '$lib/slides';
	import type { PostBlock } from '$lib/types/blocks';
	import { cn } from '$lib/utils/cn';
	import BlockContent from './BlockContent.svelte';

	type PostLike = {
		title: string;
		excerpt?: string | null;
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

	const slides = $derived(splitBlocksIntoSlides(post.blocks ?? null));

	const durationMs = $derived(Math.max(1, secondsPerSlide * 1000));

	function goTo(nextIndex: number) {
		const prev = activeIndex;
		const clamped = Math.max(0, Math.min(slides.length - 1, nextIndex));
		if (clamped !== prev) {
			slideTransitionDir = clamped > prev ? 1 : -1;
		}
		activeIndex = clamped;
		elapsed = 0;
		progress = 0;
		lastTs = null;
	}

	function goNext() {
		if (activeIndex >= slides.length - 1) return;
		goTo(activeIndex + 1);
	}

	function goPrev() {
		if (activeIndex <= 0) return;
		goTo(activeIndex - 1);
	}

	function tick(ts: number) {
		if (slides.length === 0) {
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
				if (ai < slides.length - 1) {
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

	const activeSlide = $derived(slides[activeIndex] ?? []);

	/** Vertical travel for “scroll” transitions (px). Forward: out moves up, in from below. */
	const slideFlyY = 56;
	const slideInDuration = $derived(reducedMotion ? 0 : 420);
	const slideOutDuration = $derived(reducedMotion ? 0 : 360);
	const slideFlyEasing = cubicOut;
	const slideFlyInY = $derived(slideTransitionDir * slideFlyY);
	const slideFlyOutY = $derived(-slideTransitionDir * slideFlyY);

	const blockAnimClass = $derived(reducedMotion ? '' : 'animate__animated animate__slideInUp');
</script>

{#if slides.length === 0}
	<div class="theme-card border border-slate-200/80 bg-white/90 p-8 backdrop-blur-sm">
		<div class="flex items-center justify-between gap-4">
			<div>
				<div class="theme-text-primary text-xl font-bold">{post.title}</div>
				{#if post.excerpt}
					<div class="mt-1 text-slate-600">{post.excerpt}</div>
				{/if}
			</div>
			<button
				type="button"
				class="rounded-lg border border-slate-200 px-3 py-2 transition-colors hover:bg-slate-50"
				onclick={onExit}>Close</button
			>
		</div>
		<div class="mt-6 text-slate-600">No content.</div>
	</div>
{:else}
	<div class="relative mx-auto max-w-3xl">
		<div class="mb-4 flex items-center justify-between gap-4">
			<div class="min-w-0">
				<div class="theme-text-primary truncate text-lg font-semibold">{post.title}</div>
				<div class="theme-text-secondary text-xs">
					{post.createdAt.toLocaleDateString()} · {activeIndex + 1}/{slides.length}
				</div>
			</div>
			<button
				type="button"
				class="rounded-lg border border-slate-200 px-3 py-2 transition-colors hover:bg-slate-50"
				onclick={onExit}>Close</button
			>
		</div>

		<div class="mb-3 flex gap-1">
			{#each slides as slide, i (slide)}
				<div class="h-1 flex-1 overflow-hidden rounded-full bg-slate-200" aria-hidden="true">
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
			class={cn(
				'theme-card relative min-h-112 overflow-hidden border border-slate-200/80 bg-white/90 backdrop-blur-sm md:min-h-128'
			)}
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

			<div class="relative z-10 grid grid-cols-1 p-8 lg:p-10">
				{#key activeIndex}
					<div
						class="col-start-1 row-start-1"
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
						<div class="prose prose-lg max-w-none">
							{#each activeSlide as block, i (block.id)}
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
					</div>
				{/key}
			</div>

			<div
				class="absolute right-0 bottom-3 left-0 z-30 flex items-center justify-center gap-2 text-xs text-slate-600"
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
	</div>
{/if}
