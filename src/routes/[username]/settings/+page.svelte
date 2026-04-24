<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';

	let { data, form } = $props();

	let heroDescription = $derived(data.settings.hero.description);
	let heroCoverImageUrl = $derived(
		data.settings.hero.coverImageUrl?.trim() || data.settings.hero.imageUrl?.trim() || ''
	);
	let heroProfileImageUrl = $derived(data.settings.hero.profileImageUrl ?? '');

	const editorImageApiUrl = resolve('/api/editor-image');

	let coverFileInput: HTMLInputElement | undefined = $state();
	let profileFileInput: HTMLInputElement | undefined = $state();
	let uploadingCover = $state(false);
	let uploadingProfile = $state(false);
	let uploadCoverError = $state('');
	let uploadProfileError = $state('');

	async function uploadImageToEditorEndpoint(file: File): Promise<string> {
		const body = new FormData();
		body.append('image', file, file.name);
		const res = await fetch(editorImageApiUrl, {
			method: 'POST',
			body,
			credentials: 'include'
		});
		if (!res.ok) {
			throw new Error(res.status === 413 ? 'too_large' : 'upload_failed');
		}
		const resData = (await res.json()) as { success?: number; file?: { url?: string } };
		if (resData.success !== 1 || !resData.file?.url) {
			throw new Error('upload_failed');
		}
		return resData.file.url;
	}

	async function onHeroCoverFileSelected(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		input.value = '';
		if (!file) return;
		uploadingCover = true;
		uploadCoverError = '';
		try {
			heroCoverImageUrl = await uploadImageToEditorEndpoint(file);
		} catch (err) {
			uploadCoverError =
				err instanceof Error && err.message === 'too_large'
					? 'Image too large (max ~12 MB before processing).'
					: 'Upload failed.';
		} finally {
			uploadingCover = false;
		}
	}

	async function onHeroProfileFileSelected(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		input.value = '';
		if (!file) return;
		uploadingProfile = true;
		uploadProfileError = '';
		try {
			heroProfileImageUrl = await uploadImageToEditorEndpoint(file);
		} catch (err) {
			uploadProfileError =
				err instanceof Error && err.message === 'too_large'
					? 'Image too large (max ~12 MB before processing).'
					: 'Upload failed.';
		} finally {
			uploadingProfile = false;
		}
	}

	function normalizeHexColor(input: unknown, fallback: `#${string}`): `#${string}` {
		if (typeof input !== 'string') return fallback;
		const v = input.trim();
		if (/^#[0-9a-fA-F]{6}$/.test(v)) return v as `#${string}`;
		if (/^#[0-9a-fA-F]{3}$/.test(v)) {
			const r = v[1]!;
			const g = v[2]!;
			const b = v[3]!;
			return (`#${r}${r}${g}${g}${b}${b}`) as `#${string}`;
		}
		return fallback;
	}

	let background = $derived(normalizeHexColor(data.settings.background, '#ffffff'));
	let colorPrimary = $derived(normalizeHexColor(data.settings.colorScheme.primary, '#0f172a'));
	let colorSecondary = $derived(normalizeHexColor(data.settings.colorScheme.secondary, '#475569'));

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
				class="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30"
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
						class="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30"
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
						class="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30"
					></textarea>
				</div>
				<div>
					<label for="heroCoverImageUrl" class="mb-1 block text-sm font-medium text-slate-700"
						>Cover image URL</label
					>
					<div class="flex flex-col gap-2 sm:flex-row sm:items-stretch">
						<input
							id="heroCoverImageUrl"
							type="text"
							name="heroCoverImageUrl"
							bind:value={heroCoverImageUrl}
							placeholder="https://… or /uploads/editor/…"
							class="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30"
						/>
						<input
							bind:this={coverFileInput}
							type="file"
							accept="image/*"
							class="sr-only"
							aria-label="Upload hero cover image"
							onchange={onHeroCoverFileSelected}
						/>
						<button
							type="button"
							disabled={uploadingCover}
							class="theme-btn shrink-0 rounded-xl border border-slate-300 bg-white px-4 py-2 font-medium text-slate-800 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
							onclick={() => coverFileInput?.click()}
						>
							{uploadingCover ? 'Uploading…' : 'Upload file'}
						</button>
					</div>
					{#if uploadCoverError}
						<p class="mt-2 text-sm text-red-600" role="alert">{uploadCoverError}</p>
					{/if}
				</div>
				<div>
					<label for="heroProfileImageUrl" class="mb-1 block text-sm font-medium text-slate-700"
						>Profile image URL</label
					>
					<div class="flex flex-col gap-2 sm:flex-row sm:items-stretch">
						<input
							id="heroProfileImageUrl"
							type="text"
							name="heroProfileImageUrl"
							bind:value={heroProfileImageUrl}
							placeholder="https://… or /uploads/editor/…"
							class="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30"
						/>
						<input
							bind:this={profileFileInput}
							type="file"
							accept="image/*"
							class="sr-only"
							aria-label="Upload hero profile image"
							onchange={onHeroProfileFileSelected}
						/>
						<button
							type="button"
							disabled={uploadingProfile}
							class="theme-btn shrink-0 rounded-xl border border-slate-300 bg-white px-4 py-2 font-medium text-slate-800 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
							onclick={() => profileFileInput?.click()}
						>
							{uploadingProfile ? 'Uploading…' : 'Upload file'}
						</button>
					</div>
					{#if uploadProfileError}
						<p class="mt-2 text-sm text-red-600" role="alert">{uploadProfileError}</p>
					{/if}
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
							class="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30"
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
							class="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30"
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
					<div class="flex items-center gap-3">
						<input type="hidden" name="background" value={background} />
						<input
							id="background"
							type="color"
							bind:value={background}
							class="h-11 w-14 cursor-pointer rounded-xl border border-slate-300 bg-transparent p-1 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30"
							aria-label="Background color picker"
						/>
						<input
							type="text"
							inputmode="text"
							autocomplete="off"
							spellcheck={false}
							bind:value={background}
							class="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30"
						/>
					</div>
				</div>
				<div>
					<label for="fontFamily" class="mb-1 block text-sm font-medium text-slate-700">Font</label>
					<select
						name="fontFamily"
						class="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30"
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
						<div class="flex items-center gap-3">
							<input type="hidden" name="colorPrimary" value={colorPrimary} />
							<input
								id="colorPrimary"
								type="color"
								bind:value={colorPrimary}
								class="h-11 w-14 cursor-pointer rounded-xl border border-slate-300 bg-transparent p-1 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30"
								aria-label="Primary color picker"
							/>
							<input
								type="text"
								inputmode="text"
								autocomplete="off"
								spellcheck={false}
								bind:value={colorPrimary}
								class="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30"
							/>
						</div>
					</div>
					<div>
						<label for="colorSecondary" class="mb-1 block text-sm font-medium text-slate-700"
							>Secondary</label
						>
						<div class="flex items-center gap-3">
							<input type="hidden" name="colorSecondary" value={colorSecondary} />
							<input
								id="colorSecondary"
								type="color"
								bind:value={colorSecondary}
								class="h-11 w-14 cursor-pointer rounded-xl border border-slate-300 bg-transparent p-1 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30"
								aria-label="Secondary color picker"
							/>
							<input
								type="text"
								inputmode="text"
								autocomplete="off"
								spellcheck={false}
								bind:value={colorSecondary}
								class="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30"
							/>
						</div>
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
