import { json, error, type RequestHandler } from '@sveltejs/kit';
import { setFollow } from '$lib/server/social.service';

type Body = {
	followingUserId?: string;
	following?: boolean;
};

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		error(401, 'Unauthorized');
	}

	let body: Body;
	try {
		body = (await request.json()) as Body;
	} catch {
		error(400, 'Invalid JSON');
	}

	const followingUserId = typeof body.followingUserId === 'string' ? body.followingUserId.trim() : '';
	if (typeof body.following !== 'boolean') {
		error(400, 'Missing following');
	}
	const following = body.following;

	if (!followingUserId) {
		error(400, 'Missing followingUserId');
	}

	const result = await setFollow(locals.user.id, followingUserId, following);
	if (!result.ok) {
		error(400, result.error);
	}

	return json({
		ok: true as const,
		total: result.total,
		viewerFollows: result.viewerFollows
	});
};
