import type { OutputData } from '@editorjs/editorjs';
import type { PostBlock } from '$lib/types/blocks';

type EditorBlock = NonNullable<OutputData['blocks']>[number];

function flattenListItems(items: { content?: string; items?: unknown[] }[] | undefined): string[] {
	if (!items?.length) return [''];
	const out: string[] = [];
	const walk = (arr: { content?: string; items?: unknown[] }[]) => {
		for (const it of arr) {
			if (it.content != null && it.content !== '') out.push(it.content);
			if (Array.isArray(it.items) && it.items.length) {
				walk(it.items as { content?: string; items?: unknown[] }[]);
			}
		}
	};
	walk(items);
	return out.length ? out : [''];
}

function listItemsToEditor(items: string[], ordered: boolean) {
	const style = ordered ? ('ordered' as const) : ('unordered' as const);
	return {
		style,
		items: (items.length ? items : ['']).map((content) => ({
			content,
			meta: {},
			items: []
		}))
	};
}

/** Persisted blocks → Editor.js `data` for `new EditorJS({ data })` */
export function blocksToOutputData(blocks: PostBlock[]): OutputData {
	const sorted = [...blocks].sort((a, b) => a.order - b.order);
	const out: EditorBlock[] = [];

	for (const b of sorted) {
		switch (b.type) {
			case 'paragraph':
				out.push({
					type: 'paragraph',
					id: b.id,
					data: { text: String((b.content as { text?: string }).text ?? '') }
				});
				break;
			case 'heading': {
				const c = b.content as { text?: string; level?: number };
				out.push({
					type: 'header',
					id: b.id,
					data: {
						text: String(c.text ?? ''),
						level: Math.min(3, Math.max(1, c.level ?? 2))
					}
				});
				break;
			}
			case 'quote': {
				const c = b.content as { text?: string; author?: string };
				out.push({
					type: 'quote',
					id: b.id,
					data: {
						text: String(c.text ?? ''),
						caption: String(c.author ?? ''),
						alignment: 'left'
					}
				});
				break;
			}
			case 'list': {
				const c = b.content as { items?: string[]; ordered?: boolean };
				out.push({
					type: 'list',
					id: b.id,
					data: listItemsToEditor(c.items ?? [''], Boolean(c.ordered))
				});
				break;
			}
			case 'image': {
				const c = b.content as { url?: string; title?: string; caption?: string };
				const url = String(c.url ?? '');
				const cap = [c.title, c.caption].filter(Boolean).join('\n');
				out.push({
					type: 'image',
					id: b.id,
					data: {
						file: { url },
						caption: cap,
						withBorder: false,
						stretched: false,
						withBackground: false
					}
				});
				break;
			}
			case 'divider':
				out.push({ type: 'divider', id: b.id, data: {} });
				break;
			case 'bubbleText': {
				const c = b.content as {
					text?: string;
					arrowSide?: 'bottom' | 'top' | 'left' | 'right';
					arrowPosition?: 'left' | 'center' | 'right';
					lineStyle?: 'solid' | 'dashed' | 'dotted';
					shape?: 'square' | 'round' | 'circle';
					animation?: 'none' | 'pop' | 'float';
				};
				out.push({
					type: 'bubbleText',
					id: b.id,
					data: {
						text: String(c.text ?? ''),
						arrowSide: c.arrowSide ?? 'bottom',
						arrowPosition: c.arrowPosition ?? 'left',
						lineStyle: c.lineStyle ?? 'solid',
						shape: c.shape ?? 'round',
						animation: c.animation ?? 'none'
					}
				});
				break;
			}
			case 'gif': {
				const c = b.content as { url?: string; title?: string; klipyId?: number };
				out.push({
					type: 'gif',
					id: b.id,
					data: {
						url: String(c.url ?? ''),
						title: String(c.title ?? ''),
						...(typeof c.klipyId === 'number' ? { klipyId: c.klipyId } : {})
					}
				});
				break;
			}
			default:
				break;
		}
	}

	return { time: Date.now(), blocks: out, version: '2.31.0' };
}

/** Editor.js save output → persisted `blocks[]` */
export function outputDataToBlocks(data: OutputData): PostBlock[] {
	const blocks = data.blocks ?? [];
	const out: PostBlock[] = [];

	blocks.forEach((block, index) => {
		const order = index;
		const id = block.id ?? `blk-${order}-${Date.now()}`;

		switch (block.type) {
			case 'paragraph':
				out.push({
					id,
					type: 'paragraph',
					order,
					content: { text: (block.data as { text?: string }).text ?? '' }
				});
				break;
			case 'header': {
				const d = block.data as { text?: string; level?: number };
				out.push({
					id,
					type: 'heading',
					order,
					content: { text: d.text ?? '', level: d.level ?? 2 }
				});
				break;
			}
			case 'quote': {
				const d = block.data as { text?: string; caption?: string };
				out.push({
					id,
					type: 'quote',
					order,
					content: { text: d.text ?? '', author: d.caption ?? '' }
				});
				break;
			}
			case 'list': {
				const d = block.data as {
					style?: string;
					items?: { content?: string; items?: unknown[] }[] | string[];
				};
				const ordered = d.style === 'ordered';
				let items: string[];
				if (Array.isArray(d.items) && d.items.length && typeof d.items[0] === 'string') {
					items = d.items as string[];
				} else {
					items = flattenListItems(d.items as { content?: string; items?: unknown[] }[]);
				}
				out.push({
					id,
					type: 'list',
					order,
					content: { items, ordered }
				});
				break;
			}
			case 'image': {
				const d = block.data as {
					file?: { url?: string };
					caption?: string;
				};
				const url = d.file?.url ?? '';
				const cap = d.caption ?? '';
				const lines = cap.split('\n');
				const title = lines.length > 1 ? lines[0] : '';
				const stripTags = (str: string) =>
					str.replace(/<\/?[^>]+(>|$)/g, '');

				const caption = lines.length > 1
					? stripTags(lines.slice(1).join('\n'))
					: stripTags(cap);
				out.push({
					id,
					type: 'image',
					order,
					content: { url, title, caption }
				});
				break;
			}
			case 'divider':
				out.push({
					id,
					type: 'divider',
					order,
					content: {}
				});
				break;
			case 'bubbleText': {
				const d = block.data as {
					text?: string;
					arrowSide?: 'bottom' | 'top' | 'left' | 'right';
					arrowPosition?: 'left' | 'center' | 'right';
					lineStyle?: 'solid' | 'dashed' | 'dotted';
					shape?: 'square' | 'round' | 'circle';
					animation?: 'none' | 'pop' | 'float';
				};
				out.push({
					id,
					type: 'bubbleText',
					order,
					content: {
						text: d.text ?? '',
						arrowSide: d.arrowSide ?? 'bottom',
						arrowPosition: d.arrowPosition ?? 'left',
						lineStyle: d.lineStyle ?? 'solid',
						shape: d.shape ?? 'round',
						animation: d.animation ?? 'none'
					}
				});
				break;
			}
			case 'gif': {
				const d = block.data as { url?: string; title?: string; klipyId?: number };
				out.push({
					id,
					type: 'gif',
					order,
					content: {
						url: d.url ?? '',
						title: d.title ?? '',
						...(typeof d.klipyId === 'number' ? { klipyId: d.klipyId } : {})
					}
				});
				break;
			}
			default:
				break;
		}
	});

	return out;
}
