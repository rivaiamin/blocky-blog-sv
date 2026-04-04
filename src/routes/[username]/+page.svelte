<script lang="ts">
	import PostCoverHero from '$lib/components/PostCoverHero.svelte';
	import { resolve } from '$app/paths';

	let { data } = $props();

	const u = $derived(data.tenantUser.username!);

	const hero = $derived(
		data.site?.hero ?? {
			title: 'Welcome to My Blog',
			description: 'Thoughts, stories, and ideas about technology, design, and life.',
			imageUrl: '',
			ctaLabel: '',
			ctaHref: ''
		}
	);

	const hasHeroImage = $derived(Boolean(hero.imageUrl?.trim()));

	function ctaClick() {
		const href = hero.ctaHref ?? '';
		if (href.startsWith('http')) window.open(href, '_blank');
		else if (href) window.location.href = href.startsWith('/') ? href : resolve(`/${u}/dashboard`);
	}
</script>

<div class="mx-auto max-w-6xl">
	<section
		class={hasHeroImage
			? 'mb-20 flex min-h-[28rem] flex-col items-center gap-10 lg:flex-row lg:gap-14'
			: 'mb-16 text-center'}
	>
		{#if hasHeroImage}
			<div class="order-1 flex w-full flex-shrink-0 flex-grow-0 justify-center lg:order-1 lg:w-1/3">
				<div class="w-full max-w-lg overflow-hidden lg:aspect-auto">
					<img src={hero.imageUrl} alt="" class="h-full w-full object-cover object-center" />
				</div>
			</div>
		{/if}
		<div
			class={hasHeroImage ? 'order-2 flex w-full flex-col justify-center lg:order-2 lg:w-2/3' : ''}
		>
			<h1
				class={hasHeroImage
					? 'theme-text-primary mb-4 text-4xl leading-tight font-bold lg:text-2xl'
					: 'theme-text-primary mb-6 text-5xl font-bold'}
			>
				{hero.title}
			</h1>
			<p
				class={hasHeroImage
					? 'mb-6 max-w-lg text-lg text-slate-600'
					: 'theme-text-secondary mx-auto mb-6 max-w-2xl text-xl'}
			>
				{hero.description}
			</p>
			<div class="flex flex-wrap items-center gap-3">
				{#if hero.ctaLabel}
					<button
						type="button"
						class="theme-btn theme-bg-secondary rounded-lg px-6 py-3 font-semibold text-white shadow-md"
						onclick={ctaClick}>{hero.ctaLabel}</button
					>
				{/if}
			</div>
		</div>
	</section>

	{#if data.posts.length === 0}
		<div class="py-20 text-center">
			<p class="theme-text-secondary text-lg">No posts published yet.</p>
		</div>
	{:else}
		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.posts as post (post.id)}
				<a
					href={resolve(`/${u}/post/${post.slug}`)}
					class="block cursor-pointer transition-opacity hover:opacity-95"
				>
					<PostCoverHero
						variant="card"
						coverUrl={post.coverImage}
						title={post.title}
						excerpt={post.excerpt}
						meta={`${post.createdAt.toLocaleDateString()} · Read more →`}
						textScrim={post.options?.coverTextScrim ?? false}
					/>
				</a>
			{/each}
		</div>
	{/if}
</div>
