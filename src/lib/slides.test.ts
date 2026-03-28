import { describe, expect, it } from 'vitest';
import { splitBlocksIntoSlides } from './slides';
import type { PostBlock } from './types/blocks';

function block(id: string, type: PostBlock['type'], overrides: Partial<PostBlock> = {}): PostBlock {
	return {
		id,
		type,
		content: {},
		order: 0,
		...overrides
	};
}

describe('splitBlocksIntoSlides', () => {
	it('returns empty array for null, undefined, or empty blocks', () => {
		expect(splitBlocksIntoSlides(null)).toEqual([]);
		expect(splitBlocksIntoSlides(undefined)).toEqual([]);
		expect(splitBlocksIntoSlides([])).toEqual([]);
	});

	it('treats blocks without dividers as a single slide', () => {
		const blocks = [
			block('a', 'paragraph', { content: { text: 'hi' } }),
			block('b', 'heading', { content: { text: 't', level: 2 } })
		];
		expect(splitBlocksIntoSlides(blocks)).toEqual([blocks]);
	});

	it('splits on divider into multiple slides', () => {
		const p1 = block('1', 'paragraph', { content: { text: 'A' } });
		const div = block('d', 'divider');
		const p2 = block('2', 'paragraph', { content: { text: 'B' } });
		expect(splitBlocksIntoSlides([p1, div, p2])).toEqual([[p1], [p2]]);
	});

	it('ignores leading dividers (no empty leading slide)', () => {
		const div = block('d', 'divider');
		const p1 = block('1', 'paragraph', { content: { text: 'A' } });
		expect(splitBlocksIntoSlides([div, p1])).toEqual([[p1]]);
	});

	it('does not create empty slides for consecutive dividers', () => {
		const p1 = block('1', 'paragraph', { content: { text: 'A' } });
		const d1 = block('d1', 'divider');
		const d2 = block('d2', 'divider');
		const p2 = block('2', 'paragraph', { content: { text: 'B' } });
		expect(splitBlocksIntoSlides([p1, d1, d2, p2])).toEqual([[p1], [p2]]);
	});

	it('drops trailing divider without an extra empty slide', () => {
		const p1 = block('1', 'paragraph', { content: { text: 'A' } });
		const div = block('d', 'divider');
		expect(splitBlocksIntoSlides([p1, div])).toEqual([[p1]]);
	});

	it('returns no slides when blocks are only dividers', () => {
		expect(splitBlocksIntoSlides([block('d1', 'divider'), block('d2', 'divider')])).toEqual([]);
	});
});
