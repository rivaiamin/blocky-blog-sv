<script lang="ts">
	import { resolve } from '$app/paths';

	let { data } = $props();

	const hero = $derived(
		data.site?.hero ?? {
			title: 'Welcome to My Blog',
			description:
				'Thoughts, stories, and ideas about technology, design, and life.',
			imageUrl: '',
			ctaLabel: '',
			ctaHref: ''
		}
	);

	const hasHeroImage = $derived(Boolean(hero.imageUrl?.trim()));

	function ctaClick() {
		const href = hero.ctaHref ?? '';
		if (href.startsWith('http')) window.open(href, '_blank');
		else if (href) window.location.href = '/dashboard';
	}
</script>

<div class="mx-auto max-w-6xl">
	<section
		class={hasHeroImage
			? 'mb-20 grid min-h-[28rem] grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14'
			: 'mb-16 text-center'}
	>
		<div class={hasHeroImage ? 'order-2 lg:order-1' : ''}>
			<h1
				class={hasHeroImage
					? 'theme-text-primary mb-4 text-4xl font-bold leading-tight lg:text-5xl'
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
				{#if hasHeroImage}
					<a
						href={resolve('/dashboard')}
						class="theme-text-primary inline-flex items-center gap-1.5 font-medium hover:opacity-80"
						>Know more <span class="text-amber-400" aria-hidden="true">✦</span></a
					>
				{/if}
			</div>
		</div>
		{#if hasHeroImage}
			<div class="order-1 flex justify-center lg:order-2 lg:justify-end">
				<div class="aspect-[4/3] max-w-lg overflow-hidden lg:aspect-auto lg:min-h-[20rem]">
					<img src={hero.imageUrl} alt="" class="h-full w-full object-cover object-center" />
				</div>
			</div>
		{/if}
	</section>

	{#if data.posts.length === 0}
		<div class="py-20 text-center">
			<p class="theme-text-secondary text-lg">No posts published yet.</p>
		</div>
	{:else}
		<div class="grid gap-6">
			{#each data.posts as post (post.id)}
				<a
					href={resolve(`/post/${post.slug}`)}
					class="theme-card block cursor-pointer border border-slate-200/80 bg-white/90 p-8 backdrop-blur-sm"
				>
					<h2 class="theme-text-primary mb-3 text-2xl font-bold hover:opacity-80 transition-opacity">
						{post.title}
					</h2>
					{#if post.excerpt}
						<p class="mb-4 line-clamp-3 text-slate-600">{post.excerpt}</p>
					{/if}
					<div class="theme-text-secondary flex items-center justify-between text-sm">
						<span>{post.createdAt.toLocaleDateString()}</span>
						<span class="theme-text-primary font-medium hover:opacity-80 transition-opacity"
							>Read more →</span
						>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</div>
