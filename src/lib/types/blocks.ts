export type BlockType =
	| 'heading'
	| 'paragraph'
	| 'image'
	| 'quote'
	| 'list'
	| 'divider'
	| 'bubbleText'
	| 'gif';

export type PostBlock = {
	id: string;
	type: BlockType;
	content: Record<string, unknown>;
	order: number;
};
