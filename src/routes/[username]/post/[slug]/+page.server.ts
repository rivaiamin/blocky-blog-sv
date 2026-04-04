import { error } from '@sveltejs/kit';
import { getPublishedPostByUsernameAndSlug } from '$lib/server/posts.service';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const post = await getPublishedPostByUsernameAndSlug(params.username, params.slug);
	if (!post) throw error(404, 'Not found');
	return { post };
};
