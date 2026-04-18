import { json, error, type RequestHandler } from '@sveltejs/kit';
import { setLike } from '$lib/server/social.service';

type Body = {
	liked?: boolean;
};

export const POST: RequestHandler = async ({ params, request, locals }) => {
	if (!locals.user) {
		error(401, 'Unauthorized');
	}

	const postId = params.postId;
	if (!postId) {
		error(400, 'Missing post id');
	}

	let body: Body;
	try {
		body = (await request.json()) as Body;
	} catch {
		error(400, 'Invalid JSON');
	}

	if (typeof body.liked !== 'boolean') {
		error(400, 'Missing liked');
	}
	const liked = body.liked;

	const result = await setLike(postId, locals.user.id, liked);
	if (!result.ok) {
		error(400, result.error);
	}

	return json({
		ok: true as const,
		total: result.total,
		viewerHasLiked: result.viewerHasLiked
	});
};
