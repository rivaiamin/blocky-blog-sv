<script lang="ts">
	import PostCoverHero from '$lib/components/PostCoverHero.svelte';
	import SiteProfileHero from '$lib/components/SiteProfileHero.svelte';
	import { resolve } from '$app/paths';

	let { data } = $props();

	const u = $derived(data.tenantUser.username!);

	const hero = $derived(
		data.site?.hero ?? {
			title: 'Welcome to My Blog',
			description: 'Thoughts, stories, and ideas about technology, design, and life.',
			coverImageUrl: '',
			profileImageUrl: '',
			imageUrl: '',
			ctaLabel: '',
			ctaHref: ''
		}
	);

	function ctaClick() {
		const href = hero.ctaHref ?? '';
		if (href.startsWith('http')) window.open(href, '_blank');
		else if (href) window.location.href = href.startsWith('/') ? href : resolve(`/${u}/dashboard`);
	}
</script>

<div class="mx-auto max-w-6xl">
	<SiteProfileHero {hero} onCtaClick={ctaClick} />

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
