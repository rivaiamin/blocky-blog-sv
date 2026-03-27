type ArrowPosition = 'left' | 'center' | 'right';
type LineStyle = 'solid' | 'dashed' | 'dotted';

type BubbleTextData = {
	text?: string;
	arrowPosition?: ArrowPosition;
	lineStyle?: LineStyle;
};

const DEFAULT_DATA: Required<BubbleTextData> = {
	text: '',
	arrowPosition: 'left',
	lineStyle: 'solid'
};

export class BubbleTextTool {
	private readonly data: Required<BubbleTextData>;
	private editable: HTMLDivElement | null = null;

	constructor({ data }: { data?: BubbleTextData } = {}) {
		this.data = {
			text: String(data?.text ?? DEFAULT_DATA.text),
			arrowPosition: data?.arrowPosition ?? DEFAULT_DATA.arrowPosition,
			lineStyle: data?.lineStyle ?? DEFAULT_DATA.lineStyle
		};
	}

	static get toolbox() {
		return {
			title: 'Bubble Text',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/></svg>`
		};
	}

	render() {
		const wrap = document.createElement('div');
		wrap.className = 'my-3';

		const bubble = document.createElement('div');
		const lineStyleClass = {
			solid: 'bubble-text-solid',
			dashed: 'bubble-text-dashed',
			dotted: 'bubble-text-dotted'
		}[this.data.lineStyle];
		const arrowPosClass = {
			left: 'bubble-left',
			center: 'bubble-center',
			right: 'bubble-right'
		}[this.data.arrowPosition];

		bubble.className = `speech-bubble round ${arrowPosClass} ${lineStyleClass}`;

		this.editable = document.createElement('div');
		this.editable.className = 'speech-bubble__content speech-bubble__editor';
		this.editable.contentEditable = 'true';
		this.editable.spellcheck = true;
		this.editable.dataset.placeholder = 'Type bubble text...';
		this.editable.textContent = this.data.text;

		wrap.appendChild(bubble);
		bubble.appendChild(this.editable);
		return wrap;
	}

	save() {
		const text = this.editable?.textContent?.trim() ?? '';
		return {
			text,
			arrowPosition: this.data.arrowPosition,
			lineStyle: this.data.lineStyle
		};
	}
}
