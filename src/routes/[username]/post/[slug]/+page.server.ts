import { error } from '@sveltejs/kit';
import { getPublishedPostByUsernameAndSlug } from '$lib/server/posts.service';
import {
	getCommentCountForPublishedPost,
	getLikeSummary,
	listCommentsForPublishedPost
} from '$lib/server/social.service';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, parent }) => {
	const { user } = await parent();
	const post = await getPublishedPostByUsernameAndSlug(params.username, params.slug);
	if (!post) throw error(404, 'Not found');

	const postId = post.id;
	const [comments, likes, commentCount] = await Promise.all([
		listCommentsForPublishedPost(postId),
		getLikeSummary(postId, user?.id),
		getCommentCountForPublishedPost(postId)
	]);

	return {
		post,
		social: {
			comments,
			likeCount: likes.total,
			viewerHasLiked: likes.viewerHasLiked,
			commentCount,
			tenantUsername: params.username
		}
	};
};
