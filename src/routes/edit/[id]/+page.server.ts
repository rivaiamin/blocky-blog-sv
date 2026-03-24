import { fail, redirect } from '@sveltejs/kit';
import type { PostBlockRow } from '$lib/server/db/schema';
import { getPostByIdForUser, updatePost } from '$lib/server/posts.service';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const post = await getPostByIdForUser(params.id, locals.user?.id);
	if (!post) throw redirect(302, '/dashboard');
	return { post };
};

export const actions: Actions = {
	save: async ({ request, locals, params }) => {
		const fd = await request.formData();
		const title = String(fd.get('title') ?? '').trim();
		const excerpt = String(fd.get('excerpt') ?? '').trim();
		const intent = String(fd.get('intent') ?? 'draft');
		const published = intent === 'publish';

		let blocks: PostBlockRow[];
		try {
			blocks = JSON.parse(String(fd.get('blocks') ?? '[]')) as PostBlockRow[];
		} catch {
			return fail(400, { message: 'Invalid blocks JSON' });
		}

		if (!title) return fail(400, { message: 'Title required' });

		await updatePost(params.id, locals.user!.id, {
			title,
			excerpt: excerpt || null,
			published,
			blocks
		});

		return { success: true };
	}
};
