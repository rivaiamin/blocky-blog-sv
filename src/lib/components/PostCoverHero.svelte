<script lang="ts">
	/**
	 * 16:9 cover as background with title + description overlaid.
	 * When `textScrim` is true, text sits on a dark translucent block for readability.
	 */
	let {
		coverUrl,
		title,
		excerpt = null,
		meta = null,
		textScrim = false,
		variant = 'banner',
		embedded = false
	}: {
		coverUrl: string | null | undefined;
		title: string;
		excerpt?: string | null;
		meta?: string | null;
		textScrim?: boolean;
		variant?: 'banner' | 'card';
		/** Inside story carousel: no outer border/radius (parent provides frame) */
		embedded?: boolean;
	} = $props();

	const hasCover = $derived(Boolean(coverUrl?.trim()));
	const src = $derived(coverUrl?.trim() ?? '');
</script>

<div
	class={embedded
		? 'group relative h-full min-h-0 w-full min-w-0 flex-1 overflow-hidden bg-slate-200'
		: variant === 'card'
			? 'group relative aspect-auto h-96 w-full overflow-hidden rounded-xl border border-slate-200/80 bg-slate-200'
			: 'relative aspect-video w-full overflow-hidden rounded-xl border border-slate-200/80 bg-slate-200'}
>
	{#if hasCover}
		<img
			{src}
			alt=""
			class="absolute inset-0 size-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]"
		/>
		<div
			class="pointer-events-none absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent"
			aria-hidden="true"
		></div>
	{:else}
		<div
			class="absolute inset-0 bg-linear-to-br from-slate-200 via-slate-100 to-slate-300"
			aria-hidden="true"
		></div>
	{/if}

	<div class="absolute inset-0 z-10 flex flex-col justify-end p-4 md:p-6">
		<div
			class={textScrim
				? 'max-w-full rounded-lg bg-black/75 px-4 py-3 text-white shadow-lg backdrop-blur-[2px]'
				: hasCover
					? 'max-w-full text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]'
					: 'max-w-full text-slate-900'}
		>
			{#if variant === 'banner'}
				<h1 class="text-2xl leading-tight font-bold md:text-4xl">{title}</h1>
			{:else}
				<h2 class="text-lg leading-snug font-bold md:text-xl">{title}</h2>
			{/if}
			{#if excerpt?.trim()}
				<p
					class={variant === 'card'
						? `mt-1 line-clamp-3 text-sm md:text-base ${hasCover ? 'text-white/95' : 'text-slate-700'}`
						: `mt-2 text-base md:text-xl ${hasCover ? 'text-white/95' : 'text-slate-700'}`}
				>
					{excerpt}
				</p>
			{/if}
			{#if meta}
				<p
					class={variant === 'card'
						? `mt-2 text-xs ${hasCover ? 'text-white/85' : 'text-slate-600'}`
						: `mt-3 text-sm ${hasCover ? 'text-white/85' : 'text-slate-600'}`}
				>
					{meta}
				</p>
			{/if}
		</div>
	</div>
</div>
