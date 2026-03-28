type KlipyGifData = {
	url?: string;
	title?: string;
	klipyId?: number;
};

type KlipySearchItem = {
	id?: number;
	title: string;
	gifUrl: string;
	previewUrl: string;
};

type KlipySearchResponse = {
	items: KlipySearchItem[];
	current_page: number;
	per_page: number;
	has_next: boolean;
};

const DEFAULT_DATA: Required<KlipyGifData> = {
	url: '',
	title: '',
	klipyId: 0
};

export class KlipyGifTool {
	private data: Required<KlipyGifData>;
	private root: HTMLDivElement | null = null;
	private searchInput: HTMLInputElement | null = null;
	private resultsEl: HTMLDivElement | null = null;
	private selectedWrap: HTMLDivElement | null = null;
	private statusEl: HTMLParagraphElement | null = null;
	private loadMoreBtn: HTMLButtonElement | null = null;
	private nextPage = 1;
	private lastQuery = '';
	private loading = false;

	constructor({ data }: { data?: KlipyGifData } = {}) {
		this.data = {
			url: String(data?.url ?? DEFAULT_DATA.url),
			title: String(data?.title ?? DEFAULT_DATA.title),
			klipyId: typeof data?.klipyId === 'number' ? data.klipyId : DEFAULT_DATA.klipyId
		};
	}

	static get toolbox() {
		return {
			title: 'GIF',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M10 9h4v6h-4z"/><path d="M6 15V9l4 3-4 3"/></svg>`
		};
	}

	private setStatus(text: string) {
		if (this.statusEl) this.statusEl.textContent = text;
	}

	private async fetchPage(page: number, append: boolean) {
		if (this.loading) return;
		this.loading = true;
		this.setStatus(page === 1 ? 'Searching…' : 'Loading…');
		if (this.loadMoreBtn) this.loadMoreBtn.disabled = true;

		const params = new URLSearchParams();
		const q = this.lastQuery;
		if (q) params.set('q', q);
		params.set('page', String(page));
		params.set('per_page', '24');

		try {
			const res = await fetch(`/api/klipy/gifs?${params.toString()}`, {
				credentials: 'same-origin'
			});
			if (!res.ok) {
				const errText =
					res.status === 401
						? 'Sign in required.'
						: res.status === 503
							? 'GIF search is not configured (missing API key).'
							: 'Could not load GIFs.';
				this.setStatus(errText);
				return;
			}
			const body = (await res.json()) as KlipySearchResponse;
			this.nextPage = body.current_page + 1;
			if (!append && this.resultsEl) this.resultsEl.innerHTML = '';

			if (!body.items.length && page === 1) {
				this.setStatus('No results. Try another search.');
			} else if (page === 1) {
				this.setStatus('');
			}

			for (const item of body.items) {
				const btn = document.createElement('button');
				btn.type = 'button';
				btn.className =
					'group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400';
				btn.setAttribute('aria-label', `Select GIF: ${item.title || 'GIF'}`);
				const img = document.createElement('img');
				img.src = item.previewUrl || item.gifUrl;
				img.alt = item.title || '';
				img.className = 'h-full w-full object-cover';
				img.loading = 'lazy';
				btn.appendChild(img);
				btn.addEventListener('click', () => {
					this.data.url = item.gifUrl;
					this.data.title = item.title;
					this.data.klipyId = item.id ?? 0;
					this.renderBody();
				});
				this.resultsEl?.appendChild(btn);
			}

			if (this.loadMoreBtn) {
				this.loadMoreBtn.hidden = !body.has_next;
				this.loadMoreBtn.disabled = false;
			}
		} catch {
			this.setStatus('Network error. Try again.');
		} finally {
			this.loading = false;
		}
	}

	private renderBody() {
		if (!this.root) return;
		this.root.innerHTML = '';

		if (this.data.url) {
			const wrap = document.createElement('div');
			wrap.className = 'my-3 space-y-3';
			this.selectedWrap = wrap;

			const fig = document.createElement('div');
			fig.className =
				'overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm';
			const img = document.createElement('img');
			img.src = this.data.url;
			img.alt = this.data.title || 'GIF';
			img.className = 'mx-auto max-h-80 w-full object-contain';
			img.loading = 'lazy';
			fig.appendChild(img);
			wrap.appendChild(fig);

			if (this.data.title) {
				const cap = document.createElement('p');
				cap.className = 'text-center text-sm text-slate-600';
				cap.textContent = this.data.title;
				wrap.appendChild(cap);
			}

			const row = document.createElement('div');
			row.className = 'flex flex-wrap gap-2';
			const change = document.createElement('button');
			change.type = 'button';
			change.className =
				'rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50';
			change.textContent = 'Change GIF';
			change.addEventListener('click', () => {
				this.data.url = '';
				this.data.title = '';
				this.data.klipyId = 0;
				this.renderBody();
			});
			row.appendChild(change);
			wrap.appendChild(row);

			const attr = document.createElement('p');
			attr.className = 'text-[11px] text-slate-400';
			attr.textContent = 'GIFs via Klipy';
			wrap.appendChild(attr);

			this.root.appendChild(wrap);
			return;
		}

		const wrap = document.createElement('div');
		wrap.className = 'my-3 space-y-3';

		const searchRow = document.createElement('div');
		searchRow.className = 'flex flex-wrap gap-2';
		this.searchInput = document.createElement('input');
		this.searchInput.type = 'search';
		this.searchInput.placeholder = 'Search GIFs…';
		this.searchInput.className =
			'min-w-[12rem] flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300';
		this.searchInput.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') {
				e.preventDefault();
				this.runSearch();
			}
		});
		const go = document.createElement('button');
		go.type = 'button';
		go.className =
			'rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700';
		go.textContent = 'Search';
		go.addEventListener('click', () => this.runSearch());
		searchRow.appendChild(this.searchInput);
		searchRow.appendChild(go);
		wrap.appendChild(searchRow);

		this.statusEl = document.createElement('p');
		this.statusEl.className = 'text-xs text-slate-500';
		wrap.appendChild(this.statusEl);

		this.resultsEl = document.createElement('div');
		this.resultsEl.className = 'grid max-h-72 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4 md:grid-cols-5';
		wrap.appendChild(this.resultsEl);

		this.loadMoreBtn = document.createElement('button');
		this.loadMoreBtn.type = 'button';
		this.loadMoreBtn.hidden = true;
		this.loadMoreBtn.className =
			'w-full rounded-lg border border-slate-200 bg-slate-50 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100';
		this.loadMoreBtn.textContent = 'Load more';
		this.loadMoreBtn.addEventListener('click', () => this.fetchPage(this.nextPage, true));
		wrap.appendChild(this.loadMoreBtn);

		const hint = document.createElement('p');
		hint.className = 'text-[11px] text-slate-400';
		hint.textContent = 'Powered by Klipy — search and pick a GIF.';
		wrap.appendChild(hint);

		this.root.appendChild(wrap);
		this.lastQuery = '';
		this.nextPage = 1;
		void this.fetchPage(1, false);
	}

	private runSearch() {
		const q = this.searchInput?.value?.trim() ?? '';
		this.lastQuery = q;
		this.nextPage = 1;
		void this.fetchPage(1, false);
	}

	render() {
		this.root = document.createElement('div');
		this.root.className = 'klipy-gif-tool';
		this.renderBody();
		return this.root;
	}

	save() {
		return {
			url: this.data.url,
			title: this.data.title,
			...(this.data.klipyId ? { klipyId: this.data.klipyId } : {})
		};
	}
}
