import { getPublishedPostsForAuthor } from '$lib/server/posts.service';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const { tenantUser } = await parent();
	if (!tenantUser.username) throw error(404, 'Not found');
	const posts = await getPublishedPostsForAuthor(tenantUser.id);
	return { posts };
};
