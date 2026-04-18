import { json, error, type RequestHandler } from '@sveltejs/kit';
import { addComment, listCommentsForPublishedPost } from '$lib/server/social.service';

type Body = {
	body?: string;
};

export const POST: RequestHandler = async ({ params, request, locals }) => {
	if (!locals.user) {
		error(401, 'Unauthorized');
	}

	const postId = params.postId;
	if (!postId) {
		error(400, 'Missing post id');
	}

	let payload: Body;
	try {
		payload = (await request.json()) as Body;
	} catch {
		error(400, 'Invalid JSON');
	}

	const raw = typeof payload.body === 'string' ? payload.body : '';

	const result = await addComment(postId, locals.user.id, raw);
	if (!result.ok) {
		error(400, result.error);
	}

	const comments = await listCommentsForPublishedPost(postId);

	return json({
		ok: true as const,
		comments
	});
};
