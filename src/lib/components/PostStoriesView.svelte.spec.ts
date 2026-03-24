import { page } from 'vitest/browser';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import type { PostBlock } from '$lib/types/blocks';
import PostStoriesView from './PostStoriesView.svelte';

const baseDate = new Date('2025-06-15T12:00:00.000Z');

function twoSlideBlocks(): PostBlock[] {
	return [
		{ id: '1', type: 'paragraph', content: { text: 'SlideOne' }, order: 0 },
		{ id: 'd', type: 'divider', content: {}, order: 1 },
		{ id: '2', type: 'paragraph', content: { text: 'SlideTwo' }, order: 2 }
	];
}

function dispatchKey(key: string) {
	window.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
}

describe('PostStoriesView', () => {
	const originalMatchMedia = window.matchMedia.bind(window);

	afterEach(() => {
		window.matchMedia = originalMatchMedia;
	});

	it('advances slide with ArrowRight and goes back with ArrowLeft', async () => {
		render(PostStoriesView, {
			post: {
				title: 'Story post',
				createdAt: baseDate,
				blocks: twoSlideBlocks()
			},
			onExit: () => {}
		});

		await expect.element(page.getByText(/1\/2/)).toBeInTheDocument();
		dispatchKey('ArrowRight');
		await expect.element(page.getByText(/2\/2/)).toBeInTheDocument();
		dispatchKey('ArrowLeft');
		await expect.element(page.getByText(/1\/2/)).toBeInTheDocument();
	});

	it('invokes onExit when Escape is pressed', async () => {
		let exited = false;
		render(PostStoriesView, {
			post: {
				title: 'Story post',
				createdAt: baseDate,
				blocks: twoSlideBlocks()
			},
			onExit: () => {
				exited = true;
			}
		});

		dispatchKey('Escape');
		expect(exited).toBe(true);
	});

	it('toggles paused state with Space', async () => {
		render(PostStoriesView, {
			post: {
				title: 'Story post',
				createdAt: baseDate,
				blocks: twoSlideBlocks()
			},
			onExit: () => {}
		});

		await expect.element(page.getByText(/Playing/)).toBeInTheDocument();
		dispatchKey(' ');
		await expect.element(page.getByText(/Paused/)).toBeInTheDocument();
		dispatchKey(' ');
		await expect.element(page.getByText(/Playing/)).toBeInTheDocument();
	});

	it('shows reduced motion messaging when prefers-reduced-motion matches reduce', async () => {
		window.matchMedia = vi.fn().mockImplementation((query: string) => {
			const reduce = query === '(prefers-reduced-motion: reduce)';
			return {
				matches: reduce,
				media: query,
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
				dispatchEvent: () => true,
				onchange: null,
				addListener: vi.fn(),
				removeListener: vi.fn()
			} as MediaQueryList;
		}) as typeof window.matchMedia;

		render(PostStoriesView, {
			post: {
				title: 'Story post',
				createdAt: baseDate,
				blocks: twoSlideBlocks()
			},
			onExit: () => {}
		});

		await expect.element(page.getByText(/Reduced motion enabled/)).toBeInTheDocument();
	});
});
