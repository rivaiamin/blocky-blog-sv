<script lang="ts">
	import AuthorFollowBar from '$lib/components/AuthorFollowBar.svelte';
	import { type SiteHeroDisplay, effectiveCoverImageUrl, initialsFromTitle } from '$lib/site-hero';

	let {
		hero,
		onCtaClick,
		followingUserId,
		followerCount,
		viewerFollows,
		viewer,
		isOwner
	} = $props<{
		hero: SiteHeroDisplay;
		onCtaClick: () => void;
		followingUserId: string;
		followerCount: number;
		viewerFollows: boolean;
		viewer: { id: string } | null;
		isOwner: boolean;
	}>();

	const coverUrl = $derived(effectiveCoverImageUrl(hero));
	const profileUrl = $derived(hero.profileImageUrl?.trim() ?? '');
	const initials = $derived(initialsFromTitle(hero.title));
</script>

<section class="mb-16" aria-labelledby="site-hero-title">
	<div
		class="relative isolate overflow-hidden rounded-3xl border border-slate-200/70 bg-white/85 shadow-2xl shadow-slate-200/60 backdrop-blur supports-backdrop-filter:bg-white/70"
	>
		<div class="relative h-48 shrink-0 overflow-hidden sm:h-52">
			{#if coverUrl}
				<img
					src={coverUrl}
					alt=""
					class="absolute inset-0 h-full w-full object-cover object-center"
				/>
				<div
					class="absolute inset-0 bg-linear-to-br from-black/15 via-black/10 to-black/0"
					aria-hidden="true"
				></div>
			{:else}
				<div
					class="absolute inset-0"
					style="background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%); opacity: 0.92;"
					aria-hidden="true"
				></div>
			{/if}
			<div
				class="pointer-events-none absolute inset-0 opacity-[0.22]"
				style="background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.55) 1px, transparent 0); background-size: 18px 18px;"
				aria-hidden="true"
			></div>
		</div>

		<div class="relative px-4 pt-0 pb-8 sm:px-8">
			<div class="-mt-[3px]">
				<div class="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-end sm:gap-6 sm:text-left">
					<div class="-mt-[92px] shrink-0">
						<div
							class="relative grid h-28 w-28 place-items-center rounded-full"
							aria-hidden="true"
						>
							<div
								class="absolute -inset-2 rounded-full bg-linear-to-br from-(--color-primary)/40 via-white/35 to-(--color-secondary)/40 blur-md"
							></div>
							<div
								class="absolute -inset-1 rounded-full bg-white/85 ring-1 ring-slate-200/70"
							></div>
						</div>
						<div
							class="relative -mt-28 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-slate-200 shadow-xl ring-4 ring-white"
						>
							{#if profileUrl}
								<img
									src={profileUrl}
									alt={hero.title ? `Profile photo for ${hero.title}` : 'Profile photo'}
									class="h-full w-full object-cover object-center"
								/>
							{:else}
								<span class="text-xl font-semibold tracking-tight text-slate-700" aria-hidden="true"
									>{initials}</span
								>
							{/if}
						</div>
					</div>

					<div class="min-w-0 flex-1">
						<h1
							id="site-hero-title"
							class="theme-text-primary mb-1 text-2xl font-bold tracking-tight sm:text-3xl"
						>
							{hero.title}
						</h1>
						<p
							class="theme-text-secondary mx-auto max-w-2xl text-base leading-relaxed sm:mx-0 sm:text-lg"
						>
							{hero.description}
						</p>
					</div>

					{#if hero.ctaLabel?.trim()}
						<div class="pt-1 sm:pt-0">
							<button
								type="button"
								class="theme-btn inline-flex min-h-11 items-center justify-center rounded-full bg-linear-to-r from-(--color-primary) to-(--color-secondary) px-8 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-px hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/10"
								onclick={onCtaClick}
							>
								{hero.ctaLabel}
							</button>
						</div>
					{/if}
				</div>
			</div>
		</div>
		<AuthorFollowBar
			{followingUserId}
			{followerCount}
			{viewerFollows}
			{viewer}
			{isOwner}
		/>
	</div>
</section>

