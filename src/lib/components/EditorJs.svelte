<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { browser } from '$app/environment';
	import type { PostBlock } from '$lib/types/blocks';
	import { blocksToOutputData, outputDataToBlocks } from '$lib/editorjs/adapter';
	import type EditorJS from '@editorjs/editorjs';

	let {
		initialBlocks = [],
		onChange
	}: {
		initialBlocks: PostBlock[];
		onChange?: (blocks: PostBlock[]) => void;
	} = $props();

	let holderEl = $state<HTMLDivElement | undefined>(undefined);
	let editor: EditorJS | null = null;

	onMount(async () => {
		if (!browser || !holderEl) return;
		const [{ default: EditorJS }, { getEditorTools }] = await Promise.all([
			import('@editorjs/editorjs'),
			import('$lib/editorjs/tools')
		]);
		editor = new EditorJS({
			holder: holderEl,
			tools: getEditorTools(),
			data: blocksToOutputData(initialBlocks),
			onChange: async () => {
				if (!onChange || !editor) return;
				const data = await editor.save();
				onChange(outputDataToBlocks(data));
			}
		});
		await editor.isReady;
		// Typography plugin: restore heading/quote/list styles inside the redactor only (toolbar is a sibling).
		holderEl
			.querySelector('.codex-editor__redactor')
			?.classList.add('prose', 'prose-slate', 'max-w-none', 'leading-relaxed');
	});

	onDestroy(() => {
		editor?.destroy();
		editor = null;
	});
</script>

<div
	bind:this={holderEl}
	class="min-h-[280px] rounded-xl border border-slate-200 bg-white p-4"
></div>
