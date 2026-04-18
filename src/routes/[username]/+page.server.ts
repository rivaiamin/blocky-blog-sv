import { getPublishedPostsForAuthor } from '$lib/server/posts.service';
import { getFollowSummary } from '$lib/server/social.service';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const { tenantUser, user } = await parent();
	if (!tenantUser.username) throw error(404, 'Not found');
	const [posts, follow] = await Promise.all([
		getPublishedPostsForAuthor(tenantUser.id),
		getFollowSummary(tenantUser.id, user?.id)
	]);
	return { posts, follow };
};
