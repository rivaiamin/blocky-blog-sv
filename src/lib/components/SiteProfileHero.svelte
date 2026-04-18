<script lang="ts">
	import { type SiteHeroDisplay, effectiveCoverImageUrl, initialsFromTitle } from '$lib/site-hero';

	let { hero, onCtaClick } = $props<{
		hero: SiteHeroDisplay;
		onCtaClick: () => void;
	}>();

	const coverUrl = $derived(effectiveCoverImageUrl(hero));
	const profileUrl = $derived(hero.profileImageUrl?.trim() ?? '');
	const initials = $derived(initialsFromTitle(hero.title));
</script>

<section class="mb-16" aria-labelledby="site-hero-title">
	<div
		class="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/60"
	>
		<div class="relative h-48 shrink-0 overflow-hidden sm:h-52">
			{#if coverUrl}
				<img
					src={coverUrl}
					alt=""
					class="absolute inset-0 h-full w-full object-cover object-center"
				/>
			{:else}
				<div
					class="absolute inset-0"
					style="background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%); opacity: 0.92;"
					aria-hidden="true"
				></div>
			{/if}
		</div>

		<div class="relative bg-white px-4 pt-0 pb-8 text-center sm:px-8">
			<div class="-mt-[3px] mb-4 flex justify-center">
				<div
					class="-mt-[100px] -mb-[100px] flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200 shadow-lg ring-4 ring-white"
				>
					{#if profileUrl}
						<img
							src={profileUrl}
							alt={hero.title ? `Profile photo for ${hero.title}` : 'Profile photo'}
							class="h-full w-full object-cover object-center"
						/>
					{:else}
						<span class="text-xl font-semibold tracking-tight text-slate-600" aria-hidden="true"
							>{initials}</span
						>
					{/if}
				</div>
			</div>

			<h1
				id="site-hero-title"
				class="theme-text-primary mb-0 text-2xl font-bold tracking-tight sm:text-3xl"
			>
				{hero.title}
			</h1>
			<p class="theme-text-secondary mx-auto mb-6 max-w-2xl text-base leading-relaxed sm:text-lg">
				{hero.description}
			</p>
			{#if hero.ctaLabel?.trim()}
				<button
					type="button"
					class="theme-btn theme-bg-secondary inline-flex min-h-11 items-center justify-center rounded-full px-8 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-95"
					onclick={onCtaClick}
				>
					{hero.ctaLabel}
				</button>
			{/if}
		</div>
	</div>
</section>
