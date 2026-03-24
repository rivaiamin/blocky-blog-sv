/**
 * Custom Editor.js block: maps to persisted `type: "divider"` for slide splitting.
 */
export class DividerTool {
	static get toolbox() {
		return {
			title: 'Divider',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18"/></svg>`
		};
	}

	render() {
		const wrap = document.createElement('div');
		wrap.className = 'my-2 flex justify-center py-2';
		wrap.innerHTML = `<div class="h-px w-24 bg-slate-300" aria-hidden="true"></div>`;
		return wrap;
	}

	save() {
		return {};
	}
}
