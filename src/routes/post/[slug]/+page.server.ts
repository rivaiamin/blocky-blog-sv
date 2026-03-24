import { error } from '@sveltejs/kit';
import { getPostBySlugPublic } from '$lib/server/posts.service';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const post = await getPostBySlugPublic(params.slug);
	if (!post) throw error(404, 'Not found');
	return { post };
};
