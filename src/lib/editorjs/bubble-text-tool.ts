type ArrowPosition = 'left' | 'center' | 'right';
type ArrowSide = 'bottom' | 'top' | 'left' | 'right';
type LineStyle = 'solid' | 'dashed' | 'dotted';
type BubbleShape = 'square' | 'round' | 'circle';
type BubbleAnimation = 'none' | 'pop' | 'float';

type BubbleTextData = {
	text?: string;
	arrowSide?: ArrowSide;
	arrowPosition?: ArrowPosition;
	lineStyle?: LineStyle;
	shape?: BubbleShape;
	animation?: BubbleAnimation;
};

const DEFAULT_DATA: Required<BubbleTextData> = {
	text: '',
	arrowSide: 'bottom',
	arrowPosition: 'left',
	lineStyle: 'solid',
	shape: 'round',
	animation: 'none'
};

export class BubbleTextTool {
	private readonly data: Required<BubbleTextData>;
	private editable: HTMLDivElement | null = null;
	private bubbleEl: HTMLDivElement | null = null;

	constructor({ data }: { data?: BubbleTextData } = {}) {
		this.data = {
			text: String(data?.text ?? DEFAULT_DATA.text),
			arrowSide: data?.arrowSide ?? DEFAULT_DATA.arrowSide,
			arrowPosition: data?.arrowPosition ?? DEFAULT_DATA.arrowPosition,
			lineStyle: data?.lineStyle ?? DEFAULT_DATA.lineStyle,
			shape: data?.shape ?? DEFAULT_DATA.shape,
			animation: data?.animation ?? DEFAULT_DATA.animation
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
		wrap.className = 'my-3 space-y-3';

		const controls = document.createElement('div');
		controls.className =
			'grid grid-cols-2 gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs md:grid-cols-3';

		const createSelect = <T extends string>(
			label: string,
			options: { value: T; label: string }[],
			value: T,
			onChange: (v: T) => void
		) => {
			const field = document.createElement('label');
			field.className = 'flex flex-col gap-1 text-[11px] font-medium text-slate-600';
			field.textContent = label;
			const select = document.createElement('select');
			select.className =
				'rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-800 outline-none';
			for (const opt of options) {
				const option = document.createElement('option');
				option.value = opt.value;
				option.textContent = opt.label;
				if (opt.value === value) option.selected = true;
				select.appendChild(option);
			}
			select.addEventListener('change', () => onChange(select.value as T));
			field.appendChild(select);
			controls.appendChild(field);
		};

		createSelect<ArrowSide>(
			'Arrow Side',
			[
				{ value: 'bottom', label: 'Bottom' },
				{ value: 'top', label: 'Top' },
				{ value: 'left', label: 'Left' },
				{ value: 'right', label: 'Right' }
			],
			this.data.arrowSide,
			(v) => {
				this.data.arrowSide = v;
				this.updateBubbleClass();
			}
		);
		createSelect<ArrowPosition>(
			'Arrow Position',
			[
				{ value: 'left', label: 'Left' },
				{ value: 'center', label: 'Center' },
				{ value: 'right', label: 'Right' }
			],
			this.data.arrowPosition,
			(v) => {
				this.data.arrowPosition = v;
				this.updateBubbleClass();
			}
		);
		createSelect<LineStyle>(
			'Line Style',
			[
				{ value: 'solid', label: 'Solid' },
				{ value: 'dashed', label: 'Dashed' },
				{ value: 'dotted', label: 'Dotted' }
			],
			this.data.lineStyle,
			(v) => {
				this.data.lineStyle = v;
				this.updateBubbleClass();
			}
		);
		createSelect<BubbleShape>(
			'Shape',
			[
				{ value: 'square', label: 'Square' },
				{ value: 'round', label: 'Round' },
				{ value: 'circle', label: 'Circle' }
			],
			this.data.shape,
			(v) => {
				this.data.shape = v;
				this.updateBubbleClass();
			}
		);
		createSelect<BubbleAnimation>(
			'Animation',
			[
				{ value: 'none', label: 'None' },
				{ value: 'pop', label: 'Pop' },
				{ value: 'float', label: 'Float' }
			],
			this.data.animation,
			(v) => {
				this.data.animation = v;
				this.updateBubbleClass();
			}
		);

		const bubble = document.createElement('div');
		this.bubbleEl = bubble;
		this.updateBubbleClass();
		this.editable = document.createElement('div');
		this.editable.className = 'speech-bubble__content speech-bubble__editor';
		this.editable.contentEditable = 'true';
		this.editable.spellcheck = true;
		this.editable.dataset.placeholder = 'Type bubble text...';
		this.editable.textContent = this.data.text;

		wrap.appendChild(controls);
		wrap.appendChild(bubble);
		bubble.appendChild(this.editable);
		return wrap;
	}

	private updateBubbleClass() {
		if (!this.bubbleEl) return;
		const lineStyleClass = {
			solid: 'bubble-text-solid',
			dashed: 'bubble-text-dashed',
			dotted: 'bubble-text-dotted'
		}[this.data.lineStyle];
		const shapeClass = {
			square: '',
			round: 'round',
			circle: 'circle'
		}[this.data.shape];
		const sideClass = {
			bottom: '',
			top: 't',
			left: 'l',
			right: 'r'
		}[this.data.arrowSide];
		const positionClass =
			this.data.arrowSide === 'left' || this.data.arrowSide === 'right'
				? ''
				: {
						left: 'bubble-left',
						center: 'bubble-center',
						right: 'bubble-right'
					}[this.data.arrowPosition];
		const animationClass = this.data.animation === 'none' ? '' : this.data.animation;
		this.bubbleEl.className = [
			'speech-bubble',
			shapeClass,
			sideClass,
			positionClass,
			lineStyleClass,
			animationClass
		]
			.filter(Boolean)
			.join(' ');
	}

	save() {
		const text = this.editable?.textContent?.trim() ?? '';
		return {
			text,
			arrowSide: this.data.arrowSide,
			arrowPosition: this.data.arrowPosition,
			lineStyle: this.data.lineStyle,
			shape: this.data.shape,
			animation: this.data.animation
		};
	}
}
