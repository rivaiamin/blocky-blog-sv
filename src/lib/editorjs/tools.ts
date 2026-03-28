import type { EditorConfig } from '@editorjs/editorjs/types/configs/editor-config';
import Paragraph from '@editorjs/paragraph';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Quote from '@editorjs/quote';
import Image from '@editorjs/image';
import { DividerTool } from './divider-tool';
import { BubbleTextTool } from './bubble-text-tool';
import { KlipyGifTool } from './klipy-gif-tool';

export function getEditorTools(): NonNullable<EditorConfig['tools']> {
	return {
		paragraph: {
			class: Paragraph,
			config: { preserveBlank: true }
		},
		header: Header,
		list: {
			class: List,
			inlineToolbar: true,
			config: {
				defaultStyle: 'unordered'
			}
		},
		quote: Quote,
		image: {
			class: Image,
			config: {
				uploader: {
					uploadByFile: async () => ({
						success: 0 as const
					}),
					uploadByUrl: async (url: string) => ({
						success: 1 as const,
						file: { url }
					})
				}
			}
		},
		divider: DividerTool,
		bubbleText: BubbleTextTool,
		gif: KlipyGifTool
	} as NonNullable<EditorConfig['tools']>;
}
