import { getPublishedPosts } from '$lib/server/posts.service';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const posts = await getPublishedPosts();
	return { posts };
};
