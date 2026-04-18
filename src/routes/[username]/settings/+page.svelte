<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	let heroDescription = $derived(data.settings.hero.description);

	$effect(() => {
		heroDescription = data.settings.hero.description;
	});

	const fonts = [
		{ value: 'Inter Variable, ui-sans-serif, system-ui, sans-serif', label: 'Inter' },
		{ value: 'Georgia, ui-serif, serif', label: 'Georgia' },
		{ value: "'Source Serif 4', ui-serif, Georgia, serif", label: 'Source Serif' },
		{ value: "'JetBrains Mono', ui-monospace, monospace", label: 'JetBrains Mono' },
		{ value: 'system-ui, -apple-system, sans-serif', label: 'System' }
	];
</script>

<div class="mx-auto max-w-2xl">
	<h1 class="theme-text-primary mb-8 text-2xl font-bold">Frontpage settings</h1>

	<form
		method="POST"
		use:enhance={() => {
			return async ({ update }) => {
				await update({ reset: false });
			};
		}}
		class="space-y-6"
	>
		<section class="theme-card border border-slate-200/80 bg-white/90 p-6 backdrop-blur-sm">
			<h2 class="mb-4 text-lg font-semibold text-slate-900">Web name</h2>
			<input
				type="text"
				name="webName"
				value={data.settings.webName}
				placeholder="Site name in header"
				class="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-[--color-primary] focus:ring-2 focus:ring-[--color-primary]/30"
			/>
		</section>

		<section class="theme-card border border-slate-200/80 bg-white/90 p-6 backdrop-blur-sm">
			<h2 class="mb-4 text-lg font-semibold text-slate-900">Hero</h2>
			<div class="space-y-4">
				<div>
					<label for="heroTitle" class="mb-1 block text-sm font-medium text-slate-700"
						>Display name</label
					>
					<input
						id="heroTitle"
						type="text"
						name="heroTitle"
						value={data.settings.hero.title}
						class="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-[--color-primary] focus:ring-2 focus:ring-[--color-primary]/30"
					/>
				</div>
				<div>
					<label for="heroDescription" class="mb-1 block text-sm font-medium text-slate-700"
						>Short description</label
					>
					<textarea
						id="heroDescription"
						name="heroDescription"
						rows="2"
						bind:value={heroDescription}
						class="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-[--color-primary] focus:ring-2 focus:ring-[--color-primary]/30"
					></textarea>
				</div>
				<div>
					<label for="heroCoverImageUrl" class="mb-1 block text-sm font-medium text-slate-700"
						>Cover image URL</label
					>
					<input
						id="heroCoverImageUrl"
						type="text"
						name="heroCoverImageUrl"
						value={data.settings.hero.coverImageUrl?.trim() ||
							data.settings.hero.imageUrl?.trim() ||
							''}
						placeholder="Wide banner image"
						class="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-[--color-primary] focus:ring-2 focus:ring-[--color-primary]/30"
					/>
				</div>
				<div>
					<label for="heroProfileImageUrl" class="mb-1 block text-sm font-medium text-slate-700"
						>Profile image URL</label
					>
					<input
						id="heroProfileImageUrl"
						type="text"
						name="heroProfileImageUrl"
						value={data.settings.hero.profileImageUrl ?? ''}
						placeholder="Circular avatar"
						class="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-[--color-primary] focus:ring-2 focus:ring-[--color-primary]/30"
					/>
				</div>
				<div class="grid gap-4 sm:grid-cols-2">
					<div>
						<label for="ctaLabel" class="mb-1 block text-sm font-medium text-slate-700"
							>CTA label</label
						>
						<input
							id="ctaLabel"
							type="text"
							name="ctaLabel"
							value={data.settings.hero.ctaLabel ?? ''}
							class="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-[--color-primary] focus:ring-2 focus:ring-[--color-primary]/30"
						/>
					</div>
					<div>
						<label for="ctaHref" class="mb-1 block text-sm font-medium text-slate-700"
							>CTA link</label
						>
						<input
							id="ctaHref"
							type="text"
							name="ctaHref"
							value={data.settings.hero.ctaHref ?? ''}
							class="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-[--color-primary] focus:ring-2 focus:ring-[--color-primary]/30"
						/>
					</div>
				</div>
			</div>
		</section>

		<section class="theme-card border border-slate-200/80 bg-white/90 p-6 backdrop-blur-sm">
			<h2 class="mb-4 text-lg font-semibold text-slate-900">Theme</h2>
			<div class="space-y-4">
				<div>
					<label for="background" class="mb-1 block text-sm font-medium text-slate-700"
						>Background</label
					>
					<input
						type="text"
						name="background"
						value={data.settings.background}
						class="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-[--color-primary] focus:ring-2 focus:ring-[--color-primary]/30"
					/>
				</div>
				<div>
					<label for="fontFamily" class="mb-1 block text-sm font-medium text-slate-700">Font</label>
					<select
						name="fontFamily"
						class="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-[--color-primary] focus:ring-2 focus:ring-[--color-primary]/30"
					>
						{#each fonts as f (f.value)}
							<option value={f.value} selected={f.value === data.settings.fontFamily}
								>{f.label}</option
							>
						{/each}
					</select>
				</div>
				<div class="grid gap-4 sm:grid-cols-2">
					<div>
						<label for="colorPrimary" class="mb-1 block text-sm font-medium text-slate-700"
							>Primary</label
						>
						<input
							type="text"
							name="colorPrimary"
							value={data.settings.colorScheme.primary}
							class="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-[--color-primary] focus:ring-2 focus:ring-[--color-primary]/30"
						/>
					</div>
					<div>
						<label for="colorSecondary" class="mb-1 block text-sm font-medium text-slate-700"
							>Secondary</label
						>
						<input
							type="text"
							name="colorSecondary"
							value={data.settings.colorScheme.secondary}
							class="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-[--color-primary] focus:ring-2 focus:ring-[--color-primary]/30"
						/>
					</div>
				</div>
			</div>
		</section>

		<button
			type="submit"
			class="theme-btn theme-bg-primary rounded-xl px-6 py-3 font-semibold text-white"
			>Save settings</button
		>

		{#if form?.success}
			<p class="text-sm text-emerald-600">Saved.</p>
		{/if}
	</form>
</div>
