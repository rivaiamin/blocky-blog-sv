import Paragraph from '@editorjs/paragraph';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Quote from '@editorjs/quote';
import Image from '@editorjs/image';
import { DividerTool } from './divider-tool';

export function getEditorTools() {
	return {
		paragraph: Paragraph,
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
		divider: DividerTool
	};
}
